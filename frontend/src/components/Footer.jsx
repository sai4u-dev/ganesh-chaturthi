import { MapPin, Phone, Mail, Heart, Share2 } from 'lucide-react';

export default function Footer({ settings, t = (k)=>k }) {
  return (
    <footer className="bg-[#1A0F0F] text-[#FFF8E7] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-[30%] right-[10%] w-[50%] h-[60%] rounded-full bg-[#FF6B00]/10 blur-[80px]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, backgroundSize: '28px 28px' }} />
      </div>

      <div className="relative max-w-[1280px] mx-auto px-4 md:px-6 pt-10 pb-8">
        <div className="grid md:grid-cols-[1.4fr_0.8fr_0.8fr_1fr] gap-8">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF6B00] to-[#FFB000] grid place-items-center text-[#1A0F0F] font-bold">ॐ</div>
              <div className="leading-none">
                <div className="display font-bold text-[16px] tracking-[-0.02em]">KHAIRATABAD GANESH</div>
                <div className="text-[11px] tracking-[0.14em] font-semibold opacity-60">SINCE 1954 • 70TH YEAR</div>
              </div>
            </div>
            <p className="mt-4 text-[13px] leading-relaxed opacity-70 max-w-[420px]">
              Khairatabad Maha Ganesh — Hyderabad’s pride since 1954. 70 feet of devotion, 11 days of celebration, lifelong blessings. Ganpati Bappa Morya!
            </p>
            <div className="mt-5 flex gap-2">
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 grid place-items-center hover:bg-[#FF6B00] transition-colors"><Share2 size={16} /></a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 grid place-items-center hover:bg-[#FF6B00] transition-colors"><Share2 size={16} /></a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 grid place-items-center hover:bg-[#FF6B00] transition-colors"><Share2 size={16} /></a>
            </div>
          </div>

          <div>
            <div className="text-[11px] font-bold tracking-[0.14em] opacity-60 mb-3">EXPLORE</div>
            <div className="space-y-2 text-[13px] opacity-80">
              <a href="#about" className="block hover:text-[#FFB000] transition-colors">{t('nav.about')}</a>
              <a href="#schedule" className="block hover:text-[#FFB000] transition-colors">{t('nav.schedule')}</a>
              <a href="#pooja" className="block hover:text-[#FFB000] transition-colors">{t('nav.pooja')}</a>
              <a href="#annadanam" className="block hover:text-[#FFB000] transition-colors">{t('nav.annadanam')}</a>
              <a href="#nimarjanam" className="block hover:text-[#FFB000] transition-colors">{t('nav.nimajjanam')}</a>
              <a href="#invitation" className="block hover:text-[#FFB000] transition-colors">{t('nav.invitation')}</a>
              <a href="#register" className="block hover:text-[#FFB000] transition-colors">{t('nav.register')}</a>
              <a href="#gallery" className="block hover:text-[#FFB000] transition-colors">{t('nav.gallery')}</a>
            </div>
          </div>

          <div>
            <div className="text-[11px] font-bold tracking-[0.14em] opacity-60 mb-3">COMMITTEE</div>
            <div className="space-y-2 text-[13px] opacity-80">
              <div>Utsav Chairman • Sri Karthik Kowshik</div>
              <div>Treasurer • Sri Ramesh Yadav</div>
              <div>Annadanam • Smt. Lakshmi Devi</div>
              <div className="pt-2"><a href="/admin" className="inline-flex bg-white text-[#1A0F0F] px-4 py-2 rounded-full text-[12px] font-bold hover:bg-[#FFB000] transition-colors">Admin Login →</a></div>
            </div>
          </div>

          <div>
            <div className="text-[11px] font-bold tracking-[0.14em] opacity-60 mb-3">VISIT & CONTACT</div>
            <div className="space-y-3 text-[13px]">
              <div className="flex gap-2.5 opacity-80"><MapPin size={16} className="text-[#FFB000] mt-0.5 shrink-0" /><span>{settings?.venue}<br /><span className="opacity-60">Khairatabad Circle, Hyderabad — 500004<br />Metro: Khairatabad (300m)</span></span></div>
              <a href={`tel:${settings?.contactPhone}`} className="flex gap-2.5 opacity-80 hover:opacity-100"><Phone size={16} className="text-[#FFB000] mt-0.5" />{settings?.contactPhone}</a>
              <a href={`mailto:${settings?.contactEmail}`} className="flex gap-2.5 opacity-80 hover:opacity-100"><Mail size={16} className="text-[#FFB000] mt-0.5" />{settings?.contactEmail}</a>
            </div>

            <div className="mt-4 bg-white/5 border border-white/10 rounded-2xl p-3">
              <div className="text-[11px] font-bold tracking-[0.12em] opacity-60">DARSHAN TIMINGS</div>
              <div className="text-[13px] font-semibold mt-1">5:30 AM — 11:00 PM Daily</div>
              <div className="text-[12px] opacity-60">Free queue • Special darshan ₹50 • Laddu prasadam available</div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-[12px] opacity-60">
          <div>© 2026 Khairatabad Ganesh Utsav Committee. All rights reserved. Made with <Heart size={12} className="inline fill-[#FF6B00] text-[#FF6B00]" /> for Bappa.</div>
          <div className="flex gap-4"><a href="#" className="hover:text-white">Privacy</a><a href="#" className="hover:text-white">Terms</a><span>Design inspired by GSAP • Framer • Awwwards</span></div>
        </div>
      </div>
    </footer>
  );
}
