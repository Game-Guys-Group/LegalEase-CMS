import { useState } from 'react'
import { createLazyFileRoute } from '@tanstack/react-router'
import { useNavigate } from '@tanstack/react-router'

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link } from '@tanstack/react-router'
import { login } from '@/api-helper'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setHasError] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    setIsSubmitting(true);
    e.preventDefault()

    let do_login = async () => {
      setIsSubmitting(true)
      let auth = await login(email, password)

      if (auth) {
        localStorage.setItem("auth_key", auth)
        navigate({to:'/dashboard/dashboard'})
      } else {
        setHasError(true)
        setIsSubmitting(false)
      }
    }

    do_login()
  }


  return (
    <Card className="mt-16 mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Sign in to LegalEase</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (<div className='flex w-full items-center justify-center rounded-sm bg-destructive text-center p-2 my-4'>Invalid email or password</div>)}
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2 mb-6">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Link href="#" className="ml-auto inline-block text-sm underline">
                Forgot your password?
              </Link>
            </div>
            <Input id="password" type="password" onChange={e => setPassword(e.target.value)} required />
          </div>
          <Button type="submit" onClick={handleSubmit} className="w-full inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900">
            {isSubmitting ?
              (<div className="border-b-secondary-foreground h-5 w-5 animate-spin rounded-full border-2 border-t-primary-foreground"/>) : "Login" }
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link to="/create_account" className='underline'>
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export const Route = createLazyFileRoute('/login')({
  component: LoginForm
})
