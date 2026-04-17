/**
 * auction.js — Core auction flow controller.
 * Orchestrates State, Timer, and UI.
 */

const Auction = (() => {

  /* ---- Sold overlay duration (ms) ---- */
  const SOLD_DISPLAY_MS   = 3000;
  const UNSOLD_DISPLAY_MS = 1800;

  let _afterSoldCallback = null;

  /* ============================
     START
  ============================ */
  function start() {
    State.startAuction();
    UI.hideStartScreen();
    UI.renderTeams();
    UI.renderBidButtons();
    _loadPlayer();
  }

  /* ============================
     LOAD CURRENT PLAYER
  ============================ */
  function _loadPlayer() {
    const player = State.getCurrentPlayer();
    if (!player) {
      _finishAuction();
      return;
    }
    State.resetBid();
    UI.renderPlayerCard(player);
    UI.renderBidButtons();
    UI.updateBidDisplay();
    UI.updateProgress();
    UI.updateNextLabel();
    Timer.start(_onTimerExpire);
  }

  /* ============================
     TIMER EXPIRE → SELL or UNSOLD
  ============================ */
  function _onTimerExpire() {
    if (State.isPaused()) return;

    const leadTeam = State.getLeadingTeam();
    if (leadTeam) {
      _processSold();
    } else {
      _processUnsold();
    }
  }

  /* ============================
     SOLD
  ============================ */
  function _processSold() {
    Timer.stop();
    const result = State.sellCurrentPlayer();
    if (!result) return;

    UI.logSold(result.player, result.team, result.price);
    UI.renderTeams();
    UI.showSoldOverlay(result.player, result.team, result.price, () => {
      _advance();
    });
  }

  /* ============================
     UNSOLD
  ============================ */
  function _processUnsold() {
    Timer.stop();
    State.markUnsold();
    const player = State.getCurrentPlayer();
    UI.logUnsold(player);
    UI.showUnsoldOverlay(player, () => {
      _advance();
    });
  }

  /* ============================
     ADVANCE TO NEXT
  ============================ */
  function _advance() {
    const hasNext = State.advancePlayer();
    if (hasNext) {
      _loadPlayer();
    } else {
      _finishAuction();
    }
  }

  /* ============================
     SKIP (UNSOLD) — manual
  ============================ */
  function skip() {
    if (!State.isStarted() || State.isPaused()) return;
    Timer.stop();
    _processUnsold();
  }

  /* ============================
     BID
  ============================ */
  function bid(teamId) {
    if (!State.isStarted() || State.isPaused()) return;
    const placed = State.placeBid(teamId);
    if (!placed) {
      UI.flashInsufficientFunds(teamId);
      return;
    }
    Timer.reset(); // reset countdown on each bid
    UI.updateBidDisplay();
    UI.renderBidButtons();
    UI.renderTeams();
    UI.logBid(State.getCurrentPlayer(), State.getTeam(teamId), State.getCurrentBid());
    UI.updateBidIncLabel();
  }

  /* ============================
     PAUSE / RESUME
  ============================ */
  function togglePause() {
    const paused = State.togglePause();
    if (paused) {
      Timer.pause();
    } else {
      Timer.resume();
    }
    UI.updatePauseButton(paused);
    return paused;
  }

  /* ============================
     RESET
  ============================ */
  function reset() {
    Timer.stop();
    const queue = PlayersData.buildQueue();
    State.init(queue);
    UI.renderTeams();
    UI.renderBidButtons();
    UI.updateBidDisplay();
    UI.clearLog();
    UI.showStartScreen();
    UI.updateProgress();
  }

  /* ============================
     FINISH
  ============================ */
  function _finishAuction() {
    Timer.stop();
    UI.showAuctionFinished();
  }

  return { start, bid, skip, togglePause, reset };
})();
