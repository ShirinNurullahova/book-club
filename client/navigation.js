//  signup modal
const signUp = document.getElementById("signup-btn");
const signUpModal = document.getElementById("signup-modal");
const signUpModalClose = document.getElementById("signup-modal-close");
const signUpSubmit = document.getElementById("sign-up-submit");
// LOGIN
const loginBtn = document.getElementById("login-btn");
const loginModal = document.getElementById('login-modal');
const loginModalClose = document.getElementById('login-modal-close');
const loginSubmit = document.getElementById('login-submit');

const logoutBtn = document.getElementById('logout-btn');
const dashBoard = document.getElementById('dashboard');



const allBooksBtn=document.getElementById("all-books");
const allAuthorsBtn=document.getElementById('all-authors')
const logo = document.getElementById("logo");
const notification = document.getElementById('notification');


const locationArray = location.href.split('/');

if(Boolean(localStorage.getItem("USER_LOGGED_IN"))) {
    loginBtn.insertAdjacentHTML("beforebegin", `<li id="local-mail" style="color: black">${localStorage.getItem("USER_LOGGED_IN")}</li>`);
    loginBtn.style.display = "none";
    logoutBtn.style.display = "block";
    signUp.style.display = "none";
    dashboard.style.display = "block";
}

dashBoard.addEventListener('click', () => {
    location.href = "dashboard.html";
})

function closeModal(targetModal) {
    targetModal ==='signup' 
    ? signUpModal.style.display='none'
    : loginModal.style.display='none'
   
   wrapper.style.filter='none';
   targetModal ==='signup' 
   ? document.getElementById("signup-form").reset()
   : document.getElementById("login-form").reset();
}

function showNotification(notificationStatus,message) {
    notification.textContent = 
        notificationStatus   === "success" 
        ? Boolean(message) ? message : "SUCCESSFULLY SIGNED UP" 
        : "ERROR OCCURED"
    
        notification.classList.add(notificationStatus, "animation");
        setTimeout( ()=> notification.classList = "notification", 3000);

}


allBooksBtn.addEventListener('click',()=>{
    if(locationArray[locationArray.length - 1] !== "books.html") {
        location.href = "books.html";
    }
});

 dashBoard.addEventListener('click',()=>{
    if(locationArray[locationArray.length - 1] !== "dashboard.html") {
        location.href = 'dashboard.html'
    }
 })
 
logo.addEventListener('click', () => {
    if(locationArray[locationArray.length - 1] !== "index.html") {
        location.href = "index.html"
    }
});

allAuthorsBtn.addEventListener('click', () => {
    if(locationArray[locationArray.length - 1] !== "authors.html") {
        location.href = "authors.html";
    }
})
 signUp.addEventListener('click',()=>{
    signUpModal.style.display = "block";
    wrapper.style.filter='blur(2px)';
    loginModal.style.display = "none";
 })


 signUpModalClose.addEventListener('click', () => closeModal("signup"));

 signUpSubmit.addEventListener('click' ,(e)=>{
       e.preventDefault();
       const newUser = {
        name: document.getElementById("name").value,
        surname: document.getElementById("surname").value,
        mail: document.getElementById("mail").value,
        password: document.getElementById("password").value
    };
    axios.post("http://localhost:3000/api/books/signup", newUser)
    .then(() => {
        closeModal('signup');
        showNotification("success");
    })
    .catch(err=>{
        showNotification("error");
    })
    console.log(newUser);
 })
 loginBtn.addEventListener('click', () => {
    loginModal.style.display = "block",
    wrapper.style.filter = "blur(2px)";
    signUpModal.style.display = "none";
});

 loginModalClose.addEventListener('click', () => closeModal('login'));
 
 loginSubmit.addEventListener('click', (e) => {
    e.preventDefault();
    const loginData = {
        mail: document.getElementById("login-mail").value,
        password: document.getElementById("login-password").value,
    };

    axios.post("http://localhost:3000/api/books/login", loginData)
        .then(() => {
            showNotification("success");
            localStorage.setItem("USER_LOGGED_IN", loginData.mail);
            loginBtn.insertAdjacentHTML("beforebegin", `<li id="local-mail" style="color: black">${loginData.mail}</li>`);
            loginBtn.style.display = "none";
            logoutBtn.style.display = "block";
            signUp.style.display = "none";
            dashboard.style.display = "block";
            closeModal("login");
        })
        .catch(() => {
            showNotification("error");
        })
});

logoutBtn.addEventListener('click',()=>{
    showNotification('success','bye');
    location.href='index.html'
    localStorage.removeItem("USER_LOGGED_IN");
    logoutBtn.style.display = "none";
    dashBoard.style.display = "none";
    loginBtn.style.display = "block";
    signUp.style.display = "block";
    

    const localMail = document.getElementById("local-mail");
    localMail.style.display = "none";
})