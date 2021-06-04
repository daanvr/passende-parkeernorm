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
    $("#map").removeClass("blured-map");
    $(".content-pannel").addClass("hidden-content-pannel");
    switch (menuItem) { // execute 
        case 1:
            $("#menu-1").addClass("active"); // select aproriat <a> element (menu item)
            $("#map").addClass("blured-map");
            $(".content-pannel").removeClass("hidden-content-pannel");
            break;

        case 2:
            $("#menu-2").addClass("active");
            break;

        case 3:
            $("#menu-3").addClass("active");
            $("#map").addClass("blured-map");
            $(".content-pannel").removeClass("hidden-content-pannel");
            break;

        case 4:
            $("#menu-4").addClass("active");
            $("#map").addClass("blured-map");
            $(".content-pannel").removeClass("hidden-content-pannel");
            break;

        default:
    };
};



map.on('load', function () {
    map.addSource('currentlyHoveredArea', {
        'type': 'geojson',
        'data': ''
    });

    map.addLayer({
        'id': 'currentlyHoveredAreaLayer',
        'type': 'fill',
        'source': 'currentlyHoveredArea',
        'layout': {},
        'paint': {
            'fill-color': '#627BC1',
            'fill-opacity': 1
        }
    });

    map.on('mousemove', 'buurt-2020-v1-0-0vrvzi', function (e) {
        map.getCanvas().style.cursor = 'pointer';

        //create geojson based on hovered coorinates
        var geojson = {};
        geojson["type"] = "FeatureCollection";
        geojson["features"] = [];
        var feature = {};
        feature["type"] = "Feature";
        feature["properties"] = {};
        feature["geometry"] = {};
            feature["geometry"]["type"] = "Polygon";
                feature["geometry"]["coordinates"] = [];
                // feature["geometry"]["coordinates"].push([]);
                feature["geometry"]["coordinates"] = e.features[0].geometry.coordinates; //add coordinaes array here
        feature["type"] = "Feature";
        geojson.features.push(feature);
        // console.log(geojson)

        var geojson2 = {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "properties": {},
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [
                            [
                                [
                                    6.15234375,
                                    52.26742201037496
                                ],
                                [
                                    6.123676300048828,
                                    52.24367372360571
                                ],
                                [
                                    6.178951263427734,
                                    52.237051359522724
                                ],
                                [
                                    6.1907958984375,
                                    52.25639009576134
                                ],
                                [
                                    6.162815093994141,
                                    52.26195892902841
                                ],
                                [
                                    6.15234375,
                                    52.26742201037496
                                ]
                            ]
                        ]
                    }
                }
            ]
        }

        map.getSource('currentlyHoveredArea').setData(geojson);

    });

    map.on('mouseleave', 'buurt-2020-v1-0-0vrvzi', function () {
        map.getCanvas().style.cursor = '';
        // map.getSource('currentlyHoveredArea').setData({});

    });
});
