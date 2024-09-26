let apiKey = "10e65eb27ec4a5b7e06313b91493c5ff";
let apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric";
let cityInput = document.querySelector("#city-input");
let searchButton = document.querySelector(".search");
let weatherImg = document.querySelector(".info-img").firstElementChild;
let tempInfo = document.querySelector(".info-temprature").firstElementChild;
let cityInfo = document.querySelector(".info-city");
let airPressureInfo = document.querySelector(".pressure-info");
let windInfo = document.querySelector(".wind-info");
let humidityInfo = document.querySelector(".humidity-info");
let city;
// For theme change
let currentTheme = document.querySelector(":root");
async function checkWeather(city, lat, long) {
   console.log(lat,long);
   try {
      let response;
      if (lat && long) {
         response = await fetch(apiUrl +`&lat=${lat}&lon=${long}` + `&appid=${apiKey}`); // Fetches data from API and appends the city given by geo-Location API
      } else {
         response = await fetch(apiUrl + `&appid=${apiKey}` + `&q=${city}`); // Fetches data from API and appends the city given by user
      }
      const data = await response.json();
      console.log(data);
      if(data.name){
         cityInfo.textContent = data.name;
      }
      showWeather(data); // calls the function that displays weather info to user
   } catch (error) {
      console.log(error.message);
   }
}
searchButton.addEventListener("click", () => {
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
// Both the event Listeners are used to make for the input field

function showWeather(data) {
   let currentWeatherState = data.weather[0].main; // Checks the current weather state e.g: Rainy, Cloudy
   tempInfo.textContent = Math.round(data.main.temp); // Rounds off the temperature to nearest integer
   cityInfo.textContent = cityInput.value; // Displays the city given by user below temperature
   airPressureInfo.textContent = `${(data.main.pressure * 0.1).toFixed(1)} kPa`; //Converts to kPa
   windInfo.textContent = `${(data.wind.speed * 3.6).toFixed(1)} km/hr`; // Converts m/s to km/hr
   humidityInfo.textContent = `${data.main.humidity} %`;
   const { sunrise, sunset } = data.sys; // Extracts the sunrise, sunset data 
   const currentTime = Math.floor(Date.now() / 1000); // Current time in Unix timestamp
   if (currentWeatherState == "Mist") {
      weatherImg.src = "assets/Misty/mist.png";
   }
   // For DayNight Mode
   if (currentTime >= sunrise && currentTime < sunset) {
      currentTheme.style.setProperty("--main-color", "#8db87f");
      currentTheme.style.setProperty("--text-color", "#333");
      currentTheme.style.setProperty("--body-color", "#e3e4e8");
      if (currentWeatherState == "Clouds") {
         weatherImg.src = "assets/Cloudy/cloudy.png";
      }
      if (currentWeatherState == "Rain") {
         weatherImg.src = "assets/Rainy/rainy.png";
      }
   } else {
      // weatherImg.src = "assets/moon.png";
      currentTheme.style.setProperty("--main-color", "#1a1a2e");
      currentTheme.style.setProperty("--text-color", "#fff");
      currentTheme.style.setProperty("--body-color", "#2b2d42");
      if (currentWeatherState == "Clouds") {
         weatherImg.src = "assets/Cloudy/night-cloud.png";
      }
      if (currentWeatherState == "Rain") {
         weatherImg.src = "assets/Rainy/night-rain.png";
      }
   }
}
// Geo-location API
function geoLocation() {
   if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
   } else {
      console.log("Geolocation is not supported in your browser");
   }
}
function showPosition(position) {
   const lat = position.coords.latitude.toFixed(2);
   const long = position.coords.longitude.toFixed(2);
   checkWeather(null,lat,long);
}

geoLocation();
