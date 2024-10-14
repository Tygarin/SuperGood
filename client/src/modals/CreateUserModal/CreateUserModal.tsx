import { useApi } from "api";
import { CreateUserModel, UserModel } from "api/responses";
import { Button, FieldGroup } from "components";
import { Roles } from "constant";
import { getErrorMessage, useIsAdmin } from "libs";
import { FC } from "react";
import { Form, Modal } from "react-bootstrap";
import { Field, Form as FinalForm } from "react-final-form";
import { useMutation, useQueryClient } from "react-query";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

interface CreateUserModelFormValues extends Omit<CreateUserModel, "roles"> {
  role: Roles;
  confirmationPassword: string;
}

export const CreateUserModal: FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { authApi } = useApi();
  const isAdmin = useIsAdmin();

  const isCreateUserModalOpen =
    searchParams.get("modal") === "createUser" && isAdmin;

  const closeModal = () => {
    searchParams.delete("modal");
    setSearchParams(searchParams);
  };

  const queryClient = useQueryClient();

  const { mutateAsync, isLoading, isError, error } = useMutation({
    mutationFn: authApi.registerUser,
    onSuccess: (newUser) => {
      queryClient.setQueriesData<UserModel[]>("usersList", (_previousData) => {
        const previousData = _previousData ?? [];
        return [...previousData, newUser];
      });
      closeModal();
      toast.success("Пользователь успешно добавлен!");
    },
  });

  const handleSubmit = (model: CreateUserModelFormValues) => {
    
    mutateAsync(model);
  };

  return (
    <Modal size="lg" centered show={isCreateUserModalOpen} onHide={closeModal}>
      <FinalForm<CreateUserModelFormValues>
        initialValues={{ role: Roles.user }}
        onSubmit={handleSubmit}
        validate={(values) => {
          if (values.password !== values.confirmationPassword)
            return {
              password: "Пароли не совпадают",
              confirmationPassword: "Пароли не совпадают",
            };
          return undefined;
        }}
        render={({ handleSubmit }) => {
          return (
            <Form onSubmit={handleSubmit}>
              <Modal.Header closeButton>
                <Modal.Title>Создание пользователя</Modal.Title>
              </Modal.Header>
              <Modal.Body className="grid grid-cols-2 gap-4">
                <FieldGroup
                  type="string"
                  name="name"
                  text="Имя пользователя:"
                />
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
