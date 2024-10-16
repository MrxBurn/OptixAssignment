import { useRef, useState, Children } from "react";
import { easeIn, easeOut } from "polished";
import { useBoolean } from "react-use";
import { createReducer } from "@reduxjs/toolkit";
import useMovies, { Movie } from "./hooks/useMovies";
import useCompany, { Company } from "./hooks/useCompany";

export const App = () => {
  const movies = useMovies();

  const companies = useCompany();

  // const movieLength = useRef(mockMovieData.length);
  const [selectedMovie, setSelectedMovie] = useState<Movie>();

  const refreshButton = (buttonText: any) => {
    if (companies) {
      return <button>{buttonText}</button>;
    } else {
      return <p>No movies loaded yet</p>;
    }
  };

  return (
    <div>
      <h2>Welcome to Movie database!</h2>
      {refreshButton("Refresh")}
      <p>
        Total movies displayed <strong>{movies.length}</strong>
      </p>

      <ol>
        <li id="grid">
          <span>Title</span>
          <span>Review</span>
          <span>Film Company</span>
        </li>
        {movies.map((movie: Movie, idx: number) => (
          <li
            style={{
              color: selectedMovie?.id === movie.id ? "white" : "",
              backgroundColor: selectedMovie?.id === movie.id ? "#006992" : "",
            }}
            id="grid"
            onClick={() => {
              setSelectedMovie(movie);
            }}
            key={movie.id}
          >
            <span>{movie.title}</span>
            <span>
              {(
                movie.reviews.reduce(
                  (value: number, i: number) => value + i,
                  0
                ) / movie.reviews.length
              )
                ?.toString()
                .substring(0, 3)}
            </span>
            <span>
              {
                companies.find(
                  (company: Company) => company.id === movie.filmCompanyId
                )?.name
              }
            </span>
          </li>
        ))}
      </ol>
      {selectedMovie ? (
        <p>
          You have selected <strong>{selectedMovie.title}</strong>
        </p>
      ) : (
        <p>No movie selected</p>
      )}

      {selectedMovie && <p>Please leave a review below</p>}
      {selectedMovie && (
        <form onSubmit={() => {}}>
          <label>
            Review:
            <textarea />
          </label>
          <button type="submit">Submit review</button>
        </form>
      )}
    </div>
  );
};
