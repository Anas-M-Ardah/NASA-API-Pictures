const resultNav = document.getElementById('resultsNav');
const favoriteNav = document.getElementById('favoritesNav');
const imagesContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');

// NASA API
const count = 10;
const apiKey = 'DEMO_KEY';
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray = [];
let favorites = {};

function showContent(page){
    window.scrollTo({ top: 0, behavior: 'instant'});
    if(page === 'results'){
        resultNav.classList.remove('hidden');
        favoriteNav.classList.add('hidden');
    } else{
        resultNav.classList.add('hidden');
        favoriteNav.classList.remove('hidden');
    }
    loader.classList.add('hidden');
}

function createDOMNodes(page){
    const currentArray = page === 'results' ? resultsArray : Object.values(favorites);
    currentArray.forEach((result) => {
        // Card Container
        const card = document.createElement('div');
        card.classList.add('card')
        // Link
        const link = document.createElement('a');
        link.href = result.hdurl;
        link.title = 'View Full Image';
        link.target = '_blank';
        // Image
        const image = document.createElement('img');
        image.src = result.url;
        image.alt = 'NASA Picture of the Day';
        image.loading = 'lazy';
        image.classList.add('card-img-top');
        // Card Body
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        // Card Title
        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = result.title;
        // Add to Favorites
        const addToFavorites = document.createElement('p');
        addToFavorites.classList.add('clickable');
        if(page === 'results'){
            addToFavorites.textContent = 'Add To Favorites';
            addToFavorites.setAttribute('onclick',`saveFavorite('${result.url}')`);
        }else{
            addToFavorites.textContent = 'Remove Favorite';
            addToFavorites.setAttribute('onclick',`removeFavorite('${result.url}')`);
        }
        // Card Text
        const cardText = document.createElement('p');
        cardText.classList.add('card-text')
        cardText.textContent = result.explanation;
        // Footer Container
        const footerContainer = document.createElement('small');
        footerContainer.classList.add('text-muted');
        // Date
        const date = document.createElement('strong');
        date.textContent = result.date;
        // Copyright
        const copyrightResult = result.copyright === undefined ? '' : result.copyright;
        const copyright = document.createElement('span');
        copyright.textContent = ` ${copyrightResult}`;
        // Append
        footerContainer.append(date, copyright);
        cardBody.append(cardTitle, addToFavorites, cardText, footerContainer);
        link.appendChild(image);
        card.append(link, cardBody);
        imagesContainer.appendChild(card);
    });
}

function updateDOM(page){
    // Get Favorites form localStorage
    if(localStorage.getItem('nasaFavorites')){
        favorites = JSON.parse(localStorage.getItem('nasaFavorites'));
        console.log('favorites from localStorage', favorites);
    } 
    imagesContainer.textContent = '';
    createDOMNodes(page);
    showContent(page);
}

// Get 10 images from NASA Api
async function getNasaPictures(){
    // Show Loader
    loader.classList.remove('hidden');
    try{
        const response = await fetch(apiUrl);
        resultsArray = await response.json();
        updateDOM('results');    
    } catch(error){
        // Catch Error Here
    }
}

// Add result to Favorites
function saveFavorite(itemUrl){
    // Loop through Results Array to select Favorite
    resultsArray.forEach((item) => {
        if(item.url.includes(itemUrl) && !favorites[itemUrl]){
            favorites[itemUrl] = item;
            console.log(favorites);
            // Show Save Confirmation for 2 Seconds
            saveConfirmed.hidden = false;
            setTimeout(() => saveConfirmed.hidden = true, 2000);
            // Set Favorites in localStorage
            localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
        }
    });
}

// Remove item from Favorites
function removeFavorite(itemUrl){
    if(favorites[itemUrl]){
        delete favorites[itemUrl];
        // Set Favorites in localStorage
        localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
        updateDOM('favorites');
        
    }
}

// On Load
getNasaPictures();