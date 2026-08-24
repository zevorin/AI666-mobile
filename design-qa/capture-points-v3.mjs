import { writeFileSync } from "node:fs";

const targets = await fetch("http://127.0.0.1:9223/json").then((response) => response.json());
const target = targets.find((item) => item.type === "page");
if (!target) throw new Error("Browser page target not found");

const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});

let id = 0;
const pending = new Map();
const consoleErrors = [];

socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  if (message.id && pending.has(message.id)) {
    const { resolve, reject } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) reject(new Error(message.error.message));
    else resolve(message.result);
  }
  if (message.method === "Runtime.exceptionThrown") {
    consoleErrors.push(message.params.exceptionDetails.text || "Runtime exception");
  }
  if (message.method === "Runtime.consoleAPICalled" && message.params.type === "error") {
    consoleErrors.push(message.params.args.map((arg) => arg.value || arg.description || "").join(" "));
  }
});

const send = (method, params = {}) => new Promise((resolve, reject) => {
  const requestId = ++id;
  pending.set(requestId, { resolve, reject });
  socket.send(JSON.stringify({ id: requestId, method, params }));
});

const evaluate = async (expression) => {
  const result = await send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  return result.result.value;
};

await send("Runtime.enable");
await send("Page.enable");
await send("Emulation.setDeviceMetricsOverride", {
  width: 390,
  height: 852,
  deviceScaleFactor: 1,
  mobile: true,
  screenWidth: 390,
  screenHeight: 852,
  positionX: 0,
  positionY: 0,
});
await send("Page.navigate", { url: "http://127.0.0.1:8766/outputs/community-homepage-style-exploration/mobile-points.html?v=20260824-points-layout-v8" });
await new Promise((resolve) => setTimeout(resolve, 1800));

const metrics = await evaluate(`(() => {
  const rect = (selector) => {
    const node = document.querySelector(selector);
    if (!node) return null;
    const box = node.getBoundingClientRect();
    return { x: box.x, y: box.y, width: box.width, height: box.height };
  };
  return {
    innerWidth,
    innerHeight,
    scrollWidth: document.documentElement.scrollWidth,
    scrollHeight: document.documentElement.scrollHeight,
    title: document.title,
    detail: rect('.mobile-points-detail-link'),
    balance: rect('.mobile-points-balance'),
    overview: rect('.mobile-points-overview-card'),
    store: rect('.mobile-points-store-card'),
    newbie: rect('.mobile-points-earn-featured'),
    pagState: document.querySelector('[data-mobile-points-robot-pag]')?.dataset.pagState || 'uninitialized',
    shopVideo: (() => {
      const video = document.querySelector('[data-mobile-points-shop-video]');
      return video ? { currentTime: video.currentTime, paused: video.paused, readyState: video.readyState } : null;
    })(),
    topbar: (() => {
      const style = getComputedStyle(document.querySelector('.mobile-topbar'));
      return { borderBottomWidth: style.borderBottomWidth, boxShadow: style.boxShadow };
    })(),
    topbarCenters: ['.mobile-back-button', '.mobile-page-title', '.mobile-points-detail-link'].map((selector) => {
      const box = document.querySelector(selector).getBoundingClientRect();
      return { selector, centerX: box.x + box.width / 2, centerY: box.y + box.height / 2 };
    }),
    cardStyles: ['.mobile-points-overview-card', '.mobile-points-store-card', '.mobile-points-earn-featured'].map((selector) => {
      const style = getComputedStyle(document.querySelector(selector));
      return { selector, borderWidth: style.borderWidth, backgroundColor: style.backgroundColor };
    }),
    balanceFontSize: getComputedStyle(document.querySelector('.mobile-points-balance > strong')).fontSize,
    newUserIconCount: document.querySelectorAll('.mobile-points-earn-copy .mobile-points-earn-icon').length,
    newUserTextSpacing: (() => {
      const label = document.querySelector('.mobile-points-earn-copy > small')?.getBoundingClientRect();
      const title = document.querySelector('.mobile-points-earn-copy > strong')?.getBoundingClientRect();
      return label && title ? { labelBottom: label.bottom, titleTop: title.top, gap: title.top - label.bottom, overlaps: label.bottom > title.top } : null;
    })(),
    overviewLayout: [...document.querySelectorAll('.mobile-points-overview-item')].map((item) => {
      const itemBox = item.getBoundingClientRect();
      const iconBox = item.querySelector('.mobile-points-overview-icon').getBoundingClientRect();
      const labelBox = item.querySelector('small').getBoundingClientRect();
      const valueBox = item.querySelector('strong').getBoundingClientRect();
      return {
        itemCenter: itemBox.x + itemBox.width / 2,
        labelRowCenter: (iconBox.x + iconBox.width / 2 + labelBox.x + labelBox.width / 2) / 2,
        valueCenter: valueBox.x + valueBox.width / 2,
        labelValueGap: valueBox.y - labelBox.bottom,
      };
    }),
    storeArtPosition: getComputedStyle(document.querySelector('.mobile-points-store-art')).objectPosition,
    storeArtTransform: getComputedStyle(document.querySelector('.mobile-points-store-art')).transform,
    actionArrowCount: document.querySelectorAll('.mobile-points-store-copy b img, .mobile-points-earn-copy > b img').length,
    earnHeadingDecoration: (() => {
      const style = getComputedStyle(document.querySelector('.mobile-points-earn .mobile-section-heading h2'), '::before');
      return { display: style.display, width: style.width, content: style.content };
    })(),
  };
})()`);

const screenshot = await send("Page.captureScreenshot", {
  format: "png",
  fromSurface: true,
  captureBeyondViewport: false,
});
writeFileSync("F:/AI666-mobile-main/design-qa/points-v8-implementation.png", Buffer.from(screenshot.data, "base64"));

const recordsHref = await evaluate(`document.querySelector('.mobile-points-detail-link').href`);
await send("Page.navigate", { url: recordsHref });
await new Promise((resolve) => setTimeout(resolve, 650));
const recordsResult = await evaluate(`({ title: document.title, page: document.body.dataset.mobilePage, url: location.href })`);

await send("Page.navigate", { url: "http://127.0.0.1:8766/outputs/community-homepage-style-exploration/mobile-points.html?v=20260824-points-layout-v8" });
await new Promise((resolve) => setTimeout(resolve, 900));
const exchangeHref = await evaluate(`document.querySelector('.mobile-points-store-card').href`);
await send("Page.navigate", { url: exchangeHref });
await new Promise((resolve) => setTimeout(resolve, 650));
const exchangeResult = await evaluate(`({ title: document.title, page: document.body.dataset.mobilePage, url: location.href })`);

const responsive = [];
for (const width of [360, 390, 430]) {
  await send("Emulation.setDeviceMetricsOverride", {
    width,
    height: 852,
    deviceScaleFactor: 1,
    mobile: true,
    screenWidth: width,
    screenHeight: 852,
    positionX: 0,
    positionY: 0,
  });
  await send("Page.navigate", { url: "http://127.0.0.1:8766/outputs/community-homepage-style-exploration/mobile-points.html?v=20260824-points-layout-v8" });
  await new Promise((resolve) => setTimeout(resolve, 700));
  responsive.push(await evaluate(`({
    width: innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    detailVisible: Boolean(document.querySelector('.mobile-points-detail-link')?.getClientRects().length),
    overviewWidth: document.querySelector('.mobile-points-overview-card')?.getBoundingClientRect().width || 0,
  })`));
}

await send("Emulation.setDeviceMetricsOverride", {
  width: 390,
  height: 852,
  deviceScaleFactor: 1,
  mobile: true,
  screenWidth: 390,
  screenHeight: 852,
  positionX: 0,
  positionY: 0,
});
await send("Page.navigate", { url: "http://127.0.0.1:8766/outputs/community-homepage-style-exploration/mobile-points.html?v=20260824-points-layout-v8" });
await new Promise((resolve) => setTimeout(resolve, 800));
const tasksHref = await evaluate(`document.querySelector('.mobile-points-earn-featured').href`);
await send("Page.navigate", { url: tasksHref });
await new Promise((resolve) => setTimeout(resolve, 650));
const tasksResult = await evaluate(`({ title: document.title, page: document.body.dataset.mobilePage, url: location.href })`);

socket.close();
process.stdout.write(JSON.stringify({ metrics, responsive, recordsResult, exchangeResult, tasksResult, consoleErrors }, null, 2));
