import { useApi } from "api";
import { Button, FieldGroup } from "components";
import { FC } from "react";
import { Form } from "react-bootstrap";
import { Form as FinalForm } from "react-final-form";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthContext } from "context";
import { getErrorMessage } from "libs";

interface AuthFormValues {
  userIdentify: string;
  password: string;
}

export const AuthPage: FC = () => {
  const initialValues = {
    userIdentify: undefined,
    password: undefined,
  };
  const { loginUserFn } = useApi();

  const { setToken } = useAuthContext();
  const navigate = useNavigate();

  const { mutateAsync, error, isError, isLoading } = useMutation({
    mutationFn: (user: { userIdentify: string; password: string }) =>
      loginUserFn(user),
    onSuccess: ({ token }) => {
      setToken(token);
      navigate("/");
      toast.success("Вы успешно вошли в систему!");
    },
  });

  const handleSubmit = (values: AuthFormValues) => {
    mutateAsync(values);
  };

  return (
    <>
      <h1 className="text-center text-[28px] font-semibold my-10">
        Авторизация
      </h1>
      <div className="w-[400px] min-h-[365px] rounded-2xl mx-auto border-solid border-black border p-10">
        <FinalForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          render={({ handleSubmit, valid }) => {
            return (
              <Form className="flex gap-3 flex-col" onSubmit={handleSubmit}>
                <FieldGroup
                  type="string"
                  name="userIdentify"
                  text="Идентификатор пользователя:"
                />
                <FieldGroup type="password" name="password" text="Пароль:" />
                <div>
                  <Button
                    disabled={!valid}
                    isLoading={isLoading}
                    type="submit"
                    className="mt-5 w-full"
                  >
                    Войти
                  </Button>
                  {isError && (
                    <p className="text-red-600 text-xs mt-2 mb-0">
                      {getErrorMessage(error)}
                    </p>
                  )}
                </div>
              </Form>
            );
          }}
          validate={({ userIdentify, password }) => {
            const errors: Partial<AuthFormValues> = {};
            if (
              !userIdentify ||
              userIdentify?.length < 3 ||
              userIdentify?.length > 20
            ) {
              errors.userIdentify =
                "Количество символов должно быть в диапозоне от 3 до 20";
            }
            if (!password || password?.length < 3 || password?.length > 20) {
              errors.password =
                "Количество символов должно быть в диапозоне от 3 до 20";
            }
            return errors;
          }}
        />
      </div>
    </>
  );
};
