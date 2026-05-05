'use client'
import { use } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params)
  const zh = locale === 'zh'
  const router = useRouter()

  return (
    <div style={{ fontFamily: 'Georgia, serif', background: '#0a0a0a', color: '#fff', minHeight: '100vh' }}>

      {/* 导航栏 */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 48px', background: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(8px)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <img src="/logo.jpg" alt="Space Wellness" style={{ height: 48, borderRadius: 4 }} />
        <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          {[
            [zh ? '首页' : 'Home', '#hero'],
            [zh ? '关于我们' : 'About', '#about'],
            [zh ? '服务' : 'Services', '#services'],
            [zh ? '联系' : 'Contact', '#contact'],
          ].map(([label, href]) => (
            <a key={href} href={href} style={{ color: '#ccc', textDecoration: 'none', fontSize: 14, letterSpacing: '.05em', transition: 'color .2s' }}
              onMouseEnter={e => (e.target as HTMLElement).style.color = '#fff'}
              onMouseLeave={e => (e.target as HTMLElement).style.color = '#ccc'}>
              {label}
            </a>
          ))}
          <button onClick={() => router.push(`/${locale}/login`)}
            style={{ background: '#fff', color: '#0a0a0a', border: 'none', padding: '10px 24px', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer', letterSpacing: '.04em' }}>
            {zh ? '登录' : 'Book Online'}
          </button>
          <a href={zh ? `/${locale.replace('zh','en')}` : `/${locale.replace('en','zh')}`}
            style={{ color: '#888', fontSize: 13, textDecoration: 'none' }}>
            {zh ? 'EN' : '中文'}
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section id="hero" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '120px 24px 80px', background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1410 100%)' }}>
        <img src="/logo.jpg" alt="Space Wellness" style={{ width: 140, height: 140, objectFit: 'contain', borderRadius: 8, marginBottom: 40, opacity: 0.95 }} />
        <h1 style={{ fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 400, margin: '0 0 24px', lineHeight: 1.1, letterSpacing: '-.02em' }}>
          {zh ? '欢迎来到' : 'Welcome to'}<br />
          <em style={{ color: '#C9B89E', fontStyle: 'italic' }}>Space Wellness</em>
        </h1>
        <p style={{ fontSize: 18, color: '#999', maxWidth: 560, lineHeight: 1.7, margin: '0 0 48px' }}>
          {zh
            ? '专为专业人士打造的精品普拉提与康复工作室，专注于品质、关怀与长期健康表现。'
            : 'Discover tailored Pilates, Fitness, and Rehab programs—crafted for professionals who value quality, care, and long-term performance.'}
        </p>
        <div style={{ display: 'flex', gap: 16 }}>
          <button onClick={() => router.push(`/${locale}/login`)}
            style={{ background: '#C9B89E', color: '#0a0a0a', border: 'none', padding: '14px 36px', borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: 'pointer', letterSpacing: '.04em' }}>
            {zh ? '立即预约' : 'Book Now'}
          </button>
          <a href="#about"
            style={{ background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', padding: '14px 36px', borderRadius: 8, fontSize: 15, cursor: 'pointer', textDecoration: 'none', letterSpacing: '.04em' }}>
            {zh ? '了解更多' : 'Learn More'}
          </a>
        </div>
      </section>

      {/* About */}
      <section id="about" style={{ padding: '100px 48px', maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
        <div style={{ background: '#1a1a1a', borderRadius: 16, overflow: 'hidden', aspectRatio: '4/3' }}>
          <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #2a2018 0%, #1a1410 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src="/logo.jpg" alt="Space Wellness" style={{ width: '60%', opacity: 0.3 }} />
          </div>
        </div>
        <div>
          <div style={{ fontSize: 12, letterSpacing: '.15em', color: '#C9B89E', textTransform: 'uppercase', marginBottom: 16 }}>{zh ? '关于我们' : 'About Us'}</div>
          <h2 style={{ fontSize: 40, fontWeight: 400, margin: '0 0 24px', lineHeight: 1.2 }}>
            {zh ? '我们是谁' : 'Who We Are'}
          </h2>
          <p style={{ color: '#999', lineHeight: 1.8, fontSize: 15, marginBottom: 16 }}>
            {zh
              ? '我们是一家精品普拉提与康复工作室，专注于治疗性运动与身体恢复。'
              : 'We are a boutique Pilates and rehab studio specializing in therapeutic movement and recovery.'}
          </p>
          <p style={{ color: '#999', lineHeight: 1.8, fontSize: 15, marginBottom: 16 }}>
            {zh
              ? '我们的共同愿景是为物理治疗师、注册按摩治疗师、普拉提教练及其他健康专业人士提供灵活的空间和共享基础设施，帮助他们服务客户、开展课程、发展自己的事业。'
              : 'Beyond delivering client-centered services in pain management and optimal health, our shared vision centers on providing flexible space and shared infrastructure—empowering physiotherapists, RMTs, Pilates instructors, and other wellness professionals to connect with clients, run their sessions, and grow their own practice.'}
          </p>
          <p style={{ color: '#999', lineHeight: 1.8, fontSize: 15 }}>
            {zh
              ? '在 Space Wellness，我们融合疗愈、社区与专业赋能，为康复和正念运动的未来创造平台。'
              : 'At Space Wellness, we blend healing, community, and professional empowerment—creating a platform where the future of rehab and mindful movement can thrive.'}
          </p>
        </div>
      </section>

      {/* Services */}
      <section id="services" style={{ padding: '100px 48px', background: '#111' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div style={{ fontSize: 12, letterSpacing: '.15em', color: '#C9B89E', textTransform: 'uppercase', marginBottom: 16 }}>{zh ? '我们的服务' : 'Our Services'}</div>
            <h2 style={{ fontSize: 40, fontWeight: 400, margin: 0 }}>{zh ? '全面的健康服务' : 'Comprehensive Wellness Services'}</h2>
            <p style={{ color: '#999', marginTop: 16, fontSize: 15 }}>{zh ? '支持您最佳健康状态的全面服务与产品' : 'Comprehensive services and products to support your optimal wellness'}</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
            {[
              {
                icon: '🏋️',
                title: zh ? '工作室服务' : 'Studio Services',
                desc: zh
                  ? '我们提供普拉提、力量与体能训练、物理治疗、注册按摩治疗（RMT）及整骨疗法等定制服务。'
                  : 'Our studio offers tailored services in Pilates, Strength & Conditioning, Physiotherapy, Registered Massage Therapy (RMT), and Osteopathy.'
              },
              {
                icon: '✨',
                title: zh ? '品牌产品' : 'Signature Products',
                desc: zh
                  ? '我们提供实用产品，支持日常运动与恢复——从舒缓乳霜到训练必备品。'
                  : 'We offer practical products to support daily movement and recovery—from soothing creams to training essentials.'
              },
              {
                icon: '🎓',
                title: zh ? '专业教育' : 'Professional Education',
                desc: zh
                  ? '我们的 canfitpro ProTrainer 团队为健身、普拉提及康复专业人士提供认证课程和工作坊。'
                  : 'Our canfitpro ProTrainer team offers certifications and workshops for fitness, Pilates, and rehab professionals.'
              },
            ].map(s => (
              <div key={s.title} style={{ background: '#1a1a1a', borderRadius: 16, padding: 36, border: '1px solid rgba(255,255,255,0.06)', transition: 'border .2s' }}>
                <div style={{ fontSize: 36, marginBottom: 20 }}>{s.icon}</div>
                <h3 style={{ fontSize: 22, fontWeight: 400, margin: '0 0 16px', color: '#C9B89E' }}>{s.title}</h3>
                <p style={{ color: '#888', lineHeight: 1.8, fontSize: 14, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '100px 48px', textAlign: 'center', background: 'linear-gradient(180deg, #1a1410 0%, #0a0a0a 100%)' }}>
        <h2 style={{ fontSize: 48, fontWeight: 400, margin: '0 0 24px' }}>
          {zh ? '准备好开始了吗？' : 'Ready to Begin?'}
        </h2>
        <p style={{ color: '#999', fontSize: 16, marginBottom: 40 }}>
          {zh ? '立即预约您的第一节课或租用工作室空间' : 'Book your first class or rent a studio space today'}
        </p>
        <button onClick={() => router.push(`/${locale}/login`)}
          style={{ background: '#C9B89E', color: '#0a0a0a', border: 'none', padding: '16px 48px', borderRadius: 8, fontSize: 16, fontWeight: 600, cursor: 'pointer', letterSpacing: '.04em' }}>
          {zh ? '立即开始' : 'Get Started'}
        </button>
      </section>

      {/* Contact / Footer */}
      <section id="contact" style={{ background: '#050505', padding: '80px 48px 40px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 48, marginBottom: 60 }}>
            {[
              { label: zh ? '地址' : 'Address', value: '21-2800 John St, Markham' },
              { label: zh ? '邮箱' : 'Email', value: 'info@spacewellness.ca' },
              { label: zh ? '营业时间' : 'Opening Hours', value: zh ? '周一至周日 8:00am – 9:00pm' : 'Mon - Sun 8:00 am – 9:00 pm' },
            ].map(item => (
              <div key={item.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 11, letterSpacing: '.12em', color: '#C9B89E', textTransform: 'uppercase', marginBottom: 12 }}>{item.label}</div>
                <div style={{ color: '#ccc', fontSize: 15 }}>{item.value}</div>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <img src="/logo.jpg" alt="Space Wellness" style={{ height: 36, opacity: 0.6 }} />
            <p style={{ color: '#555', fontSize: 12, margin: 0 }}>© 2025 Space Wellness. All rights reserved.</p>
          </div>
        </div>
      </section>

    </div>
  )
}