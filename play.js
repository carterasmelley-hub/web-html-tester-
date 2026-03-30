(function () {
  const games = Array.isArray(window.ARCADE_GAMES) ? window.ARCADE_GAMES : [];
  const params = new URLSearchParams(window.location.search);
  const selectedId = params.get("game");
  const selectedGame = games.find((game) => game.id === selectedId) || games[0];

  const title = document.getElementById("player-title");
  const stageHeading = document.getElementById("stage-heading");
  const frameStatus = document.getElementById("frame-status");
  const sidebarTitle = document.getElementById("sidebar-title");
  const sidebarDescription = document.getElementById("sidebar-description");
  const metaGenre = document.getElementById("meta-genre");
  const metaPlayers = document.getElementById("meta-players");
  const controlsList = document.getElementById("controls-list");
  const tipsList = document.getElementById("tips-list");
  const moreGames = document.getElementById("more-games");
  const openFullView = document.getElementById("open-full-view");
  const openDirect = document.getElementById("open-direct");
  const fullscreenButton = document.getElementById("fullscreen-button");
  const playerShell = document.getElementById("player-shell");
  const focusBanner = document.getElementById("focus-banner");
  const frame = document.getElementById("game-frame");
  const isTouchDevice =
    navigator.maxTouchPoints > 0 ||
    window.matchMedia("(pointer: coarse)").matches ||
    window.matchMedia("(hover: none)").matches;
  const supportsFullscreen =
    Boolean(document.fullscreenEnabled) &&
    typeof playerShell.requestFullscreen === "function";
  let frameLoaded = false;

  if (!selectedGame) {
    if (title) title.textContent = "No game found";
    if (stageHeading) stageHeading.textContent = "Catalog is empty";
    if (frameStatus) frameStatus.textContent = "Add a game to games/catalog.js";
    if (sidebarTitle) sidebarTitle.textContent = "Nothing to load";
    if (sidebarDescription) {
      sidebarDescription.textContent = "This player needs at least one entry inside games/catalog.js.";
    }
    if (controlsList) {
      controlsList.innerHTML = "<li>Add a game folder in games/ and point to its HTML file.</li>";
    }
    if (frame) {
      frame.remove();
    }
    return;
  }

  const gameUrl = new URL(selectedGame.file, window.location.href).href;
  document.title = `${selectedGame.title} | Arcade Player`;

  title.textContent = selectedGame.title;
  stageHeading.textContent = `${selectedGame.title} preview`;
  frameStatus.textContent = isTouchDevice ? "Phone preview ready" : "Boxed mode ready";
  sidebarTitle.textContent = selectedGame.title;
  sidebarDescription.textContent = selectedGame.description || "";
  metaGenre.textContent = selectedGame.genre || "-";
  metaPlayers.textContent = selectedGame.players || "-";
  openFullView.href = gameUrl;
  openFullView.setAttribute("aria-label", `Open ${selectedGame.title} in full view`);
  openDirect.href = gameUrl;
  openDirect.setAttribute("aria-label", `Open ${selectedGame.title} in a new tab`);

  if (isTouchDevice) {
    openFullView.textContent = "Play full view";
    openDirect.textContent = "Open new tab";
  }

  if (!supportsFullscreen) {
    fullscreenButton.disabled = true;
    fullscreenButton.textContent = "Fullscreen unavailable";
    fullscreenButton.title = "This browser does not allow fullscreen from the player shell.";
  }

  controlsList.innerHTML = (selectedGame.controls || [])
    .map((control) => `<li>${escapeHtml(control)}</li>`)
    .join("");

  if (!controlsList.innerHTML) {
    controlsList.innerHTML = "<li>No controls listed yet for this game.</li>";
  }

  moreGames.innerHTML = games
    .filter((game) => game.id !== selectedGame.id)
    .map((game) => {
      const href = `play.html?game=${encodeURIComponent(game.id)}`;
      return `<a class="mini-link" href="${href}"><span>${escapeHtml(game.title)}</span><span>Open</span></a>`;
    })
    .join("");

  if (!moreGames.innerHTML) {
    moreGames.innerHTML = "<p class='section-note'>Add more games to see them here.</p>";
  }

  if (tipsList) {
    const tips = [
      "Use the boxed preview first to see how the game feels inside a portal layout.",
      supportsFullscreen
        ? "Use fullscreen to check scaling, safe areas, and focus behavior."
        : "If fullscreen is unavailable in this browser, use full view for the closest real play test.",
      isTouchDevice
        ? "On phones and tablets, the full-view button is the safest option for touch controls and iPhone behavior."
        : "If a game ever resists the iframe, use the full-view or direct-open button as a fallback."
    ];

    tipsList.innerHTML = tips.map((tip) => `<li>${escapeHtml(tip)}</li>`).join("");
  }

  frame.src = gameUrl;
  frame.addEventListener("load", function () {
    frameLoaded = true;
    frameStatus.textContent = isTouchDevice ? "Embedded preview loaded" : "Game loaded in box";
    focusGame();
  });

  frame.addEventListener("mouseenter", focusGame);
  playerShell.addEventListener("click", focusGame);

  fullscreenButton.addEventListener("click", async function () {
    if (!supportsFullscreen) {
      return;
    }

    try {
      if (document.fullscreenElement === playerShell) {
        await document.exitFullscreen();
      } else {
        await playerShell.requestFullscreen();
      }
      focusGame();
    } catch (error) {
      frameStatus.textContent = "Fullscreen blocked by browser";
      console.error(error);
    }
  });

  document.addEventListener("fullscreenchange", function () {
    const isFullscreen = document.fullscreenElement === playerShell;
    fullscreenButton.textContent = isFullscreen ? "Exit Fullscreen" : "Fullscreen";
    frameStatus.textContent = isFullscreen
      ? "Fullscreen active"
      : frameLoaded
        ? isTouchDevice
          ? "Embedded preview loaded"
          : "Game loaded in box"
        : isTouchDevice
          ? "Phone preview ready"
          : "Boxed mode ready";
  });

  function focusGame() {
    if (focusBanner) {
      focusBanner.textContent = isTouchDevice
        ? "Phone tip: try the embedded preview first, but use full view if touch input or fullscreen feels off."
        : "Controls should be active. Click again inside the game if it ever loses focus.";
    }

    try {
      frame.focus();
      if (frame.contentWindow) {
        frame.contentWindow.focus();
      }
    } catch (error) {
      console.error(error);
    }
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
      return (
        {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;"
        }[char] || char
      );
    });
  }
})();
