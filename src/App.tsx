import {
  useRef,
  useState,
  Children,
  useEffect,
  FormEventHandler,
  FormEvent,
} from "react";
import { easeIn, easeOut } from "polished";
import { useBoolean } from "react-use";
import { createReducer } from "@reduxjs/toolkit";
import useMovies, { Movie } from "./hooks/useMovies";
import useCompany, { Company } from "./hooks/useCompany";
import arrow_down from "/arrow_down.png";
import useSubmitReview from "./hooks/useSubmitReview";

export const App = () => {
  const { movies: moviesResponse, isLoading } = useMovies();
  const companies = useCompany();
  const submitReview = useSubmitReview();

  // const movieLength = useRef(mockMovieData.length);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie>();
  const [isDescending, setIsDescending] = useState<boolean>(true);
  const [review, setReview] = useState("");

  useEffect(() => {
    setMovies(
      moviesResponse.sort(
        (a, b) =>
          Number(sortReviews(b.reviews)) - Number(sortReviews(a.reviews))
      )
    );
  }, [moviesResponse]);

  const sortReviews = (reviews: number[]): string => {
    return (
      reviews.reduce((value: number, i: number) => value + i, 0) /
      reviews.length
    )
      ?.toString()
      .substring(0, 3);
  };

  const refreshButton = (buttonText: any) => {
    if (companies) {
      return <button>{buttonText}</button>;
    } else {
      return <p>No movies loaded yet</p>;
    }
  };

  const onSortClick = (): void => {
    if (isDescending) {
      setMovies(
        moviesResponse.sort(
          (a, b) =>
            Number(sortReviews(a.reviews)) - Number(sortReviews(b.reviews))
        )
      );
      document.getElementById("sort")!.style.cssText = "rotate: 180deg";
    } else {
      moviesResponse.sort(
        (a, b) =>
          Number(sortReviews(b.reviews)) - Number(sortReviews(a.reviews))
      );
      document.getElementById("sort")!.style.cssText = "rotate: 0deg";
    }

    setIsDescending(!isDescending);
  };

  const [confirmationMessage, setConfirmationMessage] = useState("");
  const onSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (review) {
      setConfirmationMessage(await submitReview());
      setTimeout(() => setConfirmationMessage(""), 3000);
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  console.log(review);

  return (
    <div>
      <h2>Welcome to Movie database!</h2>
      {refreshButton("Refresh")}
      <p>
        Total movies displayed <strong>{movies.length}</strong>
      </p>
      {!isLoading ? (
        <table>
          <tbody>
            <tr>
              <th>Title</th>
              <th>
                <button id="arrow_down" onClick={() => onSortClick()}>
                  <span>Review </span>
                  <img id="sort" src={arrow_down} alt="arrow_down" />
                </button>
              </th>
              <th>Film Company</th>
            </tr>
            {movies.map((movie: Movie) => (
              <tr
                style={{
                  color: selectedMovie?.id === movie.id ? "white" : "",
                  backgroundColor:
                    selectedMovie?.id === movie.id ? "#F49D6E" : "",
                }}
                onClick={() => {
                  setSelectedMovie(movie);
                }}
                key={movie.id}
              >
                <td>{movie.title}</td>
                <td>{sortReviews(movie.reviews)}</td>
                <td>
                  {
                    companies.find(
                      (company: Company) => company.id === movie.filmCompanyId
                    )?.name
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Loading...</p>
      )}
      {selectedMovie ? (
        <p>
          You have selected <strong>{selectedMovie.title}</strong>
        </p>
      ) : (
        <p>No movie selected</p>
      )}

      {selectedMovie && <p>Please leave a review below</p>}
      {selectedMovie && (
        <form onSubmit={(e) => onSubmit(e)}>
          <label>
            Review:
            <textarea
              onChange={(e) => setReview(e.currentTarget.value)}
              placeholder="Write a review before submitting"
            />
          </label>
          {review.length > 100 && (
            <p id="error">{"Review should be max. 100 characters!"}</p>
          )}
          <button disabled={!review || review.length > 100} type="submit">
            Submit review
          </button>
        </form>
      )}

      {confirmationMessage && <p id="confirmation">{confirmationMessage}</p>}
    </div>
  );
};
