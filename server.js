require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const mysql = require("mysql2/promise");

const app = express();
const PORT = 3000;

const db = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

// GET
app.get("/api/employees", async (req, res) => {
    const [rows] = await db.query(`
        SELECT 
            employees.id,
            employees.name,
            employees.role,
            departments.name AS department,
            CASE employees.status
                WHEN 'active' THEN 'Active'
                WHEN 'inactive' THEN 'Inactive'
                ELSE 'On Leave'
            END AS status,
            DATE_FORMAT(employees.join_date, '%b %d, %Y') AS joinDate
                FROM employees
                LEFT JOIN departments ON departments.id = employees.department_id
                ORDER BY employees.id
    `);

    res.status(200).json(rows);
});

// POST
app.post("/api/employees", async (req, res) => {
    const { name, role, department, status, joinDate } = req.body ?? {};

    if (!name) {
        return res.status(400).json({ message: "We need your name!" });
    }

    await db.query(
        `INSERT INTO employees (name, role, department_id, status, join_date)
        VALUES (?, ?, (SELECT id FROM departments WHERE name = ?), ?, ?)`,
        [name, role, department, status || "active", joinDate],
    );

    return res.status(200).json({
        message: "Employee Added!",
    });
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}

module.exports = app;
