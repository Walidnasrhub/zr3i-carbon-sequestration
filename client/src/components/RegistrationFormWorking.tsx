import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface RegistrationFormWorkingProps {
  onSuccess?: (token: string) => void;
}

export function RegistrationFormWorking({ onSuccess }: RegistrationFormWorkingProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    country: "",
    phone: "",
    region: "",
    farmName: "",
    farmSize: "",
    primaryCrop: "",
    yearsOfFarming: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Validation
    if (!formData.email || !formData.password || !formData.firstName || !formData.lastName || !formData.country) {
      setError("Please fill in all required fields");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth?action=register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          country: formData.country,
          phone: formData.phone || undefined,
          region: formData.region || undefined,
          farmName: formData.farmName || undefined,
          farmSize: formData.farmSize ? parseInt(formData.farmSize) : undefined,
          primaryCrop: formData.primaryCrop || undefined,
          yearsOfFarming: formData.yearsOfFarming ? parseInt(formData.yearsOfFarming) : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      // Store token in localStorage
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setSuccess(true);

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
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-foreground">Register for Zr3i</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Required Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">First Name *</label>
            <Input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="John"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">Last Name *</label>
            <Input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Doe"
              required
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-foreground">Email *</label>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your@email.com"
            required
            disabled={loading}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">Password *</label>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">Confirm Password *</label>
            <Input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-foreground">Country *</label>
          <Input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="Egypt"
            required
            disabled={loading}
          />
        </div>

        {/* Optional Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">Phone</label>
            <Input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+20 123 456 7890"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">Region</label>
            <Input
              type="text"
              name="region"
              value={formData.region}
              onChange={handleChange}
              placeholder="Cairo"
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-foreground">Farm Name</label>
          <Input
            type="text"
            name="farmName"
            value={formData.farmName}
            onChange={handleChange}
            placeholder="My Farm"
            disabled={loading}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">Farm Size (hectares)</label>
            <Input
              type="number"
              name="farmSize"
              value={formData.farmSize}
              onChange={handleChange}
              placeholder="10"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">Primary Crop</label>
            <Input
              type="text"
              name="primaryCrop"
              value={formData.primaryCrop}
              onChange={handleChange}
              placeholder="Date Palms"
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-foreground">Years of Farming</label>
          <Input
            type="number"
            name="yearsOfFarming"
            value={formData.yearsOfFarming}
            onChange={handleChange}
            placeholder="5"
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
            <span className="text-sm">Registration successful! Redirecting...</span>
          </div>
        )}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Creating Account..." : "Register"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-4">
        Already have an account?{" "}
        <a href="/login" className="text-primary hover:underline">
          Login here
        </a>
      </p>
    </Card>
  );
}
