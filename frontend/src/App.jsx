import React from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import HomePage from './pages/HomePage';
import QuizPage from './pages/QuizPage';
import './styles/App.css';

const AddQuestion = React.lazy(() => import('./components/questions/AddQuestion'));
const AnalyticsPage = React.lazy(() => import('./pages/AnalyticsPage'));
const ManageQuestionsPage = React.lazy(() => import('./pages/ManageQuestionsPage'));

export default function App() {
  return (
    <BrowserRouter>
      <nav>
        <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
          🏠 Home
        </NavLink>
        <NavLink to="/quiz" className={({ isActive }) => isActive ? 'active' : ''}>
          📝 Quiz
        </NavLink>
        <NavLink to="/add" className={({ isActive }) => isActive ? 'active' : ''}>
          ➕ Add Question
        </NavLink>
        <NavLink to="/manage" className={({ isActive }) => isActive ? 'active' : ''}>
          🗂️ Manage
        </NavLink>
        <NavLink to="/analytics" className={({ isActive }) => isActive ? 'active' : ''}>
          📊 Analytics
        </NavLink>
      </nav>
      <React.Suspense fallback={<div className="loading"><div className="spinner"></div></div>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/add" element={<AddQuestion />} />
          <Route path="/manage" element={<ManageQuestionsPage />} />
          <Route path="/analytics" element={<AnalyticsPage userId={0} />} />
        </Routes>
      </React.Suspense>
    </BrowserRouter>
  );
}

