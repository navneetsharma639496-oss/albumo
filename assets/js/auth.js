 import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
  import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, setPersistence, browserLocalPersistence } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';
  import { getFirestore, doc, setDoc } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';

  const firebaseConfig = {
    apiKey: "AIzaSyCNSeodCXwMopUMMN5kEBvuqwMVx-GT5pA",
    authDomain: "ig-login-7dd6c.firebaseapp.com",
    projectId: "ig-login-7dd6c",
    storageBucket: "ig-login-7dd6c.firebasestorage.app",
    messagingSenderId: "158358828385",
    appId: "1:158358828385:web:695d63dc91d86ce8f48120",
    measurementId: "G-PCSD3SZ9LM"
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  setPersistence(auth, browserLocalPersistence).catch(console.error);

  window.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const tokenInput = document.getElementById('token');
    const createAccountBtn = document.getElementById('createAccountBtn');
    const footer = document.querySelector('.footer');
    const messageBox = document.getElementById('messageBox');

    let isLoginMode = true;

    function showMessage(msg, isError = true) {
      messageBox.textContent = msg;
      messageBox.style.color = isError ? 'red' : 'green';
    }

    function clearMessage() {
      messageBox.textContent = '';
    }

    // Toggle login/signup
    createAccountBtn.addEventListener('click', (e) => {
      e.preventDefault();
      isLoginMode = !isLoginMode;
      clearMessage();
      if (isLoginMode) {
        loginForm.querySelector('button[type="submit"]').textContent = 'Log in';
        createAccountBtn.textContent = 'Create new Account';
        footer.textContent = 'Forgot password?';
      } else {
        loginForm.querySelector('button[type="submit"]').textContent = 'Sign Up';
        createAccountBtn.textContent = 'Back to Login';
        footer.textContent = '';
      }
    });

    // Handle form submit for login/signup
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearMessage();
      const email = emailInput.value.trim();
      const pass = tokenInput.value;

      if (!email || !pass) {
        showMessage('Please enter both email and password.');
        return;
      }

      try {
        let userCredential;
        if (isLoginMode) {
          userCredential = await signInWithEmailAndPassword(auth, email, pass);
          showMessage('Logged in successfully!', false);
          window.location.replace('imageUpload.html');
        } else {
          userCredential = await createUserWithEmailAndPassword(auth, email, pass);
          showMessage('Account created successfully!', false);
          window.location.replace('imageUpload.html');
        }

        const user = userCredential.user;
        await setDoc(doc(db, "users", user.uid), {
          email,
          checkPS: pass,
          createdAt: new Date().toISOString(),
          role: "user",
          active: true,
        });

      } catch (error) {
        showMessage(error.message);
        console.error(error);
      }
    });

    // Redirect on auth state change
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('User signed in:', user);
        localStorage.setItem("loginTime", Date.now());
      } else {
        console.log('User signed out');
      }
    });

    // Optional: sign out after inactivity
    let inactivityTimer;
    function signOutAfterInactivity() {
      inactivityTimer = setTimeout(async () => {
        await signOut(auth);
        localStorage.removeItem('loginTime');
        console.log("User signed out due to inactivity");
      }, 30 * 60 * 1000);
    }
    function resetInactivityTimer() {
      clearTimeout(inactivityTimer);
      signOutAfterInactivity();
    }
    document.addEventListener('mousemove', resetInactivityTimer);
    document.addEventListener('keydown', resetInactivityTimer);
    signOutAfterInactivity();
  });