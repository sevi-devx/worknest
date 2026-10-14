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

employeeModalBtn.addEventListener("click", () => {
    let modalOverlay = document.querySelector(".employee-modal");
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

function updateClock() {
    const now = new Date();
    const hour = now.getHours() % 12;
    clock.textContent = hour + ":" + now.getMinutes();
}

setInterval(updateClock, 1000);
