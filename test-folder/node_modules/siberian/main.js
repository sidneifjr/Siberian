// Siberian.
const customSlider = sliderOptions => {
	let slider = document.querySelector(sliderOptions.selector);
	let sliderWrapper = slider.querySelector('.siberian-content');
	let slides = sliderWrapper.querySelectorAll('.siberian-content-item');
	let sliderLength = slides.length; // quantidade de itens no slider.
	let sliderWidth = slider.getBoundingClientRect().width; // reflete a largura de tela ocupada no momento.
	let counter = 0;

	let numberOfItens = sliderOptions.amountOfItens || 1;
	let mobileSize = window.matchMedia(sliderOptions.breakpoint);

	// Pega todos os siblings do elemento desejado.
	const getSiblings = elem => {
		let siblings = [];
		let sibling = elem.parentNode.firstChild;

		while (sibling){
			if (sibling.nodeType === 1 && sibling !== elem){
				siblings.push(sibling);
			}

			sibling = sibling.nextSibling;
		}

		return siblings;
	}

	/*
	 * Setting width of the content holder
	*/
	const applyContentWidth = () => {
		let contentWidth = sliderWidth * sliderLength;
		sliderWrapper.style.width = contentWidth + 'px';
	}

	applyContentWidth();

	/* Define uma largura para cada item do slider, ao dividir a largura ocupada atualmente pelo número de itens. */
	for (let index = 0, limit = sliderLength; index < limit; index++) {
		let currentSlide = slides[index];

		let setSlideWidth = () => {
			let slideWidth = parseFloat(sliderWidth) / numberOfItens;
			currentSlide.style.width = slideWidth + 'px';
		}

		setSlideWidth();
	}

	/**
	 * Se o contador atingir o mesmo valor que a quantidade de itens no slider,
	 * o mesmo será zerado e o slider retornará ao primeiro item.
	 * 
	 * ==== OU =====
	 * 
	 * Se o (contador + número de itens a ser exibido) for maior que a quantidade
	 * de itens no slider, o contador será zerado e o slider retornará ao primeiro item.
	 *  */
	const carousel = () => {
		if ((counter === sliderLength) || ((counter + numberOfItens) > sliderLength)) {
			counter = 0;
		}

		else if (counter < 0) {
			counter = sliderLength - numberOfItens; // "volte o número de itens que tenho em tela"
		}

		/* Passa de slide em slide. */
		for (let index = 0, limit = sliderLength; index < limit; index++) {
			let currentSlide = slides[index];
			currentSlide.style.transform = 'translate3d(-' + (counter * 100) +'%, 0, 0)';
			currentSlide.style.webkitTransform = 'translate3d(-' + (counter * 100) +'%, 0, 0)';

			let sliderDots = Array.from(slider.querySelectorAll('.slide-dots .dots'));

			if(sliderDots){
				let sliderCurrentDotSiblings = getSiblings(sliderDots[counter]);

				// Adiciona active ao dot correspondente ao slider atual, após remover o active dos outros, caso existam.
				sliderCurrentDotSiblings.forEach(item => {
					if(item.classList.contains('active')){
						item.classList.remove('active');
					}
				});

				sliderDots[counter].classList.add('active');
			}
		}
	}

	/* Checa se o elemento está em tela. */
	if('IntersectionObserver' in window){
		let options = {
			root: slider,
			threshold: 1
		}

		const checkIfItemIsCurrentlyVisible = entries => {
			entries.forEach(entry => {
				if(entry.isIntersecting === true){
					let currentSlide = entry.target;
					let currentSlideSiblings = getSiblings(currentSlide);

					let removeActiveFromSiblings = () => {
						currentSlideSiblings.forEach(currentSlideSibling => {
							currentSlideSibling.classList.remove('current-slide');
						});

						currentSlide.classList.add('current-slide');
					}

					removeActiveFromSiblings();
				}
			});
		}

		let observer = new IntersectionObserver(checkIfItemIsCurrentlyVisible, options);
		slides.forEach(slideItem => observer.observe(slideItem));
	}

	/* A very simple "swipe" */
	const swipe = () => {
		if(mobileSize.matches){
			slider.addEventListener('touchstart', e => {
				let screenWidth = window.innerWidth;
				let touchPositionX = e.touches[0].clientX; // 'touches' é necessário para reconhecer o uso de touch na tela mobile.
	
				if(touchPositionX > (screenWidth / 2)){
					counter++;
					carousel();
				}
	
				else {
					counter--;
					carousel();
				}
			});
		}
	
		else {
			sliderWrapper.addEventListener('mousedown', e => {
				let screenWidth = window.innerWidth;
				let clickPositionX = e.clientX;
	
				if(clickPositionX > (screenWidth / 2)){
				  counter++;
				  carousel();
				}
	
				else {
				  counter--;
				  carousel();
				}
			});
		}
	}

	swipe();

	/* New swipe, requires more adjustments */
	// const swipe = () => {
	// 	let pressed = false; // signals that the mouse button was pressed.
	// 	let startx;
	// 	let x;

	// 	slider.addEventListener('mousedown', e => {
	// 		pressed = true;
	// 		console.log(e, e.target);

	// 		/**
	// 		 * offsetX -> retorna as coordenadas no eixo x, do ponto clicado.
	// 		 * offsetLeft -> retorna a posição 'left' em pixels, relativo ao offsetParent (pai que possui qualquer position que não seja 'static'.)
	// 		 */
	// 		startx = e.offsetX - sliderWrapper.offsetLeft;

	// 		console.log(startx);
	// 		console.log(sliderWrapper, sliderWrapper.offsetLeft);
	// 		console.log(sliderWidth);

	// 		slider.style.cursor = 'grabbing';
	// 	});

	// 	slider.addEventListener('mouseup', e => {
	// 		slider.style.cursor = 'grab';
	// 		pressed = false;
	// 	});

	// 	slider.addEventListener('mousemove', e => {
	// 		e.preventDefault();

	// 		if(!pressed){
	// 			return;
	// 		}

	// 		x = e.offsetX;

	// 		/*
	// 			Pegar a largura do item no slider e pegar a
	// 			porcentagem que x - startx representa desse valor.
	// 		*/
	// 		let percentage = Math.ceil(((x - startx) / (sliderWidth)) * 100);
	// 		// console.log(x - startx);
	// 		console.log("percentage is: " + percentage + "%");
	// 		console.log(percentage);

	// 		// aplicando o transform em cada item.
	// 		sliderWrapper.querySelectorAll('.siberian-content-item').forEach(item =>{
	// 			item.style.transform = `translate3d(${percentage}%, 0, 0)`;
	// 		});

	// 		// aplicando o transform no pai, causa quebras.
	// 		// sliderWrapper.style.transform = `translate3d(${percentage}%, 0, 0)`;

	// 		checkBoundary();
	// 	});

	// 	let checkBoundary = () => {
	// 		let outer = slider.getBoundingClientRect();
	// 		let inner = slider.getBoundingClientRect();
	// 		// console.log();
	// 	}
	// }

	// swipe();

	/* Arrows */
	if(sliderOptions.hasArrows){
		const applyArrows = () => {
			let prev = slider.querySelector('.prev');
			let next = slider.querySelector('.next');

			// 	Controles do slider.
			next.addEventListener('click', () => {
				counter++;
				carousel();
			});

			prev.addEventListener('click', () => {
				counter--;
				carousel();
			});
		}

		applyArrows();
	}

	/* Dots */
	if(sliderOptions.hasDots){
		const applyDots = () => {
			let dots = Array.from(slider.querySelectorAll('.slide-dots .dots'));
			// console.log(dots);

			if(dots.length){
				// Alternando ao item do slide desejado, ao clicar no dot correspondente.
				dots.forEach(dot => {
					let dotSiblings = getSiblings(dot);
					let dotsItemDataset = parseInt(dot.dataset.dotsIndex); // Pegando a posição do item, de acordo com o index no dataset.

					/**
					 * 1) Definindo o counter do slider para o valor do index no item.
					 * 2) Reinicializando o carousel, para aplicar a alteração.
					 */
					dot.addEventListener('click', function(){
						counter = dotsItemDataset;
						carousel();

						dotSiblings.forEach(function(dotSibling){
							dotSibling.classList.remove('active');
							dot.classList.add('active');
						});
					});
				});
			}

			else {
				const createDotsItem = () => {
					let dotsWrapper = document.createElement('div');
					dotsWrapper.setAttribute('class', 'slide-dots');

					for(let index = 0, limit = sliderLength; index < limit; index++){
						let dotsItem = document.createElement('div');

						/* Caso seja o primeiro dot criado, adicionar a classe 'active'. */
						if(index === 0){
							dotsItem.setAttribute('class', 'dots active');
						}

						else {
							dotsItem.setAttribute('class', 'dots');
						}

						dotsItem.setAttribute('data-dots-index', index);
						dotsWrapper.appendChild(dotsItem);
					}

					slider.appendChild(dotsWrapper);
				}

				createDotsItem();
			}
		}

		applyDots();
	}
}

const sliderOptions = {
	selector: '.siberian',
	breakpoint: 'max-width(480px)',
	amountOfItens: 1,
	hasArrows: true,
	hasDots: true
}

window.addEventListener('resize', () => {
	customSlider(sliderOptions);
});

window.addEventListener('load', () => {
	customSlider(sliderOptions);
});

customSlider(sliderOptions);

module.exports = siberian;
