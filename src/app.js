let current = new Date();

function formatTime(timestamp) {
  let hours = timestamp.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = timestamp.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${hours}:${minutes}`;
}

let months = [
  "Jan",
  "Feb",
  "March",
  "April",
  "May",
  "June",
  "July",
  "Aug",
  "Sept",
  "Out",
  "Nov",
  "Dec",
];

let weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// UPDATES TO THE CURRENT Date //
let currentDay = weekDays[current.getDay()];
let currentMonth = months[current.getMonth()];
let currentYear = current.getFullYear();
let currentDate = current.getDate();
let dateFormat = document.querySelector("#current-date");

dateFormat.innerHTML = `${currentDay} ${currentDate} ${currentMonth} ${currentYear}`;

// UPDATES TO THE CURRENT TIME //
let time = document.querySelector("#current-time");
time.innerHTML = formatTime(current);

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

//UPDATE WEEKLY FORECAST
function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
      <div class="col-2">
              <div class="forecast-week-day">${formatDay(forecastDay.dt)}</div>
              <img src="https://openweathermap.org/img/wn/${
                forecastDay.weather[0].icon
              }@2x.png" class="weather-icons" alt="" width="60"></img>
              <div class="weather-forecast-temperature">
                <span class="max">${Math.round(forecastDay.temp.max)}˚ |</span>
                <span class="min">${Math.round(forecastDay.temp.min)}˚</span>
              </div>
            </div>
          `;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = "99418b33eeeda47ea16a3e1653492f12";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

// UPDATE TEMPERATURE //
function getWeather(response) {
  let currentCity = document.querySelector("#current-city");
  let temperatureElement = document.querySelector("#current-temperature");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let highTemperature = document.querySelector("#high");
  let lowTemperature = document.querySelector("#low");
  let weatherDescription = document.querySelector("#weather-description");
  let iconElement = document.querySelector("#weather-icon");

  celsiusTemperature = response.data.main.temp;

  temperatureElement.innerHTML = Math.round(celsiusTemperature);
  currentCity.innerHTML = `${response.data.name}`;
  humidityElement.innerHTML = response.data.main.humidity;
  windElement.innerHTML = Math.round(response.data.wind.speed);
  highTemperature.innerHTML = Math.round(response.data.main.temp_max);
  lowTemperature.innerHTML = Math.round(response.data.main.temp_min);
  weatherDescription.innerHTML = response.data.weather[0].description;

  iconElement.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);

  getForecast(response.data.coord);
}

// UPDATE LOCATION from the search bar > user input //
function changeCity(city) {
  let apiKey = "99418b33eeeda47ea16a3e1653492f12";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(getWeather);
}

function handleSubmit(event) {
  event.preventDefault();
  let inputCity = document.querySelector("#search-city");
  changeCity(inputCity.value);
}
//User action on search bar
let newCity = document.querySelector("#search-location");
newCity.addEventListener("submit", handleSubmit);

//get coords of current location
function getCurrentLocation(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let units = "metric";
  let apiKey = "99418b33eeeda47ea16a3e1653492f12";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(getWeather);
}
//user takes action for to get current location
let currentLocationBtn = document.querySelector("#current-btn");
currentLocationBtn.addEventListener("click", updateLocation);

// UPDATE CURRENT LOCATION //
function updateLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(getCurrentLocation);
}

//CONVERT CELCIUS//
function convertCelcius(event) {
  event.preventDefault();

  celciusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");

  let currentTemp = document.querySelector("#current-temperature");
  currentTemp.innerHTML = Math.round(celsiusTemperature);
}

let celciusLink = document.querySelector("#celcius");
celciusLink.addEventListener("click", convertCelcius);

//CONVERT FAHRENHEIT//
function convertFahrenheit(event) {
  event.preventDefault();
  let currentTemp = document.querySelector("#current-temperature");

  celciusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");

  let fahrenheitTemp = (celsiusTemperature * 9) / 5 + 32;
  fahrenheitTemp = Math.round(fahrenheitTemp);
  currentTemp.innerHTML = `${fahrenheitTemp}`;
}

let fahrenheitLink = document.querySelector("#fahrenheit");
fahrenheitLink.addEventListener("click", convertFahrenheit);
changeCity("London");
