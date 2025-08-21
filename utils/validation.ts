import * as Yup from 'yup';
import { validateEmail } from './emailValidator';

export const emailValidation = Yup.string()
  .required('Email field cannot be empty')
  .test('is-valid-email', 'Please enter a valid email address', async value => {
    if (!value) return false;
    try {
      return await validateEmail(value);
    } catch {
      return false;
    }
  });

export const phoneValidation = Yup.string().matches(
  /^\+?[0-9()\-\s]{6,20}$/,
  'Invalid phone',
);

export const passwordValidation = Yup.string().required(
  'Password field cannot be empty',
);

export const adminPassValidation = Yup.string()
  .required('Password field cannot be empty')
  .min(8, 'Password must be at least 8 characters long')
  .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .matches(/\d/, 'Password must contain at least one number')
  .matches(
    /[@$!%*?&.,;:()[\]{}^#\-_=+\\|/~`]/,
    'Password must contain at least one special character',
  )
  .matches(
    /^[^А-Яа-яЁёЇїІіЄєҐґ]*$/,
    'Password must not contain Cyrillic letters',
  )
  .matches(/^\S*$/, 'Password must not contain spaces');

export const adminRole = Yup.string().required('Role field cannot be empty');

export const nameValidation = Yup.string()
  .required('Name field cannot be empty')
  .min(2, 'Invalid name')
  .matches(/^[^\d!@#$%^&*()_+={}[\]:;"<>,.?/~|]+$/, 'Invalid name');
