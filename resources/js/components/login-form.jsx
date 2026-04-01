import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from '@inertiajs/react'

export function LoginForm() {

  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: ''
  })

  function submit(e) {
    e.preventDefault()
    post('/') // change to your login route
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-6">

      {/* HEADER */}
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email and password below to login to your account
        </p>
      </div>

      {/* FORM */}
      <div className="grid gap-6">

        {/* EMAIL */}
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            value={data.email}
            onChange={(e) => setData('email', e.target.value)}
            required
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email}</p>
          )}
        </div>

        {/* PASSWORD */}
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={data.password}
            onChange={(e) => setData('password', e.target.value)}
            required
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password}</p>
          )}
        </div>

        {/* BUTTON */}
        <Button type="submit" className="w-full" disabled={processing}>
          {processing ? "Logging in..." : "Login"}
        </Button>

      </div>
    </form>
  )
}