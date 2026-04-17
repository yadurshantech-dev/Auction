/**
 * ui.js — All DOM manipulation, rendering, and visual effects.
 */

const UI = (() => {

  /* ---- helpers ---- */
  const $ = id => document.getElementById(id);
  const fmtL = lakhs => {
    if (lakhs >= 100) return `₹${(lakhs / 100).toFixed(2)} Cr`;
    return `₹${lakhs}L`;
  };
  const fmtLShort = lakhs => {
    if (lakhs >= 100) return `₹${(lakhs / 100).toFixed(2)}Cr`;
    return `₹${lakhs}L`;
  };

  /* ====================
     START SCREEN
  ==================== */
  function showStartScreen() {
    $('startScreen').classList.remove('hidden');
    $('startScreen').classList.add('visible');
  }
  function hideStartScreen() {
    $('startScreen').classList.add('hidden');
    $('startScreen').classList.remove('visible');
  }

  /* ====================
     PLAYER CARD
  ==================== */
  function renderPlayerCard(player) {
    if (!player) return;

    $('playerName').textContent    = player.name;
    $('playerRole').textContent    = player.role;
    $('playerBasePrice').textContent = fmtL(player.basePrice);
    $('playerCategory').textContent  = player.role.toUpperCase();

    // Tier badge colour
    const cat = $('playerCategory');
    cat.className = 'player-category-badge tier-' + player.tier.toLowerCase();

    // Image with fallback
    const img = $('playerImage');
    img.src = PlayersData.getImageUrl(player);
    img.onerror = () => { img.src = 'images/ui/default.jpg'; };

    // Animate in
    const card = $('playerCard');
    card.classList.remove('card-enter');
    void card.offsetWidth; // reflow
    card.classList.add('card-enter');
  }

  /* ====================
     BID DISPLAY
  ==================== */
  function updateBidDisplay() {
    const bid    = State.getCurrentBid();
    const leader = State.getLeadingTeam();

    $('currentBid').textContent   = fmtL(bid);
    $('leadingTeam').textContent  = leader ? leader.short : '---';
    if (leader) {
      $('leadingTeam').style.color = leader.color;
    } else {
      $('leadingTeam').style.color = '';
    }

    // Pulse animation
    const el = $('currentBid');
    el.classList.remove('bid-pulse');
    void el.offsetWidth;
    el.classList.add('bid-pulse');
  }

  /* ====================
     BID INC LABEL
  ==================== */
  function updateBidIncLabel() {
    const inc = State.getBidIncrement(State.getCurrentBid());
    $('bidIncLabel').textContent = `+${inc}L per click`;
  }

  /* ====================
     TEAMS PANEL
  ==================== */
  function renderTeams() {
    const teams = State.getTeams();
    const list  = $('teamsList');
    list.innerHTML = '';
    teams.forEach(team => {
      const remaining = team.players.length;
      const item = document.createElement('div');
      item.className = 'team-item' + (State.getLeadingTeamId() === team.id ? ' team-leading' : '');
      item.style.setProperty('--team-color', team.color);
      item.style.setProperty('--team-accent', team.accent);
      item.innerHTML = `
        <div class="team-badge" style="background:${team.color};color:${team.textDark?'#111':'#fff'}">${team.short}</div>
        <div class="team-meta">
          <span class="team-name">${team.name}</span>
          <div class="team-stats">
            <span class="team-purse">${fmtLShort(team.purse)}</span>
            <span class="team-players">${remaining} 🏏</span>
          </div>
        </div>
        <div class="team-purse-bar-wrap">
          <div class="team-purse-bar" style="width:${(team.purse/9000)*100}%;background:${team.color}"></div>
        </div>
      `;
      item.addEventListener('click', () => showTeamModal(team.id));
      list.appendChild(item);
    });
  }

  /* ====================
     BID BUTTONS
  ==================== */
  function renderBidButtons() {
    const teams   = State.getTeams();
    const grid    = $('bidButtonsGrid');
    const current = State.getCurrentBid();
    const nextBid = State.getNextBid();

    grid.innerHTML = '';
    teams.forEach(team => {
      const canBid  = team.purse >= nextBid;
      const leading = State.getLeadingTeamId() === team.id;
      const btn     = document.createElement('button');
      btn.className = `bid-btn${leading ? ' bid-btn-leading' : ''}${!canBid ? ' bid-btn-disabled' : ''}`;
      btn.style.setProperty('--team-color', team.color);
      btn.disabled  = !canBid;
      btn.innerHTML = `
        <span class="bid-btn-short">${team.short}</span>
        <span class="bid-btn-name">${team.name}</span>
        <span class="bid-btn-purse">${fmtLShort(team.purse)}</span>
        ${leading ? '<span class="bid-btn-crown">👑</span>' : ''}
      `;
      btn.addEventListener('click', () => Auction.bid(team.id));
      grid.appendChild(btn);
    });
  }

  /* ====================
     FLASH INSUFFICIENT
  ==================== */
  function flashInsufficientFunds(teamId) {
    const grid = $('bidButtonsGrid');
    const btns = grid.querySelectorAll('.bid-btn');
    const teams = State.getTeams();
    btns.forEach((btn, i) => {
      if (teams[i] && teams[i].id === teamId) {
        btn.classList.add('flash-insufficient');
        setTimeout(() => btn.classList.remove('flash-insufficient'), 600);
      }
    });
  }

  /* ====================
     PROGRESS
  ==================== */
  function updateProgress() {
    const total    = State.totalPlayers;
    const current  = State.getCurrentIndex();
    $('progressCount').textContent = `${current} / ${total}`;
  }

  /* ====================
     NEXT PLAYER LABEL
  ==================== */
  function updateNextLabel() {
    const queue = State.getQueue();
    const next  = queue[State.getCurrentIndex() + 1];
    $('nextLabel').textContent = next ? `NEXT: ${next.name}` : 'NEXT: —';
  }

  /* ====================
     PAUSE BUTTON
  ==================== */
  function updatePauseButton(isPaused) {
    $('pauseIcon').textContent = isPaused ? '▶' : '⏸';
    $('btnPause').title = isPaused ? 'Resume Auction' : 'Pause Auction';
    $('btnPause').classList.toggle('btn-paused', isPaused);
  }

  /* ====================
     AUCTION LOG
  ==================== */
  function logBid(player, team, priceL) {
    if (!player || !team) return;
    addLogEntry(
      `<span style="color:${team.color}">${team.short}</span> bid <strong>${fmtL(priceL)}</strong> for ${player.name}`,
      'log-bid'
    );
  }

  function logSold(player, team, priceL) {
    addLogEntry(
      `🔨 SOLD: <strong>${player.name}</strong> → <span style="color:${team.color}">${team.name}</span> @ <strong>${fmtL(priceL)}</strong>`,
      'log-sold'
    );
  }

  function logUnsold(player) {
    if (!player) return;
    addLogEntry(`❌ UNSOLD: <strong>${player.name}</strong>`, 'log-unsold');
  }

  function addLogEntry(html, cls = '') {
    const log  = $('auctionLog');
    const item = document.createElement('li');
    item.className = `log-entry ${cls}`;
    item.innerHTML = html;
    log.insertBefore(item, log.firstChild);
    // Keep max 80 entries
    while (log.children.length > 80) log.removeChild(log.lastChild);
  }

  function clearLog() {
    $('auctionLog').innerHTML = '<li class="log-entry log-info">Auction ready. Press BID to start!</li>';
  }

  /* ====================
     SOLD OVERLAY
  ==================== */
  function showSoldOverlay(player, team, priceL, callback) {
    const overlay = $('soldOverlay');
    $('soldPlayerName').textContent = player.name;
    $('soldTeam').textContent       = team.name;
    $('soldTeam').style.color       = team.color;
    $('soldPrice').textContent      = fmtL(priceL);

    _spawnFireworks();

    overlay.classList.add('visible');
    setTimeout(() => {
      overlay.classList.remove('visible');
      _clearFireworks();
      if (typeof callback === 'function') callback();
    }, 3000);
  }

  function _spawnFireworks() {
    const container = $('soldFireworks');
    container.innerHTML = '';
    const COLORS = ['#FFD700','#FF6B00','#FF3B3B','#4ADE80','#60A5FA','#F472B6','#A78BFA','#FFFFFF'];
    for (let i = 0; i < 70; i++) {
      const p = document.createElement('div');
      p.className = 'firework-particle';
      const angleDeg = Math.random() * 360;
      const angleRad = angleDeg * Math.PI / 180;
      const dist     = 80 + Math.random() * 240;
      const size     = 5 + Math.random() * 10;
      const delay    = Math.random() * 0.5;
      const dur      = 0.9 + Math.random() * 0.6;
      const color    = COLORS[Math.floor(Math.random() * COLORS.length)];
      const tx       = Math.cos(angleRad) * dist;
      const ty       = Math.sin(angleRad) * dist;
      const isRound  = Math.random() > 0.4;

      p.style.cssText = `
        width:${size}px; height:${size}px;
        background:${color};
        animation: fw_burst ${dur}s ease-out ${delay}s forwards;
        border-radius:${isRound ? '50%' : '2px'};
        --tx:${tx}px; --ty:${ty}px;
        box-shadow: 0 0 ${size}px ${color};
      `;
      container.appendChild(p);
    }

    // Inject keyframes dynamically if not already there
    if (!document.getElementById('fw-keyframes')) {
      const style = document.createElement('style');
      style.id = 'fw-keyframes';
      style.textContent = `
        @keyframes fw_burst {
          0%   { transform: translate(0,0) scale(1); opacity: 1; }
          70%  { opacity: 0.8; }
          100% { transform: translate(var(--tx), var(--ty)) scale(0.2); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }
  }

  function _clearFireworks() {
    $('soldFireworks').innerHTML = '';
  }

  /* ====================
     UNSOLD OVERLAY
  ==================== */
  function showUnsoldOverlay(player, callback) {
    const overlay = $('unsoldOverlay');
    $('unsoldPlayerName').textContent = player ? player.name : '---';
    overlay.classList.add('visible');
    setTimeout(() => {
      overlay.classList.remove('visible');
      if (typeof callback === 'function') callback();
    }, 1800);
  }

  /* ====================
     AUCTION FINISHED
  ==================== */
  function showAuctionFinished() {
    const log = $('auctionLog');
    const item = document.createElement('li');
    item.className = 'log-entry log-info log-finish';
    item.innerHTML = '🏆 <strong>AUCTION COMPLETE!</strong> All players have been auctioned.';
    log.insertBefore(item, log.firstChild);

    $('playerName').textContent = 'AUCTION COMPLETE';
    $('playerRole').textContent = '🏆 All done!';
    Timer.stop();
  }

  /* ====================
     TEAM MODAL
  ==================== */
  function showTeamModal(teamId) {
    const team  = State.getTeam(teamId);
    if (!team) return;
    $('modalTeamName').textContent  = team.name;
    $('modalTeamName').style.color  = team.color;
    $('modalTeamPurse').textContent = `Remaining Purse: ${fmtL(team.purse)}`;
    const list = $('modalPlayerList');
    list.innerHTML = '';
    if (team.players.length === 0) {
      list.innerHTML = '<li class="modal-empty">No players yet</li>';
    } else {
      team.players.forEach(p => {
        const li = document.createElement('li');
        li.className = 'modal-player-item';
        li.innerHTML = `<span class="mp-role mp-${p.role.toLowerCase().replace(/[^a-z]/g,'')}">${p.role[0]}</span><span class="mp-name">${p.name}</span><span class="mp-price">${fmtL(p.soldPrice)}</span>`;
        list.appendChild(li);
      });
    }
    $('teamModal').classList.add('visible');
  }

  function hideTeamModal() {
    $('teamModal').classList.remove('visible');
  }

  return {
    showStartScreen, hideStartScreen,
    renderPlayerCard, updateBidDisplay, updateBidIncLabel,
    renderTeams, renderBidButtons, flashInsufficientFunds,
    updateProgress, updateNextLabel, updatePauseButton,
    logBid, logSold, logUnsold, clearLog,
    showSoldOverlay, showUnsoldOverlay, showAuctionFinished,
    showTeamModal, hideTeamModal,
  };
})();
