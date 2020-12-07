// ----- NEW GAME FUNCTIONS ----- //
function startNewGame(event) {
    // resets game environment, fetches game list, runs game
    toggleGameDisplay()
    allowCartItemsToBeAdded()
    startGame() // includes game end functionality
}

function toggleGameDisplay() {
    toggleUserDivDisplay()
    toggleGameDivDisplay()
    toggleLeaderboardButtonDisplay()
    toggleTimerDisplay()
    toggleStartGameButton()
    toggleQuitGameButton()
    toggleCartDisplay()
}

function startGame() {
    // sets timer using setInterval function, sets timeout for gameEnd()
    const gameTime = 60 // seconds
    timer(gameTime * 10) // returns gameEnd() within
}

function gameEnd() {
    // game end functionality, tied to a setTimeout function
    toggleGameDisplay()
    resetFormFields()
    fetchPostGameScore()
    fetchAndUpdateCurrentLeaderboard()
    // resetGameEnvironment()
}

function quitGameEarly() {
    // does game end functionality, minus the score posting
    toggleGameDisplay()
    resetFormFields()
}

function resetGameEnvironment() {
    // add functionality to clean the game environment for a new game
    emptyCart()
}

function emptyCart() {
    const cart = document.getElementById('cart')
    fetch(baseURL+`carts/${cart.dataset.cartId}/empty`)
        .then(resp => resp.json())
        .then(json => {
            console.log(json.message);
            cart.textContent = `Cart (0)`
        })
}

function fetchSampleItem() {
    fetch(baseURL+'items/sample-item')
        .then(resp => resp.json())
        .then(displayGameItem)
}

function displayGameItem(json) {
    const gameCard = createGameItemDiv(json)
    const gameCardContainer = document.getElementById('game-item-container')
    removeAllChildNodes(gameCardContainer)
    gameCardContainer.appendChild(gameCard)
}

function fetchAndHideItem() {
    fetch(baseURL+'items/sample-item')
        .then(resp => resp.json())
        .then(hideGameItem)
}

function hideGameItem(json) {
    const gameCard = createGameItemDiv(json)
    gameCard.className = 'd-none'
    const gameCardContainer = document.getElementById('game-item-container')
    gameCardContainer.appendChild(gameCard)
}

function getNextGameItem() {
    // removes current item, displays next item, and fetches another item to hide
    const gameCardContainer = document.getElementById('game-item-container')
    const currentCard = gameCardContainer.children[0]
    const nextCard = gameCardContainer.children[1]

    gameCardContainer.removeChild(currentCard)
    nextCard.className = 'div-card text-center'
    fetchAndHideItem()
}


function fetchPostGameScore() {
    // take the cartId and number of skips and send to DB to generate a score
    const cart = document.getElementById('cart')
    const userId = parseInt(document.getElementById('main').dataset.userId)
    const cartId = parseInt(cart.dataset.cartId)
    const skips = parseInt(cart.dataset.gameSkips)
    // debugger
    const configObject = generateScoreConfigObject(userId, cartId, skips)

    fetch(baseURL + 'scores', configObject)
        .then(resp => resp.json())
        .then(json => {
            alert(`${json.user} scored ${json.score} points!`)
            resetGameEnvironment()
        })
}

function generateScoreConfigObject(userId, cartId, skips) {
    return {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            user_id: userId,
            cart_id: cartId,
            skips: skips
        })
    }
}

// ----- HELPER METHODS ----- //
function timer(x) {
    //x should be in deciseconds, aka 10 per second
    if (document.getElementById('timer').className === 'd-none') {return}
    if (x < 0) {
        return gameEnd()
    }
    // modify element with updated time
    document.getElementById('timer').textContent = `${Math.floor(x / 10)}.${x % 10}`

    return setTimeout(() => {timer(x - 1)}, 99)
} 

function skipGameItem(event) {
    document.getElementById('cart').dataset.gameSkips++
    getNextGameItem()
}

function resetFormFields() {
    document.getElementById('search-form').reset()
}