document.addEventListener("DOMContentLoaded", function () {
  const citySelect = document.getElementById("city-select");
  const forecastDiv = document.getElementById("forecast");
  const loaderDiv = document.getElementById("loader");

  // Load city coordinates from the CSV file (mocked for simplicity)
  const cities = {
    Paris: { lat: 48.8566, lon: 2.3522 },
    Berlin: { lat: 52.52, lon: 13.405 },
    Madrid: { lat: 40.4168, lon: -3.7038 },
    Amsterdam: { lat: 52.367, lon: 4.904 },
    Ankara: { lat: 39.933, lon: 32.859 },
    Åstorp: { lat: 56.134, lon: 12.945 },
    Athens: { lat: 37.983, lon: 23.727 },
    Belfast: { lat: 54.597, lon: -5.93 },
    Barcelona: { lat: 41.387, lon: 2.168 },
    Bern: { lat: 46.948, lon: 7.447 },
    Bilbao: { lat: 43.263, lon: -2.935 },
    Brussels: { lat: 50.847, lon: 4.357 },
    Bucharest: { lat: 47.497, lon: 19.04 },
    Budapest: { lat: 59.329, lon: 18.068 },
    Cardiff: { lat: 51.483, lon: -3.168 },
    Cologne: { lat: 50.937, lon: 6.96 },
    Copenhagen: { lat: 55.676, lon: 12.568 },
    Cork: { lat: 51.898, lon: -8.475 },
    Dublin: { lat: 53.349, lon: -6.26 },
    Edinburgh: { lat: 55.953, lon: -3.188 },
    Florence: { lat: 43.7696, lon: 11.255 },
    Frankfurt: { lat: 50.11, lon: 8.682 },
    "French Riviera": { lat: 43.254, lon: 6.637 },
    Funchal: { lat: 32.65, lon: -16.908 },
    Gibraltar: { lat: 36.14, lon: -5.353 },
    Gothenburg: { lat: 57.708, lon: 11.974 },
    Hamburg: { lat: 53.548, lon: 9.987 },
    Helsinki: { lat: 60.169, lon: 24.938 },
    Ibiza: { lat: 39.02, lon: 1.482 },
    Kyiv: { lat: 50.45, lon: 30.523 },
    Lillehammer: { lat: 61.115, lon: 10.466 },
    Lisbon: { lat: 38.722, lon: -9.139 },
    London: { lat: 51.507, lon: -0.127 },
    Mallorca: { lat: 39.695, lon: 3.017 },
    Manchester: { lat: 53.48, lon: -2.242 },
    Marseille: { lat: 43.296, lon: 5.369 },
    Maspalomas: { lat: 27.76, lon: -15.586 },
    Milan: { lat: 45.464, lon: 9.19 },
    Munich: { lat: 48.135, lon: 11.582 },
    Naples: { lat: 40.851, lon: 14.268 },
    Oñati: { lat: 43.034, lon: -2.417 },
    Oslo: { lat: 59.913, lon: 10.752 },
    Prague: { lat: 50.075, lon: 14.437 },
    Reykjavík: { lat: 64.146, lon: -21.942 },
    Riga: { lat: 56.879, lon: 24.603 },
    Rome: { lat: 41.902, lon: 12.496 },
    "Santa Cruz das Flores": { lat: 39.453, lon: -31.127 },
    "Santa Cruz de Tenerife": { lat: 28.463, lon: -16.251 },
    Skye: { lat: 57.273, lon: -6.215 },
    Sofia: { lat: 42.697, lon: 23.321 },
    Stockholm: { lat: 59.329, lon: 18.068 },
    Tallinn: { lat: 59.437, lon: 24.753 },
    Vienna: { lat: 18.208, lon: 16.373 },
    Warsaw: { lat: 52.229, lon: 21.012 },
    York: { lat: 53.961, lon: -1.07 },
    Zurich: { lat: 47.376, lon: 8.541 },
    // Add more cities based on your CSV file
  };

  // Populate the city select dropdown
  for (const city in cities) {
    const option = document.createElement("option");
    option.value = city;
    option.text = city;
    citySelect.appendChild(option);
  }

  // Handle form submission
  document
    .getElementById("city-form")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      const selectedCity = citySelect.value;
      const coords = cities[selectedCity];

      showLoader(); // Show loader before making API request

      // Make API request to 7Timer
      fetch(
        `https://www.7timer.info/bin/api.pl?lon=${coords.lon}&lat=${coords.lat}&product=civillight&output=json`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          displayForecast(data);
        })
        .catch((error) => {
          forecastDiv.innerHTML = `<p class="text-danger">Failed to retrieve data. Please try again later.</p>`;
          console.error("Error:", error);
        })
        .finally(() => {
          hideLoader(); // Hide loader after API request is complete
        });
    });

  // Function to display the forecast
  function displayForecast(data) {
    let forecastHTML = "";
    data.dataseries.forEach((item, index) => {
      if (index < 7) {
        // Display 7-day forecast
        const weatherImage = getWeatherImage(item.weather);
        const maxTemp = item.temp2m.max || "N/A"; // Handle cases where maxTemp might be undefined
        const minTemp = item.temp2m.min || "N/A"; // Handle cases where minTemp might be undefined
        forecastHTML += `
                    <div class="col-12 col-md-4 mb-4">
                        <div class="card box">
                          <img src="${weatherImage}" class="card-img-top" alt="${
          item.weather
        }">
                              <div class="card-body">
                            <h5 class="card-title">Day ${index + 1}</h5>
              <p class="card-text">Temperature: ${maxTemp}°C / ${minTemp}°C</p>
              <p class="card-text">Weather: ${item.weather}</p>
          </div>
      </div>
  </div>
                `;
      }
    });

    forecastDiv.innerHTML = forecastHTML;
  }

  // Function to get the correct image based on weather type
  function getWeatherImage(weather) {
    const weatherImages = {
      clear: "../images/clear.png",
      cloudy: "../images/cloudy.png",
      fog: "../images/fog.png",
      humid: "../images/humid.png",
      lightsnow: "../images/lightsnow.png",
      pcloudy: "../images/pcloudy.png",
      rain: "../images/rain.png",
      rainsnow: "../images/rainsnow.png",
      tsrain: "../images/tsrain.png",
      tstorm: "../images/tstorm.png",
      windy: "../images/windy.png",
      lightrain: "../images/lightrain.png",
      oshower: "../images/oshower.png",
      snow: "../images/snowy.png",
      cloudynight: "../images/cloudy.png",
      cloudyday: "../images/cloudy.png",
      ishower: "../images/ishower.png",
      mcloudy: "../images/mcloudy.png",
      // Add more weather types as needed
    };

    return weatherImages[weather] || "../images/default.png"; // Return default image if no match
  }

  function showLoader() {
    loaderDiv.style.visibility = "visible";
  }

  function hideLoader() {
    loaderDiv.style.visibility = "hidden";
  }
});
