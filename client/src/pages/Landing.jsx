import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  BarChart3, BookOpen, Dumbbell, Wallet, Target, Brain, 
  ChevronRight, ArrowRight, Zap, Play, Activity, Clock
} from 'lucide-react';
import Button from '../components/Button';
import { useAnimatedCounter } from '../hooks/useAnimatedCounter';

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0, transition: { duration: 0.3 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function Landing() {
  const studentsCount = useAnimatedCounter(10, 2000);
  const habitsCount = useAnimatedCounter(1, 2000);
  const hoursCount = useAnimatedCounter(500, 2000);

  return (
    <motion.div 
      className="min-h-screen bg-gray-900 text-white overflow-hidden relative"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Background elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/20 blur-[120px] pointer-events-none" />

      {/* Navigation */}
      <nav className="container mx-auto px-6 py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center">
            <Activity className="text-white" size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight">Life Ledger</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-gray-300">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
        </div>
        <Link to="/dashboard">
          <Button variant="primary" className="bg-indigo-600 hover:bg-indigo-700">
            Get Started
          </Button>
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 pt-20 pb-32 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-2xl"
          >
            <motion.h1 
              variants={fadeUp}
              className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight mb-6"
            >
              Your life, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                measured better.
              </span>
            </motion.h1>
            <motion.p 
              variants={fadeUp}
              className="text-lg md:text-xl text-gray-400 mb-8 leading-relaxed"
            >
              Life Ledger helps students understand their time, habits, health, money, and progress — all in one place. Stop guessing, start tracking.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
              <Link to="/dashboard">
                <Button size="lg" className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-lg px-8">
                  Start Your Ledger <ArrowRight className="ml-2" size={20} />
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto text-lg px-8 bg-white/10 hover:bg-white/20 border-0">
                  Explore Dashboard
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="bg-white/10 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-bold">Good morning, Alex 👋</h3>
                  <p className="text-gray-400 text-sm">Let's make today count.</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500" />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <BookOpen className="text-indigo-400 mb-2" size={24} />
                  <p className="text-gray-400 text-sm">Study Time</p>
                  <p className="text-2xl font-bold">3h 45m</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <Dumbbell className="text-cyan-400 mb-2" size={24} />
                  <p className="text-gray-400 text-sm">Workout</p>
                  <p className="text-2xl font-bold">45m</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl p-4 border border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">Life Score</p>
                  <p className="text-3xl font-bold text-white">82</p>
                </div>
                <div className="w-16 h-16 rounded-full border-4 border-indigo-500 border-t-purple-500 flex items-center justify-center">
                  <span className="text-indigo-400">Excellent</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-black/30 relative z-10">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to excel</h2>
            <p className="text-gray-400">Replace six different apps with one unified dashboard designed specifically for student life.</p>
          </div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              { icon: BarChart3, title: 'Life Score', desc: 'See your life as a single score', color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
              { icon: BookOpen, title: 'Study Tracker', desc: 'Know exactly where your time goes', color: 'text-purple-400', bg: 'bg-purple-500/10' },
              { icon: Dumbbell, title: 'Fitness Log', desc: 'Build consistent workout habits', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
              { icon: Wallet, title: 'Expense Tracker', desc: 'Understand your spending', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
              { icon: Target, title: 'Goal Setting', desc: 'Set and achieve meaningful goals', color: 'text-rose-400', bg: 'bg-rose-500/10' },
              { icon: Brain, title: 'AI Insights', desc: 'Get personalized recommendations', color: 'text-amber-400', bg: 'bg-amber-500/10' }
            ].map((feature, i) => (
              <motion.div key={i} variants={fadeUp} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feature.bg}`}>
                  <feature.icon className={feature.color} size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 relative z-10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How it works</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: '1', title: 'Log your daily activities', icon: Clock },
              { step: '2', title: 'Track your progress', icon: Activity },
              { step: '3', title: 'Get insights and improve', icon: Zap }
            ].map((item, i) => (
              <div key={i} className="text-center relative">
                {i !== 2 && <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-indigo-500/50 to-transparent" />}
                <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                  <item.icon size={28} />
                </div>
                <h3 className="text-xl font-bold mb-2">Step {item.step}</h3>
                <p className="text-gray-400">{item.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-20 bg-indigo-600 relative z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">{studentsCount}K+</div>
              <div className="text-indigo-200">students</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">{habitsCount}M+</div>
              <div className="text-indigo-200">habits tracked</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">{hoursCount}K+</div>
              <div className="text-indigo-200">study hours logged</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative z-10 text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-6">Ready to take control?</h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">Join thousands of students who are already using Life Ledger to build better habits and achieve their goals.</p>
          <Link to="/dashboard">
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-lg px-10 py-4 rounded-full shadow-[0_0_40px_rgba(79,70,229,0.4)]">
              Get Started for Free
            </Button>
          </Link>
        </div>
      </section>

      <footer className="py-8 border-t border-white/10 relative z-10 text-center text-gray-500">
        <p>© 2026 Life Ledger. Built for students, by students.</p>
      </footer>
    </motion.div>
  );
}
