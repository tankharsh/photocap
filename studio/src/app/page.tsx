'use client';

import { motion } from 'framer-motion';
import { Camera, Aperture, Focus, Play, ArrowRight, Phone, Mail, MapPin, Star, Zap } from 'lucide-react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { apiService } from '@/lib/api';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is already authenticated and redirect to dashboard
    const checkAuth = async () => {
      try {
        const response = await apiService.checkAuth();
        if (response.success) {
          router.push('/dashboard');
        }
      } catch (error) {
        // User not authenticated, stay on home page
        console.log('User not authenticated');
      }
    };

    checkAuth();
  }, [router]);

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const scaleOnHover = {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      <Navbar />
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-16">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-20 left-10 w-2 h-2 bg-purple-400 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 1, 0.3]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute top-40 right-20 w-1 h-1 bg-blue-400 rounded-full"
            animate={{
              scale: [1, 2, 1],
              opacity: [0.2, 0.8, 0.2]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
          <motion.div
            className="absolute bottom-32 left-1/4 w-3 h-3 bg-pink-400 rounded-full"
            animate={{
              scale: [1, 1.8, 1],
              opacity: [0.4, 1, 0.4]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
        </div>

        <div className="text-center z-10 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8"
          >
            <Camera className="w-20 h-20 mx-auto mb-6 text-purple-400" />
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"
            {...fadeInUp}
          >
            PhotoCap Studio
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl mb-8 text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Capture life's most precious moments with professional photography that tells your unique story
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <motion.button
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-4 rounded-full font-semibold text-lg flex items-center gap-2 shadow-lg"
              {...scaleOnHover}
            >
              <Play className="w-5 h-5" />
              Book Session
            </motion.button>
            <motion.button
              className="border-2 border-purple-400 hover:bg-purple-400 hover:text-slate-900 px-8 py-4 rounded-full font-semibold text-lg flex items-center gap-2 transition-colors"
              {...scaleOnHover}
            >
              View Portfolio
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Our Services
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Professional photography services tailored to capture your special moments
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                icon: <Camera className="w-12 h-12" />,
                title: "Portrait Photography",
                description: "Professional headshots and personal portraits that capture your essence"
              },
              {
                icon: <Aperture className="w-12 h-12" />,
                title: "Event Photography",
                description: "Weddings, parties, and special occasions documented beautifully"
              },
              {
                icon: <Focus className="w-12 h-12" />,
                title: "Commercial Shoots",
                description: "Product photography and brand imagery for your business needs"
              }
            ].map((service, index) => (
              <motion.div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center hover:bg-white/20 transition-colors"
                variants={fadeInUp}
                {...scaleOnHover}
              >
                <div className="text-purple-400 mb-4 flex justify-center">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                <p className="text-gray-300">{service.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-black/20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Why Choose Us
            </h2>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                icon: <Star className="w-8 h-8" />,
                title: "5+ Years Experience",
                description: "Professional expertise in photography"
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Quick Turnaround",
                description: "Fast delivery of high-quality images"
              },
              {
                icon: <Camera className="w-8 h-8" />,
                title: "Latest Equipment",
                description: "State-of-the-art camera technology"
              },
              {
                icon: <Focus className="w-8 h-8" />,
                title: "Attention to Detail",
                description: "Every shot crafted to perfection"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="text-center p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20"
                variants={fadeInUp}
                {...scaleOnHover}
              >
                <div className="text-purple-400 mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-300 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              Let's Create Magic Together
            </h2>
            <p className="text-gray-300 text-lg mb-12 max-w-2xl mx-auto">
              Ready to capture your special moments? Get in touch with us today and let's discuss your photography needs.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8 mb-12"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                icon: <Phone className="w-6 h-6" />,
                title: "Call Us",
                info: "+91 98765 43210"
              },
              {
                icon: <Mail className="w-6 h-6" />,
                title: "Email Us",
                info: "hello@photocapstudio.com"
              },
              {
                icon: <MapPin className="w-6 h-6" />,
                title: "Visit Us",
                info: "123 Photography Street, City"
              }
            ].map((contact, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center p-6 rounded-xl bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors"
                variants={fadeInUp}
                {...scaleOnHover}
              >
                <div className="text-purple-400 mb-3">
                  {contact.icon}
                </div>
                <h3 className="font-semibold mb-2">{contact.title}</h3>
                <p className="text-gray-300">{contact.info}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.button
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-12 py-4 rounded-full font-semibold text-lg shadow-lg"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            {...scaleOnHover}
          >
            Get Started Today
          </motion.button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-purple-500/20">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            className="flex items-center justify-center gap-2 mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Camera className="w-6 h-6 text-purple-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              PhotoCap Studio
            </span>
          </motion.div>
          <p className="text-gray-400">
            © 2024 PhotoCap Studio. All rights reserved. Capturing memories, creating art.
          </p>
        </div>
      </footer>
    </div>
  );
}
