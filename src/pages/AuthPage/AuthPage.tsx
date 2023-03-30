import { FC } from "react";
import { Form, Field } from "react-final-form";

export const AuthPage: FC = () => {
  const initialValues = {
    name: undefined,
    password: undefined,
  };
  const handleSubmit = () => {};
  return (
    <section>
      <h1 className="text-center text-xl my-10">Авторизация</h1>
      <div className="w-[400px] mx-auto border-solid border-black border p-10">
        <Form
          initialValues={initialValues}
          onSubmit={handleSubmit}
          render={({ handleSubmit }) => (
            <form className="flex gap-5 flex-col" onSubmit={handleSubmit}>
              <Field name="name" component="input" type="text" />
              <Field name="password" component="input" type="password" />
              <button>Войти</button>
            </form>
          )}
        />
      </div>
    </section>
  );
};
