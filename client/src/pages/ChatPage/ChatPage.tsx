import { useApi } from "api";
import { ChatModel } from "api/responses";
import { PageLayout } from "components";
import { useUsersList } from "libs";
import { FC } from "react";
import { Button, Form } from "react-bootstrap";
import { useQuery } from "react-query";
import { Navigate, useParams } from "react-router-dom";

const messages = [
  { name: "Андрюша", text: "Какой у нас бюджет?" },
  { name: "Андрюша", text: "Привет, админ!!!" },
  { text: "Привет всем!!!" },
];

export const ChatPage: FC = () => {
  const { chatID } = useParams();
  const { getChat } = useApi();
  const { data: currentChat } = useQuery({
    queryFn: () => getChat(`${chatID}`),
    queryKey: ["getChat", chatID],
  });
  if (!currentChat) return <Navigate to="/chatsPage" />;
  return (
    <PageLayout title={currentChat.name}>
      <section className="flex">
        <div className="h-[800px] flex-1 flex flex-col">
          <div className="flex-1 gap-2 flex flex-col-reverse py-2">
            {messages.map(({ name, text }) => {
              const isMyself = !name;
              return (
                <div
                  key={`${name}-${text}`}
                  className={`flex gap-3 items-center ${
                    isMyself ? "justify-end" : ""
                  }`}
                >
                  <div
                    className={`${
                      isMyself ? "bg-blue-400" : "bg-teal-400"
                    } text-white p-2`}
                  >
                    {name && <p className="m-0 text-[12px]">{name}</p>}
                    <div className="flex justify-between items-end gap-5">
                      <p className="m-0">{text}</p>
                      <p className="m-0 text-[12px]">30.04.23</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <form
            onSubmit={(event) => event.preventDefault()}
            className="flex gap-3"
          >
            <Form.Control
              type="text"
              placeholder="Введите текст сообщения"
              className="flex-1"
            />
            <Button type="submit">Отправить</Button>
          </form>
        </div>
        <div className="w-[20%]">
          <p>Список сотрудников в чате:</p>
          <UserList members={currentChat.members} />
        </div>
      </section>
    </PageLayout>
  );
};

const UserList: FC<{ members: ChatModel["members"] }> = ({ members }) => {
  const { usersMap } = useUsersList();
  return (
    <ul className="pl-0">
      {members.map((memberID) => {
        const user = usersMap.get(memberID);
        return <li key={memberID}>{user?.userIdentify}</li>;
      })}
    </ul>
  );
};
