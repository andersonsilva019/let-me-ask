import { ValidationError } from 'yup'

type ErrorObject = {
  [field: string]: string[];
};

export function yupErrorValidate(err: ValidationError) {
  const object: ErrorObject = {};

  err.inner.forEach((field) => {
    if (field.path !== undefined) {
      object[field.path] = field.errors;
    }
  });

  return object;
}