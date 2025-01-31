const API_KEY = "10e65eb27ec4a5b7e06313b91493c5ff";
// Humidity, Pressure, Icon, Wind, Desc
let apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric";
let weatherCardContainer = document.querySelector(".weather-card");
let cityInput = document.querySelector("#city-input");
let searchButton = document.querySelector(".search");
let weatherImg = document.querySelector(".info-img").firstElementChild;
let currentStateInfo = document.querySelector(".info-main-state");
let currentStateDescription = document.querySelector(".info-state-description");
let tempInfo = document.querySelector(".info-temprature").firstElementChild;
let cityInfo = document.querySelector(".info-city");
let airPressureInfo = document.querySelector(".pressure-info");
let windInfo = document.querySelector(".wind-info");
let windDirection = document.querySelector(".wind-direction");
let humidityInfo = document.querySelector(".humidity-info");
let infoDate = document.querySelector(".info-date");
let windSpeedArrow = document.querySelector(".wind-direction-arrow");
let city;
async function checkWeather(city) {
  try {
    let response = await fetch(`connection.php?q=${city}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.code);
    }
    const data = await response.json();
    showWeather(data); // calls the function that displays weather info to user
  } catch (error) {
    if (error.message.includes("404")) {
      showToast("City not found. Please enter a valid city name.");
    }
  }
}
searchButton.addEventListener("click", (e) => {
  e.preventDefault();
  city = cityInput.value;
  if (city) {
    checkWeather(city); // ChecksWeather if the city given by user is valid
  } else {
    alert("Enter a valid city");
  }
});
cityInput.addEventListener("keypress", (event) => {
  city = cityInput.value;
  if (event.key == "Enter") {
    checkWeather(city);
  }
});
// Both the event Listeners are used to call checkweather function

function showWeather(data) {
  currentStateInfo.innerHTML = data[0].weatherstatus.toUpperCase();
  // currentStateDescription.innerHTML = data.weather[0].description.toUpperCase();
  cityInfo.innerHTML = data[0].City; // Displays city given by user
  currentStateDescription.innerHTML = data[0].weatherstate.toUpperCase();
  tempInfo.innerHTML = Math.round(data[0].temperature); // Rounds off to nearest integer
  airPressureInfo.innerHTML = `${data[0].pressure} hPa`;
  windInfo.innerHTML = `${data[0].windspeed} m/s`;
  windDirection.innerHTML = `at ${data[0].direction}°`;
  humidityInfo.innerHTML = `${data[0].humidity} %`;
  weatherImg.src = `https://openweathermap.org/img/wn/${data[0].icon}.png`;
  windSpeedArrow.style.transform = `rotate(${data[0].direction}deg)`;
  // Getting current time from API
  infoDate.innerHTML = new Date(data[0].currentTime * 1000).toLocaleDateString();
  toggleDarkNightMode(data);
}
function toggleDarkNightMode(data) {
  // Extracts the sunrise, sunset data
  const sunrise = data[0].sunrise;
  const sunset = data[0].sunset;
  const currentTime = Math.floor(Date.now() / 1000); // Current time in Unix timestamp
  // For DayNight Mode
  if (currentTime >= sunrise && currentTime < sunset) {
    document.body.classList.remove("dark-mode");
    weatherCardContainer.classList.remove("dark-mode");
  } else {
    document.body.classList.add("dark-mode");
    weatherCardContainer.classList.add("dark-mode");
  }
}

// Show Toast Function
function showToast(subText = "Unxpected Error Occured") {
  const toast = document.querySelector(".toast");
  const subTextElement = toast.querySelector(".error-description");
  subTextElement.textContent = subText;

  toast.style.transform = "translateY(0)";
  toast.style.opacity = "1";

  // Automatically hide the toast after 3 seconds
  setTimeout(() => {
    hideToast();
  }, 3000);
}

// Hide Toast Function
function hideToast() {
  const toast = document.querySelector(".toast");
  toast.style.transform = "translateY(-100px)";
  toast.style.opacity = "0";
}

// Close the toast manually by clicking the close icon
document.querySelector(".cross-icon").addEventListener("click", hideToast);

// Default city on first load
checkWeather("Wolverhampton");
