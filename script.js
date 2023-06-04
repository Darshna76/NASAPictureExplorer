const apiKey ="hgoKL4SkS9PncsU3EQooBndYo011nMdL1QrxC85Y";
const searchForm = document.getElementById("search-form");
const imageContainer = document.getElementById("current-image-container");
const searchHistoryList = document.getElementById("search-history");
const currentDate = new Date().toISOString().split("T")[0];
const minDate = "1995-06-16";

function getCurrentImageOfTheDay() {
    fetch(`https://api.nasa.gov/planetary/apod?&date=${currentDate}&api_key=${apiKey}`)
        .then(response => response.json())
        .then((data) => {
            console.log(data);
            imageContainer.innerHTML = `
        <h1>NASA Picture of the Day</h1>
        ${data.media_type === "image" ? `<img src=${data.hdurl}>` : ''}
       ${data.media_type === "video" ? `<iframe  src=${data.url}></iframe>` : ''}
        <h3>${data.title}</h3>
        <p>${data.explanation}</p>`;
        })
        .catch(error => {
            console.log(error);
        });
}

getCurrentImageOfTheDay();


searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let searchInput = document.getElementById("search-input").value;
    getImageOfTheDay(searchInput);
    saveSearch(searchInput);
    addSearchToHistory();
});

function getImageOfTheDay(date) {


    if (date < minDate || date > currentDate) {
        alert(`Please enter a date between ${minDate}, and ${currentDate}.`);
        return;
    }
    fetch(`https://api.nasa.gov/planetary/apod?&date=${date}&api_key=${apiKey}`)
        .then(response => response.json())
        .then((data) => {
            console.log(data);
            imageContainer.innerHTML = `
        <h1>Picture on ${data.date}</h1>
        ${data.media_type === "image" ? `<img src=${data.hdurl}>` : ''}
       ${data.media_type === "video" ? `<iframe src=${data.url}></iframe>` : ''}
        <h3>${data.title}</h3>
        <p>${data.explanation}</p>`;

        })
        .catch(error => {
            console.log(error);
        });
}

function saveSearch(date) {
    if (date > minDate && date < currentDate) {
        let savedDates = JSON.parse(localStorage.getItem("savedDates")) || [];
        savedDates.push(date);
        localStorage.setItem("savedDates", JSON.stringify(savedDates));
    }
}
function addSearchToHistory() {
    let savedDates = JSON.parse(localStorage.getItem("savedDates")) || [];
    let unorderList = document.createElement("ul");

    savedDates.forEach((date) => {
        let listItem = document.createElement("li");
        listItem.textContent = date;
        listItem.addEventListener("click", () => {
            getImageOfTheDay(date);
        });
        unorderList.appendChild(listItem);
    });

    searchHistoryList.innerHTML = "";
    searchHistoryList.appendChild(unorderList);

}
addSearchToHistory();