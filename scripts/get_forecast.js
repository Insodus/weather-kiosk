var request = require('request');

var opts = {
    url: 'https://api.weather.com/v3/wx/forecast/daily/5day?postalKey=03782:US&units=e&language=en&format=json&apiKey=c9b9de42f3d44b64b9de42f3d4db64db',
    timeout: 10000
};

request(opts, function (err, res, body) {
    if (err) {
        console.error('Could not get forecast from API!', err);
        return
    }

    var weather = JSON.parse(body);
    var detail = weather.daypart[0];

    console.log(weather.temperatureMax);
    console.log(weather.temperatureMin);
    console.log(detail.daypartName);
    console.log('----');

    var forecastsAdded = 0;
    var totalNeeded = 4;
    var currentIndex = 0;
    var forecastsAvailable = weather.temperatureMin.length;

    while(forecastsAdded < totalNeeded && currentIndex < forecastsAvailable) {
        var dayIndex = currentIndex * 2;
        var nightIndex = dayIndex + 1;

        var day = weather.dayOfWeek[currentIndex];
        var maxTemp = weather.temperatureMax[currentIndex];
        var minTemp = weather.temperatureMin[currentIndex];

        var dayName = detail.daypartName[dayIndex];
        var detailDay = detail.narrative[dayIndex];

        var nightName = detail.daypartName[nightIndex];
        var nightDay = detail.narrative[nightIndex];

        console.log('Date:', day, 'Min:', minTemp, 'Max:', maxTemp);

        if (weather.temperatureMax[currentIndex] != null && detail.narrative[dayIndex] != null) {
            // daytime isnt over yet so add this one
            console.log(dayName, detailDay);

            forecastsAdded++;
        }

        console.log(nightName, nightDay);
        forecastsAdded++;
        currentIndex++;
    }

});