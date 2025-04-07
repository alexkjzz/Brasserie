// src/middleware.ts
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
if (process.env.NODE_ENV === 'development') {
    // En développement, on laisse passer toutes les requêtes sans vérifier les tokens
    return NextResponse.next()
}

  // Code de production (vérification de token, etc.)
const token = req.cookies.get('token')?.value
if (!token && req.nextUrl.pathname.startsWith('/dashboard')) {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
}

return NextResponse.next()
}
