import { Button, useAuthContext } from "components";
import { useCurrentUser } from "libs";
import { FC } from "react";
import { Navbar as BootstrapNavBar, Container } from "react-bootstrap";

export const NavBar: FC = () => {
  const { userInfo } = useCurrentUser();
  const { logout } = useAuthContext();

  return (
    <BootstrapNavBar bg="light">
      <Container>
        <BootstrapNavBar.Brand>Строй.ру</BootstrapNavBar.Brand>
        {userInfo && (
          <div className="justify-content-end d-flex items-center gap-3">
            <p className="m-0">{userInfo.userIdentify}</p>
            <Button onClick={logout} variant="danger" size="sm">
              Выйти
            </Button>
          </div>
        )}
      </Container>
    </BootstrapNavBar>
  );
};
