class Prisma {
  constructor() {
    this.rgb = new Array;
    this.alpha = 1;
  }

  _reset() {
    this.rgb = new Array;
    this.alpha = 1;
  }

  clamp(v, max) {
    return Math.min(Math.max(v, 0), max);
  }

  /// Conversion.
  _convert(colour) {
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
        colour = colour.includes(",") && colour.split(",").shift();
        var cols;
        if (colour.includes("a")) {
          cols = colour.substr(5).slice(0, -1).split(",").map(c => parseInt(c));
          this.alpha = cols.pop();
        } else {
          cols = colour.substr(4).slice(0, -1).split(",").map(c => parseInt(c));
        }
        var h = cols[0] / 360;
        var s = cols[1] / 100;
        var l = cols[2] / 100;
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

        this.rgb = [r * 255, g * 255, b * 255];
        /// modded from https://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c
        break;

      case (colour.includes("hsv")): /// HSV to RGB
        var cols;
        if (colour.includes("a")) {
          cols = colour.substr(5).slice(0, -1).split(",").map(c => parseInt(c));
          this.alpha = cols.pop();
        } else {
          cols = colour.substr(4).slice(0, -1).split(",").map(c => parseInt(c));
        }
        var h = cols[0] / 360;
        var s = cols[1] / 100;
        var l = cols[2] / 100;
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

        this.rgb = [r * 255, g * 255, b * 255];
        /// modded from https://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c
        break;

      case (colour.includes("rgb")): /// RGB breakdown
        if (colour.includes("a")) {
          let cols = colour.substr(5).slice(0, -1).split(",").map(c => parseFloat(c));
          this.alpha = cols.pop();
          this.rgb = cols;
        } else {
          this.rgb = colour.substr(4).slice(0, -1).split(",").map(c => parseFloat(c));
        }
        break;

      case (Array.isArray(colour)): /// HSV to RGB
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

  luma(colour) {
    this._convert(colour);
    var r = this.rgb[0] / 255;
    var g = this.rgb[1] / 255;
    var b = this.rgb[2] / 255;
    r = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
    g = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
    b = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  toRGB(colour) {
    this._convert(colour);
    return this.toHex(this.rgb);
  }

  toHSL(colour) {
    this._convert(colour);
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

  toHSV(colour) {
    this._convert(colour);
    var r = this.rgb[0] / 255;
    var g = this.rgb[1] / 255;
    var b = this.rgb[2] / 255;
    var a = this.alpha;
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var h;
    var s;
    var v = max;
    var d = max - min;

    if (max === 0) {
      s = 0;
    } else {
      s = d / max;
    }

    if (max === min) {
      h = 0;
    } else {
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
      s: s,
      v: v,
      a: a
    };
  }

  toARGB(colour) {
    this._convert(colour);
    return this.toHex([this.alpha * 255].concat(this.rgb));
  }

  toHex(colour) {
    this._convert(colour);
    let self = this;
    return "#".concat(colour.map(function(c) {
      c = self.clamp(Math.round(c), 255);
      return (c < 16 ? '0' : '') + c.toString(16);
    }).join(''));
  }

  hsla({h, s, l, a}) {
    var sig = 2;
    return `hsla(${h.toFixed(sig)}, ${s.toFixed(sig)}%, ${l.toFixed(sig)}%, ${a})`;
  }

  /// Operations.

  spin(colour, amount) {
    var hsl = this.toHSL(colour);
    var hue = (hsl.h + amount) % 360;
    hsl.h = hue < 0 ? 360 + hue : hue;
    return this.hsla(hsl);
  }

  fade(colour, amount) {
    var hsl = this.toHSL(colour);
    hsl.a = amount / 100;
    hsl.a = this.clamp(hsl.a, 1);
    return this.hsla(hsl);
  }

  fadein(colour, amount, method) {
    var hsl = this.toHSL(colour);

    if (typeof method !== 'undefined' && method.value === 'relative') {
      hsl.a += hsl.a * amount / 100;
    } else {
      hsl.a += amount / 100;
    }
    hsl.a = this.clamp(hsl.a, 1);
    return this.hsla(hsl);
  }

  fadeout(colour, amount, method) {
    var hsl = this.toHSL(colour);

    if (typeof method !== 'undefined' && method.value === 'relative') {
      hsl.a -= hsl.a * amount / 100;
    } else {
      hsl.a -= amount / 100;
    }
    console.log(hsl.a);
    hsl.a = this.clamp(hsl.a, 1);
    return this.hsla(hsl);
  }

  lighten(colour, amount, method) {
    var hsl = this.toHSL(colour);

    if (typeof method !== 'undefined' && method.value === 'relative') {
      hsl.l += hsl.l * amount;
    } else {
      hsl.l += amount;
    }
    hsl.l = this.clamp(hsl.l, 100);
    return this.hsla(hsl);
  }

  darken(colour, amount, method) {
    var hsl = this.toHSL(colour);

    if (typeof method !== 'undefined' && method.value === 'relative') {
      hsl.l -= hsl.l * amount;
    } else {
      hsl.l -= amount;
    }
    hsl.l = this.clamp(hsl.l, 100);
    return this.hsla(hsl);
  }

  saturate(colour, amount, method) {
    var hsl = this.toHSL(colour);

    if (typeof method !== 'undefined' && method.value === 'relative') {
      hsl.s += hsl.s * amount;
    } else {
      hsl.s += amount;
    }

    hsl.s = this.clamp(hsl.s, 100);
    return this.hsla(hsl);
  }

  desaturate(colour, amount, method) {
    var hsl = this.toHSL(colour);

    if (typeof method !== 'undefined' && method.value === 'relative') {
      hsl.s -= hsl.s * amount;
    } else {
      hsl.s -= amount;
    }

    hsl.s = this.clamp(hsl.s, 100);
    return this.hsla(hsl);
  }
}

export default new Prisma();
