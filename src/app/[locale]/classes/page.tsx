'use client'
import { useState } from 'react'
const CLASSES = [
  { nameEn: 'Morning Flow',          nameZh: '晨间流动',   level: 'beginner',     date: 'Wed Jun 18 · 7:00 am',  space: 'Studio A',       teacher: 'Emma K.', booked: 8,  max: 10, waitlist: 0 },
  { nameEn: 'Reformer Fundamentals', nameZh: '普拉提基础', level: 'intermediate', date: 'Wed Jun 18 · 9:30 am',  space: 'Reformer Suite', teacher: 'Lisa M.', booked: 6,  max: 6,  waitlist: 2 },
  { nameEn: 'Core & Balance',        nameZh: '核心平衡',   level: 'all',          date: 'Wed Jun 18 · 2:00 pm',  space: 'Open Floor',     teacher: 'Emma K.', booked: 4,  max: 12, waitlist: 0 },
  { nameEn: 'Evening Reset',         nameZh: '傍晚放松',   level: 'advanced',     date: 'Wed Jun 18 · 5:30 pm',  space: 'Studio A',       teacher: 'Lisa M.', booked: 10, max: 10, waitlist: 3 },
  { nameEn: 'Morning Stretch',       nameZh: '晨间拉伸',   level: 'beginner',     date: 'Thu Jun 19 · 8:00 am',  space: 'Studio A',       teacher: 'Emma K.', booked: 5,  max: 10, waitlist: 0 },
  { nameEn: 'Power Pilates',         nameZh: '力量普拉提', level: 'advanced',     date: 'Thu Jun 19 · 6:00 pm',  space: 'Open Floor',     teacher: 'Lisa M.', booked: 9,  max: 10, waitlist: 1 },
]
export default function ClassesPage({ params }: { params: { locale: string } }) {
  const zh = params.locale === 'zh'
  const [showModal, setShowModal] = useState(false)
  const [showWaitlist, setShowWaitlist] = useState('')
  const [toast, setToast] = useState('')
  const [tab, setTab] = useState('thisWeek')
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }
  const levelLabel = (l: string) => ({ beginner: zh?'初级':'Beginner', intermediate: zh?'中级':'Intermediate', advanced: zh?'高级':'Advanced', all: zh?'全部程度':'All levels' }[l] || l)
  const tabs = [['thisWeek', zh?'本周':'This Week'], ['upcoming', zh?'即将开始':'Upcoming'], ['past', zh?'历史':'Past']]
  return (
    <div style={{padding:8}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:22}}>
        <div>
          <h1 style={{fontFamily:'Georgia,serif',fontSize:28,color:'#3D2B1F',margin:0}}>{zh?'课程管理':'Classes'}</h1>
          <p style={{color:'#8B6F52',margin:'4px 0 0',fontSize:13}}>{zh?'管理课表、名额与候补':'Manage schedule, capacity, and waitlists'}</p>
        </div>
        <button onClick={()=>setShowModal(true)} style={{background:'#3D2B1F',color:'#fff',border:'none',padding:'8px 16px',borderRadius:8,cursor:'pointer',fontSize:13}}>{zh?'+ 创建课程':'+ Create Class'}</button>
      </div>
      <div style={{display:'flex',gap:2,background:'#F2EDE4',borderRadius:10,padding:3,marginBottom:20,width:'fit-content'}}>
        {tabs.map(([key,label])=>(
          <div key={key} onClick={()=>setTab(key)} style={{padding:'7px 16px',borderRadius:8,fontSize:13,cursor:'pointer',background:tab===key?'#fff':'transparent',color:tab===key?'#3D2B1F':'#8B6F52',fontWeight:tab===key?500:400}}>{label}</div>
        ))}
      </div>
      <div style={{background:'#fff',border:'1px solid #E8DDD0',borderRadius:12,overflow:'hidden'}}>
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
            <thead><tr style={{borderBottom:'1px solid #E8DDD0'}}>
              {[zh?'课程':'Class',zh?'日期与时间':'Date & Time',zh?'场地':'Space',zh?'教师':'Teacher',zh?'名额':'Capacity',zh?'候补':'Waitlist',zh?'状态':'Status',''].map(h=><th key={h} style={{textAlign:'left',padding:'10px 16px',fontSize:11,letterSpacing:'.07em',textTransform:'uppercase',color:'#C9B89E',fontWeight:500}}>{h}</th>)}
            </tr></thead>
            <tbody>
              {CLASSES.map((c,i)=>{
                const full = c.booked >= c.max
                const pct = Math.round(c.booked/c.max*100)
                return (
                  <tr key={i} style={{borderBottom:'1px solid #F2EDE4'}}>
                    <td style={{padding:'12px 16px'}}><div style={{fontWeight:500,color:'#3D2B1F'}}>{zh?c.nameZh:c.nameEn}</div><div style={{fontSize:11,color:'#C9B89E',marginTop:2}}>{levelLabel(c.level)}</div></td>
                    <td style={{padding:'12px 16px',color:'#3D2B1F'}}>{c.date}</td>
                    <td style={{padding:'12px 16px',color:'#3D2B1F'}}>{c.space}</td>
                    <td style={{padding:'12px 16px',color:'#3D2B1F'}}>{c.teacher}</td>
                    <td style={{padding:'12px 16px'}}><div style={{color:'#3D2B1F'}}>{c.booked}/{c.max}</div><div style={{height:4,background:'#F2EDE4',borderRadius:2,marginTop:4,width:80}}><div style={{height:'100%',borderRadius:2,background:full?'#C0544A':'#7A9E87',width:`${pct}%`}}/></div></td>
                    <td style={{padding:'12px 16px',color:'#3D2B1F'}}>{c.waitlist}</td>
                    <td style={{padding:'12px 16px'}}>{full?<span style={{background:'#FAEBE9',color:'#C0544A',padding:'2px 8px',borderRadius:20,fontSize:11,fontWeight:500}}>{zh?'已满':'Full'}</span>:<span style={{background:'#E8F2EA',color:'#3D7A4E',padding:'2px 8px',borderRadius:20,fontSize:11,fontWeight:500}}>{zh?'开放':'Open'}</span>}</td>
                    <td style={{padding:'12px 16px'}}>{c.waitlist>0?<button onClick={()=>setShowWaitlist(zh?c.nameZh:c.nameEn)} style={{background:'transparent',border:'1px solid #E8DDD0',borderRadius:8,padding:'5px 12px',fontSize:12,cursor:'pointer',color:'#3D2B1F'}}>{zh?'候补':'Waitlist'}</button>:<button onClick={()=>showToast(zh?'正在编辑…':'Editing…')} style={{background:'transparent',border:'1px solid #E8DDD0',borderRadius:8,padding:'5px 12px',fontSize:12,cursor:'pointer',color:'#3D2B1F'}}>{zh?'编辑':'Edit'}</button>}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
      {showModal&&(
        <div onClick={e=>e.target===e.currentTarget&&setShowModal(false)} style={{position:'fixed',inset:0,background:'rgba(42,35,32,.4)',zIndex:200,display:'flex',alignItems:'center',justifyContent:'center',backdropFilter:'blur(2px)'}}>
          <div style={{background:'#fff',borderRadius:16,padding:28,width:440,maxWidth:'92vw',boxShadow:'0 4px 32px rgba(61,43,31,.12)'}}>
            <div style={{fontFamily:'Georgia,serif',fontSize:22,color:'#3D2B1F',marginBottom:4}}>{zh?'创建课程':'Create Class'}</div>
            <div style={{fontSize:12,color:'#8B6F52',marginBottom:20}}>{zh?'将新课程添加到课表':'Set up a new class on the schedule'}</div>
            <div style={{marginBottom:14}}><div style={{fontSize:12,fontWeight:500,color:'#8B6F52',textTransform:'uppercase' as const,letterSpacing:'.04em',marginBottom:6}}>{zh?'课程名称':'Class name'}</div><input placeholder={zh?'如：晨间流动':'e.g. Morning Flow'} style={{width:'100%',padding:'9px 12px',border:'1px solid #E8DDD0',borderRadius:8,fontSize:13,background:'#FAF7F2',outline:'none',boxSizing:'border-box' as const}}/></div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:14}}>
              <div><div style={{fontSize:12,fontWeight:500,color:'#8B6F52',textTransform:'uppercase' as const,letterSpacing:'.04em',marginBottom:6}}>{zh?'日期':'Date'}</div><input type="date" style={{width:'100%',padding:'9px 12px',border:'1px solid #E8DDD0',borderRadius:8,fontSize:13,background:'#FAF7F2',outline:'none',boxSizing:'border-box' as const}}/></div>
              <div><div style={{fontSize:12,fontWeight:500,color:'#8B6F52',textTransform:'uppercase' as const,letterSpacing:'.04em',marginBottom:6}}>{zh?'开始时间':'Start time'}</div><input type="time" style={{width:'100%',padding:'9px 12px',border:'1px solid #E8DDD0',borderRadius:8,fontSize:13,background:'#FAF7F2',outline:'none',boxSizing:'border-box' as const}}/></div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:14}}>
              <div><div style={{fontSize:12,fontWeight:500,color:'#8B6F52',textTransform:'uppercase' as const,letterSpacing:'.04em',marginBottom:6}}>{zh?'场地':'Space'}</div><select style={{width:'100%',padding:'9px 12px',border:'1px solid #E8DDD0',borderRadius:8,fontSize:13,background:'#FAF7F2'}}><option>Studio A</option><option>Reformer Suite</option><option>Zone C</option><option>Open Floor</option><option>Therapy Room</option></select></div>
              <div><div style={{fontSize:12,fontWeight:500,color:'#8B6F52',textTransform:'uppercase' as const,letterSpacing:'.04em',marginBottom:6}}>{zh?'教师':'Teacher'}</div><select style={{width:'100%',padding:'9px 12px',border:'1px solid #E8DDD0',borderRadius:8,fontSize:13,background:'#FAF7F2'}}><option>Emma K.</option><option>Lisa M.</option><option>Mark T.</option></select></div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:20}}>
              <div><div style={{fontSize:12,fontWeight:500,color:'#8B6F52',textTransform:'uppercase' as const,letterSpacing:'.04em',marginBottom:6}}>{zh?'最大名额':'Max capacity'}</div><input type="number" defaultValue={10} style={{width:'100%',padding:'9px 12px',border:'1px solid #E8DDD0',borderRadius:8,fontSize:13,background:'#FAF7F2',outline:'none',boxSizing:'border-box' as const}}/></div>
              <div><div style={{fontSize:12,fontWeight:500,color:'#8B6F52',textTransform:'uppercase' as const,letterSpacing:'.04em',marginBottom:6}}>{zh?'程度':'Level'}</div><select style={{width:'100%',padding:'9px 12px',border:'1px solid #E8DDD0',borderRadius:8,fontSize:13,background:'#FAF7F2'}}><option>{zh?'初级':'Beginner'}</option><option>{zh?'中级':'Intermediate'}</option><option>{zh?'高级':'Advanced'}</option><option>{zh?'全部程度':'All levels'}</option></select></div>
            </div>
            <div style={{display:'flex',gap:10,justifyContent:'flex-end',paddingTop:16,borderTop:'1px solid #E8DDD0'}}>
              <button onClick={()=>setShowModal(false)} style={{background:'transparent',border:'1px solid #E8DDD0',borderRadius:8,padding:'8px 16px',fontSize:13,cursor:'pointer'}}>{zh?'取消':'Cancel'}</button>
              <button onClick={()=>{setShowModal(false);showToast(zh?'课程已创建并添加到课表。':'Class created and added to schedule.')}} style={{background:'#3D2B1F',color:'#fff',border:'none',borderRadius:8,padding:'8px 16px',fontSize:13,cursor:'pointer'}}>{zh?'创建课程':'Create Class'}</button>
            </div>
          </div>
        </div>
      )}
      {showWaitlist&&(
        <div onClick={e=>e.target===e.currentTarget&&setShowWaitlist('')} style={{position:'fixed',inset:0,background:'rgba(42,35,32,.4)',zIndex:200,display:'flex',alignItems:'center',justifyContent:'center',backdropFilter:'blur(2px)'}}>
          <div style={{background:'#fff',borderRadius:16,padding:28,width:400,maxWidth:'92vw',boxShadow:'0 4px 32px rgba(61,43,31,.12)'}}>
            <div style={{fontFamily:'Georgia,serif',fontSize:22,color:'#3D2B1F',marginBottom:4}}>{zh?'候补名单':'Waitlist'} — {showWaitlist}</div>
            <div style={{fontSize:12,color:'#8B6F52',marginBottom:20}}>2 {zh?'人正在等待':'people currently on waitlist'}</div>
            {[{name:'Anna Park',email:'anna@email.com',pos:1},{name:'James Ko',email:'james@email.com',pos:2}].map(p=>(
              <div key={p.email} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 0',borderBottom:'1px solid #F2EDE4'}}>
                <div><div style={{fontWeight:500,color:'#3D2B1F'}}>{p.name}</div><div style={{fontSize:11,color:'#C9B89E'}}>{p.email}</div></div>
                <div style={{display:'flex',gap:10,alignItems:'center'}}>
                  <span style={{background:'#FDF3E0',color:'#8A6020',padding:'2px 8px',borderRadius:20,fontSize:11,fontWeight:500}}>#{p.pos}</span>
                  <button onClick={()=>{setShowWaitlist('');showToast(zh?`${p.name} 已确认入场，通知已发送。`:`${p.name} confirmed. Notification sent.`)}} style={{background:'#7A9E87',color:'#fff',border:'none',borderRadius:8,padding:'5px 12px',fontSize:12,cursor:'pointer'}}>{zh?'确认入场':'Confirm'}</button>
                </div>
              </div>
            ))}
            <div style={{display:'flex',justifyContent:'flex-end',marginTop:20,paddingTop:16,borderTop:'1px solid #E8DDD0'}}>
              <button onClick={()=>setShowWaitlist('')} style={{background:'transparent',border:'1px solid #E8DDD0',borderRadius:8,padding:'8px 16px',fontSize:13,cursor:'pointer'}}>{zh?'关闭':'Close'}</button>
            </div>
          </div>
        </div>
      )}
      <div style={{position:'fixed',bottom:24,right:24,background:'#3D2B1F',color:'#fff',padding:'12px 20px',borderRadius:10,fontSize:13,zIndex:300,opacity:toast?1:0,transform:toast?'translateY(0)':'translateY(8px)',transition:'all .25s',pointerEvents:'none'}}>{toast}</div>
    </div>
  )
}
