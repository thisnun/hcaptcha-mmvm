/* { "version": "1", "hash": "MEYCIQCCnHPGv7ii3bBa1Sdl81c0+jduDUM4NS3HfPnU4tK1QwIhAOB0r9rR238/QQ1xlr1hxlDrnG8JdZaPn1E93o5RX7CJ" } */
/* https://hcaptcha.com/license */
!function() {
    "use strict";
    function e(e) {
        var t = this.constructor;
        return this.then((function(n) {
                return t.resolve(e()).then((function() {
                        return n
                    }
                ))
            }
        ), (function(n) {
                return t.resolve(e()).then((function() {
                        return t.reject(n)
                    }
                ))
            }
        ))
    }
    function t(e) {
        return new this((function(t, n) {
                if (!e || "undefined" == typeof e.length)
                    return n(new TypeError(typeof e + " " + e + " is not iterable(cannot read property Symbol(Symbol.iterator))"));
                var r = Array.prototype.slice.call(e);
                if (0 === r.length)
                    return t([]);
                var i = r.length;
                function o(e, n) {
                    if (n && ("object" == typeof n || "function" == typeof n)) {
                        var a = n.then;
                        if ("function" == typeof a)
                            return void a.call(n, (function(t) {
                                    o(e, t)
                                }
                            ), (function(n) {
                                    r[e] = {
                                        status: "rejected",
                                        reason: n
                                    },
                                    0 == --i && t(r)
                                }
                            ))
                    }
                    r[e] = {
                        status: "fulfilled",
                        value: n
                    },
                    0 == --i && t(r)
                }
                for (var a = 0; a < r.length; a++)
                    o(a, r[a])
            }
        ))
    }
    var n = setTimeout
        , r = "undefined" != typeof setImmediate ? setImmediate : null;
    function i(e) {
        return Boolean(e && "undefined" != typeof e.length)
    }
    function o() {}
    function a(e) {
        if (!(this instanceof a))
            throw new TypeError("Promises must be constructed via new");
        if ("function" != typeof e)
            throw new TypeError("not a function");
        this._state = 0,
            this._handled = !1,
            this._value = undefined,
            this._deferreds = [],
            p(e, this)
    }
    function s(e, t) {
        for (; 3 === e._state; )
            e = e._value;
        0 !== e._state ? (e._handled = !0,
            a._immediateFn((function() {
                    var n = 1 === e._state ? t.onFulfilled : t.onRejected;
                    if (null !== n) {
                        var r;
                        try {
                            r = n(e._value)
                        } catch (i) {
                            return void l(t.promise, i)
                        }
                        c(t.promise, r)
                    } else
                        (1 === e._state ? c : l)(t.promise, e._value)
                }
            ))) : e._deferreds.push(t)
    }
    function c(e, t) {
        try {
            if (t === e)
                throw new TypeError("A promise cannot be resolved with itself.");
            if (t && ("object" == typeof t || "function" == typeof t)) {
                var n = t.then;
                if (t instanceof a)
                    return e._state = 3,
                        e._value = t,
                        void h(e);
                if ("function" == typeof n)
                    return void p((r = n,
                            i = t,
                            function() {
                                r.apply(i, arguments)
                            }
                    ), e)
            }
            e._state = 1,
                e._value = t,
                h(e)
        } catch (o) {
            l(e, o)
        }
        var r, i
    }
    function l(e, t) {
        e._state = 2,
            e._value = t,
            h(e)
    }
    function h(e) {
        2 === e._state && 0 === e._deferreds.length && a._immediateFn((function() {
                e._handled || a._unhandledRejectionFn(e._value)
            }
        ));
        for (var t = 0, n = e._deferreds.length; t < n; t++)
            s(e, e._deferreds[t]);
        e._deferreds = null
    }
    function u(e, t, n) {
        this.onFulfilled = "function" == typeof e ? e : null,
            this.onRejected = "function" == typeof t ? t : null,
            this.promise = n
    }
    function p(e, t) {
        var n = !1;
        try {
            e((function(e) {
                    n || (n = !0,
                        c(t, e))
                }
            ), (function(e) {
                    n || (n = !0,
                        l(t, e))
                }
            ))
        } catch (r) {
            if (n)
                return;
            n = !0,
                l(t, r)
        }
    }
    a.prototype["catch"] = function(e) {
        return this.then(null, e)
    }
        ,
        a.prototype.then = function(e, t) {
            var n = new this.constructor(o);
            return s(this, new u(e,t,n)),
                n
        }
        ,
        a.prototype["finally"] = e,
        a.all = function(e) {
            return new a((function(t, n) {
                    if (!i(e))
                        return n(new TypeError("Promise.all accepts an array"));
                    var r = Array.prototype.slice.call(e);
                    if (0 === r.length)
                        return t([]);
                    var o = r.length;
                    function a(e, i) {
                        try {
                            if (i && ("object" == typeof i || "function" == typeof i)) {
                                var s = i.then;
                                if ("function" == typeof s)
                                    return void s.call(i, (function(t) {
                                            a(e, t)
                                        }
                                    ), n)
                            }
                            r[e] = i,
                            0 == --o && t(r)
                        } catch (c) {
                            n(c)
                        }
                    }
                    for (var s = 0; s < r.length; s++)
                        a(s, r[s])
                }
            ))
        }
        ,
        a.allSettled = t,
        a.resolve = function(e) {
            return e && "object" == typeof e && e.constructor === a ? e : new a((function(t) {
                    t(e)
                }
            ))
        }
        ,
        a.reject = function(e) {
            return new a((function(t, n) {
                    n(e)
                }
            ))
        }
        ,
        a.race = function(e) {
            return new a((function(t, n) {
                    if (!i(e))
                        return n(new TypeError("Promise.race accepts an array"));
                    for (var r = 0, o = e.length; r < o; r++)
                        a.resolve(e[r]).then(t, n)
                }
            ))
        }
        ,
        a._immediateFn = "function" == typeof r && function(e) {
                r(e)
            }
            || function(e) {
                n(e, 0)
            }
        ,
        a._unhandledRejectionFn = function(e) {
            "undefined" != typeof console && console && console.warn("Possible Unhandled Promise Rejection:", e)
        }
    ;
    var d = function() {
        if ("undefined" != typeof self)
            return self;
        if ("undefined" != typeof window)
            return window;
        if ("undefined" != typeof global)
            return global;
        throw new Error("unable to locate global object")
    }();
    function f(e, t, n) {
        return t <= e && e <= n
    }
    function m(e) {
        if (e === undefined)
            return {};
        if (e === Object(e))
            return e;
        throw TypeError("Could not convert argument to dictionary")
    }
    "function" != typeof d.Promise ? d.Promise = a : (d.Promise.prototype["finally"] || (d.Promise.prototype["finally"] = e),
    d.Promise.allSettled || (d.Promise.allSettled = t));
    var g = function(e) {
        return e >= 0 && e <= 127
    }
        , y = -1;
    function v(e) {
        this.tokens = [].slice.call(e),
            this.tokens.reverse()
    }
    v.prototype = {
        endOfStream: function() {
            return !this.tokens.length
        },
        read: function() {
            return this.tokens.length ? this.tokens.pop() : y
        },
        prepend: function(e) {
            if (Array.isArray(e))
                for (var t = e; t.length; )
                    this.tokens.push(t.pop());
            else
                this.tokens.push(e)
        },
        push: function(e) {
            if (Array.isArray(e))
                for (var t = e; t.length; )
                    this.tokens.unshift(t.shift());
            else
                this.tokens.unshift(e)
        }
    };
    var b = -1;
    function w(e, t) {
        if (e)
            throw TypeError("Decoder error");
        return t || 65533
    }
    function _(e) {
        return e = String(e).trim().toLowerCase(),
            Object.prototype.hasOwnProperty.call(E, e) ? E[e] : null
    }
    var E = {};
    [{
        encodings: [{
            labels: ["unicode-1-1-utf-8", "utf-8", "utf8"],
            name: "UTF-8"
        }],
        heading: "The Encoding"
    }].forEach((function(e) {
            e.encodings.forEach((function(e) {
                    e.labels.forEach((function(t) {
                            E[t] = e
                        }
                    ))
                }
            ))
        }
    ));
    var k, V = {
        "UTF-8": function(e) {
            return new U(e)
        }
    }, x = {
        "UTF-8": function(e) {
            return new M(e)
        }
    }, T = "utf-8";
    function S(e, t) {
        if (!(this instanceof S))
            throw TypeError("Called as a function. Did you forget 'new'?");
        e = e !== undefined ? String(e) : T,
            t = m(t),
            this._encoding = null,
            this._decoder = null,
            this._ignoreBOM = !1,
            this._BOMseen = !1,
            this._error_mode = "replacement",
            this._do_not_flush = !1;
        var n = _(e);
        if (null === n || "replacement" === n.name)
            throw RangeError("Unknown encoding: " + e);
        if (!x[n.name])
            throw Error("Decoder not present. Did you forget to include encoding-indexes.js first?");
        var r = this;
        return r._encoding = n,
        t.fatal && (r._error_mode = "fatal"),
        t.ignoreBOM && (r._ignoreBOM = !0),
        Object.defineProperty || (this.encoding = r._encoding.name.toLowerCase(),
            this.fatal = "fatal" === r._error_mode,
            this.ignoreBOM = r._ignoreBOM),
            r
    }
    function R(e, t) {
        if (!(this instanceof R))
            throw TypeError("Called as a function. Did you forget 'new'?");
        t = m(t),
            this._encoding = null,
            this._encoder = null,
            this._do_not_flush = !1,
            this._fatal = t.fatal ? "fatal" : "replacement";
        var n = this;
        if (t.NONSTANDARD_allowLegacyEncoding) {
            var r = _(e = e !== undefined ? String(e) : T);
            if (null === r || "replacement" === r.name)
                throw RangeError("Unknown encoding: " + e);
            if (!V[r.name])
                throw Error("Encoder not present. Did you forget to include encoding-indexes.js first?");
            n._encoding = r
        } else
            n._encoding = _("utf-8");
        return Object.defineProperty || (this.encoding = n._encoding.name.toLowerCase()),
            n
    }
    function M(e) {
        var t = e.fatal
            , n = 0
            , r = 0
            , i = 0
            , o = 128
            , a = 191;
        this.handler = function(e, s) {
            if (s === y && 0 !== i)
                return i = 0,
                    w(t);
            if (s === y)
                return b;
            if (0 === i) {
                if (f(s, 0, 127))
                    return s;
                if (f(s, 194, 223))
                    i = 1,
                        n = 31 & s;
                else if (f(s, 224, 239))
                    224 === s && (o = 160),
                    237 === s && (a = 159),
                        i = 2,
                        n = 15 & s;
                else {
                    if (!f(s, 240, 244))
                        return w(t);
                    240 === s && (o = 144),
                    244 === s && (a = 143),
                        i = 3,
                        n = 7 & s
                }
                return null
            }
            if (!f(s, o, a))
                return n = i = r = 0,
                    o = 128,
                    a = 191,
                    e.prepend(s),
                    w(t);
            if (o = 128,
                a = 191,
                n = n << 6 | 63 & s,
            (r += 1) !== i)
                return null;
            var c = n;
            return n = i = r = 0,
                c
        }
    }
    function U(e) {
        e.fatal;
        this.handler = function(e, t) {
            if (t === y)
                return b;
            if (g(t))
                return t;
            var n, r;
            f(t, 128, 2047) ? (n = 1,
                r = 192) : f(t, 2048, 65535) ? (n = 2,
                r = 224) : f(t, 65536, 1114111) && (n = 3,
                r = 240);
            for (var i = [(t >> 6 * n) + r]; n > 0; ) {
                var o = t >> 6 * (n - 1);
                i.push(128 | 63 & o),
                    n -= 1
            }
            return i
        }
    }
    Object.defineProperty && (Object.defineProperty(S.prototype, "encoding", {
        get: function() {
            return this._encoding.name.toLowerCase()
        }
    }),
        Object.defineProperty(S.prototype, "fatal", {
            get: function() {
                return "fatal" === this._error_mode
            }
        }),
        Object.defineProperty(S.prototype, "ignoreBOM", {
            get: function() {
                return this._ignoreBOM
            }
        })),
        S.prototype.decode = function(e, t) {
            var n;
            n = "object" == typeof e && e instanceof ArrayBuffer ? new Uint8Array(e) : "object" == typeof e && "buffer"in e && e.buffer instanceof ArrayBuffer ? new Uint8Array(e.buffer,e.byteOffset,e.byteLength) : new Uint8Array(0),
                t = m(t),
            this._do_not_flush || (this._decoder = x[this._encoding.name]({
                fatal: "fatal" === this._error_mode
            }),
                this._BOMseen = !1),
                this._do_not_flush = Boolean(t.stream);
            for (var r, i = new v(n), o = []; ; ) {
                var a = i.read();
                if (a === y)
                    break;
                if ((r = this._decoder.handler(i, a)) === b)
                    break;
                null !== r && (Array.isArray(r) ? o.push.apply(o, r) : o.push(r))
            }
            if (!this._do_not_flush) {
                do {
                    if ((r = this._decoder.handler(i, i.read())) === b)
                        break;
                    null !== r && (Array.isArray(r) ? o.push.apply(o, r) : o.push(r))
                } while (!i.endOfStream());
                this._decoder = null
            }
            return function(e) {
                var t, n;
                return t = ["UTF-8", "UTF-16LE", "UTF-16BE"],
                    n = this._encoding.name,
                -1 === t.indexOf(n) || this._ignoreBOM || this._BOMseen || (e.length > 0 && 65279 === e[0] ? (this._BOMseen = !0,
                    e.shift()) : e.length > 0 && (this._BOMseen = !0)),
                    function(e) {
                        for (var t = "", n = 0; n < e.length; ++n) {
                            var r = e[n];
                            r <= 65535 ? t += String.fromCharCode(r) : (r -= 65536,
                                t += String.fromCharCode(55296 + (r >> 10), 56320 + (1023 & r)))
                        }
                        return t
                    }(e)
            }
                .call(this, o)
        }
        ,
    Object.defineProperty && Object.defineProperty(R.prototype, "encoding", {
        get: function() {
            return this._encoding.name.toLowerCase()
        }
    }),
        R.prototype.encode = function(e, t) {
            e = e === undefined ? "" : String(e),
                t = m(t),
            this._do_not_flush || (this._encoder = V[this._encoding.name]({
                fatal: "fatal" === this._fatal
            })),
                this._do_not_flush = Boolean(t.stream);
            for (var n, r = new v(function(e) {
                for (var t = String(e), n = t.length, r = 0, i = []; r < n; ) {
                    var o = t.charCodeAt(r);
                    if (o < 55296 || o > 57343)
                        i.push(o);
                    else if (o >= 56320 && o <= 57343)
                        i.push(65533);
                    else if (o >= 55296 && o <= 56319)
                        if (r === n - 1)
                            i.push(65533);
                        else {
                            var a = t.charCodeAt(r + 1);
                            if (a >= 56320 && a <= 57343) {
                                var s = 1023 & o
                                    , c = 1023 & a;
                                i.push(65536 + (s << 10) + c),
                                    r += 1
                            } else
                                i.push(65533)
                        }
                    r += 1
                }
                return i
            }(e)), i = []; ; ) {
                var o = r.read();
                if (o === y)
                    break;
                if ((n = this._encoder.handler(r, o)) === b)
                    break;
                Array.isArray(n) ? i.push.apply(i, n) : i.push(n)
            }
            if (!this._do_not_flush) {
                for (; (n = this._encoder.handler(r, r.read())) !== b; )
                    Array.isArray(n) ? i.push.apply(i, n) : i.push(n);
                this._encoder = null
            }
            return new Uint8Array(i)
        }
        ,
    window.TextDecoder || (window.TextDecoder = S),
    window.TextEncoder || (window.TextEncoder = R),
        function(e) {
            if ("function" != typeof Promise)
                throw "Promise support required";
            var t = e.crypto || e.msCrypto;
            if (t) {
                var n = t.subtle || t.webkitSubtle;
                if (n) {
                    var r = e.Crypto || t.constructor || Object
                        , i = e.SubtleCrypto || n.constructor || Object
                        , o = (e.CryptoKey || e.Key,
                    e.navigator.userAgent.indexOf("Edge/") > -1)
                        , a = !!e.msCrypto && !o
                        , s = !t.subtle && !!t.webkitSubtle;
                    if (a || s) {
                        var c = {
                            KoZIhvcNAQEB: "1.2.840.113549.1.1.1"
                        }
                            , l = {
                            "1.2.840.113549.1.1.1": "KoZIhvcNAQEB"
                        };
                        if (["generateKey", "importKey", "unwrapKey"].forEach((function(e) {
                                var r = n[e];
                                n[e] = function(i, o, c) {
                                    var l, h, u, f, w = [].slice.call(arguments);
                                    switch (e) {
                                        case "generateKey":
                                            l = m(i),
                                                h = o,
                                                u = c;
                                            break;
                                        case "importKey":
                                            l = m(c),
                                                h = w[3],
                                                u = w[4],
                                            "jwk" === i && ((o = y(o)).alg || (o.alg = g(l)),
                                            o.key_ops || (o.key_ops = "oct" !== o.kty ? "d"in o ? u.filter(x) : u.filter(V) : u.slice()),
                                                w[1] = v(o));
                                            break;
                                        case "unwrapKey":
                                            l = w[4],
                                                h = w[5],
                                                u = w[6],
                                                w[2] = c._key
                                    }
                                    if ("generateKey" === e && "HMAC" === l.name && l.hash)
                                        return l.length = l.length || {
                                            "SHA-1": 512,
                                            "SHA-256": 512,
                                            "SHA-384": 1024,
                                            "SHA-512": 1024
                                        }[l.hash.name],
                                            n.importKey("raw", t.getRandomValues(new Uint8Array(l.length + 7 >> 3)), l, h, u);
                                    if (s && "generateKey" === e && "RSASSA-PKCS1-v1_5" === l.name && (!l.modulusLength || l.modulusLength >= 2048))
                                        return (i = m(i)).name = "RSAES-PKCS1-v1_5",
                                            delete i.hash,
                                            n.generateKey(i, !0, ["encrypt", "decrypt"]).then((function(e) {
                                                    return Promise.all([n.exportKey("jwk", e.publicKey), n.exportKey("jwk", e.privateKey)])
                                                }
                                            )).then((function(e) {
                                                    return e[0].alg = e[1].alg = g(l),
                                                        e[0].key_ops = u.filter(V),
                                                        e[1].key_ops = u.filter(x),
                                                        Promise.all([n.importKey("jwk", e[0], l, !0, e[0].key_ops), n.importKey("jwk", e[1], l, h, e[1].key_ops)])
                                                }
                                            )).then((function(e) {
                                                    return {
                                                        publicKey: e[0],
                                                        privateKey: e[1]
                                                    }
                                                }
                                            ));
                                    if ((s || a && "SHA-1" === (l.hash || {}).name) && "importKey" === e && "jwk" === i && "HMAC" === l.name && "oct" === o.kty)
                                        return n.importKey("raw", d(p(o.k)), c, w[3], w[4]);
                                    if (s && "importKey" === e && ("spki" === i || "pkcs8" === i))
                                        return n.importKey("jwk", b(o), c, w[3], w[4]);
                                    if (a && "unwrapKey" === e)
                                        return n.decrypt(w[3], c, o).then((function(e) {
                                                return n.importKey(i, e, w[4], w[5], w[6])
                                            }
                                        ));
                                    try {
                                        f = r.apply(n, w)
                                    } catch (_) {
                                        return Promise.reject(_)
                                    }
                                    return a && (f = new Promise((function(e, t) {
                                            f.onabort = f.onerror = function(e) {
                                                t(e)
                                            }
                                                ,
                                                f.oncomplete = function(t) {
                                                    e(t.target.result)
                                                }
                                        }
                                    ))),
                                        f = f.then((function(e) {
                                                return "HMAC" === l.name && (l.length || (l.length = 8 * e.algorithm.length)),
                                                0 == l.name.search("RSA") && (l.modulusLength || (l.modulusLength = (e.publicKey || e).algorithm.modulusLength),
                                                l.publicExponent || (l.publicExponent = (e.publicKey || e).algorithm.publicExponent)),
                                                    e = e.publicKey && e.privateKey ? {
                                                        publicKey: new k(e.publicKey,l,h,u.filter(V)),
                                                        privateKey: new k(e.privateKey,l,h,u.filter(x))
                                                    } : new k(e,l,h,u)
                                            }
                                        ))
                                }
                            }
                        )),
                            ["exportKey", "wrapKey"].forEach((function(e) {
                                    var t = n[e];
                                    n[e] = function(r, i, o) {
                                        var c, l = [].slice.call(arguments);
                                        switch (e) {
                                            case "exportKey":
                                                l[1] = i._key;
                                                break;
                                            case "wrapKey":
                                                l[1] = i._key,
                                                    l[2] = o._key
                                        }
                                        if ((s || a && "SHA-1" === (i.algorithm.hash || {}).name) && "exportKey" === e && "jwk" === r && "HMAC" === i.algorithm.name && (l[0] = "raw"),
                                        !s || "exportKey" !== e || "spki" !== r && "pkcs8" !== r || (l[0] = "jwk"),
                                        a && "wrapKey" === e)
                                            return n.exportKey(r, i).then((function(e) {
                                                    return "jwk" === r && (e = d(unescape(encodeURIComponent(JSON.stringify(y(e)))))),
                                                        n.encrypt(l[3], o, e)
                                                }
                                            ));
                                        try {
                                            c = t.apply(n, l)
                                        } catch (h) {
                                            return Promise.reject(h)
                                        }
                                        return a && (c = new Promise((function(e, t) {
                                                c.onabort = c.onerror = function(e) {
                                                    t(e)
                                                }
                                                    ,
                                                    c.oncomplete = function(t) {
                                                        e(t.target.result)
                                                    }
                                            }
                                        ))),
                                        "exportKey" === e && "jwk" === r && (c = c.then((function(e) {
                                                return (s || a && "SHA-1" === (i.algorithm.hash || {}).name) && "HMAC" === i.algorithm.name ? {
                                                    kty: "oct",
                                                    alg: g(i.algorithm),
                                                    key_ops: i.usages.slice(),
                                                    ext: !0,
                                                    k: u(f(e))
                                                } : ((e = y(e)).alg || (e.alg = g(i.algorithm)),
                                                e.key_ops || (e.key_ops = "public" === i.type ? i.usages.filter(V) : "private" === i.type ? i.usages.filter(x) : i.usages.slice()),
                                                    e)
                                            }
                                        ))),
                                        !s || "exportKey" !== e || "spki" !== r && "pkcs8" !== r || (c = c.then((function(e) {
                                                return e = w(y(e))
                                            }
                                        ))),
                                            c
                                    }
                                }
                            )),
                            ["encrypt", "decrypt", "sign", "verify"].forEach((function(e) {
                                    var t = n[e];
                                    n[e] = function(r, i, o, s) {
                                        if (a && (!o.byteLength || s && !s.byteLength))
                                            throw new Error("Empty input is not allowed");
                                        var c, l = [].slice.call(arguments), h = m(r);
                                        if (!a || "sign" !== e && "verify" !== e || "RSASSA-PKCS1-v1_5" !== r && "HMAC" !== r || (l[0] = {
                                            name: r
                                        }),
                                        a && i.algorithm.hash && (l[0].hash = l[0].hash || i.algorithm.hash),
                                        a && "decrypt" === e && "AES-GCM" === h.name) {
                                            var u = r.tagLength >> 3;
                                            l[2] = (o.buffer || o).slice(0, o.byteLength - u),
                                                r.tag = (o.buffer || o).slice(o.byteLength - u)
                                        }
                                        a && "AES-GCM" === h.name && l[0].tagLength === undefined && (l[0].tagLength = 128),
                                            l[1] = i._key;
                                        try {
                                            c = t.apply(n, l)
                                        } catch (p) {
                                            return Promise.reject(p)
                                        }
                                        return a && (c = new Promise((function(t, n) {
                                                c.onabort = c.onerror = function(e) {
                                                    n(e)
                                                }
                                                    ,
                                                    c.oncomplete = function(n) {
                                                        n = n.target.result;
                                                        if ("encrypt" === e && n instanceof AesGcmEncryptResult) {
                                                            var r = n.ciphertext
                                                                , i = n.tag;
                                                            (n = new Uint8Array(r.byteLength + i.byteLength)).set(new Uint8Array(r), 0),
                                                                n.set(new Uint8Array(i), r.byteLength),
                                                                n = n.buffer
                                                        }
                                                        t(n)
                                                    }
                                            }
                                        ))),
                                            c
                                    }
                                }
                            )),
                            a) {
                            var h = n.digest;
                            n.digest = function(e, t) {
                                if (!t.byteLength)
                                    throw new Error("Empty input is not allowed");
                                var r;
                                try {
                                    r = h.call(n, e, t)
                                } catch (i) {
                                    return Promise.reject(i)
                                }
                                return r = new Promise((function(e, t) {
                                        r.onabort = r.onerror = function(e) {
                                            t(e)
                                        }
                                            ,
                                            r.oncomplete = function(t) {
                                                e(t.target.result)
                                            }
                                    }
                                )),
                                    r
                            }
                                ,
                                e.crypto = Object.create(t, {
                                    getRandomValues: {
                                        value: function(e) {
                                            return t.getRandomValues(e)
                                        }
                                    },
                                    subtle: {
                                        value: n
                                    }
                                }),
                                e.CryptoKey = k
                        }
                        s && (t.subtle = n,
                            e.Crypto = r,
                            e.SubtleCrypto = i,
                            e.CryptoKey = k)
                    }
                }
            }
            function u(e) {
                return btoa(e).replace(/\=+$/, "").replace(/\+/g, "-").replace(/\//g, "_")
            }
            function p(e) {
                return e = (e += "===").slice(0, -e.length % 4),
                    atob(e.replace(/-/g, "+").replace(/_/g, "/"))
            }
            function d(e) {
                for (var t = new Uint8Array(e.length), n = 0; n < e.length; n++)
                    t[n] = e.charCodeAt(n);
                return t
            }
            function f(e) {
                return e instanceof ArrayBuffer && (e = new Uint8Array(e)),
                    String.fromCharCode.apply(String, e)
            }
            function m(e) {
                var t = {
                    name: (e.name || e || "").toUpperCase().replace("V", "v")
                };
                switch (t.name) {
                    case "SHA-1":
                    case "SHA-256":
                    case "SHA-384":
                    case "SHA-512":
                        break;
                    case "AES-CBC":
                    case "AES-GCM":
                    case "AES-KW":
                        e.length && (t.length = e.length);
                        break;
                    case "HMAC":
                        e.hash && (t.hash = m(e.hash)),
                        e.length && (t.length = e.length);
                        break;
                    case "RSAES-PKCS1-v1_5":
                        e.publicExponent && (t.publicExponent = new Uint8Array(e.publicExponent)),
                        e.modulusLength && (t.modulusLength = e.modulusLength);
                        break;
                    case "RSASSA-PKCS1-v1_5":
                    case "RSA-OAEP":
                        e.hash && (t.hash = m(e.hash)),
                        e.publicExponent && (t.publicExponent = new Uint8Array(e.publicExponent)),
                        e.modulusLength && (t.modulusLength = e.modulusLength);
                        break;
                    default:
                        throw new SyntaxError("Bad algorithm name")
                }
                return t
            }
            function g(e) {
                return {
                    HMAC: {
                        "SHA-1": "HS1",
                        "SHA-256": "HS256",
                        "SHA-384": "HS384",
                        "SHA-512": "HS512"
                    },
                    "RSASSA-PKCS1-v1_5": {
                        "SHA-1": "RS1",
                        "SHA-256": "RS256",
                        "SHA-384": "RS384",
                        "SHA-512": "RS512"
                    },
                    "RSAES-PKCS1-v1_5": {
                        "": "RSA1_5"
                    },
                    "RSA-OAEP": {
                        "SHA-1": "RSA-OAEP",
                        "SHA-256": "RSA-OAEP-256"
                    },
                    "AES-KW": {
                        128: "A128KW",
                        192: "A192KW",
                        256: "A256KW"
                    },
                    "AES-GCM": {
                        128: "A128GCM",
                        192: "A192GCM",
                        256: "A256GCM"
                    },
                    "AES-CBC": {
                        128: "A128CBC",
                        192: "A192CBC",
                        256: "A256CBC"
                    }
                }[e.name][(e.hash || {}).name || e.length || ""]
            }
            function y(e) {
                (e instanceof ArrayBuffer || e instanceof Uint8Array) && (e = JSON.parse(decodeURIComponent(escape(f(e)))));
                var t = {
                    kty: e.kty,
                    alg: e.alg,
                    ext: e.ext || e.extractable
                };
                switch (t.kty) {
                    case "oct":
                        t.k = e.k;
                    case "RSA":
                        ["n", "e", "d", "p", "q", "dp", "dq", "qi", "oth"].forEach((function(n) {
                                n in e && (t[n] = e[n])
                            }
                        ));
                        break;
                    default:
                        throw new TypeError("Unsupported key type")
                }
                return t
            }
            function v(e) {
                var t = y(e);
                return a && (t.extractable = t.ext,
                    delete t.ext),
                    d(unescape(encodeURIComponent(JSON.stringify(t)))).buffer
            }
            function b(e) {
                var t = _(e)
                    , n = !1;
                t.length > 2 && (n = !0,
                    t.shift());
                var r = {
                    ext: !0
                };
                if ("1.2.840.113549.1.1.1" !== t[0][0])
                    throw new TypeError("Unsupported key type");
                var i = ["n", "e", "d", "p", "q", "dp", "dq", "qi"]
                    , o = _(t[1]);
                n && o.shift();
                for (var a = 0; a < o.length; a++)
                    o[a][0] || (o[a] = o[a].subarray(1)),
                        r[i[a]] = u(f(o[a]));
                return r.kty = "RSA",
                    r
            }
            function w(e) {
                var t, n = [["", null]], r = !1;
                if ("RSA" !== e.kty)
                    throw new TypeError("Unsupported key type");
                for (var i = ["n", "e", "d", "p", "q", "dp", "dq", "qi"], o = [], a = 0; a < i.length && i[a]in e; a++) {
                    var s = o[a] = d(p(e[i[a]]));
                    128 & s[0] && (o[a] = new Uint8Array(s.length + 1),
                        o[a].set(s, 1))
                }
                return o.length > 2 && (r = !0,
                    o.unshift(new Uint8Array([0]))),
                    n[0][0] = "1.2.840.113549.1.1.1",
                    t = o,
                    n.push(new Uint8Array(E(t)).buffer),
                    r ? n.unshift(new Uint8Array([0])) : n[1] = {
                        tag: 3,
                        value: n[1]
                    },
                    new Uint8Array(E(n)).buffer
            }
            function _(e, t) {
                if (e instanceof ArrayBuffer && (e = new Uint8Array(e)),
                t || (t = {
                    pos: 0,
                    end: e.length
                }),
                t.end - t.pos < 2 || t.end > e.length)
                    throw new RangeError("Malformed DER");
                var n, r = e[t.pos++], i = e[t.pos++];
                if (i >= 128) {
                    if (i &= 127,
                    t.end - t.pos < i)
                        throw new RangeError("Malformed DER");
                    for (var o = 0; i--; )
                        o <<= 8,
                            o |= e[t.pos++];
                    i = o
                }
                if (t.end - t.pos < i)
                    throw new RangeError("Malformed DER");
                switch (r) {
                    case 2:
                        n = e.subarray(t.pos, t.pos += i);
                        break;
                    case 3:
                        if (e[t.pos++])
                            throw new Error("Unsupported bit string");
                        i--;
                    case 4:
                        n = new Uint8Array(e.subarray(t.pos, t.pos += i)).buffer;
                        break;
                    case 5:
                        n = null;
                        break;
                    case 6:
                        var a = btoa(f(e.subarray(t.pos, t.pos += i)));
                        if (!(a in c))
                            throw new Error("Unsupported OBJECT ID " + a);
                        n = c[a];
                        break;
                    case 48:
                        n = [];
                        for (var s = t.pos + i; t.pos < s; )
                            n.push(_(e, t));
                        break;
                    default:
                        throw new Error("Unsupported DER tag 0x" + r.toString(16))
                }
                return n
            }
            function E(e, t) {
                t || (t = []);
                var n = 0
                    , r = 0
                    , i = t.length + 2;
                if (t.push(0, 0),
                e instanceof Uint8Array) {
                    n = 2,
                        r = e.length;
                    for (var o = 0; o < r; o++)
                        t.push(e[o])
                } else if (e instanceof ArrayBuffer) {
                    n = 4,
                        r = e.byteLength,
                        e = new Uint8Array(e);
                    for (o = 0; o < r; o++)
                        t.push(e[o])
                } else if (null === e)
                    n = 5,
                        r = 0;
                else if ("string" == typeof e && e in l) {
                    var a = d(atob(l[e]));
                    n = 6,
                        r = a.length;
                    for (o = 0; o < r; o++)
                        t.push(a[o])
                } else if (e instanceof Array) {
                    for (o = 0; o < e.length; o++)
                        E(e[o], t);
                    n = 48,
                        r = t.length - i
                } else {
                    if (!("object" == typeof e && 3 === e.tag && e.value instanceof ArrayBuffer))
                        throw new Error("Unsupported DER value " + e);
                    n = 3,
                        r = (e = new Uint8Array(e.value)).byteLength,
                        t.push(0);
                    for (o = 0; o < r; o++)
                        t.push(e[o]);
                    r++
                }
                if (r >= 128) {
                    var s = r;
                    r = 4;
                    for (t.splice(i, 0, s >> 24 & 255, s >> 16 & 255, s >> 8 & 255, 255 & s); r > 1 && !(s >> 24); )
                        s <<= 8,
                            r--;
                    r < 4 && t.splice(i, 4 - r),
                        r |= 128
                }
                return t.splice(i - 2, 2, n, r),
                    t
            }
            function k(e, t, n, r) {
                Object.defineProperties(this, {
                    _key: {
                        value: e
                    },
                    type: {
                        value: e.type,
                        enumerable: !0
                    },
                    extractable: {
                        value: n === undefined ? e.extractable : n,
                        enumerable: !0
                    },
                    algorithm: {
                        value: t === undefined ? e.algorithm : t,
                        enumerable: !0
                    },
                    usages: {
                        value: r === undefined ? e.usages : r,
                        enumerable: !0
                    }
                })
            }
            function V(e) {
                return "verify" === e || "encrypt" === e || "wrapKey" === e
            }
            function x(e) {
                return "sign" === e || "decrypt" === e || "unwrapKey" === e
            }
        }(window),
    Array.prototype.indexOf || (Array.prototype.indexOf = function(e) {
        return function(t, n) {
            if (null === this || this === undefined)
                throw TypeError("Array.prototype.indexOf called on null or undefined");
            var r = e(this)
                , i = r.length >>> 0
                , o = Math.min(0 | n, i);
            if (o < 0)
                o = Math.max(0, i + o);
            else if (o >= i)
                return -1;
            if (void 0 === t) {
                for (; o !== i; ++o)
                    if (void 0 === r[o] && o in r)
                        return o
            } else if (t != t) {
                for (; o !== i; ++o)
                    if (r[o] != r[o])
                        return o
            } else
                for (; o !== i; ++o)
                    if (r[o] === t)
                        return o;
            return -1
        }
    }(Object)),
    Array.isArray || (Array.isArray = function(e) {
            return "[object Array]" === Object.prototype.toString.call(e)
        }
    ),
    document.getElementsByClassName || (window.Element.prototype.getElementsByClassName = document.constructor.prototype.getElementsByClassName = function(e) {
            if (document.querySelectorAll)
                return document.querySelectorAll("." + e);
            for (var t = document.getElementsByTagName("*"), n = new RegExp("(^|\\s)" + e + "(\\s|$)"), r = [], i = 0; i < t.length; i++)
                n.test(t[i].className) && r.push(t[i]);
            return r
        }
    ),
    String.prototype.startsWith || (String.prototype.startsWith = function(e, t) {
            return this.substr(!t || t < 0 ? 0 : +t, e.length) === e
        }
    ),
    String.prototype.endsWith || (String.prototype.endsWith = function(e, t) {
            return (t === undefined || t > this.length) && (t = this.length),
            this.substring(t - e.length, t) === e
        }
    );
    try {
        if (Object.defineProperty && Object.getOwnPropertyDescriptor && Object.getOwnPropertyDescriptor(Element.prototype, "textContent") && !Object.getOwnPropertyDescriptor(Element.prototype, "textContent").get) {
            var C = Object.getOwnPropertyDescriptor(Element.prototype, "innerText");
            Object.defineProperty(Element.prototype, "textContent", {
                get: function() {
                    return C.get.call(this)
                },
                set: function(e) {
                    C.set.call(this, e)
                }
            })
        }
    } catch ($n) {}
    Function.prototype.bind || (Function.prototype.bind = function(e) {
            if ("function" != typeof this)
                throw new TypeError("Function.prototype.bind: Item Can Not Be Bound.");
            var t = Array.prototype.slice.call(arguments, 1)
                , n = this
                , r = function() {}
                , i = function() {
                return n.apply(this instanceof r ? this : e, t.concat(Array.prototype.slice.call(arguments)))
            };
            return this.prototype && (r.prototype = this.prototype),
                i.prototype = new r,
                i
        }
    ),
    "function" != typeof Object.create && (Object.create = function(e, t) {
            function n() {}
            if (n.prototype = e,
            "object" == typeof t)
                for (var r in t)
                    t.hasOwnProperty(r) && (n[r] = t[r]);
            return new n
        }
    ),
    Date.now || (Date.now = function() {
            return (new Date).getTime()
        }
    ),
    window.console || (window.console = {});
    for (var O, W, N, A, P = ["error", "info", "log", "show", "table", "trace", "warn"], j = function(e) {}, F = P.length; --F > -1; )
        k = P[F],
        window.console[k] || (window.console[k] = j);
    if (window.atob)
        try {
            window.atob(" ")
        } catch (Gn) {
            window.atob = function(e) {
                var t = function(t) {
                    return e(String(t).replace(/[\t\n\f\r ]+/g, ""))
                };
                return t.original = e,
                    t
            }(window.atob)
        }
    else {
        var B = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
            , Z = /^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/;
        window.atob = function(e) {
            if (e = String(e).replace(/[\t\n\f\r ]+/g, ""),
                !Z.test(e))
                throw new TypeError("Failed to execute 'atob' on 'Window': The string to be decoded is not correctly encoded.");
            var t, n, r;
            e += "==".slice(2 - (3 & e.length));
            for (var i = "", o = 0; o < e.length; )
                t = B.indexOf(e.charAt(o++)) << 18 | B.indexOf(e.charAt(o++)) << 12 | (n = B.indexOf(e.charAt(o++))) << 6 | (r = B.indexOf(e.charAt(o++))),
                    i += 64 === n ? String.fromCharCode(t >> 16 & 255) : 64 === r ? String.fromCharCode(t >> 16 & 255, t >> 8 & 255) : String.fromCharCode(t >> 16 & 255, t >> 8 & 255, 255 & t);
            return i
        }
    }
    if (Event.prototype.preventDefault || (Event.prototype.preventDefault = function() {
            this.returnValue = !1
        }
    ),
    Event.prototype.stopPropagation || (Event.prototype.stopPropagation = function() {
            this.cancelBubble = !0
        }
    ),
    window.Prototype && Array.prototype.toJSON) {
        console.error("[hCaptcha] Custom JSON polyfill detected, please remove to ensure hCaptcha works properly");
        var I = Array.prototype.toJSON
            , D = JSON.stringify;
        JSON.stringify = function(e) {
            try {
                return delete Array.prototype.toJSON,
                    D(e)
            } finally {
                Array.prototype.toJSON = I
            }
        }
    }
    Object.keys || (Object.keys = (O = Object.prototype.hasOwnProperty,
            W = !Object.prototype.propertyIsEnumerable.call({
                toString: null
            }, "toString"),
            A = (N = ["toString", "toLocaleString", "valueOf", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "constructor"]).length,
            function(e) {
                if ("function" != typeof e && ("object" != typeof e || null === e))
                    throw new TypeError("Object.keys called on non-object");
                var t, n, r = [];
                for (t in e)
                    O.call(e, t) && r.push(t);
                if (W)
                    for (n = 0; n < A; n++)
                        O.call(e, N[n]) && r.push(N[n]);
                return r
            }
    ))/*! Raven.js 3.27.2 (6d91db933) | github.com/getsentry/raven-js */
        ,
        function(e) {
            if ("object" == typeof exports && "undefined" != typeof module)
                module.exports = e();
            else if ("function" == typeof define && define.amd)
                define("raven-js", e);
            else {
                ("undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this).Raven = e()
            }
        }((function() {
                return function e(t, n, r) {
                    function i(a, s) {
                        if (!n[a]) {
                            if (!t[a]) {
                                var c = "function" == typeof require && require;
                                if (!s && c)
                                    return c(a, !0);
                                if (o)
                                    return o(a, !0);
                                var l = new Error("Cannot find module '" + a + "'");
                                throw l.code = "MODULE_NOT_FOUND",
                                    l
                            }
                            var h = n[a] = {
                                exports: {}
                            };
                            t[a][0].call(h.exports, (function(e) {
                                    var n = t[a][1][e];
                                    return i(n || e)
                                }
                            ), h, h.exports, e, t, n, r)
                        }
                        return n[a].exports
                    }
                    for (var o = "function" == typeof require && require, a = 0; a < r.length; a++)
                        i(r[a]);
                    return i
                }({
                    1: [function(e, t, n) {
                        function r(e) {
                            this.name = "RavenConfigError",
                                this.message = e
                        }
                        r.prototype = new Error,
                            r.prototype.constructor = r,
                            t.exports = r
                    }
                        , {}],
                    2: [function(e, t, n) {
                        var r = e(5);
                        t.exports = {
                            wrapMethod: function(e, t, n) {
                                var i = e[t]
                                    , o = e;
                                if (t in e) {
                                    var a = "warn" === t ? "warning" : t;
                                    e[t] = function() {
                                        var e = [].slice.call(arguments)
                                            , s = r.safeJoin(e, " ")
                                            , c = {
                                            level: a,
                                            logger: "console",
                                            extra: {
                                                arguments: e
                                            }
                                        };
                                        "assert" === t ? !1 === e[0] && (s = "Assertion failed: " + (r.safeJoin(e.slice(1), " ") || "console.assert"),
                                            c.extra.arguments = e.slice(1),
                                        n && n(s, c)) : n && n(s, c),
                                        i && Function.prototype.apply.call(i, o, e)
                                    }
                                }
                            }
                        }
                    }
                        , {
                            5: 5
                        }],
                    3: [function(e, t, n) {
                        (function(n) {
                                function r() {
                                    return +new Date
                                }
                                function i(e, t) {
                                    return v(t) ? function(n) {
                                            return t(n, e)
                                        }
                                        : t
                                }
                                function o() {
                                    for (var e in this.a = !("object" != typeof JSON || !JSON.stringify),
                                        this.b = !y(K),
                                        this.c = !y(L),
                                        this.d = null,
                                        this.e = null,
                                        this.f = null,
                                        this.g = null,
                                        this.h = null,
                                        this.i = null,
                                        this.j = {},
                                        this.k = {
                                            release: H.SENTRY_RELEASE && H.SENTRY_RELEASE.id,
                                            logger: "javascript",
                                            ignoreErrors: [],
                                            ignoreUrls: [],
                                            whitelistUrls: [],
                                            includePaths: [],
                                            headers: null,
                                            collectWindowErrors: !0,
                                            captureUnhandledRejections: !0,
                                            maxMessageLength: 0,
                                            maxUrlLength: 250,
                                            stackTraceLimit: 50,
                                            autoBreadcrumbs: !0,
                                            instrument: !0,
                                            sampleRate: 1,
                                            sanitizeKeys: []
                                        },
                                        this.l = {
                                            method: "POST",
                                            referrerPolicy: P() ? "origin" : ""
                                        },
                                        this.m = 0,
                                        this.n = !1,
                                        this.o = Error.stackTraceLimit,
                                        this.p = H.console || {},
                                        this.q = {},
                                        this.r = [],
                                        this.s = r(),
                                        this.t = [],
                                        this.u = [],
                                        this.v = null,
                                        this.w = H.location,
                                        this.x = this.w && this.w.href,
                                        this.y(),
                                        this.p)
                                        this.q[e] = this.p[e]
                                }
                                var a = e(6)
                                    , s = e(7)
                                    , c = e(8)
                                    , l = e(1)
                                    , h = e(5)
                                    , u = h.isErrorEvent
                                    , p = h.isDOMError
                                    , d = h.isDOMException
                                    , f = h.isError
                                    , m = h.isObject
                                    , g = h.isPlainObject
                                    , y = h.isUndefined
                                    , v = h.isFunction
                                    , b = h.isString
                                    , w = h.isArray
                                    , _ = h.isEmptyObject
                                    , E = h.each
                                    , k = h.objectMerge
                                    , V = h.truncate
                                    , x = h.objectFrozen
                                    , T = h.hasKey
                                    , S = h.joinRegExp
                                    , R = h.urlencode
                                    , M = h.uuid4
                                    , U = h.htmlTreeAsString
                                    , C = h.isSameException
                                    , O = h.isSameStacktrace
                                    , W = h.parseUrl
                                    , N = h.fill
                                    , A = h.supportsFetch
                                    , P = h.supportsReferrerPolicy
                                    , j = h.serializeKeysForMessage
                                    , F = h.serializeException
                                    , B = h.sanitize
                                    , Z = e(2).wrapMethod
                                    , I = "source protocol user pass host port path".split(" ")
                                    , D = /^(?:(\w+):)?\/\/(?:(\w+)(:\w+)?@)?([\w\.-]+)(?::(\d+))?(\/.*)/
                                    , H = "undefined" != typeof window ? window : void 0 !== n ? n : "undefined" != typeof self ? self : {}
                                    , K = H.document
                                    , L = H.navigator;
                                o.prototype = {
                                    VERSION: "3.27.2",
                                    debug: !1,
                                    TraceKit: a,
                                    config: function(e, t) {
                                        var n = this;
                                        if (n.g)
                                            return this.z("error", "Error: Raven has already been configured"),
                                                n;
                                        if (!e)
                                            return n;
                                        var r = n.k;
                                        t && E(t, (function(e, t) {
                                                "tags" === e || "extra" === e || "user" === e ? n.j[e] = t : r[e] = t
                                            }
                                        )),
                                            n.setDSN(e),
                                            r.ignoreErrors.push(/^Script error\.?$/),
                                            r.ignoreErrors.push(/^Javascript error: Script error\.? on line 0$/),
                                            r.ignoreErrors = S(r.ignoreErrors),
                                            r.ignoreUrls = !!r.ignoreUrls.length && S(r.ignoreUrls),
                                            r.whitelistUrls = !!r.whitelistUrls.length && S(r.whitelistUrls),
                                            r.includePaths = S(r.includePaths),
                                            r.maxBreadcrumbs = Math.max(0, Math.min(r.maxBreadcrumbs || 100, 100));
                                        var i = {
                                            xhr: !0,
                                            console: !0,
                                            dom: !0,
                                            location: !0,
                                            sentry: !0
                                        }
                                            , o = r.autoBreadcrumbs;
                                        "[object Object]" === {}.toString.call(o) ? o = k(i, o) : !1 !== o && (o = i),
                                            r.autoBreadcrumbs = o;
                                        var s = {
                                            tryCatch: !0
                                        }
                                            , c = r.instrument;
                                        return "[object Object]" === {}.toString.call(c) ? c = k(s, c) : !1 !== c && (c = s),
                                            r.instrument = c,
                                            a.collectWindowErrors = !!r.collectWindowErrors,
                                            n
                                    },
                                    install: function() {
                                        var e = this;
                                        return e.isSetup() && !e.n && (a.report.subscribe((function() {
                                                e.A.apply(e, arguments)
                                            }
                                        )),
                                        e.k.captureUnhandledRejections && e.B(),
                                            e.C(),
                                        e.k.instrument && e.k.instrument.tryCatch && e.D(),
                                        e.k.autoBreadcrumbs && e.E(),
                                            e.F(),
                                            e.n = !0),
                                            Error.stackTraceLimit = e.k.stackTraceLimit,
                                            this
                                    },
                                    setDSN: function(e) {
                                        var t = this
                                            , n = t.G(e)
                                            , r = n.path.lastIndexOf("/")
                                            , i = n.path.substr(1, r);
                                        t.H = e,
                                            t.h = n.user,
                                            t.I = n.pass && n.pass.substr(1),
                                            t.i = n.path.substr(r + 1),
                                            t.g = t.J(n),
                                            t.K = t.g + "/" + i + "api/" + t.i + "/store/",
                                            this.y()
                                    },
                                    context: function(e, t, n) {
                                        return v(e) && (n = t || [],
                                            t = e,
                                            e = {}),
                                            this.wrap(e, t).apply(this, n)
                                    },
                                    wrap: function(e, t, n) {
                                        function r() {
                                            var r = []
                                                , o = arguments.length
                                                , a = !e || e && !1 !== e.deep;
                                            for (n && v(n) && n.apply(this, arguments); o--; )
                                                r[o] = a ? i.wrap(e, arguments[o]) : arguments[o];
                                            try {
                                                return t.apply(this, r)
                                            } catch (s) {
                                                throw i.L(),
                                                    i.captureException(s, e),
                                                    s
                                            }
                                        }
                                        var i = this;
                                        if (y(t) && !v(e))
                                            return e;
                                        if (v(e) && (t = e,
                                            e = void 0),
                                            !v(t))
                                            return t;
                                        try {
                                            if (t.M)
                                                return t;
                                            if (t.N)
                                                return t.N
                                        } catch (o) {
                                            return t
                                        }
                                        for (var a in t)
                                            T(t, a) && (r[a] = t[a]);
                                        return r.prototype = t.prototype,
                                            t.N = r,
                                            r.M = !0,
                                            r.O = t,
                                            r
                                    },
                                    uninstall: function() {
                                        return a.report.uninstall(),
                                            this.P(),
                                            this.Q(),
                                            this.R(),
                                            this.S(),
                                            Error.stackTraceLimit = this.o,
                                            this.n = !1,
                                            this
                                    },
                                    T: function(e) {
                                        this.z("debug", "Raven caught unhandled promise rejection:", e),
                                            this.captureException(e.reason, {
                                                mechanism: {
                                                    type: "onunhandledrejection",
                                                    handled: !1
                                                }
                                            })
                                    },
                                    B: function() {
                                        return this.T = this.T.bind(this),
                                        H.addEventListener && H.addEventListener("unhandledrejection", this.T),
                                            this
                                    },
                                    P: function() {
                                        return H.removeEventListener && H.removeEventListener("unhandledrejection", this.T),
                                            this
                                    },
                                    captureException: function(e, t) {
                                        if (t = k({
                                            trimHeadFrames: 0
                                        }, t || {}),
                                        u(e) && e.error)
                                            e = e.error;
                                        else {
                                            if (p(e) || d(e)) {
                                                var n = e.name || (p(e) ? "DOMError" : "DOMException")
                                                    , r = e.message ? n + ": " + e.message : n;
                                                return this.captureMessage(r, k(t, {
                                                    stacktrace: !0,
                                                    trimHeadFrames: t.trimHeadFrames + 1
                                                }))
                                            }
                                            if (f(e))
                                                e = e;
                                            else {
                                                if (!g(e))
                                                    return this.captureMessage(e, k(t, {
                                                        stacktrace: !0,
                                                        trimHeadFrames: t.trimHeadFrames + 1
                                                    }));
                                                t = this.U(t, e),
                                                    e = new Error(t.message)
                                            }
                                        }
                                        this.d = e;
                                        try {
                                            var i = a.computeStackTrace(e);
                                            this.V(i, t)
                                        } catch (o) {
                                            if (e !== o)
                                                throw o
                                        }
                                        return this
                                    },
                                    U: function(e, t) {
                                        var n = Object.keys(t).sort()
                                            , r = k(e, {
                                            message: "Non-Error exception captured with keys: " + j(n),
                                            fingerprint: [c(n)],
                                            extra: e.extra || {}
                                        });
                                        return r.extra.W = F(t),
                                            r
                                    },
                                    captureMessage: function(e, t) {
                                        if (!this.k.ignoreErrors.test || !this.k.ignoreErrors.test(e)) {
                                            var n, r = k({
                                                message: e += ""
                                            }, t = t || {});
                                            try {
                                                throw new Error(e)
                                            } catch (i) {
                                                n = i
                                            }
                                            n.name = null;
                                            var o = a.computeStackTrace(n)
                                                , s = w(o.stack) && o.stack[1];
                                            s && "Raven.captureException" === s.func && (s = o.stack[2]);
                                            var c = s && s.url || "";
                                            if ((!this.k.ignoreUrls.test || !this.k.ignoreUrls.test(c)) && (!this.k.whitelistUrls.test || this.k.whitelistUrls.test(c))) {
                                                if (this.k.stacktrace || t.stacktrace || "" === r.message) {
                                                    r.fingerprint = null == r.fingerprint ? e : r.fingerprint,
                                                        (t = k({
                                                            trimHeadFrames: 0
                                                        }, t)).trimHeadFrames += 1;
                                                    var l = this.X(o, t);
                                                    r.stacktrace = {
                                                        frames: l.reverse()
                                                    }
                                                }
                                                return r.fingerprint && (r.fingerprint = w(r.fingerprint) ? r.fingerprint : [r.fingerprint]),
                                                    this.Y(r),
                                                    this
                                            }
                                        }
                                    },
                                    captureBreadcrumb: function(e) {
                                        var t = k({
                                            timestamp: r() / 1e3
                                        }, e);
                                        if (v(this.k.breadcrumbCallback)) {
                                            var n = this.k.breadcrumbCallback(t);
                                            if (m(n) && !_(n))
                                                t = n;
                                            else if (!1 === n)
                                                return this
                                        }
                                        return this.u.push(t),
                                        this.u.length > this.k.maxBreadcrumbs && this.u.shift(),
                                            this
                                    },
                                    addPlugin: function(e) {
                                        var t = [].slice.call(arguments, 1);
                                        return this.r.push([e, t]),
                                        this.n && this.F(),
                                            this
                                    },
                                    setUserContext: function(e) {
                                        return this.j.user = e,
                                            this
                                    },
                                    setExtraContext: function(e) {
                                        return this.Z("extra", e),
                                            this
                                    },
                                    setTagsContext: function(e) {
                                        return this.Z("tags", e),
                                            this
                                    },
                                    clearContext: function() {
                                        return this.j = {},
                                            this
                                    },
                                    getContext: function() {
                                        return JSON.parse(s(this.j))
                                    },
                                    setEnvironment: function(e) {
                                        return this.k.environment = e,
                                            this
                                    },
                                    setRelease: function(e) {
                                        return this.k.release = e,
                                            this
                                    },
                                    setDataCallback: function(e) {
                                        var t = this.k.dataCallback;
                                        return this.k.dataCallback = i(t, e),
                                            this
                                    },
                                    setBreadcrumbCallback: function(e) {
                                        var t = this.k.breadcrumbCallback;
                                        return this.k.breadcrumbCallback = i(t, e),
                                            this
                                    },
                                    setShouldSendCallback: function(e) {
                                        var t = this.k.shouldSendCallback;
                                        return this.k.shouldSendCallback = i(t, e),
                                            this
                                    },
                                    setTransport: function(e) {
                                        return this.k.transport = e,
                                            this
                                    },
                                    lastException: function() {
                                        return this.d
                                    },
                                    lastEventId: function() {
                                        return this.f
                                    },
                                    isSetup: function() {
                                        return !(!this.a || !this.g && (this.ravenNotConfiguredError || (this.ravenNotConfiguredError = !0,
                                            this.z("error", "Error: Raven has not been configured.")),
                                            1))
                                    },
                                    afterLoad: function() {
                                        var e = H.RavenConfig;
                                        e && this.config(e.dsn, e.config).install()
                                    },
                                    showReportDialog: function(e) {
                                        if (K) {
                                            if (!(e = k({
                                                eventId: this.lastEventId(),
                                                dsn: this.H,
                                                user: this.j.user || {}
                                            }, e)).eventId)
                                                throw new l("Missing eventId");
                                            if (!e.dsn)
                                                throw new l("Missing DSN");
                                            var t = encodeURIComponent
                                                , n = [];
                                            for (var r in e)
                                                if ("user" === r) {
                                                    var i = e.user;
                                                    i.name && n.push("name=" + t(i.name)),
                                                    i.email && n.push("email=" + t(i.email))
                                                } else
                                                    n.push(t(r) + "=" + t(e[r]));
                                            var o = this.J(this.G(e.dsn))
                                                , a = K.createElement("script");
                                            a.async = !0,
                                                a.src = o + "/api/embed/error-page/?" + n.join("&"),
                                                (K.head || K.body).appendChild(a)
                                        }
                                    },
                                    L: function() {
                                        var e = this;
                                        this.m += 1,
                                            setTimeout((function() {
                                                    e.m -= 1
                                                }
                                            ))
                                    },
                                    $: function(e, t) {
                                        var n, r;
                                        if (this.b) {
                                            for (r in t = t || {},
                                                e = "raven" + e.substr(0, 1).toUpperCase() + e.substr(1),
                                                K.createEvent ? (n = K.createEvent("HTMLEvents")).initEvent(e, !0, !0) : (n = K.createEventObject()).eventType = e,
                                                t)
                                                T(t, r) && (n[r] = t[r]);
                                            if (K.createEvent)
                                                K.dispatchEvent(n);
                                            else
                                                try {
                                                    K.fireEvent("on" + n.eventType.toLowerCase(), n)
                                                } catch (i) {}
                                        }
                                    },
                                    _: function(e) {
                                        var t = this;
                                        return function(n) {
                                            if (t.aa = null,
                                            t.v !== n) {
                                                var r;
                                                t.v = n;
                                                try {
                                                    r = U(n.target)
                                                } catch (i) {
                                                    r = "<unknown>"
                                                }
                                                t.captureBreadcrumb({
                                                    category: "ui." + e,
                                                    message: r
                                                })
                                            }
                                        }
                                    },
                                    ba: function() {
                                        var e = this;
                                        return function(t) {
                                            var n;
                                            try {
                                                n = t.target
                                            } catch (i) {
                                                return
                                            }
                                            var r = n && n.tagName;
                                            if (r && ("INPUT" === r || "TEXTAREA" === r || n.isContentEditable)) {
                                                var o = e.aa;
                                                o || e._("input")(t),
                                                    clearTimeout(o),
                                                    e.aa = setTimeout((function() {
                                                            e.aa = null
                                                        }
                                                    ), 1e3)
                                            }
                                        }
                                    },
                                    ca: function(e, t) {
                                        var n = W(this.w.href)
                                            , r = W(t)
                                            , i = W(e);
                                        this.x = t,
                                        n.protocol === r.protocol && n.host === r.host && (t = r.relative),
                                        n.protocol === i.protocol && n.host === i.host && (e = i.relative),
                                            this.captureBreadcrumb({
                                                category: "navigation",
                                                data: {
                                                    to: t,
                                                    from: e
                                                }
                                            })
                                    },
                                    C: function() {
                                        var e = this;
                                        e.da = Function.prototype.toString,
                                            Function.prototype.toString = function() {
                                                return "function" == typeof this && this.M ? e.da.apply(this.O, arguments) : e.da.apply(this, arguments)
                                            }
                                    },
                                    Q: function() {
                                        this.da && (Function.prototype.toString = this.da)
                                    },
                                    D: function() {
                                        function e(e) {
                                            return function(t, r) {
                                                for (var i = new Array(arguments.length), o = 0; o < i.length; ++o)
                                                    i[o] = arguments[o];
                                                var a = i[0];
                                                return v(a) && (i[0] = n.wrap({
                                                    mechanism: {
                                                        type: "instrument",
                                                        data: {
                                                            "function": e.name || "<anonymous>"
                                                        }
                                                    }
                                                }, a)),
                                                    e.apply ? e.apply(this, i) : e(i[0], i[1])
                                            }
                                        }
                                        function t(e) {
                                            var t = H[e] && H[e].prototype;
                                            t && t.hasOwnProperty && t.hasOwnProperty("addEventListener") && (N(t, "addEventListener", (function(t) {
                                                    return function(r, o, a, s) {
                                                        try {
                                                            o && o.handleEvent && (o.handleEvent = n.wrap({
                                                                mechanism: {
                                                                    type: "instrument",
                                                                    data: {
                                                                        target: e,
                                                                        "function": "handleEvent",
                                                                        handler: o && o.name || "<anonymous>"
                                                                    }
                                                                }
                                                            }, o.handleEvent))
                                                        } catch (c) {}
                                                        var l, h, u;
                                                        return i && i.dom && ("EventTarget" === e || "Node" === e) && (h = n._("click"),
                                                                u = n.ba(),
                                                                l = function(e) {
                                                                    if (e) {
                                                                        var t;
                                                                        try {
                                                                            t = e.type
                                                                        } catch (n) {
                                                                            return
                                                                        }
                                                                        return "click" === t ? h(e) : "keypress" === t ? u(e) : void 0
                                                                    }
                                                                }
                                                        ),
                                                            t.call(this, r, n.wrap({
                                                                mechanism: {
                                                                    type: "instrument",
                                                                    data: {
                                                                        target: e,
                                                                        "function": "addEventListener",
                                                                        handler: o && o.name || "<anonymous>"
                                                                    }
                                                                }
                                                            }, o, l), a, s)
                                                    }
                                                }
                                            ), r),
                                                N(t, "removeEventListener", (function(e) {
                                                        return function(t, n, r, i) {
                                                            try {
                                                                n = n && (n.N ? n.N : n)
                                                            } catch (o) {}
                                                            return e.call(this, t, n, r, i)
                                                        }
                                                    }
                                                ), r))
                                        }
                                        var n = this
                                            , r = n.t
                                            , i = this.k.autoBreadcrumbs;
                                        N(H, "setTimeout", e, r),
                                            N(H, "setInterval", e, r),
                                        H.requestAnimationFrame && N(H, "requestAnimationFrame", (function(e) {
                                                return function(t) {
                                                    return e(n.wrap({
                                                        mechanism: {
                                                            type: "instrument",
                                                            data: {
                                                                "function": "requestAnimationFrame",
                                                                handler: e && e.name || "<anonymous>"
                                                            }
                                                        }
                                                    }, t))
                                                }
                                            }
                                        ), r);
                                        for (var o = ["EventTarget", "Window", "Node", "ApplicationCache", "AudioTrackList", "ChannelMergerNode", "CryptoOperation", "EventSource", "FileReader", "HTMLUnknownElement", "IDBDatabase", "IDBRequest", "IDBTransaction", "KeyOperation", "MediaController", "MessagePort", "ModalWindow", "Notification", "SVGElementInstance", "Screen", "TextTrack", "TextTrackCue", "TextTrackList", "WebSocket", "WebSocketWorker", "Worker", "XMLHttpRequest", "XMLHttpRequestEventTarget", "XMLHttpRequestUpload"], a = 0; a < o.length; a++)
                                            t(o[a])
                                    },
                                    E: function() {
                                        function e(e, n) {
                                            e in n && v(n[e]) && N(n, e, (function(n) {
                                                    return t.wrap({
                                                        mechanism: {
                                                            type: "instrument",
                                                            data: {
                                                                "function": e,
                                                                handler: n && n.name || "<anonymous>"
                                                            }
                                                        }
                                                    }, n)
                                                }
                                            ))
                                        }
                                        var t = this
                                            , n = this.k.autoBreadcrumbs
                                            , r = t.t;
                                        if (n.xhr && "XMLHttpRequest"in H) {
                                            var i = H.XMLHttpRequest && H.XMLHttpRequest.prototype;
                                            N(i, "open", (function(e) {
                                                    return function(n, r) {
                                                        return b(r) && -1 === r.indexOf(t.h) && (this.ea = {
                                                            method: n,
                                                            url: r,
                                                            status_code: null
                                                        }),
                                                            e.apply(this, arguments)
                                                    }
                                                }
                                            ), r),
                                                N(i, "send", (function(n) {
                                                        return function() {
                                                            function r() {
                                                                if (i.ea && 4 === i.readyState) {
                                                                    try {
                                                                        i.ea.status_code = i.status
                                                                    } catch (e) {}
                                                                    t.captureBreadcrumb({
                                                                        type: "http",
                                                                        category: "xhr",
                                                                        data: i.ea
                                                                    })
                                                                }
                                                            }
                                                            for (var i = this, o = ["onload", "onerror", "onprogress"], a = 0; a < o.length; a++)
                                                                e(o[a], i);
                                                            return "onreadystatechange"in i && v(i.onreadystatechange) ? N(i, "onreadystatechange", (function(e) {
                                                                    return t.wrap({
                                                                        mechanism: {
                                                                            type: "instrument",
                                                                            data: {
                                                                                "function": "onreadystatechange",
                                                                                handler: e && e.name || "<anonymous>"
                                                                            }
                                                                        }
                                                                    }, e, r)
                                                                }
                                                            )) : i.onreadystatechange = r,
                                                                n.apply(this, arguments)
                                                        }
                                                    }
                                                ), r)
                                        }
                                        n.xhr && A() && N(H, "fetch", (function(e) {
                                                return function() {
                                                    for (var n = new Array(arguments.length), r = 0; r < n.length; ++r)
                                                        n[r] = arguments[r];
                                                    var i, o = n[0], a = "GET";
                                                    if ("string" == typeof o ? i = o : "Request"in H && o instanceof H.Request ? (i = o.url,
                                                    o.method && (a = o.method)) : i = "" + o,
                                                    -1 !== i.indexOf(t.h))
                                                        return e.apply(this, n);
                                                    n[1] && n[1].method && (a = n[1].method);
                                                    var s = {
                                                        method: a,
                                                        url: i,
                                                        status_code: null
                                                    };
                                                    return e.apply(this, n).then((function(e) {
                                                            return s.status_code = e.status,
                                                                t.captureBreadcrumb({
                                                                    type: "http",
                                                                    category: "fetch",
                                                                    data: s
                                                                }),
                                                                e
                                                        }
                                                    ))["catch"]((function(e) {
                                                            throw t.captureBreadcrumb({
                                                                type: "http",
                                                                category: "fetch",
                                                                data: s,
                                                                level: "error"
                                                            }),
                                                                e
                                                        }
                                                    ))
                                                }
                                            }
                                        ), r),
                                        n.dom && this.b && (K.addEventListener ? (K.addEventListener("click", t._("click"), !1),
                                            K.addEventListener("keypress", t.ba(), !1)) : K.attachEvent && (K.attachEvent("onclick", t._("click")),
                                            K.attachEvent("onkeypress", t.ba())));
                                        var o = H.chrome
                                            , a = !(o && o.app && o.app.runtime) && H.history && H.history.pushState && H.history.replaceState;
                                        if (n.location && a) {
                                            var s = H.onpopstate;
                                            H.onpopstate = function() {
                                                var e = t.w.href;
                                                if (t.ca(t.x, e),
                                                    s)
                                                    return s.apply(this, arguments)
                                            }
                                            ;
                                            var c = function(e) {
                                                return function() {
                                                    var n = arguments.length > 2 ? arguments[2] : void 0;
                                                    return n && t.ca(t.x, n + ""),
                                                        e.apply(this, arguments)
                                                }
                                            };
                                            N(H.history, "pushState", c, r),
                                                N(H.history, "replaceState", c, r)
                                        }
                                        if (n.console && "console"in H && console.log) {
                                            var l = function(e, n) {
                                                t.captureBreadcrumb({
                                                    message: e,
                                                    level: n.level,
                                                    category: "console"
                                                })
                                            };
                                            E(["debug", "info", "warn", "error", "log"], (function(e, t) {
                                                    Z(console, t, l)
                                                }
                                            ))
                                        }
                                    },
                                    R: function() {
                                        for (var e; this.t.length; ) {
                                            var t = (e = this.t.shift())[0]
                                                , n = e[1]
                                                , r = e[2];
                                            t[n] = r
                                        }
                                    },
                                    S: function() {
                                        for (var e in this.q)
                                            this.p[e] = this.q[e]
                                    },
                                    F: function() {
                                        var e = this;
                                        E(this.r, (function(t, n) {
                                                var r = n[0]
                                                    , i = n[1];
                                                r.apply(e, [e].concat(i))
                                            }
                                        ))
                                    },
                                    G: function(e) {
                                        var t = D.exec(e)
                                            , n = {}
                                            , r = 7;
                                        try {
                                            for (; r--; )
                                                n[I[r]] = t[r] || ""
                                        } catch (i) {
                                            throw new l("Invalid DSN: " + e)
                                        }
                                        if (n.pass && !this.k.allowSecretKey)
                                            throw new l("Do not specify your secret key in the DSN. See: http://bit.ly/raven-secret-key");
                                        return n
                                    },
                                    J: function(e) {
                                        var t = "//" + e.host + (e.port ? ":" + e.port : "");
                                        return e.protocol && (t = e.protocol + ":" + t),
                                            t
                                    },
                                    A: function(e, t) {
                                        (t = t || {}).mechanism = t.mechanism || {
                                            type: "onerror",
                                            handled: !1
                                        },
                                        this.m || this.V(e, t)
                                    },
                                    V: function(e, t) {
                                        var n = this.X(e, t);
                                        this.$("handle", {
                                            stackInfo: e,
                                            options: t
                                        }),
                                            this.fa(e.name, e.message, e.url, e.lineno, n, t)
                                    },
                                    X: function(e, t) {
                                        var n = this
                                            , r = [];
                                        if (e.stack && e.stack.length && (E(e.stack, (function(t, i) {
                                                var o = n.ga(i, e.url);
                                                o && r.push(o)
                                            }
                                        )),
                                        t && t.trimHeadFrames))
                                            for (var i = 0; i < t.trimHeadFrames && i < r.length; i++)
                                                r[i].in_app = !1;
                                        return r = r.slice(0, this.k.stackTraceLimit)
                                    },
                                    ga: function(e, t) {
                                        var n = {
                                            filename: e.url,
                                            lineno: e.line,
                                            colno: e.column,
                                            "function": e.func || "?"
                                        };
                                        return e.url || (n.filename = t),
                                            n.in_app = !(this.k.includePaths.test && !this.k.includePaths.test(n.filename) || /(Raven|TraceKit)\./.test(n["function"]) || /raven\.(min\.)?js$/.test(n.filename)),
                                            n
                                    },
                                    fa: function(e, t, n, r, i, o) {
                                        var a, s = (e ? e + ": " : "") + (t || "");
                                        if ((!this.k.ignoreErrors.test || !this.k.ignoreErrors.test(t) && !this.k.ignoreErrors.test(s)) && (i && i.length ? (n = i[0].filename || n,
                                            i.reverse(),
                                            a = {
                                                frames: i
                                            }) : n && (a = {
                                            frames: [{
                                                filename: n,
                                                lineno: r,
                                                in_app: !0
                                            }]
                                        }),
                                        (!this.k.ignoreUrls.test || !this.k.ignoreUrls.test(n)) && (!this.k.whitelistUrls.test || this.k.whitelistUrls.test(n)))) {
                                            var c = k({
                                                exception: {
                                                    values: [{
                                                        type: e,
                                                        value: t,
                                                        stacktrace: a
                                                    }]
                                                },
                                                transaction: n
                                            }, o)
                                                , l = c.exception.values[0];
                                            null == l.type && "" === l.value && (l.value = "Unrecoverable error caught"),
                                            !c.exception.mechanism && c.mechanism && (c.exception.mechanism = c.mechanism,
                                                delete c.mechanism),
                                                c.exception.mechanism = k({
                                                    type: "generic",
                                                    handled: !0
                                                }, c.exception.mechanism || {}),
                                                this.Y(c)
                                        }
                                    },
                                    ha: function(e) {
                                        var t = this.k.maxMessageLength;
                                        if (e.message && (e.message = V(e.message, t)),
                                            e.exception) {
                                            var n = e.exception.values[0];
                                            n.value = V(n.value, t)
                                        }
                                        var r = e.request;
                                        return r && (r.url && (r.url = V(r.url, this.k.maxUrlLength)),
                                        r.Referer && (r.Referer = V(r.Referer, this.k.maxUrlLength))),
                                        e.breadcrumbs && e.breadcrumbs.values && this.ia(e.breadcrumbs),
                                            e
                                    },
                                    ia: function(e) {
                                        for (var t, n, r, i = ["to", "from", "url"], o = 0; o < e.values.length; ++o)
                                            if ((n = e.values[o]).hasOwnProperty("data") && m(n.data) && !x(n.data)) {
                                                r = k({}, n.data);
                                                for (var a = 0; a < i.length; ++a)
                                                    t = i[a],
                                                    r.hasOwnProperty(t) && r[t] && (r[t] = V(r[t], this.k.maxUrlLength));
                                                e.values[o].data = r
                                            }
                                    },
                                    ja: function() {
                                        if (this.c || this.b) {
                                            var e = {};
                                            return this.c && L.userAgent && (e.headers = {
                                                "User-Agent": L.userAgent
                                            }),
                                            H.location && H.location.href && (e.url = H.location.href),
                                            this.b && K.referrer && (e.headers || (e.headers = {}),
                                                e.headers.Referer = K.referrer),
                                                e
                                        }
                                    },
                                    y: function() {
                                        this.ka = 0,
                                            this.la = null
                                    },
                                    ma: function() {
                                        return this.ka && r() - this.la < this.ka
                                    },
                                    na: function(e) {
                                        var t = this.e;
                                        return !(!t || e.message !== t.message || e.transaction !== t.transaction) && (e.stacktrace || t.stacktrace ? O(e.stacktrace, t.stacktrace) : e.exception || t.exception ? C(e.exception, t.exception) : !e.fingerprint && !t.fingerprint || Boolean(e.fingerprint && t.fingerprint) && JSON.stringify(e.fingerprint) === JSON.stringify(t.fingerprint))
                                    },
                                    oa: function(e) {
                                        if (!this.ma()) {
                                            var t = e.status;
                                            if (400 === t || 401 === t || 429 === t) {
                                                var n;
                                                try {
                                                    n = A() ? e.headers.get("Retry-After") : e.getResponseHeader("Retry-After"),
                                                        n = 1e3 * parseInt(n, 10)
                                                } catch (i) {}
                                                this.ka = n || (2 * this.ka || 1e3),
                                                    this.la = r()
                                            }
                                        }
                                    },
                                    Y: function(e) {
                                        var t = this.k
                                            , n = {
                                            project: this.i,
                                            logger: t.logger,
                                            platform: "javascript"
                                        }
                                            , i = this.ja();
                                        if (i && (n.request = i),
                                        e.trimHeadFrames && delete e.trimHeadFrames,
                                            (e = k(n, e)).tags = k(k({}, this.j.tags), e.tags),
                                            e.extra = k(k({}, this.j.extra), e.extra),
                                            e.extra["session:duration"] = r() - this.s,
                                        this.u && this.u.length > 0 && (e.breadcrumbs = {
                                            values: [].slice.call(this.u, 0)
                                        }),
                                        this.j.user && (e.user = this.j.user),
                                        t.environment && (e.environment = t.environment),
                                        t.release && (e.release = t.release),
                                        t.serverName && (e.server_name = t.serverName),
                                            e = this.pa(e),
                                            Object.keys(e).forEach((function(t) {
                                                    (null == e[t] || "" === e[t] || _(e[t])) && delete e[t]
                                                }
                                            )),
                                        v(t.dataCallback) && (e = t.dataCallback(e) || e),
                                        e && !_(e) && (!v(t.shouldSendCallback) || t.shouldSendCallback(e)))
                                            return this.ma() ? void this.z("warn", "Raven dropped error due to backoff: ", e) : void ("number" == typeof t.sampleRate ? Math.random() < t.sampleRate && this.qa(e) : this.qa(e))
                                    },
                                    pa: function(e) {
                                        return B(e, this.k.sanitizeKeys)
                                    },
                                    ra: function() {
                                        return M()
                                    },
                                    qa: function(e, t) {
                                        var n = this
                                            , r = this.k;
                                        if (this.isSetup()) {
                                            if (e = this.ha(e),
                                            !this.k.allowDuplicates && this.na(e))
                                                return void this.z("warn", "Raven dropped repeat event: ", e);
                                            this.f = e.event_id || (e.event_id = this.ra()),
                                                this.e = e,
                                                this.z("debug", "Raven about to send:", e);
                                            var i = {
                                                sentry_version: "7",
                                                sentry_client: "raven-js/" + this.VERSION,
                                                sentry_key: this.h
                                            };
                                            this.I && (i.sentry_secret = this.I);
                                            var o = e.exception && e.exception.values[0];
                                            this.k.autoBreadcrumbs && this.k.autoBreadcrumbs.sentry && this.captureBreadcrumb({
                                                category: "sentry",
                                                message: o ? (o.type ? o.type + ": " : "") + o.value : e.message,
                                                event_id: e.event_id,
                                                level: e.level || "error"
                                            });
                                            var a = this.K;
                                            (r.transport || this._makeRequest).call(this, {
                                                url: a,
                                                auth: i,
                                                data: e,
                                                options: r,
                                                onSuccess: function() {
                                                    n.y(),
                                                        n.$("success", {
                                                            data: e,
                                                            src: a
                                                        }),
                                                    t && t()
                                                },
                                                onError: function(r) {
                                                    n.z("error", "Raven transport failed to send: ", r),
                                                    r.request && n.oa(r.request),
                                                        n.$("failure", {
                                                            data: e,
                                                            src: a
                                                        }),
                                                        r = r || new Error("Raven send failed (no additional details provided)"),
                                                    t && t(r)
                                                }
                                            })
                                        }
                                    },
                                    _makeRequest: function(e) {
                                        var t = e.url + "?" + R(e.auth)
                                            , n = null
                                            , r = {};
                                        if (e.options.headers && (n = this.sa(e.options.headers)),
                                        e.options.fetchParameters && (r = this.sa(e.options.fetchParameters)),
                                            A()) {
                                            r.body = s(e.data);
                                            var i = k({}, this.l)
                                                , o = k(i, r);
                                            return n && (o.headers = n),
                                                H.fetch(t, o).then((function(t) {
                                                        if (t.ok)
                                                            e.onSuccess && e.onSuccess();
                                                        else {
                                                            var n = new Error("Sentry error code: " + t.status);
                                                            n.request = t,
                                                            e.onError && e.onError(n)
                                                        }
                                                    }
                                                ))["catch"]((function() {
                                                        e.onError && e.onError(new Error("Sentry error code: network unavailable"))
                                                    }
                                                ))
                                        }
                                        var a = H.XMLHttpRequest && new H.XMLHttpRequest;
                                        a && (("withCredentials"in a || "undefined" != typeof XDomainRequest) && ("withCredentials"in a ? a.onreadystatechange = function() {
                                                if (4 === a.readyState)
                                                    if (200 === a.status)
                                                        e.onSuccess && e.onSuccess();
                                                    else if (e.onError) {
                                                        var t = new Error("Sentry error code: " + a.status);
                                                        t.request = a,
                                                            e.onError(t)
                                                    }
                                            }
                                            : (a = new XDomainRequest,
                                                t = t.replace(/^https?:/, ""),
                                            e.onSuccess && (a.onload = e.onSuccess),
                                            e.onError && (a.onerror = function() {
                                                    var t = new Error("Sentry error code: XDomainRequest");
                                                    t.request = a,
                                                        e.onError(t)
                                                }
                                            )),
                                            a.open("POST", t),
                                        n && E(n, (function(e, t) {
                                                a.setRequestHeader(e, t)
                                            }
                                        )),
                                            a.send(s(e.data))))
                                    },
                                    sa: function(e) {
                                        var t = {};
                                        for (var n in e)
                                            if (e.hasOwnProperty(n)) {
                                                var r = e[n];
                                                t[n] = "function" == typeof r ? r() : r
                                            }
                                        return t
                                    },
                                    z: function(e) {
                                        this.q[e] && (this.debug || this.k.debug) && Function.prototype.apply.call(this.q[e], this.p, [].slice.call(arguments, 1))
                                    },
                                    Z: function(e, t) {
                                        y(t) ? delete this.j[e] : this.j[e] = k(this.j[e] || {}, t)
                                    }
                                },
                                    o.prototype.setUser = o.prototype.setUserContext,
                                    o.prototype.setReleaseContext = o.prototype.setRelease,
                                    t.exports = o
                            }
                        ).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
                    }
                        , {
                            1: 1,
                            2: 2,
                            5: 5,
                            6: 6,
                            7: 7,
                            8: 8
                        }],
                    4: [function(e, t, n) {
                        (function(n) {
                                var r = e(3)
                                    , i = "undefined" != typeof window ? window : void 0 !== n ? n : "undefined" != typeof self ? self : {}
                                    , o = i.Raven
                                    , a = new r;
                                a.noConflict = function() {
                                    return i.Raven = o,
                                        a
                                }
                                    ,
                                    a.afterLoad(),
                                    t.exports = a,
                                    t.exports.Client = r
                            }
                        ).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
                    }
                        , {
                            3: 3
                        }],
                    5: [function(e, t, n) {
                        (function(n) {
                                function r(e) {
                                    switch (Object.prototype.toString.call(e)) {
                                        case "[object Error]":
                                        case "[object Exception]":
                                        case "[object DOMException]":
                                            return !0;
                                        default:
                                            return e instanceof Error
                                    }
                                }
                                function i(e) {
                                    return "[object DOMError]" === Object.prototype.toString.call(e)
                                }
                                function o(e) {
                                    return void 0 === e
                                }
                                function a(e) {
                                    return "[object Object]" === Object.prototype.toString.call(e)
                                }
                                function s(e) {
                                    return "[object String]" === Object.prototype.toString.call(e)
                                }
                                function c(e) {
                                    return "[object Array]" === Object.prototype.toString.call(e)
                                }
                                function l() {
                                    if (!("fetch"in _))
                                        return !1;
                                    try {
                                        return new Headers,
                                            new Request(""),
                                            new Response,
                                            !0
                                    } catch (e) {
                                        return !1
                                    }
                                }
                                function h(e, t) {
                                    var n, r;
                                    if (o(e.length))
                                        for (n in e)
                                            p(e, n) && t.call(null, n, e[n]);
                                    else if (r = e.length)
                                        for (n = 0; n < r; n++)
                                            t.call(null, n, e[n])
                                }
                                function u(e, t) {
                                    if ("number" != typeof t)
                                        throw new Error("2nd argument to `truncate` function should be a number");
                                    return "string" != typeof e || 0 === t || e.length <= t ? e : e.substr(0, t) + "…"
                                }
                                function p(e, t) {
                                    return Object.prototype.hasOwnProperty.call(e, t)
                                }
                                function d(e) {
                                    for (var t, n = [], r = 0, i = e.length; r < i; r++)
                                        s(t = e[r]) ? n.push(t.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1")) : t && t.source && n.push(t.source);
                                    return new RegExp(n.join("|"),"i")
                                }
                                function f(e) {
                                    var t, n, r, i, o, a = [];
                                    if (!e || !e.tagName)
                                        return "";
                                    if (a.push(e.tagName.toLowerCase()),
                                    e.id && a.push("#" + e.id),
                                    (t = e.className) && s(t))
                                        for (n = t.split(/\s+/),
                                                 o = 0; o < n.length; o++)
                                            a.push("." + n[o]);
                                    var c = ["type", "name", "title", "alt"];
                                    for (o = 0; o < c.length; o++)
                                        r = c[o],
                                        (i = e.getAttribute(r)) && a.push("[" + r + '="' + i + '"]');
                                    return a.join("")
                                }
                                function m(e, t) {
                                    return !!(!!e ^ !!t)
                                }
                                function g(e, t) {
                                    if (m(e, t))
                                        return !1;
                                    var n = e.frames
                                        , r = t.frames;
                                    if (void 0 === n || void 0 === r)
                                        return !1;
                                    if (n.length !== r.length)
                                        return !1;
                                    for (var i, o, a = 0; a < n.length; a++)
                                        if (i = n[a],
                                            o = r[a],
                                        i.filename !== o.filename || i.lineno !== o.lineno || i.colno !== o.colno || i["function"] !== o["function"])
                                            return !1;
                                    return !0
                                }
                                function y(e) {
                                    return function(e) {
                                        return ~-encodeURI(e).split(/%..|./).length
                                    }(JSON.stringify(e))
                                }
                                function v(e) {
                                    if ("string" == typeof e) {
                                        return u(e, 40)
                                    }
                                    if ("number" == typeof e || "boolean" == typeof e || void 0 === e)
                                        return e;
                                    var t = Object.prototype.toString.call(e);
                                    return "[object Object]" === t ? "[Object]" : "[object Array]" === t ? "[Array]" : "[object Function]" === t ? e.name ? "[Function: " + e.name + "]" : "[Function]" : e
                                }
                                function b(e, t) {
                                    return 0 === t ? v(e) : a(e) ? Object.keys(e).reduce((function(n, r) {
                                            return n[r] = b(e[r], t - 1),
                                                n
                                        }
                                    ), {}) : Array.isArray(e) ? e.map((function(e) {
                                            return b(e, t - 1)
                                        }
                                    )) : v(e)
                                }
                                var w = e(7)
                                    , _ = "undefined" != typeof window ? window : void 0 !== n ? n : "undefined" != typeof self ? self : {}
                                    , E = 3
                                    , k = 51200
                                    , V = 40;
                                t.exports = {
                                    isObject: function(e) {
                                        return "object" == typeof e && null !== e
                                    },
                                    isError: r,
                                    isErrorEvent: function(e) {
                                        return "[object ErrorEvent]" === Object.prototype.toString.call(e)
                                    },
                                    isDOMError: i,
                                    isDOMException: function(e) {
                                        return "[object DOMException]" === Object.prototype.toString.call(e)
                                    },
                                    isUndefined: o,
                                    isFunction: function(e) {
                                        return "function" == typeof e
                                    },
                                    isPlainObject: a,
                                    isString: s,
                                    isArray: c,
                                    isEmptyObject: function(e) {
                                        if (!a(e))
                                            return !1;
                                        for (var t in e)
                                            if (e.hasOwnProperty(t))
                                                return !1;
                                        return !0
                                    },
                                    supportsErrorEvent: function() {
                                        try {
                                            return new ErrorEvent(""),
                                                !0
                                        } catch (e) {
                                            return !1
                                        }
                                    },
                                    supportsDOMError: function() {
                                        try {
                                            return new DOMError(""),
                                                !0
                                        } catch (e) {
                                            return !1
                                        }
                                    },
                                    supportsDOMException: function() {
                                        try {
                                            return new DOMException(""),
                                                !0
                                        } catch (e) {
                                            return !1
                                        }
                                    },
                                    supportsFetch: l,
                                    supportsReferrerPolicy: function() {
                                        if (!l())
                                            return !1;
                                        try {
                                            return new Request("pickleRick",{
                                                referrerPolicy: "origin"
                                            }),
                                                !0
                                        } catch (e) {
                                            return !1
                                        }
                                    },
                                    supportsPromiseRejectionEvent: function() {
                                        return "function" == typeof PromiseRejectionEvent
                                    },
                                    wrappedCallback: function(e) {
                                        return function(t, n) {
                                            var r = e(t) || t;
                                            return n && n(r) || r
                                        }
                                    },
                                    each: h,
                                    objectMerge: function(e, t) {
                                        return t ? (h(t, (function(t, n) {
                                                e[t] = n
                                            }
                                        )),
                                            e) : e
                                    },
                                    truncate: u,
                                    objectFrozen: function(e) {
                                        return !!Object.isFrozen && Object.isFrozen(e)
                                    },
                                    hasKey: p,
                                    joinRegExp: d,
                                    urlencode: function(e) {
                                        var t = [];
                                        return h(e, (function(e, n) {
                                                t.push(encodeURIComponent(e) + "=" + encodeURIComponent(n))
                                            }
                                        )),
                                            t.join("&")
                                    },
                                    uuid4: function() {
                                        var e = _.crypto || _.msCrypto;
                                        if (!o(e) && e.getRandomValues) {
                                            var t = new Uint16Array(8);
                                            e.getRandomValues(t),
                                                t[3] = 4095 & t[3] | 16384,
                                                t[4] = 16383 & t[4] | 32768;
                                            var n = function(e) {
                                                for (var t = e.toString(16); t.length < 4; )
                                                    t = "0" + t;
                                                return t
                                            };
                                            return n(t[0]) + n(t[1]) + n(t[2]) + n(t[3]) + n(t[4]) + n(t[5]) + n(t[6]) + n(t[7])
                                        }
                                        return "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, (function(e) {
                                                var t = 16 * Math.random() | 0;
                                                return ("x" === e ? t : 3 & t | 8).toString(16)
                                            }
                                        ))
                                    },
                                    htmlTreeAsString: function(e) {
                                        for (var t, n = [], r = 0, i = 0, o = " > ".length; e && r++ < 5 && !("html" === (t = f(e)) || r > 1 && i + n.length * o + t.length >= 80); )
                                            n.push(t),
                                                i += t.length,
                                                e = e.parentNode;
                                        return n.reverse().join(" > ")
                                    },
                                    htmlElementAsString: f,
                                    isSameException: function(e, t) {
                                        return !m(e, t) && (e = e.values[0],
                                            t = t.values[0],
                                        e.type === t.type && e.value === t.value && !function(e, t) {
                                            return o(e) && o(t)
                                        }(e.stacktrace, t.stacktrace) && g(e.stacktrace, t.stacktrace))
                                    },
                                    isSameStacktrace: g,
                                    parseUrl: function(e) {
                                        if ("string" != typeof e)
                                            return {};
                                        var t = e.match(/^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/)
                                            , n = t[6] || ""
                                            , r = t[8] || "";
                                        return {
                                            protocol: t[2],
                                            host: t[4],
                                            path: t[5],
                                            relative: t[5] + n + r
                                        }
                                    },
                                    fill: function(e, t, n, r) {
                                        if (null != e) {
                                            var i = e[t];
                                            e[t] = n(i),
                                                e[t].M = !0,
                                                e[t].O = i,
                                            r && r.push([e, t, i])
                                        }
                                    },
                                    safeJoin: function(e, t) {
                                        if (!c(e))
                                            return "";
                                        for (var n = [], i = 0; i < e.length; i++)
                                            try {
                                                n.push(String(e[i]))
                                            } catch (r) {
                                                n.push("[value cannot be serialized]")
                                            }
                                        return n.join(t)
                                    },
                                    serializeException: function x(e, t, n) {
                                        if (!a(e))
                                            return e;
                                        n = "number" != typeof (t = "number" != typeof t ? E : t) ? k : n;
                                        var r = b(e, t);
                                        return y(w(r)) > n ? x(e, t - 1) : r
                                    },
                                    serializeKeysForMessage: function(e, t) {
                                        if ("number" == typeof e || "string" == typeof e)
                                            return e.toString();
                                        if (!Array.isArray(e))
                                            return "";
                                        if (0 === (e = e.filter((function(e) {
                                                return "string" == typeof e
                                            }
                                        ))).length)
                                            return "[object has no keys]";
                                        if (t = "number" != typeof t ? V : t,
                                        e[0].length >= t)
                                            return e[0];
                                        for (var n = e.length; n > 0; n--) {
                                            var r = e.slice(0, n).join(", ");
                                            if (!(r.length > t))
                                                return n === e.length ? r : r + "…"
                                        }
                                        return ""
                                    },
                                    sanitize: function(e, t) {
                                        if (!c(t) || c(t) && 0 === t.length)
                                            return e;
                                        var n, r = d(t), o = "********";
                                        try {
                                            n = JSON.parse(w(e))
                                        } catch (i) {
                                            return e
                                        }
                                        return function s(e) {
                                            return c(e) ? e.map((function(e) {
                                                    return s(e)
                                                }
                                            )) : a(e) ? Object.keys(e).reduce((function(t, n) {
                                                    return t[n] = r.test(n) ? o : s(e[n]),
                                                        t
                                                }
                                            ), {}) : e
                                        }(n)
                                    }
                                }
                            }
                        ).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
                    }
                        , {
                            7: 7
                        }],
                    6: [function(e, t, n) {
                        (function(n) {
                                function r() {
                                    return "undefined" == typeof document || null == document.location ? "" : document.location.href
                                }
                                var i = e(5)
                                    , o = {
                                    collectWindowErrors: !0,
                                    debug: !1
                                }
                                    , a = "undefined" != typeof window ? window : void 0 !== n ? n : "undefined" != typeof self ? self : {}
                                    , s = [].slice
                                    , c = "?"
                                    , l = /^(?:[Uu]ncaught (?:exception: )?)?(?:((?:Eval|Internal|Range|Reference|Syntax|Type|URI|)Error): )?(.*)$/;
                                o.report = function() {
                                    function e(t, n) {
                                        var r = null;
                                        if (!n || o.collectWindowErrors) {
                                            for (var i in d)
                                                if (d.hasOwnProperty(i))
                                                    try {
                                                        d[i].apply(null, [t].concat(s.call(arguments, 2)))
                                                    } catch (e) {
                                                        r = e
                                                    }
                                            if (r)
                                                throw r
                                        }
                                    }
                                    function t(t, a, s, h, p) {
                                        var d = i.isErrorEvent(p) ? p.error : p
                                            , f = i.isErrorEvent(t) ? t.message : t;
                                        if (g)
                                            o.computeStackTrace.augmentStackTraceWithInitialElement(g, a, s, f),
                                                n();
                                        else if (d && i.isError(d))
                                            e(o.computeStackTrace(d), !0);
                                        else {
                                            var m, y = {
                                                url: a,
                                                line: s,
                                                column: h
                                            }, v = void 0;
                                            if ("[object String]" === {}.toString.call(f))
                                                (m = f.match(l)) && (v = m[1],
                                                    f = m[2]);
                                            y.func = c,
                                                e({
                                                    name: v,
                                                    message: f,
                                                    url: r(),
                                                    stack: [y]
                                                }, !0)
                                        }
                                        return !!u && u.apply(this, arguments)
                                    }
                                    function n() {
                                        var t = g
                                            , n = f;
                                        f = null,
                                            g = null,
                                            m = null,
                                            e.apply(null, [t, !1].concat(n))
                                    }
                                    function h(e, t) {
                                        var r = s.call(arguments, 1);
                                        if (g) {
                                            if (m === e)
                                                return;
                                            n()
                                        }
                                        var i = o.computeStackTrace(e);
                                        if (g = i,
                                            m = e,
                                            f = r,
                                            setTimeout((function() {
                                                    m === e && n()
                                                }
                                            ), i.incomplete ? 2e3 : 0),
                                        !1 !== t)
                                            throw e
                                    }
                                    var u, p, d = [], f = null, m = null, g = null;
                                    return h.subscribe = function(e) {
                                        p || (u = a.onerror,
                                            a.onerror = t,
                                            p = !0),
                                            d.push(e)
                                    }
                                        ,
                                        h.unsubscribe = function(e) {
                                            for (var t = d.length - 1; t >= 0; --t)
                                                d[t] === e && d.splice(t, 1)
                                        }
                                        ,
                                        h.uninstall = function() {
                                            p && (a.onerror = u,
                                                p = !1,
                                                u = void 0),
                                                d = []
                                        }
                                        ,
                                        h
                                }(),
                                    o.computeStackTrace = function() {
                                        function e(e) {
                                            if ("undefined" != typeof e.stack && e.stack) {
                                                for (var t, n, i, o = /^\s*at (?:(.*?) ?\()?((?:file|https?|blob|chrome-extension|native|eval|webpack|<anonymous>|[a-z]:|\/).*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i, a = /^\s*at (?:((?:\[object object\])?.+) )?\(?((?:file|ms-appx(?:-web)|https?|webpack|blob):.*?):(\d+)(?::(\d+))?\)?\s*$/i, s = /^\s*(.*?)(?:\((.*?)\))?(?:^|@)((?:file|https?|blob|chrome|webpack|resource|moz-extension).*?:\/.*?|\[native code\]|[^@]*(?:bundle|\d+\.js))(?::(\d+))?(?::(\d+))?\s*$/i, l = /(\S+) line (\d+)(?: > eval line \d+)* > eval/i, h = /\((\S*)(?::(\d+))(?::(\d+))\)/, u = e.stack.split("\n"), p = [], d = (/^(.*) is undefined$/.exec(e.message),
                                                    0), f = u.length; d < f; ++d) {
                                                    if (n = o.exec(u[d])) {
                                                        var m = n[2] && 0 === n[2].indexOf("native");
                                                        n[2] && 0 === n[2].indexOf("eval") && (t = h.exec(n[2])) && (n[2] = t[1],
                                                            n[3] = t[2],
                                                            n[4] = t[3]),
                                                            i = {
                                                                url: m ? null : n[2],
                                                                func: n[1] || c,
                                                                args: m ? [n[2]] : [],
                                                                line: n[3] ? +n[3] : null,
                                                                column: n[4] ? +n[4] : null
                                                            }
                                                    } else if (n = a.exec(u[d]))
                                                        i = {
                                                            url: n[2],
                                                            func: n[1] || c,
                                                            args: [],
                                                            line: +n[3],
                                                            column: n[4] ? +n[4] : null
                                                        };
                                                    else {
                                                        if (!(n = s.exec(u[d])))
                                                            continue;
                                                        n[3] && n[3].indexOf(" > eval") > -1 && (t = l.exec(n[3])) ? (n[3] = t[1],
                                                            n[4] = t[2],
                                                            n[5] = null) : 0 !== d || n[5] || "undefined" == typeof e.columnNumber || (p[0].column = e.columnNumber + 1),
                                                            i = {
                                                                url: n[3],
                                                                func: n[1] || c,
                                                                args: n[2] ? n[2].split(",") : [],
                                                                line: n[4] ? +n[4] : null,
                                                                column: n[5] ? +n[5] : null
                                                            }
                                                    }
                                                    if (!i.func && i.line && (i.func = c),
                                                    i.url && "blob:" === i.url.substr(0, 5)) {
                                                        var g = new XMLHttpRequest;
                                                        if (g.open("GET", i.url, !1),
                                                            g.send(null),
                                                        200 === g.status) {
                                                            var y = g.responseText || ""
                                                                , v = (y = y.slice(-300)).match(/\/\/# sourceMappingURL=(.*)$/);
                                                            if (v) {
                                                                var b = v[1];
                                                                "~" === b.charAt(0) && (b = ("undefined" == typeof document || null == document.location ? "" : document.location.origin ? document.location.origin : document.location.protocol + "//" + document.location.hostname + (document.location.port ? ":" + document.location.port : "")) + b.slice(1)),
                                                                    i.url = b.slice(0, -4)
                                                            }
                                                        }
                                                    }
                                                    p.push(i)
                                                }
                                                return p.length ? {
                                                    name: e.name,
                                                    message: e.message,
                                                    url: r(),
                                                    stack: p
                                                } : null
                                            }
                                        }
                                        function t(e, t, n, r) {
                                            var i = {
                                                url: t,
                                                line: n
                                            };
                                            if (i.url && i.line) {
                                                if (e.incomplete = !1,
                                                i.func || (i.func = c),
                                                e.stack.length > 0 && e.stack[0].url === i.url) {
                                                    if (e.stack[0].line === i.line)
                                                        return !1;
                                                    if (!e.stack[0].line && e.stack[0].func === i.func)
                                                        return e.stack[0].line = i.line,
                                                            !1
                                                }
                                                return e.stack.unshift(i),
                                                    e.partial = !0,
                                                    !0
                                            }
                                            return e.incomplete = !0,
                                                !1
                                        }
                                        function n(e, a) {
                                            for (var s, l, h = /function\s+([_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*)?\s*\(/i, u = [], p = {}, d = !1, f = n.caller; f && !d; f = f.caller)
                                                if (f !== i && f !== o.report) {
                                                    if (l = {
                                                        url: null,
                                                        func: c,
                                                        line: null,
                                                        column: null
                                                    },
                                                        f.name ? l.func = f.name : (s = h.exec(f.toString())) && (l.func = s[1]),
                                                    "undefined" == typeof l.func)
                                                        try {
                                                            l.func = s.input.substring(0, s.input.indexOf("{"))
                                                        } catch (g) {}
                                                    p["" + f] ? d = !0 : p["" + f] = !0,
                                                        u.push(l)
                                                }
                                            a && u.splice(0, a);
                                            var m = {
                                                name: e.name,
                                                message: e.message,
                                                url: r(),
                                                stack: u
                                            };
                                            return t(m, e.sourceURL || e.fileName, e.line || e.lineNumber, e.message || e.description),
                                                m
                                        }
                                        function i(t, i) {
                                            var s = null;
                                            i = null == i ? 0 : +i;
                                            try {
                                                if (s = e(t))
                                                    return s
                                            } catch (a) {
                                                if (o.debug)
                                                    throw a
                                            }
                                            try {
                                                if (s = n(t, i + 1))
                                                    return s
                                            } catch (a) {
                                                if (o.debug)
                                                    throw a
                                            }
                                            return {
                                                name: t.name,
                                                message: t.message,
                                                url: r()
                                            }
                                        }
                                        return i.augmentStackTraceWithInitialElement = t,
                                            i.computeStackTraceFromStackProp = e,
                                            i
                                    }(),
                                    t.exports = o
                            }
                        ).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
                    }
                        , {
                            5: 5
                        }],
                    7: [function(e, t, n) {
                        function r(e, t) {
                            for (var n = 0; n < e.length; ++n)
                                if (e[n] === t)
                                    return n;
                            return -1
                        }
                        function i(e, t) {
                            var n = []
                                , i = [];
                            return null == t && (t = function(e, t) {
                                    return n[0] === t ? "[Circular ~]" : "[Circular ~." + i.slice(0, r(n, t)).join(".") + "]"
                                }
                            ),
                                function(o, a) {
                                    if (n.length > 0) {
                                        var s = r(n, this);
                                        ~s ? n.splice(s + 1) : n.push(this),
                                            ~s ? i.splice(s, 1 / 0, o) : i.push(o),
                                        ~r(n, a) && (a = t.call(this, o, a))
                                    } else
                                        n.push(a);
                                    return null == e ? a instanceof Error ? function(e) {
                                        var t = {
                                            stack: e.stack,
                                            message: e.message,
                                            name: e.name
                                        };
                                        for (var n in e)
                                            Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
                                        return t
                                    }(a) : a : e.call(this, o, a)
                                }
                        }
                        n = t.exports = function(e, t, n, r) {
                            return JSON.stringify(e, i(t, r), n)
                        }
                            ,
                            n.getSerialize = i
                    }
                        , {}],
                    8: [function(e, t, n) {
                        function r(e, t) {
                            var n = (65535 & e) + (65535 & t);
                            return (e >> 16) + (t >> 16) + (n >> 16) << 16 | 65535 & n
                        }
                        function i(e, t, n, i, o, a) {
                            return r(function(e, t) {
                                return e << t | e >>> 32 - t
                            }(r(r(t, e), r(i, a)), o), n)
                        }
                        function o(e, t, n, r, o, a, s) {
                            return i(t & n | ~t & r, e, t, o, a, s)
                        }
                        function a(e, t, n, r, o, a, s) {
                            return i(t & r | n & ~r, e, t, o, a, s)
                        }
                        function s(e, t, n, r, o, a, s) {
                            return i(t ^ n ^ r, e, t, o, a, s)
                        }
                        function c(e, t, n, r, o, a, s) {
                            return i(n ^ (t | ~r), e, t, o, a, s)
                        }
                        function l(e, t) {
                            e[t >> 5] |= 128 << t % 32,
                                e[14 + (t + 64 >>> 9 << 4)] = t;
                            var n, i, l, h, u, p = 1732584193, d = -271733879, f = -1732584194, m = 271733878;
                            for (n = 0; n < e.length; n += 16)
                                i = p,
                                    l = d,
                                    h = f,
                                    u = m,
                                    p = o(p, d, f, m, e[n], 7, -680876936),
                                    m = o(m, p, d, f, e[n + 1], 12, -389564586),
                                    f = o(f, m, p, d, e[n + 2], 17, 606105819),
                                    d = o(d, f, m, p, e[n + 3], 22, -1044525330),
                                    p = o(p, d, f, m, e[n + 4], 7, -176418897),
                                    m = o(m, p, d, f, e[n + 5], 12, 1200080426),
                                    f = o(f, m, p, d, e[n + 6], 17, -1473231341),
                                    d = o(d, f, m, p, e[n + 7], 22, -45705983),
                                    p = o(p, d, f, m, e[n + 8], 7, 1770035416),
                                    m = o(m, p, d, f, e[n + 9], 12, -1958414417),
                                    f = o(f, m, p, d, e[n + 10], 17, -42063),
                                    d = o(d, f, m, p, e[n + 11], 22, -1990404162),
                                    p = o(p, d, f, m, e[n + 12], 7, 1804603682),
                                    m = o(m, p, d, f, e[n + 13], 12, -40341101),
                                    f = o(f, m, p, d, e[n + 14], 17, -1502002290),
                                    p = a(p, d = o(d, f, m, p, e[n + 15], 22, 1236535329), f, m, e[n + 1], 5, -165796510),
                                    m = a(m, p, d, f, e[n + 6], 9, -1069501632),
                                    f = a(f, m, p, d, e[n + 11], 14, 643717713),
                                    d = a(d, f, m, p, e[n], 20, -373897302),
                                    p = a(p, d, f, m, e[n + 5], 5, -701558691),
                                    m = a(m, p, d, f, e[n + 10], 9, 38016083),
                                    f = a(f, m, p, d, e[n + 15], 14, -660478335),
                                    d = a(d, f, m, p, e[n + 4], 20, -405537848),
                                    p = a(p, d, f, m, e[n + 9], 5, 568446438),
                                    m = a(m, p, d, f, e[n + 14], 9, -1019803690),
                                    f = a(f, m, p, d, e[n + 3], 14, -187363961),
                                    d = a(d, f, m, p, e[n + 8], 20, 1163531501),
                                    p = a(p, d, f, m, e[n + 13], 5, -1444681467),
                                    m = a(m, p, d, f, e[n + 2], 9, -51403784),
                                    f = a(f, m, p, d, e[n + 7], 14, 1735328473),
                                    p = s(p, d = a(d, f, m, p, e[n + 12], 20, -1926607734), f, m, e[n + 5], 4, -378558),
                                    m = s(m, p, d, f, e[n + 8], 11, -2022574463),
                                    f = s(f, m, p, d, e[n + 11], 16, 1839030562),
                                    d = s(d, f, m, p, e[n + 14], 23, -35309556),
                                    p = s(p, d, f, m, e[n + 1], 4, -1530992060),
                                    m = s(m, p, d, f, e[n + 4], 11, 1272893353),
                                    f = s(f, m, p, d, e[n + 7], 16, -155497632),
                                    d = s(d, f, m, p, e[n + 10], 23, -1094730640),
                                    p = s(p, d, f, m, e[n + 13], 4, 681279174),
                                    m = s(m, p, d, f, e[n], 11, -358537222),
                                    f = s(f, m, p, d, e[n + 3], 16, -722521979),
                                    d = s(d, f, m, p, e[n + 6], 23, 76029189),
                                    p = s(p, d, f, m, e[n + 9], 4, -640364487),
                                    m = s(m, p, d, f, e[n + 12], 11, -421815835),
                                    f = s(f, m, p, d, e[n + 15], 16, 530742520),
                                    p = c(p, d = s(d, f, m, p, e[n + 2], 23, -995338651), f, m, e[n], 6, -198630844),
                                    m = c(m, p, d, f, e[n + 7], 10, 1126891415),
                                    f = c(f, m, p, d, e[n + 14], 15, -1416354905),
                                    d = c(d, f, m, p, e[n + 5], 21, -57434055),
                                    p = c(p, d, f, m, e[n + 12], 6, 1700485571),
                                    m = c(m, p, d, f, e[n + 3], 10, -1894986606),
                                    f = c(f, m, p, d, e[n + 10], 15, -1051523),
                                    d = c(d, f, m, p, e[n + 1], 21, -2054922799),
                                    p = c(p, d, f, m, e[n + 8], 6, 1873313359),
                                    m = c(m, p, d, f, e[n + 15], 10, -30611744),
                                    f = c(f, m, p, d, e[n + 6], 15, -1560198380),
                                    d = c(d, f, m, p, e[n + 13], 21, 1309151649),
                                    p = c(p, d, f, m, e[n + 4], 6, -145523070),
                                    m = c(m, p, d, f, e[n + 11], 10, -1120210379),
                                    f = c(f, m, p, d, e[n + 2], 15, 718787259),
                                    d = c(d, f, m, p, e[n + 9], 21, -343485551),
                                    p = r(p, i),
                                    d = r(d, l),
                                    f = r(f, h),
                                    m = r(m, u);
                            return [p, d, f, m]
                        }
                        function h(e) {
                            var t, n = "", r = 32 * e.length;
                            for (t = 0; t < r; t += 8)
                                n += String.fromCharCode(e[t >> 5] >>> t % 32 & 255);
                            return n
                        }
                        function u(e) {
                            var t, n = [];
                            for (n[(e.length >> 2) - 1] = void 0,
                                     t = 0; t < n.length; t += 1)
                                n[t] = 0;
                            var r = 8 * e.length;
                            for (t = 0; t < r; t += 8)
                                n[t >> 5] |= (255 & e.charCodeAt(t / 8)) << t % 32;
                            return n
                        }
                        function p(e) {
                            var t, n, r = "0123456789abcdef", i = "";
                            for (n = 0; n < e.length; n += 1)
                                t = e.charCodeAt(n),
                                    i += r.charAt(t >>> 4 & 15) + r.charAt(15 & t);
                            return i
                        }
                        function d(e) {
                            return unescape(encodeURIComponent(e))
                        }
                        function f(e) {
                            return function(e) {
                                return h(l(u(e), 8 * e.length))
                            }(d(e))
                        }
                        function m(e, t) {
                            return function(e, t) {
                                var n, r, i = u(e), o = [], a = [];
                                for (o[15] = a[15] = void 0,
                                     i.length > 16 && (i = l(i, 8 * e.length)),
                                         n = 0; n < 16; n += 1)
                                    o[n] = 909522486 ^ i[n],
                                        a[n] = 1549556828 ^ i[n];
                                return r = l(o.concat(u(t)), 512 + 8 * t.length),
                                    h(l(a.concat(r), 640))
                            }(d(e), d(t))
                        }
                        t.exports = function(e, t, n) {
                            return t ? n ? m(t, e) : function(e, t) {
                                return p(m(e, t))
                            }(t, e) : n ? f(e) : function(e) {
                                return p(f(e))
                            }(e)
                        }
                    }
                        , {}]
                }, {}, [4])(4)
            }
        ));
    var H = [{
        family: "UC Browser",
        patterns: ["(UC? ?Browser|UCWEB|U3)[ /]?(\\d+)\\.(\\d+)\\.(\\d+)"]
    }, {
        family: "Opera",
        name_replace: "Opera Mobile",
        patterns: ["(Opera)/.+Opera Mobi.+Version/(\\d+)\\.(\\d+)", "(Opera)/(\\d+)\\.(\\d+).+Opera Mobi", "Opera Mobi.+(Opera)(?:/|\\s+)(\\d+)\\.(\\d+)", "Opera Mobi", "(?:Mobile Safari).*(OPR)/(\\d+)\\.(\\d+)\\.(\\d+)"]
    }, {
        family: "Opera",
        name_replace: "Opera Mini",
        patterns: ["(Opera Mini)(?:/att|)/?(\\d+|)(?:\\.(\\d+)|)(?:\\.(\\d+)|)", "(OPiOS)/(\\d+).(\\d+).(\\d+)"]
    }, {
        family: "Opera",
        name_replace: "Opera Neon",
        patterns: ["Chrome/.+( MMS)/(\\d+).(\\d+).(\\d+)"]
    }, {
        name_replace: "Opera",
        patterns: ["(Opera)/9.80.*Version/(\\d+)\\.(\\d+)(?:\\.(\\d+)|)", "(?:Chrome).*(OPR)/(\\d+)\\.(\\d+)\\.(\\d+)"]
    }, {
        family: "Firefox",
        name_replace: "Firefox Mobile",
        patterns: ["(Fennec)/(\\d+)\\.(\\d+)\\.?([ab]?\\d+[a-z]*)", "(Fennec)/(\\d+)\\.(\\d+)(pre)", "(Fennec)/(\\d+)\\.(\\d+)", "(?:Mobile|Tablet);.*(Firefox)/(\\d+)\\.(\\d+)", "(FxiOS)/(\\d+)\\.(\\d+)(\\.(\\d+)|)(\\.(\\d+)|)"]
    }, {
        name_replace: "Coc Coc",
        patterns: ["(coc_coc_browser)/(\\d+)\\.(\\d+)(?:\\.(\\d+)|)"]
    }, {
        family: "QQ",
        name_replace: "QQ Mini",
        patterns: ["(MQQBrowser/Mini)(?:(\\d+)(?:\\.(\\d+)|)(?:\\.(\\d+)|)|)"]
    }, {
        family: "QQ",
        name_replace: "QQ Mobile",
        patterns: ["(MQQBrowser)(?:/(\\d+)(?:\\.(\\d+)|)(?:\\.(\\d+)|)|)"]
    }, {
        name_replace: "QQ",
        patterns: ["(QQBrowser)(?:/(\\d+)(?:\\.(\\d+)\\.(\\d+)(?:\\.(\\d+)|)|)|)"]
    }, {
        family: "Edge",
        name: "Edge Mobile",
        patterns: ["Windows Phone .*(Edge)/(\\d+)\\.(\\d+)", "(EdgiOS|EdgA)/(\\d+)\\.(\\d+).(\\d+).(\\d+)"]
    }, {
        name_replace: "Edge",
        patterns: ["(Edge|Edg)/(\\d+)(?:\\.(\\d+)|)"]
    }, {
        patterns: ["(Puffin)/(\\d+)\\.(\\d+)(?:\\.(\\d+)|)"]
    }, {
        family: "Chrome",
        name_replace: "Chrome Mobile",
        patterns: ["Version/.+(Chrome)/(\\d+)\\.(\\d+)\\.(\\d+)\\.(\\d+)", "; wv\\).+(Chrome)/(\\d+)\\.(\\d+)\\.(\\d+)\\.(\\d+)", "(CriOS)/(\\d+)\\.(\\d+)\\.(\\d+)\\.(\\d+)", "(CrMo)/(\\d+)\\.(\\d+)\\.(\\d+)\\.(\\d+)", "(Chrome)/(\\d+)\\.(\\d+)\\.(\\d+)\\.(\\d+) Mobile(?:[ /]|$)", " Mobile .*(Chrome)/(\\d+)\\.(\\d+)\\.(\\d+)\\.(\\d+)"]
    }, {
        family: "Yandex",
        name_replace: "Yandex Mobile",
        patterns: ["(YaBrowser)/(\\d+)\\.(\\d+)\\.(\\d+)\\.(\\d+).*Mobile"]
    }, {
        name_replace: "Yandex",
        patterns: ["(YaBrowser)/(\\d+)\\.(\\d+)\\.(\\d+)"]
    }, {
        patterns: ["(Vivaldi)/(\\d+)\\.(\\d+)", "(Vivaldi)/(\\d+)\\.(\\d+)\\.(\\d+)"]
    }, {
        name_replace: "Brave",
        patterns: ["(brave)/(\\d+)\\.(\\d+)\\.(\\d+) Chrome"]
    }, {
        family: "Chrome",
        patterns: ["(Chromium|Chrome)/(\\d+)\\.(\\d+)(?:\\.(\\d+)|)(?:\\.(\\d+)|)"]
    }, {
        name_replace: "Internet Explorer Mobile",
        patterns: ["(IEMobile)[ /](\\d+)\\.(\\d+)"]
    }, {
        family: "Safari",
        name_replace: "Safari Mobile",
        patterns: ["(iPod|iPhone|iPad).+Version/(d+).(d+)(?:.(d+)|).*[ +]Safari", "(iPod|iPod touch|iPhone|iPad);.*CPU.*OS[ +](\\d+)_(\\d+)(?:_(\\d+)|).* AppleNews\\/\\d+\\.\\d+\\.\\d+?", "(iPod|iPhone|iPad).+Version/(\\d+)\\.(\\d+)(?:\\.(\\d+)|)", "(iPod|iPod touch|iPhone|iPad);.*CPU.*OS[ +](\\d+)_(\\d+)(?:_(\\d+)|).*Mobile.*[ +]Safari", "(iPod|iPod touch|iPhone|iPad);.*CPU.*OS[ +](\\d+)_(\\d+)(?:_(\\d+)|).*Mobile", "(iPod|iPod touch|iPhone|iPad).* Safari", "(iPod|iPod touch|iPhone|iPad)"]
    }, {
        name_replace: "Safari",
        patterns: ["(Version)/(\\d+)\\.(\\d+)(?:\\.(\\d+)|).*Safari/"]
    }, {
        name_replace: "Internet Explorer",
        patterns: ["(Trident)/(7|8).(0)"],
        major_replace: "11"
    }, {
        name_replace: "Internet Explorer",
        patterns: ["(Trident)/(6)\\.(0)"],
        major_replace: "10"
    }, {
        name_replace: "Internet Explorer",
        patterns: ["(Trident)/(5)\\.(0)"],
        major_replace: "9"
    }, {
        name_replace: "Internet Explorer",
        patterns: ["(Trident)/(4)\\.(0)"],
        major_replace: "8"
    }, {
        family: "Firefox",
        patterns: ["(Firefox)/(\\d+)\\.(\\d+)\\.(\\d+)", "(Firefox)/(\\d+)\\.(\\d+)(pre|[ab]\\d+[a-z]*|)"]
    }]
        , K = [{
        family: "Windows",
        name_replace: "Windows Phone",
        patterns: ["(Windows Phone) (?:OS[ /])?(\\d+)\\.(\\d+)", "^UCWEB.*; (wds) (\\d+)\\.(d+)(?:\\.(\\d+)|);", "^UCWEB.*; (wds) (\\d+)\\.(\\d+)(?:\\.(\\d+)|);"]
    }, {
        family: "Windows",
        name_replace: "Windows Mobile",
        patterns: ["(Windows ?Mobile)"]
    }, {
        name_replace: "Android",
        patterns: ["(Android)[ \\-/](\\d+)(?:\\.(\\d+)|)(?:[.\\-]([a-z0-9]+)|)", "(Android) (d+);", "^UCWEB.*; (Adr) (\\d+)\\.(\\d+)(?:[.\\-]([a-z0-9]+)|);", "^(JUC).*; ?U; ?(?:Android|)(\\d+)\\.(\\d+)(?:[\\.\\-]([a-z0-9]+)|)", "(android)\\s(?:mobile\\/)(\\d+)(?:\\.(\\d+)(?:\\.(\\d+)|)|)", "(Silk-Accelerated=[a-z]{4,5})", "Puffin/[\\d\\.]+AT", "Puffin/[\\d\\.]+AP"]
    }, {
        name_replace: "Chrome OS",
        patterns: ["(x86_64|aarch64)\\ (\\d+)\\.(\\d+)\\.(\\d+).*Chrome.*(?:CitrixChromeApp)$", "(CrOS) [a-z0-9_]+ (\\d+)\\.(\\d+)(?:\\.(\\d+)|)"]
    }, {
        name_replace: "Windows",
        patterns: ["(Windows 10)", "(Windows NT 6\\.4)", "(Windows NT 10\\.0)"],
        major_replace: "10"
    }, {
        name_replace: "Windows",
        patterns: ["(Windows NT 6\\.3; ARM;)", "(Windows NT 6.3)"],
        major_replace: "8",
        minor_replace: "1"
    }, {
        name_replace: "Windows",
        patterns: ["(Windows NT 6\\.2)"],
        major_replace: "8"
    }, {
        name_replace: "Windows",
        patterns: ["(Windows NT 6\\.1)"],
        major_replace: "7"
    }, {
        name_replace: "Windows",
        patterns: ["(Windows NT 6\\.0)"],
        major_replace: "Vista"
    }, {
        name_replace: "Windows",
        patterns: ["(Windows (?:NT 5\\.2|NT 5\\.1))"],
        major_replace: "XP"
    }, {
        name_replace: "Mac OS X",
        patterns: ["((?:Mac[ +]?|; )OS[ +]X)[\\s+/](?:(\\d+)[_.](\\d+)(?:[_.](\\d+)|)|Mach-O)", "\\w+\\s+Mac OS X\\s+\\w+\\s+(\\d+).(\\d+).(\\d+).*", "(?:PPC|Intel) (Mac OS X)"]
    }, {
        name_replace: "Mac OS X",
        patterns: [" (Dar)(win)/(10).(d+).*((?:i386|x86_64))"],
        major_replace: "10",
        minor_replace: "6"
    }, {
        name_replace: "Mac OS X",
        patterns: [" (Dar)(win)/(11).(\\d+).*\\((?:i386|x86_64)\\)"],
        major_replace: "10",
        minor_replace: "7"
    }, {
        name_replace: "Mac OS X",
        patterns: [" (Dar)(win)/(12).(\\d+).*\\((?:i386|x86_64)\\)"],
        major_replace: "10",
        minor_replace: "8"
    }, {
        name_replace: "Mac OS X",
        patterns: [" (Dar)(win)/(13).(\\d+).*\\((?:i386|x86_64)\\)"],
        major_replace: "10",
        minor_replace: "9"
    }, {
        name_replace: "iOS",
        patterns: ["^UCWEB.*; (iPad|iPh|iPd) OS (\\d+)_(\\d+)(?:_(\\d+)|);", "(CPU[ +]OS|iPhone[ +]OS|CPU[ +]iPhone|CPU IPhone OS)[ +]+(\\d+)[_\\.](\\d+)(?:[_\\.](\\d+)|)", "(iPhone|iPad|iPod); Opera", "(iPhone|iPad|iPod).*Mac OS X.*Version/(\\d+)\\.(\\d+)", "\\b(iOS[ /]|iOS; |iPhone(?:/| v|[ _]OS[/,]|; | OS : |\\d,\\d/|\\d,\\d; )|iPad/)(\\d{1,2})[_\\.](\\d{1,2})(?:[_\\.](\\d+)|)", "\\((iOS);", "(iPod|iPhone|iPad)", "Puffin/[\\d\\.]+IT", "Puffin/[\\d\\.]+IP"]
    }, {
        family: "Chrome",
        name_replace: "Chromecast",
        patterns: ["(CrKey -)(?:[ /](\\d+)\\.(\\d+)(?:\\.(\\d+)|)|)", "(CrKey[ +]armv7l)(?:[ /](\\d+)\\.(\\d+)(?:\\.(\\d+)|)|)", "(CrKey)(?:[/](\\d+)\\.(\\d+)(?:\\.(\\d+)|)|)"]
    }, {
        name_replace: "Debian",
        patterns: ["([Dd]ebian)"]
    }, {
        family: "Linux",
        name_replace: "Linux",
        patterns: ["(Linux Mint)(?:/(\\d+)|)"]
    }, {
        family: "Linux",
        patterns: ["(Ubuntu|Kubuntu|Arch Linux|CentOS|Slackware|Gentoo|openSUSE|SUSE|Red Hat|Fedora|PCLinuxOS|Mageia|(?:Free|Open|Net|\\b)BSD)", "(Mandriva)(?: Linux|)/(?:[\\d.-]+m[a-z]{2}(\\d+).(\\d)|)", "(Linux)(?:[ /](\\d+)\\.(\\d+)(?:\\.(\\d+)|)|)", "\\(linux-gnu\\)"]
    }, {
        family: "BlackBerry",
        name_replace: "BlackBerry OS",
        patterns: ["(BB10);.+Version/(\\d+)\\.(\\d+)\\.(\\d+)", "(Black[Bb]erry)[0-9a-z]+/(\\d+)\\.(\\d+)\\.(\\d+)(?:\\.(\\d+)|)", "(Black[Bb]erry).+Version/(\\d+)\\.(\\d+)\\.(\\d+)(?:\\.(\\d+)|)", "(Black[Bb]erry)"]
    }, {
        patterns: ["(Fedora|Red Hat|PCLinuxOS|Puppy|Ubuntu|Kindle|Bada|Sailfish|Lubuntu|BackTrack|Slackware|(?:Free|Open|Net|\\b)BSD)[/ ](\\d+)\\.(\\d+)(?:\\.(\\d+)|)(?:\\.(\\d+)|)"]
    }]
        , L = navigator.userAgent
        , z = function() {
        return L
    }
        , J = function(e) {
        return G(e || L, H)
    }
        , Y = function(e) {
        return G(e || L, K)
    };
    function $(e, t) {
        try {
            var n = new RegExp(t).exec(e);
            return n ? {
                name: n[1] || "Other",
                major: n[2] || "0",
                minor: n[3] || "0",
                patch: n[4] || "0"
            } : null
        } catch (Gn) {
            return null
        }
    }
    function G(e, t) {
        for (var n = null, r = null, i = -1, o = !1; ++i < t.length && !o; ) {
            n = t[i];
            for (var a = -1; ++a < n.patterns.length && !o; )
                o = null !== (r = $(e, n.patterns[a]))
        }
        return o ? (r.family = n.family || n.name_replace || r.name,
        n.name_replace && (r.name = n.name_replace),
        n.major_replace && (r.major = n.major_replace),
        n.minor_replace && (r.minor = n.minor_replace),
        n.patch_replace && (r.minor = n.patch_replace),
            r) : {
            family: "Other",
            name: "Other",
            major: "0",
            minor: "0",
            patch: "0"
        }
    }
    function X() {
        var e = this
            , t = J()
            , n = z();
        this.agent = n.toLowerCase(),
            this.language = window.navigator.userLanguage || window.navigator.language,
            this.isCSS1 = "CSS1Compat" === (document.compatMode || ""),
            this.width = function() {
                return window.innerWidth && window.document.documentElement.clientWidth ? Math.min(window.innerWidth, document.documentElement.clientWidth) : window.innerWidth || window.document.documentElement.clientWidth || document.body.clientWidth
            }
            ,
            this.height = function() {
                return window.innerHeight || window.document.documentElement.clientHeight || document.body.clientHeight
            }
            ,
            this.scrollX = function() {
                return window.pageXOffset !== undefined ? window.pageXOffset : e.isCSS1 ? document.documentElement.scrollLeft : document.body.scrollLeft
            }
            ,
            this.scrollY = function() {
                return window.pageYOffset !== undefined ? window.pageYOffset : e.isCSS1 ? document.documentElement.scrollTop : document.body.scrollTop
            }
            ,
            this.type = "Edge" === t.family ? "edge" : "Internet Explorer" === t.family ? "ie" : "Chrome" === t.family ? "chrome" : "Safari" === t.family ? "safari" : "Firefox" === t.family ? "firefox" : t.family.toLowerCase(),
            this.version = 1 * (t.major + "." + t.minor) || 0,
            this.hasPostMessage = !!window.postMessage
    }
    X.prototype.hasEvent = function(e, t) {
        return "on" + e in (t || document.createElement("div"))
    }
        ,
        X.prototype.getScreenDimensions = function() {
            var e = {};
            for (var t in window.screen)
                e[t] = window.screen[t];
            return delete e.orientation,
                e
        }
        ,
        X.prototype.getOrientation = function() {
            return "function" == typeof matchMedia ? matchMedia("(orientation: landscape)").matches ? "landscape" : "portrait" : window.screen.orientation ? screen.orientation.type.startsWith("landscape") ? "landscape" : "portrait" : this.width() > this.height() ? "landscape" : "portrait"
        }
        ,
        X.prototype.getWindowDimensions = function() {
            return [this.width(), this.height()]
        }
        ,
        X.prototype.interrogateNavigator = function() {
            var e = {};
            for (var t in window.navigator)
                if ("webkitPersistentStorage" !== t)
                    try {
                        e[t] = window.navigator[t]
                    } catch ($n) {}
            if (delete e.plugins,
                delete e.mimeTypes,
                e.plugins = [],
                window.navigator.plugins)
                for (var n = 0; n < window.navigator.plugins.length; n++)
                    e.plugins[n] = window.navigator.plugins[n].filename;
            return e
        }
        ,
        X.prototype.supportsPST = function() {
            return document.hasPrivateToken !== undefined
        }
        ,
        X.prototype.supportsCanvas = function() {
            var e = document.createElement("canvas");
            return !(!e.getContext || !e.getContext("2d"))
        }
        ,
        X.prototype.supportsWebAssembly = function() {
            try {
                if ("object" == typeof WebAssembly && "function" == typeof WebAssembly.instantiate) {
                    var e = new WebAssembly.Module(Uint8Array.of(0, 97, 115, 109, 1, 0, 0, 0));
                    if (e instanceof WebAssembly.Module)
                        return new WebAssembly.Instance(e)instanceof WebAssembly.Instance
                }
            } catch (Gn) {
                return !1
            }
        }
    ;
    var q = new X
        , Q = new function() {
        var e, t, n = Y(), r = z();
        this.mobile = (e = !!("ontouchstart"in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0),
            t = !1,
        n && (t = ["iOS", "Windows Phone", "Windows Mobile", "Android", "BlackBerry OS"].indexOf(n.name) >= 0),
        e && t),
            this.dpr = function() {
                return window.devicePixelRatio || 1
            }
            ,
        this.mobile && n && "Windows" === n.family && r.indexOf("touch") < 0 && (this.mobile = !1),
            this.os = "iOS" === n.family ? "ios" : "Android" === n.family ? "android" : "Mac OS X" === n.family ? "mac" : "Windows" === n.family ? "windows" : "Linux" === n.family ? "linux" : n.family.toLowerCase(),
            this.version = function() {
                if (!n)
                    return "unknown";
                var e = n.major;
                return n.minor && (e += "." + n.minor),
                n.patch && (e += "." + n.patch),
                    e
            }()
    }
        , ee = {
        Browser: q,
        System: Q,
        supportsPAT: function() {
            return ("mac" === Q.os || "ios" === Q.os) && "safari" === q.type && q.version >= 16.2
        }
    }
        , te = "challenge-passed"
        , ne = "challenge-escaped"
        , re = "challenge-closed"
        , ie = "challenge-expired"
        , oe = "invalid-data"
        , ae = "bundle-error"
        , se = "rate-limited"
        , ce = "network-error"
        , le = "challenge-error"
        , he = "incomplete-answer"
        , ue = "missing-captcha"
        , pe = "missing-sitekey"
        , de = "invalid-captcha-id"
        , fe = "https://api.hcaptcha.com"
        , me = "https://api2.hcaptcha.com"
        , ge = "auto"
        , ye = {
        host: null,
        file: null,
        sitekey: null,
        a11y_tfe: null,
        pingdom: "safari" === ee.Browser.type && "windows" !== ee.System.os && "mac" !== ee.System.os && "ios" !== ee.System.os && "android" !== ee.System.os,
        assetDomain: "https://newassets.hcaptcha.com",
        assetUrl: "https://newassets.hcaptcha.com/captcha/v1/9a41d3881922d1586e8d301c084c4ad106878568/static",
        width: null,
        height: null,
        mobile: null,
        orientation: "portrait",
        challenge_type: null
    }
        , ve = {
        se: null,
        custom: !1,
        tplinks: "on",
        language: null,
        reportapi: "https://accounts.hcaptcha.com",
        endpoint: fe,
        pstIssuer: "https://pst-issuer.hcaptcha.com",
        size: "normal",
        theme: "light",
        mode: undefined,
        assethost: null,
        imghost: null,
        recaptchacompat: "true",
        pat: "on",
        confirmNav: !1
    }
        , be = "https://30910f52569b4c17b1081ead2dae43b4@sentry.hcaptcha.com/6"
        , we = "9a41d3881922d1586e8d301c084c4ad106878568"
        , _e = "prod";
    function Ee(e, t) {
        e.style.width = "302px",
            e.style.height = "76px",
            e.style.backgroundColor = "#f9e5e5",
            e.style.position = "relative",
            e.innerHTML = "";
        var n = document.createElement("div");
        n.style.width = "284px",
            n.style.position = "absolute",
            n.style.top = "12px",
            n.style.left = "10px",
            n.style.color = "#7c0a06",
            n.style.fontSize = "14px",
            n.style.fontWeight = "normal",
            n.style.lineHeight = "18px",
            n.innerHTML = t || "Please <a style='color:inherit;text-decoration:underline; font: inherit' target='_blank' href='https://www.whatismybrowser.com/guides/how-to-update-your-browser/auto'>upgrade your browser</a> to complete this captcha.",
            e.appendChild(n)
    }
    function ke(e) {
        for (var t = document.getElementsByClassName("h-captcha"), n = [], r = 0; r < t.length; r++)
            n.push(t[r]);
        var i = [];
        if ("off" !== ve.recaptchacompat)
            for (var o = document.getElementsByClassName("g-recaptcha"), a = 0; a < o.length; a++)
                i.push(o[a]);
        for (var s = [].concat(n, i), c = 0; c < s.length; c++)
            e(s[c])
    }
    var Ve = "The captcha failed to load."
        , xe = []
        , Te = /(https?|wasm):\/\//
        , Se = /^at\s/
        , Re = /:\d+:\d+/g;
    function Me(e) {
        return Te.test(e) ? null : e.trim().replace(Se, "").replace(Re, "")
    }
    function Ue(e) {
        for (var t = [], n = 0, r = e.length; n < r; n++) {
            var i = Me(e[n]);
            null !== i && t.push(i)
        }
        return t.join("\n").trim()
    }
    function Ce(e) {
        if (e && "string" == typeof e && -1 === xe.indexOf(e) && !(xe.length >= 10)) {
            var t = Ue(e.trim().split("\n").slice(0, 2));
            xe.push(t)
        }
    }
    function Oe(e) {
        e && "object" == typeof e || (e = {
            name: "error",
            message: "",
            stack: ""
        });
        var t = {
            message: e.name + ": " + e.message
        };
        e.stack && (t.stack_trace = {
            trace: e.stack
        }),
            je("report error", "internal", "debug", t),
            Ae(e.message || "internal error", "error", ye.file, e)
    }
    function We(e) {
        return function() {
            try {
                return e.apply(this, arguments)
            } catch ($n) {
                throw Oe($n),
                    ke((function(e) {
                            Ee(e, Ve)
                        }
                    )),
                    $n
            }
        }
    }
    function Ne(e) {
        var t = !1
            , n = !1
            , r = !1;
        try {
            n = -1 !== window.location.href.indexOf("chargebee.com"),
                r = -1 !== window.location.href.indexOf("kobo"),
                t = "8d3aee53-3b2b-414d-b043-a67de5b00328.ios-sdk.hcaptcha.com" === ye.host
        } catch (Gn) {}
        (ve.sentry || t) && (window.Raven && Raven.config(be, {
            release: we,
            environment: _e,
            autoBreadcrumbs: {
                xhr: !0,
                dom: !0,
                sentry: !0
            },
            tags: {
                "site-host": ye.host,
                "site-key": ye.sitekey,
                "endpoint-url": ve.endpoint,
                "asset-url": ye.assetUrl
            },
            sampleRate: n || r || t ? 1 : .01,
            ignoreErrors: ["Cannot set properties of undefined (setting 'data')", "canvas.contentDocument", "Can't find variable: ZiteReader", "Cannot redefine property: hcaptcha", "Cannot redefine property: BetterJsPop", "grecaptcha is not defined", "jQuery is not defined", "$ is not defined", "Script is not a function"]
        }),
        window.Raven && Raven.setUserContext({
            "Browser-Agent": ee.Browser.agent,
            "Browser-Type": ee.Browser.type,
            "Browser-Version": ee.Browser.version,
            "System-OS": ee.System.os,
            "System-Version": ee.System.version,
            "Is-Mobile": ee.System.mobile
        }),
            je(ye.file + "_internal", "setup", "info"),
        e && (window.onerror = function(e, t, n, r, i) {
                i && "object" == typeof i || (i = {});
                var o = i.name || "Error"
                    , a = i.stack || "";
                We(Ce)(a),
                -1 === a.indexOf("chrome-extension://") && -1 === a.indexOf("safari-extension://") && -1 === a.indexOf("moz-extension://") && -1 === a.indexOf("chrome://internal-") && -1 === a.indexOf("/hammerhead.js") && -1 === a.indexOf("eval at buildCode") && -1 === a.indexOf("u.c.b.r.o.w.s.e.r/ucbrowser_script.js") && (je(e, "global", "debug", {
                    name: o,
                    url: t,
                    line: n,
                    column: r,
                    stack: a
                }),
                    Pe("global", i, {
                        message: e
                    }))
            }
        ))
    }
    function Ae(e, t, n, r) {
        t = t || "error";
        var i = "8d3aee53-3b2b-414d-b043-a67de5b00328.ios-sdk.hcaptcha.com" === ye.host;
        if (ve.sentry || i) {
            var o = "warn" === t ? "warning" : t;
            window.Raven && Raven.captureMessage(e, {
                level: o,
                logger: n,
                extra: r
            })
        }
    }
    function Pe(e, t, n) {
        return (n = n || {}).error = t,
            Ae(t && t.message || "Missing error message", "error", e, n)
    }
    function je(e, t, n, r) {
        var i = "8d3aee53-3b2b-414d-b043-a67de5b00328.ios-sdk.hcaptcha.com" === ye.host;
        (ve.sentry || i) && window.Raven && Raven.captureBreadcrumb({
            message: e,
            category: t,
            level: n,
            data: r
        })
    }
    var Fe = {
        __proto__: null,
        _stackTraceSet: xe,
        refineLine: Me,
        toRefinedString: Ue,
        reportError: Oe,
        errorWrapper: We,
        initSentry: Ne,
        sentryMessage: Ae,
        sentryError: Pe,
        sentryBreadcrumb: je
    };
    function Be() {
        var e = []
            , t = null
            , n = !1
            , r = 0
            , i = 0
            , o = []
            , a = function(t) {
            try {
                if (e.length >= 10)
                    return;
                var n = t.stack;
                if ("string" != typeof n)
                    return;
                var r = n.trim().split("\n");
                "Error" === r[0] && (r = r.slice(1));
                for (var i = /extension/, o = r.length - 1, a = [], s = 0; o >= 0 && a.length < 6; ) {
                    var c = r[o]
                        , l = Me(c);
                    if (null !== l) {
                        if (i.test(c)) {
                            a = [l];
                            break
                        }
                        if (a.unshift(l),
                            s = Math.max(s, l.length),
                        a.length >= 2 && s >= 30)
                            break;
                        o--
                    } else
                        o--
                }
                var h = a.join("\n").trim();
                h && -1 === e.indexOf(h) && e.push(h)
            } catch (t) {
                return
            }
        }
            , s = function() {
            if (n)
                try {
                    for (var e = 0, r = o.length; e < r; e++)
                        o[e]();
                    null !== t && clearTimeout(t)
                } catch (i) {
                    a(i)
                } finally {
                    o = [],
                        t = null,
                        n = !1
                }
        }
            , c = function(t, r) {
            var i = Object.getOwnPropertyDescriptor(t, r);
            if (!(i && !1 === i.writable)) {
                var c, l = Object.prototype.hasOwnProperty.call(t, r), h = t[r];
                c = "undefined" != typeof Proxy && "undefined" != typeof Reflect ? new Proxy(h,{
                    apply: function(t, r, i) {
                        return n && (e.length >= 10 && s(),
                            a(new Error)),
                            Reflect.apply(t, r, i)
                    }
                }) : function() {
                    return n && (e.length >= 10 && s(),
                        a(new Error)),
                        h.apply(this, arguments)
                }
                    ,
                    Object.defineProperty(t, r, {
                        configurable: !0,
                        enumerable: !i || i.enumerable,
                        writable: !0,
                        value: c
                    }),
                    o.push((function() {
                            l ? Object.defineProperty(t, r, {
                                configurable: !0,
                                enumerable: !i || i.enumerable,
                                writable: !0,
                                value: h
                            }) : delete t[r]
                        }
                    ))
            }
        };
        return {
            run: function(e) {
                if (!n) {
                    n = !0,
                    isFinite(e) && (t = setTimeout((function() {
                            s()
                        }
                    ), e));
                    try {
                        c(Document.prototype, "getElementsByClassName"),
                            c(Document.prototype, "getElementById"),
                            c(Document.prototype, "getElementsByTagName"),
                            c(Document.prototype, "querySelector"),
                            c(Document.prototype, "querySelectorAll"),
                            c(Element.prototype, "getElementsByClassName"),
                            c(Element.prototype, "getElementsByTagName"),
                            c(Element.prototype, "querySelector"),
                            c(Element.prototype, "querySelectorAll"),
                            c(HTMLElement.prototype, "click"),
                            c(HTMLElement.prototype, "getElementsByClassName"),
                            c(HTMLElement.prototype, "getElementsByTagName"),
                            c(HTMLElement.prototype, "querySelector"),
                            c(HTMLElement.prototype, "querySelectorAll"),
                            !function() {
                                var e = new Error;
                                Object.defineProperties(e, {
                                    stack: {
                                        configurable: !1,
                                        enumerable: !1,
                                        get: function() {
                                            return r += 1,
                                                ""
                                        }
                                    },
                                    name: {
                                        configurable: !1,
                                        enumerable: !1,
                                        get: function() {
                                            return i += 1,
                                                " "
                                        }
                                    }
                                }),
                                    window.console.debug(e)
                            }(),
                            c(console, "log")
                    } catch (o) {
                        s(),
                            a(o)
                    }
                }
            },
            collect: function() {
                return e.push("ReferenceError: _" + r + "_" + i + " not defined or thrown"),
                    e.concat(xe)
            }
        }
    }
    var Ze = {
        getCookie: function(e) {
            var t = document.cookie.replace(/ /g, "").split(";");
            try {
                for (var n = "", r = t.length; r-- && !n; )
                    t[r].indexOf(e) >= 0 && (n = t[r]);
                return n
            } catch (Gn) {
                return ""
            }
        },
        hasCookie: function(e) {
            return !!Ze.getCookie(e)
        },
        supportsAPI: function() {
            try {
                return "hasStorageAccess"in document && "requestStorageAccess"in document
            } catch (Gn) {
                return !1
            }
        },
        hasAccess: function() {
            return new Promise((function(e) {
                    document.hasStorageAccess().then((function() {
                            e(!0)
                        }
                    ))["catch"]((function() {
                            e(!1)
                        }
                    ))
                }
            ))
        },
        requestAccess: function() {
            try {
                return document.requestStorageAccess()
            } catch (Gn) {
                return Promise.resolve()
            }
        }
    }
        , Ie = {
        array: function(e) {
            if (0 === e.length)
                return e;
            for (var t, n, r = e.length; --r > -1; )
                n = Math.floor(Math.random() * (r + 1)),
                    t = e[r],
                    e[r] = e[n],
                    e[n] = t;
            return e
        }
    };
    function De(e) {
        this.r = 255,
            this.g = 255,
            this.b = 255,
            this.a = 1,
            this.h = 1,
            this.s = 1,
            this.l = 1,
            this.parseString(e)
    }
    function He(e, t, n) {
        return n < 0 && (n += 1),
        n > 1 && (n -= 1),
            n < 1 / 6 ? e + 6 * (t - e) * n : n < .5 ? t : n < 2 / 3 ? e + (t - e) * (2 / 3 - n) * 6 : e
    }
    De.hasAlpha = function(e) {
        return "string" == typeof e && (-1 !== e.indexOf("rgba") || 9 === e.length && "#" === e[0])
    }
        ,
        De.prototype.parseString = function(e) {
            e && (0 === e.indexOf("#") ? this.fromHex(e) : 0 === e.indexOf("rgb") && this.fromRGBA(e))
        }
        ,
        De.prototype.fromHex = function(e) {
            var t = 1;
            9 === e.length && (t = parseInt(e.substr(7, 2), 16) / 255);
            var n = (e = e.substr(1, 6)).replace(/^([a-f\d])([a-f\d])([a-f\d])?$/i, (function(e, t, n, r) {
                    return t + t + n + n + r + r
                }
            ))
                , r = parseInt(n, 16)
                , i = r >> 16
                , o = r >> 8 & 255
                , a = 255 & r;
            this.setRGBA(i, o, a, t)
        }
        ,
        De.prototype.fromRGBA = function(e) {
            var t = e.indexOf("rgba")
                , n = e.substr(t).replace(/rgba?\(/, "").replace(/\)/, "").replace(/[\s+]/g, "").split(",")
                , r = Math.floor(parseInt(n[0]))
                , i = Math.floor(parseInt(n[1]))
                , o = Math.floor(parseInt(n[2]))
                , a = parseFloat(n[3]);
            this.setRGBA(r, i, o, a)
        }
        ,
        De.prototype.setRGB = function(e, t, n) {
            this.setRGBA(e, t, n, 1)
        }
        ,
        De.prototype.setRGBA = function(e, t, n, r) {
            this.r = e,
                this.g = t,
                this.b = n,
                this.a = isNaN(r) ? this.a : r,
                this.updateHSL()
        }
        ,
        De.prototype.hsl2rgb = function(e, t, n) {
            if (0 === t) {
                var r = Math.round(255 * n);
                return this.setRGB(r, r, r),
                    this
            }
            var i = n <= .5 ? n * (1 + t) : n + t - n * t
                , o = 2 * n - i;
            return this.r = Math.round(255 * He(o, i, e + 1 / 3)),
                this.g = Math.round(255 * He(o, i, e)),
                this.b = Math.round(255 * He(o, i, e - 1 / 3)),
                this.h = e,
                this.s = t,
                this.l = n,
                this
        }
        ,
        De.prototype.updateHSL = function() {
            var e, t = this.r / 255, n = this.g / 255, r = this.b / 255, i = Math.max(t, n, r), o = Math.min(t, n, r), a = null, s = (i + o) / 2;
            if (i === o)
                a = e = 0;
            else {
                var c = i - o;
                switch (e = s > .5 ? c / (2 - i - o) : c / (i + o),
                    i) {
                    case t:
                        a = (n - r) / c + (n < r ? 6 : 0);
                        break;
                    case n:
                        a = (r - t) / c + 2;
                        break;
                    case r:
                        a = (t - n) / c + 4
                }
                a /= 6
            }
            return this.h = a,
                this.s = e,
                this.l = s,
                this
        }
        ,
        De.prototype.getHex = function() {
            return "#" + ((1 << 24) + (this.r << 16) + (this.g << 8) + this.b).toString(16).slice(1)
        }
        ,
        De.prototype.getRGBA = function() {
            return "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")"
        }
        ,
        De.prototype.clone = function() {
            var e = new De;
            return e.setRGBA(this.r, this.g, this.b, this.a),
                e
        }
        ,
        De.prototype.mix = function(e, t) {
            e instanceof De || (e = new De(e));
            var n = new De
                , r = Math.round(this.r + t * (e.r - this.r))
                , i = Math.round(this.g + t * (e.g - this.g))
                , o = Math.round(this.b + t * (e.b - this.b));
            return n.setRGB(r, i, o),
                n
        }
        ,
        De.prototype.blend = function(e, t) {
            var n;
            e instanceof De || (e = new De(e));
            for (var r = [], i = 0; i < t; i++)
                n = this.mix.call(this, e, i / t),
                    r.push(n);
            return r
        }
        ,
        De.prototype.lightness = function(e) {
            return e > 1 && (e /= 100),
                this.hsl2rgb(this.h, this.s, e),
                this
        }
        ,
        De.prototype.saturation = function(e) {
            return e > 1 && (e /= 100),
                this.hsl2rgb(this.h, e, this.l),
                this
        }
        ,
        De.prototype.hue = function(e) {
            return this.hsl2rgb(e / 360, this.s, this.l),
                this
        }
    ;
    var Ke = {
        decode: function(e) {
            try {
                var t = e.split(".");
                return {
                    header: JSON.parse(atob(t[0])),
                    payload: JSON.parse(atob(t[1])),
                    signature: atob(t[2].replace(/_/g, "/").replace(/-/g, "+")),
                    raw: {
                        header: t[0],
                        payload: t[1],
                        signature: t[2]
                    }
                }
            } catch (Gn) {
                throw new Error("Token is invalid.")
            }
        },
        checkExpiration: function(e) {
            if (new Date(1e3 * e) <= new Date(Date.now()))
                throw new Error("Token is expired.");
            return !0
        }
    }
        , Le = {
        _setup: !1,
        _af: null,
        _fps: 60,
        _singleFrame: 1 / 60,
        _lagThreshold: 500,
        _adjustedLag: 1 / 60 * 2,
        _startTime: 0,
        _lastTime: 0,
        _nextTime: 1 / 60,
        _elapsed: 0,
        _difference: 0,
        _renders: [],
        _paused: !1,
        _running: !1,
        _tick: !1,
        frame: 0,
        time: 0,
        requestFrame: null,
        cancelFrame: null,
        _init: function() {
            for (var e, t = window.requestAnimationFrame, n = window.cancelAnimationFrame, r = ["ms", "moz", "webkit", "o"], i = r.length; --i > -1 && !t; )
                t = window[r[i] + "RequestAnimationFrame"],
                    n = window[r[i] + "CancelAnimationFrame"] || window[r[i] + "CancelRequestAnimationFrame"];
            t ? (Le.requestFrame = t.bind(window),
                Le.cancelFrame = n.bind(window)) : (Le.requestFrame = (e = Date.now(),
                        function(t) {
                            window.setTimeout((function() {
                                    t(Date.now() - e)
                                }
                            ), 1e3 * Le._singleFrame)
                        }
                ),
                    Le.cancelFrame = function(e) {
                        return clearTimeout(e),
                            null
                    }
            ),
                Le._setup = !0,
                Le._startTime = Le._lastTime = Date.now()
        },
        add: function(e, t) {
            Le._renders.push({
                callback: e,
                paused: !1 == !t || !1
            }),
            !1 == !t && Le.start()
        },
        remove: function(e) {
            for (var t = Le._renders.length; --t > -1; )
                Le._renders[t].callback === e && (Le._renders[t].paused = !0,
                    Le._renders.splice(t, 1))
        },
        start: function(e) {
            if (!1 === Le._setup && Le._init(),
                e)
                for (var t = Le._renders.length; --t > -1; )
                    Le._renders[t].callback === e && (Le._renders[t].paused = !1);
            !0 !== Le._running && (Le._paused = !1,
                Le._running = !0,
                Le._af = Le.requestFrame(Le._update))
        },
        stop: function(e) {
            if (e)
                for (var t = Le._renders.length; --t > -1; )
                    Le._renders[t].callback === e && (Le._renders[t].paused = !0);
            else
                !1 !== Le._running && (Le._af = Le.cancelFrame(Le._af),
                    Le._paused = !0,
                    Le._running = !1)
        },
        elapsed: function() {
            return Date.now() - Le._startTime
        },
        fps: function(e) {
            return arguments.length ? (Le._fps = e,
                Le._singleFrame = 1 / (Le._fps || 60),
                Le._adjustedLag = 2 * Le._singleFrame,
                Le._nextTime = Le.time + Le._singleFrame,
                Le._fps) : Le._fps
        },
        isRunning: function() {
            return Le._running
        },
        _update: function() {
            if (!Le._paused && (Le._elapsed = Date.now() - Le._lastTime,
                Le._tick = !1,
            Le._elapsed > Le._lagThreshold && (Le._startTime += Le._elapsed - Le._adjustedLag),
                Le._lastTime += Le._elapsed,
                Le.time = (Le._lastTime - Le._startTime) / 1e3,
                Le._difference = Le.time - Le._nextTime,
            Le._difference > 0 && (Le.frame++,
                Le._nextTime += Le._difference + (Le._difference >= Le._singleFrame ? Le._singleFrame / 4 : Le._singleFrame - Le._difference),
                Le._tick = !0),
                Le._af = Le.requestFrame(Le._update),
            !0 === Le._tick && Le._renders.length > 0))
                for (var e = Le._renders.length; --e > -1; )
                    Le._renders[e] && !1 === Le._renders[e].paused && Le._renders[e].callback(Le.time)
        }
    };
    var ze = function(e) {
        for (var t, n, r, i = {}, o = e ? e.indexOf("&") >= 0 ? e.split("&") : [e] : [], a = 0; a < o.length; a++)
            if (o[a].indexOf("=") >= 0) {
                if (t = o[a].split("="),
                    n = decodeURIComponent(t[0]),
                "false" !== (r = decodeURIComponent(t[1])) && "true" !== r || (r = "true" === r),
                "theme" === n || "themeConfig" === n)
                    try {
                        r = JSON.parse(r)
                    } catch (Gn) {}
                i[n] = r
            }
        return i
    }
        , Je = function(e) {
        var t = [];
        for (var n in e) {
            var r = e[n];
            r = "object" == typeof r ? JSON.stringify(r) : r,
                t.push([encodeURIComponent(n), encodeURIComponent(r)].join("="))
        }
        return t.join("&")
    }
        , Ye = {
        __proto__: null,
        Decode: ze,
        Encode: Je
    };
    function $e(e, t, n) {
        return Math.min(Math.max(e, t), n)
    }
    var Ge = {
        __proto__: null,
        clamp: $e,
        range: function(e, t, n, r, i, o) {
            var a = (e - t) * (i - r) / (n - t) + r;
            return !1 === o ? a : $e(a, Math.min(r, i), Math.max(r, i))
        },
        toRadians: function(e) {
            return e * (Math.PI / 180)
        },
        toDegrees: function(e) {
            return 180 * e / Math.PI
        }
    };
    function Xe(e, t) {
        this._period = e,
            this._interval = t,
            this._date = [],
            this._data = [],
            this._prevTimestamp = 0,
            this._meanPeriod = 0,
            this._medianPeriod = 0,
            this._medianMaxHeapSize = 32,
            this._medianMinHeap = [],
            this._medianMaxHeap = [],
            this._meanCounter = 0
    }
    function qe(e) {
        return new Promise((function(t, n) {
                e(t, n, (function r() {
                        e(t, n, r)
                    }
                ))
            }
        ))
    }
    function Qe(e, t) {
        var n = "attempts"in (t = t || {}) ? t.attempts : 1
            , r = t.delay || 0
            , i = t.onFail;
        return qe((function(t, o, a) {
                e().then(t, (function(e) {
                        var t = n-- > 0;
                        if (i) {
                            var s = i(e, n);
                            s && (t = !1 !== s.retry && t,
                                r = s.delay)
                        }
                        t ? setTimeout(a, r || 0) : o(e)
                    }
                ))
            }
        ))
    }
    function et(e) {
        var t = [].slice.call(arguments, 1);
        "string" == typeof e ? window[e] ? "function" == typeof window[e] ? window[e].apply(null, t) : console.log("[hCaptcha] Callback '" + e + "' is not a function.") : console.log("[hCaptcha] Callback '" + e + "' is not defined.") : "function" == typeof e ? e.apply(null, t) : console.log("[hcaptcha] Invalid callback '" + e + "'.")
    }
    function tt() {
        try {
            et.apply(null, arguments)
        } catch ($n) {
            console.error("[hCaptcha] There was an error in your callback."),
                console.error($n)
        }
    }
    function nt(e, t) {
        for (var n = ["hl", "custom", "tplinks", "sitekey", "theme", "type", "size", "tabindex", "callback", "expired-callback", "chalexpired-callback", "error-callback", "open-callback", "close-callback", "endpoint", "challenge-container", "confirm-nav", "orientation", "mode"], r = {}, i = 0; i < n.length; i++) {
            var o = n[i]
                , a = t && t[o];
            a || (a = e.getAttribute("data-" + o)),
            a && (r[o] = a)
        }
        return r
    }
    Xe.prototype.getMeanPeriod = function() {
        return this._meanPeriod
    }
        ,
        Xe.prototype.getMedianPeriod = function() {
            return this._medianPeriod
        }
        ,
        Xe.prototype.getData = function() {
            return this._cleanStaleData(),
                this._data
        }
        ,
        Xe.prototype.getSize = function() {
            return this._cleanStaleData(),
                this._data.length
        }
        ,
        Xe.prototype.getCapacity = function() {
            return 0 === this._period ? this._interval : Math.ceil(this._interval / this._period)
        }
        ,
        Xe.prototype.push = function(e, t) {
            this._cleanStaleData();
            var n = 0 === this._date.length;
            if (e - (this._date[this._date.length - 1] || 0) >= this._period && (this._date.push(e),
                this._data.push(t)),
                !n) {
                var r = e - this._prevTimestamp;
                this._meanPeriod = (this._meanPeriod * this._meanCounter + r) / (this._meanCounter + 1),
                    this._meanCounter++,
                    this._medianPeriod = this._calculateMedianPeriod(r)
            }
            this._prevTimestamp = e
        }
        ,
        Xe.prototype._calculateMedianPeriod = function(e) {
            this._medianMaxHeap || (this._medianMaxHeap = []),
            this._medianMinHeap || (this._medianMinHeap = []);
            var t = this._fetchMedianPeriod();
            return 0 === this._medianMaxHeap.length && 0 === this._medianMinHeap.length ? this._medianMaxHeap.push(e) : e <= t ? (this._medianMaxHeap.push(e),
                this._medianMaxHeap.sort((function(e, t) {
                        return t - e
                    }
                ))) : (this._medianMinHeap.push(e),
                this._medianMinHeap.sort((function(e, t) {
                        return e - t
                    }
                ))),
                this._rebalanceHeaps(),
                this._fetchMedianPeriod()
        }
        ,
        Xe.prototype._rebalanceHeaps = function() {
            var e = null;
            this._medianMaxHeap.length > this._medianMinHeap.length + 1 ? (e = this._medianMaxHeap.shift(),
                this._medianMinHeap.push(e),
                this._medianMinHeap.sort((function(e, t) {
                        return e - t
                    }
                ))) : this._medianMinHeap.length > this._medianMaxHeap.length + 1 && (e = this._medianMinHeap.shift(),
                this._medianMaxHeap.push(e),
                this._medianMaxHeap.sort((function(e, t) {
                        return t - e
                    }
                ))),
            this._medianMinHeap.length == this._medianMaxHeap.length && this._medianMaxHeap.length > this._medianMaxHeapSize && (this._medianMinHeap.pop(),
                this._medianMaxHeap.pop())
        }
        ,
        Xe.prototype._fetchMedianPeriod = function() {
            return this._medianMaxHeap.length > this._medianMinHeap.length ? this._medianMaxHeap[0] : this._medianMinHeap.length > this._medianMaxHeap.length ? this._medianMinHeap[0] : 0 !== this._medianMaxHeap.length && 0 !== this._medianMinHeap.length ? (this._medianMaxHeap[0] + this._medianMinHeap[0]) / 2 : -1
        }
        ,
        Xe.prototype._cleanStaleData = function() {
            for (var e = Date.now(), t = this._date.length - 1; t >= 0; t--) {
                if (e - this._date[t] >= this._interval) {
                    this._date.splice(0, t + 1),
                        this._data.splice(0, t + 1);
                    break
                }
            }
        }
    ;
    var rt, it = {
        UUID: function(e) {
            return /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i.test(e) || !1
        },
        UUIDv4: function(e) {
            return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(e) || !1
        },
        URL: function(e) {
            var t = new RegExp("^(http|https)://")
                , n = new RegExp("^((?!(data|javascript):).)*$");
            return t.test(e) && n.test(e) && -1 === e.indexOf("#")
        },
        IMAGE: function(e) {
            return (0 === e.indexOf("https://") || 0 === e.indexOf("/")) && e.endsWith(".png")
        }
    };
    function ot(e) {
        var t, n, r = "string" == typeof e ? e : JSON.stringify(e), i = -1;
        for (rt = rt || function() {
            var e, t, n, r = [];
            for (t = 0; t < 256; t++) {
                for (e = t,
                         n = 0; n < 8; n++)
                    e = 1 & e ? 3988292384 ^ e >>> 1 : e >>> 1;
                r[t] = e
            }
            return r
        }(),
                 t = 0,
                 n = r.length; t < n; t += 1)
            i = i >>> 8 ^ rt[255 & (i ^ r.charCodeAt(t))];
        return (-1 ^ i) >>> 0
    }
    var at = {
        __proto__: null,
        createErrorsAggregator: Be,
        uuid: function() {
            return Math.random().toString(36).substr(2)
        },
        Render: Le,
        JWT: Ke,
        Color: De,
        Shuffle: Ie,
        MathUtil: Ge,
        Storage: Ze,
        Query: Ye,
        TimeBuffer: Xe,
        PromiseUtil: {
            __proto__: null,
            promiseRecursive: qe,
            promiseRetry: Qe
        },
        ErrorUtil: Fe,
        _stackTraceSet: xe,
        refineLine: Me,
        toRefinedString: Ue,
        reportError: Oe,
        errorWrapper: We,
        initSentry: Ne,
        sentryMessage: Ae,
        sentryError: Pe,
        sentryBreadcrumb: je,
        renderFallback: Ee,
        forEachCaptchaNode: ke,
        callUserFunction: tt,
        composeParams: nt,
        is: it,
        promiseRecursive: qe,
        promiseRetry: Qe,
        crc32: ot,
        TaskContext: {
            container: {},
            set: function(e, t) {
                this.container[e] = t
            },
            clear: function() {
                this.container = {}
            }
        }
    }
        , st = {
        eventName: function(e, t) {
            var n = e;
            "down" === e || "up" === e || "move" === e || "over" === e || "out" === e ? n = !(ee.System.mobile && "desktop" !== t || "mobile" === t) || "down" !== e && "up" !== e && "move" !== e ? "mouse" + e : "down" === e ? "touchstart" : "up" === e ? "touchend" : "touchmove" : "enter" === e && (n = "keydown");
            return n
        },
        actionName: function(e) {
            var t = e;
            return "touchstart" === t || "mousedown" === t ? t = "down" : "touchmove" === t || "mousemove" === t ? t = "move" : "touchend" === t || "mouseup" === t ? t = "up" : "mouseover" === t ? t = "over" : "mouseout" === t && (t = "out"),
                t
        },
        eventCallback: function(e, t, n) {
            var r = st.actionName(e);
            return function(i) {
                if (i = i || window.event,
                "down" === r || "move" === r || "up" === r || "over" === r || "out" === r || "click" === r) {
                    var o = st.eventCoords(i);
                    if (!o)
                        return;
                    var a = n.getBoundingClientRect();
                    i.windowX = o.x,
                        i.windowY = o.y,
                        i.elementX = i.windowX - (a.x || a.left),
                        i.elementY = i.windowY - (a.y || a.top)
                }
                i.keyNum = i.which || i.keyCode || 0,
                "enter" === e && 13 !== i.keyNum && 32 !== i.keyNum || (i.action = r,
                    i.targetElement = n,
                    t(i))
            }
        },
        eventCoords: function(e) {
            if (!e)
                return null;
            var t = e;
            if (e.touches || e.changedTouches) {
                var n = e.touches && e.touches.length >= 1 ? e.touches : e.changedTouches;
                n && n[0] && (t = n[0])
            }
            return "number" == typeof t.pageX && "number" == typeof t.pageY ? {
                x: t.pageX,
                y: t.pageY
            } : "number" == typeof t.clientX && "number" == typeof t.clientY ? {
                x: t.clientX,
                y: t.clientY
            } : null
        }
    }
        , ct = ["Webkit", "Moz", "ms"]
        , lt = document.createElement("div").style
        , ht = {};
    function ut(e) {
        var t = ht[e];
        return t || (e in lt ? e : ht[e] = function(e) {
            for (var t = e[0].toUpperCase() + e.slice(1), n = ct.length; n--; )
                if ((e = ct[n] + t)in lt)
                    return e
        }(e) || e)
    }
    function pt(e, t, n) {
        if (this.dom = null,
            this._clss = [],
            this._nodes = [],
            this._listeners = [],
            this._frag = null,
        e && "object" == typeof e) {
            this.dom = e;
            var r = []
                , i = [];
            "string" == typeof e.className && (i = e.className.split(" "));
            for (var o = 0; o < i.length; o++)
                "" !== i[o] && " " !== i[o] && r.push(i[o]);
            this._clss = r
        } else
            n !== undefined && null !== n || (n = !0),
            (!e || "string" == typeof e && (e.indexOf("#") >= 0 || e.indexOf(".") >= 0)) && (e && (t = e),
                e = "div"),
                this.dom = document.createElement(e),
            t && (t.indexOf("#") >= 0 ? this.dom.id = t.split("#")[1] : (t.indexOf(".") >= 0 && (t = t.split(".")[1]),
                this.addClass.call(this, t)));
        !0 === n && (this._frag = document.createDocumentFragment(),
            this._frag.appendChild(this.dom))
    }
    function dt(e) {
        if (null === e)
            return "";
        var t = [];
        return ft(e, t),
            t.join("&")
    }
    function ft(e, t) {
        var n, r;
        if ("object" == typeof e)
            for (r in e)
                !0 === mt(n = e[r]) ? ft(n, t) : t[t.length] = gt(r, n);
        else if (!0 === Array.isArray(e))
            for (var i = 0; i < e.length; i++)
                !0 === mt(n = e[i]) ? ft(e, t) : t[t.length] = gt(r, n);
        else
            t[t.length] = gt(e)
    }
    function mt(e) {
        return !0 === Array.isArray(e) || "object" == typeof e
    }
    function gt(e, t) {
        return encodeURIComponent(e) + "=" + encodeURIComponent(null === t ? "" : t)
    }
    pt.prototype.cloneNode = function(e) {
        try {
            return this.dom.cloneNode(e)
        } catch (Gn) {
            return Pe("element", Gn),
                null
        }
    }
        ,
        pt.prototype.createElement = function(e, t) {
            try {
                var n = new pt(e,t,!1);
                return this.appendElement.call(this, n),
                    this._nodes.push(n),
                    n
            } catch (Gn) {
                return Pe("element", Gn),
                    null
            }
        }
        ,
        pt.prototype.appendElement = function(e) {
            if (e === undefined)
                return Oe({
                    name: "DomElement Add Child",
                    message: "Child Element is undefined"
                });
            var t;
            t = e._frag !== undefined && null !== e._frag ? e._frag : e.dom !== undefined ? e.dom : e;
            try {
                e instanceof pt && (e._parent = this),
                    this.dom.appendChild(t)
            } catch (Gn) {
                Oe({
                    name: "DomElement Add Child",
                    message: "Failed to append child."
                })
            }
            return this
        }
        ,
        pt.prototype.removeElement = function(e) {
            try {
                var t;
                if (e._nodes)
                    for (t = e._nodes.length; t--; )
                        e.removeElement(e._nodes[t]);
                for (t = this._nodes.length; --t > -1; )
                    this._nodes[t] === e && this._nodes.splice(t, 1);
                var n = e instanceof pt ? e.dom : e
                    , r = n.parentNode === this.dom ? this.dom : n.parentNode;
                if (r.removeChild && r.removeChild(n),
                    !r)
                    throw new Error("Child component does not have correct setup");
                e.__destroy && e.__destroy()
            } catch (Gn) {
                Oe({
                    name: "DomElement Remove Child",
                    message: Gn.message || "Failed to remove child."
                })
            }
        }
        ,
        pt.prototype.addClass = function(e) {
            return !1 === this.hasClass.call(this, e) && (this._clss.push(e),
                this.dom.className = this._clss.join(" ")),
                this
        }
        ,
        pt.prototype.hasClass = function(e) {
            for (var t = -1 !== this.dom.className.split(" ").indexOf(e), n = this._clss.length; n-- && !t; )
                t = this._clss[n] === e;
            return t
        }
        ,
        pt.prototype.removeClass = function(e) {
            for (var t = this._clss.length; --t > -1; )
                this._clss[t] === e && this._clss.splice(t, 1);
            return this.dom.className = this._clss.join(" "),
                this
        }
        ,
        pt.prototype.text = function(e) {
            if (this && this.dom) {
                if (!e)
                    return this.dom.textContent;
                for (var t, n, r, i, o = /&(.*?);/g, a = /<[a-z][\s\S]*>/i; null !== (t = o.exec(e)); ) {
                    !1 === a.test(t[0]) ? (r = t[0],
                        i = void 0,
                        (i = document.createElement("div")).innerHTML = r,
                        n = i.textContent,
                        e = e.replace(new RegExp(t[0],"g"), n)) : e = e.replace(t[0], "")
                }
                return this.dom.textContent = e,
                    this
            }
        }
        ,
        pt.prototype.content = pt.prototype.text,
        pt.prototype.css = function(e) {
            var t, n = "ie" === ee.Browser.type && 8 === ee.Browser.version, r = "safari" === ee.Browser.type && 12 === Math.floor(ee.Browser.version);
            for (var i in e) {
                t = e[i];
                try {
                    if ("transition" === i && r)
                        continue;
                    "opacity" !== i && "zIndex" !== i && "fontWeight" !== i && isFinite(t) && parseFloat(t) === t && (t += "px");
                    var o = ut(i);
                    n && "opacity" === i ? this.dom.style.filter = "alpha(opacity=" + 100 * t + ")" : n && De.hasAlpha(t) ? this.dom.style[o] = new De(t).getHex() : this.dom.style[o] = t
                } catch ($n) {}
            }
            return this
        }
        ,
        pt.prototype.backgroundImage = function(e, t, n, r) {
            var i = t !== undefined && n !== undefined
                , o = {
                "-ms-high-contrast-adjust": "none"
            };
            if ("object" == typeof t && (r = t),
            r === undefined && (r = {}),
                i) {
                var a = e.width / e.height
                    , s = t
                    , c = s / a;
                r.cover && c < n && (s = (c = n) * a),
                r.contain && c > n && (s = (c = n) * a),
                    o.width = s,
                    o.height = c,
                r.center && (o.marginLeft = -s / 2,
                    o.marginTop = -c / 2,
                    o.position = "absolute",
                    o.left = "50%",
                    o.top = "50%"),
                (r.left || r.right) && (o.left = r.left || 0,
                    o.top = r.top || 0)
            }
            "ie" === ee.Browser.type && 8 === ee.Browser.version ? o.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + e.src + "',sizingMethod='scale')" : (o.background = "url(" + e.src + ")",
                o.backgroundPosition = "50% 50%",
                o.backgroundRepeat = "no-repeat",
                o.backgroundSize = i ? s + "px " + c + "px" : r.cover ? "cover" : r.contain ? "contain" : "100%"),
                this.css.call(this, o)
        }
        ,
        pt.prototype.setAttribute = function(e, t) {
            var n;
            if ("object" == typeof e)
                for (var r in e)
                    n = e[r],
                        this.dom.setAttribute(r, n);
            else
                this.dom.setAttribute(e, t)
        }
        ,
        pt.prototype.removeAttribute = function(e, t) {
            var n;
            if ("object" == typeof e)
                for (var r in e)
                    n = e[r],
                        this.dom.removeAttribute(r, n);
            else
                this.dom.removeAttribute(e, t)
        }
        ,
        pt.prototype.addEventListener = function(e, t, n) {
            var r = {
                event: st.eventName(e),
                handler: st.eventCallback(e, t, this.dom),
                callback: t
            };
            if (this._listeners.push(r),
                this.dom.addEventListener ? this.dom.addEventListener(r.event, r.handler, n) : this.dom.attachEvent("on" + r.event, r.handler),
            e !== r.event && (r.event.indexOf("mouse") >= 0 || r.event.indexOf("touch") >= 0)) {
                var i = r.event.indexOf("touch") >= 0 ? "desktop" : "mobile"
                    , o = st.eventName(e, i);
                if (o === r.event)
                    return;
                this.addEventListener.call(this, o, t, n)
            }
        }
        ,
        pt.prototype.removeEventListener = function(e, t, n) {
            for (var r, i = this._listeners.length, o = st.eventName(e); --i > -1; )
                (r = this._listeners[i]).event === o && r.callback === t && (this._listeners.splice(i, 1),
                    this.dom.removeEventListener ? this.dom.removeEventListener(r.event, r.handler, n) : this.dom.detachEvent("on" + r.event, r.handler))
        }
        ,
        pt.prototype.focus = function() {
            this.dom.focus()
        }
        ,
        pt.prototype.blur = function() {
            this.dom.blur()
        }
        ,
        pt.prototype.html = function(e) {
            return e && (this.dom.innerHTML = e),
                this.dom.innerHTML
        }
        ,
        pt.prototype.__destroy = function() {
            for (var e, t = this._listeners.length; --t > -1; )
                e = this._listeners[t],
                    this._listeners.splice(t, 1),
                    this.dom.removeEventListener ? this.dom.removeEventListener(e.event, e.handler) : this.dom.detachEvent("on" + e.event, e.handler);
            return this.dom = null,
                this._clss = [],
                this._nodes = [],
                this._listeners = [],
                this._frag = null,
                e = null,
                null
        }
        ,
        pt.prototype.isConnected = function() {
            return !!this.dom && ("isConnected"in this.dom ? this.dom.isConnected : !(this.dom.ownerDocument && this.dom.ownerDocument.compareDocumentPosition(this.dom) & this.dom.DOCUMENT_POSITION_DISCONNECTED))
        }
    ;
    var yt = {
        af: "Afrikaans",
        sq: "Albanian",
        am: "Amharic",
        ar: "Arabic",
        hy: "Armenian",
        az: "Azerbaijani",
        eu: "Basque",
        be: "Belarusian",
        bn: "Bengali",
        bg: "Bulgarian",
        bs: "Bosnian",
        my: "Burmese",
        ca: "Catalan",
        ceb: "Cebuano",
        zh: "Chinese",
        "zh-CN": "Chinese Simplified",
        "zh-TW": "Chinese Traditional",
        co: "Corsican",
        hr: "Croatian",
        cs: "Czech",
        da: "Danish",
        nl: "Dutch",
        en: "English",
        eo: "Esperanto",
        et: "Estonian",
        fi: "Finnish",
        fr: "French",
        fy: "Frisian",
        gd: "Gaelic",
        gl: "Galacian",
        ka: "Georgian",
        de: "German",
        el: "Greek",
        gu: "Gujurati",
        ht: "Haitian",
        ha: "Hausa",
        haw: "Hawaiian",
        he: "Hebrew",
        hi: "Hindi",
        hmn: "Hmong",
        hu: "Hungarian",
        is: "Icelandic",
        ig: "Igbo",
        id: "Indonesian",
        ga: "Irish",
        it: "Italian",
        ja: "Japanese",
        jw: "Javanese",
        kn: "Kannada",
        kk: "Kazakh",
        km: "Khmer",
        rw: "Kinyarwanda",
        ky: "Kirghiz",
        ko: "Korean",
        ku: "Kurdish",
        lo: "Lao",
        la: "Latin",
        lv: "Latvian",
        lt: "Lithuanian",
        lb: "Luxembourgish",
        mk: "Macedonian",
        mg: "Malagasy",
        ms: "Malay",
        ml: "Malayalam",
        mt: "Maltese",
        mi: "Maori",
        mr: "Marathi",
        mn: "Mongolian",
        ne: "Nepali",
        no: "Norwegian",
        ny: "Nyanja",
        or: "Oriya",
        fa: "Persian",
        pl: "Polish",
        "pt-BR": "Portuguese (Brazil)",
        pt: "Portuguese (Portugal)",
        ps: "Pashto",
        pa: "Punjabi",
        ro: "Romanian",
        ru: "Russian",
        sm: "Samoan",
        sn: "Shona",
        sd: "Sindhi",
        si: "Sinhalese",
        sr: "Serbian",
        sk: "Slovak",
        sl: "Slovenian",
        so: "Somali",
        st: "Southern Sotho",
        es: "Spanish",
        su: "Sundanese",
        sw: "Swahili",
        sv: "Swedish",
        tl: "Tagalog",
        tg: "Tajik",
        ta: "Tamil",
        tt: "Tatar",
        te: "Teluga",
        th: "Thai",
        tr: "Turkish",
        tk: "Turkmen",
        ug: "Uyghur",
        uk: "Ukrainian",
        ur: "Urdu",
        uz: "Uzbek",
        vi: "Vietnamese",
        cy: "Welsh",
        xh: "Xhosa",
        yi: "Yiddish",
        yo: "Yoruba",
        zu: "Zulu"
    }
        , vt = {
        zh: {
            "I am human": "我是人"
        },
        ar: {
            "I am human": "أنا الإنسان"
        },
        af: {
            "I am human": "Ek is menslike"
        },
        am: {
            "I am human": "እኔ ሰው ነኝ"
        },
        hy: {
            "I am human": "Ես մարդ եմ"
        },
        az: {
            "I am human": "Mən insanam"
        },
        eu: {
            "I am human": "Gizakia naiz"
        },
        bn: {
            "I am human": "আমি মানব নই"
        },
        bg: {
            "I am human": "Аз съм човек"
        },
        ca: {
            "I am human": "Sóc humà"
        },
        hr: {
            "I am human": "Ja sam čovjek"
        },
        cs: {
            "I am human": "Jsem člověk"
        },
        da: {
            "I am human": "Jeg er et menneske"
        },
        nl: {
            "I am human": "Ik ben een mens"
        },
        et: {
            "I am human": "Ma olen inimeste"
        },
        fi: {
            "I am human": "Olen ihminen"
        },
        fr: {
            "I am human": "Je suis humain"
        },
        gl: {
            "I am human": "Eu son humano"
        },
        ka: {
            "I am human": "მე ვარ ადამიანი"
        },
        de: {
            "I am human": "Ich bin ein Mensch"
        },
        el: {
            "I am human": "Είμαι άνθρωπος"
        },
        gu: {
            "I am human": "હું માનવ છું"
        },
        iw: {
            "I am human": ". אני אנושי"
        },
        hi: {
            "I am human": "मैं मानव हूं"
        },
        hu: {
            "I am human": "Nem vagyok robot"
        },
        is: {
            "I am human": "Ég er manneskja"
        },
        id: {
            "I am human": "Aku manusia"
        },
        it: {
            "I am human": "Sono un essere umano"
        },
        ja: {
            "I am human": "私は人間です"
        },
        kn: {
            "I am human": "ನಾನು ಮಾನವನು"
        },
        ko: {
            "I am human": "사람입니다"
        },
        lo: {
            "I am human": "ຂ້ອຍເປັນມະນຸດ"
        },
        lv: {
            "I am human": "Es esmu cilvēks"
        },
        lt: {
            "I am human": "Aš esu žmogaus"
        },
        ms: {
            "I am human": "Saya manusia"
        },
        ml: {
            "I am human": "ഞാൻ മനുഷ്യനാണ്"
        },
        mr: {
            "I am human": "मी मानवी आहे"
        },
        mn: {
            "I am human": "Би бол хүн"
        },
        no: {
            "I am human": "Jeg er menneskelig"
        },
        fa: {
            "I am human": "من انسانی هستم"
        },
        pl: {
            "I am human": "Jestem człowiekiem"
        },
        pt: {
            "I am human": "Sou humano"
        },
        ro: {
            "I am human": "Eu sunt om"
        },
        ru: {
            "I am human": "Я человек"
        },
        sr: {
            "I am human": "Ja sam ljudski"
        },
        si: {
            "I am human": "මම මිනිස්සු"
        },
        sk: {
            "I am human": "Ja som človek"
        },
        sl: {
            "I am human": "Jaz sem človeški"
        },
        es: {
            "I am human": "Soy humano"
        },
        sw: {
            "I am human": "Mimi ni binadamu"
        },
        sv: {
            "I am human": "Jag är människa"
        },
        ta: {
            "I am human": "நான் மனித"
        },
        te: {
            "I am human": "నేను మనిషిని"
        },
        th: {
            "I am human": "ผมมนุษย์"
        },
        tr: {
            "I am human": "Ben bir insanım"
        },
        uk: {
            "I am human": "Я людини"
        },
        ur: {
            "I am human": "میں انسان ہوں"
        },
        vi: {
            "I am human": "Tôi là con người"
        },
        zu: {
            "I am human": "Ngingumuntu"
        }
    }
        , bt = null
        , wt = {
        translate: function(e, t) {
            var n = wt.getBestTrans(vt)
                , r = n && n[e];
            if (r = r || e,
                t)
                for (var i = Object.keys(t), o = i.length; o--; )
                    r = r.replace(new RegExp("{{" + i[o] + "}}","g"), t[i[o]]);
            return r
        },
        getBestTrans: function(e) {
            var t = wt.getLocale();
            return t in e ? e[t] : wt.getShortLocale(t)in e ? e[wt.getShortLocale(t)] : "en"in e ? e.en : null
        },
        resolveLocale: function(e) {
            var t = wt.getShortLocale(e);
            return "in" === t && (e = "id"),
            "iw" === t && (e = "he"),
            "nb" === t && (e = "no"),
            "ji" === t && (e = "yi"),
            "zh-CN" === e && (e = "zh"),
            "jv" === t && (e = "jw"),
            "me" === t && (e = "bs"),
                yt[e] ? e : yt[t] ? t : "en"
        },
        getLocale: function() {
            return wt.resolveLocale(bt || window.navigator.userLanguage || window.navigator.language)
        },
        setLocale: function(e) {
            "zh-Hans" === e ? e = "zh-CN" : "zh-Hant" === e && (e = "zh-TW"),
                bt = e
        },
        getShortLocale: function(e) {
            return e.indexOf("-") >= 0 ? e.substring(0, e.indexOf("-")) : e
        },
        getLangName: function(e) {
            return yt[e]
        },
        isShortLocale: function(e) {
            return 2 === e.length || 3 === e.length
        },
        addTable: function(e, t) {
            if (t || (t = Object.create(null)),
                vt[e]) {
                var n = vt[e];
                for (var r in t)
                    n[r] = t[r]
            } else
                vt[e] = t;
            return vt[e]
        },
        getTable: function(e) {
            return vt[e]
        },
        addTables: function(e) {
            for (var t in e)
                wt.addTable(t, e[t]);
            return vt
        },
        getTables: function() {
            return vt
        }
    }
        , _t = {
        400: "Rate limited or network error. Please retry.",
        429: "Your computer or network has sent too many requests.",
        500: "Cannot contact hCaptcha. Check your connection and try again."
    }
        , Et = function(e) {
        try {
            return wt.translate(_t[e])
        } catch (Gn) {
            return !1
        }
    }
        , kt = "undefined" != typeof XDomainRequest && !("withCredentials"in XMLHttpRequest.prototype);
    function Vt(e, t, n) {
        n = n || {};
        var r = {
            url: t,
            method: e.toUpperCase(),
            responseType: n.responseType || "string",
            dataType: n.dataType || null,
            withCredentials: n.withCredentials || !1,
            headers: n.headers || null,
            data: n.data || null,
            timeout: n.timeout || null,
            pst: n.pst || null
        };
        r.legacy = r.withCredentials && kt;
        var i = "fetch"in window && r.pst ? Tt : xt;
        return n.retry ? Qe((function() {
                return n.data && (r.data = "function" == typeof n.data ? n.data() : n.data,
                    "json" === r.dataType && "object" == typeof r.data ? r.data = JSON.stringify(r.data) : "query" === r.dataType && (r.data = dt(r.data))),
                    i(r)
            }
        ), n.retry) : (n.data && (r.data = "function" == typeof n.data ? n.data() : n.data,
            "json" === r.dataType && "object" == typeof r.data ? r.data = JSON.stringify(r.data) : "query" === r.dataType && (r.data = dt(r.data))),
            i(r))
    }
    function xt(e) {
        var t = e.legacy ? new XDomainRequest : new XMLHttpRequest
            , n = "function" == typeof e.url ? e.url() : e.url;
        return new Promise((function(r, i) {
                var o, a = function(o) {
                    return function() {
                        var a = t.response
                            , s = t.statusText || ""
                            , c = t.status
                            , l = t.readyState;
                        if (a || "" !== t.responseType && "text" !== t.responseType || (a = t.responseText),
                        4 === l || e.legacy) {
                            try {
                                if (a) {
                                    var h = t.contentType;
                                    t.getResponseHeader && (h = t.getResponseHeader("content-type"));
                                    var u = -1 !== (h = h ? h.toLowerCase() : "").indexOf("application/json");
                                    if ("ArrayBuffer"in window && a instanceof ArrayBuffer && u && (a = (new TextDecoder).decode(new Uint8Array(a))),
                                    "string" == typeof a)
                                        try {
                                            a = JSON.parse(a)
                                        } catch (p) {
                                            u && Pe("http", p, {
                                                url: n,
                                                config: e,
                                                responseType: t.responseType,
                                                contentType: h,
                                                response: a
                                            })
                                        }
                                }
                            } catch (p) {
                                return Pe("http", p, {
                                    contentType: h
                                }),
                                    void i({
                                        event: ce,
                                        endpoint: n,
                                        response: a,
                                        state: l,
                                        status: c,
                                        message: Et(c || 400) || s
                                    })
                            }
                            if ("error" === o || c >= 400 && c <= 511)
                                return void i({
                                    event: ce,
                                    endpoint: n,
                                    response: a,
                                    state: l,
                                    status: c,
                                    message: 409 === c && a.error || Et(c || 400) || s
                                });
                            r({
                                state: l,
                                status: c,
                                body: a,
                                message: s
                            })
                        }
                    }
                };
                if ((t.onload = a("complete"),
                    t.onerror = t.ontimeout = a("error"),
                    t.open(e.method, n),
                "arraybuffer" === e.responseType && (!e.legacy && "TextDecoder"in window && "ArrayBuffer"in window ? t.responseType = "arraybuffer" : (e.responseType = "json",
                    e.headers.accept = "application/json")),
                e.timeout && (t.timeout = "function" == typeof e.timeout ? e.timeout(n) : e.timeout),
                    !e.legacy) && (t.withCredentials = e.withCredentials,
                    e.headers))
                    for (var s in e.headers)
                        o = e.headers[s],
                            t.setRequestHeader(s, o);
                setTimeout((function() {
                        t.send(e.data)
                    }
                ), 0)
            }
        ))
    }
    function Tt(e) {
        var t, n = "function" == typeof e.url ? e.url() : e.url, r = new Headers;
        if ("json" === e.responseType && r.set("content-type", "application/json"),
            e.headers)
            for (var i in e.headers)
                t = e.headers[i],
                    r.set(i, t);
        var o = {
            method: e.method,
            credentials: "include",
            body: e.data,
            headers: r
        };
        if (e.pst) {
            var a = {};
            "token-request" === e.pst ? a = {
                version: 1,
                operation: "token-request"
            } : "token-redemption" === e.pst ? a = {
                version: 1,
                operation: "token-redemption",
                refreshPolicy: "refresh"
            } : "send-redemption-record" === e.pst && (a = {
                version: 1,
                operation: "send-redemption-record",
                issuers: [ve.pstIssuer]
            }),
                o.privateToken = a
        }
        return new Promise((function(t, r) {
                fetch(n, o).then((function(i) {
                        return 200 !== i.status ? r({
                            event: ce,
                            endpoint: n,
                            response: i,
                            state: 4,
                            status: i.status,
                            message: Et(i.status || 400)
                        }) : ("arraybuffer" === e.responseType ? i.arrayBuffer() : "json" === e.responseType ? i.json() : i.text()).then((function(e) {
                                t({
                                    state: 4,
                                    status: i.status,
                                    body: e,
                                    message: Et(i.status || 400)
                                })
                            }
                        ))
                    }
                ))["catch"]((function(e) {
                        r({
                            event: ce,
                            endpoint: n,
                            response: e.error,
                            state: 4,
                            status: 400,
                            message: Et(400)
                        })
                    }
                ))
            }
        ))
    }
    var St = function(e, t) {
        if ("object" == typeof e && t === undefined && (e = (t = e).url),
        null === e)
            throw new Error("Url missing");
        return Vt("GET", e, t)
    }
        , Rt = ["svg", "gif", "png"];
    function Mt(e, t) {
        t = t || {};
        var n, r = e;
        if (0 === r.indexOf("data:image"))
            for (var i = !1, o = Rt.length, a = -1; a++ < o && !i; )
                (i = r.indexOf(Rt[a]) >= 0) && (n = Rt[a]);
        else
            n = r.substr(r.lastIndexOf(".") + 1, r.length);
        !!(!document.createElementNS || !document.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGRect) && t.fallback && (t.fallback.indexOf(".") >= 0 ? n = (r = t.fallback).substr(r.lastIndexOf(".") + 1, r.length) : (r = e.substr(0, e.indexOf(n)) + t.fallback,
            n = t.fallback)),
        t.prefix && (r = t.prefix + "/" + r),
            this.attribs = {
                crossOrigin: t.crossOrigin || null
            },
            this.id = r,
            this.src = function(e) {
                if (ve.assethost && 0 === e.indexOf(ye.assetDomain))
                    return ve.assethost + e.replace(ye.assetDomain, "");
                if (ve.imghost && e.indexOf("imgs") >= 0) {
                    var t = e.indexOf(".ai") >= 0 ? e.indexOf(".ai") + 3 : e.indexOf(".com") + 4;
                    return ve.imghost + e.substr(t, e.length)
                }
                return e
            }(r),
            this.ext = n,
            this.width = 0,
            this.height = 0,
            this.aspect = 0,
            this.loaded = !1,
            this.error = !1,
            this.element = null,
            this.cb = {
                load: [],
                error: []
            }
    }
    function Ut(e, t, n) {
        for (var r = e[t], i = r.length, o = null; --i > -1; )
            o = r[i],
                r.splice(i, 1),
                o(n);
        "error" === t ? e.load = [] : e.error = []
    }
    function Ct(e, t) {
        var n = e;
        t || (t = {}),
        t.prefix && (n = t.prefix + "/" + e),
            this.attribs = {
                defer: t.defer || null,
                async: t.async || null,
                crossOrigin: t.crossOrigin || null,
                integrity: t.integrity || null
            },
            this.id = n,
            this.src = function(e) {
                if (ve.assethost && 0 === e.indexOf(ye.assetDomain))
                    return ve.assethost + e.replace(ye.assetDomain, "");
                return e
            }(n),
            this.loaded = !1,
            this.error = !1,
            this.element = null,
            this.cb = {
                load: [],
                error: []
            }
    }
    function Ot(e, t, n) {
        for (var r = e[t], i = r.length, o = null; --i > -1; )
            o = r[i],
                r.splice(i, 1),
                o(n);
        "error" === t ? e.load = [] : e.error = []
    }
    function Wt(e, t) {
        var n = e;
        t || (t = {}),
        t.prefix && (n = t.prefix + "/" + e),
            this.responseType = t.responseType,
            this.id = n,
            this.src = function(e) {
                if (ve.assethost && 0 === e.indexOf(ye.assetDomain))
                    return ve.assethost + e.replace(ye.assetDomain, "");
                return e
            }(n),
            this.loaded = !1,
            this.error = !1,
            this.cb = {
                load: [],
                error: []
            },
            this.data = null
    }
    function Nt(e, t, n) {
        for (var r = e[t], i = r.length, o = null; --i > -1; )
            o = r[i],
                r.splice(i, 1),
                o(n);
        "error" === t ? e.load = [] : e.error = []
    }
    Mt.prototype.load = function() {
        return ("svg" === this.ext ? this._loadSvg() : this._loadImg())["catch"]((function(e) {
                throw Ae("Asset failed", "error", "assets", {
                    error: e
                }),
                    e
            }
        ))
    }
        ,
        Mt.prototype._loadSvg = function() {
            var e, t = this, n = this.src, r = this.id;
            if (0 === n.indexOf("data:image/svg+xml")) {
                var i = n.slice("data:image/svg+xml,".length);
                e = Promise.resolve(decodeURIComponent(i))
            } else
                e = St(n).then((function(e) {
                        return e.body
                    }
                ));
            return e.then((function(e) {
                    var n = (new DOMParser).parseFromString(e, "image/svg+xml").documentElement
                        , r = parseInt(n.getAttribute("width"))
                        , i = parseInt(n.getAttribute("height"));
                    return t._imgLoaded(n, r, i),
                        t
                }
            ))["catch"]((function(e) {
                    t.error = !0;
                    var n = (e && e.message ? e.message : e || "Loading Error") + ": " + r;
                    throw Ut(t.cb, "error", n),
                        n
                }
            ))
        }
        ,
        Mt.prototype._loadImg = function() {
            var e = this
                , t = this.attribs
                , n = this.src
                , r = this.id;
            return new Promise((function(i, o) {
                    function a() {
                        e.loaded || (e._imgLoaded(s, s.width, s.height),
                            s.onload = s.onerror = null,
                            i(e))
                    }
                    var s = new Image;
                    t.crossOrigin && (s.crossOrigin = t.crossOrigin),
                        s.onerror = function() {
                            e.error = !0,
                                s.onload = s.onerror = null;
                            var t = "Loading Error: " + r;
                            Ut(e.cb, "error", t),
                                o(t)
                        }
                        ,
                        s.onload = a,
                        s.src = n,
                    s.complete && a()
                }
            ))
        }
        ,
        Mt.prototype._imgLoaded = function(e, t, n) {
            this.element = new pt(e),
                this.width = t,
                this.height = n,
                this.aspect = t / n,
                this.loaded = !0,
                Ut(this.cb, "load", this)
        }
        ,
        Mt.prototype.onload = function(e) {
            this.error || (this.loaded ? e(this) : this.cb.load.push(e))
        }
        ,
        Mt.prototype.onerror = function(e) {
            this.loaded && !this.error || (this.error ? e(this) : this.cb.error.push(e))
        }
        ,
        Ct.prototype.load = function() {
            var e = this
                , t = this.attribs
                , n = this.src
                , r = this.id;
            return new Promise((function(i, o) {
                    var a = document.createElement("script");
                    e.element = a,
                        a.onerror = function() {
                            e.error = !0,
                                a.onload = a.onreadystatechange = a.onerror = null;
                            var t = "Loading Error: " + r;
                            Ot(e.cb, "error", t),
                                o(t)
                        }
                        ,
                        a.onload = a.onreadystatechange = function() {
                            this.loaded || a.readyState && "loaded" !== a.readyState && "complete" !== a.readyState || (e.loaded = !0,
                                a.onload = a.onreadystatechange = a.onerror = null,
                                document.body.removeChild(a),
                                Ot(e.cb, "load", e),
                                i(e))
                        }
                        ,
                        a.type = "text/javascript",
                        a.src = n,
                    t.crossOrigin && (a.crossorigin = t.crossOrigin),
                    t.async && (a.async = !0),
                    t.defer && (a.defer = !0),
                    t.integrity && (a.integrity = t.integrity),
                        document.body.appendChild(a),
                    a.complete && a.onload()
                }
            ))
        }
        ,
        Ct.prototype.onload = function(e) {
            this.error || (this.loaded ? e(this) : this.cb.load.push(e))
        }
        ,
        Ct.prototype.onerror = function(e) {
            this.loaded && !this.error || (this.error ? e(this) : this.cb.error.push(e))
        }
        ,
        Wt.prototype.load = function() {
            var e = this
                , t = this.src
                , n = this.id;
            return new Promise((function(r, i) {
                    var o = {};
                    "arraybuffer" === e.responseType ? o.responseType = "arraybuffer" : t.indexOf("json") >= 0 && (o.responseType = "json"),
                        St(t, o).then((function(t) {
                                e.loaded = !0,
                                    e.data = t.body,
                                    Nt(e.cb, "load", e),
                                    r(e)
                            }
                        ))["catch"]((function(t) {
                                e.error = !0;
                                var r = (t && t.message ? t.message : "Loading Error") + ": " + n;
                                Nt(e.cb, "error", r),
                                    i(r)
                            }
                        ))
                }
            ))
        }
        ,
        Wt.prototype.onload = function(e) {
            this.error || (this.loaded ? e(this) : this.cb.load.push(e))
        }
        ,
        Wt.prototype.onerror = function(e) {
            this.loaded && !this.error || (this.error ? e(this) : this.cb.error.push(e))
        }
    ;
    var At = []
        , Pt = function(e, t) {
        var n = new Wt(e,t);
        return At.push(n),
            n.load()
    }
        , jt = function(e) {
        return new Promise((function(t, n) {
                for (var r = At.length, i = !1, o = null; --r > -1 && !i; )
                    i = (o = At[r]).id === e || -1 !== o.id.indexOf("/" === e[0] ? "" : "/" + e);
                if (!i)
                    return t(null);
                o.onload(t),
                    o.onerror(n)
            }
        ))
    }
        , Ft = []
        , Bt = !1
        , Zt = !1;
    function It() {
        document.addEventListener ? (document.addEventListener("DOMContentLoaded", Ht),
            window.addEventListener("load", Ht)) : (document.attachEvent("onreadystatechange", Dt),
            window.attachEvent("onload", Ht)),
            Bt = !0
    }
    function Dt() {
        "interactive" !== document.readyState && "loaded" !== document.readyState && "complete" !== document.readyState || Ht()
    }
    function Ht() {
        if (!1 === Zt) {
            for (var e = 0; e < Ft.length; e++)
                Ft[e].fn.apply(null, Ft[e].args);
            Ft = []
        }
        Zt = !0,
            document.removeEventListener ? (document.removeEventListener("DOMContentLoaded", Ht),
                window.removeEventListener("load", Ht)) : (document.detachEvent("onreadystatechange", Dt),
                window.detachEvent("onload", Ht))
    }
    new pt(document);
    var Kt = new pt(window)
        , Lt = {
        touchstart: "ts",
        touchend: "te",
        touchmove: "tm",
        touchcancel: "tc"
    }
        , zt = {
        mousedown: "md",
        mouseup: "mu",
        mousemove: "mm"
    }
        , Jt = {
        pointermove: "pm"
    }
        , Yt = {
        keydown: "kd",
        keyup: "ku"
    }
        , $t = {
        devicemotion: "dm"
    }
        , Gt = function(e, t) {
        var n = zt[e]
            , r = null;
        return function(e) {
            r = function(e) {
                return [e.windowX, e.windowY, Date.now()]
            }(e),
                t(n, r)
        }
    }
        , Xt = function(e, t) {
        var n = Jt[e]
            , r = null;
        return function(e) {
            r = function(e) {
                var t = []
                    , n = [];
                e.getCoalescedEvents && (n = e.getCoalescedEvents());
                for (var r = 0; r < n.length; r++) {
                    var i = n[r];
                    t.push([i.x, i.y, Date.now()])
                }
                return t
            }(e);
            for (var i = 0; i < r.length; i++)
                t(n, r[i])
        }
    }
        , qt = function(e, t) {
        var n = Lt[e]
            , r = null;
        return function(e) {
            r = function(e) {
                var t = [];
                try {
                    var n, r;
                    if (e.touches && e.touches.length >= 1 ? n = e.touches : e.changedTouches && e.changedTouches.length >= 1 && (n = e.changedTouches),
                        n) {
                        for (var i = 0; i < n.length; i++)
                            (r = st.eventCoords(n[i])) && t.push([n[i].identifier, r.x, r.y]);
                        t.push(Date.now())
                    }
                    return t
                } catch (Gn) {
                    return t
                }
            }(e),
                t(n, r)
        }
    }
        , Qt = function(e, t) {
        var n = Yt[e]
            , r = null;
        return function(e) {
            r = function(e) {
                return [e.keyNum, Date.now()]
            }(e),
                t(n, r)
        }
    }
        , en = function(e, t) {
        var n = $t[e]
            , r = null
            , i = [];
        return function(e) {
            r = function(e, t) {
                (e.acceleration === undefined || e.acceleration && e.acceleration.x === undefined) && (e.acceleration = {
                    x: 0,
                    y: 0,
                    z: 0
                });
                (e.rotationRate === undefined || e.rotationRate && e.rotationRate.alpha === undefined) && (e.rotationRate = {
                    alpha: 0,
                    beta: 0,
                    gamma: 0
                });
                var n = [e.acceleration.x, e.acceleration.y, e.acceleration.z, e.rotationRate.alpha, e.rotationRate.beta, e.rotationRate.gamma, Date.now()]
                    , r = [];
                if (0 === t.length)
                    t = n,
                        r = n;
                else {
                    for (var i, o = 0, a = 0; a < 6; a++)
                        i = t[a] - n[a],
                            r.push(n[a]),
                            o += Math.abs(i);
                    if (r.push(Date.now()),
                        t = n,
                    o <= 0)
                        return null
                }
                return {
                    motion: r,
                    prevmotion: t
                }
            }(e, i),
            null !== r && (i = r.prevmotion,
                r = r.motion,
                t(n, r))
        }
    };
    function tn() {
        this._manifest = {},
            this.state = {
                timeBuffers: {},
                loadTime: Date.now(),
                recording: !1,
                initRecord: !1,
                record: {
                    mouse: !0,
                    touch: !0,
                    keys: !1,
                    motion: !1
                }
            },
            this._recordEvent = this._recordEvent.bind(this)
    }
    tn.prototype.record = function(e, t, n, r) {
        if (this._manifest.st = Date.now(),
            this.state.record.mouse = e === undefined ? this.state.record.mouse : e,
            this.state.record.touch = n === undefined ? this.state.record.touch : n,
            this.state.record.keys = t === undefined ? this.state.record.keys : t,
            this.state.record.motion = r === undefined ? this.state.record.motion : r,
        !1 === this.state.initRecord) {
            var i = new pt(document.body);
            this.state.record.mouse && (i.addEventListener("mousedown", Gt("mousedown", this._recordEvent), !0),
                i.addEventListener("mousemove", Gt("mousemove", this._recordEvent), !0),
                i.addEventListener("mouseup", Gt("mouseup", this._recordEvent), !0),
                i.addEventListener("pointermove", Xt("pointermove", this._recordEvent), !0)),
            !0 === this.state.record.keys && (i.addEventListener("keyup", Qt("keyup", this._recordEvent), !0),
                i.addEventListener("keydown", Qt("keydown", this._recordEvent), !0)),
            this.state.record.touch && !0 === ee.Browser.hasEvent("touchstart", document.body) && (i.addEventListener("touchstart", qt("touchstart", this._recordEvent), !0),
                i.addEventListener("touchmove", qt("touchmove", this._recordEvent), !0),
                i.addEventListener("touchend", qt("touchend", this._recordEvent), !0)),
            this.state.record.motion && !0 === ee.Browser.hasEvent("devicemotion", window) && i.addEventListener("devicemotion", en("devicemotion", this._recordEvent), !0),
                this.state.initRecord = !0
        }
        this.state.recording = !0
    }
        ,
        tn.prototype.stop = function() {
            this.state.recording = !1
        }
        ,
        tn.prototype.time = function() {
            return this.state.loadTime
        }
        ,
        tn.prototype.getData = function() {
            for (var e in this.state.timeBuffers)
                this._manifest[e] = this.state.timeBuffers[e].getData(),
                    this._manifest[e + "-mp"] = this.state.timeBuffers[e].getMeanPeriod();
            return this._manifest
        }
        ,
        tn.prototype.setData = function(e, t) {
            this._manifest[e] = t
        }
        ,
        tn.prototype.resetData = function() {
            this._manifest = {},
                this.state.timeBuffers = {}
        }
        ,
        tn.prototype.circBuffPush = function(e, t) {
            this._recordEvent(e, t)
        }
        ,
        tn.prototype._recordEvent = function(e, t) {
            if (!1 !== this.state.recording)
                try {
                    var n = t[t.length - 1];
                    this.state.timeBuffers[e] || (this.state.timeBuffers[e] = new Xe(16,15e3)),
                        this.state.timeBuffers[e].push(n, t)
                } catch ($n) {
                    Pe("motion", $n)
                }
        }
    ;
    var nn, rn, on, an, sn, cn = new tn;
    try {
        nn = function() {
            var e = {
                _9ZnY90: 0,
                _2zIpK8clg: 0,
                _0aMh: [],
                _MNn9QojK: [],
                _IaEkW7Evt: [],
                _iooT5I: {},
                _6ViJ: window,
                _IWOgtRwi: [function(e) {
                    e._0aMh.push(st)
                }
                    , function(e) {
                        var t = e._0aMh.pop()
                            , n = e._0aMh.pop();
                        if (t && t._l !== undefined)
                            n.splice(0, 0, {
                                _l: {}
                            }),
                                t.apply(e._6ViJ, n);
                        else {
                            var r = t.apply(e._6ViJ, n);
                            e._0aMh.push(r)
                        }
                    }
                    , function(e) {
                        var t = e._YHdinsA[e._9ZnY90++]
                            , n = e._YHdinsA[e._9ZnY90++]
                            , r = e._YHdinsA[e._9ZnY90++]
                            , i = -1 == t ? e._MNn9QojK : e._IaEkW7Evt[t];
                        r ? e._0aMh.push(++i[n]) : e._0aMh.push(i[n]++)
                    }
                    , function(e) {
                        var t = e._0aMh.pop();
                        e._0aMh.push(!t)
                    }
                    , function(e) {
                        e._0aMh.push(e._YHdinsA[e._9ZnY90++])
                    }
                    , function(e) {
                        var t = e._0aMh.pop()
                            , n = e._YHdinsA[e._9ZnY90++]
                            , r = e._YHdinsA[e._9ZnY90++];
                        e._MNn9QojK[r] = t;
                        for (var i = 0; i < n; i++)
                            e._MNn9QojK[e._YHdinsA[e._9ZnY90++]] = t[i]
                    }
                    , function(e) {
                        var t = e._0aMh.pop()
                            , n = e._YHdinsA[e._9ZnY90++]
                            , r = e._YHdinsA[e._9ZnY90++];
                        (-1 == n ? e._MNn9QojK : e._IaEkW7Evt[n])[r] = t
                    }
                    , function(e) {
                        var t = e._0aMh.pop()
                            , n = e._0aMh.pop();
                        e._0aMh.push(n === t)
                    }
                    , function(e) {
                        var t = e._0aMh.pop()
                            , n = e._0aMh.pop();
                        e._0aMh.push(n in t)
                    }
                    , function(e) {
                        var t = e._0aMh.pop();
                        e._0aMh.push(typeof t)
                    }
                    , function(e) {
                        var t = e._0aMh.pop();
                        e._0aMh.push(-t)
                    }
                    , function(e) {
                        var t = e._0aMh.pop()
                            , n = e._YHdinsA[e._9ZnY90++]
                            , r = e._YHdinsA[e._9ZnY90++]
                            , i = -1 == n ? e._MNn9QojK : e._IaEkW7Evt[n];
                        e._0aMh.push(i[r] = t)
                    }
                    , function(e) {
                        e._0aMh.pop(),
                            e._0aMh.push(void 0)
                    }
                    , function(e) {
                        for (var t = e._YHdinsA[e._9ZnY90++], n = [], r = 0; r < t; r++)
                            n.push(e._0aMh.pop());
                        e._0aMh.push(n)
                    }
                    , function(e) {
                        e._0aMh.push(pt)
                    }
                    , function(e) {
                        var t = e._0aMh.pop()
                            , n = e._0aMh.pop();
                        e._0aMh.push(n > t)
                    }
                    , function(e) {
                        var t = e._0aMh.pop()
                            , n = e._0aMh.pop();
                        e._0aMh.push(n == t)
                    }
                    , function(e) {
                        e._9ZnY90 = e._0aMh.splice(e._0aMh.length - 4, 1)[0],
                            e._6ViJ = e._0aMh.splice(e._0aMh.length - 3, 1)[0],
                            e._MNn9QojK = e._0aMh.splice(e._0aMh.length - 2, 1)[0]
                    }
                    , function(e) {
                        var t = e._0aMh.pop()
                            , n = e._0aMh.pop();
                        e._0aMh.push(n >= t)
                    }
                    , function(e) {
                        var t = e._0aMh.pop()
                            , n = e._YHdinsA[e._9ZnY90++]
                            , r = e._YHdinsA[e._9ZnY90++]
                            , i = -1 == n ? e._MNn9QojK : e._IaEkW7Evt[n];
                        e._0aMh.push(i[r] += t)
                    }
                    , function(e) {
                        e._0aMh.push(at)
                    }
                    , function(e) {
                        var t = e._0aMh.pop()
                            , n = e._0aMh.pop();
                        e._0aMh.push(n - t)
                    }
                    , function(e) {
                        var t = e._0aMh.pop()
                            , n = e._0aMh.pop();
                        e._0aMh.push(n << t)
                    }
                    , function(e) {
                        var t = e._0aMh.pop()
                            , n = e._0aMh.pop()
                            , r = e._0aMh.pop();
                        e._0aMh.push(n[t] = r)
                    }
                    , function() {
                        var t = e._0aMh.pop()
                            , n = e._YHdinsA[e._9ZnY90++];
                        e._IaEkW7Evt[n] ? e._MNn9QojK = e._IaEkW7Evt[n] : (e._MNn9QojK = t,
                            e._IaEkW7Evt[n] = t)
                    }
                    , function(e) {
                        var t = e._0aMh.pop()
                            , n = e._0aMh.pop();
                        e._0aMh.push(n * t)
                    }
                    , function(e) {
                        e._iooT5I[e._0aMh[e._0aMh.length - 1]] = e._0aMh[e._0aMh.length - 2]
                    }
                    , function(e) {
                        var t = e._0aMh.pop();
                        e._0aMh.push(window[t])
                    }
                    , function(e) {
                        e._0aMh.push(undefined)
                    }
                    , function(e) {
                        e._0aMh.push(e._6ViJ)
                    }
                    , function(e) {
                        var t = e._0aMh.pop()
                            , n = e._YHdinsA[e._9ZnY90++];
                        t || (e._9ZnY90 = n)
                    }
                    , function(e) {
                        var t = e._YHdinsA[e._9ZnY90++]
                            , n = e._YHdinsA[e._9ZnY90++]
                            , r = -1 == t ? e._MNn9QojK : e._IaEkW7Evt[t];
                        e._0aMh.push(r[n])
                    }
                    , function(e) {
                        e._0aMh.push(at)
                    }
                    , function(e) {
                        var t = e._0aMh.pop()
                            , n = e._0aMh.pop();
                        e._0aMh.push(n / t)
                    }
                    , function(e) {
                        var t = e._0aMh.pop()
                            , n = e._0aMh.pop();
                        e._0aMh.push(n | t)
                    }
                    , function(e) {
                        e._0aMh.push(ot)
                    }
                    , function(e) {
                        for (var t = e._YHdinsA[e._9ZnY90++], n = e._YHdinsA[e._9ZnY90++], r = e._YHdinsA[e._9ZnY90++], i = decodeURIComponent(atob(e._YZxy2.slice(t, t + n))), o = "", a = 0; a < i.length; a++)
                            o += String.fromCharCode((256 + i.charCodeAt(a) + r) % 256);
                        e._0aMh.push(o)
                    }
                    , function(e) {
                        var t = e._0aMh.pop()
                            , n = e._0aMh.pop()
                            , r = n[t];
                        "function" == typeof r && (r = r.bind(n)),
                            e._0aMh.push(r)
                    }
                    , function(e) {
                        var t = e._0aMh.pop()
                            , n = e._0aMh.pop();
                        e._0aMh.push(n + t)
                    }
                    , function(e) {
                        e._0aMh.push(!!e._YHdinsA[e._9ZnY90++])
                    }
                    , function(e) {
                        var t = e._0aMh.pop()
                            , n = e._0aMh.pop();
                        e._0aMh.push(n !== t)
                    }
                    , function() {
                        var t = e._0aMh.pop()
                            , n = e._0aMh.pop()
                            , r = !1;
                        t._l !== undefined && (r = !0,
                            n.splice(0, 0, {
                                _l: {}
                            }));
                        var i = new (Function.prototype.bind.apply(t, [null].concat(n)));
                        r && e._0aMh.pop(),
                            e._0aMh.push(i)
                    }
                    , function(e) {
                        var t = e._0aMh.pop()
                            , n = e._0aMh.pop();
                        e._0aMh.push(n < t)
                    }
                    , function(e) {
                        e._0aMh.push(ee)
                    }
                    , function() {
                        var t = e._0aMh.pop()
                            , n = e._YHdinsA[e._9ZnY90++];
                        e._MNn9QojK = t,
                            e._IaEkW7Evt[n] = t
                    }
                    , function(e) {
                        var t = e._YHdinsA[e._9ZnY90++];
                        e._2zIpK8clg = t
                    }
                    , function(e) {
                        var t = e._0aMh.pop()
                            , n = e._0aMh.pop();
                        e._0aMh.push(n instanceof t)
                    }
                    , function(e) {
                        var n = e._2zIpK8clg
                            , r = e._YHdinsA[e._9ZnY90++];
                        try {
                            t(e)
                        } catch (i) {
                            e._0aMh.push(i),
                                e._9ZnY90 = r,
                                t(e)
                        }
                        e._2zIpK8clg = n
                    }
                    , function(e) {
                        e._0aMh.push(null)
                    }
                    , function(e) {
                        var t = e._0aMh.pop()
                            , n = e._0aMh.pop()
                            , r = e._0aMh.pop();
                        e._0aMh.push(n[t] += r)
                    }
                    , function(e) {
                        var t = e._0aMh.pop()
                            , n = e._YHdinsA[e._9ZnY90++]
                            , r = e._YHdinsA[e._9ZnY90++]
                            , i = -1 == n ? e._MNn9QojK : e._IaEkW7Evt[n];
                        e._0aMh.push(i[r] |= t)
                    }
                    , function(e) {
                        e._0aMh.pop()
                    }
                    , function(e) {
                        var t = e._0aMh.pop()
                            , n = e._0aMh.pop();
                        e._0aMh.push(n <= t)
                    }
                    , function(e) {
                        e._0aMh.push(e._0aMh[e._0aMh.length - 1])
                    }
                    , function(e) {
                        for (var t = e._YHdinsA[e._9ZnY90++], n = {}, r = 0; r < t; r++) {
                            var i = e._0aMh.pop();
                            n[e._0aMh.pop()] = i
                        }
                        e._0aMh.push(n)
                    }
                    , function(e) {
                        var n = e._0aMh.pop()
                            , r = function() {
                            var i = !1
                                , o = Array.prototype.slice.call(arguments);
                            o.length > 0 && o[0] && o[0]._l ? o = o.splice(1, o.length - 1) : i = !0;
                            var a = e._6ViJ
                                , s = e._2zIpK8clg
                                , c = e._IaEkW7Evt;
                            if (e._0aMh.push(e._9ZnY90),
                                e._0aMh.push(e._6ViJ),
                                e._0aMh.push(e._MNn9QojK),
                                e._0aMh.push(o),
                                e._0aMh.push(r),
                                e._2zIpK8clg = e._9ZnY90,
                                e._9ZnY90 = n,
                                e._6ViJ = this,
                                e._IaEkW7Evt = r._r,
                                t(e),
                                e._6ViJ = a,
                                e._2zIpK8clg = s,
                                e._IaEkW7Evt = c,
                                i)
                                return e._0aMh.pop()
                        };
                        r._l = {},
                            r._r = Array.prototype.slice.call(e._IaEkW7Evt),
                            e._0aMh.push(r)
                    }
                ],
                _YHdinsA: [13, 0, 24, 0, 4, 14, 55, 6, -1, 0, 39, 0, 30, 131, 13, 0, 44, 1, 51, 5, 1, 0, 1, 31, -1, 1, 36, 696, 20, -22, 37, 31, -1, 1, 36, 4836, 12, 17, 37, 16, 53, 30, 61, 51, 31, -1, 1, 36, 1740, 8, 15, 37, 31, -1, 1, 36, 1536, 12, 14, 37, 16, 6, -1, 2, 13, 0, 36, 2076, 8, 17, 27, 36, 3132, 4, 8, 37, 1, 31, -1, 2, 30, 88, 4, 1, 39, 0, 30, 90, 4, 0, 31, -1, 1, 36, 56, 20, 9, 37, 30, 106, 4, 1, 39, 0, 30, 108, 4, 0, 31, -1, 1, 36, 3488, 16, 14, 37, 31, -1, 1, 36, 2172, 12, 15, 37, 13, 5, 39, 0, 30, 130, 17, 4, 141, 55, 6, -1, 1, 39, 0, 30, 300, 13, 0, 44, 2, 51, 5, 1, 0, 1, 13, 0, 6, -1, 2, 13, 0, 6, -1, 3, 31, -1, 1, 36, 2592, 52, -12, 37, 30, 185, 13, 0, 31, -1, 1, 36, 2592, 52, -12, 37, 1, 11, -1, 3, 51, 4, 0, 6, -1, 4, 31, -1, 4, 31, -1, 3, 36, 632, 28, -19, 37, 42, 30, 292, 31, -1, 3, 31, -1, 4, 37, 6, -1, 5, 13, 0, 36, 2076, 8, 17, 27, 36, 3132, 4, 8, 37, 1, 31, -1, 5, 36, 592, 8, -21, 37, 13, 1, 36, 3136, 8, 11, 27, 36, 2664, 16, 18, 37, 1, 31, -1, 5, 36, 1732, 8, -21, 37, 13, 1, 36, 3136, 8, 11, 27, 36, 2664, 16, 18, 37, 1, 13, 3, 13, 1, 31, -1, 2, 36, 3820, 8, 4, 37, 1, 51, 2, -1, 4, 0, 51, 39, 0, 30, 190, 31, -1, 2, 39, 0, 30, 299, 17, 4, 310, 55, 6, -1, 2, 39, 0, 30, 341, 13, 0, 44, 3, 51, 5, 1, 0, 1, 13, 0, 36, 2076, 8, 17, 27, 36, 3132, 4, 8, 37, 1, 4, 0, 13, 2, 39, 0, 30, 340, 17, 4, 351, 55, 6, -1, 3, 39, 0, 30, 639, 13, 0, 44, 4, 51, 5, 1, 0, 1, 13, 0, 6, -1, 2, 47, 619, 31, -1, 1, 36, 3840, 12, 14, 37, 53, 30, 395, 51, 31, -1, 1, 36, 3840, 12, 14, 37, 36, 632, 28, -19, 37, 4, 1, 18, 30, 413, 31, -1, 1, 36, 3840, 12, 14, 37, 11, -1, 3, 51, 39, 0, 30, 455, 31, -1, 1, 36, 2196, 56, -21, 37, 53, 30, 441, 51, 31, -1, 1, 36, 2196, 56, -21, 37, 36, 632, 28, -19, 37, 4, 1, 18, 30, 455, 31, -1, 1, 36, 2196, 56, -21, 37, 11, -1, 3, 51, 31, -1, 3, 30, 606, 4, 0, 6, -1, 5, 31, -1, 5, 31, -1, 3, 36, 632, 28, -19, 37, 42, 30, 581, 31, -1, 3, 31, -1, 5, 37, 13, 1, 0, 36, 820, 28, 19, 37, 1, 11, -1, 4, 51, 31, -1, 4, 30, 572, 31, -1, 4, 36, 592, 8, -21, 37, 13, 1, 36, 3136, 8, 11, 27, 36, 2664, 16, 18, 37, 1, 31, -1, 4, 36, 1732, 8, -21, 37, 13, 1, 36, 3136, 8, 11, 27, 36, 2664, 16, 18, 37, 1, 31, -1, 3, 31, -1, 5, 37, 36, 772, 24, 14, 37, 13, 3, 13, 1, 31, -1, 2, 36, 3820, 8, 4, 37, 1, 51, 2, -1, 5, 0, 51, 39, 0, 30, 465, 13, 0, 36, 2076, 8, 17, 27, 36, 3132, 4, 8, 37, 1, 13, 1, 31, -1, 2, 36, 3820, 8, 4, 37, 1, 51, 31, -1, 2, 39, 0, 30, 638, 45, 615, 39, 0, 30, 629, 6, -1, 6, 31, -1, 2, 39, 0, 30, 638, 36, 4640, 20, 11, 27, 39, 0, 30, 638, 17, 4, 649, 55, 6, -1, 4, 39, 0, 30, 1112, 13, 0, 44, 5, 51, 5, 2, 0, 1, 2, 31, -1, 1, 36, 144, 24, 1, 37, 4, 0, 12, 7, 53, 3, 30, 705, 51, 31, -1, 1, 36, 144, 24, 1, 37, 53, 30, 705, 51, 31, -1, 1, 36, 144, 24, 1, 37, 36, 1732, 8, -21, 37, 4, 0, 12, 7, 30, 736, 36, 468, 4, -2, 4, 0, 36, 592, 8, -21, 4, 0, 36, 1732, 8, -21, 4, 0, 54, 3, 31, -1, 1, 36, 144, 24, 1, 23, 51, 31, -1, 1, 36, 128, 16, -4, 37, 4, 0, 12, 7, 53, 3, 30, 782, 51, 31, -1, 1, 36, 128, 16, -4, 37, 53, 30, 782, 51, 31, -1, 1, 36, 128, 16, -4, 37, 36, 456, 12, -11, 37, 4, 0, 12, 7, 30, 813, 36, 120, 8, -1, 4, 0, 36, 984, 8, -2, 4, 0, 36, 456, 12, -11, 4, 0, 54, 3, 31, -1, 1, 36, 128, 16, -4, 23, 51, 13, 0, 36, 2076, 8, 17, 27, 36, 3132, 4, 8, 37, 1, 31, -1, 1, 36, 1680, 36, -16, 37, 53, 3, 30, 842, 51, 4, 2, 10, 31, -1, 1, 36, 128, 16, -4, 37, 36, 120, 8, -1, 37, 31, -1, 1, 36, 128, 16, -4, 37, 36, 984, 8, -2, 37, 31, -1, 1, 36, 128, 16, -4, 37, 36, 456, 12, -11, 37, 31, -1, 1, 36, 144, 24, 1, 37, 36, 468, 4, -2, 37, 31, -1, 1, 36, 144, 24, 1, 37, 36, 592, 8, -21, 37, 31, -1, 1, 36, 144, 24, 1, 37, 36, 1732, 8, -21, 37, 13, 8, 6, -1, 3, 13, 0, 6, -1, 4, 31, -1, 2, 36, 632, 28, -19, 37, 4, 0, 7, 30, 961, 31, -1, 3, 11, -1, 2, 51, 31, -1, 3, 11, -1, 4, 51, 39, 0, 30, 1091, 4, 0, 6, -1, 5, 4, 0, 6, -1, 7, 31, -1, 7, 4, 6, 42, 30, 1046, 31, -1, 2, 31, -1, 7, 37, 31, -1, 3, 31, -1, 7, 37, 21, 11, -1, 6, 51, 31, -1, 3, 31, -1, 7, 37, 13, 1, 31, -1, 4, 36, 3820, 8, 4, 37, 1, 51, 31, -1, 6, 13, 1, 36, 3136, 8, 11, 27, 36, 2168, 4, 16, 37, 1, 19, -1, 5, 51, 2, -1, 7, 0, 51, 39, 0, 30, 971, 13, 0, 36, 2076, 8, 17, 27, 36, 3132, 4, 8, 37, 1, 13, 1, 31, -1, 4, 36, 3820, 8, 4, 37, 1, 51, 31, -1, 3, 11, -1, 2, 51, 31, -1, 5, 4, 0, 52, 30, 1091, 48, 39, 0, 30, 1111, 36, 3972, 40, -13, 31, -1, 2, 36, 1100, 24, -16, 31, -1, 4, 54, 2, 39, 0, 30, 1111, 17, 4, 1122, 55, 6, -1, 5, 39, 0, 30, 1245, 13, 0, 44, 6, 51, 5, 0, 0, 54, 0, 29, 36, 300, 24, -12, 23, 51, 36, 4428, 24, -16, 36, 1100, 24, -16, 39, 1, 36, 1716, 16, -10, 39, 1, 36, 1384, 28, -17, 39, 1, 36, 4468, 32, -18, 39, 1, 54, 4, 36, 472, 16, -6, 39, 0, 36, 3560, 16, 16, 39, 0, 36, 12, 12, -5, 13, 0, 36, 2076, 8, 17, 27, 36, 3132, 4, 8, 37, 1, 36, 1880, 44, -16, 54, 0, 54, 5, 29, 36, 3308, 8, 0, 23, 51, 29, 13, 1, 29, 36, 4704, 16, 13, 37, 36, 2160, 8, -13, 37, 1, 29, 36, 4704, 16, 13, 23, 51, 36, 4640, 20, 11, 27, 39, 0, 30, 1244, 17, 4, 1255, 55, 6, -1, 6, 39, 0, 30, 1504, 13, 0, 44, 7, 51, 5, 1, 0, 1, 31, 0, 53, 30, 1302, 31, -1, 1, 13, 1, 31, 0, 53, 36, 512, 12, -15, 37, 1, 6, -1, 2, 31, -1, 2, 4, 0, 12, 40, 30, 1302, 31, -1, 2, 39, 0, 30, 1503, 13, 0, 31, -1, 1, 36, 3188, 16, 18, 37, 36, 2452, 16, 11, 37, 1, 6, -1, 3, 31, -1, 1, 36, 2644, 8, 9, 37, 53, 3, 30, 1338, 51, 36, 3576, 0, 6, 6, -1, 4, 31, -1, 1, 36, 4800, 8, -16, 37, 53, 3, 30, 1358, 51, 36, 3576, 0, 6, 6, -1, 5, 31, -1, 1, 36, 3552, 8, 9, 37, 53, 3, 30, 1378, 51, 36, 3576, 0, 6, 6, -1, 6, 31, -1, 1, 36, 336, 32, -18, 37, 53, 3, 30, 1398, 51, 36, 3576, 0, 6, 6, -1, 7, 31, -1, 1, 36, 4452, 16, -5, 37, 53, 3, 30, 1418, 51, 36, 3576, 0, 6, 6, -1, 8, 31, -1, 1, 13, 1, 31, 0, 7, 1, 6, -1, 9, 31, -1, 3, 31, -1, 4, 38, 31, -1, 5, 38, 31, -1, 6, 38, 31, -1, 7, 38, 31, -1, 8, 38, 31, -1, 9, 38, 6, -1, 10, 31, -1, 10, 13, 1, 35, 1, 6, -1, 11, 31, 0, 53, 30, 1496, 31, -1, 11, 31, -1, 1, 13, 2, 31, 0, 53, 36, 3628, 4, -4, 37, 1, 51, 31, -1, 11, 39, 0, 30, 1503, 17, 4, 1514, 55, 6, -1, 7, 39, 0, 30, 1931, 13, 0, 44, 8, 51, 5, 1, 0, 1, 31, -1, 1, 36, 2644, 8, 9, 37, 36, 3576, 0, 6, 40, 30, 1560, 36, 3740, 12, -8, 31, -1, 1, 36, 2644, 8, 9, 37, 38, 36, 2e3, 4, -8, 38, 39, 0, 30, 1930, 31, -1, 1, 36, 3476, 12, -2, 27, 36, 1512, 20, -20, 37, 7, 30, 1584, 36, 3884, 16, -2, 39, 0, 30, 1930, 36, 3576, 0, 6, 6, -1, 2, 4, 0, 6, -1, 3, 31, -1, 1, 36, 3632, 28, 18, 37, 30, 1923, 31, -1, 3, 31, 0, 51, 15, 30, 1619, 39, 0, 30, 1923, 4, 0, 6, -1, 4, 4, 0, 6, -1, 5, 31, -1, 1, 36, 3632, 28, 18, 37, 36, 3332, 28, -15, 37, 36, 632, 28, -19, 37, 6, -1, 6, 31, 0, 52, 31, -1, 6, 13, 2, 36, 3136, 8, 11, 27, 36, 2020, 8, -16, 37, 1, 6, -1, 7, 4, 0, 6, -1, 8, 31, -1, 8, 31, -1, 7, 42, 30, 1758, 31, -1, 1, 36, 3632, 28, 18, 37, 36, 3332, 28, -15, 37, 31, -1, 8, 37, 6, -1, 9, 31, -1, 9, 36, 2372, 12, 0, 37, 31, -1, 1, 36, 2372, 12, 0, 37, 7, 30, 1749, 31, -1, 9, 31, -1, 1, 7, 30, 1744, 31, -1, 4, 4, 1, 38, 11, -1, 5, 51, 2, -1, 4, 0, 51, 2, -1, 8, 0, 51, 39, 0, 30, 1677, 36, 4800, 8, -16, 13, 1, 31, -1, 1, 36, 3028, 24, 4, 37, 1, 53, 30, 1797, 51, 36, 4800, 8, -16, 13, 1, 31, -1, 1, 36, 3144, 24, 4, 37, 1, 36, 3576, 0, 6, 40, 30, 1858, 36, 4700, 4, -9, 13, 0, 31, -1, 1, 36, 2372, 12, 0, 37, 36, 2452, 16, 11, 37, 1, 38, 36, 4868, 16, 11, 38, 36, 4800, 8, -16, 13, 1, 31, -1, 1, 36, 3144, 24, 4, 37, 1, 38, 36, 2e3, 4, -8, 38, 31, -1, 2, 38, 11, -1, 2, 51, 39, 0, 30, 1901, 36, 4700, 4, -9, 13, 0, 31, -1, 1, 36, 2372, 12, 0, 37, 36, 2452, 16, 11, 37, 1, 38, 36, 3624, 4, -4, 38, 31, -1, 5, 38, 36, 24, 4, 8, 38, 31, -1, 2, 38, 11, -1, 2, 51, 31, -1, 1, 36, 3632, 28, 18, 37, 11, -1, 1, 51, 4, 1, 19, -1, 3, 51, 39, 0, 30, 1596, 31, -1, 2, 39, 0, 30, 1930, 17, 4, 1941, 55, 6, -1, 8, 39, 0, 30, 1963, 13, 0, 44, 9, 51, 5, 2, 0, 1, 2, 31, -1, 1, 31, -1, 2, 34, 39, 0, 30, 1962, 17, 4, 1973, 55, 6, -1, 9, 39, 0, 30, 2126, 13, 0, 44, 10, 51, 5, 1, 0, 1, 31, -1, 1, 13, 1, 31, 0, 6, 1, 6, -1, 2, 31, -1, 2, 13, 1, 31, 0, 63, 36, 512, 12, -15, 37, 1, 6, -1, 3, 31, -1, 3, 30, 2023, 31, -1, 3, 39, 0, 30, 2125, 31, -1, 1, 36, 888, 40, -20, 37, 30, 2039, 4, 1, 39, 0, 30, 2041, 4, 0, 31, -1, 1, 36, 2440, 12, -6, 37, 30, 2057, 4, 1, 39, 0, 30, 2059, 4, 0, 31, -1, 1, 36, 3168, 12, -4, 37, 30, 2075, 4, 1, 39, 0, 30, 2077, 4, 0, 31, -1, 1, 13, 1, 31, 0, 11, 1, 31, -1, 1, 13, 1, 31, 0, 10, 1, 13, 5, 6, -1, 4, 31, -1, 4, 31, -1, 2, 13, 2, 31, 0, 63, 36, 3628, 4, -4, 37, 1, 51, 31, -1, 4, 39, 0, 30, 2125, 17, 4, 2136, 55, 6, -1, 10, 39, 0, 30, 2652, 13, 0, 44, 11, 51, 5, 1, 0, 1, 31, -1, 1, 36, 2652, 12, -5, 37, 36, 2140, 8, -4, 37, 30, 2167, 31, 0, 62, 39, 0, 30, 2651, 13, 0, 31, -1, 1, 36, 3188, 16, 18, 37, 36, 2452, 16, 11, 37, 1, 36, 4216, 16, 8, 7, 30, 2197, 31, 0, 56, 39, 0, 30, 2651, 31, -1, 1, 36, 3552, 8, 9, 37, 30, 2227, 13, 0, 31, -1, 1, 36, 3552, 8, 9, 37, 36, 2452, 16, 11, 37, 1, 39, 0, 30, 2231, 36, 3576, 0, 6, 6, -1, 2, 31, -1, 2, 36, 1988, 12, 17, 7, 30, 2255, 31, 0, 54, 39, 0, 30, 2651, 39, 0, 30, 2265, 31, -1, 2, 36, 180, 12, 11, 7, 30, 2276, 31, 0, 55, 39, 0, 30, 2651, 39, 0, 30, 2286, 31, -1, 2, 36, 3180, 8, 11, 7, 30, 2297, 31, 0, 57, 39, 0, 30, 2651, 39, 0, 30, 2307, 31, -1, 2, 36, 296, 4, -1, 7, 30, 2318, 31, 0, 59, 39, 0, 30, 2651, 39, 0, 30, 2328, 31, -1, 2, 36, 224, 4, 13, 7, 30, 2339, 31, 0, 60, 39, 0, 30, 2651, 39, 0, 30, 2349, 31, -1, 2, 36, 2128, 12, 19, 7, 30, 2360, 31, 0, 58, 39, 0, 30, 2651, 39, 0, 30, 2364, 39, 0, 30, 2638, 31, -1, 1, 36, 4800, 8, -16, 37, 53, 3, 30, 2381, 51, 36, 3576, 0, 6, 36, 3232, 4, 19, 38, 31, -1, 1, 36, 2644, 8, 9, 37, 53, 3, 30, 2403, 51, 36, 3576, 0, 6, 38, 36, 3232, 4, 19, 38, 31, -1, 1, 36, 4452, 16, -5, 37, 53, 3, 30, 2426, 51, 36, 3576, 0, 6, 38, 36, 3232, 4, 19, 38, 31, -1, 1, 36, 336, 32, -18, 37, 53, 3, 30, 2449, 51, 36, 3576, 0, 6, 38, 6, -1, 3, 13, 0, 31, -1, 3, 36, 2452, 16, 11, 37, 1, 6, -1, 4, 31, 0, 59, 36, 3280, 8, -6, 13, 2, 31, 0, 55, 36, 180, 12, 11, 13, 2, 31, 0, 54, 36, 1988, 12, 17, 13, 2, 13, 3, 6, -1, 5, 4, 0, 6, -1, 6, 31, -1, 5, 36, 632, 28, -19, 37, 6, -1, 7, 31, -1, 6, 31, -1, 7, 42, 30, 2574, 31, -1, 5, 31, -1, 6, 37, 4, 0, 37, 13, 1, 31, -1, 4, 36, 2984, 12, -7, 37, 1, 4, 1, 10, 40, 30, 2565, 31, -1, 5, 31, -1, 6, 37, 4, 1, 37, 39, 0, 30, 2651, 2, -1, 6, 0, 51, 39, 0, 30, 2515, 31, -1, 3, 13, 1, 36, 4312, 4, 20, 36, 3412, 12, -9, 13, 2, 36, 3080, 12, 16, 27, 41, 36, 2140, 8, -4, 37, 1, 30, 2610, 31, 0, 59, 39, 0, 30, 2651, 31, -1, 2, 36, 2120, 8, 11, 7, 30, 2627, 31, 0, 56, 39, 0, 30, 2630, 31, 0, 61, 39, 0, 30, 2651, 39, 0, 30, 2642, 39, 0, 30, 2364, 36, 4640, 20, 11, 27, 39, 0, 30, 2651, 17, 4, 2662, 55, 6, -1, 11, 39, 0, 30, 2800, 13, 0, 44, 12, 51, 5, 1, 0, 1, 36, 4452, 16, -5, 36, 1772, 8, 13, 36, 4800, 8, -16, 36, 2644, 8, 9, 13, 4, 6, -1, 2, 13, 0, 6, -1, 3, 31, -1, 2, 36, 632, 28, -19, 37, 6, -1, 4, 4, 0, 6, -1, 5, 31, -1, 5, 31, -1, 4, 42, 30, 2792, 31, -1, 2, 31, -1, 5, 37, 6, -1, 6, 31, -1, 6, 13, 1, 31, -1, 1, 36, 3028, 24, 4, 37, 1, 30, 2770, 31, -1, 6, 13, 1, 31, -1, 1, 36, 3144, 24, 4, 37, 1, 13, 1, 35, 1, 39, 0, 30, 2771, 48, 13, 1, 31, -1, 3, 36, 3820, 8, 4, 37, 1, 51, 2, -1, 5, 0, 51, 39, 0, 30, 2713, 31, -1, 3, 39, 0, 30, 2799, 17, 4, 2810, 55, 6, -1, 12, 39, 0, 30, 2930, 13, 0, 44, 13, 51, 5, 1, 0, 1, 31, -1, 1, 36, 1780, 64, -19, 7, 30, 2840, 31, 0, 64, 39, 0, 30, 2929, 39, 0, 30, 2850, 31, -1, 1, 36, 4240, 28, -12, 7, 30, 2861, 31, 0, 65, 39, 0, 30, 2929, 39, 0, 30, 2871, 31, -1, 1, 36, 3112, 20, 10, 7, 30, 2882, 31, 0, 66, 39, 0, 30, 2929, 39, 0, 30, 2892, 31, -1, 1, 36, 1844, 36, -14, 7, 30, 2903, 31, 0, 67, 39, 0, 30, 2929, 39, 0, 30, 2907, 39, 0, 30, 2916, 48, 39, 0, 30, 2929, 39, 0, 30, 2920, 39, 0, 30, 2907, 36, 4640, 20, 11, 27, 39, 0, 30, 2929, 17, 4, 2940, 55, 6, -1, 13, 39, 0, 30, 3060, 13, 0, 44, 14, 51, 5, 1, 0, 1, 31, -1, 1, 36, 1492, 20, 8, 7, 30, 2970, 31, 0, 68, 39, 0, 30, 3059, 39, 0, 30, 2980, 31, -1, 1, 36, 4132, 12, 13, 7, 30, 2991, 31, 0, 69, 39, 0, 30, 3059, 39, 0, 30, 3001, 31, -1, 1, 36, 2252, 64, -22, 7, 30, 3012, 31, 0, 70, 39, 0, 30, 3059, 39, 0, 30, 3022, 31, -1, 1, 36, 3828, 12, -7, 7, 30, 3033, 31, 0, 71, 39, 0, 30, 3059, 39, 0, 30, 3037, 39, 0, 30, 3046, 48, 39, 0, 30, 3059, 39, 0, 30, 3050, 39, 0, 30, 3037, 36, 4640, 20, 11, 27, 39, 0, 30, 3059, 17, 4, 3070, 55, 6, -1, 14, 39, 0, 30, 3148, 13, 0, 44, 15, 51, 5, 1, 0, 1, 31, -1, 1, 36, 4772, 12, 2, 7, 30, 3100, 31, 0, 72, 39, 0, 30, 3147, 39, 0, 30, 3110, 31, -1, 1, 36, 716, 36, -21, 7, 30, 3121, 31, 0, 73, 39, 0, 30, 3147, 39, 0, 30, 3125, 39, 0, 30, 3134, 48, 39, 0, 30, 3147, 39, 0, 30, 3138, 39, 0, 30, 3125, 36, 4640, 20, 11, 27, 39, 0, 30, 3147, 17, 4, 3158, 55, 6, -1, 15, 39, 0, 30, 3190, 13, 0, 44, 16, 51, 5, 1, 0, 1, 31, -1, 1, 36, 168, 12, 12, 7, 30, 3184, 31, 0, 74, 39, 0, 30, 3189, 48, 39, 0, 30, 3189, 17, 4, 3200, 55, 6, -1, 16, 39, 0, 30, 3278, 13, 0, 44, 17, 51, 5, 1, 0, 1, 31, -1, 1, 36, 3052, 8, 3, 7, 30, 3230, 31, 0, 75, 39, 0, 30, 3277, 39, 0, 30, 3240, 31, -1, 1, 36, 3752, 12, -11, 7, 30, 3251, 31, 0, 76, 39, 0, 30, 3277, 39, 0, 30, 3255, 39, 0, 30, 3264, 48, 39, 0, 30, 3277, 39, 0, 30, 3268, 39, 0, 30, 3255, 36, 4640, 20, 11, 27, 39, 0, 30, 3277, 17, 4, 3288, 55, 6, -1, 17, 39, 0, 30, 3408, 13, 0, 44, 18, 51, 5, 1, 0, 1, 31, -1, 1, 36, 3912, 12, 15, 7, 30, 3318, 31, 0, 77, 39, 0, 30, 3407, 39, 0, 30, 3328, 31, -1, 1, 36, 4328, 8, -5, 7, 30, 3339, 31, 0, 78, 39, 0, 30, 3407, 39, 0, 30, 3349, 31, -1, 1, 36, 4268, 44, -13, 7, 30, 3360, 31, 0, 79, 39, 0, 30, 3407, 39, 0, 30, 3370, 31, -1, 1, 36, 4364, 44, -18, 7, 30, 3381, 31, 0, 80, 39, 0, 30, 3407, 39, 0, 30, 3385, 39, 0, 30, 3394, 48, 39, 0, 30, 3407, 39, 0, 30, 3398, 39, 0, 30, 3385, 36, 4640, 20, 11, 27, 39, 0, 30, 3407, 17, 4, 3418, 55, 6, -1, 18, 39, 0, 30, 3517, 13, 0, 44, 19, 51, 5, 1, 0, 1, 31, -1, 1, 36, 664, 20, 4, 7, 30, 3448, 31, 0, 81, 39, 0, 30, 3516, 39, 0, 30, 3458, 31, -1, 1, 36, 3464, 12, -3, 7, 30, 3469, 31, 0, 82, 39, 0, 30, 3516, 39, 0, 30, 3479, 31, -1, 1, 36, 3264, 16, -1, 7, 30, 3490, 31, 0, 83, 39, 0, 30, 3516, 39, 0, 30, 3494, 39, 0, 30, 3503, 48, 39, 0, 30, 3516, 39, 0, 30, 3507, 39, 0, 30, 3494, 36, 4640, 20, 11, 27, 39, 0, 30, 3516, 17, 4, 3527, 55, 6, -1, 19, 39, 0, 30, 3613, 13, 0, 44, 20, 51, 5, 2, 0, 1, 2, 4, 3544, 55, 39, 0, 30, 3608, 13, 0, 44, 21, 6, -1, 0, 5, 2, 1, 2, 3, 4, 3563, 55, 39, 0, 30, 3603, 13, 0, 44, 22, 6, -1, 0, 5, 1, 1, 2, 31, -1, 2, 13, 1, 31, 20, 2, 1, 31, 21, 2, 13, 1, 31, 20, 1, 1, 13, 2, 31, 21, 3, 1, 39, 0, 30, 3602, 17, 39, 0, 30, 3607, 17, 39, 0, 30, 3612, 17, 4, 3623, 55, 6, -1, 20, 39, 0, 30, 3726, 13, 0, 44, 23, 51, 5, 1, 0, 1, 13, 0, 36, 2076, 8, 17, 27, 36, 3132, 4, 8, 37, 1, 31, -1, 1, 36, 3592, 12, 18, 37, 13, 1, 31, 0, 6, 1, 31, -1, 1, 36, 3488, 16, 14, 37, 30, 3681, 31, -1, 1, 36, 3488, 16, 14, 37, 39, 0, 30, 3689, 31, -1, 1, 36, 44, 12, -3, 37, 31, -1, 1, 36, 2172, 12, 15, 37, 30, 3711, 31, -1, 1, 36, 2172, 12, 15, 37, 39, 0, 30, 3719, 31, -1, 1, 36, 4808, 16, 7, 37, 13, 4, 39, 0, 30, 3725, 17, 4, 3736, 55, 6, -1, 21, 39, 0, 30, 3847, 13, 0, 44, 24, 51, 5, 1, 0, 1, 13, 0, 36, 2076, 8, 17, 27, 36, 3132, 4, 8, 37, 1, 31, -1, 1, 36, 3592, 12, 18, 37, 13, 1, 31, 0, 6, 1, 31, -1, 1, 36, 4052, 8, 9, 37, 31, -1, 1, 36, 3488, 16, 14, 37, 30, 3802, 31, -1, 1, 36, 3488, 16, 14, 37, 39, 0, 30, 3810, 31, -1, 1, 36, 44, 12, -3, 37, 31, -1, 1, 36, 2172, 12, 15, 37, 30, 3832, 31, -1, 1, 36, 2172, 12, 15, 37, 39, 0, 30, 3840, 31, -1, 1, 36, 4808, 16, 7, 37, 13, 5, 39, 0, 30, 3846, 17, 4, 3857, 55, 6, -1, 22, 39, 0, 30, 4120, 13, 0, 44, 25, 51, 5, 1, 0, 1, 4, 0, 6, -1, 2, 36, 524, 20, -9, 31, 0, 95, 36, 324, 8, -5, 31, 0, 94, 36, 4072, 36, -16, 31, 0, 93, 36, 0, 12, -3, 31, 0, 92, 54, 4, 6, -1, 3, 36, 192, 12, 20, 31, 0, 100, 36, 2004, 16, 14, 31, 0, 99, 36, 1140, 28, -17, 31, 0, 98, 36, 3424, 20, 7, 31, 0, 97, 36, 660, 4, 16, 31, 0, 96, 54, 5, 6, -1, 4, 31, -1, 3, 13, 1, 36, 1256, 20, -19, 27, 36, 1716, 16, -10, 37, 1, 6, -1, 5, 31, -1, 5, 36, 632, 28, -19, 37, 6, -1, 6, 4, 0, 6, -1, 7, 31, -1, 7, 31, -1, 6, 42, 30, 4036, 31, -1, 5, 31, -1, 7, 37, 6, -1, 8, 31, -1, 1, 31, -1, 8, 37, 30, 4027, 31, -1, 3, 31, -1, 8, 37, 31, -1, 2, 13, 2, 31, 0, 8, 1, 11, -1, 2, 51, 2, -1, 7, 0, 51, 39, 0, 30, 3979, 31, -1, 4, 31, -1, 1, 36, 3856, 4, -1, 37, 37, 30, 4075, 31, -1, 4, 31, -1, 1, 36, 3856, 4, -1, 37, 37, 31, -1, 2, 13, 2, 31, 0, 8, 1, 11, -1, 2, 51, 13, 0, 36, 2076, 8, 17, 27, 36, 3132, 4, 8, 37, 1, 31, -1, 1, 36, 3592, 12, 18, 37, 13, 1, 31, 0, 6, 1, 31, -1, 2, 31, -1, 1, 36, 3796, 16, -8, 37, 13, 4, 39, 0, 30, 4119, 17, 4, 4130, 55, 6, -1, 23, 39, 0, 30, 4472, 13, 0, 44, 26, 51, 5, 1, 0, 1, 13, 0, 6, -1, 2, 47, 4452, 31, -1, 1, 36, 3840, 12, 14, 37, 53, 30, 4174, 51, 31, -1, 1, 36, 3840, 12, 14, 37, 36, 632, 28, -19, 37, 4, 1, 18, 30, 4192, 31, -1, 1, 36, 3840, 12, 14, 37, 11, -1, 3, 51, 39, 0, 30, 4234, 31, -1, 1, 36, 2196, 56, -21, 37, 53, 30, 4220, 51, 31, -1, 1, 36, 2196, 56, -21, 37, 36, 632, 28, -19, 37, 4, 1, 18, 30, 4234, 31, -1, 1, 36, 2196, 56, -21, 37, 11, -1, 3, 51, 31, -1, 3, 30, 4439, 31, -1, 3, 36, 632, 28, -19, 37, 6, -1, 5, 4, 0, 6, -1, 6, 31, -1, 6, 31, -1, 5, 42, 30, 4388, 31, -1, 3, 31, -1, 6, 37, 13, 1, 0, 36, 820, 28, 19, 37, 1, 11, -1, 4, 51, 31, -1, 4, 30, 4379, 31, -1, 3, 31, -1, 6, 37, 36, 772, 24, 14, 37, 13, 1, 31, -1, 2, 36, 3820, 8, 4, 37, 1, 51, 31, -1, 4, 36, 1732, 8, -21, 37, 13, 1, 36, 3136, 8, 11, 27, 36, 2664, 16, 18, 37, 1, 13, 1, 31, -1, 2, 36, 3820, 8, 4, 37, 1, 51, 31, -1, 4, 36, 592, 8, -21, 37, 13, 1, 36, 3136, 8, 11, 27, 36, 2664, 16, 18, 37, 1, 13, 1, 31, -1, 2, 36, 3820, 8, 4, 37, 1, 51, 2, -1, 6, 0, 51, 39, 0, 30, 4255, 31, -1, 1, 36, 3592, 12, 18, 37, 13, 1, 31, 0, 6, 1, 13, 1, 31, -1, 2, 36, 3820, 8, 4, 37, 1, 51, 13, 0, 36, 2076, 8, 17, 27, 36, 3132, 4, 8, 37, 1, 13, 1, 31, -1, 2, 36, 3820, 8, 4, 37, 1, 51, 31, -1, 2, 39, 0, 30, 4471, 45, 4448, 39, 0, 30, 4462, 6, -1, 7, 31, -1, 2, 39, 0, 30, 4471, 36, 4640, 20, 11, 27, 39, 0, 30, 4471, 17, 4, 4482, 55, 6, -1, 24, 39, 0, 30, 4525, 13, 0, 44, 27, 51, 5, 1, 0, 1, 13, 0, 36, 2076, 8, 17, 27, 36, 3132, 4, 8, 37, 1, 31, -1, 1, 36, 3592, 12, 18, 37, 13, 1, 31, 0, 6, 1, 13, 2, 39, 0, 30, 4524, 17, 4, 4535, 55, 6, -1, 25, 39, 0, 30, 4822, 13, 0, 44, 28, 51, 5, 1, 0, 1, 31, -1, 1, 36, 3592, 12, 18, 37, 6, -1, 2, 31, -1, 1, 36, 3552, 8, 9, 37, 36, 3052, 8, 3, 7, 30, 4577, 31, 0, 101, 39, 0, 30, 4580, 31, 0, 102, 6, -1, 3, 31, -1, 2, 36, 1072, 12, 3, 37, 53, 3, 30, 4600, 51, 36, 3576, 0, 6, 6, -1, 4, 36, 2120, 8, 11, 13, 1, 31, -1, 1, 36, 3288, 20, -7, 37, 36, 2064, 12, -1, 37, 1, 6, -1, 5, 4, 0, 6, -1, 6, 31, -1, 3, 31, 0, 102, 7, 30, 4716, 31, -1, 2, 36, 1168, 36, -9, 37, 4, 0, 13, 2, 31, -1, 4, 36, 1556, 8, 18, 37, 1, 31, -1, 5, 38, 31, -1, 2, 36, 564, 28, 17, 37, 13, 1, 31, -1, 4, 36, 1556, 8, 18, 37, 1, 38, 6, -1, 7, 31, -1, 5, 36, 632, 28, -19, 37, 31, -1, 7, 36, 632, 28, -19, 37, 33, 4, 100, 25, 11, -1, 6, 51, 39, 0, 30, 4770, 31, -1, 2, 36, 564, 28, 17, 37, 31, -1, 2, 36, 1168, 36, -9, 37, 13, 2, 31, -1, 4, 36, 1556, 8, 18, 37, 1, 6, -1, 8, 31, -1, 8, 36, 632, 28, -19, 37, 31, -1, 4, 36, 632, 28, -19, 37, 33, 4, 100, 25, 11, -1, 6, 51, 13, 0, 36, 2076, 8, 17, 27, 36, 3132, 4, 8, 37, 1, 31, -1, 2, 13, 1, 31, 0, 6, 1, 31, -1, 3, 31, 0, 102, 7, 30, 4808, 4, 1, 10, 39, 0, 30, 4809, 48, 31, -1, 6, 31, -1, 3, 13, 5, 39, 0, 30, 4821, 17, 4, 4832, 55, 6, -1, 26, 39, 0, 30, 5049, 13, 0, 44, 29, 51, 5, 1, 0, 1, 4, 0, 6, -1, 2, 31, -1, 1, 36, 3592, 12, 18, 37, 36, 3388, 24, -6, 27, 46, 53, 3, 30, 4879, 51, 31, -1, 1, 36, 3592, 12, 18, 37, 36, 1564, 64, -17, 27, 46, 30, 4907, 31, -1, 1, 36, 3592, 12, 18, 37, 36, 1072, 12, 3, 37, 36, 632, 28, -19, 37, 11, -1, 2, 51, 39, 0, 30, 4962, 31, -1, 1, 36, 3592, 12, 18, 37, 36, 1356, 28, 9, 27, 46, 53, 30, 4938, 51, 31, -1, 1, 36, 3592, 12, 18, 37, 36, 4584, 56, -16, 37, 30, 4962, 31, -1, 1, 36, 3592, 12, 18, 37, 36, 1124, 16, -5, 37, 36, 632, 28, -19, 37, 11, -1, 2, 51, 31, -1, 1, 36, 3872, 12, -22, 37, 30, 4989, 31, -1, 1, 36, 3872, 12, -22, 37, 36, 632, 28, -19, 37, 39, 0, 30, 4992, 4, 1, 10, 6, -1, 3, 13, 0, 36, 2076, 8, 17, 27, 36, 3132, 4, 8, 37, 1, 31, -1, 1, 36, 3592, 12, 18, 37, 13, 1, 31, 0, 6, 1, 31, -1, 1, 36, 3592, 12, 18, 37, 13, 1, 31, 0, 9, 1, 31, -1, 3, 31, -1, 2, 13, 5, 39, 0, 30, 5048, 17, 4, 5059, 55, 6, -1, 27, 39, 0, 30, 5311, 13, 0, 44, 30, 51, 5, 1, 0, 1, 31, -1, 1, 36, 3552, 8, 9, 37, 36, 3264, 16, -1, 7, 53, 30, 5093, 51, 31, -1, 1, 36, 2592, 52, -12, 37, 30, 5228, 13, 0, 31, -1, 1, 36, 2592, 52, -12, 37, 1, 6, -1, 2, 13, 0, 4, 5118, 55, 39, 0, 30, 5203, 13, 0, 44, 31, 6, -1, 0, 5, 1, 1, 2, 13, 0, 36, 2076, 8, 17, 27, 36, 3132, 4, 8, 37, 1, 31, -1, 2, 36, 3592, 12, 18, 37, 13, 1, 31, 0, 6, 1, 31, -1, 2, 36, 600, 28, -11, 37, 31, -1, 2, 36, 252, 24, -12, 37, 31, -1, 2, 36, 992, 20, 10, 37, 31, -1, 2, 36, 44, 12, -3, 37, 31, -1, 2, 36, 4808, 16, 7, 37, 13, 7, 39, 0, 30, 5202, 17, 13, 1, 31, -1, 2, 36, 4580, 4, -5, 37, 1, 36, 976, 8, 20, 37, 1, 39, 0, 30, 5310, 39, 0, 30, 5301, 13, 0, 36, 2076, 8, 17, 27, 36, 3132, 4, 8, 37, 1, 31, -1, 1, 36, 3592, 12, 18, 37, 13, 1, 31, 0, 6, 1, 31, -1, 1, 36, 600, 28, -11, 37, 31, -1, 1, 36, 252, 24, -12, 37, 31, -1, 1, 36, 992, 20, 10, 37, 31, -1, 1, 36, 44, 12, -3, 37, 31, -1, 1, 36, 4808, 16, 7, 37, 13, 7, 39, 0, 30, 5310, 36, 4640, 20, 11, 27, 39, 0, 30, 5310, 17, 4, 5321, 55, 6, -1, 28, 39, 0, 30, 5554, 13, 0, 44, 32, 51, 5, 0, 0, 54, 0, 29, 36, 300, 24, -12, 23, 51, 36, 12, 12, -5, 13, 0, 36, 2076, 8, 17, 27, 36, 3132, 4, 8, 37, 1, 36, 3060, 20, -6, 4, 0, 36, 3244, 20, -11, 54, 0, 36, 28, 8, 15, 54, 0, 36, 1880, 44, -16, 54, 0, 36, 472, 16, -6, 39, 0, 36, 3560, 16, 16, 39, 0, 54, 7, 29, 36, 3308, 8, 0, 23, 51, 54, 0, 29, 36, 3308, 8, 0, 37, 36, 4428, 24, -16, 23, 51, 39, 1, 29, 36, 3308, 8, 0, 37, 36, 4428, 24, -16, 37, 31, 0, 105, 23, 51, 39, 1, 29, 36, 3308, 8, 0, 37, 36, 4428, 24, -16, 37, 31, 0, 106, 23, 51, 39, 1, 29, 36, 3308, 8, 0, 37, 36, 4428, 24, -16, 37, 31, 0, 107, 23, 51, 39, 1, 29, 36, 3308, 8, 0, 37, 36, 4428, 24, -16, 37, 31, 0, 108, 23, 51, 39, 1, 29, 36, 3308, 8, 0, 37, 36, 4428, 24, -16, 37, 31, 0, 109, 23, 51, 39, 1, 29, 36, 3308, 8, 0, 37, 36, 4428, 24, -16, 37, 31, 0, 110, 23, 51, 29, 13, 1, 29, 36, 4704, 16, 13, 37, 36, 2160, 8, -13, 37, 1, 29, 36, 4704, 16, 13, 23, 51, 36, 4640, 20, 11, 27, 39, 0, 30, 5553, 17, 4, 5564, 55, 6, -1, 29, 39, 0, 30, 5613, 13, 0, 44, 33, 51, 5, 0, 0, 47, 5595, 13, 0, 31, 0, 50, 36, 2064, 12, -1, 37, 1, 39, 0, 30, 5612, 45, 5591, 39, 0, 30, 5603, 6, -1, 1, 48, 39, 0, 30, 5612, 36, 4640, 20, 11, 27, 39, 0, 30, 5612, 17, 4, 5623, 55, 6, -1, 30, 39, 0, 30, 5672, 13, 0, 44, 34, 51, 5, 0, 0, 47, 5654, 13, 0, 31, 0, 111, 36, 2064, 12, -1, 37, 1, 39, 0, 30, 5671, 45, 5650, 39, 0, 30, 5662, 6, -1, 1, 48, 39, 0, 30, 5671, 36, 4640, 20, 11, 27, 39, 0, 30, 5671, 17, 4, 5682, 55, 6, -1, 31, 39, 0, 30, 5735, 13, 0, 44, 35, 51, 5, 0, 0, 47, 5717, 36, 3476, 12, -2, 27, 36, 3796, 16, -8, 37, 36, 764, 8, 5, 37, 39, 0, 30, 5734, 45, 5713, 39, 0, 30, 5725, 6, -1, 1, 48, 39, 0, 30, 5734, 36, 4640, 20, 11, 27, 39, 0, 30, 5734, 17, 4, 5745, 55, 6, -1, 32, 39, 0, 30, 5798, 13, 0, 44, 36, 51, 5, 0, 0, 47, 5780, 36, 228, 24, -9, 27, 36, 3796, 16, -8, 37, 36, 764, 8, 5, 37, 39, 0, 30, 5797, 45, 5776, 39, 0, 30, 5788, 6, -1, 1, 48, 39, 0, 30, 5797, 36, 4640, 20, 11, 27, 39, 0, 30, 5797, 17, 4, 5808, 55, 6, -1, 33, 39, 0, 30, 5901, 13, 0, 44, 37, 51, 5, 0, 0, 47, 5883, 36, 4028, 24, 9, 13, 1, 36, 4668, 24, 7, 27, 36, 1204, 28, 16, 37, 1, 6, -1, 1, 31, -1, 1, 36, 632, 28, -19, 37, 4, 0, 15, 30, 5870, 31, -1, 1, 4, 0, 37, 36, 1628, 12, -1, 37, 39, 0, 30, 5900, 39, 0, 30, 5877, 4, 1, 10, 39, 0, 30, 5900, 45, 5879, 39, 0, 30, 5891, 6, -1, 2, 48, 39, 0, 30, 5900, 36, 4640, 20, 11, 27, 39, 0, 30, 5900, 17, 4, 5911, 55, 6, -1, 34, 39, 0, 30, 6121, 13, 0, 44, 38, 51, 5, 1, 0, 1, 47, 6108, 31, -1, 1, 36, 3872, 12, -22, 37, 6, -1, 2, 31, -1, 2, 4, 0, 12, 40, 53, 30, 5956, 51, 31, -1, 2, 36, 3620, 4, -2, 37, 4, 0, 12, 40, 30, 6102, 31, -1, 2, 36, 3620, 4, -2, 37, 36, 2468, 4, -6, 7, 30, 6010, 31, -1, 1, 36, 4204, 12, -9, 37, 31, -1, 1, 36, 280, 16, 5, 37, 13, 2, 13, 1, 31, 0, 114, 4, 0, 37, 36, 3820, 8, 4, 37, 1, 51, 39, 0, 30, 6102, 31, -1, 2, 36, 3620, 4, -2, 37, 36, 4152, 8, 18, 7, 30, 6054, 31, -1, 1, 36, 4204, 12, -9, 37, 31, -1, 1, 36, 280, 16, 5, 37, 13, 2, 31, 0, 114, 4, 1, 23, 51, 39, 0, 30, 6102, 31, -1, 2, 36, 3620, 4, -2, 37, 36, 3860, 4, -17, 7, 30, 6102, 31, -1, 2, 36, 2468, 4, -6, 37, 31, -1, 2, 36, 1532, 4, -7, 37, 13, 2, 13, 1, 31, 0, 114, 4, 2, 37, 36, 3820, 8, 4, 37, 1, 51, 45, 6104, 39, 0, 30, 6111, 6, -1, 3, 36, 4640, 20, 11, 27, 39, 0, 30, 6120, 17, 4, 6131, 55, 6, -1, 35, 39, 0, 30, 6294, 13, 0, 44, 39, 51, 5, 2, 0, 1, 2, 47, 6281, 31, -1, 1, 36, 3872, 12, -22, 37, 6, -1, 3, 31, -1, 3, 4, 0, 12, 40, 53, 30, 6177, 51, 31, -1, 3, 36, 3620, 4, -2, 37, 4, 0, 12, 40, 30, 6275, 31, -1, 3, 36, 3620, 4, -2, 37, 36, 3108, 4, 12, 7, 30, 6275, 13, 0, 31, 0, 36, 1, 51, 36, 1488, 4, -10, 36, 2468, 4, -6, 31, 0, 112, 13, 1, 36, 4144, 8, -22, 27, 36, 4784, 12, 2, 37, 1, 13, 1, 31, 0, 37, 1, 36, 1532, 4, -7, 31, -1, 2, 36, 3620, 4, -2, 36, 3860, 4, -17, 36, 280, 16, 5, 36, 2996, 32, -20, 54, 4, 13, 2, 36, 228, 24, -9, 27, 36, 4884, 28, -16, 37, 36, 1924, 64, -22, 37, 1, 51, 45, 6277, 39, 0, 30, 6284, 6, -1, 4, 36, 4640, 20, 11, 27, 39, 0, 30, 6293, 17, 4, 6304, 55, 6, -1, 36, 39, 0, 30, 6383, 13, 0, 44, 40, 51, 5, 0, 0, 4, 0, 6, -1, 1, 31, -1, 1, 31, 0, 113, 36, 632, 28, -19, 37, 42, 30, 6373, 31, 0, 113, 31, -1, 1, 37, 9, 36, 3204, 20, 18, 7, 30, 6364, 13, 0, 31, 0, 113, 31, -1, 1, 37, 1, 31, 0, 112, 31, -1, 1, 23, 51, 2, -1, 1, 0, 51, 39, 0, 30, 6317, 36, 4640, 20, 11, 27, 39, 0, 30, 6382, 17, 4, 6393, 55, 6, -1, 37, 39, 0, 30, 6410, 13, 0, 44, 41, 51, 5, 1, 0, 1, 31, -1, 1, 39, 0, 30, 6409, 17, 4, 6420, 55, 6, -1, 38, 39, 0, 30, 6953, 13, 0, 44, 42, 51, 5, 0, 0, 47, 6893, 13, 0, 31, 0, 36, 1, 51, 4, 0, 6, -1, 1, 31, -1, 1, 31, 0, 114, 4, 0, 37, 36, 632, 28, -19, 37, 42, 30, 6521, 31, 0, 114, 4, 0, 37, 31, -1, 1, 37, 4, 1, 37, 36, 3620, 4, -2, 36, 3108, 4, 12, 36, 280, 16, 5, 36, 2996, 32, -20, 54, 2, 13, 2, 31, 0, 114, 4, 0, 37, 31, -1, 1, 37, 4, 0, 37, 36, 1924, 64, -22, 37, 1, 51, 2, -1, 1, 0, 51, 39, 0, 30, 6442, 31, 0, 112, 13, 1, 36, 4144, 8, -22, 27, 36, 4784, 12, 2, 37, 1, 13, 1, 31, 0, 37, 1, 4, 0, 13, 2, 13, 1, 31, 0, 114, 4, 2, 37, 36, 3820, 8, 4, 37, 1, 51, 4, 6569, 55, 39, 0, 30, 6875, 13, 0, 44, 43, 6, -1, 0, 5, 1, 1, 2, 4, 6590, 55, 6, -1, 3, 39, 0, 30, 6856, 13, 0, 44, 44, 51, 5, 1, 0, 1, 31, 0, 114, 4, 1, 37, 6, -1, 2, 31, 0, 114, 4, 2, 37, 6, -1, 3, 31, -1, 2, 4, 0, 12, 7, 53, 3, 30, 6636, 51, 31, -1, 3, 4, 0, 12, 7, 53, 3, 30, 6652, 51, 31, -1, 3, 36, 632, 28, -19, 37, 4, 3, 42, 53, 30, 6662, 51, 31, -1, 1, 4, 30, 42, 30, 6734, 31, -1, 1, 4, 10, 42, 30, 6678, 4, 1, 39, 0, 30, 6680, 4, 3, 6, -1, 4, 31, -1, 4, 4, 6693, 55, 39, 0, 30, 6721, 13, 0, 44, 45, 6, -1, 0, 5, 0, 1, 31, 44, 1, 31, 44, 4, 38, 13, 1, 31, 43, 3, 1, 39, 0, 30, 6720, 17, 13, 2, 36, 2384, 56, -20, 27, 1, 51, 39, 0, 30, 6846, 31, -1, 2, 4, 0, 12, 40, 53, 30, 6756, 51, 31, -1, 2, 36, 632, 28, -19, 37, 4, 2, 7, 30, 6823, 36, 4416, 4, 19, 31, -1, 3, 13, 1, 36, 4144, 8, -22, 27, 36, 4784, 12, 2, 37, 1, 36, 3620, 4, -2, 36, 488, 4, -1, 36, 280, 16, 5, 36, 2996, 32, -20, 54, 3, 6, -1, 5, 31, -1, 2, 4, 1, 37, 31, -1, 5, 13, 2, 31, -1, 2, 4, 0, 37, 36, 1924, 64, -22, 37, 1, 51, 13, 0, 31, 0, 114, 4, 2, 23, 51, 4, 0, 31, 43, 2, 13, 2, 36, 2384, 56, -20, 27, 1, 51, 36, 4640, 20, 11, 27, 39, 0, 30, 6855, 17, 4, 0, 13, 1, 31, -1, 3, 1, 51, 36, 4640, 20, 11, 27, 39, 0, 30, 6874, 17, 13, 1, 36, 2184, 12, -6, 27, 41, 39, 0, 30, 6952, 45, 6889, 39, 0, 30, 6943, 6, -1, 2, 4, 6903, 55, 39, 0, 30, 6931, 13, 0, 44, 46, 6, -1, 0, 5, 1, 1, 2, 13, 0, 31, -1, 2, 1, 51, 36, 4640, 20, 11, 27, 39, 0, 30, 6930, 17, 13, 1, 36, 2184, 12, -6, 27, 41, 39, 0, 30, 6952, 36, 4640, 20, 11, 27, 39, 0, 30, 6952, 17, 4, 6963, 55, 6, -1, 39, 39, 0, 30, 7164, 13, 0, 44, 47, 51, 5, 1, 0, 1, 31, -1, 1, 4, 0, 7, 30, 7005, 31, 0, 34, 36, 4316, 12, 12, 13, 2, 36, 228, 24, -9, 27, 36, 384, 72, -19, 37, 1, 51, 39, 0, 30, 7154, 4, 7012, 55, 39, 0, 30, 7046, 13, 0, 44, 48, 6, -1, 0, 5, 1, 1, 2, 31, 47, 1, 31, -1, 2, 13, 2, 31, 0, 35, 1, 51, 36, 4640, 20, 11, 27, 39, 0, 30, 7045, 17, 36, 4316, 12, 12, 13, 2, 36, 228, 24, -9, 27, 36, 384, 72, -19, 37, 1, 51, 36, 1488, 4, -10, 36, 3620, 4, -2, 36, 2468, 4, -6, 36, 280, 16, 5, 36, 2996, 32, -20, 54, 2, 13, 2, 36, 228, 24, -9, 27, 36, 4884, 28, -16, 37, 36, 1924, 64, -22, 37, 1, 51, 31, -1, 1, 4, 2, 7, 30, 7154, 36, 1488, 4, -10, 36, 3620, 4, -2, 36, 4152, 8, 18, 36, 280, 16, 5, 36, 2996, 32, -20, 54, 2, 13, 2, 36, 228, 24, -9, 27, 36, 4884, 28, -16, 37, 36, 1924, 64, -22, 37, 1, 51, 36, 4640, 20, 11, 27, 39, 0, 30, 7163, 17, 36, 4060, 12, 19, 36, 848, 20, 9, 4, 181, 36, 204, 20, 18, 4, 180, 54, 2, 36, 3928, 28, -16, 36, 3812, 8, 9, 4, 174, 36, 36, 8, 0, 4, 173, 36, 3236, 8, -16, 4, 172, 36, 628, 4, -19, 4, 171, 36, 4848, 8, -19, 4, 170, 54, 5, 36, 1476, 12, 12, 36, 3604, 16, 18, 4, 165, 36, 3360, 28, 3, 4, 164, 36, 3224, 8, 2, 4, 162, 36, 4552, 28, 17, 4, 161, 36, 3672, 16, -17, 4, 160, 54, 5, 36, 3688, 12, 2, 36, 4408, 8, -10, 4, 152, 36, 2508, 8, -9, 4, 151, 36, 2972, 8, 20, 4, 150, 54, 3, 36, 4160, 8, -6, 36, 692, 4, 8, 4, 140, 54, 1, 36, 76, 20, 22, 36, 4856, 12, -21, 4, 131, 36, 684, 8, -18, 4, 130, 54, 2, 36, 2472, 8, -19, 36, 332, 4, -5, 4, 121, 36, 4692, 8, 13, 4, 120, 54, 2, 36, 1548, 8, 0, 36, 4856, 12, -21, 4, 113, 36, 684, 8, -18, 4, 112, 36, 332, 4, -5, 4, 111, 36, 4692, 8, 13, 4, 110, 54, 4, 36, 1232, 12, -17, 36, 684, 8, -18, 4, 102, 36, 3924, 4, -7, 4, 101, 36, 2516, 8, -15, 4, 100, 54, 3, 54, 9, 6, -1, 40, 36, 3092, 12, -21, 31, -1, 40, 36, 4060, 12, 19, 37, 36, 848, 20, 9, 37, 36, 2980, 4, 11, 31, -1, 40, 36, 4060, 12, 19, 37, 36, 204, 20, 18, 37, 36, 868, 20, -21, 31, -1, 40, 36, 3928, 28, -16, 37, 36, 3812, 8, 9, 37, 36, 3900, 12, 16, 31, -1, 40, 36, 3928, 28, -16, 37, 36, 36, 8, 0, 37, 36, 4764, 8, 0, 31, -1, 40, 36, 3928, 28, -16, 37, 36, 3236, 8, -16, 37, 36, 2048, 16, -16, 31, -1, 40, 36, 3928, 28, -16, 37, 36, 628, 4, -19, 37, 36, 2480, 12, -14, 31, -1, 40, 36, 3928, 28, -16, 37, 36, 4848, 8, -19, 37, 36, 3104, 4, 11, 31, -1, 40, 36, 4160, 8, -6, 37, 36, 692, 4, 8, 37, 36, 3864, 8, -5, 31, -1, 40, 36, 1476, 12, 12, 37, 36, 3604, 16, 18, 37, 36, 4660, 8, 21, 31, -1, 40, 36, 1476, 12, 12, 37, 36, 3360, 28, 3, 37, 36, 4912, 4, -4, 31, -1, 40, 36, 1476, 12, 12, 37, 36, 96, 24, 20, 37, 36, 2028, 4, -5, 31, -1, 40, 36, 1476, 12, 12, 37, 36, 3224, 8, 2, 37, 36, 3852, 4, -8, 31, -1, 40, 36, 1476, 12, 12, 37, 36, 4552, 28, 17, 37, 36, 1244, 12, 20, 31, -1, 40, 36, 3688, 12, 2, 37, 36, 4408, 8, -10, 37, 36, 2552, 8, 5, 31, -1, 40, 36, 3688, 12, 2, 37, 36, 2508, 8, -9, 37, 36, 4796, 4, -2, 31, -1, 40, 36, 3688, 12, 2, 37, 36, 2972, 8, 20, 37, 54, 16, 6, -1, 41, 36, 3112, 20, 10, 31, -1, 40, 36, 1232, 12, -17, 37, 36, 684, 8, -18, 37, 36, 4240, 28, -12, 31, -1, 40, 36, 1232, 12, -17, 37, 36, 3924, 4, -7, 37, 36, 1780, 64, -19, 31, -1, 40, 36, 1232, 12, -17, 37, 36, 2516, 8, -15, 37, 54, 3, 6, -1, 42, 36, 2252, 64, -22, 31, -1, 40, 36, 1548, 8, 0, 37, 36, 684, 8, -18, 37, 36, 4132, 12, 13, 31, -1, 40, 36, 1548, 8, 0, 37, 36, 332, 4, -5, 37, 36, 1492, 20, 8, 31, -1, 40, 36, 1548, 8, 0, 37, 36, 4692, 8, 13, 37, 54, 3, 6, -1, 43, 36, 3264, 16, -1, 31, -1, 40, 36, 76, 20, 22, 37, 36, 684, 8, -18, 37, 54, 1, 6, -1, 44, 36, 716, 36, -21, 31, -1, 40, 36, 2472, 8, -19, 37, 36, 332, 4, -5, 37, 36, 4772, 12, 2, 31, -1, 40, 36, 2472, 8, -19, 37, 36, 4692, 8, 13, 37, 54, 2, 6, -1, 45, 36, 4012, 16, -1, 31, -1, 40, 36, 1476, 12, 12, 37, 36, 3672, 16, -17, 37, 54, 1, 6, -1, 46, 36, 544, 20, -5, 4, 7868, 55, 39, 0, 30, 7908, 13, 0, 44, 49, 6, -1, 0, 5, 1, 1, 2, 31, -1, 2, 31, 0, 41, 8, 3, 30, 7896, 31, -1, 2, 39, 0, 30, 7907, 31, 0, 41, 31, -1, 2, 37, 39, 0, 30, 7907, 17, 36, 964, 12, 13, 4, 7919, 55, 39, 0, 30, 8048, 13, 0, 44, 50, 6, -1, 0, 5, 2, 1, 2, 3, 31, 0, 46, 31, -1, 2, 37, 6, -1, 4, 48, 6, -1, 5, 13, 0, 6, -1, 6, 4, 7957, 55, 39, 0, 30, 8043, 13, 0, 44, 51, 6, -1, 0, 5, 1, 1, 2, 31, 50, 6, 31, -1, 2, 13, 2, 31, 0, 4, 1, 11, 50, 5, 51, 31, 50, 5, 48, 7, 30, 7996, 28, 39, 0, 30, 8042, 31, 50, 5, 36, 3972, 40, -13, 37, 11, 50, 6, 51, 31, 50, 5, 36, 1100, 24, -16, 37, 11, 50, 5, 51, 31, 50, 5, 31, 50, 4, 13, 2, 31, 50, 3, 1, 51, 36, 4640, 20, 11, 27, 39, 0, 30, 8042, 17, 39, 0, 30, 8047, 17, 36, 4824, 12, 4, 4, 8059, 55, 39, 0, 30, 8144, 13, 0, 44, 52, 6, -1, 0, 5, 2, 1, 2, 3, 31, 0, 45, 31, -1, 2, 37, 6, -1, 4, 48, 6, -1, 5, 4, 8092, 55, 39, 0, 30, 8139, 13, 0, 44, 53, 6, -1, 0, 5, 1, 1, 2, 31, -1, 2, 13, 1, 31, 0, 2, 1, 11, 52, 5, 51, 31, 52, 5, 31, 52, 4, 13, 2, 31, 52, 3, 1, 51, 36, 4640, 20, 11, 27, 39, 0, 30, 8138, 17, 39, 0, 30, 8143, 17, 36, 1384, 28, -17, 4, 8155, 55, 39, 0, 30, 8240, 13, 0, 44, 54, 6, -1, 0, 5, 2, 1, 2, 3, 31, 0, 42, 31, -1, 2, 37, 6, -1, 4, 48, 6, -1, 5, 4, 8188, 55, 39, 0, 30, 8235, 13, 0, 44, 55, 6, -1, 0, 5, 1, 1, 2, 31, -1, 2, 13, 1, 31, 0, 3, 1, 11, 54, 5, 51, 31, 54, 5, 31, 54, 4, 13, 2, 31, 54, 3, 1, 51, 36, 4640, 20, 11, 27, 39, 0, 30, 8234, 17, 39, 0, 30, 8239, 17, 36, 3264, 16, -1, 4, 8251, 55, 39, 0, 30, 8368, 13, 0, 44, 56, 6, -1, 0, 5, 2, 1, 2, 3, 31, 0, 44, 31, -1, 2, 37, 6, -1, 4, 48, 6, -1, 5, 4, 8284, 55, 39, 0, 30, 8363, 13, 0, 44, 57, 6, -1, 0, 5, 1, 1, 2, 31, -1, 2, 13, 1, 31, 0, 1, 1, 11, 56, 5, 51, 4, 0, 6, -1, 3, 31, -1, 3, 31, 56, 5, 36, 632, 28, -19, 37, 42, 30, 8353, 31, 56, 5, 31, -1, 3, 37, 31, 56, 4, 13, 2, 31, 56, 3, 1, 51, 2, -1, 3, 0, 51, 39, 0, 30, 8313, 36, 4640, 20, 11, 27, 39, 0, 30, 8362, 17, 39, 0, 30, 8367, 17, 36, 4468, 32, -18, 4, 8379, 55, 39, 0, 30, 8464, 13, 0, 44, 58, 6, -1, 0, 5, 2, 1, 2, 3, 31, 0, 43, 31, -1, 2, 37, 6, -1, 4, 48, 6, -1, 5, 4, 8412, 55, 39, 0, 30, 8459, 13, 0, 44, 59, 6, -1, 0, 5, 1, 1, 2, 31, -1, 2, 13, 1, 31, 0, 0, 1, 11, 58, 5, 51, 31, 58, 5, 31, 58, 4, 13, 2, 31, 58, 3, 1, 51, 36, 4640, 20, 11, 27, 39, 0, 30, 8458, 17, 39, 0, 30, 8463, 17, 54, 6, 6, -1, 47, 4, 16, 6, -1, 48, 4, 15, 4, 1e3, 25, 6, -1, 49, 4, 8489, 55, 39, 0, 30, 9248, 13, 0, 44, 60, 6, -1, 0, 5, 1, 1, 2, 31, -1, 2, 53, 3, 30, 8510, 51, 54, 0, 11, -1, 2, 51, 36, 1100, 24, -16, 31, -1, 2, 36, 964, 12, 13, 37, 39, 0, 40, 36, 1384, 28, -17, 31, -1, 2, 36, 1384, 28, -17, 37, 39, 0, 40, 36, 1716, 16, -10, 31, -1, 2, 36, 1716, 16, -10, 37, 39, 0, 40, 36, 2316, 12, 8, 31, -1, 2, 36, 2316, 12, 8, 37, 39, 0, 40, 54, 4, 29, 36, 3308, 8, 0, 37, 36, 4428, 24, -16, 23, 51, 13, 0, 36, 2076, 8, 17, 27, 36, 3132, 4, 8, 37, 1, 29, 36, 3308, 8, 0, 37, 36, 1016, 24, -10, 23, 51, 29, 36, 3308, 8, 0, 37, 36, 1016, 24, -10, 37, 29, 36, 300, 24, -12, 37, 36, 4796, 4, -2, 13, 1, 31, 0, 47, 36, 544, 20, -5, 37, 1, 23, 51, 29, 36, 3308, 8, 0, 37, 36, 472, 16, -6, 37, 39, 0, 7, 30, 9224, 36, 3476, 12, -2, 27, 36, 1512, 20, -20, 37, 13, 1, 14, 41, 6, -1, 3, 29, 36, 3308, 8, 0, 37, 36, 4428, 24, -16, 37, 36, 2316, 12, 8, 37, 30, 8854, 39, 1, 29, 36, 4704, 16, 13, 37, 36, 1492, 20, 8, 13, 2, 31, 0, 47, 36, 4468, 32, -18, 37, 1, 36, 1492, 20, 8, 13, 3, 31, -1, 3, 36, 384, 72, -19, 37, 1, 51, 39, 1, 29, 36, 4704, 16, 13, 37, 36, 2252, 64, -22, 13, 2, 31, 0, 47, 36, 4468, 32, -18, 37, 1, 36, 2252, 64, -22, 13, 3, 31, -1, 3, 36, 384, 72, -19, 37, 1, 51, 39, 1, 29, 36, 4704, 16, 13, 37, 36, 4132, 12, 13, 13, 2, 31, 0, 47, 36, 4468, 32, -18, 37, 1, 36, 4132, 12, 13, 13, 3, 31, -1, 3, 36, 384, 72, -19, 37, 1, 51, 39, 1, 29, 36, 4704, 16, 13, 37, 36, 3264, 16, -1, 13, 2, 31, 0, 47, 36, 3264, 16, -1, 37, 1, 36, 3264, 16, -1, 13, 3, 31, -1, 3, 36, 384, 72, -19, 37, 1, 51, 29, 36, 3308, 8, 0, 37, 36, 4428, 24, -16, 37, 36, 1716, 16, -10, 37, 39, 1, 7, 30, 8953, 39, 1, 29, 36, 4704, 16, 13, 37, 36, 716, 36, -21, 13, 2, 31, 0, 47, 36, 4824, 12, 4, 37, 1, 36, 716, 36, -21, 13, 3, 31, -1, 3, 36, 384, 72, -19, 37, 1, 51, 39, 1, 29, 36, 4704, 16, 13, 37, 36, 4772, 12, 2, 13, 2, 31, 0, 47, 36, 4824, 12, 4, 37, 1, 36, 4772, 12, 2, 13, 3, 31, -1, 3, 36, 384, 72, -19, 37, 1, 51, 29, 36, 3308, 8, 0, 37, 36, 4428, 24, -16, 37, 36, 1384, 28, -17, 37, 53, 30, 9004, 51, 36, 3476, 12, -2, 27, 36, 1512, 20, -20, 37, 36, 1780, 64, -19, 13, 2, 43, 36, 4720, 44, -21, 37, 36, 796, 24, 22, 37, 1, 39, 1, 7, 30, 9123, 39, 1, 29, 36, 4704, 16, 13, 37, 36, 1780, 64, -19, 13, 2, 31, 0, 47, 36, 1384, 28, -17, 37, 1, 36, 1780, 64, -19, 13, 3, 31, -1, 3, 36, 384, 72, -19, 37, 1, 51, 39, 1, 29, 36, 4704, 16, 13, 37, 36, 3112, 20, 10, 13, 2, 31, 0, 47, 36, 1384, 28, -17, 37, 1, 36, 3112, 20, 10, 13, 3, 31, -1, 3, 36, 384, 72, -19, 37, 1, 51, 39, 1, 29, 36, 4704, 16, 13, 37, 36, 4240, 28, -12, 13, 2, 31, 0, 47, 36, 1384, 28, -17, 37, 1, 36, 4240, 28, -12, 13, 3, 31, -1, 3, 36, 384, 72, -19, 37, 1, 51, 29, 36, 3308, 8, 0, 37, 36, 4428, 24, -16, 37, 36, 1100, 24, -16, 37, 53, 30, 9169, 51, 36, 228, 24, -9, 27, 36, 4012, 16, -1, 13, 2, 43, 36, 4720, 44, -21, 37, 36, 796, 24, 22, 37, 1, 39, 1, 7, 30, 9210, 39, 1, 29, 36, 4704, 16, 13, 37, 36, 4012, 16, -1, 13, 2, 31, 0, 47, 36, 964, 12, 13, 37, 1, 36, 4012, 16, -1, 13, 3, 31, -1, 3, 36, 384, 72, -19, 37, 1, 51, 39, 1, 29, 36, 3308, 8, 0, 37, 36, 472, 16, -6, 23, 51, 39, 1, 29, 36, 3308, 8, 0, 37, 36, 3560, 16, 16, 23, 51, 36, 4640, 20, 11, 27, 39, 0, 30, 9247, 17, 31, -1, 5, 36, 492, 20, 15, 37, 36, 4428, 24, -16, 23, 51, 4, 9269, 55, 39, 0, 30, 9303, 13, 0, 44, 61, 6, -1, 0, 5, 0, 1, 39, 0, 29, 36, 3308, 8, 0, 37, 36, 3560, 16, 16, 23, 51, 36, 4640, 20, 11, 27, 39, 0, 30, 9302, 17, 31, -1, 5, 36, 492, 20, 15, 37, 36, 4420, 8, 11, 23, 51, 4, 9324, 55, 39, 0, 30, 9350, 13, 0, 44, 62, 6, -1, 0, 5, 0, 1, 29, 36, 3308, 8, 0, 37, 36, 12, 12, -5, 37, 39, 0, 30, 9349, 17, 31, -1, 5, 36, 492, 20, 15, 37, 36, 4916, 24, -20, 23, 51, 4, 9371, 55, 39, 0, 30, 9623, 13, 0, 44, 63, 6, -1, 0, 5, 0, 1, 29, 36, 3308, 8, 0, 37, 36, 1880, 44, -16, 37, 13, 1, 36, 1256, 20, -19, 27, 36, 1716, 16, -10, 37, 1, 6, -1, 2, 31, -1, 2, 36, 632, 28, -19, 37, 6, -1, 3, 4, 0, 6, -1, 4, 31, -1, 4, 31, -1, 3, 42, 30, 9612, 31, -1, 2, 31, -1, 4, 37, 6, -1, 5, 13, 0, 29, 36, 3308, 8, 0, 37, 36, 1880, 44, -16, 37, 31, -1, 5, 37, 36, 2064, 12, -1, 37, 1, 29, 36, 300, 24, -12, 37, 31, -1, 5, 23, 51, 31, -1, 5, 31, 0, 40, 36, 1548, 8, 0, 37, 36, 684, 8, -18, 37, 16, 30, 9540, 13, 0, 29, 36, 3308, 8, 0, 37, 36, 1880, 44, -16, 37, 31, -1, 5, 37, 36, 4500, 52, -19, 37, 1, 29, 36, 300, 24, -12, 37, 31, 0, 40, 36, 1548, 8, 0, 37, 36, 4856, 12, -21, 37, 23, 51, 31, -1, 5, 31, 0, 40, 36, 76, 20, 22, 37, 36, 684, 8, -18, 37, 16, 30, 9603, 13, 0, 29, 36, 3308, 8, 0, 37, 36, 1880, 44, -16, 37, 31, -1, 5, 37, 36, 4500, 52, -19, 37, 1, 29, 36, 300, 24, -12, 37, 31, 0, 40, 36, 76, 20, 22, 37, 36, 4856, 12, -21, 37, 23, 51, 2, -1, 4, 0, 51, 39, 0, 30, 9424, 29, 36, 300, 24, -12, 37, 39, 0, 30, 9622, 17, 31, -1, 5, 36, 492, 20, 15, 37, 36, 2064, 12, -1, 23, 51, 4, 9644, 55, 39, 0, 30, 9697, 13, 0, 44, 64, 6, -1, 0, 5, 2, 1, 2, 3, 31, -1, 2, 13, 1, 31, 0, 47, 36, 544, 20, -5, 37, 1, 6, -1, 4, 31, -1, 3, 29, 36, 300, 24, -12, 37, 31, -1, 4, 23, 51, 36, 4640, 20, 11, 27, 39, 0, 30, 9696, 17, 31, -1, 5, 36, 492, 20, 15, 37, 36, 2032, 16, 3, 23, 51, 4, 9718, 55, 39, 0, 30, 9761, 13, 0, 44, 65, 6, -1, 0, 5, 0, 1, 54, 0, 29, 36, 300, 24, -12, 23, 51, 54, 0, 29, 36, 3308, 8, 0, 37, 36, 1880, 44, -16, 23, 51, 36, 4640, 20, 11, 27, 39, 0, 30, 9760, 17, 31, -1, 5, 36, 492, 20, 15, 37, 36, 3700, 40, -14, 23, 51, 4, 9782, 55, 39, 0, 30, 9820, 13, 0, 44, 66, 6, -1, 0, 5, 2, 1, 2, 3, 31, -1, 3, 31, -1, 2, 13, 2, 29, 36, 4704, 16, 13, 37, 1, 51, 36, 4640, 20, 11, 27, 39, 0, 30, 9819, 17, 31, -1, 5, 36, 492, 20, 15, 37, 36, 3956, 16, 0, 23, 51, 4, 9841, 55, 39, 0, 30, 10090, 13, 0, 44, 67, 6, -1, 0, 5, 2, 1, 2, 3, 29, 36, 3308, 8, 0, 37, 36, 3560, 16, 16, 37, 39, 0, 7, 30, 9874, 28, 39, 0, 30, 10089, 47, 10060, 31, -1, 2, 13, 1, 36, 2580, 12, 17, 27, 1, 30, 9907, 31, -1, 2, 13, 1, 31, 0, 47, 36, 544, 20, -5, 37, 1, 11, -1, 2, 51, 4, 10, 31, -1, 2, 13, 2, 36, 1084, 16, 3, 27, 1, 11, -1, 2, 51, 31, -1, 3, 36, 632, 28, -19, 37, 4, 1, 21, 6, -1, 4, 31, -1, 3, 31, -1, 4, 37, 6, -1, 5, 29, 36, 3308, 8, 0, 37, 36, 1880, 44, -16, 37, 31, -1, 2, 37, 3, 30, 9997, 31, 0, 49, 31, 0, 48, 13, 2, 20, 36, 3516, 36, -19, 37, 41, 29, 36, 3308, 8, 0, 37, 36, 1880, 44, -16, 37, 31, -1, 2, 23, 51, 31, -1, 3, 31, -1, 4, 37, 29, 36, 3308, 8, 0, 37, 36, 1016, 24, -10, 37, 21, 31, -1, 3, 31, -1, 4, 23, 51, 31, -1, 3, 31, -1, 5, 13, 2, 29, 36, 3308, 8, 0, 37, 36, 1880, 44, -16, 37, 31, -1, 2, 37, 36, 3820, 8, 4, 37, 1, 51, 45, 10056, 39, 0, 30, 10080, 6, -1, 6, 31, -1, 6, 36, 1100, 24, -16, 13, 2, 20, 36, 1276, 76, -21, 37, 1, 51, 36, 4640, 20, 11, 27, 39, 0, 30, 10089, 17, 31, -1, 5, 36, 492, 20, 15, 37, 36, 4704, 16, 13, 23, 51, 13, 0, 31, -1, 5, 41, 6, -1, 50, 4, 1, 6, -1, 51, 4, 2, 6, -1, 52, 36, 4352, 12, 7, 27, 9, 36, 4640, 20, 11, 40, 30, 10148, 13, 0, 36, 4352, 12, 7, 27, 41, 39, 0, 30, 10149, 48, 6, -1, 53, 4, 0, 6, -1, 54, 4, 1, 6, -1, 55, 4, 2, 6, -1, 56, 4, 3, 6, -1, 57, 4, 4, 6, -1, 58, 4, 5, 6, -1, 59, 4, 6, 6, -1, 60, 4, 7, 6, -1, 61, 4, 8, 6, -1, 62, 13, 0, 4, 10206, 55, 39, 0, 30, 10306, 13, 0, 44, 68, 6, -1, 0, 5, 0, 1, 54, 0, 6, -1, 2, 36, 3628, 4, -4, 4, 10232, 55, 39, 0, 30, 10265, 13, 0, 44, 69, 6, -1, 0, 5, 2, 1, 2, 3, 31, -1, 3, 31, 68, 2, 31, -1, 2, 23, 51, 36, 4640, 20, 11, 27, 39, 0, 30, 10264, 17, 36, 512, 12, -15, 4, 10276, 55, 39, 0, 30, 10299, 13, 0, 44, 70, 6, -1, 0, 5, 1, 1, 2, 31, 68, 2, 31, -1, 2, 37, 39, 0, 30, 10298, 17, 54, 2, 39, 0, 30, 10305, 17, 1, 6, -1, 63, 4, 0, 6, -1, 64, 4, 1, 6, -1, 65, 4, 2, 6, -1, 66, 4, 3, 6, -1, 67, 4, 10, 6, -1, 68, 4, 11, 6, -1, 69, 4, 12, 6, -1, 70, 4, 13, 6, -1, 71, 4, 20, 6, -1, 72, 4, 21, 6, -1, 73, 4, 30, 6, -1, 74, 4, 40, 6, -1, 75, 4, 41, 6, -1, 76, 4, 50, 6, -1, 77, 4, 51, 6, -1, 78, 4, 52, 6, -1, 79, 4, 53, 6, -1, 80, 4, 60, 6, -1, 81, 4, 61, 6, -1, 82, 4, 62, 6, -1, 83, 31, -1, 20, 31, -1, 13, 13, 2, 31, -1, 19, 1, 6, -1, 84, 31, -1, 21, 31, -1, 13, 13, 2, 31, -1, 19, 1, 6, -1, 85, 31, -1, 23, 31, -1, 12, 13, 2, 31, -1, 19, 1, 6, -1, 86, 31, -1, 22, 31, -1, 14, 13, 2, 31, -1, 19, 1, 6, -1, 87, 31, -1, 24, 31, -1, 17, 13, 2, 31, -1, 19, 1, 6, -1, 88, 31, -1, 25, 31, -1, 16, 13, 2, 31, -1, 19, 1, 6, -1, 89, 31, -1, 26, 31, -1, 15, 13, 2, 31, -1, 19, 1, 6, -1, 90, 31, -1, 27, 31, -1, 18, 13, 2, 31, -1, 19, 1, 6, -1, 91, 4, 1, 4, 0, 22, 6, -1, 92, 4, 1, 4, 1, 22, 6, -1, 93, 4, 1, 4, 2, 22, 6, -1, 94, 4, 1, 4, 3, 22, 6, -1, 95, 4, 1, 4, 4, 22, 6, -1, 96, 4, 1, 4, 5, 22, 6, -1, 97, 4, 1, 4, 6, 22, 6, -1, 98, 4, 1, 4, 7, 22, 6, -1, 99, 4, 1, 4, 8, 22, 6, -1, 100, 4, 0, 6, -1, 101, 4, 1, 6, -1, 102, 4, 16, 6, -1, 103, 4, 150, 4, 1e3, 25, 6, -1, 104, 4, 1, 6, -1, 105, 4, 2, 6, -1, 106, 4, 3, 6, -1, 107, 4, 4, 6, -1, 108, 4, 5, 6, -1, 109, 4, 6, 6, -1, 110, 4, 10662, 55, 39, 0, 30, 10986, 13, 0, 44, 71, 6, -1, 0, 5, 0, 1, 29, 6, -1, 2, 4, 10683, 55, 39, 0, 30, 10849, 13, 0, 44, 72, 6, -1, 0, 5, 1, 1, 2, 4, 10701, 55, 39, 0, 30, 10827, 13, 0, 44, 73, 6, -1, 0, 5, 1, 1, 2, 31, -1, 2, 36, 3552, 8, 9, 37, 36, 4336, 16, 18, 7, 30, 10817, 4, 0, 6, -1, 3, 31, -1, 2, 36, 368, 16, -5, 37, 36, 632, 28, -19, 37, 6, -1, 4, 31, -1, 3, 31, -1, 4, 42, 30, 10817, 31, -1, 2, 36, 368, 16, -5, 37, 31, -1, 3, 37, 6, -1, 5, 31, -1, 5, 36, 2524, 28, -13, 37, 36, 4232, 8, 21, 27, 36, 2560, 20, -8, 37, 7, 30, 10808, 31, -1, 5, 13, 1, 31, 71, 2, 36, 2328, 44, 20, 37, 1, 51, 2, -1, 3, 0, 51, 39, 0, 30, 10748, 36, 4640, 20, 11, 27, 39, 0, 30, 10826, 17, 13, 1, 31, -1, 2, 36, 1412, 12, 17, 37, 1, 51, 36, 4640, 20, 11, 27, 39, 0, 30, 10848, 17, 6, -1, 3, 36, 2492, 16, 6, 27, 9, 36, 4108, 8, -4, 7, 53, 30, 10883, 51, 36, 2492, 16, 6, 27, 36, 752, 12, -1, 37, 9, 36, 3204, 20, 18, 7, 30, 10919, 31, -1, 3, 13, 1, 36, 1748, 24, -2, 27, 13, 2, 36, 2492, 16, 6, 27, 36, 752, 12, -1, 37, 1, 29, 36, 3444, 20, 19, 23, 51, 39, 0, 30, 10937, 31, -1, 3, 13, 1, 36, 1748, 24, -2, 27, 41, 29, 36, 3444, 20, 19, 23, 51, 36, 4116, 16, 10, 39, 1, 36, 4336, 16, 18, 39, 1, 54, 2, 36, 3476, 12, -2, 27, 36, 1512, 20, -20, 37, 13, 2, 29, 36, 3444, 20, 19, 37, 36, 3660, 12, 6, 37, 1, 51, 36, 4640, 20, 11, 27, 39, 0, 30, 10985, 17, 31, -1, 28, 36, 492, 20, 15, 37, 36, 928, 36, 15, 23, 51, 4, 11007, 55, 39, 0, 30, 11159, 13, 0, 44, 74, 6, -1, 0, 5, 0, 1, 54, 0, 6, -1, 2, 29, 36, 3308, 8, 0, 37, 36, 28, 8, 15, 37, 13, 1, 36, 1256, 20, -19, 27, 36, 1716, 16, -10, 37, 1, 6, -1, 3, 31, -1, 3, 36, 632, 28, -19, 37, 6, -1, 4, 4, 0, 6, -1, 5, 31, -1, 5, 31, -1, 4, 42, 30, 11151, 31, -1, 3, 31, -1, 5, 37, 6, -1, 6, 31, -1, 6, 29, 36, 3308, 8, 0, 37, 36, 3244, 20, -11, 37, 8, 30, 11142, 29, 36, 3308, 8, 0, 37, 36, 3244, 20, -11, 37, 31, -1, 6, 37, 6, -1, 7, 29, 36, 3308, 8, 0, 37, 36, 28, 8, 15, 37, 31, -1, 6, 37, 31, -1, 2, 31, -1, 7, 23, 51, 2, -1, 5, 0, 51, 39, 0, 30, 11065, 31, -1, 2, 39, 0, 30, 11158, 17, 31, -1, 28, 36, 492, 20, 15, 37, 36, 4168, 36, 21, 23, 51, 4, 11180, 55, 39, 0, 30, 11340, 13, 0, 44, 75, 6, -1, 0, 5, 1, 1, 2, 29, 36, 3308, 8, 0, 37, 36, 28, 8, 15, 37, 3, 30, 11219, 54, 0, 29, 36, 3308, 8, 0, 37, 36, 28, 8, 15, 23, 51, 29, 36, 3308, 8, 0, 37, 36, 3244, 20, -11, 37, 3, 30, 11261, 54, 0, 29, 36, 3308, 8, 0, 37, 36, 3244, 20, -11, 23, 51, 4, 0, 29, 36, 3308, 8, 0, 37, 36, 3060, 20, -6, 23, 51, 36, 1424, 52, 19, 13, 1, 31, -1, 2, 36, 1040, 32, 8, 37, 1, 6, -1, 3, 31, -1, 3, 36, 632, 28, -19, 37, 6, -1, 4, 4, 0, 6, -1, 5, 31, -1, 5, 31, -1, 4, 42, 30, 11330, 31, -1, 3, 31, -1, 5, 37, 13, 1, 29, 36, 2084, 36, 8, 37, 1, 51, 2, -1, 5, 0, 51, 39, 0, 30, 11295, 36, 4640, 20, 11, 27, 39, 0, 30, 11339, 17, 31, -1, 28, 36, 492, 20, 15, 37, 36, 2328, 44, 20, 23, 51, 4, 11361, 55, 39, 0, 30, 11484, 13, 0, 44, 76, 6, -1, 0, 5, 1, 1, 2, 31, -1, 2, 13, 1, 31, 0, 6, 1, 6, -1, 3, 31, -1, 3, 29, 36, 3308, 8, 0, 37, 36, 28, 8, 15, 37, 8, 3, 30, 11474, 31, -1, 2, 13, 1, 31, 0, 9, 1, 6, -1, 4, 31, -1, 4, 29, 36, 3308, 8, 0, 37, 36, 28, 8, 15, 37, 31, -1, 3, 23, 51, 29, 36, 3308, 8, 0, 37, 36, 3060, 20, -6, 37, 29, 36, 3308, 8, 0, 37, 36, 3244, 20, -11, 37, 31, -1, 3, 23, 51, 4, 1, 29, 36, 3308, 8, 0, 37, 36, 3060, 20, -6, 49, 51, 36, 4640, 20, 11, 27, 39, 0, 30, 11483, 17, 31, -1, 28, 36, 492, 20, 15, 37, 36, 2084, 36, 8, 23, 51, 4, 11505, 55, 39, 0, 30, 12170, 13, 0, 44, 77, 6, -1, 0, 5, 1, 1, 2, 31, -1, 2, 53, 3, 30, 11526, 51, 54, 0, 11, -1, 2, 51, 54, 0, 29, 36, 3308, 8, 0, 37, 36, 4428, 24, -16, 23, 51, 31, -1, 2, 31, 0, 105, 37, 39, 0, 40, 29, 36, 3308, 8, 0, 37, 36, 4428, 24, -16, 37, 31, 0, 105, 23, 51, 31, -1, 2, 31, 0, 106, 37, 39, 0, 40, 29, 36, 3308, 8, 0, 37, 36, 4428, 24, -16, 37, 31, 0, 106, 23, 51, 31, -1, 2, 31, 0, 107, 37, 39, 0, 40, 29, 36, 3308, 8, 0, 37, 36, 4428, 24, -16, 37, 31, 0, 107, 23, 51, 31, -1, 2, 31, 0, 108, 37, 39, 0, 40, 29, 36, 3308, 8, 0, 37, 36, 4428, 24, -16, 37, 31, 0, 108, 23, 51, 31, -1, 2, 31, 0, 109, 37, 39, 0, 40, 29, 36, 3308, 8, 0, 37, 36, 4428, 24, -16, 37, 31, 0, 109, 23, 51, 31, -1, 2, 31, 0, 110, 37, 39, 0, 40, 29, 36, 3308, 8, 0, 37, 36, 4428, 24, -16, 37, 31, 0, 110, 23, 51, 13, 0, 36, 2076, 8, 17, 27, 36, 3132, 4, 8, 37, 1, 29, 36, 3308, 8, 0, 37, 36, 1016, 24, -10, 23, 51, 13, 0, 29, 36, 928, 36, 15, 37, 1, 51, 36, 3476, 12, -2, 27, 36, 1512, 20, -20, 37, 13, 1, 29, 36, 2328, 44, 20, 37, 1, 51, 29, 36, 3308, 8, 0, 37, 36, 472, 16, -6, 37, 39, 0, 7, 30, 12146, 36, 3476, 12, -2, 27, 36, 1512, 20, -20, 37, 13, 1, 14, 41, 6, -1, 3, 31, 0, 89, 36, 3752, 12, -11, 31, 0, 110, 13, 3, 31, 0, 89, 36, 3052, 8, 3, 31, 0, 110, 13, 3, 31, 0, 90, 36, 168, 12, 12, 31, 0, 109, 13, 3, 31, 0, 88, 36, 4364, 44, -18, 31, 0, 108, 13, 3, 31, 0, 88, 36, 4268, 44, -13, 31, 0, 108, 13, 3, 31, 0, 88, 36, 4328, 8, -5, 31, 0, 108, 13, 3, 31, 0, 88, 36, 3912, 12, 15, 31, 0, 108, 13, 3, 31, 0, 86, 36, 4240, 28, -12, 31, 0, 107, 13, 3, 31, 0, 86, 36, 3112, 20, 10, 31, 0, 107, 13, 3, 31, 0, 86, 36, 1780, 64, -19, 31, 0, 107, 13, 3, 31, 0, 87, 36, 4772, 12, 2, 31, 0, 106, 13, 3, 31, 0, 87, 36, 716, 36, -21, 31, 0, 106, 13, 3, 31, 0, 85, 36, 3828, 12, -7, 31, 0, 105, 13, 3, 31, 0, 85, 36, 4132, 12, 13, 31, 0, 105, 13, 3, 31, 0, 84, 36, 2252, 64, -22, 31, 0, 105, 13, 3, 31, 0, 85, 36, 1492, 20, 8, 31, 0, 105, 13, 3, 31, 0, 91, 36, 3464, 12, -3, 31, 0, 105, 13, 3, 31, 0, 91, 36, 3264, 16, -1, 31, 0, 105, 13, 3, 31, 0, 91, 36, 664, 20, 4, 31, 0, 105, 13, 3, 13, 19, 6, -1, 4, 31, -1, 4, 36, 632, 28, -19, 37, 6, -1, 5, 4, 0, 6, -1, 6, 31, -1, 6, 31, -1, 5, 42, 30, 12132, 31, -1, 4, 31, -1, 6, 37, 6, -1, 7, 31, -1, 7, 4, 1, 37, 6, -1, 8, 29, 36, 3308, 8, 0, 37, 36, 4428, 24, -16, 37, 31, -1, 7, 4, 0, 37, 37, 39, 1, 7, 30, 12123, 39, 1, 29, 36, 4704, 16, 13, 37, 31, -1, 8, 13, 2, 31, -1, 7, 4, 2, 37, 1, 31, -1, 8, 13, 3, 31, -1, 3, 36, 384, 72, -19, 37, 1, 51, 2, -1, 6, 0, 51, 39, 0, 30, 12037, 39, 1, 29, 36, 3308, 8, 0, 37, 36, 472, 16, -6, 23, 51, 39, 1, 29, 36, 3308, 8, 0, 37, 36, 3560, 16, 16, 23, 51, 36, 4640, 20, 11, 27, 39, 0, 30, 12169, 17, 31, -1, 28, 36, 492, 20, 15, 37, 36, 4428, 24, -16, 23, 51, 4, 12191, 55, 39, 0, 30, 12248, 13, 0, 44, 78, 6, -1, 0, 5, 0, 1, 29, 36, 3444, 20, 19, 37, 30, 12224, 13, 0, 29, 36, 3444, 20, 19, 37, 36, 3316, 16, 15, 37, 1, 51, 39, 0, 29, 36, 3308, 8, 0, 37, 36, 3560, 16, 16, 23, 51, 36, 4640, 20, 11, 27, 39, 0, 30, 12247, 17, 31, -1, 28, 36, 492, 20, 15, 37, 36, 4420, 8, 11, 23, 51, 4, 12269, 55, 39, 0, 30, 12425, 13, 0, 44, 79, 6, -1, 0, 5, 0, 1, 54, 0, 6, -1, 2, 29, 36, 3308, 8, 0, 37, 36, 1880, 44, -16, 37, 13, 1, 36, 1256, 20, -19, 27, 36, 1716, 16, -10, 37, 1, 6, -1, 3, 31, -1, 3, 36, 632, 28, -19, 37, 6, -1, 4, 4, 0, 6, -1, 5, 31, -1, 5, 31, -1, 4, 42, 30, 12386, 31, -1, 3, 31, -1, 5, 37, 6, -1, 6, 13, 0, 29, 36, 3308, 8, 0, 37, 36, 1880, 44, -16, 37, 31, -1, 6, 37, 36, 2064, 12, -1, 37, 1, 31, -1, 2, 31, -1, 6, 23, 51, 2, -1, 5, 0, 51, 39, 0, 30, 12327, 29, 36, 3308, 8, 0, 37, 36, 1016, 24, -10, 37, 13, 0, 29, 36, 4168, 36, 21, 37, 1, 31, -1, 2, 13, 0, 29, 36, 1640, 40, 16, 37, 1, 13, 4, 39, 0, 30, 12424, 17, 31, -1, 28, 36, 492, 20, 15, 37, 36, 2064, 12, -1, 23, 51, 4, 12446, 55, 39, 0, 30, 12482, 13, 0, 44, 80, 6, -1, 0, 5, 2, 1, 2, 3, 31, -1, 3, 29, 36, 300, 24, -12, 37, 31, -1, 2, 23, 51, 36, 4640, 20, 11, 27, 39, 0, 30, 12481, 17, 31, -1, 28, 36, 492, 20, 15, 37, 36, 2032, 16, 3, 23, 51, 4, 12503, 55, 39, 0, 30, 12546, 13, 0, 44, 81, 6, -1, 0, 5, 0, 1, 54, 0, 29, 36, 300, 24, -12, 23, 51, 54, 0, 29, 36, 3308, 8, 0, 37, 36, 1880, 44, -16, 23, 51, 36, 4640, 20, 11, 27, 39, 0, 30, 12545, 17, 31, -1, 28, 36, 492, 20, 15, 37, 36, 3700, 40, -14, 23, 51, 4, 12567, 55, 39, 0, 30, 12991, 13, 0, 44, 82, 6, -1, 0, 5, 2, 1, 2, 3, 29, 36, 3308, 8, 0, 37, 36, 3560, 16, 16, 37, 39, 0, 7, 30, 12600, 28, 39, 0, 30, 12990, 47, 12961, 4, 10, 31, -1, 2, 13, 2, 36, 1084, 16, 3, 27, 1, 11, -1, 2, 51, 31, -1, 3, 36, 632, 28, -19, 37, 4, 1, 21, 6, -1, 4, 31, -1, 3, 31, -1, 4, 37, 6, -1, 5, 31, -1, 3, 31, -1, 3, 36, 632, 28, -19, 37, 4, 2, 21, 37, 6, -1, 6, 29, 36, 3308, 8, 0, 37, 36, 1880, 44, -16, 37, 31, -1, 2, 37, 3, 30, 12710, 31, 0, 104, 31, 0, 103, 13, 2, 32, 36, 3516, 36, -19, 37, 41, 29, 36, 3308, 8, 0, 37, 36, 1880, 44, -16, 37, 31, -1, 2, 23, 51, 31, -1, 2, 31, 0, 74, 18, 53, 30, 12728, 51, 31, -1, 2, 31, 0, 75, 42, 30, 12788, 31, -1, 3, 4, 2, 37, 6, -1, 7, 31, -1, 7, 29, 36, 3308, 8, 0, 37, 36, 28, 8, 15, 37, 31, -1, 6, 23, 51, 31, -1, 3, 4, 4, 37, 31, -1, 3, 4, 3, 37, 31, -1, 3, 4, 1, 37, 31, -1, 3, 4, 0, 37, 13, 4, 11, -1, 3, 51, 31, -1, 3, 36, 632, 28, -19, 37, 4, 1, 21, 11, -1, 4, 51, 31, -1, 3, 31, -1, 4, 37, 29, 36, 3308, 8, 0, 37, 36, 1016, 24, -10, 37, 21, 31, -1, 3, 31, -1, 4, 23, 51, 31, -1, 3, 36, 632, 28, -19, 37, 4, 2, 21, 6, -1, 8, 29, 36, 3308, 8, 0, 37, 36, 3244, 20, -11, 37, 31, -1, 6, 37, 6, -1, 9, 31, -1, 9, 31, -1, 3, 31, -1, 8, 23, 51, 29, 36, 3308, 8, 0, 37, 36, 28, 8, 15, 37, 31, -1, 6, 37, 6, -1, 10, 31, -1, 10, 3, 30, 12902, 28, 39, 0, 30, 12990, 31, -1, 10, 4, 0, 37, 6, -1, 11, 31, -1, 11, 31, 0, 61, 7, 30, 12925, 28, 39, 0, 30, 12990, 31, -1, 3, 31, -1, 5, 13, 2, 29, 36, 3308, 8, 0, 37, 36, 1880, 44, -16, 37, 31, -1, 2, 37, 36, 3820, 8, 4, 37, 1, 51, 45, 12957, 39, 0, 30, 12981, 6, -1, 12, 31, -1, 12, 36, 3504, 12, -2, 13, 2, 32, 36, 1276, 76, -21, 37, 1, 51, 36, 4640, 20, 11, 27, 39, 0, 30, 12990, 17, 31, -1, 28, 36, 492, 20, 15, 37, 36, 4704, 16, 13, 23, 51, 4, 13012, 55, 39, 0, 30, 13050, 13, 0, 44, 83, 6, -1, 0, 5, 2, 1, 2, 3, 31, -1, 3, 31, -1, 2, 13, 2, 29, 36, 4704, 16, 13, 37, 1, 51, 36, 4640, 20, 11, 27, 39, 0, 30, 13049, 17, 31, -1, 28, 36, 492, 20, 15, 37, 36, 2148, 12, -1, 23, 51, 4, 13071, 55, 39, 0, 30, 13216, 13, 0, 44, 84, 6, -1, 0, 5, 0, 1, 4, 0, 6, -1, 2, 29, 36, 3308, 8, 0, 37, 36, 4428, 24, -16, 37, 6, -1, 3, 31, -1, 3, 31, 0, 105, 37, 30, 13118, 4, 1, 4, 0, 22, 50, -1, 2, 51, 31, -1, 3, 31, 0, 106, 37, 30, 13136, 4, 1, 4, 1, 22, 50, -1, 2, 51, 31, -1, 3, 31, 0, 107, 37, 30, 13154, 4, 1, 4, 2, 22, 50, -1, 2, 51, 31, -1, 3, 31, 0, 108, 37, 30, 13172, 4, 1, 4, 3, 22, 50, -1, 2, 51, 31, -1, 3, 31, 0, 109, 37, 30, 13190, 4, 1, 4, 4, 22, 50, -1, 2, 51, 31, -1, 3, 31, 0, 110, 37, 30, 13208, 4, 1, 4, 5, 22, 50, -1, 2, 51, 31, -1, 2, 39, 0, 30, 13215, 17, 31, -1, 28, 36, 492, 20, 15, 37, 36, 1640, 40, 16, 23, 51, 13, 0, 31, -1, 28, 41, 6, -1, 111, 36, 2680, 292, -12, 13, 0, 31, -1, 33, 1, 13, 0, 31, -1, 32, 1, 13, 0, 31, -1, 31, 1, 4, 1, 10, 4, 1, 10, 13, 6, 6, -1, 112, 48, 48, 48, 4, 13282, 55, 39, 0, 30, 13297, 13, 0, 44, 85, 51, 5, 0, 0, 13, 0, 31, 0, 30, 1, 17, 4, 13304, 55, 39, 0, 30, 13319, 13, 0, 44, 86, 51, 5, 0, 0, 13, 0, 31, 0, 29, 1, 17, 13, 5, 6, -1, 113, 13, 0, 4, 0, 12, 13, 0, 13, 3, 6, -1, 114, 31, -1, 111, 36, 1352, 4, 0, 26, 31, -1, 50, 36, 276, 4, 18, 26, 31, -1, 38, 36, 1012, 4, -12, 26, 31, -1, 39, 36, 3576, 16, -11, 26, 31, -1, 38, 36, 3764, 32, 16, 26],
                _YZxy2: atob("Wm5kMWIwNW9KVGREY1hSbWFWbHVjbW89VlE9PVZ5VTFSUT09VkVoRlRVVT1abTlzYUhGM0pUVkRKVFl3YWt0cGJHcHJKVFZESlRWQ0pUTkJPVE00SlRORkpUSkdKVE5ESlROQkxVSTFNeTBsTkRBbE0wSWxNMFU9YUdKdWJtST1kbk40WlhodGMzSldaWGhwSlRZd1ltSmthMlJ4SlRZd2MyaHViUT09SlRWRVltUnBhQT09WlZab2FHeGtaMWs9TVZvbE5qQlJKVFZGUkRNbE5EQkJOeVV6UkNVelF3PT1hR1ZmSlVNeUpUZ3djbmR0ZUNWRE1pVTRNQT09SlRkREpUZENkWG9sUXpJbE9EQnhmbFZ3SlRWQ2JtcHdiU1UxUlNVMk1BPT1kV1p0YTNsdGVuVnljU1UzUmlWRE1pVTRNQT09Wm5GNVVHcCtXbFU9ZFg1ekpVTXlKVGcxSlVNeUpUZzFKVFl3Y3lVM1JuYz1abWxwYW1sVGRHbHFlQT09ZEhkM1dDVkRNaVU0T1hnbFF6SWxPREVsUXpJbE9EZGZKVGRESlVNeUpUZzJKVU15SlRnM2VDVkRNaVU0TVhnbFF6SWxPRFU9YkhjbE4wSnpiQT09SlRkRGIzUnZlbGhyYVhWNGFnPT1aUT09WVdNbE5qQmxKVFl3WldwaFZnPT1kblFsUXpJbE9ETT1kbTRsTjBScVZHNGxReklsT0RJPWJHcDVTaVUzUW1wemVVaDBhV289WWxRbE5VSlVVbU5ZSlRWRkpUVkVOQ1UxUkZNPUpVTXlKVGhGSlRkQ0pUZEVjSDUrSlVNeUpUZ3dKVGRFY0E9PVkxaGZKVGRHZUNWRE1pVTRNWG9sUXpJbE9EY2xOMEk9UkZGU2JHdGxhbkJoYmlVMk1HdHphZz09WDJGb1Z3PT1VRkU9SlVNeUpUZzJkeVUzUkNVM1FtOD1KVU15SlRnd2VpVkRNaVU0UlNWRE1pVTRRU1ZETWlVNE5RPT1aSEJ2ZEhWemRtUjFZMjBsTmpCaEpUVkNWbGNsTmpCbUpUVkNXQ1UxUWxka1Vrc2xOVVFsTWtZbE5qQlBXQ1UxUlE9PVVtTlNKVFZDWVRBbE5VTWxOVU5mVVNVMk1BPT1TemhLUWlVelFVWkZTeVV6UTA5TGZpVkRNaVU0TXlWRE1pVTRRZz09SlVNeUpUZzJlWFY0WXlWRE1pVTRNaVZETWlVNE1DVkRNaVU0UkE9PVdsOWFaU1V6UldabFVtVmFKVFl3WHlVME1GTmtWbU5uVm1NPVYxaHBKVFZEVmxnPVVsaE5KVFl3WkdkMll3PT1abVZmWkdvbE5VSm9TbTltSlRWQ0pUZEdKVGREYjIxNUpUZERiaVUxUlhOM2J3PT1hVzBsTlVScWNVc2xOVVJrSlRWRUpUVkNiR2RxT1dSa2N5VTFSV2x5WWc9PWJTVTFSVzl3WWtacmNRPT1KVGRFSlRkR0pVTXlKVGcwZVNVM1JuND1ibk56YW5kWmFpVTNSSGs9VTNKMEpUZERKVU15SlRnMEpVTXlKVGd4Y25SMkpUZERiblZ1YkNVM1JISjRkeVUxUXlVM1JHb2xOMElsTjBRPVYxVmtOU1UxUldSaVdWVmpNbWxFYVNVMk1GVT1aU1UyTUdaVVdRPT1XQ1UxUXlVMk1BPT1ZblVsTjBSNGRpVkRNaVU0Tnc9PUpVTXlKVGc0ZWlWRE1pVTRNeVZETWlVNE9TVkRNaVU0TnlWRE1pVTRSVm9sUXpJbE9EY2xReklsT0RjbFF6SWxPRFFsUXpJbE9EYz1ZZz09SlROR1MwUkRKVE5EWXlVMVEyUWxOVU5sYXc9PUpVTXlKVGcxSlVNeUpUZ3dKVU15SlRnMmRIaz1WU1UxUldFMFVGSlhWaVUxUWlVMVJHSmhKVEU1SlRCRUpUWXdVbGxTVUdFbE1Ua2xNRVJoVW1WaFRsOVNUZz09T0RsS0pUTkVOems9TkE9PVpXZHRheVUxUkNVMVEyZHZaZz09ZGlWRE1pVTRNM2dsUXpJbE9FUT1iUT09WlZWa1YxY2xOakJLVFU5VlUwVT1ZVnBYVVZNPVdXVWxOVVVsTlVSbGRpVkRNaVU0T1NWRE1pVTROVklsUXpJbE9ETjJjbFlsTjBSMmZuWWxOMFlsUXpJbE9EVT1aWFp6WW5WcWNHOD1UMVVsTlVWVFgxUlZNMThsTlVWV1dWZEVYekpaWkZZbE5VTlJWMk09ZVg0bFF6SWxPRFIxSlVNeUpUZ3lKVU15SlRnMmNTVTNRdz09ZFc4bFF6SWxPRE1sTjBRPUpVTXlKVGhFWVZKWVZraz1UM2QyWTNacmNYQlJaSFZuZEhobmRBPT1WbDlVWm1ZPUpVTXlKVGczSlVNeUpUZ3lKVU15SlRnNGRpVTNRaVZETWlVNE5pVkRNaVU0TjNRbFF6SWxPRFVsUXpJbE9EYz1KVU15SlRneUpUZEVKVU15SlRnemNYWnhieVUzUTNGemVnPT1KVU15SlRnMGVTVTNSSFZTSlVNeUpUZzFkbloxSlVNeUpUZ3lKVU15SlRnekpVTXlKVGcySlVNeUpUZzFKVU15SlRnNUpVTXlKVGhCWXlVM1FpVkRNaVU0T1NWRE1pVTRPWGNsTjBRbE4wST1WQ1UxUTFCWUpUVkNLbVU9TlZOaVpTVXpSV0ZWSlRWRUpUZEVlWDQ9ZUdnPWNHSnhRU1UxUlhFbE5VVT1KVU15SlRnd2RTVTNRdz09YUdaMVJXSjFZZz09TTFCalZBPT1XU1UxUXlVMVF5VXpSV2RxWlNVelJHUWxOVVJsSlRWRVptdz1hVnB0YVE9PUpUWXdVazVmVUZVPWVHbDNlQT09Y1haMGFVWjNabTkxYjNZbE4wSnhVVkpqYUZwZlZTVTJNR2hKVm5oMWMyOTVhdz09ZUNVM1JIWWxReklsT0RNbE4wTjZlV2tsUXpJbE9EUWxReklsT0VGNEpUZEVlaVZETWlVNE9BPT1KVU15SlRnekpVTXlKVGcxSlVNeUpUaENKVU15SlRnNUpUZENKVU15SlRnekpVTXlKVGcxSlVNeUpUaERKVGRDYUdkaFptd2xOVVJxSlRWRFRTVTFSVjlSSlROQlVXTXlKVFZDSlRWRldURllVVmxSV2lVMk1GOD1ibTlrWlU1aGJXVT1KVU15SlRnM2VTVkRNaVU0T0dnbE4wUWxReklsT0RGNUpVTXlKVGd6SlVNeUpUZzVKVU15SlRnNGFtOTVaMmh5YTJvPWFXUkJaR3hhWnpoV2FGbz1lQT09SlRWRldHdz1jeVZETWlVNE5uTnhURjhsTmpCbVh5VTFSRzQ9VFV3bE5VUT1ZbU5RWVdNPUpUZENKVGREY1hKaEpVTXlKVGcySlRkRWNnPT1YeVUxUlc4PVRWUk5WVTFXSlRWRFoxWlhURTA9V0dJbE0wUlFKVE5FYzNFbFF6SWxPREJQSlRkQ2JYaHhKVGRHYjNGd1VTVkRNaVU0TW5GNkpVTXlKVGd3SlRkR0pUWXdKVFZDYVdaNVpuaHFlUT09SlRZd0pUVkVZeVUxUTFJPVVqY2xNMFZtWVZsekpUVkNKVU15SlRnemMxaERKVU15SlRnd1JIUjJiMDBsUXpJbE9EUjRUMFZ2UVdJbE4wSnhkaVUzUWlVMVEwTWxReklsT0RCdUpUTkdKVFZDVWlVelJpVTFSSEo2ZWtKMlVtNGxReklsT0RGRkpUZEVkeVV6UkU1MVRsRitlRk52VTJNbFF6SWxPREZ6WWtKV2NTVTNReVV6Um0wbE0wVmpUeVUwTUNWRE1pVTRNaVUzUkVJbE5VUnlkamQySlVNeUpUZzBKVU15SlRnMVpuZHRKVFZGWVZOeFFpVkRNaVU0TWlWRE1pVTROaVZETWlVNE5IbG1KVU15SlRneU55VkRNaVU0TVhKZlRTVTNRaVV6Um5KV2Qwaz1KVE5HSlRRd2F3PT1jSFZyYkNVM1JsWnRKVGREZDNVbFF6SWxPRFFsUXpJbE9EaDNKVGREZFE9PVpDVTFSRzhsTTBSd2NHNWxKVFZGY1hCaEpUWXdiRzEyYkhObGJtZDVibVZ2ZEdwcmZnPT1RbFZYTldnbE5qQT1KVU15SlRnNWVBPT1iVzQ9WmxjPWFtVnJXU1UxUldObGJDVTFRZz09Wm1kdlFsWnBKVFZFWTJGd0pUTkVjSEJ1WlNVMVJYRndZUT09ZG1sMWVXMTJhV2c9WTJwaVYxcG5ZazlWSlRORFR5VTFRbE09VkdNbE5VTlJZbGNsTlVRbE5VTT1VVUZRUTBOTUpURTVZMWxxVlE9PWNYaHFjMngrYzJwNGJDVTNRZz09Y1hCcWIzVm1jMjV3ZDJZPWRtNTFkR3M9YW5Od2QybDJhSGxyUzJnbE4wSm9jM1JoZEdVPVZWcGtWQ1UyTUY5ZlZsUmxjbmQ0SlRkQ2N5VTFSSDV6ZENWRE1pVTRNZz09UVV3bE5EQlNTa0pMVVNVMVEwOUNRMEpQVDBKUFRscFRVazkwZGlVM1FucExjbXR6YTNSNlpXc2xOMFJ1ZFdWckpUTkVKVFZGWlNVMVJXMGxOVVU9VENVMVEwOGxOakJTWDJOU1h3PT1jM0pzY1hkb2RYaHpabkZsZDI5bmNIWT1hU1UxUWlVMk1GWmhhVXM9UkV0UGNYWnJjWEE9WnlVM1F5VkRNaVU0TUhoVkpVTXlKVGc0ZVhsNEpVTXlKVGcxYTNCbkpUVkRZbFZUWDJKVVdTVTFSVmM9ZmlVM1Jtd2xOMFFsTjBZPVlrOGxOakJWVTJJPVJUY2xNME15SlRORVJRPT1kZz09WHc9PWQybDRKVFZGVHlVMk1GTWxOVU5pSlROREpUVkVVbE09YVNVMVEyMWZiSEJmSlRWRkpUWXdaVm9sTmpCZlVrZExSMHhGVVE9PUpVTXlKVGd3Y3lWRE1pVTRNWE1sUXpJbE9ESlNieVZETWlVNE1tOD1OemN5WTBoeGJFVXFKVGRDYkg0bE4wWndZMlZTSlRWRVdXUkVYemtsTlVWakpUWXdWU1UxUW1RPWRIZHJhU1UzUTNGM2RnPT1KVFF3UlUwPWJIRnZaQT09YTJsemFuTndhbkk9Wm1GblZWcFhaUT09ZDNvPWJHWjZkQT09SlRkRGJnPT1lbmNsUXpJbE9FRjNNV3AyYjI0eFpIRm1KVGRDWkZoVkpUVkVWUT09VnlVMk1GUm1aQT09VEZWTFVTVTJNQ1UyTUNVMVExbFRVV1JaWHlVMVJRPT1ZMmx5WTBKMVptWlFkWE5vSlRkRUpUZEdjaVZETWlVNE0zb2xOME1sUXpJbE9ERjJKVGRESlRkQ1pXWjNhbVJtYm5CMWFuQnZaVmh0SlRZd0pUVkZXR3NsTmpCbVpRPT1XV3hyYTJabEpUTkRRVFV5SlROR0pVTXlKVGd6ZUhsMkpVTXlKVGcwSlRWQ2RTVkRNaVU0T1E9PWMyWnVhV2Q0YVd0WWFtZ2xOVUlsTlVJPUpUWXdZbWhtV0doakpUWXdhV1ZrSlRZd1Z3PT1XVWxZVlZKU1VsQmZNVmdsTTBWZlRGOVFRbFJmVXpSWlQxUk9VQ1UxUlE9PWVDVTNRbkp3Y25jPWJDVTFSSEJzV1dvbE5VUlpPVnBQVUE9PUpVTXlKVGd3SlRkQ0pVTXlKVGd4YjNSeGVuQT1laVUzUXlWRE1pVTRNaVZETWlVNE1ISnlKVGRDSlVNeUpUZ3hjaVUzUmc9PVZRPT1ZVmxuWjFVbE5VSlpaM0Y2ZHc9PVVWWlhXbElsTTBGWFlXST1VQ1UxUlZwa1JscHBKVGRHSlVNeUpUZ3hKVU15SlRnM0pVTXlKVGcxZDM1M2N5VkRNaVU0T0hjPVZsb2xOVVU9SlRWRWFHbGtaUT09SlVNeUpUZ3lkWE1sTjBZbFF6SWxPREowZFhGbWFHcHRkSEZwYW5jPUpUZEdKVU15SlRneEpVTXlKVGczSlVNeUpUZzFkdz09ZW5nbFF6SWxPRGNsTmpCNGRDVkRNaVU0TVdONEpVTXlKVGcxSlRkREpVTXlKVGd5ZHc9PUpUTkZRVGcwSlRORVF6QkRPQ1V6UlNVelJBPT1jbVoxZVNWRE1pVTRNMU1sTjBaK0pVTXlKVGcwZFg0bFF6SWxPRFJWZEhrbFF6SWxPRFJ4Y2lVM1EzVT1hbU5aV2lVMVFpVTFSV05hV1E9PVR5VTFSQT09YVNVMVJXdGZhR3RtV21jbE5VTWxOVVU9TjBKS1FRPT1PQT09VW1WWVZtSmxWemhwV0dGblZ5VkRNaVU0TnlWRE1pVTROQ1ZETWlVNFF5VkRNaVU0T0hvbFF6SWxPRGM9YzJsNlpRPT1hV04zWW0xMWJBPT1jWEp3WjJ4bFoyUjNkWFk9Zm5FbE4wUjFKVFZEWldJbE5VVm5iVkU9WjJGMWJHNWhiMjg9WWxKaFZGUWxOVVJJV0d0WVZnPT1ZbVJyV25SaVpRPT1VRFZqVm1KYU1pVXhOdz09SlVNeUpUZ3djU1ZETWlVNE1uVitKVU15SlRnMGNubz1KVU15SlRnNEpUZEVKVU15SlRneGVRPT0=")
            };
            function t(e) {
                for (; e._9ZnY90 !== e._2zIpK8clg; ) {
                    var t = e._YHdinsA[e._9ZnY90++];
                    e._IWOgtRwi[t](e)
                }
            }
            return e._2zIpK8clg = e._YHdinsA.length,
                t(e),
                e._iooT5I
        }(),
            rn = nn.s,
            on = nn.m,
            an = nn.b,
            sn = nn.start
    } catch (Xn) {
        Ae("ob-error", "error", "api", {
            message: Xn.message
        });
        var ln = function() {};
        rn = function() {
            return Promise.resolve()
        }
            ,
            on = {
                record: ln,
                resetData: ln,
                setData: ln,
                stop: ln,
                circBuffPush: ln
            },
            an = {
                record: ln,
                stop: ln
            },
            sn = ln
    }
    function hn(e, t) {
        this.cause = e,
            this.message = t
    }
    function un(e) {
        hn.call(this, de, "Invalid hCaptcha id: " + e)
    }
    function pn() {
        hn.call(this, ue, "No hCaptcha exists.")
    }
    function dn() {
        hn.call(this, pe, "Missing sitekey - https://docs.hcaptcha.com/configuration#javascript-api")
    }
    hn.prototype = Error.prototype;
    var fn = []
        , mn = []
        , gn = {
        add: function(e) {
            fn.push(e)
        },
        remove: function(e) {
            for (var t = !1, n = fn.length; --n > -1 && !1 === t; )
                fn[n].id === e.id && (t = fn[n],
                    fn.splice(n, 1));
            return t
        },
        each: function(e) {
            for (var t = -1; ++t < fn.length; )
                e(fn[t])
        },
        isValidId: function(e) {
            for (var t = !1, n = -1; ++n < fn.length && !1 === t; )
                fn[n].id === e && (t = !0);
            return t
        },
        getByIndex: function(e) {
            for (var t = !1, n = -1; ++n < fn.length && !1 === t; )
                n === e && (t = fn[n]);
            return t
        },
        getById: function(e) {
            for (var t = !1, n = -1; ++n < fn.length && !1 === t; )
                fn[n].id === e && (t = fn[n]);
            return t
        },
        getCaptchaIdList: function() {
            var e = [];
            return gn.each((function(t) {
                    e.push(t.id)
                }
            )),
                e
        },
        pushSession: function(e, t) {
            mn.push([e, t]),
            mn.length > 10 && mn.splice(0, mn.length - 10)
        },
        getSession: function() {
            return mn
        }
    };
    function yn(e, t) {
        "object" != typeof e || t || (t = e,
            e = null);
        var n, r, i, o = !0 === (t = t || {}).async, a = new Promise((function(e, t) {
                r = e,
                    i = t
            }
        ));
        if (a.resolve = r,
            a.reject = i,
            n = e ? gn.getById(e) : gn.getByIndex(0))
            je("Execute called", "hCaptcha", "info"),
                cn.setData("exec", "api"),
                on.setData("exec", "api"),
            o && n.setPromise(a),
                n.onReady(n.initChallenge, t);
        else if (e) {
            if (!o)
                throw new un(e);
            a.reject(de)
        } else {
            if (!o)
                throw new pn;
            a.reject(ue)
        }
        if (o)
            return a
    }
    function vn(e) {
        var t = ""
            , n = null;
        n = e ? gn.getById(e) : gn.getByIndex(0);
        try {
            for (var r = gn.getSession(), i = r.length, o = !1; --i > -1 && !o; )
                (o = r[i][1] === n.id) && (t = r[i][0])
        } catch (Xn) {
            t = ""
        }
        return t
    }
    function bn(e, t, n) {
        this.target = e,
            this.setTargetOrigin(n),
            this.id = t,
            this.messages = [],
            this.incoming = [],
            this.waiting = [],
            this.isReady = !0,
            this.queue = []
    }
    bn.prototype._sendMessage = function(e, t) {
        var n = e instanceof HTMLIFrameElement;
        try {
            n ? e.contentWindow.postMessage(JSON.stringify(t), this.targetOrigin) : e.postMessage(JSON.stringify(t), this.targetOrigin)
        } catch ($n) {
            Pe("messaging", $n),
            "*" !== this.targetOrigin && (this.setTargetOrigin("*"),
                this._sendMessage(e, t))
        }
    }
        ,
        bn.prototype.setReady = function(e) {
            var t = this;
            t.isReady = e,
            t.isReady && t.queue.length && (t.queue.forEach((function(e) {
                    t._sendMessage.apply(t, e)
                }
            )),
                t.clearQueue())
        }
        ,
        bn.prototype.clearQueue = function() {
            this.queue = []
        }
        ,
        bn.prototype.setID = function(e) {
            this.id = e
        }
        ,
        bn.prototype.setTargetOrigin = function(e) {
            this.targetOrigin = "*"
        }
        ,
        bn.prototype.contact = function(e, t) {
            if (!this.id)
                throw new Error("Chat requires unique id to communicate between windows");
            var n = this
                , r = Math.random().toString(36).substr(2)
                , i = {
                source: "hcaptcha",
                label: e,
                id: this.id,
                promise: "create",
                lookup: r
            };
            if (t) {
                if ("object" != typeof t)
                    throw new Error("Message must be an object.");
                i.contents = t
            }
            return new Promise((function(t, o) {
                    n.waiting.push({
                        label: e,
                        reject: o,
                        resolve: t,
                        lookup: r
                    }),
                        n._addToQueue(n.target, i)
                }
            ))
        }
        ,
        bn.prototype.listen = function(e, t) {
            if (!this.id)
                throw new Error("Chat requires unique id to communicate between windows");
            for (var n = this.messages.length, r = !1; --n > -1 && !1 === r; )
                this.messages[n].label === e && (r = this.messages[n]);
            !1 === r && (r = {
                label: e,
                listeners: []
            },
                this.messages.push(r)),
                r.listeners.push(t)
        }
        ,
        bn.prototype.answer = function(e, t) {
            if (!this.id)
                throw new Error("Chat requires unique id to communicate between windows");
            for (var n = this.incoming.length, r = !1; --n > -1 && !1 === r; )
                this.incoming[n].label === e && (r = this.incoming[n]);
            !1 === r && (r = {
                label: e,
                listeners: []
            },
                this.incoming.push(r)),
                r.listeners.push(t)
        }
        ,
        bn.prototype.send = function(e, t) {
            var n = this;
            if (!n.id)
                throw new Error("Chat requires unique id to communicate between windows");
            var r = {
                source: "hcaptcha",
                label: e,
                id: n.id
            };
            if (t) {
                if ("object" != typeof t)
                    throw new Error("Message must be an object.");
                r.contents = t
            }
            n._addToQueue(n.target, r)
        }
        ,
        bn.prototype.check = function(e, t) {
            for (var n = [].concat.apply([], [this.messages, this.incoming, this.waiting]), r = [], i = -1; ++i < n.length; )
                if (n[i].label === e) {
                    if (t && n[i].lookup && t !== n[i].lookup)
                        continue;
                    r.push(n[i])
                }
            return r
        }
        ,
        bn.prototype.respond = function(e) {
            for (var t, n, r = -1, i = 0, o = [].concat.apply([], [this.messages, this.incoming, this.waiting]); ++r < o.length; )
                if (o[r].label === e.label) {
                    if (e.lookup && o[r].lookup && e.lookup !== o[r].lookup)
                        continue;
                    var a = [];
                    if (t = o[r],
                    e.error && a.push(e.error),
                    e.contents && a.push(e.contents),
                    e.promise && "create" !== e.promise) {
                        t[e.promise].apply(t[e.promise], a);
                        for (var s = this.waiting.length, c = !1; --s > -1 && !1 === c; )
                            this.waiting[s].label === t.label && this.waiting[s].lookup === t.lookup && (c = !0,
                                this.waiting.splice(s, 1));
                        continue
                    }
                    for (i = 0; i < t.listeners.length; i++) {
                        if (n = t.listeners[i],
                        "create" === e.promise) {
                            var l = this._contactPromise(t.label, e.lookup);
                            a.push(l)
                        }
                        n.apply(n, a)
                    }
                }
            o = null
        }
        ,
        bn.prototype.destroy = function() {
            return this.clearQueue(),
                this.messages = null,
                this.incoming = null,
                this.waiting = null,
                this.isReady = !1,
                null
        }
        ,
        bn.prototype._contactPromise = function(e, t) {
            var n = this
                , r = {}
                , i = new Promise((function(e, t) {
                    r.resolve = e,
                        r.reject = t
                }
            ))
                , o = {
                source: "hcaptcha",
                label: e,
                id: n.id,
                promise: null,
                lookup: t
            };
            return i.then((function(e) {
                    o.promise = "resolve",
                    null !== e && (o.contents = e),
                        n._addToQueue(n.target, o)
                }
            ))["catch"]((function(e) {
                    o.promise = "reject",
                    null !== e && (o.error = e),
                        n._addToQueue(n.target, o)
                }
            )),
                r
        }
        ,
        bn.prototype._addToQueue = function(e, t) {
            this.isReady ? this._sendMessage(e, t) : this.queue.push([e, t])
        }
    ;
    var wn = {
        chats: [],
        messages: [],
        globalEnabled: !1,
        isSupported: function() {
            return !!window.postMessage
        },
        createChat: function(e, t, n) {
            var r = new bn(e,t,n);
            return wn.chats.push(r),
                r
        },
        addChat: function(e) {
            wn.chats.push(e)
        },
        removeChat: function(e) {
            for (var t = !1, n = wn.chats.length; --n > -1 && !1 === t; )
                e.id === wn.chats[n].id && e.target === wn.chats[n].target && (t = wn.chats[n],
                    wn.chats.splice(n, 1));
            return t
        },
        consumeMessages: function() {
            var e = wn.messages;
            return wn.messages = [],
                e
        },
        handleGlobal: function(e) {
            if (wn.globalEnabled) {
                var t = wn.messages;
                if (t.length >= 10)
                    wn.globalEnabled = !1;
                else {
                    var n = t.some((function(t) {
                            return JSON.stringify(t.data) === JSON.stringify(e.data)
                        }
                    ));
                    n || t.push(e)
                }
            }
        },
        handle: function(e) {
            var t = e.data
                , n = "string" == typeof t && t.indexOf("hcaptcha") >= 0 || "object" == typeof t && JSON.stringify(t).indexOf("hcaptcha") >= 0;
            try {
                if (!n)
                    return void wn.handleGlobal(e);
                "string" == typeof t && (t = JSON.parse(t)),
                "d" === t.t && wn.messages.push(e);
                for (var r, i = wn.chats, o = -1; ++o < i.length; ) {
                    var a = "*" === (r = i[o]).targetOrigin || e.origin === r.targetOrigin;
                    r.id === t.id && a && r.respond(t)
                }
            } catch ($n) {
                je("postMessage handler error", "postMessage", "debug", {
                    event: e,
                    error: $n
                })
            }
        }
    };
    function _n(e) {
        var t = e ? gn.getById(e) : gn.getByIndex(0);
        if (!t)
            throw e ? new un(e) : new pn;
        gn.remove(t),
            t.destroy(),
            t = null
    }
    function En() {
        try {
            return Object.keys(window).sort().join(",")
        } catch (Gn) {
            return null
        }
    }
    window.addEventListener ? window.addEventListener("message", wn.handle) : window.attachEvent("onmessage", wn.handle);
    var kn = Be();
    function Vn(e, t) {
        for (var n in t) {
            var r = t[n];
            switch (typeof r) {
                case "string":
                    e[n] = r;
                    break;
                case "object":
                    e[n] = e[n] || {},
                        Vn(e[n], r);
                    break;
                default:
                    throw new Error("Source theme contains invalid data types. Only string and object types are supported.")
            }
        }
    }
    function xn(e, t) {
        try {
            return e in t
        } catch (n) {
            return !1
        }
    }
    function Tn(e) {
        return !!e && "object" == typeof e
    }
    function Sn(e) {
        return Tn(e) ? Rn({}, e) : e
    }
    function Rn(e, t) {
        var n, r = {}, i = Object.keys(e);
        for (n = 0; n < i.length; n++)
            r[i[n]] = Sn(e[i[n]]);
        var o, a, s = Object.keys(t);
        for (n = 0; n < s.length; n++) {
            var c = s[n];
            if (!(!xn(o = c, a = e) || Object.hasOwnProperty.call(a, o) && Object.propertyIsEnumerable.call(a, o)))
                return;
            xn(c, e) && Tn(e[c]) ? r[c] = Rn(e[c], t[c]) : r[c] = Sn(t[c])
        }
        return r
    }
    var Mn = {
        transparent: "transparent",
        white: "#ffffff",
        black: "#000000"
    }
        , Un = {
        100: "#fafafa",
        200: "#f5f5f5",
        300: "#E0E0E0",
        400: "#D7D7D7",
        500: "#BFBFBF",
        600: "#919191",
        700: "#555555",
        800: "#333333",
        900: "#222222",
        1e3: "#14191F"
    }
        , Cn = "#4DE1D2"
        , On = "#00838F"
        , Wn = {
        mode: "light",
        grey: Un,
        primary: {
            main: On
        },
        secondary: {
            main: Cn
        },
        warn: {
            light: "#BF1722",
            main: "#BF1722",
            dark: "#9D1B1B"
        },
        text: {
            heading: Un[700],
            body: Un[700]
        }
    }
        , Nn = {
        mode: "dark",
        grey: Un,
        primary: {
            main: On
        },
        secondary: {
            main: Cn
        },
        text: {
            heading: Un[200],
            body: Un[200]
        }
    };
    function An(e, t) {
        return "dark" === t && e in Nn ? Nn[e] : Wn[e]
    }
    function Pn() {
        this._themes = Object.create(null),
            this._active = "light",
            this.add("light", {}),
            this.add("dark", {
                palette: {
                    mode: "dark"
                }
            })
    }
    Pn.prototype.get = function(e) {
        if (!e)
            return this._themes[this._active];
        var t = this._themes[e];
        if (!t)
            throw new Error("Cannot find theme with name: " + e);
        return t
    }
        ,
        Pn.prototype.use = function(e) {
            this._themes[e] ? this._active = e : console.error("Cannot find theme with name: " + e)
        }
        ,
        Pn.prototype.active = function() {
            return this._active
        }
        ,
        Pn.prototype.add = function(e, t) {
            t || (t = {}),
                t.palette = function(e) {
                    e || (e = {});
                    var t = e.mode || "light"
                        , n = e.primary || An("primary", t)
                        , r = e.secondary || An("secondary", t)
                        , i = e.warn || An("warn", t)
                        , o = e.grey || An("grey", t)
                        , a = e.text || An("text", t);
                    return Rn({
                        common: Mn,
                        mode: t,
                        primary: n,
                        secondary: r,
                        grey: o,
                        warn: i,
                        text: a
                    }, e)
                }(t.palette),
                t.component = t.component || Object.create(null),
                this._themes[e] = t
        }
        ,
        Pn.prototype.extend = function(e, t) {
            "string" == typeof t && (t = JSON.parse(t));
            var n = JSON.parse(JSON.stringify(this.get(e)));
            return Vn(n, t),
                n
        }
        ,
        Pn.merge = function(e, t) {
            return Rn(e, t || {})
        }
    ;
    var jn = ["light", "dark", "contrast", "grey-red"]
        , Fn = new Pn;
    Fn.add("contrast", {}),
        Fn.add("grey-red", {
            component: {
                challenge: {
                    main: {
                        border: "#6a6a6a"
                    }
                }
            }
        });
    function Bn(e, t) {
        var n = this;
        this.id = e,
            this.width = null,
            this.height = null,
            this.mobile = !1,
            this.ready = !1,
            this.listeners = [],
            this.config = t,
            this._visible = !1,
            this._selected = !1,
            this.$iframe = new pt("iframe"),
            this._host = ye.host || window.location.hostname;
        var r = ye.assetUrl;
        ve.assethost && (r = ve.assethost + ye.assetUrl.replace(ye.assetDomain, ""));
        var i = r.match(/^.+\:\/\/[^\/]+/)
            , o = i ? i[0] : null
            , a = r + "/hcaptcha.html#frame=challenge&id=" + this.id + "&host=" + this._host + (t ? "&" + Je(this.config) : "")
            , s = ee.Browser.supportsPST();
        this.setupParentContainer(t),
            this.chat = wn.createChat(this.$iframe.dom, e, o),
            this.chat.setReady(!1),
            this._timeoutFailedToInitialize = setTimeout((function() {
                    n.$iframe && n.$iframe.isConnected() ? Ae("Failed to initialize. Iframe attached", "error", "frame:challenge", {
                        contentWindow: !!n.$iframe.dom.contentWindow,
                        iframeSrc: a,
                        supportsPST: s,
                        customContainer: n._hasCustomContainer
                    }) : Ae("Failed to initialize. Iframe detached", "error", "frame:challenge")
                }
            ), 6e4),
            this.$iframe.dom.src = a,
            this.$iframe.dom.frameBorder = 0,
            this.$iframe.dom.scrolling = "no",
        ee.Browser.supportsPST() && (this.$iframe.dom.allow = "private-state-token-issuance 'src'; private-state-token-redemption 'src'"),
            this.translate(),
            this._hasCustomContainer ? (this._hideIframe(),
                this._parent.appendChild(this.$iframe.dom)) : (this.$container = new pt("div"),
                this.$wrapper = this.$container.createElement("div"),
                this.$overlay = this.$container.createElement("div"),
                this.$arrow = this.$container.createElement("div"),
                this.$arrow.fg = this.$arrow.createElement("div"),
                this.$arrow.bg = this.$arrow.createElement("div"),
                this.style.call(this),
                this.$wrapper.appendElement(this.$iframe),
                this._parent.appendChild(this.$container.dom),
                this.$container.setAttribute("aria-hidden", !0)),
            this.style()
    }
    Bn.prototype.setupParentContainer = function(e) {
        var t, n = e["challenge-container"];
        n && (t = "string" == typeof n ? document.getElementById(n) : n),
            t ? (this._hasCustomContainer = !0,
                this._parent = t) : (this._hasCustomContainer = !1,
                this._parent = document.body)
    }
        ,
        Bn.prototype._hideIframe = function() {
            var e = {};
            "ie" !== ee.Browser.type || "ie" === ee.Browser.type && 8 !== ee.Browser.version ? (e.opacity = 0,
                e.visibility = "hidden") : e.display = "none",
                this.$iframe.setAttribute("aria-hidden", !0),
                this.$iframe.css(e)
        }
        ,
        Bn.prototype._showIframe = function() {
            var e = {};
            "ie" !== ee.Browser.type || "ie" === ee.Browser.type && 8 !== ee.Browser.version ? (e.opacity = 1,
                e.visibility = "visible") : e.display = "block",
                this.$iframe.removeAttribute("aria-hidden"),
                this.$iframe.css(e)
        }
        ,
        Bn.prototype.style = function() {
            var e = function(e) {
                var t = e.palette
                    , n = e.component;
                return Pn.merge({
                    main: {
                        fill: t.common.white,
                        border: t.grey[400]
                    }
                }, n.challenge)
            }(Fn.get());
            if (this._hasCustomContainer)
                this.$iframe.css({
                    border: 0,
                    position: "relative",
                    backgroundColor: e.main.fill
                });
            else {
                var t = {
                    backgroundColor: e.main.fill,
                    border: "1px solid " + e.main.border,
                    boxShadow: "rgba(0, 0, 0, 0.1) 0px 0px 4px",
                    borderRadius: 4,
                    left: "auto",
                    top: -1e4,
                    zIndex: -9999999999999,
                    position: "absolute",
                    pointerEvents: "auto"
                };
                "ie" !== ee.Browser.type || "ie" === ee.Browser.type && 8 !== ee.Browser.version ? (t.transition = "opacity 0.15s ease-out",
                    t.opacity = 0,
                    t.visibility = "hidden") : t.display = "none",
                    this.$container.css(t),
                    this.$wrapper.css({
                        position: "relative",
                        zIndex: 1
                    }),
                    this.$overlay.css({
                        width: "100%",
                        height: "100%",
                        position: "fixed",
                        pointerEvents: "none",
                        top: 0,
                        left: 0,
                        zIndex: 0,
                        backgroundColor: e.main.fill,
                        opacity: .05
                    }),
                    this.$arrow.css({
                        borderWidth: 11,
                        position: "absolute",
                        pointerEvents: "none",
                        marginTop: -11,
                        zIndex: 1,
                        right: "100%"
                    }),
                    this.$arrow.fg.css({
                        borderWidth: 10,
                        borderStyle: "solid",
                        borderColor: "transparent rgb(255, 255, 255) transparent transparent",
                        position: "relative",
                        top: 10,
                        zIndex: 1
                    }),
                    this.$arrow.bg.css({
                        borderWidth: 11,
                        borderStyle: "solid",
                        borderColor: "transparent " + e.main.border + " transparent transparent",
                        position: "relative",
                        top: -11,
                        zIndex: 0
                    }),
                    this.$iframe.css({
                        border: 0,
                        zIndex: 2e9,
                        position: "relative"
                    })
            }
        }
        ,
        Bn.prototype.setup = function(e) {
            return this.chat.send("create-challenge", e)
        }
        ,
        Bn.prototype.sendTranslation = function(e) {
            var t = {
                locale: e,
                table: wt.getTable(e) || {}
            };
            this.chat && this.chat.send("challenge-translate", t),
                this.translate()
        }
        ,
        Bn.prototype.translate = function() {
            this.$iframe.dom.title = wt.translate("Main content of the hCaptcha challenge")
        }
        ,
        Bn.prototype.isVisible = function() {
            return this._visible
        }
        ,
        Bn.prototype.getDimensions = function(e, t) {
            return this._visible ? this.chat.contact("resize-challenge", {
                width: e,
                height: t
            }) : Promise.resolve(null)
        }
        ,
        Bn.prototype.show = function() {
            if (!0 !== this._visible)
                if (this._visible = !0,
                    this._hasCustomContainer)
                    this._showIframe();
                else {
                    var e = {
                        zIndex: 9999999999999,
                        display: "block"
                    };
                    ("ie" !== ee.Browser.type || "ie" === ee.Browser.type && 8 !== ee.Browser.version) && (e.opacity = 1,
                        e.visibility = "visible"),
                        this.$container.css(e),
                        this.$container.removeAttribute("aria-hidden"),
                        this.$overlay.css({
                            pointerEvents: "auto",
                            cursor: "pointer"
                        })
                }
        }
        ,
        Bn.prototype.focus = function() {
            this.$iframe.dom.focus()
        }
        ,
        Bn.prototype.close = function(e) {
            if (!1 !== this._visible) {
                if (this._visible = !1,
                    this._hasCustomContainer)
                    return this._hideIframe(),
                        void this.chat.send("close-challenge", {
                            event: e
                        });
                var t = {
                    left: "auto",
                    top: -1e4,
                    zIndex: -9999999999999
                };
                "ie" !== ee.Browser.type || "ie" === ee.Browser.type && 8 !== ee.Browser.version ? (t.opacity = 0,
                    t.visibility = "hidden") : t.display = "none",
                    this.$container.css(t),
                this._hasCustomContainer || this.$overlay.css({
                    pointerEvents: "none",
                    cursor: "default"
                }),
                    this.chat.send("close-challenge", {
                        event: e
                    }),
                    this.$container.setAttribute("aria-hidden", !0)
            }
        }
        ,
        Bn.prototype.size = function(e, t, n) {
            this.width = e,
                this.height = t,
                this.mobile = n,
                this.$iframe.css({
                    width: e,
                    height: t
                }),
            this._hasCustomContainer || (this.$wrapper.css({
                width: e,
                height: t
            }),
                n ? this.$overlay.css({
                    opacity: .5
                }) : this.$overlay.css({
                    opacity: .05
                }))
        }
        ,
        Bn.prototype.position = function(e) {
            if (!this._hasCustomContainer && e) {
                var t = 10
                    , n = window.document.documentElement
                    , r = ee.Browser.scrollY()
                    , i = ee.Browser.width()
                    , o = ee.Browser.height()
                    , a = this.mobile || "invisible" === this.config.size || e.offset.left + e.tick.x <= e.tick.width / 2
                    , s = Math.round(e.bounding.top) + r !== e.offset.top
                    , c = a ? (i - this.width) / 2 : e.bounding.left + e.tick.right + 10;
                (c + this.width + t > i || c < 0) && (c = (i - this.width) / 2,
                    a = !0);
                var l = (n.scrollHeight < n.clientHeight ? n.clientHeight : n.scrollHeight) - this.height - t
                    , h = a ? (o - this.height) / 2 + r : e.bounding.top + e.tick.y + r - this.height / 2;
                s && h < r && (h = r + t),
                s && h + this.height >= r + o && (h = r + o - (this.height + t)),
                    h = Math.max(Math.min(h, l), 10);
                var u = e.bounding.top + e.tick.y + r - h - 10
                    , p = this.height - 10 - 30;
                u = Math.max(Math.min(u, p), t),
                    this.$container.css({
                        left: c,
                        top: h
                    }),
                    this.$arrow.fg.css({
                        display: a ? "none" : "block"
                    }),
                    this.$arrow.bg.css({
                        display: a ? "none" : "block"
                    }),
                    this.$arrow.css({
                        top: u
                    }),
                    this.top = h,
                    this.$container.dom.getBoundingClientRect()
            }
        }
        ,
        Bn.prototype.destroy = function() {
            this._timeoutFailedToInitialize && (clearTimeout(this._timeoutFailedToInitialize),
                this._timeoutFailedToInitialize = null),
            this._visible && this.close.call(this),
                wn.removeChat(this.chat),
                this.chat = this.chat.destroy(),
                this._hasCustomContainer ? this._parent.removeChild(this.$iframe.dom) : (this._parent.removeChild(this.$container.dom),
                    this.$container = this.$container.__destroy()),
                this.$iframe = this.$iframe.__destroy()
        }
        ,
        Bn.prototype.setReady = function() {
            var e;
            this._timeoutFailedToInitialize && (clearTimeout(this._timeoutFailedToInitialize),
                this._timeoutFailedToInitialize = null),
            this.chat && this.chat.setReady(!0),
                this.ready = !0;
            for (var t = this.listeners.length; --t > -1; )
                e = this.listeners[t],
                    this.listeners.splice(t, 1),
                    e()
        }
        ,
        Bn.prototype.onReady = function(e) {
            var t = Array.prototype.slice.call(arguments, 1)
                , n = function() {
                e.apply(null, t)
            };
            this.ready ? n() : this.listeners.push(n)
        }
        ,
        Bn.prototype.onOverlayClick = function(e) {
            this._hasCustomContainer || this.$overlay.addEventListener("click", e)
        }
        ,
        Bn.prototype.setData = function(e) {
            this.chat && this.chat.send("challenge-data", e)
        }
    ;
    function Zn(e, t, n) {
        var r = this;
        this.id = t,
            this.response = null,
            this.location = {
                tick: null,
                offset: null,
                bounding: null
            },
            this.config = n,
            this._ticked = !0,
            this.$container = e instanceof pt ? e : new pt(e),
            this._host = ye.host || window.location.hostname,
            this.$iframe = new pt("iframe");
        var i = ye.assetUrl;
        ve.assethost && (i = ve.assethost + ye.assetUrl.replace(ye.assetDomain, ""));
        var o = i.match(/^.+\:\/\/[^\/]+/)
            , a = o ? o[0] : null
            , s = i + "/hcaptcha.html#frame=checkbox&id=" + this.id + "&host=" + this._host + (n ? "&" + Je(this.config) : "");
        this.chat = wn.createChat(this.$iframe.dom, t, a),
            this.chat.setReady(!1),
            this._timeoutFailedToInitialize = setTimeout((function() {
                    r.$iframe && r.$iframe.isConnected() ? Ae("Failed to initialize. Iframe attached", "error", "frame:checkbox", {
                        contentWindow: !!r.$iframe.dom.contentWindow,
                        iframeSrc: s
                    }) : Ae("Failed to initialize. Iframe detached", "error", "frame:checkbox")
                }
            ), 6e4),
            this.$iframe.dom.src = s,
            this.$iframe.dom.tabIndex = this.config.tabindex || 0,
            this.$iframe.dom.frameBorder = "0",
            this.$iframe.dom.scrolling = "no",
        ee.Browser.supportsPST() && (this.$iframe.dom.allow = "private-state-token-issuance 'src'; private-state-token-redemption 'src'"),
            this.translate(),
        this.config.size && "invisible" === this.config.size && this.$iframe.setAttribute("aria-hidden", "true"),
            this.$iframe.setAttribute("data-hcaptcha-widget-id", t),
            this.$iframe.setAttribute("data-hcaptcha-response", ""),
            this.$container.appendElement(this.$iframe),
        "off" !== ve.recaptchacompat && (this.$textArea0 = this.$container.createElement("textarea", "#g-recaptcha-response-" + t),
            this.$textArea0.dom.name = "g-recaptcha-response",
            this.$textArea0.css({
                display: "none"
            })),
            this.$textArea1 = this.$container.createElement("textarea", "#h-captcha-response-" + t),
            this.$textArea1.dom.name = "h-captcha-response",
            this.$textArea1.css({
                display: "none"
            }),
            this.ready = new Promise((function(e) {
                    r.chat.listen("checkbox-ready", e)
                }
            )).then((function() {
                    r._timeoutFailedToInitialize && (clearTimeout(r._timeoutFailedToInitialize),
                        r._timeoutFailedToInitialize = null),
                    r.chat && r.chat.setReady(!0)
                }
            )),
            this.clearLoading = this.clearLoading.bind(this),
            this.style()
    }
    function In(e, t, n) {
        this.id = t,
            this.response = null,
            this.location = {
                tick: null,
                offset: null,
                bounding: null
            },
            this.config = n,
            this.$container = e instanceof pt ? e : new pt(e),
            this.$iframe = new pt("iframe"),
            this.$iframe.setAttribute("aria-hidden", "true"),
            this.$iframe.css({
                display: "none"
            }),
            this.$iframe.setAttribute("data-hcaptcha-widget-id", t),
            this.$iframe.setAttribute("data-hcaptcha-response", "");
        var r = ye.assetUrl;
        ve.assethost && (r = ve.assethost + ye.assetUrl.replace(ye.assetDomain, "")),
            this.$iframe.dom.src = r + "/hcaptcha.html#frame=checkbox-invisible",
            this.$container.appendElement(this.$iframe),
        "off" !== ve.recaptchacompat && (this.$textArea0 = this.$container.createElement("textarea", "#g-recaptcha-response-" + t),
            this.$textArea0.dom.name = "g-recaptcha-response",
            this.$textArea0.css({
                display: "none"
            })),
            this.$textArea1 = this.$container.createElement("textarea", "#h-captcha-response-" + t),
            this.$textArea1.dom.name = "h-captcha-response",
            this.$textArea1.css({
                display: "none"
            })
    }
    function Dn(e, t, n) {
        if (!n.sitekey)
            throw new dn;
        this.id = t,
            this.visible = !1,
            this.overflow = {
                override: !1,
                cssUsed: !0,
                value: null,
                scroll: 0
            },
            this.onError = null,
            this.onPass = null,
            this.onExpire = null,
            this.onChalExpire = null,
            this.onOpen = null,
            this.onClose = null,
            this._ready = !1,
            this._active = !1,
            this._listeners = [],
            this.config = n,
        jn.indexOf(n.theme) >= 0 && Fn.use(n.theme),
            this._state = {
                escaped: !1,
                passed: !1,
                expiredChallenge: !1,
                expiredResponse: !1
            },
            this._origData = null,
            this._langSet = !1,
            this._promise = null,
            this._responseTimer = null,
            this.initChallenge = this.initChallenge.bind(this),
            this.closeChallenge = this.closeChallenge.bind(this),
            this.displayChallenge = this.displayChallenge.bind(this),
            this.getGetCaptchaManifest = this.getGetCaptchaManifest.bind(this),
            this.challenge = new Bn(t,n),
            "invisible" === this.config.size ? (je("Invisible mode is set", "hCaptcha", "info"),
                this.checkbox = new In(e,t,n)) : this.checkbox = new Zn(e,t,n)
    }
    function Hn(e) {
        if ("en" === e)
            return Promise.resolve();
        var t = e + ".json";
        return new Promise((function(n, r) {
                jt(t).then((function(n) {
                        return n || Pt(t, {
                            prefix: "https://newassets.hcaptcha.com/captcha/v1/9a41d3881922d1586e8d301c084c4ad106878568/static/i18n"
                        }).then((function(t) {
                                return wt.addTable(e, t.data),
                                    t
                            }
                        ))
                    }
                )).then((function(e) {
                        n(e.data)
                    }
                ))["catch"]((function(e) {
                        r(e)
                    }
                ))
            }
        ))
    }
    Zn.prototype.setResponse = function(e) {
        this.response = e,
            this.$iframe.dom.setAttribute("data-hcaptcha-response", e),
        "off" !== ve.recaptchacompat && (this.$textArea0.dom.value = e),
            this.$textArea1.dom.value = e
    }
        ,
        Zn.prototype.style = function() {
            var e = this.config.size;
            switch (this.$iframe.css({
                pointerEvents: "auto",
                backgroundColor: "rgba(255,255,255,0)",
                borderRadius: 4
            }),
                e) {
                case "compact":
                    this.$iframe.css({
                        width: 158,
                        height: 138
                    });
                    break;
                case "invisible":
                    this.$iframe.css({
                        display: "none"
                    });
                    break;
                default:
                    this.$iframe.css({
                        width: 302,
                        height: 76,
                        overflow: "hidden"
                    })
            }
        }
        ,
        Zn.prototype.reset = function() {
            this._ticked = !1,
            this.$iframe && this.$iframe.dom.contentWindow && this.chat && this.chat.send("checkbox-reset")
        }
        ,
        Zn.prototype.clearLoading = function() {
            this.chat && this.chat.send("checkbox-clear")
        }
        ,
        Zn.prototype.sendTranslation = function(e) {
            var t = {
                locale: e,
                table: wt.getTable(e) || {}
            };
            this.chat && this.chat.send("checkbox-translate", t),
                this.translate()
        }
        ,
        Zn.prototype.translate = function() {
            this.$iframe.dom.title = wt.translate("Widget containing checkbox for hCaptcha security challenge")
        }
        ,
        Zn.prototype.status = function(e, t) {
            this.$iframe && this.$iframe.dom.contentWindow && this.chat && this.chat.send("checkbox-status", {
                text: e || null,
                a11yOnly: t || !1
            })
        }
        ,
        Zn.prototype.tick = function() {
            this._ticked = !0,
            this.chat && this.chat.send("checkbox-tick")
        }
        ,
        Zn.prototype.getTickLocation = function() {
            return this.chat.contact("checkbox-location")
        }
        ,
        Zn.prototype.getOffset = function() {
            var e = this.$iframe.dom;
            e.offsetParent || (e = e.parentElement);
            for (var t = 0, n = 0; e; )
                t += e.offsetLeft,
                    n += e.offsetTop,
                    e = e.offsetParent;
            return {
                top: n,
                left: t
            }
        }
        ,
        Zn.prototype.getBounding = function() {
            return this.$iframe.dom.getBoundingClientRect()
        }
        ,
        Zn.prototype.destroy = function() {
            this._timeoutFailedToInitialize && (clearTimeout(this._timeoutFailedToInitialize),
                this._timeoutFailedToInitialize = null),
            this._ticked && this.reset(),
                wn.removeChat(this.chat),
                this.chat = this.chat.destroy(),
                this.$container.removeElement(this.$iframe),
                this.$container.removeElement(this.$textArea1),
            "off" !== ve.recaptchacompat && (this.$container.removeElement(this.$textArea0),
                this.$textArea0 = this.$textArea0.__destroy()),
                this.$textArea1 = this.$textArea1.__destroy(),
                this.$container = this.$container.__destroy(),
                this.$iframe = this.$iframe.__destroy()
        }
        ,
        In.prototype.setResponse = function(e) {
            this.response = e,
                this.$iframe.dom.setAttribute("data-hcaptcha-response", e),
            "off" !== ve.recaptchacompat && (this.$textArea0.dom.value = e),
                this.$textArea1.dom.value = e
        }
        ,
        In.prototype.reset = function() {}
        ,
        In.prototype.clearLoading = function() {}
        ,
        In.prototype.sendTranslation = function(e) {}
        ,
        In.prototype.status = function(e, t) {}
        ,
        In.prototype.tick = function() {}
        ,
        In.prototype.getTickLocation = function() {
            return Promise.resolve({
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                width: 0,
                height: 0,
                x: 0,
                y: 0
            })
        }
        ,
        In.prototype.getOffset = function() {
            var e = this.$iframe.dom;
            e.offsetParent || (e = e.parentElement);
            for (var t = 0, n = 0; e; )
                t += e.offsetLeft,
                    n += e.offsetTop,
                    e = e.offsetParent;
            return {
                top: n,
                left: t
            }
        }
        ,
        In.prototype.getBounding = function() {
            return this.$iframe.dom.getBoundingClientRect()
        }
        ,
        In.prototype.destroy = function() {
            this._ticked && this.reset(),
                this.$container.removeElement(this.$iframe),
                this.$container.removeElement(this.$textArea1),
            "off" !== ve.recaptchacompat && (this.$container.removeElement(this.$textArea0),
                this.$textArea0 = this.$textArea0.__destroy()),
                this.$textArea1 = this.$textArea1.__destroy(),
                this.$container = this.$container.__destroy(),
                this.$iframe = this.$iframe.__destroy()
        }
        ,
        Dn.prototype._resetTimer = function() {
            null !== this._responseTimer && (clearTimeout(this._responseTimer),
                this._responseTimer = null)
        }
        ,
        Dn.prototype.initChallenge = function(e) {
            e || (e = {}),
                je("Initiate challenge", "hCaptcha", "info"),
                this._origData = e;
            var t = this.getGetCaptchaManifest()
                , n = e.charity || null
                , r = e.a11yChallenge || !1
                , i = e.link || null
                , o = e.action || ""
                , a = e.rqdata || null
                , s = e.errors || []
                , c = ee.Browser.width()
                , l = ee.Browser.height();
            this._active = !0,
                this._resetTimer(),
                this._resetState(),
                this.checkbox.setResponse(""),
                this.challenge.setup({
                    a11yChallenge: r,
                    manifest: t,
                    width: c,
                    height: l,
                    charity: n,
                    link: i,
                    action: o,
                    rqdata: a,
                    wdata: En(),
                    errors: s.concat(kn.collect())
                })
        }
        ,
        Dn.prototype.getGetCaptchaManifest = function() {
            var e = (this._origData || {}).manifest || null;
            return e || ((e = Object.create(null)).st = Date.now()),
                e.v = 1,
                e.topLevel = cn.getData(),
                e.session = gn.getSession(),
                e.widgetList = gn.getCaptchaIdList(),
                e.widgetId = this.id,
                e.href = window.location.href,
                e.prev = JSON.parse(JSON.stringify(this._state)),
                e
        }
        ,
        Dn.prototype.displayChallenge = function(e) {
            if (this._active) {
                var t = this;
                this.visible = !0;
                var n = this.checkbox
                    , r = this.challenge
                    , i = ee.Browser.height();
                if (!("ie" === ee.Browser.type && 8 === ee.Browser.version)) {
                    var o = window.getComputedStyle(document.body).getPropertyValue("overflow-y");
                    this.overflow.override = "hidden" === o,
                    this.overflow.override && (this.overflow.cssUsed = "" === document.body.style.overflow && "" === document.body.style.overflowY,
                    this.overflow.cssUsed || (this.overflow.value = "" === o ? "auto" : o),
                        this.overflow.scroll = ee.Browser.scrollY(),
                        document.body.style.overflowY = "auto")
                }
                return new Promise((function(o) {
                        n.status(),
                            n.getTickLocation().then((function(a) {
                                    if (t._active) {
                                        if (r.size(e.width, e.height, e.mobile),
                                            r.show(),
                                            n.clearLoading(),
                                            n.location.bounding = n.getBounding(),
                                            n.location.tick = a,
                                            n.location.offset = n.getOffset(),
                                            r.position(n.location),
                                            r.focus(),
                                        r.height > window.document.documentElement.clientHeight)
                                            (window.document.scrollingElement || document.getElementsByTagName("html")[0]).scrollTop = Math.abs(r.height - i) + r.top;
                                        o()
                                    }
                                }
                            ))
                    }
                )).then((function() {
                        je("Challenge is displayed", "hCaptcha", "info"),
                        t.onOpen && tt(t.onOpen)
                    }
                ))
            }
        }
        ,
        Dn.prototype.resize = function(e, t, n) {
            var r = this
                , i = this.checkbox
                , o = this.challenge;
            o.getDimensions(e, t).then((function(e) {
                    e && o.size(e.width, e.height, e.mobile),
                        i.location.bounding = i.getBounding(),
                        i.location.offset = i.getOffset(),
                    ee.System.mobile && !n || o.position(i.location)
                }
            ))["catch"]((function(e) {
                    r.closeChallenge.call(r, {
                        event: le,
                        message: "Captcha resize caused error.",
                        error: e
                    })
                }
            ))
        }
        ,
        Dn.prototype.position = function() {
            var e = this.checkbox
                , t = this.challenge;
            ee.System.mobile || (e.location.bounding = e.getBounding(),
                t.position(e.location))
        }
        ,
        Dn.prototype.reset = function() {
            je("Captcha Reset", "hCaptcha", "info");
            try {
                this.checkbox.reset(),
                    this.checkbox.setResponse(""),
                    this._resetTimer(),
                    this._resetState()
            } catch (Xn) {
                Pe("hCaptcha", Xn)
            }
        }
        ,
        Dn.prototype._resetState = function() {
            for (var e in this._state)
                this._state[e] = !1
        }
        ,
        Dn.prototype.closeChallenge = function(e) {
            this.visible = !1,
                this._active = !1;
            var t = this
                , n = this.checkbox
                , r = this.challenge;
            this.overflow.override && ((window.document.scrollingElement || document.getElementsByTagName("html")[0]).scrollTop = this.overflow.scroll,
                this.overflow.override = !1,
                this.overflow.scroll = 0,
                document.body.style.overflowY = this.overflow.cssUsed ? null : this.overflow.value);
            var i = e.response || "";
            n.setResponse(i);
            var o = e.event;
            switch ("string" == typeof i && "" !== i || o !== te || (o = ne,
                Ae("Passed without response", "error", "api", e)),
                r.close(o),
                n.$iframe.dom.focus(),
                je("Challenge has closed", "hCaptcha", "info", {
                    event: o,
                    response: e.response,
                    message: e.message
                }),
                o) {
                case ne:
                    this._state.escaped = !0,
                        n.reset(),
                    t.onClose && tt(t.onClose),
                    t._promise && t._promise.reject(re);
                    break;
                case ie:
                    this._state.expiredChallenge = !0,
                        n.reset(),
                        n.status("hCaptcha window closed due to timeout.", !0),
                    t.onChalExpire && tt(t.onChalExpire),
                    t._promise && t._promise.reject(ie);
                    break;
                case le:
                case ae:
                case ce:
                    var a = o;
                    n.reset(),
                        o === ce ? (n.status(e.message),
                            429 === e.status ? a = se : "invalid-data" === e.message ? a = oe : "client-fail" === e.message && (a = le)) : o === ae ? a = le : o === le && "Answers are incomplete" === e.message && (a = he),
                        Ae("Failed to execute", "error", "hCaptcha", {
                            error: a,
                            event: o,
                            message: e.message
                        }),
                    this.onError && tt(this.onError, a),
                    t._promise && t._promise.reject(a);
                    break;
                case te:
                    this._state.passed = !0,
                        n.tick(),
                    this.onPass && tt(this.onPass, i),
                    t._promise && t._promise.resolve({
                        response: i,
                        key: vn(this.id)
                    }),
                    "number" == typeof e.expiration && (t._resetTimer(),
                        t._responseTimer = setTimeout((function() {
                                try {
                                    n.$iframe && (n.$iframe.dom.contentWindow ? (n.reset(),
                                        n.setResponse(""),
                                        n.status("hCaptcha security token has expired. Please complete the challenge again.", !0)) : _n(t.id))
                                } catch ($n) {
                                    Pe("global", $n)
                                }
                                t.onExpire && tt(t.onExpire),
                                    t._responseTimer = null,
                                    t._state.expiredResponse = !0
                            }
                        ), 1e3 * e.expiration))
            }
            t._promise = null
        }
        ,
        Dn.prototype.updateTranslation = function(e) {
            this.config.hl = e,
                this._langSet = !0,
            this.checkbox && this.checkbox.sendTranslation(e),
            this.challenge && this.challenge.sendTranslation(e)
        }
        ,
        Dn.prototype.isLangSet = function() {
            return this._langSet
        }
        ,
        Dn.prototype.isReady = function() {
            return this._ready
        }
        ,
        Dn.prototype.setReady = function(e) {
            if (this._ready = e,
                this._ready) {
                var t;
                je("Instance is ready", "hCaptcha", "info");
                for (var n = this._listeners.length; --n > -1; )
                    t = this._listeners[n],
                        this._listeners.splice(n, 1),
                        t()
            }
        }
        ,
        Dn.prototype.setPromise = function(e) {
            this._promise = e
        }
        ,
        Dn.prototype.onReady = function(e) {
            var t = Array.prototype.slice.call(arguments, 1)
                , n = function() {
                e.apply(null, t)
            };
            this._ready ? n() : this._listeners.push(n)
        }
        ,
        Dn.prototype.destroy = function() {
            (je("Captcha Destroy", "hCaptcha", "info"),
                this._resetTimer(),
                this.overflow.override) && ((window.document.scrollingElement || document.getElementsByTagName("html")[0]).scrollTop = this.overflow.scroll,
                this.overflow.override = !1,
                this.overflow.scroll = 0,
                document.body.style.overflowY = this.overflow.cssUsed ? null : this.overflow.value);
            this.challenge.destroy(),
                this.checkbox.destroy(),
                this.challenge = null,
                this.checkbox = null
        }
        ,
        Dn.prototype.setSiteConfig = function(e) {
            var t = this;
            if ("ok"in e) {
                var n = e.ok.features || {};
                if (this.config.themeConfig && n.custom_theme) {
                    var r = "custom-" + this.id;
                    Fn.add(r, Fn.extend(Fn.active(), this.config.themeConfig)),
                        Fn.use(r),
                        this.challenge.style()
                }
            }
            return "invisible" === this.config.size ? ("err"in e && console.error("[hCaptcha] " + e.err.message),
                Promise.resolve()) : this.checkbox.ready.then((function() {
                    return t.checkbox.chat.send("site-setup", e),
                        new Promise((function(e) {
                                t.checkbox.chat.listen("checkbox-loaded", (function() {
                                        e()
                                    }
                                ))
                            }
                        ))
                }
            ))
        }
    ;
    var Kn = 0
        , Ln = ["hl", "custom", "tplinks", "sitekey", "theme", "size", "tabindex", "challenge-container", "confirm-nav", "orientation", "mode"];
    function zn(e, t) {
        if (e)
            try {
                e.updateTranslation(t)
            } catch ($n) {
                Pe("translation", $n)
            }
    }
    function Jn(e, t) {
        return new Promise((function(n, r) {
                var i = setTimeout((function() {
                        r(new Error("timeout"))
                    }
                ), t);
                e.then((function(e) {
                        clearTimeout(i),
                            n(e)
                    }
                ))["catch"]((function(e) {
                        clearTimeout(i),
                            r(e)
                    }
                ))
            }
        ))
    }
    var Yn = {
        render: function(e, t) {
            if ("string" == typeof e && (e = document.getElementById(e)),
            e && 1 === e.nodeType)
                if (function(e) {
                    if (!e || !("challenge-container"in e))
                        return !0;
                    var t = e["challenge-container"];
                    return "string" == typeof t && (t = document.getElementById(t)),
                    !!t && 1 === t.nodeType
                }(t)) {
                    if (!1 !== wn.isSupported()) {
                        for (var n, r, i = e.getElementsByTagName("iframe"), o = -1; ++o < i.length && !n; )
                            (r = i[o].getAttribute("data-hcaptcha-widget-id")) && (n = !0);
                        if (n)
                            return console.error("Only one captcha is permitted per parent container."),
                                r;
                        je("Render instance", "hCaptcha", "info");
                        var a = nt(e, t)
                            , s = Kn++ + Math.random().toString(36).substr(2)
                            , c = Object.create(null);
                        c.sentry = ve.sentry,
                            c.reportapi = ve.reportapi,
                            c.recaptchacompat = ve.recaptchacompat,
                            c.custom = ve.custom,
                        null !== ve.language && (c.hl = wt.getLocale()),
                        ve.assethost && (c.assethost = ve.assethost),
                        ve.imghost && (c.imghost = ve.imghost),
                        ve.tplinks && (c.tplinks = ve.tplinks),
                        ve.se && (c.se = ve.se),
                        "off" === ve.pat && (c.pat = ve.pat),
                            c.pstissuer = ve.pstIssuer,
                        "landscape" === ve.orientation && (c.orientation = ve.orientation);
                        for (var l = 0; l < Ln.length; l++) {
                            var h = Ln[l];
                            h in a && (c[h] = a[h])
                        }
                        var u = ve.endpoint
                            , p = c.sitekey;
                        "78c843a4-f80d-4a14-b3e5-74b492762487" === p && (u = me),
                        u === fe && -1 === ["pt-BR", "es-BR"].indexOf(navigator.language) && Math.random() < .001 && p && -1 === p.indexOf("-0000-0000-0000-") && (u = me),
                        u !== fe && (c.endpoint = u),
                            c.theme = ve.theme;
                        var d = window.location
                            , f = d.origin || d.protocol + "//" + d.hostname + (d.port ? ":" + d.port : "");
                        if ("null" !== f && (c.origin = f),
                            a.theme)
                            try {
                                var m = a.theme;
                                "string" == typeof m && (m = JSON.parse(m)),
                                    c.themeConfig = m,
                                    c.custom = !0
                            } catch (Gn) {
                                c.theme = m
                            }
                        if (e instanceof HTMLButtonElement || e instanceof HTMLInputElement) {
                            var g = new pt("div",".h-captcha");
                            g.css({
                                display: "none"
                            });
                            for (var y = null, v = 0; v < e.attributes.length; v++)
                                (y = e.attributes[v]).name.startsWith("data-") && g.setAttribute(y.name, y.value);
                            var b = e.tagName.toLowerCase() + "[data-hcaptcha-widget-id='" + s + "']";
                            e.setAttribute("data-hcaptcha-widget-id", s),
                                g.setAttribute("data-hcaptcha-source-id", b),
                                e.parentNode.insertBefore(g.dom, e),
                                e.onclick = function(e) {
                                    return e.preventDefault(),
                                        je("User initiated", "hCaptcha", "info"),
                                        yn(s)
                                }
                                ,
                                e = g,
                                c.size = "invisible"
                        }
                        c.mode === ge && "invisible" === c.size && (console.warn("[hCaptcha] mode='auto' cannot be used in combination with size='invisible'."),
                            delete c.mode);
                        try {
                            var w = new Dn(e,s,c)
                        } catch ($n) {
                            var _ = "Your browser plugins or privacy policies are blocking the hCaptcha service. Please disable them for hCaptcha.com";
                            return $n instanceof dn && (_ = "hCaptcha has failed to initialize. Please see the developer tools console for more information.",
                                console.error($n.message)),
                                Ee(e, _),
                                void Pe("api", $n)
                        }
                        a.callback && (w.onPass = a.callback),
                        a["expired-callback"] && (w.onExpire = a["expired-callback"]),
                        a["chalexpired-callback"] && (w.onChalExpire = a["chalexpired-callback"]),
                        a["open-callback"] && (w.onOpen = a["open-callback"]),
                        a["close-callback"] && (w.onClose = a["close-callback"]),
                        a["error-callback"] && (w.onError = a["error-callback"]);
                        try {
                            cn.setData("inv", "invisible" === c.size),
                                cn.setData("size", c.size),
                                cn.setData("theme", ot(c.themeConfig || c.theme)),
                                cn.setData("pel", (e.outerHTML || "").replace(e.innerHTML, "")),
                                on.setData("inv", "invisible" === c.size),
                                on.setData("size", c.size),
                                on.setData("theme", ot(c.themeConfig || c.theme)),
                                on.setData("pel", (e.outerHTML || "").replace(e.innerHTML, ""))
                        } catch (Xn) {
                            Pe("api", Xn)
                        }
                        return function(e, t) {
                            if ("invisible" === t.size)
                                return;
                            e.checkbox.chat.listen("checkbox-selected", (function(t) {
                                    je("User initiated", "hCaptcha", "info");
                                    var n = "enter" === t.action ? "kb" : "m";
                                    cn.setData("exec", n),
                                        on.setData("exec", n),
                                        Jn(rn(), 100)["finally"]((function() {
                                                e.onReady(e.initChallenge, t)
                                            }
                                        ))["catch"]((function(e) {
                                                Pe("submitvm", e)
                                            }
                                        ))
                                }
                            )),
                                e.checkbox.chat.listen("checkbox-loaded", (function(n) {
                                        je("Loaded", "frame:checkbox", "info"),
                                            e.checkbox.location.bounding = e.checkbox.getBounding(),
                                            e.checkbox.location.tick = n,
                                            e.checkbox.location.offset = e.checkbox.getOffset(),
                                            e.checkbox.sendTranslation(t.hl)
                                    }
                                )),
                            t.mode === ge && e.onReady((function() {
                                    yn(e.id)
                                }
                            ), t)
                        }(w, c),
                            function(e, t) {
                                function n(t, n) {
                                    if (t.locale) {
                                        var r = wt.resolveLocale(t.locale);
                                        Hn(r).then((function() {
                                                n ? zn(e, r) : (wt.setLocale(r),
                                                    gn.each((function(e) {
                                                            zn(e, r)
                                                        }
                                                    )))
                                            }
                                        ))["catch"]((function(e) {
                                                Pe("api", e, {
                                                    locale: r
                                                })
                                            }
                                        ))
                                    }
                                }
                                e.challenge.chat.listen("site-setup", (function(t) {
                                        var n = e.setSiteConfig(t);
                                        e.challenge.onReady((function() {
                                                n.then((function() {
                                                        e.setReady(!0)
                                                    }
                                                ))
                                            }
                                        ))
                                    }
                                )),
                                    e.challenge.chat.listen("challenge-loaded", (function() {
                                            je("Loaded", "frame:challenge", "info"),
                                                e.challenge.setReady(),
                                                e.challenge.sendTranslation(t.hl)
                                        }
                                    )),
                                    e.challenge.chat.answer("challenge-ready", (function(t, n) {
                                            e.displayChallenge(t).then(n.resolve)
                                        }
                                    )),
                                    e.challenge.chat.listen("challenge-resize", (function() {
                                            var t = ee.Browser.width()
                                                , n = ee.Browser.height();
                                            e.resize(t, n)
                                        }
                                    )),
                                    e.challenge.chat.listen(re, (function(t) {
                                            cn.setData("lpt", Date.now()),
                                                on.setData("lpt", Date.now()),
                                                e.closeChallenge(t)
                                        }
                                    )),
                                    e.challenge.chat.answer("get-url", (function(e) {
                                            e.resolve(window.location.href)
                                        }
                                    )),
                                    e.challenge.chat.answer("getcaptcha-manifest", (function(t) {
                                            t.resolve(e.getGetCaptchaManifest())
                                        }
                                    )),
                                    e.challenge.chat.answer("check-api", (function(e) {
                                            Jn(rn(), 100)["finally"]((function() {
                                                    e.resolve(cn.getData())
                                                }
                                            ))["catch"]((function(e) {
                                                    Pe("submitvm", e)
                                                }
                                            ))
                                        }
                                    )),
                                    e.challenge.chat.listen("challenge-key", (function(t) {
                                            gn.pushSession(t.key, e.id)
                                        }
                                    )),
                                    e.challenge.onOverlayClick((function() {
                                            e.closeChallenge({
                                                event: ne
                                            })
                                        }
                                    )),
                                    e.challenge.chat.listen("challenge-language", n),
                                    n({
                                        locale: t.hl
                                    }, !0),
                                    e.challenge.chat.answer("get-ac", (function(e) {
                                            e.resolve(Ze.hasCookie("hc_accessibility"))
                                        }
                                    ))
                            }(w, c),
                            gn.add(w),
                            s
                    }
                    Ee(e, "Your browser is missing or has disabled Cross-Window Messaging. Please <a style='color:inherit;text-decoration:underline; font: inherit' target='_blank' href='https://www.whatismybrowser.com/guides/how-to-update-your-browser/auto'>upgrade your browser</a> or enable it for hCaptcha.com")
                } else
                    console.log("[hCaptcha] render: invalid challenge container '" + t["challenge-container"] + "'.");
            else
                console.log("[hCaptcha] render: invalid container '" + e + "'.")
        },
        reset: function(e) {
            var t;
            if (e) {
                if (!(t = gn.getById(e)))
                    throw new un(e);
                t.reset()
            } else {
                if (!(t = gn.getByIndex(0)))
                    throw new pn;
                t.reset()
            }
        },
        remove: _n,
        execute: yn,
        getResponse: function(e) {
            var t, n;
            if ((n = e ? gn.getById(e) : gn.getByIndex(0)) && (t = n.checkbox.response || ""),
            void 0 !== t)
                return t;
            throw e ? new un(e) : new pn
        },
        getRespKey: vn,
        close: function(e) {
            var t = !1;
            if (!(t = e ? gn.getById(e) : gn.getByIndex(0)))
                throw e ? new un(e) : new pn;
            t.closeChallenge({
                event: ne
            })
        },
        setData: function(e, t) {
            if ("object" != typeof e || t || (t = e,
                e = null),
            !t || "object" != typeof t)
                throw Error("[hCaptcha] invalid data supplied");
            var n = !1;
            if (!(n = e ? gn.getById(e) : gn.getByIndex(0)))
                throw e ? new un(e) : new pn;
            je("Set data", "hCaptcha", "info");
            var r = n.challenge.setData.bind(n.challenge);
            n.onReady(r, t)
        },
        nodes: gn
    };
    !function(e) {
        sn(0),
            ye.file = "hcaptcha";
        var t = document.currentScript
            , n = !1
            , r = !1
            , i = "on"
            , o = ee.Browser.width() / ee.Browser.height()
            , a = !(!window.hcaptcha || !window.hcaptcha.render);
        function s() {
            var e = ee.Browser.width()
                , t = ee.Browser.height()
                , n = ee.System.mobile && o !== e / t;
            o = e / t,
                h(),
                Yn.nodes.each((function(r) {
                        r.visible && r.resize(e, t, n)
                    }
                ))
        }
        function c(e) {
            l(),
                Yn.nodes.each((function(e) {
                        e.visible && e.position()
                    }
                ))
        }
        function l() {
            var e = [ee.Browser.scrollX(), ee.Browser.scrollY(), document.documentElement.clientWidth / ee.Browser.width(), Date.now()];
            cn.circBuffPush("xy", e),
                on.setData("xy", e)
        }
        function h() {
            var e = [ee.Browser.width(), ee.Browser.height(), ee.System.dpr(), Date.now()];
            cn.circBuffPush("wn", e)
        }
        window.hcaptcha = {
            render: function() {
                return a || console.warn("[hCaptcha] should not render before js api is fully loaded. `render=explicit` should be used in combination with `onload`."),
                    Yn.render.apply(this, arguments)
            },
            remove: Yn.remove,
            execute: Yn.execute,
            reset: Yn.reset,
            close: Yn.close,
            setData: Yn.setData,
            getResponse: Yn.getResponse,
            getRespKey: Yn.getRespKey
        },
            kn.run(),
            function(e) {
                var t = Array.prototype.slice.call(arguments, 1);
                !0 !== Zt && "interactive" !== document.readyState && "loaded" !== document.readyState && "complete" !== document.readyState ? (Ft.push({
                    fn: e,
                    args: t
                }),
                !1 === Bt && It()) : setTimeout((function() {
                        e(t)
                    }
                ), 1)
            }((function() {
                    !function() {
                        var o;
                        o = t ? [t] : document.getElementsByTagName("script");
                        var a = -1
                            , s = !1
                            , c = null
                            , l = null;
                        for (; ++a < o.length && !1 === s; )
                            o[a] && o[a].src && (l = (c = o[a].src.split("?"))[0],
                            /\/(hcaptcha|1\/api)\.js$/.test(l) && (s = o[a],
                            l && -1 !== l.toLowerCase().indexOf("www.") && console.warn("[hCaptcha] JS API is being loaded from www.hcaptcha.com. Please use https://js.hcaptcha.com/1/api.js")));
                        if (!1 === s)
                            return;
                        e = e || ze(c[1]),
                            n = e.onload || !1,
                            r = e.render || !1,
                        "off" === e.tplinks && (i = "off");
                        ve.tplinks = i,
                            ve.language = e.hl || null,
                        e.endpoint && (ve.endpoint = e.endpoint);
                        ve.reportapi = e.reportapi || ve.reportapi,
                            ve.imghost = e.imghost || null,
                            ve.custom = e.custom || ve.custom,
                            ve.se = e.se || null,
                            ve.pat = e.pat || ve.pat,
                            ve.pstIssuer = e.pstissuer || ve.pstIssuer,
                            ve.orientation = e.orientation || null,
                        e.assethost && (it.URL(e.assethost) ? ve.assethost = e.assethost : console.error("Invalid assethost uri."));
                        ve.recaptchacompat = e.recaptchacompat || ve.recaptchacompat,
                            ye.host = e.host || window.location.hostname,
                            ve.sentry = !1 !== e.sentry,
                            Ne(!1),
                            ve.language = ve.language || window.navigator.userLanguage || window.navigator.language,
                            wt.setLocale(ve.language),
                            "off" === ve.recaptchacompat ? console.log("recaptchacompat disabled") : window.grecaptcha = window.hcaptcha
                    }(),
                    n && setTimeout((function() {
                            tt(n)
                        }
                    ), 1),
                    a || (a = !0,
                        function() {
                            var e = wt.getLocale();
                            if ("en" === e)
                                return;
                            Hn(e).then((function() {
                                    Yn.nodes.each((function(t) {
                                            if (t)
                                                try {
                                                    t.isLangSet() || t.updateTranslation(e)
                                                } catch ($n) {
                                                    Pe("translation", $n)
                                                }
                                        }
                                    ))
                                }
                            ))["catch"]((function(t) {
                                    Pe("api", t, {
                                        locale: e
                                    })
                                }
                            ))
                        }(),
                        !1 === r || "onload" === r ? ke(Yn.render) : "explicit" !== r && console.log("hcaptcha: invalid render parameter '" + r + "', using 'explicit' instead."),
                        function() {
                            try {
                                cn.record(),
                                    on.record({
                                        pointer: !0,
                                        keys: !0,
                                        touch: !0,
                                        motion: !1
                                    }),
                                    cn.setData("sc", ee.Browser.getScreenDimensions()),
                                    cn.setData("or", ee.Browser.getOrientation()),
                                    cn.setData("wi", ee.Browser.getWindowDimensions()),
                                    cn.setData("nv", ee.Browser.interrogateNavigator()),
                                    cn.setData("dr", document.referrer),
                                    on.setData("sc", ee.Browser.getScreenDimensions()),
                                    on.setData("wi", ee.Browser.getWindowDimensions()),
                                    on.setData("or", ee.Browser.getOrientation()),
                                    on.setData("dr", document.referrer),
                                    h(),
                                    l()
                            } catch ($n) {
                                Pe("motion", $n)
                            }
                        }(),
                        function() {
                            try {
                                an.record({
                                    1: !1,
                                    2: !0,
                                    3: !0,
                                    4: !0,
                                    5: !0,
                                    6: !0
                                })
                            } catch ($n) {
                                Pe("bi-vm", $n)
                            }
                        }(),
                        Kt.addEventListener("resize", s),
                        Kt.addEventListener("scroll", c))
                }
            ))
    }()
}();
