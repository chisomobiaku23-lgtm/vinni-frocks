import { cookies } from 'next/headers'

const COOKIE_NAME = 'nova_admin'

export async function GET() {
  const authenticated = cookies().get(COOKIE_NAME)?.value === '1'
  return Response.json({ authenticated })
}

export async function POST(request) {
  const { password } = await request.json().catch(() => ({}))
  const expected = process.env.ADMIN_PASSWORD

  if (!expected) {
    return Response.json({ error: 'Admin password is not configured on the server.' }, { status: 500 })
  }

  if (password && password === expected) {
    cookies().set(COOKIE_NAME, '1', {
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    })
    return Response.json({ ok: true })
  }

  return Response.json({ error: 'Incorrect password' }, { status: 401 })
}

export async function DELETE() {
  cookies().set(COOKIE_NAME, '', { path: '/', maxAge: 0 })
  return Response.json({ ok: true })
}
