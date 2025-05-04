import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from './Auth.module.css';
import { Icon } from '@iconify/react';

const Auth = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // For demo purposes, simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would call your auth API:
      // if (activeTab === 'login') {
      //   await AuthService.login(email, password);
      // } else {
      //   await AuthService.register(name, email, password);
      // }
      
      // Redirect to the dashboard on successful auth
      navigate('/app');
    } catch (error) {
      console.error('Authentication error:', error);
      // Here you'd handle errors (display message, etc.)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <motion.div 
        className={styles.authCard}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Left panel with colorful background */}
        <motion.div 
          className={styles.leftPanel}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className={styles.gradientOverlay}></div>
          <div className={styles.colorWaves}></div>
          
          <div className={styles.leftContent}>
            <span className={styles.tagline}>A WISE CHOICE</span>
            <h1 className={styles.title}>Get Everything<br />You Want</h1>
            <p className={styles.subtitle}>Track your career growth, applications, and skills  all in one place.</p>
          </div>
        </motion.div>
        
        {/* Right panel with form */}
        <motion.div 
          className={styles.rightPanel}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className={styles.logoWrapper}>
            <Icon icon="tabler:briefcase" />
            <span>NextStep</span>
          </div>
          
          <div className={styles.authTabs}>
            <button 
              className={`${styles.tabButton} ${activeTab === 'login' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('login')}
            >
              <Icon icon="tabler:login" style={{ marginRight: '8px' }} />
              Login
            </button>
            <button 
              className={`${styles.tabButton} ${activeTab === 'register' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('register')}
            >
              <Icon icon="tabler:user-plus" style={{ marginRight: '8px' }} />
              Register
            </button>
          </div>
          
          <h2 className={styles.welcomeBack}>
            {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className={styles.welcomeText}>
            {activeTab === 'login' 
              ? 'Enter your credentials to access your account' 
              : 'Fill out the form below to create your account'}
          </p>
          
          <motion.form 
            className={styles.authForm} 
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {activeTab === 'register' && (
              <motion.div 
                className={styles.formGroup}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <label htmlFor="name">Full Name</label>
                <div className={styles.inputWithIcon}>
                  <Icon icon="tabler:user" className={styles.inputIcon} />
                  <input
                    type="text"
                    id="name"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={activeTab === 'register'}
                  />
                </div>
              </motion.div>
            )}
            
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <div className={styles.inputWithIcon}>
                <Icon icon="tabler:mail" className={styles.inputIcon} />
                <input
                  type="email"
                  id="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="password">Password</label>
              <div className={styles.inputWithIcon}>
                <Icon icon="tabler:lock" className={styles.inputIcon} />
                <input
                  type="password"
                  id="password"
                  placeholder={activeTab === 'login' ? "Enter your password" : "Create a strong password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            
            {activeTab === 'login' && (
              <div className={styles.checkboxGroup}>
                <label className={styles.rememberMe}>
                  <input 
                    type="checkbox" 
                    className={styles.customCheckbox}
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  Remember me
                </label>
                <Link to="/forgot-password" className={styles.forgotPassword}>
                  Forgot Password?
                </Link>
              </div>
            )}
            
            <motion.button 
              type="submit" 
              className={styles.submitButton}
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <span className={styles.spinner}></span>
              ) : (
                activeTab === 'login' ? 'Sign In' : 'Create Account'
              )}
            </motion.button>
          </motion.form>
          
          {activeTab === 'login' && (
            <motion.div 
              className={styles.socialSection}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className={styles.socialText}>
                <span>Or continue with</span>
              </div>
              
              <motion.button 
                className={styles.googleButton}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <img src="/google-icon.svg" alt="Google" width="18" height="18" />
                Sign in with Google
              </motion.button>
            </motion.div>
          )}
          
          <motion.div 
            className={styles.signupSection}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {activeTab === 'login' ? (
              <>
                Don't have an account?
                <Link to="#" className={styles.signupLink} onClick={() => setActiveTab('register')}>
                  Sign up
                </Link>
              </>
            ) : (
              <>
                Already have an account?
                <Link to="#" className={styles.signupLink} onClick={() => setActiveTab('login')}>
                  Sign in
                </Link>
              </>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Auth; 