'use client'
import { useState } from 'react'
const SPACES = [
  { nameEn:'Studio A',       namEzh:'Studio A',     cap:10, status:'available', detailEn:'Next: 5:30 pm · Evening Reset',       detailZh:'下次：5:30 pm · 傍晚放松',     descEn:'Full mirrors, barre rail, sprung floor', descZh:'全镜面，把杆，弹簧地板' },
  { nameEn:'Reformer Suite', namEzh:'普拉提器械室', cap:6,  status:'booked',    detailEn:'Reformer Fundamentals · ends 11am',   detailZh:'普拉提基础 · 11点结束',         descEn:'6 Pilates reformers',                   descZh:'6台普拉提床' },
  { nameEn:'Zone C',         namEzh:'C区',           cap:4,  status:'rented',    detailEn:'Teacher: Mark Torres · 11am–1pm',     detailZh:'教师：Mark Torres · 11am–1pm', descEn:'Compact zone, small group',             descZh:'小型区域，适合小班课' },
  { nameEn:'Open Floor',     namEzh:'开放地板区',   cap:12, status:'available', detailEn:'Next: 2:00 pm · Core & Balance',      detailZh:'下次：2:00 pm · 核心平衡',     descEn:'Large open mat space',                  descZh:'大型开放垫子区' },
  { nameEn:'Therapy Room',   namEzh:'理疗室',        cap:2,  status:'available', detailEn:'No bookings today',                   detailZh:'今日无预约',                   descEn:'Private, quiet, one-on-one',            descZh:'私密安静，适合一对一' },
]
export default function SpacesPage({ params }: { params: { locale: string } }) {
  const zh = params.locale === 'zh'
  const [toast, setToast] = useState('')
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }
  const statusColor = (s: string) => s==='available'?'#7A9E87':s==='booked'?'#C0544A':'#B89A5A'
  const statusLabel = (s: string) => s==='available'?(zh?'当前可用':'Available now'):s==='booked'?(zh?'使用中':'In use'):(zh?'已租借':'Rented')
  const statusBg = (s: string) => s==='available'?'#E8F2EA':s==='booked'?'#FAEBE9':'#FDF3E0'
  const statusText = (s: string) => s==='available'?'#3D7A4E':s==='booked'?'#C0544A':'#8A6020'
  return (
    <div style={{padding:8}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:22}}>
        <div>
          <h1 style={{fontFamily:'Georgia,serif',fontSize:28,color:'#3D2B1F',margin:0}}>{zh?'场地管理':'Spaces'}</h1>
          <p style={{color:'#8B6F52',margin:'4px 0 0',fontSize:13}}>5 {zh?'个区域 · 管理容量与可用性':'zones · Manage capacity and availability'}</p>
        </div>
        <button onClick={()=>showToast(zh?'正在打开场地编辑器…':'Opening space editor…')} style={{background:'#3D2B1F',color:'#fff',border:'none',padding:'8px 16px',borderRadius:8,cursor:'pointer',fontSize:13}}>{zh?'+ 添加场地':'+ Add Space'}</button>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16,marginBottom:24}}>
        {SPACES.map(s=>(
          <div key={s.nameEn} style={{background:'#fff',border:'1px solid #E8DDD0',borderRadius:12,padding:20,borderLeft:`3px solid ${statusColor(s.status)}`}}>
            <div style={{fontFamily:'Georgia,serif',fontSize:18,color:'#3D2B1F',marginBottom:4}}>{zh?s.namEzh:s.nameEn}</div>
            <div style={{fontSize:12,color:'#8B6F52',marginBottom:12}}>{zh?`最大容纳：${s.cap}人 · ${s.descZh}`:`Max ${s.cap} people · ${s.descEn}`}</div>
            <span style={{background:statusBg(s.status),color:statusText(s.status),padding:'2px 8px',borderRadius:20,fontSize:11,fontWeight:500}}>{statusLabel(s.status)}</span>
            <hr style={{border:'none',borderTop:'1px solid #F2EDE4',margin:'12px 0'}}/>
            <div style={{fontSize:11,color:'#C9B89E'}}>{zh?s.detailZh:s.detailEn}</div>
          </div>
        ))}
      </div>
      <div style={{background:'#fff',border:'1px solid #E8DDD0',borderRadius:12,padding:24}}>
        <div style={{fontFamily:'Georgia,serif',fontSize:18,color:'#3D2B1F',marginBottom:16}}>{zh?'今日使用率':"Today's Utilisation"}</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:16}}>
          {[[zh?'Studio A':'Studio A',80,''],['Reformer Suite',100,'red'],[zh?'C区':'Zone C',60,'amber'],[zh?'开放地板区':'Open Floor',33,''],[zh?'理疗室':'Therapy Room',0,'']].map(([name,pct,cls])=>(
            <div key={String(name)}>
              <div style={{fontSize:12,fontWeight:500,color:'#3D2B1F',marginBottom:4}}>{name}</div>
              <div style={{height:4,background:'#F2EDE4',borderRadius:2}}><div style={{height:'100%',borderRadius:2,width:`${pct}%`,background:cls==='red'?'#C0544A':cls==='amber'?'#B89A5A':'#7A9E87'}}/></div>
              <div style={{fontSize:11,color:'#C9B89E',marginTop:4}}>{pct===0?(zh?'空闲':'Open'):pct===100?(zh?'已满':'Full'):`${pct}%`}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{position:'fixed',bottom:24,right:24,background:'#3D2B1F',color:'#fff',padding:'12px 20px',borderRadius:10,fontSize:13,zIndex:300,opacity:toast?1:0,transform:toast?'translateY(0)':'translateY(8px)',transition:'all .25s',pointerEvents:'none'}}>{toast}</div>
    </div>
  )
}
