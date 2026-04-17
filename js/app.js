/**
 * app.js — Application entry point.
 * Initialises State, wires events, and bootstraps UI.
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Build player queue & initialise state ---- */
  const queue = PlayersData.buildQueue();
  State.init(queue);

  /* ---- Dark / Light mode ---- */
  const darkMode = State.loadDarkMode();
  applyTheme(darkMode);

  /* ---- Timer ring init ---- */
  Timer.initRing();

  /* ---- Show start screen ---- */
  UI.showStartScreen();
  UI.renderTeams();
  UI.renderBidButtons();
  UI.updateProgress();
  UI.updateNextLabel();

  /* ============================
     EVENT LISTENERS
  ============================ */

  /* Start Auction */
  document.getElementById('btnStart').addEventListener('click', () => {
    Auction.start();
  });

  /* Pause / Resume */
  document.getElementById('btnPause').addEventListener('click', () => {
    if (!State.isStarted()) return;
    Auction.togglePause();
  });

  /* Dark Mode Toggle */
  document.getElementById('btnDarkMode').addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const newDark = !isDark;
    State.setDarkMode(newDark);
    applyTheme(newDark);
  });

  /* Reset Auction */
  document.getElementById('btnReset').addEventListener('click', () => {
    if (confirm('Reset the entire auction? All progress will be lost.')) {
      Auction.reset();
    }
  });

  /* Skip Player */
  document.getElementById('btnSkip').addEventListener('click', () => {
    if (!State.isStarted()) return;
    Auction.skip();
  });

  /* Clear Log */
  document.getElementById('btnClearLog').addEventListener('click', () => {
    UI.clearLog();
  });

  /* Team Modal Close */
  document.getElementById('modalClose').addEventListener('click', () => {
    UI.hideTeamModal();
  });
  document.getElementById('teamModal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('teamModal')) UI.hideTeamModal();
  });

  /* Keyboard shortcuts */
  document.addEventListener('keydown', (e) => {
    if (!State.isStarted()) return;
    if (e.code === 'Space') { e.preventDefault(); Auction.togglePause(); }
    if (e.code === 'KeyS')  { Auction.skip(); }
  });

  /* ============================
     THEME HELPER
  ============================ */
  function applyTheme(isDark) {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    document.getElementById('btnDarkMode').textContent = isDark ? '☀️' : '🌙';
  }

});
