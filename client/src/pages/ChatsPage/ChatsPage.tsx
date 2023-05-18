import { PageLayout } from "components";
import { FC } from "react";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";

export const ChatsPage: FC = () => {
  const chatList = [
    {
      id: "11547723",
      name: "Чат по закупке рубероида",
      createdDate: "18.05.23",
    },
    {
      id: "11757829",
      name: "Баня",
      createdDate: "18.05.23",
    },
    {
      id: "15727879",
      name: "Фролов и C.O.",
      createdDate: "18.05.23",
    },
  ];
  return (
    <PageLayout title="Чаты">
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Название</th>
            <th>Дата создания</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {chatList.map(({ id, name, createdDate }) => (
            <tr key={id}>
              <td>{id}</td>
              <td>{name}</td>
              <td>{createdDate}</td>
              <td>
                <Link to={id}>Открыть</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </PageLayout>
  );
};
