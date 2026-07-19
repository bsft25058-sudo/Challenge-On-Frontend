// ======================================
// CHECK ADMIN LOGIN
// ======================================

function checkAdmin() {

    const isAdmin = localStorage.getItem("isAdmin");

    if (isAdmin !== "true") {

        alert("Admin Login Required!");

        window.location.href = "adminlogin.html";

    }

}


// ======================================
// REGISTER USER
// ======================================

const registerForm = document.getElementById("myRegisterationforms");

if (registerForm) {

    registerForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const username = document.getElementById("username").value.trim();

        const email = document.getElementById("email").value.trim();

        const password = document.getElementById("password").value;

        const confirmPassword = document.getElementById("confirmPassword").value;


        // Password Match Check
        if (password !== confirmPassword) {

            alert("Passwords do not match!");

            return;

        }

        try {

           const response = await fetch("https://challenge-on-backend-production.up.railway.app/api/register", {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    username,
                    email,
                    password

                })

            });

            const data = await response.json();

            alert(data.message);

            if (data.success) {

                window.location.href = "login.html";

            }

        }

        catch (error) {

            console.log(error);

            alert("Server Error!");

        }

    });

}
// ======================================
// LOGIN USER
// ======================================

const loginForm = document.getElementById("myLoginforms");

if (loginForm) {

    loginForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const email = document.getElementById("registeredEmail").value.trim();

        const password = document.getElementById("registeredPassword").value;

        try {

           const response = await fetch("https://challenge-on-backend-production.up.railway.app/api/login", {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    email,
                    password

                })

            });

            const data = await response.json();

            alert(data.message);

            if (data.success) {

                // Save logged-in user
                localStorage.setItem("currentUser", JSON.stringify(data.user));

                window.location.href = "dashboard.html";

            }

        }

        catch (error) {

            console.log(error);

            alert("Server Error!");

        }

    });

}
// ======================================
// CHECK LOGIN
// ======================================

function checkLogin() {

    const currentUser = localStorage.getItem("currentUser");

    if (!currentUser) {

        alert("Please login first!");

        window.location.href = "login.html";

    }

}
// ======================================
// LOGOUT
// ======================================

function logout() {

    localStorage.removeItem("currentUser");

    alert("Logged Out Successfully!");

    window.location.href = "login.html";

}
// ======================================
// TEAM REGISTRATION (MongoDB)
// ======================================

const teamForm = document.getElementById("teamRegistrationForm");

if (teamForm) {

    teamForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        // Logged-in user
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));

        if (!currentUser) {

            alert("Please login first!");

            window.location.href = "login.html";

            return;

        }

        const teamData = {

            email: currentUser.email,

            teamName: document.getElementById("teamName").value,

            teamLogo: "",

            captainName: document.getElementById("captainName").value,

            captainUID: document.getElementById("captainUID").value,

            captainPhone: document.getElementById("captainPhone").value,

            player2Name: document.getElementById("player2Name").value,

            player2UID: document.getElementById("player2UID").value,

            player3Name: document.getElementById("player3Name").value,

            player3UID: document.getElementById("player3UID").value,

            player4Name: document.getElementById("player4Name").value,

            player4UID: document.getElementById("player4UID").value

        };

        try {

            const response = await fetch("https://challenge-on-backend-production.up.railway.app/api/team/create", {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify(teamData)

            });

            const data = await response.json();

            alert(data.message);

            if (data.success) {

                teamForm.reset();

                window.location.href = "myteam.html";

            }

        }

        catch (error) {

            console.log(error);

            alert("Server Error!");

        }

    });

}
// ======================================
// SHOW MY TEAM FROM MONGODB
// ======================================

async function showMyTeam() {

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser) return;

    try {

        const response = await fetch(`https://challenge-on-backend-production.up.railway.app/api/team/${currentUser.email}`);

        const data = await response.json();

        const card = document.getElementById("myTeamCard");

        if (!card) return;

        if (data.success) {

            const team = data.team;

            card.innerHTML = `

                <div class="team-card">

                    <h2>${team.teamName}</h2>

                    <hr>

                    <p><strong>Captain:</strong> ${team.captainName}</p>

                    <p><strong>Captain UID:</strong> ${team.captainUID}</p>

                    <p><strong>Phone:</strong> ${team.captainPhone}</p>

                    <hr>

                    <p><strong>Player 2:</strong> ${team.player2Name}</p>

                    <p><strong>UID:</strong> ${team.player2UID}</p>

                    <p><strong>Player 3:</strong> ${team.player3Name}</p>

                    <p><strong>UID:</strong> ${team.player3UID}</p>

                    <p><strong>Player 4:</strong> ${team.player4Name}</p>

                    <p><strong>UID:</strong> ${team.player4UID}</p>

                    <hr>

                    <p style="color:green; font-weight:bold;">

                        Status : ${team.status}

                    </p>

                </div>

            `;

        }

        else {

            card.innerHTML = `

                <h2>No Team Registered</h2>

                <p>You haven't registered any team.</p>

            `;

        }

    }

    catch (error) {

        console.log(error);

    }

}
// ======================================
// SHOW ALL REGISTERED TEAMS
// ======================================

async function showAllTeams() {

    try {

       const response = await fetch("https://challenge-on-backend-production.up.railway.app/api/teams");

        const data = await response.json();

        const table = document.getElementById("teamTable");
        const total = document.getElementById("totalTeams");

        if (!table) return;

        table.innerHTML = "";

        if (!data.success || data.teams.length === 0) {

            total.innerHTML = "Registered Teams : 0 / 30";

            table.innerHTML = `
                <tr>
                    <td colspan="4">No Teams Registered Yet</td>
                </tr>
            `;

            return;

        }

        total.innerHTML = `Registered Teams : ${data.teams.length} / 30`;

        data.teams.forEach((team, index) => {

            table.innerHTML += `

                <tr>

                    <td>${index + 1}</td>

                    <td>
                        ${team.teamLogo
                            ? `<img src="${team.teamLogo}" width="60">`
                            : "No Logo"}
                    </td>

                    <td>${team.teamName}</td>

                    <td>${team.status}</td>

                </tr>

            `;

        });

    }

    catch (error) {

        console.log(error);

    }

}
// ======================================
// SHOW TOURNAMENT STATS
// ======================================

async function showTeamCount() {

    try {

        const response = await fetch("https://challenge-on-backend-production.up.railway.app/api/stats");
        const data = await response.json();

        const count = document.getElementById("teamCount");

        if (count) {

            count.innerHTML =
                `${data.totalTeams} / 30 (Remaining: ${data.remainingSlots})`;

        }

    }

    catch (error) {

        console.log(error);

    }

}
// ======================================
// ADMIN LOGIN
// ======================================

const adminLoginForm = document.getElementById("adminLoginForm");

if (adminLoginForm) {

    adminLoginForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const email = document.getElementById("adminEmail").value;
        const password = document.getElementById("adminPassword").value;

        try {

           const response = await fetch("https://challenge-on-backend-production.up.railway.app/api/admin/login", {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    email,
                    password

                })

            });

            const data = await response.json();

            alert(data.message);

            if (data.success) {
            
                localStorage.setItem("adminLoggedIn", "true");
                
                document.getElementById("loginSection").style.display = "none";
                
                document.getElementById("adminPanel").style.display = "block";
                
                adminShowTeams();
            }

        }

        catch (error) {

            console.log(error);

            alert("Server Error!");

        }

    });

}
// ======================================
// ADMIN SHOW ALL TEAMS
// ======================================

async function adminShowTeams() {

    try {

       const response = await fetch("https://challenge-on-backend-production.up.railway.app/api/admin/teams");

        const data = await response.json();

        const table = document.getElementById("adminTable");

        const stats = document.getElementById("stats");

        if (!table) return;

        stats.innerHTML = `Total Teams : ${data.teams.length}`;

        table.innerHTML = "";

        data.teams.forEach((team, index) => {

            table.innerHTML += `

            <tr>

                <td>${index + 1}</td>

                <td>${team.teamName}</td>

                <td>${team.captainName}</td>

                <td>${team.email}</td>

                <td>${team.status}</td>

                <td>
                    <button onclick="deleteTeam('${team._id}')">
                        Delete
                    </button>
                </td>

            </tr>

            `;

        });

    }

    catch (error) {

        console.log(error);

    }

}
// ======================================
// DELETE TEAM
// ======================================

async function deleteTeam(id) {

    const confirmDelete = confirm("Are you sure you want to delete this team?");

    if (!confirmDelete) {

        return;

    }

    try {

       const response = await fetch(`https://challenge-on-backend-production.up.railway.app/api/admin/team/${id}`, {

            method: "DELETE"

        });

        const data = await response.json();

        alert(data.message);

        // Refresh the team list
        adminShowTeams();

    }

    catch (error) {

        console.log(error);

        alert("Something went wrong!");

    }

}
// ======================================
// CHECK ADMIN
// ======================================

function checkAdmin() {

    const admin = localStorage.getItem("adminLoggedIn");

    if (admin === "true") {

        document.getElementById("loginSection").style.display = "none";

        document.getElementById("adminPanel").style.display = "block";

        adminShowTeams();

    }

}
// ======================================
// ADMIN LOGOUT
// ======================================

function adminLogout() {

    localStorage.removeItem("adminLoggedIn");

    location.reload();

}