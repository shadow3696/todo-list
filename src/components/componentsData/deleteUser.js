import localforage from "localforage";

const openDeleteConfirmModal = async ({setIsDeleting, setFetchedUsers},row) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setIsDeleting(true);
      const users = await localforage.getItem('users');
      const updatedUsers = users.filter(user => user.id !== row.original.id);
      await localforage.setItem('users', updatedUsers);
      setFetchedUsers(updatedUsers);
      setIsDeleting(false);
    }
  };
  export default openDeleteConfirmModal