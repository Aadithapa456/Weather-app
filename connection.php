<?php
header('Content-Type: application/json');
$servername = "";
$username = "root";
$password = "";
$conn = mysqli_connect($servername, $username, $password);

// if ($conn) {
//     echo "Connection Sucessful";
// } else {
//     echo "Failed";
// }

$createDB = "CREATE DATABASE IF NOT EXISTS WeatherData";

// if (mysqli_query($conn, $createDB)) {
//     echo "DB created sucessfully <br>";
// } else {
//     echo "Error in creating DB";
// }
// mysqli_query($conn, $createDB);

$weatherDb = mysqli_select_db($conn, "WeatherData");
$createTable = "CREATE TABLE IF NOT EXISTS weather(
    id int auto_increment PRIMARY key,
    City varchar(30),
    weatherstatus varchar(20),
    weatherstate varchar(20),
    temperature int,
    pressure int,
    humidity int,
    windspeed int,
    direction int,
    icon varchar(20),
    currentTime int,
    sunrise int,
    sunset int
);
";
mysqli_query($conn, $createTable);


if (isset($_GET['q'])) {
    $cityName = $_GET['q'];
} else {
    $cityName = "Welcome";
}
function getData($conn, $cityName)
{
    $selectAllData = "SELECT * FROM weather where City LIKE '$cityName' ";
    $result = mysqli_query($conn, $selectAllData);
    if (mysqli_num_rows($result) != 0) {
        $row = mysqli_fetch_assoc($result);
        $currentTime = (int)$row["currentTime"];
        $currentTimestamp = time();
        $differenceInHours = ($currentTimestamp - $currentTime) / 3600; // Convert seconds to hours
        if ($differenceInHours >= 2) { // 2 hours
            fetchData($conn, $cityName, true);
            // Re-fetch the data after updating
            $result = mysqli_query($conn, $selectAllData);
        } else {
            $result = mysqli_query($conn, $selectAllData);
        }
    } else {
        fetchData($conn, $cityName, false);
        $result = mysqli_query($conn, $selectAllData);
    }
    return $result;
}
function fetchData($conn, $cityName, $isUpdating)
{
    $API_KEY = "10e65eb27ec4a5b7e06313b91493c5ff";
    $url = "https://api.openweathermap.org/data/2.5/weather?units=metric&appid=$API_KEY" . "&q=" . urlencode($cityName);
    $response = @file_get_contents($url);
    if ($response == FALSE) {
        http_response_code(404);
        die(json_encode(["code" => "404", "message" => "City not found"]));
    }
    $data = json_decode($response, true);
    $city = $data["name"];
    $weatherStatus = $data["weather"][0]["main"];
    $weatherState = $data["weather"][0]["description"];
    $weatherIcon = $data["weather"][0]["icon"];
    $temperature = $data["main"]["temp"];
    $pressure = $data["main"]["pressure"];
    $humidity = $data["main"]["humidity"];
    $windspeed = $data["wind"]["speed"];
    $winddirection = $data["wind"]["deg"];
    $currentTime = $data["dt"];
    $sunrise = $data["sys"]["sunrise"];
    $sunset = $data["sys"]["sunset"];
    if ($isUpdating) {
        $insertData = "UPDATE weather SET
            weatherstatus = '$weatherStatus', 
            weatherstate='$weatherState', 
            temperature='$temperature', 
            pressure='$pressure', 
            humidity='$humidity', 
            windspeed='$windspeed', 
            direction='$winddirection', 
            icon='$weatherIcon', 
            currentTime='$currentTime', 
            sunrise='$sunrise', 
            sunset='$sunset' 
            WHERE City LIKE '$cityName'";
    } else {
        $insertData = "INSERT INTO weather(City,weatherstatus, weatherstate, temperature, pressure, humidity, windspeed, direction, icon, currentTime, sunrise, sunset)
            VALUES ('$city','$weatherStatus', '$weatherState','$temperature', '$pressure', '$humidity', '$windspeed', '$winddirection', '$weatherIcon', '$currentTime', '$sunrise', '$sunset')";
    }
    if (!mysqli_query($conn, $insertData)) {
        die(json_encode(["error" => "Error inserting data: " . mysqli_error($conn)]));
    }
}

// Getting the latest fetched data 
$result = getData($conn, $cityName);
$rows = [];
while ($row = mysqli_fetch_assoc($result)) {
    $rows[] = $row;
}
$json_data = json_encode($rows);
echo $json_data;
