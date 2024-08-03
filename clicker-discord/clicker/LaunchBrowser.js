const { chromium } = require("playwright");
const SetHashKey = require("./SetHashKey");
const SetScriptContent = require("./SetScriptContent");
const TabProcess = require("./TabProcess");
const elementIdentifiers = require("./elementIdentifiers.json");
const config = require("./config.json");

class LaunchBrowser {
  static pages = new Array();
  static browserShouldClose = false;
  static startTime = new Date().getTime();
  static setBrowserCloseState = state => {
    this.browserShouldClose = state;
    TabProcess.reloadBrowserInstance.close();

    this.pages = new Array();
    TabProcess.reloadQueueHashes = new Array();
    TabProcess.reloadQueue = new Array();
    TabProcess.hashReloadTimeoutObject = new Object();
  };

  static launchClicks = async () => {
    const browser = await chromium.launch({ headless: config.headless });
    setInterval(e => (this.browserShouldClose ? browser.close() : null), 5 * 100);
    const tankiUrl = config.type == "mainServer" ? config.mainServerURL : config.testServerURL.replace("{}", config.serverNumber);
    const hashesLength = await SetHashKey.getHashesLength(config.type);

    if (this.pages.length == hashesLength) return;
    for (let i = 0; i < hashesLength; i++) {
      try {
        const page = await browser.newPage();
        page.pageId = i;
        page.setDefaultTimeout(120 * 1000);
        await page.goto(tankiUrl);
        this.pages.push(page);
        await SetHashKey.setHash(page, i, config.type);
        await SetScriptContent.setScript(page);
      } catch (e) {
        console.log(e);
      }
    }

    console.log("Accounts opened in " + Math.floor((new Date().getTime() - this.startTime)/3600) + "seconds.")
    
    return browser;
  };

  static clickHash = async hash => {
    const browser = await chromium.launch({ headless: config.headless });
    const tankiUrl = config.type == "mainServer" ? config.mainServerURL : config.testServerURL;
    const page = await browser.newPage();
    await page.goto(tankiUrl);
    await page.evaluate(hash => (window.localStorage.entrance_hash_key = hash), hash);
    this.pages.push(page);
    return browser;
  };
}

const sleep = async ms => await new Promise(res => setTimeout(res, ms));

let running = !0;
LaunchBrowser.process = async function () {
  if (!running) return;

  const browser = await LaunchBrowser.launchClicks();
  await sleep(10 * 1000);
  setInterval(async () => {
    try {
      TabProcess.pagesLength = LaunchBrowser.pages.length;
      await TabProcess.getToList(LaunchBrowser.pages);
      await TabProcess.joinMM(LaunchBrowser.pages);
      await TabProcess.process(LaunchBrowser.pages);
      if (!interval) interval = setInterval(e => TabProcess.enterBattleTargetPage(), 1);
    } catch (error) {}
  }, 3 * 100);
  running = !1;
  return browser;
};

TabProcess.pageHashes = SetHashKey.getHashKeys(config.type);

module.exports = LaunchBrowser;
