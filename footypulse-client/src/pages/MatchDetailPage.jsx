import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { matchesApi } from '../api/matchesApi';
import MatchDetail from '../components/matches/MatchDetail';
import MatchTimeline from '../components/matches/MatchTimeline';
import MatchStats from '../components/matches/MatchStats';
import MatchLineup from '../components/matches/MatchLineup';
import MatchEvents from '../components/matches/MatchEvents';
import MatchPollWidget from '../components/matches/MatchPollWidget';
import Tabs from '../components/common/Tabs';
import Breadcrumb from '../components/common/Breadcrumb';
import Loader from '../components/common/Loader';
import ErrorBanner from '../components/common/ErrorBanner';
import Badge from '../components/common/Badge';
import { formatDate, formatTime } from '../utils/formatDate';
import { getMatchStatus } from '../utils/formatScore';
import { MapPin, Calendar, Trophy } from 'lucide-react';

function MatchDetailsCard({ match }) {
  if (!match) return null;
  const status = getMatchStatus(match);
  const matchDate = match.match_date || match.date;
  const formattedDate = matchDate ? formatDate(matchDate, 'long') : '';
  const formattedTime = matchDate ? formatTime(matchDate, match.kick_off_time) : '';

  return (
    <div style={{ background: 'var(--gradient-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
      <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
        <h4 style={{ fontSize: 'var(--fs-md)', fontWeight: 800, fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '-0.01em', color: 'var(--text-primary)', margin: 0 }}>
          DETAILS
        </h4>
      </div>
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {match.competition_name && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Trophy size={16} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)', marginBottom: 2 }}>Competition</div>
              <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 600 }}>{match.competition_name}</div>
            </div>
          </div>
        )}
        {formattedDate && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Calendar size={16} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)', marginBottom: 2 }}>Date & Time</div>
              <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 600 }}>{formattedDate}{formattedTime ? ` • ${formattedTime}` : ''}</div>
            </div>
          </div>
        )}
        {(match.stadium_name || match.venue) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <MapPin size={16} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)', marginBottom: 2 }}>Venue</div>
              <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 600 }}>{match.stadium_name || match.venue}</div>
            </div>
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 16, flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: status === 'live' ? 'var(--live)' : status === 'finished' ? 'var(--accent-primary)' : 'var(--text-tertiary)' }} />
          </div>
          <div>
            <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)', marginBottom: 2 }}>Status</div>
            <Badge variant={status === 'live' ? 'live' : status === 'finished' ? 'accent' : 'info'}>
              {status === 'live' ? `${match.minute || ''}'` : status === 'finished' ? 'Full Time' : 'Upcoming'}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MatchDetailPage() {
  const { id } = useParams();
  const [match, setMatch] = useState(null);
  const [events, setEvents] = useState([]);
  const [lineup, setLineup] = useState({ home: [], away: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('events');

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [mRes, eRes, lRes] = await Promise.allSettled([
        matchesApi.getById(id),
        matchesApi.getEvents(id),
        matchesApi.getLineup(id),
      ]);

      if (mRes.status === 'fulfilled') setMatch(mRes.value?.data || mRes.value);
      else setError('Could not load match data. The database may be waking up.');

      if (eRes.status === 'fulfilled') setEvents(eRes.value?.data || eRes.value || []);

      if (lRes.status === 'fulfilled') {
        const data = lRes.value?.data || lRes.value || [];
        const matchData = mRes.status === 'fulfilled' ? (mRes.value?.data || mRes.value) : null;
        const homeTeamId = matchData?.home_team_id;
        if (homeTeamId) {
          setLineup({
            home: data.filter?.((p) => p.team_id === homeTeamId) || [],
            away: data.filter?.((p) => p.team_id !== homeTeamId) || [],
          });
        } else {
          setLineup({
            home: data.filter?.((p) => p.team_side === 'home' || p.is_home) || [],
            away: data.filter?.((p) => p.team_side === 'away' || (!p.is_home && p.team_side !== 'home')) || [],
          });
        }
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong loading match data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  if (loading) return <div className="page-wrapper"><Loader text="Loading match..." /></div>;

  if (error && !match) {
    return (
      <div className="page-wrapper">
        <div className="container page-content">
          <ErrorBanner message={error} onRetry={load} />
        </div>
      </div>
    );
  }

  const tabs = [
    { key: 'events', label: 'Events' },
    { key: 'timeline', label: 'Timeline' },
    { key: 'lineup', label: 'Lineup' },
    { key: 'stats', label: 'Stats' },
  ];

  const matchId = match?.match_id || match?.id || id;

  return (
    <div className="page-wrapper">
      <div className="container page-content">
        <Breadcrumb items={[
          { label: 'Matches', path: '/matches' },
          { label: match?.home_team_name && match?.away_team_name
            ? `${match.home_team_name} vs ${match.away_team_name}` : 'Match' },
        ]} />

        <MatchDetail match={match} />

        <div className="match-detail-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 320px',
          gap: 'var(--space-xl)',
          marginTop: 'var(--space-xl)',
          alignItems: 'start',
        }}>
          <div>
            <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
            <div style={{ marginTop: 'var(--space-md)' }}>
              {activeTab === 'events' && <MatchEvents events={events} match={match} />}
              {activeTab === 'timeline' && <MatchTimeline events={events} />}
              {activeTab === 'lineup' && <MatchLineup homePlayers={lineup.home} awayPlayers={lineup.away} match={match} events={events} />}
              {activeTab === 'stats' && <MatchStats homePlayers={lineup.home} awayPlayers={lineup.away} match={match} events={events} />}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)', position: 'sticky', top: 'calc(var(--navbar-height) + var(--space-xl))' }}>
            <MatchDetailsCard match={match} />
            <MatchPollWidget matchId={matchId} match={match} />
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .match-detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
