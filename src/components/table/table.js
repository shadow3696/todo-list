import { useMemo, useState, useCallback, useEffect } from 'react';

import localforage from 'localforage';

import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { Box, Button, IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { fakeData, usStates } from '../../data/makeData';

import '../../css/style.css';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import openDeleteConfirmModal from '../componentsData/deleteUser'
import handleCreateUser from '../componentsData/createUser'
import handleSaveUser from '../componentsData/updateUser'

const Table0 = () => {
  const [validationErrors, setValidationErrors] = useState({});
  const [fetchedUsers, setFetchedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const schema = yup.object().shape({
    firstName: yup.string().required('اسمت رو باید بنویسی'),
    lastName: yup.string().required('فامیلیت اجباریه'),
    email: yup.string().email('ایمیل رو درست بنویس').required('ایمیل رئ باید بدی'),
    state: yup.string().nullable().optional(),
  });

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      const users = await localforage.getItem('users');
      if (users) {
        setFetchedUsers(users);
      } else {
        await localforage.setItem('users', fakeData);
        setFetchedUsers(fakeData);
      }
      setIsLoading(false);
    };
    fetchUsers();
  }, []);

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




  <>
  <handleCreateUser schema={schema} setValidationErrors={setValidationErrors} setIsSaving={setIsSaving} setFetchedUsers={setFetchedUsers} />

  <handleSaveUser schema={schema} setIsSaving={setIsSaving} setFetchedUsers={setFetchedUsers} setValidationErrors={setValidationErrors} />

  <openDeleteConfirmModal setIsDeleting={setIsDeleting} setFetchedUsers={setFetchedUsers}/>
  </>

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
    muiToolbarAlertBannerProps: !isLoading
      ? undefined
      : {
          color: 'info',
          children: 'Loading data...',
        },
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
      isLoading,
      isSaving,
      isDeleting,
      showProgressBars: isLoading || isSaving || isDeleting,
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

export default Table0;