import { useMemo, useState, useCallback } from 'react';

import { QueryClient, QueryClientProvider, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { Box, Button, IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { fakeData, usStates } from './makeData';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';


const Table0 = () => {
  const [validationErrors, setValidationErrors] = useState({});
  const queryClient = useQueryClient();
  
  const schema = yup.object().shape({
    firstName: yup.string().required('اسمت رو باید بنویسی'),
    lastName: yup.string().required('فامیلیت اجباریه'),
    email: yup.string().email('ایمیل رو درست بنویس').required('ایمیل رئ باید بدی'),
    state: yup.string().nullable().optional(),
  });

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'Id',
        enableEditing: false,
        size: 80,
      },
      {
        accessorKey: 'firstName',
        header: 'First Name',
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.firstName,
          helperText: validationErrors?.firstName,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              firstName: undefined,
            }),
        },
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.lastName,
          helperText: validationErrors?.lastName,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              lastName: undefined,
            }),
        },
      },
      {
        accessorKey: 'email',
        header: 'Email',
        muiEditTextFieldProps: {
          type: 'email',
          required: true,
          error: !!validationErrors?.email,
          helperText: validationErrors?.email,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              email: undefined,
            }),
        },
      },
      {
        accessorKey: 'state',
        header: 'State',
        editVariant: 'select',
        editSelectOptions: usStates,
        muiEditTextFieldProps: {
          select: true,
          error: !!validationErrors?.state,
          helperText: validationErrors?.state,
        },
      },
    ],
    [validationErrors],
  );

  function useGetUsers() {
    return useQuery({
      queryKey: ['users'],
      queryFn: async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return Promise.resolve(fakeData);
      },
      refetchOnWindowFocus: false,
    });
  }

  const { mutateAsync: createUser, isPending: isCreatingUser } = useCreateUser();
  const {
    data: fetchedUsers = [],
    isError: isLoadingUsersError,
    isFetching: isFetchingUsers,
    isLoading: isLoadingUsers,
  } = useGetUsers();
  const { mutateAsync: updateUser, isPending: isUpdatingUser } = useUpdateUser();
  const { mutateAsync: deleteUser, isPending: isDeletingUser } = useDeleteUser();

  const handleCreateUser = async ({ values, table }) => {
    try {
      await schema.validate(values, { abortEarly: false });
      await createUser(values);
      table.setCreatingRow(null);
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

  const handleSaveUser = async ({ values, table }) => {
    try {
      await schema.validate(values, { abortEarly: false });
      await updateUser(values);
      table.setEditingRow(null);
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

  const openDeleteConfirmModal = (row) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUser(row.original.id);
    }
  };

  const renderRowActions = useCallback(
    ({ row, table }) => (
      <Box sx={{ display: 'flex', gap: '1rem'}}>
        <Tooltip title="Edit">
          <IconButton onClick={() => table.setEditingRow(row)}>
            <EditIcon/>
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton
            color="error"
            onClick={() => openDeleteConfirmModal(row)}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    []
  );

  const renderTopToolbarCustomActions = useCallback(
    ({ table }) => (
      <Button
        variant="contained"
        onClick={() => {
          table.setCreatingRow(true);
        }}
      >
        Create New User
      </Button>
    ),
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: fetchedUsers,
    createDisplayMode: 'row',
    editDisplayMode: 'row',
    enableEditing: true,
    getRowId: (row) => row.id,
    muiToolbarAlertBannerProps: isLoadingUsersError
      ? {
          color: 'error',
          children: 'Error loading data',
        }
      : undefined,
    muiTableContainerProps: {
      sx: {
        minHeight: '500px',
      },
    },
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateUser,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveUser,
    renderRowActions,
    renderTopToolbarCustomActions,
    state: {
      isLoading: isLoadingUsers,
      isSaving: isCreatingUser || isUpdatingUser || isDeletingUser,
      showAlertBanner: isLoadingUsersError,
      showProgressBars: isFetchingUsers,
    },
  });

  return (
    <MaterialReactTable table={table}>
      <form onSubmit={handleSubmit(handleCreateUser)}>
        <input {...register('firstName')} />
        {errors.firstName && <p>{errors.firstName.message}</p>}
      </form>
    </MaterialReactTable>
  );
};

function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (user) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return Promise.resolve();
    },
    onMutate: async (newUserInfo) => {
      try {
        await queryClient.cancelQueries(['users']);
        const previousUsers = queryClient.getQueryData(['users']);
        queryClient.setQueryData(['users'], (prevUsers) => [
          ...prevUsers,
          {
            ...newUserInfo,
            id: (Math.random() + 1).toString(36).substring(7),
          },
        ]);
      } catch (error) {
        const previousUsers = queryClient.getQueryData(['users']);
        queryClient.setQueryData(['users'], previousUsers);
        throw new Error('Failed to create user');
      }
    },
  });
}

function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (user) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return Promise.resolve();
    },
    onMutate: async (newUserInfo) => {
      try {
        const previousUsers = queryClient.getQueryData(['users']);
        queryClient.setQueryData(['users'], (prevUsers) =>
          prevUsers?.map((prevUser) =>
            prevUser.id === newUserInfo.id ? newUserInfo : prevUser
          )
        );
      } catch (error) {
        const previousUsers = queryClient.getQueryData(['users']);
        queryClient.setQueryData(['users'], previousUsers);
        throw new Error('Failed to update user');
      }
    },
  });
}

function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return Promise.resolve();
    },
    onMutate: async (userId) => {
      try {
        const previousUsers = queryClient.getQueryData(['users']);
        queryClient.setQueryData(['users'], (prevUsers) =>
          prevUsers?.filter((user) => user.id !== userId)
        );
      } catch (error) {
        const previousUsers = queryClient.getQueryData(['users']);
        queryClient.setQueryData(['users'], previousUsers);
        throw new Error('Failed to delete user');
      }
    },
  });
}

const queryClient = new QueryClient();

const Table0WithProviders = () => (
  <QueryClientProvider client={queryClient}>
    <Table0 />
  </QueryClientProvider>
);

export default Table0WithProviders;


