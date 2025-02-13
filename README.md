# Weathora

## Overview

The **Weather App** is a web-based application that provides real-time weather information. It intelligently caches data for offline use. The weather was developed as a part of my college project. 
---

## Features

**Real-time Weather Data** – Fetches live weather updates from OpenWeatherMap.  
**Smart Caching** – Uses **localStorage** for offline access and backend storage for optimization.  
**Efficient API Calls** – Requests new data only if the last update is **older than 2 hours**.  
**Offline Support** – Displays cached data when the user is offline.  
**PHP Backend** – Manages data requests and reduces direct API dependencies.

---

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: PHP
- **API**: OpenWeatherMap
- **Storage**: LocalStorage & MySQL Database

---

## System Workflow

1. **User enters a city name.**
2. The app **checks internet connectivity**:

- If **offline**, it retrieves data from **localStorage**.
- If **online**, it sends a request to the backend.

3. The backend checks if weather data is **available and up-to-date**:

- If **fresh data exists**, it is returned to the frontend.
- If **data is outdated or missing**, the backend fetches new data from OpenWeatherMap.

4. **New data is stored** in the database and localStorage.
5. **Weather details are displayed** to the user.

---

## Installation & Setup

### **1️. Clone the Repository**

```sh
git clone https://github.com/Aadithapa456/Weather-app.git
cd weather-app
```

### **2️. Backend Setup**

- Ensure you have a **PHP server** running (XAMPP, MAMP, or any live server).
- Set up a **MySQL database** and update credentials in the backend.

### **3️. Run the Application**

- Open `index.html` in your browser.

---

## Future Enhancements

**Improve UI/UX** – Enhance styling for better user experience.  
**Geolocation Support** – Automatically fetch weather based on user location.  
**Unit Selection** – Allow users to switch between **Celsius and Fahrenheit**.  
**Progressive Web App (PWA)** – Enable installation and offline-first experience.

---

## Contact

For questions or collaboration, feel free to reach out!
