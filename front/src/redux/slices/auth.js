import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createUrl, getToken } from './base';
import axios from 'axios';

export const fetchAuth = createAsyncThunk('auth/fetchAuth', async (params) => {
  const { data } = await axios.post(createUrl('/auth/login'), params);
  return data;
});

export const fetchRegister = createAsyncThunk(
  'auth/fetchAuthMe',
  async (params) => {
    const { data } = await axios.post(createUrl('/auth/register'), params);
    return data;
  }
);

export const fetchAuthMe = createAsyncThunk(
  'auth/fetchAuthMe',
  async () => {
    const { data } = await axios.get(createUrl('/auth/me'), {
      headers: {
        'Authorization': 'Bearer ' + getToken()
      }
    });
    return data;
  }
);

export const fetchLogout = createAsyncThunk('auth/fetchLogout', async () => {
  const { data } = await axios.get(createUrl('/auth/logout'), {
    headers: {
      'Authorization': 'Bearer ' + getToken()
    }
  });
  return data;
});



const initialState = {
  data: null,
  status: 'loading',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},

  extraReducers: {
    [fetchAuth.pending]: (state) => {
      state.status = 'loading';
      state.data = null;
    },
    [fetchAuth.fulfilled]: (state, action) => {
      state.status = 'loaded';
      state.data = action.payload;
    },
    [fetchAuth.rejected]: (state) => {
      state.status = 'error';
      state.data = null;
    },
    [fetchAuthMe.pending]: (state) => {
      state.status = 'loading';
      state.data = null;
    },
    [fetchAuthMe.fulfilled]: (state, action) => {
      state.status = 'loaded';
      state.data = action.payload;
    },
    [fetchAuthMe.rejected]: (state) => {
      state.status = 'error';
      state.data = null;
    },
    [fetchRegister.pending]: (state) => {
      state.status = 'loading';
      state.data = null;
    },
    [fetchRegister.fulfilled]: (state, action) => {
      state.status = 'loaded';
      state.data = action.payload;
    },
    [fetchRegister.rejected]: (state) => {
      state.status = 'error';
      state.data = null;
    },
    [fetchLogout.pending]: (state) => {
      state.status = 'loading';
      state.data = null;
    },
    [fetchLogout.fulfilled]: (state, action) => {
      state.status = 'loaded';
      state.data = null;
    },
    [fetchLogout.rejected]: (state) => {
      state.status = 'error';
      state.data = null;
    },
  },
});

export const SelectIsAuth = (state) => Boolean(state.auth.data);
export const authReducer = authSlice.reducer;
export const { logout } = authSlice.actions;
