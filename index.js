console.log("javascript is working!");

// const cityName = "San Francisco";
// const latitude = 37.77;
// const longitude = -122.42;

// fetch(`https://api.open-meteo.com/v1/forecast?current_weather=true&q=${latitude},${longitude}`)
//   .then(response => {
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     } else {
//       return response.text();
//     }
//   })
//   .then(responseText => {
//     console.log("Response text:", responseText);
//     let data;
//     try {
//       data = JSON.parse(responseText);
//       console.log(data);
//     } catch (error) {
     
//     }
//     console.log(data); 
//     if (data) {
//       const daily = data.daily;
//       const highTemp = daily.temperature_2m_max[0];
//       const lowTemp = daily.temperature_2m_min[0];

//       console.log(`Weather in ${cityName}:`);
//       console.log(`High Temperature: ${highTemp}°C`);
//       console.log(`Low Temperature: ${lowTemp}°C`);
//     } else {
//       console.log("Failed to parse JSON response.");
//     }
//   })
//   .catch(error => console.error("Error:", error));

const url =
  "https://api.open-meteo.com/v1/forecast?latitude=37.77&longitude=-122.42&current=temperature_2m&hourly=temperature_2m&temperature_unit=fahrenheit&models=gfs_seamless";

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
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
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
    const weatherElement = document.getElementsByClassName("weather-dashboard")[0];
    const hourlyTemperatures = data.hourly.temperature_2m;
    const hourlyTimes = data.hourly.time;
  
   let weatherHTML = "";  // Initialize an empty string to build the weather HTML
  
    hourlyTemperatures.forEach((temperature, index) => {
      const dateTime = new Date(hourlyTimes[index]);
      const day = getDay(dateTime);
      const timeString = getTime(dateTime);
      //weatherHTML += `${day} ${timeString}: ${temperature}°F<br>`;  Build the weather HTML
    });
  
    weatherElement.innerHTML = weatherHTML; // Update the element's innerHTML with the weather data
  
    // Create the chart data array
    const chartData = hourlyTemperatures.map((temperature, index) => {
      const dateTime = new Date(hourlyTimes[index]);
      const day = getDay(dateTime);
      const timeString = getTime(dateTime);
      return { day, time: timeString, temperature };
    });
  
    // Create a table chart
    const tableHTML = `
      <table>
        <tr>
          <th>Day</th>
          <th>Time</th>
          <th>Temperature (°F)</th>
        </tr>
        ${chartData.map((point) => `
          <tr>
            <td>${point.day}</td>
            <td>${point.time}</td>
            <td>${point.temperature}</td>
          </tr>
          
        `).join("")}
      </table>
    `;
  
    const chartElement = document.getElementById("weather-chart");
    chartElement.innerHTML = tableHTML;

  }