const API_BASE = "https://phi-lab-server.vercel.app/api/v1/lab";
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

function getPriorityStyle(priority) {
    switch (priority.toLowerCase()) {
        case "high":
            return "bg-red-100 text-red-600 border-red-200";
        case "medium":
            return "bg-yellow-100 text-yellow-600 border-yellow-200";
        case "low":
            return "bg-gray-100 text-black-600 border-gray-200";
    }
}


//render issue cards
function renderIssues(issues) {
    issuesGrid.innerHTML="";
    issueCountText.innerText = `${issues.length} Issues`;

    issues.forEach(issue => {
        const topBorder = issue.status === "open" ?
        "border-t-green-500" : "border-t-purple-500";
        const statusImage = issue.status === "open" ? 
        "./assets/Open-Status.png" : "./assets/Closed-Status.png";

        const labelsHTML = issue.labels.map(label => {
            const labelLower = label.toLowerCase();
            let iconClass = "fa-solid fa-tag";
            bgClass = "bg-gray-100 text-gray-600 border-red-200";

            if (labelLower.includes("bug")) {
               iconClass = "fa-solid fa-bug"; 
               bgClass = "bg-red-50 text-red-600 border-red-200"; 
            } else if (labelLower.includes("help")) {
                iconClass = "fa-solid fa-life-ring"; 
                bgClass = "bg-orange-50 text-orange-600 border-orange-200";
            } else if (labelLower.includes("documentation")) {
                iconClass = "fa-solid fa-book"; 
                bgClass = "bg-blue-50 text-blue-600 border-blue-200";
            } else if (labelLower.includes("enhancement")) {
                iconClass = "fa-solid fa-wand-magic-sparkles"; 
                bgClass = "bg-green-100 text-green-700 border-green-200";
            }
            return `
            <span class="text-[10px] px-2 py-1 rounded-md font-bold border flex items-center gap-1 ${bgClass}">
                <i class="fa-solid ${iconClass}"></i> ${label.toUpperCase()}
            </span>
            `;
        }).join("");

        const card = document.createElement("div");

        card.className = `bg-white rounded-xl border-t-4 ${topBorder} border-x border-b p-5 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col`;
        card.onclick = () => openIssueModal(issue.id);


        card.innerHTML = `
        <div class="flex justify-between items-start mb-3">
            <img src="${statusImage}" class="w-6 h-6 object-contain">
            <span class="text-[10px] font-bold uppercase px-2 py-1 rounded border ${getPriorityStyle(issue.priority)}">${issue.priority}</span>
        </div>
        <h3 class="font-bold text-sm mb-2 line-clamp-2">${issue.title}</h3>
        <p class="text-xs text-gray-500 mb-4 line-clamp-2 flex-grow">${issue.description}</p>
        <div class="flex flex-wrap gap-2 mb-6">${labelsHTML}</div>
        <div class="pt-4 border-t text-[11px] text-gray-400">
            <p class="mb-1">by ${issue.author}</p>
            <p>${new Date(issue.createdAt).toLocaleDateString()}</p>    
        </div>
        `;
        issuesGrid.appendChild(card);
    });
}

// filter issues
function filterIssues(status) {

    document
        .querySelectorAll(".tab-btn")
        .forEach(btn => btn.classList.remove("active-tab"));

    document
        .getElementById(`tab-${status}`)
        .classList.add("active-tab")

    if (status === "all") {
        renderIssues(allIssues);
    } else {
        const filtered = allIssues.filter(issue => issue.status === status);
        renderIssues(filtered);
    }
}


// search input
searchInput.addEventListener("input", async (e) => {
    const query = e.target.value.trim();

    if(!query) {
        renderIssues(allIssues);
        return;
    } try {
        const res = await fetch(`${API_BASE}/issues/search?q=${query}`);
        const data = await res.json();
        renderIssues(data.data);
    } catch (error) {
        console.error("Search error:", error);
    }
});

// issue modal
async function openIssueModal(id) {
    modal.classList.remove("hidden");
    modalContent.innerHTML =`
    <div class="text-center py-10">Loading...</div>
    `;

    try {
        const res = await fetch(`${API_BASE}/issue/${id}`);
        const result = await res.json();
        const issue = result.data;

        const labelsHTML = issue.labels.map(label => {
            const labelLower = label.toLowerCase();
            let iconClass = "fa-solid fa-tag";
            let bgClass = "bg-gray-50 text-gray-600 border-gray-100";

            if (labelLower.includes("bug")) {
               iconClass = "fa-solid fa-bug";
               bgClass = "bg-red-50 text-red-600 border-red-200"; 
            } else if (labelLower.includes("help")) {
                iconClass = "fa-solid fa-life-ring";
                bgClass = "bg-orange-50 text-orange-600 border-orange-200";
            } else if (labelLower.includes("documentation")) {
                iconClass = "fa-solid fa-book"; 
                bgClass = "bg-blue-50 text-blue-600 border-blue-200";
            } else if (labelLower.includes("enhancement")) {
                iconClass = "fa-solid fa-wand-magic-sparkles"; 
                bgClass = "bg-green-100 text-green-700 border-green-200";
            }

            return `
            <span class="text-[10px] px-2 py-1 rounded-md font-bold border flex items-center gap-1 ${bgClass}">
                <i class="${iconClass}"></i> 
                ${label.toUpperCase()}
            </span>
            `;
        }).join("");

        modalContent.innerHTML = `
        <h2 class="modal-title font-bold text-lg mb-2">${issue.title}</h2>
        <div class="flex items-center gap-2 mb-4">
            <span class="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold border border-green-200">${issue.status}</span>
            <span class="meta-text text-xs text-gray-400">
            • Opened by ${issue.author}
            • ${new Date(issue.createdAt).toLocaleDateString()}
            </span>
        </div>

        <div class="flex flex-wrap gap-2 mb-4">${labelsHTML}</div>

        <p class="description text-sm text-gray-700 mb-6">${issue.description}</p>
        <div class="info-grid grid grid-cols-2 gap-4 border-t pt-4">
            <div>
               <p class="info-label text-gray-500">Assignee:</p>
               <p class="font-semibold text-sm">${issue.author}</p>
            </div>
            <div>
               <p class="info-label text-gray-500">Priority:</p>
               <span class="priority-badge text-sm">${issue.priority}</span>
            </div>
        </div>
        `;
    } catch (error) {
        console.error("Modal error:", error);
        modalContent.innerHTML = `
        <p class="text-red-500 text-center">Could not load issue</p>
        `
    }
}

// close modal
function closeModal() {
    modal.classList.add("hidden");
}

// click outside modal
window.onclick = function (event) {
    if (event.target === modal){
        closeModal();
    }
};

// loader
function toggleLoader (show) {

    loader.classList.toggle("hidden", !show);
    issuesGrid.classList.toggle("hidden", show);

}