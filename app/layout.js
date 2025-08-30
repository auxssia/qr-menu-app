import { Inter } from 'next/font/google'; // Import the Inter font
import './globals.css';

// Configure the font with the weights you need
const inter = Inter({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'], 
});

export const metadata = {
  title: 'SwiftOrder', // Updated title
  description: 'A modern QR ordering solution.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}