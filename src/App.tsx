import React, { useState, useEffect } from 'react';
import { Calendar, ArrowRight, ChevronDown, CheckCircle } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  follower_count: string;
  preferred_call_time: string;
  main_goals: string;
}

interface FormErrors {
  [key: string]: string;
}

function App() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    follower_count: '',
    preferred_call_time: '',
    main_goals: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  // Set minimum date/time for call scheduling
  const getMinDateTime = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().slice(0, 16);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.preferred_call_time) {
      newErrors.preferred_call_time = 'Preferred call time is required';
    } else {
      const callDate = new Date(formData.preferred_call_time);
      const now = new Date();
      if (callDate <= now) {
        newErrors.preferred_call_time = 'Please select a future date and time';
      }
    }

    if (!formData.main_goals.trim()) {
      newErrors.main_goals = 'Goals are required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSubmit = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSubmit.append(key, value);
      });
      formDataToSubmit.append('_next', window.location.origin + '/thank-you.html');
      formDataToSubmit.append('_subject', 'New Strategy Call Request');
      formDataToSubmit.append('_cc', 'Tylerkeanesolutions@gmail.com');

      const response = await fetch('https://formspree.io/f/xpznvqko', {
        method: 'POST',
        body: formDataToSubmit,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        alert('There was an error submitting your form. Please try again.');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      alert('There was an error submitting your form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const faqData = [
    {
      question: "How does the AI maintain my brand voice?",
      answer: "Our AI analyzes your existing content, brand guidelines, and communication style to create a custom voice model. We fine-tune it based on your feedback to ensure every post sounds authentically you."
    },
    {
      question: "Can I review content before it's posted?",
      answer: "Absolutely! You can set up approval workflows, schedule review sessions, or let it run fully automated based on your comfort level. Most clients start with approvals and transition to full automation as they build trust."
    },
    {
      question: "What platforms do you support?",
      answer: "We currently support X (Twitter), Instagram, and YouTube with platform-specific optimization for each. We're constantly adding new platforms based on client demand."
    },
    {
      question: "How quickly will I see results?",
      answer: "Most clients see increased engagement within the first week and significant growth within 30 days. The AI learns and improves continuously, so results compound over time."
    },
    {
      question: "Is there a minimum contract length?",
      answer: "We offer month-to-month service with no long-term contracts. However, we recommend at least 3 months to see the full potential of the automation system."
    },
    {
      question: "What kind of support do you provide?",
      answer: "All plans include dedicated support via email and Slack. Growth and Scale plans get priority support, and Scale plan includes monthly strategy calls with our automation experts."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <section id="hero" className="min-h-screen flex items-center py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-transparent"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-block px-4 py-2 bg-cyan-500/10 border border-cyan-500 rounded-full text-cyan-400 text-sm">
                🚀 AI-Powered Automation
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                Transform Your Social Media Into A{' '}
                <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Content Machine
                </span>
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                Scale your X, Instagram & YouTube presence with intelligent automation that engages your audience 24/7 while you focus on growing your business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => scrollToSection('consulting')}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 hover:-translate-y-1"
                >
                  Get Free Strategy Call
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => scrollToSection('features')}
                  className="inline-flex items-center gap-2 px-8 py-4 border-2 border-gray-600 text-white font-semibold rounded-lg hover:border-cyan-500 hover:text-cyan-400 transition-all duration-300"
                >
                  See How It Works
                </button>
              </div>
              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-700">
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-400">10,000+</div>
                  <div className="text-sm text-gray-400">Posts Automated</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-400">500%</div>
                  <div className="text-sm text-gray-400">Avg. Engagement Boost</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-400">24/7</div>
                  <div className="text-sm text-gray-400">Autonomous Operation</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-video bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden shadow-2xl">
                <iframe 
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
                  title="AI Content Creation Demo" 
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                />
              </div>
              <p className="text-center mt-4 text-gray-400 text-sm italic">
                Watch AI create engaging content in real-time
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Powerful Automation Features</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Everything you need to dominate social media without the manual work
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "AI Content Generation",
                description: "Our advanced AI creates engaging, platform-specific content that matches your brand voice and resonates with your audience across X, Instagram, and YouTube.",
                features: ["Brand voice analysis", "Trending hashtag integration", "Multi-platform optimization"]
              },
              {
                title: "Smart Scheduling",
                description: "Intelligent posting schedules based on your audience's activity patterns, time zones, and platform algorithms for maximum reach and engagement.",
                features: ["Optimal timing analysis", "Cross-platform coordination", "Automated queue management"]
              },
              {
                title: "Engagement Automation",
                description: "Automated responses, comment management, and community building that maintains authentic interactions while scaling your presence.",
                features: ["Smart reply system", "Community management", "Sentiment analysis"]
              }
            ].map((feature, index) => (
              <div key={index} className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 hover:border-cyan-500/30 hover:bg-gray-800/70 transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6">
                  <div className="w-8 h-8 bg-black rounded"></div>
                </div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-300 mb-6 leading-relaxed">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.features.map((item, i) => (
                    <li key={i} className="text-gray-400 text-sm flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-cyan-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-800/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">What Our Clients Say</h2>
            <p className="text-xl text-gray-300">Real results from real businesses</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "AutoFlow increased our engagement by 400% in just 3 months. The AI content feels so natural, our followers can't tell it's automated.",
                author: "Sarah Chen",
                role: "E-commerce Brand Manager",
                stat: "+400% Engagement"
              },
              {
                quote: "We went from 10K to 100K followers across platforms in 6 months. The automation handles everything while maintaining our authentic voice.",
                author: "Marcus Rodriguez",
                role: "Fitness Influencer",
                stat: "10x Follower Growth"
              },
              {
                quote: "The ROI is incredible. We're generating 10x more leads from social media while spending 90% less time on content creation.",
                author: "Jennifer Kim",
                role: "SaaS Marketing Director",
                stat: "10x Lead Generation"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 hover:border-cyan-500/30 transition-all duration-300">
                <p className="text-gray-300 italic mb-6 leading-relaxed">"{testimonial.quote}"</p>
                <div className="flex justify-between items-center pt-6 border-t border-gray-700">
                  <div>
                    <h4 className="font-semibold">{testimonial.author}</h4>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                  <div className="text-cyan-400 font-semibold text-sm">{testimonial.stat}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Consulting Call Section */}
      <section id="consulting" className="py-20 bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-6">Book Your Free 15-Minute Strategy Call</h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Get a personalized automation strategy tailored to your brand and goals. 
                No sales pitch - just actionable insights you can implement immediately.
              </p>
            </div>
            
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 backdrop-blur-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">Full Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-gray-900 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors ${
                        errors.name ? 'border-red-500' : 'border-gray-600'
                      }`}
                      required
                    />
                    {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">Business Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-gray-900 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors ${
                        errors.email ? 'border-red-500' : 'border-gray-600'
                      }`}
                      required
                    />
                    {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="follower_count" className="block text-sm font-medium mb-2">Current Follower Count</label>
                    <select
                      id="follower_count"
                      name="follower_count"
                      value={formData.follower_count}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors"
                    >
                      <option value="">Select range</option>
                      <option value="0-1k">0 - 1,000</option>
                      <option value="1k-10k">1,000 - 10,000</option>
                      <option value="10k-50k">10,000 - 50,000</option>
                      <option value="50k-100k">50,000 - 100,000</option>
                      <option value="100k+">100,000+</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="preferred_call_time" className="block text-sm font-medium mb-2">Preferred Call Time *</label>
                    <input
                      type="datetime-local"
                      id="preferred_call_time"
                      name="preferred_call_time"
                      value={formData.preferred_call_time}
                      onChange={handleInputChange}
                      min={getMinDateTime()}
                      className={`w-full px-4 py-3 bg-gray-900 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors ${
                        errors.preferred_call_time ? 'border-red-500' : 'border-gray-600'
                      }`}
                      required
                    />
                    {errors.preferred_call_time && <p className="text-red-400 text-sm mt-1">{errors.preferred_call_time}</p>}
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="main_goals" className="block text-sm font-medium mb-2">What are your main goals? *</label>
                  <textarea
                    id="main_goals"
                    name="main_goals"
                    value={formData.main_goals}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="e.g., Increase engagement, generate leads, build brand awareness..."
                    className={`w-full px-4 py-3 bg-gray-900 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors resize-vertical ${
                      errors.main_goals ? 'border-red-500' : 'border-gray-600'
                    }`}
                    required
                  />
                  {errors.main_goals && <p className="text-red-400 text-sm mt-1">{errors.main_goals}</p>}
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Request Call'}
                  <Calendar className="w-5 h-5" />
                </button>
              </form>
            ) : (
              <div className="bg-gray-800/50 border border-green-500 rounded-2xl p-8 text-center">
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-green-400 mb-4">Thanks! Casey will reach out within 24 h.</h3>
                <p className="text-gray-300">Check your email for calendar link and preparation materials.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-gray-800/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-300">Everything you need to know about our automation service</p>
          </div>
          <div className="max-w-4xl mx-auto space-y-4">
            {faqData.map((faq, index) => (
              <div key={index} className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-700/30 transition-colors"
                >
                  <span className="font-medium">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 transition-transform ${openFAQ === index ? 'rotate-180' : ''}`} />
                </button>
                {openFAQ === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-gray-700 bg-gray-800/50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold text-cyan-400 mb-4">AutoFlow</h3>
              <p className="text-gray-300">Transforming social media management with intelligent automation.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <div className="space-y-2">
                <button onClick={() => scrollToSection('features')} className="block text-gray-400 hover:text-cyan-400 transition-colors">Features</button>
                <button onClick={() => scrollToSection('faq')} className="block text-gray-400 hover:text-cyan-400 transition-colors">FAQ</button>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <div className="space-y-2">
                <button onClick={() => scrollToSection('consulting')} className="block text-gray-400 hover:text-cyan-400 transition-colors">Contact</button>
                <a href="#" className="block text-gray-400 hover:text-cyan-400 transition-colors">Help Center</a>
                <a href="#" className="block text-gray-400 hover:text-cyan-400 transition-colors">Privacy Policy</a>
              </div>
            </div>
          </div>
          <div className="text-center pt-8 border-t border-gray-700">
            <p className="text-gray-400">&copy; 2025 AutoFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;