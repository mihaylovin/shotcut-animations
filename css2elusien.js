window.onload = _ => {
	
	let download = (filename, content) => {
	  let element = document.createElement('a');
	  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
	  element.setAttribute('download', filename);

	  element.style.display = 'none';
	  document.body.appendChild(element);

	  element.click();

	  document.body.removeChild(element);
	}
	
	let generateSettingsScriptTag = (settings) => {
		let script = "<script>";
		
		Object.keys(settings).forEach((s) => {
			script += "window." + s + "=" + JSON.stringify(settings[s]) + ";";
		});
		
		script += "</script>";
		
		return script;
	}
	
	let parseKeyframesOffset = (offset) => {
		switch(offset) {
			case 'from': return 0;
			case 'to': return 1;
			default: return parseFloat(offset.replace("%", ""))/100;
		}
	}
	
	let parseAnimation = (cssText) => {
		let pattern = new RegExp('(to|from|[0-9.]*%)\\s*{\\s*([a-zA-Z0-9:\\s\\-;%(),.]*)}', 'gm');
		//TODO explicitily add from and to if missing
		return [...cssText.matchAll(pattern)].map((matches) => {
			let offset = parseKeyframesOffset(matches[1]);
			let kf = {offset};
			
			matches[2].split(";").forEach((line) => {
				if (line.indexOf(":") != -1) {
					line = line.split(":");
					kf[line[0].trim()] = line[1].trim();
				}
			});
			
			return kf;
		})
	}
	
	let sec2ms = (s) => {
		return parseFloat(s.replace("s", ""))*1000;
	}
	
	let parseIterations = (i) => {
		return (i == "infinite") ? Infinity : parseInt(i);
	}
	
	let transformToArray = (obj) => {
		let arr = [];
		
		Object.keys(obj).forEach((p) => {
			obj[p].forEach((e, i) => {
			arr[i] = {...arr[i], [p]: obj[p][i]};
		  });
		});
		
		return arr;
	}
	
	let generate = (framerate) => {
		framerate = framerate || parseInt(getComputedStyle(document.querySelector("body")).getPropertyValue("--framerate"));
		
		let settings = {
			elusien_keyframes: {},
			elusien_animate: [],
			elusien_framerate: framerate || 25,
		}
	
		for (let i = 0; i < document.styleSheets.length; i++) {
			let stylesheet = document.styleSheets[i];
			for(let j = 0; j < stylesheet.cssRules.length; j++) {
				let cssRule = stylesheet.cssRules[j];
				if (cssRule.toString().indexOf("CSSKeyframesRule") != -1) {
					settings.elusien_keyframes[cssRule.name] = parseAnimation(cssRule.cssText);
				} else if (cssRule.toString().indexOf("CSSStyleRule") != -1) {
					if (cssRule.style.animationName) {
						let timings = transformToArray({
							duration: cssRule.style.animationDuration.split(",").map(e => sec2ms(e.trim())),
							easing: cssRule.style.animationTimingFunction.split(",").map(e => e.trim()),
							delay: cssRule.style.animationDelay.split(",").map(e => sec2ms(e.trim())),
							iterations: cssRule.style.animationIterationCount.split(",").map(e => parseIterations(e.trim())),
							direction: cssRule.style.animationDirection.split(",").map(e => e.trim()),
						});
						
						settings.elusien_animate.push({
							elements: cssRule.selectorText,
							animations: timings.map((t, ti) => {
								return {
									keyname: cssRule.style.animationName.split(",")[ti].trim(),
									timings: {...t}
								}	
							})
						});
					}
				}
			}
		}
		
		console.log(settings);
		let documentHTML = document.documentElement.outerHTML.split("</body>");
		documentHTML.splice(1, 0, generateSettingsScriptTag(settings) + "</body>");
		documentHTML = documentHTML.join("");
		
		download("generated_animation.html", documentHTML);
	}
	
	let onGenerate = () => {
		if (location.hash == "#generate") generate();
	}
	
	window.onhashchange = onGenerate;
	
	onGenerate();
	
};

