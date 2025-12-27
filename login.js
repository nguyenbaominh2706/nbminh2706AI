import { auth } from './firebase-config.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

const inpEmail = document.querySelector("#email");
const inpPassword = document.querySelector("#password");
const loginForm = document.querySelector("#login-form");

const handleLogin = function(event) {
    event.preventDefault();

    let email = inpEmail.value.trim();  
    let password = inpPassword.value.trim(); 

    if (!email || !password) {
        alert("Vui lòng điền đầy đủ các trường dữ liệu");
        return;
    }

    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        const user = userCredential.user;

        const userSession = {
            user: {
                uid: user.uid,
                email: user.email
            },
            expiry: new Date().getTime() + 2 * 60 * 60 * 1000 // 2 giờ sau
        };

        localStorage.setItem('user_session', JSON.stringify(userSession));
        alert("Đăng nhập thành công!");
        window.location.href = 'index.html';
    })
    .catch(e => {
        alert("Lỗi: " + e.message);
    });
};

loginForm.addEventListener('submit', handleLogin);