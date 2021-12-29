# Siberian

A simple slider, built with vanilla Javascript.

### Installation

```
npm install siberian
```

### Usage

It's recommended to have an HTML markup defined as below:

```
<div class="siberian">
  <div class="siberian-container">
    <div class="siberian-content">
      <div class="siberian-content-item" data-item="0">
        // insert content here!
      </div>
    </div>
  </div>
</div>
```

Obs.: The "data-item" attribute must be numbered for each item in your slider (0, 1, 2, 3, etcetera).

Then, in your main **js** file, create a **sliderOptions** object, with the following parameters:

```
const sliderOptions = {
	selector: '.siberian',
	selectorWrapper: '.siberian-content',
	breakpoint: 'max-width(480px)', // for mobile screens.
	amountOfItens: 1,
	hasArrows: true,
	hasDots: true
}
```

Then, use it as a argument for the **siberian** function.

```
  siberian(sliderOptions);
```

## Dependencies

None!
