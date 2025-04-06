document.addEventListener("DOMContentLoaded", async () => {
    const profileContainer = document.getElementById("author-profile");
  
    const params = new URLSearchParams(window.location.search);
    const authorId = params.get("id");
  
    if (!authorId) {
      profileContainer.innerHTML = "<p>Author not found.</p>";
      return;
    }
  
    try {
      const res = await fetch(`/api/authors/${authorId}`);
      const author = await res.json();
  
      profileContainer.innerHTML = `
        <img src="${author.image}" alt="${author.name}" />
        <h2>${author.name}</h2>
        <p>${author.bio}</p>
        <div class="books-written">
          ${author.books.map(book => `<span class="book-tag">${book}</span>`).join("")}
        </div>
      `;
    } catch (err) {
      profileContainer.innerHTML = "<p>Failed to load author details.</p>";
      console.error(err);
    }
  });
  