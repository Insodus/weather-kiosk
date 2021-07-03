var request = require('request');

var opts = {
    url: 'https://api.weather.com/v2/pws/observations/current?numericPrecision=decimal&stationId=KNHSUNAP26&units=e&format=json&apiKey=c9b9de42f3d44b64b9de42f3d4db64db',
    timeout: 10000
};

request(opts, function (err, res, body) {
    if (err) {
        console.error('Could not get current from API!', err);
        return
    }

    var weather = JSON.parse(body);
    var observations = weather.observations[0];

    var humid = observations.humidity;
    var temp = observations.imperial.temp;

    console.log('Temp', temp, 'Humid', humid);
});