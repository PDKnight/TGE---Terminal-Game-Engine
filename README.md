# WCE - Web Console Engine
`v2.0`

## What is it?
It's an engine for creating fully customizable terminals in browser.

![WCE environment](http://image.prntscr.com/image/da708e9a08a7423e979d5c7b11b45f17.png)

### [Live example](http://pdknight.github.io/WCE/src/example)

## Installation
1. Download zipped (.zip) version of repository
2. If you want to run `game/index.html` file, put it somewhere on your server (It has to be on server due to maps, which are written in PHP because of protection); if you want to run `example/index.html` file, it doesn't matter.
3. Change your configuration files
4. Run `example/index.html`
5. That's it! :)

---

This engine is also designed for making terminal-based games. All you need to make a game is in `game` folder. You have to do following:

1. Make your own map in `game/assets/maps/your_map_name.php` (tutorial on wiki)
2. Modify map path in `game/assets/maps/mapper.php` at the start of file to load your custom map.

---

### [How to import and init WCE](https://github.com/PDKnight/WCE-Web-Console-Engine/wiki#how-to-import-and-init-wce)

### Find more at [WCE wiki](../../wiki)
