/** Tombol chat WhatsApp melayang di pojok kanan bawah. */
export function FloatingWa({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat admin lewat WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-wa py-3 pl-3.5 pr-4 text-sm font-semibold text-white shadow-lg shadow-black/20"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M4 20l1.3-3.9A8 8 0 1 1 8 19z" />
        <path d="M9 9.5c0 2.8 2.7 5.5 5.5 5.5l1.2-1.4-1.9-1-1 .9a3.8 3.8 0 0 1-2.3-2.3l.9-1-1-1.9z" />
      </svg>
      <span className="hidden sm:inline">Tanya admin</span>
    </a>
  );
}
