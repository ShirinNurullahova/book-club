const wrapper=document.getElementById('wrapper');
alert('This page not secure')

function renderFirts6Authors(authorList) {
    const authorsWrapper = document.getElementById("authors");

    authorList.map(author => {
        authorsWrapper.insertAdjacentHTML("beforeend", `
            <div class="authors__wrapper__item">
                <img src="${author.imgUrl}" alt="author">
                <h4>${author.name}</h4>
            </div>
        `)
    })
}


function renderTopBooksSold(bookList){
    const topSellingWrapper = document.getElementById('top-selling');

    bookList.map(book => {
        topSellingWrapper.insertAdjacentHTML("beforeend", `
            <div class="top-selling__books__item">
                <img src="${book.imageUrl}" alt="book">
                <h4>${book.title}</h4>
                <p class="top-selling__books__item__author">By <span>${book.author}</span></p>
                <p class="top-selling__books__item__price">$${book.price}</p>
            </div>
        `)
    })
}

function renderFirst3Books(bookList){
   const top3BooksWrapper = document.getElementById("first-3");

   bookList.map(book => {
    top3BooksWrapper.insertAdjacentHTML("beforeend", `
        <div class="book-selection__top-selling">
            <div class="book-selection__top-selling__image">
                <img src="${book.imageUrl}" alt="book">
            </div>
            <div class="book-selection__top-selling__info">
                <h3>${book.title}</h3>
                <div class="book-selection__top-selling__info__book">
                    <div>
                        <p>Authors</p>
                        <p>${book.author}</p>
                    </div>
                    <div>
                        <p>Type</p>
                        <p>${book.genre.map(genre => " "+genre)}</p>
                    </div>
                    <div>
                        <p>Layout</p>
                        <p>${book.bookCover === "hard" ? "Hard" : "Soft"} cover</p>
                    </div>
                </div>
                <h4>$${book.price}</h4>
            </div>
        </div>
    `) 
})
}

function getAllAuthors(){
   const authorsLoader = document.getElementById("authors-loader");
   authorsLoader.style.display = "block"
   axios.get('http://localhost:3000/api/authors')
    .then(authors=>{
        authorsLoader.style.display = "none";
        renderFirts6Authors(authors.data.slice(0, 6))
    })
}

function isLoaderVisible(visibility) {
    const loader = document.getElementById("loader");

    if(visibility) {
        wrapper.style.display = "none";
        loader.style.display = "block"
    } else {
        wrapper.style.display = "block";
        loader.style.display = "none"
    }
}





function fetchAllBooks(){
    isLoaderVisible(true);
    axios.get('http://localhost:3000/api/books')
     .then(bookList=>{
         isLoaderVisible(false);
         renderFirst3Books(bookList.data.slice(0,3));
         renderTopBooksSold(bookList.data.sort((book1, book2) => book2.sold - book1.sold).slice(0,5))
     }) 
}
fetchAllBooks();
getAllAuthors();