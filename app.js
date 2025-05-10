if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/leaflog/sw.js', {
        scope: '/leaflog/'
    });
}

async function getLocalWeather() {
    const weatherDiv = document.getElementById('weatherInfo');
    try {
        const position = await getCurrentPosition();
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=YOUR_API_KEY&units=metric`);
        const data = await response.json();
        
        weatherDiv.innerHTML = `
            <div class="weather-info">
                <i class="fas fa-temperature-high"></i> ${data.main.temp}°C
                <i class="fas fa-tint ms-2"></i> ${data.main.humidity}%
            </div>
        `;
    } catch (error) {
        console.error('Weather fetch failed:', error);
    }
}
