import { LoginFormWorking } from "@/components/LoginFormWorking";
import { useEffect } from "react";

export default function LoginPage() {
  useEffect(() => {
    // Check if already logged in
    const token = localStorage.getItem("authToken");
    if (token) {
      window.location.href = "/dashboard";
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center p-4">
      <div className="w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Zr3i</h1>
          <p className="text-muted-foreground">Carbon Sequestration Platform</p>
        </div>

        <LoginFormWorking
          onSuccess={(token) => {
            console.log("Login successful, token:", token);
          }}
        />
      </div>
    </div>
  );
}
