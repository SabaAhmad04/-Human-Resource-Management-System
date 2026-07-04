import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Users,
  Clock,
  Calendar,
  Wallet,
  BarChart3,
  Briefcase,
  ChevronDown,
  ChevronRight,
  Check,
  ArrowRight,
  Menu,
  X
} from 'lucide-react'

const features = [
  {
    icon: Users,
    title: 'Employee Management',
    description: 'Complete employee lifecycle management from onboarding to offboarding with detailed profiles and documentation.',
  },
  {
    icon: Clock,
    title: 'Attendance Tracking',
    description: 'Real-time attendance tracking with check-in/check-out, overtime management, and automated reports.',
  },
  {
    icon: Calendar,
    title: 'Leave Management',
    description: 'Streamlined leave request workflow with approval chains, leave balances, and holiday calendars.',
  },
  {
    icon: Wallet,
    title: 'Payroll Processing',
    description: 'Automated payroll calculations with tax deductions, benefits, and payslip generation.',
  },
  {
    icon: BarChart3,
    title: 'Performance Reviews',
    description: '360-degree performance tracking with goal setting, feedback, and career development planning.',
  },
  {
    icon: Briefcase,
    title: 'Recruitment',
    description: 'End-to-end recruitment pipeline from job postings to candidate tracking and interview scheduling.',
  },
]

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'HR Director at TechCorp',
    content: 'HRMS has transformed how we manage our workforce. The automation saves us hours every week.',
    avatar: 'SJ',
  },
  {
    name: 'Michael Chen',
    role: 'CEO at StartupXYZ',
    content: 'The best HR solution we\'ve used. Intuitive, powerful, and the support team is incredible.',
    avatar: 'MC',
  },
  {
    name: 'Emily Rodriguez',
    role: 'Operations Manager at GlobalCo',
    content: 'From recruitment to payroll, everything is streamlined. Our HR team is more efficient than ever.',
    avatar: 'ER',
  },
]

const pricingPlans = [
  {
    name: 'Starter',
    price: '29',
    description: 'Perfect for small teams',
    features: [
      'Up to 25 employees',
      'Basic attendance tracking',
      'Leave management',
      'Payroll processing',
      'Email support',
    ],
    cta: 'Start Free Trial',
  },
  {
    name: 'Professional',
    price: '79',
    description: 'Best for growing companies',
    features: [
      'Up to 100 employees',
      'Advanced attendance & leave',
      'Performance reviews',
      'Recruitment module',
      'Custom reports',
      'Priority support',
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '199',
    description: 'For large organizations',
    features: [
      'Unlimited employees',
      'All Professional features',
      'API access',
      'Custom integrations',
      'Dedicated account manager',
      '24/7 phone support',
    ],
    cta: 'Contact Sales',
  },
]

const faqs = [
  {
    question: 'How does the free trial work?',
    answer: 'You get full access to all features for 14 days. No credit card required. Simply sign up and start using the platform.',
  },
  {
    question: 'Can I migrate from another HR system?',
    answer: 'Yes! We provide free data migration support. Our team will help you transfer all your employee data, leave records, and payroll history.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Absolutely. We use enterprise-grade encryption, regular backups, and comply with GDPR and SOC 2 standards.',
  },
  {
    question: 'Do you offer training?',
    answer: 'Yes, we provide comprehensive onboarding training, documentation, and video tutorials. Enterprise customers get dedicated training sessions.',
  },
]

const Landing = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState(null)

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">H</span>
              </div>
              <span className="text-xl font-bold text-gray-900">HRMS</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 font-medium">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 font-medium">Pricing</a>
              <a href="#faq" className="text-gray-600 hover:text-gray-900 font-medium">FAQ</a>
              <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium">Login</Link>
              <Link to="/register" className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors">
                Get Started
              </Link>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100">
            <div className="px-4 py-4 space-y-3">
              <a href="#features" className="block py-2 text-gray-600 hover:text-gray-900 font-medium">Features</a>
              <a href="#pricing" className="block py-2 text-gray-600 hover:text-gray-900 font-medium">Pricing</a>
              <a href="#faq" className="block py-2 text-gray-600 hover:text-gray-900 font-medium">FAQ</a>
              <Link to="/login" className="block py-2 text-gray-600 hover:text-gray-900 font-medium">Login</Link>
              <Link to="/register" className="block bg-primary-600 text-white px-4 py-2 rounded-lg font-medium text-center hover:bg-primary-700">
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-primary-100" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
                Now with AI-powered analytics
              </span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
            >
              Streamline Your{' '}
              <span className="text-primary-600">HR Operations</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
            >
              All-in-one Human Resource Management System for modern businesses. 
              Manage employees, attendance, leaves, payroll, and more.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                to="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
              >
                Start Free Trial
                <ArrowRight size={18} />
              </Link>
              <a
                href="#features"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-gray-700 px-8 py-3 rounded-lg font-medium border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                Learn More
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything you need to manage your workforce
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Powerful features to streamline your HR processes and boost productivity
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon size={24} className="text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted by industry leaders
            </h2>
            <p className="text-lg text-gray-600">
              See what our customers have to say
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 p-6 rounded-xl"
              >
                <p className="text-gray-700 mb-6">"{testimonial.content}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-700 font-medium">{testimonial.avatar}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-gray-600">
              Choose the plan that's right for your team
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`bg-white rounded-xl shadow-sm border-2 p-8 ${
                  plan.popular ? 'border-primary-500 relative' : 'border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check size={18} className="text-success-500" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/register"
                  className={`block w-full text-center py-3 rounded-lg font-medium transition-colors ${
                    plan.popular
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently asked questions
            </h2>
            <p className="text-lg text-gray-600">
              Find answers to common questions
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
                >
                  <span className="font-medium text-gray-900">{faq.question}</span>
                  <ChevronDown
                    size={20}
                    className={`text-gray-500 transition-transform ${
                      openFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="p-4 pt-0 text-gray-600">
                    {faq.answer}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">H</span>
                </div>
                <span className="text-xl font-bold">HRMS</span>
              </div>
              <p className="text-gray-400">
                Modern Human Resource Management System for growing businesses.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} HRMS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing
