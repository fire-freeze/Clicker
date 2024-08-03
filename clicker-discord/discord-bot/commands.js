const { ApplicationCommandOptionType } = require("discord.js");

const commands = [
  {
    name: "click",
    description: "Click battleId team",
    options: [
      {
        name: "battle-id",
        description: "battle-id",
        type: ApplicationCommandOptionType.Number,
        required: true,
      },
      {
        name: "team",
        description: "team",
        type: ApplicationCommandOptionType.String,
        choices: [
          {
            name: "A",
            value: "A",
          },
          {
            name: "B",
            value: "B",
          },
        ],
        required: true,
      },
    ],
  },

  {
    name: "sethash",
    description: "Add/Remove Hash",
    options: [
      {
        name: "operation",
        description: "add/remove",
        type: ApplicationCommandOptionType.String,
        required: true,
        choices: [
          {
            name: "add",
            value: "add",
          },

          {
            name: "remove",
            value: "remove",
          },
        ],
      },
      {
        name: "type",
        description: "Hash Type",
        type: ApplicationCommandOptionType.String,
        required: true,
        choices: [
          {
            name: "main",
            value: "main",
          },
          {
            name: "master",
            value: "master",
          },
        ],
      },
      {
        name: "hashkey",
        description: "hash value",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: "nickname",
        description: "Account Nickname",
        type: ApplicationCommandOptionType.String,
        required: false
      }
    ],
  },
  {
    name:"start",
    description: "Start Clicker"
  },
  {
    name:"stop",
    description: "Stop Clicker"
  },
  {
    name:"play",
    description: "Join MM"
  }
];

module.exports = commands;
