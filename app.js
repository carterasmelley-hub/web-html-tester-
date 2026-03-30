(function () {
  const games = Array.isArray(window.ARCADE_GAMES) ? window.ARCADE_GAMES : [];
  const grid = document.getElementById("game-grid");
  const count = document.getElementById("game-count");

  if (!grid || !count) {
    return;
  }

  if (!games.length) {
    count.textContent = "0 games";
    grid.innerHTML = [
      '<section class="empty-state">',
      "<h3>No games yet</h3>",
      "<p>Add a game folder in <code>games/</code> and list it inside <code>games/catalog.js</code>.</p>",
      "</section>"
    ].join("");
    return;
  }

  count.textContent = games.length === 1 ? "1 game ready" : `${games.length} games ready`;

  grid.innerHTML = games
    .map((game) => {
      const accent = game.accent || "";
      const title = escapeHtml(game.title || "Untitled Game");
      const description = escapeHtml(game.description || "No description yet.");
      const genre = escapeHtml(game.genre || "Arcade");
      const players = escapeHtml(game.players || "1 Player");
      const href = `play.html?game=${encodeURIComponent(game.id || "")}`;

      return [
        `<article class="game-card">`,
        `  <div class="game-card-banner" style="background:${accent};"></div>`,
        `  <h3>${title}</h3>`,
        `  <p class="game-description">${description}</p>`,
        `  <div class="game-meta">`,
        `    <span class="meta-pill">${genre}</span>`,
        `    <span class="meta-pill">${players}</span>`,
        `  </div>`,
        `  <div class="card-footer">`,
        `    <span class="section-note">Local HTML launch</span>`,
        `    <a class="launch-link" href="${href}">Play Now</a>`,
        `  </div>`,
        `</article>`
      ].join("");
    })
    .join("");

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
