import '../../node_modules/siberian/runtime'; // for testing
import { siberian } from '../../node_modules/siberian/siberian'; // for testing
import '../styles/main.scss';

const sliderOptions = {
	selector: '.siberian',
    selectorWrapper: '.siberian-content',
	breakpoint: 'max-width(480px)',
	amountOfItens: 1,
	hasArrows: true,
	hasDots: true,
}

siberian(sliderOptions);
