// ============================================
// src/components/matches/MatchPollWidget.jsx
// ============================================
// Compact "PICK YOUR WINNER" poll widget for the match detail sidebar.
// Fetches polls linked to the current match and allows inline voting.
// ============================================

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { pollsApi } from '../../api/pollsApi';

function getOrCreateUserId() {
  let userId = localStorage.getItem('footypulse_user_id');
  if (!userId) {
    userId = 'anon_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    localStorage.setItem('footypulse_user_id', userId);
  }
  return userId;
}

function PollOptionBar({ option, totalVotes, isSelected, isActive, voting, onVote, teamLogo, teamShort }) {
  const votes = option.votes || 0;
  const percent = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;

  return (
    <button
      onClick={onVote}
      disabled={!isActive || voting}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
        padding: '10px 14px',
        background: isSelected ? 'var(--accent-primary-dim)' : 'var(--bg-secondary)',
        border: `1px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
        borderRadius: 'var(--radius-md)',
        cursor: isActive && !voting ? 'pointer' : 'default',
        transition: 'all var(--transition-fast)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Progress background */}
      <div style={{
        position: 'absolute',
        left: 0, top: 0, bottom: 0,
        width: `${percent}%`,
        background: isSelected
          ? 'rgba(0, 245, 160, 0.12)'
          : 'rgba(255, 255, 255, 0.03)',
        transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        borderRadius: 'var(--radius-md)',
      }} />

      {/* Left: Team icon + name */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        position: 'relative',
        zIndex: 1,
      }}>
        {teamLogo && (
          <div style={{
            width: 22, height: 22, borderRadius: 4,
            background: 'var(--bg-tertiary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden', flexShrink: 0,
          }}>
            <img src={teamLogo} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
        )}
        <span style={{
          fontWeight: 700,
          fontSize: 'var(--fs-sm)',
          color: 'var(--text-primary)',
          textTransform: 'uppercase',
          letterSpacing: '0.03em',
        }}>
          {teamShort || option.text || option.label}
        </span>
      </div>

      {/* Right: votes + percent */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        position: 'relative',
        zIndex: 1,
      }}>
        <span style={{
          fontSize: 'var(--fs-xs)',
          color: 'var(--text-tertiary)',
        }}>
          {votes} vote{votes !== 1 ? 's' : ''}
        </span>
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

  const userId = getOrCreateUserId();

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

          // Check if user has voted
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
      } catch (err) {
        console.error('Failed to load match poll:', err);
      }
      setLoading(false);
    };

    fetchPoll();
  }, [matchId, userId]);

  const handleVote = useCallback(async (optionId) => {
    if (!poll || poll.status !== 'active' || hasVoted || voting) return;
    setVoting(true);
    try {
      const res = await pollsApi.vote(poll.poll_id, {
        user_id: userId,
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
  }, [poll, hasVoted, voting, userId]);

  if (loading) return null;
  if (!poll) return null;

  const options = poll.options || [];
  const totalVotes = poll.total_votes || options.reduce((sum, o) => sum + (o.votes || 0), 0);
  const isActive = poll.status === 'active' && !hasVoted;

  // Try to map options to team logos (Home Win, Draw, Away Win pattern)
  const getTeamInfo = (option, index) => {
    const text = (option.text || option.label || '').toLowerCase();
    if (text.includes('draw')) return { logo: null, short: 'DRAW' };

    // Check if it matches home team
    const homeName = (match?.home_team_name || '').toLowerCase();
    const homeShort = (match?.home_short || match?.home_team_short || '').toLowerCase();
    if (text.includes(homeName) || (homeShort && text.includes(homeShort)) || (index === 0 && !text.includes('draw'))) {
      return {
        logo: match?.home_logo || match?.home_team_logo,
        short: match?.home_short || match?.home_team_short || match?.home_team_name || option.text,
      };
    }

    // Check if it matches away team
    const awayName = (match?.away_team_name || '').toLowerCase();
    const awayShort = (match?.away_short || match?.away_team_short || '').toLowerCase();
    if (text.includes(awayName) || (awayShort && text.includes(awayShort))) {
      return {
        logo: match?.away_logo || match?.away_team_logo,
        short: match?.away_short || match?.away_team_short || match?.away_team_name || option.text,
      };
    }

    // Default: last option is usually away
    if (index === options.length - 1) {
      return {
        logo: match?.away_logo || match?.away_team_logo,
        short: match?.away_short || match?.away_team_short || match?.away_team_name || option.text,
      };
    }

    return { logo: null, short: option.text || option.label };
  };

  return (
    <div style={{
      background: 'var(--gradient-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '14px 16px',
        borderBottom: '1px solid var(--border-subtle)',
      }}>
        <h4 style={{
          fontSize: 'var(--fs-md)',
          fontWeight: 800,
          fontFamily: 'var(--font-display)',
          textTransform: 'uppercase',
          letterSpacing: '-0.01em',
          color: 'var(--text-primary)',
          margin: 0,
        }}>
          PICK YOUR WINNER
        </h4>
      </div>

      {/* Poll options */}
      <div style={{
        padding: '12px 16px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}>
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