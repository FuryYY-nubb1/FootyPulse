import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/components/standings.css';

export default function StandingsTable({ standings = [], compact = false, highlightTeamId = null }) {
  const navigate = useNavigate();

  if (!standings.length) {
    return (
      <p style={{ color: 'var(--text-tertiary)', textAlign: 'center', padding: 'var(--space-xl)' }}>
        No standings available
      </p>
    );
  }

  const totalTeams = standings.length;

  const getZoneClass = (pos) => {
    if (pos <= 4) return 'zone--ucl';
    if (pos <= 6) return 'zone--uel';
    if (pos >= totalTeams - 2 && totalTeams >= 10) return 'zone--rel';
    return '';
  };

  return (
    <div className="standings-wrapper">
      <div style={{ overflowX: 'auto' }}>
        <table className="standings-table">
          <thead>
            <tr>
              <th className="col-pos">Pos</th>
              <th className="col-team">Team</th>
              <th className="col-num hide-mobile">P</th>
              <th className="col-num hide-mobile">W</th>
              <th className="col-num hide-mobile">D</th>
              <th className="col-num hide-mobile">L</th>
              <th className="col-num hide-mobile">F</th>
              <th className="col-num hide-mobile">A</th>
              <th className="col-num">+/-</th>
              <th className="col-pts">PTS</th>
              {!compact && <th className="col-form hide-mobile">Form</th>}
            </tr>
          </thead>
          <tbody>
            {standings.map((row) => {
              const pos = row.position || row.rank;
              const zone = getZoneClass(pos);
              const teamLogo = row.team_logo || row.logo_url || null;

              const isHighlighted = highlightTeamId && (String(row.team_id) === String(highlightTeamId));

              return (
                <tr
                  key={row.team_id || row.id}
                  className={`standings-row ${zone || ''} ${isHighlighted ? 'standings-row--highlight' : ''}`.trim()}
                  onClick={() => navigate(`/teams/${row.team_id}`)}
                >
                  <td className="col-pos">
                    <div className="pos-num">{pos}</div>
                  </td>
                  <td className="col-team">
                    <div className="team-cell">
                      {teamLogo ? (
                        <img
                          src={teamLogo}
                          alt={row.team_name || ''}
                          className="team-cell__logo"
                          onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                        />
                      ) : null}
                      <div
                        className="team-cell__fallback"
                        style={teamLogo ? { display: 'none' } : {}}
                      >
                        {(row.team_name || row.short_name || 'T')[0]}
                      </div>
                      <span className="team-cell__name">{row.team_name || row.short_name}</span>
                    </div>
                  </td>
                  <td className="num hide-mobile">{row.played ?? row.won + row.drawn + row.lost ?? 0}</td>
                  <td className="num hide-mobile">{row.won ?? 0}</td>
                  <td className="num hide-mobile">{row.drawn ?? 0}</td>
                  <td className="num hide-mobile">{row.lost ?? 0}</td>
                  <td className="num hide-mobile">{row.goals_for ?? 0}</td>
                  <td className="num hide-mobile">{row.goals_against ?? 0}</td>
                  <td className="num">{row.goal_difference ?? 0}</td>
                  <td className="pts">{row.points ?? 0}</td>
                  {!compact && (
                    <td className="hide-mobile">
                      <div className="form">
                        {(row.form || '').split('').slice(-5).map((r, i) => (
                          <div key={i} className={`form__dot form__dot--${r.toLowerCase()}`}>
                            {r}
                          </div>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Zone Key / Legend */}
      {!compact && (
        <div className="standings-key">
          <span className="standings-key__title">Key:</span>
          <div className="standings-key__items">
            <div className="standings-key__item">
              <span className="standings-key__bar standings-key__bar--ucl" />
              <span>Champions League</span>
            </div>
            <div className="standings-key__item">
              <span className="standings-key__bar standings-key__bar--uel" />
              <span>UEFA Europa League</span>
            </div>
            <div className="standings-key__item">
              <span className="standings-key__bar standings-key__bar--rel" />
              <span>Relegation</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}