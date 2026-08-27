import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authService from '../../services/auth.service'

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await authService.login(credentials)
    const data = response.data.data
    localStorage.setItem('accessToken', data.accessToken)
    return data
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Login failed')
  }
})

export const register = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const response = await authService.register(userData)
    const data = response.data.data
    localStorage.setItem('accessToken', data.accessToken)
    return data
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Registration failed')
  }
})

export const checkAuth = createAsyncThunk('auth/checkAuth', async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('accessToken')
    if (!token) return null
    const response = await authService.getProfile()
    return { user: response.data.data, accessToken: token }
  } catch (error) {
    localStorage.removeItem('accessToken')
    return rejectWithValue(null)
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    accessToken: localStorage.getItem('accessToken') || null,
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null
      state.accessToken = null
      state.isAuthenticated = false
      localStorage.removeItem('accessToken')
      authService.logout()
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => { state.loading = true; state.error = null })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.accessToken = action.payload.accessToken
        state.isAuthenticated = true
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(register.pending, (state) => { state.loading = true; state.error = null })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.accessToken = action.payload.accessToken
        state.isAuthenticated = true
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload.user
          state.accessToken = action.payload.accessToken
          state.isAuthenticated = true
        }
      })
  },
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer