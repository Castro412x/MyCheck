import { ToastProvider } from './components/Toast'
import { DarkModeProvider, DarkModeToggle } from './components/DarkModeToggle'
import { Dashboard } from './components/Dashboard'
import { useAttendance } from './hooks/useAttendance'

function AppContent() {
  const {
    openRecord,
    todayRecords,
    todayTotalMinutes,
    hasOpenPreviousDay,
    checkIn,
    checkOut,
    closeOpenRecord,
  } = useAttendance()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">MyCheck</h1>
          <DarkModeToggle />
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-6">
        <Dashboard
          openRecord={openRecord}
          todayRecords={todayRecords}
          todayTotalMinutes={todayTotalMinutes}
          hasOpenPreviousDay={hasOpenPreviousDay}
          onCheckIn={checkIn}
          onCheckOut={checkOut}
          onCloseOpenRecord={closeOpenRecord}
        />
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
