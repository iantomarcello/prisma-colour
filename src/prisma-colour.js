class PrismaColor {
  constructor(raw) {
    if ( typeof raw !== 'string' ) {
      throw Error('Prisma Error: Value passed in constructor must be a string of CSS colour value.');
    }
    this.raw = raw.trim();
    this.rgb = new Array;
    this.alpha = 1;
    this.convert(this.raw);
  }

  get r() {
    return this.rgb[0];
  }

  get g() {
    return this.rgb[1];
  }

  get b() {
    return this.rgb[2];
  }

  get a() {
    return this.alpha;
  }

  setRGBA(r, g, b, a) {
    this.rgb = [r, g, b];
    this.alpha = a;
    return this;
  }

  reset() {
    this.convert(this.raw);
  }

  clone() {
    return new this.constructor(this.raw).setRGBA(...this.rgb, this.alpha);
  }

  clamp(v, max) {
    return Math.min(Math.max(v, 0), max);
  }

  /**
   *  Split CSS colour values by comma or space.
   */
  _splitBetter(string) {
    string = string.trim().replaceAll(', ', ',');
    if ( string.includes(',') ) {
      return string.split(',');
    } else if ( string.includes(' ') ) {
      return string.split(' ');
    } else {
      throw Error('Param doesn\'t seem to be a colour.');
      return '';
    }
  }

  /// Conversion.
  convert(colour) {
    switch (true) {
      case (colour.includes("#")): /// Hex to RGB
        let segment;
        if (colour.length > 7) {
          segment = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(colour);
          this.alpha = parseInt(segment[4], 16) / 255;
        } else {
          segment = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(colour);
          this.alpha = 1;
        }
        this.rgb[0] = parseInt(segment[1], 16);
        this.rgb[1] = parseInt(segment[2], 16);
        this.rgb[2] = parseInt(segment[3], 16);
        // modded from Tim Down on https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
        break;

      case (colour.includes("hsl")): /// HSL to RGB
        var cols;
        if (colour.includes("a")) {
          cols = this._splitBetter(colour.substr(5).slice(0, -1)).map(c => parseFloat(c));
          this.alpha = cols.pop();
        } else {
          cols = this._splitBetter(colour.substr(4).slice(0, -1)).map(c => parseFloat(c));
        }
        var h = cols[0] / 360;
        var s = cols[1] / 100;
        var l = cols[2] / 100;
        // console.log(cols);
        var r, g, b;
        if (s == 0) {
          r = g = b = l; // achromatic
        } else {
          function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
          }

          var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
          var p = 2 * l - q;
          r = hue2rgb(p, q, h + 1 / 3);
          g = hue2rgb(p, q, h);
          b = hue2rgb(p, q, h - 1 / 3);
        }

        this.rgb = [
          parseInt(r * 255),
          parseInt(g * 255),
          parseInt(b * 255),
        ];
        /// modded from https://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c
        break;

      case (colour.includes("rgb")): /// RGB breakdown
        if (colour.includes("a")) {
          cols = this._splitBetter(colour.substr(5).slice(0, -1)).map(c => parseFloat(c));
          this.alpha = cols.pop();
          this.rgb = cols;
        } else {
          this.rgb = this._splitBetter(colour.substr(4).slice(0, -1)).map(c => parseFloat(c));
        }
        break;

      case (Array.isArray(colour)):
        if ( colour.length === 3 ) {
          this.rgb = [...colour];
        } else if ( colour.length === 4 ) {
          var cols = [...colour];
          this.alpha = cols.pop();
          this.rgb = [...cols];
        }
        break;
      default:
        throw Error("Param doesn't seem to be a colour.");
    }
  }

  // NOTE: What is this for?
  luma(colour) {
    this.convert(colour);
    var r = this.rgb[0] / 255;
    var g = this.rgb[1] / 255;
    var b = this.rgb[2] / 255;
    r = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
    g = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
    b = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  toHSL(colour) {
    this.convert(colour);
    var r = this.rgb[0] / 255;
    var g = this.rgb[1] / 255;
    var b = this.rgb[2] / 255;
    var a = this.alpha;
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var h;
    var s;
    var l = (max + min) / 2;
    var d = max - min;

    if (max === min) {
      h = s = 0;
    } else {
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;

        case g:
          h = (b - r) / d + 2;
          break;

        case b:
          h = (r - g) / d + 4;
          break;
      }

      h /= 6;
    }

    return {
      h: h * 360,
      s: s * 100,
      l: l * 100,
      a: a
    };
  }

  getRGB(spacing = 'comma') {
    switch (spacing) {
      case 'space':
        return `rgb(${[...this.rgb].join(' ')})`;
        break;

      case 'comma':
      default:
        return `rgb(${[...this.rgb].join(', ')})`;
    }
  }

  getRGBA(spacing = 'comma') {
    switch (spacing) {
      case 'space':
        return `rgba(${[...this.rgb].join(' ')}  / ${this.alpha})`;
        break;

      case 'comma':
      default:
        return `rgba(${[...this.rgb, this.alpha].join(', ')})`;
    }
  }

  getHex() {
    let self = this;
    let output = "#".concat(this.rgb.map(function(c) {
      c = self.clamp(Math.round(c), 255);
      return (c < 16 ? '0' : '') + c.toString(16);
    }).join(''));

    if ( this.alpha < 1 ) {
      let alpha = Math.round(this.alpha * 255);
      output += (alpha < 16 ? '0' : '') + alpha.toString(16);
    }

    return output;
  }

  getHSL(spacing = 'comma') {
    let {h, s, l} = this.toHSL(this.rgb);
    let sig = 2;
    switch (spacing) {
      case 'space':
        return `hsl(${h.toFixed(sig)} ${s.toFixed(sig)}% ${l.toFixed(sig)}%)`;
        break;

      case 'comma':
      default:
        return `hsl(${h.toFixed(sig)}, ${s.toFixed(sig)}%, ${l.toFixed(sig)}%)`;
    }
  }

  getHSLA(spacing = 'comma') {
    let {h, s, l} = this.toHSL(this.rgb);
    let sig = 2;
    switch (spacing) {
      case 'space':
        return `hsla(${h.toFixed(sig)} ${s.toFixed(sig)}% ${l.toFixed(sig)}% / ${this.a.toFixed(sig)})`;
        break;

      case 'comma':
      default:
        return `hsla(${h.toFixed(sig)}, ${s.toFixed(sig)}%, ${l.toFixed(sig)}%, ${this.a.toFixed(sig)})`;
    }
  }

  hslaToString({h, s, l, a}, sig = 2) {
    return `hsla(${h.toFixed(sig)}, ${s.toFixed(sig)}%, ${l.toFixed(sig)}%, ${a.toFixed(sig)})`;
  }

  /// Operations.

  spin(amount = 0) {
    let hsl = this.toHSL(this.rgb);
    let hue = (hsl.h + parseFloat(amount)) % 360;
    hsl.h = hue < 0 ? 360 + hue : hue;
    this.convert(this.hslaToString(hsl));
    return this;
  }

  fade(amount = this.alpha) {
    let hsl = this.toHSL(this.rgb);
    hsl.a = 1 - parseFloat(amount) / 100;
    hsl.a = this.clamp(hsl.a, 1);
    this.convert(this.hslaToString(hsl));
    return this;
  }

  fadeIn(amount = 0) {
    let hsl = this.toHSL(this.rgb);
    hsl.a += parseFloat(amount) / 100;
    hsl.a = this.clamp(hsl.a, 1);
    this.convert(this.hslaToString(hsl));
    return this;
  }

  fadeOut(amount = 0) {
    let hsl = this.toHSL(this.rgb);
    hsl.a -= parseFloat(amount) / 100;
    hsl.a = this.clamp(hsl.a, 1);
    this.convert(this.hslaToString(hsl));
    return this;
  }

  lighten(amount = 0) {
    let hsl = this.toHSL(this.rgb);
    hsl.l += parseFloat(amount);
    hsl.l = this.clamp(hsl.l, 100);
    this.convert(this.hslaToString(hsl));
    return this;
  }

  darken(amount = 0) {
    let hsl = this.toHSL(this.rgb);
    hsl.l -= parseFloat(amount);
    hsl.l = this.clamp(hsl.l, 100);
    this.convert(this.hslaToString(hsl));
    return this;
  }

  saturate(amount = 0) {
    let hsl = this.toHSL(this.rgb);
    hsl.s += parseFloat(amount);
    hsl.s = this.clamp(hsl.s, 100);
    this.convert(this.hslaToString(hsl));
    return this;
  }

  desaturate(amount = 0) {
    let hsl = this.toHSL(this.rgb);
    hsl.s -= parseFloat(amount);
    hsl.s = this.clamp(hsl.s, 100);
    this.convert(this.hslaToString(hsl));
    return this;
  }
}

export default PrismaColor;
