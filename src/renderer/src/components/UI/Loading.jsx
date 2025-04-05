import React from "react";
import { Spinner } from "react-bootstrap";
export default function Loading({ color, animation }) {
  return (
    <div>
      <div className="loader-div">
        <Spinner
          className="spinner-center"
          animation={animation}
          color={color}
          size={200}
        />
      </div>
    </div>
  );
}
