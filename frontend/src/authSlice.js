
// import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// import axiosClient from './utils/axiosClient'

// export const registerUser = createAsyncThunk(
//   'auth/register',
//   async (userData, { rejectWithValue }) => {
//     try {
//     const response =  await axiosClient.post('/user/register', userData);
//     return response.data.user;
//     } catch (error) {
//       return rejectWithValue(error);
//     }
//   }
// );


// export const loginUser = createAsyncThunk(
//   'auth/login',
//   async (credentials, { rejectWithValue }) => {
//     try {
//       const response = await axiosClient.post('/user/login', credentials);
//       return response.data.user;
//     } catch (error) {
//       return rejectWithValue(error);
//     }
//   }
// );

// export const checkAuth = createAsyncThunk(
//   'auth/check',
//   async (_, { rejectWithValue }) => {
//     try {
//       const { data } = await axiosClient.get('/user/check');
//       return data.user;
//     } catch (error) {
//       return rejectWithValue(error);
//     }
//   }
// );

// export const logoutUser = createAsyncThunk(
//   'auth/logout',
//   async (_, { rejectWithValue }) => {
//     try {
//       await axiosClient.post('/user/logout');
//       return null;
//     } catch (error) {
//       return rejectWithValue(error);
//     }
//   }
// );

// const authSlice = createSlice({
//   name: 'auth',
//   initialState: {
//     user: null,
//     isAuthenticated: false,
//     loading: false,
//     error: null
//   },
//   reducers: {
//   },
//   extraReducers: (builder) => {
//     builder
//       // Register User Cases
//       .addCase(registerUser.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(registerUser.fulfilled, (state, action) => {
//         state.loading = false;
//         state.isAuthenticated = !!action.payload;
//         state.user = action.payload;
//       })
//       .addCase(registerUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload?.message || 'Something went wrong';
//         state.isAuthenticated = false;
//         state.user = null;
//       })
  
//       // Login User Cases
//       .addCase(loginUser.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(loginUser.fulfilled, (state, action) => {
//         state.loading = false;
//         state.isAuthenticated = !!action.payload;
//         state.user = action.payload;
//       })
//       .addCase(loginUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload?.message || 'Something went wrong';
//         state.isAuthenticated = false;
//         state.user = null;
//       })
  
//       // Check Auth Cases
//       .addCase(checkAuth.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(checkAuth.fulfilled, (state, action) => {
//         state.loading = false;
//         state.isAuthenticated = !!action.payload;
//         state.user = action.payload;
//       })
//       .addCase(checkAuth.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload?.message || 'Something went wrong';
//         state.isAuthenticated = false;
//         state.user = null;
//       })
  
//       // Logout User Cases
//       .addCase(logoutUser.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(logoutUser.fulfilled, (state) => {
//         state.loading = false;
//         state.user = null;
//         state.isAuthenticated = false;
//         state.error = null;
//       })
//       .addCase(logoutUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload?.message || 'Something went wrong';
//         state.isAuthenticated = false;
//         state.user = null;
//       });
//   }
// });

// export default authSlice.reducer;

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosClient from './utils/axiosClient';

// ================= AUTH THUNKS =================

// Register
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/auth/register', userData);
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data || error);
    }
  }
);

// Login
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/auth/login', credentials);
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data || error);
    }
  }
);

// Check Auth
export const checkAuth = createAsyncThunk(
  'auth/check',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.get('/auth/check');
      return data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data || error);
    }
  }
);

// Logout
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await axiosClient.post('/auth/logout');
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data || error);
    }
  }
);

// ================= NEW FEATURES =================

// Change Password
export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosClient.post('/user/change-password', data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error);
    }
  }
);

// Upload Profile Image
export const uploadProfileImage = createAsyncThunk(
  'auth/uploadProfileImage',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axiosClient.post('/user/upload-profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error);
    }
  }
);

// ================= SLICE =================

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null
  },
  reducers: {},

  extraReducers: (builder) => {
    builder

      // ================= REGISTER =================
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = !!action.payload;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Register failed';
        state.isAuthenticated = false;
        state.user = null;
      })

      // ================= LOGIN =================
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = !!action.payload;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Login failed';
        state.isAuthenticated = false;
        state.user = null;
      })

      // ================= CHECK AUTH =================
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = !!action.payload;
        state.user = action.payload;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Auth check failed';
        state.isAuthenticated = false;
        state.user = null;
      })

      // ================= LOGOUT =================
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Logout failed';
        state.isAuthenticated = false;
        state.user = null;
      })

      // ================= CHANGE PASSWORD =================
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Password change failed';
      })

      // ================= UPLOAD PROFILE IMAGE =================
      .addCase(uploadProfileImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadProfileImage.fulfilled, (state, action) => {
        state.loading = false;
        if (state.user) {
          state.user.profileImage = action.payload.imageUrl;
        }
      })
      .addCase(uploadProfileImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Image upload failed';
      });
  }
});

export default authSlice.reducer;