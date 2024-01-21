var fs = require('fs');
var moment = require('moment');
const { networkInterfaces } = require('os');

function getIp() {
    var nets = networkInterfaces();
    var results = Object.create(null);

    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            if (net.family === 'IPv4' && !net.internal) {
                if (!results[name]) {
                    results[name] = [];
                }
                results[name].push(net.address);
            }
        }
    }

    if (results['wlp1s0'] != null) {
        return results['wlp1s0'][0];
    }

    if (results['Wi-Fi'] != null) {
        return results['Wi-Fi'][0];
    }

    if (results['eth0'] != null) {
        return results['eth0'][0];
    }

    if (results['Ethernet'] != null) {
        return results['Ethernet'][0];
    }

    return '';
}

async function doCopy() {

    // start with no vals
    var temp = '??';
    var forecastHtml = '??';
    var current_obs = "??";

    // get date and time strings
    var now = moment();
    var timeStr = now.format('h:mm A');
    var dateStr = now.format('dddd MMMM, Do');

    var weather = require('./cache_current.json');
    var forecast = require('./cache_forecast.json');
    var water = require('./cache_water_temp.json');

    // get current observations
    var observations = weather[0];
    temp = observations.Temperature.Imperial.Value;
    current_obs = forecast.Headline.Text;

    // get current ip
    var ip = getIp();

    function pad2(number) {
        return (number < 10 ? '0' : '') + number
    }

    function getLinkFromWeatherIcon(iconNum) {
        return `https://developer.accuweather.com/sites/default/files/${pad2(iconNum)}-s.png`;
    }

    function createForecastDivs(dayTxt, nightTxt, forecastItem) {
        return `<li class="list-group-item forecast-item">
                <img class="weather-sprite" src="${getLinkFromWeatherIcon(forecastItem.Day.Icon)}"></img>
                <h4 class="list-group-item-heading">${dayTxt}</h4>
                <p class="list-group-item-text">${forecastItem.Day.IconPhrase}. High of ${forecastItem.Temperature.Maximum.Value} degrees.</p>
                </li>
                <li class="list-group-item forecast-item">
                <img class="weather-sprite" src="${getLinkFromWeatherIcon(forecastItem.Night.Icon)}"></img>
                <h4 class="list-group-item-heading">${nightTxt}</h4>
                <p class="list-group-item-text">${forecastItem.Night.IconPhrase}. Low of ${forecastItem.Temperature.Minimum.Value} degrees.</p>
                </li> `;
    }

    // do forecast
    forecastHtml = '<div class="list-group">';
    var forecasts = forecast['DailyForecasts'];
    forecastHtml += createForecastDivs('Today', 'Tonight', forecasts[0]);
    forecastHtml += createForecastDivs('Tomorrow', 'Tomorrow Night',forecasts[1]);
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
        result = result.replace(/{{water_temp}}/g, water.water_temp);
        result = result.replace(/{{forecast}}/g, forecastHtml);
        result = result.replace(/{{last_update}}/g, water.water_update);
        result = result.replace(/{{ip}}/g, ip);
        result = result.replace(/{{current_obs}}/g, current_obs);
    
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
