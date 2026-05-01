'use client'
import { useState } from 'react'
const DAYS = [
  { date: 'Wednesday, June 18', classes: [
    { time: '7:00 am – 8:00 am',  name: 'Morning Flow',          space: 'Studio A',       teacher: 'Emma K.', level: 'Beginner',     spots: 2 },
    { time: '9:30 am – 10:30 am', name: 'Reformer Fundamentals', space: 'Reformer Suite',  teacher: 'Lisa M.', level: 'Intermediate', spots: 0 },
    { time: '2:00 pm – 3:00 pm',  name: 'Core & Balance',        space: 'Open Floor',     teacher: 'Emma K.', level: 'All levels',   spots: 8 },
    { time: '5:30 pm – 6:30 pm',  name: 'Evening Reset',         space: 'Studio A',       teacher: 'Lisa M.', level: 'Advanced',     spots: 0 },
  ]},
  { date: 'Thursday, June 19', classes: [
    { time: '8:00 am – 9:00 am',  name: 'Morning Stretch',       space: 'Studio A',       teacher: 'Emma K.', level: 'Beginner',     spots: 5 },
    { time: '6:00 pm – 7:00 pm',  name: 'Power Pilates',         space: 'Open Floor',     teacher: 'Lisa M.', level: 'Advanced',     spots: 1 },
  ]},
]
export default function BookClassPage() {
  const [selected, setSelected] = useState<any>(null)
  const [toast, setToast] = useState('')
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }
  return (
    <div style={{padding:8}}>
      <div style={{marginBottom:22}}>
        <h1 style={{fontFamily:'Georgia,serif',fontSize:28,color:'#3D2B1F',margin:0}}>Book a Class</h1>
        <p style={{color:'#8B6F52',margin:'4px 0 0',fontSize:13}}>Select a class and reserve your spot</p>
      </div>
      <div style={{display:'flex',gap:10,marginBottom:24}}>
        <select style={{padding:'8px 12px',border:'1px solid #E8DDD0',borderRadius:8,fontSize:13,background:'#FAF7F2'}}><option>All levels</option><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select>
        <select style={{padding:'8px 12px',border:'1px solid #E8DDD0',borderRadius:8,fontSize:13,background:'#FAF7F2'}}><option>Any teacher</option><option>Emma K.</option><option>Lisa M.</option></select>
      </div>
      {DAYS.map(day=>(
        <div key={day.date} style={{marginBottom:28}}>
          <div style={{fontSize:11,letterSpacing:'.1em',textTransform:'uppercase',color:'#C9B89E',fontWeight:500,marginBottom:12,paddingBottom:6,borderBottom:'1px solid #F2EDE4'}}>{day.date}</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
            {day.classes.map(cls=>(
              <div key={cls.name} onClick={()=>cls.spots>0&&setSelected(cls)} style={{background:'#fff',border:'1px solid #E8DDD0',borderRadius:12,padding:18,cursor:cls.spots>0?'pointer':'default',opacity:cls.spots===0?.65:1,position:'relative',overflow:'hidden',transition:'all .2s',borderLeft:`3px solid ${cls.spots===0?'#C9B89E':'#7A9E87'}`}} onMouseOver={e=>{if(cls.spots>0)(e.currentTarget as HTMLElement).style.boxShadow='0 4px 20px rgba(61,43,31,.1)'}} onMouseOut={e=>{(e.currentTarget as HTMLElement).style.boxShadow='none'}}>
                <div style={{fontSize:11,letterSpacing:'.06em',textTransform:'uppercase',color:'#8B6F52',marginBottom:4}}>{cls.time}</div>
                <div style={{fontFamily:'Georgia,serif',fontSize:17,color:'#3D2B1F',marginBottom:8}}>{cls.name}</div>
                <div style={{display:'flex',gap:12,fontSize:12,color:'#8B6F52',marginBottom:10}}><span>{cls.space}</span><span>{cls.teacher}</span><span>{cls.level}</span></div>
                <div style={{fontSize:12,fontWeight:500,color:cls.spots===0?'#C9B89E':cls.spots===1?'#B89A5A':'#7A9E87'}}>
                  {cls.spots===0?'● Full — join waitlist':`● ${cls.spots} spot${cls.spots>1?'s':''} left`}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      {selected&&(
        <div onClick={e=>e.target===e.currentTarget&&setSelected(null)} style={{position:'fixed',inset:0,background:'rgba(42,35,32,.4)',zIndex:200,display:'flex',alignItems:'center',justifyContent:'center',backdropFilter:'blur(2px)'}}>
          <div style={{background:'#fff',borderRadius:16,padding:28,width:420,maxWidth:'92vw',boxShadow:'0 4px 32px rgba(61,43,31,.12)'}}>
            <div style={{fontFamily:'Georgia,serif',fontSize:22,color:'#3D2B1F',marginBottom:4}}>Confirm Booking</div>
            <div style={{fontSize:12,color:'#8B6F52',marginBottom:20}}>Review your selection before confirming</div>
            <div style={{background:'#FAF7F2',borderRadius:12,padding:16,marginBottom:16}}>
              <div style={{fontFamily:'Georgia,serif',fontSize:20,color:'#3D2B1F',marginBottom:4}}>{selected.name}</div>
              <div style={{fontSize:13,color:'#8B6F52'}}>{selected.time}</div>
              <div style={{fontSize:13,color:'#8B6F52'}}>{selected.space} · {selected.teacher}</div>
            </div>
            <div style={{marginBottom:20}}>
              <div style={{fontSize:12,fontWeight:500,color:'#8B6F52',textTransform:'uppercase',letterSpacing:'.04em',marginBottom:6}}>Notification preference</div>
              <select style={{width:'100%',padding:'9px 12px',border:'1px solid #E8DDD0',borderRadius:8,fontSize:13,background:'#FAF7F2'}}><option>Email confirmation</option><option>SMS confirmation</option><option>Both</option></select>
            </div>
            <div style={{display:'flex',gap:10,justifyContent:'flex-end',paddingTop:16,borderTop:'1px solid #E8DDD0'}}>
              <button onClick={()=>setSelected(null)} style={{background:'transparent',border:'1px solid #E8DDD0',borderRadius:8,padding:'8px 16px',fontSize:13,cursor:'pointer'}}>Cancel</button>
              <button onClick={()=>{setSelected(null);showToast('Booked! Confirmation email sent.')}} style={{background:'#3D2B1F',color:'#fff',border:'none',borderRadius:8,padding:'8px 16px',fontSize:13,cursor:'pointer'}}>Confirm Booking</button>
            </div>
          </div>
        </div>
      )}
      <div style={{position:'fixed',bottom:24,right:24,background:'#3D2B1F',color:'#fff',padding:'12px 20px',borderRadius:10,fontSize:13,zIndex:300,opacity:toast?1:0,transform:toast?'translateY(0)':'translateY(8px)',transition:'all .25s',pointerEvents:'none'}}>{toast}</div>
    </div>
  )
}
