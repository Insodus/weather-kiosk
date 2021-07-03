var request = require('request');
var fs = require('fs');
var moment = require('moment');

// get date and time strings
var now = moment();
var timeStr = now.format('h:m A');
var dateStr = now.format('dddd MMMM, Qo');

// get current temp
function getCurrentTemp() {
    return new Promise((resolve, reject) => {
        var opts = {
            url: 'https://api.weather.com/v2/pws/observations/current?numericPrecision=decimal&stationId=KNHSUNAP26&units=e&format=json&apiKey=c9b9de42f3d44b64b9de42f3d4db64db',
            timeout: 10000
        };
        
        request(opts, function (err, res, body) {
            if (err) {
                reject(err);
                return;
            }
        
            var weather = JSON.parse(body);
            var observations = weather.observations[0];
        
            var humid = observations.humidity;
            var temp = observations.imperial.temp;
        
            resolve({temp, humid});
        });
    });
}


// do replacement
fs.readFile('../page/index.template', 'utf8', function (err, data) {
    if (err) {
      console.error('Could not open template file!', err);
      return;
    }

    var result = data.replace(/string to be replaced/g, 'replacement');
  
    fs.writeFile('../page/index.html', result, 'utf8', function (err2) {
        if (err2) {
            console.error('Could not write output file!', err2);
            return;
        }
        console.log('Done');
    });
});
