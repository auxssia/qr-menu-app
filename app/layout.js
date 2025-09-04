import { Inter } from 'next/font/google';
import './globals.css';
import './application.css'; // Your main app stylesheet

const inter = Inter({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'], 
});

export const metadata = {
  title: 'komify',
  description: 'A modern QR ordering solution.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}