import api from './axiosConfig';

export const standingsApi = {

  getByCompetition: (compId, seasonId) =>
    api.get('/standings', { params: { competitionId: compId, seasonId } }),

  // Direct season lookup
  getBySeason: (seasonId) =>
    api.get(`/standings/season/${seasonId}`),
};