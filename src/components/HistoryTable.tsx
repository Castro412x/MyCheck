import { useState } from 'react'
import type { AttendanceRecord } from '../types/attendance'
import { formatDate, formatTime, formatDuration } from '../utils/dateHelpers'

interface HistoryTableProps {
  records: AttendanceRecord[]
  onUpdateNotes: (id: string, notes: string) => void
  onDelete: (id: string) => void
}

export function HistoryTable({ records, onUpdateNotes, onDelete }: HistoryTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const sorted = [...records].sort(
    (a, b) => new Date(b.checkInTimestamp).getTime() - new Date(a.checkInTimestamp).getTime()
  )

  const handleStartEdit = (r: AttendanceRecord) => {
    setEditingId(r.id)
    setEditValue(r.notes)
  }

  const handleSaveEdit = () => {
    if (editingId) {
      onUpdateNotes(editingId, editValue)
      setEditingId(null)
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
  }

  const handleDelete = (id: string) => {
    if (confirmDeleteId === id) {
      onDelete(id)
      setConfirmDeleteId(null)
    } else {
      setConfirmDeleteId(id)
    }
  }

  if (sorted.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No records yet. Check in to get started!
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700 text-left text-gray-500 dark:text-gray-400">
            <th className="pb-3 font-medium">Date</th>
            <th className="pb-3 font-medium">Check-In</th>
            <th className="pb-3 font-medium">Check-Out</th>
            <th className="pb-3 font-medium">Total</th>
            <th className="pb-3 font-medium">Notes</th>
            <th className="pb-3 font-medium"></th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((r) => (
            <tr key={r.id} className="border-b border-gray-100 dark:border-gray-800">
              <td className="py-3 pr-4 whitespace-nowrap">{formatDate(r.checkInTimestamp)}</td>
              <td className="py-3 pr-4 whitespace-nowrap">{formatTime(r.checkInTimestamp)}</td>
              <td className="py-3 pr-4 whitespace-nowrap">
                {r.checkOutTimestamp ? formatTime(r.checkOutTimestamp) : '–'}
              </td>
              <td className="py-3 pr-4 whitespace-nowrap font-medium">
                {r.durationMinutes > 0 ? formatDuration(r.durationMinutes) : '–'}
                {r.autoClosed && <span className="ml-1 text-xs text-yellow-500">(auto)</span>}
              </td>
              <td className="py-3 pr-4">
                {editingId === r.id ? (
                  <div className="flex gap-1">
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveEdit()
                        if (e.key === 'Escape') handleCancelEdit()
                      }}
                    />
                    <button onClick={handleSaveEdit} className="px-2 py-1 text-green-600 hover:text-green-700">
                      ✓
                    </button>
                    <button onClick={handleCancelEdit} className="px-2 py-1 text-gray-400 hover:text-gray-600">
                      ✕
                    </button>
                  </div>
                ) : (
                  <span
                    className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                    onClick={() => handleStartEdit(r)}
                  >
                    {r.notes || <span className="text-gray-400 italic">Add note</span>}
                  </span>
                )}
              </td>
              <td className="py-3 whitespace-nowrap text-right">
                {confirmDeleteId === r.id ? (
                  <div className="flex gap-1 justify-end">
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                    aria-label="Delete record"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
