import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, Navigation, Clock, Users, Radio, Waves } from 'lucide-react';
import { formatDate } from '../lib/utils';

gsap.registerPlugin(ScrollTrigger);

export default function NimarjanamSection({ data }) {
  const ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.nim-card', {
        y: 40, opacity: 0, stagger: 0.1, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 80%' }
      });
      gsap.to('.pulse-dot', { scale: 1.6, opacity: 0, duration: 1.2, repeat: -1, ease: 'power1.out' });
    }, ref);
    return () => ctx.revert();
  }, []);

  if (!data) return null;

  const statusMap = {
    planned: { label: 'PLANNED', color: 'bg-amber-500' },
    preparing: { label: 'PREPARING', color: 'bg-blue-500' },
    procession: { label: 'LIVE PROCESSION', color: 'bg-emerald-500 animate-pulse' },
    immersed: { label: 'IMMERSED', color: 'bg-zinc-800' },
    completed: { label: 'COMPLETED', color: 'bg-zinc-500' },
  };
  const st = statusMap[data.status] || statusMap.planned;

  return (
    <section ref={ref} id="nimarjanam" className="py-10 md:py-16 bg-[#FFF8E7] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-gradient-to-t from-[#E6F7FF]/60 to-transparent" />
      </div>

      <div className="relative max-w-[1280px] mx-auto px-4 md:px-6">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.16em] text-[#0EA5E9]"><Waves size={14} /> NIMARJANAM • VISARJAN</div>
            <h2 className="display font-[750] text-[32px] md:text-[44px] leading-[0.9] tracking-[-0.03em] text-[#1A0F0F] mt-2">{data.title || 'Maha Nimarjanam'}</h2>
            <p className="mt-3 text-[14px] text-[#8B7355] max-w-[600px]">{data.description || 'Grand farewell procession to Hussain Sagar. Join lakhs of devotees in the emotional visarjan — Bappa will return next year.'}</p>
          </div>
          <div className="flex items-center gap-3 bg-white border border-[#F0D9B5] rounded-full px-4 py-2 shadow-sm">
            <span className="relative w-3 h-3">
              <span className={`absolute inset-0 rounded-full ${st.color}`} />
              <span className="pulse-dot absolute inset-0 rounded-full bg-emerald-500" />
            </span>
            <span className="text-[11px] font-bold tracking-[0.14em] text-[#1A0F0F]">{st.label}</span>
            <span className="text-[11px] font-medium text-[#8B7355] hidden md:inline">• {formatDate(data.date, { day: 'numeric', month: 'long', year: 'numeric' })} • {data.startTime}</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-6">
          {/* Route timeline */}
          <div className="nim-card bg-white border border-[#F0D9B5]/70 rounded-[24px] p-6 md:p-7">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-[16px] text-[#1A0F0F] flex items-center gap-2"><Navigation size={18} className="text-[#0EA5E9]" /> Procession Route</h3>
              <span className="text-[11px] font-bold tracking-[0.12em] bg-[#E6F7FF] text-[#0369A1] px-3 py-1 rounded-full border border-[#BAE6FD]">{data.expectedCrowd || '15+ Lakhs'} Expected</span>
            </div>

            <div className="relative">
              <div className="absolute left-[15px] top-[14px] bottom-[14px] w-[2px] bg-gradient-to-b from-[#0EA5E9] via-[#0EA5E9]/50 to-[#F0D9B5] rounded-full" />
              <div className="space-y-4">
                {(data.route || []).map((stop, i) => (
                  <div key={i} className="relative flex gap-4 items-start">
                    <div className={`w-[30px] h-[30px] rounded-full grid place-items-center shrink-0 border-2 bg-white z-10 ${i === 0 ? 'border-[#0EA5E9] text-[#0EA5E9]' : i === (data.route.length - 1) ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-[#F0D9B5] text-[#8B7355]'}`}>
                      {i === data.route.length - 1 ? <Waves size={14} /> : <MapPin size={14} />}
                    </div>
                    <div className={`flex-1 rounded-2xl px-4 py-3 border ${i === 0 ? 'bg-[#E6F7FF] border-[#BAE6FD]' : 'bg-[#FFF8E7] border-[#F0D9B5]/60'}`}>
                      <div className="font-semibold text-[14px] text-[#1A0F0F]">{stop}</div>
                      <div className="text-[12px] text-[#8B7355]">{i === 0 ? 'Start • 5:00 AM • Pooja & Send-off' : i === data.route.length - 1 ? 'Final Immersion • Hussain Sagar • Crane #3' : `Stop ${i} • Darshan for devotees`}</div>
                    </div>
                    {i === 0 && <span className="hidden md:inline-flex absolute right-0 top-3 bg-[#0EA5E9] text-white text-[10px] font-bold px-2 py-1 rounded-full">START</span>}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <div className="bg-[#FFF8E7] border border-[#F0D9B5] rounded-2xl p-3 text-center">
                <Clock size={16} className="mx-auto text-[#0EA5E9]" />
                <div className="text-[12px] font-bold mt-1 text-[#1A0F0F]">{data.startTime}</div>
                <div className="text-[10px] font-semibold tracking-wide text-[#8B7355]">START TIME</div>
              </div>
              <div className="bg-[#FFF8E7] border border-[#F0D9B5] rounded-2xl p-3 text-center">
                <Users size={16} className="mx-auto text-[#0EA5E9]" />
                <div className="text-[12px] font-bold mt-1 text-[#1A0F0F]">{data.expectedCrowd}</div>
                <div className="text-[10px] font-semibold tracking-wide text-[#8B7355]">CROWD</div>
              </div>
              <div className="bg-[#FFF8E7] border border-[#F0D9B5] rounded-2xl p-3 text-center">
                <Radio size={16} className="mx-auto text-emerald-600" />
                <div className="text-[12px] font-bold mt-1 text-[#1A0F0F]">{data.currentLocation}</div>
                <div className="text-[10px] font-semibold tracking-wide text-[#8B7355]">LIVE LOCATION</div>
              </div>
            </div>
          </div>

          {/* Map + live */}
          <div className="flex flex-col gap-4">
            <div className="nim-card bg-[#1A0F0F] rounded-[24px] overflow-hidden border border-white/10">
              <div className="p-4 flex items-center justify-between">
                <div className="text-white font-bold text-[14px] flex items-center gap-2"><MapPin size={16} className="text-[#FFB000]" /> Live Route Map</div>
                <span className="text-[11px] font-bold tracking-wide bg-emerald-500 text-white px-3 py-1 rounded-full flex items-center gap-1.5"><span className="w-2 h-2 bg-white rounded-full animate-pulse" /> LIVE</span>
              </div>
              <div className="h-[280px] bg-[#0B1220] relative overflow-hidden">
                {/* Fake map placeholder with route line */}
                <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800" alt="map" className="w-full h-full object-cover opacity-50" />
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 280">
                  <path d="M 40 40 C 120 60, 140 120, 200 140 S 320 180, 360 240" stroke="#0EA5E9" strokeWidth="4" fill="none" strokeDasharray="8 6" className="drop-shadow-[0_0_8px_rgba(14,165,233,0.8)]" />
                  <circle cx="40" cy="40" r="8" fill="#0EA5E9" stroke="white" strokeWidth="2" />
                  <circle cx="360" cy="240" r="10" fill="#10B981" stroke="white" strokeWidth="2" />
                  <circle cx="200" cy="140" r="6" fill="white" stroke="#0EA5E9" strokeWidth="2"><animate attributeName="r" values="6;9;6" dur="1.5s" repeatCount="indefinite" /></circle>
                </svg>
                <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur rounded-2xl p-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0EA5E9] grid place-items-center text-white"><Navigation size={18} /></div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[12px] font-bold text-[#1A0F0F]">Track Bappa Live</div>
                    <div className="text-[11px] text-[#8B7355] truncate">{data.liveLocationUrl ? 'GPS enabled trailer • Updates every 30 sec' : 'Live location will be enabled on procession day'}</div>
                  </div>
                  <a href={data.liveLocationUrl || '#'} target="_blank" rel="noreferrer" className="bg-[#1A0F0F] text-white px-4 py-2 rounded-full text-[12px] font-bold shrink-0">Open Maps</a>
                </div>
              </div>
              <div className="p-4 grid grid-cols-2 gap-3">
                <a href={`https://www.google.com/maps/search/${encodeURIComponent(data.route?.[0] || 'Khairatabad')}`} target="_blank" rel="noreferrer" className="bg-white text-[#1A0F0F] rounded-full py-2.5 text-center text-[13px] font-bold">View on Google Maps</a>
                <a href="tel:+919876543210" className="bg-[#0EA5E9] text-white rounded-full py-2.5 text-center text-[13px] font-bold">Helpline • 24/7</a>
              </div>
            </div>

            <div className="nim-card bg-gradient-to-br from-[#0EA5E9] to-[#0369A1] rounded-[24px] p-5 text-white relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/15 rounded-full blur-2xl" />
              <div className="relative">
                <div className="text-[11px] font-bold tracking-[0.14em] opacity-80">IMPORTANT</div>
                <h4 className="font-bold text-[16px] leading-tight mt-1">Nimarjanam Day — Traffic & Safety</h4>
                <ul className="mt-3 space-y-1.5 text-[13px] leading-relaxed opacity-90 list-disc list-inside">
                  <li>Khairatabad to Hussain Sagar roads closed from 4 AM</li>
                  <li>Use Metro: Khairatabad station 300m walk</li>
                  <li>Follow police barricades — stay behind cordon</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
