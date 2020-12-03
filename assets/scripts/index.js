const baseURL = 'http://localhost:3000/'

// ----- MAIN ITEM CONTAINER METHODS ----- //
function toggleItemsContainerDisplay() {
    const itemsDiv = document.getElementById('items')
    if (itemsDiv.className === 'd-none') {
        itemsDiv.className = "d-flex justify-content-center flex-wrap"
    } else {itemsDiv.className = 'd-none'}
}

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

    const itemPrice = document.createElement('p')
    itemPrice.textContent = `$${itemObject.price}`

    const addToCartButton = document.createElement('button')
    addToCartButton.textContent = " Add to Cart "
// ,itemPrice, addToCartButton
    card.append(itemImage, itemName)
    return card
}

// ----- SEARCH BAR ----- //
function toggleSearchFormContainerDisplay() {
    // toggles visibility of search bar at top of main screen
    const searchFormContainer = document.getElementById('search-form-container')
    if (searchFormContainer.className === 'd-none') {
        searchFormContainer.className = 'd-flex justify-content-center flex-column'
    } else {searchFormContainer.className = 'd-none'}
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
    // makes fetch request using given params.  If there is no data to render on the page, do nothing!
    fetch(baseURL+paramsPath)
        .then(resp => resp.json())
        .then(json => {
            if (json.items === null) {return}
            changePageNumber(json.page)
            createAndAppendItemsFromCollection(json.items)
        })
}

// function createPathFromSearchFields(form) {
//     let path = 'items'
//     const query = form.query.value.replace(/&/g, '%26').split(' ').join('+')
//     const category = form.category.value.replace(/&/g, '%26').split(' ').join('+')
//     path += `?query=${query}&category=${category}`
//     return path
// }

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

// ----- LOGIN METHODS ----- //
function toggleLoginContainerDisplay() {
    const loginContainer = document.getElementById('login-container')
    if (loginContainer.className === 'd-none') {
        loginContainer.className = 'd-flex justify-content-center'
    } else {loginContainer.className = 'd-none'}
}

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
    // debugger
    switch (event.target.dataset.type) {
        case 'guest':
            //toggles visibility of search bar and items DIVs
            toggleLoginContainerDisplay()
            toggleSearchFormContainerDisplay()  
            toggleItemsContainerDisplay() 
            break
        //set other cases for login/sign-up when they're created
        default:
            break
    }
}

// ----- MISC HELPER METHODS ----- //
function changePageNumber(pageNumber) {
    document.getElementById('page-buttons').dataset.page = pageNumber
}

function loadPage() {
    addLoginToPage()
    getSearchBarCategories()
    addItemsToPage()  
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

function addMouseEventToShowAddToCartButton() {
    // mouseover event to display the add to cart button
    // main.addEventListener('mouseover')
}

// GLOBAL EVENT LISTENERS
document.getElementById('category-select').addEventListener('change', categoryChangeEvent)
document.getElementById('search-form').addEventListener('submit', searchEvent)
document.getElementById('login-container').addEventListener('click', loginButtonClick)
document.getElementById('page-buttons').addEventListener('click', changePage)

// ACCESS POINT FUNCTIONS
loadPage()
