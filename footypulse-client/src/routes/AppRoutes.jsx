import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import MatchesPage from '../pages/MatchesPage';
import MatchDetailPage from '../pages/MatchDetailPage';
import TeamsPage from '../pages/TeamsPage';
import TeamDetailPage from '../pages/TeamDetailPage';
import PlayerDetailPage from '../pages/PlayerDetailPage';
import CompetitionsPage from '../pages/CompetitionsPage';
import CompetitionDetailPage from '../pages/CompetitionDetailPage';
import TransfersPage from '../pages/TransfersPage';
import PollsPage from '../pages/PollsPage';
import NewsPage from '../pages/NewsPage';
import ArticlePage from '../pages/ArticlePage';
import SearchResultsPage from '../pages/SearchResultsPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ProfilePage from '../pages/ProfilePage';
import NotFoundPage from '../pages/NotFoundPage';
import ProtectedRoute from './ProtectedRoute';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/matches" element={<MatchesPage />} />
      <Route path="/matches/:id" element={<MatchDetailPage />} />
      <Route path="/teams" element={<TeamsPage />} />
      <Route path="/teams/:id" element={<TeamDetailPage />} />
      <Route path="/players/:id" element={<PlayerDetailPage />} />
      <Route path="/competitions" element={<CompetitionsPage />} />
      <Route path="/competitions/:id" element={<CompetitionDetailPage />} />
      <Route path="/transfers" element={<TransfersPage />} />
      <Route path="/polls" element={<PollsPage />} />
      <Route path="/news" element={<NewsPage />} />
      <Route path="/news/:id" element={<ArticlePage />} />
      <Route path="/search" element={<SearchResultsPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}