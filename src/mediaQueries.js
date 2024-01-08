// mediaQueries.js
const applyMediaQueryConfigurations = (fletchApp) => {
    const containers = document.querySelectorAll('#iframeContainer');

    const applyConfig = (config) => {
        containers.forEach(container => {
            container.style.height = config.height;
            container.style.width = config.width;
            container.style.fontSize = config.fontSize;
            container.style.color = config.color;
            container.style.backgroundColor=config.backgroundColor;
            
        });

        if (config.popup) {
            console.log("Popup enabled for this screen size");
            // Add logic to handle popup for this screen size
        }
    };

    const handleMediaQueryChange = (event) => {
        let matched = false;

        fletchApp.mediaQueries.forEach(({ query, config }) => {
            if (event.matches && window.matchMedia(query).matches) {
                // Apply configuration for this media query
                applyConfig(config);
                matched = true;
            }
        });

        // If no media query matches, apply default configuration
        if (!matched) {
            console.log("No media query matched, applying default configuration");
            applyConfig(fletchApp); // Apply default configuration from fletchApp object in HTML
        }
    };

    // Remove existing event listeners
    fletchApp.mediaQueries.forEach(({ query }) => {
        window.matchMedia(query).removeEventListener('change', handleMediaQueryChange);
    });

    // Add new event listeners
    fletchApp.mediaQueries.forEach(({ query }) => {
        window.matchMedia(query).addEventListener('change', handleMediaQueryChange);
    });

    // Apply configuration initially
    handleMediaQueryChange({ matches: window.matchMedia(fletchApp.mediaQueries[0].query).matches });
};

export default applyMediaQueryConfigurations;
