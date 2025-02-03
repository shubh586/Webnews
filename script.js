const API_KEY = "c86044ca32fb4b988828ac8b655165f0";
const url = "https://newsapi.org/v2/everything?q=";

window.addEventListener("load", () => fetchNews("India"));

function reload() {
    window.location.reload();
}
const darkModeButton = document.getElementById('dark-mode-toggle');

// Load the current theme from localStorage or default to 'light'
const currentTheme = localStorage.getItem('theme') || 'light';
applyTheme(currentTheme);

darkModeButton.addEventListener('click', () => {
    const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme); // Save the new theme to localStorage
});

function applyTheme(theme) {
    if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.documentElement.style.setProperty('--primary-text-color', 'black');
        document.documentElement.style.setProperty('--secondary-text-color', 'darkblue');
        document.documentElement.style.setProperty('--accent-color', '#a4c2f4');
        document.documentElement.style.setProperty('--accent-color-dark', '#8a9dc6');
        document.documentElement.style.setProperty('--background-color', '#121212');
        document.documentElement.style.setProperty('--card-background-color', '#1e1e1e');
        document.documentElement.style.setProperty('--card-shadow', '0 0 4px #333333');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        document.documentElement.style.setProperty('--primary-text-color', '#183b56');
        document.documentElement.style.setProperty('--secondary-text-color', '#577592');
        document.documentElement.style.setProperty('--accent-color', '#2294ed');
        document.documentElement.style.setProperty('--accent-color-dark', '#1d69a3');
        document.documentElement.style.setProperty('--background-color', '#ffffff');
        document.documentElement.style.setProperty('--card-background-color', '#ffffff');
        document.documentElement.style.setProperty('--card-shadow', '0 0 4px #d4ecff');
    }
}

async function fetchNews(query) {
    const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
    const data = await res.json();
    bindData(data.articles);
}

// const darkModeButton = document.getElementById('dark-mode-toggle');
// const currentTheme = localStorage.getItem('theme') || 'light';
// document.documentElement.setAttribute('data-theme', currentTheme);

// darkModeButton.addEventListener('click', () => {
//     const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
//     document.documentElement.setAttribute('data-theme', newTheme);
//     localStorage.setItem('theme', newTheme);
// });

function bindData(articles) {
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    cardsContainer.innerHTML = "";

    articles.forEach((article) => {
        if (!article.urlToImage) return;
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description;

    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
    });

    newsSource.innerHTML = `${article.source.name} · ${date}`;

    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}

let curSelectedNav = null;
function onNavItemClick(id) {
    fetchNews(id);
    const navItem = document.getElementById(id);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = navItem;
    curSelectedNav.classList.add("active");
}

const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
    const query = searchText.value;
    if (!query) return;
    fetchNews(query);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = null;
});