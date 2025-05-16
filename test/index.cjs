const Ikcheatniet = require("../dist/index.cjs").default;
const demoConfig = require("./demo.json");

const api = Ikcheatniet.init(demoConfig.key);

const test = async () => {
  const result = await api.searchUser("1150775432485031936", {
    type: "cheater"
  });
  console.log(result);

  const stats = await api.stats;

  console.log(stats);
}

test()
  .then(() => {
    console.log("Test completed successfully.");
  })
  .catch((error) => {
    console.error("Test failed:", error);
  });