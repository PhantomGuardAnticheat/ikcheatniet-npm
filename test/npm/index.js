import Ikcheatniet from "@phantomguard/ikcheatniet";
import demoConfig from "../demo.json" with { type: "json" };

const api = Ikcheatniet.init(demoConfig.key);

const test = async () => {
    const result = await api.stats;
    console.log(result)
}

test()