// popupStyles.js
(function () {
  var styles = `
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
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
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


      body.modal-open {
          overflow: hidden;
      }
  `;

  var styleElement = document.createElement("style");
  styleElement.type = "text/css";
  styleElement.appendChild(document.createTextNode(styles));
  document.head.appendChild(styleElement);
})();
