import { FC } from "react";
import { Spinner } from "react-bootstrap";

export const LoadingComponent: FC = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <Spinner animation="grow" />
    </div>
  );
};
