const token = localStorage.getItem("adminToken");
if (!token) window.location.href = "/login.html";

const tabs = document.querySelectorAll(".tab");
const sections = document.querySelectorAll(".tab-content");

tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        sections.forEach(s => s.classList.remove("active"));

        tab.classList.add("active");
        document.getElementById(tab.dataset.tab).classList.add("active");
    });
});

document.getElementById("toggleTheme").addEventListener("click", () => {
    document.body.classList.toggle("dark");
});

document.getElementById("logout").addEventListener("click", () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/login.html";
});

async function fetchAndRender(endpoint, container, renderer) {
    const res = await fetch(`/api/admin/${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    container.innerHTML = "";
    data.forEach(renderer);
}

// BOOKS
const bookList = document.getElementById("bookList");

function renderBook(book) {
    const div = document.createElement("div");
    div.innerHTML = `
    <p><strong>${book.title}</strong> by ${book.author} - $${book.price}</p>
    <button onclick="deleteBook('${book._id}')">Delete</button>
  `;
    bookList.appendChild(div);
}

async function deleteBook(id) {
    await fetch(`/api/admin/books/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
    });
    loadBooks();
}

document.getElementById("addBookForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const book = Object.fromEntries(formData);
    await fetch("/api/admin/books", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(book)
    });
    e.target.reset();
    loadBooks();
});

function loadBooks() {
    fetchAndRender("books", bookList, renderBook);
}
loadBooks();

// USERS
const userList = document.getElementById("userList");

function renderUser(user) {
    const div = document.createElement("div");
    div.innerHTML = `<p>${user.name} - ${user.email}</p>`;
    userList.appendChild(div);
}
fetchAndRender("users", userList, renderUser);

// ORDERS
const orderList = document.getElementById("orderList");

function renderOrder(order) {
    const div = document.createElement("div");
    div.innerHTML = `
    <p>Order by ${order.user.name} - Total: $${order.total}</p>
    <select onchange="updateStatus('${order._id}', this.value)">
      <option value="pending" ${order.status === "pending" ? "selected" : ""}>Pending</option>
      <option value="shipped" ${order.status === "shipped" ? "selected" : ""}>Shipped</option>
      <option value="delivered" ${order.status === "delivered" ? "selected" : ""}>Delivered</option>
    </select>
  `;
    orderList.appendChild(div);
}

async function updateStatus(orderId, status) {
    await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
    });
}
fetchAndRender("orders", orderList, renderOrder);
