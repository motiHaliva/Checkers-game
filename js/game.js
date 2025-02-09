let fruits = ["🍎","🍊","🍇","🍓","🍒","🍌","🥝","🍐"];
let doubleFruits=[...fruits,...fruits];
doubleFruits.sort(()=>Math.random()-0.5);
console.log(doubleFruits);
let board = document.querySelector("#game-board");
const createCard =()=>{
    const card = document.createElement("card");
    doubleFruits.forEach((fruit) => {
        card.classList.add("card");
    
    }

)
}
createCard();




























































































// const cardsArray = ["🍎", "🍌", "🍉", "🍇", "🍒", "🍓", "🥝", "🍍"];
// let cards = [...cardsArray, ...cardsArray]; 
// // cards.sort(() => Math.random() - 0.5);

// const gameBoard = document.querySelector("#game-board");
// let flippedCards = [];
// let matchedPairs = 0;

// function createBoard() {
//     gameBoard.innerHTML = "";
//     cards.forEach((emoji) => {
//         const card = document.createElement("div");
//         card.classList.add("card");
//         card.dataset.value = emoji;
//         card.innerText = "?";
//         card.addEventListener("click", flipCard);
//         gameBoard.appendChild(card);
//     });
// }

// function flipCard() {
//     if (flippedCards.length === 2 || this.classList.contains("matched")) return;

//     this.classList.add("flipped");
//     this.innerText = this.dataset.value;
//     flippedCards.push(this);

//     if (flippedCards.length === 2) {
//         setTimeout(checkMatch, 500);
//     }
// }

// function checkMatch() {
//     const [card1, card2] = flippedCards;
    
//     if (card1.dataset.value === card2.dataset.value) {
//         card1.classList.add("matched");
//         card2.classList.add("matched");

//         setTimeout(() => {
//             card1.style.visibility = "hidden";
//             card2.style.visibility = "hidden";
//         }, 500);

//         matchedPairs++;
//         if (matchedPairs === cardsArray.length) {
//             setTimeout(() => alert("ניצחת! 🎉"), 300);
//         }
//     } else {
//         card1.classList.remove("flipped");
//         card2.classList.remove("flipped");
//         card1.innerText = "?";
//         card2.innerText = "?";
//     }

//     flippedCards = [];
// }

// document.getElementById("restart").addEventListener("click", () => {
//     cards.sort(() => Math.random() - 0.5);
//     matchedPairs = 0;
//     flippedCards = [];
//     createBoard();
// });

// createBoard();
