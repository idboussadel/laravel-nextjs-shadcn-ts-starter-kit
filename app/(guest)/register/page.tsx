"use client";

import { z } from "zod";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/auth";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const RegisterSchema = z.object({
  name: z.string().min(1, "The name field is required."),
  email: z
    .string()
    .email("Invalid email")
    .min(1, "The email field is required."),
  password: z.string().min(8, "The password field is required."),
  password_confirmation: z
    .string()
    .min(1, "Please confirm password.")
    .refine((val) => val === val, {
      message: "Your passwords do not match.",
      path: ["password_confirmation"],
    }),
});

type FormValues = z.infer<typeof RegisterSchema>;

const RegisterPage = () => {
  const { register } = useAuth({
    middleware: "guest",
    redirectIfAuthenticated: "/dashboard",
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
  });

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  const submitForm: SubmitHandler<FormValues> = async (values) => {
    try {
      console.log(values);
      await register(values);
      toast.success(
        "Registration successful! A verification email has been sent."
      );
      reset();
    } catch (error) {
      toast.error("An error occurred during registration.");
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={handleSubmit(submitForm)} className="space-y-4">
          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="John Doe" />
                </FormControl>
                {errors.name && (
                  <FormMessage>{errors.name.message}</FormMessage>
                )}
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} placeholder="m@example.com" />
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    {...field}
                    placeholder="************"
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
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    {...field}
                    placeholder="************"
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

          <div className="flex items-center justify-end mt-4">
            <Link
              href="/login"
              className="underline text-sm text-gray-600 hover:text-gray-900"
            >
              Already registered?
            </Link>

            <Button type="submit" className="ml-4" disabled={isSubmitting}>
              {isSubmitting ? "Registering..." : "Register"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default RegisterPage;
