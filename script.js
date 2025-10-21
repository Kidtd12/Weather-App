const apiKey = "24d2ae15e5d1bc1285b9da6032555312";
const weatherResult = document.getElementById("weather-result");
const cityInput = document.getElementById("city");
const getWeatherBtn = document.getElementById("get-weather-btn");




async function getWeather() {
  const city = cityInput.value.trim();
  if (!city) {
    weatherResult.innerHTML = `<p style="color:#ff6b6b;">⚠️ Please enter a city name/አስገባ</p>`;
    return;
  }

  weatherResult.innerHTML = `<div class="loader"></div> Loading...`;

  try {
    // Call OpenWeatherMap API
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(" city not found /ስህተት " 
          
        );
      } else {
        throw new Error("Failed to fetch weather data.");
      }
    }

    const data = await response.json();
    displayWeather(data);
  } catch (error) {
    weatherResult.innerHTML = `<p style="color:#ff6b6b;">❌ ${error.message}</p>`;
  }
}

function displayWeather(data) {
  const {
    name,
    sys: { country },
    main: { temp, humidity, feels_like },
    weather,
    wind: { speed },
  } = data;

  const weatherDescription = weather[0].description;
  const weatherIcon = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;

  weatherResult.innerHTML = `
    <h2>${name}, ${country}</h2>
    <img src="${weatherIcon}" alt="${weatherDescription}" />
    <p style="font-size:1.3rem; font-weight:700; text-transform:capitalize;">
      ${weatherDescription}
    </p>
    <p>🌡 Temperature: <strong>${temp.toFixed(1)} °C</strong> (Feels like ${feels_like.toFixed(1)} °C)</p>
    <p>💧 Humidity: <strong>${humidity}%</strong></p>
    <p>🌬 Wind Speed: <strong>${speed} m/s</strong></p>
  `;

  cityInput.value = "";
}

// Trigger search on button click
getWeatherBtn.addEventListener("click", getWeather);

// Trigger search on Enter key press inside input
cityInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    getWeather();
  }
});



const weatherContainer = document.getElementById("weather-container");

let isDragging = false;
let startX, startY;
let initialLeft, initialTop;

weatherContainer.style.position = "absolute"; // make it movable
weatherContainer.style.left = "50%";
weatherContainer.style.top = "50%";
weatherContainer.style.transform = "translate(-50%, -50%)";

weatherContainer.addEventListener("mousedown", dragStart);
weatherContainer.addEventListener("touchstart", dragStart);

function dragStart(e) {
  e.preventDefault();

  isDragging = true;

  // Get initial pointer position
  if (e.type === "touchstart") {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  } else {
    startX = e.clientX;
    startY = e.clientY;
  }

  // Get container's current position
  const rect = weatherContainer.getBoundingClientRect();
  initialLeft = rect.left;
  initialTop = rect.top;

  document.addEventListener("mousemove", dragMove);
  document.addEventListener("touchmove", dragMove, { passive: false });
  document.addEventListener("mouseup", dragEnd);
  document.addEventListener("touchend", dragEnd);
}

function dragMove(e) {
  if (!isDragging) return;

  e.preventDefault();

  let currentX, currentY;

  if (e.type === "touchmove") {
    currentX = e.touches[0].clientX;
    currentY = e.touches[0].clientY;
  } else {
    currentX = e.clientX;
    currentY = e.clientY;
  }

  // Calculate new position
  let deltaX = currentX - startX;
  let deltaY = currentY - startY;

  let newLeft = initialLeft + deltaX;
  let newTop = initialTop + deltaY;

  // Optional: constrain movement inside viewport
  const containerRect = weatherContainer.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  const maxLeft = viewportWidth - containerRect.width;
  const maxTop = viewportHeight - containerRect.height;

  if (newLeft < 0) newLeft = 0;
  if (newLeft > maxLeft) newLeft = maxLeft;
  if (newTop < 0) newTop = 0;
  if (newTop > maxTop) newTop = maxTop;

  // Update container position
  weatherContainer.style.left = newLeft + "px";
  weatherContainer.style.top = newTop + "px";
  weatherContainer.style.transform = "none"; // remove centering transform while dragging
}

function dragEnd() {
  isDragging = false;
  document.removeEventListener("mousemove", dragMove);
  document.removeEventListener("touchmove", dragMove);
  document.removeEventListener("mouseup", dragEnd);
  document.removeEventListener("touchend", dragEnd);


  
}






