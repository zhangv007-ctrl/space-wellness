export default function DashboardPage({ params }: { params: { locale: string } }) {
  const zh = params.locale === 'zh'
  return (
    <div style={{padding:8}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
        <div>
          <h1 style={{fontFamily:'Georgia,serif',fontSize:28,color:'#3D2B1F',margin:0}}>{zh?'早上好，Sarah ✦':'Good morning, Sarah ✦'}</h1>
          <p style={{color:'#8B6F52',margin:'4px 0 0',fontSize:13}}>{zh?'今天安排了 7 节课':'7 classes scheduled today'}</p>
        </div>
        <button style={{background:'#3D2B1F',color:'#fff',border:'none',padding:'8px 16px',borderRadius:8,cursor:'pointer',fontSize:13}}>{zh?'+ 新建课程':'+ New Class'}</button>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:24}}>
        {[
          [zh?'活跃客户':'Active Clients','84',zh?'↑ 本月新增 6':'↑ 6 this month','#7A9E87'],
          [zh?'今日课程':'Today Classes','7',zh?'3 节已满':'3 fully booked','#B89A5A'],
          [zh?'场地租借':'Space Rentals','12',zh?'本周':'This week','#C9B89E'],
          [zh?'候补人数':'Waitlisted','9',zh?'分布于4节课':'Across 4 classes','#C0544A'],
        ].map(([label,val,sub,color])=>(
          <div key={label} style={{background:'#fff',border:'1px solid #E8DDD0',borderRadius:12,padding:'18px 20px',borderTop:`2px solid ${color}`}}>
            <div style={{fontSize:11,textTransform:'uppercase',letterSpacing:'.08em',color:'#C9B89E',marginBottom:6}}>{label}</div>
            <div style={{fontFamily:'Georgia,serif',fontSize:32,color:'#3D2B1F',lineHeight:1}}>{val}</div>
            <div style={{fontSize:11,color:'#8B6F52',marginTop:4}}>{sub}</div>
          </div>
        ))}
      </div>
      <div style={{background:'#fff',border:'1px solid #E8DDD0',borderRadius:12,padding:24}}>
        <h2 style={{fontFamily:'Georgia,serif',fontSize:18,color:'#3D2B1F',margin:'0 0 16px'}}>{zh?'今日课表':"Today's Schedule"}</h2>
        {[
          ['7:00 am','Morning Flow','晨间流动','Studio A · Emma K. · 8/10',false],
          ['9:30 am','Reformer Fundamentals','普拉提基础','Reformer Suite · Lisa M. · 6/6',false],
          ['11:00 am','Space rental — Zone C','场地租借 — C区','Teacher: Mark T. · Private',true],
          ['2:00 pm','Core & Balance','核心平衡','Open Floor · Emma K. · 4/12',false],
          ['5:30 pm','Evening Reset','傍晚放松','Studio A · Lisa M. · 10/10',false],
        ].map(([time,nameEn,nameZh,sub,rented],i)=>(
          <div key={i} style={{display:'flex',gap:16,padding:'10px 0',borderBottom:i<4?'1px solid #F2EDE4':'none'}}>
            <div style={{width:60,fontSize:12,color:'#8B6F52',flexShrink:0}}>{time}</div>
            <div style={{flex:1,background:'#F2EDE4',borderRadius:8,padding:'8px 12px',borderLeft:`3px solid ${rented?'#B89A5A':'#7A9E87'}`}}>
              <div style={{fontWeight:500,fontSize:13,color:'#3D2B1F'}}>{zh?nameZh:nameEn}</div>
              <div style={{fontSize:12,color:'#8B6F52'}}>{sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
