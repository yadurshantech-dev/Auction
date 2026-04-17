/**
 * timer.js — SVG countdown timer with stroke-dashoffset animation.
 * Calls onExpire when the countdown hits zero.
 */

const Timer = (() => {
  const DURATION = 6;
  const CIRCUMFERENCE = 2 * Math.PI * 52; // r=52

  let _interval = null;
  let _secondsLeft = DURATION;
  let _onExpire = null;
  let _isPaused = false;

  const _elSeconds  = () => document.getElementById('timerSeconds');
  const _elRing     = () => document.getElementById('timerRingFill');
  const _elWrap     = () => document.getElementById('timerWrap');

  function _render() {
    const el = _elSeconds();
    const ring = _elRing();
    const wrap = _elWrap();
    if (!el || !ring) return;

    el.textContent = _secondsLeft;

    // Stroke progress (full = 0, empty = circumference)
    const progress = _secondsLeft / DURATION;
    const offset = CIRCUMFERENCE * (1 - progress);
    ring.style.strokeDashoffset = offset;

    // Colour shift: green → orange → red
    if (progress > 0.5) {
      ring.style.stroke = '#4ADE80';
      el.style.color = '#4ADE80';
      wrap.classList.remove('timer-urgent', 'timer-critical');
    } else if (progress > 0.25) {
      ring.style.stroke = '#FF9900';
      el.style.color = '#FF9900';
      wrap.classList.remove('timer-critical');
      wrap.classList.add('timer-urgent');
    } else {
      ring.style.stroke = '#FF3B3B';
      el.style.color = '#FF3B3B';
      wrap.classList.add('timer-urgent', 'timer-critical');
    }
  }

  function start(onExpire) {
    stop();
    _secondsLeft = DURATION;
    _onExpire = onExpire;
    _isPaused = false;
    _render();
    _interval = setInterval(_tick, 1000);
  }

  function _tick() {
    if (_isPaused) return;
    _secondsLeft--;
    _render();
    if (_secondsLeft <= 0) {
      stop();
      if (typeof _onExpire === 'function') _onExpire();
    }
  }

  function reset() {
    stop();
    _secondsLeft = DURATION;
    _isPaused = false;
    _render();
    if (_onExpire) {
      _interval = setInterval(_tick, 1000);
    }
  }

  function stop() {
    clearInterval(_interval);
    _interval = null;
  }

  function pause() { _isPaused = true; }

  function resume() {
    if (_interval === null && _secondsLeft > 0 && _onExpire) {
      _interval = setInterval(_tick, 1000);
    }
    _isPaused = false;
  }

  function getSecondsLeft() { return _secondsLeft; }

  // Set ring dash on init
  function initRing() {
    const ring = _elRing();
    if (!ring) return;
    ring.style.strokeDasharray  = CIRCUMFERENCE;
    ring.style.strokeDashoffset = 0;
    ring.style.stroke = '#4ADE80';
  }

  return { start, stop, reset, pause, resume, getSecondsLeft, initRing };
})();
