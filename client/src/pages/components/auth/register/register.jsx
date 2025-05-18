import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../../contexts/authContext';
import { FaGoogle, FaEnvelope, FaLock, FaUser, FaEye, FaEyeSlash } from 'react-icons/fa';
import { motion } from 'framer-motion';
import logo from "../../../../assets/logo/icon.png";
import Globe from '../../../../components/animations/Globe';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { signUp, googleSignIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    
    try {
      setError('');
      setLoading(true);
      await signUp(email, password, displayName);
      navigate('/');
    } catch (err) {
      setError('Failed to create account: ' + err.message);
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setLoading(true);
      await googleSignIn();
      navigate('/');
    } catch (err) {
      setError('Failed to register with Google: ' + err.message);
      setLoading(false);
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
            className="text-5xl font-bold mb-4"
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
            Join our community of global explorers today.
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

        {/* Registration Form Section */}
        <motion.div
          className="w-full md:w-1/2 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
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
                  <div className="text-2xl">🌎</div>
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
                Create Account
              </h2>
              <p style={{ color: 'var(--color-text-light)' }}>
                Join our global community
              </p>
            </div>

            {error && (
              <motion.div 
                className="mb-6 p-3 bg-red-50 text-red-600 rounded-lg text-sm"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>
                  <FaUser className="text-[var(--color-text-light)]" />
                  Full Name
                </label>
                <motion.div whileHover={{ scale: 1.01 }}>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg focus:ring-1 outline-none transition-all"
                    style={{ 
                      backgroundColor: 'var(--color-background)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text)',
                      focusRing: 'var(--color-primary)'
                    }}
                    placeholder="Enter your full name"
                  />
                </motion.div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>
                  <FaEnvelope className="text-[var(--color-text-light)]" />
                  Email
                </label>
                <motion.div whileHover={{ scale: 1.01 }}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg focus:ring-1 outline-none transition-all"
                    style={{ 
                      backgroundColor: 'var(--color-background)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text)',
                      focusRing: 'var(--color-primary)'
                    }}
                    placeholder="your@email.com"
                  />
                </motion.div>
              </div>

              <div className="relative">
                <label className="flex items-center gap-2 text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>
                  <FaLock className="text-[var(--color-text-light)]" />
                  Password
                </label>
                <motion.div whileHover={{ scale: 1.01 }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg focus:ring-1 outline-none transition-all"
                    style={{ 
                      backgroundColor: 'var(--color-background)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text)',
                      focusRing: 'var(--color-primary)'
                    }}
                    placeholder="••••••••"
                  />
                </motion.div>
                <button
                  type="button"
                  className="absolute right-3 top-[38px]"
                  style={{ color: 'var(--color-text-light)' }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <div className="relative">
                <label className="flex items-center gap-2 text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>
                  <FaLock className="text-[var(--color-text-light)]" />
                  Confirm Password
                </label>
                <motion.div whileHover={{ scale: 1.01 }}>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg focus:ring-1 outline-none transition-all"
                    style={{ 
                      backgroundColor: 'var(--color-background)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text)',
                      focusRing: 'var(--color-primary)'
                    }}
                    placeholder="••••••••"
                  />
                </motion.div>
                <button
                  type="button"
                  className="absolute right-3 top-[38px]"
                  style={{ color: 'var(--color-text-light)' }}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 font-medium rounded-lg transition-all duration-200 flex items-center justify-center"
                style={{ 
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-text-white)'
                }}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </>
                ) : (
                  "Register"
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
              disabled={loading}
              className="w-full py-2.5 px-4 border rounded-lg font-medium transition-all flex items-center justify-center gap-2"
              style={{ 
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)'
              }}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              <FaGoogle className="text-red-500" />
              Continue with Google
            </motion.button>

            <div 
              className="mt-8 text-center text-sm"
              style={{ color: 'var(--color-text-light)' }}
            >
              Already have an account?{" "}
              <Link 
                to="/login" 
                className="font-medium transition-colors"
                style={{ color: 'var(--color-primary)' }}
              >
                Log in
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Register;