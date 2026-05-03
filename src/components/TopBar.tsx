'use client'
export default function TopBar({ locale }: { locale: string }) {
  const switchLang = (newL: string) => {
    const segs = window.location.pathname.split('/')
    segs[1] = newL
    window.location.href = segs.join('/')
  }
  const l = locale
  return (
    <header style={{height:56,background:'#fff',borderBottom:'1px solid #E8DDD0',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 28px',position:'sticky',top:0,zIndex:100}}>
      <a href={`/${l}/dashboard`} style={{textDecoration:'none',fontFamily:'Georgia,serif',fontSize:22,color:'#3D2B1F'}}>
        Space <span style={{color:'#7A9E87',fontStyle:'italic'}}>Wellness</span>
      </a>
      <div style={{display:'flex',gap:8,alignItems:'center'}}>
        <button onClick={()=>switchLang('en')} style={{background:'none',border:'none',cursor:'pointer',fontSize:12,fontWeight:l==='en'?700:400,color:l==='en'?'#3D2B1F':'#8B6F52',padding:'3px 8px'}}>EN</button>
        <span style={{color:'#C9B89E'}}>|</span>
        <button onClick={()=>switchLang('zh')} style={{background:'none',border:'none',cursor:'pointer',fontSize:12,fontWeight:l==='zh'?700:400,color:l==='zh'?'#3D2B1F':'#8B6F52',padding:'3px 8px'}}>中文</button>
        <div style={{marginLeft:8,fontSize:11,background:'#F2EDE4',color:'#8B6F52',padding:'3px 10px',borderRadius:20}}>
          {l==='zh'?'管理员':'Admin'}
        </div>
        <a href={`/${l}/login`} style={{fontSize:12,color:'#8B6F52',textDecoration:'none',padding:'4px 10px',border:'1px solid #E8DDD0',borderRadius:6}}>
          {l==='zh'?'退出':'Sign Out'}
        </a>
      </div>
    </header>
  )
}
