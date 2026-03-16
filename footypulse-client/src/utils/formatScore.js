export function formatScore(homeScore, awayScore) {
  if (homeScore === null || homeScore === undefined) return 'vs';
  return `${homeScore} - ${awayScore}`;
}

export function getMatchResult(homeScore, awayScore, forTeam = 'home') {
  if (homeScore === null) return null;
  if (homeScore === awayScore) return 'draw';
  if (forTeam === 'home') return homeScore > awayScore ? 'win' : 'loss';
  return awayScore > homeScore ? 'win' : 'loss';
}

export function getMatchStatus(match) {
  if (!match) return 'unknown';
  const status = (match.status || '').toLowerCase();
  if (['live', 'in_play', '1h', '2h', 'ht', 'et', 'pen'].includes(status)) return 'live';
  if (['ft', 'aet', 'finished', 'full_time'].includes(status)) return 'finished';
  if (['ns', 'scheduled', 'tbd', 'not_started'].includes(status)) return 'upcoming';
  if (['pst', 'postponed', 'canc', 'cancelled'].includes(status)) return 'postponed';
  return 'unknown';
}

export function formatMinute(minute, extra) {
  if (!minute) return '';
  if (extra) return `${minute}+${extra}'`;
  return `${minute}'`;
}

export function formatTransferFee(fee) {
  if (!fee || fee === 0) return 'Free';
  if (fee === -1) return 'Loan';
  if (fee === -2) return 'Undisclosed';
  if (fee >= 1000000) return `€${(fee / 1000000).toFixed(1)}M`;
  if (fee >= 1000) return `€${(fee / 1000).toFixed(0)}K`;
  return `€${fee}`;
}
