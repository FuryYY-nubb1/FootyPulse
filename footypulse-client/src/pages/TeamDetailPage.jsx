import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { teamsApi } from '../api/teamsApi';
import TeamHeader from '../components/teams/TeamHeader';
import TeamSquad from '../components/teams/TeamSquad';
import TeamStats from '../components/teams/TeamStats';
import TeamFixtures from '../components/teams/TeamFixtures';
import TeamTransfers from '../components/teams/TeamTransfers';
import Tabs from '../components/common/Tabs';
import Breadcrumb from '../components/common/Breadcrumb';
import Loader from '../components/common/Loader';

export default function TeamDetailPage() {
  const { id } = useParams();
  const [team, setTeam] = useState(null);
  const [squad, setSquad] = useState([]);
  const [fixtures, setFixtures] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('squad');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [tRes, sRes, fRes, trRes] = await Promise.allSettled([
          teamsApi.getById(id),
          teamsApi.getSquad(id),
          teamsApi.getFixtures(id),
          teamsApi.getTransfers(id),
        ]);
        if (tRes.status === 'fulfilled') setTeam(tRes.value?.data || tRes.value);
        if (sRes.status === 'fulfilled') setSquad(sRes.value?.data || sRes.value || []);
        if (fRes.status === 'fulfilled') setFixtures(fRes.value?.data || fRes.value || []);
        if (trRes.status === 'fulfilled') setTransfers(trRes.value?.data || trRes.value || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <div className="page-wrapper"><Loader text="Loading team..." /></div>;

  const tabs = [
    { key: 'squad', label: 'Squad', count: squad.length },
    { key: 'fixtures', label: 'Fixtures', count: fixtures.length },
    { key: 'stats', label: 'Stats' },
    { key: 'transfers', label: 'Transfers', count: transfers.length },
  ];

  return (
    <div className="page-wrapper">
      <div className="container page-content">
        <Breadcrumb items={[{ label: 'Teams', path: '/teams' }, { label: team?.name || 'Team' }]} />
        <TeamHeader team={team} />
        <div style={{ marginTop: 'var(--space-2xl)' }}>
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
          {activeTab === 'squad' && <TeamSquad players={squad} />}
          {activeTab === 'fixtures' && <TeamFixtures matches={fixtures} />}
          {activeTab === 'stats' && <TeamStats stats={team} />}
          {activeTab === 'transfers' && <TeamTransfers transfers={transfers} />}
        </div>
      </div>
    </div>
  );
}
