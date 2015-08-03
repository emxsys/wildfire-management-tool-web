/* 
 * Copyright (c) 2015, Bruce Schubert <bruce@emxsys.com>
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     - Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *
 *     - Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *
 *     - Neither the name of Bruce Schubert,  nor the names of its 
 *       contributors may be used to endorse or promote products derived
 *       from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/*global define*/

/**
 * Mobile Menu Class. 
 * 
 * The MobileMenu allows for the easy creation of overlaying menus that slide into view when a specified button is clicked.
 * 
 * To make a menu: 
 * Create a "<nav>" element as the child of the "<body>" element with a unique ID and the c-menu class.
 * Create a "<div>" element directly after the "<nav>" element with a unique ID and the c-mask class.
 * Call the Menu function, specifying the created elements' IDs. Example in the initialize function below.
 * 
 * @module {MobileMenu}
 * 
 * @author Theodore Walton
 */

define([],
    function () {
        "use strict";
        var MobileMenu = {
            menuItems: [],
            /**
             * Initializes the MobileMenu framework by showing menu elements hidden during startup and 
             * adding click handlers that toggle activation.
             */
            initialize: function () {
                var toggles = $("#mobileMenuButton"),
                    toggle,
                    i,
                    mobileMenu,
                    mobileMenuBtn;

                // Function handling the toggle of the mobile menu button.
                $(function () {

                    // MobileMenu items are hidden during startup--show them now.
                    $('.c-menu').each(function () {
                        $(this).removeClass('hidden');
                    });

                    // Adds a click handler to the given element that toggles the is-active state
                    function toggleHandler(toggle) {
                        toggle.addEventListener("click", function (e) {
                            e.preventDefault();
                            if (this.classList.contains("is-active") === true) {
                                this.classList.remove("is-active");
                            } else {
                                this.classList.add("is-active");
                            }
                        });
                    }
                    for (i = toggles.length - 1; i >= 0; i--) {
                        toggle = toggles[i];
                        toggleHandler(toggle);
                    }


                    $('#c-maskMain').on('click', function (e) {
                        e.preventDefault();
                        toggle.classList.remove("is-active");
                    });
                    $('#ctrlPanelGlobe').on('click', function (e) {
                        e.preventDefault();
                        toggle.classList.remove("is-active");
                    });
                    $('#findMe').on('click', function (e) {
                        e.preventDefault();
                        toggle.classList.remove("is-active");
                    });
                    $('#layersListButton').on('click', function (e) {
                        e.preventDefault();
                        toggle.classList.remove("is-active");
                    });
                    $('#pushpinMarkersToggle').on('click', function (e) {
                        e.preventDefault();
                        toggle.classList.remove("is-active");
                    });
                    $('#icsMarkersToggle').on('click', function (e) {
                        e.preventDefault();
                        toggle.classList.remove("is-active");
                    });
                    $('#weatherWeatherScoutsButton').on('click', function (e) {
                        e.preventDefault();
                        toggle.classList.remove("is-active");
                    });
                    $('#firesFireLookoutsButton').on('click', function (e) {
                        e.preventDefault();
                        toggle.classList.remove("is-active");
                    });
                    // What does this do?!
                    $('#firesWildlandFiresButton').on('click', function (e) {
                        e.preventDefault();
                        toggle.classList.remove("is-active");
                    });
                    $('#allMarkersList').on('click', 'button.mkr-goto', function (e) {
                        e.preventDefault();
                        toggle.classList.remove("is-active");
                    });

                });

                mobileMenu = new MobileMenu.Menu(
                    '#mobileMenu',
                    'slide-left',
                    '#c-maskMain',
                    [''],
                    ['#ctrlPanelGlobe', 
                        '#findMe', 
                        '#layersListButton', 
                        '#icsMarkersToggle', 
                        '#pushpinMarkersToggle', 
                        '#weatherWeatherScoutsButton', 
                        "#firesFireLookoutsButton",
                        "#firesWildlandFiresButton"],
                    '50',
                    '100%',
                    '85%'
                    );


                mobileMenuBtn = document.querySelector('#mobileMenuButton');
                mobileMenuBtn.addEventListener('click', function (e) {
                    e.preventDefault();
                    if (this.classList.contains("is-active") === true) {
                        mobileMenu.open();
                    }
                    else {
                        mobileMenu.close();
                    }

                });

                $('#allMarkersList').on('click', 'button.mkr-goto', function (e) {
                    mobileMenu.close();
                });
            },
            add: function (options) {
                // TODO: provide defaults for missing options.
                this.menuItems.push(new MobileMenu.Menu(
                    options.menuId,
                    options.type,
                    options.maskId,
                    options.openBtnIds,
                    options.closeBtnIds,
                    options.zIndex,
                    options.height,
                    options.width));
            },
            build: function () {
                var i, max,
                    mobileMenuBtn,
                    mobileMenu,
                    closeBtnIds = [];
                
                for (i = 0, max = this.menuItems.length; i < max; i++) {
                    closeBtnIds.push(this.menuItems[i].menuId);
                }
                mobileMenu = new MobileMenu.Menu(
                    '#mobileMenu',
                    'slide-left',
                    '#c-maskMain',
                    [''],
                    [
                        '#ctrlPanelGlobe', 
                        '#findMe', 
                        '#layersListButton', 
                        '#icsMarkersToggle', 
                        '#pushpinMarkersToggle', 
                        '#weatherWeatherScoutsButton', 
                        "#firesFireLookoutsButton"],
                    '50',
                    '100%',
                    '85%'
                    );


                mobileMenuBtn = document.querySelector('#mobileMenuButton');
                mobileMenuBtn.addEventListener('click', function (e) {
                    e.preventDefault();
                    if (this.classList.contains("is-active") === true) {
                        mobileMenu.open();
                    }
                    else {
                        mobileMenu.close();
                    }

                });
            },
            /**
             * Constructs a Menu object.
             * @constructor
             * @param {type} menuId The menu ID.
             * @param {type} type The menu type.
             * @param {type} maskId The ID of the mask.
             * @param {type} openBtnIds The ID of the button that opens the menu.
             * @param {type} closeBtnIds Array of button IDs that close the menu.
             * @param {type} zIndex
             * @param {type} height
             * @param {type} width
             * @returns {MobileMenu.Menu}
             */
            Menu: function (
                menuId,
                type,
                maskId,
                openBtnIds,
                closeBtnIds,
                zIndex,
                height,
                width
                ) {

                var i, options;

                function extend(a, b) {
                    var key;
                    for (key in b) {
                        if (b.hasOwnProperty(key)) {
                            a[key] = b[key];
                        }
                    }
                    return a;
                }

                //Initialize class variables
                this.body = document.body;
                this.mask = $(maskId);
                this.menu = $(menuId);
                this.openBtns = [];
                this.closeBtns = [];

                //build array of opening button objects
                for (i = 0; i < openBtnIds.length; i++) {
                    this.openBtns.push($(openBtnIds[i]));
                }

                //build array of closing button objects
                for (i = 0; i < closeBtnIds.length; i++) {
                    this.closeBtns.push($(closeBtnIds[i]));
                }

                /**
                 * Menu Options.
                 */
                this.options = {
                    menuId: '', //the menu ID                        
                    type: '', // The menu type
                    maskId: '', // The ID of the mask
                    openBtnIds: [''], // The ID of the buttons that open the menu
                    closeBtnIds: [''], // The ID of the buttons that close the menu    
                    zIndex: '',
                    height: '',
                    width: ''            // The ID of the mask
                };

                options = {
                    menuId: menuId, //the menu ID                        
                    type: type, // The menu type
                    maskId: maskId, // The ID of the mask
                    openBtnIds: openBtnIds, // The ID of the button that opens the menu
                    closeBtnIds: closeBtnIds, // The ID of the button that closes the menu    
                    zIndex: zIndex,
                    height: height,
                    width: width
                };

                //Open Menu Function.                
                this.open = function () {
                    this.body.classList.add('has-active-menu');
                    this.menu.addClass('is-active');
                    this.mask.addClass('is-active');
                };

                //Close Menu Function.                
                this.close = function () {
                    this.body.classList.remove('has-active-menu');
                    this.menu.removeClass('is-active');
                    this.mask.removeClass('is-active');
                };

                this._init = function () {
                    //initialize the menu type
                    this.menu.addClass('c-menu--' + type);

                    //set the width of the menu
                    this.menu.css('width', width);

                    //set the height of the menu
                    this.menu.css('height', height);

                    //Set the z-index of the menu
                    this.menu.css('z-index', zIndex);

                    //set the z-index of the mask
                    this.mask.css('z-index', zIndex - 1);

                    //initialize event handlers for the menu
                    this._initEvents();
                };

                //Initialize Event Handlers.                 
                this._initEvents = function () {
                    var Menu = this;
                    // Event for clicks on the mask.
                    this.mask.on('click', function (e) {
                        e.preventDefault();
                        Menu.close();
                    });
                    //Event for the button that opens the menu
                    this.openBtns.forEach(function (element, index, array) {
                        element.on('click', function (e) {
                            e.preventDefault();
                            Menu.open();
                        });
                    });
                    //Event for the button that closes the menu
                    this.closeBtns.forEach(function (element, index, array) {
                        element.on('click', function (e) {
                            e.preventDefault();
                            Menu.close();
                        });
                    });
                };

                //Initialize New Menu                
                this.options = extend({}, this.options);
                extend(this.options, options);
                this._init();
            }

        };
        return MobileMenu;
    }

);


