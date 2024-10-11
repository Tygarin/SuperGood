import { FC, useState } from "react";
import { Modal } from "react-bootstrap";
import { useConfirmationStore } from "stores";
import { Button } from "./Button";
import { getErrorMessage } from "libs";

export const ConfirmationContainer: FC = () => {
  const { isOpened, title, description, close, actionButtonText, onSubmit } =
    useConfirmationStore();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const onHide = () => {
    setError(null);
    close();
  };
  return (
    <Modal show={isOpened} centered onHide={onHide}>
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          setIsLoading(true);
          try {
            await onSubmit?.();
            onHide();
          } catch (error) {
            setError(getErrorMessage(error));
          }
          setIsLoading(false);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {description}
          {error && <p className="text-red-600 text-xs mt-2 mb-0">{error}</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Закрыть
          </Button>
          <Button isLoading={isLoading} variant="primary" type="submit">
            {actionButtonText}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};
