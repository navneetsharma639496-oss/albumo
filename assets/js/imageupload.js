import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';
let auth;
// (async function () {
//   const res = await fetch('./component/navbar.html');
//   const html = await res.text();
//   document.getElementById('nav').innerHTML = html;


//   initNavbar();
//   initalbum();
// })();


// function initNavbar() {
//   const toggle = document.getElementById("menu-toggle");
//   const links = document.getElementById("nav-links");

//   if (toggle && links) {
//     toggle.addEventListener("click", () => {
//       links.classList.toggle("active");
//     });
//   }

// }

document.addEventListener("DOMContentLoaded", async () => {
  console.log("Script Loaded ✅");
  const cloudName = "denpwx9kt";
  const uploadPreset = "unsigned_gallery";

  const firebaseConfig = {
    apiKey: "AIzaSyCNSeodCXwMopUMMN5kEBvuqwMVx-GT5pA",
    authDomain: "ig-login-7dd6c.firebaseapp.com",
    projectId: "ig-login-7dd6c",
    storageBucket: "ig-login-7dd6c.firebasestorage.app",
    messagingSenderId: "158358828385",
    appId: "1:158358828385:web:695d63dc91d86ce8f48120"
  };

  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);

  const res = await fetch('./component/navbar.html');
  const html = await res.text();
  document.getElementById('nav').innerHTML = html;


  initNavbar();

  attachNavbarListeners();


  onAuthStateChanged(auth, (user) => {
    if (!user) {
      console.log("⛔ Firebase: No user — redirecting");
      window.location.href = "authentication.html";
      return;
    }

    const loginTime = localStorage.getItem("loginTime");
    const now = Date.now();
    const TWENTY_MINUTES = 20 * 60 * 1000;

    if (!loginTime || now - loginTime > TWENTY_MINUTES) {
      console.log("⛔ Session expired, logging out!");
      localStorage.removeItem("loginTime");
      auth.signOut();
      window.location.href = "authentication.html";
    } else {
      console.log("✅ Session valid");
    }
  });

  const fileInput = document.getElementById("fileUpload");
  console.log("File input:", fileInput);
  const uploadButton = document.getElementById("uploadBtn");
  const gallery = document.getElementById("gallery");
  const errorMessage = document.getElementById("error-message");


  const filesSelected = document.querySelector('.filesSelected');


  fileInput.addEventListener('change', () => {
    const files = Array.from(fileInput.files).map(f => f.name).join(', ');
    filesSelected.textContent = files;
  });



  function checkAuth() {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        errorMessage.style.display = "block";
        errorMessage.textContent = "Login required!";
        window.location.href = "authentication.html";
      }
    });
  }

  uploadButton.addEventListener("click", async () => {
    const user = auth.currentUser;
    if (!user) return alert("Sign in first!");

    const files = fileInput.files;
    if (files.length === 0) return alert("No files selected!");

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);
      formData.append("folder", user.uid);

      try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: "POST",
          body: formData
        });

        const data = await res.json();
        addPhotoToGallery(data.secure_url);

      } catch (err) {
        alert("Upload error: " + err.message);
      }
    }

    fileInput.value = "";
  });

  function addPhotoToGallery(url) {
    const div = document.createElement("div");
    div.classList.add("photo");
    const img = document.createElement("img");
    img.src = url;
    div.appendChild(img);
    gallery.prepend(div);
  }
  window.onload = () => checkAuth();
});


//   (async function () {
//   const res = await fetch('./component/navbar.html');
//   const html = await res.text();
//   document.getElementById('nav').innerHTML = html;


//   initNavbar();
// })();

document.getElementById('logoutBtn')?.addEventListener('click', async (e) => {
  e.preventDefault();
  await signOut(auth);
  localStorage.removeItem('loginTime');
  window.location.replace('authentication.html'); // redirect to login page
});

const albumLink = document.getElementById("albumLink");

albumLink?.addEventListener("click", () => {
  const user = auth.currentUser;

  if (!user) {
    return window.location.href = "authentication.html";
  }

  const folderName = user.uid;
  window.location.href = `index.html?folder=${folderName}`;
});

function initNavbar() {
  const toggle = document.getElementById("menu-toggle");
  const links = document.getElementById("nav-links");

  if (toggle && links) {
    toggle.addEventListener("click", () => {
      links.classList.toggle("active");
    });
  }
}


function attachNavbarListeners() {
  const logoutBtn = document.getElementById('logoutBtn');
  const albumLink = document.getElementById("albumLink");

  logoutBtn?.addEventListener('click', async (e) => {
    e.preventDefault();
    await signOut(auth);
    localStorage.removeItem('loginTime');
    window.location.replace('authentication.html');
  });

albumLink?.addEventListener("click", () => {
  // Wait for Firebase to finish restoring the auth state
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      console.warn("No user found — redirecting to auth");
      window.location.href = "authentication.html";
    } else {
      const folderName = user.uid;
      window.location.href = `index.html?folder=${folderName}`;
    }
  });
});
}

