import { Timer } from './Timer'
import { useToast } from './Toast'
import { formatTime, formatDuration } from '../utils/dateHelpers'
import type { AttendanceRecord } from '../types/attendance'

interface DashboardProps {
  openRecord: AttendanceRecord | null
  todayRecords: AttendanceRecord[]
  todayTotalMinutes: number
  hasOpenPreviousDay: boolean
  onCheckIn: () => void
  onCheckOut: () => void
  onCloseOpenRecord: (minutes?: number) => void
}

export function Dashboard({
  openRecord,
  todayRecords,
  todayTotalMinutes,
  hasOpenPreviousDay,
  onCheckIn,
  onCheckOut,
  onCloseOpenRecord,
}: DashboardProps) {
  const { showToast } = useToast()
  const todayCheckOut = todayRecords.find((r) => r.checkOutTimestamp)

  const handleCheckIn = () => {
    if (openRecord) {
      showToast('Already checked in', 'error')
      return
    }
    onCheckIn()
    showToast(`Checked in at ${formatTime(new Date().toISOString())}`)
  }

  const handleCheckOut = () => {
    if (!openRecord) {
      showToast('No open check-in found', 'error')
      return
    }
    onCheckOut()
    const dur = Math.round((Date.now() - new Date(openRecord.checkInTimestamp).getTime()) / 60000)
    showToast(`Checked out – duration ${formatDuration(dur)}`)
  }

  return (
    <div className="space-y-6">
      {hasOpenPreviousDay && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl p-4 text-sm">
          <p className="font-medium text-yellow-800 dark:text-yellow-200">
            You have an open check-in from a previous day.
          </p>
          <button
            onClick={() => onCloseOpenRecord(480)}
            className="mt-2 px-3 py-1.5 bg-yellow-500 text-white rounded-lg text-sm hover:bg-yellow-600 transition-colors"
          >
            Close yesterday (8h)
          </button>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center space-y-6">
        {openRecord ? (
          <>
            <p className="text-lg font-medium">Checked in since</p>
            <Timer checkInTimestamp={openRecord.checkInTimestamp} />
            <div>
              <button
                onClick={handleCheckOut}
                className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white text-lg font-semibold rounded-xl transition-colors"
              >
                CHECK OUT
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-lg font-medium text-gray-500 dark:text-gray-400">Not checked in</p>
            <div>
              <button
                onClick={handleCheckIn}
                className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white text-lg font-semibold rounded-xl transition-colors"
              >
                CHECK IN
              </button>
            </div>
          </>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-3">
        <h2 className="text-lg font-semibold">Today's Summary</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500 dark:text-gray-400">Check-In</span>
            <p className="font-medium">
              {openRecord
                ? formatTime(openRecord.checkInTimestamp)
                : todayRecords.length > 0
                  ? formatTime(todayRecords[0].checkInTimestamp)
                  : 'Not checked in yet'}
            </p>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">Check-Out</span>
            <p className="font-medium">
              {todayCheckOut ? formatTime(todayCheckOut.checkOutTimestamp!) : '–'}
            </p>
          </div>
        </div>
        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
          <span className="text-gray-500 dark:text-gray-400 text-sm">Today's Total</span>
          <p className="text-2xl font-bold">{formatDuration(todayTotalMinutes)}</p>
        </div>
      </div>
    </div>
  )
}
