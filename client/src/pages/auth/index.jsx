import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Background from "../../assets/demo.mp4";
import Victory from "../../assets/victory.svg";


import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from 'lucide-react';
import apiClient from "@/lib/api-client";
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "@/lib/constants";
import { useAppStore } from "@/store";

const LoadingPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 overflow-hidden"
    >
      <motion.div
        animate={{
          scale: [1, 1.5, 0.5, 1],
          rotate: [0, 180, 360],
          borderRadius: ["50%", "20%", "50%"]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="w-20 h-20 bg-purple-500 flex items-center justify-center"
      >
        <motion.div
          animate={{
            opacity: [1, 0, 1],
            scale: [1, 1.5, 1]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeOut"
          }}
          className="w-16 h-16 bg-white rounded-full"
        />
      </motion.div>

      <motion.p
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mt-8 text-2xl font-bold text-purple-700"
      >
        Loading...
      </motion.p>

      {[...Array(20)].map((_, index) => (
        <motion.div
          key={index}
          initial={{
            x: 0,
            y: 0,
            opacity: 1,
            scale: 0
          }}
          animate={{
            x: Math.random() * 400 - 200,
            y: Math.random() * 400 - 200,
            opacity: 0,
            scale: Math.random() * 2 + 1
          }}
          transition={{
            duration: Math.random() * 1 + 1,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeOut",
            delay: Math.random() * 2
          }}
          className="absolute w-2 h-2 bg-purple-400 rounded-full"
        />
      ))}
    </motion.div>
  );
};

const PasswordInput = ({ value, onChange, placeholder }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="pr-10"
      />
      <button
        type="button"
        className="absolute inset-y-0 right-0 pr-3 flex items-center"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
};

const PasswordStrengthIndicator = ({ password }) => {
  const [strength, setStrength] = useState(0);

  useEffect(() => {
    const calculateStrength = (pwd) => {
      let score = 0;
      if (pwd.length > 6) score++;
      if (pwd.length > 10) score++;
      if (/[A-Z]/.test(pwd)) score++;
      if (/[0-9]/.test(pwd)) score++;
      if (/[^A-Za-z0-9]/.test(pwd)) score++;
      return score;
    };

    setStrength(calculateStrength(password));
  }, [password]);

  const getColor = () => {
    if (strength <= 2) return "bg-red-500";
    if (strength <= 4) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="mt-2">
      <div className="h-2 w-full bg-gray-200 rounded-full">
        <div
          className={`h-full rounded-full ${getColor()}`}
          style={{ width: `${(strength / 5) * 100}%` }}
        ></div>
      </div>
      <p className="text-sm mt-1">
        {strength <= 2 && "Weak"}
        {strength > 2 && strength <= 4 && "Medium"}
        {strength > 4 && "Strong"}
      </p>
    </div>
  );
};

const Auth = () => {
  const navigate = useNavigate();
  const { setUserInfo } = useAppStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const validateLogin = () => {
    if (!email.length) {
      toast.error("Email is required.");
      return false;
    }
    if (!password.length) {
      toast.error("Password is required.");
      return false;
    }
    return true;
  };

  const validateSignup = () => {
    if (!email.length) {
      toast.error("Email is required.");
      return false;
    }
    if (!password.length) {
      toast.error("Password is required.");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Password and Confirm Password should be same.");
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    try {
      if (validateLogin()) {
        const response = await apiClient.post(
          LOGIN_ROUTE,
          { email, password },
          { withCredentials: true }
        );
        if (response.data.user.id) {
          setUserInfo(response.data.user);
          if (response.data.user.profileSetup) navigate("/chat");
          else navigate("/profile");
        } else {
          console.log("error");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSignup = async () => {
    try {
      if (validateSignup()) {
        const response = await apiClient.post(
          SIGNUP_ROUTE,
          {
            email,
            password,
          },
          { withCredentials: true }
        );
        if (response.status === 201) {
          setUserInfo(response.data.user);
          navigate("/profile");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-2xl w-full max-w-6xl rounded-3xl overflow-hidden"
      >
        <div className="grid xl:grid-cols-2 h-full">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-col gap-8 p-8 justify-center"
          >
            <div className="text-center">
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="flex items-center justify-center mb-2"
              >
                <h1 className="text-5xl md:text-6xl font-bold">Welcome</h1>
                <img src={Victory} className="h-[100px]" alt="Victory" />
              </motion.div>
              <p className="font-medium text-gray-600">
                Fill in the details to get started with the best chat app!
              </p>
            </div>
            <Tabs defaultValue="login" className="w-full max-w-md mx-auto">
              <TabsList className="grid grid-cols-2 gap-4 mb-6">
                <TabsTrigger
                  className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 rounded-lg py-2 transition-all duration-300"
                  value="login"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 rounded-lg py-2 transition-all duration-300"
                  value="signup"
                >
                  Signup
                </TabsTrigger>
              </TabsList>
              <TabsContent value="login" className="space-y-4">
                <Input
                  placeholder="Email"
                  type="email"
                  className="rounded-lg"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <PasswordInput
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-lg py-2"
                  onClick={handleLogin}
                >
                  Login
                </Button>
              </TabsContent>
              <TabsContent value="signup" className="space-y-4">
                <Input
                  placeholder="Email"
                  type="email"
                  className="rounded-lg"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <PasswordInput
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <PasswordStrengthIndicator password={password} />
                <PasswordInput
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-lg py-2"
                  onClick={handleSignup}
                >
                  Signup
                </Button>
              </TabsContent>
            </Tabs>
          </motion.div>
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="hidden xl:flex justify-center items-center bg-purple-100"
          >
            <video
              className="max-w-full h-auto"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src={Background} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </motion.div>
        </div>
      </motion.div>


    </div>
  );
};

export default Auth;