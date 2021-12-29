const siberian = require('siberian');

const sliderOptions = {
	selector: '.siberian',
    selectorWrapper: '.siberian-content',
	breakpoint: 'max-width(480px)',
	amountOfItens: 1,
	hasArrows: true,
	hasDots: true
}

siberian(sliderOptions);
