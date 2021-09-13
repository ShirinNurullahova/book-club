const wrapper = document.getElementById("wrapper");
const loader = document.getElementById("loader");

function isLoaderVisible(visibility) {
    if(visibility) {
        wrapper.style.display = "none"
        loader.style.display = "block"
    } else {
        wrapper.style.display = "block"
        loader.style.display = "none"
    }
}

function renderAllBooks(bookList) {
    const booksContainer = document.getElementById("books-container");

    bookList.map(book => {
        booksContainer.insertAdjacentHTML("beforeend", `
            <div class="all-books__container__item">
                <div class="all-books__container__item__img">
                    <img src=${book.imageUrl} alt="img">
                </div>
                <div class="all-books__container__item__info">
                    <h3 class="all-books__container__item__info__title">
                        ${book.title}
                    </h3>
                    <p class="all-books__container__item__info__author">
                        ${book.author}
                    </p>
                    <p class="all-books__container__item__info__synopsis">
                        ${book.synopsis}
                    </p>
                </div>
            </div>
        `)
    })
}

(function  fetchAllBooks() {
    isLoaderVisible(true);
    axios.get("http://localhost:3000/api/books")
        .then(response => {
            isLoaderVisible(false);
            renderAllBooks(response.data);
        })
})();