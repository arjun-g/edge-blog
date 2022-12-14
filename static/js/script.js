window.onload = () => {
    const opensidebar = document.getElementById("opensidebar");
    const closesidebar = document.getElementById("closesidebar");
    if(opensidebar && closesidebar){
        opensidebar.addEventListener("click", e => {
            e.preventDefault();
            document.body.classList.add("showsidebar");
        });
        closesidebar.addEventListener("click", e => {
            e.preventDefault();
            document.body.classList.remove("showsidebar");
        });
    }
}