import React from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';
import { useSelector, useDispatch} from 'react-redux';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';
import { SelectIsAuth } from '../../redux/slices/auth';
import { Navigate, useNavigate } from 'react-router-dom';
import {fetchUploadImage, fetchCreatePost, fetchUpdatePost} from '../../redux/slices/posts';

export const AddPost = () => {
  const {id} = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuth = useSelector(SelectIsAuth);
  const [isLoading, setLoading] = React.useState(false);
  const [text, setText] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [imageUrl, setImageUrl] = React.useState('');
  const inputFileRef = React.useRef(null);

  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData();
      formData.append('image', event.target.files[0]);
      const { url } = await dispatch(fetchUploadImage(formData)).unwrap();
      setImageUrl(url);
    } catch (err) {
      console.warn(err);
      alert('Ошибка загрузки файлов');
    }
  };


  const onClickRemoveImage = () => {
    setImageUrl('');
  };

  const onChange = React.useCallback((value) => {
    setText(value);
  }, []);

  const onSubmit = async () => {
    try {
      setLoading(true);
      const fields = {
        title,
        imageUrl,
        text
      };

      let postId;
      if (id) {
        const post = await dispatch(fetchUpdatePost({id, ...fields})).unwrap();
        postId = post.id;
      } else {
        const post = await dispatch(fetchCreatePost(fields)).unwrap();
        postId = post.id;
      }

      navigate(`/posts/${postId}`);
    } catch (err) {
      console.warn(err);
      alert('Ошибка при создании статьи');
    }
  };

React.useEffect(() => {
  if (id) {
    axios.get(`http://localhost:4444/posts/${id}`)
  .then(({data}) => {
    setTitle(data.title);
    setText(data.text);
    setImageUrl(data.imageUrl);
  }).catch((err) => {
    console.warn(err);
    alert('Ошибка при загрузке статьи');
  });
}
}, [id]);

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Введите текст...',
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    []
  );

  if (!window.localStorage.getItem('token') || !isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <Paper style={{ padding: 30 }}>
      <Button
        onClick={() => inputFileRef.current.click()}
        variant="outlined"
        size="large"
      >
        Загрузить превью
      </Button>
      <input
        ref={inputFileRef}
        type="file"
        onChange={handleChangeFile}
        hidden
      />
      {imageUrl && (
        <>
          <Button
            variant="contained"
            color="error"
            onClick={onClickRemoveImage}
          >
            Удалить
          </Button>
          <img src={`http://localhost:4444${imageUrl}`} alt="Uploaded" />

        </>
      )}
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Заголовок статьи..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
      />
      <SimpleMDE
        className={styles.editor}
        value={text}
        onChange={onChange}
        options={options}
      />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          Опубликовать
        </Button>
        <a href="/">
          <Button size="large">Отмена</Button>
        </a>
      </div>
    </Paper>
  );
};
