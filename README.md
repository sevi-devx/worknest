# WorkNest

A web-based **Employee Management System** for HR teams. WorkNest brings employee records, departments, attendance, and payroll together in a single dashboard, backed by a Node.js/Express API and a MySQL database.

**Live demo:** [WorkNest](https://worknest-tan.vercel.app)

---

## Features

- **Dashboard**: at-a-glance HR summary with total employees, active departments, daily presence, and pending leave requests, plus weekly attendance trends and department headcount charts
- **Employee Directory**: view, add, and manage employee profiles, roles, departments, status, and join dates
- **Departments**: organizational structure with department heads and team sizes
- **Attendance Tracking**: daily check-in/check-out logs with on-time and late status
- **Payroll Management**: base salary, bonuses, deductions, net pay, and payment status
- **Settings**: company information and security options such as two-factor authentication

## Tech Stack

| Layer     | Technology                         |
| --------- | ---------------------------------- |
| Frontend  | HTML, CSS, JavaScript (`public/`)  |
| Backend   | Node.js, Express 5                 |
| Database  | MySQL (`mysql` / `mysql2` drivers) |
| Utilities | `cors`, `dotenv`                   |
| Hosting   | Vercel                             |

## Project Structure

```
worknest/
├── public/            # Static frontend (UI, assets)
├── server.js          # Express server and API entry point
├── package.json
├── package-lock.json
└── .gitignore
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- [MySQL](https://www.mysql.com/) server (local or hosted)
- npm

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yellowDucky01/worknest.git
   cd worknest
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the project root. Adjust the variable names to match what `server.js` reads:

   ```env
   DB_HOST=localhost
   DB_USER=your_mysql_user
   DB_PASSWORD=your_mysql_password
   DB_NAME=worknest
   PORT=3000
   ```

4. **Set up the database**

   Create a MySQL database and the tables the app needs (employees, departments, attendance, payroll):

   ```sql
   CREATE DATABASE worknest;
   ```

5. **Start the server**

   ```bash
   node server.js
   ```

6. **Open the app** at [http://localhost:3000](http://localhost:3000)

## Usage

Once running, use the sidebar to move between sections:

1. **Dashboard** for the overall HR summary
2. **Employees** to browse the directory or click *Add New Employee*
3. **Departments** to review teams or click *Add Department*
4. **Attendance** to review daily check-ins and check-outs
5. **Payroll** to review salaries and process payroll
6. **Settings** to update company details and security options


## License

This project is licensed under the ISC License.

## Author

Built by [@yellowDucky01](https://github.com/yellowDucky01)
