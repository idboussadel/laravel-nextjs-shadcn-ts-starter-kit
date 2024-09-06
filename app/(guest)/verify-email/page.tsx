"use client";
import { useState } from "react";

import { useAuth } from "@/hooks/auth";
import { Button } from "@/components/ui/button";

const VerifyEmailPage = () => {
  const [status, setStatus] = useState<string>("");

  const { logout, resendEmailVerification } = useAuth({
    middleware: "auth",
    redirectIfAuthenticated: "/dashboard",
  });

  const onClickResend = () => {
    resendEmailVerification().then((response) =>
      setStatus(response.data.status)
    );
  };

  return (
    <>
      <div className="mb-4 text-sm text-gray-600">
        Thanks for signing up! Before getting started, could you verify your
        email address by clicking on the link we just emailed to you? If you
        didn&apos;t receive the email, we will gladly send you another.
      </div>

      {status === "verification-link-sent" && (
        <div className="mb-4 font-medium text-sm text-green-600">
          A new verification link has been sent to the email address you
          provided during registration.
        </div>
      )}

      <div className="mt-4 flex items-center justify-between">
        <Button onClick={onClickResend}>Resend Verification Email</Button>

        <button
          type="button"
          className="underline text-sm text-gray-600 hover:text-gray-900"
          onClick={logout}
        >
          Logout
        </button>
      </div>
    </>
  );
};

export default VerifyEmailPage;
