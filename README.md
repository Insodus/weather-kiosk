# weather-kiosk

create an account with Ac

find your location code here
https://developer.accuweather.com/accuweather-locations-api/apis/get/locations/v1/postalcodes/search

create a file in scripts folder called app_config.js that looks like

module.exports = {
    animation_loc: '',
    zipcode: '',
    apikey: '',
    station: '',
    lakemonster_url: ''
};

schedule long tasks for...

node get_animate_png.js
node get_current.js

and short taks for...

node create_output.html.js
