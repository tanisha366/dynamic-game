import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import BadgesPage from './pages/BadgesPage'
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/badges" replace />} />
        <Route path="/badges" element={<BadgesPage />} />
      </Routes>
    </BrowserRouter>
  )
}