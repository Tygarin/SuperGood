import { Button } from "components";
import { useAuthContext } from "context";
import { useCurrentUser } from "libs";
import { FC } from "react";
import { Navbar as BootstrapNavBar, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

export const NavBar: FC = () => {
  const { userInfo } = useCurrentUser();
  const { logout } = useAuthContext();

  return (
    <BootstrapNavBar bg="light">
      <Container>
        <BootstrapNavBar.Brand as={Link} to="/">
          <img alt="прынь" width={150} src={require("../images/logo.png")} />
        </BootstrapNavBar.Brand>
        {userInfo && (
          <div className="justify-content-end d-flex items-center gap-3">
            <p className="m-0">{userInfo.name}</p>
            <Button onClick={logout} variant="danger" size="sm">
              Выйти
            </Button>
          </div>
        )}
      </Container>
    </BootstrapNavBar>
  );
};
