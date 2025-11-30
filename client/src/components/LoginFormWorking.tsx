import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface LoginFormWorkingProps {
  onSuccess?: (token: string) => void;
}

export function LoginFormWorking({ onSuccess }: LoginFormWorkingProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const response = await fetch("/api/auth?action=login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed");
        return;
      }

      // Store token in localStorage
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setSuccess(true);
      setEmail("");
      setPassword("");

      // Call success callback if provided
      if (onSuccess) {
        onSuccess(data.token);
      }

      // Redirect to dashboard after 1 second
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1000);
    } catch (err) {
      setError("Network error. Please try again.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-foreground">Login to Zr3i</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-foreground">Email</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-foreground">Password</label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            disabled={loading}
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-md">
            <AlertCircle size={18} />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-md">
            <CheckCircle2 size={18} />
            <span className="text-sm">Login successful! Redirecting...</span>
          </div>
        )}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-4">
        Don't have an account?{" "}
        <a href="/register" className="text-primary hover:underline">
          Register here
        </a>
      </p>
    </Card>
  );
}
