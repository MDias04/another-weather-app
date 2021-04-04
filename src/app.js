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

let weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

let current = new Date();

let celsiusTemperature = null;

// UPDATES TO THE CURRENT Date //
let currentDay = weekDays[current.getDay()];
let currentMonth = months[current.getMonth()];
let currentDate = current.getDate();

let dateFormat = document.querySelector("#current-date");
dateFormat.innerHTML = `${currentDay} ${currentDate} ${currentMonth}`;

// UPDATES TO THE CURRENT TIME //
let time = document.querySelector("#current-time");
time.innerHTML = formatTime(current);

// UPDATE LOCATION from the search bar > user input //
function changeCity(event) {
  event.preventDefault();
  let inputCity = document.querySelector("#search-city");
  let cityValue = `${inputCity.value}`;

  let apiKey = "99418b33eeeda47ea16a3e1653492f12";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityValue}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(getWeather);
}
//User action on search bar
let newCity = document.querySelector("#search-location");
newCity.addEventListener("submit", changeCity);

// UPDATE TEMPERATURE //
function getWeather(response) {
  celsiusTemperature = response.data.main.temp;

  let currentCity = document.querySelector("#current-city");
  let temperatureElement = document.querySelector("#current-temperature");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let highTemperature = document.querySelector("#high");
  let lowTemperature = document.querySelector("#low");
  let weatherDescription = document.querySelector("#weather-description");
  let iconElement = document.querySelector("#weather-icon");

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
}

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
