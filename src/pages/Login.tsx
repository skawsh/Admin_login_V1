
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Eye, EyeOff, Lock, User, ArrowLeft, Phone, KeyRound } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { LoginLogo } from "@/components/login/LoginLogo";
import { useAuth } from "@/hooks/useAuth";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

// Login form schema
const loginFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  rememberMe: z.boolean().optional(),
});

// Mobile form schema
const mobileFormSchema = z.object({
  mobile: z.string().min(10, { message: "Please enter a valid mobile number" }),
});

// OTP form schema
const otpFormSchema = z.object({
  otp: z.string().length(4, { message: "OTP must be 4 digits" }),
});

// Reset password form schema
const resetPasswordFormSchema = z.object({
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z.string().min(8, { message: "Password must be at least 8 characters" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginFormSchema>;
type MobileFormValues = z.infer<typeof mobileFormSchema>;
type OtpFormValues = z.infer<typeof otpFormSchema>;
type ResetPasswordFormValues = z.infer<typeof resetPasswordFormSchema>;

type ResetPasswordStep = 'login' | 'mobile' | 'otp' | 'reset';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resetStep, setResetStep] = useState<ResetPasswordStep>('login');
  const [mobile, setMobile] = useState('');
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const mobileForm = useForm<MobileFormValues>({
    resolver: zodResolver(mobileFormSchema),
    defaultValues: {
      mobile: "",
    },
  });

  const otpForm = useForm<OtpFormValues>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: {
      otp: "",
    },
  });

  const resetPasswordForm = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onLoginSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);

    try {
      const success = await login(data.email, data.password);
      
      if (success) {
        toast({
          title: "Login successful",
          description: "Welcome to Skawsh Admin Panel",
        });
        
        navigate("/");
      } else {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: "Invalid email or password",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login error",
        description: "An error occurred during login",
      });
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    setResetStep('mobile');
  };

  const handleMobileSubmit = (data: MobileFormValues) => {
    setMobile(data.mobile);
    setIsLoading(true);
    
    // Simulate API call to send OTP
    setTimeout(() => {
      toast({
        title: "OTP Sent",
        description: `A 4-digit OTP has been sent to ${data.mobile}`,
      });
      setIsLoading(false);
      setResetStep('otp');
      startCountdown();
    }, 1500);
  };

  const startCountdown = () => {
    setCountdown(30);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResendOTP = () => {
    if (countdown === 0) {
      setIsLoading(true);
      // Simulate API call to resend OTP
      setTimeout(() => {
        toast({
          title: "OTP Resent",
          description: `A new 4-digit OTP has been sent to ${mobile}`,
        });
        setIsLoading(false);
        startCountdown();
      }, 1500);
    }
  };

  const handleOtpSubmit = (data: OtpFormValues) => {
    setIsLoading(true);
    
    // Simulate API call to verify OTP
    setTimeout(() => {
      // For demo purposes, any OTP is valid
      toast({
        title: "OTP Verified",
        description: "Please set your new password",
      });
      setIsLoading(false);
      setResetStep('reset');
    }, 1500);
  };

  const handleResetPasswordSubmit = (data: ResetPasswordFormValues) => {
    setIsLoading(true);
    
    // Simulate API call to reset password
    setTimeout(() => {
      toast({
        title: "Password Reset Successful",
        description: "Your password has been reset successfully. Please login with your new password.",
      });
      setIsLoading(false);
      setResetStep('login');
      loginForm.reset();
    }, 1500);
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleNewPasswordVisibility = () => setShowNewPassword(!showNewPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const goBack = () => {
    if (resetStep === 'mobile') {
      setResetStep('login');
    } else if (resetStep === 'otp') {
      setResetStep('mobile');
    } else if (resetStep === 'reset') {
      setResetStep('otp');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="mb-8 text-center">
          <LoginLogo />
          <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Welcome to Admin Panel</h1>
        </div>
        
        {resetStep === 'login' && (
          <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-950/70 border-gray-200 dark:border-gray-800 shadow-xl">
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
              <CardDescription>Enter your credentials to access the admin panel</CardDescription>
            </CardHeader>
            
            <CardContent>
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                            <Input
                              placeholder="Enter your email"
                              className="pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter your password"
                              className="pl-10"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={togglePasswordVisibility}
                              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="remember-me"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        onChange={(e) => loginForm.setValue("rememberMe", e.target.checked)}
                      />
                      <label htmlFor="remember-me" className="text-sm text-gray-600 dark:text-gray-400">
                        Remember me
                      </label>
                    </div>
                    
                    <a
                      href="#"
                      className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                      onClick={handleForgotPassword}
                    >
                      Forgot Password?
                    </a>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </Form>
            </CardContent>
            
            <CardFooter className="flex justify-center border-t px-6 py-4">
            </CardFooter>
          </Card>
        )}

        {resetStep === 'mobile' && (
          <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-950/70 border-gray-200 dark:border-gray-800 shadow-xl">
            <CardHeader>
              <div className="flex items-center">
                <Button variant="ghost" size="icon" onClick={goBack} className="mr-2">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <CardTitle>Reset Password</CardTitle>
                  <CardDescription>Enter your mobile number to receive a verification code</CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <Form {...mobileForm}>
                <form onSubmit={mobileForm.handleSubmit(handleMobileSubmit)} className="space-y-4">
                  <FormField
                    control={mobileForm.control}
                    name="mobile"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mobile Number</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                            <Input
                              placeholder="Enter your mobile number"
                              className="pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending OTP..." : "Send OTP"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {resetStep === 'otp' && (
          <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-950/70 border-gray-200 dark:border-gray-800 shadow-xl">
            <CardHeader>
              <div className="flex items-center">
                <Button variant="ghost" size="icon" onClick={goBack} className="mr-2">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <CardTitle>Enter OTP</CardTitle>
                  <CardDescription>
                    Enter the 4-digit verification code sent to {mobile}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <Form {...otpForm}>
                <form onSubmit={otpForm.handleSubmit(handleOtpSubmit)} className="space-y-6">
                  <FormField
                    control={otpForm.control}
                    name="otp"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="flex justify-center py-4">
                            <InputOTP maxLength={4} {...field}>
                              <InputOTPGroup>
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                                <InputOTPSlot index={3} />
                              </InputOTPGroup>
                            </InputOTP>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-center">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleResendOTP}
                      disabled={countdown > 0 || isLoading}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      {countdown > 0 ? `Resend OTP in ${countdown}s` : "Resend OTP"}
                    </Button>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Verifying..." : "Verify OTP"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {resetStep === 'reset' && (
          <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-950/70 border-gray-200 dark:border-gray-800 shadow-xl">
            <CardHeader>
              <div className="flex items-center">
                <Button variant="ghost" size="icon" onClick={goBack} className="mr-2">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <CardTitle>Reset Password</CardTitle>
                  <CardDescription>Create a new secure password</CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <Form {...resetPasswordForm}>
                <form onSubmit={resetPasswordForm.handleSubmit(handleResetPasswordSubmit)} className="space-y-4">
                  <FormField
                    control={resetPasswordForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <KeyRound className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                            <Input
                              type={showNewPassword ? "text" : "password"}
                              placeholder="Enter new password"
                              className="pl-10"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={toggleNewPasswordVisibility}
                              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                            >
                              {showNewPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={resetPasswordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <KeyRound className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Confirm new password"
                              className="pl-10"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={toggleConfirmPasswordVisibility}
                              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Resetting Password..." : "Reset Password"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Login;
