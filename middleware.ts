// middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // 这里是关键：同步请求和响应中的 Cookie
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 必须调用 getUser() 来验证并刷新 Session
  const { data: { user } } = await supabase.auth.getUser()
    // 判定：如果没登录且访问 checkout
    if (!user && request.nextUrl.pathname.startsWith('/order')) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      // 记得在重定向时也带上 supabaseResponse 的 Cookie 状态
      return NextResponse.redirect(url)
    }

  // 判定：如果没登录且访问 checkout
  if (!user && request.nextUrl.pathname.startsWith('/checkout')) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    // 记得在重定向时也带上 supabaseResponse 的 Cookie 状态
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}