// script to implement animation using intersectionObserver
const cards = document.querySelectorAll(".card");

const observer = new IntersectionObserver(
  (entries) => {
    console.log(entries);
    entries.forEach((entry) => {
      entry.target.classList.toggle("show", entry.isIntersecting);
      //   if (entry.isIntersecting) observer.unobserve(entry.target); // once in the page -> stop observing
    });
  },
  {
    threshold: 1, // how much of the card had to be visible before triggering
    // rootMargin: "-100px", // container is now 100px smaller; positive would be the inverse
    rootMargin: "100px",
  }
);

// implement infinity scrolling
const lastCardObserver = new IntersectionObserver((entries) => {
  const lastCard = entries[0];
  if (!lastCard.isIntersecting) return;
  loadNewCards();
  lastCardObserver.unobserve(lastCard.target);
  lastCardObserver.observe(document.querySelector(".card:last-child"));
}, {});

lastCardObserver.observe(document.querySelector(".card:last-child"));

cards.forEach((card) => {
  observer.observe(card);
});

const cardContainer = document.querySelector(".card-container");
function loadNewCards() {
  for (let i = 0; i < 10; i++) {
    const card = document.createElement("div");
    card.textContent = "New Card";
    card.classList.add("card");
    observer.observe(card);
    cardContainer.append(card);
  }
}
