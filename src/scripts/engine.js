const state = {
    score:{
        playerScore: 0,
        computerScore: 0,
        scoreBox:document.getElementById("score_points")
    },
    cardSprites:{
        avatar:document.getElementById("card-image"),
        name:document.getElementById("card-name"),
        type:document.getElementById("card-type"),
    },
    fieldCards:{
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card"),
    },
    playerSides:{
        player1: "player-cards",
        player1Box: document.querySelector("#player-cards"),
        computer: "computer-cards",
        computerBox: document.querySelector("#computer-cards"),
    },
    actions:{
        button:document.getElementById("next-duel")
    }
};


const imgPath = "./src/assets/icons/";
const cardData = [
    {
        id:0,
        name:"Blue Eyes White Dragon",
        type:"Paper",
        img: `${imgPath}dragon.png`,
        Winof:[1],
        LoseOf:[2],
    },
    {
        id:1,
        name:"Dark Magician",
        type:"Rock",
        img: `${imgPath}magician.png`,
        Winof:[2],
        LoseOf:[0],
    },
    {
        id:2,
        name:"Exodia",
        type:"Scissors",
        img: `${imgPath}exodia.png`,
        Winof:[0],
        LoseOf:[1],
    },
]

async function drawCards(cardnumbers, fieldSide){
    for(let i = 0; i < cardnumbers; i++){
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);

        document.getElementById(fieldSide).appendChild(cardImage);
    }
}

async function getRandomCardId(){
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
}

async function createCardImage(idCard, fieldSide){
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", idCard);
    cardImage.classList.add("card");

    if(fieldSide === state.playerSides.player1){   
        cardImage.addEventListener("mouseover" , () =>{
            drawSelectedCard(idCard);
        });

        cardImage.addEventListener("click", () =>{
            setCardsField(cardImage.getAttribute("data-id"));
        });
    }
    return cardImage;
}
async function setCardsField(cardId){
    await removeAllCardsImages();

    let computerCardId = await getRandomCardId();

    await showHiddenCardFieldImages(true);

    await drawCardsInField(cardId, computerCardId);

    let duelResults = await checkDuelResults(cardId, computerCardId);

    await updateScore();
    await drawButton(duelResults);
}

async function drawCardsInField(cardId, computerCardId){
    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;
}

async function showHiddenCardFieldImages(value){

    if(value === true){
        state.fieldCards.player.style.display = "block";
        state.fieldCards.computer.style.display = "block";
    }

    if (value === false){
        state.fieldCards.player.style.display = "none";
        state.fieldCards.computer.style.display = "none";
    }
}

async function updateScore(){
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose ${state.score.computerScore}`;
}

async function checkDuelResults(playerCardID, computerCardID){
    let duelResults = "Draw";
    let playerCard = cardData[playerCardID];

    if(playerCard.Winof.includes(computerCardID)){
        duelResults = "Win";
        await playAudio(duelResults);
        state.score.playerScore++
    }

    if(playerCard.LoseOf.includes(computerCardID)){
        duelResults = "Lose";
        await playAudio(duelResults);
        state.score.computerScore++;
    }

    return duelResults;
}

async function drawButton(text){
    state.actions.button.innerText = text
    state.actions.button.style.display = "block";
}

async function removeAllCardsImages(){
    let{ computerBox, player1Box} = state.playerSides;
    let imgElements = computerBox.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());

    imgElements = player1Box.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());

}

async function drawSelectedCard(index){
    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = 'Atribute :' + cardData[index].type;
}

async function resetDuel(){
    state.cardSprites.avatar.src = "";
    state.cardSprites.name.innerText = "Card name";
    state.cardSprites.type.innerText = "Attribute";
    
    state.actions.button.style.display = "none";

    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";


    init();
}

async function playAudio(status){
    const audio = new Audio(`./src/assets/audios/${status}.wav`);
    audio.volume = 0.5;
    audio.play();
}

async function init(){

    await showHiddenCardFieldImages(false);
    
    drawCards(5,state.playerSides.player1);
    drawCards(5,state.playerSides.computer);

    const bgm = document.getElementById("bgm");
    bgm.volume = 0.4;
    bgm.play();

}

init();
