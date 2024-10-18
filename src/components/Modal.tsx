import Modal from "@mui/material/Modal";
import React, { FormEvent, useState } from "react";
import Form from "./Form";

type ModalType = {
  handleClose: () => void;
  open: boolean;
  onSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  setReview: (value: React.SetStateAction<string>) => void;
  review: string;
  confirmationMessage: string;
};

function CustomModal({
  handleClose,
  open,
  onSubmit,
  setReview,
  review,
  confirmationMessage,
}: ModalType) {
  return (
    <div
      style={{
        textAlign: "center",
        display: "block",
        padding: 30,
        margin: "auto",
      }}
    >
      <Modal
        onClose={handleClose}
        open={open}
        style={{
          position: "absolute",
          border: "1px solid black",
          borderRadius: "4px",
          backgroundColor: "#F2F7F2",
          boxShadow: "2px solid black",
          height: 400,
          width: 350,
          margin: "auto",
          padding: "25px",
          color: "white",
        }}
      >
        <div>
          <Form
            confirmationMessage={confirmationMessage}
            onSubmit={onSubmit}
            review={review}
            setReview={setReview}
          ></Form>
        </div>
      </Modal>
    </div>
  );
}

export default CustomModal;
