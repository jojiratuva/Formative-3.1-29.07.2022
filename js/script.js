// aos 
AOS.init();
// --------------------------------------------API variables 
const apiKey = "&apiKey=0ee0b450932f4ce982f3e07f61a8ba3c";
const endpointURL = "https://newsapi.org/v2/";
const everything = "everything?"
const topHeadline = "top-headlines?"
const query = "q=";
const sources = "sources=";
const domains = "domains=";
const pageSize = "&pageSize=40";
const page = "&page=1"
const language = "&language=en";
const sortBy = "&sortBy=";
// ---------------------------------------------- variables
const list_element = document.getElementById('list');
const pagination_element = document.getElementById('pagination');
const searchInput = document.getElementById('search-input');
const sortByInput = document.getElementById('sort-by');
const searchBtn = document.getElementById('button');
// --------------------this shows items displayed per page. 
// the page 
let current_page = 1;
// how many items 
let rows = 9;

// -------------------------------- this displays the items 
function DisplayList(items, wrapper, rows_per_page, page) {
    // items = API array
    // wrapper = list_element 
    // rows_per_page = rows 
    // page = current_page 
    wrapper.innerHTML = "";
    page--;
    // console.log(items);

    // this math equation calculates amount of listed objects and rounds up. 

    let start = rows_per_page * page;
    let end = start + rows_per_page;
    let paginatedItems = items.slice(start, end);

    // this is renders the array data and styles 
    for (let i = 0; i < paginatedItems.length; i++) {

        let item = paginatedItems[i];
        // this creates the div.item and fills it with item_element 
        let item_element = document.createElement('div');
        item_element.classList.add('item');

        // this will loop through array to find nulls and not display the authors 
        authorNull = () => {
            if (item.author == null) {
                return "";
            } else {
                return item.author;
            }
        }

        truncateString = (item, num) => {
            let shortDescription = item.description;
            if (shortDescription.length > num) {
                return shortDescription.slice(0, num) + "...";
            } else {
                return shortDescription;
            }
        }
        // --------------- 
        // display all info

        item_element.innerHTML += `
        <img src="${item.urlToImage}" alt="peopleontraing.jpg">
                <div class="item_title">
                    <p>${item.title}</p>
                 </div>
                 <div class="item_description">
                     <p>${truncateString(item, 100)}</p>
                 </div>
                 <div class="item_author">
                     <p>${authorNull(item)}</p>
                 </div>
                 <div class="item_source">
                     <p>${item.source.name}</p>
                 </div>
                 <div class="item_a">
                     <p>read more . . .</p>
                 </div>
        `;

        wrapper.appendChild(item_element);
    }
}

//------------------------ this creates the pagination element 
function setupPagination(items, wrapper, rows_per_page) {
    wrapper.innerHTML = "";

    let page_count = Math.ceil(items.length / rows_per_page);

    for (let i = 1; i < page_count + 1; i++) {
        let btn = paginationButton(i, items);
        wrapper.appendChild(btn);
    }
}

// this is for the pagination button 
function paginationButton(page, items) {
    // this creates buttons for the pagination 
    let button = document.createElement('button');
    // Display buttons 
    button.innerText = page;
    // display .active css to buttons when on current page 
    if (current_page == page) button.classList.add('active');

    // button onclick to display items for that page 
    button.addEventListener('click', function () {
        current_page = page;
        DisplayList(items, list_element, rows, current_page);

        let curren_btn = document.querySelector('.pagenumbers button.active');
        curren_btn.classList.remove('active');

        button.classList.add('active');
    });

    return button;
}



// --------------------------------------------------- API Ajax 
$.ajax({
    type: "GET",
    url: endpointURL + everything + query + "fire" + page + pageSize + language + apiKey,
    success: (data) => {
        // console.log(data);
        // push API data into these functions 
        DisplayList(data.articles, list_element, rows, current_page);
        setupPagination(data.articles, pagination_element, rows);

    },
    error: (error) => {
        console.log(error)
    }
})


// this is for search functionality
searchBtn.onclick = () => {
    console.log('search clicked');
    let searchString = searchInput.value;
    let filterString = sortByInput.value
    $.ajax({
        type: "GET",
        url: endpointURL + everything + query + searchString + sortBy + filterString + page + pageSize + language + apiKey,
        success: (data) => {
            console.log(data);

            // push API data into these functions 
            DisplayList(data.articles, list_element, rows, current_page);
            setupPagination(data.articles, pagination_element, rows);
        },
        error: (error) => {
            console.log(error)
        }
    })
}

//--------------------------------- misc script 

//--------------------------------- enter on keypress 

searchInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("button").click();
    }
})