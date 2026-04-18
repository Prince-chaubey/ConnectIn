import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.gif";
import Layout from "../../Components/Layout/Layout"
import toast from "react-hot-toast";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();
  const API_URL=import.meta.env.VITE_API_URL;
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: ""
  });

  const [currentFeature, setCurrentFeature] = useState(0);

  // Auto-rotating features
  const features = [
    { icon: "🎯", text: "Find hackathon & capstone projects" },
    { icon: "🤝", text: "Build your team with skilled students" },
    { icon: "🤖", text: "AI-powered interviews & assessment" },
    { icon: "💼", text: "Get hired for freelance opportunities" },
    { icon: "📊", text: "Track your project progress" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.role) {
    return toast.error("Please select a role");
  }

  const toastId = toast.loading("Registering...");

  try {
    const res = await axios.post(`${API_URL}/auth/register`, formData);

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("role", res.data.user.role || formData.role);
    localStorage.setItem("username", res.data.user.name);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    toast.success("Account created successfully! Logging you in...", {
      id: toastId
    });

    setFormData({
      name: "",
      email: "",
      password: "",
      role: ""
    });

    // ✅ redirect to home/dashboard
    navigate("/");

  } catch (err) {
    toast.error(
      err.response?.data?.message || "Registration failed",
      { id: toastId }
    );
  }
};

  return (
   <Layout>
     <div className="min-h-screen flex">
      

      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white flex-col justify-center px-12 relative overflow-hidden">
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {/* Floating Bubbles */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full animate-float"></div>
          <div className="absolute bottom-32 right-20 w-48 h-48 bg-purple-500/20 rounded-full animate-float-delay"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-400/10 rounded-full animate-pulse"></div>
          
          {/* Moving Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
          
          {/* Animated Dots Pattern */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-0 w-full h-full" 
                 style={{
                   backgroundImage: `radial-gradient(circle at 2px 2px, white 1.5px, transparent 1px)`,
                   backgroundSize: '40px 40px'
                 }}>
            </div>
          </div>
        </div>
        
        <div className="relative z-10 max-w-md mx-auto animate-slide-up">
          
         
          
      
          <h2 className="text-4xl font-bold mb-6 animate-slide-right">
            Join the community of <br />
            <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
              innovators & creators
            </span>
          </h2>
          
          {/* Rotating Feature Text */}
          <div className="mb-8 h-20">
            <div className="flex items-center gap-3 text-xl font-semibold animate-fade-in-out">
              <span className="text-3xl animate-bounce">{features[currentFeature].icon}</span>
              <span className="text-blue-100">{features[currentFeature].text}</span>
            </div>
          </div>
          
          {/* Animated Features List */}
          <div className="space-y-4">
            {features.slice(0, 3).map((feature, idx) => (
              <div 
                key={idx}
                className="flex items-center gap-3 animate-slide-left"
                style={{ animationDelay: `${idx * 0.2}s` }}
              >
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                  <svg className="w-5 h-5 animate-check" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>{feature.text}</span>
              </div>
            ))}
          </div>
          
          {/* Animated Stats */}
          <div className="grid grid-cols-3 gap-4 mt-12 pt-8 border-t border-white/20">
            {[
              { number: "500+", label: "Active Projects", delay: 0 },
              { number: "2000+", label: "Students", delay: 0.2 },
              { number: "95%", label: "Success Rate", delay: 0.4 }
            ].map((stat, idx) => (
              <div 
                key={idx}
                className="text-center animate-scale-up"
                style={{ animationDelay: `${stat.delay}s` }}
              >
                <div className="text-2xl font-bold animate-count-up">{stat.number}</div>
                <div className="text-sm text-blue-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* RIGHT SIDE - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 transform transition-all duration-500 hover:scale-105 animate-slide-in-right">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="lg:hidden flex justify-center mb-4">
              <img src={logo} alt="logo" className="h-12 w-12 rounded-xl animate-pulse" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Create Account
            </h2>
            <p className="text-gray-500 mt-2">Join our community today</p>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit}>
            
            {/* Name Field with Animation */}
            <div className="mb-4 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
              <div className="relative group">
                <svg className="absolute left-3 top-3 w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 group-hover:border-blue-300"
                  placeholder="Enter your name"
                  required
                />
              </div>
            </div>
            
            {/* Email Field */}
            <div className="mb-4 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <label className="block text-gray-700 font-semibold mb-2">Email Address</label>
              <div className="relative group">
                <svg className="absolute left-3 top-3 w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 group-hover:border-blue-300"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>
            
            {/* Password Field */}
            <div className="mb-6 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
              <label className="block text-gray-700 font-semibold mb-2">Password</label>
              <div className="relative group">
                <svg className="absolute left-3 top-3 w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6-4h12a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6a2 2 0 012-2zm10-4V6a4 4 0 00-8 0v4h8z" />
                </svg>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 group-hover:border-blue-300"
                  placeholder="Create a password"
                  required
                />
              </div>
            </div>
            
            {/* Role Selection with Animation */}
            <div className="mb-6 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
              <label className="block text-gray-700 font-semibold mb-3">I am a</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, role: "seeker"})}
                  className={`p-3 rounded-lg border-2 transition-all duration-300 transform hover:scale-105 ${
                    formData.role === "seeker"
                      ? "border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg"
                      : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                  }`}
                >
                  <div className="text-2xl mb-1 animate-bounce">🎓</div>
                  <div className="font-semibold text-sm">Student</div>
                  <div className="text-xs text-gray-500">Looking for projects</div>
                </button>
                
                <button
                  type="button"
                  onClick={() => setFormData({...formData, role: "creator"})}
                  className={`p-3 rounded-lg border-2 transition-all duration-300 transform hover:scale-105 ${
                    formData.role === "creator"
                      ? "border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 shadow-lg"
                      : "border-gray-200 hover:border-purple-300 hover:bg-purple-50"
                  }`}
                >
                  <div className="text-2xl mb-1 animate-bounce">🚀</div>
                  <div className="font-semibold text-sm">Creator</div>
                  <div className="text-xs text-gray-500">Hiring talent</div>
                </button>
              </div>
            </div>
            
            {/* Submit Button with Animation */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-lg font-semibold hover:opacity-90 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg animate-fade-in-up"
              style={{ animationDelay: "0.5s" }}
            >
              Create Account
            </button>
            
            {/* Login Link */}
            <p className="text-center text-gray-600 mt-6 animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 font-semibold hover:underline transition-all hover:ml-1">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Add CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes float-delay {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(-5deg); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-right {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slide-left {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scale-up {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        
        @keyframes gradient-text {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delay {
          animation: float-delay 8s ease-in-out infinite;
        }
        
        .animate-shimmer {
          animation: shimmer 3s infinite;
        }
        
        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }
        
        .animate-slide-right {
          animation: slide-right 0.6s ease-out;
        }
        
        .animate-slide-left {
          animation: slide-left 0.6s ease-out;
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        
        .animate-scale-up {
          animation: scale-up 0.5s ease-out forwards;
          opacity: 0;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        
        .animate-gradient-text {
          background: linear-gradient(90deg, #fff, #fbbf24, #fff);
          background-size: 200% auto;
          animation: gradient-text 3s linear infinite;
        }
        
        .animate-fade-in-up {
          animation: slide-up 0.5s ease-out forwards;
          opacity: 0;
        }
        
        .animate-fade-in-out {
          animation: fade-in 0.5s ease-out, fade-in 0.5s ease-out;
        }
        
        .animate-check {
          animation: scale-up 0.3s ease-out;
        }
        
        .animate-count-up {
          animation: slide-up 0.5s ease-out;
        }
        
        .animate-slide-in-right {
          animation: slide-left 0.6s ease-out;
        }
      `}</style>
    </div>
   </Layout>
  );
};

export default Register;