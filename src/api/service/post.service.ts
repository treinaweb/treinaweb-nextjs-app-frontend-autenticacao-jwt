"use server"

import { refreshTokens } from "@/app/auth/login/actions";
import { getAuthToken } from "../auth/utils";
import { Post } from "../model/post";
import axios from 'axios';
import { redirect } from "next/navigation";

const BASE_API = "http://localhost:3001/api/posts";

export async function salvar(post: Post) {
    try {
        const headers = await getAuthToken();
        const { data } = await axios.post(`${BASE_API}`, post, { headers });
        return data;
    } catch (error) {
        try {
            await refreshTokens();
            const headers = await getAuthToken();
            const { data } = await axios.post(`${BASE_API}`, post, { headers });
            return data;
        } catch (error) {
            console.error(error);
            redirect('/auth/login');
        }
    }
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
 try {
    const headers = await getAuthToken();
    await axios.delete(`${BASE_API}/${slug}`, { headers });
 } catch (error) {
    try {
        await refreshTokens();
        const headers = await getAuthToken();
        await axios.delete(`${BASE_API}/${slug}`, { headers });
    } catch (error) {
        console.error(error);
        redirect('/auth/login');
    }
 }
}

export async function update(post: Post, slug: string): Promise<void> {
    try {
        const headers = await getAuthToken();
        await axios.patch(`${BASE_API}/${slug}`, post, { headers});
    } catch (error) {
        try {
            await refreshTokens();
            const headers = await getAuthToken();
            await axios.patch(`${BASE_API}/${slug}`, post, { headers});
        } catch (error) {
            console.error(error);
            redirect('/auth/login');
        }
    }
}