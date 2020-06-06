# Overview

`css2elusien.js` automates the process of generating Javascript settings for the [Elusien's WebVfx polyfill](http://elusien.co.uk/shotcut/animations/index.html) from CSS3 animation declarations.

## Usage

Add [css2elusien.js](https://github.com/mihaylovin/shotcut-animations/raw/master/css2elusien.js), [elusien_cssanims2js.js](http://elusien.co.uk/shotcut/animations/elusien_cssanims2js.js) and [jQuery](http://elusien.co.uk/shotcut/jquery.min.js) to the HTML page with the CSS animation. 

```
<script src="./css2elusien.js"></script>
<script src="./jquery.min.js"></script>
<script src="./elusien_cssanims2js.js"></script>
```

Add `--framerate` as a CSS property to `body`. The framerate should match the framerate in Shotcut, otherwise the animation will run in a different speed when imported into Shotcut.

```
body {
  --framerate: 25;
}
```

With your HTML page containing the CSS3 animation open in you browser append the hash `#generate` (e.g. `http://localhost/intro/index.html#generate`) to the address in the browser's address bar and you will be prompted to download a generated HTML file. Save the file in the same folder as the original HTML file with the CSS3 animation. 

Import the generated file into Shotcut using the `Text: HTML` filter and make sure to check the "Use Webvfx JavaScript extension" option.

## Benefits

While reducing the steps required to import CSS3 animations into Shotcut the tool also negates one of the limitations of Elusien's polyfill, namely the explicit order of animation parameter declaration. Animation declaration may be used in any valid way and the tool takes care of the rest.
