// index.js
const { handlePopup } = require('./popup');
const {addPopupStyles}=require('./popupStyles');
const applyMediaQueryConfigurations = require('./mediaQueries');



document.addEventListener("DOMContentLoaded", function () {
    const config = window.fletchApp || {};

    // Define the default values
    const defaults = {
        src: "https://pethub-wsb.fletch.co",
        queryParams: {},
        popup: false,
        popupWidth: "60%",
        popupHeight: "60%", 
    };

    const mergedConfig = { ...defaults, ...config};

    console.log("DOMContentLoaded event fired");
    // Apply media query configurations
    applyMediaQueryConfigurations(mergedConfig);

    // Listen for changes in screen size
    window.addEventListener('resize', () => {
        // Reapply media query configurations when the window is resized
        applyMediaQueryConfigurations(fletchApp);
    });

     // Initialize popup and styles
     handlePopup(mergedConfig);
     addPopupStyles();

    
});
