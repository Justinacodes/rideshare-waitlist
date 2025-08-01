"use client";
import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Check, Heart, Menu, X, Mail, Bell, Gift, Zap } from "lucide-react";

const waitlistBenefits = [
  {
    icon: Bell,
    title: "Early Access",
    description: "Be among the first to experience Ride-Geng when we launch in your area.",
    color: "from-purple-500 to-purple-700",
    highlight: "Priority Access"
  },
  {
    icon: Gift,
    title: "Exclusive Perks",
    description: "Get special launch bonuses, free rides, and premium features at no extra cost.",
    color: "from-purple-600 to-indigo-600",
    highlight: "Launch Bonus"
  },
  {
    icon: Zap,
    title: "Beta Testing",
    description: "Help shape the future of community transportation with exclusive beta access.",
    color: "from-green-500 to-purple-500",
    highlight: "Beta Access"
  },
  {
    icon: Heart,
    title: "Community Founder",
    description: "Become a founding member of your local Ride-Geng community.",
    color: "from-purple-500 to-pink-500",
    highlight: "Founder Status"
  }
];

const WaitlistPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    phone: '', // Phone is not sent to API, but kept for potential future use or local storage
    city: '',
    userType: '',
    wantsUpdates: false // Not sent to API, but kept for potential future use or local storage
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);

  const heroSlides = [
    {
      title: "Join the Movement",
      subtitle: "Be part of the community that's transforming transportation across Nigeria.",
      gradient: "from-purple-600 via-purple-700 to-indigo-800"
    },
    {
      title: "Coming Soon to Your Area",
      subtitle: "We're building something amazing. Get notified when we launch near you.",
      gradient: "from-indigo-600 via-purple-700 to-purple-800"
    },
    {
      title: "Reserve Your Spot",
      subtitle: "Join thousands of early adopters waiting for the future of ride-sharing.",
      gradient: "from-purple-700 via-indigo-700 to-blue-800"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));

    if (error) setError('');
  };

//  // No longer processing phone number on frontend, backend will handle or ignore if not needed.
//   const processPhoneNumber = (phone: string): string | null => {
//     if (!phone.trim()) return null;
//     const digitsOnly = phone.replace(/\D/g, '');
//     if (digitsOnly.length < 10) {
//       throw new Error('Please enter a valid phone number with at least 10 digits.');
//     }
//     return digitsOnly;
//   };

  const handleSubmit = async (e?: React.FormEvent) => {
  if (e) e.preventDefault();

  // Client-side validation for required fields before sending to API
  if (!formData.email || !formData.city || !formData.userType) {
    setError('Please fill in all required fields.');
    return;
  }

  setIsLoading(true);
  setError(''); // Clear previous errors

  try {
    const dataToSend = {
      email: formData.email,
      location: formData.city, // Map 'city' from frontend to 'location' for backend
      userType: formData.userType,
      phone: formData.phone, // CORRECTED: Include phone from formData
      updates: formData.wantsUpdates // CORRECTED: Map wantsUpdates from frontend to 'updates' for backend
    };

    // The API route path might be `/api/waitlist` or `/api/join-waitlist` based on your setup.
    // Ensure this matches your actual API route file name (e.g., app/api/waitlist/route.ts)
    const response = await fetch('/api/join-waitlist', { // Assuming your API route is at /api/waitlist
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSend),
    });

    const result = await response.json();

    if (!response.ok) {
      const apiErrorMessage = result.message || 'An unknown error occurred on the server.';
      throw new Error(apiErrorMessage);
    }

    // Success
    setIsSubmitted(true);
    // Reset form data after successful submission
    setFormData({
      email: '',
      phone: '',
      city: '',
      userType: '',
      wantsUpdates: false
    });

  } catch (err) {
    console.error('Frontend API Call Error:', err);
    let displayError = 'An unexpected error occurred. Please try again.';
    if (err instanceof Error) {
      displayError = err.message;
    }
    setError(displayError);
  } finally {
    setIsLoading(false);
  }
};

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white/95 backdrop-blur-lg shadow-lg' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">RG</span>
              </div>
              <span className={`text-xl font-bold transition-colors ${
                isScrolled ? 'text-gray-900' : 'text-white'
              }`}>
                Ride-<span className="text-purple-400">geng</span>
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => scrollToSection('benefits')}
                className={`font-medium transition-colors hover:text-purple-600 ${
                  isScrolled ? 'text-gray-700' : 'text-white/90'
                }`}
              >
                Benefits
              </button>
              <button
                onClick={() => scrollToSection('waitlist')}
                className={`font-medium transition-colors hover:text-purple-600 ${
                  isScrolled ? 'text-gray-700' : 'text-white/90'
                }`}
              >
                Join Waitlist
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className={`font-medium transition-colors hover:text-purple-600 ${
                  isScrolled ? 'text-gray-700' : 'text-white/90'
                }`}
              >
                About
              </button>
            </nav>

            {/* Desktop Auth Buttons */}
            {/* <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => window.location.href = "/login"}
                className={`font-medium transition-colors hover:text-purple-600 ${
                  isScrolled ? 'text-gray-700' : 'text-white/90'
                }`}
              >
                Already have account?
              </button>
            </div> */}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`md:hidden transition-colors ${
                isScrolled ? 'text-gray-700' : 'text-white'
              }`}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-white/95 backdrop-blur-lg border-t border-gray-200"
          >
            <div className="px-4 py-4 space-y-4">
              <button
                onClick={() => scrollToSection('benefits')}
                className="block w-full text-left font-medium text-gray-700 hover:text-purple-600 transition-colors"
              >
                Benefits
              </button>
              <button
                onClick={() => scrollToSection('waitlist')}
                className="block w-full text-left font-medium text-gray-700 hover:text-purple-600 transition-colors"
              >
                Join Waitlist
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className="block w-full text-left font-medium text-gray-700 hover:text-purple-600 transition-colors"
              >
                About
              </button>
              <hr className="border-gray-200" />
           
            </div>
          </motion.div>
        )}
      </motion.header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <motion.div
          style={{ y }}
          className={`absolute inset-0 bg-gradient-to-br ${heroSlides[currentSlide].gradient} transition-all duration-1000`}
        />

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute -top-32 -right-32 w-96 h-96 bg-white/5 rounded-full"
          />
          <motion.div
            animate={{
              rotate: -360,
              scale: [1, 1.2, 1],
            }}
            transition={{
              rotate: { duration: 25, repeat: Infinity, ease: "linear" },
              scale: { duration: 6, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute -bottom-32 -left-32 w-96 h-96 bg-white/5 rounded-full"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
          <div className="text-center text-white">
            {/* Hero Content */}
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                {heroSlides[currentSlide].title}
              </h1>
              <p className="text-xl md:text-2xl text-purple-100 mb-8 leading-relaxed">
                {heroSlides[currentSlide].subtitle}
              </p>
            </motion.div>

            {/* Enhanced Waitlist Form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="max-w-2xl mx-auto mb-12"
              id="waitlist"
            >
              {!isSubmitted ? (
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 space-y-6">
                  {error && (
                    <div className="mb-6 p-4 bg-red-500/20 border border-red-300/30 rounded-xl text-white text-sm">
                      <div className="font-semibold mb-1">Error:</div>
                      {error}
                    </div>
                  )}
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Flex container for side-by-side fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Email Input */}
                      <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-white mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="your@example.com"
                          className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300"
                        />
                      </div>

                      {/* Phone Input (Kept for UI, but not sent to current API) */}
                      <div>
                        <label htmlFor="phone" className="block text-sm font-semibold text-white mb-2">
                          Phone Number (Optional)
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="e.g., +2348012345678"
                          className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300"
                        />
                      </div>

                      {/* City Input */}
                      <div>
                        <label htmlFor="city" className="block text-sm font-semibold text-white mb-2">
                          Your City *
                        </label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          required
                          value={formData.city}
                          onChange={handleInputChange}
                          placeholder="e.g., Lagos"
                          className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300"
                        />
                      </div>

                      {/* User Type Select */}
                      <div>
                          <label htmlFor="userType" className="block text-sm font-semibold text-white mb-2">
                            I am interested in *
                          </label>
                          <select
                            id="userType"
                            name="userType"
                            required
                            value={formData.userType}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300"
                          >
                            <option value="" className="text-gray-800">Select an option</option>
                            <option value="rider" className="text-gray-800">Riding (as a passenger)</option>
                            <option value="driver" className="text-gray-800">Driving (earning money)</option>
                            <option value="both" className="text-gray-800">Both riding and driving</option>
                          </select>
                      </div>
                    </div>

                    {/* Updates Checkbox (Kept for UI, but not sent to current API) */}
                    <div className="flex items-center gap-3 text-left">
                      <input
                        type="checkbox"
                        id="wantsUpdates"
                        name="wantsUpdates"
                        checked={formData.wantsUpdates}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-purple-600 bg-white/20 border-white/30 rounded focus:ring-purple-500"
                      />
                      <label htmlFor="wantsUpdates" className="text-sm text-white/90">
                        Send me updates about the launch and exclusive offers
                      </label>
                    </div>

                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={isLoading || !formData.email || !formData.city || !formData.userType}
                      className="w-full bg-white text-purple-700 px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-purple-700 border-t-transparent rounded-full"
                          />
                          Joining...
                        </>
                      ) : (
                        <>
                          <Mail className="w-5 h-5" />
                          Join the Waitlist
                        </>
                      )}
                    </motion.button>
                  </form>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                    className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <Check className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white mb-2">Welcome aboard!</h3>
                  <p className="text-purple-100 mb-4">
                    You are now on our exclusive waitlist, please check your promotions folder. We will notify you as soon as we launch in your area.
                  </p>
                  <p className="text-sm text-purple-200">
                    Check your email for exclusive updates and early access perks.
                  </p>
                </motion.div>
              )}
            </motion.div>

            {/* Hero Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto"
            >
              {[
                { number: "1k+", label: "People Waiting" },
                { number: "4", label: "Cities Coming" },
                { number: "Soon", label: "Launch Date" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl font-bold text-white mb-1">{stat.number}</div>
                  <div className="text-purple-200 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Join the Waitlist?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Be part of the founding community and enjoy exclusive benefits that early adopters receive.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {waitlistBenefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                >
                  {/* Highlight Badge */}
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs px-3 py-1 rounded-full">
                    {benefit.highlight}
                  </div>

                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${benefit.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                  <div className="relative flex items-start gap-6">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className={`w-16 h-16 bg-gradient-to-br ${benefit.color} rounded-full flex items-center justify-center flex-shrink-0`}
                    >
                      <IconComponent className="w-8 h-8 text-white" />
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="about" className="py-20 bg-gradient-to-br from-purple-600 to-indigo-800 relative overflow-hidden">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute -top-32 -right-32 w-96 h-96 bg-white/5 rounded-full"
        />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Do Not Miss Out
            </h2>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Ride-Geng is coming soon to transform how Nigeria travels. Join thousands of early adopters and be part of the movement.
            </p>
            {!isSubmitted && (
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection('waitlist')}
                className="group bg-white text-purple-700 px-12 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 mx-auto"
              >
                Secure Your Spot
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </motion.button>
            )}
          </motion.div>
          <p className="text-purple-200 text-sm mt-8">© 2025 Ride-Geng. All rights reserved.</p>
        </div>
      </section>
    </div>
  );
};

export default WaitlistPage;