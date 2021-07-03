var request = require('request');
var fs = require('fs');

var opts = {
    url: 'https://s.w-x.co/staticmaps/wu/wxtype/county_loc/hfd/animate.png',
    timeout: 10000,
    encoding: null
};

request(opts, function (err, res, body) {
    if (err) {
        console.error('Could not get current animage gif', err);
        return
    }

    fs.writeFile('../page/animate.gif', body, function (err2) {
        if (err2) {
            console.error('Could not write output gif!', err2);
            return;
        }
        console.log('Done');
    });
});