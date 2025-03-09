import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import { SelectIsAuth, fetchLogout } from '../../redux/slices/auth';
import styles from './Header.module.scss';
import Container from '@mui/material/Container';
import { useDispatch, useSelector } from 'react-redux';


export const Header = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector(SelectIsAuth);

  const onClickLogout = async () => {
    if (window.confirm('Вы уверены?')) {
      await dispatch(fetchLogout());
      window.localStorage.removeItem('token');
    }
  };

  return (
    <div className={styles.root}>
      <Container maxWidth="lg">
        <div className={styles.inner}>
          <div className={styles.buttons}>
            {isAuth ? (
              <>
                <Link to="/add-post">
                  <Button variant="contained">Написать статью</Button>
                </Link>
                <Button
                  onClick={onClickLogout}
                  variant="contained"
                  color="error"
                >
                  Выйти
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outlined">Войти</Button>
                </Link>
                <Link to="/register">
                  <Button variant="contained">Создать аккаунт</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};
