import { ToastProvider } from './components/Toast'
import { DarkModeProvider, DarkModeToggle } from './components/DarkModeToggle'
import { Dashboard } from './components/Dashboard'
import { HistoryTable } from './components/HistoryTable'
import { useAttendance } from './hooks/useAttendance'
import { exportToCSV } from './utils/exportCSV'

function AppContent() {
  const {
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
    records,
  } = useAttendance()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">MyCheck</h1>
          <DarkModeToggle />
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-8">
        <Dashboard
          openRecord={openRecord}
          todayRecords={todayRecords}
          todayTotalMinutes={todayTotalMinutes}
          hasOpenPreviousDay={hasOpenPreviousDay}
          onCheckIn={checkIn}
          onCheckOut={checkOut}
          onCloseOpenRecord={closeOpenRecord}
        />

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Last 7 Days</h2>
            <button
              onClick={() => exportToCSV(records)}
              className="px-3 py-1.5 text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              Export CSV
            </button>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <HistoryTable
              records={last7Days}
              onUpdateNotes={updateNotes}
              onDelete={deleteRecord}
            />
          </div>
        </section>
      </main>
    </div>
  )
}

function App() {
  return (
    <DarkModeProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </DarkModeProvider>
  )
}

export default App
