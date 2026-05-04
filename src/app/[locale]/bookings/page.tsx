'use client'
import { useState } from 'react'
const BOOKINGS = [
  { client:'Mia Liu',   clsEn:'Morning Flow',         clsZh:'晨间流动',   date:'Jun 18 · 7:00 am', status:'confirmed', notif:'Email ✓' },
  { client:'Anna Park', clsEn:'Evening Reset',         clsZh:'傍晚放松',   date:'Jun 18 · 5:30 pm', status:'waitlist',  notif:'SMS ✓' },
  { client:'Tom Walsh', clsEn:'Reformer Fundamentals', clsZh:'普拉提基础', date:'Jun 18 · 9:30 am', status:'cancelled', notif:'Email ✓' },
  { client:'Anna Park', clsEn:'Core & Balance',        clsZh:'核心平衡',   date:'Jun 18 · 2:00 pm', status:'confirmed', notif:'Email ✓' },
  { client:'James Ko',  clsEn:'Morning Flow',          clsZh:'晨间流动',   date:'Jun 19 · 7:00 am', status:'confirmed', notif:'SMS ✓' },
]
export default function BookingsPage({ params }: { params: { locale: string } }) {
  const zh = params.locale === 'zh'
  const [toast, setToast] = useState('')
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }
  const statusLabel = (s: string) => s==='confirmed'?(zh?'已确认':'Confirmed'):s==='waitlist'?(zh?'候补中':'Waitlist #1'):(zh?'已取消':'Cancelled')
  const statusStyle = (s: string) => ({background:s==='confirmed'?'#E8F2EA':s==='waitlist'?'#FDF3E0':'#FAEBE9',color:s==='confirmed'?'#3D7A4E':s==='waitlist'?'#8A6020':'#C0544A',padding:'2px 8px',borderRadius:20,fontSize:11,fontWeight:500})
  return (
    <div style={{padding:8}}>
      <div style={{marginBottom:22}}>
        <h1 style={{fontFamily:'Georgia,serif',fontSize:28,color:'#3D2B1F',margin:0}}>{zh?'全部预约':'All Bookings'}</h1>
        <p style={{color:'#8B6F52',margin:'4px 0 0',fontSize:13}}>{zh?'预约历史与状态管理':'Full booking history and status'}</p>
      </div>
      <div style={{background:'#fff',border:'1px solid #E8DDD0',borderRadius:12,overflow:'hidden'}}>
        <div style={{padding:'16px 16px 0',display:'flex',gap:10}}>
          <input placeholder={zh?'搜索客户…':'Search client…'} style={{padding:'8px 12px',border:'1px solid #E8DDD0',borderRadius:8,fontSize:13,background:'#FAF7F2',outline:'none',width:200}}/>
          <select style={{padding:'8px 12px',border:'1px solid #E8DDD0',borderRadius:8,fontSize:13,background:'#FAF7F2'}}><option>{zh?'全部状态':'All statuses'}</option><option>{zh?'已确认':'Confirmed'}</option><option>{zh?'候补':'Waitlist'}</option><option>{zh?'已取消':'Cancelled'}</option></select>
          <select style={{padding:'8px 12px',border:'1px solid #E8DDD0',borderRadius:8,fontSize:13,background:'#FAF7F2'}}><option>{zh?'全部课程':'All classes'}</option><option>{zh?'晨间流动':'Morning Flow'}</option><option>{zh?'傍晚放松':'Evening Reset'}</option></select>
        </div>
        <div style={{overflowX:'auto',marginTop:12}}>
          <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
            <thead><tr style={{borderBottom:'1px solid #E8DDD0'}}>
              {[zh?'客户':'Client',zh?'课程':'Class',zh?'日期':'Date',zh?'状态':'Status',zh?'通知':'Notified',''].map(h=><th key={h} style={{textAlign:'left',padding:'10px 16px',fontSize:11,letterSpacing:'.07em',textTransform:'uppercase',color:'#C9B89E',fontWeight:500}}>{h}</th>)}
            </tr></thead>
            <tbody>
              {BOOKINGS.map((b,i)=>(
                <tr key={i} style={{borderBottom:'1px solid #F2EDE4'}}>
                  <td style={{padding:'12px 16px',fontWeight:500,color:'#3D2B1F'}}>{b.client}</td>
                  <td style={{padding:'12px 16px',color:'#3D2B1F'}}>{zh?b.clsZh:b.clsEn}</td>
                  <td style={{padding:'12px 16px',color:'#3D2B1F'}}>{b.date}</td>
                  <td style={{padding:'12px 16px'}}><span style={statusStyle(b.status)}>{statusLabel(b.status)}</span></td>
                  <td style={{padding:'12px 16px'}}><span style={{background:'#F2EDE4',color:'#8B6F52',padding:'2px 8px',borderRadius:20,fontSize:11,fontWeight:500}}>{b.notif}</span></td>
                  <td style={{padding:'12px 16px'}}>
                    {b.status==='cancelled'?'—':b.status==='waitlist'
                      ?<button onClick={()=>showToast(zh?'已确认入场，通知已发送。':'Moved to confirmed. Notification sent.')} style={{background:'#7A9E87',color:'#fff',border:'none',borderRadius:8,padding:'5px 12px',fontSize:12,cursor:'pointer'}}>{zh?'确认':'Confirm'}</button>
                      :<button onClick={()=>showToast(zh?'预约已取消，确认邮件已发送。':'Booking cancelled. Confirmation sent.')} style={{background:'transparent',border:'1px solid #E8DDD0',borderRadius:8,padding:'5px 12px',fontSize:12,cursor:'pointer',color:'#3D2B1F'}}>{zh?'取消':'Cancel'}</button>
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
