document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get("id");

    if (bookId) {
        fetch(`http://localhost:5000/api/books/${bookId}`)
            .then(res => res.json())
            .then(book => {
                document.getElementById("book-title").innerText = book.title;
                document.getElementById("book-author").innerText = `By ${book.author}`;
                document.getElementById("book-image").src = book.image;
                document.getElementById("book-price").innerHTML = `Ksh.${book.price} <span>Ksh.${book.originalPrice}</span>`;
                document.getElementById("book-description").innerText = book.description || "No description available.";
            })
            .catch(error => {
                console.error("Failed to fetch book details:", error);
            });
    } else {
        console.error("Book ID not found in URL.");
    }
});
