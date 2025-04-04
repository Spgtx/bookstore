document.addEventListener("DOMContentLoaded", function () {
    const categoryButtons = document.querySelectorAll(".category-btn");
    const booksContainer = document.getElementById("category-books");

    categoryButtons.forEach(button => {
        button.addEventListener("click", async () => {
            const category = button.dataset.category;
            try {
                const response = await fetch(`/api/books/category/${category}`);
                const books = await response.json();

                booksContainer.innerHTML = ""; // clear existing books

                if (books.length === 0) {
                    booksContainer.innerHTML = `<p style="text-align:center; grid-column: span 4;">No books found in this category.</p>`;
                    return;
                }

                books.forEach(book => {
                    const bookHTML = `
              <div class="book-card">
                  <img src="${book.image}" alt="${book.title}" />
                  <h3>${book.title}</h3>
                  <p>by ${book.author}</p>
                  <div class="rating">${"⭐".repeat(Math.round(book.rating || 4))}</div>
                  <div class="price">Ksh.${book.price} <span>Ksh.${book.originalPrice}</span></div>
                  <button class="btn">Add to Cart</button>
              </div>`;
                    booksContainer.innerHTML += bookHTML;
                });
            } catch (error) {
                console.error("Error fetching books:", error);
                booksContainer.innerHTML = `<p style="color: red;">Something went wrong while fetching books.</p>`;
            }
        });
    });
});