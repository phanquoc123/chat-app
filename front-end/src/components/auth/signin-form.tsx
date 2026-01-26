import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/stores/useAuthStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@radix-ui/react-label";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";

const signInSchema = z.object({
  username: z.string().min(3, "Username is required"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export function SigninForm({ ...props }: React.ComponentProps<typeof Card>) {
  const {signIn} = useAuthStore();
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInFormValues) => {

    const { username, password } = data;
    await signIn(username,password);
    navigate('/');
  };

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>Enter your information below to sign in</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-3"
        >
          <div className="flex flex-col gap-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                {...register("username")}
                name="username"
                id="username"
                type="text"
                placeholder=""
              />
              {errors.username && <p className="text-sm text-red-500">{errors.username.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                {...register("password")}
                name="password"
                id="password"
                type="password"
                placeholder=""
              />
               {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>
          </div>

          <Button type="submit">Login</Button>
          <p>Don't have an account? </p>
          <a
            className="cursor-pointer text-blue-500 underline"
            href="/signup"
          >
            Sign Up
          </a>
        </form>
      </CardContent>
    </Card>
  );
}

