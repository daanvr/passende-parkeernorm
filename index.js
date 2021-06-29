mapboxgl.accessToken = 'pk.eyJ1IjoiZ291ZGFwcGVsIiwiYSI6ImNrcDcyYXMzdTB3ZjIydHF0cm94emc4Nm8ifQ.onzub-d-L_rzw9dPV8H2xw';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/goudappel/ckp7wx0xi47ir17l1pmz0tc1x',
    center: [5.922896, 51.975716],
    zoom: 8
});

// $(document).ready(function(){
// });

var coordinatesGeocoder = function (query) {
    /* Given a query in the form "lng, lat" or "lat, lng"
    * returns the matching geographic coordinate(s)
    * as search results in carmen geojson format,
    * https://github.com/mapbox/carmen/blob/master/carmen-geojson.md */

    // Match anything which looks like
    // decimal degrees coordinate pair.
    var matches = query.match(
        /^[ ]*(?:Lat: )?(-?\d+\.?\d*)[, ]+(?:Lng: )?(-?\d+\.?\d*)[ ]*$/i
    );
    if (!matches) {
        return null;
    }

    function coordinateFeature(lng, lat) {
        return {
            center: [lng, lat],
            geometry: {
                type: 'Point',
                coordinates: [lng, lat]
            },
            place_name: 'Lat: ' + lat + ' Lng: ' + lng,
            place_type: ['coordinate'],
            properties: {},
            type: 'Feature'
        };
    }

    var coord1 = Number(matches[1]);
    var coord2 = Number(matches[2]);
    var geocodes = [];

    if (coord1 < -90 || coord1 > 90) {
        // must be lng, lat
        geocodes.push(coordinateFeature(coord1, coord2));
    }

    if (coord2 < -90 || coord2 > 90) {
        // must be lat, lng
        geocodes.push(coordinateFeature(coord2, coord1));
    }

    if (geocodes.length === 0) {
        // else could be either lng, lat or lat, lng
        geocodes.push(coordinateFeature(coord1, coord2));
        geocodes.push(coordinateFeature(coord2, coord1));
    }

    return geocodes;
};

map.addControl( // Add the control to the map.
    new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        localGeocoder: coordinatesGeocoder,
        zoom: 4,
        placeholder: 'Try: -40, 170',
        mapboxgl: mapboxgl
    })
);

// Select menu item by Querystring
// var toggle = window.location.search.substring(1);
// console.log(urlData);

var urlData = searchToObject();
if (urlData.menuItem == '1') {
    menuSelect(1)
} else if (urlData.menuItem == '2') {
    menuSelect(2)
} else if (urlData.menuItem == '3') {
    menuSelect(3)
} else if (urlData.menuItem == '4') {
    menuSelect(4)
} else {
    menuSelect(1)
};

var params = new URLSearchParams(window.location.search)
console.log(params);
for (let p of params) {
    console.log(p);
}


console.log(location.search
    .slice(1)
    .split('&')
    .map(p => p.split('='))
    .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {}))


function searchToObjectOLD() {
    var pairs = window.location.search.substring(1).split("&"),
        obj = {},
        pair,
        i;

    for (i in pairs) {
        if (pairs[i] === "") continue;

        pair = pairs[i].split("=");
        obj[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
    }

    return obj;
}
function searchToObject() {
    var urlDataString = decodeURIComponent(window.location.search);
    if (urlDataString == "") { //note sure this is the right solution 
        return "";
    }
    urlDataString = "{\"" +
        urlDataString
            .replace(/\?/gi, "")
            .replace(/\&/gi, "\",\"")
            .replace(/\=/gi, "\":\"") +
        "\"}";

    urlObj = JSON.parse(urlDataString);
    console.log(urlObj)


    return urlObj;
}

function menuSelect(menuItem) {
    $(".menuItem").removeClass("active"); // make sure non menu item is slected
    $("#map").addClass("blured-map");
    // $(".content-pannel").addClass("hidden-content-pannel");
    $(".content-pannel").hide();
    switch (menuItem) { // execute 
        case 1:
            $("#menu-1").addClass("active"); // select aproriat <a> element (menu item)
            $("#home").show();
            break;

        case 2:
            $("#menu-2").addClass("active");
            $("#map").removeClass("blured-map");
            break;

        case 3:
            $("#menu-3").addClass("active");
            $("#backgroundInfromation").show();
            break;

        case 4:
            $("#menu-4").addClass("active");
            $("#contact").show();
            break;

        default:
    };
};



function setDiagramValues() {

    $("#buurt-data > tspan").text("-31%");
    $("#verglijk-data > tspan").text("-32%");
    $("#wijk-data > tspan").text("-33%");
    $("#kerngetal-data > tspan").text("2.9");
    
    // 1 = 350  >> (X*350)
    $("#buurt-bar").width("320");
    $("#verglijk-bar").width("350");
    $("#wijk-bar").width("380");
    
    var kerngetalPosition = 1 * 350 + 83;
    $("#kerngetal").attr("transform", "translate(" + kerngetalPosition + ", 0)");
    //X * 350 + 83
}
    

