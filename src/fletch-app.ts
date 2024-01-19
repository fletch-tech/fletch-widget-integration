type Options = {
  src: string;
  usePopup: boolean;
  syncQueryParams: boolean;
  useMiniWidget: boolean;
  iframeProps: {
    width: HTMLIFrameElement["width"];
    height: HTMLIFrameElement["height"];
    allowFullscreen?: HTMLIFrameElement["allowFullscreen"];
    scrolling?: HTMLIFrameElement["scrolling"];
    style?: Partial<HTMLIFrameElement["style"]>;
  };
  popupProps: {
    width: HTMLDivElement["style"]["width"];
    height: HTMLDivElement["style"]["height"];
    style?: Partial<HTMLDivElement["style"]>;
    closeButtonStyles?: Partial<HTMLButtonElement["style"]>;
  };
  queryParams: {
    [key: string]: string;
  };
};

export class FletchApp {
  private _options: Options;
  private _iframeContainerId = "fletch-iframe" as const;
  private _popupButtonId = "fletch-iframe-trigger" as const;
  private _iframeSrc = "";

  constructor() {
    this._options = {
      src: "",
      usePopup: false,
      syncQueryParams: false,
      useMiniWidget: false,
      iframeProps: {
        width: "100%",
        height: "100%",
        allowFullscreen: true,
        scrolling: "no",
        style: {},
      },
      popupProps: {
        width: "100%",
        height: "100%",
        style: {},
        closeButtonStyles: {},
      },
      queryParams: {},
    };
  }

  public init(options: Partial<Options>) {
    this._options = { ...this._options, ...options };

    this._initIframeSrc();
    this._render();
  }

  private _initIframeSrc() {
    const url = new URL(this._options.src);
    const params = new URLSearchParams(url.search);
    const queryParams = new URLSearchParams(this._options.queryParams);

    if (this._options.syncQueryParams) {
      const parentQueryParams = new URLSearchParams(window.location.search);
      for (const [key, value] of parentQueryParams.entries()) {
        params.set(key, value);
      }
    }

    // this is below syncQueryParams because we want to override parent query params
    // with the ones provided in options
    for (const [key, value] of queryParams.entries()) {
      params.set(key, value);
    }

    if (this._options.useMiniWidget) {
      params.set("widget_type", "Mini");
    } else {
      params.delete("widget_type");
    }

    this._iframeSrc = `${url.origin}${url.pathname}?${params.toString()}`;
  }

  private _render() {
    if (this._options.usePopup) {
      this._renderPopup();
    } else {
      this._renderIframeDirectly();
    }
  }

  private _showOrHidePopup() {
    // check if body contains class `.modal-open`
    const shouldShowPopup = document.body.classList.contains("modal-open");
    const popup = this._createPopupElement();

    if (shouldShowPopup) {
      document.body.appendChild(popup);
    } else {
      const modalOverlay = document.querySelector(".modal-overlay");
      if (!modalOverlay) {
        throw new Error("`.modal-overlay` not found");
      }
      document.body.removeChild(modalOverlay);
    }
  }

  private _renderPopup() {
    const popupButton = this._checkIfPopupButtonExists();

    this._injectPopupStylesInHead();

    popupButton.addEventListener("click", () => {
      document.body.classList.add("modal-open");

      this._showOrHidePopup();
    });
  }

  private _renderIframeDirectly() {
    const iframe = this._createIframeElement();
    const iframeContainer = document.querySelector(
      `#${this._iframeContainerId}`
    );
    if (!iframeContainer) {
      const errorMessage = `div with id \`${this._iframeContainerId}\` not found.
If you want to use iframe directly, please add a div with id \`${this._iframeContainerId}\` to your page.`;
      throw new Error(errorMessage);
    }
    iframeContainer.appendChild(iframe);
  }

  private _createIframeElement() {
    const iframe = document.createElement("iframe");
    iframe.src = this._iframeSrc;
    iframe.width = this._options.iframeProps.width;
    iframe.height = this._options.iframeProps.height;
    iframe.allowFullscreen = this._options.iframeProps.allowFullscreen ?? false;
    iframe.scrolling = this._options.iframeProps.scrolling ?? "no";
    Object.assign(iframe.style, this._options.iframeProps.style);
    return iframe;
  }

  private _createPopupElement() {
    const popupFragment = document.createDocumentFragment();

    const modalOverlay = document.createElement("div");
    modalOverlay.classList.add("modal-overlay");

    const popupContainer = document.createElement("div");
    popupContainer.classList.add("popup-container");

    const popupStyles = {
      ...this._options.popupProps.style,
      height: this._options.popupProps.height,
      width: this._options.popupProps.width,
    };
    Object.assign(popupContainer.style, popupStyles);

    const closeButton = document.createElement("button");
    closeButton.classList.add("close-button");
    closeButton.innerHTML = "X";
    Object.assign(
      closeButton.style,
      this._options.popupProps.closeButtonStyles
    );

    closeButton.onclick = () => {
      document.body.classList.remove("modal-open");
      this._showOrHidePopup();
    };

    popupContainer.appendChild(closeButton);
    popupContainer.appendChild(this._createIframeElement());
    modalOverlay.appendChild(popupContainer);
    popupFragment.appendChild(modalOverlay);

    return popupFragment;
  }

  private _injectPopupStylesInHead() {
    const styleElement = document.createElement("style");
    styleElement.textContent = `
    .modal-open {}

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

    document.head.prepend(styleElement);
  }

  private _checkIfPopupButtonExists() {
    const popupButton = document.querySelector(`button#${this._popupButtonId}`);
    if (!popupButton) {
      const errorMessage = `button with id \'${this._popupButtonId}\' not found.
If you want to use popup, please add a button with id \`${this._popupButtonId}\` to your page.
Alternatively, you can set \`usePopup\` to false in the options.`;
      throw new Error(errorMessage);
    }

    return popupButton;
  }
}
