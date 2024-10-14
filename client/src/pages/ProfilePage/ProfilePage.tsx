import { useApi } from "api";
import { PageLayout } from "components";
import { FC } from "react";
import { Row, Image } from "react-bootstrap";
import { useQuery } from "react-query";
import { Navigate, useParams } from "react-router-dom";

export const ProfilePage: FC = () => {
  const { userID } = useParams();
  const { authApi } = useApi();
  const { data: currentUser } = useQuery({
    queryFn: async () => await authApi.getUserByID(`${userID}`),
    queryKey: ["user", userID],
  });

  if (!currentUser) return <Navigate to="/" />;

  return (
    <PageLayout title="Профиль">
      <Row>
        <Image src="./test.jpg" rounded />
      </Row>
    </PageLayout>
  );
};
