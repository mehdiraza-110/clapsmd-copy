'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BookingButton from '@/components/BookingButton';
import PatientActionButtons from '@/components/PatientActionButtons';
import { GOOGLE_REVIEWS_URL, homepageReviews } from '@/lib/homepageReviews';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, ChevronLeft, ChevronRight, ClipboardCheck, HeartHandshake, PlayCircle, Quote, ShieldCheck, Stethoscope, Wind } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const [activeReview, setActiveReview] = useState(0);
  const services = [
    { title: 'Asthma Management', icon: <Wind className="w-6 h-6" />, description: 'Personalized asthma care and treatment plans for children.' },
    { title: 'Respiratory Evaluation', icon: <Stethoscope className="w-6 h-6" />, description: 'Comprehensive clinical assessments for respiratory concerns.' },
    { title: 'Diagnostic Testing', icon: <ShieldCheck className="w-6 h-6" />, description: 'Advanced testing including spirometry and FeNO testing.' },
  ];
  const reviewSlides = homepageReviews.slice(0, 5);
  const goToPreviousReview = () => {
    setActiveReview((current) => (current === 0 ? reviewSlides.length - 1 : current - 1));
  };

  const goToNextReview = () => {
    setActiveReview((current) => (current === reviewSlides.length - 1 ? 0 : current + 1));
  };

  const currentReview = reviewSlides[activeReview];
  const reviewInitials = currentReview.author
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('');

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
                  At CLAPS MD, we care for children with recurrent breathing problems&mdash;frequent
                  cough, wheezing, asthma flare-ups, and unexplained respiratory symptoms. We help
                  families move from repeated urgent care visits and uncertainty to a clear
                  diagnosis, a personalized treatment plan, and long-term stability. Our goal is
                  simple: fewer emergencies, fewer oral steroids, stronger lungs, and children who
                  can breathe easier and play without limits.
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
                    <Stethoscope className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                    <span className="text-sm font-semibold text-secondary">State-of-the-Art Respiratory Medicine</span>
                  </div>
                  <div className="bg-white border border-gray-100 rounded-xl p-4 flex items-center shadow-sm">
                    <ClipboardCheck className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                    <span className="text-sm font-semibold text-secondary">Comprehensive, Root-Cause Evaluations</span>
                  </div>
                  <div className="bg-white border border-gray-100 rounded-xl p-4 flex items-center shadow-sm">
                    <HeartHandshake className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                    <span className="text-sm font-semibold text-secondary">Compassionate, Family-Centered Support</span>
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
                    src="/images/hero-image.png"
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
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="relative mb-4 flex aspect-video items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50">
                  <PlayCircle className="w-10 h-10 text-primary" />
                  <span className="absolute bottom-3 right-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-secondary">
                    Video
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-lime-50 p-3 rounded-full text-primary">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-primary-darker text-lg">Board Certified</h3>
                    <p className="text-gray-500">Pediatric Pulmonology</p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="relative mb-4 flex aspect-video items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50">
                  <PlayCircle className="w-10 h-10 text-primary" />
                  <span className="absolute bottom-3 right-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-secondary">
                    Video
                  </span>
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
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="relative mb-4 flex aspect-video items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50">
                  <PlayCircle className="w-10 h-10 text-primary" />
                  <span className="absolute bottom-3 right-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-secondary">
                    Video
                  </span>
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

        <section className="bg-secondary py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="max-w-2xl">
                <p className="text-sm font-black uppercase tracking-[0.24em] text-primary">Mid-Page Appointment Options</p>
                <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
                  Ready to schedule care or speak with the office?
                </h2>
                <p className="mt-4 text-white/80 leading-8">
                  Choose the fastest next step for office visits, pulmonary testing, telehealth scheduling, referrals, or direct phone support.
                </p>
              </div>
              <PatientActionButtons
                items={['request_appointment', 'schedule_pft']}
              />
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
                    src="/images/Dr Farri_white coat.jpeg"
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
                <div className="flex flex-wrap gap-4">
                  <Link href="/about" className="btn-primary inline-flex items-center">
                    Learn More About Dr. Farri <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                  <BookingButton className="btn-secondary inline-flex items-center">
                    Request Appointment <ArrowRight className="ml-2 w-5 h-5" />
                  </BookingButton>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-3xl font-bold text-primary-darker mb-4">What Families Are Saying</h2>
              <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Families value clear communication, a comfortable visit experience, and care that feels personal from start to finish.
              </p>
            </div>

            <div className="mx-auto max-w-4xl">
              <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                <AnimatePresence mode="wait">
                  <motion.blockquote
                    key={currentReview.author}
                    initial={{ opacity: 0, x: 28 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -28 }}
                    transition={{ duration: 0.35 }}
                    className="relative"
                  >
                    <div className="mb-6 flex items-center gap-4">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-sm font-black text-primary">
                        {reviewInitials}
                      </div>
                      <div>
                        <p className="font-semibold uppercase tracking-[0.18em] text-secondary">
                          {currentReview.author}
                        </p>
                        <p className="mt-1 text-sm text-primary">
                          {'★'.repeat(currentReview.rating)}
                        </p>
                      </div>
                    </div>
                    <p className="text-lg leading-8 text-gray-700">
                      &ldquo;{currentReview.quote}&rdquo;
                    </p>
                  </motion.blockquote>
                </AnimatePresence>
              </div>

              <div className="mt-6 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={goToPreviousReview}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-secondary transition-colors hover:border-slate-300 hover:bg-slate-50"
                  aria-label="Previous review"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                <div className="flex items-center gap-2">
                  {reviewSlides.map((item, index) => (
                    <button
                      key={item.author}
                      type="button"
                      onClick={() => setActiveReview(index)}
                      className={`h-2.5 rounded-full transition-all ${
                        index === activeReview ? 'w-8 bg-primary' : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                      }`}
                      aria-label={`Go to review ${index + 1}`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={goToNextReview}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-secondary transition-colors hover:border-slate-300 hover:bg-slate-50"
                  aria-label="Next review"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-8 text-center">
                <a
                  href={GOOGLE_REVIEWS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-md bg-secondary px-6 py-3 font-semibold text-white transition-colors hover:bg-secondary/90"
                >
                  See All Reviews
                </a>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
