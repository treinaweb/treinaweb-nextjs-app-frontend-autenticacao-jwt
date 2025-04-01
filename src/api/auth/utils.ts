"use server"
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import axios from "axios";


export async function getAuthToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token');

  if(!token?.value) {
    redirect('/auth/login');
  }

  return {
    'Authorization':`Bearer ${token.value}`,
    'Content-Type': 'application/json',
    token: token.value
  }
}

export async function getUserFromToken(token: string): Promise<UserPayload | undefined | null> {
  try {
    if(!token) {
      return null;
    }
    return jwtDecode<UserPayload>(token);
  } catch (error) {
    console.error(error);
  }
}

export async function updateToken() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refresh-token');
    
    if (!refreshToken?.value) {
      redirect('/auth/login');
    }
    
    const response = await axios.post(`http:/localhost:3001/api/auth/refresh`, {
      refresh: refreshToken.value
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const { token, refreshToken: newRefreshToken } = response.data;
    
    // Update the auth token cookie with the new token
    (await
      // Update the auth token cookie with the new token
      cookies()).set('auth-token', token, {
      httpOnly: true,
      path: '/',
    });
    
    // Update the refresh token cookie
    (await
      // Update the refresh token cookie
      cookies()).set('refresh-token', newRefreshToken, {
      httpOnly: true,
      path: '/',
    });
    
    return token;
  } catch (error) {
    console.error('Token refresh failed:', error);
    redirect('/auth/login');
  }
}

export interface UserPayload {
  id: string;
  email: string;
  role: 'admin' | 'editor';
}