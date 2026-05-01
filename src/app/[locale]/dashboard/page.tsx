export default function DashboardPage() {
  return (
    <div style={{padding:32,fontFamily:'sans-serif'}}>
      <h1 style={{fontSize:28,marginBottom:24}}>Space Wellness — Dashboard</h1>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginBottom:24}}>
        {[['Active Clients','84'],['Today Classes','7'],['Space Rentals','12'],['Waitlisted','9']].map(([label,val])=>(
          <div key={label} style={{background:'#fff',border:'1px solid #e8ddd0',borderRadius:12,padding:20}}>
            <div style={{fontSize:11,textTransform:'uppercase',color:'#c9b89e',marginBottom:8}}>{label}</div>
            <div style={{fontSize:32,color:'#3d2b1f'}}>{val}</div>
          </div>
        ))}
      </div>
      <div style={{background:'#fff',border:'1px solid #e8ddd0',borderRadius:12,padding:24}}>
        <h2 style={{fontSize:18,marginBottom:16,color:'#3d2b1f'}}>Today's Schedule</h2>
        {[['7:00 am','Morning Flow','Studio A · Emma K. · 8/10'],['9:30 am','Reformer Fundamentals','Reformer Suite · Lisa M. · 6/6'],['2:00 pm','Core & Balance','Open Floor · Emma K. · 4/12'],['5:30 pm','Evening Reset','Studio A · Lisa M. · 10/10']].map(([time,name,sub])=>(
          <div key={time} style={{display:'flex',gap:16,padding:'10px 0',borderBottom:'1px solid #f2ede4'}}>
            <div style={{width:60,fontSize:12,color:'#8b6f52'}}>{time}</div>
            <div style={{background:'#f2ede4',borderRadius:8,padding:'8px 12px',flex:1,borderLeft:'3px solid #7a9e87'}}>
              <div style={{fontWeight:500,color:'#3d2b1f'}}>{name}</div>
              <div style={{fontSize:12,color:'#8b6f52'}}>{sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
