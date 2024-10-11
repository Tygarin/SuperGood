import { FC, ReactNode } from "react";
import { NavBar } from "./NavBar";
import { Button, Container } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";

export const PageLayout: FC<{
  children: ReactNode;
  title: string;
  addButton?: { title: string; modalKey: string };
}> = ({ children, title, addButton }) => {
  const [, setSearchParams] = useSearchParams();
  return (
    <section>
      <NavBar />
      <Container>
        <section className="pt-3">
          <div className="flex justify-between mb-2">
            <h3>{title}</h3>
            {addButton ? (
              <Button
                onClick={() => {
                  setSearchParams({ modal: addButton.modalKey });
                }}
                variant="primary"
                size="sm"
              >
                {addButton.title}
              </Button>
            ) : null}
          </div>
          {children}
        </section>
      </Container>
    </section>
  );
};
