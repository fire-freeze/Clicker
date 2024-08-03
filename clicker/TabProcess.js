const { chromium } = require("playwright");
const SetHashKey = require("./SetHashKey");
const SetScriptContent = require("./SetScriptContent");
const BattleFind = require("./BattleFind");
const config = require("./config.json");

const sleep = async ms => await new Promise(res => setTimeout(res, ms));
var getRandomInt = (minimum, maximum) => Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;

class TabProcess {
  static switchStopped = false;
  static reloadQueueHashes = new Array();
  static reloadQueue = new Array();
  static hashReloadTimeoutObject = new Object();
  static reloadTimeout = 60 * 1000;
  static reloadOn = true;
  static currentRandomIndex = null;
  static shouldJoin = false;
  static on = true;
  static pageCloseTargetIndex;
  static activateOn = true;
  static prevLogString;
  static loadPercentThreshold = 60;

  static removePageByHash = async (hash, pages) => {
    for (let i = 0; i < pages.length; i++) {
      const currPage = pages.at(i);
      if (currPage?.pageHash === hash && !currPage.wasClosed) {
        pages.splice(this.pageCloseTargetIndex, 1);
        await currPage.close();
        currPage.wasClosed = true;
      }
    }
  };

  static tabJoinedProcess = async pages => {
    try {
      if (!this.on) return;
      if (pages.length === 0 && this.reloadQueue.length === 0) return;
      for (let i = pages.length - 1; i > -1; i--) {
        const currPage = pages.at(i);
        if (currPage.isClosed()) continue;
        if (!currPage.isClosed()) {
          const status = await currPage.evaluate(() => Process.completed);
          const listMode = await currPage.evaluate(() => BattleList.isListViewMode());
          const hash = await currPage.evaluate(() => localStorage.entrance_hash_key);
          const username = await currPage.evaluate(() => localStorage.username);

          if (hash && !currPage.pageHash) currPage.pageHash = hash;
          if (listMode == false) {
            await currPage.keyboard.press("v");
          }
          if (status == true) {
            this.on = false;
            this.pageCloseTargetIndex = i;
            this.logMemo(`USER: ${username || hash} HAS JOINED.`);
            await this.removePageByHash(hash, pages);
            if (!this.reloadQueueHashes.includes(hash)) this.reloadQueueHashes.push(hash);
            this.switchStopped = false;
            this.currentRandomIndex = null;
            this.hashReloadTimeoutObject[hash] = true;
            setTimeout(e => (TabProcess.on = true), 2 * 1000);
          }
        }
      }
    } catch (error) {}
  };

  static logMemo = e => {
    if (e === this.prevLogString) return;
    console.log(e);
    this.prevLogString = e;
  };

  static activateTabs = async pages => {
    try {
      if (pages.length === 0) return;
      if (this.switchStopped) return;
      if (this.currentRandomIndex == null) {
        setTimeout(e => {
          if (this.currentRandomIndex == null) this.currentRandomIndex = getRandomInt(0, pages.length - 1);
        }, 15 * 1000);
      }
      if (pages.length == 1) this.currentRandomIndex = 0;
      this.logMemo(`CURRENT RANDOM INDEX: ${this.currentRandomIndex}`);
      const currPage = pages.at(this.currentRandomIndex);
      if (!currPage) this.logMemo(`PAGE NOT FOUND FOR RANDOM INDEX: ${this.currentRandomIndex}`);
      const pageJoined = await currPage.evaluate(() => Process.completed);
      const joinScreen = await currPage.evaluate(() => Progress.onJoinScreen);
      if (pageJoined) return;
      if (!joinScreen) return;
      this.switchStopped = true;
      this.targetPage = currPage;
      await this.targetPage.bringToFront();
      await this.targetPage.evaluate(e => (Join.on = true));
    } catch (error) {}
  };

  static reloadPages = async pages => {
    if (!this.reloadOn) return;
    this.reloadOn = !1;
    if (!this.reloadBrowserInstance) this.reloadBrowserInstance = await chromium.launch({ headless: config.headless });
    const browser = this.reloadBrowserInstance;
    const tankiUrl = config.type == "mainServer" ? config.mainServerURL : config.testServerURL;
    for (let i = 0; i < this.reloadQueueHashes.length; i++) {
      try {
        const hash = this.reloadQueueHashes.at(i);
        if (this.hashReloadTimeoutObject[hash]) {
          this.hashReloadTimeoutObject[hash] = false;
          const page = await browser.newPage();
          await page.goto(tankiUrl);
          await SetScriptContent.addScript(`localStorage.entrance_hash_key="${this.reloadQueueHashes.at(i)}"`, page);
          this.reloadQueue.push(page);
          await SetScriptContent.setScript(page);
          this.logMemo("Reloading hash: ", this.reloadQueueHashes.at(i) + "..." + "| Pages size: " + pages.length);

          setTimeout(e => {
            page.close();
            this.hashReloadTimeoutObject[hash] = true;
          }, this.reloadTimeout);
        }
      } catch (e) {
        this.logMemo(e);
      }
    }

    setTimeout(e => {
      this.reloadQueue.map((item, index) => {
        this.reloadQueue.splice(index, 1);
      });
      this.reloadOn = !0;
    }, 10 * 1000);
  };

  static getToList = async pages => {
    try {
      if (pages.length != SetHashKey.getHashesLength(config.type)) return;
      for (let i = 0; i < pages.length; i++) {
        const currPage = pages.at(i);
        if (currPage.isClosed()) return;
        BattleFind.getToBattleList(currPage);
      }
      if (this.reloadQueue.length) {
        for (let i = 0; i < this.reloadQueue.length; i++) {
          const currPage = this.reloadQueue.at(i);
          if (currPage.isClosed()) return;
          BattleFind.getToBattleList(currPage);
        }
      }
    } catch (error) {}
  };

  static setShouldJoin = state => (this.shouldJoin = state);

  static joinMM = async pages => {
    try {
      if (!this.shouldJoin) return;
      for (let i = 0; i < pages.length; i++) {
        const currPage = pages.at(i);
        await currPage.evaluate(e => (Join.mm = true));
      }
      this.shouldJoin = false;
    } catch (error) {}
  };

  static activateTargetPage = async page => {
    if (!this.targetPage) return;
    this.targetPage.bringToFront();
    await this.targetPage.evaluate(e => (Join.on = true));
    const joinScreen = await this.targetPage.evaluate(() => Progress.onJoinScreen);
    if (!joinScreen) this.currentRandomIndex = null;
  };

  static setClickTargets = async pages => {
    try {
      const hashLength = SetHashKey.getHashesLength(config.type);
      if (pages.length !== hashLength) return;
      for (let i = 0; i < pages.length; i++) {
        const currPage = pages.at(i);
        await BattleFind.setClickTarget(currPage);
      }
    } catch (error) {}
  };

  static async enterBattleTargetPage() {
    try {
      if (!this.targetPage) return;
      await this.targetPage?.keyboard?.press("Enter");
    } catch (error) {}
  }

  static async logActivePage(pages) {
    const activePage = this.targetPage;
    if (!activePage) return;
    const status = await activePage.evaluate(() => Process.completed);
    const currScreen = await activePage.evaluate(() => Progress.getCurrentScreen());
    const hash = await activePage.evaluate(() => localStorage.entrance_hash_key);
    const teamMembers = await activePage.evaluate(() => window.teamMembers);
    const username = await activePage.evaluate(() => localStorage.username);
    const logString = `Join status of ${username || hash} : ${status} | Current Screen: ${currScreen} | Team Members: ${teamMembers} |Pages Size: ${
      pages.length
    } | Reload Size: ${this.reloadQueueHashes.length}`;
    this.logMemo(logString);
  }

  static async setBattlesData() {
    if (!this.targetPage) return;
    const data = await this.targetPage.evaluate(e => BattleList.battlesData);
    await this.targetPage.evaluate(e => this.logMemo("Fetching battles data..."));
    if (!data || !Array.isArray(data)) return;
    await fetch("http://localhost:5000/", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
  }

  static process = async (pages, battleId, team) => {
    try {
      await this.setClickTargets(pages, battleId, team);
      await this.activateTabs(pages);
      await this.tabJoinedProcess(pages);
      await this.reloadPages(pages);
      await this.logActivePage(pages);
      //await this.setBattlesData();
      if (!this.activateOn) {
        setInterval(() => this.activateTargetPage(), 1);
        this.activateOn = false;
      }
    } catch (error) {}
  };
}

module.exports = TabProcess;
