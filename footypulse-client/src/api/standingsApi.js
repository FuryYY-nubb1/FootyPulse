import api from './axiosConfig';

export const standingsApi = {
  // Called from CompetitionDetailPage: passes competitionId + seasonId as query params
  // Backend route: GET /standings?competitionId=1&seasonId=1
  getByCompetition: (compId, seasonId) =>
    api.get('/standings', { params: { competitionId: compId, seasonId } }),

  // Direct season lookup
  getBySeason: (seasonId) =>
    api.get(`/standings/season/${seasonId}`),
};