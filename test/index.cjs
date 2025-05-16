const ikcheatniet = require("../dist/index.cjs").default;
const demoConfig = require("./demo.json");

const api = ikcheatniet.init(demoConfig.key);

(async () => {
  const result = await api.searchUser("1150775432485031936", {
    type: "discord"
  });
  console.log(result);
})()