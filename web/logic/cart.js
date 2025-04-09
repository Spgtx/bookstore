document.addEventListener("DOMContentLoaded", () => {
    fetch("/api/cart")
        .then(res => res.json())
        .then(cart => {
            const cartContainer = document.getElementById("cart-container");
            const cartTotalEl = document.getElementById("cart-total");

            cartContainer.innerHTML = "";
            let total = 0;

            cart.forEach(item => {
                const itemTotal = item.book.price * item.quantity;
                total += itemTotal;

                const cartItem = document.createElement("div");
                cartItem.classList.add("cart-item");
                cartItem.innerHTML = `
            <img src="${item.book.image}" alt="${item.book.title}">
            <div class="cart-details">
              <h4>${item.book.title}</h4>
              <p>Quantity: ${item.quantity}</p>
              <p>Price: Ksh. ${item.book.price}</p>
              <p>Total: Ksh. ${itemTotal}</p>
              <button class="btn remove-btn" data-id="${item._id}">Remove</button>
            </div>
          `;
                cartContainer.appendChild(cartItem);
            });

            cartTotalEl.textContent = total;

            document.querySelectorAll(".remove-btn").forEach(btn => {
                btn.addEventListener("click", async (e) => {
                    const id = e.target.getAttribute("data-id");
                    await fetch(`/api/cart/${id}`, { method: "DELETE" });
                    location.reload();
                });
            });
        })
        .catch(err => console.error("Failed to load cart", err));
});

function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function removeItem(bookId) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter(item => item.id !== bookId);
    localStorage.setItem("cart", JSON.stringify(cart));
    showToast("Book removed from cart");
    displayCart();
}

document.getElementById("modeToggle").addEventListener("change", () => {
    document.body.classList.toggle("dark");
});

