"use client";

import { useState } from "react";
import { z } from "zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ForgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
});

type FormValues = z.infer<typeof ForgotPasswordSchema>;

const ForgotPasswordPage = () => {
  const [status, setStatus] = useState<string>("");

  const { forgotPassword } = useAuth({
    middleware: "guest",
    redirectIfAuthenticated: "/dashboard",
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(ForgotPasswordSchema),
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  const submitForm = async (values: FormValues): Promise<void> => {
    try {
      const response = await forgotPassword(values);
      setStatus(response.data.status);
    } catch (error) {
      setStatus("");
      toast.error("An error occurred while sending the password reset email.");
    }
  };

  return (
    <>
      <p className="mb-2 text-muted-foreground">
        Forgot your password? No problem. Just let us know your email address
        and we will email you a password reset link that will allow you to
        choose a new one.
      </p>
      <AuthSessionStatus className="mb-4" status={status} />
      <Form {...form}>
        <form onSubmit={handleSubmit(submitForm)} className="space-y-4">
          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Email ..." {...field} />
                </FormControl>
                {errors.email && (
                  <FormMessage>{errors.email.message}</FormMessage>
                )}
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Email Password Reset Link"}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default ForgotPasswordPage;
