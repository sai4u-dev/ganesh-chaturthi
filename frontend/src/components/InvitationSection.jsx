import { useRef, useEffect, useState, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Share2, Copy, Check, Download, MapPin, Calendar, Clock, QrCode, MessageCircle } from 'lucide-react';
gsap.registerPlugin(ScrollTrigger);

export default function InvitationSection({ settings, t }) {
  const ref = useRef(null);
  const [copied, setCopied] = useState(false);

  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://khairatabadganesh.com';
  const shareText = encodeURIComponent(
    `🙏 ${t('invitation.message')}\n\n📅 ${settings?.startDate ? new Date(settings.startDate).toLocaleDateString('en-IN') : 'Sep 14'} — ${settings?.endDate ? new Date(settings.endDate).toLocaleDateString('en-IN') : 'Sep 24, 2026'}\n📍 ${settings?.venue || 'Khairatabad, Hyderabad'}\n🪔 Pooja: 5:30 AM — 11 PM Daily\n\n🔗 ${siteUrl}`
  );

  const qrUrl = useMemo(() => `https://quickchart.io/qr?text=${encodeURIComponent(siteUrl)}&size=300&dark=6D071A&centerImageUrl=https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f549.png`, [siteUrl]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.invite-card', { y: 24, opacity: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out', scrollTrigger: { trigger: ref.current, start: 'top 80%' } });
    }, ref);
    return () => ctx.revert();
  }, []);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(siteUrl);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section ref={ref} id="invitation" className="py-12 md:py-16 bg-white relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[50%] bg-gradient-to-b from-[#FFF3D4] to-transparent" />
      </div>
      <div className="relative max-w-[1280px] mx-auto px-4 md:px-6">
        <div className="text-center max-w-[760px] mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#FFF3D4] border border-[#F0D9B5] px-3 py-1.5 rounded-full text-[11px] font-bold tracking-[0.14em] text-[#FF6B00]"><QrCode size={14} /> DIGITAL INVITATION • SHARE VIA WHATSAPP / QR</div>
          <h2 className="display font-[750] text-[32px] md:text-[44px] leading-[0.9] tracking-[-0.03em] text-[#1A0F0F] mt-3">{t('invitation.title')}</h2>
          <p className="mt-3 text-[14px] text-[#8B7355]">{t('invitation.subtitle')}</p>
        </div>

        <div className="mt-8 grid lg:grid-cols-[1.15fr_0.85fr] gap-6 items-stretch">
          {/* Invitation Card - printable aesthetic */}
          <div className="invite-card relative bg-[#FFF8E7] rounded-[24px] overflow-hidden border border-[#F0D9B5] shadow-[0_20px_60px_rgba(109,7,26,0.10)]">
            {/* gold ornamental top */}
            <div className="h-2 bg-gradient-to-r from-[#FF6B00] via-[#FFB000] to-[#FF6B00]" />
            <div className="absolute top-6 right-6 opacity-10 text-[80px] leading-none select-none">🪔</div>
            <div className="p-6 md:p-8 relative">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-[#FF6B00] to-[#6D071A] grid place-items-center text-white text-[20px]">ॐ</div>
                <div className="mt-3 display font-bold text-[11px] tracking-[0.18em] text-[#FF6B00]">SHREE GANESHAYA NAMAH</div>
                <h3 className="display font-[800] text-[22px] md:text-[26px] leading-none tracking-[-0.02em] text-[#6D071A] mt-2">{settings?.heroTitle || '॥ Ganpati Bappa Morya ॥'}</h3>
                <div className="text-[13px] font-semibold text-[#1A0F0F] mt-1">{t('invitation.teluguTitle')}</div>
                <div className="mx-auto mt-3 w-20 h-px bg-gradient-to-r from-transparent via-[#FFB000] to-transparent" />
              </div>

              <div className="mt-6 bg-white border border-[#F0D9B5]/70 rounded-2xl p-5 text-center">
                <p className="text-[15px] leading-relaxed text-[#1A0F0F] font-medium">{t('invitation.message')}</p>
                <div className="mt-4 grid md:grid-cols-3 gap-3 text-[12px]">
                  <div className="bg-[#FFF8E7] border border-[#F0D9B5] rounded-2xl p-3">
                    <div className="flex items-center justify-center gap-1.5 font-bold text-[#6D071A]"><Calendar size={14} className="text-[#FF6B00]" /> Dates</div>
                    <div className="font-bold text-[#1A0F0F] mt-1">{settings?.startDate ? new Date(settings.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long' }) : 'Sep 14'} — {settings?.endDate ? new Date(settings.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Sep 24, 2026'}</div>
                    <div className="text-[#8B7355]">11 Days • 5:30 AM — 11 PM</div>
                  </div>
                  <div className="bg-[#FFF8E7] border border-[#F0D9B5] rounded-2xl p-3">
                    <div className="flex items-center justify-center gap-1.5 font-bold text-[#6D071A]"><MapPin size={14} className="text-[#FF6B00]" /> Location</div>
                    <div className="font-bold text-[#1A0F0F] mt-1">{settings?.venue || 'Khairatabad, Hyderabad'}</div>
                    <div className="text-[#8B7355]">Near Khairatabad Circle</div>
                  </div>
                  <div className="bg-[#FFF8E7] border border-[#F0D9B5] rounded-2xl p-3">
                    <div className="flex items-center justify-center gap-1.5 font-bold text-[#6D071A]"><Clock size={14} className="text-[#FF6B00]" /> Timings</div>
                    <div className="font-bold text-[#1A0F0F] mt-1">Aarti: 12 PM & 7 PM</div>
                    <div className="text-[#8B7355]">Annadanam: 12–3 PM</div>
                  </div>
                </div>
              </div>

              <div className="mt-5 text-center">
                <div className="text-[11px] font-bold tracking-[0.12em] text-[#8B7355]">ORGANIZED BY</div>
                <div className="font-bold text-[#1A0F0F]">Khairatabad Ganesh Utsav Committee • Since 1954</div>
                <div className="text-[12px] text-[#8B7355]">Contact: {settings?.contactPhone} • {settings?.contactEmail}</div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2 justify-center">
                <span className="px-3 py-1 rounded-full bg-[#1A0F0F] text-white text-[11px] font-bold tracking-wide">70TH YEAR</span>
                <span className="px-3 py-1 rounded-full bg-[#FFB000] text-[#1A0F0F] text-[11px] font-bold tracking-wide">FREE DARSHAN FOR ALL</span>
                <span className="px-3 py-1 rounded-full bg-white border border-[#F0D9B5] text-[#6D071A] text-[11px] font-bold">Ekadasha Rudra Avatar</span>
              </div>
            </div>
            <div className="h-2 bg-gradient-to-r from-[#FF6B00] via-[#FFB000] to-[#FF6B00]" />
          </div>

          {/* Share + QR */}
          <div className="flex flex-col gap-4">
            <div className="invite-card bg-[#1A0F0F] text-white rounded-[24px] p-6 relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#FF6B00]/20 rounded-full blur-2xl" />
              <div className="relative">
                <h4 className="font-bold text-[18px] flex items-center gap-2"><Share2 size={18} className="text-[#FFB000]" /> Share Instantly</h4>
                <p className="text-[13px] text-white/70 mt-1">One link for WhatsApp, Instagram, Facebook — or print the QR on a small banner instead of hundreds of cards.</p>

                <div className="mt-5 grid gap-3">
                  <a href={`https://wa.me/?text=${shareText}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 bg-[#25D366] text-white px-5 py-3.5 rounded-full font-bold text-[14px] hover:bg-[#1DA851] transition-colors">
                    <MessageCircle size={18} className="fill-white" /> {t('invitation.shareWhatsApp')}
                  </a>
                  <div className="grid grid-cols-2 gap-3">
                    <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(siteUrl)}`} target="_blank" rel="noreferrer" className="bg-white text-[#1A0F0F] px-4 py-3 rounded-full font-bold text-[13px] text-center hover:bg-[#FFF3D4]">Facebook</a>
                    <button onClick={handleCopy} className="bg-white/10 border border-white/20 text-white px-4 py-3 rounded-full font-bold text-[13px] flex items-center justify-center gap-2 hover:bg-white hover:text-[#1A0F0F] transition-colors">
                      {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? 'Copied!' : t('invitation.copyLink')}
                    </button>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center gap-3">
                    <div className="text-[11px] font-mono break-all opacity-70 flex-1">{siteUrl}</div>
                    <button onClick={handleCopy} className="w-9 h-9 rounded-full bg-white text-[#1A0F0F] grid place-items-center shrink-0"><Copy size={14} /></button>
                  </div>
                </div>
              </div>
            </div>

            <div className="invite-card bg-white border border-[#F0D9B5] rounded-[24px] p-6 text-center">
              <div className="text-[11px] font-bold tracking-[0.12em] text-[#8B7355]">{t('invitation.scanQR')}</div>
              <div className="mt-3 bg-[#FFF8E7] border border-[#F0D9B5] rounded-2xl p-4 inline-block">
                {qrUrl ? (
                  <img src={qrUrl} alt="QR Code" className="w-[160px] h-[160px] object-contain mx-auto rounded-xl bg-white p-2" />
                ) : (
                  <div className="w-[160px] h-[160px] grid place-items-center text-[#8B7355]"><QrCode size={48} /></div>
                )}
              </div>
              <div className="mt-3 flex gap-2 justify-center">
                <a href={qrUrl} download="ganesh-invitation-qr.png" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-[#1A0F0F] text-white px-5 py-2.5 rounded-full text-[13px] font-bold hover:bg-black"><Download size={14} /> {t('invitation.downloadQR')}</a>
                <a href={`https://wa.me/?text=${shareText}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-[#FF6B00] text-white px-5 py-2.5 rounded-full text-[13px] font-bold hover:bg-[#E65100]"><MessageCircle size={14} /> WhatsApp</a>
              </div>
              <p className="mt-3 text-[11px] text-[#8B7355]">Print this QR on a banner at entrance — devotees scan to get full schedule, pooja timings & maps.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
