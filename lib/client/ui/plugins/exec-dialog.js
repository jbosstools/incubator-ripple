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

var emulatorBridge = ripple('emulatorBridge');
var showExecDilogCheckbox = document.getElementById('show-exec-dialog-checkbox');
function logPluginError(service, action) {
    emulatorBridge.window().console.error("Plugin " + service + "." + action +" is not supported");
};

function exec(func) {
    return function () {
        var val = $("#exec-response").val();
        //TODO: handle multiple args
        if (func) {
            func.apply(null, val ? [JSON.parse(val)] : []);
        }
        $("#exec-dialog").dialog("close");
    };
}

module.exports = {
    initialize: function () {
        $("#exec-dialog").dialog({
            autoOpen: false,
            modal: true,
            title: "Plugin is not supported :(",
            width: 450,
            close: function() {
               // JBIDE-17588 ProceessUnsupportedPluginsPopUp.java browser function
               emulatorBridge.window().csProceessUnsupportedPluginsPopUp(showExecDilogCheckbox.checked);
            },
            position: 'center'
        }).hide();
    },

    show: function (service, action, success, fail) {
        // JBIDE-17588 ProceessUnsupportedPluginsPopUp.java browser function
        logPluginError(service, action);
        if (emulatorBridge.window().csProceessUnsupportedPluginsPopUp()) {
          showExecDilogCheckbox.checked = false; // Unchecking checkbox
          $("#exec-service").text(service);
          $("#exec-action").text(action);
          $("#exec-dialog").dialog("open");
          $("#exec-dialog").dialog("widget");
        }
    }
};
