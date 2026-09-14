import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, Phone, Mail, Clock, Navigation, Users } from 'lucide-react';
gsap.registerPlugin(ScrollTrigger);

export default function ContactSection({ settings, t }) {
  const ref = useRef(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.contact-card', { y: 20, opacity: 0, stagger: 0.08, duration: 0.6, ease: 'power2.out', scrollTrigger: { trigger: ref.current, start: 'top 80%' } });
    }, ref);
    return () => ctx.revert();
  }, []);

  const organizers = [
    { name: 'Sri Karthik Kowshik', role: 'Utsav Chairman', phone: '+91 98765 43210', img: 'https://i.pravatar.cc/300?img=12' },
    { name: 'Sri Ramesh Yadav', role: 'Treasurer', phone: '+91 98765 43211', img: 'https://i.pravatar.cc/300?img=15' },
    { name: 'Smt. Lakshmi Devi', role: 'Annadanam In-charge', phone: '+91 98765 43212', img: 'https://i.pravatar.cc/300?img=32' },
    { name: 'Sri Suresh Kumar', role: 'Pooja Committee Head', phone: '+91 98765 43213', img: 'https://i.pravatar.cc/300?img=18' },
  ];

  return (
    <section ref={ref} id="contact" className="py-12 md:py-16 bg-white">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.16em] text-[#FF6B00]"><MapPin size={14} /> {t('contact.mapTitle')}</div>
            <h2 className="display font-[750] text-[32px] md:text-[44px] leading-[0.9] tracking-[-0.03em] text-[#1A0F0F]">{t('contact.title')}</h2>
            <p className="mt-2 text-[14px] text-[#8B7355]">Reach us for passes, sponsorship, or any help — 24/7 helpline during utsav.</p>
          </div>
          <a href={`https://wa.me/919876543210?text=${encodeURIComponent('Namaste, I need details about Khairatabad Ganesh Utsav 2026')}`} target="_blank" rel="noreferrer" className="hidden md:inline-flex items-center gap-2 bg-[#25D366] text-white px-5 py-3 rounded-full text-[13px] font-bold hover:bg-[#1DA851]">WhatsApp Helpline • 24/7</a>
        </div>

        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6">
          <div className="space-y-4">
            <div className="contact-card bg-[#1A0F0F] text-white rounded-[24px] p-6 relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#FF6B00]/20 rounded-full blur-2xl" />
              <div className="relative">
                <h3 className="font-bold text-[16px] flex items-center gap-2"><Navigation size={18} className="text-[#FFB000]" /> {t('contact.reach')}</h3>
                <div className="mt-4 grid gap-3 text-[13px]">
                  <div className="flex gap-3"><MapPin size={16} className="text-[#FFB000] mt-0.5 shrink-0" /><span><strong>Khairatabad Ganesh Mandapam</strong><br /><span className="opacity-70">{settings?.venue || 'Khairatabad, Hyderabad — 500004'}<br />Khairatabad Circle, Near RTA Office</span></span></div>
                  <div className="flex gap-3"><Clock size={16} className="text-[#FFB000] mt-0.5 shrink-0" /><span><strong>Darshan:</strong> 5:30 AM — 11:00 PM Daily<br /><span className="opacity-70">Aarti: 12 PM & 7 PM • Annadanam: 12–3 PM</span></span></div>
                  <div className="flex gap-3"><Phone size={16} className="text-[#FFB000] mt-0.5 shrink-0" /><span className="opacity-90">{settings?.contactPhone} • {settings?.contactEmail}</span></div>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-2">
                  <a href="https://www.google.com/maps/search/Khairatabad+Ganesh+Temple+Hyderabad" target="_blank" rel="noreferrer" className="bg-white text-[#1A0F0F] rounded-full py-2.5 text-center text-[13px] font-bold">Open in Maps</a>
                  <a href={`tel:${settings?.contactPhone}`} className="bg-[#FF6B00] text-white rounded-full py-2.5 text-center text-[13px] font-bold">Call Helpline</a>
                </div>
              </div>
            </div>

            <div className="contact-card rounded-[24px] overflow-hidden border border-[#F0D9B5] h-[320px] bg-zinc-100 relative">
              <iframe
                title="Khairatabad Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.214!2d78.45!3d17.412!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb9752c3c3c3c3%3A0x123456789!2sKhairatabad%2C+Hyderabad!5e0!3m2!1sen!2sin!4v123"
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur rounded-2xl p-3 flex items-center gap-3 border border-[#F0D9B5]">
                <div className="w-9 h-9 rounded-xl bg-[#FF6B00] grid place-items-center text-white"><MapPin size={16} /></div>
                <div className="min-w-0"><div className="text-[12px] font-bold text-[#1A0F0F]">Khairatabad Metro — 300m walk</div><div className="text-[11px] text-[#8B7355]">Best way during crowd days • Parking at NTR Gardens</div></div>
                <a href="https://www.google.com/maps/dir/?api=1&destination=Khairatabad+Hyderabad" target="_blank" rel="noreferrer" className="ml-auto bg-[#1A0F0F] text-white px-4 py-2 rounded-full text-[11px] font-bold shrink-0">Directions</a>
              </div>
            </div>
          </div>

          <div>
            <div className="contact-card">
              <h3 className="font-bold text-[#1A0F0F] flex items-center gap-2"><Users size={18} className="text-[#FF6B00]" /> {t('contact.organizer')}</h3>
              <div className="mt-4 grid sm:grid-cols-2 gap-3">
                {organizers.map(o => (
                  <div key={o.name} className="bg-[#FFF8E7] border border-[#F0D9B5]/70 rounded-[20px] p-4 flex gap-3 items-center">
                    <img src={o.img} alt={o.name} className="w-12 h-12 rounded-xl object-cover border border-[#F0D9B5]" />
                    <div className="min-w-0">
                      <div className="font-bold text-[13px] leading-tight text-[#1A0F0F]">{o.name}</div>
                      <div className="text-[11px] font-semibold text-[#FF6B00]">{o.role}</div>
                      <a href={`tel:${o.phone}`} className="text-[11px] font-medium text-[#6D071A] flex items-center gap-1 mt-1"><Phone size={10} /> {o.phone}</a>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 bg-[#FFF8E7] border border-[#F0D9B5] rounded-2xl p-4">
                <div className="text-[11px] font-bold tracking-[0.12em] text-[#8B7355]">GENERAL HELPLINE</div>
                <a href={`tel:${settings?.contactPhone}`} className="mt-1 flex items-center gap-2 font-bold text-[16px] text-[#1A0F0F]"><Phone size={16} className="text-[#FF6B00]" /> {settings?.contactPhone}</a>
                <a href={`mailto:${settings?.contactEmail}`} className="flex items-center gap-2 text-[13px] text-[#6D071A] mt-1"><Mail size={14} className="text-[#FF6B00]" /> {settings?.contactEmail}</a>
                <div className="mt-3 flex flex-wrap gap-2">
                  <a href={`https://wa.me/919876543210?text=${encodeURIComponent('Hi, need help for Ganesh Utsav')}`} target="_blank" rel="noreferrer" className="bg-[#25D366] text-white px-4 py-2 rounded-full text-[12px] font-bold">WhatsApp</a>
                  <a href={`tel:${settings?.contactPhone}`} className="bg-[#1A0F0F] text-white px-4 py-2 rounded-full text-[12px] font-bold">Call Now</a>
                </div>
              </div>
            </div>

            <div className="contact-card mt-4 bg-gradient-to-br from-[#FF6B00] to-[#FFB000] rounded-[20px] p-5 text-white">
              <div className="text-[11px] font-bold tracking-[0.12em] opacity-80">QUICK HELP</div>
              <h4 className="font-bold text-[15px] leading-tight mt-1">Lost & Found • Medical • Police</h4>
              <p className="text-[12px] opacity-90 mt-1">Help desks near Queue Complex & Annadanam Mandapam. Follow volunteers in orange vests.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
