import { Role, registrationUserFn } from "api";
import { Button, FieldGroup } from "components";
import { Roles } from "constant";
import { useCurrentUser } from "libs";
import { FC } from "react";
import { Form, Modal } from "react-bootstrap";
import { Field, Form as FinalForm } from "react-final-form";
import { useMutation } from "react-query";
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
  const isAdmin = userInfo?.roles.includes(Roles.admin);

  const isCreateUserModalOpen =
    searchParams.get("modal") === "createUser" && isAdmin;

  const closeModal = () => {
    searchParams.delete("modal");
    setSearchParams(searchParams);
  };

  const { mutateAsync, isLoading } = useMutation({
    mutationFn: (user: {
      userIdentify: string;
      password: string;
      role: Role;
    }) => registrationUserFn(user),
    onSuccess: ({ message }) => {
      closeModal();
      toast.success(message);
    },
  });

  const handleSubmit = (values: RegistrationFormValues) => {
    console.log(values);
  };

  return (
    <Modal size="lg" centered show={isCreateUserModalOpen} onHide={closeModal}>
      <FinalForm
        initialValues={{}}
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
                        id={Roles.user}
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
                {/* {isError && (
                  <p className="text-red-600 text-xs mt-2 mb-0">
                    {errorMessage}
                  </p>
                )} */}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={closeModal}>
                  Закрыть
                </Button>
                <Button variant="primary" type="submit">
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
