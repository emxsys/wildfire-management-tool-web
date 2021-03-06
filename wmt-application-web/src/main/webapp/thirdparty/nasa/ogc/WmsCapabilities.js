/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports WmsCapabilities
 * @version $Id: WmsCapabilities.js 3055 2015-04-29 21:39:51Z tgaskins $
 */
define([
        '../error/ArgumentError',
        '../util/Logger',
        '../ogc/WmsLayerCapabilities'
    ],
    function (ArgumentError,
              Logger,
              WmsLayerCapabilities) {
        "use strict";

        /**
         * Constructs an WMS Capabilities instance from an XML DOM.
         * @alias WMSCapabilities
         * @constructor
         * @classdesc Represents a WMS Capabilities document. This object holds as properties all the fields
         * specified in the given WMS Capabilities document. Most fields can be accessed as properties named
         * according to their document names converted to camel case. For example, "version", "service.title",
         * "service.contactInformation.contactPersonPrimary". The exceptions are online resources, whose property
         * path has been shortened. For example "capability.request.getMap.formats" and "capability.request.getMap.url".
         * @param {{}} xmlDom An XML DOM representing the WMS Capabilities document.
         * @throws {ArgumentError} If the specified XML DOM is null or undefined.
         */
        var WmsCapabilities = function (xmlDom) {
            if (!xmlDom) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WmsCapabilities", "constructor", "No XML DOM specified."));
            }

            this.assembleDocument(xmlDom);
        };

        WmsCapabilities.prototype.assembleDocument = function (dom) {
            var root = dom.documentElement;

            this.version = root.getAttribute("version");
            this.updateSequence = root.getAttribute("updateSequence");

            var children = root.children || root.childNodes;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "Service") {
                    this.service = this.assembleService(child);
                } else if (child.localName === "Capability") {
                    this.capability = this.assembleCapability(child);
                }
            }
        };

        WmsCapabilities.prototype.assembleService = function (element) {
            var service = {
                capsDoc: this
            };

            var children = element.children || element.childNodes;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "Name") {
                    service.name = child.textContent;
                } else if (child.localName === "Title") {
                    service.title = child.textContent;
                } else if (child.localName === "Abstract") {
                    service.abstract = child.textContent;
                } else if (child.localName === "KeywordList") {
                    service.keywordList = this.assembleKeywordList(child);
                } else if (child.localName === "OnlineResource") {
                    service.onlineResource = child.getAttribute("xlink:href");
                } else if (child.localName === "Fees") {
                    service.fees = child.textContent;
                } else if (child.localName === "AccessConstraints") {
                    service.accessConstraints = child.textContent;
                } else if (child.localName == "LayerLimit") {
                    service.layerLimit = parseInt(child.textContent);
                } else if (child.localName == "MaxWidth") {
                    service.maxWidth = parseInt(child.textContent);
                } else if (child.localName == "MaxHeight") {
                    service.maxHeight = parseInt(child.textContent);
                } else if (child.localName === "ContactInformation") {
                    service.contactInformation = this.assembleContactInformation(child);
                }
            }

            return service;
        };

        WmsCapabilities.prototype.assembleKeywordList = function (element) {
            var keywords = [];

            var children = element.children || element.childNodes;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "Keyword") {
                    keywords.push(child.textContent);
                }
            }

            return keywords;
        };

        WmsCapabilities.prototype.assembleContactInformation = function (element) {
            var contactInfo = {};

            var children = element.children || element.childNodes;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "ContactPersonPrimary") {
                    contactInfo.contactPersonPrimary = this.assembleContactPersonPrimary(child);
                } else if (child.localName === "ContactPosition") {
                    contactInfo.contactPosition = child.textContent;
                } else if (child.localName === "ContactVoiceTelephone") {
                    contactInfo.contactVoiceTelephone = child.textContent;
                } else if (child.localName === "ContactFacsimileTelephone") {
                    contactInfo.contactFacsimileTelephone = child.textContent;
                } else if (child.localName === "ContactElectronicMailAddress") {
                    contactInfo.contactElectronicMailAddress = child.textContent;
                } else if (child.localName === "ContactAddress") {
                    contactInfo.contactAddress = this.assembleContactAddress(child);
                }
            }

            return contactInfo;
        };

        WmsCapabilities.prototype.assembleContactPersonPrimary = function (element) {
            var info = {};

            var children = element.children || element.childNodes;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "ContactPerson") {
                    info.contactPerson = child.textContent;
                } else if (child.localName === "ContactOrganization") {
                    info.contactOrganization = child.textContent;
                }
            }

            return info;
        };

        WmsCapabilities.prototype.assembleContactAddress = function (element) {
            var address = {};

            var children = element.children || element.childNodes;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "AddressType") {
                    address.addressType = child.textContent;
                } else if (child.localName === "Address") {
                    address.address = child.textContent;
                } else if (child.localName === "City") {
                    address.city = child.textContent;
                } else if (child.localName === "StateOrProvince") {
                    address.stateOrProvince = child.textContent;
                } else if (child.localName === "PostCode") {
                    address.postCode = child.textContent;
                } else if (child.localName === "Country") {
                    address.country = child.textContent;
                }
            }

            return address;
        };

        WmsCapabilities.prototype.assembleCapability = function (element) {
            var capability = {
                capsDoc: this
            };

            var children = element.children || element.childNodes;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "Request") {
                    capability.request = this.assembleRequests(child);
                } else if (child.localName === "Exception") {
                    capability.exception = this.assembleException(child);
                } else if (child.localName === "Layer") {
                    capability.layers = capability.layers || [];
                    capability.layers.push(new WmsLayerCapabilities(child, capability));
                }
            }

            return capability;
        };

        WmsCapabilities.prototype.assembleRequests = function (element) {
            var requests = {};

            var children = element.children || element.childNodes;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "GetCapabilities") {
                    requests.getCapabilities = this.assembleRequest(child);
                } else if (child.localName === "GetMap") {
                    requests.getMap = this.assembleRequest(child);
                } else if (child.localName === "GetFeatureInfo") {
                    requests.getFeatureInfo = this.assembleRequest(child);
                }
            }

            return requests;
        };

        WmsCapabilities.prototype.assembleRequest = function (element) {
            var request = {
                name: element.localName
            };

            var children = element.children || element.childNodes;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "Format") {
                    request.formats = request.formats || [];
                    request.formats.push(child.textContent);
                } else if (child.localName === "DCPType") {
                    var children2 = child.children || child.childNodes;
                    for (var c2 = 0; c2 < children2.length; c2++) {
                        var child2 = children2[c2];
                        if (child2.localName === "HTTP") {
                            var children3 = child2.children || child2.childNodes;
                            for (var c3 = 0; c3 < children3.length; c3++) {
                                var child3 = children3[c3];
                                if (child3.localName === "Get") {
                                    var children4 = child3.children || child3.childNodes;
                                    for (var c4 = 0; c4 < children4.length; c4++) {
                                        var child4 = children4[c4];
                                        if (child4.localName === "OnlineResource") {
                                            request.url = child4.getAttribute("xlink:href");
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            return request;
        };

        WmsCapabilities.prototype.assembleException = function (element) {
            var exception = {};

            var children = element.children || element.childNodes;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "Format") {
                    exception.formats = exception.formats || [];
                    exception.formats.push(child.textContent);
                }
            }

            return exception;
        };

        return WmsCapabilities;
    });