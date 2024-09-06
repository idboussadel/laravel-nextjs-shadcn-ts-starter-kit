"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/auth";
import React from "react";

const DashboardPage = () => {
  const { logout } = useAuth({});

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
          <div className="p-6 bg-white border-b border-gray-200">
            {`You're logged in!`}
            <Button onClick={logout}>Logout</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
