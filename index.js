// Mobile nav toggle
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

menuToggle.addEventListener("click", () => {
  mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", mainNav.classList.contains("open"));
});
