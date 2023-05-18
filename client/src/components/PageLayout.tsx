import { FC, ReactNode } from "react";
import { NavBar } from "./NavBar";
import { Container } from "react-bootstrap";

export const PageLayout: FC<{ children: ReactNode; title: string }> = ({
  children,
  title,
}) => {
  return (
    <>
      <NavBar />
      <Container>
        <section className="pt-3">
          <h3>{title}</h3>
          {children}
        </section>
      </Container>
    </>
  );
};
