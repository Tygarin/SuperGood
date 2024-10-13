import { UploadAvatarModel, useApi } from "api";
import { PageLayout } from "components";
import { FC } from "react";
import { Row, Image, Button } from "react-bootstrap";
import { Field, Form } from "react-final-form";
import { useMutation, useQuery } from "react-query";
import { Navigate, useParams } from "react-router-dom";

export const ProfilePage: FC = () => {
  const { userID } = useParams();
  const { getUserByID, uploadAvatar } = useApi();
  const { data: currentUser } = useQuery({
    queryFn: async () => await getUserByID(`${userID}`),
    queryKey: ["user", userID],
  });

  const { mutateAsync } = useMutation({
    mutationFn: (data: UploadAvatarModel) => uploadAvatar(data),
    mutationKey: ["uploadAvatar", currentUser],
  });

  if (!currentUser) return <Navigate to="/" />;

  const url = `/${currentUser.avatar}`;
  console.log(url);

  return (
    <PageLayout title="Профиль">
      <Row>
        <Image src={"../../../../uploads/1728837461685.jpeg"} rounded />
        <Form
          initialValues={{}}
          onSubmit={(values) => {
            console.log(values.file);

            mutateAsync({
              userIdentify: currentUser.userIdentify,
              file: values.file,
            });
          }}
        >
          {({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <Field name="file">
                {({ input }) => (
                  <input
                    type="file"
                    id="image"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      input.onChange(file);
                    }}
                    required
                  />
                )}
              </Field>
              <Button type="submit">Сабмит!</Button>
            </form>
          )}
        </Form>
      </Row>
    </PageLayout>
  );
};
