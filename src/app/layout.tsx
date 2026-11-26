// @ts-nocheck
import { Jua, Noto_Sans_JP, Noto_Sans_SC } from 'next/font/google';
import './common.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SWRConfigContext from '@/context/SWRConfigContext';
import I18nProvider from '@/context/I18nProvider';
import LocationConsentModal from '@/components/LocationConsentModal';
import SeoulOnlyToast from '@/components/SeoulOnlyToast';
import { buildRootMetadata, isPreviewDeployment } from '@/utils/seo';

const juaFont = Jua({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jua',
});

/**
 * 일본어용 폰트. Jua(한국어 디스플레이 폰트)는 区/園/々 등 일본어 글리프 상당수를 포함하지
 * 않아, 일본어에서는 글자별 시스템 폴백으로 폰트가 섞이거나 자형이 어긋난다.
 * 일본어 선택 시(common.css의 html[lang='ja']) 본문 전체를 이 폰트로 전환한다.
 * (CJK 대용량 폰트라 preload는 끄고 표시 문자에 대해서만 unicode-range 청크를 지연 로드)
 */
const notoSansJp = Noto_Sans_JP({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-noto-jp',
  preload: false,
});

/**
 * 중국어(간체)용 폰트. Jua는 关/无/东/铜/龙 등 간체 글리프를 포함하지 않아,
 * 중국어 선택 시(common.css의 html[lang='zh']) 본문 전체를 Noto Sans SC로 전환한다.
 * (일본어 Noto Sans JP와 동일 정책 — CJK 대용량이라 preload 끄고 지연 로드)
 */
const notoSansSc = Noto_Sans_SC({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-noto-sc',
  preload: false,
});

export const metadata = buildRootMetadata(isPreviewDeployment(process.env.VERCEL_ENV));

export default function RootLayout({ children }) {
  return (
    <html
      lang="ko"
      className={`${juaFont.variable} ${notoSansJp.variable} ${notoSansSc.variable} ${juaFont.className}`}
    >
      <body className="w-full min-h-screen flex flex-col max-w-[2560px] m-auto">
        <I18nProvider>
          <Header />
          <main className="grow overflow-visible lg:overflow-hidden">
            <SWRConfigContext>{children}</SWRConfigContext>
          </main>
          <Footer />
          <div id="portal" />
          <LocationConsentModal />
          <SeoulOnlyToast />
        </I18nProvider>
      </body>
    </html>
  );
}
