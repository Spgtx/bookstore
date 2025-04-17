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
    try {
        const res = await fetch(`/api/admin/${endpoint}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        container.innerHTML = "";
        data.forEach(renderer);
        return data;
    } catch (error) {
        container.innerHTML = "<p class='error'>Failed to load data.</p>";
        console.error(error);
    }
}

// ====== BOOKS ======
const bookList = document.getElementById("bookList");
const statsBooks = document.getElementById("statsBooks");

function renderBook(book) {
    const div = document.createElement("div");
    div.className = "entry";
    div.innerHTML = `
        <p><strong>${book.title}</strong> by ${book.author} - $${book.price}</p>
        <button onclick="openBookModal(${JSON.stringify(book).replace(/"/g, '&quot;')})">📖 View</button>
        <button onclick="deleteBook('${book._id}')">❌ Delete</button>
    `;
    bookList.appendChild(div);
}

async function deleteBook(id) {
    if (!confirm("Delete this book?")) return;
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

async function loadBooks() {
    const data = await fetchAndRender("books", bookList, renderBook);
    statsBooks.textContent = data?.length || 0;
}

// ====== USERS ======
const userList = document.getElementById("userList");
const statsUsers = document.getElementById("statsUsers");

function renderUser(user) {
    const div = document.createElement("div");
    div.className = "entry";
    div.innerHTML = `
        <p>${user.name} - ${user.email}</p>
        <button onclick="openUserModal(${JSON.stringify(user).replace(/"/g, '&quot;')})">👁️ View</button>
    `;
    userList.appendChild(div);
}

async function loadUsers() {
    const data = await fetchAndRender("users", userList, renderUser);
    statsUsers.textContent = data?.length || 0;
}

// ====== ORDERS ======
const orderList = document.getElementById("orderList");
const statsOrders = document.getElementById("statsOrders");

function renderOrder(order) {
    const div = document.createElement("div");
    div.className = "entry";
    div.innerHTML = `
        <p>🧾 Order by ${order.user?.name || 'Unknown'} - $${order.total}</p>
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

async function loadOrders() {
    const data = await fetchAndRender("orders", orderList, renderOrder);
    statsOrders.textContent = data?.length || 0;
}

// ====== MODALS ======
const modal = document.getElementById("modal");
const modalContent = document.getElementById("modalBody");

function openBookModal(book) {
    modalContent.innerHTML = `
        <h3>${book.title}</h3>
        <p>Author: ${book.author}</p>
        <p>Price: $${book.price}</p>
        <p>Rating: ${book.rating}</p>
        <p><img src="${book.image}" alt="Book Cover" width="100"/></p>
        <button onclick="modal.close()">Close</button>
    `;
    modal.showModal();
}

function openUserModal(user) {
    modalContent.innerHTML = `
        <h3>User Info</h3>
        <p>Name: ${user.name}</p>
        <p>Email: ${user.email}</p>
        <button onclick="modal.close()">Close</button>
    `;
    modal.showModal();
}

// ====== SEARCH/FILTER ======
document.getElementById("searchBooks").addEventListener("input", async (e) => {
    const query = e.target.value.toLowerCase();
    const res = await fetch("/api/admin/books", {
        headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    const filtered = data.filter(b => b.title.toLowerCase().includes(query));
    bookList.innerHTML = "";
    filtered.forEach(renderBook);
});

// ====== INIT ======
loadBooks();
loadUsers();
loadOrders();
