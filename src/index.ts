import { request } from "./lib/requests";
import IkcheatnietReputation from "./lib/reputation";

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
        collectibles: any;
        clan: {
            identity_guild_id: string;
            tag: string;
        },
        primary_guild: {
            identity_guild_id: string;
            tag: string;
        }
    }
}

type CheaterResponse = {
    message: string;
    id: string;
    entries: `${string}:${string}`[];
}

class Ikcheatniet {
    private baseUrl: string = "";
    private apiKey: string = "";

    private constructor() {

    }

    public static init(apiKey: string, baseUrl?: string): Ikcheatniet {
        const instance = new Ikcheatniet();
        instance.baseUrl = baseUrl || "https://ikcheatniet.phantomguard.eu";
        instance.apiKey = apiKey;
        return instance;
    }

    public async searchUser(
        discordId: string,
        options?: {
            type: "discord";
            searchType: "single";
        } | {
            type: "cheater";
            searchType: "single" | "bulk";
        }
    ): Promise<DiscordResponse | CheaterResponse> {
        if (!this.apiKey) {
            throw new Error("API key is not set. Please initialize the class with a valid API key.");
        }

        if (!this.baseUrl) {
            throw new Error("Base URL is not set. Please initialize first.");
        }

        if (!discordId) {
            throw new Error("Discord ID is required.");
        }

        const url = `${this.baseUrl}/lookup`;
        const type = options?.type || "cheater";
        const searchType = options?.searchType || "single";

        const response = await request(url, {
            method: "POST",
            headers: {
                "Authorization": `${this.apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "type": type,
                "searchType": searchType,
                "id": discordId
            })
        });

        if (!response.ok) {
            const statusCode = response.status;

            switch (statusCode) {
                case 401:
                    throw new Error("Unauthorized: Invalid API key.");

                default:
                    throw new Error(`Error: ${response.statusText} (Status Code: ${statusCode})`);
            }
        }

        if (type === "discord") {
            return response.json() as Promise<DiscordResponse>;
        } else {
            return response.json() as Promise<CheaterResponse>;
        }
    }

    public async getUserReputation(user: string | CheaterResponse): Promise<IkcheatnietReputation> {
        let RepUser = user;
        if (typeof user === "string") {
            RepUser = await this.searchUser(user, { type: "cheater", searchType: "single" }) as CheaterResponse;
        }

        if (!RepUser || !(<CheaterResponse>RepUser).entries) {
            throw new Error("Invalid response from the API.");
        }

        const reputation = new IkcheatnietReputation(<CheaterResponse>RepUser);

        if (!reputation) {
            throw new Error("Failed to create reputation instance.");
        }

        return reputation;
    }
}

export default Ikcheatniet;