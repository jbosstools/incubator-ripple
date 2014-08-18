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
var constants = ripple('constants'),
    emulatorBridge = ripple('emulatorBridge'),
    exception = ripple('exception');

function _validateAndInitNType(nType) {
    nType = nType || "normal";

    if (nType !== "normal" && nType !== "error") {
        exception.raise(exception.types.NotificationType, "Unknown Notification Type == " + nType + ",when dealing with Console notification.");
    }

    return nType;
}

function _processNotification(nType, stateType, message) {
    nType = _validateAndInitNType(nType);
    message = message || "";

    var display,
        displayText,
        className,
        notificationIcon,
        popUpBox = emulatorBridge.window().document.getElementById(constants.NOTIFICATIONS.MAIN_CONTAINER_CLASS),
        popUpMsgBox = emulatorBridge.window().document.getElementById(constants.NOTIFICATIONS.MESSAGE_TEXT_CONTAINER_CLASS),
        box = document.getElementById(constants.NOTIFICATIONS.MAIN_CONTAINER_CLASS),
        msgBox = document.getElementById(constants.NOTIFICATIONS.MESSAGE_TEXT_CONTAINER_CLASS);

    className = "ui-widget";

    switch (stateType) {

    case constants.NOTIFICATIONS.STATE_TYPES.CLOSE:
        display = "display: none;"; //need to do this better.
        displayText = "";
        break;

    case constants.NOTIFICATIONS.STATE_TYPES.OPEN:
        display = "display: block;"; //need to do this better.
        displayText = message;
        if (nType === "error") {
            displayText = "Oh Snap!\n\n" + displayText;
            className += " ui-state-error ui-corner-all";
            notificationIcon = '<span class="ui-icon ui-icon-alert" style="float: left; margin-right: .3em;"></span>';
        }
        else {
            className += " ui-state-highlight ui-corner-all";
            notificationIcon = '<span class="ui-icon ui-icon-info" style="float: left; margin-right: .3em;"></span>';
        }
        break;

    default:
        exception.raise(exception.types.NotificationStateType, "Unknown StateType == " + stateType.toString());
    }

    if (!popUpBox) {
        msgBox.innerHTML = notificationIcon + displayText;
        box.setAttribute("class", className);
        // box.setAttribute("style", display); // don't show notification pop-up on the main page

        var notificationPanel = box.cloneNode(true);
        notificationPanel.setAttribute("style", "position: absolute; width: 70%;" +
                                                "background: #333333;" +
                                                "font-family: \"Helvetica\", Arial, sans-serif;" +
                                                "color: white;" +
                                                "min-height: 100px;" +
                                                "top: 20%;" +
                                                "left: 10%;" +
                                                "padding: .5em 1em;" +
                                                "font-size: 0.92em;" +
                                                "-webkit-box-shadow: 0 1px 10px rgb(0,0,0);" +
                                                "box-shadow: 0 1px 10px rgb(0,0,0);" +
                                                "z-index: 1100;" +
                                                "display: " + display + ";");
        var closeButton = notificationPanel.getElementsByClassName(constants.NOTIFICATIONS.CLOSE_BUTTON_CLASS)[0];
        closeButton.setAttribute("style", "position: relative;" +
                                          "float: right;" +
                                          "z-index: 999;" +
                                          "cursor: pointer;" +
                                          "padding: 3px 5px;" +
                                          "-webkit-border-radius: 6px;" +
                                          "border-radius: 6px;");
        closeButton.addEventListener("click", function(){
            var notificationPanel = emulatorBridge.window().document.getElementById(constants.NOTIFICATIONS.MAIN_CONTAINER_CLASS);
            notificationPanel.parentNode.removeChild(notificationPanel);
        }, false);
        emulatorBridge.window().document.body.appendChild(notificationPanel);
    } else {
        popUpMsgBox.innerHTML = notificationIcon + displayText;
        var previousStyle = popUpBox.getAttribute("style"); // XXX have to save previous css
        popUpBox.setAttribute("style", previousStyle + display);
    }

}

function _processConfirm (message,resultCallback,title,buttonLabels) {
    buttonLabels = buttonLabels || "";
    message = message || "";
    title = title || "Confirm";
    var btnArray = [];
    var buttons = [];

    if( $.isArray( buttonLabels ) ) {
        btnArray = buttonLabels;
    }
    else {
        btnArray = (!buttonLabels || 0 === buttonLabels.length) ? [] : buttonLabels.split(',');
    }

    btnArray.forEach(function(btnLabel,index) {
        var button = {};
        button["text"] = btnLabel;
        button["click"] = function () {
            if (typeof resultCallback !== "undefined") {
                resultCallback(index+1);
            }
            jQuery( this ).dialog( "close" );
        };
        buttons.push(button);
    });

    var dialogBox = jQuery("#confirm-dialog");
    dialogBox.dialog("option","title", title);
    jQuery("#confirm-message").text(message);
    dialogBox.dialog("open");
    if(btnArray.length > 0){
        dialogBox.dialog( "option", "buttons", buttons);
        return;
    }
    var closeBox = function() {
        dialogBox.dialog("close");
    };
    jQuery("#confirm-cancel").button().unbind().bind('click', closeBox).show();
    jQuery("#confirm-ok").button().unbind().bind('click', closeBox).show();
}

module.exports = {
    openNotification: function (nType, msg) {
        _processNotification(nType, constants.NOTIFICATIONS.STATE_TYPES.OPEN, msg);
    },

    closeNotification: function (nType) {
        _processNotification(nType, constants.NOTIFICATIONS.STATE_TYPES.CLOSE);
    },

    confirmNotification: function (message, resultCallback, title, buttonLabels) {
        _processConfirm(message,resultCallback,title,buttonLabels);
    }
};
