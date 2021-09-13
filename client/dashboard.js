
// books
const dashboardTableWrapper = document.getElementById("dash-table");
const wrapper = document.getElementById("wrapper");
const loader = document.getElementById("loader");
const authorsDash = document.getElementById('authors-dash')

// modal
const bookDetailsModal = document.getElementById("book-details-modal");
const bookDetailsModalClose = document.getElementById("book-details-modal-close");
const bookDetailsModalSubmitBtn = document.getElementById("book-details-submit");
const bookDetailsModalForm = document.getElementById("book-details-modal-form");

const authorDetailsModal = document.getElementById("author-details-modal");
const authorDetailsModalClose = document.getElementById("author-details-modal-close");
const authorDetailsModalSubmitBtn = document.getElementById("author-details-submit");
const authorDetailsModalForm = document.getElementById("author-details-modal-form");

authorDetailsModalSubmitBtn.addEventListener('click',(e)=>{
    e.preventDefault()
    showLoader();

    // SAME ID'S EVERYWHERE

    const newAuthor={
        id: document.getElementById("author-id").value,
        name: document.getElementById("author-name").value,
    }

   //  console.log(newAuthor);

    axios.post("http://localhost:3000/api/authors", newAuthor)
    .then(() => {
        loader.style.display = "none";
        showNotification("success",'add');
        handleAuthorDetailsModalClose();
        getAllAuthors();
    })



})
bookDetailsModalSubmitBtn.addEventListener('click', (e) => {
    e.preventDefault()
    showLoader();

    const newBook = {
        id: document.getElementById("id").value,
        title: document.getElementById("title").value,
        author: document.getElementById("author").value,
        publisher : document.getElementById("publisher").value,
        publishDay : document.getElementById("publishDay").value,
        sold: document.getElementById("sold").value,
        genre: [],
        imageUrl: document.getElementById("imageUrl").value,
        synopsis: document.getElementById("synopsis").value,
        bookCover: Boolean(document.getElementById("hard").checked) ? "hard" : "soft",
        price: document.getElementById("price").value,
    }

    // select genre
    const allCheckBoxes = document.querySelectorAll('input[type="checkbox"]:checked');
    for(let i=0; i < allCheckBoxes.length; i++) {
        newBook.genre.push(allCheckBoxes[i].value);
    }
 
    axios.post("http://localhost:3000/api/books", newBook)
        .then(() => {
            loader.style.display = "none";
            showNotification("success",'publish');
            handleBookDetailsModalClose();
            fetchAllBooks();
        })
})


function showLoader() {
    dashboardTableWrapper.innerHTML = "";
    loader.style.display = "block";
}
function deleteAuthors(){
    const authorsDash =dashboardTableWrapper.firstElementChild
   
    for(let i =1; i<authorsDash.children.length; i++) {
        
        const deleteAuthors = authorsDash.children[i].children[0].lastElementChild.firstElementChild;
       

        deleteAuthors.addEventListener('click', () => {
            showLoader();
            const id = deleteAuthors.id.split("-")[2];

            axios.delete(`http://localhost:3000/api/authors/${id}`)
                .then(() => {
                    loader.style.display = "none";
                    getAllAuthors();
                    showNotification("success",'deleted');
                })
        })
    }
}
function deleteEditBookById() {
    const tableDataWrapper = dashboardTableWrapper.firstElementChild;
    for(let i =1; i<tableDataWrapper.children.length; i++) {
        const deleteIcon = tableDataWrapper.children[i].children[0].lastElementChild.firstElementChild;
        const editIcon = tableDataWrapper.children[i].children[0].lastElementChild.lastElementChild;

        deleteIcon.addEventListener('click', () => {
            showLoader();
            const id = deleteIcon.id.split("-")[2];

            axios.delete(`http://localhost:3000/api/books/${id}`)
                .then(() => {
                    loader.style.display = "none";
                    showNotification("success",'deleted');
                    fetchAllBooks();
                })
        });
        editIcon.addEventListener('click',()=>{
            showLoader()
            const id = editIcon.id.split("-")[2];

            axios.get(`http://localhost:3000/api/books/${id}`)
            
            .then(({data: bookById}) => {
                loader.style.display ='none'
                handleDetailsModalOpen();

                document.getElementById("id").value = bookById.id;
                document.getElementById("title").value = bookById.title;
                document.getElementById("author").value = bookById.author;
                document.getElementById("publisher").value = bookById.publisher;
                document.getElementById("publishDay").value = bookById.publishDay;
                document.getElementById("sold").value = bookById.sold;
                document.getElementById("imageUrl").value = bookById.imageUrl;
                document.getElementById("synopsis").value = bookById.synopsis;
                document.getElementById("price").value = bookById.price;

                bookById.bookCover == "hard" ? document.getElementById("hard").checked == true : document.getElementById("soft").checked;

                bookById.genre.map(genreItem => {
                    const allGenres = document.querySelectorAll('input[type="checkbox"]');

                    for(let i=0; i< allGenres.length; i++) {
                        if(allGenres[i].value === genreItem) {
                            allGenres[i].checked = true;
                            break;
                        }
                    }
                })

            })
        })
    }
}








function renderAllBooks(bookList){
     dashboardTableWrapper.innerHTML='';
     dashboardTableWrapper.insertAdjacentHTML('afterbegin',`
     <table>
         <tr>
             <th>#id</th>
             <th>Title</th>
             <th>Author</th>
             <th>Publisher</th>
             <th>Price</th>
             <th> 
             <img src="./assets/icons/cancel.svg" alt="add" class="book-details-modal__add" id="book-details-modal-add" style="cursor: pointer">
             </th>
         </tr>
     </table>
 `);
 createAddBookAction();
 bookList.map(book => {
    dashboardTableWrapper.firstElementChild.insertAdjacentHTML("beforeend", `
        <tr>
            <td>${book.id}</td>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.publisher}</td>
            <td>$${book.price}</td>
            <td>
                <img src='./assets/icons/delete.svg' style="cursor: pointer;" id="delete-book-${book.id}">
                <img src='./assets/icons/pencil.svg' style="cursor: pointer;" id="edit-book-${book.id}">
            </td>
        </tr>
    `)
})
   deleteEditBookById();
};
 
function handleDetailsModalOpen() {
    bookDetailsModal.style.display = "block";
    wrapper.style.filter = "blur(3px) opacity(20%)";
}


function createAddBookAction() {
    const addBookBtn = document.getElementById("book-details-modal-add");
    addBookBtn.addEventListener('click', handleDetailsModalOpen)
}


bookDetailsModalClose.addEventListener('click', handleBookDetailsModalClose);

function handleBookDetailsModalClose() {
    bookDetailsModal.style.display = "none";
    wrapper.style.filter = "none";
    bookDetailsModalForm.reset();
}

function fetchAllBooks(){
    loader.style.display = "block";

    axios.get("http://localhost:3000/api/books")
        .then(response => {
            renderAllBooks(response.data);
            loader.style.display = "none"
        })
};



 function handleAuthorModalOpen(){
    authorDetailsModal.style.display = "block";
    wrapper.style.filter = "blur(3px) opacity(20%)";
 }

function createAddAuthorAction(){
   const addAuthorBtn = document.getElementById('author-details-modal-add');
   addAuthorBtn.addEventListener('click', handleAuthorModalOpen);
  
}

authorDetailsModalClose.addEventListener('click', handleAuthorDetailsModalClose);

function handleAuthorDetailsModalClose() {
    authorDetailsModal.style.display = "none";
    wrapper.style.filter = "none";
    authorDetailsModalForm.reset();
}




 function renderAllAuthors(authorList){
    dashboardTableWrapper.innerHTML='';
    dashboardTableWrapper.insertAdjacentHTML('afterbegin', `
    <table>
        <tr>
            <th>#id</th>
            <th>Name</th>
            <th>
                <img src="./assets/icons/cancel.svg" id="author-details-modal-add" style="cursor: pointer" alt="cancel">
            </th>
        </tr>
    </table>
`)
   createAddAuthorAction()
   authorList.map(author=>{
    dashboardTableWrapper.firstElementChild.insertAdjacentHTML("beforeend",`
      <tr>
          <td>${author.id}</td>
          <td>${author.name}</td>
        <td>
            <img src="./assets/icons/delete.svg" style="cursor: pointer;" alt="cancel" id="delete-author-${author.id}">
        </td>
      </tr>
     `)
    })
    loader.style.display='none'
    deleteAuthors()
 }

function renderAllUsers(userList){
    dashboardTableWrapper.innerHTML='';
    dashboardTableWrapper.insertAdjacentHTML('afterbegin', `
    <table>
        <tr>
            <th>#id</th>
            <th>Name</th>
            <th>Surname</th>
            <th>Mail</th>
            <th>Password</th>
        </tr>
    </table>
`)
 userList.map(user=>{
    dashboardTableWrapper.firstElementChild.insertAdjacentHTML("beforeend",`
    <tr>
        <td>${user.id}</td>
        <td>${user.name}</td>
        <td>${user.surname}</td>
        <td>${user.mail}</td>
        <td>${user.password}</td>
    </tr>
   `)
  })

}






 function getAllUsers() {
    loader.style.display = "block";
    axios.get("http://localhost:3000/api/users")
        .then(response => {
            renderAllUsers(response.data);
            loader.style.display = "none";
        })
}






function getAllAuthors(){
    loader.style.display='block';
    axios.get("http://localhost:3000/api/authors")
        .then(response => {
            renderAllAuthors(response.data);
            loader.style.display = "none";
        })
}

(function getActiveNavItem(){
    const booksTab = document.getElementById("books-dash");
    const authorsTab = document.getElementById("authors-dash");
    const usersTab = document.getElementById("users-dash");
    booksTab.className = "dashboard__navigation__active";
    ;

    fetchAllBooks();
    // MISTAKE 1
    // getAllAuthors()

    booksTab.addEventListener('click', () => {
        authorsTab.className = "";
        usersTab.className = "";
        booksTab.className = "dashboard__navigation__active";
        fetchAllBooks();
    });
    
    authorsTab.addEventListener('click', () => {
        booksTab.className = "";
        usersTab.className = "";
        authorsTab.className = "dashboard__navigation__active";
        getAllAuthors();
        
    });

    usersTab.addEventListener('click', () => {
        booksTab.className = "";
        authorsTab.className = "";
        usersTab.className = "dashboard__navigation__active";
        getAllUsers();
    })

})();