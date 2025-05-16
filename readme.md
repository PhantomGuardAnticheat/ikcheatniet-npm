# ikcheatniet

An open-source NPM package (API wrapper) for the [ikcheatniet](https://ikcheatniet.nl) API.  
This API allows you to look up Discord user IDs in a database of users associated with cheating servers. 🚫🎮

## Features ✨

- Query the ikcheatniet API to check if a Discord user ID is flagged as a cheater. 🔍
- Easy-to-use methods for integration into your Node.js projects. 🛠️
- Lightweight and open source. 🌟

## Installation 📦

```bash
npm install @phantomguard/ikcheatniet
```

## Usage 🚀

CommonJS

```js
const Ikcheatniet = require("@phantomguard/ikcheatniet").default;;

const api = Ikcheatniet.init("your_license_key");

const test = async () => {
  try {
    const result = await api.searchUser("discord_user_id", {
      type: "cheater",
    });
    console.log("Search Result:", result);
  } catch (error) {
    console.error(
      "An error occurred while searching for the user:",
      error.message
    );
  }
};

test();
```

ES Module

```mjs
import Ikcheatniet from "@phantomguard/ikcheatniet";

const api = Ikcheatniet.init("your_license_key");

const test = async () => {
  try {
    const result = await api.searchUser("discord_user_id", {
      type: "cheater",
    });
    console.log("Search Result:", result);
  } catch (error) {
    console.error(
      "An error occurred while searching for the user:",
      error.message
    );
  }
};

test();
```

## API 🛡️
### Typings can be found [here](#types-)

```ts
Ikcheatniet.init(apiKey: string): Ikcheatniet
```

Initializes the API client with your license key.

- `apiKey`: Your API key provided by [ikcheatniet](https://discord.phantomguard.eu)

---

```ts
searchUser(discordId: string, options: object): Promise<DiscordResponse | CheaterResponse>
```

Searches the ikcheatniet database for a Discord user ID.

- `discordId`: The Discord user ID to search for.
- `options`: Search options:
  - `type`: `"discord"` or `"cheater"`.
  - `searchType`: `"single"` or `"bulk"` _(only available for private licenses)_.

Example Response for `type: "cheater"`

```json
{
  "message": "Success",
  "id": "123456789",
  "entries": ["1150775432485031936:server", "123456789012345678:server"]
}
```

Example Response for `type: "discord"`

```json
{
  "message": "Success",
  "id": "1150775432485031936",
  "user": {
    "id": "1150775432485031936",
    "username": "exampleUser",
    "avatar": "avatar_url",
    "discriminator": "1234",
    "global_name": "Example User",
    "banner_color": "#FFFFFF",
    "created_at": "2023-01-01T00:00:00Z",
    "clan": {
      "identity_guild_id": "guild_id",
      "tag": "ClanTag"
    },
    "primary_guild": {
      "identity_guild_id": "guild_id",
      "tag": "PrimaryGuildTag"
    }
  }
}
```

---

```ts
getUserReputation(user: string | CheaterResponse): Promise<IkcheatnietReputation>
```

Gets the reputation amount for a user, it provides a string/number depending on what you need.

- `discordId`: The Discord user ID or User Object to get the reputation from.

---

## Types 🪪

```ts
type DiscordResponse = {
  message: string;
  id: string;
  user: {
    id: string;
    username: string;
    avatar: string;
    discriminator: string;
    global_name: string;
    banner_color: string;
    created_at: string;
    clan: {
      identity_guild_id: string;
      tag: string;
    };
    primary_guild: {
      identity_guild_id: string;
      tag: string;
    };
  };
};

type CheaterResponse = {
  message: string;
  id: string;
  entries: string[];
};

type IkcheatnietReputation = {
  _reputation: number;
  reputationLevel: "Clean" | "Suspicious" | "Untrusted" | "Cheater";
};
```

## License 📜

The project is licensed under MIT.

Feel free to use, modify, and distribute this package as needed. 💻
