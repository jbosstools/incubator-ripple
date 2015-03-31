/*
 * CORDOVASIM
 *
 * HACK for JavaFx 2.2 (JDK 7)
 * JavaFX 2.2 (JDK 7) does not support localStorage - https://javafx-jira.kenai.com/browse/RT-29584
 * Fortunately fixed for JavaFX 8 (Lombard)
 *
 */ 
window.localStorage2 = window.localStorage || window.sessionStorage || {
    setItem: function(key, value) {
        localStorage2[key] = value;
    },
    clear: function() {}
};
