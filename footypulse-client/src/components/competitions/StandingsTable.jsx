import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/components/standings.css';

export default function StandingsTable({ standings = [], compact = false }) {
  const navigate = useNavigate();

  if (!standings.length) {
    return <p style={{ color: 'var(--text-tertiary)', textAlign: 'center', padding: 'var(--space-xl)' }}>No standings available</p>;
  }

  const getPosClass = (pos) => {
    if (pos <= 4) return 'pos--ucl';
    if (pos <= 6) return 'pos--uel';
    if (pos >= standings.length - 2) return 'pos--relegation';
    return '';
  };

  return (
    <div className="standings-wrapper">
      <div style={{ overflowX: 'auto' }}>
        <table className="standings-table">
          <thead>
            <tr>
              <th style={{ width: 40 }}>#</th>
              <th>Team</th>
              <th className="hide-mobile" style={{ textAlign: 'center' }}>P</th>
              <th className="hide-mobile" style={{ textAlign: 'center' }}>W</th>
              <th className="hide-mobile" style={{ textAlign: 'center' }}>D</th>
              <th className="hide-mobile" style={{ textAlign: 'center' }}>L</th>
              <th className="hide-mobile" style={{ textAlign: 'center' }}>GF</th>
              <th className="hide-mobile" style={{ textAlign: 'center' }}>GA</th>
              <th style={{ textAlign: 'center' }}>GD</th>
              <th style={{ textAlign: 'center' }}>Pts</th>
              {!compact && <th className="hide-mobile">Form</th>}
            </tr>
          </thead>
          <tbody>
            {standings.map((row) => (
              <tr key={row.team_id || row.id} onClick={() => navigate(`/teams/${row.team_id}`)} style={{ cursor: 'pointer' }}>
                <td><div className={`pos ${getPosClass(row.position || row.rank)}`}>{row.position || row.rank}</div></td>
                <td>
                  <div className="team-cell">
                    {row.team_logo ? (
                      <img src={row.team_logo} alt="" className="team-cell__logo" />
                    ) : (
                      <div className="team-cell__logo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>
                        {(row.team_name || 'T')[0]}
                      </div>
                    )}
                    <span>{row.team_name}</span>
                  </div>
                </td>
                <td className="num hide-mobile">{row.played ?? row.matches_played ?? 0}</td>
                <td className="num hide-mobile">{row.wins ?? row.won ?? 0}</td>
                <td className="num hide-mobile">{row.draws ?? row.drawn ?? 0}</td>
                <td className="num hide-mobile">{row.losses ?? row.lost ?? 0}</td>
                <td className="num hide-mobile">{row.goals_for ?? row.gf ?? 0}</td>
                <td className="num hide-mobile">{row.goals_against ?? row.ga ?? 0}</td>
                <td className="num">{row.goal_difference ?? row.gd ?? 0}</td>
                <td className="pts">{row.points ?? 0}</td>
                {!compact && row.form && (
                  <td className="hide-mobile">
                    <div className="form">
                      {(row.form || '').split('').slice(-5).map((r, i) => (
                        <div key={i} className={`form__dot form__dot--${r.toLowerCase()}`}>{r}</div>
                      ))}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
