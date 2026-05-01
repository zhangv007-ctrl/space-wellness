export type Locale = 'en' | 'zh'

export type UserRole = 'admin' | 'teacher' | 'client'
export type NotifPref = 'email' | 'sms' | 'both'
export type ClassLevel = 'beginner' | 'intermediate' | 'advanced' | 'all'
export type ClassStatus = 'open' | 'full' | 'cancelled'
export type BookingStatus = 'confirmed' | 'waitlist' | 'cancelled'
export type RentalStatus = 'confirmed' | 'cancelled'

export interface Profile {
  id: string
  full_name: string
  email: string
  phone?: string
  role: UserRole
  notif_pref: NotifPref
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Space {
  id: string
  name: string
  capacity: number
  description?: string
  is_active: boolean
  created_at: string
}

export interface ClassRecord {
  id: string
  name: string
  description?: string
  teacher_id: string
  space_id: string
  starts_at: string
  duration_min: number
  max_capacity: number
  level: ClassLevel
  status: ClassStatus
  created_by?: string
  created_at: string
  updated_at: string
}

// The view: classes with live availability
export interface ClassWithAvailability extends ClassRecord {
  space_name: string
  space_capacity: number
  teacher_name: string
  booked_count: number
  waitlist_count: number
  spots_remaining: number
}

export interface Booking {
  id: string
  client_id: string
  class_id: string
  status: BookingStatus
  waitlist_pos?: number
  notified_at?: string
  created_at: string
  updated_at: string
}

export interface SpaceRental {
  id: string
  teacher_id: string
  space_id: string
  starts_at: string
  ends_at: string
  notes?: string
  status: RentalStatus
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  type: 'email' | 'sms'
  subject?: string
  body: string
  trigger?: string
  sent_at: string
  success: boolean
}
