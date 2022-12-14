let initialized = false;

function initSidebarHamburger() {
  const opensidebar = document.getElementById("opensidebar");
  const closesidebar = document.getElementById("closesidebar");
  if (opensidebar && closesidebar) {
    opensidebar.addEventListener("click", (e) => {
      e.preventDefault();
      document.body.classList.add("showsidebar");
    });
    closesidebar.addEventListener("click", (e) => {
      e.preventDefault();
      document.body.classList.remove("showsidebar");
    });
  }
}

function loadScriptAndStyles() {
  const contentarea = document.querySelector(".post-content");
  (function () {
    const code = contentarea.querySelector("pre>code");
    if (code) {
      const script = document.createElement("script");
      script.src = "/js/highlight.min.js";
      script.onload = () => {
        hljs.highlightAll();
      };
      document.body.appendChild(script);
      const link = document.createElement("link");
      link.setAttribute("rel", "stylesheet");
      link.setAttribute("href", "/css/highlight.css");
      document.head.appendChild(link);
    }
  })();
  (function () {
    if (contentarea.querySelectorAll(".carousel").length > 0) {
      const script = document.createElement("script");
      script.src = "/js/glider.min.js";
      script.onload = () => {
        contentarea.querySelectorAll(".carousel").forEach((carousel) => {
          new Glider(carousel.querySelector(".glider"), {
            slidesToShow: 1,
            dots: carousel.querySelector(".dots"),
            draggable: true,
            arrows: {
              prev: carousel.querySelector(".glider-prev"),
              next: carousel.querySelector(".glider-next"),
            },
          });
        });
      };
      document.body.appendChild(script);
      const link = document.createElement("link");
      link.setAttribute("rel", "stylesheet");
      link.setAttribute("href", "/css/glider.min.css");
      document.head.appendChild(link);
    }
  })();
}
if (document.readyState === "complete") {
    if(!initialized){
        initialized = true;
        loadScriptAndStyles();
        initSidebarHamburger();
    }
} else {
  window.addEventListener("DOMContentLoaded", () => {
    if(!initialized){
        initialized = true;
        loadScriptAndStyles();
        initSidebarHamburger();
    }
  });
  window.onload = () => {
    if(!initialized){
        initialized = true;
        loadScriptAndStyles();
        initSidebarHamburger();
    }
  }
}
