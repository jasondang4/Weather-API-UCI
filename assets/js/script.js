const weatherApiKey = '08581cb53032ed3ea7430bd68cf2d5b7';
const formElement = document.getElementById('search-form');
const inputElement = document.getElementById('city-input');
const weatherDisplay = document.getElementById('current-weather');
const futureWeather = document.getElementById('forecast');
const historyLog = document.getElementById('search-history');

formElement.addEventListener('submit', (event) => {
    event.preventDefault();
    const cityName = inputElement.value.trim();
    fetchWeather(cityName);
    inputElement.value = '';
});

function fetchWeather(cityName) {
    const endpointUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${weatherApiKey}&units=imperial`;

    fetch(endpointUrl)
        .then(result => {
            if (!result.ok) {
                throw new Error('Network request failed');
            }
            return result.json();
        })
        .then(weatherData => {
            renderWeatherCurrent(weatherData);
            renderWeatherForecast(weatherData);
            recordSearchHistory(cityName);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

function renderWeatherCurrent(weatherData) {
    const details = weatherData.list[0];
    const nameOfCity = weatherData.city.name;
    const weatherDate = new Date(details.dt * 1000).toLocaleDateString();
    const weatherIconUrl = `https://openweathermap.org/img/wn/${details.weather[0].icon}.png`;
    const temp = details.main.temp;
    const moist = details.main.humidity;
    const wind = details.wind.speed;

    weatherDisplay.innerHTML = `
        <div class="card">
            <div class="card-body">
                <h2 class="card-title">${nameOfCity} (${weatherDate})</h2>
                <img src="${weatherIconUrl}" alt="${details.weather[0].description}" class="weather-icon">
                <p class="card-text">Temperature: ${temp}°F</p>
                <p class="card-text">Humidity: ${moist}%</p>
                <p class="card-text">Wind Speed: ${wind} mph</p>
            </div>
        </div>
    `;
}

function renderWeatherForecast(weatherData) {
    futureWeather.innerHTML = '';
    for (let i = 0; i < weatherData.list.length; i += 8) {
        const forecastDetails = weatherData.list[i];
        const forecastDate = new Date(forecastDetails.dt * 1000).toLocaleDateString();
        const forecastIconUrl = `https://openweathermap.org/img/wn/${forecastDetails.weather[0].icon}.png`;
        const forecastTemp = forecastDetails.main.temp;
        const forecastMoist = forecastDetails.main.humidity;
        const forecastWind = forecastDetails.wind.speed;

        futureWeather.innerHTML += `
            <div class="card">
                <div class="card-body">
                    <h3 class="card-title">${forecastDate}</h3>
                    <img src="${forecastIconUrl}" alt="${forecastDetails.weather[0].description}" class="weather-icon">
                    <p class="card-text">Temperature: ${forecastTemp}°F</p>
                    <p class="card-text">Humidity: ${forecastMoist}%</p>
                    <p class="card-text">Wind Speed: ${forecastWind} mph</p>
                </div>
            </div>
        `;
    }
}

function recordSearchHistory(cityName) {
    const historyNode = Array.from(historyLog.children).find(item => item.textContent === cityName);
    if (!historyNode) {
        const newItem = document.createElement('div');
        newItem.textContent = cityName;
        newItem.classList.add('search-history-item');
        historyLog.appendChild(newItem);
        newItem.addEventListener('click', () => {
            fetchWeather(cityName);
        });
    }
}
