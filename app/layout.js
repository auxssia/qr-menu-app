import { Akshar } from 'next/font/google';
import './globals.css';

const akshar = Akshar({ 
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

export const metadata = {
  title: 'QR Restaurant Menu',
  description: 'Order from your table.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={akshar.className}>{children}</body>
    </html>
  );
}