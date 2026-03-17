import Link from 'next/link';
import Image from 'next/image';
import { MapPin } from 'lucide-react';
import { resourceLinks } from '@/lib/navigation';

const INSTAGRAM_URL = 'https://www.instagram.com/shade.farri/?fbclid=IwY2xjawP5kw9leHRuA2FlbQIxMQBicmlkETE0TXBDR2xyVDlZYVl6VHk0c3J0YwZhcHBfaWQBMAABHnN5NqxqHeHvr77zOv5uIz65wkt2CQgHMHGe-YZZE00xONxT5gO_FBqhILJK_aem_0FN07TUHhPbC0KuG3tIPOw';
const FACEBOOK_URL = 'https://www.facebook.com/profile.php?id=61567195066725';
const YOUTUBE_URL = 'https://www.youtube.com/@CLAPS_MD';

const Footer = () => {
  return (
    <footer className="bg-secondary text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1">
            <div className="relative h-20 w-full mb-6 brightness-0 invert opacity-90">
              <Image 
                src="/images/C.L.A.P.S-MD_d00b_00a.png" 
                alt="C.L.A.P.S. MD Logo" 
                fill
                className="object-contain object-left"
              />
            </div>
            <div className="text-gray-400 group">
              <a 
                href="https://www.google.com/maps/dir/?api=1&destination=2025+Hamburg+Turnpike+Suite+H+Wayne+NJ+07470" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors flex items-start"
              >
                <MapPin className="w-5 h-5 mr-2 mt-1 flex-shrink-0 text-primary" />
                <div className="text-sm leading-tight">
                  <p>2025 Hamburg Turnpike, Suite H</p>
                  <p>Wayne, NJ 07470</p>
                </div>
              </a>
            </div>
          </div>
          <div>
            <h3 className="font-bold mb-6 text-lg">Contact Us</h3>
            <ul className="space-y-4 text-gray-400">
              <li><span className="text-white block font-semibold">Phone:</span> (973) 949-0270</li>
              <li><span className="text-white block font-semibold">Fax:</span> (973) 310-7031</li>
              <li><span className="text-white block font-semibold">Email:</span> info@clapsmd.org</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-6 text-lg">Hours</h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="flex justify-between"><span>Monday:</span> <span>9:00 AM - 4:00 PM</span></li>
              <li className="flex justify-between"><span>Tuesday:</span> <span>9:00 AM - 4:00 PM</span></li>
              <li className="flex justify-between text-gray-500 italic"><span>Wednesday:</span> <span>Closed</span></li>
              <li className="flex justify-between"><span>Thursday:</span> <span>9:00 AM - 4:00 PM</span></li>
              <li className="flex justify-between"><span>Friday:</span> <span>9:00 AM - 4:00 PM</span></li>
              <li className="flex justify-between text-gray-500 italic"><span>Sat - Sun:</span> <span>Closed</span></li>
            </ul>
          </div>
          <div className="md:pl-8">
            <h3 className="font-bold mb-6 text-lg">Quick Links</h3>
            <ul className="space-y-4 text-gray-400">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/about#conditions" className="hover:text-white transition-colors">Services</Link></li>
              <li><Link href="/pft-lab" className="hover:text-white transition-colors">PFT Lab</Link></li>
              {resourceLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-white font-semibold">Follow Us</p>
            <div className="mt-3 flex flex-wrap gap-4 text-gray-400 text-sm">
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                Facebook
              </a>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                Instagram
              </a>
              <a
                href={YOUTUBE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                YouTube
              </a>
            </div>
          </div>
          <p className="text-gray-400">&copy; {new Date().getFullYear()} C.L.A.P.S. MD. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
