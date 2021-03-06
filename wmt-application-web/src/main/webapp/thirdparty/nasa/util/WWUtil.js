/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @version $Id: WWUtil.js 3402 2015-08-14 17:28:09Z tgaskins $
 */
define([
        '../error/ArgumentError',
        '../geom/Line',
        '../util/Logger',
        '../geom/Rectangle',
        '../geom/Vec3'],
    function (ArgumentError,
              Line,
              Logger,
              Rectangle,
              Vec3) {
        "use strict";
        /**
         * Provides math constants and functions.
         * @exports WWUtil
         */
        var WWUtil = {
            // A regular expression that matches latitude followed by a comma and possible white space followed by
            // longitude. Latitude and longitude ranges are not considered.
            latLonRegex: /^(\-?\d+(\.\d+)?),\s*(\-?\d+(\.\d+)?)$/,

            /**
             * Returns the suffix for a specified mime type.
             * @param {String} mimeType The mime type to determine a suffix for.
             * @returns {String} The suffix for the specified mime type, or null if the mime type is not recognized.
             */
            suffixForMimeType: function (mimeType) {
                if (mimeType === "image/png")
                    return "png";

                if (mimeType === "image/jpeg")
                    return "jpg";

                if (mimeType === "application/bil16")
                    return "bil";

                if (mimeType === "application/bil32")
                    return "bil";

                return null;
            },

            /**
             * Returns the current location URL as obtained from window.location with the last path component
             * removed.
             * @returns {String} The current location URL with the last path component removed.
             */
            currentUrlSansFilePart: function () {
                var protocol = window.location.protocol,
                    host = window.location.host,
                    path = window.location.pathname,
                    pathParts = path.split("/"),
                    newPath = "";

                for (var i = 0, len = pathParts.length; i < len - 1; i++) {
                    if (pathParts[i].length > 0) {
                        newPath = newPath + "/" + pathParts[i];
                    }
                }

                return protocol + "//" + host + newPath;
            },

            /**
             * Returns the URL of the directory containing the World Wind library.
             * @returns {String} The URL of the directory containing the World Wind library, or null if that directory
             * cannot be determined.
             */
            worldwindlibLocation: function () {
                var scripts = document.getElementsByTagName("script"),
                    libraryName = "/worldwindlib.";

                for (var i = 0; i < scripts.length; i++) {
                    var index = scripts[i].src.indexOf(libraryName);
                    if (index >= 0) {
                        return scripts[i].src.substring(0, index) + "/";
                    }
                }

                return null;
            },

            /**
             * Returns the path component of a specified URL.
             * @param {String} url The URL from which to determine the path component.
             * @returns {String} The path component, or the empty string if the specified URL is null, undefined
             * or empty.
             */
            urlPath: function (url) {
                if (!url)
                    return "";

                var urlParts = url.split("/"),
                    newPath = "";

                for (var i = 0, len = urlParts.length; i < len; i++) {
                    var part = urlParts[i];

                    if (!part || part.length === 0
                        || part.indexOf(":") != -1
                        || part === "."
                        || part === ".."
                        || part === "null"
                        || part === "undefined") {
                        continue;
                    }

                    if (newPath.length !== 0) {
                        newPath = newPath + "/";
                    }

                    newPath = newPath + part;
                }

                return newPath;
            },

            /**
             * Sets each element of an array to a specified value. This function is intentionally generic, and works
             * with any data structure with a length property whose elements may be referenced using array index syntax.
             * @param array The array to fill.
             * @param {*} value The value to assign to each array element.
             */
            fillArray: function (array, value) {
                if (!array) {
                    return;
                }

                for (var i = 0, len = array.length; i < len; i++) {
                    array[i] = value;
                }
            },

            /**
             * Multiplies each element of an array by a specified value and assigns each element to the result. This
             * function is intentionally generic, and works with any data structure with a length property whose
             * elements may be referenced using array index syntax.
             * @param array The array to fill.
             * @param {*} value The value to multiply by each array element.
             */
            multiplyArray: function (array, value) {
                if (!array) {
                    return;
                }

                for (var i = 0, len = array.length; i < len; i++) {
                    array[i] *= value;
                }
            },

            // Used to form unique function names for JSONP callback functions.
            jsonpCounter: 0,

            /**
             * Request a resource using JSONP.
             * @param {String} url The url to receive the request.
             * @param {String} parameterName The JSONP callback function key required by the server. Typically
             * "jsonp" or "callback".
             * @param {Function} callback The function to invoke when the request succeeds. The function receives
             * one argument, the JSON payload of the JSONP request.
             */
            jsonp: function (url, parameterName, callback) {

                // Generate a unique function name for the JSONP callback.
                var functionName = "gov_nasa_worldwind_jsonp_" + WWUtil.jsonpCounter++;

                // Define a JSONP callback function. Assign it to global scope the browser can find it.
                window[functionName] = function (jsonData) {
                    // Remove the JSONP callback from global scope.
                    delete window[functionName];

                    // Call the client's callback function.
                    callback(jsonData);
                };

                // Append the callback query parameter to the URL.
                var jsonpUrl = url + (url.indexOf('?') === -1 ? '?' : '&');
                jsonpUrl += parameterName + "=" + functionName;

                // Create a script element for the browser to invoke.
                var script = document.createElement('script');
                script.async = true;
                script.src = jsonpUrl;

                // Prepare to add the script to the document's head.
                var head = document.getElementsByTagName('head')[0];

                // Set up to remove the script element once it's invoked.
                var cleanup = function () {
                    script.onload = undefined;
                    script.onerror = undefined;
                    head.removeChild(script);
                };

                script.onload = cleanup;
                script.onerror = cleanup;

                // Add the script element to the document, causing the browser to invoke it.
                head.appendChild(script);
            }
        };

        return WWUtil;
    });