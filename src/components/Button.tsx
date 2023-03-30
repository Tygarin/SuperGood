import { FC, ReactNode } from "react";
import { Button as ButtonComponent, ButtonProps } from "react-bootstrap";

export const Button: FC<{ children: ReactNode } & ButtonProps> = ({
  children,
  ...rest
}) => {
  return (
    <ButtonComponent className="" {...rest}>
      {children}
    </ButtonComponent>
  );
};
