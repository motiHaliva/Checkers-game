
let id_form = document.querySelector("#id_form");
let id_name = document.querySelector("#id_name");
let id_password = document.querySelector("#id_password");
let id_Nvalid = document.querySelector("#id_Nvalid");
let id_Pvalid = document.querySelector("#id_Pvalid");
let id_login_error = document.querySelector("#id_login_error");

id_form.addEventListener("submit", (e) => {
    e.preventDefault();
    
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let foundUser = users.find(user => user.name === id_name.value && user.password === id_password.value);
    console.log(foundUser);

    if (foundUser) {
        localStorage.setItem("currentPlayer", JSON.stringify({
            name: foundUser.name,
            score: foundUser.score || 0,
            gamesPlayed: foundUser.gamesPlayed || 0,
            isComputer: false
        }));
    
        localStorage.setItem("computerPlayer", JSON.stringify({
            name: "Computer",
            score: 0,
            isComputer: true
        }));
        
        id_login_error.textContent = "שם משתמש וסיסמא תקינים";
        setTimeout(() => {
            window.location.href = "../project-folder/start.html";
        }, 1000);
    } else {
        id_login_error.textContent = "שם משתמש או סיסמא שגויים";
        id_name.value = "";
        id_password.value = "";
    }
});
