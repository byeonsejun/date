// @ts-nocheck
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white flex items-center justify-center mt-3 px-2 py-2 text-xs sm:text-sm text-center leading-tight">
      <p className="whitespace-nowrap max-[370px]:whitespace-normal">
        <span className="max-[370px]:block">{`Copyright © ${currentYear} BYUN SEJUN.`}</span>
        <span className="max-[370px]:block">All Rights Reserved.</span>
      </p>
    </footer>
  );
}
