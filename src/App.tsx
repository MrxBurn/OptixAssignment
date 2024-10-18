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
import CustomModal from "./components/Modal";
import Form from "./components/Form";
import useIsMobile from "./hooks/useIsMobile";

export const App = () => {
  const {
    movies: moviesResponse,
    isLoading: isLoadingMovies,
    error: errorMovies,
  } = useMovies();
  const {
    companies,
    isLoading: isLoadingCompanies,
    error: errorCompanies,
  } = useCompany();
  const submitReview = useSubmitReview();
  const isMobile = useIsMobile();

  // const movieLength = useRef(mockMovieData.length);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie>();
  const [isDescending, setIsDescending] = useState<boolean>(true);
  const [review, setReview] = useState("");
  const [open, setOpen] = useState(false);

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

      setTimeout(() => {
        setConfirmationMessage("");
        setOpen(false);
      }, 3000);
    }
    setReview("");
  };

  return (
    <div>
      <h2>Welcome to Movie database!</h2>
      <p id="error">{errorMovies}</p>
      <p id="error">{errorCompanies}</p>
      <button type="button" onClick={() => window.location.reload()}>
        Refresh
      </button>
      <p>
        Total movies displayed <strong>{movies.length}</strong>
      </p>
      {!isLoadingCompanies && !isLoadingMovies ? (
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
        <p id="loading">Loading...</p>
      )}
      {selectedMovie ? (
        <p>
          You have selected <strong>{selectedMovie.title}</strong>
        </p>
      ) : (
        <p>No movie selected</p>
      )}
      {errorCompanies || errorMovies ? (
        <p id="error">
          Please refresh page to get rid of errors before proceeding!
        </p>
      ) : null}
      {selectedMovie && !isMobile && !errorCompanies && !errorMovies && (
        <p>Please leave a review below</p>
      )}
      {selectedMovie && !isMobile && !errorCompanies && !errorMovies && (
        <Form
          confirmationMessage={confirmationMessage}
          onSubmit={onSubmit}
          setReview={setReview}
          review={review}
        ></Form>
      )}
      {isMobile && (
        <div>
          {selectedMovie && !errorCompanies && !errorMovies && (
            <button type="button" onClick={() => setOpen(true)}>
              Open form
            </button>
          )}
          <CustomModal
            confirmationMessage={confirmationMessage}
            onSubmit={onSubmit}
            review={review}
            setReview={setReview}
            handleClose={() => {
              setOpen(false), setReview("");
            }}
            open={open}
          />
        </div>
      )}
    </div>
  );
};
