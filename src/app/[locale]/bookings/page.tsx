'use client'
import { useState } from 'react'
const BOOKINGS = [
  { client: 'Mia Liu',   cls: 'Morning Flow',         date: 'Jun 18 · 7:00 am',  status: 'confirmed', notif: 'Email ✓' },
  { client: 'Anna Park', cls: 'Evening Reset',         date: 'Jun 18 · 5:30 pm',  status: 'waitlist',  notif: 'SMS ✓' },
  { client: 'Tom Walsh', cls: 'Reformer Fundamentals', date: 'Jun 18 · 9:30 am',  status: 'cancelled', notif: 'Email ✓' },
  { client: 'Anna Park', cls: 'Core & Balance',        date: 'Jun 18 · 2:00 pm',  status: 'confirmed', notif: 'Email ✓' },
  { client: 'James Ko',  cls: 'Morning Flow',          date: 'Jun 19 · 7:00 am',  status: 'confirmed', notif: 'SMS ✓' },
  { client: 'Mia Liu',   cls: 'Power Pilates',         date: 'Jun 19 · 6:00 pm',  status: 'confirmed', notif: 'Email ✓' },
]
const statusStyle = (s: string) => ({background:s==='confirmed'?'#E8F2EA':s==='waitlist'?'#FDF3E0':'#FAEBE9',color:s==='confirmed'?'#3D7A4E':s==='waitlist'?'#8A6020':'#C0544A',padding:'2px 8px',borderRadius:20,fontSize:11,fontWeight:500})
export default function BookingsPage() {
  const [toast, setToast] = useState('')
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }
  return (
    <div style={{padding:8}}>
      <div style={{marginBottom:22}}>
        <h1 style={{fontFamily:'Georgia,serif',fontSize:28,color:'#3D2B1F',margin:0}}>All Bookings</h1>
        <p style={{color:'#8B6F52',margin:'4px 0 0',fontSize:13}}>Full booking history and status</p>
      </div>
      <div style={{background:'#fff',border:'1px solid #E8DDD0',borderRadius:12,overflow:'hidden'}}>
        <div style={{padding:'16px 16px 0',display:'flex',gap:10}}>
          <input placeholder="Search client…" style={{padding:'8px 12px',border:'1px solid #E8DDD0',borderRadius:8,fontSize:13,background:'#FAF7F2',outline:'none',width:200}}/>
          <select style={{padding:'8px 12px',border:'1px solid #E8DDD0',borderRadius:8,fontSize:13,background:'#FAF7F2'}}><option>All statuses</option><option>Confirmed</option><option>Waitlist</option><option>Cancelled</option></select>
          <select style={{padding:'8px 12px',border:'1px solid #E8DDD0',borderRadius:8,fontSize:13,background:'#FAF7F2'}}><option>All classes</option><option>Morning Flow</option><option>Evening Reset</option></select>
        </div>
        <div style={{overflowX:'auto',marginTop:12}}>
          <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
            <thead><tr style={{borderBottom:'1px solid #E8DDD0'}}>{['Client','Class','Date','Status','Notified',''].map(h=><th key={h} style={{textAlign:'left',padding:'10px 16px',fontSize:11,letterSpacing:'.07em',textTransform:'uppercase',color:'#C9B89E',fontWeight:500}}>{h}</th>)}</tr></thead>
            <tbody>
              {BOOKINGS.map((b,i)=>(
                <tr key={i} style={{borderBottom:'1px solid #F2EDE4'}}>
                  <td style={{padding:'12px 16px',fontWeight:500,color:'#3D2B1F'}}>{b.client}</td>
                  <td style={{padding:'12px 16px',color:'#3D2B1F'}}>{b.cls}</td>
                  <td style={{padding:'12px 16px',color:'#3D2B1F'}}>{b.date}</td>
                  <td style={{padding:'12px 16px'}}><span style={statusStyle(b.status)}>{b.status==='confirmed'?'Confirmed':b.status==='waitlist'?'Waitlist #1':'Cancelled'}</span></td>
                  <td style={{padding:'12px 16px'}}><span style={{background:'#F2EDE4',color:'#8B6F52',padding:'2px 8px',borderRadius:20,fontSize:11,fontWeight:500}}>{b.notif}</span></td>
                  <td style={{padding:'12px 16px'}}>
                    {b.status==='cancelled'?'—':b.status==='waitlist'
                      ?<button onClick={()=>showToast('Moved to confirmed. Notification sent.')} style={{background:'#7A9E87',color:'#fff',border:'none',borderRadius:8,padding:'5px 12px',fontSize:12,cursor:'pointer'}}>Confirm</button>
                      :<button onClick={()=>showToast('Booking cancelled. Confirmation sent.')} style={{background:'transparent',border:'1px solid #E8DDD0',borderRadius:8,padding:'5px 12px',fontSize:12,cursor:'pointer',color:'#3D2B1F'}}>Cancel</button>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div style={{position:'fixed',bottom:24,right:24,background:'#3D2B1F',color:'#fff',padding:'12px 20px',borderRadius:10,fontSize:13,zIndex:300,opacity:toast?1:0,transform:toast?'translateY(0)':'translateY(8px)',transition:'all .25s',pointerEvents:'none'}}>{toast}</div>
    </div>
  )
}
