console.log("javascript is working!");

fetch(
  `https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&temperature_unit=fahrenheit&precipitation_unit=inch&timezone=America%2FLos_Angeles`
)
  .then((response) => response.json())
  .then((data) => {
    const currentWeather = data.current_weather;
    // const weatherHTML = `
    //   <h2>Current Weather</h2>
    //   <p>Temperature: ${currentWeather.temperature}°F</p>
    //   <p>Relative Humidity: ${currentWeather.relativehumidity}%</p>
    //   <p>Apparent Temperature: ${currentWeather.apparent_temperature}°F</p>
    //   <p>Is Day: ${currentWeather.is_day ? "Yes" : "No"}</p>
    //   <p>Precipitation: ${currentWeather.precipitation} inches</p>
    //   <p>Rain: ${currentWeather.rain} inches</p>
    //   <p>Showers: ${currentWeather.showers} inches</p>
    //   <p>Snowfall: ${currentWeather.snowfall} inches</p>
    //   <p>Weather Code: ${currentWeather.weathercode}</p>
    //   <p>Cloud Cover: ${currentWeather.cloudcover}%</p>
    //   <p>Pressure MSL: ${currentWeather.pressure_msl} hPa</p>
    //   <p>Surface Pressure: ${currentWeather.surface_pressure} hPa</p>
    //   <p>Wind Speed: ${currentWeather.windspeed_10m} mph</p>
    //   <p>Wind Direction: ${currentWeather.winddirection_10m}°</p>
    //   <p>Wind Gusts: ${currentWeather.windgusts_10m} mph</p>
    // `;
    document.getElementById("weather-container").innerHTML = weatherHTML;
  })
  .catch((error) => {
    console.error("An error occurred:", error.message);
    console.error("Error stack:", error.stack);
  });

const url =
  "https://api.open-meteo.com/v1/forecast?latitude=37.7749&longitude=-122.4194&current=temperature_2m,rain&hourly=temperature_2m,rain&daily=temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&timezone=America%2FLos_Angeles&past_days=1";

fetch(url)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Request failed");
    }
    return response.json(); // Parse the response as JSON
  })
  .then((data) => {
    console.log(data); // Do something with the data

    const hourlyTemperatures = data.hourly.temperature_2m;

    hourlyTemperatures.forEach((temperature, index) => {
      console.log(`Hour ${index + 1}: ${temperature}`);
    });

    displayWeatherData(data);
  })

  .catch((error) => {
    console.error("An error occurred:", error);
  });

// functions to get the day and time
function getDay(dateTime) {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dayIndex = dateTime.getDay();
  console.log("getDay");
  return days[dayIndex];
}

function getTime(dateTime) {
  let hours = dateTime.getHours();
  const minutes = dateTime.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${hours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
}

function displayWeatherData(data) {
  const hourlyTemperatures = data.hourly.temperature_2m;
  const hourlyTimes = data.hourly.time;

  // hourly data by day
  const dayData = {};

  hourlyTemperatures.forEach((temperature, index) => {
    const dateTime = new Date(hourlyTimes[index]);
    const day = getDay(dateTime) + ", " + getMonthDate(dateTime);
    const timeString = getTime(dateTime);
    const temperatureString = `${temperature.toFixed(1)}°F`;

    if (!dayData[day]) {
      dayData[day] = [];
    }

    dayData[day].push({ time: timeString, temperature: temperatureString });
  });

  // weather content
  let weatherHTML = "<table>";
  // weatherHTML += `
  //   <thead>
  //     <tr></tr>
  //   </thead>
  //   <tbody>
  // `;

  for (const [day, times] of Object.entries(dayData)) {
    //row for the day title
    weatherHTML += `<tr><td colspan="3" class="day-title"><strong>${day}</strong></td></tr>`;

    //rows for each hourly entry
    times.forEach((point) => {
      weatherHTML += `
        <tr>
          <td>${point.time}</td>
          <td>${point.temperature}</td>
        </tr>
      `;
    });
  }

  weatherHTML += "</tbody></table>";

  const chartElement = document.getElementById("weather-chart");
  if (chartElement) {
    chartElement.innerHTML = weatherHTML;
  } else {
    console.error("Element with ID 'weather-chart' not found.");
  }
}

// function to format month and date
function getMonthDate(dateTime) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = months[dateTime.getMonth()];
  const date = dateTime.getDate();
  return `${month} ${date}`;
}

//todays weather
// fetch(
//   `https://api.open-meteo.com/v1/forecast?latitude=37.7749&longitude=-122.4194&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&temperature_unit=fahrenheit&precipitation_unit=inch&timezone=America%2FLos_Angeles`
// )
//   .then((response) => response.json())
//   .then((data) => {
//     if (data && data.current) {
//       const currentWeather = data.current;
//       const currentUnits = data.current_units;
//       const weatherHTML = `
//           <h2>Current Weather</h2>
          
//           <div class="weather-info">
//           <div class="temp-container">
//             <h3><span> ${
//               currentWeather.temperature_2m
//             }</span> <span class="temp-unit">${
//         currentUnits.temperature_2m
//       }</span></h3>
//           </div>

//           <div class="weather-details">
//           <div class="preview-weather-info-shown">
//             <p><span>Relative Humidity:</span> ${
//               currentWeather.relative_humidity_2m
//             } ${currentUnits.relative_humidity_2m}</p>
//             <p><span>Apparent Temperature:</span> ${
//               currentWeather.apparent_temperature
//             } ${currentUnits.apparent_temperature}</p>
//             <p><span>Is Day:</span> ${currentWeather.is_day ? "Yes" : "No"}</p>
//             </div>

//             <div class="hidden-weather-info hidden">
//             <p><span>Precipitation:</span> ${currentWeather.precipitation} ${
//         currentUnits.precipitation
//       }</p>
//             <p><span>Rain:</span> ${currentWeather.rain} ${
//         currentUnits.rain
//       }</p>
//             <p><span>Showers:</span> ${currentWeather.showers} ${
//         currentUnits.showers
//       }</p>
//             <p><span>Snowfall:</span> ${currentWeather.snowfall} ${
//         currentUnits.snowfall
//       }</p>
//             <p><span>Weather Code:</span> ${currentWeather.weather_code} ${
//         currentUnits.weather_code
//       }</p>
//             <p><span>Cloud Cover:</span> ${currentWeather.cloud_cover} ${
//         currentUnits.cloud_cover
//       }</p>
//             <p><span>Pressure MSL:</span> ${currentWeather.pressure_msl} ${
//         currentUnits.pressure_msl
//       }</p>
//             <p><span>Surface Pressure:</span> ${
//               currentWeather.surface_pressure
//             } ${currentUnits.surface_pressure}</p>
//             <p><span>Wind Speed:</span> ${currentWeather.wind_speed_10m} ${
//         currentUnits.wind_speed_10m
//       }</p>
//             <p><span>Wind Direction:</span> ${
//               currentWeather.wind_direction_10m
//             } ${currentUnits.wind_direction_10m}</p>
//             <p><span>Wind Gusts:</span> ${currentWeather.wind_gusts_10m} ${
//         currentUnits.wind_gusts_10m
//       }</p>
//       </div>
//           </div>
//             <button class="see-more-btn">See More</button>
//           </div>
//         `;

//       document.getElementById("weather-container").innerHTML = weatherHTML;

//       //  See More button
//       document.querySelector(".see-more-btn").addEventListener("click", () => {
//         const hiddenWeatherInfo = document.querySelector(
//           ".hidden-weather-info"
//         );
//         hiddenWeatherInfo.classList.toggle("hidden");
//         if (hiddenWeatherInfo.classList.contains("hidden")) {
//           document.querySelector(".see-more-btn").textContent = "See More";
//         } else {
//           document.querySelector(".see-more-btn").textContent = "See Less";
//         }
//       });
//     } else {
//       console.error("Error: No current weather data available.");
//       document.getElementById("weather-container").innerHTML =
//         "Error: No current weather data available.";
//     }
//   })
//   .catch((error) => {
//     console.error("An error occurred:", error.message);
//     console.error("Error stack:", error.stack);
//   });