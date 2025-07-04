'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function loginAction(prevState: { message: string }, formData: FormData) {
  const password = formData.get('password');

  // This is a simple authentication for demonstration purposes.
  // In a real application, use a proper authentication library and hashed passwords.
  if (password === process.env.ADMIN_PASSWORD) {
    cookies().set('is_logged_in', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });
    redirect('/admin');
  } else {
    return { message: 'Invalid password.' };
  }
}
