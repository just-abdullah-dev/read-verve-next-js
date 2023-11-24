import { Inter } from 'next/font/google'
import './globals.css'
import ReduxProvider from '@/store/ReduxProvider'
import Header from '@/components/Server/Header/Header';
import Footer from '@/components/Server/Footer/Footer';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Read Verve',
  description: 'This is my first website in nextjs. In Shaa Allah, I will complete this whole project.',
}

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Here "Redux Provider" also includes @tanstack/queryClientProvider  */}
        <ReduxProvider>
            <>
              <Header />
              {children}
              <Footer />
              <Toaster />
            </>
        </ReduxProvider>
      </body>
    </html>
  )
}
