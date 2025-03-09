import Container from '@mui/material/Container';
import { Routes, Route } from 'react-router-dom';
import { useDispatch} from 'react-redux';
import React from 'react';
import { Header } from './components';
import { Home, FullPost, Registration, AddPost, Login } from './pages';
import { fetchAuthMe} from './redux/slices/auth';

function App() {
  const dispatch = useDispatch();

  React.useEffect(() => {
    const token = window.localStorage.getItem('token');
    if (token) {
      dispatch(fetchAuthMe(token));
    }
  }, [dispatch]);

  return (
    <>
      <Header />
      <Container maxWidth="lg">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts/:id" element={<FullPost />} />
          <Route path="/posts/:id/edit" element={<AddPost />} />
          <Route path="/add-post" element={<AddPost />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
