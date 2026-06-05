import type { AttendanceRecord } from '../types/attendance'

function escapeCSV(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

export function exportToCSV(records: AttendanceRecord[]): void {
  const headers = ['id', 'checkIn', 'checkOut', 'durationMinutes', 'notes']
  const rows = records.map((r) =>
    [r.id, r.checkInTimestamp, r.checkOutTimestamp ?? '', String(r.durationMinutes), escapeCSV(r.notes)].join(',')
  )
  const csv = [headers.join(','), ...rows].join('\r\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `mycheck-export-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
