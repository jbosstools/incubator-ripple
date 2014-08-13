/*
 * CORDOVASIM
 *
 * HACK for JavaFx 2.2 (JDK 7)
 * JavaFX 2.2 (JDK 7) does not support localStorage - https://javafx-jira.kenai.com/browse/RT-29584
 * Fortunately fixed for JavaFX 8 (Lombard)
 *
 */ 
window.customLocalStorage = window.localStorage || {
    setItem: function(key, value) {
        customLocalStorage[key] = value;
    },
    clear: function() {}
};
