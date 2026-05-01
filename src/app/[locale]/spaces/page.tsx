'use client'
import { useState } from 'react'
const SPACES = [
  { name: 'Studio A',       cap: 10, status: 'available', detail: 'Next booking: 5:30 pm · Evening Reset',      desc: 'Full mirrors, barre rail, sprung hardwood floor' },
  { name: 'Reformer Suite', cap: 6,  status: 'booked',    detail: 'Reformer Fundamentals · ends 11:00 am',      desc: '6 Pilates reformers, equipment storage' },
  { name: 'Zone C',         cap: 4,  status: 'rented',    detail: 'Teacher: Mark Torres · Private 11am–1pm',    desc: 'Compact zone, ideal for small group sessions' },
  { name: 'Open Floor',     cap: 12, status: 'available', detail: 'Next booking: 2:00 pm · Core & Balance',     desc: 'Large open mat space, suitable for all formats' },
  { name: 'Therapy Room',   cap: 2,  status: 'available', detail: 'No bookings today',                          desc: 'Private, quiet room for one-on-one sessions' },
]
export default function SpacesPage() {
  const [toast, setToast] = useState('')
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }
  const statusColor = (s: string) => s==='available'?'#7A9E87':s==='booked'?'#C0544A':'#B89A5A'
  const statusLabel = (s: string) => s==='available'?'Available now':s==='booked'?'In use':'Rented'
  const statusBg = (s: string) => s==='available'?'#E8F2EA':s==='booked'?'#FAEBE9':'#FDF3E0'
  const statusText = (s: string) => s==='available'?'#3D7A4E':s==='booked'?'#C0544A':'#8A6020'
  return (
    <div style={{padding:8}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:22}}>
        <div>
          <h1 style={{fontFamily:'Georgia,serif',fontSize:28,color:'#3D2B1F',margin:0}}>Spaces</h1>
          <p style={{color:'#8B6F52',margin:'4px 0 0',fontSize:13}}>5 zones · Manage capacity and availability</p>
        </div>
        <button onClick={()=>showToast('Opening space editor…')} style={{background:'#3D2B1F',color:'#fff',border:'none',padding:'8px 16px',borderRadius:8,cursor:'pointer',fontSize:13}}>+ Add Space</button>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16,marginBottom:24}}>
        {SPACES.map(s=>(
          <div key={s.name} style={{background:'#fff',border:'1px solid #E8DDD0',borderRadius:12,padding:20,borderLeft:`3px solid ${statusColor(s.status)}`,cursor:'pointer',transition:'all .2s'}} onMouseOver={e=>{(e.currentTarget as HTMLElement).style.boxShadow='0 4px 20px rgba(61,43,31,.1)'}} onMouseOut={e=>{(e.currentTarget as HTMLElement).style.boxShadow='none'}}>
            <div style={{fontFamily:'Georgia,serif',fontSize:18,color:'#3D2B1F',marginBottom:4}}>{s.name}</div>
            <div style={{fontSize:12,color:'#8B6F52',marginBottom:12}}>Max capacity: {s.cap} people · {s.desc}</div>
            <span style={{background:statusBg(s.status),color:statusText(s.status),padding:'2px 8px',borderRadius:20,fontSize:11,fontWeight:500}}>{statusLabel(s.status)}</span>
            <hr style={{border:'none',borderTop:'1px solid #F2EDE4',margin:'12px 0'}}/>
            <div style={{fontSize:11,color:'#C9B89E'}}>{s.detail}</div>
          </div>
        ))}
      </div>
      <div style={{background:'#fff',border:'1px solid #E8DDD0',borderRadius:12,padding:24}}>
        <div style={{fontFamily:'Georgia,serif',fontSize:18,color:'#3D2B1F',marginBottom:16}}>Today's Utilisation</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:16}}>
          {[['Studio A',80,''],['Reformer Suite',100,'red'],['Zone C',60,'amber'],['Open Floor',33,''],['Therapy Room',0,'']].map(([name,pct,cls])=>(
            <div key={name}>
              <div style={{fontSize:12,fontWeight:500,color:'#3D2B1F',marginBottom:4}}>{name}</div>
              <div style={{height:4,background:'#F2EDE4',borderRadius:2}}>
                <div style={{height:'100%',borderRadius:2,width:`${pct}%`,background:cls==='red'?'#C0544A':cls==='amber'?'#B89A5A':'#7A9E87'}}/>
              </div>
              <div style={{fontSize:11,color:'#C9B89E',marginTop:4}}>{pct===0?'Open':pct===100?'Full':`${pct}%`}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{position:'fixed',bottom:24,right:24,background:'#3D2B1F',color:'#fff',padding:'12px 20px',borderRadius:10,fontSize:13,zIndex:300,opacity:toast?1:0,transform:toast?'translateY(0)':'translateY(8px)',transition:'all .25s',pointerEvents:'none'}}>{toast}</div>
    </div>
  )
}
