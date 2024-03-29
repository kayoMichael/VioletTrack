"use client";

import { useState } from "react";
import z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/ui/icons";

import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";

export const logInSchema = z.object({
  email: z.string().email("メールアドレスが無効です。"),
  password: z
    .string()
    .min(6, "パスワードが間違っています。再度お試しください。"),
});

type logInType = z.infer<typeof logInSchema>;

export function UserLogInForm() {
  const [error, setError] = useState<String | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<logInType>({
    resolver: zodResolver(logInSchema),
  });
  const onSubmit: SubmitHandler<logInType> = async (formData) => {
    setLoading(true);
    await signIn("credentials", {
      username: formData.email,
      password: formData.password,
      redirect: false,
    }).then((result) => {
      if (!result?.ok) {
        router.refresh();
        setError("Password or Email is incorrect. Please try again.");
      } else {
        router.push("/tickets");
      }
    });
    setLoading(false);
  };
  return (
    <div className="grid gap-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              className={error ? "border-red-400" : ""}
              {...register("email")}
              required
            />
            <Input
              id="Password"
              placeholder="Password"
              type="password"
              autoCapitalize="none"
              autoCorrect="off"
              className={error ? "border-red-400" : ""}
              {...register("password")}
              required
            />
            {error && <p className="text-red-400 text-sm">{error}</p>}
          </div>
          <Button type="submit">
            {loading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            Log In with Credentials
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button
        variant="outline"
        type="button"
        className="mt-0"
        onClick={() => signIn("google", { callbackUrl: "/tickets" })}
      >
        <Icons.google className="mr-2 h-4 w-4" />
        Google
      </Button>
    </div>
  );
}
