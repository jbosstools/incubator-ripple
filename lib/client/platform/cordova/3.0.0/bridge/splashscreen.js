/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
 */
var ui = ripple('ui'),
    emulatorBridge = ripple('emulatorBridge');

module.exports = {
    show: function () {
        var splashScreen = document.getElementById("splashscreen");
        var csSplashScreen = emulatorBridge.document().getElementById("splashscreen");
        if (!csSplashScreen) { 
          var csSplashScreen = splashScreen.cloneNode(true);
          emulatorBridge.document().body.appendChild(csSplashScreen);
          csSplashScreen.style.cssText = "position: fixed;"  // div covers 100% of page (not screen) 
                                       + "left: 0px;" 
                                       + "top: 0px;" 
                                       + "width: 100%;" 
                                       + "height: 100%;" 
                                       + "z-index: 2147483646;"
                                       + "text-align:center;" 
                                       + "font-family: Tahoma, Geneva, sans-serif;" 
                                       + "background-color: white;";
        }
    },
    hide: function () {
        var csSplashScreen =  emulatorBridge.document().getElementById("splashscreen");
        if (csSplashScreen) {
            csSplashScreen.parentNode.removeChild(csSplashScreen);
        } 
    }
};
