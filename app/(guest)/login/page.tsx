"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/hooks/auth";
import AuthSessionStatus from "@/components/AuthSessionStatus";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

const LoginSchema = z.object({
  email: z
    .string()
    .email("Invalid email")
    .min(1, "The email field is required."),
  password: z.string().min(1, "The password field is required."),
  remember: z.boolean(),
});

type FormValues = z.infer<typeof LoginSchema>;

const LoginPage = () => {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<string>("");

  const { login } = useAuth({
    middleware: "guest",
    redirectIfAuthenticated: "/dashboard",
  });

  useEffect(() => {
    const resetToken = searchParams.get("reset");
    setStatus(resetToken ? atob(resetToken) : "");
  }, [searchParams]);

  const form = useForm<FormValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  const submitForm: SubmitHandler<FormValues> = async (values) => {
    try {
      console.log(values);
      await login(values);
    } catch (error) {
      toast.error("An error occurred while logging in.");
    }
  };

  return (
    <>
      <AuthSessionStatus status={status} />

      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Login</h1>
        <p className="text-muted-foreground">
          Enter your email below to login to your account
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={handleSubmit(submitForm)} className="space-y-4">
          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="m@example.com" {...field} />
                </FormControl>
                {errors.email && (
                  <FormMessage>{errors.email.message}</FormMessage>
                )}
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center">
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <Link
                    href="/forgot-password"
                    className="ml-auto inline-block text-sm underline"
                  >
                    Forgot your password?
                  </Link>
                </div>{" "}
                <FormControl>
                  <Input
                    type="password"
                    placeholder="************"
                    {...field}
                  />
                </FormControl>
                {errors.password && (
                  <FormMessage>{errors.password.message}</FormMessage>
                )}
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="remember"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(checked)}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Remember me</FormLabel>
                </div>
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default LoginPage;
