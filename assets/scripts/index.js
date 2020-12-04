const baseURL = 'http://localhost:3000/'

// ----- MAIN ITEM CONTAINER METHODS ----- //
function addItemsToPage() {
    // INITIAL add items to page, sets initial page number to 1
    fetch(baseURL+'items')
        .then(resp => resp.json())
        .then(json => {
            createAndAppendItemsFromCollection(json.items)
            // document.getElementById('items').dataset.page = 1
        })
}

function createAndAppendItemsFromCollection(collection) {
    // receives a collection from a fetch request, removes all current items from div, and replaces with new items
    const itemsDiv = document.getElementById('items')
    removeAllChildNodes(itemsDiv)

    for (const item of collection) {
        // debugger
        const div = createItemDiv(item)
        itemsDiv.appendChild(div)
    }
}

function createItemDiv(itemObject) {
    // creates item card with all of the item information
    // console.log(itemObject)
    const card = document.createElement('div')
    card.dataset.itemId = itemObject.id
    card.className = 'div-card'
    card.className += ' text-center'

    const itemName = document.createElement('h6')
    itemName.className = 'cardName'
    itemName.className += ' font-weight-light'
    itemName.textContent = shortenName(itemObject.name)

    const itemImage = document.createElement('img')
    itemImage.src = itemObject.img_url
    itemImage.className = 'img-thumbnail'
    itemImage.className += ' width-200px'
    itemImage.alt = itemObject.item_type

    // const itemPrice = document.createElement('p')
    // itemPrice.textContent = `$${itemObject.price}`

    const addToCartButton = document.createElement('button')
    addToCartButton.textContent = "Add to Cart"
    addToCartButton.className = 'd-none'
// ,itemPrice, addToCartButton
    card.append(itemImage, itemName, addToCartButton)
    addCardMouseEnterEvent(card)
    return card
}

function addCardMouseEnterEvent(card) {
    card.addEventListener('mouseenter', event => {
        revealCartButtonFromDiv(event.target)
        event.target.addEventListener('mouseleave', hideCartButton)
    })
}

function createGameItemDiv(itemObject) {
    // create and return a game card for the desired game item
    const card = document.createElement('div')
    card.dataset.itemId = itemObject.id
    card.id = 'game-item'
    card.className = 'div-card'
    card.className += ' text-center'

    const itemImage = document.createElement('img')
    itemImage.src = itemObject.img_url
    itemImage.className = 'img-thumbnail'
    itemImage.className += ' width-200px'
    itemImage.alt = 'Welp...'

    const p = document.createElement('p')
    p.textContent = 'Find this item!'
    p.className = 'game-card-text'

    const skip = document.createElement('button')
    skip.textContent = 'skip'
    skip.className = 'skip-button'

    card.append(itemImage, p, skip)
    skip.addEventListener('click', skipGameItem)
    return card
}

// ----- SEARCH BAR ----- //
function getSearchBarCategories() {
    // queries DB for all search categories
    fetch(baseURL+'items/categories')
        .then(resp => resp.json())
        .then(populateSearchBarCategories)
}

function populateSearchBarCategories(json) {
    // iterates through each category in the json object and appends an option to the select dropdown
    const select = document.getElementById('category-select')
    json.categories.forEach(category => {
        const option = createSelectOption(category)
        select.appendChild(option)
    })
}

function createSelectOption(category) {
    const option = document.createElement('option')
    option.setAttribute('value', category)
    option.textContent = category
    return option
}

function searchEvent(event) {
    event.preventDefault()
    const path = createPathFromSearchFields(event.target)
    fetchItemsWithParamsPath(path)
    
}

function categoryChangeEvent(event) {
    const category = event.target.value.replace(/&/g, '%26').split(' ').join('+')
    const path = `items?category=${category}`
    event.target.parentNode.query.value = ""
    fetchItemsWithParamsPath(path)

}

function fetchItemsWithParamsPath(paramsPath) {
    // makes fetch request using given params.  If there is no data to render on the page, do nothing!
    fetch(baseURL+paramsPath)
        .then(resp => resp.json())
        .then(json => {
            if (json.items === null) {return}
            changePageNumber(json.page)
            createAndAppendItemsFromCollection(json.items)
        })
}

function createPathFromSearchFields(form) {
    // UGLY AF. takes in the form, returns a compatible path with category and query if query is present
    const arr = []
    let path = 'items'
    if (form.query.value !== "") {arr.push(`query=${form.query.value.replace(/&/g, '%26').split(' ').join('+')}`)}
    arr.push(`category=${form.category.value.replace(/&/g, '%26').split(' ').join('+')}`)
    return path + '?' + arr.join('&')
}

function changePage(event) {
    if (event.target.tagName !== 'BUTTON') {return}
    const pageNumber = parseInt(event.target.parentNode.dataset.page)
    if (event.target.textContent === "Previous") {
        changePagePrevious(pageNumber)
    } else if (event.target.textContent === "Next") {
        changePageNext(pageNumber)
    }
    // const form = document.getElementById('search-form')
    // let path = createPathFromSearchFields(form)
    // path += `&page=${parseInt(event.target.parentNode.dataset.page)+1}`
    // fetchItemsWithParamsPath(path)
}

function changePagePrevious(pageNumber) {
    // unless the page is currently 1, allow to go to the previous page
    if (pageNumber === 1) {return}

    const form = document.getElementById('search-form')
    let path = createPathFromSearchFields(form)
    path += `&page=${pageNumber - 1}`
    fetchItemsWithParamsPath(path)
}

function changePageNext(pageNumber) {
    // send request to go to the next page

    const form = document.getElementById('search-form')
    let path = createPathFromSearchFields(form)
    path += `&page=${pageNumber + 1}`
    fetchItemsWithParamsPath(path)
}

// ----- FETCHING CARTS ----- //
function fetchNewCart() {
    // const configObject = generateCartConfigObject()
    fetch(baseURL+'carts', {method: 'POST'})
        .then(resp => resp.json())
        .then(createAndAppendCartToHead)
}

// function generateCartConfigObject() {
//     return {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'Accept': 'application/json'
//         }
//     }
// }

function createAndAppendCartToHead(json) {
    const h4 = document.createElement('h4')
    h4.id = 'cart'
    h4.className = 'd-none'
    h4.textContent = `Cart (${json.items.length})`
    h4.dataset.cartId = json.id
    h4.dataset.gameSkips = 0
    document.getElementById('left-head').appendChild(h4)
}

// ----- ADDING ITEMS TO CART ----- //
function addItemToCart(event) {
    // responds to item DIV click event and decides whether to add an item to the cart
    if (event.target.tagName !== 'BUTTON') {return}

    const gameItemId = document.getElementById('game-item').dataset.itemId
    const clickedItemId = event.target.parentNode.dataset.itemId

    if (gameItemId === clickedItemId) {
        postItemToCartByItemId(event.target.parentNode.dataset.itemId)
        fetchSampleItem()
    } else {
        // add wrongg-item behavior
        alert('Thats the wrong item! :O')
    }
    
}

function postItemToCartByItemId(itemId) {
    // grabs cart ID, generates post object, and posts to server
    const cartId = document.getElementById('cart').dataset.cartId
    const configObject = generateNewCartItemConfigObject({cartId: cartId, itemId: itemId})
    fetch(baseURL+'carts/add', configObject)
        .then(resp => resp.json())
        .then(updateCartFromJSON)
}

function updateCartFromJSON(json) {
    cart = document.getElementById('cart')
    cart.textContent = `Cart (${json.items.length})`
}

function generateNewCartItemConfigObject({cartId, itemId}) {
    return {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            cart_id: parseInt(cartId),
            item_id: parseInt(itemId)
        })
    }
}

// ----- LOGIN METHODS ----- //
function addLoginToPage() {
    // create login div and add to login-container div
    const loginDiv = document.getElementById('login-container')

    const div = createLoginDiv()
    loginDiv.appendChild(div)
    // loginDiv.addEventListener('click', loginButtonClick)
}

function createLoginDiv() {
    // add all login features to a new div and return div
    const div = document.createElement('div')
    const button = document.createElement('button')
    button.className = 'btn btn-secondary'
    button.dataset.type = 'guest'
    button.textContent = ' Play as Guest '
    div.appendChild(button)
    return div
}

function loginButtonClick(event) {
    if (event.target.tagName !== 'BUTTON') {return}

    switch (event.target.dataset.type) {
        case 'join':
            //Fetches a cart for a guest, toggles visibility of search bar and items DIVs
            const userName = event.target.parentNode.children[0].value
            fetchNewUser(userName)
            fetchNewCart()
            appendUserToUserDisplay(userName)
            toggleUserDivDisplay()
            toggleLoginContainerDisplay()
            toggleStartGameButton()
            // toggleGameDisplay()
            break
        default:
            break
    }
}

// ----- TOGGLE DISPLAYS ON PAGE ----- //
function toggleCartDisplay() {
    const cart = document.getElementById('cart')
    if (cart.className === 'd-none') {
        cart.className = 'head-icon'
    } else {cart.className = 'd-none'}
}

function toggleUserDivDisplay() {
    const userDiv = document.getElementById('user-div')
    if (userDiv.className === 'd-none') {
        userDiv.className = ''
    } else {userDiv.className = 'd-none'}
}

function toggleTimerDisplay() {
    const timer = document.getElementById('timer')
    // console.log(timer);
    if (timer.className === 'd-none') {
        timer.className = 'd-block head-icon'
    } else {timer.className = 'd-none'}
}

function toggleTimesUpDisplay() {
    const timesUpMessage = document.getElementById('times-up')
    // console.log(timesUpMessage);
    if (timesUpMessage.className === 'd-none') {
        timesUpMessage.className = 'd-block head-icon'
    } else {timesUpMessage.className = 'd-none'}
}

function toggleGameDivDisplay() {
    const gameDisplay = document.getElementById('game-div')
    if (gameDisplay.className === 'd-none') {
        gameDisplay.className = 'd-block'
    } else {gameDisplay.className = 'd-none'}
}

function toggleGameItemContainerDisplay() {
    const gameItemContainer = document.getElementById('game-item-container')
    if (gameItemContainer.className === 'd-none') {
        gameItemContainer.className = 'd-block'
    } else {gameItemContainer.className = 'd-none'}
}

function toggleStartGameButton() {
    const startGameButton = document.getElementById('game-start')
    if (startGameButton.className === 'd-none') {
        startGameButton.className = 'd-block head-icon'
    } else (startGameButton.className = 'd-none')
}

function toggleLoginContainerDisplay() {
    const loginContainer = document.getElementById('login-container')
    if (loginContainer.className === 'd-none') {
        loginContainer.className = 'd-flex justify-content-center'
    } else {loginContainer.className = 'd-none'}
}

function toggleSearchFormContainerDisplay() {
    // toggles visibility of search bar at top of main screen
    const searchFormContainer = document.getElementById('search-form-container')
    if (searchFormContainer.className === 'd-none') {
        searchFormContainer.className = 'd-flex justify-content-center flex-column'
    } else {searchFormContainer.className = 'd-none'}
}

function toggleItemsContainerDisplay() {
    const itemsDiv = document.getElementById('items')
    if (itemsDiv.className === 'd-none') {
        itemsDiv.className = "d-flex justify-content-center flex-wrap"
    } else {itemsDiv.className = 'd-none'}
}

function revealCartButtonFromDiv(div) {
    const button = div.getElementsByTagName('BUTTON')[0]
    button.className = 'd-block'
}

function hideCartButtonFromDiv(div) {
    const button = div.getElementsByTagName('BUTTON')[0]
    button.className = 'd-none'
}

// ----- MISC HELPER METHODS ----- //
function changePageNumber(pageNumber) {
    document.getElementById('page-buttons').dataset.page = pageNumber
}

function shortenName(name) {
    let returnName = name
    if (name.length > 20) {
        returnName = name.slice(0, 20) + '...'
    }
    return returnName
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function hideCartButton(event) {
    // hides the cart button using the div (event.target)
    hideCartButtonFromDiv(event.target)
}

// ----- EVENT CONTAINER FUNCTIONs ----- //
function allowCartItemsToBeAdded() {
    document.getElementById('items').addEventListener('click', addItemToCart)
}

function addEventsToPage() {
    document.getElementById('category-select').addEventListener('change', categoryChangeEvent)
    document.getElementById('search-form').addEventListener('submit', searchEvent)
    document.getElementById('login-container').addEventListener('click', loginButtonClick)
    document.getElementById('page-buttons').addEventListener('click', changePage)
    document.getElementById('game-start').addEventListener('click', startNewGame)
}

// ----- SINGLE ACCESS POINT FUNCTION ----- //
function loadPage() {
    // addLoginToPage()
    getSearchBarCategories()
    addItemsToPage()
    addEventsToPage()
}