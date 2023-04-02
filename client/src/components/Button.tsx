import { FC, ReactNode } from "react";
import {
  Button as ButtonComponent,
  ButtonProps,
  Spinner,
} from "react-bootstrap";

export const Button: FC<
  { children: ReactNode; isLoading?: boolean } & ButtonProps
> = ({ children, disabled, isLoading, ...rest }) => {
  return (
    <ButtonComponent
      variant="primary"
      disabled={disabled || isLoading}
      className=""
      {...rest}
    >
      {isLoading ? (
        <span>
          <Spinner size="sm" animation="border" variant="light" /> Загрузка...
        </span>
      ) : (
        children
      )}
    </ButtonComponent>
  );
};
