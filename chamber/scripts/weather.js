// weather.js – Abuja Chamber of Commerce
// Loads REAL current weather + a labeled 3-day forecast from
// OpenWeatherMap for the chamber's location (Abuja, Nigeria).
//
// SETUP REQUIRED: sign up for a free key at https://openweathermap.org/api
// and paste it below. New keys can take up to ~2 hours to activate.

const WEATHER_API_KEY = '7728c0884336b9e549dad7f7bd3809b5';
const ABUJA_LAT = 9.0765;
const ABUJA_LON = 7.3986;

document.addEventListener('DOMContentLoaded', function () {
  // only run on pages that actually have the weather widget
  if (!document.getElementById('tempValue')) return;

  loadCurrentWeather();
  loadForecast();
});

async function loadCurrentWeather() {
  const tempEl = document.getElementById('tempValue');
  const descEl = document.getElementById('weatherDesc');
  const humidityEl = document.getElementById('humidity');
  const windEl = document.getElementById('windSpeed');

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${ABUJA_LAT}&lon=${ABUJA_LON}&units=metric&appid=${WEATHER_API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Current weather request failed with status ${response.status}`);
    }
    const data = await response.json();

    if (tempEl) tempEl.textContent = Math.round(data.main.temp);
    if (descEl) descEl.textContent = capitalize(data.weather[0].description);
    if (humidityEl) humidityEl.textContent = data.main.humidity;
    if (windEl) windEl.textContent = Math.round(data.wind.speed * 3.6); // m/s -> km/h
  } catch (error) {
    console.error('Could not load current weather:', error);
    if (descEl) descEl.textContent = 'Weather unavailable';
  }
}

async function loadForecast() {
  const forecastContainer = document.getElementById('forecastContainer');
  if (!forecastContainer) return;

  try {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${ABUJA_LAT}&lon=${ABUJA_LON}&units=metric&appid=${WEATHER_API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Forecast request failed with status ${response.status}`);
    }
    const data = await response.json();
    const threeDays = extractThreeDayForecast(data.list);
    displayForecast(threeDays, forecastContainer);
  } catch (error) {
    console.error('Could not load forecast:', error);
    forecastContainer.innerHTML = '<p class="weather-error">3-day forecast unavailable right now.</p>';
  }
}

// The free /forecast endpoint returns data in 3-hour blocks for 5 days.
// Pick one entry per upcoming day (close to midday) to build a clean 3-day forecast.
function extractThreeDayForecast(list) {
  const todayStr = new Date().toISOString().slice(0, 10);
  const seenDates = new Set([todayStr]);
  const picks = [];

  for (const entry of list) {
    const entryDate = entry.dt_txt.slice(0, 10);
    const entryHour = entry.dt_txt.slice(11, 13);
    if (!seenDates.has(entryDate) && entryHour === '12') {
      seenDates.add(entryDate);
      picks.push(entry);
      if (picks.length === 3) break;
    }
  }
  return picks;
}

function displayForecast(days, container) {
  const dayLabels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  container.innerHTML = days.map(day => {
    const date = new Date(day.dt * 1000);
    const label = dayLabels[date.getDay()];
    const temp = Math.round(day.main.temp);
    const desc = capitalize(day.weather[0].description);
    return `
      <div class="forecast-day">
        <p class="forecast-label">${label}</p>
        <p class="forecast-temp">${temp}&deg;C</p>
        <p class="forecast-desc">${desc}</p>
      </div>
    `;
  }).join('');
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
