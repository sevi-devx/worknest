import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

document.addEventListener("DOMContentLoaded", async () => {
    await loadDepartments();
    await loadEmployees();
});

const supabase = createClient(
    "https://yyrsdeildevgexbueony.supabase.co",
    "sb_publishable_VMFaAijOxAfxW7uxKV-aBg_sRzjlK0b",
);

const menuItems = document.querySelectorAll(".menu-item");
const tabPanels = document.querySelectorAll(".tab-panel");

menuItems.forEach((items) => {
    items.addEventListener("click", (event) => {
        const targetId = event.currentTarget.dataset.tab;

        menuItems.forEach((menu) => menu.classList.remove("active"));
        tabPanels.forEach((panel) => panel.classList.remove("active"));

        event.currentTarget.classList.add("active");
        const activePanel = document.getElementById(targetId);
        if (activePanel) {
            activePanel.classList.add("active");
        }
    });
});

const modalOverlay = document.querySelector(".modal-overlay");
const addOverlay = document.querySelector;

function openModal(mode) {
    const overlay = document.querySelector(
        `.modal-overlay[data-tab="${mode}"]`,
    );
    overlay.classList.add("active");
}

function closeModal() {
    document
        .querySelectorAll(".modal-overlay.active")
        .forEach((overlay) => overlay.classList.remove("active"));
}

const addEmployeeModalBtn = document.querySelector(
    ".add-new-employee-modal-btn",
);

if (addEmployeeModalBtn) {
    addEmployeeModalBtn.addEventListener("click", () => {
        openModal("add-employee");
    });
}

const addDepartmentModalBtn = document.querySelector(
    "#add-department-modal-btn",
);

if (addDepartmentModalBtn) {
    addDepartmentModalBtn.addEventListener("click", () => {
        openModal("add-department");
    });
}

document.addEventListener("click", (event) => {
    const button = event.target.closest(".modal-overlay [data-action]");

    if (!button) return;

    const action = button.dataset.action;
    const mode = button.closest(".modal-overlay").dataset.tab;

    if (action === "close") {
        closeModal("add-employee");
        closeModal("edit");
    } else if (action === "cancel") {
        closeModal("add-employee");
        closeModal("edit");
    } else if (action === "save") {
        if (mode === "add-employee") {
            addNewEmployee();
        } else if (mode === "edit") {
            const id = document.getElementById("edit-employee-id").value;
            editEmployee(id);
        }
        closeModal();
    }
});

async function addNewEmployee() {
    try {
        const name = document.getElementById("add-new-employee-name").value;
        const role = document.getElementById("add-new-employee-role").value;
        const department = document.getElementById(
            "add-new-employee-department",
        ).value;
        document.getElementById("add-new-employee-name").value = "";
        document.getElementById("add-new-employee-role").value = "";

        const status = "inactive";
        const joinDate = currentDate();
        const response = await fetch(`/api/employees`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: name,
                role: role,
                department: department,
                status: status,
                joinDate: joinDate,
            }),
        });
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Failed to add employee");
        }

        await loadEmployees();
    } catch (error) {
        console.error("Failed to add new employee", error);
    }
}

// Edit and save employee Overlay

const tbody = document.getElementById("employee-table-body");

tbody.addEventListener("click", (event) => {
    const button = event.target.closest(".btn-action");

    if (!button) return;

    const id = button.dataset.id;
    const action = button.dataset.action;

    if (action === "delete") {
        deleteEmployee(id);
    } else if (action === "edit") {
        console.log("edit employee pressed");
        getEmployeeDetails(id);
        openModal("edit");
    }
});

//
function toMySqlDate(value) {
    const date = new Date(value);
    return date.toISOString().slice(0, 10);
}

async function getEmployeeDetails(id) {
    try {
        console.log("successfully extracted employee details.");
        const response = await fetch(`/api/employees/${id}`, {
            method: "GET",
        });
        const result = await response.json();

        document.getElementById("edit-employee-id").value = result.id;
        document.getElementById("edit-employee-name").value = result.name;
        document.getElementById("edit-employee-role").value = result.role;
        document.getElementById("edit-employee-department").value =
            result.departmentId;
    } catch (error) {
        console.error("Failed to edit employee");
    }
}

async function editEmployee(id) {
    console.log("saving edit employee");
    const name = document.getElementById("edit-employee-name").value;
    const role = document.getElementById("edit-employee-role").value;
    const department = document.getElementById(
        "edit-employee-department",
    ).value;

    const response = await fetch(`/api/employees/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },

        body: JSON.stringify({
            name: name,
            role: role,
            department: department,
        }),
    });

    const result = await response.json();
    await loadEmployees();
}

// Delete Employee
async function deleteEmployee(id) {
    try {
        const response = await fetch(`/api/employees/${id}`, {
            method: "DELETE",
        });
        const result = await response.json();

        await loadEmployees();
    } catch (error) {
        console.error("Failed to delete employee.");
    }
}

// Select option for departmnets

async function loadDepartments() {
    console.log("loadDepartments() started");
    const selectDepartments = document.querySelectorAll(
        ".departments-employee",
    );
    try {
        const response = await fetch(`/api/departments`, {
            method: "GET",
        });
        const departments = await response.json();

        selectDepartments.forEach((select) => {
            departments.forEach((dep) => {
                const options = document.createElement("option");

                options.value = dep.id;
                options.textContent = dep.name;

                select.appendChild(options);
            });
        });

        console.log(selectDepartments);
    } catch (error) {
        console.error("Failed to load departments", error);
    }
}

async function addDepartment() {
    try {
        const name = document.getElementById("add-new-employee-name").value;
        const role = document.getElementById("add-new-employee-role").value;
        const department = document.getElementById(
            "add-new-employee-department",
        ).value;
        document.getElementById("add-new-employee-name").value = "";
        document.getElementById("add-new-employee-role").value = "";

        const status = "inactive";
        const joinDate = currentDate();
        const response = await fetch(`/api/employees`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: name,
                role: role,
                department: department,
                status: status,
                joinDate: joinDate,
            }),
        });
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Failed to add employee");
        }

        await loadEmployees();
    } catch (error) {
        console.error("Failed to add new employee", error);
    }
}

function currentDate() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function updateClock() {
    const clock = document.getElementById("clock");
    const now = new Date();
    let hour = now.getHours();
    let label = "";

    if (hour === 12) {
        label = "PM";
    } else if (hour >= 13) {
        hour -= 12;
        label = "PM";
    } else if (hour === 0) {
        hour += 12;
        label = "AM";
    } else {
        label = "AM";
    }
    clock.textContent =
        String(hour).padStart(2, "0") +
        ":" +
        String(now.getMinutes()).padStart(2, "0") +
        " " +
        label;
}

setInterval(updateClock, 1000);

// REST API

const API_URL = "/api/employees";

async function loadEmployees() {
    const response = await fetch(API_URL);
    const employees = await response.json();
    const metricTotalEmployees = document.getElementById(
        "metric-total-employees",
    );
    const entriesText = document.querySelector("#entries");

    let rowsHtml = "";

    employees.forEach((emp) => {
        rowsHtml += makeRow(emp);
    });

    tbody.innerHTML = rowsHtml;
    entriesText.innerText = `Showing ${employees.length} entries`;

    metricTotalEmployees.innerText = employees.length;
}

const employeeChannel = supabase
    .channel("worknest")
    .on("broadcast", { event: "employees-changed" }, (payload) => {
        console.log("BROADCAST RECEIVED:", payload);
        loadEmployees();
    })
    .subscribe((status, error) => {
        console.log("Supabase status:", status);

        if (error) {
            console.error("Supabase subscription error:", error);
        }
    });

loadEmployees();

function makeRow(emp) {
    let badgeClass = "badge-inactive";
    if (emp.status === "active") {
        badgeClass = "badge-active";
    } else if (emp.status === "On Leave") {
        badgeClass = "badge-leave";
    }

    const avatar =
        "http://ui-avatars.com/api/?name=" + encodeURIComponent(emp.name);

    return `
    <tr>
      <td>
        <div class="employee-cell">
          <img class="employee-avatar" src="${avatar}" alt="Avatar" />
          <div>
            <span class="employee-name">${emp.name}</span>
            <span class="employee-role">${emp.role}</span>
          </div>
        </div>
      </td>
      <td>${emp.role}</td>
      <td>${emp.department}</td>
      <td>
        <span class="badge ${badgeClass}">
          <span class="badge-dot"></span> ${emp.status}
        </span>
      </td>
      <td>${emp.joinDate}</td>
      <td>
        <div class="actions-cell" style="justify-content: flex-end;">
          <button class="btn-action edit-modal-btn" title="Edit" data-id="${emp.id}" data-action="edit">
            <i class="fa-regular fa-pen-to-square"></i>
          </button>
          <button class="btn-action delete" title="Delete" data-id="${emp.id}" data-action="delete">
            <i class="fa-regular fa-trash-can"></i>
          </button>
        </div>
      </td>
    </tr>
  `;
}

const toggleBtn = document.getElementById("toggle-sidebar");
const sidebar = document.getElementById("sidebar");
const sidebarOverlay = document.querySelector(".sidebar-overlay");

const closeSidebar = () => {
    sidebar.classList.remove("open");
    sidebarOverlay.classList.remove("active");
};

const openSidebar = () => {
    sidebar.classList.add("open");
    sidebarOverlay.classList.add("active");
};

toggleBtn.addEventListener("click", () => {
    if (toggleBtn && sidebar) {
        openSidebar();

        sidebarOverlay.addEventListener("click", () => {
            closeSidebar();
            console.log("sidebarOverlay clicked");
        });
    }
});
