import localforage from "localforage";
import * as yup from 'yup';

const handleSaveUser = async ({ values, table, schema, setIsSaving, setFetchedUsers, setValidationErrors}) => {
    try {
      await schema.validate(values, { abortEarly: false });
      setIsSaving(true);
      const users = await localforage.getItem('users');
      const updatedUsers = users.map(user =>
        user.id === values.id ? values : user
      );
      await localforage.setItem('users', updatedUsers);
      setFetchedUsers(updatedUsers);
      table.setEditingRow(null);
      setIsSaving(false);
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const validationErrors = {};
        error.inner.forEach(err => {
          validationErrors[err.path] = err.message;
        });
        setValidationErrors(validationErrors);
      } else {
        console.error('Failed to update user:', error);
      }
    }
  };
  export default handleSaveUser