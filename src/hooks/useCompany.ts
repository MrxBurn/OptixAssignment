import { useEffect, useState } from "react";

export type Company = {
  id: string;
  name: string;
};

const useCompany = (): Company[] => {
  const url = "http://localhost:3000/movieCompanies";
  const [companies, setCompanies] = useState<Company[]>([]);

  const fetchData = async (): Promise<void> => {
    try {
      const response = await fetch(url, { method: "GET" });
      const companyJson = (await response.json()) as Company[];
      setCompanies(companyJson);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, [url]);

  return companies;
};

export default useCompany;
