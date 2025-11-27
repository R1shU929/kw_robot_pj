// src/App.jsx
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/homePage.jsx'
import MainPage from './pages/mainPage/mainPage.jsx'

function App() {
	return (
		<Routes>
			<Route path="/" element={<HomePage />} />
			<Route path="/attendance" element={<MainPage />} />
		</Routes>
	)
}

export default App
