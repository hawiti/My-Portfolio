'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, Send } from 'lucide-react';
import Link from 'next/link';
import { contactAction } from './actions';

const initialState = {
  message: '',
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" aria-disabled={pending}>
      {pending ? 'Sending...' : <><Send className="mr-2" /> Send Message</>}
    </Button>
  );
}

function Header() {
  return (
    <div className="dark">
        <header className="bg-background/70 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
            <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-primary rounded-full group-hover:scale-110 transition-transform" />
            <span className="font-bold text-xl text-foreground">VerdantView</span>
            </Link>
            <div className="flex items-center gap-4">
            <nav className="hidden md:flex gap-6 text-sm font-medium">
                <Link href="/#about" className="text-muted-foreground hover:text-primary transition-colors">About</Link>
                <Link href="/#projects" className="text-muted-foreground hover:text-primary transition-colors">Projects</Link>
                <Link href="/#experience" className="text-muted-foreground hover:text-primary transition-colors">Experience</Link>
                <Link href="/#education" className="text-muted-foreground hover:text-primary transition-colors">Education</Link>
                <Link href="/contact" className="text-primary hover:text-primary transition-colors">Contact</Link>
            </nav>
            </div>
        </div>
        </header>
    </div>
  );
}

export default function ContactPage() {
  const [state, formAction] = useActionState(contactAction, initialState);

  return (
    <div className="bg-background text-foreground min-h-screen">
      <Header />
      <main className="container mx-auto px-4 md:px-6 py-12">
        <div className="flex items-center justify-center">
          <Card className="w-full max-w-2xl bg-card">
            <CardHeader>
              <CardTitle className="text-3xl">Contact Me</CardTitle>
              <CardDescription>
                Have a question or want to work together? Fill out the form below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {state.success ? (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>Message Sent!</AlertTitle>
                  <AlertDescription>
                    {state.message}
                  </AlertDescription>
                </Alert>
              ) : (
                <form action={formAction} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" name="name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" name="message" required rows={6} />
                  </div>
                  <SubmitButton />
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
