/*!
 * CodeX.Tooltips
 *
 * @version 1.0.3
 *
 * @licence MIT
 * @author CodeX <https://codex.so>
 *
 *
 */
!(function (t, e) {
  "object" == typeof exports && "object" == typeof module
    ? (module.exports = e())
    : "function" == typeof define && define.amd
    ? define([], e)
    : "object" == typeof exports
    ? (exports.Tooltip = e())
    : (t.Tooltip = e());
})(window, function () {
  return (function (t) {
    var e = {};
    function o(i) {
      if (e[i]) return e[i].exports;
      var n = (e[i] = { i: i, l: !1, exports: {} });
      return t[i].call(n.exports, n, n.exports, o), (n.l = !0), n.exports;
    }
    return (
      (o.m = t),
      (o.c = e),
      (o.d = function (t, e, i) {
        o.o(t, e) || Object.defineProperty(t, e, { enumerable: !0, get: i });
      }),
      (o.r = function (t) {
        "undefined" != typeof Symbol &&
          Symbol.toStringTag &&
          Object.defineProperty(t, Symbol.toStringTag, { value: "Module" }),
          Object.defineProperty(t, "__esModule", { value: !0 });
      }),
      (o.t = function (t, e) {
        if ((1 & e && (t = o(t)), 8 & e)) return t;
        if (4 & e && "object" == typeof t && t && t.__esModule) return t;
        var i = Object.create(null);
        if (
          (o.r(i),
          Object.defineProperty(i, "default", { enumerable: !0, value: t }),
          2 & e && "string" != typeof t)
        )
          for (var n in t)
            o.d(
              i,
              n,
              function (e) {
                return t[e];
              }.bind(null, n)
            );
        return i;
      }),
      (o.n = function (t) {
        var e =
          t && t.__esModule
            ? function () {
                return t.default;
              }
            : function () {
                return t;
              };
        return o.d(e, "a", e), e;
      }),
      (o.o = function (t, e) {
        return Object.prototype.hasOwnProperty.call(t, e);
      }),
      (o.p = ""),
      o((o.s = 0))
    );
  })([
    function (t, e, o) {
      t.exports = o(1);
    },
    function (t, e, o) {
      "use strict";
      o.r(e),
        o.d(e, "default", function () {
          return i;
        });
      class i {
        constructor() {
          (this.nodes = { wrapper: null, content: null }),
            (this.showed = !1),
            (this.offsetTop = 10),
            (this.offsetLeft = 10),
            (this.offsetRight = 10),
            (this.hidingDelay = 0),
            (this.handleWindowScroll = () => {
              this.showed && this.hide(!0);
            }),
            this.loadStyles(),
            this.prepare(),
            window.addEventListener("scroll", this.handleWindowScroll, {
              passive: !0,
            });
        }
        get CSS() {
          return {
            tooltip: "ct",
            tooltipContent: "ct__content",
            tooltipShown: "ct--shown",
            placement: {
              left: "ct--left",
              bottom: "ct--bottom",
              right: "ct--right",
              top: "ct--top",
            },
          };
        }
        show(t, e, o) {
          this.nodes.wrapper || this.prepare(),
            this.hidingTimeout && clearTimeout(this.hidingTimeout);
          const i = Object.assign(
            {
              placement: "bottom",
              marginTop: 0,
              marginLeft: 0,
              marginRight: 0,
              marginBottom: 0,
              delay: 70,
              hidingDelay: 0,
            },
            o
          );
          if (
            (i.hidingDelay && (this.hidingDelay = i.hidingDelay),
            (this.nodes.content.innerHTML = ""),
            "string" == typeof e)
          )
            this.nodes.content.appendChild(document.createTextNode(e));
          else {
            if (!(e instanceof Node))
              throw Error(
                "[CodeX Tooltip] Wrong type of «content» passed. It should be an instance of Node or String. But " +
                  typeof e +
                  " given."
              );
            this.nodes.content.appendChild(e);
          }
          switch (
            (this.nodes.wrapper.classList.remove(
              ...Object.values(this.CSS.placement)
            ),
            i.placement)
          ) {
            case "top":
              this.placeTop(t, i);
              break;
            case "left":
              this.placeLeft(t, i);
              break;
            case "right":
              this.placeRight(t, i);
              break;
            case "bottom":
            default:
              this.placeBottom(t, i);
          }
          i && i.delay
            ? (this.showingTimeout = setTimeout(() => {
                this.nodes.wrapper.classList.add(this.CSS.tooltipShown),
                  (this.showed = !0);
              }, i.delay))
            : (this.nodes.wrapper.classList.add(this.CSS.tooltipShown),
              (this.showed = !0));
        }
        hide(t = !1) {
          if (this.hidingDelay && !t)
            return (
              this.hidingTimeout && clearTimeout(this.hidingTimeout),
              void (this.hidingTimeout = setTimeout(() => {
                this.hide(!0);
              }, this.hidingDelay))
            );
          this.nodes.wrapper.classList.remove(this.CSS.tooltipShown),
            (this.showed = !1),
            this.showingTimeout && clearTimeout(this.showingTimeout);
        }
        onHover(t, e, o) {
          t.addEventListener("mouseenter", () => {
            this.show(t, e, o);
          }),
            t.addEventListener("mouseleave", () => {
              this.hide();
            });
        }
        destroy() {
          this.nodes.wrapper.remove(),
            window.removeEventListener("scroll", this.handleWindowScroll);
        }
        prepare() {
          (this.nodes.wrapper = this.make("div", this.CSS.tooltip)),
            (this.nodes.content = this.make("div", this.CSS.tooltipContent)),
            this.append(this.nodes.wrapper, this.nodes.content),
            this.append(document.body, this.nodes.wrapper);
        }
        loadStyles() {
          const t = "codex-tooltips-style";
          if (document.getElementById(t)) return;
          const e = o(2),
            i = this.make("style", null, { textContent: e.toString(), id: t });
          this.prepend(document.head, i);
        }
        placeBottom(t, e) {
          const o = t.getBoundingClientRect(),
            i = o.left + t.clientWidth / 2 - this.nodes.wrapper.offsetWidth / 2,
            n = o.bottom + window.pageYOffset + this.offsetTop + e.marginTop;
          this.applyPlacement("bottom", i, n);
        }
        placeTop(t, e) {
          const o = t.getBoundingClientRect(),
            i = o.left + t.clientWidth / 2 - this.nodes.wrapper.offsetWidth / 2,
            n =
              o.top +
              window.pageYOffset -
              this.nodes.wrapper.clientHeight -
              this.offsetTop;
          this.applyPlacement("top", i, n);
        }
        placeLeft(t, e) {
          const o = t.getBoundingClientRect(),
            i =
              o.left -
              this.nodes.wrapper.offsetWidth -
              this.offsetLeft -
              e.marginLeft,
            n =
              o.top +
              window.pageYOffset +
              t.clientHeight / 2 -
              this.nodes.wrapper.offsetHeight / 2;
          this.applyPlacement("left", i, n);
        }
        placeRight(t, e) {
          const o = t.getBoundingClientRect(),
            i = o.right + this.offsetRight + e.marginRight,
            n =
              o.top +
              window.pageYOffset +
              t.clientHeight / 2 -
              this.nodes.wrapper.offsetHeight / 2;
          this.applyPlacement("right", i, n);
        }
        applyPlacement(t, e, o) {
          this.nodes.wrapper.classList.add(this.CSS.placement[t]),
            (this.nodes.wrapper.style.left = e + "px"),
            (this.nodes.wrapper.style.top = o + "px");
        }
        make(t, e = null, o = {}) {
          const i = document.createElement(t);
          Array.isArray(e) ? i.classList.add(...e) : e && i.classList.add(e);
          for (const t in o) o.hasOwnProperty(t) && (i[t] = o[t]);
          return i;
        }
        append(t, e) {
          Array.isArray(e)
            ? e.forEach((e) => t.appendChild(e))
            : t.appendChild(e);
        }
        prepend(t, e) {
          Array.isArray(e)
            ? (e = e.reverse()).forEach((e) => t.prepend(e))
            : t.prepend(e);
        }
      }
    },
    function (t, e) {
      t.exports =
        '.ct{z-index:999;opacity:0;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;pointer-events:none;-webkit-transition:opacity 50ms ease-in,-webkit-transform 70ms cubic-bezier(.215,.61,.355,1);transition:opacity 50ms ease-in,-webkit-transform 70ms cubic-bezier(.215,.61,.355,1);transition:opacity 50ms ease-in,transform 70ms cubic-bezier(.215,.61,.355,1);transition:opacity 50ms ease-in,transform 70ms cubic-bezier(.215,.61,.355,1),-webkit-transform 70ms cubic-bezier(.215,.61,.355,1);will-change:opacity,top,left;-webkit-box-shadow:0 8px 12px 0 rgba(29,32,43,.17),0 4px 5px -3px rgba(5,6,12,.49);box-shadow:0 8px 12px 0 rgba(29,32,43,.17),0 4px 5px -3px rgba(5,6,12,.49);border-radius:9px}.ct,.ct:before{position:absolute;top:0;left:0}.ct:before{content:"";bottom:0;right:0;background-color:#1d202b;z-index:-1;border-radius:4px}@supports(-webkit-mask-box-image:url("")){.ct:before{border-radius:0;-webkit-mask-box-image:url(\'data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M10.71 0h2.58c3.02 0 4.64.42 6.1 1.2a8.18 8.18 0 013.4 3.4C23.6 6.07 24 7.7 24 10.71v2.58c0 3.02-.42 4.64-1.2 6.1a8.18 8.18 0 01-3.4 3.4c-1.47.8-3.1 1.21-6.11 1.21H10.7c-3.02 0-4.64-.42-6.1-1.2a8.18 8.18 0 01-3.4-3.4C.4 17.93 0 16.3 0 13.29V10.7c0-3.02.42-4.64 1.2-6.1a8.18 8.18 0 013.4-3.4C6.07.4 7.7 0 10.71 0z"/></svg>\') 48% 41% 37.9% 53.3%}}@media (--mobile){.ct{display:none}}.ct__content{padding:6px 10px;color:#cdd1e0;font-size:12px;text-align:center;letter-spacing:.02em;line-height:1em}.ct:after{content:"";width:8px;height:8px;position:absolute;background-color:#1d202b;z-index:-1}.ct--bottom{-webkit-transform:translateY(5px);transform:translateY(5px)}.ct--bottom:after{top:-3px;left:50%;-webkit-transform:translateX(-50%) rotate(-45deg);transform:translateX(-50%) rotate(-45deg)}.ct--top{-webkit-transform:translateY(-5px);transform:translateY(-5px)}.ct--top:after{top:auto;bottom:-3px;left:50%;-webkit-transform:translateX(-50%) rotate(-45deg);transform:translateX(-50%) rotate(-45deg)}.ct--left{-webkit-transform:translateX(-5px);transform:translateX(-5px)}.ct--left:after{top:50%;left:auto;right:0;-webkit-transform:translate(41.6%,-50%) rotate(-45deg);transform:translate(41.6%,-50%) rotate(-45deg)}.ct--right{-webkit-transform:translateX(5px);transform:translateX(5px)}.ct--right:after{top:50%;left:0;-webkit-transform:translate(-41.6%,-50%) rotate(-45deg);transform:translate(-41.6%,-50%) rotate(-45deg)}.ct--shown{opacity:1;-webkit-transform:none;transform:none}';
    },
  ]).default;
});
