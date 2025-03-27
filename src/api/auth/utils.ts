"use server"
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";


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

export interface UserPayload {
  id: string;
  email: string;
  role: 'admin' | 'editor';
}