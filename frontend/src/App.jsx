import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Council from './pages/Council.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/council" element={<Council />} />
    </Routes>
  )
}
