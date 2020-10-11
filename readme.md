# Prima Colour
Prisma, which means prism in Malay, is a simple chainable colour converter in JS that outputs CSS colour values like the lovely hex colours and rgb.

Here's how it works:
``` JS
import Prisma from './prisma-colour.js';
const red = '#ff0000';
const pink = new Prisma(red).lighten(40).getHex(); // #fecccc
const transparentRed = new Prisma(red).fadeOut(75).getHex(); // #ff000040.
const darkOrange = new Prisma(red).spin(40).darken(15).getHex(); // #b27600.
const fullCircle = new Prisma(red).spin(180).spin(180).getHex(); // #ff0000
```

*Well this looks familliar...* <br>
Yup, its kinda similar to how colour function of css preprocessors like [LESS](http://lesscss.org/functions/#color-operations) works. The
code is based on that.

*Why chainable tho...?* <br>
I find the nesting methods of like the preprocessors are bulky. <br>
Say, I wanna lighten something, then saturate it, then fade it a little, for the the preprocessors, it would look like this:
``` JS
// If it looked like CSS preprocessors.
const bulky = SomeOtherLibraryMaybe.fade(saturate(lighten('#ff0000', 15) 15) 15); // #ff4b4bd9
```
Making it chainable would make it more readible.
``` JS
// 🔗🔗🔗
const chaining = new Prisma('#ff0000')
  .lighten(15) // #fe4c4c
  .saturate(15) //#ff4b4b
  .fade(15).getHex(); //#ff4b4bd9
```

---

## Getting Started
Like a prism, to get output colour, you must provide an input colour.
``` JS
import Prisma from './prisma-colour.js';
const inputColour = '#ff0000';
let changeIt = new Prisma(inputColour);
// inputColour is ready to be converted.
```

## Operation Methods
Operations are chainable methods which converts the colour. Chainable meaning it always returns it self. To output the colours, see _Output Methods_ below.

#### .fade(amount: Number)
Sets colour's opacity to said amount regardless of input's opacity.

#### .fadeIn(amount: Number)
Increases colour's opacity by said amount.

#### .fadeOut(amount: Number)
Decreases colour's opacity by said amount.

#### .spin(amount: Number)
Rotate the hue angle of a colour by amount in degrees.

#### .lighten(amount: Number)
Increases colour's lightness in the HSL colour space by said amount.

#### .darken(amount: Number)
Decreases colour's lightness in the HSL colour space by said amount.

#### .saturate(amount: Number)
Increases colour's saturation in the HSL colour space by said amount.

#### .desaturate(amount: Number)
Decreases colour's saturation in the HSL colour space by said amount.

## Output Methods
Output methods are end of the chain methods that returns the colour is CSS values of preferred format. <br>
RGB and HSL methods have [newer space separated notation variant](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#RGB_colors), which be be outputted by setting the `spacing` param to `space`. By default it outputs the good old `comma`.

#### .getHex() : String
Returns colour in Hex representation.<br>
If the colour had alpha, it will output the transparency as well.

#### .getRGB(spacing : String) : String
Returns colour in RGB, regardless of transparency. <br>

#### .getRGBA(spacing : String) : String
Returns colour in RGBA, inclusive of transparency. <br>

#### .getHSL(spacing : String) : String
Returns colour in HSL, regardless of transparency. <br>

#### .getHSLA(spacing : String) : String
Returns colour in HSLA, inclusive of transparency. <br>

## Other Method
#### .clone() : Object
Returns a copy of this Prisma instance including operated colour. <br>
You can clone at anytime during operation.

---

## Usage Examples
You can use it somewhere like in [Tailwind CSS](https://github.com/tailwindlabs/tailwindcss) to generate the colour dynamically.
``` JS
// tailwind.config.js
const Prisma = require('./build/cjs/prisma-colour.js');
const BLUE = '#1b61e4';

// Generating a complementary 'primary' and 'secondary' colour scheme.
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
         '100': new Prisma(BLUE).lighten(20).getHex(),
         '200': new Prisma(BLUE).lighten(15).getHex(),
         '300': new Prisma(BLUE).lighten(10).getHex(),
         '400': new Prisma(BLUE).lighten(5).getHex(),
         '500': new Prisma(BLUE).lighten(0).getHex(),
         '600': new Prisma(BLUE).darken(5).getHex(),
         '700': new Prisma(BLUE).darken(10).getHex(),
         '800': new Prisma(BLUE).darken(15).getHex(),
         '900': new Prisma(BLUE).darken(20).getHex(),
       },
        secondary: {
         '100': new Prisma(BLUE).spin(180).lighten(20).getHex(),
         '200': new Prisma(BLUE).spin(180).lighten(15).getHex(),
         '300': new Prisma(BLUE).spin(180).lighten(10).getHex(),
         '400': new Prisma(BLUE).spin(180).lighten(5).getHex(),
         '500': new Prisma(BLUE).spin(180).lighten(0).getHex(),
         '600': new Prisma(BLUE).spin(180).darken(5).getHex(),
         '700': new Prisma(BLUE).spin(180).darken(10).getHex(),
         '800': new Prisma(BLUE).spin(180).darken(15).getHex(),
         '900': new Prisma(BLUE).spin(180).darken(20).getHex(),
       }
      }
    },
  },
}
```
Or in a [Lit Element](https://github.com/Polymer/lit-element) to create a better interactive styling.
``` JS
import { LitElement, html, css, unsafeCSS } from 'lit-element';
import Prisma from './build/esm/prisma-colour.js';

const RED = 'rgb(195, 50, 50)'; // red

class HoverMeButton extends LitElement {
  static get styles() {
    return [
      css`
        :host() {
          display: block;
        }

        button {
          padding: 14px 23px;
          border: 0;
          border-radius: 3px;
          background: ${unsafeCSS(RED)};
          color: black;
          transition: background 0.2s ease-out;
          cursor: pointer;
        }

        button:hover {
          background: ${unsafeCSS(
            new Prisma(RED).lighten(17).getRGB()
          )};
        }
      `,
    ];
  }

  render() {
    return html`
      <button type="button">Hover Me</button>
    `;
  }
}
customElements.define('hover-me-button', HoverMeButton);

```

### Note
This is a colour converter and has nothing to do with the database toolkit, [Prisma](https://github.com/prisma/prisma).
