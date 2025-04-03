document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");

    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            const response = await fetch("http://localhost:5000/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem("token", data.token);
                alert("Login successful!");
                const lastPage = localStorage.getItem("lastPage") || "index.html";
                window.location.href = lastPage;
            } else {
                alert(data.message);
            }
        });


        // Store last accessed page before login
        window.onload = function () {
            if (!window.location.href.includes("login.html") && !window.location.href.includes("register.html")) {
                localStorage.setItem("lastPage", window.location.href);
            }
        };
    }

    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const name = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            const response = await fetch("http://localhost:5000/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();
            if (response.ok) {
                alert("Registration successful! Please log in.");
                window.location.href = "login.html";
            } else {
                alert(data.message);
            }
        });
    }
});
