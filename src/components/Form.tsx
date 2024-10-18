import { FormEvent } from "react";

type FormType = {
  onSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  setReview: (value: React.SetStateAction<string>) => void;
  review: string;
  confirmationMessage: string;
};

function Form({
  onSubmit,
  setReview,
  review,
  confirmationMessage,
}: FormType): JSX.Element {
  return (
    <form onSubmit={(e) => onSubmit(e)}>
      <label>
        Review:
        <textarea
          value={review}
          onChange={(e) => setReview(e.currentTarget.value)}
          placeholder="Write a review before submitting"
        />
      </label>
      {review.length > 100 && (
        <p id="error">{"Review should be max. 100 characters!"}</p>
      )}
      <div id="submit_wrapper">
        <button disabled={!review || review.length > 100} type="submit">
          Submit review
        </button>
        <p id="confirmation">{confirmationMessage}</p>
      </div>
    </form>
  );
}

export default Form;
