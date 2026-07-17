import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '../components/layout/Navbar';

export const metadata: Metadata = {
  title: 'CS Course Simulator',
  description: 'Plan your computer science degree with our prerequisite simulator',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th">
      <body>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
