var request = require('request');
var fs = require('fs');
var app_config = require('./app_config');

function getCurrentForecast() {
    return new Promise((resolve, reject) => {
        var opts = {
            url: `https://api.weather.com/v3/wx/forecast/daily/5day?postalKey=${app_config.zipcode}:US&units=e&language=en&format=json&apiKey=${app_config.apikey}`,
            timeout: 10000
        };

        request(opts, function (err, res, body) {
            if (err) {
                reject(err);
                return;
            }

            if (res.statusCode != 200) {
                reject('Non-200 from weather.com: ' + res.statusCodes);
                return;
            }

            resolve(body);
        });
    });
}

async function getAndStore() {
    var current_json = await getCurrentForecast();
    fs.writeFile('cache_forecast.json', current_json, 'utf8', function (err) {
        if (err) throw err;
        console.log('Wrote forecast.');
}   );
}

try {
    getAndStore();
} catch (err) {
    console.error('Could not write forecast file', err);
}