import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken } from "./api/auth/utils";

export async function middleware(request: NextRequest) {
  const token = (await cookies()).get('auth-token')?.value;
  const user = await getUserFromToken(token as string);

  if(!user) {
    const loginUrl = new URL(request.url);
    return NextResponse.redirect(`
        ${loginUrl.protocol}/${loginUrl.hostname}:${loginUrl.port}/auth/login
      `);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/posts/publish',
    '/posts/:slug/edit'
  ]
}