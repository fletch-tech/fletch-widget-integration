type Options = {
  src: string;
  usePopup: boolean;
  syncQueryParams: boolean;
  iframeProps: {
    width: HTMLIFrameElement["width"];
    height: HTMLIFrameElement["height"];
    allowFullscreen: HTMLIFrameElement["allowFullscreen"];
    scrolling: HTMLIFrameElement["scrolling"];
    style: Partial<HTMLIFrameElement["style"]>;
  };
};

export class FletchApp {
  private _options: Options;
  private _iframeContainerId = "iframeContainer" as const;

  constructor() {
    this._options = {
      src: "",
      usePopup: false,
      syncQueryParams: false,
      iframeProps: {
        width: "100%",
        height: "100%",
        allowFullscreen: true,
        scrolling: "no",
        style: {
          border: "none",
        },
      },
    };
  }

  public init(options: Partial<Options>) {
    this._options = { ...this._options, ...options };

    const iframe = this._createIframe();

    const iframeContainer = document.querySelector(
      `#${this._iframeContainerId}`
    );
    if (!iframeContainer) {
      throw new Error(`#${this._iframeContainerId} not found`);
    }
    iframeContainer.appendChild(iframe);
  }

  private _createIframe() {
    const iframe = document.createElement("iframe");
    iframe.src = this._options.src;
    iframe.width = this._options.iframeProps.width;
    iframe.height = this._options.iframeProps.height;
    iframe.allowFullscreen = this._options.iframeProps.allowFullscreen;
    iframe.scrolling = this._options.iframeProps.scrolling;
    Object.assign(iframe.style, this._options.iframeProps.style);
    return iframe;
  }
}
