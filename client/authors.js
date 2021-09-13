
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
function renderAllAuthors(authorList){
    const authorsContainer = document.getElementById("authors-container");

    authorList.map(author => {
        authorsContainer.insertAdjacentHTML("beforeend", `
        <div class="all-authors__container__item">
        <div class="all-authors__container__item__img">
        <img src="${author.imgUrl}">
        <h3>${author.name}</h3>
        </div>
        <p>${author.biography}</p>
          </div>
        `)
    })
}




    (function  fetchAllAuthors() {
        isLoaderVisible(true)
        axios.get("http://localhost:3000/api/authors")
            .then(response => {
                isLoaderVisible(false)
                renderAllAuthors(response.data.slice(0,8));
            })
    })();