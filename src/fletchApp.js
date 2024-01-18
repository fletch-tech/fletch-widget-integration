// fletchApp.js
class FletchApp {
 init(options) {
    const { src, iframeProps, popup, popupProps,queryParams,mediaQueries } = options;
    const container = document.getElementById("iframecontainer");

    // Add styles dynamically
    addStyles();

      // Combine queryParams from the URL and provided queryParams
      const allQueryParams = { ...getQueryParamsFromUrl(), ...queryParams };

      // Add query parameters to the source URL if any queryParams are defined
      const srcWithParams = Object.keys(allQueryParams).length > 0
        ? addQueryParams(src, allQueryParams)
        : src;

    if (popup) {
      const popupButton = document.createElement("button");
      popupButton.id = "popupIframecontainer";
      popupButton.textContent = "Open Popup";
      popupButton.addEventListener("click", () => {
        document.body.classList.add("modal-open");

        const modalOverlay = createModalOverlay();
        const popupContainer = createPopupContainer(popupProps);
        const closeButton = createCloseButton(() => {
          document.body.classList.remove("modal-open");
          document.body.removeChild(modalOverlay);
        }, popupProps.closeButtonStyles);

        popupContainer.appendChild(closeButton);
        popupContainer.appendChild(createIframe(srcWithParams, iframeProps));
        modalOverlay.appendChild(popupContainer);
        document.body.appendChild(modalOverlay);
      });

      container.appendChild(popupButton);
    } else {
      container.appendChild(createIframe(srcWithParams, iframeProps));
    }

  }
}

function createIframe(src, props) {
  const iframe = document.createElement("iframe");
  iframe.src = src || "";
  iframe.width = props.width || "100%";
  iframe.height = props.height || "500px";
  iframe.border = props.border || "1";
  iframe.allowfullscreen = props.allowfullscreen || true;
  iframe.scrolling = props.scrolling || "yes";
  Object.assign(iframe.style, props.style || {}); // Apply styles here

  return iframe;
}

function createModalOverlay() {
  const modalOverlay = document.createElement("div");
  modalOverlay.className = "modal-overlay";
  return modalOverlay;
}

function createPopupContainer(props) {
  const popupContainer = document.createElement("div");
  popupContainer.className = "popup-container";

  // Use default styles if none are provided
  const defaultStyles = {
    width: "100%",
    height: "500px",
    border: "2px solid #ccc",
  };
  const styles = Object.assign({}, defaultStyles, props.styles || {});
  Object.assign(popupContainer.style, styles);

  return popupContainer;
}

function createCloseButton(onClick, styles) {
  const closeButton = document.createElement("span");
  closeButton.className = "close-button";
  closeButton.innerHTML = "&times;";
  closeButton.addEventListener("click", onClick);
  Object.assign(closeButton.style, styles);
  return closeButton;
}

function addQueryParams(url, params) {
  const queryString = Object.keys(params)
    .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(params[key]))
    .join("&");

  return url + (url.includes("?") ? "&" : "?") + queryString;
}

function getQueryParamsFromUrl() {
  const queryParams = {};
  const queryString = window.location.search.substring(1);
  const urlParams = new URLSearchParams(queryString);

  for (const [key, value] of urlParams) {
    queryParams[key] = value;
  }

  return queryParams;
}

function addStyles() {
  const style = document.createElement("style");
  style.textContent = `
    .modal-open {
      overflow: hidden;
    }

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .popup-container {
      background: #fff;
      padding: 0px;
      border-radius: 8px;
      position: relative;
      overflow: hidden;
    }

    .close-button {
      position: absolute;
      top: 10px;
      right: 10px;
      cursor: pointer;
      font-size: 18px;
      color: #333;
    }
  `;
  document.head.appendChild(style);
}

var fletchApp = new FletchApp()
