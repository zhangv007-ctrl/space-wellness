'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function SpaceCalendar({ spaceId, spaceName, zh }: { spaceId: string, spaceName: string, zh: boolean }) {
  const supabase = createClient()
  const [rentals, setRentals] = useState<any[]>([])
  const [currentDate, setCurrentDate] = useState(new Date())

  useEffect(() => {
    const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString()
    const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString()
    supabase.from('rentals')
      .select('*, profiles(full_name)')
      .eq('space_id', spaceId)
      .neq('status', 'cancelled')
      .gte('start_time', monthStart)
      .lte('start_time', monthEnd)
      .then(({ data }) => setRentals(data || []))
  }, [spaceId, currentDate])

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const monthName = currentDate.toLocaleString(zh ? 'zh-CN' : 'en-US', { month: 'long', year: 'numeric' })

  const getRentalsForDay = (day: number) => {
    return rentals.filter(r => {
      const d = new Date(r.start_time)
      return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year
    })
  }

  const statusColor: Record<string, string> = {
    confirmed: '#7A9E87',
    pending: '#B89A5A',
  }

  return (
    <div style={{ background: '#fff', border: '1px solid #E8DDD0', borderRadius: 12, padding: 16, marginTop: 12 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
          style={{ background: 'transparent', border: '1px solid #E8DDD0', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontSize: 14 }}>‹</button>
        <div style={{ fontFamily: 'Georgia,serif', fontSize: 14, color: '#3D2B1F' }}>{monthName}</div>
        <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
          style={{ background: 'transparent', border: '1px solid #E8DDD0', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontSize: 14 }}>›</button>
      </div>

      {/* Day labels */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 4 }}>
        {(zh ? ['日','一','二','三','四','五','六'] : ['Su','Mo','Tu','We','Th','Fr','Sa']).map(d => (
          <div key={d} style={{ textAlign: 'center', fontSize: 10, color: '#C9B89E', padding: '4px 0', fontWeight: 500 }}>{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const dayRentals = getRentalsForDay(day)
          const isToday = new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year
          return (
            <div key={day} style={{ 
              minHeight: 44, padding: '4px 2px', borderRadius: 6, 
              background: isToday ? '#F2EDE4' : 'transparent',
              border: isToday ? '1px solid #C9B89E' : '1px solid transparent'
            }}>
              <div style={{ fontSize: 11, color: isToday ? '#3D2B1F' : '#8B6F52', textAlign: 'center', marginBottom: 2, fontWeight: isToday ? 600 : 400 }}>{day}</div>
              {dayRentals.map((r, ri) => (
                <div key={ri} style={{ 
                  background: statusColor[r.status] || '#C9B89E', 
                  borderRadius: 3, padding: '1px 3px', 
                  fontSize: 9, color: '#fff', marginBottom: 1,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                }}>
                  {new Date(r.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              ))}
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 12, marginTop: 12, fontSize: 11, color: '#8B6F52' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 10, height: 10, borderRadius: 2, background: '#7A9E87' }} />
          {zh ? '已确认' : 'Confirmed'}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 10, height: 10, borderRadius: 2, background: '#B89A5A' }} />
          {zh ? '待确认' : 'Pending'}
        </div>
      </div>
    </div>
  )
}
