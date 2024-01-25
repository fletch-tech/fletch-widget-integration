type MediaQueryConfig = {
  /** Media query string to be used */
  query: string;
  /** Styles to be applied for matching query */
  style: HTMLElement["style"];
};

type Options = {
  /** Partner URL for the iframe */
  src: string;
  /** Whether to show iframe within a popup (i.e. modal) or directly */
  usePopup: boolean;
  /**
   * Whether to synchronize parent window query-params, which can be used
   * for forwarding query params like `utm_source` to the iframe
   */
  syncQueryParams: boolean;
  /** Whether to use mini widget */
  useMiniWidget: boolean;
  /** Props for the iframe */
  iframeProps: {
    /** Iframe `width` attribute */
    width: HTMLIFrameElement["width"];
    /** Iframe `height` attribute */
    height: HTMLIFrameElement["height"];
    /** Iframe `allowFullscreen` attribute */
    allowFullscreen?: HTMLIFrameElement["allowFullscreen"];
    /** Iframe `scrolling` attribute */
    scrolling?: HTMLIFrameElement["scrolling"];
    /** Iframe `style` attribute */
    style?: Partial<HTMLIFrameElement["style"]>;
  };
  /** Props for the popup. Only relevant if `usePopup` is `true` */
  popupProps: {
    /** Width of the popup */
    width: HTMLDivElement["style"]["width"];
    /** Height of the popup */
    height: HTMLDivElement["style"]["height"];
    /** Styles applied to the popup container element */
    style?: Partial<HTMLDivElement["style"]>;
    /** Styles applied to the popup close button element */
    closeButtonStyles?: Partial<HTMLButtonElement["style"]>;
  };
  /**
   * Query params to be passed to the iframe. This can be used to
   * set the prefill-data for the widget or pass any extra data to the iframe
   * like `utm_source` etc.
   */
  queryParams: {
    [key: string]: string;
  };
  /**
   * Apply different styles based on media queries. Primarily, can be used to having
   * different container sizes for different screen sizes, but other style properties can
   * also be changed.
   */
  mediaQueries: Array<MediaQueryConfig>;
};

export class FletchApp {
  private _options: Options;
  private _iframeContainerId = "fletch-iframe" as const;
  private _popupButtonId = "fletch-iframe-trigger" as const;
  private _iframeSrc = "";
  private _mediaQueries: Array<MediaQueryConfig> = [];
  private _iframeInitStyles: Partial<HTMLIFrameElement["style"]> = {};
  private _iframeElementClassName = "css-fletch-iframe";
  private _iframeDefaultStyles: Partial<CSSStyleDeclaration> = {
    border: '10px solid transparent',
    borderRadius: "10px",
    borderWidth: "4px",
    backgroundImage:
      "linear-gradient(to top, rgb(0, 142, 221), rgb(162, 207, 66))",
      borderBottom:"10%"
  };

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
      mediaQueries: [],
    };
  }

  /**
   * The main method to initialize the widget.
   * This renders the widget and sets various properties
   * based on the options provided
   * @param options - Options for the widget
   */
  public init(options: Partial<Options>) {
    this._options = { ...this._options, ...options };
    this._mediaQueries = this._options.mediaQueries ?? [];

    this._initIframeSrc();
    this._render();
  }

  /**
   * @internal - Sets the iframe src based on the options provided
   */
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

  /**
   * @internal - Renders the widget based on the options provided
   */
  private _render() {
    if (this._options.usePopup) {
      this._renderPopup();
    } else {
      this._renderIframeDirectly();
    }
  }

  /**
   * @internal - Shows or hides the popup based on the body class
   */
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

  /**
   * @internal - Renders the popup based on the options provided
   */
  private _renderPopup() {
    const popupButton = this._checkIfPopupButtonExists();

    this._injectPopupStylesInHead();

    popupButton.addEventListener("click", () => {
      document.body.classList.add("modal-open");

      this._showOrHidePopup();
    });
  }

  /**
   * @internal - Renders the iframe directly based on the options provided
   */
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

    this._addMediaQueriesRules(iframe);

    iframeContainer.appendChild(iframe);
  }

  /**
   * @internal - Creates the iframe element based on the options provided
   */
  private _createIframeElement() {
    const iframe = document.createElement("iframe");
    iframe.src = this._iframeSrc;
    iframe.width = this._options.iframeProps.width;
    iframe.height = this._options.iframeProps.height;
    iframe.allowFullscreen = this._options.iframeProps.allowFullscreen ?? false;
    iframe.scrolling = this._options.iframeProps.scrolling ?? "no";

    // Merge default styles with provided styles
    this._iframeInitStyles = {
      width: iframe.width,
      height: iframe.height,
      ...this._iframeDefaultStyles,
      ...this._options.iframeProps.style,
    };

    // we are translating the iframe styles to cssText because
    // we want to apply media-queries to the iframe
    // and having inline styles will override the media-queries

    const iframeStyleCssText = this._getStyleCSSText({
      ...iframe.style,
      ...this._iframeInitStyles,
    });

    const styleElement = document.createElement("style");
    styleElement.textContent = `
      .${this._iframeElementClassName} {
        ${iframeStyleCssText}
      }
    `;
    document.head.appendChild(styleElement);

    iframe.classList.add(this._iframeElementClassName);
    return iframe;
  }

  /**
   * @internal - Creates the popup element based on the options provided
   */
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

  /**
   * @internal - Injects the popup styles in the head. This is required for the popup to work
   */
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
      background: rgba(0, 0, 0, 0.9);
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .popup-container {
      background: #fff;
      padding: 0px;
      border-radius: 25px;
      position: relative;
      overflow: unset
    }

    .close-button {
      cursor: pointer;
      position:absolute;
           top:-30px;
           right:-10px;
           color:#fff;
           background:transparent;
           border-color:transparent
    }
  `;

    document.head.prepend(styleElement);
  }

  /**
   * @internal - Checks if the popup button exists in the DOM. If not, throws an error with instructions
   */
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

  /**
   * Applies media queries rules to the iframe as css class
   * @param element - IFrame Element to which media queries rules will be added
   */
  private _addMediaQueriesRules<T extends HTMLElement>(element: T) {
    // parse media queries and add them to the iframe as css class
    const mediaQueryRules = this._mediaQueries.map((mediaQuery) => {
      const { query, style } = mediaQuery;

      const cssText = this._getStyleCSSText(style);

      console.log("css text", cssText);

      element.classList.add(this._iframeElementClassName);

      return `@media ${query} { .${this._iframeElementClassName} { ${cssText} } }`;
    });

    const styleElement = document.createElement("style");
    styleElement.textContent = mediaQueryRules.join("\n");

    document.head.appendChild(styleElement);
  }

  /**
   * @internal - Returns the cssText for the style object
   * Uses a temporary element to convert the style object to cssText
   * While this is not the most efficient way, it is the most reliable way
   */
  private _getStyleCSSText(style: Partial<CSSStyleDeclaration>) {
    const cssText = Object.entries(style)
        .map(([property, value]) => `${property.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`)}: ${value};`)
        .join(' ');

    return cssText;
}







}
