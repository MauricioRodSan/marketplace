* Copyright(c) 2016 Dmitry Semenov;*/i=[n(1)],void 0===(o="function"==typeof(r=function(e){var t,n,r,i,o,a,u=function(){},s=!!window.jQuery,c=e(window),l=function(e,n){t.ev.on("mfp"+e+".mfp",n)},f=function(t,n,r,i){var o=document.createElement("div");return o.className="mfp-"+t,r&&(o.innerHTML=r),i?n&&n.appendChild(o):(o=e(o),n&&o.appendTo(n)),o},d=function(n,r){t.ev.triggerHandler("mfp"+n,r),t.st.callbacks&&(n=n.charAt(0).toLowerCase()+n.slice(1),t.st.callbacks[n]&&t.st.callbacks[n].apply(t,e.isArray(r)?r:[r]))},p=function(n){return n===a&&t.currTemplate.closeBtn||(t.currTemplate.closeBtn=e(t.st.closeMarkup.replace("%title%",t.st.tClose)),a=n),t.currTemplate.closeBtn},h=function(){e.magnificPopup.instance||((t=new u).init(),e.magnificPopup.instance=t)};u.prototype={constructor:u,init:function(){var n=navigator.appVersion;t.isLowIE=t.isIE8=document.all&&!document.addEventListener,t.isAndroid=/android / gi.test(n), t.isIOS = /iphone|ipad|ipod/gi.test(n), t.supportsTransition = function() {
    var e = document.createElement("p").style,
        t = ["ms", "O", "Moz", "Webkit"];
    if (void 0 !== e.transition) return !0;
    for (; t.length;)
        if (t.pop() + "Transition" in e) return !0;
    return !1
}(), t.probablyMobile = t.isAndroid || t.isIOS || /(Opera Mini)|Kindle|webOS|BlackBerry|(Opera Mobi)|(Windows Phone)|IEMobile/i.test(navigator.userAgent), r = e(document), t.popupsCache = {}
}, open: function(n) {
    var i;
    if (!1 === n.isObj) {
        t.items = n.items.toArray(), t.index = 0;
        var a, u = n.items;
        for (i = 0; i < u.length; i++)
            if ((a = u[i]).parsed && (a = a.el[0]), a === n.el[0]) {
                t.index = i;
                break
            }
    } else t.items = e.isArray(n.items) ? n.items : [n.items], t.index = n.index || 0;
    if (!t.isOpen) {
        t.types = [], o = "", n.mainEl && n.mainEl.length ? t.ev = n.mainEl.eq(0) : t.ev = r, n.key ? (t.popupsCache[n.key] || (t.popupsCache[n.key] = {}), t.currTemplate = t.popupsCache[n.key]) : t.currTemplate = {}, t.st = e.extend(!0, {}, e.magnificPopup.defaults, n), t.fixedContentPos = "auto" === t.st.fixedContentPos ? !t.probablyMobile : t.st.fixedContentPos, t.st.modal && (t.st.closeOnContentClick = !1, t.st.closeOnBgClick = !1, t.st.showCloseBtn = !1, t.st.enableEscapeKey = !1), t.bgOverlay || (t.bgOverlay = f("bg").on("click.mfp", (function() {
            t.close()
        })), t.wrap = f("wrap").attr("tabindex", -1).on("click.mfp", (function(e) {
            t._checkIfClose(e.target) && t.close()
        })), t.container = f("container", t.wrap)), t.contentContainer = f("content"), t.st.preloader && (t.preloader = f("preloader", t.container, t.st.tLoading));
        var s = e.magnificPopup.modules;
        for (i = 0; i < s.length; i++) {
            var h = s[i];
            h = h.charAt(0).toUpperCase() + h.slice(1), t["init" + h].call(t)
        }
        d("BeforeOpen"), t.st.showCloseBtn && (t.st.closeBtnInside ? (l("MarkupParse", (function(e, t, n, r) {
            n.close_replaceWith = p(r.type)
        })), o += " mfp-close-btn-in") : t.wrap.append(p())), t.st.alignTop && (o += " mfp-align-top"), t.fixedContentPos ? t.wrap.css({
            overflow: t.st.overflowY,
            overflowX: "hidden",
            overflowY: t.st.overflowY
        }) : t.wrap.css({
            top: c.scrollTop(),
            position: "absolute"
        }), (!1 === t.st.fixedBgPos || "auto" === t.st.fixedBgPos && !t.fixedContentPos) && t.bgOverlay.css({
            height: r.height(),
            position: "absolute"
        }), t.st.enableEscapeKey && r.on("keyup.mfp", (function(e) {
            27 === e.keyCode && t.close()
        })), c.on("resize.mfp", (function() {
            t.updateSize()
        })), t.st.closeOnContentClick || (o += " mfp-auto-cursor"), o && t.wrap.addClass(o);
        var m = t.wH = c.height(),
            v = {};
        if (t.fixedContentPos && t._hasScrollBar(m)) {
            var g = t._getScrollbarSize();
            g && (v.marginRight = g)
        }
        t.fixedContentPos && (t.isIE7 ? e("body, html").css("overflow", "hidden") : v.overflow = "hidden");
        var y = t.st.mainClass;
        return t.isIE7 && (y += " mfp-ie7"), y && t._addClassToMFP(y), t.updateItemHTML(), d("BuildControls"), e("html").css(v), t.bgOverlay.add(t.wrap).prependTo(t.st.prependTo || e(document.body)), t._lastFocusedEl = document.activeElement, setTimeout((function() {
            t.content ? (t._addClassToMFP("mfp-ready"), t._setFocus()) : t.bgOverlay.addClass("mfp-ready"), r.on("focusin.mfp", t._onFocusIn)
        }), 16), t.isOpen = !0, t.updateSize(m), d("Open"), n
    }
    t.updateItemHTML()
}, close: function() {
    t.isOpen && (d("BeforeClose"), t.isOpen = !1, t.st.removalDelay && !t.isLowIE && t.supportsTransition ? (t._addClassToMFP("mfp-removing"), setTimeout((function() {
        t._close()
    }), t.st.removalDelay)) : t._close())
}, _close: function() {
    d("Close");
    var n = "mfp-removing mfp-ready ";
    if (t.bgOverlay.detach(), t.wrap.detach(), t.container.empty(), t.st.mainClass && (n += t.st.mainClass + " "), t._removeClassFromMFP(n), t.fixedContentPos) {
        var i = {
            marginRight: ""
        };
        t.isIE7 ? e("body, html").css("overflow", "") : i.overflow = "", e("html").css(i)
    }
    r.off("keyup.mfp focusin.mfp"), t.ev.off(".mfp"), t.wrap.attr("class", "mfp-wrap").removeAttr("style"), t.bgOverlay.attr("class", "mfp-bg"), t.container.attr("class", "mfp-container"), !t.st.showCloseBtn || t.st.closeBtnInside && !0 !== t.currTemplate[t.currItem.type] || t.currTemplate.closeBtn && t.currTemplate.closeBtn.detach(), t.st.autoFocusLast && t._lastFocusedEl && e(t._lastFocusedEl).focus(), t.currItem = null, t.content = null, t.currTemplate = null, t.prevHeight = 0, d("AfterClose")
}, updateSize: function(e) {
    if (t.isIOS) {
        var n = document.documentElement.clientWidth / window.innerWidth,
            r = window.innerHeight * n;
        t.wrap.css("height", r), t.wH = r
    } else t.wH = e || c.height();
    t.fixedContentPos || t.wrap.css("height", t.wH), d("Resize")
}, updateItemHTML: function() {
    var n = t.items[t.index];
    t.contentContainer.detach(), t.content && t.content.detach(), n.parsed || (n = t.parseEl(t.index));
    var r = n.type;
    if (d("BeforeChange", [t.currItem ? t.currItem.type : "", r]), t.currItem = n, !t.currTemplate[r]) {
        var o = !!t.st[r] && t.st[r].markup;
        d("FirstMarkupParse", o), t.currTemplate[r] = !o || e(o)
    }
    i && i !== n.type && t.container.removeClass("mfp-" + i + "-holder");
    var a = t["get" + r.charAt(0).toUpperCase() + r.slice(1)](n, t.currTemplate[r]);
    t.appendContent(a, r), n.preloaded = !0, d("Change", n), i = n.type, t.container.prepend(t.contentContainer), d("AfterChange")
}, appendContent: function(e, n) {
    t.content = e, e ? t.st.showCloseBtn && t.st.closeBtnInside && !0 === t.currTemplate[n] ? t.content.find(".mfp-close").length || t.content.append(p()) : t.content = e : t.content = "", d("BeforeAppend"), t.container.addClass("mfp-" + n + "-holder"), t.contentContainer.append(t.content)
}, parseEl: function(n) {
    var r, i = t.items[n];
    if (i.tagName ? i = {
            el: e(i)
        } : (r = i.type, i = {
            data: i,
            src: i.src
        }), i.el) {
        for (var o = t.types, a = 0; a < o.length; a++)
            if (i.el.hasClass("mfp-" + o[a])) {
                r = o[a];
                break
            }
        i.src = i.el.attr("data-mfp-src"), i.src || (i.src = i.el.attr("href"))
    }
    return i.type = r || t.st.type || "inline", i.index = n, i.parsed = !0, t.items[n] = i, d("ElementParse", i), t.items[n]
}, addGroup: function(e, n) {
    var r = function(r) {
        r.mfpEl = this, t._openClick(r, e, n)
    };
    n || (n = {});
    var i = "click.magnificPopup";
    n.mainEl = e, n.items ? (n.isObj = !0, e.off(i).on(i, r)) : (n.isObj = !1, n.delegate ? e.off(i).on(i, n.delegate, r) : (n.items = e, e.off(i).on(i, r)))
}, _openClick: function(n, r, i) {
    if ((void 0 !== i.midClick ? i.midClick : e.magnificPopup.defaults.midClick) || !(2 === n.which || n.ctrlKey || n.metaKey || n.altKey || n.shiftKey)) {
        var o = void 0 !== i.disableOn ? i.disableOn : e.magnificPopup.defaults.disableOn;
        if (o)
            if (e.isFunction(o)) {
                if (!o.call(t)) return !0
            } else if (c.width() < o) return !0;
        n.type && (n.preventDefault(), t.isOpen && n.stopPropagation()), i.el = e(n.mfpEl), i.delegate && (i.items = r.find(i.delegate)), t.open(i)
    }
}, updateStatus: function(e, r) {
    if (t.preloader) {
        n !== e && t.container.removeClass("mfp-s-" + n), r || "loading" !== e || (r = t.st.tLoading);
        var i = {
            status: e,
            text: r
        };
        d("UpdateStatus", i), e = i.status, r = i.text, t.preloader.html(r), t.preloader.find("a").on("click", (function(e) {
            e.stopImmediatePropagation()
        })), t.container.addClass("mfp-s-" + e), n = e
    }
}, _checkIfClose: function(n) {
    if (!e(n).hasClass("mfp-prevent-close")) {
        var r = t.st.closeOnContentClick,
            i = t.st.closeOnBgClick;
        if (r && i) return !0;
        if (!t.content || e(n).hasClass("mfp-close") || t.preloader && n === t.preloader[0]) return !0;
        if (n === t.content[0] || e.contains(t.content[0], n)) {
            if (r) return !0
        } else if (i && e.contains(document, n)) return !0;
        return !1
    }
}, _addClassToMFP: function(e) {
    t.bgOverlay.addClass(e), t.wrap.addClass(e)
}, _removeClassFromMFP: function(e) {
    this.bgOverlay.removeClass(e), t.wrap.removeClass(e)
}, _hasScrollBar: function(e) {
    return (t.isIE7 ? r.height() : document.body.scrollHeight) > (e || c.height())
}, _setFocus: function() {
    (t.st.focus ? t.content.find(t.st.focus).eq(0) : t.wrap).focus()
}, _onFocusIn: function(n) {
    if (n.target !== t.wrap[0] && !e.contains(t.wrap[0], n.target)) return t._setFocus(), !1
}, _parseMarkup: function(t, n, r) {
    var i;
    r.data && (n = e.extend(r.data, n)), d("MarkupParse", [t, n, r]), e.each(n, (function(n, r) {
        if (void 0 === r || !1 === r) return !0;
        if ((i = n.split("_")).length > 1) {
            var o = t.find(".mfp-" + i[0]);
            if (o.length > 0) {
                var a = i[1];
                "replaceWith" === a ? o[0] !== r[0] && o.replaceWith(r) : "img" === a ? o.is("img") ? o.attr("src", r) : o.replaceWith(e("<img>").attr("src", r).attr("class", o.attr("class"))) : o.attr(i[1], r)
            }
        } else t.find(".mfp-" + n).html(r)
    }))
}, _getScrollbarSize: function() {
    if (void 0 === t.scrollbarSize) {
        var e = document.createElement("div");
        e.style.cssText = "width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;", document.body.appendChild(e), t.scrollbarSize = e.offsetWidth - e.clientWidth, document.body.removeChild(e)
    }
    return t.scrollbarSize
}
}, e.magnificPopup = {
    instance: null,
    proto: u.prototype,
    modules: [],
    open: function(t, n) {
        return h(), (t = t ? e.extend(!0, {}, t) : {}).isObj = !0, t.index = n || 0, this.instance.open(t)
    },
    close: function() {
        return e.magnificPopup.instance && e.magnificPopup.instance.close()
    },
    registerModule: function(t, n) {
        n.options && (e.magnificPopup.defaults[t] = n.options), e.extend(this.proto, n.proto), this.modules.push(t)
    },
    defaults: {
        disableOn: 0,
        key: null,
        midClick: !1,
        mainClass: "",
        preloader: !0,
        focus: "",
        closeOnContentClick: !1,
        closeOnBgClick: !0,
        closeBtnInside: !0,
        showCloseBtn: !0,
        enableEscapeKey: !0,
        modal: !1,
        alignTop: !1,
        removalDelay: 0,
        prependTo: null,
        fixedContentPos: "auto",
        fixedBgPos: "auto",
        overflowY: "auto",
        closeMarkup: '<button title="%title%" type="button" class="mfp-close">&#215;</button>',
        tClose: "Close (Esc)",
        tLoading: "Loading...",
        autoFocusLast: !0
    }
}, e.fn.magnificPopup = function(n) {
    h();
    var r = e(this);
    if ("string" == typeof n)
        if ("open" === n) {
            var i, o = s ? r.data("magnificPopup") : r[0].magnificPopup,
                a = parseInt(arguments[1], 10) || 0;
            o.items ? i = o.items[a] : (i = r, o.delegate && (i = i.find(o.delegate)), i = i.eq(a)), t._openClick({
                mfpEl: i
            }, r, o)
        } else t.isOpen && t[n].apply(t, Array.prototype.slice.call(arguments, 1));
    else n = e.extend(!0, {}, n), s ? r.data("magnificPopup", n) : r[0].magnificPopup = n, t.addGroup(r, n);
    return r
};
var m, v, g, y = function() {
    g && (v.after(g.addClass(m)).detach(), g = null)
};
e.magnificPopup.registerModule("inline", {
    options: {
        hiddenClass: "hide",
        markup: "",
        tNotFound: "Content not found"
    },
    proto: {
        initInline: function() {
            t.types.push("inline"), l("Close.inline", (function() {
                y()
            }))
        },
        getInline: function(n, r) {
            if (y(), n.src) {
                var i = t.st.inline,
                    o = e(n.src);
                if (o.length) {
                    var a = o[0].parentNode;
                    a && a.tagName && (v || (m = i.hiddenClass, v = f(m), m = "mfp-" + m), g = o.after(v).detach().removeClass(m)), t.updateStatus("ready")
                } else t.updateStatus("error", i.tNotFound), o = e("<div>");
                return n.inlineElement = o, o
            }
            return t.updateStatus("ready"), t._parseMarkup(r, {}, n), r
        }
    }
});
var b, x = function() {
        b && e(document.body).removeClass(b)
    },
    w = function() {
        x(), t.req && t.req.abort()
    };
e.magnificPopup.registerModule("ajax", {
    options: {
        settings: null,
        cursor: "mfp-ajax-cur",
        tError: '<a href="%url%">The content</a> could not be loaded.'
    },
    proto: {
        initAjax: function() {
            t.types.push("ajax"), b = t.st.ajax.cursor, l("Close.ajax", w), l("BeforeChange.ajax", w)
        },
        getAjax: function(n) {
            b && e(document.body).addClass(b), t.updateStatus("loading");
            var r = e.extend({
                url: n.src,
                success: function(r, i, o) {
                    var a = {
                        data: r,
                        xhr: o
                    };
                    d("ParseAjax", a), t.appendContent(e(a.data), "ajax"), n.finished = !0, x(), t._setFocus(), setTimeout((function() {
                        t.wrap.addClass("mfp-ready")
                    }), 16), t.updateStatus("ready"), d("AjaxContentAdded")
                },
                error: function() {
                    x(), n.finished = n.loadError = !0, t.updateStatus("error", t.st.ajax.tError.replace("%url%", n.src))
                }
            }, t.st.ajax.settings);
            return t.req = e.ajax(r), ""
        }
    }
});
var C, T, k = function(n) {
    if (n.data && void 0 !== n.data.title) return n.data.title;
    var r = t.st.image.titleSrc;
    if (r) {
        if (e.isFunction(r)) return r.call(t, n);
        if (n.el) return n.el.attr(r) || ""
    }
    return ""
};
e.magnificPopup.registerModule("image", {
    options: {
        markup: '<div class="mfp-figure"><div class="mfp-close"></div><figure><div class="mfp-img"></div><figcaption><div class="mfp-bottom-bar"><div class="mfp-title"></div><div class="mfp-counter"></div></div></figcaption></figure></div>',
        cursor: "mfp-zoom-out-cur",
        titleSrc: "title",
        verticalFit: !0,
        tError: '<a href="%url%">The image</a> could not be loaded.'
    },
    proto: {
        initImage: function() {
            var n = t.st.image,
                r = ".image";
            t.types.push("image"), l("Open" + r, (function() {
                "image" === t.currItem.type && n.cursor && e(document.body).addClass(n.cursor)
            })), l("Close" + r, (function() {
                n.cursor && e(document.body).removeClass(n.cursor), c.off("resize.mfp")
            })), l("Resize" + r, t.resizeImage), t.isLowIE && l("AfterChange", t.resizeImage)
        },
        resizeImage: function() {
            var e = t.currItem;
            if (e && e.img && t.st.image.verticalFit) {
                var n = 0;
                t.isLowIE && (n = parseInt(e.img.css("padding-top"), 10) + parseInt(e.img.css("padding-bottom"), 10)), e.img.css("max-height", t.wH - n)
            }
        },
        _onImageHasSize: function(e) {
            e.img && (e.hasSize = !0, C && clearInterval(C), e.isCheckingImgSize = !1, d("ImageHasSize", e), e.imgHidden && (t.content && t.content.removeClass("mfp-loading"), e.imgHidden = !1))
        },
        findImageSize: function(e) {
            var n = 0,
                r = e.img[0],
                i = function(o) {
                    C && clearInterval(C), C = setInterval((function() {
                        r.naturalWidth > 0 ? t._onImageHasSize(e) : (n > 200 && clearInterval(C), 3 == ++n ? i(10) : 40 === n ? i(50) : 100 === n && i(500))
                    }), o)
                };
            i(1)
        },
        getImage: function(n, r) {
            var i = 0,
                o = function() {
                    n && (n.img[0].complete ? (n.img.off(".mfploader"), n === t.currItem && (t._onImageHasSize(n), t.updateStatus("ready")), n.hasSize = !0, n.loaded = !0, d("ImageLoadComplete")) : ++i < 200 ? setTimeout(o, 100) : a())
                },
                a = function() {
                    n && (n.img.off(".mfploader"), n === t.currItem && (t._onImageHasSize(n), t.updateStatus("error", u.tError.replace("%url%", n.src))), n.hasSize = !0, n.loaded = !0, n.loadError = !0)
                },
                u = t.st.image,
                s = r.find(".mfp-img");
            if (s.length) {
                var c = document.createElement("img");
                c.className = "mfp-img", n.el && n.el.find("img").length && (c.alt = n.el.find("img").attr("alt")), n.img = e(c).on("load.mfploader", o).on("error.mfploader", a), c.src = n.src, s.is("img") && (n.img = n.img.clone()), (c = n.img[0]).naturalWidth > 0 ? n.hasSize = !0 : c.width || (n.hasSize = !1)
            }
            return t._parseMarkup(r, {
                title: k(n),
                img_replaceWith: n.img
            }, n), t.resizeImage(), n.hasSize ? (C && clearInterval(C), n.loadError ? (r.addClass("mfp-loading"), t.updateStatus("error", u.tError.replace("%url%", n.src))) : (r.removeClass("mfp-loading"), t.updateStatus("ready")), r) : (t.updateStatus("loading"), n.loading = !0, n.hasSize || (n.imgHidden = !0, r.addClass("mfp-loading"), t.findImageSize(n)), r)
        }
    }
}), e.magnificPopup.registerModule("zoom", {
    options: {
        enabled: !1,
        easing: "ease-in-out",
        duration: 300,
        opener: function(e) {
            return e.is("img") ? e : e.find("img")
        }
    },
    proto: {
        initZoom: function() {
            var e, n = t.st.zoom,
                r = ".zoom";
            if (n.enabled && t.supportsTransition) {
                var i, o, a = n.duration,
                    u = function(e) {
                        var t = e.clone().removeAttr("style").removeAttr("class").addClass("mfp-animated-image"),
                            r = "all " + n.duration / 1e3 + "s " + n.easing,
                            i = {
                                position: "fixed",
                                zIndex: 9999,
                                left: 0,
                                top: 0,
                                "-webkit-backface-visibility": "hidden"
                            },
                            o = "transition";
                        return i["-webkit-" + o] = i["-moz-" + o] = i["-o-" + o] = i[o] = r, t.css(i), t
                    },
                    s = function() {
                        t.content.css("visibility", "visible")
                    };
                l("BuildControls" + r, (function() {
                    if (t._allowZoom()) {
                        if (clearTimeout(i), t.content.css("visibility", "hidden"), !(e = t._getItemToZoom())) return void s();
                        (o = u(e)).css(t._getOffset()), t.wrap.append(o), i = setTimeout((function() {
                            o.css(t._getOffset(!0)), i = setTimeout((function() {
                                s(), setTimeout((function() {
                                    o.remove(), e = o = null, d("ZoomAnimationEnded")
                                }), 16)
                            }), a)
                        }), 16)
                    }
                })), l("BeforeClose" + r, (function() {
                    if (t._allowZoom()) {
                        if (clearTimeout(i), t.st.removalDelay = a, !e) {
                            if (!(e = t._getItemToZoom())) return;
                            o = u(e)
                        }
                        o.css(t._getOffset(!0)), t.wrap.append(o), t.content.css("visibility", "hidden"), setTimeout((function() {
                            o.css(t._getOffset())
                        }), 16)
                    }
                })), l("Close" + r, (function() {
                    t._allowZoom() && (s(), o && o.remove(), e = null)
                }))
            }
        },
        _allowZoom: function() {
            return "image" === t.currItem.type
        },
        _getItemToZoom: function() {
            return !!t.currItem.hasSize && t.currItem.img
        },
        _getOffset: function(n) {
            var r, i = (r = n ? t.currItem.img : t.st.zoom.opener(t.currItem.el || t.currItem)).offset(),
                o = parseInt(r.css("padding-top"), 10),
                a = parseInt(r.css("padding-bottom"), 10);
            i.top -= e(window).scrollTop() - o;
            var u = {
                width: r.width(),
                height: (s ? r.innerHeight() : r[0].offsetHeight) - a - o
            };
            return void 0 === T && (T = void 0 !== document.createElement("p").style.MozTransform), T ? u["-moz-transform"] = u.transform = "translate(" + i.left + "px," + i.top + "px)" : (u.left = i.left, u.top = i.top), u
        }
    }
});
var S = function(e) {
    if (t.currTemplate.iframe) {
        var n = t.currTemplate.iframe.find("iframe");
        n.length && (e || (n[0].src = "//about:blank"), t.isIE8 && n.css("display", e ? "block" : "none"))
    }
};
e.magnificPopup.registerModule("iframe", {
    options: {
        markup: '<div class="mfp-iframe-scaler"><div class="mfp-close"></div><iframe class="mfp-iframe" src="//about:blank" frameborder="0" allowfullscreen></iframe></div>',
        srcAction: "iframe_src",
        patterns: {
            youtube: {
                index: "youtube.com",
                id: "v=",
                src: "//www.youtube.com/embed/%id%?autoplay=1"
            },
            vimeo: {
                index: "vimeo.com/",
                id: "/",
                src: "//player.vimeo.com/video/%id%?autoplay=1"
            },
            gmaps: {
                index: "//maps.google.",
                src: "%id%&output=embed"
            }
        }
    },
    proto: {
        initIframe: function() {
            t.types.push("iframe"), l("BeforeChange", (function(e, t, n) {
                t !== n && ("iframe" === t ? S() : "iframe" === n && S(!0))
            })), l("Close.iframe", (function() {
                S()
            }))
        },
        getIframe: function(n, r) {
            var i = n.src,
                o = t.st.iframe;
            e.each(o.patterns, (function() {
                if (i.indexOf(this.index) > -1) return this.id && (i = "string" == typeof this.id ? i.substr(i.lastIndexOf(this.id) + this.id.length, i.length) : this.id.call(this, i)), i = this.src.replace("%id%", i), !1
            }));
            var a = {};
            return o.srcAction && (a[o.srcAction] = i), t._parseMarkup(r, a, n), t.updateStatus("ready"), r
        }
    }
});
var E = function(e) {
        var n = t.items.length;
        return e > n - 1 ? e - n : e < 0 ? n + e : e
    },
    j = function(e, t, n) {
        return e.replace(/%curr%/gi, t + 1).replace(/%total%/gi, n)
    };
e.magnificPopup.registerModule("gallery", {
options: {
    enabled: !1,
    arrowMarkup: '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>',
    preload: [0, 2],
    navigateByImgClick: !0,
    arrows: !0,
    tPrev: "Previous (Left arrow key)",
    tNext: "Next (Right arrow key)",
    tCounter: "%curr% of %total%"
},
proto: {
    initGallery: function() {
        var n = t.st.gallery,
            i = ".mfp-gallery";
        if (t.direction = !0, !n || !n.enabled) return !1;
        o += " mfp-gallery", l("Open" + i, (function() {
            n.navigateByImgClick && t.wrap.on("click" + i, ".mfp-img", (function() {
                if (t.items.length > 1) return t.next(), !1
            })), r.on("keydown" + i, (function(e) {
                37 === e.keyCode ? t.prev() : 39 === e.keyCode && t.next()
            }))
        })), l("UpdateStatus" + i, (function(e, n) {
            n.text && (n.text = j(n.text, t.currItem.index, t.items.length))
        })), l("MarkupParse" + i, (function(e, r, i, o) {
            var a = t.items.length;
            i.counter = a > 1 ? j(n.tCounter, o.index, a) : ""
        })), l("BuildControls" + i, (function() {
            if (t.items.length > 1 && n.arrows && !t.arrowLeft) {
                var r = n.arrowMarkup,
                    i = t.arrowLeft = e(r.replace(/%title%/gi, n.tPrev).replace(/%dir%/gi, "left")).addClass("mfp-prevent-close"),
                    o = t.arrowRight = e(r.replace(/%title%/gi, n.tNext).replace(/%dir%/gi, "right")).addClass("mfp-prevent-close");
                i.click((function() {
                    t.prev()
                })), o.click((function() {
                    t.next()
                })), t.container.append(i.add(o))
            }
        })), l("Change" + i, (function() {
            t._preloadTimeout && clearTimeout(t._preloadTimeout), t._preloadTimeout = setTimeout((function() {
                t.preloadNearbyImages(), t._preloadTimeout = null
            }), 16)
        })), l("Close" + i, (function() {
            r.off(i), t.wrap.off("click" + i), t.arrowRight = t.arrowLeft = null
        }))
    },
    next: function() {
        t.direction = !0, t.index = E(t.index + 1), t.updateItemHTML()
    },
    prev: function() {
        t.direction = !1, t.index = E(t.index - 1), t.updateItemHTML()
    },
    goTo: function(e) {
        t.direction = e >= t.index, t.index = e, t.updateItemHTML()
    },
    preloadNearbyImages: function() {
        var e, n = t.st.gallery.preload,
            r = Math.min(n[0], t.items.length),
            i = Math.min(n[1], t.items.length);
        for (e = 1; e <= (t.direction ? i : r); e++) t._preloadItem(t.index + e);
        for (e = 1; e <= (t.direction ? r : i); e++) t._preloadItem(t.index - e)
    },
    _preloadItem: function(n) {
        if (n = E(n), !t.items[n].preloaded) {
            var r = t.items[n];
            r.parsed || (r = t.parseEl(n)), d("LazyLoad", r), "image" === r.type && (r.img = e('<img class="mfp-img" />').on("load.mfploader", (function() {
                r.hasSize = !0
            })).on("error.mfploader", (function() {
                r.hasSize = !0, r.loadError = !0, d("LazyLoadError", r)
            })).attr("src", r.src)), r.preloaded = !0
        }
    }
}
}), e.magnificPopup.registerModule("retina", {
options: {
    replaceSrc: function(e) {
        return e.src.replace(/\.\w+$/, (function(e) {
            return "@2x" + e
        }))
    },
    ratio: 1
},
proto: {
    initRetina: function() {
        if (window.devicePixelRatio > 1) {
            var e = t.st.retina,
                n = e.ratio;
            (n = isNaN(n) ? n() : n) > 1 && (l("ImageHasSize.retina", (function(e, t) {
                t.img.css({
                    "max-width": t.img[0].naturalWidth / n,
                    width: "100%"
                })
            })), l("ElementParse.retina", (function(t, r) {
                r.src = e.replaceSrc(r, n)
            })))
        }
    }
}
}), h()
}) ? r.apply(t, i): r) || (e.exports = o)
},
function(e, t, n) {},
function(e, t, n) {
    "use strict";
    n.r(t);
    var r = {};
    n.r(r), n.d(r, "VERSION", (function() {
        return a.e
    })), n.d(r, "restArguments", (function() {
        return u
    })), n.d(r, "isObject", (function() {
        return s
    })), n.d(r, "isNull", (function() {
        return c
    })), n.d(r, "isUndefined", (function() {
        return l
    })), n.d(r, "isBoolean", (function() {
        return f
    })), n.d(r, "isElement", (function() {
        return d
    })), n.d(r, "isString", (function() {
        return h
    })), n.d(r, "isNumber", (function() {
        return m
    })), n.d(r, "isDate", (function() {
        return v
    })), n.d(r, "isRegExp", (function() {
        return g
    })), n.d(r, "isError", (function() {
        return y
    })), n.d(r, "isSymbol", (function() {
        return b
    })), n.d(r, "isArrayBuffer", (function() {
        return x
    })), n.d(r, "isDataView", (function() {
        return A
    })), n.d(r, "isArray", (function() {
        return O
    })), n.d(r, "isFunction", (function() {
        return T
    })), n.d(r, "isArguments", (function() {
        return D
    })), n.d(r, "isFinite", (function() {
        return N
    })), n.d(r, "isNaN", (function() {
        return H
    })), n.d(r, "isTypedArray", (function() {
        return z
    })), n.d(r, "isEmpty", (function() {
        return U
    })), n.d(r, "isMatch", (function() {
        return V
    })), n.d(r, "isEqual", (function() {
        return Y
    })), n.d(r, "isMap", (function() {
        return oe
    })), n.d(r, "isWeakMap", (function() {
        return ae
    })), n.d(r, "isSet", (function() {
        return ue
    })), n.d(r, "isWeakSet", (function() {
        return se
    })), n.d(r, "keys", (function() {
        return $
    })), n.d(r, "allKeys", (function() {
        return K
    })), n.d(r, "values", (function() {
        return ce
    })), n.d(r, "pairs", (function() {
        return le
    })), n.d(r, "invert", (function() {
        return fe
    })), n.d(r, "functions", (function() {
        return de
    })), n.d(r, "methods", (function() {
        return de
    })), n.d(r, "extend", (function() {
        return he
    })), n.d(r, "extendOwn", (function() {
        return me
    })), n.d(r, "assign", (function() {
        return me
    })), n.d(r, "defaults", (function() {
        return ve
    })), n.d(r, "create", (function() {
        return ye
    })), n.d(r, "clone", (function() {
        return be
    })), n.d(r, "tap", (function() {
        return xe
    })), n.d(r, "get", (function() {
        return ke
    })), n.d(r, "has", (function() {
        return Se
    })), n.d(r, "mapObject", (function() {
        return Ne
    })), n.d(r, "identity", (function() {
        return Ee
    })), n.d(r, "constant", (function() {
        return P
    })), n.d(r, "noop", (function() {
        return He
    })), n.d(r, "toPath", (function() {
        return we
    })), n.d(r, "property", (function() {
        return Ae
    })), n.d(r, "propertyOf", (function() {
        return Pe
    })), n.d(r, "matcher", (function() {
        return je
    })), n.d(r, "matches", (function() {
        return je
    })), n.d(r, "times", (function() {
        return Le
    })), n.d(r, "random", (function() {
        return Me
    })), n.d(r, "now", (function() {
        return qe
    })), n.d(r, "escape", (function() {
        return ze
    })), n.d(r, "unescape", (function() {
        return Fe
    })), n.d(r, "templateSettings", (function() {
        return We
    })), n.d(r, "template", (function() {
        return Qe
    })), n.d(r, "result", (function() {
        return Ye
    })), n.d(r, "uniqueId", (function() {
        return Ze
    })), n.d(r, "chain", (function() {
        return Je
    })), n.d(r, "iteratee", (function() {
        return Ie
    })), n.d(r, "partial", (function() {
        return nt
    })), n.d(r, "bind", (function() {
        return rt
    })), n.d(r, "bindAll", (function() {
        return at
    })), n.d(r, "memoize", (function() {
        return ut
    })), n.d(r, "delay", (function() {
        return st
    })), n.d(r, "defer", (function() {
        return ct
    })), n.d(r, "throttle", (function() {
        return lt
    })), n.d(r, "debounce", (function() {
        return ft
    })), n.d(r, "wrap", (function() {
        return dt
    })), n.d(r, "negate", (function() {
        return pt
    })), n.d(r, "compose", (function() {
        return ht
    })), n.d(r, "after", (function() {
        return mt
    })), n.d(r, "before", (function() {
        return vt
    })), n.d(r, "once", (function() {
        return gt
    })), n.d(r, "findKey", (function() {
        return yt
    })), n.d(r, "findIndex", (function() {
        return xt
    })), n.d(r, "findLastIndex", (function() {
        return wt
    })), n.d(r, "sortedIndex", (function() {
        return Ct
    })), n.d(r, "indexOf", (function() {
        return kt
    })), n.d(r, "lastIndexOf", (function() {
        return St
    })), n.d(r, "find", (function() {
        return Et
    })), n.d(r, "detect", (function() {
        return Et
    })), n.d(r, "findWhere", (function() {
        return jt
    })), n.d(r, "each", (function() {
        return At
    })), n.d(r, "forEach", (function() {
        return At
    })), n.d(r, "map", (function() {
        return Ot
    })), n.d(r, "collect", (function() {
        return Ot
    })), n.d(r, "reduce", (function() {
        return It
    })), n.d(r, "foldl", (function() {
        return It
    })), n.d(r, "inject", (function() {
        return It
    })), n.d(r, "reduceRight", (function() {
        return Dt
    })), n.d(r, "foldr", (function() {
        return Dt
    })), n.d(r, "filter", (function() {
        return Nt
    })), n.d(r, "select", (function() {
        return Nt
    })), n.d(r, "reject", (function() {
        return Ht
    })), n.d(r, "every", (function() {
        return Pt
    })), n.d(r, "all", (function() {
        return Pt
    })), n.d(r, "some", (function() {
        return Lt
    })), n.d(r, "any", (function() {
        return Lt
    })), n.d(r, "contains", (function() {
        return Mt
    })), n.d(r, "includes", (function() {
        return Mt
    })), n.d(r, "include", (function() {
        return Mt
    })), n.d(r, "invoke", (function() {
        return qt
    })), n.d(r, "pluck", (function() {
        return Bt
    })), n.d(r, "where", (function() {
        return Rt
    })), n.d(r, "max", (function() {
        return zt
    })), n.d(r, "min", (function() {
        return Ft
    })), n.d(r, "shuffle", (function() {
        return $t
    })), n.d(r, "sample", (function() {
        return Wt
    })), n.d(r, "sortBy", (function() {
        return Ut
    })), n.d(r, "groupBy", (function() {
        return Xt
    })), n.d(r, "indexBy", (function() {
        return Gt
    })), n.d(r, "countBy", (function() {
        return Qt
    })), n.d(r, "partition", (function() {
        return Yt
    })), n.d(r, "toArray", (function() {
        return Zt
    })), n.d(r, "size", (function() {
        return Jt
    })), n.d(r, "pick", (function() {
        return tn
    })), n.d(r, "omit", (function() {
        return nn
    })), n.d(r, "first", (function() {
        return on
    })), n.d(r, "head", (function() {
        return on
    })), n.d(r, "take", (function() {
        return on
    })), n.d(r, "initial", (function() {
        return rn
    })), n.d(r, "last", (function() {
        return un
    })), n.d(r, "rest", (function() {
        return an
    })), n.d(r, "tail", (function() {
        return an
    })), n.d(r, "drop", (function() {
        return an
    })), n.d(r, "compact", (function() {
        return sn
    })), n.d(r, "flatten", (function() {
        return cn
    })), n.d(r, "without", (function() {
        return fn
    })), n.d(r, "uniq", (function() {
        return dn
    })), n.d(r, "unique", (function() {
        return dn
    })), n.d(r, "union", (function() {
        return pn
    })), n.d(r, "intersection", (function() {
        return hn
    })), n.d(r, "difference", (function() {
        return ln
    })), n.d(r, "unzip", (function() {
        return mn
    })), n.d(r, "transpose", (function() {
        return mn
    })), n.d(r, "zip", (function() {
        return vn
    })), n.d(r, "object", (function() {
        return gn
    })), n.d(r, "range", (function() {
        return yn
    })), n.d(r, "chunk", (function() {
        return bn
    })), n.d(r, "mixin", (function() {
        return wn
    })), n.d(r, "default", (function() {
        return Cn
    }));
    var i = n(1),
        o = n.n(i),
        a = n(0);

    function u(e, t) {
        return t = null == t ? e.length - 1 : +t,
            function() {
                for (var n = Math.max(arguments.length - t, 0), r = Array(n), i = 0; i < n; i++) r[i] = arguments[i + t];
                switch (t) {
                    case 0:
                        return e.call(this, r);
                    case 1:
                        return e.call(this, arguments[0], r);
                    case 2:
                        return e.call(this, arguments[0], arguments[1], r)
                }
                var o = Array(t + 1);
                for (i = 0; i < t; i++) o[i] = arguments[i];
                return o[t] = r, e.apply(this, o)
            }
    }

    function s(e) {
        var t = typeof e;
        return "function" === t || "object" === t && !!e
    }

    function c(e) {
        return null === e
    }

    function l(e) {
        return void 0 === e
    }

    function f(e) {
        return !0 === e || !1 === e || "[object Boolean]" === a.t.call(e)
    }

    function d(e) {
        return !(!e || 1 !== e.nodeType)
    }

    function p(e) {
        var t = "[object " + e + "]";
        return function(e) {
            return a.t.call(e) === t
        }
    }
    var h = p("String"),
        m = p("Number"),
        v = p("Date"),
        g = p("RegExp"),
        y = p("Error"),
        b = p("Symbol"),
        x = p("ArrayBuffer"),
        w = p("Function"),
        C = a.p.document && a.p.document.childNodes;
    "object" != typeof Int8Array && "function" != typeof C && (w = function(e) {
        return "function" == typeof e || !1
    });
    var T = w,
        k = p("Object"),
        S = a.s && k(new DataView(new ArrayBuffer(8))),
        E = "undefined" != typeof Map && k(new Map),
        j = p("DataView");
    var A = S ? function(e) {
            return null != e && T(e.getInt8) && x(e.buffer)
        } : j,
        O = a.k || p("Array");

    function _(e, t) {
        return null != e && a.i.call(e, t)
    }
    var I = p("Arguments");
    ! function() {
        I(arguments) || (I = function(e) {
            return _(e, "callee")
        })
    }();
    var D = I;

    function N(e) {
        return !b(e) && Object(a.f)(e) && !isNaN(parseFloat(e))
    }

    function H(e) {
        return m(e) && Object(a.g)(e)
    }

    function P(e) {
        return function() {
            return e
        }
    }

    function L(e) {
        return function(t) {
            var n = e(t);
            return "number" == typeof n && n >= 0 && n <= a.b
        }
    }

    function M(e) {
        return function(t) {
            return null == t ? void 0 : t[e]
        }
    }
    var q = M("byteLength"),
        B = L(q),
        R = /\[object ((I|Ui)nt(8|16|32)|Float(32|64)|Uint8Clamped|Big(I|Ui)nt64)Array\]/;
    var z = a.r ? function(e) {
            return a.l ? Object(a.l)(e) && !A(e) : B(e) && R.test(a.t.call(e))
        } : P(!1),
        F = M("length");

    function W(e, t) {
        t = function(e) {
            for (var t = {}, n = e.length, r = 0; r < n; ++r) t[e[r]] = !0;
            return {
                contains: function(e) {
                    return t[e]
                },
                push: function(n) {
                    return t[n] = !0, e.push(n)
                }
            }
        }(t);
        var n = a.n.length,
            r = e.constructor,
            i = T(r) && r.prototype || a.c,
            o = "constructor";
        for (_(e, o) && !t.contains(o) && t.push(o); n--;)(o = a.n[n]) in e && e[o] !== i[o] && !t.contains(o) && t.push(o)
    }

    function $(e) {
        if (!s(e)) return [];
        if (a.m) return Object(a.m)(e);
        var t = [];
        for (var n in e) _(e, n) && t.push(n);
        return a.h && W(e, t), t
    }

    function U(e) {
        if (null == e) return !0;
        var t = F(e);
        return "number" == typeof t && (O(e) || h(e) || D(e)) ? 0 === t : 0 === F($(e))
    }

    function V(e, t) {
        var n = $(t),
            r = n.length;
        if (null == e) return !r;
        for (var i = Object(e), o = 0; o < r; o++) {
            var a = n[o];
            if (t[a] !== i[a] || !(a in i)) return !1
        }
        return !0
    }

    function X(e) {
        return e instanceof X ? e : this instanceof X ? void(this._wrapped = e) : new X(e)
    }

    function G(e) {
        return new Uint8Array(e.buffer || e, e.byteOffset || 0, q(e))
    }
    X.VERSION = a.e, X.prototype.value = function() {
        return this._wrapped
    }, X.prototype.valueOf = X.prototype.toJSON = X.prototype.value, X.prototype.toString = function() {
        return String(this._wrapped)
    };

    function Q(e, t, n, r) {
        if (e === t) return 0 !== e || 1 / e == 1 / t;
        if (null == e || null == t) return !1;
        if (e != e) return t != t;
        var i = typeof e;
        return ("function" === i || "object" === i || "object" == typeof t) && function e(t, n, r, i) {
            t instanceof X && (t = t._wrapped);
            n instanceof X && (n = n._wrapped);
            var o = a.t.call(t);
            if (o !== a.t.call(n)) return !1;
            if (S && "[object Object]" == o && A(t)) {
                if (!A(n)) return !1;
                o = "[object DataView]"
            }
            switch (o) {
                case "[object RegExp]":
                case "[object String]":
                    return "" + t == "" + n;
                case "[object Number]":
                    return +t != +t ? +n != +n : 0 == +t ? 1 / +t == 1 / n : +t == +n;
                case "[object Date]":
                case "[object Boolean]":
                    return +t == +n;
                case "[object Symbol]":
                    return a.d.valueOf.call(t) === a.d.valueOf.call(n);
                case "[object ArrayBuffer]":
                case "[object DataView]":
                    return e(G(t), G(n), r, i)
            }
            var u = "[object Array]" === o;
            if (!u && z(t)) {
                if (q(t) !== q(n)) return !1;
                if (t.buffer === n.buffer && t.byteOffset === n.byteOffset) return !0;
                u = !0
            }
            if (!u) {
                if ("object" != typeof t || "object" != typeof n) return !1;
                var s = t.constructor,
                    c = n.constructor;
                if (s !== c && !(T(s) && s instanceof s && T(c) && c instanceof c) && "constructor" in t && "constructor" in n) return !1
            }
            i = i || [];
            var l = (r = r || []).length;
            for (; l--;)
                if (r[l] === t) return i[l] === n;
            if (r.push(t), i.push(n), u) {
                if ((l = t.length) !== n.length) return !1;
                for (; l--;)
                    if (!Q(t[l], n[l], r, i)) return !1
            } else {
                var f, d = $(t);
                if (l = d.length, $(n).length !== l) return !1;
                for (; l--;)
                    if (f = d[l], !_(n, f) || !Q(t[f], n[f], r, i)) return !1
            }
            return r.pop(), i.pop(), !0
        }(e, t, n, r)
    }

    function Y(e, t) {
        return Q(e, t)
    }

    function K(e) {
        if (!s(e)) return [];
        var t = [];
        for (var n in e) t.push(n);
        return a.h && W(e, t), t
    }

    function Z(e) {
        var t = F(e);
        return function(n) {
            if (null == n) return !1;
            var r = K(n);
            if (F(r)) return !1;
            for (var i = 0; i < t; i++)
                if (!T(n[e[i]])) return !1;
            return e !== re || !T(n[J])
        }
    }
    var J = "forEach",
        ee = ["clear", "delete"],
        te = ["get", "has", "set"],
        ne = ee.concat(J, te),
        re = ee.concat(te),
        ie = ["add"].concat(ee, J, "has"),
        oe = E ? Z(ne) : p("Map"),
        ae = E ? Z(re) : p("WeakMap"),
        ue = E ? Z(ie) : p("Set"),
        se = p("WeakSet");

    function ce(e) {
        for (var t = $(e), n = t.length, r = Array(n), i = 0; i < n; i++) r[i] = e[t[i]];
        return r
    }

    function le(e) {
        for (var t = $(e), n = t.length, r = Array(n), i = 0; i < n; i++) r[i] = [t[i], e[t[i]]];
        return r
    }

    function fe(e) {
        for (var t = {}, n = $(e), r = 0, i = n.length; r < i; r++) t[e[n[r]]] = n[r];
        return t
    }

    function de(e) {
        var t = [];
        for (var n in e) T(e[n]) && t.push(n);
        return t.sort()
    }

    function pe(e, t) {
        return function(n) {
            var r = arguments.length;
            if (t && (n = Object(n)), r < 2 || null == n) return n;
            for (var i = 1; i < r; i++)
                for (var o = arguments[i], a = e(o), u = a.length, s = 0; s < u; s++) {
                    var c = a[s];
                    t && void 0 !== n[c] || (n[c] = o[c])
                }
            return n
        }
    }
    var he = pe(K),
        me = pe($),
        ve = pe(K, !0);

    function ge(e) {
        if (!s(e)) return {};
        if (a.j) return Object(a.j)(e);
        var t = function() {};
        t.prototype = e;
        var n = new t;
        return t.prototype = null, n
    }

    function ye(e, t) {
        var n = ge(e);
        return t && me(n, t), n
    }

    function be(e) {
        return s(e) ? O(e) ? e.slice() : he({}, e) : e
    }

    function xe(e, t) {
        return t(e), e
    }

    function we(e) {
        return O(e) ? e : [e]
    }

    function Ce(e) {
        return X.toPath(e)
    }

    function Te(e, t) {
        for (var n = t.length, r = 0; r < n; r++) {
            if (null == e) return;
            e = e[t[r]]
        }
        return n ? e : void 0
    }

    function ke(e, t, n) {
        var r = Te(e, Ce(t));
        return l(r) ? n : r
    }

    function Se(e, t) {
        for (var n = (t = Ce(t)).length, r = 0; r < n; r++) {
            var i = t[r];
            if (!_(e, i)) return !1;
            e = e[i]
        }
        return !!n
    }

    function Ee(e) {
        return e
    }

    function je(e) {
        return e = me({}, e),
            function(t) {
                return V(t, e)
            }
    }

    function Ae(e) {
        return e = Ce(e),
            function(t) {
                return Te(t, e)
            }
    }

    function Oe(e, t, n) {
        if (void 0 === t) return e;
        switch (null == n ? 3 : n) {
            case 1:
                return function(n) {
                    return e.call(t, n)
                };
            case 3:
                return function(n, r, i) {
                    return e.call(t, n, r, i)
                };
            case 4:
                return function(n, r, i, o) {
                    return e.call(t, n, r, i, o)
                }
        }
        return function() {
            return e.apply(t, arguments)
        }
    }

    function _e(e, t, n) {
        return null == e ? Ee : T(e) ? Oe(e, t, n) : s(e) && !O(e) ? je(e) : Ae(e)
    }

    function Ie(e, t) {
        return _e(e, t, 1 / 0)
    }

    function De(e, t, n) {
        return X.iteratee !== Ie ? X.iteratee(e, t) : _e(e, t, n)
    }

    function Ne(e, t, n) {
        t = De(t, n);
        for (var r = $(e), i = r.length, o = {}, a = 0; a < i; a++) {
            var u = r[a];
            o[u] = t(e[u], u, e)
        }
        return o
    }

    function He() {}

    function Pe(e) {
        return null == e ? He : function(t) {
            return ke(e, t)
        }
    }

    function Le(e, t, n) {
        var r = Array(Math.max(0, e));
        t = Oe(t, n, 1);
        for (var i = 0; i < e; i++) r[i] = t(i);
        return r
    }

    function Me(e, t) {
        return null == t && (t = e, e = 0), e + Math.floor(Math.random() * (t - e + 1))
    }
    X.toPath = we, X.iteratee = Ie;
    var qe = Date.now || function() {
        return (new Date).getTime()
    };

    function Be(e) {
        var t = function(t) {
                return e[t]
            },
            n = "(?:" + $(e).join("|") + ")",
            r = RegExp(n),
            i = RegExp(n, "g");
        return function(e) {
            return e = null == e ? "" : "" + e, r.test(e) ? e.replace(i, t) : e
        }
    }
    var Re = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#x27;",
            "`": "&#x60;"
        },
        ze = Be(Re),
        Fe = Be(fe(Re)),
        We = X.templateSettings = {
            evaluate: /<%([\s\S]+?)%>/g,
            interpolate: /<%=([\s\S]+?)%>/g,
            escape: /<%-([\s\S]+?)%>/g
        },
        $e = /(.)^/,
        Ue = {
            "'": "'",
            "\\": "\\",
            "\r": "r",
            "\n": "n",
            "\u2028": "u2028",
            "\u2029": "u2029"
        },
        Ve = /\\|'|\r|\n|\u2028|\u2029/g;

    function Xe(e) {
        return "\\" + Ue[e]
    }
    var Ge = /^\s*(\w|\$)+\s*$/;

    function Qe(e, t, n) {
        !t && n && (t = n), t = ve({}, t, X.templateSettings);
        var r = RegExp([(t.escape || $e).source, (t.interpolate || $e).source, (t.evaluate || $e).source].join("|") + "|$", "g"),
            i = 0,
            o = "__p+='";
        e.replace(r, (function(t, n, r, a, u) {
            return o += e.slice(i, u).replace(Ve, Xe), i = u + t.length, n ? o += "'+\n((__t=(" + n + "))==null?'':_.escape(__t))+\n'" : r ? o += "'+\n((__t=(" + r + "))==null?'':__t)+\n'" : a && (o += "';\n" + a + "\n__p+='"), t
        })), o += "';\n";
        var a, u = t.variable;
        if (u) {
            if (!Ge.test(u)) throw new Error("variable is not a bare identifier: " + u)
        } else o = "with(obj||{}){\n" + o + "}\n", u = "obj";
        o = "var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n" + o + "return __p;\n";
        try {
            a = new Function(u, "_", o)
        } catch (e) {
            throw e.source = o, e
        }
        var s = function(e) {
            return a.call(this, e, X)
        };
        return s.source = "function(" + u + "){\n" + o + "}", s
    }

    function Ye(e, t, n) {
        var r = (t = Ce(t)).length;
        if (!r) return T(n) ? n.call(e) : n;
        for (var i = 0; i < r; i++) {
            var o = null == e ? void 0 : e[t[i]];
            void 0 === o && (o = n, i = r), e = T(o) ? o.call(e) : o
        }
        return e
    }
    var Ke = 0;

    function Ze(e) {
        var t = ++Ke + "";
        return e ? e + t : t
    }

    function Je(e) {
        var t = X(e);
        return t._chain = !0, t
    }

    function et(e, t, n, r, i) {
        if (!(r instanceof t)) return e.apply(n, i);
        var o = ge(e.prototype),
            a = e.apply(o, i);
        return s(a) ? a : o
    }
    var tt = u((function(e, t) {
        var n = tt.placeholder,
            r = function() {
                for (var i = 0, o = t.length, a = Array(o), u = 0; u < o; u++) a[u] = t[u] === n ? arguments[i++] : t[u];
                for (; i < arguments.length;) a.push(arguments[i++]);
                return et(e, r, this, this, a)
            };
        return r
    }));
    tt.placeholder = X;
    var nt = tt,
        rt = u((function(e, t, n) {
            if (!T(e)) throw new TypeError("Bind must be called on a function");
            var r = u((function(i) {
                return et(e, r, t, this, n.concat(i))
            }));
            return r
        })),
        it = L(F);

    function ot(e, t, n, r) {
        if (r = r || [], t || 0 === t) {
            if (t <= 0) return r.concat(e)
        } else t = 1 / 0;
        for (var i = r.length, o = 0, a = F(e); o < a; o++) {
            var u = e[o];
            if (it(u) && (O(u) || D(u)))
                if (t > 1) ot(u, t - 1, n, r), i = r.length;
                else
                    for (var s = 0, c = u.length; s < c;) r[i++] = u[s++];
            else n || (r[i++] = u)
        }
        return r
    }
    var at = u((function(e, t) {
        var n = (t = ot(t, !1, !1)).length;
        if (n < 1) throw new Error("bindAll must be passed function names");
        for (; n--;) {
            var r = t[n];
            e[r] = rt(e[r], e)
        }
        return e
    }));

    function ut(e, t) {
        var n = function(r) {
            var i = n.cache,
                o = "" + (t ? t.apply(this, arguments) : r);
            return _(i, o) || (i[o] = e.apply(this, arguments)), i[o]
        };
        return n.cache = {}, n
    }
    var st = u((function(e, t, n) {
            return setTimeout((function() {
                return e.apply(null, n)
            }), t)
        })),
        ct = nt(st, X, 1);

    function lt(e, t, n) {
        var r, i, o, a, u = 0;
        n || (n = {});
        var s = function() {
                u = !1 === n.leading ? 0 : qe(), r = null, a = e.apply(i, o), r || (i = o = null)
            },
            c = function() {
                var c = qe();
                u || !1 !== n.leading || (u = c);
                var l = t - (c - u);
                return i = this, o = arguments, l <= 0 || l > t ? (r && (clearTimeout(r), r = null), u = c, a = e.apply(i, o), r || (i = o = null)) : r || !1 === n.trailing || (r = setTimeout(s, l)), a
            };
        return c.cancel = function() {
            clearTimeout(r), u = 0, r = i = o = null
        }, c
    }

    function ft(e, t, n) {
        var r, i, o, a, s, c = function() {
                var u = qe() - i;
                t > u ? r = setTimeout(c, t - u) : (r = null, n || (a = e.apply(s, o)), r || (o = s = null))
            },
            l = u((function(u) {
                return s = this, o = u, i = qe(), r || (r = setTimeout(c, t), n && (a = e.apply(s, o))), a
            }));
        return l.cancel = function() {
            clearTimeout(r), r = o = s = null
        }, l
    }

    function dt(e, t) {
        return nt(t, e)
    }

    function pt(e) {
        return function() {
            return !e.apply(this, arguments)
        }
    }

    function ht() {
        var e = arguments,
            t = e.length - 1;
        return function() {
            for (var n = t, r = e[t].apply(this, arguments); n--;) r = e[n].call(this, r);
            return r
        }
    }

    function mt(e, t) {
        return function() {
            if (--e < 1) return t.apply(this, arguments)
        }
    }

    function vt(e, t) {
        var n;
        return function() {
            return --e > 0 && (n = t.apply(this, arguments)), e <= 1 && (t = null), n
        }
    }
    var gt = nt(vt, 2);

    function yt(e, t, n) {
        t = De(t, n);
        for (var r, i = $(e), o = 0, a = i.length; o < a; o++)
            if (t(e[r = i[o]], r, e)) return r
    }

    function bt(e) {
        return function(t, n, r) {
            n = De(n, r);
            for (var i = F(t), o = e > 0 ? 0 : i - 1; o >= 0 && o < i; o += e)
                if (n(t[o], o, t)) return o;
            return -1
        }
    }
    var xt = bt(1),
        wt = bt(-1);

    function Ct(e, t, n, r) {
        for (var i = (n = De(n, r, 1))(t), o = 0, a = F(e); o < a;) {
            var u = Math.floor((o + a) / 2);
            n(e[u]) < i ? o = u + 1 : a = u
        }
        return o
    }

    function Tt(e, t, n) {
        return function(r, i, o) {
            var u = 0,
                s = F(r);
            if ("number" == typeof o) e > 0 ? u = o >= 0 ? o : Math.max(o + s, u) : s = o >= 0 ? Math.min(o + 1, s) : o + s + 1;
            else if (n && o && s) return r[o = n(r, i)] === i ? o : -1;
            if (i != i) return (o = t(a.q.call(r, u, s), H)) >= 0 ? o + u : -1;
            for (o = e > 0 ? u : s - 1; o >= 0 && o < s; o += e)
                if (r[o] === i) return o;
            return -1
        }
    }
    var kt = Tt(1, xt, Ct),
        St = Tt(-1, wt);

    function Et(e, t, n) {
        var r = (it(e) ? xt : yt)(e, t, n);
        if (void 0 !== r && -1 !== r) return e[r]
    }

    function jt(e, t) {
        return Et(e, je(t))
    }

    function At(e, t, n) {
        var r, i;
        if (t = Oe(t, n), it(e))
            for (r = 0, i = e.length; r < i; r++) t(e[r], r, e);
        else {
            var o = $(e);
            for (r = 0, i = o.length; r < i; r++) t(e[o[r]], o[r], e)
        }
        return e
    }

    function Ot(e, t, n) {
        t = De(t, n);
        for (var r = !it(e) && $(e), i = (r || e).length, o = Array(i), a = 0; a < i; a++) {
            var u = r ? r[a] : a;
            o[a] = t(e[u], u, e)
        }
        return o
    }

    function _t(e) {
        var t = function(t, n, r, i) {
            var o = !it(t) && $(t),
                a = (o || t).length,
                u = e > 0 ? 0 : a - 1;
            for (i || (r = t[o ? o[u] : u], u += e); u >= 0 && u < a; u += e) {
                var s = o ? o[u] : u;
                r = n(r, t[s], s, t)
            }
            return r
        };
        return function(e, n, r, i) {
            var o = arguments.length >= 3;
            return t(e, Oe(n, i, 4), r, o)
        }
    }
    var It = _t(1),
        Dt = _t(-1);

    function Nt(e, t, n) {
        var r = [];
        return t = De(t, n), At(e, (function(e, n, i) {
            t(e, n, i) && r.push(e)
        })), r
    }

    function Ht(e, t, n) {
        return Nt(e, pt(De(t)), n)
    }

    function Pt(e, t, n) {
        t = De(t, n);
        for (var r = !it(e) && $(e), i = (r || e).length, o = 0; o < i; o++) {
            var a = r ? r[o] : o;
            if (!t(e[a], a, e)) return !1
        }
        return !0
    }

    function Lt(e, t, n) {
        t = De(t, n);
        for (var r = !it(e) && $(e), i = (r || e).length, o = 0; o < i; o++) {
            var a = r ? r[o] : o;
            if (t(e[a], a, e)) return !0
        }
        return !1
    }

    function Mt(e, t, n, r) {
        return it(e) || (e = ce(e)), ("number" != typeof n || r) && (n = 0), kt(e, t, n) >= 0
    }
    var qt = u((function(e, t, n) {
        var r, i;
        return T(t) ? i = t : (t = Ce(t), r = t.slice(0, -1), t = t[t.length - 1]), Ot(e, (function(e) {
            var o = i;
            if (!o) {
                if (r && r.length && (e = Te(e, r)), null == e) return;
                o = e[t]
            }
            return null == o ? o : o.apply(e, n)
        }))
    }));

    function Bt(e, t) {
        return Ot(e, Ae(t))
    }

    function Rt(e, t) {
        return Nt(e, je(t))
    }

    function zt(e, t, n) {
        var r, i, o = -1 / 0,
            a = -1 / 0;
        if (null == t || "number" == typeof t && "object" != typeof e[0] && null != e)
            for (var u = 0, s = (e = it(e) ? e : ce(e)).length; u < s; u++) null != (r = e[u]) && r > o && (o = r);
        else t = De(t, n), At(e, (function(e, n, r) {
            ((i = t(e, n, r)) > a || i === -1 / 0 && o === -1 / 0) && (o = e, a = i)
        }));
        return o
    }

    function Ft(e, t, n) {
        var r, i, o = 1 / 0,
            a = 1 / 0;
        if (null == t || "number" == typeof t && "object" != typeof e[0] && null != e)
            for (var u = 0, s = (e = it(e) ? e : ce(e)).length; u < s; u++) null != (r = e[u]) && r < o && (o = r);
        else t = De(t, n), At(e, (function(e, n, r) {
            ((i = t(e, n, r)) < a || i === 1 / 0 && o === 1 / 0) && (o = e, a = i)
        }));
        return o
    }

    function Wt(e, t, n) {
        if (null == t || n) return it(e) || (e = ce(e)), e[Me(e.length - 1)];
        var r = it(e) ? be(e) : ce(e),
            i = F(r);
        t = Math.max(Math.min(t, i), 0);
        for (var o = i - 1, a = 0; a < t; a++) {
            var u = Me(a, o),
                s = r[a];
            r[a] = r[u], r[u] = s
        }
        return r.slice(0, t)
    }

    function $t(e) {
        return Wt(e, 1 / 0)
    }

    function Ut(e, t, n) {
        var r = 0;
        return t = De(t, n), Bt(Ot(e, (function(e, n, i) {
            return {
                value: e,
                index: r++,
                criteria: t(e, n, i)
            }
        })).sort((function(e, t) {
            var n = e.criteria,
                r = t.criteria;
            if (n !== r) {
                if (n > r || void 0 === n) return 1;
                if (n < r || void 0 === r) return -1
            }
            return e.index - t.index
        })), "value")
    }

    function Vt(e, t) {
        return function(n, r, i) {
            var o = t ? [
                [],
                []
            ] : {};
            return r = De(r, i), At(n, (function(t, i) {
                var a = r(t, i, n);
                e(o, t, a)
            })), o
        }
    }
    var Xt = Vt((function(e, t, n) {
            _(e, n) ? e[n].push(t) : e[n] = [t]
        })),
        Gt = Vt((function(e, t, n) {
            e[n] = t
        })),
        Qt = Vt((function(e, t, n) {
            _(e, n) ? e[n]++ : e[n] = 1
        })),
        Yt = Vt((function(e, t, n) {
            e[n ? 0 : 1].push(t)
        }), !0),
        Kt = /[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;

    function Zt(e) {
        return e ? O(e) ? a.q.call(e) : h(e) ? e.match(Kt) : it(e) ? Ot(e, Ee) : ce(e) : []
    }

    function Jt(e) {
        return null == e ? 0 : it(e) ? e.length : $(e).length
    }

    function en(e, t, n) {
        return t in n
    }
    var tn = u((function(e, t) {
            var n = {},
                r = t[0];
            if (null == e) return n;
            T(r) ? (t.length > 1 && (r = Oe(r, t[1])), t = K(e)) : (r = en, t = ot(t, !1, !1), e = Object(e));
            for (var i = 0, o = t.length; i < o; i++) {
                var a = t[i],
                    u = e[a];
                r(u, a, e) && (n[a] = u)
            }
            return n
        })),
        nn = u((function(e, t) {
            var n, r = t[0];
            return T(r) ? (r = pt(r), t.length > 1 && (n = t[1])) : (t = Ot(ot(t, !1, !1), String), r = function(e, n) {
                return !Mt(t, n)
            }), tn(e, r, n)
        }));

    function rn(e, t, n) {
        return a.q.call(e, 0, Math.max(0, e.length - (null == t || n ? 1 : t)))
    }

    function on(e, t, n) {
        return null == e || e.length < 1 ? null == t || n ? void 0 : [] : null == t || n ? e[0] : rn(e, e.length - t)
    }

    function an(e, t, n) {
        return a.q.call(e, null == t || n ? 1 : t)
    }

    function un(e, t, n) {
        return null == e || e.length < 1 ? null == t || n ? void 0 : [] : null == t || n ? e[e.length - 1] : an(e, Math.max(0, e.length - t))
    }

    function sn(e) {
        return Nt(e, Boolean)
    }

    function cn(e, t) {
        return ot(e, t, !1)
    }
    var ln = u((function(e, t) {
            return t = ot(t, !0, !0), Nt(e, (function(e) {
                return !Mt(t, e)
            }))
        })),
        fn = u((function(e, t) {
            return ln(e, t)
        }));

    function dn(e, t, n, r) {
        f(t) || (r = n, n = t, t = !1), null != n && (n = De(n, r));
        for (var i = [], o = [], a = 0, u = F(e); a < u; a++) {
            var s = e[a],
                c = n ? n(s, a, e) : s;
            t && !n ? (a && o === c || i.push(s), o = c) : n ? Mt(o, c) || (o.push(c), i.push(s)) : Mt(i, s) || i.push(s)
        }
        return i
    }
    var pn = u((function(e) {
        return dn(ot(e, !0, !0))
    }));

    function hn(e) {
        for (var t = [], n = arguments.length, r = 0, i = F(e); r < i; r++) {
            var o = e[r];
            if (!Mt(t, o)) {
                var a;
                for (a = 1; a < n && Mt(arguments[a], o); a++);
                a === n && t.push(o)
            }
        }
        return t
    }

    function mn(e) {
        for (var t = e && zt(e, F).length || 0, n = Array(t), r = 0; r < t; r++) n[r] = Bt(e, r);
        return n
    }
    var vn = u(mn);

    function gn(e, t) {
        for (var n = {}, r = 0, i = F(e); r < i; r++) t ? n[e[r]] = t[r] : n[e[r][0]] = e[r][1];
        return n
    }

    function yn(e, t, n) {
        null == t && (t = e || 0, e = 0), n || (n = t < e ? -1 : 1);
        for (var r = Math.max(Math.ceil((t - e) / n), 0), i = Array(r), o = 0; o < r; o++, e += n) i[o] = e;
        return i
    }

    function bn(e, t) {
        if (null == t || t < 1) return [];
        for (var n = [], r = 0, i = e.length; r < i;) n.push(a.q.call(e, r, r += t));
        return n
    }

    function xn(e, t) {
        return e._chain ? X(t).chain() : t
    }

    function wn(e) {
        return At(de(e), (function(t) {
            var n = X[t] = e[t];
            X.prototype[t] = function() {
                var e = [this._wrapped];
                return a.o.apply(e, arguments), xn(this, n.apply(X, e))
            }
        })), X
    }
    At(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], (function(e) {
        var t = a.a[e];
        X.prototype[e] = function() {
            var n = this._wrapped;
            return null != n && (t.apply(n, arguments), "shift" !== e && "splice" !== e || 0 !== n.length || delete n[0]), xn(this, n)
        }
    })), At(["concat", "join", "slice"], (function(e) {
        var t = a.a[e];
        X.prototype[e] = function() {
            var e = this._wrapped;
            return null != e && (e = t.apply(e, arguments)), xn(this, e)
        }
    }));
    var Cn = X,
        Tn = wn(r);
    Tn._ = Tn;
    n(3);
    var kn = {
        type: "slider",
        startAt: 0,
        perView: 1,
        focusAt: 0,
        gap: 10,
        autoplay: !1,
        hoverpause: !0,
        keyboard: !0,
        bound: !1,
        swipeThreshold: 80,
        dragThreshold: 120,
        perTouch: !1,
        touchRatio: .5,
        touchAngle: 45,
        animationDuration: 400,
        rewind: !0,
        rewindDuration: 800,
        animationTimingFunc: "cubic-bezier(.165, .840, .440, 1)",
        throttle: 10,
        direction: "ltr",
        peek: 0,
        breakpoints: {},
        classes: {
            direction: {
                ltr: "glide--ltr",
                rtl: "glide--rtl"
            },
            slider: "glide--slider",
            carousel: "glide--carousel",
            swipeable: "glide--swipeable",
            dragging: "glide--dragging",
            cloneSlide: "glide__slide--clone",
            activeNav: "glide__bullet--active",
            activeSlide: "glide__slide--active",
            disabledArrow: "glide__arrow--disabled"
        }
    };

    function Sn(e) {
        console.error("[Glide warn]: " + e)
    }
    var En = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
            return typeof e
        } : function(e) {
            return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
        },
        jn = function(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        },
        An = function() {
            function e(e, t) {
                for (var n = 0; n < t.length; n++) {
                    var r = t[n];
                    r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                }
            }
            return function(t, n, r) {
                return n && e(t.prototype, n), r && e(t, r), t
            }
        }(),
        On = Object.assign || function(e) {
            for (var t = 1; t < arguments.length; t++) {
                var n = arguments[t];
                for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r])
            }
            return e
        },
        _n = function e(t, n, r) {
            null === t && (t = Function.prototype);
            var i = Object.getOwnPropertyDescriptor(t, n);
            if (void 0 === i) {
                var o = Object.getPrototypeOf(t);
                return null === o ? void 0 : e(o, n, r)
            }
            if ("value" in i) return i.value;
            var a = i.get;
            return void 0 !== a ? a.call(r) : void 0
        },
        In = function(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        };

    function Dn(e) {
        return parseInt(e)
    }

    function Nn(e) {
        return "string" == typeof e
    }

    function Hn(e) {
        var t = void 0 === e ? "undefined" : En(e);
        return "function" === t || "object" === t && !!e
    }

    function Pn(e) {
        return "function" == typeof e
    }

    function Ln(e) {
        return void 0 === e
    }

    function Mn(e) {
        return e.constructor === Array
    }

    function qn(e, t, n) {
        var r = {};
        for (var i in t) Pn(t[i]) ? r[i] = t[i](e, r, n) : Sn("Extension must be a function");
        for (var o in r) Pn(r[o].mount) && r[o].mount();
        return r
    }

    function Bn(e, t, n) {
        Object.defineProperty(e, t, n)
    }

    function Rn(e, t) {
        var n = On({}, e, t);
        return t.hasOwnProperty("classes") && (n.classes = On({}, e.classes, t.classes), t.classes.hasOwnProperty("direction") && (n.classes.direction = On({}, e.classes.direction, t.classes.direction))), t.hasOwnProperty("breakpoints") && (n.breakpoints = On({}, e.breakpoints, t.breakpoints)), n
    }
    var zn = function() {
            function e() {
                var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                jn(this, e), this.events = t, this.hop = t.hasOwnProperty
            }
            return An(e, [{
                key: "on",
                value: function(e, t) {
                    if (Mn(e))
                        for (var n = 0; n < e.length; n++) this.on(e[n], t);
                    this.hop.call(this.events, e) || (this.events[e] = []);
                    var r = this.events[e].push(t) - 1;
                    return {
                        remove: function() {
                            delete this.events[e][r]
                        }
                    }
                }
            }, {
                key: "emit",
                value: function(e, t) {
                    if (Mn(e))
                        for (var n = 0; n < e.length; n++) this.emit(e[n], t);
                    this.hop.call(this.events, e) && this.events[e].forEach((function(e) {
                        e(t || {})
                    }))
                }
            }]), e
        }(),
        Fn = function() {
            function e(t) {
                var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
                jn(this, e), this._c = {}, this._t = [], this._e = new zn, this.disabled = !1, this.selector = t, this.settings = Rn(kn, n), this.index = this.settings.startAt
            }
            return An(e, [{
                key: "mount",
                value: function() {
                    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                    return this._e.emit("mount.before"), Hn(e) ? this._c = qn(this, e, this._e) : Sn("You need to provide a object on `mount()`"), this._e.emit("mount.after"), this
                }
            }, {
                key: "mutate",
                value: function() {
                    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [];
                    return Mn(e) ? this._t = e : Sn("You need to provide a array on `mutate()`"), this
                }
            }, {
                key: "update",
                value: function() {
                    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                    return this.settings = Rn(this.settings, e), e.hasOwnProperty("startAt") && (this.index = e.startAt), this._e.emit("update"), this
                }
            }, {
                key: "go",
                value: function(e) {
                    return this._c.Run.make(e), this
                }
            }, {
                key: "move",
                value: function(e) {
                    return this._c.Transition.disable(), this._c.Move.make(e), this
                }
            }, {
                key: "destroy",
                value: function() {
                    return this._e.emit("destroy"), this
                }
            }, {
                key: "play",
                value: function() {
                    var e = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
                    return e && (this.settings.autoplay = e), this._e.emit("play"), this
                }
            }, {
                key: "pause",
                value: function() {
                    return this._e.emit("pause"), this
                }
            }, {
                key: "disable",
                value: function() {
                    return this.disabled = !0, this
                }
            }, {
                key: "enable",
                value: function() {
                    return this.disabled = !1, this
                }
            }, {
                key: "on",
                value: function(e, t) {
                    return this._e.on(e, t), this
                }
            }, {
                key: "isType",
                value: function(e) {
                    return this.settings.type === e
                }
            }, {
                key: "settings",
                get: function() {
                    return this._o
                },
                set: function(e) {
                    Hn(e) ? this._o = e : Sn("Options must be an `object` instance.")
                }
            }, {
                key: "index",
                get: function() {
                    return this._i
                },
                set: function(e) {
                    this._i = Dn(e)
                }
            }, {
                key: "type",
                get: function() {
                    return this.settings.type
                }
            }, {
                key: "disabled",
                get: function() {
                    return this._d
                },
                set: function(e) {
                    this._d = !!e
                }
            }]), e
        }();

    function Wn() {
        return (new Date).getTime()
    }

    function $n(e, t, n) {
        var r = void 0,
            i = void 0,
            o = void 0,
            a = void 0,
            u = 0;
        n || (n = {});
        var s = function() {
                u = !1 === n.leading ? 0 : Wn(), r = null, a = e.apply(i, o), r || (i = o = null)
            },
            c = function() {
                var c = Wn();
                u || !1 !== n.leading || (u = c);
                var l = t - (c - u);
                return i = this, o = arguments, l <= 0 || l > t ? (r && (clearTimeout(r), r = null), u = c, a = e.apply(i, o), r || (i = o = null)) : r || !1 === n.trailing || (r = setTimeout(s, l)), a
            };
        return c.cancel = function() {
            clearTimeout(r), u = 0, r = i = o = null
        }, c
    }
    var Un = {
        ltr: ["marginLeft", "marginRight"],
        rtl: ["marginRight", "marginLeft"]
    };

    function Vn(e) {
        if (e && e.parentNode) {
            for (var t = e.parentNode.firstChild, n = []; t; t = t.nextSibling) 1 === t.nodeType && t !== e && n.push(t);
            return n
        }
        return []
    }

    function Xn(e) {
        return !!(e && e instanceof window.HTMLElement)
    }
    var Gn = function() {
        function e() {
            var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
            jn(this, e), this.listeners = t
        }
        return An(e, [{
            key: "on",
            value: function(e, t, n) {
                var r = arguments.length > 3 && void 0 !== arguments[3] && arguments[3];
                Nn(e) && (e = [e]);
                for (var i = 0; i < e.length; i++) this.listeners[e[i]] = n, t.addEventListener(e[i], this.listeners[e[i]], r)
            }
        }, {
            key: "off",
            value: function(e, t) {
                var n = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
                Nn(e) && (e = [e]);
                for (var r = 0; r < e.length; r++) t.removeEventListener(e[r], this.listeners[e[r]], n)
            }
        }, {
            key: "destroy",
            value: function() {
                delete this.listeners
            }
        }]), e
    }();
    var Qn = ["ltr", "rtl"],
        Yn = {
            ">": "<",
            "<": ">",
            "=": "="
        };

    function Kn(e, t) {
        return {
            modify: function(e) {
                return t.Direction.is("rtl") ? -e : e
            }
        }
    }

    function Zn(e, t) {
        return {
            modify: function(n) {
                return n + t.Gaps.value * e.index
            }
        }
    }

    function Jn(e, t) {
        return {
            modify: function(e) {
                return e + t.Clones.grow / 2
            }
        }
    }

    function er(e, t) {
        return {
            modify: function(n) {
                if (e.settings.focusAt >= 0) {
                    var r = t.Peek.value;
                    return Hn(r) ? n - r.before : n - r
                }
                return n
            }
        }
    }

    function tr(e, t) {
        return {
            modify: function(n) {
                var r = t.Gaps.value,
                    i = t.Sizes.width,
                    o = e.settings.focusAt,
                    a = t.Sizes.slideWidth;
                return "center" === o ? n - (i / 2 - a / 2) : n - a * o - r * o
            }
        }
    }
    var nr = !1;
    try {
        var rr = Object.defineProperty({}, "passive", {
            get: function() {
                nr = !0
            }
        });
        window.addEventListener("testPassive", null, rr), window.removeEventListener("testPassive", null, rr)
    } catch (e) {}
    var ir = nr,
        or = ["touchstart", "mousedown"],
        ar = ["touchmove", "mousemove"],
        ur = ["touchend", "touchcancel", "mouseup", "mouseleave"],
        sr = ["mousedown", "mousemove", "mouseup", "mouseleave"];

    function cr(e) {
        return Hn(e) ? (t = e, Object.keys(t).sort().reduce((function(e, n) {
            return e[n] = t[n], e[n], e
        }), {})) : (Sn("Breakpoints option must be an object"), {});
        var t
    }
    var lr = {
            Html: function(e, t) {
                var n = {
                    mount: function() {
                        this.root = e.selector, this.track = this.root.querySelector('[data-glide-el="track"]'), this.slides = Array.prototype.slice.call(this.wrapper.children).filter((function(t) {
                            return !t.classList.contains(e.settings.classes.cloneSlide)
                        }))
                    }
                };
                return Bn(n, "root", {
                    get: function() {
                        return n._r
                    },
                    set: function(e) {
                        Nn(e) && (e = document.querySelector(e)), Xn(e) ? n._r = e : Sn("Root element must be a existing Html node")
                    }
                }), Bn(n, "track", {
                    get: function() {
                        return n._t
                    },
                    set: function(e) {
                        Xn(e) ? n._t = e : Sn('Could not find track element. Please use [data-glide-el="track"] attribute.')
                    }
                }), Bn(n, "wrapper", {
                    get: function() {
                        return n.track.children[0]
                    }
                }), n
            },
            Translate: function(e, t, n) {
                var r = {
                    set: function(n) {
                        var r = function(e, t, n) {
                            var r = [Zn, Jn, er, tr].concat(e._t, [Kn]);
                            return {
                                mutate: function(i) {
                                    for (var o = 0; o < r.length; o++) {
                                        var a = r[o];
                                        Pn(a) && Pn(a().modify) ? i = a(e, t, n).modify(i) : Sn("Transformer should be a function that returns an object with `modify()` method")
                                    }
                                    return i
                                }
                            }
                        }(e, t).mutate(n);
                        t.Html.wrapper.style.transform = "translate3d(" + -1 * r + "px, 0px, 0px)"
                    },
                    remove: function() {
                        t.Html.wrapper.style.transform = ""
                    }
                };
                return n.on("move", (function(i) {
                    var o = t.Gaps.value,
                        a = t.Sizes.length,
                        u = t.Sizes.slideWidth;
                    return e.isType("carousel") && t.Run.isOffset("<") ? (t.Transition.after((function() {
                        n.emit("translate.jump"), r.set(u * (a - 1))
                    })), r.set(-u - o * a)) : e.isType("carousel") && t.Run.isOffset(">") ? (t.Transition.after((function() {
                        n.emit("translate.jump"), r.set(0)
                    })), r.set(u * a + o * a)) : r.set(i.movement)
                })), n.on("destroy", (function() {
                    r.remove()
                })), r
            },
            Transition: function(e, t, n) {
                var r = !1,
                    i = {
                        compose: function(t) {
                            var n = e.settings;
                            return r ? t + " 0ms " + n.animationTimingFunc : t + " " + this.duration + "ms " + n.animationTimingFunc
                        },
                        set: function() {
                            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "transform";
                            t.Html.wrapper.style.transition = this.compose(e)
                        },
                        remove: function() {
                            t.Html.wrapper.style.transition = ""
                        },
                        after: function(e) {
                            setTimeout((function() {
                                e()
                            }), this.duration)
                        },
                        enable: function() {
                            r = !1, this.set()
                        },
                        disable: function() {
                            r = !0, this.set()
                        }
                    };
                return Bn(i, "duration", {
                    get: function() {
                        var n = e.settings;
                        return e.isType("slider") && t.Run.offset ? n.rewindDuration : n.animationDuration
                    }
                }), n.on("move", (function() {
                    i.set()
                })), n.on(["build.before", "resize", "translate.jump"], (function() {
                    i.disable()
                })), n.on("run", (function() {
                    i.enable()
                })), n.on("destroy", (function() {
                    i.remove()
                })), i
            },
            Direction: function(e, t, n) {
                var r = {
                    mount: function() {
                        this.value = e.settings.direction
                    },
                    resolve: function(e) {
                        var t = e.slice(0, 1);
                        return this.is("rtl") ? e.split(t).join(Yn[t]) : e
                    },
                    is: function(e) {
                        return this.value === e
                    },
                    addClass: function() {
                        t.Html.root.classList.add(e.settings.classes.direction[this.value])
                    },
                    removeClass: function() {
                        t.Html.root.classList.remove(e.settings.classes.direction[this.value])
                    }
                };
                return Bn(r, "value", {
                    get: function() {
                        return r._v
                    },
                    set: function(e) {
                        Qn.indexOf(e) > -1 ? r._v = e : Sn("Direction value must be `ltr` or `rtl`")
                    }
                }), n.on(["destroy", "update"], (function() {
                    r.removeClass()
                })), n.on("update", (function() {
                    r.mount()
                })), n.on(["build.before", "update"], (function() {
                    r.addClass()
                })), r
            },
            Peek: function(e, t, n) {
                var r = {
                    mount: function() {
                        this.value = e.settings.peek
                    }
                };
                return Bn(r, "value", {
                    get: function() {
                        return r._v
                    },
                    set: function(e) {
                        Hn(e) ? (e.before = Dn(e.before), e.after = Dn(e.after)) : e = Dn(e), r._v = e
                    }
                }), Bn(r, "reductor", {
                    get: function() {
                        var t = r.value,
                            n = e.settings.perView;
                        return Hn(t) ? t.before / n + t.after / n : 2 * t / n
                    }
                }), n.on(["resize", "update"], (function() {
                    r.mount()
                })), r
            },
            Sizes: function(e, t, n) {
                var r = {
                    setupSlides: function() {
                        for (var e = this.slideWidth + "px", n = t.Html.slides, r = 0; r < n.length; r++) n[r].style.width = e
                    },
                    setupWrapper: function(e) {
                        t.Html.wrapper.style.width = this.wrapperSize + "px"
                    },
                    remove: function() {
                        for (var e = t.Html.slides, n = 0; n < e.length; n++) e[n].style.width = "";
                        t.Html.wrapper.style.width = ""
                    }
                };
                return Bn(r, "length", {
                    get: function() {
                        return t.Html.slides.length
                    }
                }), Bn(r, "width", {
                    get: function() {
                        return t.Html.root.offsetWidth
                    }
                }), Bn(r, "wrapperSize", {
                    get: function() {
                        return r.slideWidth * r.length + t.Gaps.grow + t.Clones.grow
                    }
                }), Bn(r, "slideWidth", {
                    get: function() {
                        return r.width / e.settings.perView - t.Peek.reductor - t.Gaps.reductor
                    }
                }), n.on(["build.before", "resize", "update"], (function() {
                    r.setupSlides(), r.setupWrapper()
                })), n.on("destroy", (function() {
                    r.remove()
                })), r
            },
            Gaps: function(e, t, n) {
                var r = {
                    apply: function(e) {
                        for (var n = 0, r = e.length; n < r; n++) {
                            var i = e[n].style,
                                o = t.Direction.value;
                            i[Un[o][0]] = 0 !== n ? this.value / 2 + "px" : "", n !== e.length - 1 ? i[Un[o][1]] = this.value / 2 + "px" : i[Un[o][1]] = ""
                        }
                    },
                    remove: function(e) {
                        for (var t = 0, n = e.length; t < n; t++) {
                            var r = e[t].style;
                            r.marginLeft = "", r.marginRight = ""
                        }
                    }
                };
                return Bn(r, "value", {
                    get: function() {
                        return Dn(e.settings.gap)
                    }
                }), Bn(r, "grow", {
                    get: function() {
                        return r.value * (t.Sizes.length - 1)
                    }
                }), Bn(r, "reductor", {
                    get: function() {
                        var t = e.settings.perView;
                        return r.value * (t - 1) / t
                    }
                }), n.on(["build.after", "update"], $n((function() {
                    r.apply(t.Html.wrapper.children)
                }), 30)), n.on("destroy", (function() {
                    r.remove(t.Html.wrapper.children)
                })), r
            },
            Move: function(e, t, n) {
                var r = {
                    mount: function() {
                        this._o = 0
                    },
                    make: function() {
                        var e = this,
                            r = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0;
                        this.offset = r, n.emit("move", {
                            movement: this.value
                        }), t.Transition.after((function() {
                            n.emit("move.after", {
                                movement: e.value
                            })
                        }))
                    }
                };
                return Bn(r, "offset", {
                    get: function() {
                        return r._o
                    },
                    set: function(e) {
                        r._o = Ln(e) ? 0 : Dn(e)
                    }
                }), Bn(r, "translate", {
                    get: function() {
                        return t.Sizes.slideWidth * e.index
                    }
                }), Bn(r, "value", {
                    get: function() {
                        var e = this.offset,
                            n = this.translate;
                        return t.Direction.is("rtl") ? n + e : n - e
                    }
                }), n.on(["build.before", "run"], (function() {
                    r.make()
                })), r
            },
            Clones: function(e, t, n) {
                var r = {
                    mount: function() {
                        this.items = [], e.isType("carousel") && (this.items = this.collect())
                    },
                    collect: function() {
                        for (var n = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [], r = t.Html.slides, i = e.settings, o = i.perView, a = i.classes, u = +!!e.settings.peek, s = o + u, c = r.slice(0, s), l = r.slice(-s), f = 0; f < Math.max(1, Math.floor(o / r.length)); f++) {
                            for (var d = 0; d < c.length; d++) {
                                var p = c[d].cloneNode(!0);
                                p.classList.add(a.cloneSlide), n.push(p)
                            }
                            for (var h = 0; h < l.length; h++) {
                                var m = l[h].cloneNode(!0);
                                m.classList.add(a.cloneSlide), n.unshift(m)
                            }
                        }
                        return n
                    },
                    append: function() {
                        for (var e = this.items, n = t.Html, r = n.wrapper, i = n.slides, o = Math.floor(e.length / 2), a = e.slice(0, o).reverse(), u = e.slice(o, e.length), s = t.Sizes.slideWidth + "px", c = 0; c < u.length; c++) r.appendChild(u[c]);
                        for (var l = 0; l < a.length; l++) r.insertBefore(a[l], i[0]);
                        for (var f = 0; f < e.length; f++) e[f].style.width = s
                    },
                    remove: function() {
                        for (var e = this.items, n = 0; n < e.length; n++) t.Html.wrapper.removeChild(e[n])
                    }
                };
                return Bn(r, "grow", {
                    get: function() {
                        return (t.Sizes.slideWidth + t.Gaps.value) * r.items.length
                    }
                }), n.on("update", (function() {
                    r.remove(), r.mount(), r.append()
                })), n.on("build.before", (function() {
                    e.isType("carousel") && r.append()
                })), n.on("destroy", (function() {
                    r.remove()
                })), r
            },
            Resize: function(e, t, n) {
                var r = new Gn,
                    i = {
                        mount: function() {
                            this.bind()
                        },
                        bind: function() {
                            r.on("resize", window, $n((function() {
                                n.emit("resize")
                            }), e.settings.throttle))
                        },
                        unbind: function() {
                            r.off("resize", window)
                        }
                    };
                return n.on("destroy", (function() {
                    i.unbind(), r.destroy()
                })), i
            },
            Build: function(e, t, n) {
                var r = {
                    mount: function() {
                        n.emit("build.before"), this.typeClass(), this.activeClass(), n.emit("build.after")
                    },
                    typeClass: function() {
                        t.Html.root.classList.add(e.settings.classes[e.settings.type])
                    },
                    activeClass: function() {
                        var n = e.settings.classes,
                            r = t.Html.slides[e.index];
                        r && (r.classList.add(n.activeSlide), Vn(r).forEach((function(e) {
                            e.classList.remove(n.activeSlide)
                        })))
                    },
                    removeClasses: function() {
                        var n = e.settings.classes;
                        t.Html.root.classList.remove(n[e.settings.type]), t.Html.slides.forEach((function(e) {
                            e.classList.remove(n.activeSlide)
                        }))
                    }
                };
                return n.on(["destroy", "update"], (function() {
                    r.removeClasses()
                })), n.on(["resize", "update"], (function() {
                    r.mount()
                })), n.on("move.after", (function() {
                    r.activeClass()
                })), r
            },
            Run: function(e, t, n) {
                var r = {
                    mount: function() {
                        this._o = !1
                    },
                    make: function(r) {
                        var i = this;
                        e.disabled || (e.disable(), this.move = r, n.emit("run.before", this.move), this.calculate(), n.emit("run", this.move), t.Transition.after((function() {
                            i.isStart() && n.emit("run.start", i.move), i.isEnd() && n.emit("run.end", i.move), (i.isOffset("<") || i.isOffset(">")) && (i._o = !1, n.emit("run.offset", i.move)), n.emit("run.after", i.move), e.enable()
                        })))
                    },
                    calculate: function() {
                        var t = this.move,
                            n = this.length,
                            r = t.steps,
                            i = t.direction,
                            o = "number" == typeof Dn(r) && 0 !== Dn(r);
                        switch (i) {
                            case ">":
                                ">" === r ? e.index = n : this.isEnd() ? e.isType("slider") && !e.settings.rewind || (this._o = !0, e.index = 0) : o ? e.index += Math.min(n - e.index, -Dn(r)) : e.index++;
                                break;
                            case "<":
                                "<" === r ? e.index = 0 : this.isStart() ? e.isType("slider") && !e.settings.rewind || (this._o = !0, e.index = n) : o ? e.index -= Math.min(e.index, Dn(r)) : e.index--;
                                break;
                            case "=":
                                e.index = r;
                                break;
                            default:
                                Sn("Invalid direction pattern [" + i + r + "] has been used")
                        }
                    },
                    isStart: function() {
                        return 0 === e.index
                    },
                    isEnd: function() {
                        return e.index === this.length
                    },
                    isOffset: function(e) {
                        return this._o && this.move.direction === e
                    }
                };
                return Bn(r, "move", {
                    get: function() {
                        return this._m
                    },
                    set: function(e) {
                        var t = e.substr(1);
                        this._m = {
                            direction: e.substr(0, 1),
                            steps: t ? Dn(t) ? Dn(t) : t : 0
                        }
                    }
                }), Bn(r, "length", {
                    get: function() {
                        var n = e.settings,
                            r = t.Html.slides.length;
                        return e.isType("slider") && "center" !== n.focusAt && n.bound ? r - 1 - (Dn(n.perView) - 1) + Dn(n.focusAt) : r - 1
                    }
                }), Bn(r, "offset", {
                    get: function() {
                        return this._o
                    }
                }), r
            },
            Swipe: function(e, t, n) {
                var r = new Gn,
                    i = 0,
                    o = 0,
                    a = 0,
                    u = !1,
                    s = !!ir && {
                        passive: !0
                    },
                    c = {
                        mount: function() {
                            this.bindSwipeStart()
                        },
                        start: function(t) {
                            if (!u && !e.disabled) {
                                this.disable();
                                var r = this.touches(t);
                                i = null, o = Dn(r.pageX), a = Dn(r.pageY), this.bindSwipeMove(), this.bindSwipeEnd(), n.emit("swipe.start")
                            }
                        },
                        move: function(r) {
                            if (!e.disabled) {
                                var u = e.settings,
                                    s = u.touchAngle,
                                    c = u.touchRatio,
                                    l = u.classes,
                                    f = this.touches(r),
                                    d = Dn(f.pageX) - o,
                                    p = Dn(f.pageY) - a,
                                    h = Math.abs(d << 2),
                                    m = Math.abs(p << 2),
                                    v = Math.sqrt(h + m),
                                    g = Math.sqrt(m);
                                if (!(180 * (i = Math.asin(g / v)) / Math.PI < s)) return !1;
                                r.stopPropagation(), t.Move.make(d * parseFloat(c)), t.Html.root.classList.add(l.dragging), n.emit("swipe.move")
                            }
                        },
                        end: function(r) {
                            if (!e.disabled) {
                                var a = e.settings,
                                    u = this.touches(r),
                                    s = this.threshold(r),
                                    c = u.pageX - o,
                                    l = 180 * i / Math.PI,
                                    f = Math.round(c / t.Sizes.slideWidth);
                                this.enable(), c > s && l < a.touchAngle ? (a.perTouch && (f = Math.min(f, Dn(a.perTouch))), t.Direction.is("rtl") && (f = -f), t.Run.make(t.Direction.resolve("<" + f))) : c < -s && l < a.touchAngle ? (a.perTouch && (f = Math.max(f, -Dn(a.perTouch))), t.Direction.is("rtl") && (f = -f), t.Run.make(t.Direction.resolve(">" + f))) : t.Move.make(), t.Html.root.classList.remove(a.classes.dragging), this.unbindSwipeMove(), this.unbindSwipeEnd(), n.emit("swipe.end")
                            }
                        },
                        bindSwipeStart: function() {
                            var n = this,
                                i = e.settings;
                            i.swipeThreshold && r.on(or[0], t.Html.wrapper, (function(e) {
                                n.start(e)
                            }), s), i.dragThreshold && r.on(or[1], t.Html.wrapper, (function(e) {
                                n.start(e)
                            }), s)
                        },
                        unbindSwipeStart: function() {
                            r.off(or[0], t.Html.wrapper, s), r.off(or[1], t.Html.wrapper, s)
                        },
                        bindSwipeMove: function() {
                            var n = this;
                            r.on(ar, t.Html.wrapper, $n((function(e) {
                                n.move(e)
                            }), e.settings.throttle), s)
                        },
                        unbindSwipeMove: function() {
                            r.off(ar, t.Html.wrapper, s)
                        },
                        bindSwipeEnd: function() {
                            var e = this;
                            r.on(ur, t.Html.wrapper, (function(t) {
                                e.end(t)
                            }))
                        },
                        unbindSwipeEnd: function() {
                            r.off(ur, t.Html.wrapper)
                        },
                        touches: function(e) {
                            return sr.indexOf(e.type) > -1 ? e : e.touches[0] || e.changedTouches[0]
                        },
                        threshold: function(t) {
                            var n = e.settings;
                            return sr.indexOf(t.type) > -1 ? n.dragThreshold : n.swipeThreshold
                        },
                        enable: function() {
                            return u = !1, t.Transition.enable(), this
                        },
                        disable: function() {
                            return u = !0, t.Transition.disable(), this
                        }
                    };
                return n.on("build.after", (function() {
                    t.Html.root.classList.add(e.settings.classes.swipeable)
                })), n.on("destroy", (function() {
                    c.unbindSwipeStart(), c.unbindSwipeMove(), c.unbindSwipeEnd(), r.destroy()
                })), c
            },
            Images: function(e, t, n) {
                var r = new Gn,
                    i = {
                        mount: function() {
                            this.bind()
                        },
                        bind: function() {
                            r.on("dragstart", t.Html.wrapper, this.dragstart)
                        },
                        unbind: function() {
                            r.off("dragstart", t.Html.wrapper)
                        },
                        dragstart: function(e) {
                            e.preventDefault()
                        }
                    };
                return n.on("destroy", (function() {
                    i.unbind(), r.destroy()
                })), i
            },
            Anchors: function(e, t, n) {
                var r = new Gn,
                    i = !1,
                    o = !1,
                    a = {
                        mount: function() {
                            this._a = t.Html.wrapper.querySelectorAll("a"), this.bind()
                        },
                        bind: function() {
                            r.on("click", t.Html.wrapper, this.click)
                        },
                        unbind: function() {
                            r.off("click", t.Html.wrapper)
                        },
                        click: function(e) {
                            o && (e.stopPropagation(), e.preventDefault())
                        },
                        detach: function() {
                            if (o = !0, !i) {
                                for (var e = 0; e < this.items.length; e++) this.items[e].draggable = !1, this.items[e].setAttribute("data-href", this.items[e].getAttribute("href")), this.items[e].removeAttribute("href");
                                i = !0
                            }
                            return this
                        },
                        attach: function() {
                            if (o = !1, i) {
                                for (var e = 0; e < this.items.length; e++) this.items[e].draggable = !0, this.items[e].setAttribute("href", this.items[e].getAttribute("data-href"));
                                i = !1
                            }
                            return this
                        }
                    };
                return Bn(a, "items", {
                    get: function() {
                        return a._a
                    }
                }), n.on("swipe.move", (function() {
                    a.detach()
                })), n.on("swipe.end", (function() {
                    t.Transition.after((function() {
                        a.attach()
                    }))
                })), n.on("destroy", (function() {
                    a.attach(), a.unbind(), r.destroy()
                })), a
            },
            Controls: function(e, t, n) {
                var r = new Gn,
                    i = !!ir && {
                        passive: !0
                    },
                    o = {
                        mount: function() {
                            this._n = t.Html.root.querySelectorAll('[data-glide-el="controls[nav]"]'), this._c = t.Html.root.querySelectorAll('[data-glide-el^="controls"]'), this.addBindings()
                        },
                        setActive: function() {
                            for (var e = 0; e < this._n.length; e++) this.addClass(this._n[e].children)
                        },
                        removeActive: function() {
                            for (var e = 0; e < this._n.length; e++) this.removeClass(this._n[e].children)
                        },
                        addClass: function(t) {
                            var n = e.settings,
                                r = t[e.index];
                            r && (r.classList.add(n.classes.activeNav), Vn(r).forEach((function(e) {
                                e.classList.remove(n.classes.activeNav)
                            })))
                        },
                        removeClass: function(t) {
                            var n = t[e.index];
                            n && n.classList.remove(e.settings.classes.activeNav)
                        },
                        addBindings: function() {
                            for (var e = 0; e < this._c.length; e++) this.bind(this._c[e].children)
                        },
                        removeBindings: function() {
                            for (var e = 0; e < this._c.length; e++) this.unbind(this._c[e].children)
                        },
                        bind: function(e) {
                            for (var t = 0; t < e.length; t++) r.on("click", e[t], this.click), r.on("touchstart", e[t], this.click, i)
                        },
                        unbind: function(e) {
                            for (var t = 0; t < e.length; t++) r.off(["click", "touchstart"], e[t])
                        },
                        click: function(e) {
                            e.preventDefault(), t.Run.make(t.Direction.resolve(e.currentTarget.getAttribute("data-glide-dir")))
                        }
                    };
                return Bn(o, "items", {
                    get: function() {
                        return o._c
                    }
                }), n.on(["mount.after", "move.after"], (function() {
                    o.setActive()
                })), n.on("destroy", (function() {
                    o.removeBindings(), o.removeActive(), r.destroy()
                })), o
            },
            Keyboard: function(e, t, n) {
                var r = new Gn,
                    i = {
                        mount: function() {
                            e.settings.keyboard && this.bind()
                        },
                        bind: function() {
                            r.on("keyup", document, this.press)
                        },
                        unbind: function() {
                            r.off("keyup", document)
                        },
                        press: function(e) {
                            39 === e.keyCode && t.Run.make(t.Direction.resolve(">")), 37 === e.keyCode && t.Run.make(t.Direction.resolve("<"))
                        }
                    };
                return n.on(["destroy", "update"], (function() {
                    i.unbind()
                })), n.on("update", (function() {
                    i.mount()
                })), n.on("destroy", (function() {
                    r.destroy()
                })), i
            },
            Autoplay: function(e, t, n) {
                var r = new Gn,
                    i = {
                        mount: function() {
                            this.start(), e.settings.hoverpause && this.bind()
                        },
                        start: function() {
                            var n = this;
                            e.settings.autoplay && Ln(this._i) && (this._i = setInterval((function() {
                                n.stop(), t.Run.make(">"), n.start()
                            }), this.time))
                        },
                        stop: function() {
                            this._i = clearInterval(this._i)
                        },
                        bind: function() {
                            var e = this;
                            r.on("mouseover", t.Html.root, (function() {
                                e.stop()
                            })), r.on("mouseout", t.Html.root, (function() {
                                e.start()
                            }))
                        },
                        unbind: function() {
                            r.off(["mouseover", "mouseout"], t.Html.root)
                        }
                    };
                return Bn(i, "time", {
                    get: function() {
                        var n = t.Html.slides[e.index].getAttribute("data-glide-autoplay");
                        return Dn(n || e.settings.autoplay)
                    }
                }), n.on(["destroy", "update"], (function() {
                    i.unbind()
                })), n.on(["run.before", "pause", "destroy", "swipe.start", "update"], (function() {
                    i.stop()
                })), n.on(["run.after", "play", "swipe.end"], (function() {
                    i.start()
                })), n.on("update", (function() {
                    i.mount()
                })), n.on("destroy", (function() {
                    r.destroy()
                })), i
            },
            Breakpoints: function(e, t, n) {
                var r = new Gn,
                    i = e.settings,
                    o = cr(i.breakpoints),
                    a = On({}, i),
                    u = {
                        match: function(e) {
                            if (void 0 !== window.matchMedia)
                                for (var t in e)
                                    if (e.hasOwnProperty(t) && window.matchMedia("(max-width: " + t + "px)").matches) return e[t];
                            return a
                        }
                    };
                return On(i, u.match(o)), r.on("resize", window, $n((function() {
                    e.settings = Rn(i, u.match(o))
                }), e.settings.throttle)), n.on("update", (function() {
                    o = cr(o), a = On({}, i)
                })), n.on("destroy", (function() {
                    r.off("resize", window)
                })), u
            }
        },
        fr = (function(e) {
            function t() {
                return jn(this, t), In(this, (t.__proto__ || Object.getPrototypeOf(t)).apply(this, arguments))
            }(function(e, t) {
                if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
            })(t, e), An(t, [{
                key: "mount",
                value: function() {
                    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                    return _n(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "mount", this).call(this, On({}, lr, e))
                }
            }])
        }(Fn), n(4), n(5), o()(window)),
        dr = o()("body,html"),
        pr = o()("body"),
        hr = (o()("#preloader"), o()("main")),
        mr = o()("header"),
        vr = o()(".nav-menu"),
        gr = o()(".menu-button");

    function yr() {
        vr.css("top", mr.outerHeight()), hr.css({
            paddingTop: mr.outerHeight()
        })
    }

    function br(e) {
        e ? (xr(!0), vr.addClass("visible"), gr.find(".open").removeClass("visible"), gr.find(".close").addClass("visible")) : (xr(!1), vr.removeClass("visible"), gr.find(".close").removeClass("visible"), gr.find(".open").addClass("visible"))
    }

    function xr(e) {
        e ? pr.addClass("no-scroll") : pr.removeClass("no-scroll")
    }
    fr.on("load", (function() {
        setTimeout((function() {}), 1e3)
    })).on("resize", ft(yr, 500)), o()((function() {
        o()(".scroll-link").on("click", (function(e) {
            var t, n = o()(("" == (t = o()(this).attr("href").replace("/", "")) && (t = "inicio"), "#".concat(t)));
            n.length > 0 && (e.preventDefault(), function(e) {
                e.length > 0 && dr.animate({
                    scrollTop: e.offset().top - mr.outerHeight()
                }, 1e3, "easeInOutExpo")
            }(n), fr.outerWidth() < 768 && br(!1))
        })), gr.on("click", (function() {
            br(!vr.hasClass("visible"))
        })), yr(), o()(".height-100").each((function() {
            var e = fr.height() - mr.outerHeight();
            e > o()(this).find(".content").outerHeight() ? o()(this).css("height", e) : o()(this).css("height", "auto")
        })), o()("#busqueda-form").on("submit", (function(e) {
            e.preventDefault(), window.location = "/busqueda"
        }))
    }))
}]);