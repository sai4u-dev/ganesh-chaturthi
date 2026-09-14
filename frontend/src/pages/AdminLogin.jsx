import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, Eye, EyeOff, Sparkles, ArrowLeft, ShieldCheck } from 'lucide-react';
import { api } from '../api/client';

export default function AdminLogin() {
  const [email, setEmail] = useState('admin@ganeshutsav.com');
  const [password, setPassword] = useState('Admin@123');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const t = localStorage.getItem('ganesh_token');
    if (t) api.me().then(() => navigate('/admin/dashboard')).catch(() => localStorage.removeItem('ganesh_token'));
  }, [navigate]);

  const handle = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.login(email, password);
      localStorage.setItem('ganesh_token', res.token);
      localStorage.setItem('ganesh_user', JSON.stringify(res.user));
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check credentials or ensure backend is running (npm run dev in /server). Demo fallback works on public site without login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8E7] grid lg:grid-cols-[1.1fr_0.9fr]">
      <div className="relative hidden lg:block overflow-hidden bg-gradient-to-br from-[#6D071A] via-[#1A0F0F] to-[#004D40] p-10">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, backgroundSize: '28px 28px' }} />
        <Link to="/" className="relative inline-flex items-center gap-2 text-white/80 hover:text-white text-[13px] font-semibold"><ArrowLeft size={16} /> Back to Website</Link>

        <div className="relative mt-16 max-w-[520px]">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/15 text-white px-3 py-1.5 rounded-full text-[11px] font-bold tracking-[0.14em]"><Sparkles size={14} className="text-[#FFB000]" /> ADMIN PORTAL • SECURE ACCESS</div>
          <h1 className="display font-[800] text-[44px] leading-[0.9] tracking-[-0.03em] text-white mt-6">Manage Bappa’s<br /><span className="text-[#FFB000]">Utsav</span></h1>
          <p className="mt-4 text-[15px] leading-relaxed text-white/70">Change pooja statuses, update annadanam menus, move nimarjanam location, and publish promotions — all dynamic via MongoDB. Changes reflect instantly on the public site.</p>

          <div className="mt-10 grid gap-3">
            {[
              { t: 'Pooja Timings', d: 'Toggle upcoming/completed in one click' },
              { t: 'Annadanam', d: 'Daily menu, sponsor, counts — real-time' },
              { t: 'Nimarjanam', d: 'Route, status, and GPS link' },
            ].map(i => (
              <div key={i.t} className="bg-white/10 backdrop-blur border border-white/10 rounded-2xl p-4 flex gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#FFB000] grid place-items-center text-[#1A0F0F]"><ShieldCheck size={18} /></div>
                <div><div className="font-bold text-white text-[14px]">{i.t}</div><div className="text-[12px] text-white/60">{i.d}</div></div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-6 left-10 right-10 bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
          <img src="https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?w=200" alt="" className="w-12 h-12 rounded-xl object-cover" />
          <div className="text-white"><div className="text-[13px] font-bold">Khairatabad 70th Year</div><div className="text-[11px] opacity-60">Design inspired by GSAP • Framer • Awwwards</div></div>
          <div className="ml-auto text-[11px] font-bold tracking-wide bg-[#FFB000] text-[#1A0F0F] px-3 py-1 rounded-full">2026 UTSAV</div>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 md:p-10">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-[420px]">
          <Link to="/" className="lg:hidden inline-flex items-center gap-2 text-[13px] font-semibold text-[#6D071A] mb-6"><ArrowLeft size={16} /> Back</Link>

          <div className="bg-white border border-[#F0D9B5] rounded-[24px] p-7 md:p-8 shadow-[0_16px_40px_rgba(109,7,26,0.08)]">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF6B00] to-[#6D071A] grid place-items-center text-white text-[20px]">ॐ</div>
            <h2 className="display font-bold text-[24px] tracking-[-0.02em] text-[#1A0F0F] mt-4">Admin Login</h2>
            <p className="text-[13px] text-[#8B7355] mt-1">Sign in to update festival data.</p>

            <form onSubmit={handle} className="mt-6 space-y-4">
              <div>
                <label className="text-[11px] font-bold tracking-[0.12em] text-[#6D071A]">EMAIL</label>
                <div className="mt-1.5 relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B7355]" />
                  <input value={email} onChange={e => setEmail(e.target.value)} type="email" required className="w-full bg-[#FFF8E7] border border-[#F0D9B5] rounded-full pl-10 pr-4 py-3 text-[14px] font-medium outline-none focus:border-[#FF6B00] focus:bg-white transition-colors" placeholder="admin@ganeshutsav.com" />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold tracking-[0.12em] text-[#6D071A]">PASSWORD</label>
                <div className="mt-1.5 relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B7355]" />
                  <input value={password} onChange={e => setPassword(e.target.value)} type={show ? 'text' : 'password'} required className="w-full bg-[#FFF8E7] border border-[#F0D9B5] rounded-full pl-10 pr-10 py-3 text-[14px] font-medium outline-none focus:border-[#FF6B00] focus:bg-white transition-colors" placeholder="••••••••" />
                  <button type="button" onClick={() => setShow(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 grid place-items-center text-[#8B7355]">{show ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                </div>
              </div>

              {error && <div className="bg-red-50 border border-red-200 text-red-700 text-[12px] font-medium px-4 py-3 rounded-2xl leading-relaxed">{error}</div>}

              <button disabled={loading} className="w-full bg-[#1A0F0F] text-white py-3.5 rounded-full font-bold text-[14px] hover:bg-black transition-colors disabled:opacity-60">
                {loading ? 'Signing in...' : 'Sign In →'}
              </button>

              <div className="bg-[#FFF8E7] border border-[#F0D9B5]/70 rounded-2xl p-3 text-[11px] leading-relaxed text-[#8B7355]">
                <div className="font-bold text-[#1A0F0F] text-[11px] tracking-[0.08em]">DEFAULT CREDENTIALS (after seed)</div>
                Email: <code className="bg-white border px-1.5 py-0.5 rounded">admin@ganeshutsav.com</code><br />
                Password: <code className="bg-white border px-1.5 py-0.5 rounded">Admin@123</code><br />
                <span className="opacity-70">Run: <code>pnpm seed</code> or <code>node seed/seed.js</code> once MongoDB is connected.</span>
              </div>
            </form>

            <div className="mt-6 text-center text-[12px] text-[#8B7355]">
              Public site works without login — data falls back to demo if API is offline.
              <br />
              <Link to="/" className="font-bold text-[#FF6B00] hover:underline">View Website →</Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
