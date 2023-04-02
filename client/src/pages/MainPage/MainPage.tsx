import { FC } from "react";
import { NavBar, UsersList } from "./components";
import { Container } from "react-bootstrap";

export const MainPage: FC = () => {
  return (
    <>
      <NavBar />
      <Container>
        <div></div>
        <UsersList />
      </Container>
    </>
  );
};
