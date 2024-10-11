import { FC } from "react";
import { UsersList } from "./components";
import { Container } from "react-bootstrap";
import { CreateUserModal } from "modals";
import { Link } from "react-router-dom";
import { NavBar } from "components";

export const MainPage: FC = () => {
  const actionsList = [
    { text: "Чаты", href: "/chatsPage" },
  ];
  return (
    <>
      <NavBar />
      <Container>
        <div className="flex">
          <section className="pt-5 flex flex-wrap gap-5">
            {actionsList.map(({ text, href }) => (
              <Link
                key={`${text}-${href}`}
                to={href}
                className="w-[200px] no-underline h-[200px] bg-blue-400 rounded-3xl flex justify-center items-center text-center text-white p-5 hover:bg-blue-700 cursor-pointer"
              >
                {text}
              </Link>
            ))}
          </section>
          <UsersList />
        </div>
      </Container>
      <CreateUserModal />
    </>
  );
};
