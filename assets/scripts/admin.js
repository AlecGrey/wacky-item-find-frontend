function loadAdminPage() {
    toggleLoginContainerDisplay()
    showAdminPage()
    addAdminItemsToPage()
    getAdminSearchBarCategories()
    addAdminEventsToPage()
}

function addAdminItemsToPage() {
    fetch(baseURL+'items')
        .then(resp => resp.json())
        .then(json => {
            createAndAppendAdminItemsFromCollection(json.items)
            // document.getElementById('items').dataset.page = 1
        })
}

function showAdminPage() {
    document.getElementById('admin-div').className = 'd-block'
}

function hideAdminPage() {
    document.getElementById('admin-div').className = 'd-none'
}

function createAndAppendAdminItemsFromCollection(collection) {
    const itemsDiv = document.getElementById('admin-items')
    removeAllChildNodes(itemsDiv)

    for (const item of collection) {
        // debugger
        const div = createAdminItemDiv(item)
        itemsDiv.appendChild(div)
    }
}

function createAdminItemDiv(itemObject) {
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

    const deleteButton = document.createElement('button')
    deleteButton.textContent = "Remove Item"
    deleteButton.className = 'd-none'

    card.append(itemImage, itemName, deleteButton)
    addCardMouseEnterEvent(card)
    return card
}

function makeItemsRemovable() {
    document.getElementById('admin-items').addEventListener('click', removeItem)
}

function removeItem(event) {
    if (event.target.tagName !== 'BUTTON') {return}
    itemId = event.target.parentNode.dataset.itemId
    removeItemFromDatabaseById(itemId)
}

function removeItemFromDatabaseById(id) {
    fetch(baseURL+'items/'+id, {method: 'DELETE'})
        .then(resp => resp.json())
        .then(refreshCurrentAdminPage)
}

function refreshCurrentAdminPage() {
    const form = document.getElementById('admin-search-form')
    const currentPage = document.getElementById('admin-page-buttons').dataset.page
    let path = createPathFromSearchFields(form)
    path +=`&page=${currentPage}`
    fetchAdminItemsWithParamsPath(path)
}

function addAdminPageChangeEvent() {
    document.getElementById('admin-page-buttons').addEventListener('click', adminChangePage)
}

function adminChangePage(event) {
    if (event.target.tagName !== 'BUTTON') {return}
    const pageNumber = parseInt(event.target.parentNode.dataset.page)
    if (event.target.textContent === "Previous") {
        adminChangePagePrevious(pageNumber)
    } else if (event.target.textContent === "Next") {
        adminChangePageNext(pageNumber)
    }
}

function adminChangePagePrevious(pageNumber) {
    if (pageNumber === 1) {return}

    const form = document.getElementById('admin-search-form')
    let path = createPathFromSearchFields(form)
    path += `&page=${pageNumber - 1}`
    fetchAdminItemsWithParamsPath(path)
}

function adminChangePageNext(pageNumber) {
    // send request to go to the next page
    const form = document.getElementById('admin-search-form')
    let path = createPathFromSearchFields(form)
    path += `&page=${pageNumber + 1}`
    fetchAdminItemsWithParamsPath(path)
}

function fetchAdminItemsWithParamsPath(paramsPath) {
    fetch(baseURL+paramsPath)
        .then(resp => resp.json())
        .then(json => {
            if (json.items === null || json.items.length === 0) {return}
            changeAdminPageNumber(json.page)
            createAndAppendAdminItemsFromCollection(json.items)
        })
}

function changeAdminPageNumber(pageNumber) {
    document.getElementById('admin-page-buttons').dataset.page = pageNumber
}

function createAndAppendAdminItemsFromCollection(collection) {
    const itemsDiv = document.getElementById('admin-items')
    removeAllChildNodes(itemsDiv)

    for (const item of collection) {
        // debugger
        const div = createAdminItemDiv(item)
        itemsDiv.appendChild(div)
    }
}

function getAdminSearchBarCategories() {
    fetch(baseURL+'items/categories')
        .then(resp => resp.json())
        .then(populateAdminSearchBarCategories)
}

function populateAdminSearchBarCategories(json) {
    const select = document.getElementById('admin-category-select')
    json.categories.forEach(category => {
        const option = createSelectOption(category)
        select.appendChild(option)
    })
}

function addAdminEventsToPage() {
    makeItemsRemovable()
    addAdminPageChangeEvent()
    addAdminCategorySelectEvent()
    addAdminSearchEvent()
}

function addAdminCategorySelectEvent() {
    document.getElementById('admin-category-select').addEventListener('change', adminCategoryChangeEvent)
}

function adminCategoryChangeEvent(event) {
    const category = event.target.value.replace(/&/g, '%26').split(' ').join('+')
    const path = `items?category=${category}`
    event.target.parentNode.query.value = ""
    fetchAdminItemsWithParamsPath(path)
}

function addAdminSearchEvent() {
    document.getElementById('admin-search-form').addEventListener('submit', adminSearchEvent)
}

function adminSearchEvent(event) {
    event.preventDefault()
    const path = createPathFromSearchFields(event.target)
    fetchAdminItemsWithParamsPath(path)
}