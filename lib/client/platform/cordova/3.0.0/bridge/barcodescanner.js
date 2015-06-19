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
    serviceUrl = "https://chart.googleapis.com/chart?cht=qr&chs=300x300&chld=L|5&chl=";

function _processScanOk(success) {
    var scannedResult = {
        cancelled: false,
        text: $('#scannedText').val(),
        format: $('#formatDropDown option:selected').text()
    };
    success(scannedResult);
}

function _processScanCancel(success) {
    var scannedResult = {
        cancelled: true,
        text: "",
        format: ""
    };
    success(scannedResult);
}

module.exports = {
    scan: function(success, error, args) {
        try {
            // Showing the dialog
            $("#scanDialog").dialog({
                autoOpen: true,
                modal: true,
                title: "Barcode Scanner",
                heigh: 50,
                width: 510,
                position: 'center',
                resizable: false,
                buttons: [{
                    text: "OK",
                    click: function() {
                        $(this).dialog('close');
                        _processScanOk(success);
                    },
                    class: "ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only small-button",
                }, {
                    text: "Cancel",
                    click: function() {
                        $(this).dialog('close');
                        _processScanCancel(success);
                    },
                    class: "ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only small-button",
                }]
            });
        } catch (err) {
            error("Fail to emulate BarcodeScanner.scan() method"); // Something went wrong
        }
    },

    // Uses google QR service - https://developers.google.com/chart/infographics/docs/qr_codes
    encode: function(success, error, args) {
        var data = args[0].data,
            type = args[0].type,
            url = "https://chart.googleapis.com/chart?cht=qr&chs=300x300&chld=L|5&chl=" + data,
            backgroundMask = $('<div id="background-mask">'),
            barcodeWrapper = $('<div id="barcode-wrapper">'),
            barcodeImage = $('<img id="barcode-image">'),
            barcodeData = $('<div id="barcode-data">' + data + '</div>');

        barcodeBackButtonFunction = function() {
            var barcodeWrapper = emulatorBridge.window().document.getElementById('barcode-wrapper');
            var backgroundMask = emulatorBridge.window().document.getElementById('background-mask');

            barcodeWrapper.parentNode.removeChild(barcodeWrapper);
            backgroundMask.parentNode.removeChild(backgroundMask);

            emulatorBridge.window().document.removeEventListener("backbutton", barcodeBackButtonFunction, false); // Force one time execution of the listener
        };

        barcodeImage.attr("src", url);
        barcodeImage.attr("style", "position: relative;"
                                 + "z-index: 2147483647;" // max value of z-index
                                 + "width: 100%;");
        barcodeImage.appendTo(barcodeWrapper);

        barcodeData.attr("style", "position: relative;"
                                + "text-align: center;"
                                + "font-family: Tahoma, Geneva, sans-serif;"
                                + "font-size: 25px;"
                                + "color: black;"
                                + "bottom: 30px;"
                                + "padding: 10px;"
                                + "z-index: 2147483647;"
                                + "background-color: white;");
        barcodeData.appendTo(barcodeWrapper);

        barcodeWrapper.attr("style", "position: absolute;"
                                   + "top: 0;"
                                   + "right: 0;"
                                   + "bottom: 0;"
                                   + "left: 0;"
                                   + "width: 100%;"
                                   + "height: 100%;"
                                   + "min-height: 100%;"
                                   + "z-index: 2147483647;"
                                   + "background-color: white;");

        backgroundMask.attr("style", "position: fixed;" // div covers 100% of page (not screen) - need it for devices with a really small screens
                                   + "left: 0px;"
                                   + "top: 0px;"
                                   + "width: 100%;"
                                   + "height: 100%;"
                                   + "z-index: 2147483646;"
                                   + "background-color: white;");

        barcodeWrapper.appendTo(emulatorBridge.window().document.body);
        backgroundMask.appendTo(emulatorBridge.window().document.body);
        emulatorBridge.window().document.addEventListener("backbutton", barcodeBackButtonFunction, false);
        // success(); ?! under Android VM success function is never called
    }
};
