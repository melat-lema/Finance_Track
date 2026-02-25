import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { FaChartBar, FaBars, FaTimes } from "react-icons/fa";
import { FiTarget } from "react-icons/fi";
import { RiMoneyDollarCircleLine } from "react-icons/ri";

const fadeUp = {
  hidden: { opacity: 0, y: -40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8 }
  }
};

const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#0b1120] text-white">

      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-6 md:px-20 py-5 border-b border-white/10 sticky top-0 bg-[#0f172a]/95 backdrop-blur-sm z-50">
        <div className="flex items-center gap-2 text-xl font-semibold">
  <div className="bg-blue-600 w-10 h-10 flex items-center justify-center rounded-xl font-bold text-white shadow-lg">
    FF
  </div>
  <span className="tracking-wide">FinanceFlow</span>
</div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <button 
            onClick={() => navigate('/login')}
            className="text-gray-300 hover:text-white transition"
          >
            Login
          </button>
          <button 
            onClick={() => navigate('/signup')}
            className="bg-blue-600 hover:bg-blue-700 transition px-5 py-2 rounded-xl"
          >
            Sign Up
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-white p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden absolute top-16 left-0 right-0 bg-[#1e293b] border-b border-white/10 p-4 flex flex-col gap-4 shadow-xl"
        >
          <button 
            onClick={() => {
              navigate('/login');
              setMobileMenuOpen(false);
            }}
            className="text-gray-300 hover:text-white text-left py-2"
          >
            Login
          </button>
          <button 
            onClick={() => {
              navigate('/signup');
              setMobileMenuOpen(false);
            }}
            className="bg-blue-600 text-center py-3 rounded-xl font-medium"
          >
            Sign Up
          </button>
        </motion.div>
      )}

      {/* HERO SECTION */}
      <section className="text-center px-6 md:px-20 py-20 md:py-32">
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="text-4xl md:text-6xl font-bold leading-tight"
        >
          Take Control of Your{" "}
          <span className="text-blue-500">Finances</span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.3 }}
          className="text-gray-400 mt-6 max-w-2xl mx-auto text-lg"
        >
          Track your income and expenses, visualize your spending patterns,
          and achieve your financial goals with FinanceFlow.
        </motion.p>

        <motion.button
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.6 }}
          onClick={() => navigate('/signup')}
          className="mt-10 bg-blue-600 hover:bg-blue-700 transition px-8 py-4 rounded-xl text-lg font-medium transform hover:scale-105"
        >
          Get Started Free
        </motion.button>
      </section>

      {/* FEATURES */}
      <section className="px-6 md:px-20 pb-20">
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<FaChartBar size={30} />}
            title="Smart Analytics"
            description="Visualize your spending patterns with interactive charts and detailed reports."
          />

          <FeatureCard
            icon={<RiMoneyDollarCircleLine size={30} />}
            title="Easy Tracking"
            description="Log transactions instantly with our intuitive interface and categorization system."
          />

          <FeatureCard
            icon={<FiTarget size={30} />}
            title="Set Goals"
            description="Create and monitor savings goals to stay on top of your financial objectives."
          />
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="px-6 md:px-20 pb-24">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="bg-[#1e293b] rounded-2xl p-10 md:p-16 text-center border border-white/10"
        >
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to Master Your Finances?
          </h2>

          <p className="text-gray-400 mt-4 max-w-xl mx-auto">
            Join thousands of users who have already taken control of their financial future.
          </p>

          <button 
            onClick={() => navigate('/signup')}
            className="mt-8 bg-blue-600 hover:bg-blue-700 transition px-8 py-4 rounded-xl text-lg font-medium transform hover:scale-105"
          >
            Start Your Free Account
          </button>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-8 px-6 md:px-20 text-center text-gray-400">
        <p>&copy; 2024 FinanceFlow. All rights reserved.</p>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="bg-[#1e293b] p-8 rounded-2xl border border-white/10 hover:border-blue-500/50 hover:scale-105 transition duration-300 cursor-pointer"
    >
      <div className="mb-4 text-blue-500 inline-flex p-3 bg-blue-500/10 rounded-xl">
        {icon}
      </div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-gray-400 mt-3">{description}</p>
    </motion.div>
  );
};

export default LandingPage;