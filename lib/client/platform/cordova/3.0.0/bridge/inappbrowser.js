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

/**
 * InAppBrowser plugin implementation for CordovaSim
 * 
 */
var emulatorBridge = ripple('emulatorBridge'),
    event = ripple('event'),
    inAppWin,
    backbuttonFunction,
    csInAppBrowser,
    callbackCounter = 0,
    formatCode = function (code) {
      if (code) {
        return (code) ? code.replace(/(\r\n|\n|\r|\t)/gm,"") : null;
      }
    }, 
    getAbsoluteUrl = function (link) {
         var anchor = document.createElement('a');
         anchor.href = link;
         return anchor.href;
    };

module.exports = {
    open: function (win, fail, args) {
        var url = args[0],
            target = args[1],  // _self, _blank, _system - doesn't matter for CordovaSim
            options = args[2]; // only "location" (set to 'yes' or 'no' to turn the location bar) is supported on all platforms - CordovaSim doesn't support it  
            
            inAppWin = win;

            trigger = function (event) {
                return function () {
                    win({type: event, url: url});
                };
            };

            if (!csInAppBrowser) {
                window.needToOpenInAppBrowser = true; // see org.jboss.tools.vpe.cordovasim.plugins.inappbrowser.InAppBrowserLoader
                window.needToProcessInAppBrowserEvents = true; // see org.jboss.tools.vpe.cordovasim.CordovaSimControlHandler 

                backbuttonFunction = function () {
                    module.exports.close();
                } 
                emulatorBridge.document().addEventListener("backbutton", backbuttonFunction, false);
                csInAppBrowser = emulatorBridge.window()._bsOriginalWindowOpen(url, "_csInAppBrowser");
                event.once("browser-close", trigger('exit'));
            }
    },

    // See inAppBrowserLoader.java location listener
    loadstart: function(url) {
      inAppWin({type: 'loadstart', url: url});
    },

    loadstop: function(url) {
      inAppWin({type: 'loadstop', url: url});
    },

    loaderror: function(url) {
      inAppWin({type: "loaderror", url: url});
    },

    show: function (win, fail, args) {
      console.log(args);
    },

    close: function (win, fail, args) {
        if (csInAppBrowser) {
            window.needToProcessInAppBrowserEvents = false;
            emulatorBridge.document().removeEventListener("backbutton", backbuttonFunction, false);
            csInAppBrowser.close();
            csInAppBrowser = null; 
        }
    },

    injectScriptCode: function (win, fail, args) {
        var code = args[0];
        code = formatCode(code);
        
        if (csInAppBrowser) {
              var result;
              var successName = "csInAppBrowserSuccessCallBackName" + callbackCounter++;
              var failName =  "csInAppBrowserFailCallBackName" + callbackCounter++;
              emulatorBridge.window()[successName] = win;
              emulatorBridge.window()[failName] = fail;
            try {
              result = emulatorBridge.window().csInAppExecScript(code, successName, failName); // BrowserFunction - see org.jboss.tools.vpe.cordovasim.plugins.inappbrowser.ExecScriptFunction
            } catch (e) {
              console.log("Java error occurred:" + e.message);
            }
        }
    },

    injectScriptFile: function (win, fail, args) {
        jsFileLink = args[0];
        jsFileLink = getAbsoluteUrl(jsFileLink);

        if(csInAppBrowser) {
             var code  = "var injectedJsFile = document.createElement('script');"
                       + "injectedJsFile.setAttribute('type','text/javascript');"
                       + "injectedJsFile.setAttribute('src', '" + jsFileLink + "');"
                       + "document.getElementsByTagName('head')[0].appendChild(injectedJsFile);";
          module.exports.injectScriptCode(win, fail, [code]); 
        }
    },

    injectStyleCode: function (win, fail, args) {
        cssStyle = args[0];
        
        if (csInAppBrowser) {
           var code  = "var injectedCss = document.createElement('style');"
                     + "injectedCss.type = 'text/css';"
                     + "injectedCss.innerHTML = '" + cssStyle + "';"
                     + "document.getElementsByTagName('head')[0].appendChild(injectedCss);";
           module.exports.injectScriptCode(win, fail, [code]); 
        }
    },

    injectStyleFile: function (win, fail, args) {
        cssFileLink = args[0];
        cssFileLink = getAbsoluteUrl(cssFileLink);

        if (csInAppBrowser) {
          var code = "var injectedCssFile = document.createElement('link');"
                   + "injectedCssFile.setAttribute('rel',  'stylesheet');"
                   + "injectedCssFile.setAttribute('type', 'text/css');"
                   + "injectedCssFile.setAttribute('href', '" + cssFileLink + "');"
                   + "document.getElementsByTagName('head')[0].appendChild(injectedCssFile);";
          module.exports.injectScriptCode(win, fail, [code]); 
        }
    }
};
