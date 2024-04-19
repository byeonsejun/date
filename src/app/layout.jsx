import { Jua } from 'next/font/google';
import './common.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SWRConfigContext from '@/context/SWRConfigContext';

const juaFont = Jua({ weight: '400', subsets: ['latin'], display: 'swap' });

export const metadata = {
  title: {
    default: '서울, 너와 함께',
    template: '서울에서 즐기는 데이트의 모든 것 | %s',
  },
  description: '서울에서 즐기는 데이트, 식사 그 모든 계획을 한 번에!',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={juaFont.className}>
      <body className="w-full h-full flex flex-col max-w-[2560px] m-auto">
        <Header />
        <main className="grow">
          <SWRConfigContext>{children}</SWRConfigContext>
        </main>
        <Footer />
        <div id="portal" />
        {/* <div id="pre_loader" /> */}
      </body>
    </html>
  );
}
