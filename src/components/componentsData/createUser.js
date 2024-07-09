import localforage from "localforage";
import * as yup from 'yup';

const handleCreateUser = async ({ values, table, schema, setValidationErrors, setIsSaving, setFetchedUsers }) => {
    try {
      await schema.validate(values, { abortEarly: false });
      setIsSaving(true);
      const users = await localforage.getItem('users');
      const newUser = { ...values, id: (Math.random() + 1).toString(36).substring(7) };
      const updatedUsers = [...users, newUser];
      await localforage.setItem('users', updatedUsers);
      setFetchedUsers(updatedUsers);
      table.setCreatingRow(null);
      setIsSaving(false);
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const validationErrors = {};
        error.inner.forEach(err => {
          validationErrors[err.path] = err.message;
        });
        setValidationErrors(validationErrors);
      } else {
        console.error('Failed to create user:', error);
      }
    }
  };
  export default handleCreateUser;