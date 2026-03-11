import { Jua } from 'next/font/google';
import './common.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SWRConfigContext from '@/context/SWRConfigContext';
import LocationConsentModal from '@/components/LocationConsentModal';
import SeoulOnlyToast from '@/components/SeoulOnlyToast';

const juaFont = Jua({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jua',
  preload: false, // 한글 포함 전체 폰트 로드 (subset만 쓰면 한글 미표시 가능)
});

export const metadata = {
  title: {
    default: '서울, 너와 함께',
    template: '서울에서 즐기는 데이트의 모든 것 | %s',
  },
  description: '서울에서 즐기는 데이트, 식사 그 모든 계획을 한 번에!',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko" className={`${juaFont.variable} ${juaFont.className}`}>
      <head>
        <link rel="preconnect" href="https://mapsresources-pa.googleapis.com" />
      </head>
      <body className="w-full h-full flex flex-col max-w-[2560px] m-auto">
        <Header />
        <main className="grow overflow-hidden">
          <SWRConfigContext>{children}</SWRConfigContext>
        </main>
        <Footer />
        <div id="portal" />
        <LocationConsentModal />
        <SeoulOnlyToast />
      </body>
    </html>
  );
}
