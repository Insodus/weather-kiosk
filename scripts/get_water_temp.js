var request = require('request');
var fs = require('fs');
var app_config = require('./app_config');

function getWaterTemp() {
    return new Promise((resolve, reject) => {
        var opts = {
            url: `https://lakemonster.com/lake/${app_config.lakemonster_url}`,
            timeout: 10000
        };
        var stringMatcher = /<span class='water_text' id='water_text'>([0-9]+)°<\/span>/;

        request(opts, function (err, res, body) {
            if (err) {
                reject(err);
                return;
            }

            var match = stringMatcher.exec(body);
            if (match != null) {
                resolve(match[1]);
            } else {
                reject('Could not find water temp on page!');
            }
        });
    });
}

async function getAndStore() {
    var water_temp = await getWaterTemp();
    var output_json = ` { "water_temp" : ${water_temp} } `;
    fs.writeFile('cache_water_temp.json', output_json, 'utf8', function (err) {
        if (err) throw err;
        console.log('Wrote water temp.');
    });
}

try {
    getAndStore();
} catch (err) {
    console.error('Could not write water temp file', err);
}