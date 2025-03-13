    // api/plans/plans.ts
    import axios, { AxiosRequestConfig } from 'axios';
    import { NEXT_URL } from "@/app/constants";


    export interface PlanData {
    name: string;
    price: string;
    description?: string;
    features?: string[];
    discount?: number;
    isActive?: boolean;
    no_stores?: string;
    commission_rate?: number;
    }

    export interface Plan extends PlanData {
    id: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    }

    export const createPlan = async (planData: PlanData, cookieHeader: string) => {
    const config: AxiosRequestConfig = {
        headers: { Cookie: cookieHeader || '' },
        withCredentials: true,
    };
    const response = await axios.post<Plan>(`${NEXT_URL}/plan`, planData, config);
    return response.data;
    };

    export const getAllPlans = async (cookieHeader: string) => {
    const config: AxiosRequestConfig = {
        headers: { Cookie: cookieHeader || '' },
        withCredentials: true,
    };
    const response = await axios.get<Plan[]>(`${NEXT_URL}/plan`, config);
    return response.data;
    };

    export const updatePlan = async (id: string, planData: PlanData, cookieHeader: string) => {
    const config: AxiosRequestConfig = {
        headers: { Cookie: cookieHeader || '' },
        withCredentials: true,
    };
    const response = await axios.put<Plan>(`${NEXT_URL}/plan/${id}`, planData, config);
    return response.data;
    };

    export const deletePlan = async (id: string, cookieHeader: string) => {
    const config: AxiosRequestConfig = {
        headers: { Cookie: cookieHeader || '' },
        withCredentials: true,
    };
    const response = await axios.delete(`${NEXT_URL}/plan/${id}`, config);
    return response.data;
    };