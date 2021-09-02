var selectionBuCode = "";
var dataAlles;
var dataIsReadyBol = false;
var dataIndex = [];

// sent a GET request to retrieve the CSV file contents
$.get("https://raw.githubusercontent.com/daanvr/passende-parkeernorm/main/extra/data.csv", function(CSVdata) {
    // CSVdata is populated with the file contents
    // ready to be converted into an Array
    dataAlles = $.csv.toArrays(CSVdata);
    dataIsReadyBol = true;
    dataIsReady();
});


// [ ] we could add a loading icon if need be
function dataIsReady() {
    console.log(dataAlles)
    for (i in dataAlles) {
        dataIndex.push(dataAlles[i][0])
    }
    if (selectionBuCode != "") {
        newSelection()
    }
}

mapboxgl.accessToken = 'pk.eyJ1IjoiZ291ZGFwcGVsIiwiYSI6ImNrcDcyYXMzdTB3ZjIydHF0cm94emc4Nm8ifQ.onzub-d-L_rzw9dPV8H2xw';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/goudappel/ckp7wx0xi47ir17l1pmz0tc1x',
    center: [5.922896, 51.975716],
    zoom: 10
});

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
        placeholder: 'Gemeente of postcode',
        mapboxgl: mapboxgl
    })
);

$(document).ready(function() {
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
});

// var params = new URLSearchParams(window.location.search)
// console.log(params);
// for (let p of params) {
//     console.log(p);
// }


// console.log(location.search
//     .slice(1)
//     .split('&')
//     .map(p => p.split('='))
//     .reduce((obj, [key, value]) => ({...obj, [key]: value }), {}))


// function searchToObjectOLD() {
//     var pairs = window.location.search.substring(1).split("&"),
//         obj = {},
//         pair,
//         i;

//     for (i in pairs) {
//         if (pairs[i] === "") continue;

//         pair = pairs[i].split("=");
//         obj[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
//     }

//     return obj;
// }

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
            if (selectionBuCode == "") { $("#selectieBtn").hide(); } else { $("#selectieBtn").show(); }
            if (possition != undefined) { document.getElementById(possition).scrollIntoView(); }
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
            $("#closeOnClick").show();
            newSelection()
            break;

        case "uitkomsten":
            $("#uitkomsten").show();
            $("#selectionPannel").addClass("blured-map");
            $("#closeOnClick").show();
            break;


        default:
    };
};

function newSelection(BUCODE, reselect) {
    var data = {};

    if (BUCODE === undefined) {
        BUCODE = selectionBuCode;
    } else {
        selectionBuCode = BUCODE;
    }


    function selectData(code) {
        return dataAlles[dataIndex.indexOf(code)]
    }

    // console.log(BUCODE)

    var buurtCode = JSON.parse(JSON.stringify(BUCODE));
    var buurtCodeVerglijk = JSON.parse(JSON.stringify(BUCODE)); // copie for adjusting later
    var wijkCode = JSON.parse(JSON.stringify(BUCODE)); // copie for adjusting later
    var gemCode = JSON.parse(JSON.stringify(BUCODE)); // copie for adjusting later

    // console.log(buurtCode + " test")
    // console.log(buurtCodeVerglijk + " test")
    // console.log(wijkCode + " test")
    // console.log(gemCode + " test")

    var onbekendeBuurt = ["", 0, "Geen resultaat", "Geen resultaat", "", "", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]


    if (selectData(buurtCode) === undefined) {
        console.log("Buurt code onbekend:" + buurtCode)
        alert("Er zijn geen gegevens voor deze buurt. Probeer een andere buurt.");
    } else {
        data.buurt = selectData(buurtCode)
    }

    wijkCode = wijkCode.replace("BU", "WK").slice(0, 8);
    gemCode = gemCode.replace("BU", "GM").slice(0, 6);

    for (var key in data) {
        if (data[key] === undefined) {
            data[key] = onbekendeBuurt
            console.log("onbekend gebied")
        }
    }

    buurtCodeVerglijk = wijkCode.replace("BU", "LI").slice(0, 7);
    buurtCodeVerglijk += data.buurt[8]; // "OAD" van buurt


    console.log(buurtCode)
    console.log(buurtCodeVerglijk)
    console.log(wijkCode)
    console.log(gemCode)

    data.wijk = selectData(wijkCode)
    data.gemeente = selectData(gemCode)
    data.verglijk = selectData(buurtCodeVerglijk)

    for (var key in data) {
        if (data[key] === undefined) {
            data[key] = onbekendeBuurt
            console.log("onbekend gebied")
        }
    }

    console.log("Geselecteerde gebieden data:")
    console.log(data)


    $("#selectionPannel").show();
    $("#map").addClass("blured-map");
    $("#closeOnClick").show();

    // var shortBuCode = "" // remove the fluf and kee the part that helps disside what file to load
    // switch (BUCODE) {
    //     case "11":
    //         // load this file
    //         break;

    //     default:
    //         break;
    // }



    // [ ] - Chequ which values to select based on selection
    // [ ] - format values
    // [ ] - set values

    // var values = {
    //     // gemente_naam: data.gemeente[3],
    //     // wijk_naam: data.wijk[3].replace(data.gemeente[3] + "|", ""),
    //     // buurt_naam: data.buurt[3].replace(data.gemeente[3] + "|", ""),

    //     // centrum
    //     // schil
    //     // restBBKom
    //     // buitGeb
    //     ligging: "",

    //     // zeer
    //     // sterk
    //     // matig
    //     // weinig
    //     // niet
    //     Steedelijkheidsgraad: "",

    //     // vrij_koop
    //     // vrij_huur
    //     // vrij_social
    //     // twee_kap_koop
    //     // twee_kap_huur
    //     // twee_kap_social
    //     // rij_koop
    //     // rij_huur
    //     // rij_social
    //     // app_hoog_koop
    //     // app_hoog_huur
    //     // app_hoog_social
    //     // app_laag_koop
    //     // app_laag_huur
    //     // app_laag_social
    //     type_wooning: ""

    // }

    // Aantal bewoonbare wooningen
    // abw_totaal
    // abw_vrijst
    // abw_tweekap
    // abw_rijwoni
    // abw_meergez_laagb
    // abw_meergez_hoogb
    // abw_koop
    // abw_soc_huur
    // abw_part_huur
    // abw_1_pers
    // abw_2_pers
    // abw_3_pers

    // aapbw_totaal
    // aapbw_koop_vrijst
    // aapbw_koop_tweekap
    // aapbw_koop_rijwoni
    // aapbw_koop_meergez_laagb
    // aapbw_koop_meergez_hoogb
    // aapbw_soc_huur_vrijst
    // aapbw_soc_huur_tweekap
    // aapbw_soc_huur_rijwoni
    // aapbw_soc_huur_meergez_laagb
    // aapbw_soc_huur_meergez_hoogb
    // aapbw_part_huur_vrijst
    // aapbw_part_huur_tweekap
    // aapbw_part_huur_rijwoni
    // aapbw_part_meergez_laagb
    // aapbw_part_meergez_hoogb

    var diagramData = {
        // buurt_pct: "-42%",
        // verlijk_pct: "-54%",
        // wijk_pct: "+98%",
        // kerngetal_val: " 2.6",

        // buurt_width: 365,
        // verlijk_width: 784,
        // wijk_width: 659,
        // kerngetal_position: 783 //1 * 350 + 83
    };

    var dropdownSlections = {
        // locatie: $("#selectionPannel > div.info > div > form:nth-child(4) > select").val(),
        // ligging: $("#selectionPannel > div.info > div > form:nth-child(5) > select").val(),
        // Steedelijkheidsgraad: $("#selectionPannel > div.info > div > form:nth-child(6) > select").val(),
        // type_wooning: $("#selectionPannel > div.data > div > form > select").val()
    }

    // console.log(values)

    setUiText();
    if (!reselect) {
        prefillDropdownValues();
    }
    addAreaStatistics();
    getDropdownValues();
    calcDiagramValues(dropdownSlections);
    setDiagramValues();

    function setUiText() {
        $("#selectionPannel > div.info > div > p > span.gemeenteName").text(data.gemeente[3]); // gemeente
        $("#selectionPannel > div.info > div > p > span.wijkName").text(data.wijk[3].replace(data.gemeente[3] + "|", "")); // wijk
        $("#selectionPannel > div.info > div > p > span.buurtName").text(data.buurt[3].replace(data.gemeente[3] + "|", "")); // buurt
        // Test
    };

    function addAreaStatistics() {
        $("#selectionPannel .areaStatistics").html("")
        $("#selectionPannel .areaStatistics").append('<div class="paddingBottomExtra"> WOZ: <span class="floatRight">' + data.buurt[5] + ' 000€</span></div>')

        $("#selectionPannel .areaStatistics").append('<div> Vrijst: <span class="floatRight">' + Math.round(data.buurt[10] * 100) + '%</span></div>')
        $("#selectionPannel .areaStatistics").append('<div> Tweekap: <span class="floatRight">' + Math.round(data.buurt[11] * 100) + '%</span></div>')
        $("#selectionPannel .areaStatistics").append('<div> Rijwoni: <span class="floatRight">' + Math.round(data.buurt[12] * 100) + '%</span></div>')
        $("#selectionPannel .areaStatistics").append('<div> Meergez. laagb: <span class="floatRight">' + Math.round(data.buurt[13] * 100) + '%</span></div>')
        $("#selectionPannel .areaStatistics").append('<div class="paddingBottomExtra"> Meergez. hoogb: <span class="floatRight">' + Math.round(data.buurt[14] * 100) + '%</span></div>')

        $("#selectionPannel .areaStatistics").append('<div> Koop: <span class="floatRight">' + Math.round(data.buurt[15] * 100) + '%</span></div>')
        $("#selectionPannel .areaStatistics").append('<div> Soc. huur: <span class="floatRight">' + Math.round(data.buurt[16] * 100) + '%</span></div>')
        $("#selectionPannel .areaStatistics").append('<div class="paddingBottomExtra"> Part. huur: <span class="floatRight">' + Math.round(data.buurt[17] * 100) + '%</span></div>')

        $("#selectionPannel .areaStatistics").append('<div> 1 pers: <span class="floatRight">' + Math.round(data.buurt[18] * 100) + '%</span></div>')
        $("#selectionPannel .areaStatistics").append('<div> 2 pers: <span class="floatRight">' + Math.round(data.buurt[19] * 100) + '%</span></div>')
        $("#selectionPannel .areaStatistics").append('<div class="paddingBottomExtra"> 3 pers: <span class="floatRight">' + Math.round(data.buurt[20] * 100) + '%</span></div>')

        // $("#selectionPannel .areaStatistics").append('<div> Keyname: <span class="floatRight">35456€</span></div>')
    }

    function prefillDropdownValues() {
        switch (data.buurt[8]) { //liging from csv
            case "1":
                $("#ligging").val("centrum");
                break;

            case "2":
                $("#ligging").val("schil");
                break;

            case "3":
                $("#ligging").val("restBBKom");
                break;

            case "4":
                $("#ligging").val("buitGeb");
                break;

            default:
                break;
        }

        switch (data.buurt[6]) { //sttedlijkheid from csv
            case "1":
                $("#steedelijkheidsgraad").val("zeer")
                break;

            case "2":
                $("#steedelijkheidsgraad").val("sterk")
                break;

            case "3":
                $("#steedelijkheidsgraad").val("matig")
                break;

            case "4":
                $("#steedelijkheidsgraad").val("weinig")
                break;

            case "5":
                $("#steedelijkheidsgraad").val("niet")
                break;

            default:
                break;
        }
    }

    function getDropdownValues() {
        dropdownSlections = {
            // locatie: $("#selectionPannel > div.info > div > form:nth-child(4) > select").val(),
            ligging: $("#ligging").val(),
            Steedelijkheidsgraad: $("#steedelijkheidsgraad").val(),
            type_wooning: $("#selectionPannel > div.data > div > form > select").val()
        }
    };

    function calcDiagramValues(dropdownSettings) {
        // dropdownSlections.type_wooning

        var typeWooningCollomIndezx = {
            aapbw_totaal: 21,
            aapbw_koop_vrijst: 22,
            aapbw_koop_tweekap: 23,
            aapbw_koop_rijwoni: 24,
            aapbw_koop_meergez_laagb: 25,
            aapbw_koop_meergez_hoogb: 26,
            aapbw_soc_huur_vrijst: 27,
            aapbw_soc_huur_tweekap: 28,
            aapbw_soc_huur_rijwoni: 29,
            aapbw_soc_huur_meergez_laagb: 30,
            aapbw_soc_huur_meergez_hoogb: 31,
            aapbw_part_huur_vrijst: 32,
            aapbw_part_huur_tweekap: 33,
            aapbw_part_huur_rijwoni: 34,
            aapbw_part_meergez_laagb: 35,
            aapbw_part_meergez_hoogb: 36
        };



        diagramData = {
            buurt_pct: data.buurt[typeWooningCollomIndezx[dropdownSlections.type_wooning]],
            // buurt_pct: "-42%",
            verlijk_pct: data.verglijk[typeWooningCollomIndezx[dropdownSlections.type_wooning]],
            // verlijk_pct: "-54%",
            wijk_pct: data.wijk[typeWooningCollomIndezx[dropdownSlections.type_wooning]],
            // wijk_pct: "+98%",
            kerngetal_val: data.buurt[21],

            buurt_width: Number(data.buurt[typeWooningCollomIndezx[dropdownSlections.type_wooning]]) * 350,
            verlijk_width: Number(data.verglijk[typeWooningCollomIndezx[dropdownSlections.type_wooning]]) * 350,
            wijk_width: Number(data.wijk[typeWooningCollomIndezx[dropdownSlections.type_wooning]]) * 350,
            kerngetal_position: Number(data.buurt[21]) * 350 + 83 //1 * 350 + 83
                // kerngetal_position: 783 //1 * 350 + 83
        };

        for (var key in diagramData) {
            if (diagramData[key] == "") {
                diagramData[key] = "-";
                // console.log("onbekend gebied")
            }
        }

    };

    function setDiagramValues() {

        //De geselecteerde buurt
        if (diagramData.buurt_pct == "-") {
            $("#Gekozen-buurt > tspan").text("Geselecteerde buurt: Geen gegevens voor deze sub specificaties.");
            $("#buurt-bar").width(5); // bburt bar brete
        } else {
            $("#Gekozen-buurt > tspan").text("Geselecteerde buurt: " + data.buurt[3].replace(data.gemeente[3] + "|", ""));
            $("#buurt-bar").width(diagramData.buurt_width); // bburt bar brete
        }
        $("#buurt-data > tspan").text(diagramData.buurt_pct); // buurt

        //Verglijkbare buurt
        if (diagramData.verlijk_pct == "-") {
            $("#Verglijkbare-buurten > tspan").text("Vergelijkbare buurt. Geen gegevens voor deze sub specificaties");
            $("#verglijk-bar").width(5); // verglijkbaar bar brete
        } else {
            $("#Verglijkbare-buurten > tspan").text("Vergelijkbare buurten (" + $("#ligging option:selected").text() + ")");
            $("#verglijk-bar").width(diagramData.verlijk_width); // verglijkbaar bar brete
        }
        $("#verglijk-data > tspan").text(diagramData.verlijk_pct); // verglijk

        //Wijk
        if (diagramData.wijk_pct == "-") {
            $("#Betrefende-wijk > tspan").text("Wijk: Geen gegevens voor deze sub specificaties");
            $("#wijk-bar").width(5); // wijk bar brete
        } else {
            $("#Betrefende-wijk > tspan").text("Wijk: " + data.wijk[3].replace(data.gemeente[3] + "|", "").replace("Wijk", ""));
            $("#wijk-bar").width(diagramData.wijk_width); // wijk bar brete
        }
        $("#wijk-data > tspan").text(diagramData.wijk_pct); // wijk





        // =================================================================================================================================================================
        $("#kerngetal-data > tspan").text(diagramData.kerngetal_val); // kerngetal

        // 1 = 350  >> (X*350)

        var kerngetalPosition = 1 * 350 + 83;
        $("#kerngetal").attr("transform", "translate(" + diagramData.kerngetal_position + ", 0)"); // Kerngetal positie 
        //X * 350 + 83
    }
}