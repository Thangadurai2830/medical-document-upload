import DocumentsPage from './pages/DocumentsPage'
import Header from './components/Layout/Header'
import Footer from './components/Layout/Footer'

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Header />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <DocumentsPage />
      </main>
      <Footer />
    </div>
  )
}
