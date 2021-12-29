import './css/reset.css';
import './css/siberian.css';

const siberian = sliderOptions => {
	let slider = document.querySelector(sliderOptions.selector);
	let sliderWrapper = slider.querySelector(sliderOptions.selectorWrapper);
	let slides = Array.from(sliderWrapper.querySelectorAll('.siberian-content-item'));
	let sliderLength = slides.length;
	let sliderWidth = slider.getBoundingClientRect().width;
	let counter = 0;
	let slideWidth;

	let numberOfItens = sliderOptions.amountOfItens || 1;
	let mobileSize = window.matchMedia(sliderOptions.breakpoint);

	/* Return all the siblings of the desired element. */
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

	/* Width of the content container. */
	const applyContentWidth = () => {
		let contentWidth = sliderWidth * sliderLength;
		requestAnimationFrame(() => sliderWrapper.style.width = contentWidth + 'px');
	}

	applyContentWidth();

	/* Set an width for each item of the slider, by dividing the slider width by the number of existing itens. */
	requestAnimationFrame(() => {
		slides.forEach(slideItem => {
			slideWidth = parseFloat(sliderWidth) / numberOfItens;
			slideItem.style.width = slideWidth + 'px';
		});
	});

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

		/* Slide */
		for (let index = 0, limit = sliderLength; index < limit; index++) {
			let currentSlide = slides[index];

			requestAnimationFrame(() => {
				currentSlide.style.transform = 'translate3d(-' + (counter * 100) +'%, 0, 0)';
				currentSlide.style.webkitTransform = 'translate3d(-' + (counter * 100) +'%, 0, 0)';
			})

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

	/* Check if the element is visible on screen. */
	if('IntersectionObserver' in window){
		let options = {
			root: slider,
			threshold: 1
		}

		const checkIfItemIsCurrentlyVisible = entries => {
			entries.forEach(entry => {
				if(entry.isIntersecting === true){
					let currentSlide = entry.target;

					let removeActiveFromSiblings = () => {
						let lastSlideActive = document.querySelector('.siberian-content-item.current-slide');

						if(lastSlideActive){
							lastSlideActive.classList.remove('current-slide');
						}

						currentSlide.classList.add('current-slide');
					}

					removeActiveFromSiblings();
				}
			});
		}

		let observer = new IntersectionObserver(checkIfItemIsCurrentlyVisible, options);
		slides.forEach(slideItem => observer.observe(slideItem));
	}

	/* Swipe */
	const swipe = () => {
		if(mobileSize.matches){
			let touchPositionX = 0;

			slider.addEventListener('touchstart', e => {
				touchPositionX = e.touches[0].clientX; // 'touches' is necessary for touch usage in mobile screens.
			});

			slider.addEventListener('touchend', e => {
				console.log(e.touches[0].clientX);
				console.log(touchPositionX);
			});
		}

		else {
			let clickPositionX = 0;

			sliderWrapper.addEventListener('mousedown', e => {
				clickPositionX = e.clientX;
			});

			// então, aplicando o mousemove para o movimento
			sliderWrapper.addEventListener('mousemove', e => {
				if(clickPositionX !== 0){
					// console.log(clickPositionX - e.clientX);
				}
			});

			sliderWrapper.addEventListener('mouseup', e => {
				let safeArea = slideWidth * 0.1; // avoiding accidental movement.

				// clique inicial - clique final
				clickPositionX -= e.clientX;
				// console.log(clickPositionX, safeArea);

				if(clickPositionX > safeArea){
					counter++;
					carousel();
				}

				else if(clickPositionX < (safeArea * -1)) {
					counter--;
					carousel();
				}

				clickPositionX = 0; // returning to the initial state.
			});
		}
	}

	swipe();

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

			if(dots.length){
				// Alternando ao item do slide desejado, ao clicar no dot correspondente.
				dots.forEach(dot => {
					let dotsItemDataset = parseInt(dot.dataset.dotsIndex); // Pegando a posição do item, de acordo com o index no dataset.

					/**
					 * 1) Definindo o counter do slider para o valor do index no item.
					 * 2) Reinicializando o carousel, para aplicar a alteração.
					 */
					dot.addEventListener('click', () => {
						counter = dotsItemDataset;
						carousel();

						let lastDotActive = document.querySelector('.dots.active');

						if(lastDotActive){
							lastDotActive.classList.remove('active');
						}

						dot.classList.add('active');
					});
				});
			}

			else {
				const createDotsItem = () => {
					let dotsWrapper = document.createElement('div');
					dotsWrapper.setAttribute('class', 'slide-dots');

					for(let index = 0, limit = sliderLength; index < limit; index++){
						let dotsItem = document.createElement('div');

						/* If it is the first dot created, add the class 'active'. */
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

					applyDots(); // applying the events in the newly created 'dots'.
				}

				createDotsItem();
			}
		}

		applyDots();
	}
}

module.exports = siberian;
