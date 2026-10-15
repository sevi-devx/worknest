const tabPanels = document.querySelectorAll(".tab-panel");
const menuItems = document.querySelectorAll(".menu-item");

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

// Add New Employee Modal Overlay
const employeeModalBtn = document.querySelector(".add-new-employee-modal-btn");
let modalOverlay = document.querySelector(".employee-modal");

function closeModalOverlay() {
    modalOverlay.classList.remove("active");
}

employeeModalBtn.addEventListener("click", () => {
    let cancelBtn = document.querySelector("#employee-cancel-modal-btn");
    let closeBtn = document.querySelector("#employee-close-modal-btn");

    modalOverlay.classList.add("active");

    closeBtn.addEventListener("click", () => {
        modalOverlay.classList.remove("active");
    });

    cancelBtn.addEventListener("click", () => {
        modalOverlay.classList.remove("active");
    });
});

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

// Add and save employee
async function addNewEmployee() {
    try {
        console.log("pressed add new employee");
        const name = document.getElementById("add-new-employee-name").value;
        const role = document.getElementById("add-new-employee-role").value;
        const department = document.getElementById(
            "add-new-employee-department",
        ).value;
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

        closeModalOverlay();
        await loadEmployees();
    } catch (error) {
        console.error("Failed to add employee:", error);
    }
}

// Add Department Overlay
const departmentModalBtn = document.querySelector(".add-department-modal-btn");

departmentModalBtn.addEventListener("click", () => {
    let modalOverlay = document.querySelector(".department-modal");
    let cancelBtn = document.querySelector("#department-cancel-modal-btn");
    let closeBtn = document.querySelector("#department-close-modal-btn");

    modalOverlay.classList.add("active");
    closeBtn.addEventListener("click", () => {
        modalOverlay.classList.remove("active");
    });

    cancelBtn.addEventListener("click", () => {
        modalOverlay.classList.remove("active");
    });
});

const clock = document.getElementById("clock");

function currentDate() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function updateClock() {
    const now = new Date();
    const hour = now.getHours() % 12;
    clock.textContent = hour + ":" + now.getMinutes();
}

setInterval(updateClock, 1000);

// REST API

const API_URL = "/api/employees";
const tbody = document.getElementById("employee-table-body");

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

function makeRow(emp) {
    let badgeClass = "badge-inactive";
    if (emp.status === "Active") {
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
          <button class="btn-action edit edit-modal-btn" title="Edit"
                  onclick="editEmployee(${emp.id})">
            <i class="fa-regular fa-pen-to-square"></i>
          </button>
          <button class="btn-action delete" title="Delete"
                  onclick="deleteEmployee(${emp.id})">
            <i class="fa-regular fa-trash-can"></i>
          </button>
        </div>
      </td>
    </tr>
  `;
}

loadEmployees();

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
