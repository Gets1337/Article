import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createUrl, getToken } from './base';
import axios from 'axios';

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async (params) => {
  const { data } = await axios.get(createUrl('/posts', params));
  return data;
});

export const fetchCreatePost = createAsyncThunk('posts/fetchCreatePost', async (params) => {
  const { data } = await axios.post(createUrl('/post'), params, {
    headers: {
      'Authorization': 'Bearer ' + getToken()
    }
  });
  return data;
});

export const fetchUploadImage = createAsyncThunk('posts/fetchUploadImage', async (image) => {
  const { data } = await axios.post(createUrl('/upload'), image, {
    headers: {
      'Authorization': 'Bearer ' + getToken()
    }
  });
  return data;
});

export const fetchRemovePost = createAsyncThunk('posts/fetchRemovePost', async (id) => {
  const { data } = await axios.delete(createUrl(`/posts/${id}`), {
    headers: {
      'Authorization': 'Bearer ' + getToken()
    }
  });
  return data;
});

const initialState = {
  posts: {
    items: [],
    status: 'loading',
  },
};

const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchPosts.pending]: (state) => {
      state.posts.items = [];
      state.posts.status = 'loading';
    },
    [fetchPosts.fulfilled]: (state, action) => {
      state.posts.items = action.payload;
      state.posts.status = 'loaded';
    },
    [fetchPosts.rejected]: (state) => {
      state.posts.items = [];
      state.posts.status = 'error';
    },

    [fetchRemovePost.pending]: (state, action) => {
      state.posts.items = state.posts.items.filter(obj => obj._id !== action.meta.arg);
    },
  },
});

export const postsReducer = postSlice.reducer;
