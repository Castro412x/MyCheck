export interface AttendanceRecord {
  id: string
  checkInTimestamp: string
  checkOutTimestamp: string | null
  durationMinutes: number
  notes: string
  autoClosed: boolean
}

export const STORAGE_KEY = 'mycheck-records'
