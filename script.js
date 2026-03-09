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
function renderIssues(issues) {
    issuesGrid.innerHTML="";
    issueCountText.innerText = `${issueCountText.length} Issues`;

    issues.forEach(issue => {
        const topBorder = issue.status === "open" ?
        "border-t-green-500" : "border-t-purple-500";
        const statusImage = issue.status === "open" ? 
        "./assets/Open-Status.png" : "./assets/Closed-Status.png";

        const labelsHTML = issue.labels.map(label => {
            const l = label.toLowerCase();
            let icon = "fa-tag" , colorClasses = "bg-gray-100 text-gray-600 border-red-200";

            if (l.includes('bug')) {
               icon = "fa-bug" , colorClasses = "bg-red-50 text-red-600 border-red-200"; 
            } else if (l.includes('help')) {
                icon = "fa-life-ring" , colorClasses = "bg-orange-50 text-orange-600 border-orange-200";
            } else if (l.includes('documentation')) {
                icon = "fa-book" , colorClasses = "bg-blue-50 text-blue-600 border-blue-200";
            } else if (l.includes('enhancement')) {
                icon = "fa-wand-magic-sparkles" , colorClasses = "bg-green-100 text-green-700 border-green-200";
            }
            return `
            <span class="text-[10px] px-2 py-1 rounded-md font-bold border flex items-center gap-1 ${colorClasses}">
                <i class="fa-solid ${icon}"></i> ${label.toUpperCase()}
            </span>
            `;
        }).join('');

        const pStyle = issue.priority.toLowerCase() === 'high' ?
        'bg-red-100 text-red-600 border-red-200' :
        issue.priority.toLowerCase() === 'medium' ?
        'bg-yellow-100 text-yellow-600 border-yellow-200' :
        'bg-gray-100 text-gray-600 border-gray-200';

        const card = document.createElement("div");
        card.className = `bg-white rounded-xl border-t-4 ${topBorder} border-x border-b p-5 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col`;
        card.onclick = () => openIssueModal(issue.id);

        card.innerHTML = `
        <div class="flex justify-between items-start mb-3">
            <img src="${statusImage}" class="w-6 h-6 object-contain">
            <span class="text-[10px] font-bold uppercase px-2 py-1 rounded border ${pStyle}">${issue.priority}</span>
        </div>
        <h3 class="font-bold text-sm mb-2 line-clamp-2">${issue.title}</h3>
        <p class="text-xs text-gray-500 mb-4 line-clamp-2 flex-grow">${issue.description}</p>
        <div class="flex flex-wrap gap-2 mb-6">${labelsHTML}</div>
        <div class="pt-4 border-t text-[11px] text-gray-400">
            <p>by ${issue.author}</p>
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
async function openIssueModal(id) {}

// close modal
function closeModal() {
    modal.classList.add("hidden");
}

// click outside modal
window.onlick = function (event) {
    if (event.target === modal){
        closeModal();
    }
};

// loader
function toggleLoader (show) {
    loader.classList.toggle("hidden", !show);
    issuesGrid.classList.toggle("hidden", show);
}