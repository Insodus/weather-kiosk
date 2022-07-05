var request = require('request');
var fs = require('fs');
var moment = require('moment');
var app_config = require('./app_config');

function getWaterTemp() {
    return new Promise((resolve, reject) => {
        var opts = {
            url: app_config.lakemonster_url,
            timeout: 10000
        };

        request(opts, function (err, res, body) {
            if (err) {
                reject(err);
                return;
            }

            var match = app_config.lakemonster_matcher.exec(body);
            if (match != null) {
                resolve(match[1].trim());
            } else {
                reject('Could not find water temp on page!');
            }
        });
    });
}

async function getAndStore() {
    var water_temp = await getWaterTemp();
    var curr_time = moment();
    var last_update = curr_time.format("dddd, MMMM Do YYYY, h:mm:ss a");
    var last_update_ts = curr_time.unix();
    var output_json = ` { "water_temp" : "${water_temp}" , "water_update" : "${last_update}" , "water_update_ts" : ${last_update_ts} } `;
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