/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        app.receivedEvent('deviceready');

    },
    // Update DOM on a Received Event
    receivedEvent: function (id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        // this.showAlert('Store Initialized', 'Info');
        //window.localStorage.setItem("Username", "Alex");
        var usernameElement = document.getElementById("username");
        //alert(usernameElement);
        usernameElement.innerHTML = getUserName();
        //usernameElement.html("hi");
        //$('username').html(getUserName());
        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },
    showAlert: function (message, title) {
        if (navigator.notification) {
            navigator.notification.alert(message, null, title, 'OK');
        } else {
            alert(title ? (title + ": " + message) : message);
        }
    },
    // Register events
    registerEvents: function () {
        var self = this;
        // Check of browser supports touch events...
        if (document.documentElement.hasOwnProperty('ontouchstart')) {
            // ... if yes: register touch event listener to change the "selected" state of 8he item
            $('body').on('touchstart', 'a', function (event) {
                $(event.target).addClass('tappable-active');
            });
            $('body').on('touchend', 'a', function (event) {
                $(event.target).removeClass('tappable-active');
            });
        } else {
            // ... if not: register mouse events instead
            $('body').on('mousedown', 'a', function (event) {
                $(event.target).addClass('tappable-active');
            });
            $('body').on('mouseup', 'a', function (event) {
                $(event.target).removeClass('tappable-active');
            });
        }
    }
};

function setUserName(name) {
    window.localStorage.setItem("Username", name);
}

function getUserName() {
    return window.localStorage.getItem("Username");
}


function updateUserName() {
    var usernameElement = document.getElementById("username_input");
    username = usernameElement.value;
    //alert(username);
    window.localStorage.setItem("Username", username);
    var usernameElement = document.getElementById("username");
    //alert(usernameElement);
    usernameElement.innerHTML = getUserName();
}

function get_profile(token) {
    var xhttp = new XMLHttpRequest();
    var usernameElement;
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4) {
            if (xhttp.status == 200) {
                response = JSON.parse(xhttp.responseText);
                usernameElement = document.getElementById("username");
                if (response.status == "success") {
                    usernameElement.innerHTML = "Profile Loaded Successful";
                    window.localStorage.setItem("profile", response.profile);
                    var profileElement = document.getElementById("profile");
                    profileElement.innerHTML = response.profile["First Name"] + " " + response.profile["Last Name"] + " " + response.profile["Gender"];

                } else {
                    usernameElement.innerHTML = "Profile Load Failed";
                }
            }
            else {
                /* Internal server error or CORS error */
                usernameElement = document.getElementById("username");
                usernameElement.innerHTML = "Profile Load Failed (Server Error)";
            }
        }

    };

    xhttp.open("POST", "https://wellbeing-mobile.crc.nd.edu/mobile_app_api/get_profile/", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("token=" + window.localStorage.getItem("Token"));

}


function login(username, password) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4) {
            if (xhttp.status == 200) {
                response = JSON.parse(xhttp.responseText);

                var usernameElement = document.getElementById("username");
                if (response.status == "success") {
                    usernameElement.innerHTML = "Login Successful";
                    window.localStorage.setItem("Token", response.token);
                    get_profile(response.token);
                } else {
                    usernameElement.innerHTML = "Login Failed";
                    window.localStorage.removeItem("Token");
                }
            }
            else {
                /* Internal server error or CORS error */
                usernameElement = document.getElementById("username");
                usernameElement.innerHTML = "Login Failed (Server Error)";
            }
        }

    };

    xhttp.open("POST", "https://wellbeing-mobile.crc.nd.edu/mobile_app_api/get_token/", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    var passwordElement = document.getElementById("password_input");
    password = passwordElement.value;
    xhttp.send("username=" + getUserName() + "&password=" + password);

    var usernameElement = document.getElementById("username");
    usernameElement.innerHTML = "Login in Progress";
}

function click() {
    parentElement = document.getElementById("deviceready");
    listeningElement = parentElement.querySelector('.listening');
    listeningElement.setAttribute('style', 'display:none;');
}
