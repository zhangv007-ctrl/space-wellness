'use client'
import { useState } from 'react'
const DAYS = [
  { dateEn:'Wednesday, June 18', dateZh:'6月18日 周三', classes:[
    { time:'7:00 am – 8:00 am',  nameEn:'Morning Flow',          nameZh:'晨间流动',   space:'Studio A',       teacher:'Emma K.', levelEn:'Beginner',     levelZh:'初级',     spots:2 },
    { time:'9:30 am – 10:30 am', nameEn:'Reformer Fundamentals', nameZh:'普拉提基础', space:'Reformer Suite', teacher:'Lisa M.', levelEn:'Intermediate', levelZh:'中级',     spots:0 },
    { time:'2:00 pm – 3:00 pm',  nameEn:'Core & Balance',        nameZh:'核心平衡',   space:'Open Floor',    teacher:'Emma K.', levelEn:'All levels',   levelZh:'全部程度', spots:8 },
    { time:'5:30 pm – 6:30 pm',  nameEn:'Evening Reset',         nameZh:'傍晚放松',   space:'Studio A',      teacher:'Lisa M.', levelEn:'Advanced',     levelZh:'高级',     spots:0 },
  ]},
  { dateEn:'Thursday, June 19', dateZh:'6月19日 周四', classes:[
    { time:'8:00 am – 9:00 am',  nameEn:'Morning Stretch',       nameZh:'晨间拉伸',   space:'Studio A',      teacher:'Emma K.', levelEn:'Beginner',     levelZh:'初级',     spots:5 },
    { time:'6:00 pm – 7:00 pm',  nameEn:'Power Pilates',         nameZh:'力量普拉提', space:'Open Floor',    teacher:'Lisa M.', levelEn:'Advanced',     levelZh:'高级',     spots:1 },
  ]},
]
export default function BookClassPage({ params }: { params: { locale: string } }) {
  const zh = params.locale === 'zh'
  const [selected, setSelected] = useState<any>(null)
  const [toast, setToast] = useState('')
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }
  return (
    <div style={{padding:8}}>
      <div style={{marginBottom:22}}>
        <h1 style={{fontFamily:'Georgia,serif',fontSize:28,color:'#3D2B1F',margin:0}}>{zh?'预约课程':'Book a Class'}</h1>
        <p style={{color:'#8B6F52',margin:'4px 0 0',fontSize:13}}>{zh?'选择课程并预留名额':'Select a class and reserve your spot'}</p>
      </div>
      <div style={{display:'flex',gap:10,marginBottom:24}}>
        <select style={{padding:'8px 12px',border:'1px solid #E8DDD0',borderRadius:8,fontSize:13,background:'#FAF7F2'}}><option>{zh?'全部程度':'All levels'}</option><option>{zh?'初级':'Beginner'}</option><option>{zh?'中级':'Intermediate'}</option><option>{zh?'高级':'Advanced'}</option></select>
        <select style={{padding:'8px 12px',border:'1px solid #E8DDD0',borderRadius:8,fontSize:13,background:'#FAF7F2'}}><option>{zh?'全部教师':'Any teacher'}</option><option>Emma K.</option><option>Lisa M.</option></select>
      </div>
      {DAYS.map(day=>(
        <div key={day.dateEn} style={{marginBottom:28}}>
          <div style={{fontSize:11,letterSpacing:'.1em',textTransform:'uppercase',color:'#C9B89E',fontWeight:500,marginBottom:12,paddingBottom:6,borderBottom:'1px solid #F2EDE4'}}>{zh?day.dateZh:day.dateEn}</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
            {day.classes.map(cls=>(
              <div key={cls.nameEn} onClick={()=>cls.spots>0&&setSelected({...cls,zh})} style={{background:'#fff',border:'1px solid #E8DDD0',borderRadius:12,padding:18,cursor:cls.spots>0?'pointer':'default',opacity:cls.spots===0?.65:1,borderLeft:`3px solid ${cls.spots===0?'#C9B89E':'#7A9E87'}`}}>
                <div style={{fontSize:11,letterSpacing:'.06em',textTransform:'uppercase',color:'#8B6F52',marginBottom:4}}>{cls.time}</div>
                <div style={{fontFamily:'Georgia,serif',fontSize:17,color:'#3D2B1F',marginBottom:8}}>{zh?cls.nameZh:cls.nameEn}</div>
                <div style={{display:'flex',gap:12,fontSize:12,color:'#8B6F52',marginBottom:10}}><span>{cls.space}</span><span>{cls.teacher}</span><span>{zh?cls.levelZh:cls.levelEn}</span></div>
                <div style={{fontSize:12,fontWeight:500,color:cls.spots===0?'#C9B89E':cls.spots===1?'#B89A5A':'#7A9E87'}}>
                  {cls.spots===0?(zh?'● 已满 — 加入候补':'● Full — join waitlist'):`● ${cls.spots} ${zh?(cls.spots===1?'个名额剩余':'个名额剩余'):(cls.spots===1?'spot left':'spots left')}`}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      {selected&&(
        <div onClick={e=>e.target===e.currentTarget&&setSelected(null)} style={{position:'fixed',inset:0,background:'rgba(42,35,32,.4)',zIndex:200,display:'flex',alignItems:'center',justifyContent:'center',backdropFilter:'blur(2px)'}}>
          <div style={{background:'#fff',borderRadius:16,padding:28,width:420,maxWidth:'92vw',boxShadow:'0 4px 32px rgba(61,43,31,.12)'}}>
            <div style={{fontFamily:'Georgia,serif',fontSize:22,color:'#3D2B1F',marginBottom:4}}>{zh?'确认预约':'Confirm Booking'}</div>
            <div style={{fontSize:12,color:'#8B6F52',marginBottom:20}}>{zh?'确认前请核查以下信息':'Review your selection before confirming'}</div>
            <div style={{background:'#FAF7F2',borderRadius:12,padding:16,marginBottom:16}}>
              <div style={{fontFamily:'Georgia,serif',fontSize:20,color:'#3D2B1F',marginBottom:4}}>{zh?selected.nameZh:selected.nameEn}</div>
              <div style={{fontSize:13,color:'#8B6F52'}}>{selected.time}</div>
              <div style={{fontSize:13,color:'#8B6F52'}}>{selected.space} · {selected.teacher}</div>
            </div>
            <div style={{marginBottom:20}}>
              <div style={{fontSize:12,fontWeight:500,color:'#8B6F52',textTransform:'uppercase' as const,letterSpacing:'.04em',marginBottom:6}}>{zh?'通知方式':'Notification preference'}</div>
              <select style={{width:'100%',padding:'9px 12px',border:'1px solid #E8DDD0',borderRadius:8,fontSize:13,background:'#FAF7F2'}}><option>{zh?'邮件确认':'Email confirmation'}</option><option>{zh?'短信确认':'SMS confirmation'}</option><option>{zh?'两者都要':'Both'}</option></select>
            </div>
            <div style={{display:'flex',gap:10,justifyContent:'flex-end',paddingTop:16,borderTop:'1px solid #E8DDD0'}}>
              <button onClick={()=>setSelected(null)} style={{background:'transparent',border:'1px solid #E8DDD0',borderRadius:8,padding:'8px 16px',fontSize:13,cursor:'pointer'}}>{zh?'取消':'Cancel'}</button>
              <button onClick={()=>{setSelected(null);showToast(zh?'预约成功！确认邮件已发送。':'Booked! Confirmation email sent.')}} style={{background:'#3D2B1F',color:'#fff',border:'none',borderRadius:8,padding:'8px 16px',fontSize:13,cursor:'pointer'}}>{zh?'确认预约':'Confirm Booking'}</button>
            </div>
          </div>
        </div>
      )}
      <div style={{position:'fixed',bottom:24,right:24,background:'#3D2B1F',color:'#fff',padding:'12px 20px',borderRadius:10,fontSize:13,zIndex:300,opacity:toast?1:0,transform:toast?'translateY(0)':'translateY(8px)',transition:'all .25s',pointerEvents:'none'}}>{toast}</div>
    </div>
  )
}
