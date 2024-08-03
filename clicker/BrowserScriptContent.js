const removeCss = () => {
  document.querySelectorAll("style").forEach(e => e.remove());
  requestAnimationFrame(removeCss);
};
//removeCss()
class React {
  static getReactFiber(element) {
    for (let i in element) {
      if (i.includes("__reactFiber$")) {
        return element[i];
      }
    }
  }

  static getReactProps(element) {
    for (let i in element) {
      if (i.includes("__reactProps$")) {
        return element[i];
      }
    }
  }

  static getReactContainer(root) {
    for (let i in root) {
      if (i.includes("__reactContainer$")) return root[i];
    }
  }
}

class Utils {
  static getElementByText(type, text) {
    const elements = document.querySelectorAll(type);
    for (let i = 0; i < elements.length; i++) {
      const curr = elements[i];
      if (curr && curr.textContent.toLowerCase().trim() === text.toLowerCase().trim()) {
        return curr;
      }
    }
  }

  static getObjectPropertyByPath = (parentObject, path, delimiter, index = -1) => {
    const childPath = path.split(delimiter).at(index + 1);
    if (!childPath) return parentObject;
    console.log(parentObject, path, childPath, index, delimiter);
    return this.getObjectPropertyByPath(parentObject[childPath], path, delimiter, index + 1);
  };

  static sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

class gameElements {
  static joinButtonFound;
  static classes = {
    parkourOptionButton: "MenuComponentStyle-battleTitleCommunity",
    friendClass: ".InvitationWindowsComponentStyle-rankContainer",
  };

  static playButtonCoords = {
    x: null,
    y: null,
  };

  static getPlayButton() {
    var e;
    return null != (e = Utils.getElementByText("span", "play")) ? e : null;
  }
  static getProBattlesButton() {
    var e;
    return null != (e = Utils.getElementByText("h2", "pro battles")) ? e : null;
  }

  static getGoldsModeButton() {
    var e;
    return null != (e = Utils.getElementByText("h2", "Festive Mode")) ? e : null;
  }

  static getParkourOptionButton() {
    var e;
    var optionsBar = document.querySelectorAll(this.classes.parkourOptionButton);
    e = optionsBar[0].children[0].children[0].children[4];
    return e ? e : null;
  }

  static getParkourModeButton() {
    var e;
    return null != (e = Utils.getElementByText("h2", "parkour")) ? e : null;
  }

  static getBattleLayoutButton() {
    var e = document.querySelectorAll(".HotKey-commonBlockForHotKey")[2].parentElement.children[0];
    return null != e ? e : null;
  }

  static getJoinButton() {
    const button = Utils.getElementByText("span", "join team ALFA") || Utils.getElementByText("span", "join team BRAVO");
    button ? (this.joinButtonFound = true) : null;
    return button;
  }

  static getDMButton() {
    return Utils.getElementByText("span", "join")?.parentElement.parentElement;
  }

  static getOkButton() {
    return Utils.getElementByText("h1", "Special format battle")?.parentElement.parentElement;
  }

  static getPauseButton() {
    return Utils.getElementByText("span", "[P]")?.parentElement;
  }

  static getLeaveButton() {
    return Utils.getElementByText("span", "leave the battle")?.parentElement;
  }

  static getError() {
    return Utils.getElementByText("h1", "system error");
  }

  static getAcceptButton() {
    return Utils.getElementByText("span", "yes");
  }

  static getInviteButton() {
    var e;
    return null != (e = Utils.getElementByText("a", "Invite friends")) ? e : null;
  }

  static getFriends() {
    var e;
    return null != (e = document.querySelectorAll(this.classes.friendClass)) ? e : null;
  }
}

class BattleList {
  static battleClassName = "tr.modeLimitIcon";
  static listContainerClass = ".ProBattlesComponentStyle-battlesContainer";
  static targetBattleId;
  static on = false;
  static listViewMode = false;
  static battleNotFound = false;
  static battlesData = [];

  static getBattleElements() {
    var battleElements = Array.from(document.querySelectorAll(this.battleClassName));
    return null != battleElements ? battleElements : null;
  }

  static isListViewMode() {
    return document.querySelector(this.listContainerClass) ? true : false;
  }

  static getBattleId(element) {
    const b1 = React.getReactFiber(element)?.child?.memoizedProps?.battleId;
    const b2 = React.getReactProps(element).children[1].props.battleId;
    return b1 ? b1 : b2;
  }

  static getBattleById(low) {
    if (!this.targetBattleId) return;
    try {
      var battleElements = this.getBattleElements();
      if (!battleElements) return;
      for (let i = 0; i < battleElements.length; i++) {
        var currElement = battleElements[i];
        var battleId = this.getBattleId(currElement);
        if (low == battleId?.l_1) return battleElements[i];
      }
    } catch (error) {}
  }

  static async cannotFindBattle() {
    const listView = BattleList.isListViewMode();
    if (this.battleNotFound) return;
    if (listView) {
      setTimeout(e => (Process.completed = Progress.onJoinScreen ? false : true), 7 * 1000);
      this.battleNotFound = true;
    }
  }

  static setBattlesData() {
    const battles = this.getBattleElements();
    if (!battles || !this.isListViewMode()) return;
    const data = battles?.map(battle => {
      return {
        mapName: battle.children[0].children[0].textContent,
        teamMembers: battle.children[1].textContent,
        timer: battle.children[2].textContent,
        battleId: this.getBattleId(battle).l_1,
      };
    });

    this.battlesData = data;
    return data;
  }
}

class Progress {
  static joinClickTime = 0;
  static startTime = 0;
  static joinTimeInterval = 0;
  static battleLoadedPercentage = 0;
  static getCurrentScreen() {
    var e;
    gameElements.getPlayButton() ? (e = "PLAY") : null;
    gameElements.getProBattlesButton() ? (e = "PRO") : null;
    gameElements.getParkourModeButton() ? (e = "PARKOUR") : null;
    gameElements.getProBattlesButton() && !gameElements.getJoinButton() ? (e = "LIST") : null;
    gameElements.getJoinButton() || gameElements.getDMButton() ? (e = "JOIN") : null;
    gameElements.getOkButton() ? (e = "CONFIRM") : null;
    //gameElements.getBattleStatus() ? (e = "BATTLE") : null;
    gameElements.getError() ? (e = "ERROR") : null;
    return e;
  }

  static wasJoinSuccessful() {
    if (gameElements.joinButtonFound) {
      if (!gameElements.getJoinButton()) {
        Process.joinSuccess = true;
        return true;
      }
    }
  }

  static isOpenSpace(team) {
    if (!Join.teamButton) return;
    return React.getReactProps(Join.teamButton)?.children[0]?._owner?.memoizedProps?.enabled;
  }

  static setJoinTime() {
    if (!this.isOpenSpace(Join.team) || this.joinTimeInterval) return;
    this.startTime = performance.now();
    console.log("START TIME SET: " + this.startTime);
    if (this.joinClickTime) this.joinTimeInterval = this.joinClickTime - this.startTime;
    console.log("Battle joined in: " + this.joinTimeInterval + "ms.");
  }

  static setBattleLoadState() {
    const root = document.querySelector("#root");
    if (!root) return;
    const rootReactContainer = React.getReactContainer(root);
    if (!rootReactContainer) return;
    const battleLoadedStateComponent = Utils.getObjectPropertyByPath(rootReactContainer?.child?.child?.stateNode, "p37_1.z37_1.c35_1.c3_1", ".");
    this.battleLoadedState = Utils.getObjectPropertyByPath(battleLoadedStateComponent?.at(2), "a1i7_1.m1vc_1", ".");
    console.log(this.battleLoadedState);
  }

  static setBattleLoadedPercentage() {
    const applicationLoader = document.querySelectorAll(".ApplicationLoaderComponentStyle-container")[1];
    if (!applicationLoader) return;
    const props = React.getReactProps(applicationLoader);
    if (!props) return;
    Progress.battleLoadedPercentage = props?.children[0]?._owner?.memoizedState?.resourcesLoadingProgress;
  }
}

class Invite {
  static inviteDelay = 2 * 100;
  static async clickInviteButton() {
    const inviteButton = gameElements.getInviteButton();
    if (!inviteButton) return;
    inviteButton.click();
  }

  static async selectFriends() {
    const friends = gameElements.getFriends();
    if (!friends) return;
    friends.forEach(friend => friend.click());
  }

  static async inviteFriends() {
    const invButton = Utils.getElementByText("span", "INVITE");
    if (!invButton) return;
    invButton.parentNode.click();
  }

  static async acceptInvite() {
    if (window.clickMaster) return;
    const acceptButton = gameElements.getAcceptButton();
    if (!acceptButton) return;
    acceptButton?.click();
  }

  static async process() {
    await Utils.sleep(this.inviteDelay);
    if (window.clickMaster) {
      this.clickInviteButton();
      this.selectFriends();
      this.inviteFriends();
    }
    if (!window.clickMaster) {
      this.acceptInvite();
    }
  }
}

class Join {
  static team = "";
  static on = false;
  static joinDelay = 4 * 1000;
  static closeTimeout = 2 * 100;
  static okButtonComponent;
  static mm = false;
  static teamButton;
  static confirmationButton;

  static getTeamJoinHandler() {
    const teamButton = this.getTeamButton(this.team);
    return React.getEventHandler(teamButton).memoizedProps;
  }

  static getJoinBattleHandler() {
    const okButton = this.getConfirmationButton();
    const parent = okButton.parentElement.parentElement;
    return React.getEventHandler(parent).children[0]._owner.stateNode.props.okButton;
  }

  static shouldJoin(team) {
    const teamButton = this.getTeamButton(team);
    if (!teamButton) return;
    return React.getReactProps(teamButton)?.children.at(0)._owner.stateNode.props.enabled;
  }

  static setTeamButton(team) {
    this.teamButton = document.querySelectorAll(".JoinToBattleComponentStyle-newButtonJoinA")[team === "A" ? 0 : 1];
  }

  static getDMJoinHandler() {
    const joinButton = gameElements.getDMButton();
    if (!joinButton) return;
    return React.getEventHandler(joinButton)?.children._owner.stateNode;
  }

  static setConfirmationButton() {
    this.confirmationButton = document.querySelector(".DialogContainerComponentStyle-enterButton");
  }

  static async joinDM() {
    try {
      if (this.on == true) {
        this.getDMJoinHandler()?.joinToDM_0();
        await Utils.sleep(Join.joinDelay);
        Join.getConfirmationButton().click();
        Join.getJoinBattleHandler()?.onClick();
      }
    } catch (e) {}
  }

  static joinTeam() {
    try {
      if (!this.on) return;
      this.teamButton?.click();
      document.querySelector(".DialogContainerComponentStyle-enterButton")?.click();
      if (this.confirmationButton) {
        this.on = false;
        setTimeout(() => (Join.on = true), Join.joinDelay);
        /* const closeBtn = document.querySelector(".DialogContainerComponentStyle-imgClose");
        closeBtn?.click();
        */
      }
    } catch (error) {}
  }
}

class Process {
  static battleListDelay = 1 * 1000;
  static acceptDelay = 2 * 1000;
  static shouldStart = false;
  static joinSuccess = false;
  static completed = false;
  static shouldJoin = false;

  static async BattleFindProcess() {
    try {
      if (!BattleList.on) return;
      const battleElement = BattleList.getBattleById(BattleList.targetBattleId);
      window.teamMembers = BattleList.getBattleById(BattleList.targetBattleId)?.children[1].textContent;
      battleElement?.click();
      Join.setTeamButton(Join.team);
      Join.setConfirmationButton();
    } catch (e) {}
  }

  static async joinGoldsMode() {
    const goldsModeButton = gameElements.getGoldsModeButton();
    if (!goldsModeButton || !Join.mm) return;
    goldsModeButton.click();
    Join.mm = false;
  }

  static async getToBattleList() {
    const proBattles = gameElements.getProBattlesButton();
    proBattles?.click();
    const parkourMode = gameElements.getParkourModeButton();
    parkourMode?.click();
  }

  static async removeNewsWindow() {
    const newsBg = document.querySelector(".NewsComponentStyle-closeArea");
    const newsWindow = document.querySelector(".NewsComponentStyle-newsWindow");
    newsBg ? newsBg.remove() : null;
    newsWindow ? newsWindow.remove() : null;
  }

  static async ProcessCompletedChecker() {
    const joinStatus = Process.joinSuccess;
    const usernameClass = ".UserInfoContainerStyle-userNameRank";
    const usernameUnsplit = document.querySelector(usernameClass)?.textContent?.split(" ");
    const username = usernameUnsplit?.at(usernameUnsplit?.length - 1);
    if (localStorage.username == "user-not-found") {
      localStorage.username = username ? username : "user-not-found";
    }
    if (joinStatus) {
      Process.completed = true;
      localStorage.pageJoined = true;
    }
    if (Progress.getCurrentScreen() == "JOIN") {
      Progress.onJoinScreen = true;
      localStorage.onJoinScreen = true;
    }
  }

  static async skipEntranceScreen() {
    const mainScreen = document.querySelector(".Common-contentSpaceBetween");
    mainScreen ? mainScreen.click() : null;
  }

  static async BattleJoinProcess() {
    try {
      Join.joinTeam();
    } catch (e) {}
  }

  static async ExitProcess() {
    await Utils.sleep(10 * 1000);
    const esc = document.querySelector(".BattleHudComponentStyle-pauseButton");
    esc?.click();
    if (!window.shouldExit) return;
    const leave = document.querySelectorAll(".BattlePauseMenuComponentStyle-classicButton")[4];
    leave?.click();
    window.alreadyInBattle = false;
  }

  static async battleActiveProcess() {
    await Utils.sleep(10 * 1000);
    const esc = document.querySelector(".BattleHudComponentStyle-pauseButton");
    if (esc) window.alreadyInBattle = true;
    if (window.shouldExit) return;
    esc?.click();
  }

  static async mainProcess() {
    try {
      Process.shouldStart = true;
      if (Process.shouldStart) {
        Process.skipEntranceScreen();
        Process.removeNewsWindow();
        Process.getToBattleList();
        Process.BattleFindProcess();
        Process.ProcessCompletedChecker();
        Progress.setJoinTime();
        Progress.wasJoinSuccessful();
        //Progress.setBattleLoadedPercentage();
        //Process.ExitProcess();
        Join.setTeamButton(Join.team);
        Join.setConfirmationButton();
        Join.joinTeam();
        BattleList.cannotFindBattle();
        if (Progress.getCurrentScreen() === "LIST") {
          document.querySelector(".modal.hover")?.remove();
        }
      }
      requestAnimationFrame(Process.mainProcess);
    } catch (e) {}
  }

  static async joinProcess() {
    Join.setTeamButton(Join.team);
    Join.setConfirmationButton();
    Join.joinTeam();
    requestAnimationFrame(Process.joinProcess);
  }
}

Process.mainProcess();
//Process.joinProcess();

window.React = React;
window.BattleList = BattleList;
window.Utils = Utils;
window.Join = Join;
window.Invite = Invite;
window.Progress = Progress;
window.Process = Process;
window.shouldExit = false;
window.alreadyInBattle = !1;
window.username = "user-not-found";
localStorage.username = "user-not-found";
if (localStorage?.pageJoined != "true") window.localStorage.pageJoined = false;
window.localStorage.onJoinScreen = false;
console.log("Script Loaded!");
