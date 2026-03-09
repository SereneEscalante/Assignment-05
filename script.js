const API_BASE = "https://phi-lab-server.vercel.app/api/v1/lab/issues";
let allIssues = [];

const loginPage = document.getElementById("login-page");
const dashboard = document.getElementById("dashboard");
const loginForm = document.getElementById("login-form");

const issuesGrid = document.getElementById("issues-grid");
const loader = document.getElementById("loader");
const issueCountText = document.getElementById("issue-count");

const searchInput = document.getElementById("search-input");

const modal = document.getElementById("modal");
const modalContent = document.getElementById("modal-content");


// login
loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const user = document.getElementById("username").value.trim();
    const pass = document.getElementById("password").value.trim();

    if(user === "admin" && pass === "admin123") {
        loginPage.classList.add("hidden");
        dashboard.classList.remove("hidden");

        fetchIssues();
    } else {
        alert("Wrong Credentials");
    }
});


//fetching the issues
async function fetchIssues() {
    toggleLoader(true);

    try {
        const res = await fetch(`${API_BASE}/issues`);
        const data = await res.json();

        allIssues = data.data;

        renderIssues(allIssues);
    } catch (error) {
        console.error("Fetch error:", error);

        issuesGrid.innerHTML =
        `<p class="text-red-500 text-center col-span-full">
        Failed to load issues</p>`
    } finally {
        toggleLoader(false);
    }
}

//render issue cards