(() => {
  const animation = document.querySelector("[data-mobile-invite-pag]");
  const canvas = animation?.querySelector("[data-mobile-invite-pag-canvas]");
  if (!animation || !canvas) return;

  const LIBPAG_VERSION = "4.5.85";
  const LIBPAG_BASE_URL = `https://cdn.jsdelivr.net/npm/libpag@${LIBPAG_VERSION}/lib/`;
  let pagView = null;
  let pagFile = null;
  let loadPromise = null;

  const loadPAG = () => {
    loadPromise ||= import(`${LIBPAG_BASE_URL}libpag.esm.js`)
      .then(({ PAGInit }) => PAGInit({
        locateFile: (file) => `${LIBPAG_BASE_URL}${file}`
      }));
    return loadPromise;
  };

  const play = async () => {
    if (document.hidden || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      animation.dataset.pagState = "reduced-motion";
      return;
    }

    if (pagView) {
      animation.dataset.pagState = "ready";
      await pagView.play();
      return;
    }

    animation.dataset.pagState = "loading";
    try {
      const [PAG, response] = await Promise.all([
        loadPAG(),
        fetch(new URL(animation.dataset.pagSrc, document.baseURI))
      ]);
      if (!response.ok) throw new Error(`PAG 文件加载失败（HTTP ${response.status}）`);

      pagFile = await PAG.PAGFile.load(await response.arrayBuffer());
      canvas.width = pagFile.width();
      canvas.height = pagFile.height();
      pagView = await PAG.PAGView.init(pagFile, canvas);
      if (!pagView) throw new Error("PAGView 初始化失败");

      pagView.setRepeatCount(0);
      pagView.setMaxFrameRate(30);
      animation.dataset.pagState = "ready";
      await pagView.play();
    } catch (error) {
      pagView?.destroy();
      pagFile?.destroy();
      pagView = null;
      pagFile = null;
      loadPromise = null;
      animation.dataset.pagState = "fallback";
      console.warn("邀请函 PAG 宇航员加载失败，已回退到静态插图。", error);
    }
  };

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      void pagView?.pause();
      return;
    }
    void play();
  });

  window.addEventListener("pagehide", () => {
    pagView?.destroy();
    pagFile?.destroy();
    pagView = null;
    pagFile = null;
  }, { once: true });

  void play();
})();
