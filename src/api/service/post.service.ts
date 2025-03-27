"use server"

import { getAuthToken } from "../auth/utils";
import { Post } from "../model/post";
import axios from 'axios';

const BASE_API = "http://localhost:3001/api/posts";

export async function salvar(post: Post) {
   const headers = await getAuthToken();
   const { data } = await axios.post(`${BASE_API}`, post, { headers });
   return data;
}

export async function obterTodos(): Promise<Post[]> {
    const { data } = await axios.get(`${BASE_API}`);
    return data;
}

export async function obterPorSlug(slug: string): Promise<Post | null> {
   try {
        const { data } = await axios.get(`${BASE_API}/${slug}`);
        return data;
   } catch (error: any) {
        if(error.response?.status === 404) {
            return null;
        };

        throw new Error("Erro ao buscar post");
   }
}

export async function excluir(slug: string): Promise<void> {
    const headers = await getAuthToken();
    await axios.delete(`${BASE_API}/${slug}`, { headers });
}

export async function update(post: Post, slug: string): Promise<void> {
    const headers = await getAuthToken();
    await axios.patch(`${BASE_API}/${slug}`, post, { headers});
}

/* export async function salvar(post: Post) {
    const response = await fetch(`${BASE_API}`, {
        method: 'Post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(post),
    });

    return await response.json();
}

export async function obterTodos(): Promise<Post[]> {
    const response = await fetch(`${BASE_API}`);
    return await response.json();
}

export async function obterPorSlug(slug: string): Promise<Post> {
    const response = await fetch(`${BASE_API}/${slug}`);
    return await response.json();
}

export async function excluir(slug: string): Promise<void> {
   await fetch(`${BASE_API}/${slug}`, {
    method: 'DELETE',
   })
}

export async function update(post: Post): Promise<void> {
    await fetch(`${BASE_API}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(post),
    })
} */
