import TopBar from '../../components/TopBar'

export default function Layout({ children, params }: { children: React.ReactNode; params: { locale: string } }) {
  const l = params.locale || 'en'
  const zh = l === 'zh'
  const nav = [
    { section: zh?'概览':'Overview', items: [{ label:zh?'控制台':'Dashboard', href:`/${l}/dashboard` }] },
    { section: zh?'管理':'Management', items: [
      { label:zh?'客户':'Clients',  href:`/${l}/clients`  },
      { label:zh?'课程':'Classes',  href:`/${l}/classes`  },
      { label:zh?'场地':'Spaces',   href:`/${l}/spaces`   },
      { label:zh?'预约':'Bookings', href:`/${l}/bookings` },
    ]},
    { section: zh?'门户':'Portal', items: [
      { label:zh?'预约课程':'Book a Class',  href:`/${l}/book-class`  },
      { label:zh?'我的课表':'My Schedule',   href:`/${l}/my-schedule` },
      { label:zh?'租借场地':'Rent a Space',  href:`/${l}/rent-space`  },
    ]},
  ]
  return (
    <html lang={l}>
      <body style={{margin:0,fontFamily:'sans-serif',background:'#FAF7F2',display:'flex',flexDirection:'column',minHeight:'100vh'}}>
        <TopBar locale={l} />
        <div style={{display:'flex',flex:1}}>
          <nav style={{width:210,background:'#fff',borderRight:'1px solid #E8DDD0',padding:'16px 0',flexShrink:0}}>
            {nav.map(group=>(
              <div key={group.section}>
                <div style={{fontSize:10,letterSpacing:'.1em',textTransform:'uppercase',color:'#C9B89E',padding:'14px 20px 6px',fontWeight:500}}>{group.section}</div>
                {group.items.map(item=>(
                  <a key={item.href} href={item.href} style={{display:'block',padding:'10px 20px',fontSize:13,color:'#8B6F52',textDecoration:'none'}}>{item.label}</a>
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
