var request = require('request');
var fs = require('fs');
var app_config = require('./app_config');

function getCurrentTemp() {
    return new Promise((resolve, reject) => {
        var opts = {
            url: `https://api.weather.com/v2/pws/observations/current?numericPrecision=decimal&stationId=${app_config.station}&units=e&format=json&apiKey=${app_config.apikey}`,
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
    var current_json = await getCurrentTemp();
    fs.writeFile('cache_current.json', current_json, 'utf8', function (err) {
        if (err) throw err;
        console.log('Wrote current obs.');
    });
}

try {
    getAndStore();
} catch (err) {
    console.error('Could not write current obs file', err);
}