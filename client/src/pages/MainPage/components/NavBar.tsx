import { FC } from "react";
import { Navbar as BootstrapNavBar } from "react-bootstrap";

export const NavBar: FC = () => {
  return (
    <BootstrapNavBar bg="light">
      <BootstrapNavBar.Brand>Строй.ру</BootstrapNavBar.Brand>
    </BootstrapNavBar>
  );
};
