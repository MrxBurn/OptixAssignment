const useSubmitReview = (): (() => Promise<string>) => {
  const url = "http://localhost:3000/submitReview";

  const submitReview = async (): Promise<string> => {
    try {
      const response = await fetch(url, { method: "POST" });

      const data = await response.json();

      return data.message;
    } catch (e) {
      console.log(e);
    }
    return "";
  };

  return submitReview;
};

export default useSubmitReview;
