import { loginUserFn } from "api";
import { Button, FieldGroup, useAuthContext } from "components";
import { FC, useMemo } from "react";
import { Form } from "react-bootstrap";
import { Form as FinalForm } from "react-final-form";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import { toast } from "react-toastify";

interface AuthFormValues {
  userIdentify: string;
  password: string;
}

export const AuthPage: FC = () => {
  const initialValues = {
    userIdentify: undefined,
    password: undefined,
  };

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

  const errorMessage = useMemo(() => {
    if (error && isAxiosError(error) && error.response) {
      return error.response.data.message;
    }
    return "Ошибка сервера";
  }, [error]);

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
                      {errorMessage}
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
              userIdentify?.length < 5 ||
              userIdentify?.length > 20
            ) {
              errors.userIdentify =
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
