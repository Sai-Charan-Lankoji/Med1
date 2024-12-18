import { useMemo, useState } from "react";

interface UseSearchProps<T> {
  data: T[];
  searchKeys: (keyof T)[];
}

const useSearch = <T extends object>({ data, searchKeys }: UseSearchProps<T>) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = useMemo(() => {
    if (!searchQuery) return data;

    return data.filter((item) =>
      searchKeys.some((key) =>
        String(item[key])
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, data, searchKeys]);

  return { searchQuery, setSearchQuery, filteredData };
};

export default useSearch;
