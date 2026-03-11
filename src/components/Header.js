'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Menu, X, Phone } from 'lucide-react';
import { useState, useEffect } from 'react';

const PATIENT_PORTAL_URL = 'https://phr.charmtracker.com/login.sas?FACILITY_ID=3a3047be28b32bf95dac27bd660a2fb90a976cc644c8922b2e62fe42203ae47ddda3124f8ffc5ce6';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    const handleOpenBooking = () => setIsBookingOpen(true);
    window.addEventListener('open-booking', handleOpenBooking);
    return () => window.removeEventListener('open-booking', handleOpenBooking);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'PFT Lab', href: '/pft-lab' },
    { name: 'Insurance', href: '/insurance-billing' },
    { name: 'Blog', href: '/blog' },
    { name: 'FAQ', href: '/asthma' },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center">
              <div className="relative h-12 w-40 lg:h-14 lg:w-48">
                <Image 
                  src="/images/clapsmd-logo-high-res.jpg" 
                  alt="C.L.A.P.S. MD Logo" 
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </Link>
          </div>
          
          {/* Desktop Nav */}
          <nav className="hidden lg:flex space-x-5 xl:space-x-7">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className="text-secondary hover:text-primary transition-colors font-semibold whitespace-nowrap"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center space-x-3 shrink-0">
            <a href="tel:9739490270" className="hidden xl:flex items-center text-secondary font-bold whitespace-nowrap">
              <Phone className="w-4 h-4 mr-2" />
              (973) 949-0270
            </a>
            <a
              href={PATIENT_PORTAL_URL}
              className="btn-secondary whitespace-nowrap"
            >
              Patient Portal
            </a>
            <button
              type="button"
              className="btn-primary whitespace-nowrap"
              onClick={() => setIsBookingOpen(true)}
            >
              Book Appointment
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-secondary p-2">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block px-3 py-2 text-secondary hover:text-primary font-medium"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <button
              type="button"
              className="block w-full text-center mt-4 btn-primary"
              onClick={() => {
                setIsOpen(false);
                setIsBookingOpen(true);
              }}
            >
              Book Appointment
            </button>
            <a
              href={PATIENT_PORTAL_URL}
              className="block w-full text-center mt-3 btn-secondary"
              onClick={() => setIsOpen(false)}
            >
              Patient Portal
            </a>
          </div>
        </div>
      )}

      {isBookingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
          <button
            type="button"
            aria-label="Close booking dialog"
            className="absolute inset-0 bg-black/60"
            onClick={() => setIsBookingOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Book appointment"
            className="relative w-full max-w-5xl bg-white rounded-lg shadow-xl overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
              <p className="font-semibold text-secondary">Book Appointment</p>
              <button
                type="button"
                className="text-secondary hover:text-primary"
                onClick={() => setIsBookingOpen(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="h-[70vh]">
              <iframe
                title="Charm EHR Appointment Calendar"
                src="https://ehr.charmtracker.com/publicCal.sas?method=getCal&digest=0a976cc644c8922b6c8060cc13dcf53af3eeb6536be960d96cfa02efab7fba892da6cec48e5020f06eec1d4734870ae7debf17855dc5f624"
                width="100%"
                height="100%"
                style={{ overflow: 'hidden' }}
                frameBorder="0"
              />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
