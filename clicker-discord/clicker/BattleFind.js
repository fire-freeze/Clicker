const config = require("./config.json");
const SetScriptContent = require("./SetScriptContent");
const elementIdentifiers = require("./elementIdentifiers.json");

class BattleFind {
  static battleId_low = /*config.battleId*/ 0;
  static joinTeam = /*config.team*/ "";
  static enabled = true;

  static async setClickTarget(page) {
    if (this.battleId_low !== 0) {
      await SetScriptContent.addScript(`BattleList.targetBattleId = ${this.battleId_low}`, page);
    }
    await SetScriptContent.addScript(`Join.team = '${this.joinTeam}'; BattleList.on = true;`, page);
    //console.log(this.battleId_low, this.joinTeam);
  }

  static setDetails(battleId, team) {
    this.battleId_low = battleId;
    this.joinTeam = team;
  }

  static getToBattleList = async page => {
    if (!this.enabled) return;
    try {
      if (page.isClosed()) return;
      await page.getByText(elementIdentifiers.playButton)?.nth(0)?.click();
    } catch (e) {}
  };
}

module.exports = BattleFind;
