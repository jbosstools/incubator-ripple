/*
 * CORDOVASIM
 *
 * Prevent appearing of the page with platform choosing options (always cordova 3.0.0)
 *
 */
if (!customLocalStorage.ripple) {
    var defaultValues = {
        "tinyhippos-ui-application-state-cordova": {
            "id": "tinyhippos-ui-application-state-cordova",
            "key": "ui-application-state-cordova",
            "value": "[{\"domId\":\"devices-container\",\"collapsed\":true,\"pane\":\"left\"},{\"domId\":\"platforms-container\",\"collapsed\":true,\"pane\":\"left\"},{\"domId\":\"information-container\",\"collapsed\":false,\"pane\":\"left\"},{\"domId\":\"settings-container\",\"collapsed\":true,\"pane\":\"right\"},{\"domId\":\"accelerometer-container\",\"collapsed\":true,\"pane\":\"left\"},{\"domId\":\"devicesettings-panel-container\",\"collapsed\":true,\"pane\":\"right\"},{\"domId\":\"gps-container\",\"collapsed\":true,\"pane\":\"right\"},{\"domId\":\"config-container\",\"collapsed\":true,\"pane\":\"right\"},{\"domId\":\"battery-status-container\",\"collapsed\":true,\"pane\":\"right\"},{\"domId\":\"platform-events-container\",\"collapsed\":true,\"pane\":\"left\"}]",
            "prefix": "tinyhippos-"
        },
        "tinyhippos-layout": {
            "id": "tinyhippos-layout",
            "key": "layout",
            "value": "portrait",
            "prefix": "tinyhippos-"
        },
        "tinyhippos-remote": {
            "id": "tinyhippos-remote",
            "key": "remote",
            "prefix": "tinyhippos-"
        },
        "tinyhippos-api-key": {
            "id": "tinyhippos-api-key",
            "key": "api-key",
            "value": "{\"name\":\"cordova\",\"version\":\"3.0.0\"}", // set default values on startup: 'cordova 3.0.0'
            "prefix": "tinyhippos-"
        },
        "tinyhippos-device-key": {
            "id": "tinyhippos-device-key",
            "key": "device-key",
            "prefix": "tinyhippos-"
        },
        "tinyhippos-settings-xhr-proxy-setting": {
            "id": "tinyhippos-settings-xhr-proxy-setting",
            "key": "settings-xhr-proxy-setting",
            "value": "remote",
            "prefix": "tinyhippos-"
        },
        "tinyhippos-settings-xhr-proxy-local-port": {
            "id": "tinyhippos-settings-xhr-proxy-local-port",
            "key": "settings-xhr-proxy-local-port",
            "value": location.port,
            "prefix": "tinyhippos-"
        }
    };
    customLocalStorage.setItem('ripple', JSON.stringify(defaultValues));
}
