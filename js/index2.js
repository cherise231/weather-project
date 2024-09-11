console.log("javascript is working!");

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