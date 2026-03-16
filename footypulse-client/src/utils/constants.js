export const POSITIONS = {
  GK: 'Goalkeeper',
  CB: 'Centre-Back',
  LB: 'Left-Back',
  RB: 'Right-Back',
  CDM: 'Defensive Midfielder',
  CM: 'Central Midfielder',
  CAM: 'Attacking Midfielder',
  LM: 'Left Midfielder',
  RM: 'Right Midfielder',
  LW: 'Left Winger',
  RW: 'Right Winger',
  CF: 'Centre-Forward',
  ST: 'Striker',
};

export const MATCH_EVENTS = {
  goal: { icon: '⚽', label: 'Goal' },
  own_goal: { icon: '⚽', label: 'Own Goal' },
  penalty_goal: { icon: '⚽', label: 'Penalty' },
  penalty_miss: { icon: '❌', label: 'Penalty Missed' },
  yellow_card: { icon: '🟨', label: 'Yellow Card' },
  red_card: { icon: '🟥', label: 'Red Card' },
  second_yellow: { icon: '🟨🟥', label: 'Second Yellow' },
  substitution: { icon: '🔄', label: 'Substitution' },
  var: { icon: '📺', label: 'VAR Decision' },
};

export const NAV_LINKS = [
  { path: '/', label: 'Home' },
  { path: '/matches', label: 'Matches' },
  { path: '/competitions', label: 'Leagues' },
  { path: '/teams', label: 'Teams' },
  { path: '/transfers', label: 'Transfers' },
  { path: '/polls', label: 'Polls' },
  { path: '/news', label: 'News' },
];
export const ITEMS_PER_PAGE = 20;
