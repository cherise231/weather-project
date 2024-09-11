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
  const date = dateTime.getDate();
  return `${month} ${date}`;
}

fetch(
  `https://api.open-meteo.com/v1/forecast?latitude=37.7749&longitude=-122.4194&current=temperature_2m,rain,showers&daily=temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&timezone=America%2FLos_Angeles&start_date=2024-09-02&end_date=2024-09-08`
)
  .then((response) => response.json())
  .then((data) => {
    console.log("Data:", data); // Add this line to see the data response
    const dailyData = data.daily;
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let calendarHTML = "<table><tr>";

    // Create table headers for each day of the week
    daysOfWeek.forEach((day) => {
      calendarHTML += `<th>${day}</th>`;
    });
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
    const formattedDate = date.toISOString().split('T')[0]; // Format date to 'YYYY-MM-DD'
  
    let hourlyWeatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m&temperature_unit=fahrenheit&precipitation_unit=inch&timezone=America%2FLos_Angeles`;
    window.location.href = "index2.html";

    fetch(hourlyWeatherUrl)
    .then(response => response.json())
    .then(data => {
      console.log(data); // Add this line to inspect the API response data
      let hourlyWeatherContainer = document.getElementById("hourly-weather-container");
      if (hourlyWeatherContainer) {
        const hourlyWeatherHTML = "";
        data.hourly.time.forEach((hour, index) => {
          const temperature = data.hourly.temperature_2m[index];
          hourlyWeatherHTML += `<p>Hour ${hour}: ${temperature.toFixed(1)}°F</p>`;
        });
        hourlyWeatherContainer.innerHTML = hourlyWeatherHTML;
      } else {
        console.error("Error: Could not find element with id 'hourly-weather-container'");
      }
    })
    .catch(error => {
      console.error("Error fetching hourly weather data:", error);
    });
  }

