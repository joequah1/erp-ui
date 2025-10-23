"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, ArrowLeft, Package } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { forgotPasswordSchema, type ForgotPasswordFormData } from "@/validation/schemas";

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState<ForgotPasswordFormData>({ email: "" });
  const [errors, setErrors] = useState<Partial<ForgotPasswordFormData>>({});
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ForgotPasswordFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = forgotPasswordSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<ForgotPasswordFormData> = {};
      result.error.issues.forEach((error) => {
        if (typeof error.path[0] === "string" || typeof error.path[0] === "number") {
          fieldErrors[error.path[0] as keyof ForgotPasswordFormData] = error.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }
    setIsLoading(true);
    try {
      await forgotPassword(formData);
      setIsSuccess(true);
    } catch (error: any) {
      setErrors({ email: error?.message || "Failed to send reset email" });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Check Your Email</h1>
            <p className="text-gray-600 mb-6">
              We've sent a password reset link to <strong>{formData.email}</strong>
            </p>
            <div className="space-y-4">
              <Button className="w-full" onClick={() => router.push("/auth/login")}>Back to Sign In</Button>
              <button
                onClick={() => setIsSuccess(false)}
                className="w-full text-sm text-gray-600 hover:text-gray-800"
              >
                Didn't receive the email? Try again
              </button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-orange-600 p-3 rounded-full">
              <Package className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Forgot Password?</h1>
          <p className="text-gray-600 mt-2">
            No worries, we'll send you reset instructions
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="Enter your email"
            autoComplete="email"
          />
          <Button
            type="submit"
            className="w-full bg-orange-600 hover:bg-orange-700 focus:ring-orange-500"
            isLoading={isLoading}
          >
            Send Reset Instructions
          </Button>
        </form>
        <div className="mt-6">
          <button
            type="button"
            onClick={() => router.push("/auth/login")}
            className="flex items-center justify-center space-x-2 text-sm text-gray-600 hover:text-gray-800 w-full"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Sign In</span>
          </button>
        </div>
      </Card>
    </div>
  );
}
