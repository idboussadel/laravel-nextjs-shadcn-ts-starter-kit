"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useAuth } from "@/hooks/auth";
import AuthCard from "@/components/AuthCard";
import ApplicationLogo from "@/components/ApplicationLogo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import toast from "react-hot-toast";

const ForgotPasswordSchema = z.object({
  email: z
    .string()
    .email("Invalid email")
    .min(1, "The email field is required."),
  password: z.string().min(1, "The password field is required."),
  password_confirmation: z
    .string()
    .min(1, "Please confirm password.")
    .refine((val) => val === val, {
      message: "Your passwords do not match.",
      path: ["password_confirmation"],
    }),
});

type FormValues = z.infer<typeof ForgotPasswordSchema>;

const PasswordResetPage = () => {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<string>("");

  const { resetPassword } = useAuth({ middleware: "guest" });

  useEffect(() => {
    const email = searchParams.get("email");
    setStatus(email ?? "");
  }, [searchParams]);

  const form = useForm<FormValues>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: status,
      password: "",
      password_confirmation: "",
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  const submitForm: SubmitHandler<FormValues> = async (values) => {
    try {
      await resetPassword(values);
    } catch (error: Error | AxiosError | any) {
      if (axios.isAxiosError(error) && error.response?.status === 422) {
        toast.error(error.response?.data?.errors);
      } else {
        toast.error(error);
      }
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={handleSubmit(submitForm)} className="space-y-4">
          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="email">Email</FormLabel>
                <FormControl>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    {...field}
                    disabled
                  />
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
                <FormLabel htmlFor="password">Password</FormLabel>
                <FormControl>
                  <Input
                    id="password"
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
            name="password_confirmation"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="password_confirmation">
                  Confirm Password
                </FormLabel>
                <FormControl>
                  <Input
                    id="password_confirmation"
                    type="password"
                    placeholder="************"
                    {...field}
                  />
                </FormControl>
                {errors.password_confirmation && (
                  <FormMessage>
                    {errors.password_confirmation.message}
                  </FormMessage>
                )}
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default PasswordResetPage;
