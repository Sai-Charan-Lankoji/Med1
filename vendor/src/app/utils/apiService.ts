import { customFetch } from "./api";

class APIService {
    async getAll<R>(endpointUrl: string): Promise<R[]> {
        const response: R[] = await customFetch({
            endpointUrl,
            method: "GET"
        });
        return response;
    };

    async get<R>(endpointUrl: string): Promise<R> {
        const response: R = await customFetch({
            endpointUrl,
            method: "GET"
        });
        return response;
    }

    async post<R>(endpointUrl: string, requestBody: any): Promise<R> {
        const response: R = await customFetch({
            endpointUrl,
            method: "POST",
            requestBody
        });
        return response;
    }; 

    // async post<R>(endpointUrl: string, requestBody: any, isFileUpload = false): Promise<R> {
    //     const headers = isFileUpload ? {} : { 'Content-Type': 'application/json' };
    
    //     try {
    //         const response: R = await customFetch({
    //             endpointUrl,
    //             method: "POST",
    //             requestBody,
    //             headers,  // Now headers are properly recognized
    //         });
    //         return response;
    //     } catch (error) {
    //         console.error(`Error posting to ${endpointUrl}:`, error);
    //         throw error;
    //     }
    // };
    
    

    async put<R>(endpointUrl: string, requestBody: any): Promise<R> {
        const response: R = await customFetch({
            endpointUrl,
            method: "PUT",
            requestBody
        });
        return response;
    };

    async delete<R>(endpointUrl: string): Promise<R> {
        const response: R = await customFetch({
            endpointUrl,
            method: "DELETE"
        });
        return response;
    };
};

export const apiService = new APIService();