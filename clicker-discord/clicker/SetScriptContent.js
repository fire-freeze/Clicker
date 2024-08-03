const fs = require("fs");
const path = require("path");

class SetScriptContent {
  static setScript = async page => {
    try {
      const scriptFilePath = path.join(__dirname, "BrowserScriptContent.js");
      //await page.addScriptTag({ path: scriptFilePath });
      const script = fs.readFileSync(scriptFilePath, "utf-8");
      await page.evaluate(content => {
        const scriptTag = document.createElement("script");
        scriptTag.innerHTML = content;
        document.body.appendChild(scriptTag);
      }, script);
    } catch (err) {
      throw err;
    }
  };

  static addScript = async (script, page) => {
    try {
      await page.addScriptTag({ content: `${script}` });
    } catch (err) {
      throw err;
    }
  };
}

module.exports = SetScriptContent;
