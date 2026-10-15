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

    waitForConnections: true,
    connectionLimit: 2,
    maxIdle: 1,
    idleTimeout: 10000,
    queueLimit: 10,
});

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

// GET
app.get("/api/employees", async (req, res) => {
    try {
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
                DATE_FORMAT(
                    employees.join_date, '%b %d, %Y'
                ) AS joinDate
            FROM employees
            LEFT JOIN departments
                ON departments.id = employees.department_id
            ORDER BY employees.id
        `);

        return res.status(200).json(rows);
    } catch (error) {
        console.error("Failed to fetch employees:", error.message);

        return res.status(500).json({
            message: "Failed to fetch employees.",
        });
    }
});

// POST
app.post("/api/employees", async (req, res) => {
    const { name, role, department, status, joinDate } = req.body ?? {};

    console.log({
        name,
        role,
        department,
        status,
        joinDate,
    });

    if (!name || !role || !department || !joinDate) {
        return res.status(400).json({
            message: "Please fill in all required fields.",
        });
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

// DELETE
app.delete("/api/employees/:id", async (req, res) => {
    const { id } = req.params;

    if (!id || !/^\d+$/.test(id)) {
        return res.status(400).json({
            message: "Invalid employee ID",
        });
    }

    try {
        const [result] = await db.query("DELETE FROM employees WHERE id = ?", [
            id,
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Employee not found",
            });
        }

        return res.status(200).json({
            message: "Employee deleted successfully",
        });
    } catch (error) {
        console.error("Failed to delete employee:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
});

// UPDATE
app.patch("/api/employees", async (req, res) => {});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}

module.exports = app;
