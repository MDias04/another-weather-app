function formatTime(time) {
  let hours = time.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = time.getMinutes();
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

  let temperatureElement = Math.round(celsiusTemperature);
  let conditions = response.data.weather[0].description;

  let wind = Math.round(response.data.wind.speed);
  let humidity = response.data.main.humidity;
  let high = response.data.main.temp_max;
  let low = response.data.main.temp_min;

  let currentCity = document.querySelector("#current-city");
  let tempElement = document.querySelector("#current-temperature");
  currentCity.innerHTML = `${response.data.name}`;
  tempElement.innerHTML = `${temperatureElement}`;

  let description = document.querySelector("#conditions");
  description.innerHTML = `${conditions}`;

  let winds = document.querySelector("#wind");
  winds.innerHTML = `Wind: ${wind}`;

  let humidityTemp = document.querySelector("#humidity");
  humidityTemp.innerHTML = `Humidity: ${humidity}%`;

  let highTemp = document.querySelector("#high");
  highTemp.innerHTML = `High: ${high}˚`;

  let lowTemp = document.querySelector("#low");
  lowTemp.innerHTML = `Low: ${low}˚`;

  // let iconElement = document.querySelector("#icon");
  // iconElement.setAttribute(
  //   "src",
  //   `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  // );
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
