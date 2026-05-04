'use client'
import { useState } from 'react'
const INIT = [
  { dateEn:'Wed Jun 18 · 7:00 am', dateZh:'6月18日 · 7:00 am', nameEn:'Morning Flow',  nameZh:'晨间流动',  sub:'Studio A · Emma K.', status:'confirmed' },
  { dateEn:'Wed Jun 18 · 2:00 pm', dateZh:'6月18日 · 2:00 pm', nameEn:'Core & Balance', nameZh:'核心平衡',  sub:'Open Floor · Emma K.', status:'confirmed' },
  { dateEn:'Wed Jun 18 · 5:30 pm', dateZh:'6月18日 · 5:30 pm', nameEn:'Evening Reset',  nameZh:'傍晚放松',  sub:'Studio A · Lisa M.', status:'waitlist', pos:3 },
  { dateEn:'Thu Jun 19 · 6:00 pm', dateZh:'6月19日 · 6:00 pm', nameEn:'Power Pilates',  nameZh:'力量普拉提', sub:'Open Floor · Lisa M.', status:'confirmed' },
]
export default function MySchedulePage({ params }: { params: { locale: string } }) {
  const zh = params.locale === 'zh'
  const [tab, setTab] = useState('upcoming')
  const [bookings, setBookings] = useState(INIT)
  const [toast, setToast] = useState('')
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }
  const cancel = (nameEn: string) => { setBookings(b=>b.filter(x=>x.nameEn!==nameEn)); showToast(zh?'预约已取消，确认邮件已发送。':'Booking cancelled. Confirmation email sent.') }
  const tabs = [['upcoming',zh?'即将到来':'Upcoming'],['past',zh?'历史':'Past'],['waitlist',zh?'候补':'Waitlist']]
  return (
    <div style={{padding:8}}>
      <div style={{marginBottom:22}}>
        <h1 style={{fontFamily:'Georgia,serif',fontSize:28,color:'#3D2B1F',margin:0}}>{zh?'我的课表':'My Schedule'}</h1>
        <p style={{color:'#8B6F52',margin:'4px 0 0',fontSize:13}}>{zh?'即将到来与历史预约':'Your upcoming and past bookings'}</p>
      </div>
      <div style={{display:'flex',gap:2,background:'#F2EDE4',borderRadius:10,padding:3,marginBottom:20,width:'fit-content'}}>
        {tabs.map(([key,label])=>(
          <div key={key} onClick={()=>setTab(key)} style={{padding:'7px 16px',borderRadius:8,fontSize:13,cursor:'pointer',background:tab===key?'#fff':'transparent',color:tab===key?'#3D2B1F':'#8B6F52',fontWeight:tab===key?500:400}}>{label}</div>
        ))}
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:12}}>
        {bookings.length===0&&<div style={{background:'#fff',border:'1px solid #E8DDD0',borderRadius:12,padding:40,textAlign:'center',color:'#C9B89E'}}>{zh?'暂无预约':'No upcoming bookings.'}</div>}
        {bookings.map(b=>(
          <div key={b.nameEn} style={{background:'#fff',border:'1px solid #E8DDD0',borderRadius:12,padding:20,display:'flex',alignItems:'center',justifyContent:'space-between',opacity:b.status==='waitlist'?.8:1}}>
            <div>
              <div style={{fontSize:11,letterSpacing:'.07em',textTransform:'uppercase',color:'#C9B89E',marginBottom:3}}>{zh?b.dateZh:b.dateEn}</div>
              <div style={{fontFamily:'Georgia,serif',fontSize:18,color:'#3D2B1F'}}>{zh?b.nameZh:b.nameEn}</div>
              <div style={{fontSize:12,color:'#8B6F52',marginTop:4}}>{b.sub}</div>
            </div>
            <div style={{display:'flex',gap:10,alignItems:'center'}}>
              {b.status==='confirmed'
                ?<><span style={{background:'#E8F2EA',color:'#3D7A4E',padding:'2px 8px',borderRadius:20,fontSize:11,fontWeight:500}}>{zh?'已确认':'Confirmed'}</span><button onClick={()=>cancel(b.nameEn)} style={{background:'transparent',border:'1px solid #E8DDD0',borderRadius:8,padding:'5px 12px',fontSize:12,cursor:'pointer',color:'#3D2B1F'}}>{zh?'取消':'Cancel'}</button></>
                :<><span style={{background:'#FDF3E0',color:'#8A6020',padding:'2px 8px',borderRadius:20,fontSize:11,fontWeight:500}}>{zh?'候补':'Waitlist'} #{(b as any).pos}</span><button onClick={()=>cancel(b.nameEn)} style={{background:'transparent',border:'1px solid #E8DDD0',borderRadius:8,padding:'5px 12px',fontSize:12,cursor:'pointer',color:'#3D2B1F'}}>{zh?'退出候补':'Leave'}</button></>
              }
            </div>
          </div>
        ))}
      </div>
      <div style={{position:'fixed',bottom:24,right:24,background:'#3D2B1F',color:'#fff',padding:'12px 20px',borderRadius:10,fontSize:13,zIndex:300,opacity:toast?1:0,transform:toast?'translateY(0)':'translateY(8px)',transition:'all .25s',pointerEvents:'none'}}>{toast}</div>
    </div>
  )
}
