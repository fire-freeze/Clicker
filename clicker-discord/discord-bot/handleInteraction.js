const fs = require("fs");
const path = require("path");
const BattleFind = require("../clicker/BattleFind");

const setClickOptions = (battleId, team) => {
  const jsonPath = path.join(path.dirname(__dirname), "clicker/config.json" )
  const data = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
  data.battleId = battleId;
  data.team = team;
  fs.writeFileSync(jsonPath, JSON.stringify(data));
};

const setHash = (hash, mode, type, nickname) => {
  const jsonPath = path.join(path.dirname(__dirname), "clicker/hashes.json" )
  const data = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
  console.log(data);
  if (mode === "add") {
    if (type === "master") data.masterHashes[nickname] = hash;
    if (type === "main" && !data.mainServer.includes(hash)) data.mainServer.push(hash);
    console.log(data.mainServer);
  }
  if (mode === "remove") {
    if (type === "master") delete data.masterHashes[nickname];
    if (type === "main") {
      const hashesSet = new Set(data.mainServer);
      hashesSet.delete(hash.trim());
      data.mainServer = Array.from(hashesSet);
    }
  }

  fs.writeFileSync(jsonPath, JSON.stringify(data));
};

const handleSetClick = (interaction, battleId, team) => {
  interaction.reply(`Clicking Battle ID: ${battleId} team: ${team} ...`);
  //setClickOptions(battleId, team);
  BattleFind.setDetails(battleId,team);
  console.log(BattleFind.joinTeam,BattleFind.battleId_low);
};

const handleSetHash = (interaction, hash, mode, type, nickname) => {
  interaction.reply(`Updated ${mode} ${hash} ${nickname} : ${hash} `);
  setHash(hash, mode, type, nickname);
};

module.exports = { handleSetClick, handleSetHash };
