import { Role, useApi } from "api";
import { User } from "api/responses";
import { Button, FieldGroup } from "components";
import { Roles } from "constant";
import { getErrorMessage, useCurrentUser } from "libs";
import { FC } from "react";
import { Form, Modal } from "react-bootstrap";
import { Field, Form as FinalForm } from "react-final-form";
import { useMutation, useQueryClient } from "react-query";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

interface RegistrationFormValues {
  userIdentify: string;
  password: string;
  confirmationPassword: string;
  role: Role;
}

export const CreateUserModal: FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { userInfo } = useCurrentUser();
  const { registrationUserFn } = useApi();
  const isAdmin = userInfo?.roles.includes(Roles.admin);

  const isCreateUserModalOpen =
    searchParams.get("modal") === "createUser" && isAdmin;

  const closeModal = () => {
    searchParams.delete("modal");
    setSearchParams(searchParams);
  };

  const queryClient = useQueryClient();

  const { mutateAsync, isLoading, isError, error } = useMutation({
    mutationFn: (user: {
      userIdentify: string;
      password: string;
      role: Role;
    }) => registrationUserFn(user),
    onSuccess: (newUser) => {
      queryClient.setQueriesData<User[]>("usersList", (_previousData) => {
        const previousData = _previousData ?? [];
        return [...previousData, newUser];
      });
      closeModal();
      toast.success("Пользователь успешно добавлен!");
    },
  });

  const handleSubmit = (values: RegistrationFormValues) => {
    mutateAsync(values);
  };

  return (
    <Modal size="lg" centered show={isCreateUserModalOpen} onHide={closeModal}>
      <FinalForm
        initialValues={{ role: Roles.user }}
        onSubmit={handleSubmit}
        render={({ handleSubmit }) => {
          return (
            <Form onSubmit={handleSubmit}>
              <Modal.Header closeButton>
                <Modal.Title>Создание пользователя</Modal.Title>
              </Modal.Header>
              <Modal.Body className="grid grid-cols-2 gap-4">
                <FieldGroup
                  type="string"
                  name="userIdentify"
                  text="Идентификатор пользователя:"
                />
                <FieldGroup type="password" name="password" text="Пароль:" />
                <div>
                  Роли:
                  <Field
                    component="input"
                    type="radio"
                    value={Roles.user}
                    name="role"
                  >
                    {({ input }) => (
                      <Form.Check
                        id={Roles.user}
                        label={"Пользователь"}
                        {...input}
                        type={"radio"}
                      />
                    )}
                  </Field>
                  <Field
                    component="input"
                    type="radio"
                    value={Roles.admin}
                    name="role"
                  >
                    {({ input }) => (
                      <Form.Check
                        id={Roles.admin}
                        label={"Админ"}
                        {...input}
                        type={"radio"}
                      />
                    )}
                  </Field>
                </div>
                <FieldGroup
                  type="password"
                  name="confirmationPassword"
                  text="Подтвердите пароль:"
                />
                {isError && (
                  <p className="text-red-600 text-xs mt-2 mb-0">
                    {getErrorMessage(error)}
                  </p>
                )}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={closeModal}>
                  Закрыть
                </Button>
                <Button isLoading={isLoading} variant="primary" type="submit">
                  Создать пользователя
                </Button>
              </Modal.Footer>
            </Form>
          );
        }}
      />
    </Modal>
  );
};
