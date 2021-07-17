var selectionBuCode = "";

mapboxgl.accessToken = 'pk.eyJ1IjoiZ291ZGFwcGVsIiwiYSI6ImNrcDcyYXMzdTB3ZjIydHF0cm94emc4Nm8ifQ.onzub-d-L_rzw9dPV8H2xw';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/goudappel/ckp7wx0xi47ir17l1pmz0tc1x',
    center: [5.922896, 51.975716],
    zoom: 8
});

// $(document).ready(function(){
// });

var coordinatesGeocoder = function(query) {
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
        placeholder: 'Postcode of gemeente',
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
    .reduce((obj, [key, value]) => ({...obj, [key]: value }), {}))


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

function menuSelect(menuItem, possition) {
    $(".menuItem").removeClass("active"); // make sure non menu item is slected
    $("#selectionPannel").removeClass("blured-map");
    $("#map").addClass("blured-map");
    // $(".content-pannel").addClass("hidden-content-pannel");
    $(".content-pannel").hide();
    $("#selectionPannel").hide();
    $("#closeOnClick").hide();

    switch (menuItem) { // execute 
        case 1:
            $("#menu-1").addClass("active"); // select aproriat <a> element (menu item)
            $("#home").show();
            $("#closeOnClick").show();
            break;

        case 2:
            $("#menu-2").addClass("active");
            $("#map").removeClass("blured-map");
            break;

        case 3:
            $("#menu-3").addClass("active");
            $("#backgroundInfromation").show();
            $("#closeOnClick").show();

            if (selectionBuCode == "") {
                $("#selectieBtn").hide();
            } else {
                $("#selectieBtn").show();
            }

            if (possition != undefined) {
                document.getElementById(possition).scrollIntoView();
            }

            break;

        case 4:
            $("#menu-4").addClass("active");
            $("#contact").show();
            $("#closeOnClick").show();
            break;

        case "gemeente":
            $("#menu-1").addClass("active");
            $("#gemeente").show();
            $("#closeOnClick").show();
            break;

        case "ontwikkelaars":
            $("#menu-1").addClass("active");
            $("#ontwikkelaars").show();
            $("#closeOnClick").show();
            break;

        case "selectie":
            $("#menu-2").addClass("active");
            $("#selectionPannel").show();
            newSelection()
            break;

        case "uitkomsten":
            $("#menu-2").addClass("active");
            $("#selectionPannel").show();
            newSelection()
            $("#uitkomsten").show();
            $("#selectionPannel").addClass("blured-map");
            $("#closeOnClick").show();
            break;


        default:
    };
};



function newSelection(BUCODE) {
    if (BUCODE != undefined) {
        selectionBuCode = BUCODE;
    }
    $("#selectionPannel").show();
    $("#map").addClass("blured-map");
    $("#closeOnClick").show();

    var shortBuCode = "" // remove the fluf and kee the part that helps disside what file to load
    switch (BUCODE) {
        case "11":
            // load this file
            break;

        default:
            break;
    }


    var dropdownSlections = {
            locatie: $("#selectionPannel > div.info > div > form:nth-child(4) > select").val(),
            ligging: $("#selectionPannel > div.info > div > form:nth-child(5) > select").val(),
            Steedelijkheidsgraad: $("#selectionPannel > div.info > div > form:nth-child(6) > select").val(),
            type_wooning: $("#selectionPannel > div.data > div > form > select").val()
        }
        // console.log(dropdownSlections)
        // console.log(BUCODE)

    // [ ] - Slect filte to load
    // [ ] - load data from json on server
    // [ ] - get values from loaded json
    // [ ] - Chequ which values to select based on selection
    // [ ] - format values
    // [ ] - set values

    var values = {
        gemente_naam: "Olst",
        wijk_naam: "Wijknaam",
        buurt_naam: "Buurtnaam",

        // binBBKom
        // buitBBKom
        locatie: "buitBBKom",

        // centrum
        // schil
        // restBBKom
        // buitGeb
        ligging: "schil",

        // zeer
        // sterk
        // matig
        // weinig
        // niet
        Steedelijkheidsgraad: "sterk",

        // vrij_koop
        // vrij_huur
        // vrij_social
        // twee_kap_koop
        // twee_kap_huur
        // twee_kap_social
        // rij_koop
        // rij_huur
        // rij_social
        // app_hoog_koop
        // app_hoog_huur
        // app_hoog_social
        // app_laag_koop
        // app_laag_huur
        // app_laag_social
        type_wooning: "twee_kap_social",

        buurt_pct: "-42%",
        verlijk_pct: "-54%",
        wijk_pct: "+98%",
        kerngetal_val: " 2.6",

        buurt_width: 365,
        verlijk_width: 784,
        wijk_width: 659,
        kerngetal_position: 783 //1 * 350 + 83
    }

    setDiagramValues();

    function setDiagramValues() {
        $("#selectionPannel > div.info > div > h1").text(values.gemente_naam); // gemeente
        $("#selectionPannel > div.info > div > h3:nth-child(2)").text(values.wijk_naam); // wijk
        $("#selectionPannel > div.info > div > h3:nth-child(3)").text(values.buurt_naam); // buurt

        $("#selectionPannel > div.info > div > form:nth-child(4) > select").val(values.locatie)
        $("#selectionPannel > div.info > div > form:nth-child(5) > select").val(values.ligging)
        $("#selectionPannel > div.info > div > form:nth-child(6) > select").val(values.Steedelijkheidsgraad)
        $("#selectionPannel > div.data > div > form > select").val(values.type_wooning)

        $("#buurt-data > tspan").text(values.buurt_pct); // buurt
        $("#verglijk-data > tspan").text(values.verlijk_pct); // verglijk
        $("#wijk-data > tspan").text(values.wijk_pct); // wijk

        $("#kerngetal-data > tspan").text(values.kerngetal_val); // kerngetal

        // 1 = 350  >> (X*350)
        $("#buurt-bar").width(values.buurt_width); // bburt bar brete
        $("#verglijk-bar").width(values.verlijk_width); // verglijkbaar bar brete
        $("#wijk-bar").width(values.wijk_width); // wijk bar brete

        var kerngetalPosition = 1 * 350 + 83;
        $("#kerngetal").attr("transform", "translate(" + values.kerngetal_position + ", 0)"); // Kerngetal positie 
        //X * 350 + 83
    }
}