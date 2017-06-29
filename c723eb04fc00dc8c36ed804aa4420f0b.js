"use strict";

(function () {
  var e,
      t,
      n,
      o,
      r,
      i,
      s,
      _,
      u,
      c,
      l,
      h,
      f,
      a,
      d,
      p,
      y,
      m,
      v,
      k,
      g,
      b,
      w = {}.hasOwnProperty,
      q = [].indexOf || function (e) {
    for (var t = 0, n = this.length; n > t; t++) {
      if (t in this && this[t] === e) return t;
    }return -1;
  };u = { is_unordered: !1, is_counting: !1, is_exclusive: !1, is_solitary: !1, prevent_default: !1, prevent_repeat: !1 }, g = ["meta", "alt", "option", "ctrl", "shift", "cmd"], v = "ctrl", t = {}, t.debug = !1, e = function () {
    function e(e) {
      var t, n;for (t in e) {
        w.call(e, t) && (n = e[t], n !== !1 && (this[t] = n));
      }this.keys = this.keys || [], this.count = this.count || 0;
    }return e.prototype.allows_key_repeat = function () {
      return !this.prevent_repeat && "function" == typeof this.on_keydown;
    }, e.prototype.reset = function () {
      return this.count = 0, this.keyup_fired = null;
    }, e;
  }(), t.Listener = function () {
    function t(e, t) {
      var n, o, r;"undefined" != typeof jQuery && null !== jQuery && e instanceof jQuery && (1 !== e.length && m("Warning: your jQuery selector should have exactly one object."), e = e[0]), this.should_suppress_event_defaults = !1, this.should_force_event_defaults = !1, this.sequence_delay = 800, this._registered_combos = [], this._keys_down = [], this._active_combos = [], this._sequence = [], this._sequence_timer = null, this._prevent_capture = !1, this._defaults = t || {};for (o in u) {
        w.call(u, o) && (r = u[o], this._defaults[o] = this._defaults[o] || r);
      }this.element = e || document.body, n = function n(e, t, _n) {
        return e.addEventListener ? e.addEventListener(t, _n) : e.attachEvent && e.attachEvent("on" + t, _n), _n;
      }, this.keydown_event = n(this.element, "keydown", function (e) {
        return function (t) {
          return t = t || window.event, e._receive_input(t, !0), e._bug_catcher(t);
        };
      }(this)), this.keyup_event = n(this.element, "keyup", function (e) {
        return function (t) {
          return t = t || window.event, e._receive_input(t, !1);
        };
      }(this)), this.blur_event = n(window, "blur", function (e) {
        return function () {
          var t, n, o, r;for (r = e._keys_down, n = 0, o = r.length; o > n; n++) {
            t = r[n], e._key_up(t, {});
          }return e._keys_down = [];
        };
      }(this));
    }return t.prototype.destroy = function () {
      var e;return e = function e(_e, t, n) {
        return null != _e.removeEventListener ? _e.removeEventListener(t, n) : null != _e.removeEvent ? _e.removeEvent("on" + t, n) : void 0;
      }, e(this.element, "keydown", this.keydown_event), e(this.element, "keyup", this.keyup_event), e(window, "blur", this.blur_event);
    }, t.prototype._bug_catcher = function (e) {
      var t;return "cmd" === v && q.call(this._keys_down, "cmd") >= 0 && "cmd" !== (t = i(e.keyCode)) && "shift" !== t && "alt" !== t && "caps" !== t && "tab" !== t ? this._receive_input(e, !1) : void 0;
    }, t.prototype._cmd_bug_check = function (e) {
      return !("cmd" === v && q.call(this._keys_down, "cmd") >= 0 && q.call(e, "cmd") < 0);
    }, t.prototype._prevent_default = function (e, t) {
      return (t || this.should_suppress_event_defaults) && !this.should_force_event_defaults && (e.preventDefault ? e.preventDefault() : e.returnValue = !1, e.stopPropagation) ? e.stopPropagation() : void 0;
    }, t.prototype._get_active_combos = function (e) {
      var t, n;return t = [], n = c(this._keys_down, function (t) {
        return t !== e;
      }), n.push(e), this._match_combo_arrays(n, function (e) {
        return function (n) {
          return e._cmd_bug_check(n.keys) ? t.push(n) : void 0;
        };
      }(this)), this._fuzzy_match_combo_arrays(n, function (e) {
        return function (n) {
          return q.call(t, n) >= 0 ? void 0 : !n.is_solitary && e._cmd_bug_check(n.keys) ? t.push(n) : void 0;
        };
      }(this)), t;
    }, t.prototype._get_potential_combos = function (e) {
      var t, n, o, r, i;for (n = [], i = this._registered_combos, o = 0, r = i.length; r > o; o++) {
        t = i[o], t.is_sequence || q.call(t.keys, e) >= 0 && this._cmd_bug_check(t.keys) && n.push(t);
      }return n;
    }, t.prototype._add_to_active_combos = function (e) {
      var t, n, o, r, i, s, _, u, c, l, h, f, a, d, p;if (u = !1, _ = !0, r = !1, q.call(this._active_combos, e) >= 0) return !0;if (this._active_combos.length) for (s = c = 0, d = this._active_combos.length; d >= 0 ? d > c : c > d; s = d >= 0 ? ++c : --c) {
        if (t = this._active_combos[s], t && t.is_exclusive && e.is_exclusive) {
          if (o = t.keys, !u) for (l = 0, f = o.length; f > l; l++) {
            if (n = o[l], u = !0, q.call(e.keys, n) < 0) {
              u = !1;break;
            }
          }if (_ && !u) for (p = e.keys, h = 0, a = p.length; a > h; h++) {
            if (i = p[h], _ = !1, q.call(o, i) < 0) {
              _ = !0;break;
            }
          }u && (r ? (t = this._active_combos.splice(s, 1)[0], null != t && t.reset()) : (t = this._active_combos.splice(s, 1, e)[0], null != t && t.reset(), r = !0), _ = !1);
        }
      }return _ && this._active_combos.unshift(e), u || _;
    }, t.prototype._remove_from_active_combos = function (e) {
      var t, n, o, r;for (n = o = 0, r = this._active_combos.length; r >= 0 ? r > o : o > r; n = r >= 0 ? ++o : --o) {
        if (t = this._active_combos[n], t === e) {
          e = this._active_combos.splice(n, 1)[0], e.reset();break;
        }
      }
    }, t.prototype._get_possible_sequences = function () {
      var e, t, n, o, r, i, s, _, u, l, h, f, a;for (r = [], h = this._registered_combos, s = 0, l = h.length; l > s; s++) {
        for (e = h[s], n = _ = 1, f = this._sequence.length; f >= 1 ? f >= _ : _ >= f; n = f >= 1 ? ++_ : --_) {
          if (i = this._sequence.slice(-n), e.is_sequence && (!(q.call(e.keys, "shift") < 0) || (i = c(i, function (e) {
            return "shift" !== e;
          }), i.length))) {
            for (t = u = 0, a = i.length; a >= 0 ? a > u : u > a; t = a >= 0 ? ++u : --u) {
              if (e.keys[t] !== i[t]) {
                o = !1;break;
              }o = !0;
            }o && r.push(e);
          }
        }
      }return r;
    }, t.prototype._add_key_to_sequence = function (e, t) {
      var n, o, r, i;if (this._sequence.push(e), o = this._get_possible_sequences(), o.length) {
        for (r = 0, i = o.length; i > r; r++) {
          n = o[r], this._prevent_default(t, n.prevent_default);
        }this._sequence_timer && clearTimeout(this._sequence_timer), this.sequence_delay > -1 && (this._sequence_timer = setTimeout(function () {
          return this._sequence = [];
        }, this.sequence_delay));
      } else this._sequence = [];
    }, t.prototype._get_sequence = function (e) {
      var t, n, o, r, i, s, _, u, l, h, f, a, d;for (f = this._registered_combos, _ = 0, h = f.length; h > _; _++) {
        if (t = f[_], t.is_sequence) {
          for (o = u = 1, a = this._sequence.length; a >= 1 ? a >= u : u >= a; o = a >= 1 ? ++u : --u) {
            if (s = c(this._sequence, function (e) {
              return q.call(t.keys, "shift") >= 0 ? !0 : "shift" !== e;
            }).slice(-o), t.keys.length === s.length) for (n = l = 0, d = s.length; d >= 0 ? d > l : l > d; n = d >= 0 ? ++l : --l) {
              if (i = s[n], !(q.call(t.keys, "shift") < 0 && "shift" === i || "shift" === e && q.call(t.keys, "shift") < 0)) {
                if (t.keys[n] !== i) {
                  r = !1;break;
                }r = !0;
              }
            }
          }if (r) return t.is_exclusive && (this._sequence = []), t;
        }
      }return !1;
    }, t.prototype._receive_input = function (e, t) {
      var n;return this._prevent_capture ? void (this._keys_down.length && (this._keys_down = [])) : (n = i(e.keyCode), (t || this._keys_down.length || "alt" !== n && n !== v) && n ? t ? this._key_down(n, e) : this._key_up(n, e) : void 0);
    }, t.prototype._fire = function (e, t, n, o) {
      return "function" == typeof t["on_" + e] && this._prevent_default(n, t["on_" + e].call(t["this"], n, t.count, o) !== !0), "release" === e && (t.count = 0), "keyup" === e ? t.keyup_fired = !0 : void 0;
    }, t.prototype._match_combo_arrays = function (e, t) {
      var n, i, s, _;for (_ = this._registered_combos, i = 0, s = _.length; s > i; i++) {
        n = _[i], (!n.is_unordered && r(e, n.keys) || n.is_unordered && o(e, n.keys)) && t(n);
      }
    }, t.prototype._fuzzy_match_combo_arrays = function (e, t) {
      var n, o, r, i;for (i = this._registered_combos, o = 0, r = i.length; r > o; o++) {
        n = i[o], (!n.is_unordered && f(n.keys, e) || n.is_unordered && h(n.keys, e)) && t(n);
      }
    }, t.prototype._keys_remain = function (e) {
      var t, n, o, r, i;for (i = e.keys, o = 0, r = i.length; r > o; o++) {
        if (t = i[o], q.call(this._keys_down, t) >= 0) {
          n = !0;break;
        }
      }return n;
    }, t.prototype._key_down = function (e, t) {
      var n, o, r, i, _, u, c, l, h, f, a, d, p, y, m;h = s(e, t), h && (e = h), this._add_key_to_sequence(e, t), l = this._get_sequence(e), l && this._fire("keydown", l, t);for (_ in k) {
        r = k[_], t[r] && (_ === e || q.call(this._keys_down, _) >= 0 || this._keys_down.push(_));
      }for (_ in k) {
        if (r = k[_], _ !== e && q.call(this._keys_down, _) >= 0 && !t[r]) {
          if ("cmd" === _ && "cmd" !== v) continue;for (i = f = 0, m = this._keys_down.length; m >= 0 ? m > f : f > m; i = m >= 0 ? ++f : --f) {
            this._keys_down[i] === _ && this._keys_down.splice(i, 1);
          }
        }
      }for (o = this._get_active_combos(e), c = this._get_potential_combos(e), a = 0, p = o.length; p > a; a++) {
        n = o[a], this._handle_combo_down(n, c, e, t);
      }if (c.length) for (d = 0, y = c.length; y > d; d++) {
        u = c[d], this._prevent_default(t, u.prevent_default);
      }q.call(this._keys_down, e) < 0 && this._keys_down.push(e);
    }, t.prototype._handle_combo_down = function (e, t, n, o) {
      var r, i, s, _, u, c;if (q.call(e.keys, n) < 0) return !1;if (this._prevent_default(o, e && e.prevent_default), r = !1, q.call(this._keys_down, n) >= 0 && (r = !0, !e.allows_key_repeat())) return !1;if (_ = this._add_to_active_combos(e, n), e.keyup_fired = !1, i = !1, e.is_exclusive) for (u = 0, c = t.length; c > u; u++) {
        if (s = t[u], s.is_exclusive && s.keys.length > e.keys.length) {
          i = !0;break;
        }
      }return !i && (e.is_counting && "function" == typeof e.on_keydown && (e.count += 1), _) ? this._fire("keydown", e, o, r) : void 0;
    }, t.prototype._key_up = function (e, t) {
      var n, o, r, i, _, u, c, l, h, f, a, d, p, m, v, k, g, b, w;if (l = e, c = s(e, t), c && (e = c), c = y[l], t.shiftKey ? c && q.call(this._keys_down, c) >= 0 || (e = l) : l && q.call(this._keys_down, l) >= 0 || (e = c), u = this._get_sequence(e), u && this._fire("keyup", u, t), q.call(this._keys_down, e) < 0) return !1;for (_ = h = 0, k = this._keys_down.length; k >= 0 ? k > h : h > k; _ = k >= 0 ? ++h : --h) {
        if ((g = this._keys_down[_]) === e || g === c || g === l) {
          this._keys_down.splice(_, 1);break;
        }
      }for (o = this._active_combos.length, i = [], b = this._active_combos, f = 0, p = b.length; p > f; f++) {
        n = b[f], q.call(n.keys, e) >= 0 && i.push(n);
      }for (a = 0, m = i.length; m > a; a++) {
        r = i[a], this._handle_combo_up(r, t, e);
      }if (o > 1) for (w = this._active_combos, d = 0, v = w.length; v > d; d++) {
        n = w[d], void 0 === n || q.call(i, n) >= 0 || this._keys_remain(n) || this._remove_from_active_combos(n);
      }
    }, t.prototype._handle_combo_up = function (e, t, n) {
      var r, i;this._prevent_default(t, e && e.prevent_default), i = this._keys_remain(e), e.keyup_fired || (r = this._keys_down.slice(), r.push(n), e.is_solitary && !o(r, e.keys) || (this._fire("keyup", e, t), e.is_counting && "function" == typeof e.on_keyup && "function" != typeof e.on_keydown && (e.count += 1))), i || (this._fire("release", e, t), this._remove_from_active_combos(e));
    }, t.prototype.simple_combo = function (e, t) {
      return this.register_combo({ keys: e, on_keydown: t });
    }, t.prototype.counting_combo = function (e, t) {
      return this.register_combo({ keys: e, is_counting: !0, is_unordered: !1, on_keydown: t });
    }, t.prototype.sequence_combo = function (e, t) {
      return this.register_combo({ keys: e, on_keydown: t, is_sequence: !0, is_exclusive: !0 });
    }, t.prototype.register_combo = function (t) {
      var n, o, r, i;"string" == typeof t.keys && (t.keys = t.keys.split(" ")), i = this._defaults;for (o in i) {
        w.call(i, o) && (r = i[o], void 0 === t[o] && (t[o] = r));
      }return n = new e(t), b(n) ? (this._registered_combos.push(n), n) : void 0;
    }, t.prototype.register_many = function (e) {
      var t, n, o, r;for (r = [], n = 0, o = e.length; o > n; n++) {
        t = e[n], r.push(this.register_combo(t));
      }return r;
    }, t.prototype.unregister_combo = function (t) {
      var n, i, s, _, u, c;if (!t) return !1;if (i = function (e) {
        return function (t) {
          var n, o, r, i;for (i = [], n = o = 0, r = e._registered_combos.length; r >= 0 ? r > o : o > r; n = r >= 0 ? ++o : --o) {
            if (t === e._registered_combos[n]) {
              e._registered_combos.splice(n, 1);break;
            }i.push(void 0);
          }return i;
        };
      }(this), t instanceof e) return i(t);for ("string" == typeof t && (t = t.split(" ")), u = this._registered_combos, c = [], s = 0, _ = u.length; _ > s; s++) {
        n = u[s], null != n && (n.is_unordered && o(t, n.keys) || !n.is_unordered && r(t, n.keys) ? c.push(i(n)) : c.push(void 0));
      }return c;
    }, t.prototype.unregister_many = function (e) {
      var t, n, o, r;for (r = [], n = 0, o = e.length; o > n; n++) {
        t = e[n], r.push(this.unregister_combo(t));
      }return r;
    }, t.prototype.get_registered_combos = function () {
      return this._registered_combos;
    }, t.prototype.reset = function () {
      return this._registered_combos = [];
    }, t.prototype.listen = function () {
      return this._prevent_capture = !1;
    }, t.prototype.stop_listening = function () {
      return this._prevent_capture = !0;
    }, t.prototype.get_meta_key = function () {
      return v;
    }, t;
  }(), _ = function _() {
    -1 !== navigator.userAgent.indexOf("Mac OS X") && (v = "cmd");
  }, n = function n() {
    -1 !== navigator.userAgent.indexOf("Opera") && (p[17] = "cmd");
  }, i = function i(e) {
    return p[e];
  }, c = function c(e, t) {
    var n;return e.filter ? e.filter(t) : function () {
      var o, r, i;for (i = [], o = 0, r = e.length; r > o; o++) {
        n = e[o], t(n) && i.push(n);
      }return i;
    }();
  }, o = function o(e, t) {
    var n, o, r;if (e.length !== t.length) return !1;for (o = 0, r = e.length; r > o; o++) {
      if (n = e[o], !(q.call(t, n) >= 0)) return !1;
    }return !0;
  }, r = function r(e, t) {
    var n, o, r;if (e.length !== t.length) return !1;for (n = o = 0, r = e.length; r >= 0 ? r > o : o > r; n = r >= 0 ? ++o : --o) {
      if (e[n] !== t[n]) return !1;
    }return !0;
  }, h = function h(e, t) {
    var n, o, r;for (o = 0, r = e.length; r > o; o++) {
      if (n = e[o], q.call(t, n) < 0) return !1;
    }return !0;
  }, l = Array.prototype.indexOf || function (e, t) {
    var n, o, r;for (n = o = 0, r = e.length; r >= 0 ? r >= o : o >= r; n = r >= 0 ? ++o : --o) {
      if (e[n] === t) return n;
    }return -1;
  }, f = function f(e, t) {
    var n, o, r, i, s;for (r = 0, i = 0, s = e.length; s > i; i++) {
      if (o = e[i], n = l.call(t, o), !(n >= r)) return !1;r = n;
    }return !0;
  }, m = function m() {
    return t.debug ? console.log.apply(console, arguments) : void 0;
  }, a = function a(e) {
    var t, n, o;t = !1;for (o in p) {
      if (n = p[o], e === n) {
        t = !0;break;
      }
    }if (!t) for (o in y) {
      if (n = y[o], e === n) {
        t = !0;break;
      }
    }return t;
  }, b = function b(e) {
    var t, n, o, r, i, s, _, c, h, f, p, y, k, b, w;for (_ = !0, e.keys.length || m("You're trying to bind a combo with no keys:", e), n = h = 0, b = e.keys.length; b >= 0 ? b > h : h > b; n = b >= 0 ? ++h : --h) {
      o = e.keys[n], t = d[o], t && (o = e.keys[n] = t), "meta" === o && e.keys.splice(n, 1, v), "cmd" === o && m('Warning: use the "meta" key rather than "cmd" for Windows compatibility');
    }for (w = e.keys, f = 0, y = w.length; y > f; f++) {
      o = w[f], a(o) || (m('Do not recognize the key "' + o + '"'), _ = !1);
    }if (q.call(e.keys, "meta") >= 0 || q.call(e.keys, "cmd") >= 0) {
      for (i = e.keys.slice(), p = 0, k = g.length; k > p; p++) {
        r = g[p], (n = l.call(i, r)) > -1 && i.splice(n, 1);
      }i.length > 1 && (m("META and CMD key combos cannot have more than 1 non-modifier keys", e, i), _ = !1);
    }for (s in e) {
      c = e[s], "undefined" === u[s] && m("The property " + s + " is not a valid combo property. Your combo has still been registered.");
    }return _;
  }, s = function s(e, t) {
    var n;return t.shiftKey ? (n = y[e], null != n ? n : !1) : !1;
  }, k = { cmd: "metaKey", ctrl: "ctrlKey", shift: "shiftKey", alt: "altKey" }, d = { escape: "esc", control: "ctrl", command: "cmd", "break": "pause", windows: "cmd", option: "alt", caps_lock: "caps", apostrophe: "'", semicolon: ";", tilde: "~", accent: "`", scroll_lock: "scroll" }, y = { "/": "?", ".": ">", ",": "<", "'": '"', ";": ":", "[": "{", "]": "}", "\\": "|", "`": "~", "=": "+", "-": "_", 1: "!", 2: "@", 3: "#", 4: "$", 5: "%", 6: "^", 7: "&", 8: "*", 9: "(", 0: ")" }, p = { 0: "\\", 8: "backspace", 9: "tab", 12: "num", 13: "enter", 16: "shift", 17: "ctrl", 18: "alt", 19: "pause", 20: "caps", 27: "esc", 32: "space", 33: "pageup", 34: "pagedown", 35: "end", 36: "home", 37: "left", 38: "up", 39: "right", 40: "down", 44: "print", 45: "insert", 46: "delete", 48: "0", 49: "1", 50: "2", 51: "3", 52: "4", 53: "5", 54: "6", 55: "7", 56: "8", 57: "9", 65: "a", 66: "b", 67: "c", 68: "d", 69: "e", 70: "f", 71: "g", 72: "h", 73: "i", 74: "j", 75: "k", 76: "l", 77: "m", 78: "n", 79: "o", 80: "p", 81: "q", 82: "r", 83: "s", 84: "t", 85: "u", 86: "v", 87: "w", 88: "x", 89: "y", 90: "z", 91: "cmd", 92: "cmd", 93: "cmd", 96: "num_0", 97: "num_1", 98: "num_2", 99: "num_3", 100: "num_4", 101: "num_5", 102: "num_6", 103: "num_7", 104: "num_8", 105: "num_9", 106: "num_multiply", 107: "num_add", 108: "num_enter", 109: "num_subtract", 110: "num_decimal", 111: "num_divide", 112: "f1", 113: "f2", 114: "f3", 115: "f4", 116: "f5", 117: "f6", 118: "f7", 119: "f8", 120: "f9", 121: "f10", 122: "f11", 123: "f12", 124: "print", 144: "num_lock", 145: "scroll", 186: ";", 187: "=", 188: ",", 189: "-", 190: ".", 191: "/", 192: "`", 219: "[", 220: "\\", 221: "]", 222: "'", 223: "`", 224: "cmd", 225: "alt", 57392: "ctrl", 63289: "num", 59: ";", 61: "=", 173: "-" }, t._keycode_dictionary = p, t._is_array_in_array_sorted = f, _(), n(), "function" == typeof define && define.amd ? define([], function () {
    return t;
  }) : "undefined" != typeof exports && null !== exports ? exports.keypress = t : window.keypress = t;
}).call(undefined);
//# sourceMappingURL=./keypress.min.js.map