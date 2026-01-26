import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@radix-ui/react-label"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod" 
import { useAuthStore } from '@/stores/useAuthStore'
import { useNavigate } from "react-router-dom"

const signUpSchema = z.object({
  firstname:z.string().min(1, 'First name is required'),
  lastname:z.string().min(1, 'Last name is required'),
  username:z.string().min(3, 'Username is required'),
  email:z.string().email('Invalid email'),
  password:z.string().min(8, 'Password must be at least 8 characters long'),
})

type SignUpFormValues = z.infer<typeof signUpSchema>;

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const{signUp} = useAuthStore();
  const navigate = useNavigate();

 const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignUpFormValues>({
resolver: zodResolver(signUpSchema)
 })

 

 const onsubmit = async (data: SignUpFormValues) => {
   const {firstname, lastname, username, email, password} = data;
   await signUp(firstname, lastname, username, email, password);
   navigate('/signin');
 }

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-3" onSubmit={handleSubmit(onsubmit)}>
        <div className="flex flex-col gap-6">
          <div className="space-y-2">
            <Label htmlFor="firstname">First Name</Label>
            <Input {...register("firstname")} name="firstname" id="firstname" type="text" placeholder="" />
            {
              errors.firstname && <p className="text-sm text-red-500">{errors.firstname.message}</p>
            }
          </div>
           <div className="space-y-2">
            <Label htmlFor="lastname">Last name</Label>
            <Input {...register("lastname")} name="lastname" id="lastname" type="text" placeholder="" />
            {
              errors.lastname && <p className="text-sm text-red-500">{errors.lastname.message}</p>
            }
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input {...register("username")} name="username" id="username" type="text" placeholder="" />
            {
              errors.username && <p className="text-sm text-red-500">{errors.username.message}</p>
            }
          </div>
           <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input {...register("email")} name="email" id="email" type="email" placeholder="" />
            {
              errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>
            }
          </div>
           <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input {...register("password")} name="password" id="password" type="password" placeholder="" />
            {
              errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>
            }
          </div>

        </div>
         
         <div className="space-y-2">
         <Button type="submit">Create Account</Button>
          <p>Already have an account? </p>
          <a className="cursor-pointer text-blue-500 underline" href="/signin">Sign In</a>
         </div>
         
        </form>
      </CardContent>
    </Card>
  )
}
