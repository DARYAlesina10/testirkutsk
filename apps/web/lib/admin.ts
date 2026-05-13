import { cookies } from 'next/headers';

export async function requireAdmin() {
  const role = (await cookies()).get('role')?.value ?? process.env.DEFAULT_DEV_ROLE ?? 'ADMIN';
  return role === 'ADMIN';
}
