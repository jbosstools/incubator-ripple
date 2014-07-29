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
var camera = ripple('ui/plugins/camera'),
    emulatorBridge = ripple('emulatorBridge'),
    event = ripple('event');

function getBase64Image(uri, cb, encodingType) { // JBIDE-14894 support of the 'DATA_URL' destination Type 
    var img = new Image();
    img.src = uri;

    img.onload = function() {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        var imageEncoding = (encodingType === emulatorBridge.window().Camera.EncodingType.PNG) ? "image/png" : "image/jpeg"; // Encoding Type - Phonegap docs: http://docs.phonegap.com/en/2.8.0/cordova_camera_camera.md.html#Camera 
        var dataURL = canvas.toDataURL(imageEncoding);
        cb(dataURL.replace(/^data:image\/(png|jpeg);base64,/, ""));
    }
}

module.exports = {
    takePicture: function(success, error, args) {
        var destinationType = args[1]; // Destination Type - Phonegap docs: http://docs.phonegap.com/en/2.8.0/cordova_camera_camera.md.html#Camera 
        var encodingType = args[5]; // Encoding Type - Phonegap docs: http://docs.phonegap.com/en/2.8.0/cordova_camera_camera.md.html#Camera 

        event.once("captured-image", function(uri) {
            if (destinationType === emulatorBridge.window().Camera.DestinationType.DATA_URL) {
                getBase64Image(uri, success, encodingType);
            } else {
                success(uri); // Destination Type "File_URI" 
            }
        });
        camera.show();
    },
    cleanup: function(success) {
        success();
    }
};
