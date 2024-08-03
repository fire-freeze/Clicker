const hashes = require("./hashes.json");
const SetScriptContent = require("./SetScriptContent");
class SetHashKey {
  static getHashKeys() {
    return null != hashes ? hashes : null;
  }

  static getHash(index, type) {
    const hashKeys = this.getHashKeys()[type];
    const hash = hashKeys.at(index).toString();
    return hash;
  }

  static getHashesLength(type) {
    const hashKeys = this.getHashKeys()[type];
    return hashKeys.length;
  }

  static setHash = async (page, index, type) => {
    const pageHash = this.getHash(index, type);
    console.log(pageHash);
    if (pageHash !== null) {
      await SetScriptContent.addScript(
        `localStorage.entrance_hash_key="",
        setTimeout(e => localStorage.entrance_hash_key="${pageHash}", 3 * 100)`,
        page
      );
    }
  };
}

module.exports = SetHashKey;
