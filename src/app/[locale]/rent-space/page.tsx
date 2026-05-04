'use client'
import { useState } from 'react'
const SPACES = [
  { nameEn:'Studio A',       nameZh:'Studio A',     cap:10, descEn:'Full mirrors, barre rail, sprung floor', descZh:'全镜面，把杆，弹簧地板', available:true  },
  { nameEn:'Reformer Suite', nameZh:'普拉提器械室', cap:6,  descEn:'6 Pilates reformers',                   descZh:'6台普拉提床',           available:false },
  { nameEn:'Zone C',         nameZh:'C区',           cap:4,  descEn:'Compact zone, small group',             descZh:'小型区域，适合小班课',   available:true  },
  { nameEn:'Open Floor',     nameZh:'开放地板区',   cap:12, descEn:'Large open mat space',                  descZh:'大型开放垫子区',         available:true  },
  { nameEn:'Therapy Room',   nameZh:'理疗室',        cap:2,  descEn:'Private, quiet, one-on-one',            descZh:'私密安静，适合一对一',   available:true  },
]
export default function RentSpacePage({ params }: { params: { locale: string } }) {
  const zh = params.locale === 'zh'
  const [selected, setSelected] = useState<any>(null)
  const [toast, setToast] = useState('')
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }
  return (
    <div style={{padding:8}}>
      <div style={{marginBottom:22}}>
        <h1 style={{fontFamily:'Georgia,serif',fontSize:28,color:'#3D2B1F',margin:0}}>{zh?'租借场地':'Rent a Space'}</h1>
        <p style={{color:'#8B6F52',margin:'4px 0 0',fontSize:13}}>{zh?'为您的私人课程选择区域与时段':'Select a zone and time for your private session'}</p>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1.5fr',gap:24}}>
        <div style={{background:'#fff',border:'1px solid #E8DDD0',borderRadius:12,padding:24}}>
          <div style={{fontFamily:'Georgia,serif',fontSize:16,color:'#3D2B1F',marginBottom:16}}>{zh?'选择日期与时间':'Select date & time'}</div>
          {[[zh?'日期':'Date','date'],[zh?'开始时间':'Start time','time']].map(([label,type])=>(
            <div key={String(label)} style={{marginBottom:14}}>
              <div style={{fontSize:12,fontWeight:500,color:'#8B6F52',textTransform:'uppercase' as const,letterSpacing:'.04em',marginBottom:6}}>{label}</div>
              <input type={String(type)} defaultValue={type==='date'?'2025-06-18':'09:00'} style={{width:'100%',padding:'9px 12px',border:'1px solid #E8DDD0',borderRadius:8,fontSize:13,background:'#FAF7F2',outline:'none',boxSizing:'border-box' as const}}/>
            </div>
          ))}
          <div style={{marginBottom:20}}>
            <div style={{fontSize:12,fontWeight:500,color:'#8B6F52',textTransform:'uppercase' as const,letterSpacing:'.04em',marginBottom:6}}>{zh?'时长':'Duration'}</div>
            <select style={{width:'100%',padding:'9px 12px',border:'1px solid #E8DDD0',borderRadius:8,fontSize:13,background:'#FAF7F2'}}><option>{zh?'1 小时':'1 hour'}</option><option>{zh?'1.5 小时':'1.5 hours'}</option><option>{zh?'2 小时':'2 hours'}</option></select>
          </div>
          <button style={{width:'100%',background:'#7A9E87',color:'#fff',border:'none',padding:'10px 16px',borderRadius:8,cursor:'pointer',fontSize:13,fontWeight:500}}>{zh?'查看可用性':'Check availability'}</button>
        </div>
        <div>
          <div style={{fontSize:12,fontWeight:500,color:'#8B6F52',textTransform:'uppercase' as const,letterSpacing:'.04em',marginBottom:12}}>{zh?'该时段可用场地':'Available spaces'} · Wed Jun 18 · 9:00 am</div>
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            {SPACES.map(s=>(
              <div key={s.nameEn} onClick={()=>s.available&&setSelected(s)} style={{background:'#fff',border:'1px solid #E8DDD0',borderRadius:12,padding:16,cursor:s.available?'pointer':'default',opacity:s.available?1:.55,borderLeft:`3px solid ${s.available?'#7A9E87':'#C9B89E'}`}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div>
                    <div style={{fontFamily:'Georgia,serif',fontSize:16,color:'#3D2B1F',marginBottom:4}}>{zh?s.nameZh:s.nameEn}</div>
                    <div style={{fontSize:12,color:'#8B6F52'}}>{zh?`最大 ${s.cap} 人 · ${s.descZh}`:`Max ${s.cap} people · ${s.descEn}`}</div>
                  </div>
                  {s.available
                    ?<button style={{background:'#7A9E87',color:'#fff',border:'none',borderRadius:8,padding:'6px 14px',fontSize:12,cursor:'pointer'}}>{zh?'预订':'Reserve'}</button>
                    :<span style={{background:'#FAEBE9',color:'#C0544A',padding:'2px 8px',borderRadius:20,fontSize:11,fontWeight:500}}>{zh?'不可用':'Unavailable'}</span>
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
            <div style={{fontFamily:'Georgia,serif',fontSize:22,color:'#3D2B1F',marginBottom:4}}>{zh?'确认场地预订':'Confirm Space Rental'}</div>
            <div style={{fontSize:12,color:'#8B6F52',marginBottom:20}}>{zh?selected.nameZh:selected.nameEn} · Wed Jun 18 · 9:00–10:00 am</div>
            <div style={{background:'#FAF7F2',borderRadius:12,padding:16,marginBottom:16}}>
              <div style={{fontSize:13,color:'#8B6F52'}}>{zh?`最大容纳：${selected.cap}人`:`Max capacity: ${selected.cap} people`}</div>
              <div style={{fontSize:13,color:'#8B6F52',marginTop:4}}>{zh?selected.descZh:selected.descEn}</div>
            </div>
            <div style={{marginBottom:20}}>
              <div style={{fontSize:12,fontWeight:500,color:'#8B6F52',textTransform:'uppercase' as const,letterSpacing:'.04em',marginBottom:6}}>{zh?'备注（可选）':'Notes (optional)'}</div>
              <input placeholder={zh?'如：私人课 — 4位学员':'e.g. Private session — 4 clients'} style={{width:'100%',padding:'9px 12px',border:'1px solid #E8DDD0',borderRadius:8,fontSize:13,background:'#FAF7F2',outline:'none',boxSizing:'border-box' as const}}/>
            </div>
            <div style={{display:'flex',gap:10,justifyContent:'flex-end',paddingTop:16,borderTop:'1px solid #E8DDD0'}}>
              <button onClick={()=>setSelected(null)} style={{background:'transparent',border:'1px solid #E8DDD0',borderRadius:8,padding:'8px 16px',fontSize:13,cursor:'pointer'}}>{zh?'取消':'Cancel'}</button>
              <button onClick={()=>{setSelected(null);showToast(zh?'场地已预订！确认通知已发送。':'Space reserved! Confirmation sent.')}} style={{background:'#3D2B1F',color:'#fff',border:'none',borderRadius:8,padding:'8px 16px',fontSize:13,cursor:'pointer'}}>{zh?'确认预订':'Confirm Rental'}</button>
            </div>
          </div>
        </div>
      )}
      <div style={{position:'fixed',bottom:24,right:24,background:'#3D2B1F',color:'#fff',padding:'12px 20px',borderRadius:10,fontSize:13,zIndex:300,opacity:toast?1:0,transform:toast?'translateY(0)':'translateY(8px)',transition:'all .25s',pointerEvents:'none'}}>{toast}</div>
    </div>
  )
}
