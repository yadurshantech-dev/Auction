/**
 * state.js — Single source of truth for the entire auction application.
 * All mutation goes through this module; other modules read from State.
 */

const State = (() => {
  const TEAM_PURSE_L = 9000; // 90 Crores in Lakhs

  const _teams = [
    { id: 'mm',  name: 'Mumbai Marlins',      short: 'MM', color: '#0077C8', accent: '#D4AF37', textDark: false },
    { id: 'cc',  name: 'Chennai Cheetahs',    short: 'CC', color: '#F7C948', accent: '#004B8D', textDark: true  },
    { id: 'bb',  name: 'Bangalore Blazers',   short: 'BB', color: '#C41230', accent: '#FFD700', textDark: false },
    { id: 'kk',  name: 'Kolkata Knights',     short: 'KK', color: '#3A225D', accent: '#F5A623', textDark: false },
    { id: 'rr',  name: 'Rajasthan Royals',    short: 'RR', color: '#E63B7A', accent: '#254AA5', textDark: false },
    { id: 'pp',  name: 'Punjab Panthers',     short: 'PP', color: '#ED1B24', accent: '#D5D5D5', textDark: false },
    { id: 'hh',  name: 'Hyderabad Hunters',   short: 'HH', color: '#FF6B00', accent: '#1B1B1B', textDark: false },
    { id: 'dd',  name: 'Delhi Dynamos',       short: 'DD', color: '#00AEEF', accent: '#D71920', textDark: false },
  ];

  let _state = {
    teams: [],
    queue: [],            // all players to auction (flat array)
    currentIndex: 0,      // pointer into queue
    currentBid: 0,        // current bid in Lakhs
    leadingTeamId: null,
    auctionStarted: false,
    isPaused: false,
    isFinished: false,
    soldLog: [],          // { playerName, teamId, price }
    darkMode: true,
  };

  /* ---- Initialise ---- */
  function init(queue) {
    _state.teams = _teams.map(t => ({
      ...t,
      purse: TEAM_PURSE_L,
      players: [],
    }));
    _state.queue = queue;
    _state.currentIndex = 0;
    _state.currentBid = 0;
    _state.leadingTeamId = null;
    _state.auctionStarted = false;
    _state.isPaused = false;
    _state.isFinished = false;
    _state.soldLog = [];
  }

  /* ---- Getters ---- */
  function getTeams()           { return _state.teams; }
  function getTeam(id)          { return _state.teams.find(t => t.id === id); }
  function getQueue()           { return _state.queue; }
  function getCurrentPlayer()   { return _state.queue[_state.currentIndex] || null; }
  function getCurrentIndex()    { return _state.currentIndex; }
  function getCurrentBid()      { return _state.currentBid; }
  function getLeadingTeamId()   { return _state.leadingTeamId; }
  function getLeadingTeam()     { return _state.leadingTeamId ? getTeam(_state.leadingTeamId) : null; }
  function isStarted()          { return _state.auctionStarted; }
  function isPaused()           { return _state.isPaused; }
  function isFinished()         { return _state.isFinished; }
  function getSoldLog()         { return _state.soldLog; }
  function isDarkMode()         { return _state.darkMode; }

  /* ---- Bid logic ---- */
  function getBidIncrement(bidL) {
    if (bidL < 100)  return 10;   // < 1Cr → +10L
    if (bidL < 500)  return 25;   // 1–5Cr → +25L
    return 50;                     // > 5Cr → +50L
  }

  function getNextBid() {
    const inc = getBidIncrement(_state.currentBid);
    return _state.currentBid + inc;
  }

  /**
   * Attempt a bid from team. Returns true if bid was placed.
   */
  function placeBid(teamId) {
    if (_state.isPaused || !_state.auctionStarted) return false;
    const team = getTeam(teamId);
    if (!team) return false;
    const nextBid = getNextBid();
    if (team.purse < nextBid) return false;   // insufficient funds
    _state.currentBid = nextBid;
    _state.leadingTeamId = teamId;
    return true;
  }

  /**
   * Reset bid to base price for current player.
   */
  function resetBid() {
    const player = getCurrentPlayer();
    _state.currentBid = player ? player.basePrice : 0;
    _state.leadingTeamId = null;
  }

  /**
   * Sell current player to leading team.
   */
  function sellCurrentPlayer() {
    const player = getCurrentPlayer();
    const team = getLeadingTeam();
    if (!player || !team) return null;
    team.purse -= _state.currentBid;
    team.players.push({ ...player, soldPrice: _state.currentBid });
    _state.soldLog.unshift({
      playerName: player.name,
      role: player.role,
      teamId: team.id,
      teamName: team.name,
      price: _state.currentBid,
    });
    return { player, team, price: _state.currentBid };
  }

  /**
   * Mark current player as unsold.
   */
  function markUnsold() {
    const player = getCurrentPlayer();
    if (player) {
      _state.soldLog.unshift({
        playerName: player.name,
        role: player.role,
        teamId: null,
        teamName: null,
        price: null,
      });
    }
  }

  /**
   * Advance to next player. Returns false if auction done.
   */
  function advancePlayer() {
    _state.currentIndex++;
    if (_state.currentIndex >= _state.queue.length) {
      _state.isFinished = true;
      return false;
    }
    resetBid();
    return true;
  }

  function startAuction() {
    _state.auctionStarted = true;
    resetBid();
  }

  function togglePause() {
    _state.isPaused = !_state.isPaused;
    return _state.isPaused;
  }

  function setDarkMode(val) {
    _state.darkMode = val;
    localStorage.setItem('auctionDarkMode', val ? '1' : '0');
  }

  function loadDarkMode() {
    const saved = localStorage.getItem('auctionDarkMode');
    _state.darkMode = saved === null ? true : saved === '1';
    return _state.darkMode;
  }

  return {
    init, getTeams, getTeam, getQueue, getCurrentPlayer, getCurrentIndex,
    getCurrentBid, getLeadingTeamId, getLeadingTeam, getBidIncrement,
    getNextBid, isStarted, isPaused, isFinished, getSoldLog, isDarkMode,
    placeBid, resetBid, sellCurrentPlayer, markUnsold, advancePlayer,
    startAuction, togglePause, setDarkMode, loadDarkMode,
    get totalPlayers() { return _state.queue.length; },
    get soldCount() { return _state.soldLog.length; },
  };
})();
