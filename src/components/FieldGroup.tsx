import { FC } from "react";
import { Form } from "react-bootstrap";
import { Field } from "react-final-form";

export const FieldGroup: FC<{
  text: string;
  name: string;
  type: string;
}> = ({ text, name, ...rest }) => {
  return (
    <Field name={name}>
      {({ input, meta }) => (
        <Form.Group>
          <Form.Label>{text}</Form.Label>
          <Form.Control {...rest} {...input} />
          {meta.error && meta.touched && (
            <p className="text-red-600 text-xs mt-2 mb-0">{meta.error}</p>
          )}
        </Form.Group>
      )}
    </Field>
  );
};
