import { useEffect, useState } from "react";

export type Movie = {
  id: string;
  reviews: number[];
  title: string;
  filmCompanyId: string;
  cost: number;
  releaseYear: number;
};

const useMovies = (): Movie[] => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const url = "http://localhost:3000/movies";

  const fetchData = async (): Promise<void> => {
    try {
      const response = await fetch(url, { method: "GET" });
      const movies = (await response.json()) as Movie[];
      setMovies(movies);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, [url]);

  return movies;
};

export default useMovies;
