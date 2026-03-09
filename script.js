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