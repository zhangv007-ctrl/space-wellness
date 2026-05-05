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
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 48px', background: 'rgba(10,10,10,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <img src="/logo.jpg" alt="Space Wellness" style={{ height: 44, width: 44, objectFit: 'cover', borderRadius: '50%', border: '2px solid rgba(201,184,158,0.4)' }} />
        <div style={{ display: 'flex', gap: 36, alignItems: 'center' }}>
          {[
            [zh ? '首页' : 'Home', '#hero'],
            [zh ? '关于' : 'About', '#about'],
            [zh ? '服务' : 'Services', '#services'],
            [zh ? '空间' : 'Studio', '#gallery'],
            [zh ? '联系' : 'Contact', '#contact'],
          ].map(([label, href]) => (
            <a key={href} href={href} style={{ color: '#aaa', textDecoration: 'none', fontSize: 13, letterSpacing: '.06em', transition: 'color .2s' }}
              onMouseEnter={e => (e.target as HTMLElement).style.color = '#fff'}
              onMouseLeave={e => (e.target as HTMLElement).style.color = '#aaa'}>
              {label}
            </a>
          ))}
          <button onClick={() => router.push(`/${locale}/login`)}
            style={{ background: '#C9B89E', color: '#0a0a0a', border: 'none', padding: '9px 22px', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer', letterSpacing: '.04em' }}>
            {zh ? '立即预约' : 'Book Online'}
          </button>
          <a href={zh ? '/en' : '/zh'} style={{ color: '#666', fontSize: 12, textDecoration: 'none' }}>{zh ? 'EN' : '中文'}</a>
        </div>
      </nav>

      {/* Hero — 全屏背景图 */}
      <section id="hero" style={{ position: 'relative', height: '100vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src="/studio-2.jpg" alt="Space Wellness Studio" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', filter: 'brightness(0.45)' }} />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '0 24px', maxWidth: 800 }}>
          <img src="/logo.jpg" alt="logo" style={{ width: 110, height: 110, objectFit: 'cover', borderRadius: '50%', marginBottom: 32, border: '3px solid rgba(201,184,158,0.5)', boxShadow: '0 0 40px rgba(201,184,158,0.15)' }} />
          <h1 style={{ fontSize: 'clamp(40px, 6vw, 76px)', fontWeight: 400, margin: '0 0 20px', lineHeight: 1.1, letterSpacing: '-.02em' }}>
            {zh ? '欢迎来到' : 'Welcome to'}<br />
            <em style={{ color: '#C9B89E', fontStyle: 'italic' }}>Space Wellness</em>
          </h1>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.75)', maxWidth: 520, margin: '0 auto 40px', lineHeight: 1.75 }}>
            {zh
              ? 'YOUR SPACE & YOUR WELLNESS — 专为专业人士打造的精品普拉提与康复工作室'
              : 'YOUR SPACE & YOUR WELLNESS — Tailored Pilates, Fitness & Rehab for professionals'}
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => router.push(`/${locale}/login`)}
              style={{ background: '#C9B89E', color: '#0a0a0a', border: 'none', padding: '14px 36px', borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
              {zh ? '立即预约' : 'Book Now'}
            </button>
            <a href="#about" style={{ background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.4)', padding: '14px 36px', borderRadius: 8, fontSize: 15, cursor: 'pointer', textDecoration: 'none' }}>
              {zh ? '了解更多' : 'Learn More'}
            </a>
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', color: 'rgba(255,255,255,0.4)', fontSize: 12, letterSpacing: '.1em' }}>↓ SCROLL</div>
      </section>

      {/* About 图片区域 */}
      <section id="about" style={{ padding: '120px 48px', maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
        <div style={{ position: 'relative', paddingBottom: 60, paddingRight: 60 }}>
          <img src="/studio-3.jpg" alt="Studio" style={{ 
            width: '100%', borderRadius: 16, objectFit: 'cover', 
            height: 500, filter: 'brightness(0.9)', display: 'block'
          }} />
          <img src="/studio-5.jpg" alt="Studio" style={{ 
            position: 'absolute', bottom: -40, right: -40, 
            width: '45%', borderRadius: 12, objectFit: 'cover', 
            height: 200, border: '4px solid #0a0a0a', 
            filter: 'brightness(0.85)'
          }} />
        </div>
        <div style={{ paddingLeft: 20 }}>
          <div style={{ fontSize: 11, letterSpacing: '.15em', color: '#C9B89E', textTransform: 'uppercase', marginBottom: 16 }}>{zh ? '关于我们' : 'About Us'}</div>
          <h2 style={{ fontSize: 42, fontWeight: 400, margin: '0 0 28px', lineHeight: 1.15 }}>{zh ? '我们是谁' : 'Who We Are'}</h2>
          <p style={{ color: '#999', lineHeight: 1.85, fontSize: 15, marginBottom: 20 }}>
            {zh ? '我们是一家精品普拉提与康复工作室，专注于治疗性运动与身体恢复，为每一位客户提供以人为本的专业服务。' : 'We are a boutique Pilates and rehab studio specializing in therapeutic movement and recovery, delivering client-centered services in pain management and optimal health.'}
          </p>
          <p style={{ color: '#999', lineHeight: 1.85, fontSize: 15, marginBottom: 20 }}>
            {zh ? '我们的共同愿景是为物理治疗师、注册按摩治疗师、普拉提教练及其他健康专业人士提供灵活的空间和共享基础设施。' : 'Our shared vision centers on providing flexible space and shared infrastructure—empowering physiotherapists, RMTs, Pilates instructors, and other wellness professionals to grow their practice.'}
          </p>
          <p style={{ color: '#999', lineHeight: 1.85, fontSize: 15 }}>
            {zh ? '在 Space Wellness，我们融合疗愈、社区与专业赋能，为康复和正念运动的未来创造平台。' : 'At Space Wellness, we blend healing, community, and professional empowerment—creating a platform where the future of rehab and mindful movement can thrive.'}
          </p>
        </div>
      </section>

      {/* Services */}
      <section id="services" style={{ padding: '100px 48px', background: '#111' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 70 }}>
            <div style={{ fontSize: 11, letterSpacing: '.15em', color: '#C9B89E', textTransform: 'uppercase', marginBottom: 16 }}>{zh ? '我们的服务' : 'Our Services'}</div>
            <h2 style={{ fontSize: 42, fontWeight: 400, margin: 0 }}>{zh ? '全面的健康服务' : 'Comprehensive Wellness Services'}</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {[
              {
                img: '/studio-5.jpg',
                icon: '🧘',
                title: zh ? '普拉提' : 'Pilates',
                desc: zh
                  ? '提供个人及团体普拉提课程，涵盖 Reformer、Cadillac、Wunda Chair 等专业器械训练，适合各种程度学员。'
                  : 'Private and group Pilates sessions using Reformer, Cadillac, Wunda Chair and more — suitable for all levels from beginner to advanced.'
              },
              {
                img: '/studio-8.jpg',
                icon: '💪',
                title: zh ? '力量体能训练' : 'Strength & Conditioning',
                desc: zh
                  ? '由专业教练带领，结合功能性训练、力量训练与体能提升，帮助您建立强健体魄，提升运动表现。'
                  : 'Coach-led functional training, strength work, and conditioning programs designed to build a stronger body and improve athletic performance.'
              },
              {
                img: '/studio-3.jpg',
                icon: '🩺',
                title: zh ? '康复治疗' : 'Therapy',
                desc: zh
                  ? '提供物理治疗、注册按摩治疗（RMT）及整骨疗法，专注于疼痛管理、身体康复与长期健康维护。'
                  : 'Physiotherapy, Registered Massage Therapy (RMT), and Osteopathy focused on pain management, rehabilitation, and long-term health maintenance.'
              },
            ].map(s => (
              <div key={s.title} style={{ borderRadius: 16, overflow: 'hidden', background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ height: 220, overflow: 'hidden' }}>
                  <img src={s.img} alt={s.title} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.7)', transition: 'transform .4s' }}
                    onMouseEnter={e => (e.target as HTMLElement).style.transform = 'scale(1.05)'}
                    onMouseLeave={e => (e.target as HTMLElement).style.transform = 'scale(1)'} />
                </div>
                <div style={{ padding: 28 }}>
                  
                  <h3 style={{ fontSize: 20, fontWeight: 400, margin: '0 0 12px', color: '#C9B89E' }}>{s.title}</h3>
                  <p style={{ color: '#888', lineHeight: 1.8, fontSize: 14, margin: 0 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" style={{ padding: '100px 48px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <div style={{ fontSize: 11, letterSpacing: '.15em', color: '#C9B89E', textTransform: 'uppercase', marginBottom: 16 }}>{zh ? '我们的空间' : 'Our Studio'}</div>
          <h2 style={{ fontSize: 42, fontWeight: 400, margin: 0 }}>{zh ? '专业设备，舒适环境' : 'Professional Equipment, Comfortable Space'}</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gridTemplateRows: '280px 280px', gap: 12 }}>
          <img src="/studio-4.jpg" alt="Studio" style={{ gridRow: '1/3', width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12, filter: 'brightness(0.85)' }} />
          <img src="/studio-8.jpg" alt="Studio" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12, filter: 'brightness(0.85)' }} />
          <img src="/studio-7.jpg" alt="Studio" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12, filter: 'brightness(0.85)' }} />
          <img src="/studio-5.jpg" alt="Studio" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12, filter: 'brightness(0.85)' }} />
          <img src="/studio-9.jpg" alt="Studio" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12, filter: 'brightness(0.85)' }} />
        </div>
      </section>

      {/* CTA */}
      <section style={{ position: 'relative', padding: '120px 48px', textAlign: 'center', overflow: 'hidden' }}>
        <img src="/studio-2.jpg" alt="bg" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.25)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: 52, fontWeight: 400, margin: '0 0 20px' }}>{zh ? '准备好开始了吗？' : 'Ready to Begin?'}</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, marginBottom: 40, maxWidth: 480, margin: '0 auto 40px' }}>
            {zh ? '立即预约您的第一节课或租用工作室空间' : 'Book your first class or rent a studio space today'}
          </p>
          <button onClick={() => router.push(`/${locale}/login`)}
            style={{ background: '#C9B89E', color: '#0a0a0a', border: 'none', padding: '16px 48px', borderRadius: 8, fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>
            {zh ? '立即开始' : 'Get Started'}
          </button>
        </div>
      </section>

      {/* Footer */}
      <section id="contact" style={{ background: '#050505', padding: '80px 48px 40px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 60 }}>
            <div>
              <img src="/logo.jpg" alt="Space Wellness" style={{ height: 60, width: 60, objectFit: 'cover', borderRadius: '50%', marginBottom: 16, border: '2px solid rgba(201,184,158,0.3)' }} />
              <p style={{ color: '#C9B89E', fontSize: 11, letterSpacing: '.15em', marginBottom: 8, fontWeight: 600 }}>YOUR SPACE & YOUR WELLNESS</p>
              <p style={{ color: '#555', fontSize: 13, lineHeight: 1.5, maxWidth: 260, margin: 0 }}>
                {zh ? '专注治疗性运动与身体恢复的精品工作室' : 'A boutique studio specializing in therapeutic movement and recovery.'}
              </p>
            </div>
            {[
              { label: zh ? '地址' : 'Address', value: '21-2800 John St\nMarkham, ON' },
              { label: zh ? '邮箱' : 'Email', value: 'info@spacewellness.ca' },
              { label: zh ? '营业时间' : 'Hours', value: zh ? '周一至周日\n8:00am – 9:00pm' : 'Mon - Sun\n8:00am – 9:00pm' },
            ].map(item => (
              <div key={item.label}>
                <div style={{ fontSize: 11, letterSpacing: '.12em', color: '#C9B89E', textTransform: 'uppercase', marginBottom: 12 }}>{item.label}</div>
                <div style={{ color: '#888', fontSize: 14, lineHeight: 1.8, whiteSpace: 'pre-line' }}>{item.value}</div>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ color: '#444', fontSize: 12, margin: 0 }}>© 2025 Space Wellness. All rights reserved.</p>
            <button onClick={() => router.push(`/${locale}/login`)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: '#888', padding: '8px 20px', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}>
              {zh ? '管理员登录' : 'Admin Login'}
            </button>
          </div>
        </div>
      </section>

    </div>
  )
}