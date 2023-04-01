import { Button, FieldGroup } from "components";
import { FC } from "react";
import { Form } from "react-bootstrap";
import { Form as FinalForm } from "react-final-form";

interface AuthFormValues {
  name: string;
  password: string;
}

export const AuthPage: FC = () => {
  const initialValues = {
    name: undefined,
    password: undefined,
  };

  const handleSubmit = (values: AuthFormValues) => {
    console.log(values);
  };

  return (
    <>
      <h1 className="text-center text-xl my-10">Авторизация</h1>
      <div className="w-[400px] rounded-2xl mx-auto border-solid border-black border p-10">
        <FinalForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          render={({ handleSubmit }) => (
            <Form className="flex gap-3 flex-col" onSubmit={handleSubmit}>
              <FieldGroup
                type="string"
                name="name"
                text="Идентификатор пользователя:"
              />
              <FieldGroup type="password" name="password" text="Пароль:" />
              <Button type="submit" className="mt-5">
                Войти
              </Button>
            </Form>
          )}
          validate={({ name, password }) => {
            const errors: Partial<AuthFormValues> = {};
            if (!name || name?.length < 5 || name?.length > 20) {
              errors.name =
                "Количество символов должно быть в диапозоне от 5 до 20";
            }
            if (!password || password?.length < 5 || password?.length > 20) {
              errors.password =
                "Количество символов должно быть в диапозоне от 5 до 20";
            }
            return errors;
          }}
        />
      </div>
    </>
  );
};
