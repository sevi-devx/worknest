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

// GET Employees
app.get("/api/employees/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await db.query(
            `SELECT
                e.id,
                e.name,
                e.role,
                d.name AS department,
                e.status,
                DATE_FORMAT(e.join_date, '%b %d, %Y') AS joinDate
            FROM employees e
            LEFT JOIN departments d ON e.department_id = d.id
            WHERE e.id = ?`,
            [id],
        );

        if (!rows.length === 0) {
            return res.status(404).json({ message: "Employee not found" });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error("Failed to load employees:", error);
        res.status(500).json({ message: "Server error" });
    }
});

app.get("/api/employees", async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT
                e.id,
                e.name,
                e.role,
                d.name AS department,
                e.status,
                DATE_FORMAT(e.join_date, '%b %d, %Y') AS joinDate
            FROM employees e
            LEFT JOIN departments d ON e.department_id = d.id WHERE e.id`,
        );

        if (!rows.length === 0) {
            return res.status(404).json({ message: "Employee not found" });
        }

        res.json(rows);
    } catch (error) {
        console.error("Failed to load employees:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// POST Employees
app.post("/api/employees", async (req, res) => {
    console.log("WORKNEST POST ROUTE REACHED");

    // Keep the rest of your existing code here
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
    await notifyEmployeesChanged();
    return res.status(200).json({
        message: "Employee Added!",
    });
});

// DELETE Employees
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
        await notifyEmployeesChanged();
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

// PATCH Employees
app.patch("/api/employees/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, role, department, status, joinDate } = req.body ?? {};
        const formattedDate = new Date(joinDate).toLocaleDateString("sv-SE");

        if (!name || !role || !department || !joinDate) {
            return res.status(400).json({
                message: "Please fill in all required fields.",
            });
        }

        console.log({
            name,
            role,
            department,
            status,
            joinDate,
        });

        const [deptRows] = await db.query(
            "SELECT id FROM departments WHERE name = ?",
            [department],
        );
        if (deptRows.length === 0) {
            return res.status(400).json({ message: "Department not found." });
        }

        const [result] = await db.query(
            `UPDATE employees
             SET name = ?, role = ?, department_id = ?, status = ?, join_date = ?
             WHERE id = ?`,
            [name, role, deptRows[0].id, status || "active", formattedDate, id],
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Employee not found" });
        }

        res.json({ message: "Employee updated!" });
    } catch (error) {
        console.error("Failed to update employee:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// SUPABASE AUTORELOAD

async function notifyEmployeesChanged() {
    const url = `${process.env.SUPABASE_URL}/realtime/v1/api/broadcast/worknest/events/employees-changed`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                apikey: process.env.SUPABASE_SECRET_KEY,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: "Employee data changed",
            }),
        });

        const contentType = response.headers.get("content-type") || "";
        const responseText = await response.text();

        console.log("Broadcast URL:", url);
        console.log("Broadcast HTTP status:", response.status);
        console.log("Broadcast content type:", contentType);

        if (!response.ok || !contentType.includes("application/json")) {
            console.error("Broadcast failed:", responseText.slice(0, 500));
            return;
        }

        console.log("Broadcast request accepted.");
    } catch (error) {
        console.error("Broadcast request error:", error);
    }
}

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}

module.exports = app;
