import React, { useState } from 'react';
import { SelectIsAuth } from '../../redux/slices/auth';
import { fetchAuth } from '../../redux/slices/auth';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { useForm } from 'react-hook-form';
import styles from './Login.module.scss';

export const Login = () => {
  const isAuth = useSelector(SelectIsAuth);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
  });

  const onSubmit = async (values) => {
    setIsLoading(true);
    try {
      const data = await dispatch(fetchAuth(values));

      if (data.error) {
        setError('email', {
          type: 'manual',
          message: 'Не удалось авторизоваться',
        });
        return;
      }

      if (data.payload && data.payload.token) {
        window.localStorage.setItem('token', data.payload.token);
      }
    } catch (error) {
      console.error('Ошибка при авторизации:', error);
      setError('email', {
        type: 'manual',
        message: 'Произошла ошибка. Попробуйте еще раз.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Вход в аккаунт
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          className={styles.field}
          label="E-Mail"
          error={Boolean(errors.email)}
          helperText={errors.email?.message}
          {...register('email', { required: 'Укажите почту' })}
          fullWidth
        />
        <TextField
          className={styles.field}
          label="Пароль"
          type="password"
          error={Boolean(errors.password)}
          helperText={errors.password?.message}
          {...register('password', { required: 'Укажите пароль' })}
          fullWidth
        />
        <Button
          type="submit"
          size="large"
          variant="contained"
          fullWidth
          disabled={!isValid || isLoading}
        >
          {isLoading ? 'Загрузка...' : 'Войти'}
        </Button>
      </form>
    </Paper>
  );
};
