document.addEventListener("DOMContentLoaded", function() {
    const menuButton = document.querySelector(".menu button");
    const menuContent = document.querySelector(".menu-content");

    menuButton.addEventListener("click", function() {
        menuContent.style.display = (menuContent.style.display === "block") ? "none" : "block";
    });

    document.addEventListener("click", function(event) {
        if (!menuButton.contains(event.target) && !menuContent.contains(event.target)) {
            menuContent.style.display = "none";
        }
    });
});
