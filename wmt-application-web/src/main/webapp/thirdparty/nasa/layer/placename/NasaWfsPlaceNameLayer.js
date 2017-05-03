define([
        '../../geom/Sector',
        './PlaceNameLayer',
        './WfsUrlBuilder'
    ],
    function (Sector,
              PlaceNameLayer,
              WfsUrlBuilder) {
        "use strict";

        var NasaWfsPlaceNameLayer = function () {
            this.featuresArray = [
                {featureName: "topp:wpl_oceans", minAltitude: 0, maxAltitude: 0x1 << 26}, //0 - 67108 km
                {featureName: "topp:wpl_continents", minAltitude: 0x1 << 19, maxAltitude: 0x1 << 26}, //524 - 67108 km
                {featureName: "topp:wpl_waterbodies", minAltitude: 0, maxAltitude: 0x1 << 24}, //0 - 16777 km
                {featureName: "topp:wpl_trenchesridges", minAltitude: 0, maxAltitude: 0x1 << 24},//0 - 16777 km
                {featureName: "topp:wpl_desertsplains", minAltitude: 0, maxAltitude: 0x1 << 24},//0 - 16777 km
                {featureName: "topp:wpl_lakesrivers", minAltitude: 0, maxAltitude: 0x1 << 23},//0 - 8388 km
                {featureName: "topp:wpl_mountainsvalleys", minAltitude: 0, maxAltitude: 0x1 << 23},//0 - 8388 km
                {featureName: "topp:countries", minAltitude: 0x1 << 19, maxAltitude: 0x1 << 22},//524 - 4194 km
                {featureName: "topp:citiesover500k", minAltitude: 0, maxAltitude: 0x1 << 21},//0 - 2097 km
                {featureName: "topp:citiesover100k", minAltitude: 0x1 << 12, maxAltitude: 0x1 << 20},//4 - 1048 km
                {featureName: "topp:citiesover50k", minAltitude: 0x1 << 12, maxAltitude: 0x1 << 18},//4 - 262 km
                {featureName: "topp:citiesover10k", minAltitude: 0, maxAltitude: 0x1 << 17},//0 - 131 km
                {featureName: "topp:citiesover1k", minAltitude: 0, maxAltitude: 0x1 << 15}//0 - 32 km
            ];

            this.urlBuilder = new WfsUrlBuilder(
                "https://worldwind22.arc.nasa.gov/geoserver/wfs?service=WFS", "1.1.0");
            // this.urlBuilder = new WfsUrlBuilder(location.protocol +
            //     "//worldwind22.arc.nasa.gov/geoserver/wfs?service=WFS", "1.1.0");

            this.maxNodeFeatureCount = 1000;

            PlaceNameLayer.call(this, Sector.FULL_SPHERE, "json", "NASA_WFS_1.1.0");

            this.displayName = "NASA WFS Placename";
            this.pickEnabled = false;
        };

        NasaWfsPlaceNameLayer.prototype = Object.create(PlaceNameLayer.prototype);

        return NasaWfsPlaceNameLayer;
    });