import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { playersApi } from '../api/playersApi';
import PlayerHeader from '../components/players/PlayerHeader';
import PlayerStats from '../components/players/PlayerStats';
import PlayerCareer from '../components/players/PlayerCareer';
import PlayerAchievements from '../components/players/PlayerAchievements';
import PlayerTransferHistory from '../components/players/PlayerTransferHistory';
import Tabs from '../components/common/Tabs';
import Breadcrumb from '../components/common/Breadcrumb';
import Loader from '../components/common/Loader';

export default function PlayerDetailPage() {
  const { id } = useParams();
  const [player, setPlayer] = useState(null);
  const [career, setCareer] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('stats');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [pRes, cRes, aRes, tRes] = await Promise.allSettled([
          playersApi.getById(id),
          playersApi.getCareer(id),
          playersApi.getAchievements(id),
          playersApi.getTransfers(id),
        ]);
        if (pRes.status === 'fulfilled') setPlayer(pRes.value?.data || pRes.value);
        if (cRes.status === 'fulfilled') setCareer(cRes.value?.data || cRes.value || []);
        if (aRes.status === 'fulfilled') setAchievements(aRes.value?.data || aRes.value || []);
        if (tRes.status === 'fulfilled') setTransfers(tRes.value?.data || tRes.value || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <div className="page-wrapper"><Loader text="Loading player..." /></div>;

  // Find the current contract (for jersey number, team info)
  const currentContract = career.find(c => c.is_current) || career[0] || null;

  const tabs = [
    { key: 'stats', label: 'Stats' },
    { key: 'career', label: 'Career' },
    { key: 'achievements', label: 'Achievements', count: achievements.length },
    { key: 'transfers', label: 'Transfers', count: transfers.length },
  ];

  return (
    <div className="page-wrapper">
      <div className="container page-content">
        <Breadcrumb items={[{ label: 'Players', path: '/teams' }, { label: player?.name || player?.display_name || 'Player' }]} />
        <PlayerHeader player={player} currentContract={currentContract} />
        <div style={{ marginTop: 'var(--space-2xl)' }}>
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
          {activeTab === 'stats' && <PlayerStats stats={player} playerId={id} />}
          {activeTab === 'career' && <PlayerCareer contracts={career} />}
          {activeTab === 'achievements' && <PlayerAchievements achievements={achievements} />}
          {activeTab === 'transfers' && <PlayerTransferHistory transfers={transfers} />}
        </div>
      </div>
    </div>
  );
}