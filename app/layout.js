import { Akshar } from 'next/font/google'; // Import the font
import './globals.css';

// Configure the font
const akshar = Akshar({ 
  subsets: ['latin'],
  weight: ['400', '500', '700'], // Specify the weights you need
});

export const metadata = {
  title: 'QR Restaurant Menu',
  description: 'Order from your table.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* Apply the font class to the body */}
      <body className={akshar.className}>{children}</body>
    </html>
  );
}