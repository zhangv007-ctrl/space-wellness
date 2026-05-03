'use client'
import { useState, useEffect } from 'react'

export default function Layout({ children, params }: { children: React.ReactNode; params: { locale: string } }) {
  const [l, setL] = useState(params.locale || 'en')
  const [path, setPath] = useState('')

  useEffect(() => { setPath(window.location.pathname) }, [])

  const switchLang = (newL: string) => {
    const segments = window.location.pathname.split('/')
    segments[1] = newL
    window.location.href = segments.join('/')
  }

  const nav = [
    { section: l==='zh'?'概览':'Overview', items: [{ label:l==='zh'?'控制台':'Dashboard', href:`/${l}/dashboard` }] },
    { section: l==='zh'?'管理':'Management', items: [
      { label:l==='zh'?'客户':'Clients',   href:`/${l}/clients`  },
      { label:l==='zh'?'课程':'Classes',   href:`/${l}/classes`  },
      { label:l==='zh'?'场地':'Spaces',    href:`/${l}/spaces`   },
      { label:l==='zh'?'预约':'Bookings',  href:`/${l}/bookings` },
    ]},
    { section: l==='zh'?'门户':'Portal', items: [
      { label:l==='zh'?'预约课程':'Book a Class',    href:`/${l}/book-class`  },
      { label:l==='zh'?'我的课表':'My Schedule',     href:`/${l}/my-schedule` },
      { label:l==='zh'?'租借场地':'Rent a Space',    href:`/${l}/rent-space`  },
    ]},
  ]

  const isLogin = typeof window !== 'undefined' && window.location.pathname.includes('/login')

  if (isLogin) {
    return (
      <html lang={l}>
        <body style={{margin:0}}>{children}</body>
      </html>
    )
  }

  return (
    <html lang={l}>
      <body style={{margin:0,fontFamily:'sans-serif',background:'#FAF7F2',display:'flex',flexDirection:'column',minHeight:'100vh'}}>
        <header style={{height:56,background:'#fff',borderBottom:'1px solid #E8DDD0',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 28px',position:'sticky',top:0,zIndex:100}}>
          <a href={`/${l}/dashboard`} style={{textDecoration:'none',fontFamily:'Georgia,serif',fontSize:22,color:'#3D2B1F'}}>
            Space <span style={{color:'#7A9E87',fontStyle:'italic'}}>Wellness</span>
          </a>
          <div style={{display:'flex',gap:8,alignItems:'center'}}>
            <button onClick={()=>switchLang('en')} style={{background:'none',border:'none',cursor:'pointer',fontSize:12,fontWeight:l==='en'?700:400,color:l==='en'?'#3D2B1F':'#8B6F52',padding:'3px 8px',fontFamily:'sans-serif'}}>EN</button>
            <span style={{color:'#C9B89E'}}>|</span>
            <button onClick={()=>switchLang('zh')} style={{background:'none',border:'none',cursor:'pointer',fontSize:12,fontWeight:l==='zh'?700:400,color:l==='zh'?'#3D2B1F':'#8B6F52',padding:'3px 8px',fontFamily:'sans-serif'}}>中文</button>
            <div style={{marginLeft:8,fontSize:11,background:'#F2EDE4',color:'#8B6F52',padding:'3px 10px',borderRadius:20,cursor:'pointer'}} onClick={()=>alert(l==='zh'?'管理员账户\nSarah Chen\nsarah@spacewellness.ca':'Admin Account\nSarah Chen\nsarah@spacewellness.ca')}>
              {l==='zh'?'管理员':'Admin'}
            </div>
            <a href={`/${l}/login`} style={{fontSize:12,color:'#8B6F52',textDecoration:'none',padding:'4px 10px',border:'1px solid #E8DDD0',borderRadius:6}}>
              {l==='zh'?'退出':'Sign Out'}
            </a>
          </div>
        </header>
        <div style={{display:'flex',flex:1}}>
          <nav style={{width:210,background:'#fff',borderRight:'1px solid #E8DDD0',padding:'16px 0',flexShrink:0}}>
            {nav.map(group=>(
              <div key={group.section}>
                <div style={{fontSize:10,letterSpacing:'.1em',textTransform:'uppercase',color:'#C9B89E',padding:'14px 20px 6px',fontWeight:500}}>{group.section}</div>
                {group.items.map(item=>(
                  <a key={item.href} href={item.href} style={{display:'block',padding:'10px 20px',fontSize:13,color:'#8B6F52',textDecoration:'none',borderLeft:'2px solid transparent'}}
                    onMouseOver={e=>{(e.currentTarget as HTMLElement).style.background='#F2EDE4';(e.currentTarget as HTMLElement).style.color='#3D2B1F'}}
                    onMouseOut={e=>{(e.currentTarget as HTMLElement).style.background='transparent';(e.currentTarget as HTMLElement).style.color='#8B6F52'}}
                  >{item.label}</a>
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
