'use client'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

const TRANSLATIONS = {
  en: { dashboard:'Dashboard', clients:'Clients', classes:'Classes', spaces:'Spaces', bookings:'Bookings', bookClass:'Book a Class', mySchedule:'My Schedule', rentSpace:'Rent a Space', admin:'Admin', teacher:'Teacher', client:'Client', overview:'Overview', management:'Management', portal:'Portal', logout:'Sign Out' },
  zh: { dashboard:'控制台', clients:'客户', classes:'课程', spaces:'场地', bookings:'预约', bookClass:'预约课程', mySchedule:'我的课表', rentSpace:'租借场地', admin:'管理员', teacher:'教师', client:'客户', overview:'概览', management:'管理', portal:'门户', logout:'退出' },
}

export default function Layout({ children, params }: { children: React.ReactNode; params: { locale: string } }) {
  const [lang, setLang] = useState(params.locale as 'en'|'zh')
  const pathname = usePathname()

  const switchLang = (newLang: 'en'|'zh') => {
    setLang(newLang)
    const segments = pathname.split('/')
    segments[1] = newLang
    window.location.href = segments.join('/')
  }

  const t = TRANSLATIONS[lang]
  const isLogin = pathname.includes('/login')
  if (isLogin) return <html lang={lang}><body style={{margin:0}}>{children}</body></html>

  const navItems = [
    { section: t.overview, items: [{ key:'dashboard', label:t.dashboard, href:`/${lang}/dashboard` }] },
    { section: t.management, items: [
      { key:'clients',  label:t.clients,  href:`/${lang}/clients`  },
      { key:'classes',  label:t.classes,  href:`/${lang}/classes`  },
      { key:'spaces',   label:t.spaces,   href:`/${lang}/spaces`   },
      { key:'bookings', label:t.bookings, href:`/${lang}/bookings` },
    ]},
    { section: t.portal, items: [
      { key:'book-class',   label:t.bookClass,   href:`/${lang}/book-class`   },
      { key:'my-schedule',  label:t.mySchedule,  href:`/${lang}/my-schedule`  },
      { key:'rent-space',   label:t.rentSpace,   href:`/${lang}/rent-space`   },
    ]},
  ]

  const isActive = (href: string) => pathname === href

  return (
    <html lang={lang}>
      <body style={{margin:0,fontFamily:'sans-serif',background:'#FAF7F2',display:'flex',flexDirection:'column',minHeight:'100vh'}}>
        <header style={{height:56,background:'#fff',borderBottom:'1px solid #E8DDD0',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 28px',position:'sticky',top:0,zIndex:100}}>
          <a href={`/${lang}/dashboard`} style={{textDecoration:'none'}}>
            <div style={{fontFamily:'Georgia,serif',fontSize:22,color:'#3D2B1F'}}>Space <span style={{color:'#7A9E87',fontStyle:'italic'}}>Wellness</span></div>
          </a>
          <div style={{display:'flex',gap:8,alignItems:'center'}}>
            <button onClick={()=>switchLang('en')} style={{background:'none',border:'none',cursor:'pointer',fontSize:12,fontWeight:lang==='en'?700:400,color:lang==='en'?'#3D2B1F':'#8B6F52',padding:'3px 8px',borderRadius:4}}>EN</button>
            <span style={{color:'#C9B89E',fontSize:11}}>|</span>
            <button onClick={()=>switchLang('zh')} style={{background:'none',border:'none',cursor:'pointer',fontSize:12,fontWeight:lang==='zh'?700:400,color:lang==='zh'?'#3D2B1F':'#8B6F52',padding:'3px 8px',borderRadius:4}}>中文</button>
            <span style={{marginLeft:8,fontSize:11,background:'#F2EDE4',color:'#8B6F52',padding:'3px 10px',borderRadius:20,letterSpacing:'.06em'}}>{t.admin}</span>
            <a href={`/${lang}/login`} style={{fontSize:12,color:'#8B6F52',textDecoration:'none',padding:'4px 10px',border:'1px solid #E8DDD0',borderRadius:6}}>{t.logout}</a>
          </div>
        </header>
        <div style={{display:'flex',flex:1}}>
          <nav style={{width:210,background:'#fff',borderRight:'1px solid #E8DDD0',padding:'16px 0',flexShrink:0}}>
            {navItems.map(group=>(
              <div key={group.section}>
                <div style={{fontSize:10,letterSpacing:'.1em',textTransform:'uppercase',color:'#C9B89E',padding:'14px 20px 6px',fontWeight:500}}>{group.section}</div>
                {group.items.map(item=>(
                  <a key={item.key} href={item.href} style={{display:'block',padding:'10px 20px',fontSize:13,color:isActive(item.href)?'#3D2B1F':'#8B6F52',textDecoration:'none',borderLeft:isActive(item.href)?'2px solid #7A9E87':'2px solid transparent',background:isActive(item.href)?'#F2EDE4':'transparent',fontWeight:isActive(item.href)?500:400}}>{item.label}</a>
                ))}
              </div>
            ))}
          </nav>
          <main style={{flex:1,padding:28,overflowY:'auto'}}>{children}</main>
        </div>
      </body>
    </html>
  )
}
