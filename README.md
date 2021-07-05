# weather-kiosk

create a file in scripts folder called app_config.js that looks like

module.exports = {
    animation_loc: 'hfd',
    zipcode: '03782',
    apikey: 'bc76d3c0ba3d4b2cb6d3c0ba3d1b2cb0',
    station: 'KNHSUNAP26',
    lakemonster_url: 'NH/Lake%20Sunapee-water-temperature-3141'
};

schedule long tasks for...

node get_animate_png.js
node get_current.js

and short taks for...

node create_output.html.js