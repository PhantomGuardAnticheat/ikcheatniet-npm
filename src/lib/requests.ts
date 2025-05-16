let fetchFn: typeof fetch;

if (typeof fetch === "function") {
    fetchFn = fetch;
} else {
    fetchFn = async (...args: Parameters<typeof fetch>) => {
        const mod = await import('node-fetch');
        const [input, init] = args;

        const url = typeof input === 'string' || input instanceof URL ? input : input.url;
        return mod.default(url, init) as unknown as Response;
    };
}

export async function request(
    url: string,
    options?: RequestInit
): Promise<Response> {
    return fetchFn(url, options);
}