// react library
import * as React from 'react';

// mui components
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { LockOpenTwoTone } from '@mui/icons-material';

// form validation library
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';

const schema = yup
.object().shape({
    user: yup.string().min(3, 'کمتر از 3 نباشه').required('نام کاربری رو باید وارد کنی'),
    password: yup.string().max(10,'بیشتر از 10 نباشه').min(3, 'کمتر از 3 نباشه').matches(/^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$/,'عدد و حرف باید داشته باشه').required("بدون رمز نمیتونی واردشی"),
  }).required();

const defaultTheme = createTheme();

export default function SignIn({login, logout}) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();
  
  const onSubmit = data => {

    if (data.user === 'admin0021' && data.password === '1qaz') {
      localStorage.setItem("username", data.user)

      login();
      navigate('/Table');
    } else {
      logout();
      alert('نام کاربری یا رمز عبور نادرست است.');
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            backgroundColor: 'hsla(240,50%,50%, 0.1)',
            paddingX: 5,
            paddingY: 2,
            borderRadius: 10,
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: 1,
          }}
        >
          <Box sx={{ backgroundColor: '#80deea', paddingX: 8, paddingBottom: 2, borderRadius: 40, boxShadow: 2}}>
            <Avatar sx={{ padding: 2, margin: 2, backgroundColor: '#42a5f5', color: 'wheat', boxShadow: 1 }}>
              <LockOpenTwoTone />
            </Avatar>
            <Typography component="h1" variant="h5" sx={{ backgroundColor: '#0288d1', padding: 1, borderRadius: 50, color: 'wheat', textAlign: 'center', boxShadow: 1}}>
              ورود
            </Typography>
          </Box>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
            <TextField
              defaultValue={localStorage.getItem("username") ? localStorage.getItem("username") : null}
              {...register("user")}
              variant='filled'
              sx={{ marginBottom: '25px' }}
              placeholder='نامکاربری'
              margin="normal"
              required
              fullWidth
              id="user"
              label="نام کاربری"
              name="user"
              autoComplete="user"
              autoFocus
              error={!!errors.user}
              helperText={errors.user?.message}
            />
            <TextField
              {...register("password")}
              variant='filled'
              placeholder='رمز عبور'
              margin="normal"
              required
              fullWidth
              name="password"
              label="رمزعبور"
              type="password"
              id="password"
              autoComplete="current-password"
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ marginTop: 4, fontWeight: 'bold', fontSize: 20 }}
            >
              بزن تا وارد بشی
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
