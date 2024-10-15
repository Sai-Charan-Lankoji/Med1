type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

interface FetchOptions {
    endpointUrl: string;
    method: HttpMethod;
    requestBody?: any; 
};

export async function customFetch<R>(
    {endpointUrl, method, requestBody}: FetchOptions
): Promise<R> {
    const options: RequestInit = {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include', 
    };
    if (requestBody) {
        options.body = JSON.stringify(requestBody);
    }

    try{
        const url = `${process.env.NEXT_PUBLIC_API_URL}${endpointUrl}`;
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`my error: ${response.status}`);
        }
        const jsonResponse: R = await response.json();
        return jsonResponse;
    } catch(e){
        console.error('Error fetching data from the API', e);
        throw e;
    }
};