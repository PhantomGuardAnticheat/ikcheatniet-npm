type CacheEntry<T> = {
    value: T;
    expiry: number;
};

class Cache {
    private cache: Map<string, CacheEntry<any>> = new Map();

    constructor(private defaultTTL: number = 60000) { }

    public set<T>(key: string, value: T, ttl?: number): void {
        const expiry = Date.now() + (ttl || this.defaultTTL);
        this.cache.set(key, { value, expiry });
    }

    public get<T>(key: string): T | null {
        const entry = this.cache.get(key);
        if (!entry) return null;

        if (Date.now() > entry.expiry) {
            this.cache.delete(key);
            return null;
        }

        return entry.value;
    }

    public delete(key: string): void {
        this.cache.delete(key);
    }

    public clear(): void {
        this.cache.clear();
    }
}

export default Cache;