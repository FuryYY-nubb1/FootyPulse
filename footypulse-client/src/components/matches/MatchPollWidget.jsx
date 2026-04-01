// ============================================
// src/components/matches/MatchPollWidget.jsx
// ============================================
// UPDATED: Uses authenticated user (useAuth) instead of anonymous ID.
//          Shows "Sign in to vote" for unauthenticated users.
// ============================================

import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { pollsApi } from '../../api/pollsApi';
import { useAuth } from '../../context/AuthContext';
import { BarChart3, Users, LogIn } from 'lucide-react';

function PollOptionBar({ option, totalVotes, isSelected, isActive, voting, onVote, teamLogo, teamShort }) {
  const votes = option.votes || 0;
  const percent = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;

  return (
    <button
      onClick={onVote}
      disabled={!isActive || voting}
      style={{
        display: 'flex', alignItems: 'center', gap: 'var(--space-sm)',
        padding: 'var(--space-sm) var(--space-md)',
        background: isSelected ? 'var(--accent-primary-dim)' : 'var(--bg-secondary)',
        border: `1px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
        borderRadius: 'var(--radius-md)',
        cursor: isActive && !voting ? 'pointer' : 'default',
        transition: 'all var(--transition-fast)',
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
        color: 'var(--text-primary)',
      }}
    >
      {/* Progress bar */}
      {!isActive && (
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0,
          width: `${percent}%`,
          background: isSelected
            ? 'rgba(var(--accent-primary-rgb, 99, 102, 241), 0.15)'
            : 'rgba(255,255,255,0.04)',
          transition: 'width 0.6s ease',
        }} />
      )}

      <div style={{
        position: 'relative', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', width: '100%',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
          {teamLogo && <img src={teamLogo} alt="" style={{ width: 20, height: 20, objectFit: 'contain' }} />}
          <span style={{ fontSize: 'var(--fs-sm)', fontWeight: isSelected ? 700 : 500 }}>
            {option.text || option.label}
          </span>
          <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)' }}>
            {votes} vote{votes !== 1 ? 's' : ''}
          </span>
        </div>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--fs-md)',
          fontWeight: 800,
          color: 'var(--text-primary)',
          minWidth: 36,
          textAlign: 'right',
        }}>
          {percent}%
        </span>
      </div>
    </button>
  );
}

export default function MatchPollWidget({ matchId, match }) {
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasVoted, setHasVoted] = useState(false);
  const [userSelection, setUserSelection] = useState(null);
  const [voting, setVoting] = useState(false);

  // Use authenticated user instead of anonymous ID
  const { user, isAuthenticated } = useAuth();
  const userId = user ? String(user.user_id) : null;

  useEffect(() => {
    if (!matchId) { setLoading(false); return; }

    const fetchPoll = async () => {
      setLoading(true);
      try {
        // Fetch polls linked to this match
        const res = await pollsApi.getByMatch(matchId);
        const polls = res.data || [];
        const matchPoll = polls[0]; // Take the first/featured poll

        if (matchPoll) {
          setPoll(matchPoll);

          // Check if user has voted (only if logged in)
          if (userId) {
            try {
              const voteRes = await pollsApi.getUserVote(matchPoll.poll_id, userId);
              if (voteRes.data?.has_voted && voteRes.data.vote) {
                setHasVoted(true);
                const selected = voteRes.data.vote.selected_options;
                setUserSelection(Array.isArray(selected) ? selected : JSON.parse(selected || '[]'));
              }
            } catch {
              // Not voted — fine
            }
          }
        }
      } catch (err) {
        console.error('Failed to load match poll:', err);
      }
      setLoading(false);
    };

    fetchPoll();
  }, [matchId, userId]);

  const handleVote = useCallback(async (optionId) => {
    if (!isAuthenticated || !poll || poll.status !== 'active' || hasVoted || voting) return;
    setVoting(true);
    try {
      const res = await pollsApi.vote(poll.poll_id, {
        selected_options: [optionId],
      });
      setHasVoted(true);
      setUserSelection([optionId]);
      if (res.data?.poll) {
        setPoll(prev => ({ ...prev, ...res.data.poll }));
      }
    } catch (err) {
      console.error('Vote failed:', err);
    }
    setVoting(false);
  }, [poll, hasVoted, voting, isAuthenticated]);

  if (loading) return null;
  if (!poll) return null;

  const options = poll.options || [];
  const totalVotes = poll.total_votes || options.reduce((sum, o) => sum + (o.votes || 0), 0);
  const isActive = poll.status === 'active' && !hasVoted && isAuthenticated;

  // Try to map options to team logos (Home Win, Draw, Away Win pattern)
  const getTeamInfo = (option, idx) => {
    const text = (option.text || option.label || '').toLowerCase();
    if (match) {
      if (text.includes('home') || text.includes(match.home_team?.short_name?.toLowerCase() || '___')) {
        return { logo: match.home_team?.logo_url, short: match.home_team?.short_name };
      }
      if (text.includes('away') || text.includes(match.away_team?.short_name?.toLowerCase() || '___')) {
        return { logo: match.away_team?.logo_url, short: match.away_team?.short_name };
      }
    }
    return { logo: null, short: null };
  };

  return (
    <div style={{
      background: 'var(--gradient-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-lg)',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 'var(--space-md)',
      }}>
        <h4 style={{
          fontSize: 'var(--fs-sm)', fontWeight: 700,
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <BarChart3 size={16} style={{ color: 'var(--accent-secondary)' }} />
          {poll.question}
        </h4>
        <span style={{
          fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)',
          display: 'flex', alignItems: 'center', gap: 4,
        }}>
          <Users size={12} /> {totalVotes}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
        {options.map((option, i) => {
          const optionId = option.id !== undefined ? option.id : i;
          const teamInfo = getTeamInfo(option, i);

          return (
            <PollOptionBar
              key={i}
              option={option}
              totalVotes={totalVotes}
              isSelected={userSelection?.includes(optionId)}
              isActive={isActive}
              voting={voting}
              onVote={() => handleVote(optionId)}
              teamLogo={teamInfo.logo}
              teamShort={teamInfo.short}
            />
          );
        })}

        {/* Sign in prompt for unauthenticated users */}
        {!isAuthenticated && poll.status === 'active' && (
          <Link to="/login" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            padding: 'var(--space-xs)',
            fontSize: 'var(--fs-xs)', color: 'var(--accent-primary)',
            textDecoration: 'none', fontWeight: 600,
          }}>
            <LogIn size={14} /> Sign in to vote
          </Link>
        )}

        {/* Link to full poll */}
        {poll.poll_id && (
          <Link
            to={`/polls/${poll.poll_id}`}
            style={{
              fontSize: 'var(--fs-xs)',
              color: 'var(--accent-primary)',
              textAlign: 'center',
              marginTop: 4,
              textDecoration: 'none',
              fontWeight: 500,
            }}
          >
            View full poll →
          </Link>
        )}
      </div>
    </div>
  );
}