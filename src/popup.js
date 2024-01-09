// popup.js
import { createIframe } from "./IframeUtils";

export const handlePopup = (config) => {
  if (!config.popup) {
    console.error("Error: Popup is not enabled.");
    return;
  }

  const button = document.querySelector("button#openIframeContainer");
  const iframeContainer = document.querySelector("div#iframeContainer");

  if (!button && !iframeContainer) {
    // we need either a button or an iframe container
    // button is used to open the widget in a popup
    // iframeContainer is used to open the widget in an iframe

    console.error(
      "Error: Button or element with id 'iframeContainer' not found."
    );
    return;
  }

  // we can use either a button or an iframe container
  if (button) {
    // if button is present, we will open the widget in a popup

    button.addEventListener("click", () => {
      document.body.classList.add("modal-open");

      const modalOverlay = document.createElement("div");
      modalOverlay.className = "modal-overlay";

      const popupContainer = document.createElement("div");

      if (!popupContainer) {
        return;
      }
      popupContainer.className = "popup-container";
      popupContainer.style.width = config.popupWidth;
      popupContainer.style.height = config.popupHeight;

      const popupIframe = createIframe(config);

      const closeButton = document.createElement("span");
      closeButton.className = "close-button";
      closeButton.innerHTML = "&times;";
      closeButton.addEventListener("click", () => {
        document.body.classList.remove("modal-open");
        document.body.removeChild(modalOverlay);
      });

      popupContainer.appendChild(closeButton);
      popupContainer.appendChild(popupIframe);
      modalOverlay.appendChild(popupContainer);
      document.body.appendChild(modalOverlay);
    });
  } else {
    // else we will open the widget in an iframe

    const iframe = createIframe(config);
    iframeContainer.appendChild(iframe);
  }
};
