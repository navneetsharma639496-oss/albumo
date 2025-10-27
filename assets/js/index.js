
    // ==========================
    // Function to dynamically load a component
    // htmlPath -> path to component HTML
    // cssPaths -> array of CSS files
    // jsPaths  -> array of JS files
    // containerId -> where to inject
    // ==========================

    // Change this URL to your backend API deployed URL
    const backendApiBase = 'https://cloudinary-image-api.onrender.com';

    // Get folder name from URL query string
    function getFolderNameFromURL() {
      const params = new URLSearchParams(window.location.search);
      return params.get('folder');
    }

    // Fetch images from your backend API
    async function loadUserImages() {
      var folderName = getFolderNameFromURL();
      if (!folderName) {
        folderName = "afa";
        alert("No folder specified in the URL.");
      }

      try {
        const res = await fetch(`${backendApiBase}/images?folder=${encodeURIComponent(folderName)}`);
        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }
        const data = await res.json();

        if (!data.images || data.images.length === 0) {
          alert("No images found for this folder.");
          return;
        }

        data.images.forEach(url => addPhotoToGallery(url));
      } catch (error) {
        console.error("Failed to load images:", error);
        alert("Failed to load images. Please try again later.");
      }
    }

        (async function () {
      const res = await fetch('./component/navbar.html');
      const html = await res.text();
      document.getElementById('nav').innerHTML = html;

      initNavbar();


      document.getElementById('logoutBtn')?.addEventListener('click', async (e) => {
        e.preventDefault();
        await signOut(auth);
        localStorage.removeItem('loginTime');
        window.location.replace('authentication.html'); // redirect to login page
      });
    })();

    function initNavbar() {
      const toggle = document.getElementById("menu-toggle");
      const links = document.getElementById("nav-links");

      if (toggle && links) {
        toggle.addEventListener("click", () => {
          links.classList.toggle("active");
        });
      }
    }

    window.onload = async () => {
      await loadUserImages();
    };
    // Append each image to the gallery div
    function addPhotoToGallery(url) {
      const album = document.getElementById("album");
      const photoDiv = document.createElement("div");
      photoDiv.classList.add("photo");

      const img = document.createElement("img");
      img.src = url;
      img.alt = "User photo";

      // On click, redirect (same behavior as before)
      img.addEventListener("click", () => {
        window.location.href = 'authentication.html';
      });

      photoDiv.appendChild(img);
      album.appendChild(photoDiv);
    }








    // ===========================

    async function loadComponent(containerId, htmlPath, cssPaths = [], jsPaths = []) {
      // 1️⃣ Fetch HTML
      const res = await fetch(htmlPath);
      const html = await res.text();
      document.getElementById(containerId).innerHTML = html;

      // 2️⃣ Load CSS files
      cssPaths.forEach(cssPath => {
        if (!document.querySelector(`link[href="${cssPath}"]`)) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = cssPath;
          document.head.appendChild(link);
        }
      });

      // 3️⃣ Load JS files
      jsPaths.forEach(jsPath => {
        const script = document.createElement('script');
        script.src = jsPath;
        document.body.appendChild(script);
      });
    }