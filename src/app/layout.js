import './globals.css';
import "jodit/es2021/jodit.min.css";
import { Inter } from 'next/font/google';
import { buildPageMetadata } from '@/lib/seoMetadata';
import AnnouncementsWidget from '@/components/AnnouncementsWidget';

const inter = Inter({ subsets: ['latin'] });

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata = buildPageMetadata({
  title: "Children's Lung Asthma & Pulmonary Specialists | C.L.A.P.S. MD",
  description:
    "Pediatric pulmonology practice in Wayne, NJ and Northern New Jersey, providing specialized care for asthma and lung conditions.",
  path: "/",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          {children}
        </div>
        <AnnouncementsWidget />
      </body>
    </html>
  );
}
