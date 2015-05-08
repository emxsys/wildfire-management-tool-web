/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @version $Id: app.js 3059 2015-05-04 21:11:01Z tgaskins $
 */

requirejs.config({
    "paths": {
        WMT: "WMT"
    }
});

requirejs(["WMT"], function (WMT) {
    new WMT()
});
