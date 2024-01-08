// iframeUtils.js
export const createIframe = (config) => {
  const iframe = document.createElement("iframe");
  const queryParamsString = new URLSearchParams(config.queryParams).toString();

  // Set width and height directly in the iframe object
  iframe.width = config.height;
  iframe.height = config.width;

  // Apply custom styles or use default styles
  const defaultStyles = {
      backgroundColor: "transparent",
    //   position: "absolute",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      border: "0",
      color: "white",
      overflow: "auto"
  };

  const customStyles = config.style || {};
  const combinedStyles = { ...defaultStyles, ...customStyles };
  Object.assign(iframe.style, combinedStyles);

  // Set other properties
  for (const key in config) {
      if (!["queryParams", "popup", "popupWidth", "popupHeight", "style"].includes(key)) {
          iframe[key] = config[key];
      }
  }

  iframe.src = `${config.src}/?${queryParamsString}`;
  return iframe;
};
