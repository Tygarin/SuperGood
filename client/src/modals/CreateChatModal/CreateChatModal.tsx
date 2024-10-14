import { FC } from "react";
import { useApi } from "api";
import { ChatModel, CreateChatModel } from "api/responses";
import { Button, FieldGroup } from "components";
import { getErrorMessage, useUsersList } from "libs";
import { Form, Modal } from "react-bootstrap";
import { Field, Form as FinalForm } from "react-final-form";
import { useMutation, useQueryClient } from "react-query";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

export const CreateChatModal: FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { chatApi } = useApi();
  const { users } = useUsersList();
  const isCreateChatModalOpen = searchParams.get("modal") === "createChat";

  const closeModal = () => {
    searchParams.delete("modal");
    setSearchParams(searchParams);
  };

  const queryClient = useQueryClient();

  const { mutateAsync, isLoading, isError, error } = useMutation({
    mutationFn: chatApi.createChat,
    onSuccess: (newChat) => {
      queryClient.setQueriesData<ChatModel[]>("getChats", (_previousData) => {
        const previousData = _previousData ?? [];
        return [...previousData, newChat];
      });
      closeModal();
      toast.success("Чат успешно добавлен!");
    },
  });

  const handleSubmit = (values: CreateChatModel) => {
    mutateAsync(values);
  };

  return (
    <Modal size="lg" centered show={isCreateChatModalOpen} onHide={closeModal}>
      <FinalForm<CreateChatModel>
        onSubmit={handleSubmit}
        render={({ handleSubmit }) => {
          return (
            <Form onSubmit={handleSubmit}>
              <Modal.Header closeButton>
                <Modal.Title>Создание чата</Modal.Title>
              </Modal.Header>
              <Modal.Body className="grid grid-cols-2 gap-4">
                <FieldGroup type="string" name="name" text="Название чата:" />
                <div>
                  Пользователи:
                  {users?.map((user) => (
                    <Field
                      key={user.userIdentify}
                      component="input"
                      type="checkbox"
                      value={user.userIdentify}
                      name="members"
                    >
                      {({ input }) => (
                        <Form.Check
                          id={user.userIdentify}
                          label={user.name}
                          {...input}
                          type="checkbox"
                        />
                      )}
                    </Field>
                  ))}
                </div>
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
                  Создать чат
                </Button>
              </Modal.Footer>
            </Form>
          );
        }}
      />
    </Modal>
  );
};
