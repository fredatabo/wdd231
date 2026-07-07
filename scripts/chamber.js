// script.js – Abuja Chamber of Commerce
// Interactive features: mobile menu toggle + weather simulation

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // ----- MOBILE NAV TOGGLE -----
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function (e) {
      e.stopPropagation();
      navLinks.classList.toggle('open');
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (e) {
      if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('open');
      }
    });

    // Close menu on escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
      }
    });
  }

  // ----- WEATHER SIMULATION (dynamic update) -----
  const tempEl = document.getElementById('tempValue');
  const descEl = document.getElementById('weatherDesc');
  const humidityEl = document.getElementById('humidity');
  const windEl = document.getElementById('windSpeed');
  const refreshIcon = document.getElementById('refreshWeather');

  // Abuja weather data sets (simulated realistic values)
  const weatherConditions = [
    { temp: 28, desc: 'Partly Cloudy', humidity: 62, wind: 14 },
    { temp: 31, desc: 'Sunny', humidity: 45, wind: 10 },
    { temp: 26, desc: 'Light Rain', humidity: 78, wind: 8 },
    { temp: 29, desc: 'Clear Sky', humidity: 55, wind: 12 },
    { temp: 27, desc: 'Scattered Clouds', humidity: 68, wind: 16 },
    { temp: 30, desc: 'Mostly Sunny', humidity: 50, wind: 9 }
  ];

  let currentWeatherIndex = 0;

  function updateWeather(index) {
    const data = weatherConditions[index % weatherConditions.length];
    if (tempEl) tempEl.textContent = data.temp;
    if (descEl) descEl.textContent = data.desc;
    if (humidityEl) humidityEl.textContent = data.humidity;
    if (windEl) windEl.textContent = data.wind;
  }

  // initial random weather
  function setRandomWeather() {
    const randomIndex = Math.floor(Math.random() * weatherConditions.length);
    currentWeatherIndex = randomIndex;
    updateWeather(randomIndex);
  }

  // refresh on icon click (rotate through conditions)
  if (refreshIcon) {
    refreshIcon.addEventListener('click', function () {
      currentWeatherIndex = (currentWeatherIndex + 1) % weatherConditions.length;
      updateWeather(currentWeatherIndex);
      // subtle feedback: rotate icon
      this.style.transform = 'rotate(360deg)';
      setTimeout(() => { this.style.transform = 'rotate(0deg)'; }, 400);
    });
  }

  // set initial weather on page load
  setRandomWeather();

  // optional: auto-refresh every 60 seconds (uncomment if desired)
  // setInterval(() => {
  //   currentWeatherIndex = (currentWeatherIndex + 1) % weatherConditions.length;
  //   updateWeather(currentWeatherIndex);
  // }, 60000);

  // ----- ADDITIONAL: smooth hover effect for spotlights (optional) -----
  const spotlightItems = document.querySelectorAll('.spotlight-item');
  spotlightItems.forEach(item => {
    item.addEventListener('mouseenter', function () {
      this.style.backgroundColor = '#f8f6f0';
      this.style.transition = 'background 0.2s';
    });
    item.addEventListener('mouseleave', function () {
      this.style.backgroundColor = 'transparent';
    });
  });

  // ----- CONSOLE WELCOME (developer friendly) -----
  console.log('🏛️ Abuja Chamber of Commerce — Home page loaded.');
  console.log('🌤️ Weather data is simulated for demonstration.');
});