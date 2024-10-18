import { useEffect, useState } from "react";

export type Company = {
  id: string;
  name: string;
};

const useCompany = (): {
  companies: Company[];
  isLoading: boolean;
  error: string;
} => {
  const url = "http://localhost:3000/movieCompanies";
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState("");

  const fetchData = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await fetch(url, { method: "GET" });

      const companyJson = (await response.json()) as Company[];
      setCompanies(companyJson);
      setIsLoading(false);
    } catch (e) {
      setError("Something went wrong when fetching movie companies");
    }
  };

  useEffect(() => {
    fetchData();
  }, [url]);

  return { companies: companies, isLoading: isLoading, error: error };
};

export default useCompany;
