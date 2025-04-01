"use server"

import axios from "axios"
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API_URL = 'http://localhost:3001'

export async function login(email: string, password: string) {
  try {
    const response = await axios.post(`${API_URL}/api/auth/login`, {email, password});

    const { token, refreshToken } = response.data;

    if(!token || !refreshToken) {
      return { error: 'Tokens não fornecidos pela API' };
    }

    const cookieStore = await cookies();

    cookieStore.set({
      name: 'auth-token',
      value: token,
      httpOnly: true,
      path: '/',
    });

    cookieStore.set({
      name: 'refresh-token',
      value: refreshToken,
      httpOnly: true,
      path: '/',
    });

    return {success: true};

  } catch (err) {
    console.error('Erro de autenticação:', err);
    let message = 'Erro ao fazer login';

    if(axios.isAxiosError(err) && err.response) {
      message = err.response.data.message || message;
    }

    return { error: message };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('auth-token');
  cookieStore.delete('refresh-token');
  redirect('/auth/login');
}

export async function refreshTokens() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refresh-token');

    if(!refreshToken) {
      redirect('/auth/login');
    }

    const response = await axios.post(`${API_URL}/api/auth/refresh`, {
      refresh: refreshToken.value
    });

    const { token: newToken, refreshToken: newRefreshToken } = response.data;

    if(!newToken) {
      await logout();
      return false;
    }

    cookieStore.set({
      name: 'auth-token',
      value: newToken,
      httpOnly: true,
      path: '/',
    });

    cookieStore.set({
      name: 'refresh-token',
      value: newRefreshToken,
      httpOnly: true,
      path: '/',
    });

    console.log(newToken);
    return true;

  } catch (error) {
    console.error('erro ao renovar tokens', error);
    await logout();
    return false;
  }
}