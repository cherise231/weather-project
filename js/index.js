console.log("javascript is working!");

//  main page

function getMonthDate(dateTime) {
  const monthNames = [
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
  const month = monthNames[dateTime.getMonth()];
  console.log(month, "month");
  const date = dateTime.getDate();
  console.log(date, ":date");

  return `${month} ${date}`;
}

function getWeatherDescription(weatherCode) {
  const weatherDescriptions = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Drizzle: Light intensity",
    53: "Drizzle: Moderate intensity",
    55: "Drizzle: Dense intensity",
    56: "Freezing Drizzle: Light intensity",
    57: "Freezing Drizzle: Dense intensity",
    61: "Rain: Slight intensity",
    63: "Rain: Moderate intensity",
    65: "Rain: Heavy intensity",
    66: "Freezing Rain: Light intensity",
    67: "Freezing Rain: Heavy intensity",
    71: "Snow fall: Slight intensity",
    73: "Snow fall: Moderate intensity",
    75: "Snow fall: Heavy intensity",
    77: "Snow grains",
    80: "Rain showers: Slight intensity",
    81: "Rain showers: Moderate intensity",
    82: "Rain showers: Violent intensity",
    85: "Snow showers: Slight intensity",
    86: "Snow showers: Heavy intensity",
    95: "Thunderstorm: Slight or moderate",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail",
  };

  return weatherDescriptions[weatherCode] || "Unknown weather code";
}

function showHourlyWeather(dateString) {
  const selectedDate = new Date(dateString);
  const formattedDate = selectedDate.toISOString().split("T")[0]; // Format to YYYY-MM-DD

  fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=37.7749&longitude=-122.4194&hourly=temperature_2m,weather_code&temperature_unit=fahrenheit&timezone=America%2FLos_Angeles`
  )
    .then((response) => response.json())
    .then((data) => {
      const hourly = data.hourly;
      if (!hourly) {
        console.error("Error: No 'hourly' data found in the API response.");
        return;
      }

      const hourlyTime = hourly.time;
      const hourlyTemperatures = hourly.temperature_2m;
      const hourlyWeatherCodes = hourly.weather_code;

      // Convert hourly times to Date objects
      const hourlyDates = hourlyTime.map((time) => new Date(time));

      let startIndex = hourlyDates.findIndex((date) => {
        const hour = date.getHours();
        return date.toISOString().split("T")[0] === formattedDate && hour === 0;
      });

      let hourlyWeather = [];

      // Retrieve hourly weather data for the selected day
      for (let i = startIndex; i < startIndex + 24; i++) {
        const date = hourlyDates[i];

        // Check if hourlyWeatherCodes array has the same length as hourlyDates array
        if (i >= hourlyWeatherCodes.length) {
          console.error("Error: hourlyWeatherCodes array is not long enough.");
          break;
        }
        console.log(hourlyWeatherCodes, "hourlyWeatherCodes");

        hourlyWeather.push({
          time: date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          temperature: hourlyTemperatures[i].toFixed(1) + "°F",
          weatherCode: hourlyWeatherCodes[i],
          description: getWeatherDescription(hourlyWeatherCodes[i]),
        });
      }

      // Prints the hourly weather data for the specified date
      const [year, month, day] = formattedDate.split("-");
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sept",
        "Oct",
        "Nov",
        "Dec",
      ];
      const formattedDateString = `${months[month - 1]} ${day}, ${year}`;

      let hourlyWeatherHTML = `
        <h2>Hourly Weather for <br>${formattedDateString}</h2>
        <table>
          <tr>
            <th>Hour</th>
            <th>Temperature (°F)</th>
            <th>Weather Code</th>
            <th>Description</th>
          </tr>
      `;

      hourlyWeather.forEach((hourlyData) => {
        const hour = hourlyData.time;

        hourlyWeatherHTML += `
          <tr>
            <td>${hour}</td>
            <td>${hourlyData.temperature}</td>
            <td>${hourlyData.weatherCode}</td>
            <td>${hourlyData.description}</td>
          </tr>
        `;
      });

      hourlyWeatherHTML += `</table>`;

      const hourlyWeatherContainer = document.getElementById("hourly-weather");
      if (hourlyWeatherContainer) {
        hourlyWeatherContainer.innerHTML = hourlyWeatherHTML;
        hourlyWeatherContainer.style.display = "block"; // Show hourly weather
      } else {
        console.error("Error: Could not find element with id 'hourly-weather'");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function fetchDailyData() {
  fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=37.7749&longitude=-122.4194&current=temperature_2m&hourly=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,rain_sum,showers_sum&temperature_unit=fahrenheit&timezone=America%2FLos_Angeles`
  )
    .then((response) => response.json())
    .then((data) => {
      const dailyData = data.daily;

      const today = new Date();
      // const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
      // const startDay = tomorrow.getDay();
      const startDay = today.getDay();
      const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]; // get the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
      let calendarHTML = "<table><tr>";

      // daysOfWeek.forEach((day) => {
      //   calendarHTML += `<th>${day}</th>`;
      // });

      for (let i = startDay; i < startDay + 7; i++) {
        const dayIndex = i % 7;
        calendarHTML += `<th>${daysOfWeek[dayIndex]}</th>`;
      }

      calendarHTML += "</tr><tr>";

      dailyData.time.forEach((time, index) => {
        const dateTime = new Date(time);
        dateTime.setDate(dateTime.getDate() + 1);
        const date = getMonthDate(dateTime);
        const highTemp = dailyData.temperature_2m_max[index];
        const lowTemp = dailyData.temperature_2m_min[index];

        if (isNaN(highTemp) || isNaN(lowTemp)) {
          console.error(
            `Invalid temperature values: highTemp=${highTemp}, lowTemp=${lowTemp}`
          );
          return;
        }

        const dayHTML = `
          <td>
            <button onclick="showHourlyWeather('${time}')">
              <h2>${date}</h2>
              <p>High: ${highTemp.toFixed(1)}°F</p>
              <p>Low: ${lowTemp.toFixed(1)}°F</p>
            </button>
          </td>
        `;
        calendarHTML += dayHTML;
      });

      calendarHTML += "</tr></table>";

      const calendarContainer = document.getElementById("calendar");
      if (calendarContainer) {
        calendarContainer.innerHTML = calendarHTML;
      } else {
        console.error("Error: Could not find element with id 'calendar'");
      }
    })
    .catch((error) => {
      console.error("An error occurred:", error.message);
    });
}

document.addEventListener("DOMContentLoaded", () => {
  fetchDailyData(); // Load daily data on page load
});

// todays weather
fetch(
  `https://api.open-meteo.com/v1/forecast?latitude=37.7749&longitude=-122.4194&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&temperature_unit=fahrenheit&precipitation_unit=inch&timezone=America%2FLos_Angeles`
)
  .then((response) => response.json())
  .then((data) => {
    if (data && data.current) {
      const currentWeather = data.current;
      const currentUnits = data.current_units;
      const weatherHTML = `
          <h2>Current Weather</h2>
          
          <div class="weather-info">
          <div class="temp-container">
            <h3><span> ${
              currentWeather.temperature_2m
            }</span> <span class="temp-unit">${
        currentUnits.temperature_2m
      }</span></h3>
          </div>

          <div class="weather-details">
          <div class="preview-weather-info-shown">
            <p><span>Relative Humidity:</span> ${
              currentWeather.relative_humidity_2m
            } ${currentUnits.relative_humidity_2m}</p>
            <p><span>Apparent Temperature:</span> ${
              currentWeather.apparent_temperature
            } ${currentUnits.apparent_temperature}</p>
            <p><span>Is Day:</span> ${currentWeather.is_day ? "Yes" : "No"}</p>
            </div>

            <div class="hidden-weather-info hidden">
            <p><span>Precipitation:</span> ${currentWeather.precipitation} ${
        currentUnits.precipitation
      }</p>
            <p><span>Rain:</span> ${currentWeather.rain} ${
        currentUnits.rain
      }</p>
            <p><span>Showers:</span> ${currentWeather.showers} ${
        currentUnits.showers
      }</p>
            <p><span>Snowfall:</span> ${currentWeather.snowfall} ${
        currentUnits.snowfall
      }</p>
            <p><span>Weather Code:</span> ${currentWeather.weather_code} ${
        currentUnits.weather_code
      }</p>
            <p><span>Cloud Cover:</span> ${currentWeather.cloud_cover} ${
        currentUnits.cloud_cover
      }</p>
            <p><span>Pressure MSL:</span> ${currentWeather.pressure_msl} ${
        currentUnits.pressure_msl
      }</p>
            <p><span>Surface Pressure:</span> ${
              currentWeather.surface_pressure
            } ${currentUnits.surface_pressure}</p>
            <p><span>Wind Speed:</span> ${currentWeather.wind_speed_10m} ${
        currentUnits.wind_speed_10m
      }</p>
            <p><span>Wind Direction:</span> ${
              currentWeather.wind_direction_10m
            } ${currentUnits.wind_direction_10m}</p>
            <p><span>Wind Gusts:</span> ${currentWeather.wind_gusts_10m} ${
        currentUnits.wind_gusts_10m
      }</p>
      </div>
          </div>
            <button class="see-more-btn">See More</button>
          </div>
        `;

      document.getElementById("weather-container").innerHTML = weatherHTML;

      //  See More button
      document.querySelector(".see-more-btn").addEventListener("click", () => {
        const hiddenWeatherInfo = document.querySelector(
          ".hidden-weather-info"
        );
        hiddenWeatherInfo.classList.toggle("hidden");
        if (hiddenWeatherInfo.classList.contains("hidden")) {
          document.querySelector(".see-more-btn").textContent = "See More";
        } else {
          document.querySelector(".see-more-btn").textContent = "See Less";
        }
      });
    } else {
      console.error("Error: No current weather data available.");
      document.getElementById("weather-container").innerHTML =
        "Error: No current weather data available.";
    }
  })
  .catch((error) => {
    console.error("An error occurred:", error.message);
    console.error("Error stack:", error.stack);
  });
