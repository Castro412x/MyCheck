import { useCallback, useMemo } from 'react'
import type { AttendanceRecord } from '../types/attendance'
import { STORAGE_KEY } from '../types/attendance'
import { useLocalStorage } from './useLocalStorage'
import { computeDuration } from '../utils/dateHelpers'

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function useAttendance() {
  const [records, setRecords] = useLocalStorage<AttendanceRecord[]>(STORAGE_KEY, [])

  const openRecord = useMemo(() => {
    return records.find((r) => r.checkOutTimestamp === null) ?? null
  }, [records])

  const todayRecords = useMemo(() => {
    const todayKey = new Date().toISOString().slice(0, 10)
    return records.filter((r) => r.checkInTimestamp.startsWith(todayKey))
  }, [records])

  const todayTotalMinutes = useMemo(() => {
    return todayRecords.reduce((sum, r) => sum + (r.durationMinutes || 0), 0)
  }, [todayRecords])

  const last7Days = useMemo(() => {
    const now = new Date()
    const sevenDaysAgo = new Date(now)
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)
    const cutoff = sevenDaysAgo.toISOString().slice(0, 10)
    return records.filter((r) => r.checkInTimestamp.slice(0, 10) >= cutoff)
  }, [records])

  const hasOpenPreviousDay = useMemo(() => {
    if (!openRecord) return false
    const todayKey = new Date().toISOString().slice(0, 10)
    return !openRecord.checkInTimestamp.startsWith(todayKey)
  }, [openRecord])

  const checkIn = useCallback(() => {
    if (openRecord) return
    const now = new Date().toISOString()
    const newRecord: AttendanceRecord = {
      id: generateId(),
      checkInTimestamp: now,
      checkOutTimestamp: null,
      durationMinutes: 0,
      notes: '',
      autoClosed: false,
    }
    setRecords((prev) => [newRecord, ...prev])
  }, [openRecord, setRecords])

  const checkOut = useCallback(() => {
    if (!openRecord) return
    const now = new Date().toISOString()
    const duration = computeDuration(openRecord.checkInTimestamp, now)
    setRecords((prev) =>
      prev.map((r) =>
        r.id === openRecord.id
          ? { ...r, checkOutTimestamp: now, durationMinutes: duration }
          : r
      )
    )
  }, [openRecord, setRecords])

  const closeOpenRecord = useCallback(
    (minutes?: number) => {
      if (!openRecord) return
      const now = new Date().toISOString()
      const duration = minutes ?? computeDuration(openRecord.checkInTimestamp, now)
      setRecords((prev) =>
        prev.map((r) =>
          r.id === openRecord.id
            ? { ...r, checkOutTimestamp: now, durationMinutes: duration, autoClosed: true }
            : r
        )
      )
    },
    [openRecord, setRecords]
  )

  const updateNotes = useCallback(
    (id: string, notes: string) => {
      setRecords((prev) =>
        prev.map((r) => (r.id === id ? { ...r, notes } : r))
      )
    },
    [setRecords]
  )

  const deleteRecord = useCallback(
    (id: string) => {
      setRecords((prev) => prev.filter((r) => r.id !== id))
    },
    [setRecords]
  )

  return {
    records,
    openRecord,
    todayRecords,
    todayTotalMinutes,
    last7Days,
    hasOpenPreviousDay,
    checkIn,
    checkOut,
    closeOpenRecord,
    updateNotes,
    deleteRecord,
  }
}
