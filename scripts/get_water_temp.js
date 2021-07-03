var request = require('request');

var opts = {
    url: 'https://lakemonster.com/lake/NH/Lake%20Sunapee-water-temperature-3141',
    timeout: 10000
};

var stringMatcher = /<span class='water_text' id='water_text'>([0-9]+)°<\/span>/;

request(opts, function (err, res, body) {
    if (err) {
        console.error('Could not get water temp webpage!', err);
        return
    }

    var statusCode = res.statusCode;
    var match = stringMatcher.exec(body);
    if (match != null) {
        console.log('Its ', match[1], 'degrees');
    } else {
        console.error('Could not find water temp on page!');
    }
});