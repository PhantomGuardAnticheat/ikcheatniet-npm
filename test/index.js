import Ikcheatniet from "../dist/index.js";
import demoConfig from "./demo.json" with { type: "json" };

const api = Ikcheatniet.init(demoConfig.key);

const test = async () => {
    const result = await api.searchUser("1150775432485031936", {
        type: "cheater"
    });
    console.log(result);

    const tt = await api.getUserReputation(result)
    console.log(tt);
}

test()
    .then(() => {
        console.log("Test completed successfully.");
    })
    .catch((error) => {
        console.error("Test failed:", error);
    });