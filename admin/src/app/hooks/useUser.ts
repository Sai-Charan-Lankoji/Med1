import useSWR from "swr";
import { NEXT_URL } from "@/app/constants";

const fetcher = (url: string) =>
  fetch(url, { credentials: "include" }).then((res) => {
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
  });

export const useUser = () => {
  const { data, error, isLoading } = useSWR(`${NEXT_URL}/api/auth/me`, fetcher);

  return {
    user: data,
    isLoading,
    isError: error,
  };
};