import { ReactNode } from "react";

const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <main>{children}</main>
    </div>
  );
};

export default AppLayout;
