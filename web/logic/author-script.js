document.addEventListener("DOMContentLoaded", () => {
    const authorContainer = document.getElementById("author-container");
    const searchInput = document.getElementById("author-search");
  
    async function fetchAuthors() {
      try {
        const res = await fetch("/api/authors");
        const authors = await res.json();
  
        renderAuthors(authors);
  
        // Enable filtering
        searchInput.addEventListener("input", () => {
          const query = searchInput.value.toLowerCase();
          const filtered = authors.filter(author =>
            author.name.toLowerCase().includes(query)
          );
          renderAuthors(filtered);
        });
  
      } catch (err) {
        console.error("Failed to fetch authors:", err);
      }
    }
  
    function renderAuthors(authors) {
      authorContainer.innerHTML = "";
      authors.forEach(author => {
        const card = document.createElement("div");
        card.className = "author-card";
        card.innerHTML = `
          <img src="${author.image}" alt="${author.name}" />
          <h3>${author.name}</h3>
          <p>${author.bio.substring(0, 100)}...</p>
          <div class="books">${author.books.map(book => `<span class="book-tag">${book}</span>`).join("")}</div>
          <button class="view-btn" data-id="${author._id}">More Info</button>
        `;
        authorContainer.appendChild(card);
      });
  
      document.querySelectorAll(".view-btn").forEach(button => {
        button.addEventListener("click", (e) => {
          const authorId = e.target.dataset.id;
          window.location.href = `author-details.html?id=${authorId}`;
        });
      });
    }
  
    fetchAuthors();
  });
  