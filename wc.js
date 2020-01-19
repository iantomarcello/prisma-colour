import prisma from "./index.js";

// const farbe = 'rgba(36, 205, 119, 0.60)';
const farbe = '#24cd7799';

class Standard extends HTMLElement {
  constructor(content = `Standard`) {
    super();
    this.shadow = this.attachShadow({mode: "open"});
    this.shadow.innerHTML =`
      <style>
        :host {
          margin-right: 15px;
        }

        div {
          display: inline-block;
          padding: 15px 13px;
          font-family: Arial;
          background-color: #d1d1d1;
        }

        p {
          text-align: center;
          margin-top: 0;
          margin-bottom: 8px;
        }

        span {
          display: block;
        }
      </style>
      <div>
        <p>${content}</p>
        <span></span>
      </div>
    `;

    this.paintColour();
  }

  paintColour(colour = farbe) {
    // console.log(colour);
    this.shadow.querySelector("div").attributeStyleMap.set("background-color", colour);
    this.shadow.querySelector("span").textContent = this.shadow.querySelector("div").attributeStyleMap.get("background-color");
  }
}
customElements.define("prisma-standard", Standard);

class Fade extends Standard {
  constructor() {
    super(`Fade 25%`);
    this.paintColour(prisma.fade(farbe, 25));
  }
}
customElements.define("prisma-fade", Fade);

class FadeOut extends Standard {
  constructor() {
    super(`FadeOut 25%`);
    this.paintColour(prisma.fadeout(farbe, 25));
  }
}
customElements.define("prisma-fadeout", FadeOut);

class FadeIn extends Standard {
  constructor() {
    super(`FadeIn 25%`);
    this.paintColour(prisma.fadein(farbe, 25));
  }
}
customElements.define("prisma-fadein", FadeIn);

class Lighten extends Standard {
  constructor() {
    super(`Lighten 33%`);
    this.paintColour(prisma.lighten(farbe, 33));
  }
}
customElements.define("prisma-lighten", Lighten);

class Darken extends Standard {
  constructor() {
    super(`Darken 33%`);
    this.paintColour(prisma.darken(farbe, 33));
  }
}
customElements.define("prisma-darken", Darken);

class Saturate extends Standard {
  constructor() {
    super(`Saturate 33%`);
    this.paintColour(prisma.saturate(farbe, 33));
  }
}
customElements.define("prisma-saturate", Saturate);

class Desaturate extends Standard {
  constructor() {
    super(`Desaturate 33%`);
    this.paintColour(prisma.desaturate(farbe, 33));
  }
}
customElements.define("prisma-desaturate", Desaturate);

class Spin extends Standard {
  constructor() {
    super(`Spin 120 deg`);
    this.paintColour(prisma.spin(farbe, 120));
  }
}
customElements.define("prisma-spin", Spin);
