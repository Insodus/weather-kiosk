var request = require('request');
var fs = require('fs');
var moment = require('moment');

async function doCopy() {

    // start with no vals
    var temp = '??';
    var humid = '??';
    var water_temp = '??';
    var forecastHtml = '??';

    // get date and time strings
    var now = moment();
    var timeStr = now.format('h:mm A');
    var dateStr = now.format('dddd MMMM, Qo');

    var weather = require('./cache_current.json');
    var forecast = require('./cache_forecast.json');
    var water = require('./cache_water_temp.json');

    // get current stuff
    var observations = weather.observations[0];
    humid = observations.humidity;
    temp = observations.imperial.temp;

    // get water temp
    water_temp = water.water_temp;

    // forecast helperss
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

    // do forecast
    forecastHtml = '<div class="list-group">';
    var detail = forecast.daypart[0];

    var forecastsAdded = 0;
    var totalNeeded = 4;
    var currentIndex = 0;
    var forecastsAvailable = forecast.temperatureMin.length;

    while(forecastsAdded < totalNeeded && currentIndex < forecastsAvailable) {
        var dayIndex = currentIndex * 2;
        var nightIndex = dayIndex + 1;

        var day = forecast.dayOfWeek[currentIndex];
        var maxTemp = forecast.temperatureMax[currentIndex];
        var minTemp = forecast.temperatureMin[currentIndex];

        var dayName = detail.daypartName[dayIndex];
        var detailDay = detail.narrative[dayIndex];
        var wxDay = detail.wxPhraseShort[dayIndex];

        var nightName = detail.daypartName[nightIndex];
        var nightDay = detail.narrative[nightIndex];
        var wxNight = detail.wxPhraseShort[nightIndex];

        if (forecast.temperatureMax[currentIndex] != null && detail.narrative[dayIndex] != null) {
            // daytime isnt over yet so add this one
            forecastHtml += createListItem(wxDay, dayName, detailDay);
            forecastsAdded++;
        }

        if (forecastsAdded < totalNeeded) {
            forecastHtml += createListItem(wxNight, nightName, nightDay);
            forecastsAdded++;
        }

        currentIndex++;
    }
    forecastHtml += '</div>';

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
        result = result.replace(/{{forecast}}/g, forecastHtml);

    
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
