document.addEventListener('DOMContentLoaded', () => {
    const apiKey = '7D2HIwrUs48FwTr65GvG0u7hJXaujX7Y'; // Remplacez par votre clé API AccuWeather
    const searchBtn = document.getElementById('search-btn');
    const cityInput = document.getElementById('city-input');
    const locationElement = document.getElementById('location');
    const descriptionElement = document.getElementById('description');
    const temperatureElement = document.getElementById('temperature');
    const humidityElement = document.getElementById('humidity');
    const windSpeedElement = document.getElementById('wind-speed');

    async function getCityKey(city) {
        const response = await fetch(`http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${city}&language=fr&details=true`);
        // const response = await fetch(`http://dataservice.accuweather.com/locations/v1/cities/search?apikey=7D2HIwrUs48FwTr65GvG0u7hJXaujX7Y&q=paris&language=fr&details=true`);
        const data = await response.json();
        if (data.length > 0) {
            return data[0].Key;
        } else {
            throw new Error('City not found');
        }
    } 

    async function getWeather(city) {
        try {
            const cityKey = await getCityKey(city);
            const response = await fetch(`http://dataservice.accuweather.com/currentconditions/v1/${cityKey}?apikey=${apiKey}`);
            const data = await response.json();
            console.log("🚀 ~ getWeather ~ data:", data)
            if (data.length > 0) {
                const weather = data[0];
                locationElement.textContent = city;
                descriptionElement.textContent = weather.WeatherText;
                temperatureElement.textContent = Math.round(weather.Temperature.Metric.Value);
                humidityElement.textContent = weather.RelativeHumidity;
                windSpeedElement.textContent = weather?.Wind?.Speed?.Metric?.Value;
            }
        } catch (error) {
            locationElement.textContent = 'City not found';
            descriptionElement.textContent = '';
            temperatureElement.textContent = '--';
            humidityElement.textContent = '--';
            windSpeedElement.textContent = '--';
            console.error('Error fetching weather data:', error);
        }
    }

    searchBtn.addEventListener('click', () => {
        const city = cityInput.value.trim();
        if (city) {
            getWeather(city);
        }
    });

    cityInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            const city = cityInput.value.trim();
            if (city) {
                getWeather(city);
            }
        }
    });
});
