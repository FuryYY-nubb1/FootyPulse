import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { matchesApi } from '../api/matchesApi';
import MatchDetail from '../components/matches/MatchDetail';
import MatchTimeline from '../components/matches/MatchTimeline';
import MatchStats from '../components/matches/MatchStats';
import MatchLineup from '../components/matches/MatchLineup';
import MatchEvents from '../components/matches/MatchEvents';
import Tabs from '../components/common/Tabs';
import Breadcrumb from '../components/common/Breadcrumb';
import Loader from '../components/common/Loader';

export default function MatchDetailPage() {
  const { id } = useParams();
  const [match, setMatch] = useState(null);
  const [events, setEvents] = useState([]);
  const [lineup, setLineup] = useState({ home: [], away: [] });
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('events');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [mRes, eRes, lRes] = await Promise.allSettled([
          matchesApi.getById(id),
          matchesApi.getEvents(id),
          matchesApi.getLineup(id),
        ]);
        if (mRes.status === 'fulfilled') setMatch(mRes.value?.data || mRes.value);
        if (eRes.status === 'fulfilled') setEvents(eRes.value?.data || eRes.value || []);
        if (lRes.status === 'fulfilled') {
          const data = lRes.value?.data || lRes.value || [];
          setLineup({
            home: data.filter?.((p) => p.team_side === 'home' || p.is_home) || [],
            away: data.filter?.((p) => p.team_side === 'away' || !p.is_home) || [],
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <div className="page-wrapper"><Loader text="Loading match..." /></div>;

  const tabs = [
    { key: 'events', label: 'Events' },
    { key: 'timeline', label: 'Timeline' },
    { key: 'lineup', label: 'Lineup' },
    { key: 'stats', label: 'Stats' },
  ];

  return (
    <div className="page-wrapper">
      <div className="container page-content">
        <Breadcrumb items={[
          { label: 'Matches', path: '/matches' },
          { label: match?.home_team_name && match?.away_team_name ? `${match.home_team_name} vs ${match.away_team_name}` : 'Match' },
        ]} />
        <MatchDetail match={match} />
        <div style={{ marginTop: 'var(--space-2xl)' }}>
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
          {activeTab === 'events' && <MatchEvents events={events} />}
          {activeTab === 'timeline' && <MatchTimeline events={events} />}
          {activeTab === 'lineup' && <MatchLineup homePlayers={lineup.home} awayPlayers={lineup.away} />}
          {activeTab === 'stats' && <MatchStats stats={stats} />}
        </div>
      </div>
    </div>
  );
}
