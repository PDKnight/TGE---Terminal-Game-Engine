# TGE - Terminal Game Engine

## What is it?
It's an engine for creating terminal-based games in web browsers.

## Instalation
1. Download zipped (.zip) version of repository
2. Put it somewhere on your server (It has to be on server due to maps, which are written in PHP because of protection)
3. Change your `assets/config.js` file
4. Change your `assets/maps/your_map_name.php`
5. Change your `assets/maps/mapper.php` filename at the start of file to load the map you want.
6. Run index.html
7. That's it! :)

---
## Configuration

### `assets/config.js`
```javascript
var Config = {
	welcome: '&aTGE environment [v%version%].\n&rType "?" or "help" for help.',
	game: {
		name: 'TGE game',
		textColor: '#C0C0C0',
		bgColor: 'black',
		terminal: '> ',
		scrollable: false
	},
	map: 'assets/maps/mapper.php'
};
```
* **welcome**: welcome message that appears at the start of the web.
* **game**:
  * **name**: name of your game. It will appear as a title of website.
  * **textColor**: color of text (supported formats are HEX, RGB, RGBA, HSL or just plain text).
  * **bgColor**: color of background.
  * **terminal**: look of command line. For example if you are in main directory, by default you see `C:/>` in command line.
  * **scrollable**: true/false. If set to true, the scrollbar at the right size of website will be shown.
* **map**: File path of `mapper.php` file.
