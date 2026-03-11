'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BookingButton from '@/components/BookingButton';
import { motion } from 'framer-motion';
import { ArrowRight, CalendarCheck, CheckCircle2, ClipboardCheck, Stethoscope, Wind, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const services = [
    { title: 'Asthma Management', icon: <Wind className="w-6 h-6" />, description: 'Personalized asthma care and treatment plans for children.' },
    { title: 'Respiratory Evaluation', icon: <Stethoscope className="w-6 h-6" />, description: 'Comprehensive clinical assessments for respiratory concerns.' },
    { title: 'Diagnostic Testing', icon: <ShieldCheck className="w-6 h-6" />, description: 'Advanced testing including spirometry and FeNO testing.' },
  ];

  return (
    <>
      <Header />
      <main className="flex-grow">
        {/* Modern Branding Bar */}
        <div className="bg-secondary py-8 shadow-xl border-b-4 border-primary/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex flex-col border-l-4 border-primary pl-6">
                <h2 className="text-white font-black tracking-tight text-xl md:text-3xl leading-tight max-w-xl">
                  Children's Lung Asthma <br className="hidden lg:block" /> & Pulmonary Specialists
                </h2>
              </div>
              
              <div className="flex flex-col items-start md:items-end">
                <p className="text-primary font-black tracking-tight text-4xl md:text-6xl leading-none">
                  CLAPS MD
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative bg-slate-50 pt-10 pb-20 lg:pt-16 lg:pb-32 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="max-w-2xl lg:w-1/2"
              >
                <h1 className="text-4xl md:text-6xl font-extrabold text-primary-darker leading-tight mb-6">
                  Helping Kids Breathe Easier&mdash;Every Day
                </h1>
                <p className="text-xl text-gray-700 mb-10 leading-relaxed">
                  Pediatric pulmonology care in Wayne, NJ led by Dr. Farri. Thorough evaluation,
                  diagnosis, personalized plans for breathing concerns: asthma, chronic cough, wheezing, and
                  exercise-induced asthma.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <BookingButton className="btn-primary text-lg px-8 py-4 flex items-center justify-center">
                    Request an Appointment <ArrowRight className="ml-2 w-5 h-5" />
                  </BookingButton>
                  <a href="tel:9739490270" className="btn-secondary text-lg px-8 py-4 flex items-center justify-center">
                    Call Now
                  </a>
                </div>

                <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-white border border-gray-100 rounded-xl p-4 flex items-center shadow-sm">
                    <Wind className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                    <span className="text-sm font-semibold text-secondary">Asthma &amp; breathing expertise</span>
                  </div>
                  <div className="bg-white border border-gray-100 rounded-xl p-4 flex items-center shadow-sm">
                    <ClipboardCheck className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                    <span className="text-sm font-semibold text-secondary">Thorough evaluation</span>
                  </div>
                  <div className="bg-white border border-gray-100 rounded-xl p-4 flex items-center shadow-sm">
                    <CalendarCheck className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                    <span className="text-sm font-semibold text-secondary">Easy scheduling</span>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="w-full lg:w-1/2 relative"
              >
                <div className="relative w-full h-[350px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                  <Image 
                    src="/images/hero-image.webp"
                    alt="Pediatric Pulmonology Care"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                {/* Decorative blob behind image */}
                <div className="absolute -z-10 -bottom-6 -right-6 w-full h-full bg-primary/20 rounded-2xl"></div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Quick Info Bar */}
        <section className="bg-white border-y border-gray-100 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex items-center space-x-4">
                <div className="bg-lime-50 p-3 rounded-full text-primary">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-primary-darker text-lg">Board Certified</h3>
                  <p className="text-gray-500">Pediatric Pulmonology</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-lime-50 p-3 rounded-full text-primary">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-primary-darker text-lg">Personalized Care</h3>
                  <p className="text-gray-500">Tailored Treatment Plans</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-lime-50 p-3 rounded-full text-primary">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-primary-darker text-lg">Modern Diagnostics</h3>
                  <p className="text-gray-500">Advanced Respiratory Testing</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Highlight */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-primary-darker mb-4">Our Specialized Services</h2>
              <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Comprehensive care for children with complex respiratory needs and lung conditions.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <motion.div 
                  key={service.title}
                  whileHover={{ y: -5 }}
                  className="bg-white p-8 rounded-xl shadow-sm border border-gray-100"
                >
                  <div className="text-primary mb-4">{service.icon}</div>
                  <h3 className="text-xl font-bold text-primary-darker mb-3">{service.title}</h3>
                  <p className="text-gray-600 mb-6">{service.description}</p>
                  <Link href="/about#conditions" className="text-primary font-semibold flex items-center hover:underline">
                    Learn More <ArrowRight className="ml-1 w-4 h-4" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Meet the Doctor Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center gap-16">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="w-full md:w-2/5"
              >
                <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-xl">
                  <Image 
                    src="/images/SHADE_FARRI.jpg"
                    alt="Dr. Folashade Farri"
                    fill
                    className="object-cover"
                  />
                </div>
              </motion.div>
              <div className="w-full md:w-3/5">
                <h2 className="text-3xl font-bold text-primary-darker mb-2">Meet Our Specialist</h2>
                <h3 className="text-2xl font-semibold text-primary mb-6">Folashade Farri, MD</h3>
                <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                  Dr. Folashade Farri is a Board-Certified Pediatric Pulmonologist dedicated to providing exceptional care for children with respiratory and lung conditions. With years of experience and a compassionate approach, she focuses on personalized treatment plans that help every child breathe easier.
                </p>
                <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                  At CLAPS MD, we believe in a collaborative approach, working closely with families and primary care physicians to ensure the best possible outcomes for our young patients.
                </p>
                <Link href="/about" className="btn-primary inline-flex items-center">
                  Learn More About Dr. Farri <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
