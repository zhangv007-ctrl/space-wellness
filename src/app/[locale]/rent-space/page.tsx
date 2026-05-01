'use client'
import { useState } from 'react'
const SPACES = [
  { name: 'Studio A',       cap: 10, desc: 'Full mirrors, barre rail, sprung floor', available: true  },
  { name: 'Reformer Suite', cap: 6,  desc: '6 Pilates reformers',                    available: false },
  { name: 'Zone C',         cap: 4,  desc: 'Compact zone, small group sessions',     available: true  },
  { name: 'Open Floor',     cap: 12, desc: 'Large open mat space',                   available: true  },
  { name: 'Therapy Room',   cap: 2,  desc: 'Private, quiet, one-on-one',             available: true  },
]
export default function RentSpacePage() {
  const [selected, setSelected] = useState<any>(null)
  const [toast, setToast] = useState('')
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }
  return (
    <div style={{padding:8}}>
      <div style={{marginBottom:22}}>
        <h1 style={{fontFamily:'Georgia,serif',fontSize:28,color:'#3D2B1F',margin:0}}>Rent a Space</h1>
        <p style={{color:'#8B6F52',margin:'4px 0 0',fontSize:13}}>Select a zone and time for your private session</p>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1.5fr',gap:24}}>
        <div style={{background:'#fff',border:'1px solid #E8DDD0',borderRadius:12,padding:24}}>
          <div style={{fontFamily:'Georgia,serif',fontSize:16,color:'#3D2B1F',marginBottom:16}}>Select date & time</div>
          {[['Date','date'],['Start time','time']].map(([label,type])=>(
            <div key={label} style={{marginBottom:14}}>
              <div style={{fontSize:12,fontWeight:500,color:'#8B6F52',textTransform:'uppercase',letterSpacing:'.04em',marginBottom:6}}>{label}</div>
              <input type={type} defaultValue={type==='date'?'2025-06-18':'09:00'} style={{width:'100%',padding:'9px 12px',border:'1px solid #E8DDD0',borderRadius:8,fontSize:13,background:'#FAF7F2',outline:'none',boxSizing:'border-box'}}/>
            </div>
          ))}
          <div style={{marginBottom:20}}>
            <div style={{fontSize:12,fontWeight:500,color:'#8B6F52',textTransform:'uppercase',letterSpacing:'.04em',marginBottom:6}}>Duration</div>
            <select style={{width:'100%',padding:'9px 12px',border:'1px solid #E8DDD0',borderRadius:8,fontSize:13,background:'#FAF7F2'}}><option>1 hour</option><option>1.5 hours</option><option>2 hours</option></select>
          </div>
          <button style={{width:'100%',background:'#7A9E87',color:'#fff',border:'none',padding:'10px 16px',borderRadius:8,cursor:'pointer',fontSize:13,fontWeight:500}}>Check availability</button>
        </div>
        <div>
          <div style={{fontSize:12,fontWeight:500,color:'#8B6F52',textTransform:'uppercase',letterSpacing:'.04em',marginBottom:12}}>Available spaces · Wed Jun 18 · 9:00 am</div>
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            {SPACES.map(s=>(
              <div key={s.name} onClick={()=>s.available&&setSelected(s)} style={{background:'#fff',border:'1px solid #E8DDD0',borderRadius:12,padding:16,cursor:s.available?'pointer':'default',opacity:s.available?1:.55,borderLeft:`3px solid ${s.available?'#7A9E87':'#C9B89E'}`}} onMouseOver={e=>{if(s.available)(e.currentTarget as HTMLElement).style.boxShadow='0 4px 16px rgba(61,43,31,.08)'}} onMouseOut={e=>{(e.currentTarget as HTMLElement).style.boxShadow='none'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div>
                    <div style={{fontFamily:'Georgia,serif',fontSize:16,color:'#3D2B1F',marginBottom:4}}>{s.name}</div>
                    <div style={{fontSize:12,color:'#8B6F52'}}>Max {s.cap} people · {s.desc}</div>
                  </div>
                  {s.available
                    ?<button style={{background:'#7A9E87',color:'#fff',border:'none',borderRadius:8,padding:'6px 14px',fontSize:12,cursor:'pointer'}}>Reserve</button>
                    :<span style={{background:'#FAEBE9',color:'#C0544A',padding:'2px 8px',borderRadius:20,fontSize:11,fontWeight:500}}>Unavailable</span>
                  }
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {selected&&(
        <div onClick={e=>e.target===e.currentTarget&&setSelected(null)} style={{position:'fixed',inset:0,background:'rgba(42,35,32,.4)',zIndex:200,display:'flex',alignItems:'center',justifyContent:'center',backdropFilter:'blur(2px)'}}>
          <div style={{background:'#fff',borderRadius:16,padding:28,width:400,maxWidth:'92vw',boxShadow:'0 4px 32px rgba(61,43,31,.12)'}}>
            <div style={{fontFamily:'Georgia,serif',fontSize:22,color:'#3D2B1F',marginBottom:4}}>Confirm Space Rental</div>
            <div style={{fontSize:12,color:'#8B6F52',marginBottom:20}}>{selected.name} · Wed Jun 18 · 9:00 am – 10:00 am</div>
            <div style={{background:'#FAF7F2',borderRadius:12,padding:16,marginBottom:16}}>
              <div style={{fontSize:13,color:'#8B6F52'}}>Max capacity: {selected.cap} people</div>
              <div style={{fontSize:13,color:'#8B6F52',marginTop:4}}>{selected.desc}</div>
            </div>
            <div style={{marginBottom:20}}>
              <div style={{fontSize:12,fontWeight:500,color:'#8B6F52',textTransform:'uppercase',letterSpacing:'.04em',marginBottom:6}}>Notes (optional)</div>
              <input placeholder="e.g. Private session — 4 clients" style={{width:'100%',padding:'9px 12px',border:'1px solid #E8DDD0',borderRadius:8,fontSize:13,background:'#FAF7F2',outline:'none',boxSizing:'border-box'}}/>
            </div>
            <div style={{display:'flex',gap:10,justifyContent:'flex-end',paddingTop:16,borderTop:'1px solid #E8DDD0'}}>
              <button onClick={()=>setSelected(null)} style={{background:'transparent',border:'1px solid #E8DDD0',borderRadius:8,padding:'8px 16px',fontSize:13,cursor:'pointer'}}>Cancel</button>
              <button onClick={()=>{setSelected(null);showToast('Space reserved! Confirmation sent.')}} style={{background:'#3D2B1F',color:'#fff',border:'none',borderRadius:8,padding:'8px 16px',fontSize:13,cursor:'pointer'}}>Confirm Rental</button>
            </div>
          </div>
        </div>
      )}
      <div style={{position:'fixed',bottom:24,right:24,background:'#3D2B1F',color:'#fff',padding:'12px 20px',borderRadius:10,fontSize:13,zIndex:300,opacity:toast?1:0,transform:toast?'translateY(0)':'translateY(8px)',transition:'all .25s',pointerEvents:'none'}}>{toast}</div>
    </div>
  )
}
