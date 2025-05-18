import { useState, useEffect } from "react";
import { useAuth } from "../../../../contexts/authContext";
import logo from "../../../../assets/logo/icon.png";
import { motion } from "framer-motion";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [animateForm, setAnimateForm] = useState(false);

  const { signIn, googleSignIn, loading } = useAuth();

  useEffect(() => {
    setTimeout(() => {
      setAnimateForm(true);
    }, 300);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      setError("");
      await signIn(email, password);
    } catch (err) {
      setError("Failed to log in: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      setError("");
      await googleSignIn();
    } catch (err) {
      setError("Failed to log in with Google: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      {/* Animated Globe Background */}
      <div className="fixed inset-0 overflow-hidden opacity-20">
        <motion.div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 60,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <svg width="800" height="800" viewBox="0 0 800 800" fill="none">
            <circle cx="400" cy="400" r="380" stroke="var(--color-primary)" strokeWidth="2" strokeDasharray="2 4"/>
            <path d="M400 20C500 20 580 100 580 200" stroke="var(--color-accent)" strokeWidth="1.5" strokeDasharray="2 3"/>
            <path d="M400 780C500 780 580 700 580 600" stroke="var(--color-accent)" strokeWidth="1.5" strokeDasharray="2 3"/>
            <path d="M20 400C20 500 100 580 200 580" stroke="var(--color-primary-light)" strokeWidth="1.5" strokeDasharray="2 3"/>
            <path d="M780 400C780 500 700 580 600 580" stroke="var(--color-primary-light)" strokeWidth="1.5" strokeDasharray="2 3"/>
            <motion.circle 
              cx="400" 
              cy="400" 
              r="300" 
              stroke="var(--color-primary)" 
              strokeWidth="1"
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.7, 0.9, 0.7]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </svg>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col md:flex-row items-center justify-center p-6">
        {/* Branding Section */}
        <motion.div 
          className="hidden md:flex md:w-1/2 flex-col items-center justify-center p-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.div
            className="mb-8"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <img src={logo} alt="Logo" className="h-32 w-auto drop-shadow-lg" />
          </motion.div>
          <motion.h1 
            className="text-5xl font-bold mb-4 gradient-text"
            style={{ color: 'var(--color-text)' }}
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%'],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear",
            }}
          >
            GlobePeek
          </motion.h1>
          <p className="text-lg max-w-md text-center" style={{ color: 'var(--color-text-light)' }}>
            Explore the world's countries with our interactive platform.
          </p>
          
          {/* Animated dots representing countries */}
          <motion.div className="mt-12 flex space-x-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: 'var(--color-accent)' }}
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{
                  duration: 2 + i * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </motion.div>
        </motion.div>

        {/* Login Form Section */}
        <motion.div
          className="w-full md:w-1/2 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={animateForm ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, type: "spring" }}
        >
          <div 
            className="w-full max-w-md p-8 rounded-2xl shadow-xl backdrop-blur-sm"
            style={{ 
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)'
            }}
          >
            {/* Mobile Header */}
            <div className="md:hidden mb-8 text-center">
              <motion.div 
                className="inline-flex items-center justify-center mb-4"
                whileTap={{ scale: 0.95 }}
              >
                <div 
                  className="p-3 rounded-xl shadow-sm mr-3"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                >
                  <img src={logo} alt="Logo" className="h-10 w-auto" />
                </div>
                <h1 
                  className="text-3xl font-bold"
                  style={{ color: 'var(--color-text)' }}
                >
                  GlobePeek
                </h1>
              </motion.div>
            </div>

            <div className="mb-8">
              <h2 
                className="text-2xl font-semibold mb-1"
                style={{ color: 'var(--color-text)' }}
              >
                Welcome back
              </h2>
              <p style={{ color: 'var(--color-text-light)' }}>
                Sign in to continue your exploration
              </p>
            </div>

            {error && (
              <motion.div 
                className="mb-6 p-3 rounded-lg text-sm"
                style={{ 
                  backgroundColor: 'rgba(220, 38, 38, 0.1)',
                  color: 'var(--color-text)'
                }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label 
                  className="block text-sm font-medium mb-1"
                  style={{ color: 'var(--color-text)' }}
                >
                  Email
                </label>
                <motion.div 
                  className="relative"
                  whileHover={{ scale: 1.01 }}
                >
                  <div 
                    className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                    style={{ color: 'var(--color-text-light)' }}
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-1 outline-none transition-all"
                    style={{ 
                      backgroundColor: 'var(--color-background)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text)',
                      focusRing: 'var(--color-primary)'
                    }}
                    placeholder="your@email.com"
                  />
                </motion.div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <label 
                    className="block text-sm font-medium"
                    style={{ color: 'var(--color-text)' }}
                  >
                    Password
                  </label>
                  <a 
                    href="#" 
                    className="text-sm transition-colors"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    Forgot?
                  </a>
                </div>
                <motion.div 
                  className="relative"
                  whileHover={{ scale: 1.01 }}
                >
                  <div 
                    className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                    style={{ color: 'var(--color-text-light)' }}
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-1 outline-none transition-all"
                    style={{ 
                      backgroundColor: 'var(--color-background)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text)',
                      focusRing: 'var(--color-primary)'
                    }}
                    placeholder="••••••••"
                  />
                </motion.div>
              </div>

              <motion.button
                type="submit"
                disabled={isLoading || loading}
                className="w-full py-3 px-4 font-medium rounded-lg transition-all duration-200 flex items-center justify-center"
                style={{ 
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-text-white)'
                }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                {isLoading || loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </motion.button>
            </form>

            <div className="my-6 flex items-center">
              <div 
                className="flex-grow border-t"
                style={{ borderColor: 'var(--color-border)' }}
              ></div>
              <span 
                className="px-3 text-sm"
                style={{ color: 'var(--color-text-light)' }}
              >
                or
              </span>
              <div 
                className="flex-grow border-t"
                style={{ borderColor: 'var(--color-border)' }}
              ></div>
            </div>

            <motion.button
              onClick={handleGoogleSignIn}
              disabled={isLoading || loading}
              className="w-full py-2.5 px-4 border rounded-lg font-medium transition-all flex items-center justify-center gap-2"
              style={{ 
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)'
              }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </motion.button>

            <div 
              className="mt-8 text-center text-sm"
              style={{ color: 'var(--color-text-light)' }}
            >
              Don't have an account?{" "}
              <a 
                href="/register" 
                className="font-medium transition-colors"
                style={{ color: 'var(--color-primary)' }}
              >
                Sign up
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;