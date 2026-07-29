export async function fetcher(
    url: string,
    query?: Record<string, string | number | boolean>,
    options?: RequestInit
) {
    const params = new URLSearchParams();

    if (query) {
        Object.entries(query).forEach(([key, value]) => {
            params.append(key, String(value));
        });
    }

    const res = await fetch(
        `${url}${params.toString() ? `?${params}` : ""}`,
        {
            ...options,
            next: {
                revalidate: 10, // 5 minutes
            },
        }
    );

    if (!res.ok) {
        throw new Error(
            `Request failed (${res.status})`
        );
    }

    return res.json();
}