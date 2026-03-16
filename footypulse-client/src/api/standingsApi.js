import api from './axiosConfig';

export const standingsApi = {
  getByCompetition: (compId, seasonId) =>
    api.get(`/standings`, { params: { competitionId: compId, seasonId } }),
  getBySeason: (seasonId) => api.get(`/standings`, { params: { seasonId } }),
};
