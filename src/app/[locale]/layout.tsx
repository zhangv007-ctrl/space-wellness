export default function Layout({ children, params }: { children: React.ReactNode; params: { locale: string } }) {
  const l = params.locale || 'en'
  const nav = [
    { section: 'Overview',   items: [{ label:'Dashboard', href:`/${l}/dashboard` }] },
    { section: 'Management', items: [{ label:'Clients', href:`/${l}/clients` },{ label:'Classes', href:`/${l}/classes` },{ label:'Spaces', href:`/${l}/spaces` },{ label:'Bookings', href:`/${l}/bookings` }] },
    { section: 'Portal',     items: [{ label:'Book a Class', href:`/${l}/book-class` },{ label:'My Schedule', href:`/${l}/my-schedule` },{ label:'Rent a Space', href:`/${l}/rent-space` }] },
  ]
  return (
    <html lang={l}>
      <body style={{margin:0,fontFamily:'sans-serif',background:'#FAF7F2',display:'flex',flexDirection:'column',minHeight:'100vh'}}>
        <header style={{height:56,background:'#fff',borderBottom:'1px solid #E8DDD0',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 28px',position:'sticky',top:0,zIndex:100}}>
          <a href={`/${l}/dashboard`} style={{textDecoration:'none',fontFamily:'Georgia,serif',fontSize:22,color:'#3D2B1F'}}>Space <span style={{color:'#7A9E87',fontStyle:'italic'}}>Wellness</span></a>
          <div style={{display:'flex',gap:8,alignItems:'center'}}>
            <a href={`/en/dashboard`} style={{fontSize:12,fontWeight:l==='en'?700:400,color:l==='en'?'#3D2B1F':'#8B6F52',textDecoration:'none',padding:'3px 8px'}}>EN</a>
            <span style={{color:'#C9B89E'}}>|</span>
            <a href={`/zh/dashboard`} style={{fontSize:12,fontWeight:l==='zh'?700:400,color:l==='zh'?'#3D2B1F':'#8B6F52',textDecoration:'none',padding:'3px 8px'}}>中文</a>
            <span style={{marginLeft:8,fontSize:11,background:'#F2EDE4',color:'#8B6F52',padding:'3px 10px',borderRadius:20}}>Admin</span>
            <a href={`/${l}/login`} style={{fontSize:12,color:'#8B6F52',textDecoration:'none',padding:'4px 10px',border:'1px solid #E8DDD0',borderRadius:6}}>Sign Out</a>
          </div>
        </header>
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
