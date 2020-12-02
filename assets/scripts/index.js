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

// ----- SEARCH BAR ----- //
function changeSearchBarDisplay(display) {
    document.getElementById('search-form-container').style.display = display
}

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
    fetch(baseURL+paramsPath)
        .then(resp => resp.json())
        .then(createAndAppendItemsFromCollection)
}

function createPathFromSearchFields(form) {
    let path = 'items'
    const query = form.query.value.replace(/&/g, '%26').split(' ').join('+')
    const category = form.category.value.replace(/&/g, '%26').split(' ').join('+')
    path += `?query=${query}&category=${category}`
    return path
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
            changeSearchBarDisplay('block')   
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

function addMouseEventToShowAddToCartButton() {
    // mouseover event to display the add to cart button
    // main.addEventListener('mouseover')
}

// GLOBAL EVENT LISTENERS
document.getElementById('category-select').addEventListener('change', categoryChangeEvent)
document.getElementById('search-form').addEventListener('submit', searchEvent)

// ACCESS POINT FUNCTIONS
addLoginToPage()
getSearchBarCategories()