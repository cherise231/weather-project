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
    "Sept",
    "October",
    "November",
    "December",
  ];
  const month = monthNames[dateTime.getMonth()];
  console.log(month, "month");

  const date = dateTime.getDate();
  console.log(date, "date")
  return `${month} ${date}`;
}

fetch(
  `https://api.open-meteo.com/v1/forecast?latitude=37.7749&longitude=-122.4194&current=temperature_2m,rain,showers&daily=temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&timezone=America%2FLos_Angeles&start_date=2024-09-09&end_date=2024-09-15`
)
  .then((response) => response.json())
  .then((data) => {
    console.log("Data:", data);
    const dailyData = data.daily;

    const today = new Date();
    // const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    const startDay = today.getDay(); // get the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)

    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let calendarHTML = "<table><tr>";

    // Create table headers for each day of the week
    // daysOfWeek.forEach((day) => {
    //   calendarHTML += `<th>${day}</th>`;
    // });

    //table headers for each day of the week
    for (let i = startDay; i < startDay + 7; i++) {
      const dayIndex = i % 7; 
      calendarHTML += `<th>${daysOfWeek[dayIndex]}</th>`
    }

    calendarHTML += "</tr><tr>";

    dailyData.time.forEach((time, index) => {
      const dateTime = new Date(time); // Parse the time string into a Date object
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
      <button onclick="showHourlyWeather(${time})">
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
    console.error("Error stack:", error.stack);
  });

function showHourlyWeather(time) {
  const date = new Date(time);
  const formattedDate = date.toISOString().split("T")[0]; // Format date to 'YYYY-MM-DD'

  let hourlyWeatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m&temperature_unit=fahrenheit&precipitation_unit=inch&timezone=America%2FLos_Angeles`;
  window.location.href = "index2.html";

  fetch(hourlyWeatherUrl)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      let hourlyWeatherContainer = document.getElementById(
        "hourly-weather-container"
      );
      if (hourlyWeatherContainer) {
        const hourlyWeatherHTML = "";
        data.hourly.time.forEach((hour, index) => {
          const temperature = data.hourly.temperature_2m[index];
          hourlyWeatherHTML += `<p>Hour ${hour}: ${temperature.toFixed(
            1
          )}°F</p>`;
        });
        hourlyWeatherContainer.innerHTML = hourlyWeatherHTML;
      } else {
        console.error(
          "Error: Could not find element with id 'hourly-weather-container'"
        );
      }
    })
    .catch((error) => {
      console.error("Error fetching hourly weather data:", error);
    });
    
}




//current weather
fetch(
  `https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&temperature_unit=fahrenheit&precipitation_unit=inch&timezone=America%2FLos_Angeles`
)
  .then((response) => response.json())
  .then((data) => {
    if (data && data.current) {
      const currentWeather = data.current;
      const currentUnits = data.current_units;
      const weatherHTML = `
          <h2>Current Weather</h2>
          <div class="weather-info">
            <p><span>Temperature:</span> ${currentWeather.temperature_2m} ${
        currentUnits.temperature_2m
      }</p>
            <p><span>Relative Humidity:</span> ${
              currentWeather.relative_humidity_2m
            } ${currentUnits.relative_humidity_2m}</p>
            <p><span>Apparent Temperature:</span> ${
              currentWeather.apparent_temperature
            } ${currentUnits.apparent_temperature}</p>
            <p><span>Is Day:</span> ${currentWeather.is_day ? "Yes" : "No"}</p>

            <div class="hidden-weather-info hidden"> <!-- Add the hidden class here -->
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