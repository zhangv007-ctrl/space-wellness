export default function Layout({ children, params }: { children: React.ReactNode; params: { locale: string } }) {
  const l = params.locale
  const nav = [['Dashboard',`/${l}/dashboard`],['Clients',`/${l}/clients`],['Classes',`/${l}/classes`],['Spaces',`/${l}/spaces`],['Bookings',`/${l}/bookings`],['Book a Class',`/${l}/book-class`],['My Schedule',`/${l}/my-schedule`],['Rent a Space',`/${l}/rent-space`]]
  return (
    <html lang={l}>
      <body style={{margin:0,fontFamily:'sans-serif',background:'#FAF7F2',display:'flex',flexDirection:'column',minHeight:'100vh'}}>
        <header style={{height:56,background:'#fff',borderBottom:'1px solid #E8DDD0',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 28px',position:'sticky',top:0,zIndex:100}}>
          <div style={{fontFamily:'Georgia,serif',fontSize:22,color:'#3D2B1F'}}>Space <span style={{color:'#7A9E87',fontStyle:'italic'}}>Wellness</span></div>
          <div style={{display:'flex',gap:8,alignItems:'center'}}>
            <a href="/en/dashboard" style={{fontSize:12,color:'#8B6F52',textDecoration:'none',padding:'3px 8px'}}>EN</a>
            <span style={{color:'#C9B89E'}}>|</span>
            <a href="/zh/dashboard" style={{fontSize:12,color:'#8B6F52',textDecoration:'none',padding:'3px 8px'}}>中文</a>
            <span style={{marginLeft:8,fontSize:11,background:'#F2EDE4',color:'#8B6F52',padding:'3px 10px',borderRadius:20}}>Admin</span>
          </div>
        </header>
        <div style={{display:'flex',flex:1}}>
          <nav style={{width:200,background:'#fff',borderRight:'1px solid #E8DDD0',padding:'16px 0',flexShrink:0}}>
            {nav.map(([label,href])=>(
              <a key={href} href={href} style={{display:'block',padding:'10px 20px',fontSize:13,color:'#8B6F52',textDecoration:'none'}}>{label}</a>
            ))}
          </nav>
          <main style={{flex:1,padding:28,overflowY:'auto'}}>{children}</main>
        </div>
      </body>
    </html>
  )
}
