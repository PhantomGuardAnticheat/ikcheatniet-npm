import { request } from "./lib/requests";
import IkcheatnietReputation from "./lib/reputation";
import Cache from "./lib/cache";

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

type IkcheatnietStats = {
    last_modified: string;
    total_users: number;
    total_file_length: number;
}

class Ikcheatniet {
    private baseUrl: string = "";
    private apiKey: string = "";
    private cache: Cache;

    private constructor() {
        this.cache = new Cache();
    }

    public static init(apiKey: string, baseUrl?: string, cacheTTL?: number): Ikcheatniet {
        const instance = new Ikcheatniet();
        instance.baseUrl = baseUrl || "https://ikcheatniet.phantomguard.eu";
        instance.apiKey = apiKey;
        instance.cache = new Cache(cacheTTL || 60000);
        return instance;
    }

    public get stats(): Promise<IkcheatnietStats> {
        const cacheKey = "stats";
        const cachedStats = this.cache.get(cacheKey);

        if (cachedStats) {
            return Promise.resolve(cachedStats) as Promise<IkcheatnietStats>;
        }

        const url = `${this.baseUrl}/stats`;
        return request(url, {
            method: "GET",
            headers: {
                "Authorization": `${this.apiKey}`,
                "Content-Type": "application/json"
            }
        }).then(response => {
            if (!response.ok) {
                const statusCode = response.status;

                switch (statusCode) {
                    case 401:
                        throw new Error("Unauthorized: Invalid API key.");

                    default:
                        throw new Error(`Error: ${response.statusText} (Status Code: ${statusCode})`);
                }
            }

            return response.json();
        }).then(data => {
            if (!data || !data.last_modified || !data.total_entries || !data.total_size) {
                throw new Error("Invalid response from the API.");
            }

            const stats = {
                last_modified: data.last_modified,
                total_users: data.total_entries,
                total_file_length: data.total_size,
            };

            this.cache.set(cacheKey, stats);
            return stats;
        }).catch(error => {
            throw new Error(`Failed to fetch stats: ${error.message}`);
        });
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
        const cacheKey = `searchUser:${discordId}:${options?.type}:${options?.searchType}`;
        const cachedResponse = this.cache.get(cacheKey);

        if (cachedResponse) {
            return Promise.resolve(cachedResponse) as unknown as DiscordResponse | CheaterResponse;
        }

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

        const result = await response.json();
        this.cache.set(cacheKey, result);
        return result;
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