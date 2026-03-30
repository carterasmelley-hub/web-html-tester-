# Arcade Test Site

This is a local arcade-style launcher that works by opening `index.html` directly on your computer or by publishing the folder to GitHub Pages.

## What it does

- Shows your games in a grid on the home screen
- Opens a separate play screen with a boxed game window
- Lets you test fullscreen from that play screen
- Includes a full-view fallback that is better for phones and browsers with limited fullscreen support
- Keeps everything local, with no web hosting required

## GitHub Pages

This folder is safe to publish on GitHub Pages:

1. Put the contents of this folder in your repository.
2. In GitHub, enable Pages and point it at the branch and folder that contains these files.
3. Visit the published URL and test both the boxed player and the full-view button on your phone.

Notes:

- The site uses relative paths, so it works from a GitHub Pages repo subfolder.
- The `.nojekyll` file is included so GitHub Pages serves the site as-is.
- On phones, the `Open full view` or `Play full view` button is usually the most reliable option for touch controls.

## How to add another game

1. Create a folder inside `games/` for the game.
2. Put the game's main HTML file in that folder.
3. Add a new object to `games/catalog.js`.

Example catalog entry:

```js
{
  id: "my-game",
  title: "My Game",
  genre: "Arcade",
  players: "1 Player",
  description: "Short description here.",
  file: "games/my-game/index.html",
  accent: "linear-gradient(135deg, rgba(255, 80, 80, 0.35), rgba(255, 210, 90, 0.25))",
  controls: [
    "Arrow keys to move.",
    "Space to jump."
  ]
}
```

## Important note

Because this is opened locally as a file, the browser cannot automatically scan the `games/` folder. That is why the list of games lives in `games/catalog.js`.
