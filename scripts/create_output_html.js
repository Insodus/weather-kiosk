var request = require('request');
var fs = require('fs');
var moment = require('moment');

async function doCopy() {

    // start with no vals
    var temp = '??';
    var humid = '??';
    var water_temp = '??';
    var forecast = '??';

    // get date and time strings
    var now = moment();
    var timeStr = now.format('h:mm A');
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
            
                resolve([temp, humid]);
            });
        });
    }
    try {
        [temp, humid] = await getCurrentTemp();
    } catch (err) {
        console.error('Could not get current temp', err);
    }

    // get water temp
    function getWaterTemp() {
        return new Promise((resolve, reject) => {
            var opts = {
                url: 'https://lakemonster.com/lake/NH/Lake%20Sunapee-water-temperature-3141',
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
    try {
        water_temp = await getWaterTemp();
    } catch (err) {
        console.error('Could not get water temp', err);
    }

    // create forecast section
    function createListItem(wxType, dayDesc, forec) {
        var clsName = '';
        switch(wxType) {
            case 'Showers':
            case 'Rain':
            case 'PM Showers':
            case 'Light Rain':
            case 'Shwrs Late':
                clsName = 'weather-rainy';
                break;

            case 'M Cloudy':
                clsName = 'weather-cloudy';
                break;

            case 'P Cloudy':
                clsName = 'weather-partly';
                break;

            case 'PM T-Storms':
            case 'T-Storms':
            case 'Sct T-Storms':
                clsName = 'weather-lightning';
                break;

            case 'Clear Late':
            default:
                clsName = 'weather-sunny';
                break;
        }

        return `<li class="list-group-item forecast-item">
                <div class="weather-sprite ${clsName}"></div>
                <h4 class="list-group-item-heading">${dayDesc}</h4>
                <p class="list-group-item-text">${forec}</p>
            </li>`;
    }
    function getForecast() {
        return new Promise((resolve, reject) => {

            var opts = {
                url: 'https://api.weather.com/v3/wx/forecast/daily/5day?postalKey=03782:US&units=e&language=en&format=json&apiKey=c9b9de42f3d44b64b9de42f3d4db64db',
                timeout: 10000
            };
            
            request(opts, function (err, res, body) {
                if (err) {
                    reject(err);
                    return;
                }

                var retHtml = '<div class="list-group">';

                var weather = JSON.parse(body);
                var detail = weather.daypart[0];
            
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
                    var wxDay = detail.wxPhraseShort[dayIndex];
            
                    var nightName = detail.daypartName[nightIndex];
                    var nightDay = detail.narrative[nightIndex];
                    var wxNight = detail.wxPhraseShort[nightIndex];
            
                    if (weather.temperatureMax[currentIndex] != null && detail.narrative[dayIndex] != null) {
                        // daytime isnt over yet so add this one
                        retHtml += createListItem(wxDay, dayName, detailDay);
            
                        forecastsAdded++;
                    }
            
                    if (forecastsAdded < totalNeeded) {
                        retHtml += createListItem(wxNight, nightName, nightDay);
                        forecastsAdded++;
                    }

                    currentIndex++;
                }

                retHtml += '</div>';
                resolve(retHtml);
            });
        });
    }
    try {
        forecast = await getForecast();
    } catch (err) {
        console.error('Could not get forecast', err);
    }

    // do replacement
    fs.readFile('../page/index.template', 'utf8', function (err, data) {
        if (err) {
        console.error('Could not open template file!', err);
        return;
        }

        var result = data.replace(/{{time}}/g, timeStr);
        result = result.replace(/{{date}}/g, dateStr);
        result = result.replace(/{{air_temp}}/g, temp);
        result = result.replace(/{{water_temp}}/g, water_temp);
        result = result.replace(/{{forecast}}/g, forecast);

    
        fs.writeFile('../page/index.html', result, 'utf8', function (err2) {
            if (err2) {
                console.error('Could not write output file!', err2);
                return;
            }
            console.log('Done');
        });
    });
}

doCopy();
