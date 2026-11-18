/* Abertura com vídeo (sem som). Aparece ao abrir o app e ao voltar para ele
   depois de um tempo fora. Termina com uma transição suave para a agenda. */
(function () {
  var intro = document.getElementById('intro');
  var video = document.getElementById('intro-video');
  var root = document.documentElement;
  if (!intro || !video) return;
  var AWAY_MS = 30000; // tempo fora do app para repetir a abertura
  var leaving = false, timer = null, hiddenAt = 0;
  var isClient = function () { return /^#\/(c|v)\//.test(location.hash); };

  function finish() {
    if (leaving) return;
    leaving = true;
    clearTimeout(timer);
    intro.classList.add('is-leaving');
    root.classList.add('intro-done');
    setTimeout(function () {
      intro.classList.add('is-gone');
      try { video.pause(); } catch (e) { /* ok */ }
    }, 800);
  }

  function play() {
    leaving = false;
    intro.classList.remove('is-gone', 'is-leaving');
    root.classList.remove('intro-done');
    try { video.currentTime = 0; } catch (e) { /* ok */ }
    clearTimeout(timer);
    timer = setTimeout(finish, 4500); // segurança: nunca prende a pessoa na abertura
    var p = video.play();
    if (p && p.catch) {
      p.catch(function () {
        // Modo Pouca Energia do iPhone bloqueia vídeo automático: mostra a imagem e segue
        clearTimeout(timer);
        timer = setTimeout(finish, 1100);
      });
    }
  }

  // começa a transição um pouco antes do fim, para emendar sem "pulo"
  video.addEventListener('timeupdate', function () {
    if (video.duration && video.currentTime >= video.duration - 0.35) finish();
  });
  video.addEventListener('ended', finish);
  video.addEventListener('error', function () { setTimeout(finish, 600); });
  intro.addEventListener('click', finish); // toque para pular

  if (isClient()) {
    intro.classList.add('is-gone');
    root.classList.add('intro-done');
  } else {
    play();
  }

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      hiddenAt = Date.now();
    } else if (hiddenAt && Date.now() - hiddenAt > AWAY_MS && !isClient()) {
      play();
    }
  });
  window.PautaIntro = { play: play, finish: finish };
})();
