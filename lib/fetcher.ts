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
            headers: {
                "Authorization": `Bearer ${"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjY0LCJkZXZpY2VJZCI6NDYzLCJpYXQiOjE3ODUzMzg3OTEsImV4cCI6MTc4NTQyNTE5MX0.Hlk_TFB_Hadu6anGD-zEM5tHh1Lp41YffMraU9mHONs"}`,
            }
        }
    );

    if (!res.ok) {
        throw new Error(
            `Request failed (${res.status})`
        );
    }

    return res.json();
}