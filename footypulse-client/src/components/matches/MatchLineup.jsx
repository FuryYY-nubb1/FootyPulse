import React from 'react';
import { GoalIcon, OwnGoalIcon, YellowCardIcon, RedCardIcon, SecondYellowIcon, SubInIcon, SubOutIcon, AssistIcon, EventIcon as EvIcon } from './MatchIcons';

// ═══════════════════════════════════════════
// POSITION COORDS FOR PITCH VIEW
// ═══════════════════════════════════════════
const POS = {
  GK:  { x: 6, y: 50 },  CB:  { x: 28, y: 50 }, LB: { x: 28, y: 85 }, RB: { x: 28, y: 15 },
  CDM: { x: 45, y: 50 },  CM: { x: 52, y: 50 }, CAM: { x: 65, y: 50 },
  LM:  { x: 52, y: 85 },  RM: { x: 52, y: 15 },
  LW:  { x: 78, y: 82 },  RW: { x: 78, y: 18 },
  ST:  { x: 85, y: 50 },  CF: { x: 80, y: 50 },
};

function computePositions(starters) {
  const groups = {};
  starters.forEach(p => { const pos = p.position || p.default_position || 'CM'; if (!groups[pos]) groups[pos] = []; groups[pos].push(p); });
  const out = [];
  Object.entries(groups).forEach(([pos, pls]) => {
    const base = POS[pos] || POS.CM;
    if (pls.length === 1) { out.push({ ...pls[0], px: base.x, py: base.y }); return; }
    let yMin, yMax;
    if (pos === 'CB') { yMin = 25; yMax = 75; } else if (pos === 'CDM' || pos === 'CM') { yMin = 25; yMax = 75; }
    else if (pos === 'ST' || pos === 'CF') { yMin = 35; yMax = 65; } else if (pos === 'CAM') { yMin = 30; yMax = 70; } else { yMin = 20; yMax = 80; }
    pls.forEach((p, i) => { const y = yMin + (yMax - yMin) * (i / (pls.length - 1)); out.push({ ...p, px: base.x, py: y }); });
  });
  return out;
}

// ═══════════════════════════════════════════
// EVENT BADGE HELPERS
// ═══════════════════════════════════════════
function getPlayerBadges(player, events) {
  if (!events?.length) return [];
  const pid = player.person_id; const badges = [];
  for (const ev of events) {
    if (ev.person_id === pid) {
      if (ev.event_type === 'goal' || ev.event_type === 'penalty') badges.push({ type: 'goal', minute: ev.minute });
      else if (ev.event_type === 'own_goal') badges.push({ type: 'own_goal', minute: ev.minute });
      else if (ev.event_type === 'yellow') badges.push({ type: 'yellow', minute: ev.minute });
      else if (ev.event_type === 'red' || ev.event_type === 'second_yellow') badges.push({ type: ev.event_type, minute: ev.minute });
    }
    if (ev.related_person_id === pid && (ev.event_type === 'goal' || ev.event_type === 'penalty')) badges.push({ type: 'assist', minute: ev.minute });
    if (ev.event_type === 'sub' && ev.person_id === pid) badges.push({ type: 'subOut', minute: ev.minute });
    if (ev.event_type === 'sub' && ev.related_person_id === pid) badges.push({ type: 'subIn', minute: ev.minute });
  }
  return badges;
}

function getSubInfo(player, events) {
  if (!events?.length) return { subbedIn: null, subbedOut: null };
  const pid = player.person_id; let subbedOut = null, subbedIn = null;
  for (const ev of events) {
    if (ev.event_type === 'sub') { if (ev.person_id === pid) subbedOut = ev.minute; if (ev.related_person_id === pid) subbedIn = ev.minute; }
  }
  if (!subbedIn && player.minute_in > 0 && !player.is_starter) subbedIn = player.minute_in;
  if (!subbedOut && player.minute_out > 0) subbedOut = player.minute_out;
  return { subbedIn, subbedOut };
}

function SmallBadge({ type }) {
  if (type === 'goal') return <GoalIcon size={11} />;
  if (type === 'own_goal') return <OwnGoalIcon size={11} />;
  if (type === 'assist') return <AssistIcon size={11} />;
  if (type === 'yellow') return <YellowCardIcon size={10} />;
  if (type === 'red') return <RedCardIcon size={10} />;
  if (type === 'second_yellow') return <SecondYellowIcon size={10} />;
  if (type === 'subOut') return <SubOutIcon size={9} />;
  if (type === 'subIn') return <SubInIcon size={9} />;
  return null;
}

// ═══════════════════════════════════════════
// PITCH PLAYER CIRCLE
// ═══════════════════════════════════════════
function PitchPlayer({ player, isHome, events }) {
  const name = player.display_name || player.name || '';
  const number = player.jersey_number ?? '';
  const parts = name.split(' ');
  const shortName = parts.length > 1 ? `${parts[0][0]}. ${parts.slice(-1)[0]}` : name;
  const badges = getPlayerBadges(player, events);

  return (
    <div style={{ position: 'absolute', left: `${player.px}%`, top: `${player.py}%`, transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, zIndex: 2 }}>
      {badges.length > 0 && (
        <div style={{ position: 'absolute', top: -4, right: -10, display: 'flex', gap: 1, flexDirection: 'column' }}>
          {badges.slice(0, 3).map((b, i) => <SmallBadge key={i} type={b.type} />)}
        </div>
      )}
      <div style={{
        width: 38, height: 38, borderRadius: '50%',
        background: isHome ? '#fff' : '#1a1a2e', border: isHome ? '2.5px solid #ddd' : '2.5px solid #555',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-mono, monospace)', fontWeight: 800, fontSize: '0.85rem',
        color: isHome ? '#1a1a2e' : '#fff', boxShadow: '0 2px 10px rgba(0,0,0,0.4)',
      }}>{number}</div>
      <span style={{ fontSize: '0.55rem', fontWeight: 600, color: '#fff', textShadow: '0 1px 4px rgba(0,0,0,0.9)', whiteSpace: 'nowrap', textAlign: 'center', lineHeight: 1.2 }}>{shortName}</span>
    </div>
  );
}

// ═══════════════════════════════════════════
// PITCH SVG
// ═══════════════════════════════════════════
function PitchMarkings() {
  const s = 'rgba(255,255,255,0.55)';
  return (
    <svg viewBox="0 0 1050 680" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      <defs><linearGradient id="pg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2d8a4e"/><stop offset="50%" stopColor="#3aaa5c"/><stop offset="100%" stopColor="#2d8a4e"/></linearGradient></defs>
      <rect width="1050" height="680" fill="url(#pg)"/>
      {[...Array(13)].map((_, i) => <rect key={i} x={i*81} y="0" width="81" height="680" fill={i%2===0?'rgba(0,0,0,0.025)':'rgba(255,255,255,0.015)'}/>)}
      <rect x="30" y="30" width="990" height="620" fill="none" stroke={s} strokeWidth="2"/>
      <line x1="525" y1="30" x2="525" y2="650" stroke={s} strokeWidth="2"/>
      <circle cx="525" cy="340" r="91.5" fill="none" stroke={s} strokeWidth="2"/><circle cx="525" cy="340" r="3" fill={s}/>
      <rect x="30" y="138" width="165" height="404" fill="none" stroke={s} strokeWidth="2"/>
      <rect x="30" y="218" width="55" height="244" fill="none" stroke={s} strokeWidth="2"/><circle cx="140" cy="340" r="3" fill={s}/>
      <path d="M195 258A91.5 91.5 0 0 1 195 422" fill="none" stroke={s} strokeWidth="2"/>
      <rect x="855" y="138" width="165" height="404" fill="none" stroke={s} strokeWidth="2"/>
      <rect x="965" y="218" width="55" height="244" fill="none" stroke={s} strokeWidth="2"/><circle cx="910" cy="340" r="3" fill={s}/>
      <path d="M855 258A91.5 91.5 0 0 0 855 422" fill="none" stroke={s} strokeWidth="2"/>
      <path d="M30 40A10 10 0 0 1 40 30" fill="none" stroke={s} strokeWidth="2"/><path d="M1010 30A10 10 0 0 1 1020 40" fill="none" stroke={s} strokeWidth="2"/>
      <path d="M40 650A10 10 0 0 1 30 640" fill="none" stroke={s} strokeWidth="2"/><path d="M1020 640A10 10 0 0 1 1010 650" fill="none" stroke={s} strokeWidth="2"/>
      <rect x="18" y="290" width="12" height="100" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5"/>
      <rect x="1020" y="290" width="12" height="100" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5"/>
    </svg>
  );
}

function HalfPitch({ players, isHome, events }) {
  const positioned = computePositions(players.filter(p => p.is_starter));
  return (
    <div style={{ position: 'relative', width: '50%', height: '100%' }}>
      {positioned.map((p, i) => <PitchPlayer key={p.person_id || i} player={p} isHome={isHome} events={events} />)}
    </div>
  );
}

// ═══════════════════════════════════════════
// FORMATION HEADER
// ═══════════════════════════════════════════
function FormationHeader({ match }) {
  if (!match) return null;
  const hL = match.home_logo || match.home_team_logo, aL = match.away_logo || match.away_team_logo;
  const hS = match.home_short || match.home_team_short || match.home_team_name || '', aS = match.away_short || match.away_team_short || match.away_team_name || '';
  return (
    <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 20px',background:'var(--bg-secondary)',borderRadius:'var(--radius-lg) var(--radius-lg) 0 0',border:'1px solid var(--border-subtle)',borderBottom:'none' }}>
      <div style={{ display:'flex',alignItems:'center',gap:10 }}>
        <span style={{ fontWeight:800,fontSize:'var(--fs-sm)',color:'var(--text-primary)',textTransform:'uppercase' }}>{hS}</span>
        {hL && <img src={hL} alt="" style={{ width:26,height:26,objectFit:'contain' }}/>}
        {match.home_formation && <span style={{ fontFamily:'var(--font-mono)',fontWeight:700,fontSize:'var(--fs-md)',color:'var(--text-primary)',marginLeft:12 }}>{match.home_formation}</span>}
      </div>
      <span style={{ fontSize:'var(--fs-lg)',fontWeight:900,fontFamily:'var(--font-display)',textTransform:'uppercase',letterSpacing:'0.06em',color:'var(--text-primary)' }}>FORMATION</span>
      <div style={{ display:'flex',alignItems:'center',gap:10 }}>
        {match.away_formation && <span style={{ fontFamily:'var(--font-mono)',fontWeight:700,fontSize:'var(--fs-md)',color:'var(--text-primary)',marginRight:12 }}>{match.away_formation}</span>}
        {aL && <img src={aL} alt="" style={{ width:26,height:26,objectFit:'contain' }}/>}
        <span style={{ fontWeight:800,fontSize:'var(--fs-sm)',color:'var(--text-primary)',textTransform:'uppercase' }}>{aS}</span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// LIST VIEW
// ═══════════════════════════════════════════
function ListPlayerRow({ player, events, isAlt }) {
  const badges = getPlayerBadges(player, events);
  const { subbedIn, subbedOut } = getSubInfo(player, events);
  const name = player.display_name || player.name || '';
  const number = player.jersey_number ?? '';

  return (
    <div style={{ display:'flex',alignItems:'center',padding:'10px 14px',borderBottom:'1px solid var(--border-subtle)',background:isAlt?'rgba(255,255,255,0.015)':'transparent',gap:8,minHeight:40 }}>
      <span style={{ fontFamily:'var(--font-mono)',fontWeight:700,fontSize:'var(--fs-sm)',color:'var(--text-primary)',width:26,textAlign:'center',flexShrink:0 }}>{number}</span>
      <span style={{ flex:1,fontWeight:500,fontSize:'var(--fs-sm)',color:'var(--text-primary)' }}>{name}</span>
      <div style={{ display:'flex',alignItems:'center',gap:5,flexShrink:0 }}>
        {badges.filter(b=>b.type==='goal').map((b,i)=>(<span key={`g${i}`} style={{ display:'flex',alignItems:'center',gap:2 }}><GoalIcon size={13}/><span style={{ fontSize:'0.55rem',color:'var(--text-tertiary)',fontFamily:'var(--font-mono)' }}>{b.minute}'</span></span>))}
        {badges.filter(b=>b.type==='own_goal').map((b,i)=>(<span key={`o${i}`} style={{ display:'flex',alignItems:'center',gap:2 }}><OwnGoalIcon size={13}/><span style={{ fontSize:'0.55rem',color:'var(--text-tertiary)',fontFamily:'var(--font-mono)' }}>{b.minute}'</span></span>))}
        {badges.filter(b=>b.type==='assist').map((b,i)=>(<span key={`a${i}`} style={{ display:'flex',alignItems:'center',gap:2 }}><AssistIcon size={13}/><span style={{ fontSize:'0.55rem',color:'var(--text-tertiary)',fontFamily:'var(--font-mono)' }}>{b.minute}'</span></span>))}
        {badges.filter(b=>b.type==='yellow').map((b,i)=>(<span key={`y${i}`} style={{ display:'flex',alignItems:'center',gap:2 }}><YellowCardIcon size={12}/><span style={{ fontSize:'0.55rem',color:'var(--text-tertiary)',fontFamily:'var(--font-mono)' }}>{b.minute}'</span></span>))}
        {badges.filter(b=>b.type==='red'||b.type==='second_yellow').map((b,i)=>(<span key={`r${i}`} style={{ display:'flex',alignItems:'center',gap:2 }}>{b.type==='second_yellow'?<SecondYellowIcon size={12}/>:<RedCardIcon size={12}/>}<span style={{ fontSize:'0.55rem',color:'var(--text-tertiary)',fontFamily:'var(--font-mono)' }}>{b.minute}'</span></span>))}
        {subbedOut && <span style={{ display:'flex',alignItems:'center',gap:2 }}><SubOutIcon size={10}/><span style={{ fontSize:'0.55rem',color:'var(--live)',fontFamily:'var(--font-mono)' }}>{subbedOut}'</span></span>}
        {subbedIn && <span style={{ display:'flex',alignItems:'center',gap:2 }}><SubInIcon size={10}/><span style={{ fontSize:'0.55rem',color:'var(--accent-primary)',fontFamily:'var(--font-mono)' }}>{subbedIn}'</span></span>}
      </div>
    </div>
  );
}

function TeamList({ label, logo, players, events }) {
  const starters = players.filter(p => p.is_starter);
  const subs = players.filter(p => !p.is_starter);
  return (
    <div style={{ background:'var(--gradient-card)',border:'1px solid var(--border-subtle)',borderRadius:'var(--radius-lg)',overflow:'hidden' }}>
      <div style={{ display:'flex',alignItems:'center',gap:10,padding:'12px 14px',borderBottom:'2px solid var(--border-default)' }}>
        {logo && <img src={logo} alt="" style={{ width:24,height:24,objectFit:'contain' }}/>}
        <h3 style={{ fontSize:'var(--fs-md)',fontWeight:900,fontFamily:'var(--font-display)',textTransform:'uppercase',letterSpacing:'-0.01em',color:'var(--text-primary)',margin:0 }}>{label} – LINE UP</h3>
      </div>
      {starters.map((p,i) => <ListPlayerRow key={p.person_id||i} player={p} events={events} isAlt={i%2===1}/>)}
      {subs.length > 0 && (<><div style={{ padding:'12px 14px 6px',borderBottom:'1px solid var(--border-subtle)' }}><h4 style={{ fontSize:'var(--fs-md)',fontWeight:900,fontFamily:'var(--font-display)',textTransform:'uppercase',color:'var(--text-primary)',margin:0 }}>SUBSTITUTES</h4></div>
      {subs.map((p,i) => <ListPlayerRow key={p.person_id||`s${i}`} player={p} events={events} isAlt={i%2===1}/>)}</>)}
      {players.length===0 && <div style={{ padding:'var(--space-xl)',textAlign:'center',color:'var(--text-tertiary)',fontSize:'var(--fs-sm)' }}>Lineup not available</div>}
    </div>
  );
}

// ═══════════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════════
export default function MatchLineup({ homePlayers = [], awayPlayers = [], match, events = [] }) {
  const hL = match?.home_logo || match?.home_team_logo, aL = match?.away_logo || match?.away_team_logo;
  const hS = match?.home_short || match?.home_team_short || match?.home_team_name || 'Home';
  const aS = match?.away_short || match?.away_team_short || match?.away_team_name || 'Away';
  const hasStarters = homePlayers.some(p => p.is_starter) || awayPlayers.some(p => p.is_starter);

  return (
    <div>
      {hasStarters && (<>
        <FormationHeader match={match}/>
        <div style={{ position:'relative',width:'100%',aspectRatio:'1050/680',borderRadius:'0 0 var(--radius-lg) var(--radius-lg)',overflow:'hidden',border:'1px solid var(--border-subtle)',borderTop:'none',marginBottom:'var(--space-xl)' }}>
          <PitchMarkings/>
          <div style={{ position:'absolute',inset:'4% 3%',display:'flex' }}>
            <HalfPitch players={homePlayers} isHome={true} events={events}/>
            <HalfPitch players={awayPlayers} isHome={false} events={events}/>
          </div>
        </div>
      </>)}
      <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'var(--space-md)' }}>
        <TeamList label={hS} logo={hL} players={homePlayers} events={events}/>
        <TeamList label={aS} logo={aL} players={awayPlayers} events={events}/>
      </div>
    </div>
  );
}