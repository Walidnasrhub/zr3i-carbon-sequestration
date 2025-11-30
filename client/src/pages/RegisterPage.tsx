import { RegistrationFormWorking } from "@/components/RegistrationFormWorking";
import { useEffect } from "react";

export default function RegisterPage() {
  useEffect(() => {
    // Check if already logged in
    const token = localStorage.getItem("authToken");
    if (token) {
      window.location.href = "/dashboard";
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center p-4 py-8">
      <div className="w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Zr3i</h1>
          <p className="text-muted-foreground">Join the Carbon Sequestration Revolution</p>
        </div>

        <RegistrationFormWorking
          onSuccess={(token) => {
            console.log("Registration successful, token:", token);
          }}
        />
      </div>
    </div>
  );
}
