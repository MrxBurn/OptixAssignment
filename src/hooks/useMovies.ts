import { useEffect, useState } from "react";

export type Movie = {
  id: string;
  reviews: number[];
  title: string;
  filmCompanyId: string;
  cost: number;
  releaseYear: number;
};

const useMovies = (): { movies: Movie[]; isLoading: boolean } => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const url = "http://localhost:3000/movies";

  const fetchData = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await fetch(url, { method: "GET" });
      const movies = (await response.json()) as Movie[];
      setMovies(movies);
      setIsLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, [url]);

  return { movies: movies, isLoading };
};

export default useMovies;
