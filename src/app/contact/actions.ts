'use server';

export async function contactAction(prevState: any, formData: FormData) {
  const name = formData.get('name');
  const email = formData.get('email');
  const message = formData.get('message');

  // In a real application, you would send an email here.
  // For this prototype, we'll just log it to the console.
  console.log('New Contact Form Submission:');
  console.log('  Name:', name);
  console.log('  Email:', email);
  console.log('  Message:', message);

  return {
    message: 'Thank you for your message! I will get back to you shortly.',
    success: true,
  };
}
