document.addEventListener("DOMContentLoaded", async function () {
    const bookContainer = document.getElementById("book-container");

    try {
        const response = await fetch("http://localhost:5000/api/books");
        const books = await response.json();

        bookContainer.innerHTML = books.map(book => `
            <div class="box">
                <div class="image">
                    <img src="${book.image}" alt="${book.title}">
                </div>
                <div class="content">
                    <h3>${book.title}</h3>
                    <p>by ${book.author}</p>
                    <div class="star">
                        ${"★".repeat(book.rating)}${"☆".repeat(5 - book.rating)}
                    </div>
                    <div class="price">Ksh.${book.price} <span>Ksh.${book.originalPrice}</span></div>
                    <div class="bottom">
                        <a href="#" class="btn">Add to cart</a>
                        <div class="icons">
                            <a href="#" class="fas fa-heart"></a>
                        </div>
                    </div>
                </div>
            </div>
        `).join("");
    } catch (error) {
        console.error("Error fetching books:", error);
    }
});


/* */
window.onscroll = () =>{

    searchForm.classList.remove('active');

    if(window.scrollY > 80){
        document.querySelector('.header .header-2').classList.add('active');
    }else{
        document.querySelector('.header .header-2').classList.remove('active');
    }
}
window.onload = () =>{
    if(window.scrollY > 80){
        document.querySelector('.header .header-2').classList.add('active');
    }else{
        document.querySelector('.header .header-2').classList.remove('active');
    }
}

/* for  mobile view search button */
searchForm = document.querySelector('.search-form');

document.querySelector('#search-btn').onclick = () =>{
    searchForm.classList.toggle('active');
}
