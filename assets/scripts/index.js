const baseURL = 'http://localhost:3000/'

// ----- ADD INITIAL ITEMS TO PAGE METHODS ----- //
function addItemsToPage() {
    // queries database and adds all items to the main div
    fetch(baseURL+'items')
        .then(resp => resp.json())
        .then(createAndAppendItemsFromCollection)
}

function createAndAppendItemsFromCollection(collection) {
    // receives a collection from a fetch request, removes all current items from div, and replaces with new items
    const mainDiv = document.getElementById('main')
    removeAllChildNodes(mainDiv)

    for (const item of collection) {
        // debugger
        const div = createItemDiv(item)
        mainDiv.appendChild(div)
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

    const itemPrice = document.createElement('p')
    itemPrice.textContent = `$${itemObject.price}`

    const addToCartButton = document.createElement('button')
    addToCartButton.textContent = " Add to Cart "
// ,itemPrice, addToCartButton
    card.append(itemImage, itemName)
    return card
}

// ----- LOGIN METHODS ----- //

function addLoginToPage() {
    // empty main div, create login div and add to main div
    const main = document.getElementById('main')
    removeAllChildNodes(main)

    const div = createLoginDiv()
    main.appendChild(div)
    main.addEventListener('click', loginButtonClick)
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
    // debugger
    switch (event.target.dataset.type) {
        case 'guest':
            //initialize guest cart
            addItemsToPage()
            break
        //set other cases for login/sign-up when they're created
        default:
            break
    }
}

// ----- MISC HELPER METHODS ----- //
function shortenName(name) {
    let returnName = name
    if (name.length > 35) {
        returnName = name.slice(0, 35) + '...'
    }
    return returnName
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}


// Single access point!
addLoginToPage()
// addItemsToPage()