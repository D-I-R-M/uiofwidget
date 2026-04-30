import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import JournalList from './pages/JournalList'
import EntryDetail from './pages/EntryDetail'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<JournalList />} />
        <Route path="/entries/:uid" element={<EntryDetail />} />
      </Routes>
    </Layout>
  )
}