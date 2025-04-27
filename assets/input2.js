/* https://hcaptcha.com/license */
!function () {
    "use strict";

    function t(t) {
        var e = this.constructor;
        return this.then(function (i) {
            return e.resolve(t()).then(function () {
                return i;
            });
        }, function (i) {
            return e.resolve(t()).then(function () {
                return e.reject(i);
            });
        });
    }
    function e(t) {
        return new this(function (e, i) {
            if (!t || "undefined" == typeof t.length) {
                return i(new TypeError(typeof t + " " + t + " is not iterable(cannot read property Symbol(Symbol.iterator))"));
            }
            var n = Array.prototype.slice.call(t);
            if (0 === n.length) {
                return e([]);
            }
            var r = n.length;
            function o(t, i) {
                if (i && ("object" == typeof i || "function" == typeof i)) {
                    var s = i.then;
                    if ("function" == typeof s) {
                        return void s.call(i, function (e) {
                            o(t, e);
                        }, function (i) {
                            n[t] = {
                                status: "rejected",
                                reason: i
                            };
                            0 == --r && e(n);
                        });
                    }
                }
                n[t] = {
                    status: "fulfilled",
                    value: i
                };
                0 == --r && e(n);
            }
            for (var s = 0; s < n.length; s++) {
                o(s, n[s]);
            }
        });
    }
    var i = setTimeout;
    var n = "undefined" != typeof setImmediate ? setImmediate : null;
    function r(t) {
        return Boolean(t && "undefined" != typeof t.length);
    }
    function o() {}
    function s(t) {
        if (!(this instanceof s)) {
            throw new TypeError("Promises must be constructed via new");
        }
        if ("function" != typeof t) {
            throw new TypeError("not a function");
        }
        this._state = 0;
        this._handled = !1;
        this._value = undefined;
        this._deferreds = [];
        f(t, this);
    }
    function a(t, e) {
        for (; 3 === t._state;) {
            t = t._value;
        }
        0 !== t._state ? (t._handled = !0, s._immediateFn(function () {
            var i = 1 === t._state ? e.onFulfilled : e.onRejected;
            if (null !== i) {
                var n;
                try {
                    n = i(t._value);
                } catch (r) {
                    return void c(e.promise, r);
                }
                l(e.promise, n);
            } else {
                (1 === t._state ? l : c)(e.promise, t._value);
            }
        })) : t._deferreds.push(e);
    }
    function l(t, e) {
        try {
            if (e === t) {
                throw new TypeError("A promise cannot be resolved with itself.");
            }
            if (e && ("object" == typeof e || "function" == typeof e)) {
                var i = e.then;
                if (e instanceof s) {
                    t._state = 3;
                    t._value = e;
                    return void h(t);
                }
                if ("function" == typeof i) {
                    return void f((n = i, r = e, function () {
                        n.apply(r, arguments);
                    }), t);
                }
            }
            t._state = 1;
            t._value = e;
            h(t);
        } catch (o) {
            c(t, o);
        }
        var n;
        var r;
    }
    function c(t, e) {
        t._state = 2;
        t._value = e;
        h(t);
    }
    function h(t) {
        2 === t._state && 0 === t._deferreds.length && s._immediateFn(function () {
            t._handled || s._unhandledRejectionFn(t._value);
        });
        for (var e = 0, i = t._deferreds.length; e < i; e++) {
            a(t, t._deferreds[e]);
        }
        t._deferreds = null;
    }
    function u(t, e, i) {
        this.onFulfilled = "function" == typeof t ? t : null;
        this.onRejected = "function" == typeof e ? e : null;
        this.promise = i;
    }
    function f(t, e) {
        var i = !1;
        try {
            t(function (t) {
                i || (i = !0, l(e, t));
            }, function (t) {
                i || (i = !0, c(e, t));
            });
        } catch (n) {
            if (i) {
                return;
            }
            i = !0;
            c(e, n);
        }
    }
    s.prototype["catch"] = function (t) {
        return this.then(null, t);
    };
    s.prototype.then = function (t, e) {
        var i = new this.constructor(o);
        a(this, new u(t, e, i));
        return i;
    };
    s.prototype["finally"] = t;
    s.all = function (t) {
        return new s(function (e, i) {
            if (!r(t)) {
                return i(new TypeError("Promise.all accepts an array"));
            }
            var n = Array.prototype.slice.call(t);
            if (0 === n.length) {
                return e([]);
            }
            var o = n.length;
            function s(t, r) {
                try {
                    if (r && ("object" == typeof r || "function" == typeof r)) {
                        var a = r.then;
                        if ("function" == typeof a) {
                            return void a.call(r, function (e) {
                                s(t, e);
                            }, i);
                        }
                    }
                    n[t] = r;
                    0 == --o && e(n);
                } catch (l) {
                    i(l);
                }
            }
            for (var a = 0; a < n.length; a++) {
                s(a, n[a]);
            }
        });
    };
    s.allSettled = e;
    s.resolve = function (t) {
        return t && "object" == typeof t && t.constructor === s ? t : new s(function (e) {
            e(t);
        });
    };
    s.reject = function (t) {
        return new s(function (e, i) {
            i(t);
        });
    };
    s.race = function (t) {
        return new s(function (e, i) {
            if (!r(t)) {
                return i(new TypeError("Promise.race accepts an array"));
            }
            for (var n = 0, o = t.length; n < o; n++) {
                s.resolve(t[n]).then(e, i);
            }
        });
    };
    s._immediateFn = "function" == typeof n && function (t) {
        n(t);
    } || function (t) {
        i(t, 0);
    };
    s._unhandledRejectionFn = function (t) {
        "undefined" != typeof console && console && console.warn("Possible Unhandled Promise Rejection:", t);
    };
    var p = function () {
        if ("undefined" != typeof self) {
            return self;
        }
        if ("undefined" != typeof window) {
            return window;
        }
        if ("undefined" != typeof global) {
            return global;
        }
        throw new Error("unable to locate global object");
    }();
    function d(t, e, i) {
        return e <= t && t <= i;
    }
    function m(t) {
        if (t === undefined) {
            return {};
        }
        if (t === Object(t)) {
            return t;
        }
        throw TypeError("Could not convert argument to dictionary");
    }
    "function" != typeof p.Promise ? p.Promise = s : (p.Promise.prototype["finally"] || (p.Promise.prototype["finally"] = t), p.Promise.allSettled || (p.Promise.allSettled = e));
    function y(t) {
        return t >= 0 && t <= 127;
    }
    var g = -1;
    function b(t) {
        this.tokens = [].slice.call(t);
        this.tokens.reverse();
    }
    b.prototype = {
        endOfStream: function () {
            return !this.tokens.length;
        },
        read: function () {
            return this.tokens.length ? this.tokens.pop() : g;
        },
        prepend: function (t) {
            if (Array.isArray(t)) {
                for (var e = t; e.length;) {
                    this.tokens.push(e.pop());
                }
            } else {
                this.tokens.push(t);
            }
        },
        push: function (t) {
            if (Array.isArray(t)) {
                for (var e = t; e.length;) {
                    this.tokens.unshift(e.shift());
                }
            } else {
                this.tokens.unshift(t);
            }
        }
    };
    var v = -1;
    function w(t, e) {
        if (t) {
            throw TypeError("Decoder error");
        }
        return e || 65533;
    }
    function x(t) {
        t = String(t).trim().toLowerCase();
        return Object.prototype.hasOwnProperty.call(k, t) ? k[t] : null;
    }
    var k = {};
    [{
        encodings: [{
            labels: ["unicode-1-1-utf-8", "utf-8", "utf8"],
            name: "UTF-8"
        }],
        heading: "The Encoding"
    }].forEach(function (t) {
        t.encodings.forEach(function (t) {
            t.labels.forEach(function (e) {
                k[e] = t;
            });
        });
    });
    var _;
    var E = {
        "UTF-8": function (t) {
            return new M(t);
        }
    };
    var C = {
        "UTF-8": function (t) {
            return new A(t);
        }
    };
    var S = "utf-8";
    function V(t, e) {
        if (!(this instanceof V)) {
            throw TypeError("Called as a function. Did you forget 'new'?");
        }
        t = t !== undefined ? String(t) : S;
        e = m(e);
        this._encoding = null;
        this._decoder = null;
        this._ignoreBOM = !1;
        this._BOMseen = !1;
        this._error_mode = "replacement";
        this._do_not_flush = !1;
        var i = x(t);
        if (null === i || "replacement" === i.name) {
            throw RangeError("Unknown encoding: " + t);
        }
        if (!C[i.name]) {
            throw Error("Decoder not present. Did you forget to include encoding-indexes.js first?");
        }
        var n = this;
        n._encoding = i;
        e.fatal && (n._error_mode = "fatal");
        e.ignoreBOM && (n._ignoreBOM = !0);
        Object.defineProperty || (this.encoding = n._encoding.name.toLowerCase(), this.fatal = "fatal" === n._error_mode, this.ignoreBOM = n._ignoreBOM);
        return n;
    }
    function T(t, e) {
        if (!(this instanceof T)) {
            throw TypeError("Called as a function. Did you forget 'new'?");
        }
        e = m(e);
        this._encoding = null;
        this._encoder = null;
        this._do_not_flush = !1;
        this._fatal = e.fatal ? "fatal" : "replacement";
        var i = this;
        if (e.NONSTANDARD_allowLegacyEncoding) {
            var n = x(t = t !== undefined ? String(t) : S);
            if (null === n || "replacement" === n.name) {
                throw RangeError("Unknown encoding: " + t);
            }
            if (!E[n.name]) {
                throw Error("Encoder not present. Did you forget to include encoding-indexes.js first?");
            }
            i._encoding = n;
        } else {
            i._encoding = x("utf-8");
        }
        Object.defineProperty || (this.encoding = i._encoding.name.toLowerCase());
        return i;
    }
    function A(t) {
        var e = t.fatal;
        var i = 0;
        var n = 0;
        var r = 0;
        var o = 128;
        var s = 191;
        this.handler = function (t, a) {
            if (a === g && 0 !== r) {
                r = 0;
                return w(e);
            }
            if (a === g) {
                return v;
            }
            if (0 === r) {
                if (d(a, 0, 127)) {
                    return a;
                }
                if (d(a, 194, 223)) {
                    r = 1;
                    i = 31 & a;
                } else {
                    if (d(a, 224, 239)) {
                        224 === a && (o = 160);
                        237 === a && (s = 159);
                        r = 2;
                        i = 15 & a;
                    } else {
                        if (!d(a, 240, 244)) {
                            return w(e);
                        }
                        240 === a && (o = 144);
                        244 === a && (s = 143);
                        r = 3;
                        i = 7 & a;
                    }
                }
                return null;
            }
            if (!d(a, o, s)) {
                i = r = n = 0;
                o = 128;
                s = 191;
                t.prepend(a);
                return w(e);
            }
            o = 128;
            s = 191;
            i = i << 6 | 63 & a;
            if ((n += 1) !== r) {
                return null;
            }
            var l = i;
            i = r = n = 0;
            return l;
        };
    }
    function M(t) {
        t.fatal;
        this.handler = function (t, e) {
            if (e === g) {
                return v;
            }
            if (y(e)) {
                return e;
            }
            var i;
            var n;
            d(e, 128, 2047) ? (i = 1, n = 192) : d(e, 2048, 65535) ? (i = 2, n = 224) : d(e, 65536, 1114111) && (i = 3, n = 240);
            for (var r = [(e >> 6 * i) + n]; i > 0;) {
                var o = e >> 6 * (i - 1);
                r.push(128 | 63 & o);
                i -= 1;
            }
            return r;
        };
    }
    Object.defineProperty && (Object.defineProperty(V.prototype, "encoding", {
        get: function () {
            return this._encoding.name.toLowerCase();
        }
    }), Object.defineProperty(V.prototype, "fatal", {
        get: function () {
            return "fatal" === this._error_mode;
        }
    }), Object.defineProperty(V.prototype, "ignoreBOM", {
        get: function () {
            return this._ignoreBOM;
        }
    }));
    V.prototype.decode = function (t, e) {
        var i;
        i = "object" == typeof t && t instanceof ArrayBuffer ? new Uint8Array(t) : "object" == typeof t && "buffer" in t && t.buffer instanceof ArrayBuffer ? new Uint8Array(t.buffer, t.byteOffset, t.byteLength) : new Uint8Array(0);
        e = m(e);
        this._do_not_flush || (this._decoder = C[this._encoding.name]({
            fatal: "fatal" === this._error_mode
        }), this._BOMseen = !1);
        this._do_not_flush = Boolean(e.stream);
        var n;
        var r = new b(i);
        var o = [];
        for (;;) {
            var s = r.read();
            if (s === g) {
                break;
            }
            if ((n = this._decoder.handler(r, s)) === v) {
                break;
            }
            null !== n && (Array.isArray(n) ? o.push.apply(o, n) : o.push(n));
        }
        if (!this._do_not_flush) {
            do {
                if ((n = this._decoder.handler(r, r.read())) === v) {
                    break;
                }
                null !== n && (Array.isArray(n) ? o.push.apply(o, n) : o.push(n));
            } while (!r.endOfStream());
            this._decoder = null;
        }
        return function (t) {
            var e;
            var i;
            e = ["UTF-8", "UTF-16LE", "UTF-16BE"];
            i = this._encoding.name;
            -1 === e.indexOf(i) || this._ignoreBOM || this._BOMseen || (t.length > 0 && 65279 === t[0] ? (this._BOMseen = !0, t.shift()) : t.length > 0 && (this._BOMseen = !0));
            return function (t) {
                for (var e = "", i = 0; i < t.length; ++i) {
                    var n = t[i];
                    n <= 65535 ? e += String.fromCharCode(n) : (n -= 65536, e += String.fromCharCode(55296 + (n >> 10), 56320 + (1023 & n)));
                }
                return e;
            }(t);
        }.call(this, o);
    };
    Object.defineProperty && Object.defineProperty(T.prototype, "encoding", {
        get: function () {
            return this._encoding.name.toLowerCase();
        }
    });
    T.prototype.encode = function (t, e) {
        t = t === undefined ? "" : String(t);
        e = m(e);
        this._do_not_flush || (this._encoder = E[this._encoding.name]({
            fatal: "fatal" === this._fatal
        }));
        this._do_not_flush = Boolean(e.stream);
        var i;
        var n = new b(function (t) {
            for (var e = String(t), i = e.length, n = 0, r = []; n < i;) {
                var o = e.charCodeAt(n);
                if (o < 55296 || o > 57343) {
                    r.push(o);
                } else {
                    if (o >= 56320 && o <= 57343) {
                        r.push(65533);
                    } else {
                        if (o >= 55296 && o <= 56319) {
                            if (n === i - 1) {
                                r.push(65533);
                            } else {
                                var s = e.charCodeAt(n + 1);
                                if (s >= 56320 && s <= 57343) {
                                    var a = 1023 & o;
                                    var l = 1023 & s;
                                    r.push(65536 + (a << 10) + l);
                                    n += 1;
                                } else {
                                    r.push(65533);
                                }
                            }
                        }
                    }
                }
                n += 1;
            }
            return r;
        }(t));
        var r = [];
        for (;;) {
            var o = n.read();
            if (o === g) {
                break;
            }
            if ((i = this._encoder.handler(n, o)) === v) {
                break;
            }
            Array.isArray(i) ? r.push.apply(r, i) : r.push(i);
        }
        if (!this._do_not_flush) {
            for (; (i = this._encoder.handler(n, n.read())) !== v;) {
                Array.isArray(i) ? r.push.apply(r, i) : r.push(i);
            }
            this._encoder = null;
        }
        return new Uint8Array(r);
    };
    window.TextDecoder || (window.TextDecoder = V);
    window.TextEncoder || (window.TextEncoder = T);
    (function (t) {
        if ("function" != typeof Promise) {
            throw "Promise support required";
        }
        var e = t.crypto || t.msCrypto;
        if (e) {
            var i = e.subtle || e.webkitSubtle;
            if (i) {
                var n = t.Crypto || e.constructor || Object;
                var r = t.SubtleCrypto || i.constructor || Object;
                t.CryptoKey || t.Key;
                var o = t.navigator.userAgent.indexOf("Edge/") > -1;
                var s = !!t.msCrypto && !o;
                var a = !e.subtle && !!e.webkitSubtle;
                if (s || a) {
                    var l = {
                        KoZIhvcNAQEB: "1.2.840.113549.1.1.1"
                    };
                    var c = {
                        "1.2.840.113549.1.1.1": "KoZIhvcNAQEB"
                    };
                    ["generateKey", "importKey", "unwrapKey"].forEach(function (t) {
                        var n = i[t];
                        i[t] = function (r, o, l) {
                            var c;
                            var h;
                            var u;
                            var d;
                            var w = [].slice.call(arguments);
                            switch (t) {
                                case "generateKey":
                                    c = m(r);
                                    h = o;
                                    u = l;
                                    break;
                                case "importKey":
                                    c = m(l);
                                    h = w[3];
                                    u = w[4];
                                    "jwk" === r && ((o = g(o)).alg || (o.alg = y(c)), o.key_ops || (o.key_ops = "oct" !== o.kty ? "d" in o ? u.filter(C) : u.filter(E) : u.slice()), w[1] = b(o));
                                    break;
                                case "unwrapKey":
                                    c = w[4];
                                    h = w[5];
                                    u = w[6];
                                    w[2] = l._key;
                            }
                            if ("generateKey" === t && "HMAC" === c.name && c.hash) {
                                c.length = c.length || {
                                    "SHA-1": 512,
                                    "SHA-256": 512,
                                    "SHA-384": 1024,
                                    "SHA-512": 1024
                                }[c.hash.name];
                                return i.importKey("raw", e.getRandomValues(new Uint8Array(c.length + 7 >> 3)), c, h, u);
                            }
                            if (a && "generateKey" === t && "RSASSA-PKCS1-v1_5" === c.name && (!c.modulusLength || c.modulusLength >= 2048)) {
                                (r = m(r)).name = "RSAES-PKCS1-v1_5";
                                delete r.hash;
                                return i.generateKey(r, !0, ["encrypt", "decrypt"]).then(function (t) {
                                    return Promise.all([i.exportKey("jwk", t.publicKey), i.exportKey("jwk", t.privateKey)]);
                                }).then(function (t) {
                                    t[0].alg = t[1].alg = y(c);
                                    t[0].key_ops = u.filter(E);
                                    t[1].key_ops = u.filter(C);
                                    return Promise.all([i.importKey("jwk", t[0], c, !0, t[0].key_ops), i.importKey("jwk", t[1], c, h, t[1].key_ops)]);
                                }).then(function (t) {
                                    return {
                                        publicKey: t[0],
                                        privateKey: t[1]
                                    };
                                });
                            }
                            if ((a || s && "SHA-1" === (c.hash || {}).name) && "importKey" === t && "jwk" === r && "HMAC" === c.name && "oct" === o.kty) {
                                return i.importKey("raw", p(f(o.k)), l, w[3], w[4]);
                            }
                            if (a && "importKey" === t && ("spki" === r || "pkcs8" === r)) {
                                return i.importKey("jwk", v(o), l, w[3], w[4]);
                            }
                            if (s && "unwrapKey" === t) {
                                return i.decrypt(w[3], l, o).then(function (t) {
                                    return i.importKey(r, t, w[4], w[5], w[6]);
                                });
                            }
                            try {
                                d = n.apply(i, w);
                            } catch (x) {
                                return Promise.reject(x);
                            }
                            s && (d = new Promise(function (t, e) {
                                d.onabort = d.onerror = function (t) {
                                    e(t);
                                };
                                d.oncomplete = function (e) {
                                    t(e.target.result);
                                };
                            }));
                            return d = d.then(function (t) {
                                "HMAC" === c.name && (c.length || (c.length = 8 * t.algorithm.length));
                                0 == c.name.search("RSA") && (c.modulusLength || (c.modulusLength = (t.publicKey || t).algorithm.modulusLength), c.publicExponent || (c.publicExponent = (t.publicKey || t).algorithm.publicExponent));
                                return t = t.publicKey && t.privateKey ? {
                                    publicKey: new _(t.publicKey, c, h, u.filter(E)),
                                    privateKey: new _(t.privateKey, c, h, u.filter(C))
                                } : new _(t, c, h, u);
                            });
                        };
                    });
                    ["exportKey", "wrapKey"].forEach(function (t) {
                        var e = i[t];
                        i[t] = function (n, r, o) {
                            var l;
                            var c = [].slice.call(arguments);
                            switch (t) {
                                case "exportKey":
                                    c[1] = r._key;
                                    break;
                                case "wrapKey":
                                    c[1] = r._key;
                                    c[2] = o._key;
                            }
                            (a || s && "SHA-1" === (r.algorithm.hash || {}).name) && "exportKey" === t && "jwk" === n && "HMAC" === r.algorithm.name && (c[0] = "raw");
                            !a || "exportKey" !== t || "spki" !== n && "pkcs8" !== n || (c[0] = "jwk");
                            if (s && "wrapKey" === t) {
                                return i.exportKey(n, r).then(function (t) {
                                    "jwk" === n && (t = p(unescape(encodeURIComponent(JSON.stringify(g(t))))));
                                    return i.encrypt(c[3], o, t);
                                });
                            }
                            try {
                                l = e.apply(i, c);
                            } catch (h) {
                                return Promise.reject(h);
                            }
                            s && (l = new Promise(function (t, e) {
                                l.onabort = l.onerror = function (t) {
                                    e(t);
                                };
                                l.oncomplete = function (e) {
                                    t(e.target.result);
                                };
                            }));
                            "exportKey" === t && "jwk" === n && (l = l.then(function (t) {
                                return (a || s && "SHA-1" === (r.algorithm.hash || {}).name) && "HMAC" === r.algorithm.name ? {
                                    kty: "oct",
                                    alg: y(r.algorithm),
                                    key_ops: r.usages.slice(),
                                    ext: !0,
                                    k: u(d(t))
                                } : ((t = g(t)).alg || (t.alg = y(r.algorithm)), t.key_ops || (t.key_ops = "public" === r.type ? r.usages.filter(E) : "private" === r.type ? r.usages.filter(C) : r.usages.slice()), t);
                            }));
                            !a || "exportKey" !== t || "spki" !== n && "pkcs8" !== n || (l = l.then(function (t) {
                                return t = w(g(t));
                            }));
                            return l;
                        };
                    });
                    ["encrypt", "decrypt", "sign", "verify"].forEach(function (t) {
                        var e = i[t];
                        i[t] = function (n, r, o, a) {
                            if (s && (!o.byteLength || a && !a.byteLength)) {
                                throw new Error("Empty input is not allowed");
                            }
                            var l;
                            var c = [].slice.call(arguments);
                            var h = m(n);
                            !s || "sign" !== t && "verify" !== t || "RSASSA-PKCS1-v1_5" !== n && "HMAC" !== n || (c[0] = {
                                name: n
                            });
                            s && r.algorithm.hash && (c[0].hash = c[0].hash || r.algorithm.hash);
                            if (s && "decrypt" === t && "AES-GCM" === h.name) {
                                var u = n.tagLength >> 3;
                                c[2] = (o.buffer || o).slice(0, o.byteLength - u);
                                n.tag = (o.buffer || o).slice(o.byteLength - u);
                            }
                            s && "AES-GCM" === h.name && c[0].tagLength === undefined && (c[0].tagLength = 128);
                            c[1] = r._key;
                            try {
                                l = e.apply(i, c);
                            } catch (f) {
                                return Promise.reject(f);
                            }
                            s && (l = new Promise(function (e, i) {
                                l.onabort = l.onerror = function (t) {
                                    i(t);
                                };
                                l.oncomplete = function (i) {
                                    i = i.target.result;
                                    if ("encrypt" === t && i instanceof AesGcmEncryptResult) {
                                        var n = i.ciphertext;
                                        var r = i.tag;
                                        (i = new Uint8Array(n.byteLength + r.byteLength)).set(new Uint8Array(n), 0);
                                        i.set(new Uint8Array(r), n.byteLength);
                                        i = i.buffer;
                                    }
                                    e(i);
                                };
                            }));
                            return l;
                        };
                    });
                    if (s) {
                        var h = i.digest;
                        i.digest = function (t, e) {
                            if (!e.byteLength) {
                                throw new Error("Empty input is not allowed");
                            }
                            var n;
                            try {
                                n = h.call(i, t, e);
                            } catch (r) {
                                return Promise.reject(r);
                            }
                            n = new Promise(function (t, e) {
                                n.onabort = n.onerror = function (t) {
                                    e(t);
                                };
                                n.oncomplete = function (e) {
                                    t(e.target.result);
                                };
                            });
                            return n;
                        };
                        t.crypto = Object.create(e, {
                            getRandomValues: {
                                value: function (t) {
                                    return e.getRandomValues(t);
                                }
                            },
                            subtle: {
                                value: i
                            }
                        });
                        t.CryptoKey = _;
                    }
                    a && (e.subtle = i, t.Crypto = n, t.SubtleCrypto = r, t.CryptoKey = _);
                }
            }
        }
        function u(t) {
            return btoa(t).replace(/\=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");
        }
        function f(t) {
            t = (t += "===").slice(0, -t.length % 4);
            return atob(t.replace(/-/g, "+").replace(/_/g, "/"));
        }
        function p(t) {
            for (var e = new Uint8Array(t.length), i = 0; i < t.length; i++) {
                e[i] = t.charCodeAt(i);
            }
            return e;
        }
        function d(t) {
            t instanceof ArrayBuffer && (t = new Uint8Array(t));
            return String.fromCharCode.apply(String, t);
        }
        function m(t) {
            var e = {
                name: (t.name || t || "").toUpperCase().replace("V", "v")
            };
            switch (e.name) {
                case "SHA-1":
                case "SHA-256":
                case "SHA-384":
                case "SHA-512":
                    break;
                case "AES-CBC":
                case "AES-GCM":
                case "AES-KW":
                    t.length && (e.length = t.length);
                    break;
                case "HMAC":
                    t.hash && (e.hash = m(t.hash));
                    t.length && (e.length = t.length);
                    break;
                case "RSAES-PKCS1-v1_5":
                    t.publicExponent && (e.publicExponent = new Uint8Array(t.publicExponent));
                    t.modulusLength && (e.modulusLength = t.modulusLength);
                    break;
                case "RSASSA-PKCS1-v1_5":
                case "RSA-OAEP":
                    t.hash && (e.hash = m(t.hash));
                    t.publicExponent && (e.publicExponent = new Uint8Array(t.publicExponent));
                    t.modulusLength && (e.modulusLength = t.modulusLength);
                    break;
                default:
                    throw new SyntaxError("Bad algorithm name");
            }
            return e;
        }
        function y(t) {
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
            }[t.name][(t.hash || {}).name || t.length || ""];
        }
        function g(t) {
            (t instanceof ArrayBuffer || t instanceof Uint8Array) && (t = JSON.parse(decodeURIComponent(escape(d(t)))));
            var e = {
                kty: t.kty,
                alg: t.alg,
                ext: t.ext || t.extractable
            };
            switch (e.kty) {
                case "oct":
                    e.k = t.k;
                case "RSA":
                    ["n", "e", "d", "p", "q", "dp", "dq", "qi", "oth"].forEach(function (i) {
                        i in t && (e[i] = t[i]);
                    });
                    break;
                default:
                    throw new TypeError("Unsupported key type");
            }
            return e;
        }
        function b(t) {
            var e = g(t);
            s && (e.extractable = e.ext, delete e.ext);
            return p(unescape(encodeURIComponent(JSON.stringify(e)))).buffer;
        }
        function v(t) {
            var e = x(t);
            var i = !1;
            e.length > 2 && (i = !0, e.shift());
            var n = {
                ext: !0
            };
            if ("1.2.840.113549.1.1.1" !== e[0][0]) {
                throw new TypeError("Unsupported key type");
            }
            var r = ["n", "e", "d", "p", "q", "dp", "dq", "qi"];
            var o = x(e[1]);
            i && o.shift();
            for (var s = 0; s < o.length; s++) {
                o[s][0] || (o[s] = o[s].subarray(1));
                n[r[s]] = u(d(o[s]));
            }
            n.kty = "RSA";
            return n;
        }
        function w(t) {
            var e;
            var i = [["", null]];
            var n = !1;
            if ("RSA" !== t.kty) {
                throw new TypeError("Unsupported key type");
            }
            for (var r = ["n", "e", "d", "p", "q", "dp", "dq", "qi"], o = [], s = 0; s < r.length && r[s] in t; s++) {
                var a = o[s] = p(f(t[r[s]]));
                128 & a[0] && (o[s] = new Uint8Array(a.length + 1), o[s].set(a, 1));
            }
            o.length > 2 && (n = !0, o.unshift(new Uint8Array([0])));
            i[0][0] = "1.2.840.113549.1.1.1";
            e = o;
            i.push(new Uint8Array(k(e)).buffer);
            n ? i.unshift(new Uint8Array([0])) : i[1] = {
                tag: 3,
                value: i[1]
            };
            return new Uint8Array(k(i)).buffer;
        }
        function x(t, e) {
            t instanceof ArrayBuffer && (t = new Uint8Array(t));
            e || (e = {
                pos: 0,
                end: t.length
            });
            if (e.end - e.pos < 2 || e.end > t.length) {
                throw new RangeError("Malformed DER");
            }
            var i;
            var n = t[e.pos++];
            var r = t[e.pos++];
            if (r >= 128) {
                r &= 127;
                if (e.end - e.pos < r) {
                    throw new RangeError("Malformed DER");
                }
                for (var o = 0; r--;) {
                    o <<= 8;
                    o |= t[e.pos++];
                }
                r = o;
            }
            if (e.end - e.pos < r) {
                throw new RangeError("Malformed DER");
            }
            switch (n) {
                case 2:
                    i = t.subarray(e.pos, e.pos += r);
                    break;
                case 3:
                    if (t[e.pos++]) {
                        throw new Error("Unsupported bit string");
                    }
                    r--;
                case 4:
                    i = new Uint8Array(t.subarray(e.pos, e.pos += r)).buffer;
                    break;
                case 5:
                    i = null;
                    break;
                case 6:
                    var s = btoa(d(t.subarray(e.pos, e.pos += r)));
                    if (!(s in l)) {
                        throw new Error("Unsupported OBJECT ID " + s);
                    }
                    i = l[s];
                    break;
                case 48:
                    i = [];
                    for (var a = e.pos + r; e.pos < a;) {
                        i.push(x(t, e));
                    }
                    break;
                default:
                    throw new Error("Unsupported DER tag 0x" + n.toString(16));
            }
            return i;
        }
        function k(t, e) {
            e || (e = []);
            var i = 0;
            var n = 0;
            var r = e.length + 2;
            e.push(0, 0);
            if (t instanceof Uint8Array) {
                i = 2;
                n = t.length;
                for (var o = 0; o < n; o++) {
                    e.push(t[o]);
                }
            } else {
                if (t instanceof ArrayBuffer) {
                    i = 4;
                    n = t.byteLength;
                    t = new Uint8Array(t);
                    for (o = 0; o < n; o++) {
                        e.push(t[o]);
                    }
                } else {
                    if (null === t) {
                        i = 5;
                        n = 0;
                    } else {
                        if ("string" == typeof t && t in c) {
                            var s = p(atob(c[t]));
                            i = 6;
                            n = s.length;
                            for (o = 0; o < n; o++) {
                                e.push(s[o]);
                            }
                        } else {
                            if (t instanceof Array) {
                                for (o = 0; o < t.length; o++) {
                                    k(t[o], e);
                                }
                                i = 48;
                                n = e.length - r;
                            } else {
                                if (!("object" == typeof t && 3 === t.tag && t.value instanceof ArrayBuffer)) {
                                    throw new Error("Unsupported DER value " + t);
                                }
                                i = 3;
                                n = (t = new Uint8Array(t.value)).byteLength;
                                e.push(0);
                                for (o = 0; o < n; o++) {
                                    e.push(t[o]);
                                }
                                n++;
                            }
                        }
                    }
                }
            }
            if (n >= 128) {
                var a = n;
                n = 4;
                for (e.splice(r, 0, a >> 24 & 255, a >> 16 & 255, a >> 8 & 255, 255 & a); n > 1 && !(a >> 24);) {
                    a <<= 8;
                    n--;
                }
                n < 4 && e.splice(r, 4 - n);
                n |= 128;
            }
            e.splice(r - 2, 2, i, n);
            return e;
        }
        function _(t, e, i, n) {
            Object.defineProperties(this, {
                _key: {
                    value: t
                },
                type: {
                    value: t.type,
                    enumerable: !0
                },
                extractable: {
                    value: i === undefined ? t.extractable : i,
                    enumerable: !0
                },
                algorithm: {
                    value: e === undefined ? t.algorithm : e,
                    enumerable: !0
                },
                usages: {
                    value: n === undefined ? t.usages : n,
                    enumerable: !0
                }
            });
        }
        function E(t) {
            return "verify" === t || "encrypt" === t || "wrapKey" === t;
        }
        function C(t) {
            return "sign" === t || "decrypt" === t || "unwrapKey" === t;
        }
    })(window);
    Array.prototype.indexOf || (Array.prototype.indexOf = function (t) {
        return function (e, i) {
            if (null === this || this === undefined) {
                throw TypeError("Array.prototype.indexOf called on null or undefined");
            }
            var n = t(this);
            var r = n.length >>> 0;
            var o = Math.min(0 | i, r);
            if (o < 0) {
                o = Math.max(0, r + o);
            } else {
                if (o >= r) {
                    return -1;
                }
            }
            if (void 0 === e) {
                for (; o !== r; ++o) {
                    if (void 0 === n[o] && o in n) {
                        return o;
                    }
                }
            } else {
                if (e != e) {
                    for (; o !== r; ++o) {
                        if (n[o] != n[o]) {
                            return o;
                        }
                    }
                } else {
                    for (; o !== r; ++o) {
                        if (n[o] === e) {
                            return o;
                        }
                    }
                }
            }
            return -1;
        };
    }(Object));
    Array.isArray || (Array.isArray = function (t) {
        return "[object Array]" === Object.prototype.toString.call(t);
    });
    document.getElementsByClassName || (window.Element.prototype.getElementsByClassName = document.constructor.prototype.getElementsByClassName = function (t) {
        if (document.querySelectorAll) {
            return document.querySelectorAll("." + t);
        }
        for (var e = document.getElementsByTagName("*"), i = new RegExp("(^|\\s)" + t + "(\\s|$)"), n = [], r = 0; r < e.length; r++) {
            i.test(e[r].className) && n.push(e[r]);
        }
        return n;
    });
    String.prototype.startsWith || (String.prototype.startsWith = function (t, e) {
        return this.substr(!e || e < 0 ? 0 : +e, t.length) === t;
    });
    String.prototype.endsWith || (String.prototype.endsWith = function (t, e) {
        (e === undefined || e > this.length) && (e = this.length);
        return this.substring(e - t.length, e) === t;
    });
    try {
        if (Object.defineProperty && Object.getOwnPropertyDescriptor && Object.getOwnPropertyDescriptor(Element.prototype, "textContent") && !Object.getOwnPropertyDescriptor(Element.prototype, "textContent").get) {
            var R = Object.getOwnPropertyDescriptor(Element.prototype, "innerText");
            Object.defineProperty(Element.prototype, "textContent", {
                get: function () {
                    return R.get.call(this);
                },
                set: function (t) {
                    R.set.call(this, t);
                }
            });
        }
    } catch (Oo) {}
    Function.prototype.bind || (Function.prototype.bind = function (t) {
        if ("function" != typeof this) {
            throw new TypeError("Function.prototype.bind: Item Can Not Be Bound.");
        }
        var e = Array.prototype.slice.call(arguments, 1);
        var i = this;
        function n() {}
        function r() {
            return i.apply(this instanceof n ? this : t, e.concat(Array.prototype.slice.call(arguments)));
        }
        this.prototype && (n.prototype = this.prototype);
        r.prototype = new n();
        return r;
    });
    "function" != typeof Object.create && (Object.create = function (t, e) {
        function i() {}
        i.prototype = t;
        if ("object" == typeof e) {
            for (var n in e) {
                e.hasOwnProperty(n) && (i[n] = e[n]);
            }
        }
        return new i();
    });
    Date.now || (Date.now = function () {
        return new Date().getTime();
    });
    window.console || (window.console = {});
    for (var B, U, L, H, O = ["error", "info", "log", "show", "table", "trace", "warn"], P = function (t) {}, F = O.length; --F > -1;) {
        _ = O[F];
        window.console[_] || (window.console[_] = P);
    }
    if (window.atob) {
        try {
            window.atob(" ");
        } catch (Po) {
            window.atob = function (t) {
                function e(e) {
                    return t(String(e).replace(/[\t\n\f\r ]+/g, ""));
                }
                e.original = t;
                return e;
            }(window.atob);
        }
    } else {
        var Z = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        var N = /^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/;
        window.atob = function (t) {
            t = String(t).replace(/[\t\n\f\r ]+/g, "");
            if (!N.test(t)) {
                throw new TypeError("Failed to execute 'atob' on 'Window': The string to be decoded is not correctly encoded.");
            }
            var e;
            var i;
            var n;
            t += "==".slice(2 - (3 & t.length));
            for (var r = "", o = 0; o < t.length;) {
                e = Z.indexOf(t.charAt(o++)) << 18 | Z.indexOf(t.charAt(o++)) << 12 | (i = Z.indexOf(t.charAt(o++))) << 6 | (n = Z.indexOf(t.charAt(o++)));
                r += 64 === i ? String.fromCharCode(e >> 16 & 255) : 64 === n ? String.fromCharCode(e >> 16 & 255, e >> 8 & 255) : String.fromCharCode(e >> 16 & 255, e >> 8 & 255, 255 & e);
            }
            return r;
        };
    }
    Event.prototype.preventDefault || (Event.prototype.preventDefault = function () {
        this.returnValue = !1;
    });
    Event.prototype.stopPropagation || (Event.prototype.stopPropagation = function () {
        this.cancelBubble = !0;
    });
    if (window.Prototype && Array.prototype.toJSON) {
        console.error("[hCaptcha] Custom JSON polyfill detected, please remove to ensure hCaptcha works properly");
        var D = Array.prototype.toJSON;
        var W = JSON.stringify;
        JSON.stringify = function (t) {
            try {
                delete Array.prototype.toJSON;
                return W(t);
            } finally {
                Array.prototype.toJSON = D;
            }
        };
    }
    Object.keys || (B = Object.prototype.hasOwnProperty, U = !Object.prototype.propertyIsEnumerable.call({
        toString: null
    }, "toString"), H = (L = ["toString", "toLocaleString", "valueOf", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "constructor"]).length, Object.keys = function (t) {
        if ("function" != typeof t && ("object" != typeof t || null === t)) {
            throw new TypeError("Object.keys called on non-object");
        }
        var e;
        var i;
        var n = [];
        for (e in t) {
            B.call(t, e) && n.push(e);
        }
        if (U) {
            for (i = 0; i < H; i++) {
                B.call(t, L[i]) && n.push(L[i]);
            }
        }
        return n;
    })
    /*! Raven.js 3.27.2 (6d91db933) | github.com/getsentry/raven-js */;
    (function (t) {
        if ("object" == typeof exports && "undefined" != typeof module) {
            module.exports = t();
        } else {
            if ("function" == typeof define && define.amd) {
                define("raven-js", t);
            } else {
                ("undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this).Raven = t();
            }
        }
    })(function () {
        return function t(e, i, n) {
            function r(s, a) {
                if (!i[s]) {
                    if (!e[s]) {
                        var l = "function" == typeof require && require;
                        if (!a && l) {
                            return l(s, !0);
                        }
                        if (o) {
                            return o(s, !0);
                        }
                        var c = new Error("Cannot find module '" + s + "'");
                        c.code = "MODULE_NOT_FOUND";
                        throw c;
                    }
                    var h = i[s] = {
                        exports: {}
                    };
                    e[s][0].call(h.exports, function (t) {
                        var i = e[s][1][t];
                        return r(i || t);
                    }, h, h.exports, t, e, i, n);
                }
                return i[s].exports;
            }
            for (var o = "function" == typeof require && require, s = 0; s < n.length; s++) {
                r(n[s]);
            }
            return r;
        }({
            1: [function (t, e, i) {
                function n(t) {
                    this.name = "RavenConfigError";
                    this.message = t;
                }
                n.prototype = new Error();
                n.prototype.constructor = n;
                e.exports = n;
            }, {}],
            2: [function (t, e, i) {
                var n = t(5);
                e.exports = {
                    wrapMethod: function (t, e, i) {
                        var r = t[e];
                        var o = t;
                        if (e in t) {
                            var s = "warn" === e ? "warning" : e;
                            t[e] = function () {
                                var t = [].slice.call(arguments);
                                var a = n.safeJoin(t, " ");
                                var l = {
                                    level: s,
                                    logger: "console",
                                    extra: {
                                        arguments: t
                                    }
                                };
                                "assert" === e ? !1 === t[0] && (a = "Assertion failed: " + (n.safeJoin(t.slice(1), " ") || "console.assert"), l.extra.arguments = t.slice(1), i && i(a, l)) : i && i(a, l);
                                r && Function.prototype.apply.call(r, o, t);
                            };
                        }
                    }
                };
            }, {
                5: 5
            }],
            3: [function (t, e, i) {
                (function (i) {
                    function n() {
                        return +new Date();
                    }
                    function r(t, e) {
                        return b(e) ? function (i) {
                            return e(i, t);
                        } : e;
                    }
                    function o() {
                        this.a = !("object" != typeof JSON || !JSON.stringify);
                        this.b = !g(I);
                        this.c = !g(j);
                        this.d = null;
                        this.e = null;
                        this.f = null;
                        this.g = null;
                        this.h = null;
                        this.i = null;
                        this.j = {};
                        this.k = {
                            release: z.SENTRY_RELEASE && z.SENTRY_RELEASE.id,
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
                        };
                        this.l = {
                            method: "POST",
                            referrerPolicy: O() ? "origin" : ""
                        };
                        this.m = 0;
                        this.n = !1;
                        this.o = Error.stackTraceLimit;
                        this.p = z.console || {};
                        this.q = {};
                        this.r = [];
                        this.s = n();
                        this.t = [];
                        this.u = [];
                        this.v = null;
                        this.w = z.location;
                        this.x = this.w && this.w.href;
                        this.y();
                        for (var t in this.p) {
                            this.q[t] = this.p[t];
                        }
                    }
                    var s = t(6);
                    var a = t(7);
                    var l = t(8);
                    var c = t(1);
                    var h = t(5);
                    var u = h.isErrorEvent;
                    var f = h.isDOMError;
                    var p = h.isDOMException;
                    var d = h.isError;
                    var m = h.isObject;
                    var y = h.isPlainObject;
                    var g = h.isUndefined;
                    var b = h.isFunction;
                    var v = h.isString;
                    var w = h.isArray;
                    var x = h.isEmptyObject;
                    var k = h.each;
                    var _ = h.objectMerge;
                    var E = h.truncate;
                    var C = h.objectFrozen;
                    var S = h.hasKey;
                    var V = h.joinRegExp;
                    var T = h.urlencode;
                    var A = h.uuid4;
                    var M = h.htmlTreeAsString;
                    var R = h.isSameException;
                    var B = h.isSameStacktrace;
                    var U = h.parseUrl;
                    var L = h.fill;
                    var H = h.supportsFetch;
                    var O = h.supportsReferrerPolicy;
                    var P = h.serializeKeysForMessage;
                    var F = h.serializeException;
                    var Z = h.sanitize;
                    var N = t(2).wrapMethod;
                    var D = "source protocol user pass host port path".split(" ");
                    var W = /^(?:(\w+):)?\/\/(?:(\w+)(:\w+)?@)?([\w\.-]+)(?::(\d+))?(\/.*)/;
                    var z = "undefined" != typeof window ? window : void 0 !== i ? i : "undefined" != typeof self ? self : {};
                    var I = z.document;
                    var j = z.navigator;
                    o.prototype = {
                        VERSION: "3.27.2",
                        debug: !1,
                        TraceKit: s,
                        config: function (t, e) {
                            var i = this;
                            if (i.g) {
                                this.z("error", "Error: Raven has already been configured");
                                return i;
                            }
                            if (!t) {
                                return i;
                            }
                            var n = i.k;
                            e && k(e, function (t, e) {
                                "tags" === t || "extra" === t || "user" === t ? i.j[t] = e : n[t] = e;
                            });
                            i.setDSN(t);
                            n.ignoreErrors.push(/^Script error\.?$/);
                            n.ignoreErrors.push(/^Javascript error: Script error\.? on line 0$/);
                            n.ignoreErrors = V(n.ignoreErrors);
                            n.ignoreUrls = !!n.ignoreUrls.length && V(n.ignoreUrls);
                            n.whitelistUrls = !!n.whitelistUrls.length && V(n.whitelistUrls);
                            n.includePaths = V(n.includePaths);
                            n.maxBreadcrumbs = Math.max(0, Math.min(n.maxBreadcrumbs || 100, 100));
                            var r = {
                                xhr: !0,
                                console: !0,
                                dom: !0,
                                location: !0,
                                sentry: !0
                            };
                            var o = n.autoBreadcrumbs;
                            "[object Object]" === {}.toString.call(o) ? o = _(r, o) : !1 !== o && (o = r);
                            n.autoBreadcrumbs = o;
                            var a = {
                                tryCatch: !0
                            };
                            var l = n.instrument;
                            "[object Object]" === {}.toString.call(l) ? l = _(a, l) : !1 !== l && (l = a);
                            n.instrument = l;
                            s.collectWindowErrors = !!n.collectWindowErrors;
                            return i;
                        },
                        install: function () {
                            var t = this;
                            t.isSetup() && !t.n && (s.report.subscribe(function () {
                                t.A.apply(t, arguments);
                            }), t.k.captureUnhandledRejections && t.B(), t.C(), t.k.instrument && t.k.instrument.tryCatch && t.D(), t.k.autoBreadcrumbs && t.E(), t.F(), t.n = !0);
                            Error.stackTraceLimit = t.k.stackTraceLimit;
                            return this;
                        },
                        setDSN: function (t) {
                            var e = this;
                            var i = e.G(t);
                            var n = i.path.lastIndexOf("/");
                            var r = i.path.substr(1, n);
                            e.H = t;
                            e.h = i.user;
                            e.I = i.pass && i.pass.substr(1);
                            e.i = i.path.substr(n + 1);
                            e.g = e.J(i);
                            e.K = e.g + "/" + r + "api/" + e.i + "/store/";
                            this.y();
                        },
                        context: function (t, e, i) {
                            b(t) && (i = e || [], e = t, t = {});
                            return this.wrap(t, e).apply(this, i);
                        },
                        wrap: function (t, e, i) {
                            function n() {
                                var n = [];
                                var o = arguments.length;
                                var s = !t || t && !1 !== t.deep;
                                for (i && b(i) && i.apply(this, arguments); o--;) {
                                    n[o] = s ? r.wrap(t, arguments[o]) : arguments[o];
                                }
                                try {
                                    return e.apply(this, n);
                                } catch (a) {
                                    r.L();
                                    r.captureException(a, t);
                                    throw a;
                                }
                            }
                            var r = this;
                            if (g(e) && !b(t)) {
                                return t;
                            }
                            b(t) && (e = t, t = void 0);
                            if (!b(e)) {
                                return e;
                            }
                            try {
                                if (e.M) {
                                    return e;
                                }
                                if (e.N) {
                                    return e.N;
                                }
                            } catch (o) {
                                return e;
                            }
                            for (var s in e) {
                                S(e, s) && (n[s] = e[s]);
                            }
                            n.prototype = e.prototype;
                            e.N = n;
                            n.M = !0;
                            n.O = e;
                            return n;
                        },
                        uninstall: function () {
                            s.report.uninstall();
                            this.P();
                            this.Q();
                            this.R();
                            this.S();
                            Error.stackTraceLimit = this.o;
                            this.n = !1;
                            return this;
                        },
                        T: function (t) {
                            this.z("debug", "Raven caught unhandled promise rejection:", t);
                            this.captureException(t.reason, {
                                mechanism: {
                                    type: "onunhandledrejection",
                                    handled: !1
                                }
                            });
                        },
                        B: function () {
                            this.T = this.T.bind(this);
                            z.addEventListener && z.addEventListener("unhandledrejection", this.T);
                            return this;
                        },
                        P: function () {
                            z.removeEventListener && z.removeEventListener("unhandledrejection", this.T);
                            return this;
                        },
                        captureException: function (t, e) {
                            e = _({
                                trimHeadFrames: 0
                            }, e || {});
                            if (u(t) && t.error) {
                                t = t.error;
                            } else {
                                if (f(t) || p(t)) {
                                    var i = t.name || (f(t) ? "DOMError" : "DOMException");
                                    var n = t.message ? i + ": " + t.message : i;
                                    return this.captureMessage(n, _(e, {
                                        stacktrace: !0,
                                        trimHeadFrames: e.trimHeadFrames + 1
                                    }));
                                }
                                if (d(t)) {
                                    t = t;
                                } else {
                                    if (!y(t)) {
                                        return this.captureMessage(t, _(e, {
                                            stacktrace: !0,
                                            trimHeadFrames: e.trimHeadFrames + 1
                                        }));
                                    }
                                    e = this.U(e, t);
                                    t = new Error(e.message);
                                }
                            }
                            this.d = t;
                            try {
                                var r = s.computeStackTrace(t);
                                this.V(r, e);
                            } catch (o) {
                                if (t !== o) {
                                    throw o;
                                }
                            }
                            return this;
                        },
                        U: function (t, e) {
                            var i = Object.keys(e).sort();
                            var n = _(t, {
                                message: "Non-Error exception captured with keys: " + P(i),
                                fingerprint: [l(i)],
                                extra: t.extra || {}
                            });
                            n.extra.W = F(e);
                            return n;
                        },
                        captureMessage: function (t, e) {
                            if (!this.k.ignoreErrors.test || !this.k.ignoreErrors.test(t)) {
                                var i;
                                var n = _({
                                    message: t += ""
                                }, e = e || {});
                                try {
                                    throw new Error(t);
                                } catch (r) {
                                    i = r;
                                }
                                i.name = null;
                                var o = s.computeStackTrace(i);
                                var a = w(o.stack) && o.stack[1];
                                a && "Raven.captureException" === a.func && (a = o.stack[2]);
                                var l = a && a.url || "";
                                if ((!this.k.ignoreUrls.test || !this.k.ignoreUrls.test(l)) && (!this.k.whitelistUrls.test || this.k.whitelistUrls.test(l))) {
                                    if (this.k.stacktrace || e.stacktrace || "" === n.message) {
                                        n.fingerprint = null == n.fingerprint ? t : n.fingerprint;
                                        (e = _({
                                            trimHeadFrames: 0
                                        }, e)).trimHeadFrames += 1;
                                        var c = this.X(o, e);
                                        n.stacktrace = {
                                            frames: c.reverse()
                                        };
                                    }
                                    n.fingerprint && (n.fingerprint = w(n.fingerprint) ? n.fingerprint : [n.fingerprint]);
                                    this.Y(n);
                                    return this;
                                }
                            }
                        },
                        captureBreadcrumb: function (t) {
                            var e = _({
                                timestamp: n() / 1e3
                            }, t);
                            if (b(this.k.breadcrumbCallback)) {
                                var i = this.k.breadcrumbCallback(e);
                                if (m(i) && !x(i)) {
                                    e = i;
                                } else {
                                    if (!1 === i) {
                                        return this;
                                    }
                                }
                            }
                            this.u.push(e);
                            this.u.length > this.k.maxBreadcrumbs && this.u.shift();
                            return this;
                        },
                        addPlugin: function (t) {
                            var e = [].slice.call(arguments, 1);
                            this.r.push([t, e]);
                            this.n && this.F();
                            return this;
                        },
                        setUserContext: function (t) {
                            this.j.user = t;
                            return this;
                        },
                        setExtraContext: function (t) {
                            this.Z("extra", t);
                            return this;
                        },
                        setTagsContext: function (t) {
                            this.Z("tags", t);
                            return this;
                        },
                        clearContext: function () {
                            this.j = {};
                            return this;
                        },
                        getContext: function () {
                            return JSON.parse(a(this.j));
                        },
                        setEnvironment: function (t) {
                            this.k.environment = t;
                            return this;
                        },
                        setRelease: function (t) {
                            this.k.release = t;
                            return this;
                        },
                        setDataCallback: function (t) {
                            var e = this.k.dataCallback;
                            this.k.dataCallback = r(e, t);
                            return this;
                        },
                        setBreadcrumbCallback: function (t) {
                            var e = this.k.breadcrumbCallback;
                            this.k.breadcrumbCallback = r(e, t);
                            return this;
                        },
                        setShouldSendCallback: function (t) {
                            var e = this.k.shouldSendCallback;
                            this.k.shouldSendCallback = r(e, t);
                            return this;
                        },
                        setTransport: function (t) {
                            this.k.transport = t;
                            return this;
                        },
                        lastException: function () {
                            return this.d;
                        },
                        lastEventId: function () {
                            return this.f;
                        },
                        isSetup: function () {
                            return !(!this.a || !this.g && (this.ravenNotConfiguredError || (this.ravenNotConfiguredError = !0, this.z("error", "Error: Raven has not been configured.")), 1));
                        },
                        afterLoad: function () {
                            var t = z.RavenConfig;
                            t && this.config(t.dsn, t.config).install();
                        },
                        showReportDialog: function (t) {
                            if (I) {
                                if (!(t = _({
                                    eventId: this.lastEventId(),
                                    dsn: this.H,
                                    user: this.j.user || {}
                                }, t)).eventId) {
                                    throw new c("Missing eventId");
                                }
                                if (!t.dsn) {
                                    throw new c("Missing DSN");
                                }
                                var e = encodeURIComponent;
                                var i = [];
                                for (var n in t) {
                                    if ("user" === n) {
                                        var r = t.user;
                                        r.name && i.push("name=" + e(r.name));
                                        r.email && i.push("email=" + e(r.email));
                                    } else {
                                        i.push(e(n) + "=" + e(t[n]));
                                    }
                                }
                                var o = this.J(this.G(t.dsn));
                                var s = I.createElement("script");
                                s.async = !0;
                                s.src = o + "/api/embed/error-page/?" + i.join("&");
                                (I.head || I.body).appendChild(s);
                            }
                        },
                        L: function () {
                            var t = this;
                            this.m += 1;
                            setTimeout(function () {
                                t.m -= 1;
                            });
                        },
                        $: function (t, e) {
                            var i;
                            var n;
                            if (this.b) {
                                e = e || {};
                                t = "raven" + t.substr(0, 1).toUpperCase() + t.substr(1);
                                I.createEvent ? (i = I.createEvent("HTMLEvents")).initEvent(t, !0, !0) : (i = I.createEventObject()).eventType = t;
                                for (n in e) {
                                    S(e, n) && (i[n] = e[n]);
                                }
                                if (I.createEvent) {
                                    I.dispatchEvent(i);
                                } else {
                                    try {
                                        I.fireEvent("on" + i.eventType.toLowerCase(), i);
                                    } catch (r) {}
                                }
                            }
                        },
                        _: function (t) {
                            var e = this;
                            return function (i) {
                                e.aa = null;
                                if (e.v !== i) {
                                    var n;
                                    e.v = i;
                                    try {
                                        n = M(i.target);
                                    } catch (r) {
                                        n = "<unknown>";
                                    }
                                    e.captureBreadcrumb({
                                        category: "ui." + t,
                                        message: n
                                    });
                                }
                            };
                        },
                        ba: function () {
                            var t = this;
                            return function (e) {
                                var i;
                                try {
                                    i = e.target;
                                } catch (r) {
                                    return;
                                }
                                var n = i && i.tagName;
                                if (n && ("INPUT" === n || "TEXTAREA" === n || i.isContentEditable)) {
                                    var o = t.aa;
                                    o || t._("input")(e);
                                    clearTimeout(o);
                                    t.aa = setTimeout(function () {
                                        t.aa = null;
                                    }, 1e3);
                                }
                            };
                        },
                        ca: function (t, e) {
                            var i = U(this.w.href);
                            var n = U(e);
                            var r = U(t);
                            this.x = e;
                            i.protocol === n.protocol && i.host === n.host && (e = n.relative);
                            i.protocol === r.protocol && i.host === r.host && (t = r.relative);
                            this.captureBreadcrumb({
                                category: "navigation",
                                data: {
                                    to: e,
                                    from: t
                                }
                            });
                        },
                        C: function () {
                            var t = this;
                            t.da = Function.prototype.toString;
                            Function.prototype.toString = function () {
                                return "function" == typeof this && this.M ? t.da.apply(this.O, arguments) : t.da.apply(this, arguments);
                            };
                        },
                        Q: function () {
                            this.da && (Function.prototype.toString = this.da);
                        },
                        D: function () {
                            function t(t) {
                                return function (e, n) {
                                    for (var r = new Array(arguments.length), o = 0; o < r.length; ++o) {
                                        r[o] = arguments[o];
                                    }
                                    var s = r[0];
                                    b(s) && (r[0] = i.wrap({
                                        mechanism: {
                                            type: "instrument",
                                            data: {
                                                "function": t.name || "<anonymous>"
                                            }
                                        }
                                    }, s));
                                    return t.apply ? t.apply(this, r) : t(r[0], r[1]);
                                };
                            }
                            function e(t) {
                                var e = z[t] && z[t].prototype;
                                e && e.hasOwnProperty && e.hasOwnProperty("addEventListener") && (L(e, "addEventListener", function (e) {
                                    return function (n, o, s, a) {
                                        try {
                                            o && o.handleEvent && (o.handleEvent = i.wrap({
                                                mechanism: {
                                                    type: "instrument",
                                                    data: {
                                                        target: t,
                                                        "function": "handleEvent",
                                                        handler: o && o.name || "<anonymous>"
                                                    }
                                                }
                                            }, o.handleEvent));
                                        } catch (l) {}
                                        var c;
                                        var h;
                                        var u;
                                        r && r.dom && ("EventTarget" === t || "Node" === t) && (h = i._("click"), u = i.ba(), c = function (t) {
                                            if (t) {
                                                var e;
                                                try {
                                                    e = t.type;
                                                } catch (i) {
                                                    return;
                                                }
                                                return "click" === e ? h(t) : "keypress" === e ? u(t) : void 0;
                                            }
                                        });
                                        return e.call(this, n, i.wrap({
                                            mechanism: {
                                                type: "instrument",
                                                data: {
                                                    target: t,
                                                    "function": "addEventListener",
                                                    handler: o && o.name || "<anonymous>"
                                                }
                                            }
                                        }, o, c), s, a);
                                    };
                                }, n), L(e, "removeEventListener", function (t) {
                                    return function (e, i, n, r) {
                                        try {
                                            i = i && (i.N ? i.N : i);
                                        } catch (o) {}
                                        return t.call(this, e, i, n, r);
                                    };
                                }, n));
                            }
                            var i = this;
                            var n = i.t;
                            var r = this.k.autoBreadcrumbs;
                            L(z, "setTimeout", t, n);
                            L(z, "setInterval", t, n);
                            z.requestAnimationFrame && L(z, "requestAnimationFrame", function (t) {
                                return function (e) {
                                    return t(i.wrap({
                                        mechanism: {
                                            type: "instrument",
                                            data: {
                                                "function": "requestAnimationFrame",
                                                handler: t && t.name || "<anonymous>"
                                            }
                                        }
                                    }, e));
                                };
                            }, n);
                            for (var o = ["EventTarget", "Window", "Node", "ApplicationCache", "AudioTrackList", "ChannelMergerNode", "CryptoOperation", "EventSource", "FileReader", "HTMLUnknownElement", "IDBDatabase", "IDBRequest", "IDBTransaction", "KeyOperation", "MediaController", "MessagePort", "ModalWindow", "Notification", "SVGElementInstance", "Screen", "TextTrack", "TextTrackCue", "TextTrackList", "WebSocket", "WebSocketWorker", "Worker", "XMLHttpRequest", "XMLHttpRequestEventTarget", "XMLHttpRequestUpload"], s = 0; s < o.length; s++) {
                                e(o[s]);
                            }
                        },
                        E: function () {
                            function t(t, i) {
                                t in i && b(i[t]) && L(i, t, function (i) {
                                    return e.wrap({
                                        mechanism: {
                                            type: "instrument",
                                            data: {
                                                "function": t,
                                                handler: i && i.name || "<anonymous>"
                                            }
                                        }
                                    }, i);
                                });
                            }
                            var e = this;
                            var i = this.k.autoBreadcrumbs;
                            var n = e.t;
                            if (i.xhr && "XMLHttpRequest" in z) {
                                var r = z.XMLHttpRequest && z.XMLHttpRequest.prototype;
                                L(r, "open", function (t) {
                                    return function (i, n) {
                                        v(n) && -1 === n.indexOf(e.h) && (this.ea = {
                                            method: i,
                                            url: n,
                                            status_code: null
                                        });
                                        return t.apply(this, arguments);
                                    };
                                }, n);
                                L(r, "send", function (i) {
                                    return function () {
                                        function n() {
                                            if (r.ea && 4 === r.readyState) {
                                                try {
                                                    r.ea.status_code = r.status;
                                                } catch (t) {}
                                                e.captureBreadcrumb({
                                                    type: "http",
                                                    category: "xhr",
                                                    data: r.ea
                                                });
                                            }
                                        }
                                        for (var r = this, o = ["onload", "onerror", "onprogress"], s = 0; s < o.length; s++) {
                                            t(o[s], r);
                                        }
                                        "onreadystatechange" in r && b(r.onreadystatechange) ? L(r, "onreadystatechange", function (t) {
                                            return e.wrap({
                                                mechanism: {
                                                    type: "instrument",
                                                    data: {
                                                        "function": "onreadystatechange",
                                                        handler: t && t.name || "<anonymous>"
                                                    }
                                                }
                                            }, t, n);
                                        }) : r.onreadystatechange = n;
                                        return i.apply(this, arguments);
                                    };
                                }, n);
                            }
                            i.xhr && H() && L(z, "fetch", function (t) {
                                return function () {
                                    for (var i = new Array(arguments.length), n = 0; n < i.length; ++n) {
                                        i[n] = arguments[n];
                                    }
                                    var r;
                                    var o = i[0];
                                    var s = "GET";
                                    "string" == typeof o ? r = o : "Request" in z && o instanceof z.Request ? (r = o.url, o.method && (s = o.method)) : r = "" + o;
                                    if (-1 !== r.indexOf(e.h)) {
                                        return t.apply(this, i);
                                    }
                                    i[1] && i[1].method && (s = i[1].method);
                                    var a = {
                                        method: s,
                                        url: r,
                                        status_code: null
                                    };
                                    return t.apply(this, i).then(function (t) {
                                        a.status_code = t.status;
                                        e.captureBreadcrumb({
                                            type: "http",
                                            category: "fetch",
                                            data: a
                                        });
                                        return t;
                                    })["catch"](function (t) {
                                        e.captureBreadcrumb({
                                            type: "http",
                                            category: "fetch",
                                            data: a,
                                            level: "error"
                                        });
                                        throw t;
                                    });
                                };
                            }, n);
                            i.dom && this.b && (I.addEventListener ? (I.addEventListener("click", e._("click"), !1), I.addEventListener("keypress", e.ba(), !1)) : I.attachEvent && (I.attachEvent("onclick", e._("click")), I.attachEvent("onkeypress", e.ba())));
                            var o = z.chrome;
                            var s = !(o && o.app && o.app.runtime) && z.history && z.history.pushState && z.history.replaceState;
                            if (i.location && s) {
                                var a = z.onpopstate;
                                z.onpopstate = function () {
                                    var t = e.w.href;
                                    e.ca(e.x, t);
                                    if (a) {
                                        return a.apply(this, arguments);
                                    }
                                };
                                function l(t) {
                                    return function () {
                                        var i = arguments.length > 2 ? arguments[2] : void 0;
                                        i && e.ca(e.x, i + "");
                                        return t.apply(this, arguments);
                                    };
                                }
                                L(z.history, "pushState", l, n);
                                L(z.history, "replaceState", l, n);
                            }
                            if (i.console && "console" in z && console.log) {
                                function c(t, i) {
                                    e.captureBreadcrumb({
                                        message: t,
                                        level: i.level,
                                        category: "console"
                                    });
                                }
                                k(["debug", "info", "warn", "error", "log"], function (t, e) {
                                    N(console, e, c);
                                });
                            }
                        },
                        R: function () {
                            for (var t; this.t.length;) {
                                var e = (t = this.t.shift())[0];
                                var i = t[1];
                                var n = t[2];
                                e[i] = n;
                            }
                        },
                        S: function () {
                            for (var t in this.q) {
                                this.p[t] = this.q[t];
                            }
                        },
                        F: function () {
                            var t = this;
                            k(this.r, function (e, i) {
                                var n = i[0];
                                var r = i[1];
                                n.apply(t, [t].concat(r));
                            });
                        },
                        G: function (t) {
                            var e = W.exec(t);
                            var i = {};
                            var n = 7;
                            try {
                                for (; n--;) {
                                    i[D[n]] = e[n] || "";
                                }
                            } catch (r) {
                                throw new c("Invalid DSN: " + t);
                            }
                            if (i.pass && !this.k.allowSecretKey) {
                                throw new c("Do not specify your secret key in the DSN. See: http://bit.ly/raven-secret-key");
                            }
                            return i;
                        },
                        J: function (t) {
                            var e = "//" + t.host + (t.port ? ":" + t.port : "");
                            t.protocol && (e = t.protocol + ":" + e);
                            return e;
                        },
                        A: function (t, e) {
                            (e = e || {}).mechanism = e.mechanism || {
                                type: "onerror",
                                handled: !1
                            };
                            this.m || this.V(t, e);
                        },
                        V: function (t, e) {
                            var i = this.X(t, e);
                            this.$("handle", {
                                stackInfo: t,
                                options: e
                            });
                            this.fa(t.name, t.message, t.url, t.lineno, i, e);
                        },
                        X: function (t, e) {
                            var i = this;
                            var n = [];
                            if (t.stack && t.stack.length && (k(t.stack, function (e, r) {
                                var o = i.ga(r, t.url);
                                o && n.push(o);
                            }), e && e.trimHeadFrames)) {
                                for (var r = 0; r < e.trimHeadFrames && r < n.length; r++) {
                                    n[r].in_app = !1;
                                }
                            }
                            return n = n.slice(0, this.k.stackTraceLimit);
                        },
                        ga: function (t, e) {
                            var i = {
                                filename: t.url,
                                lineno: t.line,
                                colno: t.column,
                                "function": t.func || "?"
                            };
                            t.url || (i.filename = e);
                            i.in_app = !(this.k.includePaths.test && !this.k.includePaths.test(i.filename) || /(Raven|TraceKit)\./.test(i["function"]) || /raven\.(min\.)?js$/.test(i.filename));
                            return i;
                        },
                        fa: function (t, e, i, n, r, o) {
                            var s;
                            var a = (t ? t + ": " : "") + (e || "");
                            if ((!this.k.ignoreErrors.test || !this.k.ignoreErrors.test(e) && !this.k.ignoreErrors.test(a)) && (r && r.length ? (i = r[0].filename || i, r.reverse(), s = {
                                frames: r
                            }) : i && (s = {
                                frames: [{
                                    filename: i,
                                    lineno: n,
                                    in_app: !0
                                }]
                            }), (!this.k.ignoreUrls.test || !this.k.ignoreUrls.test(i)) && (!this.k.whitelistUrls.test || this.k.whitelistUrls.test(i)))) {
                                var l = _({
                                    exception: {
                                        values: [{
                                            type: t,
                                            value: e,
                                            stacktrace: s
                                        }]
                                    },
                                    transaction: i
                                }, o);
                                var c = l.exception.values[0];
                                null == c.type && "" === c.value && (c.value = "Unrecoverable error caught");
                                !l.exception.mechanism && l.mechanism && (l.exception.mechanism = l.mechanism, delete l.mechanism);
                                l.exception.mechanism = _({
                                    type: "generic",
                                    handled: !0
                                }, l.exception.mechanism || {});
                                this.Y(l);
                            }
                        },
                        ha: function (t) {
                            var e = this.k.maxMessageLength;
                            t.message && (t.message = E(t.message, e));
                            if (t.exception) {
                                var i = t.exception.values[0];
                                i.value = E(i.value, e);
                            }
                            var n = t.request;
                            n && (n.url && (n.url = E(n.url, this.k.maxUrlLength)), n.Referer && (n.Referer = E(n.Referer, this.k.maxUrlLength)));
                            t.breadcrumbs && t.breadcrumbs.values && this.ia(t.breadcrumbs);
                            return t;
                        },
                        ia: function (t) {
                            for (var e, i, n, r = ["to", "from", "url"], o = 0; o < t.values.length; ++o) {
                                if ((i = t.values[o]).hasOwnProperty("data") && m(i.data) && !C(i.data)) {
                                    n = _({}, i.data);
                                    for (var s = 0; s < r.length; ++s) {
                                        e = r[s];
                                        n.hasOwnProperty(e) && n[e] && (n[e] = E(n[e], this.k.maxUrlLength));
                                    }
                                    t.values[o].data = n;
                                }
                            }
                        },
                        ja: function () {
                            if (this.c || this.b) {
                                var t = {};
                                this.c && j.userAgent && (t.headers = {
                                    "User-Agent": j.userAgent
                                });
                                z.location && z.location.href && (t.url = z.location.href);
                                this.b && I.referrer && (t.headers || (t.headers = {}), t.headers.Referer = I.referrer);
                                return t;
                            }
                        },
                        y: function () {
                            this.ka = 0;
                            this.la = null;
                        },
                        ma: function () {
                            return this.ka && n() - this.la < this.ka;
                        },
                        na: function (t) {
                            var e = this.e;
                            return !(!e || t.message !== e.message || t.transaction !== e.transaction) && (t.stacktrace || e.stacktrace ? B(t.stacktrace, e.stacktrace) : t.exception || e.exception ? R(t.exception, e.exception) : !t.fingerprint && !e.fingerprint || Boolean(t.fingerprint && e.fingerprint) && JSON.stringify(t.fingerprint) === JSON.stringify(e.fingerprint));
                        },
                        oa: function (t) {
                            if (!this.ma()) {
                                var e = t.status;
                                if (400 === e || 401 === e || 429 === e) {
                                    var i;
                                    try {
                                        i = H() ? t.headers.get("Retry-After") : t.getResponseHeader("Retry-After");
                                        i = 1e3 * parseInt(i, 10);
                                    } catch (r) {}
                                    this.ka = i || 2 * this.ka || 1e3;
                                    this.la = n();
                                }
                            }
                        },
                        Y: function (t) {
                            var e = this.k;
                            var i = {
                                project: this.i,
                                logger: e.logger,
                                platform: "javascript"
                            };
                            var r = this.ja();
                            r && (i.request = r);
                            t.trimHeadFrames && delete t.trimHeadFrames;
                            (t = _(i, t)).tags = _(_({}, this.j.tags), t.tags);
                            t.extra = _(_({}, this.j.extra), t.extra);
                            t.extra["session:duration"] = n() - this.s;
                            this.u && this.u.length > 0 && (t.breadcrumbs = {
                                values: [].slice.call(this.u, 0)
                            });
                            this.j.user && (t.user = this.j.user);
                            e.environment && (t.environment = e.environment);
                            e.release && (t.release = e.release);
                            e.serverName && (t.server_name = e.serverName);
                            t = this.pa(t);
                            Object.keys(t).forEach(function (e) {
                                (null == t[e] || "" === t[e] || x(t[e])) && delete t[e];
                            });
                            b(e.dataCallback) && (t = e.dataCallback(t) || t);
                            if (t && !x(t) && (!b(e.shouldSendCallback) || e.shouldSendCallback(t))) {
                                return this.ma() ? void this.z("warn", "Raven dropped error due to backoff: ", t) : void ("number" == typeof e.sampleRate ? Math.random() < e.sampleRate && this.qa(t) : this.qa(t));
                            }
                        },
                        pa: function (t) {
                            return Z(t, this.k.sanitizeKeys);
                        },
                        ra: function () {
                            return A();
                        },
                        qa: function (t, e) {
                            var i = this;
                            var n = this.k;
                            if (this.isSetup()) {
                                t = this.ha(t);
                                if (!this.k.allowDuplicates && this.na(t)) {
                                    return void this.z("warn", "Raven dropped repeat event: ", t);
                                }
                                this.f = t.event_id || (t.event_id = this.ra());
                                this.e = t;
                                this.z("debug", "Raven about to send:", t);
                                var r = {
                                    sentry_version: "7",
                                    sentry_client: "raven-js/" + this.VERSION,
                                    sentry_key: this.h
                                };
                                this.I && (r.sentry_secret = this.I);
                                var o = t.exception && t.exception.values[0];
                                this.k.autoBreadcrumbs && this.k.autoBreadcrumbs.sentry && this.captureBreadcrumb({
                                    category: "sentry",
                                    message: o ? (o.type ? o.type + ": " : "") + o.value : t.message,
                                    event_id: t.event_id,
                                    level: t.level || "error"
                                });
                                var s = this.K;
                                (n.transport || this._makeRequest).call(this, {
                                    url: s,
                                    auth: r,
                                    data: t,
                                    options: n,
                                    onSuccess: function () {
                                        i.y();
                                        i.$("success", {
                                            data: t,
                                            src: s
                                        });
                                        e && e();
                                    },
                                    onError: function (n) {
                                        i.z("error", "Raven transport failed to send: ", n);
                                        n.request && i.oa(n.request);
                                        i.$("failure", {
                                            data: t,
                                            src: s
                                        });
                                        n = n || new Error("Raven send failed (no additional details provided)");
                                        e && e(n);
                                    }
                                });
                            }
                        },
                        _makeRequest: function (t) {
                            var e = t.url + "?" + T(t.auth);
                            var i = null;
                            var n = {};
                            t.options.headers && (i = this.sa(t.options.headers));
                            t.options.fetchParameters && (n = this.sa(t.options.fetchParameters));
                            if (H()) {
                                n.body = a(t.data);
                                var r = _({}, this.l);
                                var o = _(r, n);
                                i && (o.headers = i);
                                return z.fetch(e, o).then(function (e) {
                                    if (e.ok) {
                                        t.onSuccess && t.onSuccess();
                                    } else {
                                        var i = new Error("Sentry error code: " + e.status);
                                        i.request = e;
                                        t.onError && t.onError(i);
                                    }
                                })["catch"](function () {
                                    t.onError && t.onError(new Error("Sentry error code: network unavailable"));
                                });
                            }
                            var s = z.XMLHttpRequest && new z.XMLHttpRequest();
                            s && ("withCredentials" in s || "undefined" != typeof XDomainRequest) && ("withCredentials" in s ? s.onreadystatechange = function () {
                                if (4 === s.readyState) {
                                    if (200 === s.status) {
                                        t.onSuccess && t.onSuccess();
                                    } else {
                                        if (t.onError) {
                                            var e = new Error("Sentry error code: " + s.status);
                                            e.request = s;
                                            t.onError(e);
                                        }
                                    }
                                }
                            } : (s = new XDomainRequest(), e = e.replace(/^https?:/, ""), t.onSuccess && (s.onload = t.onSuccess), t.onError && (s.onerror = function () {
                                var e = new Error("Sentry error code: XDomainRequest");
                                e.request = s;
                                t.onError(e);
                            })), s.open("POST", e), i && k(i, function (t, e) {
                                s.setRequestHeader(t, e);
                            }), s.send(a(t.data)));
                        },
                        sa: function (t) {
                            var e = {};
                            for (var i in t) {
                                if (t.hasOwnProperty(i)) {
                                    var n = t[i];
                                    e[i] = "function" == typeof n ? n() : n;
                                }
                            }
                            return e;
                        },
                        z: function (t) {
                            this.q[t] && (this.debug || this.k.debug) && Function.prototype.apply.call(this.q[t], this.p, [].slice.call(arguments, 1));
                        },
                        Z: function (t, e) {
                            g(e) ? delete this.j[t] : this.j[t] = _(this.j[t] || {}, e);
                        }
                    };
                    o.prototype.setUser = o.prototype.setUserContext;
                    o.prototype.setReleaseContext = o.prototype.setRelease;
                    e.exports = o;
                }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
            }, {
                1: 1,
                2: 2,
                5: 5,
                6: 6,
                7: 7,
                8: 8
            }],
            4: [function (t, e, i) {
                (function (i) {
                    var n = t(3);
                    var r = "undefined" != typeof window ? window : void 0 !== i ? i : "undefined" != typeof self ? self : {};
                    var o = r.Raven;
                    var s = new n();
                    s.noConflict = function () {
                        r.Raven = o;
                        return s;
                    };
                    s.afterLoad();
                    e.exports = s;
                    e.exports.Client = n;
                }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
            }, {
                3: 3
            }],
            5: [function (t, e, i) {
                (function (i) {
                    function n(t) {
                        switch (Object.prototype.toString.call(t)) {
                            case "[object Error]":
                            case "[object Exception]":
                            case "[object DOMException]":
                                return !0;
                            default:
                                return t instanceof Error;
                        }
                    }
                    function r(t) {
                        return "[object DOMError]" === Object.prototype.toString.call(t);
                    }
                    function o(t) {
                        return void 0 === t;
                    }
                    function s(t) {
                        return "[object Object]" === Object.prototype.toString.call(t);
                    }
                    function a(t) {
                        return "[object String]" === Object.prototype.toString.call(t);
                    }
                    function l(t) {
                        return "[object Array]" === Object.prototype.toString.call(t);
                    }
                    function c() {
                        if (!("fetch" in x)) {
                            return !1;
                        }
                        try {
                            new Headers();
                            new Request("");
                            new Response();
                            return !0;
                        } catch (t) {
                            return !1;
                        }
                    }
                    function h(t, e) {
                        var i;
                        var n;
                        if (o(t.length)) {
                            for (i in t) {
                                f(t, i) && e.call(null, i, t[i]);
                            }
                        } else {
                            if (n = t.length) {
                                for (i = 0; i < n; i++) {
                                    e.call(null, i, t[i]);
                                }
                            }
                        }
                    }
                    function u(t, e) {
                        if ("number" != typeof e) {
                            throw new Error("2nd argument to `truncate` function should be a number");
                        }
                        return "string" != typeof t || 0 === e || t.length <= e ? t : t.substr(0, e) + "…";
                    }
                    function f(t, e) {
                        return Object.prototype.hasOwnProperty.call(t, e);
                    }
                    function p(t) {
                        for (var e, i = [], n = 0, r = t.length; n < r; n++) {
                            a(e = t[n]) ? i.push(e.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1")) : e && e.source && i.push(e.source);
                        }
                        return new RegExp(i.join("|"), "i");
                    }
                    function d(t) {
                        var e;
                        var i;
                        var n;
                        var r;
                        var o;
                        var s = [];
                        if (!t || !t.tagName) {
                            return "";
                        }
                        s.push(t.tagName.toLowerCase());
                        t.id && s.push("#" + t.id);
                        if ((e = t.className) && a(e)) {
                            i = e.split(/\s+/);
                            o = 0;
                            for (; o < i.length; o++) {
                                s.push("." + i[o]);
                            }
                        }
                        var l = ["type", "name", "title", "alt"];
                        for (o = 0; o < l.length; o++) {
                            n = l[o];
                            (r = t.getAttribute(n)) && s.push("[" + n + '="' + r + '"]');
                        }
                        return s.join("");
                    }
                    function m(t, e) {
                        return !!(!!t ^ !!e);
                    }
                    function y(t, e) {
                        if (m(t, e)) {
                            return !1;
                        }
                        var i = t.frames;
                        var n = e.frames;
                        if (void 0 === i || void 0 === n) {
                            return !1;
                        }
                        if (i.length !== n.length) {
                            return !1;
                        }
                        for (var r, o, s = 0; s < i.length; s++) {
                            r = i[s];
                            o = n[s];
                            if (r.filename !== o.filename || r.lineno !== o.lineno || r.colno !== o.colno || r["function"] !== o["function"]) {
                                return !1;
                            }
                        }
                        return !0;
                    }
                    function g(t) {
                        return function (t) {
                            return ~-encodeURI(t).split(/%..|./).length;
                        }(JSON.stringify(t));
                    }
                    function b(t) {
                        if ("string" == typeof t) {
                            return u(t, 40);
                        }
                        if ("number" == typeof t || "boolean" == typeof t || void 0 === t) {
                            return t;
                        }
                        var e = Object.prototype.toString.call(t);
                        return "[object Object]" === e ? "[Object]" : "[object Array]" === e ? "[Array]" : "[object Function]" === e ? t.name ? "[Function: " + t.name + "]" : "[Function]" : t;
                    }
                    function v(t, e) {
                        return 0 === e ? b(t) : s(t) ? Object.keys(t).reduce(function (i, n) {
                            i[n] = v(t[n], e - 1);
                            return i;
                        }, {}) : Array.isArray(t) ? t.map(function (t) {
                            return v(t, e - 1);
                        }) : b(t);
                    }
                    var w = t(7);
                    var x = "undefined" != typeof window ? window : void 0 !== i ? i : "undefined" != typeof self ? self : {};
                    var k = 3;
                    var _ = 51200;
                    var E = 40;
                    e.exports = {
                        isObject: function (t) {
                            return "object" == typeof t && null !== t;
                        },
                        isError: n,
                        isErrorEvent: function (t) {
                            return "[object ErrorEvent]" === Object.prototype.toString.call(t);
                        },
                        isDOMError: r,
                        isDOMException: function (t) {
                            return "[object DOMException]" === Object.prototype.toString.call(t);
                        },
                        isUndefined: o,
                        isFunction: function (t) {
                            return "function" == typeof t;
                        },
                        isPlainObject: s,
                        isString: a,
                        isArray: l,
                        isEmptyObject: function (t) {
                            if (!s(t)) {
                                return !1;
                            }
                            for (var e in t) {
                                if (t.hasOwnProperty(e)) {
                                    return !1;
                                }
                            }
                            return !0;
                        },
                        supportsErrorEvent: function () {
                            try {
                                new ErrorEvent("");
                                return !0;
                            } catch (t) {
                                return !1;
                            }
                        },
                        supportsDOMError: function () {
                            try {
                                new DOMError("");
                                return !0;
                            } catch (t) {
                                return !1;
                            }
                        },
                        supportsDOMException: function () {
                            try {
                                new DOMException("");
                                return !0;
                            } catch (t) {
                                return !1;
                            }
                        },
                        supportsFetch: c,
                        supportsReferrerPolicy: function () {
                            if (!c()) {
                                return !1;
                            }
                            try {
                                new Request("pickleRick", {
                                    referrerPolicy: "origin"
                                });
                                return !0;
                            } catch (t) {
                                return !1;
                            }
                        },
                        supportsPromiseRejectionEvent: function () {
                            return "function" == typeof PromiseRejectionEvent;
                        },
                        wrappedCallback: function (t) {
                            return function (e, i) {
                                var n = t(e) || e;
                                return i && i(n) || n;
                            };
                        },
                        each: h,
                        objectMerge: function (t, e) {
                            return e ? (h(e, function (e, i) {
                                t[e] = i;
                            }), t) : t;
                        },
                        truncate: u,
                        objectFrozen: function (t) {
                            return !!Object.isFrozen && Object.isFrozen(t);
                        },
                        hasKey: f,
                        joinRegExp: p,
                        urlencode: function (t) {
                            var e = [];
                            h(t, function (t, i) {
                                e.push(encodeURIComponent(t) + "=" + encodeURIComponent(i));
                            });
                            return e.join("&");
                        },
                        uuid4: function () {
                            var t = x.crypto || x.msCrypto;
                            if (!o(t) && t.getRandomValues) {
                                var e = new Uint16Array(8);
                                t.getRandomValues(e);
                                e[3] = 4095 & e[3] | 16384;
                                e[4] = 16383 & e[4] | 32768;
                                function i(t) {
                                    for (var e = t.toString(16); e.length < 4;) {
                                        e = "0" + e;
                                    }
                                    return e;
                                }
                                return i(e[0]) + i(e[1]) + i(e[2]) + i(e[3]) + i(e[4]) + i(e[5]) + i(e[6]) + i(e[7]);
                            }
                            return "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, function (t) {
                                var e = 16 * Math.random() | 0;
                                return ("x" === t ? e : 3 & e | 8).toString(16);
                            });
                        },
                        htmlTreeAsString: function (t) {
                            for (var e, i = [], n = 0, r = 0, o = " > ".length; t && n++ < 5 && !("html" === (e = d(t)) || n > 1 && r + i.length * o + e.length >= 80);) {
                                i.push(e);
                                r += e.length;
                                t = t.parentNode;
                            }
                            return i.reverse().join(" > ");
                        },
                        htmlElementAsString: d,
                        isSameException: function (t, e) {
                            return !m(t, e) && (t = t.values[0], e = e.values[0], t.type === e.type && t.value === e.value && !function (t, e) {
                                return o(t) && o(e);
                            }(t.stacktrace, e.stacktrace) && y(t.stacktrace, e.stacktrace));
                        },
                        isSameStacktrace: y,
                        parseUrl: function (t) {
                            if ("string" != typeof t) {
                                return {};
                            }
                            var e = t.match(/^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/);
                            var i = e[6] || "";
                            var n = e[8] || "";
                            return {
                                protocol: e[2],
                                host: e[4],
                                path: e[5],
                                relative: e[5] + i + n
                            };
                        },
                        fill: function (t, e, i, n) {
                            if (null != t) {
                                var r = t[e];
                                t[e] = i(r);
                                t[e].M = !0;
                                t[e].O = r;
                                n && n.push([t, e, r]);
                            }
                        },
                        safeJoin: function (t, e) {
                            if (!l(t)) {
                                return "";
                            }
                            for (var i = [], r = 0; r < t.length; r++) {
                                try {
                                    i.push(String(t[r]));
                                } catch (n) {
                                    i.push("[value cannot be serialized]");
                                }
                            }
                            return i.join(e);
                        },
                        serializeException: function C(t, e, i) {
                            if (!s(t)) {
                                return t;
                            }
                            i = "number" != typeof (e = "number" != typeof e ? k : e) ? _ : i;
                            var n = v(t, e);
                            return g(w(n)) > i ? C(t, e - 1) : n;
                        },
                        serializeKeysForMessage: function (t, e) {
                            if ("number" == typeof t || "string" == typeof t) {
                                return t.toString();
                            }
                            if (!Array.isArray(t)) {
                                return "";
                            }
                            if (0 === (t = t.filter(function (t) {
                                return "string" == typeof t;
                            })).length) {
                                return "[object has no keys]";
                            }
                            e = "number" != typeof e ? E : e;
                            if (t[0].length >= e) {
                                return t[0];
                            }
                            for (var i = t.length; i > 0; i--) {
                                var n = t.slice(0, i).join(", ");
                                if (!(n.length > e)) {
                                    return i === t.length ? n : n + "…";
                                }
                            }
                            return "";
                        },
                        sanitize: function (t, e) {
                            if (!l(e) || l(e) && 0 === e.length) {
                                return t;
                            }
                            var i;
                            var n = p(e);
                            var o = "********";
                            try {
                                i = JSON.parse(w(t));
                            } catch (r) {
                                return t;
                            }
                            return function a(t) {
                                return l(t) ? t.map(function (t) {
                                    return a(t);
                                }) : s(t) ? Object.keys(t).reduce(function (e, i) {
                                    e[i] = n.test(i) ? o : a(t[i]);
                                    return e;
                                }, {}) : t;
                            }(i);
                        }
                    };
                }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
            }, {
                7: 7
            }],
            6: [function (t, e, i) {
                (function (i) {
                    function n() {
                        return "undefined" == typeof document || null == document.location ? "" : document.location.href;
                    }
                    var r = t(5);
                    var o = {
                        collectWindowErrors: !0,
                        debug: !1
                    };
                    var s = "undefined" != typeof window ? window : void 0 !== i ? i : "undefined" != typeof self ? self : {};
                    var a = [].slice;
                    var l = "?";
                    var c = /^(?:[Uu]ncaught (?:exception: )?)?(?:((?:Eval|Internal|Range|Reference|Syntax|Type|URI|)Error): )?(.*)$/;
                    o.report = function () {
                        function t(e, i) {
                            var n = null;
                            if (!i || o.collectWindowErrors) {
                                for (var r in p) {
                                    if (p.hasOwnProperty(r)) {
                                        try {
                                            p[r].apply(null, [e].concat(a.call(arguments, 2)));
                                        } catch (t) {
                                            n = t;
                                        }
                                    }
                                }
                                if (n) {
                                    throw n;
                                }
                            }
                        }
                        function e(e, s, a, h, f) {
                            var p = r.isErrorEvent(f) ? f.error : f;
                            var d = r.isErrorEvent(e) ? e.message : e;
                            if (y) {
                                o.computeStackTrace.augmentStackTraceWithInitialElement(y, s, a, d);
                                i();
                            } else {
                                if (p && r.isError(p)) {
                                    t(o.computeStackTrace(p), !0);
                                } else {
                                    var m;
                                    var g = {
                                        url: s,
                                        line: a,
                                        column: h
                                    };
                                    var b = void 0;
                                    if ("[object String]" === {}.toString.call(d)) {
                                        (m = d.match(c)) && (b = m[1], d = m[2]);
                                    }
                                    g.func = l;
                                    t({
                                        name: b,
                                        message: d,
                                        url: n(),
                                        stack: [g]
                                    }, !0);
                                }
                            }
                            return !!u && u.apply(this, arguments);
                        }
                        function i() {
                            var e = y;
                            var i = d;
                            d = null;
                            y = null;
                            m = null;
                            t.apply(null, [e, !1].concat(i));
                        }
                        function h(t, e) {
                            var n = a.call(arguments, 1);
                            if (y) {
                                if (m === t) {
                                    return;
                                }
                                i();
                            }
                            var r = o.computeStackTrace(t);
                            y = r;
                            m = t;
                            d = n;
                            setTimeout(function () {
                                m === t && i();
                            }, r.incomplete ? 2e3 : 0);
                            if (!1 !== e) {
                                throw t;
                            }
                        }
                        var u;
                        var f;
                        var p = [];
                        var d = null;
                        var m = null;
                        var y = null;
                        h.subscribe = function (t) {
                            f || (u = s.onerror, s.onerror = e, f = !0);
                            p.push(t);
                        };
                        h.unsubscribe = function (t) {
                            for (var e = p.length - 1; e >= 0; --e) {
                                p[e] === t && p.splice(e, 1);
                            }
                        };
                        h.uninstall = function () {
                            f && (s.onerror = u, f = !1, u = void 0);
                            p = [];
                        };
                        return h;
                    }();
                    o.computeStackTrace = function () {
                        function t(t) {
                            if ("undefined" != typeof t.stack && t.stack) {
                                for (var e, i, r, o = /^\s*at (?:(.*?) ?\()?((?:file|https?|blob|chrome-extension|native|eval|webpack|<anonymous>|[a-z]:|\/).*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i, s = /^\s*at (?:((?:\[object object\])?.+) )?\(?((?:file|ms-appx(?:-web)|https?|webpack|blob):.*?):(\d+)(?::(\d+))?\)?\s*$/i, a = /^\s*(.*?)(?:\((.*?)\))?(?:^|@)((?:file|https?|blob|chrome|webpack|resource|moz-extension).*?:\/.*?|\[native code\]|[^@]*(?:bundle|\d+\.js))(?::(\d+))?(?::(\d+))?\s*$/i, c = /(\S+) line (\d+)(?: > eval line \d+)* > eval/i, h = /\((\S*)(?::(\d+))(?::(\d+))\)/, u = t.stack.split("\n"), f = [], p = (/^(.*) is undefined$/.exec(t.message), 0), d = u.length; p < d; ++p) {
                                    if (i = o.exec(u[p])) {
                                        var m = i[2] && 0 === i[2].indexOf("native");
                                        i[2] && 0 === i[2].indexOf("eval") && (e = h.exec(i[2])) && (i[2] = e[1], i[3] = e[2], i[4] = e[3]);
                                        r = {
                                            url: m ? null : i[2],
                                            func: i[1] || l,
                                            args: m ? [i[2]] : [],
                                            line: i[3] ? +i[3] : null,
                                            column: i[4] ? +i[4] : null
                                        };
                                    } else {
                                        if (i = s.exec(u[p])) {
                                            r = {
                                                url: i[2],
                                                func: i[1] || l,
                                                args: [],
                                                line: +i[3],
                                                column: i[4] ? +i[4] : null
                                            };
                                        } else {
                                            if (!(i = a.exec(u[p]))) {
                                                continue;
                                            }
                                            i[3] && i[3].indexOf(" > eval") > -1 && (e = c.exec(i[3])) ? (i[3] = e[1], i[4] = e[2], i[5] = null) : 0 !== p || i[5] || "undefined" == typeof t.columnNumber || (f[0].column = t.columnNumber + 1);
                                            r = {
                                                url: i[3],
                                                func: i[1] || l,
                                                args: i[2] ? i[2].split(",") : [],
                                                line: i[4] ? +i[4] : null,
                                                column: i[5] ? +i[5] : null
                                            };
                                        }
                                    }
                                    !r.func && r.line && (r.func = l);
                                    if (r.url && "blob:" === r.url.substr(0, 5)) {
                                        var y = new XMLHttpRequest();
                                        y.open("GET", r.url, !1);
                                        y.send(null);
                                        if (200 === y.status) {
                                            var g = y.responseText || "";
                                            var b = (g = g.slice(-300)).match(/\/\/# sourceMappingURL=(.*)$/);
                                            if (b) {
                                                var v = b[1];
                                                "~" === v.charAt(0) && (v = ("undefined" == typeof document || null == document.location ? "" : document.location.origin ? document.location.origin : document.location.protocol + "//" + document.location.hostname + (document.location.port ? ":" + document.location.port : "")) + v.slice(1));
                                                r.url = v.slice(0, -4);
                                            }
                                        }
                                    }
                                    f.push(r);
                                }
                                return f.length ? {
                                    name: t.name,
                                    message: t.message,
                                    url: n(),
                                    stack: f
                                } : null;
                            }
                        }
                        function e(t, e, i, n) {
                            var r = {
                                url: e,
                                line: i
                            };
                            if (r.url && r.line) {
                                t.incomplete = !1;
                                r.func || (r.func = l);
                                if (t.stack.length > 0 && t.stack[0].url === r.url) {
                                    if (t.stack[0].line === r.line) {
                                        return !1;
                                    }
                                    if (!t.stack[0].line && t.stack[0].func === r.func) {
                                        t.stack[0].line = r.line;
                                        return !1;
                                    }
                                }
                                t.stack.unshift(r);
                                t.partial = !0;
                                return !0;
                            }
                            t.incomplete = !0;
                            return !1;
                        }
                        function i(t, s) {
                            for (var a, c, h = /function\s+([_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*)?\s*\(/i, u = [], f = {}, p = !1, d = i.caller; d && !p; d = d.caller) {
                                if (d !== r && d !== o.report) {
                                    c = {
                                        url: null,
                                        func: l,
                                        line: null,
                                        column: null
                                    };
                                    d.name ? c.func = d.name : (a = h.exec(d.toString())) && (c.func = a[1]);
                                    if ("undefined" == typeof c.func) {
                                        try {
                                            c.func = a.input.substring(0, a.input.indexOf("{"));
                                        } catch (y) {}
                                    }
                                    f["" + d] ? p = !0 : f["" + d] = !0;
                                    u.push(c);
                                }
                            }
                            s && u.splice(0, s);
                            var m = {
                                name: t.name,
                                message: t.message,
                                url: n(),
                                stack: u
                            };
                            e(m, t.sourceURL || t.fileName, t.line || t.lineNumber, t.message || t.description);
                            return m;
                        }
                        function r(e, r) {
                            var a = null;
                            r = null == r ? 0 : +r;
                            try {
                                if (a = t(e)) {
                                    return a;
                                }
                            } catch (s) {
                                if (o.debug) {
                                    throw s;
                                }
                            }
                            try {
                                if (a = i(e, r + 1)) {
                                    return a;
                                }
                            } catch (s) {
                                if (o.debug) {
                                    throw s;
                                }
                            }
                            return {
                                name: e.name,
                                message: e.message,
                                url: n()
                            };
                        }
                        r.augmentStackTraceWithInitialElement = e;
                        r.computeStackTraceFromStackProp = t;
                        return r;
                    }();
                    e.exports = o;
                }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
            }, {
                5: 5
            }],
            7: [function (t, e, i) {
                function n(t, e) {
                    for (var i = 0; i < t.length; ++i) {
                        if (t[i] === e) {
                            return i;
                        }
                    }
                    return -1;
                }
                function r(t, e) {
                    var i = [];
                    var r = [];
                    null == e && (e = function (t, e) {
                        return i[0] === e ? "[Circular ~]" : "[Circular ~." + r.slice(0, n(i, e)).join(".") + "]";
                    });
                    return function (o, s) {
                        if (i.length > 0) {
                            var a = n(i, this);
                            ~a ? i.splice(a + 1) : i.push(this);
                            ~a ? r.splice(a, 1 / 0, o) : r.push(o);
                            ~n(i, s) && (s = e.call(this, o, s));
                        } else {
                            i.push(s);
                        }
                        return null == t ? s instanceof Error ? function (t) {
                            var e = {
                                stack: t.stack,
                                message: t.message,
                                name: t.name
                            };
                            for (var i in t) {
                                Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
                            }
                            return e;
                        }(s) : s : t.call(this, o, s);
                    };
                }
                i = e.exports = function (t, e, i, n) {
                    return JSON.stringify(t, r(e, n), i);
                };
                i.getSerialize = r;
            }, {}],
            8: [function (t, e, i) {
                function n(t, e) {
                    var i = (65535 & t) + (65535 & e);
                    return (t >> 16) + (e >> 16) + (i >> 16) << 16 | 65535 & i;
                }
                function r(t, e, i, r, o, s) {
                    return n(function (t, e) {
                        return t << e | t >>> 32 - e;
                    }(n(n(e, t), n(r, s)), o), i);
                }
                function o(t, e, i, n, o, s, a) {
                    return r(e & i | ~e & n, t, e, o, s, a);
                }
                function s(t, e, i, n, o, s, a) {
                    return r(e & n | i & ~n, t, e, o, s, a);
                }
                function a(t, e, i, n, o, s, a) {
                    return r(e ^ i ^ n, t, e, o, s, a);
                }
                function l(t, e, i, n, o, s, a) {
                    return r(i ^ (e | ~n), t, e, o, s, a);
                }
                function c(t, e) {
                    t[e >> 5] |= 128 << e % 32;
                    t[14 + (e + 64 >>> 9 << 4)] = e;
                    var i;
                    var r;
                    var c;
                    var h;
                    var u;
                    var f = 1732584193;
                    var p = -271733879;
                    var d = -1732584194;
                    var m = 271733878;
                    for (i = 0; i < t.length; i += 16) {
                        r = f;
                        c = p;
                        h = d;
                        u = m;
                        f = o(f, p, d, m, t[i], 7, -680876936);
                        m = o(m, f, p, d, t[i + 1], 12, -389564586);
                        d = o(d, m, f, p, t[i + 2], 17, 606105819);
                        p = o(p, d, m, f, t[i + 3], 22, -1044525330);
                        f = o(f, p, d, m, t[i + 4], 7, -176418897);
                        m = o(m, f, p, d, t[i + 5], 12, 1200080426);
                        d = o(d, m, f, p, t[i + 6], 17, -1473231341);
                        p = o(p, d, m, f, t[i + 7], 22, -45705983);
                        f = o(f, p, d, m, t[i + 8], 7, 1770035416);
                        m = o(m, f, p, d, t[i + 9], 12, -1958414417);
                        d = o(d, m, f, p, t[i + 10], 17, -42063);
                        p = o(p, d, m, f, t[i + 11], 22, -1990404162);
                        f = o(f, p, d, m, t[i + 12], 7, 1804603682);
                        m = o(m, f, p, d, t[i + 13], 12, -40341101);
                        d = o(d, m, f, p, t[i + 14], 17, -1502002290);
                        f = s(f, p = o(p, d, m, f, t[i + 15], 22, 1236535329), d, m, t[i + 1], 5, -165796510);
                        m = s(m, f, p, d, t[i + 6], 9, -1069501632);
                        d = s(d, m, f, p, t[i + 11], 14, 643717713);
                        p = s(p, d, m, f, t[i], 20, -373897302);
                        f = s(f, p, d, m, t[i + 5], 5, -701558691);
                        m = s(m, f, p, d, t[i + 10], 9, 38016083);
                        d = s(d, m, f, p, t[i + 15], 14, -660478335);
                        p = s(p, d, m, f, t[i + 4], 20, -405537848);
                        f = s(f, p, d, m, t[i + 9], 5, 568446438);
                        m = s(m, f, p, d, t[i + 14], 9, -1019803690);
                        d = s(d, m, f, p, t[i + 3], 14, -187363961);
                        p = s(p, d, m, f, t[i + 8], 20, 1163531501);
                        f = s(f, p, d, m, t[i + 13], 5, -1444681467);
                        m = s(m, f, p, d, t[i + 2], 9, -51403784);
                        d = s(d, m, f, p, t[i + 7], 14, 1735328473);
                        f = a(f, p = s(p, d, m, f, t[i + 12], 20, -1926607734), d, m, t[i + 5], 4, -378558);
                        m = a(m, f, p, d, t[i + 8], 11, -2022574463);
                        d = a(d, m, f, p, t[i + 11], 16, 1839030562);
                        p = a(p, d, m, f, t[i + 14], 23, -35309556);
                        f = a(f, p, d, m, t[i + 1], 4, -1530992060);
                        m = a(m, f, p, d, t[i + 4], 11, 1272893353);
                        d = a(d, m, f, p, t[i + 7], 16, -155497632);
                        p = a(p, d, m, f, t[i + 10], 23, -1094730640);
                        f = a(f, p, d, m, t[i + 13], 4, 681279174);
                        m = a(m, f, p, d, t[i], 11, -358537222);
                        d = a(d, m, f, p, t[i + 3], 16, -722521979);
                        p = a(p, d, m, f, t[i + 6], 23, 76029189);
                        f = a(f, p, d, m, t[i + 9], 4, -640364487);
                        m = a(m, f, p, d, t[i + 12], 11, -421815835);
                        d = a(d, m, f, p, t[i + 15], 16, 530742520);
                        f = l(f, p = a(p, d, m, f, t[i + 2], 23, -995338651), d, m, t[i], 6, -198630844);
                        m = l(m, f, p, d, t[i + 7], 10, 1126891415);
                        d = l(d, m, f, p, t[i + 14], 15, -1416354905);
                        p = l(p, d, m, f, t[i + 5], 21, -57434055);
                        f = l(f, p, d, m, t[i + 12], 6, 1700485571);
                        m = l(m, f, p, d, t[i + 3], 10, -1894986606);
                        d = l(d, m, f, p, t[i + 10], 15, -1051523);
                        p = l(p, d, m, f, t[i + 1], 21, -2054922799);
                        f = l(f, p, d, m, t[i + 8], 6, 1873313359);
                        m = l(m, f, p, d, t[i + 15], 10, -30611744);
                        d = l(d, m, f, p, t[i + 6], 15, -1560198380);
                        p = l(p, d, m, f, t[i + 13], 21, 1309151649);
                        f = l(f, p, d, m, t[i + 4], 6, -145523070);
                        m = l(m, f, p, d, t[i + 11], 10, -1120210379);
                        d = l(d, m, f, p, t[i + 2], 15, 718787259);
                        p = l(p, d, m, f, t[i + 9], 21, -343485551);
                        f = n(f, r);
                        p = n(p, c);
                        d = n(d, h);
                        m = n(m, u);
                    }
                    return [f, p, d, m];
                }
                function h(t) {
                    var e;
                    var i = "";
                    var n = 32 * t.length;
                    for (e = 0; e < n; e += 8) {
                        i += String.fromCharCode(t[e >> 5] >>> e % 32 & 255);
                    }
                    return i;
                }
                function u(t) {
                    var e;
                    var i = [];
                    i[(t.length >> 2) - 1] = void 0;
                    e = 0;
                    for (; e < i.length; e += 1) {
                        i[e] = 0;
                    }
                    var n = 8 * t.length;
                    for (e = 0; e < n; e += 8) {
                        i[e >> 5] |= (255 & t.charCodeAt(e / 8)) << e % 32;
                    }
                    return i;
                }
                function f(t) {
                    var e;
                    var i;
                    var n = "0123456789abcdef";
                    var r = "";
                    for (i = 0; i < t.length; i += 1) {
                        e = t.charCodeAt(i);
                        r += n.charAt(e >>> 4 & 15) + n.charAt(15 & e);
                    }
                    return r;
                }
                function p(t) {
                    return unescape(encodeURIComponent(t));
                }
                function d(t) {
                    return function (t) {
                        return h(c(u(t), 8 * t.length));
                    }(p(t));
                }
                function m(t, e) {
                    return function (t, e) {
                        var i;
                        var n;
                        var r = u(t);
                        var o = [];
                        var s = [];
                        o[15] = s[15] = void 0;
                        r.length > 16 && (r = c(r, 8 * t.length));
                        i = 0;
                        for (; i < 16; i += 1) {
                            o[i] = 909522486 ^ r[i];
                            s[i] = 1549556828 ^ r[i];
                        }
                        n = c(o.concat(u(e)), 512 + 8 * e.length);
                        return h(c(s.concat(n), 640));
                    }(p(t), p(e));
                }
                e.exports = function (t, e, i) {
                    return e ? i ? m(e, t) : function (t, e) {
                        return f(m(t, e));
                    }(e, t) : i ? d(t) : function (t) {
                        return f(d(t));
                    }(t);
                };
            }, {}]
        }, {}, [4])(4);
    });
    var z = [{
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
    }];
    var I = [{
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
    }];
    var j = navigator.userAgent;
    function K() {
        return j;
    }
    function q(t) {
        return J(t || j, z);
    }
    function $(t) {
        return J(t || j, I);
    }
    function G(t, e) {
        try {
            var i = new RegExp(e).exec(t);
            return i ? {
                name: i[1] || "Other",
                major: i[2] || "0",
                minor: i[3] || "0",
                patch: i[4] || "0"
            } : null;
        } catch (Po) {
            return null;
        }
    }
    function J(t, e) {
        for (var i = null, n = null, r = -1, o = !1; ++r < e.length && !o;) {
            i = e[r];
            for (var s = -1; ++s < i.patterns.length && !o;) {
                o = null !== (n = G(t, i.patterns[s]));
            }
        }
        return o ? (n.family = i.family || i.name_replace || n.name, i.name_replace && (n.name = i.name_replace), i.major_replace && (n.major = i.major_replace), i.minor_replace && (n.minor = i.minor_replace), i.patch_replace && (n.minor = i.patch_replace), n) : {
            family: "Other",
            name: "Other",
            major: "0",
            minor: "0",
            patch: "0"
        };
    }
    function X() {
        var t = this;
        var e = q();
        var i = K();
        this.agent = i.toLowerCase();
        this.language = window.navigator.userLanguage || window.navigator.language;
        this.isCSS1 = "CSS1Compat" === (document.compatMode || "");
        this.width = function () {
            return window.innerWidth && window.document.documentElement.clientWidth ? Math.min(window.innerWidth, document.documentElement.clientWidth) : window.innerWidth || window.document.documentElement.clientWidth || document.body.clientWidth;
        };
        this.height = function () {
            return window.innerHeight || window.document.documentElement.clientHeight || document.body.clientHeight;
        };
        this.scrollX = function () {
            return window.pageXOffset !== undefined ? window.pageXOffset : t.isCSS1 ? document.documentElement.scrollLeft : document.body.scrollLeft;
        };
        this.scrollY = function () {
            return window.pageYOffset !== undefined ? window.pageYOffset : t.isCSS1 ? document.documentElement.scrollTop : document.body.scrollTop;
        };
        this.type = "Edge" === e.family ? "edge" : "Internet Explorer" === e.family ? "ie" : "Chrome" === e.family ? "chrome" : "Safari" === e.family ? "safari" : "Firefox" === e.family ? "firefox" : e.family.toLowerCase();
        this.version = 1 * (e.major + "." + e.minor) || 0;
        this.hasPostMessage = !!window.postMessage;
    }
    X.prototype.hasEvent = function (t, e) {
        return "on" + t in (e || document.createElement("div"));
    };
    X.prototype.getScreenDimensions = function () {
        var t = {};
        for (var e in window.screen) {
            t[e] = window.screen[e];
        }
        delete t.orientation;
        return t;
    };
    X.prototype.getOrientation = function () {
        return "function" == typeof matchMedia ? matchMedia("(orientation: landscape)").matches ? "landscape" : "portrait" : window.screen.orientation ? screen.orientation.type.startsWith("landscape") ? "landscape" : "portrait" : this.width() > this.height() ? "landscape" : "portrait";
    };
    X.prototype.getWindowDimensions = function () {
        return [this.width(), this.height()];
    };
    X.prototype.interrogateNavigator = function () {
        var t = {};
        for (var e in window.navigator) {
            if ("webkitPersistentStorage" !== e) {
                try {
                    t[e] = window.navigator[e];
                } catch (Oo) {}
            }
        }
        delete t.plugins;
        delete t.mimeTypes;
        t.plugins = [];
        if (window.navigator.plugins) {
            for (var i = 0; i < window.navigator.plugins.length; i++) {
                t.plugins[i] = window.navigator.plugins[i].filename;
            }
        }
        return t;
    };
    X.prototype.supportsPST = function () {
        return document.hasPrivateToken !== undefined;
    };
    X.prototype.supportsCanvas = function () {
        var t = document.createElement("canvas");
        return !(!t.getContext || !t.getContext("2d"));
    };
    X.prototype.supportsWebAssembly = function () {
        try {
            if ("object" == typeof WebAssembly && "function" == typeof WebAssembly.instantiate) {
                var t = new WebAssembly.Module(Uint8Array.of(0, 97, 115, 109, 1, 0, 0, 0));
                if (t instanceof WebAssembly.Module) {
                    return new WebAssembly.Instance(t) instanceof WebAssembly.Instance;
                }
            }
        } catch (Po) {
            return !1;
        }
    };
    var Y = new X();
    var Q = new function () {
        var t;
        var e;
        var i = $();
        var n = K();
        this.mobile = (t = !!("ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0), e = !1, i && (e = ["iOS", "Windows Phone", "Windows Mobile", "Android", "BlackBerry OS"].indexOf(i.name) >= 0), t && e);
        this.dpr = function () {
            return window.devicePixelRatio || 1;
        };
        this.mobile && i && "Windows" === i.family && n.indexOf("touch") < 0 && (this.mobile = !1);
        this.os = "iOS" === i.family ? "ios" : "Android" === i.family ? "android" : "Mac OS X" === i.family ? "mac" : "Windows" === i.family ? "windows" : "Linux" === i.family ? "linux" : i.family.toLowerCase();
        this.version = function () {
            if (!i) {
                return "unknown";
            }
            var t = i.major;
            i.minor && (t += "." + i.minor);
            i.patch && (t += "." + i.patch);
            return t;
        }();
    }();
    var tt = {
        Browser: Y,
        System: Q,
        supportsPAT: function () {
            return ("mac" === Q.os || "ios" === Q.os) && "safari" === Y.type && Y.version >= 16.2;
        }
    };
    var et = {
        CHALLENGE_PASSED: "challenge-passed",
        CHALLENGE_ESCAPED: "challenge-escaped",
        CHALLENGE_CLOSED: "challenge-closed",
        CHALLENGE_EXPIRED: "challenge-expired",
        CHALLENGE_ALREADY_CLOSED: "challenge-already-closed",
        AUTHENTICATION_DONE: "authentication-done",
        AUTHENTICATION_PASSED: "authentication-passed"
    };
    var it = {
        INVALID_DATA: "invalid-data",
        BUNDLE_ERROR: "bundle-error",
        RATE_LIMITED: "rate-limited",
        NETWORK_ERROR: "network-error",
        CHALLENGE_ERROR: "challenge-error",
        CHALLENGE_FAILED: "challenge-failed",
        INCOMPLETE_ANSWER: "incomplete-answer",
        MISSING_CAPTCHA: "missing-captcha",
        MISSING_SITEKEY: "missing-sitekey",
        INVALID_CAPTCHA_ID: "invalid-captcha-id",
        AUTHENTICATION_ERROR: "authentication-error"
    };
    var nt = "https://hcaptcha.com";
    var rt = "https://api.hcaptcha.com";
    var ot = "https://api2.hcaptcha.com";
    var st = "https://cloudflare.hcaptcha.com";
    var at = [nt, rt, ot, st];
    var lt = {
        __proto__: null,
        CaptchaEvent: et,
        CaptchaError: it,
        ROOT_ENDPOINT: nt,
        API_ENDPOINT: rt,
        API2_ENDPOINT: ot,
        CF_ENDPOINT: st,
        EXECUTE_MODE: {
            AUTO: "auto"
        },
        MAIN_ENDPOINTS: at
    };
    var ct = {
        host: null,
        file: null,
        sitekey: null,
        a11y_tfe: null,
        pingdom: "safari" === tt.Browser.type && "windows" !== tt.System.os && "mac" !== tt.System.os && "ios" !== tt.System.os && "android" !== tt.System.os,
        assetDomain: "https://newassets.hcaptcha.com",
        assetUrl: "https://newassets.hcaptcha.com/captcha/v1/a28812e910b57e4ac097884908bc2d05a8975c8a/static",
        width: null,
        height: null,
        mobile: null,
        orientation: "portrait",
        challenge_type: null
    };
    var ht = {
        theme: {
            contrast: {
                hcolor: "#FFF",
                hfcolor: "#000"
            },
            light: {
                hcolor: "#00838F",
                hfcolor: "#FFF"
            }
        },
        text: "#555555",
        accent: "#926FC1",
        warn: {
            base: "#BF1722",
            hover: "#9D1B1B"
        },
        link: {
            base: "#00838f",
            hover: "#00838f"
        },
        white: "#fff",
        grey: {
            base: "#333",
            placeholder: "#f0eff0",
            selected: "#5C6F8A",
            hover: "#D1D7E0"
        },
        purple: "#65549b",
        hoverOff: "#00838f",
        skipHoverOff: "#737373",
        hoverOn: "#00838f",
        error: "#fc481e",
        outline: "#262D38",
        outlineLight: "#3D4A5C"
    };
    var ut = {
        se: null,
        custom: !1,
        tplinks: "on",
        language: null,
        reportapi: "https://accounts.hcaptcha.com",
        endpoint: rt,
        pstIssuer: "https://pst-issuer.hcaptcha.com",
        size: "normal",
        theme: "light",
        mode: undefined,
        assethost: null,
        imghost: null,
        recaptchacompat: "true",
        pat: "on",
        confirmNav: !1
    };
    var ft = "https://30910f52569b4c17b1081ead2dae43b4@sentry.hcaptcha.com/6";
    var pt = "a28812e910b57e4ac097884908bc2d05a8975c8a";
    var dt = "prod";
    function mt(t, e) {
        t.style.width = "302px";
        t.style.height = "76px";
        t.style.backgroundColor = "#f9e5e5";
        t.style.position = "relative";
        t.innerHTML = "";
        var i = document.createElement("div");
        i.style.width = "284px";
        i.style.position = "absolute";
        i.style.top = "12px";
        i.style.left = "10px";
        i.style.color = "#7c0a06";
        i.style.fontSize = "14px";
        i.style.fontWeight = "normal";
        i.style.lineHeight = "18px";
        i.innerHTML = e || "Please <a style='color:inherit;text-decoration:underline; font: inherit' target='_blank' href='https://www.whatismybrowser.com/guides/how-to-update-your-browser/auto'>upgrade your browser</a> to complete this captcha.";
        t.appendChild(i);
    }
    function yt(t) {
        for (var e = document.getElementsByClassName("h-captcha"), i = [], n = 0; n < e.length; n++) {
            i.push(e[n]);
        }
        var r = [];
        if ("off" !== ut.recaptchacompat) {
            for (var o = document.getElementsByClassName("g-recaptcha"), s = 0; s < o.length; s++) {
                r.push(o[s]);
            }
        }
        for (var a = [].concat(i, r), l = 0; l < a.length; l++) {
            t(a[l]);
        }
    }
    var gt = "The captcha failed to load.";
    var bt = [];
    function vt(t) {
        for (var e = [], i = /(https?|wasm):\/\//, n = /^at /, r = /:\d+:\d+/g, o = 0, s = t.length; o < s; o++) {
            var a = t[o];
            if (!i.test(a)) {
                var l = a.trim().replace(n, "").replace(r, "");
                e.push(l);
            }
        }
        return e.join("\n").trim();
    }
    function wt(t) {
        if (t && "string" == typeof t && -1 === bt.indexOf(t) && !(bt.length >= 10)) {
            var e = vt(t.trim().split("\n").slice(0, 2));
            bt.push(e);
        }
    }
    function xt(t) {
        t && "object" == typeof t || (t = {
            name: "error",
            message: "",
            stack: ""
        });
        var e = {
            message: t.name + ": " + t.message
        };
        t.stack && (e.stack_trace = {
            trace: t.stack
        });
        St("report error", "internal", "debug", e);
        Et(t.message || "internal error", "error", ct.file, t);
    }
    function kt(t) {
        return function () {
            try {
                return t.apply(this, arguments);
            } catch (Oo) {
                xt(Oo);
                yt(function (t) {
                    mt(t, gt);
                });
                throw Oo;
            }
        };
    }
    function _t(t) {
        if (ut.sentry) {
            var e = !1;
            var i = !1;
            try {
                e = -1 !== window.location.href.indexOf("chargebee.com");
                i = -1 !== window.location.href.indexOf("kobo");
            } catch (Po) {}
            window.Raven && Raven.config(ft, {
                release: pt,
                environment: dt,
                autoBreadcrumbs: {
                    xhr: !0,
                    dom: !0,
                    sentry: !0
                },
                tags: {
                    "site-host": ct.host,
                    "site-key": ct.sitekey,
                    "endpoint-url": ut.endpoint,
                    "asset-url": ct.assetUrl
                },
                sampleRate: e || i ? 1 : .01,
                ignoreErrors: ["Cannot set properties of undefined (setting 'data')", "canvas.contentDocument", "Can't find variable: ZiteReader", "Cannot redefine property: hcaptcha", "Cannot redefine property: BetterJsPop", "grecaptcha is not defined", "jQuery is not defined", "$ is not defined", "Script is not a function"]
            });
            window.Raven && Raven.setUserContext({
                "Browser-Agent": tt.Browser.agent,
                "Browser-Type": tt.Browser.type,
                "Browser-Version": tt.Browser.version,
                "System-OS": tt.System.os,
                "System-Version": tt.System.version,
                "Is-Mobile": tt.System.mobile
            });
            St(ct.file + "_internal", "setup", "info");
            t && (window.onerror = function (t, e, i, n, r) {
                r && "object" == typeof r || (r = {});
                var o = r.name || "Error";
                var s = r.stack || "";
                kt(wt)(s);
                -1 === s.indexOf("chrome-extension://") && -1 === s.indexOf("safari-extension://") && -1 === s.indexOf("moz-extension://") && -1 === s.indexOf("chrome://internal-") && -1 === s.indexOf("/hammerhead.js") && -1 === s.indexOf("eval at buildCode") && -1 === s.indexOf("u.c.b.r.o.w.s.e.r/ucbrowser_script.js") && (St(t, "global", "debug", {
                    name: o,
                    url: e,
                    line: i,
                    column: n,
                    stack: s
                }), Ct("global", r, {
                    message: t
                }));
            });
        }
    }
    function Et(t, e, i, n) {
        e = e || "error";
        if (ut.sentry) {
            var r = "warn" === e ? "warning" : e;
            window.Raven && Raven.captureMessage(t, {
                level: r,
                logger: i,
                extra: n
            });
        }
    }
    function Ct(t, e, i) {
        (i = i || {}).error = e;
        return Et(e && e.message || "Missing error message", "error", t, i);
    }
    function St(t, e, i, n) {
        ut.sentry && window.Raven && Raven.captureBreadcrumb({
            message: t,
            category: e,
            level: i,
            data: n
        });
    }
    var Vt = {
        __proto__: null,
        _stackTraceSet: bt,
        toRefinedString: vt,
        reportError: xt,
        errorWrapper: kt,
        initSentry: _t,
        sentryMessage: Et,
        sentryError: Ct,
        sentryBreadcrumb: St
    };
    function Tt() {
        var t = [];
        var e = null;
        var i = !1;
        var n = [];
        function r(e) {
            try {
                if (t.length >= 10) {
                    return;
                }
                var i = e.stack;
                if ("string" != typeof i) {
                    return;
                }
                var n = i.trim().split("\n");
                "Error" === n[0] && (n = n.slice(1));
                for (var r = /extension/, o = n.length; o--;) {
                    var s = n[o];
                    if (r.test(s)) {
                        n = [s];
                        break;
                    }
                }
                o < 0 && (n = n.slice(-2));
                var a = vt(n);
                a && -1 === t.indexOf(a) && t.push(a);
            } catch (e) {
                return;
            }
        }
        function o() {
            if (i) {
                try {
                    for (var t = 0; t < n.length; t++) {
                        n[t]();
                    }
                    null !== e && clearTimeout(e);
                } catch (o) {
                    r(o);
                } finally {
                    n = [];
                    e = null;
                    i = !1;
                }
            }
        }
        function s(e, s) {
            var a = Object.getOwnPropertyDescriptor(e, s);
            if (!(a && !1 === a.writable)) {
                var l = Object.prototype.hasOwnProperty.call(e, s);
                var c = e[s];
                e[s] = function () {
                    i && (t.length >= 10 && o(), r(new Error()));
                    return c.apply(e, arguments);
                };
                n.push(function () {
                    l ? e[s] = c : delete e[s];
                });
            }
        }
        return {
            run: function (t) {
                if (!i) {
                    i = !0;
                    isFinite(t) && (e = setTimeout(function () {
                        o();
                    }, t));
                    try {
                        s(document, "getElementsByClassName");
                        s(document, "getElementById");
                        s(document, "querySelector");
                        s(document, "querySelectorAll");
                        s(document, "getElementsByTagName");
                        s(console, "log");
                    } catch (n) {
                        o();
                        r(n);
                    }
                }
            },
            collect: function () {
                return t.concat(bt);
            }
        };
    }
    var At = {
        getCookie: function (t) {
            var e = document.cookie.replace(/ /g, "").split(";");
            try {
                for (var i = "", n = e.length; n-- && !i;) {
                    e[n].indexOf(t) >= 0 && (i = e[n]);
                }
                return i;
            } catch (Po) {
                return "";
            }
        },
        hasCookie: function (t) {
            return !!At.getCookie(t);
        },
        supportsAPI: function () {
            try {
                return "hasStorageAccess" in document && "requestStorageAccess" in document;
            } catch (Po) {
                return !1;
            }
        },
        hasAccess: function () {
            return new Promise(function (t) {
                document.hasStorageAccess().then(function () {
                    t(!0);
                })["catch"](function () {
                    t(!1);
                });
            });
        },
        requestAccess: function () {
            try {
                return document.requestStorageAccess();
            } catch (Po) {
                return Promise.resolve();
            }
        }
    };
    var Mt = {
        array: function (t) {
            if (0 === t.length) {
                return t;
            }
            for (var e, i, n = t.length; --n > -1;) {
                i = Math.floor(Math.random() * (n + 1));
                e = t[n];
                t[n] = t[i];
                t[i] = e;
            }
            return t;
        }
    };
    function Rt(t) {
        this.r = 255;
        this.g = 255;
        this.b = 255;
        this.a = 1;
        this.h = 1;
        this.s = 1;
        this.l = 1;
        this.parseString(t);
    }
    function Bt(t, e, i) {
        i < 0 && (i += 1);
        i > 1 && (i -= 1);
        return i < 1 / 6 ? t + 6 * (e - t) * i : i < .5 ? e : i < 2 / 3 ? t + (e - t) * (2 / 3 - i) * 6 : t;
    }
    Rt.hasAlpha = function (t) {
        return "string" == typeof t && (-1 !== t.indexOf("rgba") || 9 === t.length && "#" === t[0]);
    };
    Rt.prototype.parseString = function (t) {
        t && (0 === t.indexOf("#") ? this.fromHex(t) : 0 === t.indexOf("rgb") && this.fromRGBA(t));
    };
    Rt.prototype.fromHex = function (t) {
        var e = 1;
        9 === t.length && (e = parseInt(t.substr(7, 2), 16) / 255);
        var i = (t = t.substr(1, 6)).replace(/^([a-f\d])([a-f\d])([a-f\d])?$/i, function (t, e, i, n) {
            return e + e + i + i + n + n;
        });
        var n = parseInt(i, 16);
        var r = n >> 16;
        var o = n >> 8 & 255;
        var s = 255 & n;
        this.setRGBA(r, o, s, e);
    };
    Rt.prototype.fromRGBA = function (t) {
        var e = t.indexOf("rgba");
        var i = t.substr(e).replace(/rgba?\(/, "").replace(/\)/, "").replace(/[\s+]/g, "").split(",");
        var n = Math.floor(parseInt(i[0]));
        var r = Math.floor(parseInt(i[1]));
        var o = Math.floor(parseInt(i[2]));
        var s = parseFloat(i[3]);
        this.setRGBA(n, r, o, s);
    };
    Rt.prototype.setRGB = function (t, e, i) {
        this.setRGBA(t, e, i, 1);
    };
    Rt.prototype.setRGBA = function (t, e, i, n) {
        this.r = t;
        this.g = e;
        this.b = i;
        this.a = isNaN(n) ? this.a : n;
        this.updateHSL();
    };
    Rt.prototype.hsl2rgb = function (t, e, i) {
        if (0 === e) {
            var n = Math.round(255 * i);
            this.setRGB(n, n, n);
            return this;
        }
        var r = i <= .5 ? i * (1 + e) : i + e - i * e;
        var o = 2 * i - r;
        this.r = Math.round(255 * Bt(o, r, t + 1 / 3));
        this.g = Math.round(255 * Bt(o, r, t));
        this.b = Math.round(255 * Bt(o, r, t - 1 / 3));
        this.h = t;
        this.s = e;
        this.l = i;
        return this;
    };
    Rt.prototype.updateHSL = function () {
        var t;
        var e = this.r / 255;
        var i = this.g / 255;
        var n = this.b / 255;
        var r = Math.max(e, i, n);
        var o = Math.min(e, i, n);
        var s = null;
        var a = (r + o) / 2;
        if (r === o) {
            s = t = 0;
        } else {
            var l = r - o;
            t = a > .5 ? l / (2 - r - o) : l / (r + o);
            switch (r) {
                case e:
                    s = (i - n) / l + (i < n ? 6 : 0);
                    break;
                case i:
                    s = (n - e) / l + 2;
                    break;
                case n:
                    s = (e - i) / l + 4;
            }
            s /= 6;
        }
        this.h = s;
        this.s = t;
        this.l = a;
        return this;
    };
    Rt.prototype.getHex = function () {
        return "#" + ((1 << 24) + (this.r << 16) + (this.g << 8) + this.b).toString(16).slice(1);
    };
    Rt.prototype.getRGBA = function () {
        return "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")";
    };
    Rt.prototype.clone = function () {
        var t = new Rt();
        t.setRGBA(this.r, this.g, this.b, this.a);
        return t;
    };
    Rt.prototype.mix = function (t, e) {
        t instanceof Rt || (t = new Rt(t));
        var i = new Rt();
        var n = Math.round(this.r + e * (t.r - this.r));
        var r = Math.round(this.g + e * (t.g - this.g));
        var o = Math.round(this.b + e * (t.b - this.b));
        i.setRGB(n, r, o);
        return i;
    };
    Rt.prototype.blend = function (t, e) {
        var i;
        t instanceof Rt || (t = new Rt(t));
        for (var n = [], r = 0; r < e; r++) {
            i = this.mix.call(this, t, r / e);
            n.push(i);
        }
        return n;
    };
    Rt.prototype.lightness = function (t) {
        t > 1 && (t /= 100);
        this.hsl2rgb(this.h, this.s, t);
        return this;
    };
    Rt.prototype.saturation = function (t) {
        t > 1 && (t /= 100);
        this.hsl2rgb(this.h, t, this.l);
        return this;
    };
    Rt.prototype.hue = function (t) {
        this.hsl2rgb(t / 360, this.s, this.l);
        return this;
    };
    var Ut = {
        decode: function (t) {
            try {
                var e = t.split(".");
                return {
                    header: JSON.parse(atob(e[0])),
                    payload: JSON.parse(atob(e[1])),
                    signature: atob(e[2].replace(/_/g, "/").replace(/-/g, "+")),
                    raw: {
                        header: e[0],
                        payload: e[1],
                        signature: e[2]
                    }
                };
            } catch (Po) {
                throw new Error("Token is invalid.");
            }
        },
        checkExpiration: function (t) {
            if (new Date(1e3 * t) <= new Date(Date.now())) {
                throw new Error("Token is expired.");
            }
            return !0;
        }
    };
    var Lt = {
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
        _init: function () {
            for (var t, e = window.requestAnimationFrame, i = window.cancelAnimationFrame, n = ["ms", "moz", "webkit", "o"], r = n.length; --r > -1 && !e;) {
                e = window[n[r] + "RequestAnimationFrame"];
                i = window[n[r] + "CancelAnimationFrame"] || window[n[r] + "CancelRequestAnimationFrame"];
            }
            e ? (Lt.requestFrame = e.bind(window), Lt.cancelFrame = i.bind(window)) : (t = Date.now(), Lt.requestFrame = function (e) {
                window.setTimeout(function () {
                    e(Date.now() - t);
                }, 1e3 * Lt._singleFrame);
            }, Lt.cancelFrame = function (t) {
                clearTimeout(t);
                return null;
            });
            Lt._setup = !0;
            Lt._startTime = Lt._lastTime = Date.now();
        },
        add: function (t, e) {
            Lt._renders.push({
                callback: t,
                paused: !1 == !e || !1
            });
            !1 == !e && Lt.start();
        },
        remove: function (t) {
            for (var e = Lt._renders.length; --e > -1;) {
                Lt._renders[e].callback === t && (Lt._renders[e].paused = !0, Lt._renders.splice(e, 1));
            }
        },
        start: function (t) {
            !1 === Lt._setup && Lt._init();
            if (t) {
                for (var e = Lt._renders.length; --e > -1;) {
                    Lt._renders[e].callback === t && (Lt._renders[e].paused = !1);
                }
            }
            !0 !== Lt._running && (Lt._paused = !1, Lt._running = !0, Lt._af = Lt.requestFrame(Lt._update));
        },
        stop: function (t) {
            if (t) {
                for (var e = Lt._renders.length; --e > -1;) {
                    Lt._renders[e].callback === t && (Lt._renders[e].paused = !0);
                }
            } else {
                !1 !== Lt._running && (Lt._af = Lt.cancelFrame(Lt._af), Lt._paused = !0, Lt._running = !1);
            }
        },
        elapsed: function () {
            return Date.now() - Lt._startTime;
        },
        fps: function (t) {
            return arguments.length ? (Lt._fps = t, Lt._singleFrame = 1 / (Lt._fps || 60), Lt._adjustedLag = 2 * Lt._singleFrame, Lt._nextTime = Lt.time + Lt._singleFrame, Lt._fps) : Lt._fps;
        },
        isRunning: function () {
            return Lt._running;
        },
        _update: function () {
            if (!Lt._paused && (Lt._elapsed = Date.now() - Lt._lastTime, Lt._tick = !1, Lt._elapsed > Lt._lagThreshold && (Lt._startTime += Lt._elapsed - Lt._adjustedLag), Lt._lastTime += Lt._elapsed, Lt.time = (Lt._lastTime - Lt._startTime) / 1e3, Lt._difference = Lt.time - Lt._nextTime, Lt._difference > 0 && (Lt.frame++, Lt._nextTime += Lt._difference + (Lt._difference >= Lt._singleFrame ? Lt._singleFrame / 4 : Lt._singleFrame - Lt._difference), Lt._tick = !0), Lt._af = Lt.requestFrame(Lt._update), !0 === Lt._tick && Lt._renders.length > 0)) {
                for (var t = Lt._renders.length; --t > -1;) {
                    Lt._renders[t] && !1 === Lt._renders[t].paused && Lt._renders[t].callback(Lt.time);
                }
            }
        }
    };
    function Ht(t) {
        for (var e, i, n, r = {}, o = t ? t.indexOf("&") >= 0 ? t.split("&") : [t] : [], s = 0; s < o.length; s++) {
            if (o[s].indexOf("=") >= 0) {
                e = o[s].split("=");
                i = decodeURIComponent(e[0]);
                "false" !== (n = decodeURIComponent(e[1])) && "true" !== n || (n = "true" === n);
                if ("theme" === i || "themeConfig" === i) {
                    try {
                        n = JSON.parse(n);
                    } catch (Po) {}
                }
                r[i] = n;
            }
        }
        return r;
    }
    function Ot(t) {
        var e = [];
        for (var i in t) {
            var n = t[i];
            n = "object" == typeof n ? JSON.stringify(n) : n;
            e.push([encodeURIComponent(i), encodeURIComponent(n)].join("="));
        }
        return e.join("&");
    }
    var Pt = {
        __proto__: null,
        Decode: Ht,
        Encode: Ot
    };
    function Ft(t, e, i) {
        return Math.min(Math.max(t, e), i);
    }
    function Zt(t, e, i, n, r, o) {
        var s = (t - e) * (r - n) / (i - e) + n;
        return !1 === o ? s : Ft(s, Math.min(n, r), Math.max(n, r));
    }
    function Nt(t) {
        return t * (Math.PI / 180);
    }
    function Dt(t) {
        return 180 * t / Math.PI;
    }
    var Wt = {
        __proto__: null,
        clamp: Ft,
        range: Zt,
        toRadians: Nt,
        toDegrees: Dt
    };
    function zt(t, e) {
        this._period = t;
        this._interval = e;
        this._date = [];
        this._data = [];
        this._prevTimestamp = 0;
        this._meanPeriod = 0;
        this._medianPeriod = 0;
        this._medianMaxHeapSize = 32;
        this._medianMinHeap = [];
        this._medianMaxHeap = [];
        this._meanCounter = 0;
    }
    function It(t) {
        return new Promise(function (e, i) {
            t(e, i, function n() {
                t(e, i, n);
            });
        });
    }
    function jt(t, e) {
        var i = "attempts" in (e = e || {}) ? e.attempts : 1;
        var n = e.delay || 0;
        var r = e.onFail;
        return It(function (e, o, s) {
            t().then(e, function (t) {
                var e = i-- > 0;
                if (r) {
                    var a = r(t, i);
                    a && (e = !1 !== a.retry && e, n = a.delay);
                }
                e ? setTimeout(s, n || 0) : o(t);
            });
        });
    }
    zt.prototype.getMeanPeriod = function () {
        return this._meanPeriod;
    };
    zt.prototype.getMedianPeriod = function () {
        return this._medianPeriod;
    };
    zt.prototype.getData = function () {
        this._cleanStaleData();
        return this._data;
    };
    zt.prototype.getSize = function () {
        this._cleanStaleData();
        return this._data.length;
    };
    zt.prototype.getCapacity = function () {
        return 0 === this._period ? this._interval : Math.ceil(this._interval / this._period);
    };
    zt.prototype.push = function (t, e) {
        this._cleanStaleData();
        var i = 0 === this._date.length;
        t - (this._date[this._date.length - 1] || 0) >= this._period && (this._date.push(t), this._data.push(e));
        if (!i) {
            var n = t - this._prevTimestamp;
            this._meanPeriod = (this._meanPeriod * this._meanCounter + n) / (this._meanCounter + 1);
            this._meanCounter++;
            this._medianPeriod = this._calculateMedianPeriod(n);
        }
        this._prevTimestamp = t;
    };
    zt.prototype._calculateMedianPeriod = function (t) {
        this._medianMaxHeap || (this._medianMaxHeap = []);
        this._medianMinHeap || (this._medianMinHeap = []);
        var e = this._fetchMedianPeriod();
        0 === this._medianMaxHeap.length && 0 === this._medianMinHeap.length ? this._medianMaxHeap.push(t) : t <= e ? (this._medianMaxHeap.push(t), this._medianMaxHeap.sort(function (t, e) {
            return e - t;
        })) : (this._medianMinHeap.push(t), this._medianMinHeap.sort(function (t, e) {
            return t - e;
        }));
        this._rebalanceHeaps();
        return this._fetchMedianPeriod();
    };
    zt.prototype._rebalanceHeaps = function () {
        var t = null;
        this._medianMaxHeap.length > this._medianMinHeap.length + 1 ? (t = this._medianMaxHeap.shift(), this._medianMinHeap.push(t), this._medianMinHeap.sort(function (t, e) {
            return t - e;
        })) : this._medianMinHeap.length > this._medianMaxHeap.length + 1 && (t = this._medianMinHeap.shift(), this._medianMaxHeap.push(t), this._medianMaxHeap.sort(function (t, e) {
            return e - t;
        }));
        this._medianMinHeap.length == this._medianMaxHeap.length && this._medianMaxHeap.length > this._medianMaxHeapSize && (this._medianMinHeap.pop(), this._medianMaxHeap.pop());
    };
    zt.prototype._fetchMedianPeriod = function () {
        return this._medianMaxHeap.length > this._medianMinHeap.length ? this._medianMaxHeap[0] : this._medianMinHeap.length > this._medianMaxHeap.length ? this._medianMinHeap[0] : 0 !== this._medianMaxHeap.length && 0 !== this._medianMinHeap.length ? (this._medianMaxHeap[0] + this._medianMinHeap[0]) / 2 : -1;
    };
    zt.prototype._cleanStaleData = function () {
        for (var t = Date.now(), e = this._date.length - 1; e >= 0; e--) {
            if (t - this._date[e] >= this._interval) {
                this._date.splice(0, e + 1);
                this._data.splice(0, e + 1);
                break;
            }
        }
    };
    var Kt = {
        __proto__: null,
        promiseRecursive: It,
        promiseRetry: jt
    };
    function qt(t) {
        var e = [].slice.call(arguments, 1);
        "string" == typeof t ? window[t] ? "function" == typeof window[t] ? window[t].apply(null, e) : console.log("[hCaptcha] Callback '" + t + "' is not a function.") : console.log("[hCaptcha] Callback '" + t + "' is not defined.") : "function" == typeof t ? t.apply(null, e) : console.log("[hcaptcha] Invalid callback '" + t + "'.");
    }
    var $t;
    var Gt = {
        UUID: function (t) {
            return /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i.test(t) || !1;
        },
        UUIDv4: function (t) {
            return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(t) || !1;
        },
        URL: function (t) {
            var e = new RegExp("^(http|https)://");
            var i = new RegExp("^((?!(data|javascript):).)*$");
            return e.test(t) && i.test(t) && -1 === t.indexOf("#");
        },
        IMAGE: function (t) {
            return (0 === t.indexOf("https://") || 0 === t.indexOf("/")) && t.endsWith(".png");
        }
    };
    function Jt(t) {
        var e;
        var i;
        var n = "string" == typeof t ? t : JSON.stringify(t);
        var r = -1;
        $t = $t || function () {
            var t;
            var e;
            var i;
            var n = [];
            for (e = 0; e < 256; e++) {
                t = e;
                i = 0;
                for (; i < 8; i++) {
                    t = 1 & t ? 3988292384 ^ t >>> 1 : t >>> 1;
                }
                n[e] = t;
            }
            return n;
        }();
        e = 0;
        i = n.length;
        for (; e < i; e += 1) {
            r = r >>> 8 ^ $t[255 & (r ^ n.charCodeAt(e))];
        }
        return (-1 ^ r) >>> 0;
    }
    var Xt = {
        container: {},
        set: function (t, e) {
            this.container[t] = e;
        },
        clear: function () {
            this.container = {};
        }
    };
    var Yt = {
        __proto__: null,
        createErrorsAggregator: Tt,
        uuid: function () {
            return Math.random().toString(36).substr(2);
        },
        Render: Lt,
        JWT: Ut,
        Color: Rt,
        Shuffle: Mt,
        MathUtil: Wt,
        Storage: At,
        Query: Pt,
        TimeBuffer: zt,
        PromiseUtil: Kt,
        ErrorUtil: Vt,
        _stackTraceSet: bt,
        toRefinedString: vt,
        reportError: xt,
        errorWrapper: kt,
        initSentry: _t,
        sentryMessage: Et,
        sentryError: Ct,
        sentryBreadcrumb: St,
        renderFallback: mt,
        forEachCaptchaNode: yt,
        callUserFunction: function () {
            try {
                qt.apply(null, arguments);
            } catch (Oo) {
                console.error("[hCaptcha] There was an error in your callback.");
                console.error(Oo);
            }
        },
        composeParams: function (t, e) {
            for (var i = ["hl", "custom", "tplinks", "sitekey", "theme", "type", "size", "tabindex", "callback", "expired-callback", "chalexpired-callback", "error-callback", "open-callback", "close-callback", "endpoint", "challenge-container", "confirm-nav", "orientation", "mode"], n = {}, r = 0; r < i.length; r++) {
                var o = i[r];
                var s = e && e[o];
                s || (s = t.getAttribute("data-" + o));
                s && (n[o] = s);
            }
            return n;
        },
        is: Gt,
        promiseRecursive: It,
        promiseRetry: jt,
        crc32: Jt,
        TaskContext: Xt
    };
    function Qt() {
        var t = this;
        this._bottom = 0;
        this._top = 0;
        this.storage = {};
        this.add = function (e) {
            t.storage[t._top] = e;
            t._top++;
            return e;
        };
        this.remove = function () {
            if (!t.empty()) {
                var e = t._bottom;
                var i = t.storage[e];
                t.storage[e] = null;
                t._bottom++;
                return i;
            }
        };
        this.empty = function () {
            return t._top === t._bottom;
        };
        this.size = function () {
            return t._top - t._bottom;
        };
    }
    var te = {
        queue: Qt,
        depth: function Zo(t, e, i) {
            if ("object" == typeof t && t[e] && t[e].length > 0) {
                for (var n = t[e].length; --n > -1;) {
                    Zo(t[e][n], e, i);
                }
            }
            t !== undefined && i(t);
        },
        breathe: function (t, e, i) {
            var n = new Qt();
            var r = null;
            n.add(t);
            r = n.remove();
            for (; r;) {
                for (var o = 0; o < r[e].length; o++) {
                    n.add(r[e][o]);
                }
                i(r);
                r = n.remove();
            }
        }
    };
    function ee() {
        this.children = [];
        this._events = [];
    }
    ee.prototype.initComponent = function (t, e) {
        var i = new t(e);
        i._parent = this;
        this.children.push(i);
        return i;
    };
    ee.prototype.destroy = function () {
        var t = this;
        try {
            te.depth(this, "children", function (e) {
                if (t !== e) {
                    for (var i = t.children.length; --i > -1;) {
                        t.children[i] === e && t.children.splice(i, 1);
                    }
                }
                e._destroy && e._destroy();
                e = null;
            });
        } catch (Po) {
            throw new Error("Trouble destroying nodes: " + Po);
        }
        return null;
    };
    ee.prototype._destroy = function () {
        this.onDestroy && this.onDestroy();
        for (var t = this._events.length || 0; --t > -1;) {
            this._events.splice(t, 1);
        }
        this.children = null;
        this._destroy = null;
        this._events = null;
        this.destroy = null;
        this.emit = null;
        this.on = null;
        this.off = null;
        this.initComponent = null;
    };
    ee.prototype.on = function (t, e) {
        for (var i = this._events.length, n = !1; --i > -1 && !1 === n;) {
            this._events[i].event === t && (n = this._events[i]);
        }
        !1 === n && (n = {
            event: t,
            listeners: []
        }, this._events.push(n));
        n.listeners.push(e);
    };
    ee.prototype.off = function (t, e) {
        for (var i = this._events.length; --i > -1;) {
            if (this._events[i].event === t) {
                for (var n = this._events[i].listeners.length; --n > -1;) {
                    this._events[i].listeners[n] === e && this._events[i].listeners[n].splice(n, 1);
                }
                0 === this._events[i].listeners.length && this._events[i].splice(i, 1);
            }
        }
    };
    ee.prototype.emit = function (t) {
        for (var e = Array.prototype.slice.call(arguments, 1), i = this._events.length; --i > -1;) {
            if (this._events[i].event === t) {
                for (var n = this._events[i].listeners.length; --n > -1;) {
                    this._events[i].listeners[n].apply(this, e);
                }
            }
        }
    };
    var ie = {
        eventName: function (t, e) {
            var i = t;
            "down" === t || "up" === t || "move" === t || "over" === t || "out" === t ? i = !(tt.System.mobile && "desktop" !== e || "mobile" === e) || "down" !== t && "up" !== t && "move" !== t ? "mouse" + t : "down" === t ? "touchstart" : "up" === t ? "touchend" : "touchmove" : "enter" === t && (i = "keydown");
            return i;
        },
        actionName: function (t) {
            var e = t;
            "touchstart" === e || "mousedown" === e ? e = "down" : "touchmove" === e || "mousemove" === e ? e = "move" : "touchend" === e || "mouseup" === e ? e = "up" : "mouseover" === e ? e = "over" : "mouseout" === e && (e = "out");
            return e;
        },
        eventCallback: function (t, e, i) {
            var n = ie.actionName(t);
            return function (r) {
                r = r || window.event;
                if ("down" === n || "move" === n || "up" === n || "over" === n || "out" === n || "click" === n) {
                    var o = ie.eventCoords(r);
                    if (!o) {
                        return;
                    }
                    var s = i.getBoundingClientRect();
                    r.windowX = o.x;
                    r.windowY = o.y;
                    r.elementX = r.windowX - (s.x || s.left);
                    r.elementY = r.windowY - (s.y || s.top);
                }
                r.keyNum = r.which || r.keyCode || 0;
                "enter" === t && 13 !== r.keyNum && 32 !== r.keyNum || (r.action = n, r.targetElement = i, e(r));
            };
        },
        eventCoords: function (t) {
            if (!t) {
                return null;
            }
            var e = t;
            if (t.touches || t.changedTouches) {
                var i = t.touches && t.touches.length >= 1 ? t.touches : t.changedTouches;
                i && i[0] && (e = i[0]);
            }
            return "number" == typeof e.pageX && "number" == typeof e.pageY ? {
                x: e.pageX,
                y: e.pageY
            } : "number" == typeof e.clientX && "number" == typeof e.clientY ? {
                x: e.clientX,
                y: e.clientY
            } : null;
        }
    };
    var ne = ["Webkit", "Moz", "ms"];
    var re = document.createElement("div").style;
    var oe = {};
    function se(t) {
        var e = oe[t];
        return e || (t in re ? t : oe[t] = function (t) {
            for (var e = t[0].toUpperCase() + t.slice(1), i = ne.length; i--;) {
                if ((t = ne[i] + e) in re) {
                    return t;
                }
            }
        }(t) || t);
    }
    function ae(t, e, i) {
        this.dom = null;
        this._clss = [];
        this._nodes = [];
        this._listeners = [];
        this._frag = null;
        if (t && "object" == typeof t) {
            this.dom = t;
            var n = [];
            var r = [];
            "string" == typeof t.className && (r = t.className.split(" "));
            for (var o = 0; o < r.length; o++) {
                "" !== r[o] && " " !== r[o] && n.push(r[o]);
            }
            this._clss = n;
        } else {
            i !== undefined && null !== i || (i = !0);
            (!t || "string" == typeof t && (t.indexOf("#") >= 0 || t.indexOf(".") >= 0)) && (t && (e = t), t = "div");
            this.dom = document.createElement(t);
            e && (e.indexOf("#") >= 0 ? this.dom.id = e.split("#")[1] : (e.indexOf(".") >= 0 && (e = e.split(".")[1]), this.addClass.call(this, e)));
        }
        !0 === i && (this._frag = document.createDocumentFragment(), this._frag.appendChild(this.dom));
    }
    ae.prototype.cloneNode = function (t) {
        try {
            return this.dom.cloneNode(t);
        } catch (Po) {
            Ct("element", Po);
            return null;
        }
    };
    ae.prototype.createElement = function (t, e) {
        try {
            var i = new ae(t, e, !1);
            this.appendElement.call(this, i);
            this._nodes.push(i);
            return i;
        } catch (Po) {
            Ct("element", Po);
            return null;
        }
    };
    ae.prototype.appendElement = function (t) {
        if (t === undefined) {
            return xt({
                name: "DomElement Add Child",
                message: "Child Element is undefined"
            });
        }
        var e;
        e = t._frag !== undefined && null !== t._frag ? t._frag : t.dom !== undefined ? t.dom : t;
        try {
            t instanceof ae && (t._parent = this);
            this.dom.appendChild(e);
        } catch (Po) {
            xt({
                name: "DomElement Add Child",
                message: "Failed to append child."
            });
        }
        return this;
    };
    ae.prototype.removeElement = function (t) {
        try {
            var e;
            if (t._nodes) {
                for (e = t._nodes.length; e--;) {
                    t.removeElement(t._nodes[e]);
                }
            }
            for (e = this._nodes.length; --e > -1;) {
                this._nodes[e] === t && this._nodes.splice(e, 1);
            }
            var i = t instanceof ae ? t.dom : t;
            var n = i.parentNode === this.dom ? this.dom : i.parentNode;
            n.removeChild && n.removeChild(i);
            if (!n) {
                throw new Error("Child component does not have correct setup");
            }
            t.__destroy && t.__destroy();
        } catch (Po) {
            xt({
                name: "DomElement Remove Child",
                message: Po.message || "Failed to remove child."
            });
        }
    };
    ae.prototype.addClass = function (t) {
        !1 === this.hasClass.call(this, t) && (this._clss.push(t), this.dom.className = this._clss.join(" "));
        return this;
    };
    ae.prototype.hasClass = function (t) {
        for (var e = -1 !== this.dom.className.split(" ").indexOf(t), i = this._clss.length; i-- && !e;) {
            e = this._clss[i] === t;
        }
        return e;
    };
    ae.prototype.removeClass = function (t) {
        for (var e = this._clss.length; --e > -1;) {
            this._clss[e] === t && this._clss.splice(e, 1);
        }
        this.dom.className = this._clss.join(" ");
        return this;
    };
    ae.prototype.text = function (t) {
        if (this && this.dom) {
            if (!t) {
                return this.dom.textContent;
            }
            for (var e, i, n, r, o = /&(.*?);/g, s = /<[a-z][\s\S]*>/i; null !== (e = o.exec(t));) {
                !1 === s.test(e[0]) ? (n = e[0], r = void 0, (r = document.createElement("div")).innerHTML = n, i = r.textContent, t = t.replace(new RegExp(e[0], "g"), i)) : t = t.replace(e[0], "");
            }
            this.dom.textContent = t;
            return this;
        }
    };
    ae.prototype.content = ae.prototype.text;
    ae.prototype.css = function (t) {
        var e;
        var i = "ie" === tt.Browser.type && 8 === tt.Browser.version;
        var n = "safari" === tt.Browser.type && 12 === Math.floor(tt.Browser.version);
        for (var r in t) {
            e = t[r];
            try {
                if ("transition" === r && n) {
                    continue;
                }
                "opacity" !== r && "zIndex" !== r && "fontWeight" !== r && isFinite(e) && parseFloat(e) === e && (e += "px");
                var o = se(r);
                i && "opacity" === r ? this.dom.style.filter = "alpha(opacity=" + 100 * e + ")" : i && Rt.hasAlpha(e) ? this.dom.style[o] = new Rt(e).getHex() : this.dom.style[o] = e;
            } catch (Oo) {}
        }
        return this;
    };
    ae.prototype.backgroundImage = function (t, e, i, n) {
        var r = e !== undefined && i !== undefined;
        var o = {
            "-ms-high-contrast-adjust": "none"
        };
        "object" == typeof e && (n = e);
        n === undefined && (n = {});
        if (r) {
            var s = t.width / t.height;
            var a = e;
            var l = a / s;
            n.cover && l < i && (a = (l = i) * s);
            n.contain && l > i && (a = (l = i) * s);
            o.width = a;
            o.height = l;
            n.center && (o.marginLeft = -a / 2, o.marginTop = -l / 2, o.position = "absolute", o.left = "50%", o.top = "50%");
            (n.left || n.right) && (o.left = n.left || 0, o.top = n.top || 0);
        }
        "ie" === tt.Browser.type && 8 === tt.Browser.version ? o.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + t.src + "',sizingMethod='scale')" : (o.background = "url(" + t.src + ")", o.backgroundPosition = "50% 50%", o.backgroundRepeat = "no-repeat", o.backgroundSize = r ? a + "px " + l + "px" : n.cover ? "cover" : n.contain ? "contain" : "100%");
        this.css.call(this, o);
    };
    ae.prototype.setAttribute = function (t, e) {
        var i;
        if ("object" == typeof t) {
            for (var n in t) {
                i = t[n];
                this.dom.setAttribute(n, i);
            }
        } else {
            this.dom.setAttribute(t, e);
        }
    };
    ae.prototype.removeAttribute = function (t, e) {
        var i;
        if ("object" == typeof t) {
            for (var n in t) {
                i = t[n];
                this.dom.removeAttribute(n, i);
            }
        } else {
            this.dom.removeAttribute(t, e);
        }
    };
    ae.prototype.addEventListener = function (t, e, i) {
        var n = {
            event: ie.eventName(t),
            handler: ie.eventCallback(t, e, this.dom),
            callback: e
        };
        this._listeners.push(n);
        this.dom.addEventListener ? this.dom.addEventListener(n.event, n.handler, i) : this.dom.attachEvent("on" + n.event, n.handler);
        if (t !== n.event && (n.event.indexOf("mouse") >= 0 || n.event.indexOf("touch") >= 0)) {
            var r = n.event.indexOf("touch") >= 0 ? "desktop" : "mobile";
            var o = ie.eventName(t, r);
            if (o === n.event) {
                return;
            }
            this.addEventListener.call(this, o, e, i);
        }
    };
    ae.prototype.removeEventListener = function (t, e, i) {
        for (var n, r = this._listeners.length, o = ie.eventName(t); --r > -1;) {
            (n = this._listeners[r]).event === o && n.callback === e && (this._listeners.splice(r, 1), this.dom.removeEventListener ? this.dom.removeEventListener(n.event, n.handler, i) : this.dom.detachEvent("on" + n.event, n.handler));
        }
    };
    ae.prototype.focus = function () {
        this.dom.focus();
    };
    ae.prototype.blur = function () {
        this.dom.blur();
    };
    ae.prototype.html = function (t) {
        t && (this.dom.innerHTML = t);
        return this.dom.innerHTML;
    };
    ae.prototype.__destroy = function () {
        for (var t, e = this._listeners.length; --e > -1;) {
            t = this._listeners[e];
            this._listeners.splice(e, 1);
            this.dom.removeEventListener ? this.dom.removeEventListener(t.event, t.handler) : this.dom.detachEvent("on" + t.event, t.handler);
        }
        this.dom = null;
        this._clss = [];
        this._nodes = [];
        this._listeners = [];
        this._frag = null;
        t = null;
        return null;
    };
    ae.prototype.isConnected = function () {
        return !!this.dom && ("isConnected" in this.dom ? this.dom.isConnected : !(this.dom.ownerDocument && this.dom.ownerDocument.compareDocumentPosition(this.dom) & this.dom.DOCUMENT_POSITION_DISCONNECTED));
    };
    var le = {
        self: function (t, e) {
            var i = {};
            var n = Array.prototype.slice.call(arguments, 2);
            e.apply(t, n);
            for (var r in t) {
                i[r] = t[r];
            }
        },
        proto: function (t, e) {
            t.prototype = Object.create(e.prototype);
            t.prototype.constructor = t;
        }
    };
    function ce(t, e) {
        le.self(this, ae, e || "div", t);
        this.children = [];
        this._events = [];
    }
    function he(t) {
        if (null === t) {
            return "";
        }
        var e = [];
        ue(t, e);
        return e.join("&");
    }
    function ue(t, e) {
        var i;
        var n;
        if ("object" == typeof t) {
            for (n in t) {
                !0 === fe(i = t[n]) ? ue(i, e) : e[e.length] = pe(n, i);
            }
        } else {
            if (!0 === Array.isArray(t)) {
                for (var r = 0; r < t.length; r++) {
                    !0 === fe(i = t[r]) ? ue(t, e) : e[e.length] = pe(n, i);
                }
            } else {
                e[e.length] = pe(t);
            }
        }
    }
    function fe(t) {
        return !0 === Array.isArray(t) || "object" == typeof t;
    }
    function pe(t, e) {
        return encodeURIComponent(t) + "=" + encodeURIComponent(null === e ? "" : e);
    }
    le.proto(ce, ae);
    ce.prototype.initComponent = function (t, e, i) {
        try {
            var n = new t(e);
            n._parent = this;
            this.children.push(n);
            n.dom && (i !== undefined ? i.appendElement && i.appendElement(n) : this.appendElement(n));
            return n;
        } catch (Po) {
            Ct("component", Po);
            return null;
        }
    };
    ce.prototype.removeComponent = function (t) {
        for (var e = this.children.length; --e > -1;) {
            if (this.children[e] === t) {
                this.children.splice(e, 1);
                break;
            }
        }
        t._destroy && t._destroy();
        t = null;
    };
    ce.prototype.removeAllComponents = function () {
        for (var t = this.children.length; --t > -1;) {
            this.children[t]._destroy && this.children[t]._destroy();
        }
        this.children = [];
    };
    ce.prototype.destroy = function () {
        var t = this;
        try {
            te.depth(this, "children", function (e) {
                if (t !== e) {
                    for (var i = t.children.length; --i > -1;) {
                        t.children[i] === e && t.children.splice(i, 1);
                    }
                }
                e._destroy && e._destroy();
                e = null;
            });
        } catch (Po) {
            throw new Error("Trouble destroying nodes: " + Po);
        }
        return null;
    };
    ce.prototype._destroy = function () {
        try {
            this.onDestroy && this.onDestroy();
            this._parent.removeElement && this._parent.removeElement(this);
            for (var t = this._events.length; --t > -1;) {
                this._events.splice(t, 1);
            }
            this.children = null;
            this._destroy = null;
            this._events = null;
            this.destroy = null;
            this.emit = null;
            this.on = null;
            this.off = null;
            this.initComponent = null;
        } catch (Po) {
            xt({
                name: "DomComponent",
                message: "Failed to destroy."
            });
        }
    };
    ce.prototype.on = function (t, e) {
        for (var i = this._events.length, n = !1; --i > -1 && !1 === n;) {
            this._events[i].event === t && (n = this._events[i]);
        }
        !1 === n && (n = {
            event: t,
            listeners: []
        }, this._events.push(n));
        n.listeners.push(e);
    };
    ce.prototype.off = function (t, e) {
        for (var i = this._events.length; --i > -1;) {
            if (this._events[i].event === t) {
                for (var n = this._events[i].listeners.length; --n > -1;) {
                    this._events[i].listeners[n] === e && this._events[i].listeners.splice(n, 1);
                }
                0 === this._events[i].listeners.length && this._events.splice(i, 1);
            }
        }
    };
    ce.prototype.emit = function (t) {
        for (var e = Array.prototype.slice.call(arguments, 1), i = this._events.length; --i > -1 && this._events;) {
            if (this._events[i].event === t) {
                for (var n = this._events[i].listeners.length; --n > -1;) {
                    this._events[i].listeners[n].apply(this, e);
                }
            }
        }
    };
    var de = {
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
    };
    var me = {
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
    };
    var ye = null;
    var ge = {
        translate: function (t, e) {
            var i = ge.getBestTrans(me);
            var n = i && i[t];
            n = n || t;
            if (e) {
                for (var r = Object.keys(e), o = r.length; o--;) {
                    n = n.replace(new RegExp("{{" + r[o] + "}}", "g"), e[r[o]]);
                }
            }
            return n;
        },
        getBestTrans: function (t) {
            var e = ge.getLocale();
            return e in t ? t[e] : ge.getShortLocale(e) in t ? t[ge.getShortLocale(e)] : "en" in t ? t.en : null;
        },
        resolveLocale: function (t) {
            var e = ge.getShortLocale(t);
            "in" === e && (t = "id");
            "iw" === e && (t = "he");
            "nb" === e && (t = "no");
            "ji" === e && (t = "yi");
            "zh-CN" === t && (t = "zh");
            "jv" === e && (t = "jw");
            "me" === e && (t = "bs");
            return de[t] ? t : de[e] ? e : "en";
        },
        getLocale: function () {
            return ge.resolveLocale(ye || window.navigator.userLanguage || window.navigator.language);
        },
        setLocale: function (t) {
            "zh-Hans" === t ? t = "zh-CN" : "zh-Hant" === t && (t = "zh-TW");
            ye = t;
        },
        getShortLocale: function (t) {
            return t.indexOf("-") >= 0 ? t.substring(0, t.indexOf("-")) : t;
        },
        getLangName: function (t) {
            return de[t];
        },
        isShortLocale: function (t) {
            return 2 === t.length || 3 === t.length;
        },
        addTable: function (t, e) {
            e || (e = Object.create(null));
            if (me[t]) {
                var i = me[t];
                for (var n in e) {
                    i[n] = e[n];
                }
            } else {
                me[t] = e;
            }
            return me[t];
        },
        getTable: function (t) {
            return me[t];
        },
        addTables: function (t) {
            for (var e in t) {
                ge.addTable(e, t[e]);
            }
            return me;
        },
        getTables: function () {
            return me;
        }
    };
    var be = {
        400: "Rate limited or network error. Please retry.",
        429: "Your computer or network has sent too many requests.",
        500: "Cannot contact hCaptcha. Check your connection and try again."
    };
    function ve(t) {
        try {
            return ge.translate(be[t]);
        } catch (Po) {
            return !1;
        }
    }
    var we = "undefined" != typeof XDomainRequest && !("withCredentials" in XMLHttpRequest.prototype);
    function xe(t, e, i) {
        i = i || {};
        var n = {
            url: e,
            method: t.toUpperCase(),
            responseType: i.responseType || "string",
            dataType: i.dataType || null,
            withCredentials: i.withCredentials || !1,
            headers: i.headers || null,
            data: i.data || null,
            timeout: i.timeout || null,
            pst: i.pst || null
        };
        n.legacy = n.withCredentials && we;
        var r = "fetch" in window && n.pst ? _e : ke;
        return i.retry ? jt(function () {
            i.data && (n.data = "function" == typeof i.data ? i.data() : i.data, "json" === n.dataType && "object" == typeof n.data ? n.data = JSON.stringify(n.data) : "query" === n.dataType && (n.data = he(n.data)));
            return r(n);
        }, i.retry) : (i.data && (n.data = "function" == typeof i.data ? i.data() : i.data, "json" === n.dataType && "object" == typeof n.data ? n.data = JSON.stringify(n.data) : "query" === n.dataType && (n.data = he(n.data))), r(n));
    }
    function ke(t) {
        var e = t.legacy ? new XDomainRequest() : new XMLHttpRequest();
        var i = "function" == typeof t.url ? t.url() : t.url;
        return new Promise(function (n, r) {
            var o;
            function s(o) {
                return function () {
                    var s = e.response;
                    var a = e.statusText || "";
                    var l = e.status;
                    var c = e.readyState;
                    s || "" !== e.responseType && "text" !== e.responseType || (s = e.responseText);
                    if (4 === c || t.legacy) {
                        try {
                            if (s) {
                                var h = e.contentType;
                                e.getResponseHeader && (h = e.getResponseHeader("content-type"));
                                var u = -1 !== (h = h ? h.toLowerCase() : "").indexOf("application/json");
                                "ArrayBuffer" in window && s instanceof ArrayBuffer && u && (s = new TextDecoder().decode(new Uint8Array(s)));
                                if ("string" == typeof s) {
                                    try {
                                        s = JSON.parse(s);
                                    } catch (f) {
                                        u && Ct("http", f, {
                                            url: i,
                                            config: t,
                                            responseType: e.responseType,
                                            contentType: h,
                                            response: s
                                        });
                                    }
                                }
                            }
                        } catch (f) {
                            Ct("http", f, {
                                contentType: h
                            });
                            return void r({
                                event: it.NETWORK_ERROR,
                                endpoint: i,
                                response: s,
                                state: c,
                                status: l,
                                message: ve(l || 400) || a
                            });
                        }
                        if ("error" === o || l >= 400 && l <= 511) {
                            return void r({
                                event: it.NETWORK_ERROR,
                                endpoint: i,
                                response: s,
                                state: c,
                                status: l,
                                message: 409 === l && s.error || ve(l || 400) || a
                            });
                        }
                        n({
                            state: c,
                            status: l,
                            body: s,
                            message: a
                        });
                    }
                };
            }
            if ((e.onload = s("complete"), e.onerror = e.ontimeout = s("error"), e.open(t.method, i), "arraybuffer" === t.responseType && (!t.legacy && "TextDecoder" in window && "ArrayBuffer" in window ? e.responseType = "arraybuffer" : (t.responseType = "json", t.headers.accept = "application/json")), t.timeout && (e.timeout = "function" == typeof t.timeout ? t.timeout(i) : t.timeout), !t.legacy) && (e.withCredentials = t.withCredentials, t.headers)) {
                for (var a in t.headers) {
                    o = t.headers[a];
                    e.setRequestHeader(a, o);
                }
            }
            setTimeout(function () {
                e.send(t.data);
            }, 0);
        });
    }
    function _e(t) {
        var e;
        var i = "function" == typeof t.url ? t.url() : t.url;
        var n = new Headers();
        "json" === t.responseType && n.set("content-type", "application/json");
        if (t.headers) {
            for (var r in t.headers) {
                e = t.headers[r];
                n.set(r, e);
            }
        }
        var o = {
            method: t.method,
            credentials: "include",
            body: t.data,
            headers: n
        };
        if (t.pst) {
            var s = {};
            "token-request" === t.pst ? s = {
                version: 1,
                operation: "token-request"
            } : "token-redemption" === t.pst ? s = {
                version: 1,
                operation: "token-redemption",
                refreshPolicy: "refresh"
            } : "send-redemption-record" === t.pst && (s = {
                version: 1,
                operation: "send-redemption-record",
                issuers: [ut.pstIssuer]
            });
            o.privateToken = s;
        }
        return new Promise(function (e, n) {
            fetch(i, o).then(function (r) {
                return 200 !== r.status ? n({
                    event: it.NETWORK_ERROR,
                    endpoint: i,
                    response: r,
                    state: 4,
                    status: r.status,
                    message: ve(r.status || 400)
                }) : ("arraybuffer" === t.responseType ? r.arrayBuffer() : "json" === t.responseType ? r.json() : r.text()).then(function (t) {
                    e({
                        state: 4,
                        status: r.status,
                        body: t,
                        message: ve(r.status || 400)
                    });
                });
            })["catch"](function (t) {
                n({
                    event: it.NETWORK_ERROR,
                    endpoint: i,
                    response: t.error,
                    state: 4,
                    status: 400,
                    message: ve(400)
                });
            });
        });
    }
    function Ee(t, e) {
        "object" == typeof t && e === undefined && (t = (e = t).url);
        if (null === t) {
            throw new Error("Url missing");
        }
        return xe("GET", t, e);
    }
    function Ce(t, e) {
        "object" == typeof t && e === undefined && (t = (e = t).url);
        if (null === t) {
            throw new Error("Url missing");
        }
        return xe("POST", t, e);
    }
    var Se = ["svg", "gif", "png"];
    function Ve(t, e) {
        e = e || {};
        var i;
        var n = t;
        if (0 === n.indexOf("data:image")) {
            for (var r = !1, o = Se.length, s = -1; s++ < o && !r;) {
                (r = n.indexOf(Se[s]) >= 0) && (i = Se[s]);
            }
        } else {
            i = n.substr(n.lastIndexOf(".") + 1, n.length);
        }
        !!(!document.createElementNS || !document.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGRect) && e.fallback && (e.fallback.indexOf(".") >= 0 ? i = (n = e.fallback).substr(n.lastIndexOf(".") + 1, n.length) : (n = t.substr(0, t.indexOf(i)) + e.fallback, i = e.fallback));
        e.prefix && (n = e.prefix + "/" + n);
        this.attribs = {
            crossOrigin: e.crossOrigin || null
        };
        this.id = n;
        this.src = function (t) {
            if (ut.assethost && 0 === t.indexOf(ct.assetDomain)) {
                return ut.assethost + t.replace(ct.assetDomain, "");
            }
            if (ut.imghost && t.indexOf("imgs") >= 0) {
                var e = t.indexOf(".ai") >= 0 ? t.indexOf(".ai") + 3 : t.indexOf(".com") + 4;
                return ut.imghost + t.substr(e, t.length);
            }
            return t;
        }(n);
        this.ext = i;
        this.width = 0;
        this.height = 0;
        this.aspect = 0;
        this.loaded = !1;
        this.error = !1;
        this.element = null;
        this.cb = {
            load: [],
            error: []
        };
    }
    function Te(t, e, i) {
        for (var n = t[e], r = n.length, o = null; --r > -1;) {
            o = n[r];
            n.splice(r, 1);
            o(i);
        }
        "error" === e ? t.load = [] : t.error = [];
    }
    function Ae(t, e) {
        var i = t;
        e || (e = {});
        e.prefix && (i = e.prefix + "/" + t);
        this.attribs = {
            defer: e.defer || null,
            async: e.async || null,
            crossOrigin: e.crossOrigin || null,
            integrity: e.integrity || null
        };
        this.id = i;
        this.src = function (t) {
            if (ut.assethost && 0 === t.indexOf(ct.assetDomain)) {
                return ut.assethost + t.replace(ct.assetDomain, "");
            }
            return t;
        }(i);
        this.loaded = !1;
        this.error = !1;
        this.element = null;
        this.cb = {
            load: [],
            error: []
        };
    }
    function Me(t, e, i) {
        for (var n = t[e], r = n.length, o = null; --r > -1;) {
            o = n[r];
            n.splice(r, 1);
            o(i);
        }
        "error" === e ? t.load = [] : t.error = [];
    }
    function Re(t, e) {
        var i = t;
        e || (e = {});
        e.prefix && (i = e.prefix + "/" + t);
        this.responseType = e.responseType;
        this.id = i;
        this.src = function (t) {
            if (ut.assethost && 0 === t.indexOf(ct.assetDomain)) {
                return ut.assethost + t.replace(ct.assetDomain, "");
            }
            return t;
        }(i);
        this.loaded = !1;
        this.error = !1;
        this.cb = {
            load: [],
            error: []
        };
        this.data = null;
    }
    function Be(t, e, i) {
        for (var n = t[e], r = n.length, o = null; --r > -1;) {
            o = n[r];
            n.splice(r, 1);
            o(i);
        }
        "error" === e ? t.load = [] : t.error = [];
    }
    Ve.prototype.load = function () {
        return ("svg" === this.ext ? this._loadSvg() : this._loadImg())["catch"](function (t) {
            Et("Asset failed", "error", "assets", {
                error: t
            });
            throw t;
        });
    };
    Ve.prototype._loadSvg = function () {
        var t;
        var e = this;
        var i = this.src;
        var n = this.id;
        if (0 === i.indexOf("data:image/svg+xml")) {
            var r = i.slice("data:image/svg+xml,".length);
            t = Promise.resolve(decodeURIComponent(r));
        } else {
            t = Ee(i).then(function (t) {
                return t.body;
            });
        }
        return t.then(function (t) {
            var i = new DOMParser().parseFromString(t, "image/svg+xml").documentElement;
            var n = parseInt(i.getAttribute("width"));
            var r = parseInt(i.getAttribute("height"));
            e._imgLoaded(i, n, r);
            return e;
        })["catch"](function (t) {
            e.error = !0;
            var i = (t && t.message ? t.message : t || "Loading Error") + ": " + n;
            Te(e.cb, "error", i);
            throw i;
        });
    };
    Ve.prototype._loadImg = function () {
        var t = this;
        var e = this.attribs;
        var i = this.src;
        var n = this.id;
        return new Promise(function (r, o) {
            function s() {
                t.loaded || (t._imgLoaded(a, a.width, a.height), a.onload = a.onerror = null, r(t));
            }
            var a = new Image();
            e.crossOrigin && (a.crossOrigin = e.crossOrigin);
            a.onerror = function () {
                t.error = !0;
                a.onload = a.onerror = null;
                var e = "Loading Error: " + n;
                Te(t.cb, "error", e);
                o(e);
            };
            a.onload = s;
            a.src = i;
            a.complete && s();
        });
    };
    Ve.prototype._imgLoaded = function (t, e, i) {
        this.element = new ae(t);
        this.width = e;
        this.height = i;
        this.aspect = e / i;
        this.loaded = !0;
        Te(this.cb, "load", this);
    };
    Ve.prototype.onload = function (t) {
        this.error || (this.loaded ? t(this) : this.cb.load.push(t));
    };
    Ve.prototype.onerror = function (t) {
        this.loaded && !this.error || (this.error ? t(this) : this.cb.error.push(t));
    };
    Ae.prototype.load = function () {
        var t = this;
        var e = this.attribs;
        var i = this.src;
        var n = this.id;
        return new Promise(function (r, o) {
            var s = document.createElement("script");
            t.element = s;
            s.onerror = function () {
                t.error = !0;
                s.onload = s.onreadystatechange = s.onerror = null;
                var e = "Loading Error: " + n;
                Me(t.cb, "error", e);
                o(e);
            };
            s.onload = s.onreadystatechange = function () {
                this.loaded || s.readyState && "loaded" !== s.readyState && "complete" !== s.readyState || (t.loaded = !0, s.onload = s.onreadystatechange = s.onerror = null, document.body.removeChild(s), Me(t.cb, "load", t), r(t));
            };
            s.type = "text/javascript";
            s.src = i;
            e.crossOrigin && (s.crossorigin = e.crossOrigin);
            e.async && (s.async = !0);
            e.defer && (s.defer = !0);
            e.integrity && (s.integrity = e.integrity);
            document.body.appendChild(s);
            s.complete && s.onload();
        });
    };
    Ae.prototype.onload = function (t) {
        this.error || (this.loaded ? t(this) : this.cb.load.push(t));
    };
    Ae.prototype.onerror = function (t) {
        this.loaded && !this.error || (this.error ? t(this) : this.cb.error.push(t));
    };
    Re.prototype.load = function () {
        var t = this;
        var e = this.src;
        var i = this.id;
        return new Promise(function (n, r) {
            var o = {};
            "arraybuffer" === t.responseType ? o.responseType = "arraybuffer" : e.indexOf("json") >= 0 && (o.responseType = "json");
            Ee(e, o).then(function (e) {
                t.loaded = !0;
                t.data = e.body;
                Be(t.cb, "load", t);
                n(t);
            })["catch"](function (e) {
                t.error = !0;
                var n = (e && e.message ? e.message : "Loading Error") + ": " + i;
                Be(t.cb, "error", n);
                r(n);
            });
        });
    };
    Re.prototype.onload = function (t) {
        this.error || (this.loaded ? t(this) : this.cb.load.push(t));
    };
    Re.prototype.onerror = function (t) {
        this.loaded && !this.error || (this.error ? t(this) : this.cb.error.push(t));
    };
    var Ue = [];
    var Le = {
        image: function (t, e) {
            var i = new Ve(t, e);
            Ue.push(i);
            return i.load();
        },
        script: function (t, e) {
            var i = new Ae(t, e);
            Ue.push(i);
            return i.load();
        },
        file: function (t, e) {
            var i = new Re(t, e);
            Ue.push(i);
            return i.load();
        },
        retrieve: function (t) {
            return new Promise(function (e, i) {
                for (var n = Ue.length, r = !1, o = null; --n > -1 && !r;) {
                    r = (o = Ue[n]).id === t || -1 !== o.id.indexOf("/" === t[0] ? "" : "/" + t);
                }
                if (!r) {
                    return e(null);
                }
                o.onload(e);
                o.onerror(i);
            });
        }
    };
    var He = [];
    var Oe = !1;
    var Pe = !1;
    function Fe() {
        document.addEventListener ? (document.addEventListener("DOMContentLoaded", Ne), window.addEventListener("load", Ne)) : (document.attachEvent("onreadystatechange", Ze), window.attachEvent("onload", Ne));
        Oe = !0;
    }
    function Ze() {
        "interactive" !== document.readyState && "loaded" !== document.readyState && "complete" !== document.readyState || Ne();
    }
    function Ne() {
        if (!1 === Pe) {
            for (var t = 0; t < He.length; t++) {
                He[t].fn.apply(null, He[t].args);
            }
            He = [];
        }
        Pe = !0;
        document.removeEventListener ? (document.removeEventListener("DOMContentLoaded", Ne), window.removeEventListener("load", Ne)) : (document.detachEvent("onreadystatechange", Ze), window.detachEvent("onload", Ne));
    }
    var De = new ae(document);
    var We = {
        __proto__: null,
        Window: new ae(window),
        Document: De,
        Element: ae,
        Ready: function (t) {
            var e = Array.prototype.slice.call(arguments, 1);
            !0 !== Pe && "interactive" !== document.readyState && "loaded" !== document.readyState && "complete" !== document.readyState ? (He.push({
                fn: t,
                args: e
            }), !1 === Oe && Fe()) : setTimeout(function () {
                t(e);
            }, 1);
        },
        Find: function (t) {
            for (var e, i, n = null, r = !1, o = t.split(" "), s = 0; s < o.length; s++) {
                (e = o[s]).indexOf("#") >= 0 && (n = document.getElementById(e.replace("#", "")));
                if (e.indexOf(".") >= 0) {
                    null === n && (n = document);
                    if (r) {
                        for (var a = [], l = 0; l < n.length; l++) {
                            i = n[l].getElementsByClassName(e.replace(".", ""));
                            for (var c = 0; c < i.length; c++) {
                                a.push(i[c]);
                            }
                        }
                        n = a;
                        a = [];
                    } else {
                        n = n.getElementsByClassName(e.replace(".", ""));
                        r = !0;
                    }
                }
            }
            if (!0 === r) {
                if (1 === n.length) {
                    return n[0];
                }
                for (var h = [], u = 0; u < n.length; u++) {
                    h.push(n[u]);
                }
                return h;
            }
            return n;
        }
    };
    var ze = {
        __proto__: null,
        Loader: Le,
        BaseComponent: ee,
        DomComponent: ce,
        DomElement: ae,
        Extend: le,
        Normalize: ie,
        Dom: We
    };
    var Ie = {
        touchstart: "ts",
        touchend: "te",
        touchmove: "tm",
        touchcancel: "tc"
    };
    var je = {
        mousedown: "md",
        mouseup: "mu",
        mousemove: "mm"
    };
    var Ke = {
        pointermove: "pm"
    };
    var qe = {
        keydown: "kd",
        keyup: "ku"
    };
    var $e = {
        devicemotion: "dm"
    };
    function Ge(t, e) {
        var i = je[t];
        var n = null;
        return function (t) {
            n = function (t) {
                return [t.windowX, t.windowY, Date.now()];
            }(t);
            e(i, n);
        };
    }
    function Je(t, e) {
        var i = Ke[t];
        var n = null;
        return function (t) {
            n = function (t) {
                var e = [];
                var i = [];
                t.getCoalescedEvents && (i = t.getCoalescedEvents());
                for (var n = 0; n < i.length; n++) {
                    var r = i[n];
                    e.push([r.x, r.y, Date.now()]);
                }
                return e;
            }(t);
            for (var r = 0; r < n.length; r++) {
                e(i, n[r]);
            }
        };
    }
    function Xe(t, e) {
        var i = Ie[t];
        var n = null;
        return function (t) {
            n = function (t) {
                var e = [];
                try {
                    var i;
                    var n;
                    t.touches && t.touches.length >= 1 ? i = t.touches : t.changedTouches && t.changedTouches.length >= 1 && (i = t.changedTouches);
                    if (i) {
                        for (var r = 0; r < i.length; r++) {
                            (n = ie.eventCoords(i[r])) && e.push([i[r].identifier, n.x, n.y]);
                        }
                        e.push(Date.now());
                    }
                    return e;
                } catch (Po) {
                    return e;
                }
            }(t);
            e(i, n);
        };
    }
    function Ye(t, e) {
        var i = qe[t];
        var n = null;
        return function (t) {
            n = function (t) {
                return [t.keyNum, Date.now()];
            }(t);
            e(i, n);
        };
    }
    function Qe(t, e) {
        var i = $e[t];
        var n = null;
        var r = [];
        return function (t) {
            n = function (t, e) {
                (t.acceleration === undefined || t.acceleration && t.acceleration.x === undefined) && (t.acceleration = {
                    x: 0,
                    y: 0,
                    z: 0
                });
                (t.rotationRate === undefined || t.rotationRate && t.rotationRate.alpha === undefined) && (t.rotationRate = {
                    alpha: 0,
                    beta: 0,
                    gamma: 0
                });
                var i = [t.acceleration.x, t.acceleration.y, t.acceleration.z, t.rotationRate.alpha, t.rotationRate.beta, t.rotationRate.gamma, Date.now()];
                var n = [];
                if (0 === e.length) {
                    e = i;
                    n = i;
                } else {
                    for (var r, o = 0, s = 0; s < 6; s++) {
                        r = e[s] - i[s];
                        n.push(i[s]);
                        o += Math.abs(r);
                    }
                    n.push(Date.now());
                    e = i;
                    if (o <= 0) {
                        return null;
                    }
                }
                return {
                    motion: n,
                    prevmotion: e
                };
            }(t, r);
            null !== n && (r = n.prevmotion, n = n.motion, e(i, n));
        };
    }
    function ti() {
        this._manifest = {};
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
        };
        this._recordEvent = this._recordEvent.bind(this);
    }
    ti.prototype.record = function (t, e, i, n) {
        this._manifest.st = Date.now();
        this.state.record.mouse = t === undefined ? this.state.record.mouse : t;
        this.state.record.touch = i === undefined ? this.state.record.touch : i;
        this.state.record.keys = e === undefined ? this.state.record.keys : e;
        this.state.record.motion = n === undefined ? this.state.record.motion : n;
        if (!1 === this.state.initRecord) {
            var r = new ae(document.body);
            this.state.record.mouse && (r.addEventListener("mousedown", Ge("mousedown", this._recordEvent), !0), r.addEventListener("mousemove", Ge("mousemove", this._recordEvent), !0), r.addEventListener("mouseup", Ge("mouseup", this._recordEvent), !0), r.addEventListener("pointermove", Je("pointermove", this._recordEvent), !0));
            !0 === this.state.record.keys && (r.addEventListener("keyup", Ye("keyup", this._recordEvent), !0), r.addEventListener("keydown", Ye("keydown", this._recordEvent), !0));
            this.state.record.touch && !0 === tt.Browser.hasEvent("touchstart", document.body) && (r.addEventListener("touchstart", Xe("touchstart", this._recordEvent), !0), r.addEventListener("touchmove", Xe("touchmove", this._recordEvent), !0), r.addEventListener("touchend", Xe("touchend", this._recordEvent), !0));
            this.state.record.motion && !0 === tt.Browser.hasEvent("devicemotion", window) && r.addEventListener("devicemotion", Qe("devicemotion", this._recordEvent), !0);
            this.state.initRecord = !0;
        }
        this.state.recording = !0;
    };
    ti.prototype.stop = function () {
        this.state.recording = !1;
    };
    ti.prototype.time = function () {
        return this.state.loadTime;
    };
    ti.prototype.getData = function () {
        for (var t in this.state.timeBuffers) {
            this._manifest[t] = this.state.timeBuffers[t].getData();
            this._manifest[t + "-mp"] = this.state.timeBuffers[t].getMeanPeriod();
        }
        return this._manifest;
    };
    ti.prototype.setData = function (t, e) {
        this._manifest[t] = e;
    };
    ti.prototype.resetData = function () {
        this._manifest = {};
        this.state.timeBuffers = {};
    };
    ti.prototype.circBuffPush = function (t, e) {
        this._recordEvent(t, e);
    };
    ti.prototype._recordEvent = function (t, e) {
        if (!1 !== this.state.recording) {
            try {
                var i = e[e.length - 1];
                this.state.timeBuffers[t] || (this.state.timeBuffers[t] = new zt(16, 15e3));
                this.state.timeBuffers[t].push(i, e);
            } catch (Oo) {
                Ct("motion", Oo);
            }
        }
    };
    var ei;
    var ii;
    var ni;
    var ri;
    var oi = new ti();
    try {
        ei = function () {
            var t = {
                _7rqA3K: 0,
                _1WwRqdliG: 0,
                _MSzZTi: [],
                _8RSEtTLMCH: [],
                _JLQt5Ll6: [],
                _RAeEtcCud: {},
                _zDHoe: window,
                _lh1U: [function (t) {
                    for (var e = t._v1GqXmT5[t._7rqA3K++], i = t._v1GqXmT5[t._7rqA3K++], n = t._v1GqXmT5[t._7rqA3K++], r = decodeURIComponent(atob(t._pT0dc.slice(e, e + i))), o = "", s = 0; s < r.length; s++) {
                        o += String.fromCharCode((256 + r.charCodeAt(s) + n) % 256);
                    }
                    t._MSzZTi.push(o);
                }, function () {
                    var e = t._MSzZTi.pop();
                    var i = t._v1GqXmT5[t._7rqA3K++];
                    t._JLQt5Ll6[i] ? t._8RSEtTLMCH = t._JLQt5Ll6[i] : (t._8RSEtTLMCH = e, t._JLQt5Ll6[i] = e);
                }, function (t) {
                    t._MSzZTi.push(Jt);
                }, function (t) {
                    var e = t._MSzZTi.pop();
                    var i = t._MSzZTi.pop();
                    t._MSzZTi.push(i * e);
                }, function (t) {
                    var i = t._1WwRqdliG;
                    var n = t._v1GqXmT5[t._7rqA3K++];
                    try {
                        e(t);
                    } catch (r) {
                        t._MSzZTi.push(r);
                        t._7rqA3K = n;
                        e(t);
                    }
                    t._1WwRqdliG = i;
                }, function () {
                    var e = t._MSzZTi.pop();
                    var i = t._MSzZTi.pop();
                    var n = !1;
                    e._l !== undefined && (n = !0, i.splice(0, 0, {
                        _l: {}
                    }));
                    var r = new (Function.prototype.bind.apply(e, [null].concat(i)))();
                    n && t._MSzZTi.pop();
                    t._MSzZTi.push(r);
                }, function (t) {
                    t._7rqA3K = t._MSzZTi.splice(t._MSzZTi.length - 4, 1)[0];
                    t._zDHoe = t._MSzZTi.splice(t._MSzZTi.length - 3, 1)[0];
                    t._8RSEtTLMCH = t._MSzZTi.splice(t._MSzZTi.length - 2, 1)[0];
                }, function (t) {
                    var e = t._MSzZTi.pop();
                    var i = t._MSzZTi.pop();
                    var n = i[e];
                    "function" == typeof n && (n = n.bind(i));
                    t._MSzZTi.push(n);
                }, function (t) {
                    t._MSzZTi.pop();
                    t._MSzZTi.push(void 0);
                }, function (t) {
                    var e = t._v1GqXmT5[t._7rqA3K++];
                    t._1WwRqdliG = e;
                }, function (t) {
                    t._MSzZTi.push(t._v1GqXmT5[t._7rqA3K++]);
                }, function (t) {
                    var e = t._MSzZTi.pop();
                    var i = t._MSzZTi.pop();
                    if (e && e._l !== undefined) {
                        i.splice(0, 0, {
                            _l: {}
                        });
                        e.apply(t._zDHoe, i);
                    } else {
                        var n = e.apply(t._zDHoe, i);
                        t._MSzZTi.push(n);
                    }
                }, function (t) {
                    var e = t._MSzZTi.pop();
                    var i = t._MSzZTi.pop();
                    t._MSzZTi.push(i !== e);
                }, function (t) {
                    var e = t._MSzZTi.pop();
                    var i = t._MSzZTi.pop();
                    t._MSzZTi.push(i >= e);
                }, function (t) {
                    var e = t._MSzZTi.pop();
                    var i = t._MSzZTi.pop();
                    t._MSzZTi.push(i + e);
                }, function (t) {
                    var e = t._MSzZTi.pop();
                    t._MSzZTi.push(typeof e);
                }, function (t) {
                    var e = t._MSzZTi.pop();
                    var i = t._v1GqXmT5[t._7rqA3K++];
                    e || (t._7rqA3K = i);
                }, function (t) {
                    var e = t._MSzZTi.pop();
                    var i = t._MSzZTi.pop();
                    t._MSzZTi.push(i <= e);
                }, function (t) {
                    var e = t._MSzZTi.pop();
                    var i = t._MSzZTi.pop();
                    t._MSzZTi.push(i < e);
                }, function (t) {
                    t._MSzZTi.push(Yt);
                }, function (t) {
                    for (var e = t._v1GqXmT5[t._7rqA3K++], i = [], n = 0; n < e; n++) {
                        i.push(t._MSzZTi.pop());
                    }
                    t._MSzZTi.push(i);
                }, function (t) {
                    var e = t._MSzZTi.pop();
                    var i = t._v1GqXmT5[t._7rqA3K++];
                    var n = t._v1GqXmT5[t._7rqA3K++];
                    var r = -1 == i ? t._8RSEtTLMCH : t._JLQt5Ll6[i];
                    t._MSzZTi.push(r[n] |= e);
                }, function (t) {
                    t._MSzZTi.push(!!t._v1GqXmT5[t._7rqA3K++]);
                }, function (t) {
                    var e = t._MSzZTi.pop();
                    var i = t._MSzZTi.pop();
                    t._MSzZTi.push(i in e);
                }, function (t) {
                    t._MSzZTi.push(t._MSzZTi[t._MSzZTi.length - 1]);
                }, function (t) {
                    var e = t._MSzZTi.pop();
                    var i = t._MSzZTi.pop();
                    t._MSzZTi.push(i - e);
                }, function (t) {
                    t._MSzZTi.pop();
                }, function (t) {
                    var e = t._MSzZTi.pop();
                    t._MSzZTi.push(-e);
                }, function (t) {
                    t._MSzZTi.push(tt);
                }, function (t) {
                    var e = t._MSzZTi.pop();
                    var i = t._v1GqXmT5[t._7rqA3K++];
                    var n = t._v1GqXmT5[t._7rqA3K++];
                    t._8RSEtTLMCH[n] = e;
                    for (var r = 0; r < i; r++) {
                        t._8RSEtTLMCH[t._v1GqXmT5[t._7rqA3K++]] = e[r];
                    }
                }, function (t) {
                    var e = t._MSzZTi.pop();
                    var i = t._v1GqXmT5[t._7rqA3K++];
                    var n = t._v1GqXmT5[t._7rqA3K++];
                    var r = -1 == i ? t._8RSEtTLMCH : t._JLQt5Ll6[i];
                    t._MSzZTi.push(r[n] = e);
                }, function (t) {
                    var e = t._MSzZTi.pop();
                    var i = t._MSzZTi.pop();
                    t._MSzZTi.push(i / e);
                }, function (t) {
                    t._MSzZTi.push(ae);
                }, function (t) {
                    t._RAeEtcCud[t._MSzZTi[t._MSzZTi.length - 1]] = t._MSzZTi[t._MSzZTi.length - 2];
                }, function (t) {
                    t._MSzZTi.push(t._zDHoe);
                }, function (t) {
                    t._MSzZTi.push(null);
                }, function (t) {
                    var e = t._v1GqXmT5[t._7rqA3K++];
                    var i = t._v1GqXmT5[t._7rqA3K++];
                    var n = t._v1GqXmT5[t._7rqA3K++];
                    var r = -1 == e ? t._8RSEtTLMCH : t._JLQt5Ll6[e];
                    n ? t._MSzZTi.push(++r[i]) : t._MSzZTi.push(r[i]++);
                }, function (t) {
                    var e = t._MSzZTi.pop();
                    var i = t._MSzZTi.pop();
                    t._MSzZTi.push(i << e);
                }, function (t) {
                    var e = t._MSzZTi.pop();
                    var i = t._v1GqXmT5[t._7rqA3K++];
                    var n = t._v1GqXmT5[t._7rqA3K++];
                    (-1 == i ? t._8RSEtTLMCH : t._JLQt5Ll6[i])[n] = e;
                }, function (t) {
                    var e = t._MSzZTi.pop();
                    var i = t._v1GqXmT5[t._7rqA3K++];
                    var n = t._v1GqXmT5[t._7rqA3K++];
                    var r = -1 == i ? t._8RSEtTLMCH : t._JLQt5Ll6[i];
                    t._MSzZTi.push(r[n] += e);
                }, function (t) {
                    var e = t._MSzZTi.pop();
                    var i = t._MSzZTi.pop();
                    t._MSzZTi.push(i > e);
                }, function (t) {
                    var e = t._MSzZTi.pop();
                    var i = t._MSzZTi.pop();
                    t._MSzZTi.push(i === e);
                }, function (t) {
                    var e = t._v1GqXmT5[t._7rqA3K++];
                    var i = t._v1GqXmT5[t._7rqA3K++];
                    var n = -1 == e ? t._8RSEtTLMCH : t._JLQt5Ll6[e];
                    t._MSzZTi.push(n[i]);
                }, function (t) {
                    var e = t._MSzZTi.pop();
                    var i = t._MSzZTi.pop();
                    var n = t._MSzZTi.pop();
                    t._MSzZTi.push(i[e] += n);
                }, function (t) {
                    var e = t._MSzZTi.pop();
                    t._MSzZTi.push(!e);
                }, function (t) {
                    var e = t._MSzZTi.pop();
                    var i = t._MSzZTi.pop();
                    t._MSzZTi.push(i | e);
                }, function (t) {
                    var e = t._MSzZTi.pop();
                    var i = t._MSzZTi.pop();
                    t._MSzZTi.push(i instanceof e);
                }, function (t) {
                    t._MSzZTi.push(undefined);
                }, function (t) {
                    var e = t._MSzZTi.pop();
                    t._MSzZTi.push(window[e]);
                }, function (t) {
                    for (var e = t._v1GqXmT5[t._7rqA3K++], i = {}, n = 0; n < e; n++) {
                        var r = t._MSzZTi.pop();
                        i[t._MSzZTi.pop()] = r;
                    }
                    t._MSzZTi.push(i);
                }, function (t) {
                    t._MSzZTi.push(Yt);
                }, function (t) {
                    var e = t._MSzZTi.pop();
                    var i = t._MSzZTi.pop();
                    var n = t._MSzZTi.pop();
                    t._MSzZTi.push(i[e] = n);
                }, function (t) {
                    var i = t._MSzZTi.pop();
                    function n() {
                        var r = !1;
                        var o = Array.prototype.slice.call(arguments);
                        o.length > 0 && o[0] && o[0]._l ? o = o.splice(1, o.length - 1) : r = !0;
                        var s = t._zDHoe;
                        var a = t._1WwRqdliG;
                        var l = t._JLQt5Ll6;
                        t._MSzZTi.push(t._7rqA3K);
                        t._MSzZTi.push(t._zDHoe);
                        t._MSzZTi.push(t._8RSEtTLMCH);
                        t._MSzZTi.push(o);
                        t._MSzZTi.push(n);
                        t._1WwRqdliG = t._7rqA3K;
                        t._7rqA3K = i;
                        t._zDHoe = this;
                        t._JLQt5Ll6 = n._r;
                        e(t);
                        t._zDHoe = s;
                        t._1WwRqdliG = a;
                        t._JLQt5Ll6 = l;
                        if (r) {
                            return t._MSzZTi.pop();
                        }
                    }
                    n._l = {};
                    n._r = Array.prototype.slice.call(t._JLQt5Ll6);
                    t._MSzZTi.push(n);
                }, function () {
                    var e = t._MSzZTi.pop();
                    var i = t._v1GqXmT5[t._7rqA3K++];
                    t._8RSEtTLMCH = e;
                    t._JLQt5Ll6[i] = e;
                }, function (t) {
                    t._MSzZTi.push(ie);
                }],
                _v1GqXmT5: [20, 0, 1, 0, 10, 14, 52, 38, -1, 0, 22, 0, 16, 59, 20, 0, 53, 1, 26, 29, 1, 0, 1, 20, 0, 0, 816, 12, 10, 48, 0, 4268, 8, -4, 7, 11, 42, -1, 1, 0, 1392, 24, -9, 7, 42, -1, 1, 0, 2532, 12, 6, 7, 20, 3, 22, 0, 16, 58, 6, 10, 69, 52, 38, -1, 1, 22, 0, 16, 202, 20, 0, 53, 2, 26, 29, 1, 0, 1, 20, 0, 38, -1, 2, 20, 0, 38, -1, 3, 42, -1, 1, 0, 2832, 24, -1, 7, 16, 113, 20, 0, 42, -1, 1, 0, 2832, 24, -1, 7, 11, 30, -1, 3, 26, 10, 0, 38, -1, 4, 42, -1, 4, 42, -1, 3, 0, 4248, 20, -15, 7, 18, 16, 194, 42, -1, 3, 42, -1, 4, 7, 38, -1, 5, 20, 0, 0, 816, 12, 10, 48, 0, 4268, 8, -4, 7, 11, 42, -1, 5, 0, 2792, 4, 20, 7, 42, -1, 5, 0, 1328, 4, -6, 7, 20, 3, 20, 1, 42, -1, 2, 0, 2332, 24, -15, 7, 11, 26, 36, -1, 4, 0, 26, 22, 0, 16, 118, 42, -1, 2, 22, 0, 16, 201, 6, 10, 212, 52, 38, -1, 2, 22, 0, 16, 249, 20, 0, 53, 3, 26, 29, 1, 0, 1, 20, 0, 0, 816, 12, 10, 48, 0, 4268, 8, -4, 7, 11, 42, -1, 1, 0, 2464, 12, 19, 7, 20, 2, 22, 0, 16, 248, 6, 10, 259, 52, 38, -1, 3, 22, 0, 16, 521, 20, 0, 53, 4, 26, 29, 1, 0, 1, 20, 0, 38, -1, 2, 4, 501, 42, -1, 1, 0, 3184, 12, 4, 7, 24, 16, 303, 26, 42, -1, 1, 0, 3184, 12, 4, 7, 0, 4248, 20, -15, 7, 10, 1, 13, 16, 321, 42, -1, 1, 0, 3184, 12, 4, 7, 30, -1, 3, 26, 22, 0, 16, 363, 42, -1, 1, 0, 4152, 20, 0, 7, 24, 16, 349, 26, 42, -1, 1, 0, 4152, 20, 0, 7, 0, 4248, 20, -15, 7, 10, 1, 13, 16, 363, 42, -1, 1, 0, 4152, 20, 0, 7, 30, -1, 3, 26, 42, -1, 3, 16, 488, 10, 0, 38, -1, 5, 42, -1, 5, 42, -1, 3, 0, 4248, 20, -15, 7, 18, 16, 463, 42, -1, 3, 42, -1, 5, 7, 20, 1, 54, 0, 4532, 20, 21, 7, 11, 30, -1, 4, 26, 42, -1, 4, 16, 454, 42, -1, 4, 0, 2792, 4, 20, 7, 42, -1, 4, 0, 1328, 4, -6, 7, 42, -1, 3, 42, -1, 5, 7, 0, 3896, 32, -14, 7, 20, 3, 20, 1, 42, -1, 2, 0, 2332, 24, -15, 7, 11, 26, 36, -1, 5, 0, 26, 22, 0, 16, 373, 20, 0, 0, 816, 12, 10, 48, 0, 4268, 8, -4, 7, 11, 20, 1, 42, -1, 2, 0, 2332, 24, -15, 7, 11, 26, 42, -1, 2, 22, 0, 16, 520, 9, 497, 22, 0, 16, 511, 38, -1, 6, 42, -1, 2, 22, 0, 16, 520, 0, 3196, 20, 11, 48, 22, 0, 16, 520, 6, 10, 531, 52, 38, -1, 4, 22, 0, 16, 978, 20, 0, 53, 5, 26, 29, 2, 0, 1, 2, 42, -1, 1, 0, 900, 16, -5, 7, 10, 0, 8, 41, 24, 44, 16, 587, 26, 42, -1, 1, 0, 900, 16, -5, 7, 24, 16, 587, 26, 42, -1, 1, 0, 900, 16, -5, 7, 0, 1328, 4, -6, 7, 10, 0, 8, 41, 16, 618, 0, 2220, 4, 5, 10, 0, 0, 2792, 4, 20, 10, 0, 0, 1328, 4, -6, 10, 0, 49, 3, 42, -1, 1, 0, 900, 16, -5, 51, 26, 42, -1, 1, 0, 4320, 24, -8, 7, 10, 0, 8, 41, 24, 44, 16, 664, 26, 42, -1, 1, 0, 4320, 24, -8, 7, 24, 16, 664, 26, 42, -1, 1, 0, 4320, 24, -8, 7, 0, 3224, 12, 21, 7, 10, 0, 8, 41, 16, 695, 0, 828, 12, 7, 10, 0, 0, 2212, 8, 22, 10, 0, 0, 3224, 12, 21, 10, 0, 49, 3, 42, -1, 1, 0, 4320, 24, -8, 51, 26, 20, 0, 0, 816, 12, 10, 48, 0, 4268, 8, -4, 7, 11, 42, -1, 1, 0, 4320, 24, -8, 7, 0, 828, 12, 7, 7, 42, -1, 1, 0, 4320, 24, -8, 7, 0, 2212, 8, 22, 7, 42, -1, 1, 0, 4320, 24, -8, 7, 0, 3224, 12, 21, 7, 42, -1, 1, 0, 900, 16, -5, 7, 0, 2220, 4, 5, 7, 42, -1, 1, 0, 900, 16, -5, 7, 0, 2792, 4, 20, 7, 42, -1, 1, 0, 900, 16, -5, 7, 0, 1328, 4, -6, 7, 20, 7, 38, -1, 3, 20, 0, 38, -1, 4, 42, -1, 2, 0, 4248, 20, -15, 7, 10, 0, 41, 16, 827, 42, -1, 3, 30, -1, 2, 26, 42, -1, 3, 30, -1, 4, 26, 22, 0, 16, 957, 10, 0, 38, -1, 5, 10, 0, 38, -1, 7, 42, -1, 7, 10, 6, 18, 16, 912, 42, -1, 2, 42, -1, 7, 7, 42, -1, 3, 42, -1, 7, 7, 25, 30, -1, 6, 26, 42, -1, 3, 42, -1, 7, 7, 20, 1, 42, -1, 4, 0, 2332, 24, -15, 7, 11, 26, 42, -1, 6, 20, 1, 0, 2476, 8, 15, 48, 0, 1276, 4, 0, 7, 11, 39, -1, 5, 26, 36, -1, 7, 0, 26, 22, 0, 16, 837, 20, 0, 0, 816, 12, 10, 48, 0, 4268, 8, -4, 7, 11, 20, 1, 42, -1, 4, 0, 2332, 24, -15, 7, 11, 26, 42, -1, 3, 30, -1, 2, 26, 42, -1, 5, 10, 0, 17, 16, 957, 35, 22, 0, 16, 977, 0, 972, 24, 15, 42, -1, 2, 0, 460, 44, -21, 42, -1, 4, 49, 2, 22, 0, 16, 977, 6, 10, 988, 52, 38, -1, 5, 22, 0, 16, 1111, 20, 0, 53, 6, 26, 29, 0, 0, 49, 0, 34, 0, 1480, 32, -14, 51, 26, 0, 3144, 16, -13, 0, 460, 44, -21, 22, 0, 0, 840, 8, 15, 22, 0, 0, 2508, 8, 0, 22, 1, 0, 2544, 24, -15, 22, 1, 49, 4, 0, 4040, 20, -10, 22, 0, 0, 3356, 16, 16, 22, 0, 0, 3880, 16, 4, 20, 0, 0, 816, 12, 10, 48, 0, 4268, 8, -4, 7, 11, 0, 4480, 20, 14, 49, 0, 49, 5, 34, 0, 3344, 12, -7, 51, 26, 34, 20, 1, 34, 0, 1876, 24, 17, 7, 0, 2752, 8, -16, 7, 11, 34, 0, 1876, 24, 17, 51, 26, 0, 3196, 20, 11, 48, 22, 0, 16, 1110, 6, 10, 1121, 52, 38, -1, 6, 22, 0, 16, 1370, 20, 0, 53, 7, 26, 29, 1, 0, 1, 42, 0, 52, 16, 1168, 42, -1, 1, 20, 1, 42, 0, 52, 0, 3548, 8, 8, 7, 11, 38, -1, 2, 42, -1, 2, 10, 0, 8, 12, 16, 1168, 42, -1, 2, 22, 0, 16, 1369, 20, 0, 42, -1, 1, 0, 2984, 12, -10, 7, 0, 4604, 44, -13, 7, 11, 38, -1, 3, 42, -1, 1, 0, 4400, 4, -7, 7, 24, 44, 16, 1204, 26, 0, 1772, 0, 19, 38, -1, 4, 42, -1, 1, 0, 3928, 8, 21, 7, 24, 44, 16, 1224, 26, 0, 1772, 0, 19, 38, -1, 5, 42, -1, 1, 0, 736, 16, -8, 7, 24, 44, 16, 1244, 26, 0, 1772, 0, 19, 38, -1, 6, 42, -1, 1, 0, 3264, 24, 5, 7, 24, 44, 16, 1264, 26, 0, 1772, 0, 19, 38, -1, 7, 42, -1, 1, 0, 1332, 24, 17, 7, 24, 44, 16, 1284, 26, 0, 1772, 0, 19, 38, -1, 8, 42, -1, 1, 20, 1, 42, 0, 7, 11, 38, -1, 9, 42, -1, 3, 42, -1, 4, 14, 42, -1, 5, 14, 42, -1, 6, 14, 42, -1, 7, 14, 42, -1, 8, 14, 42, -1, 9, 14, 38, -1, 10, 42, -1, 10, 20, 1, 2, 11, 38, -1, 11, 42, 0, 52, 16, 1362, 42, -1, 11, 42, -1, 1, 20, 2, 42, 0, 52, 0, 2796, 8, -7, 7, 11, 26, 42, -1, 11, 22, 0, 16, 1369, 6, 10, 1380, 52, 38, -1, 7, 22, 0, 16, 1797, 20, 0, 53, 8, 26, 29, 1, 0, 1, 42, -1, 1, 0, 4400, 4, -7, 7, 0, 1772, 0, 19, 12, 16, 1426, 0, 1544, 28, 0, 42, -1, 1, 0, 4400, 4, -7, 7, 14, 0, 704, 4, -5, 14, 22, 0, 16, 1796, 42, -1, 1, 0, 4412, 12, -2, 48, 0, 3536, 8, 5, 7, 41, 16, 1450, 0, 136, 48, -19, 22, 0, 16, 1796, 0, 1772, 0, 19, 38, -1, 2, 10, 0, 38, -1, 3, 42, -1, 1, 0, 4200, 48, -20, 7, 16, 1789, 42, -1, 3, 42, 0, 50, 40, 16, 1485, 22, 0, 16, 1789, 10, 0, 38, -1, 4, 10, 0, 38, -1, 5, 42, -1, 1, 0, 4200, 48, -20, 7, 0, 852, 28, 8, 7, 0, 4248, 20, -15, 7, 38, -1, 6, 42, 0, 51, 42, -1, 6, 20, 2, 0, 2476, 8, 15, 48, 0, 1356, 4, 7, 7, 11, 38, -1, 7, 10, 0, 38, -1, 8, 42, -1, 8, 42, -1, 7, 18, 16, 1624, 42, -1, 1, 0, 4200, 48, -20, 7, 0, 852, 28, 8, 7, 42, -1, 8, 7, 38, -1, 9, 42, -1, 9, 0, 1444, 12, -6, 7, 42, -1, 1, 0, 1444, 12, -6, 7, 41, 16, 1615, 42, -1, 9, 42, -1, 1, 41, 16, 1610, 42, -1, 4, 10, 1, 14, 30, -1, 5, 26, 36, -1, 4, 0, 26, 36, -1, 8, 0, 26, 22, 0, 16, 1543, 0, 3928, 8, 21, 20, 1, 42, -1, 1, 0, 2368, 56, -14, 7, 11, 24, 16, 1663, 26, 0, 3928, 8, 21, 20, 1, 42, -1, 1, 0, 1572, 60, -21, 7, 11, 0, 1772, 0, 19, 12, 16, 1724, 0, 996, 4, 19, 20, 0, 42, -1, 1, 0, 1444, 12, -6, 7, 0, 4604, 44, -13, 7, 11, 14, 0, 32, 20, 1, 14, 0, 3928, 8, 21, 20, 1, 42, -1, 1, 0, 1572, 60, -21, 7, 11, 14, 0, 704, 4, -5, 14, 42, -1, 2, 14, 30, -1, 2, 26, 22, 0, 16, 1767, 0, 996, 4, 19, 20, 0, 42, -1, 1, 0, 1444, 12, -6, 7, 0, 4604, 44, -13, 7, 11, 14, 0, 4424, 4, 20, 14, 42, -1, 5, 14, 0, 4512, 4, -4, 14, 42, -1, 2, 14, 30, -1, 2, 26, 42, -1, 1, 0, 4200, 48, -20, 7, 30, -1, 1, 26, 10, 1, 39, -1, 3, 26, 22, 0, 16, 1462, 42, -1, 2, 22, 0, 16, 1796, 6, 10, 1807, 52, 38, -1, 8, 22, 0, 16, 1829, 20, 0, 53, 9, 26, 29, 2, 0, 1, 2, 42, -1, 1, 42, -1, 2, 45, 22, 0, 16, 1828, 6, 10, 1839, 52, 38, -1, 9, 22, 0, 16, 1992, 20, 0, 53, 10, 26, 29, 1, 0, 1, 42, -1, 1, 20, 1, 42, 0, 6, 11, 38, -1, 2, 42, -1, 2, 20, 1, 42, 0, 62, 0, 3548, 8, 8, 7, 11, 38, -1, 3, 42, -1, 3, 16, 1889, 42, -1, 3, 22, 0, 16, 1991, 42, -1, 1, 0, 364, 36, -19, 7, 16, 1905, 10, 1, 22, 0, 16, 1907, 10, 0, 42, -1, 1, 0, 3936, 12, -7, 7, 16, 1923, 10, 1, 22, 0, 16, 1925, 10, 0, 42, -1, 1, 0, 608, 16, 12, 7, 16, 1941, 10, 1, 22, 0, 16, 1943, 10, 0, 42, -1, 1, 20, 1, 42, 0, 11, 11, 42, -1, 1, 20, 1, 42, 0, 10, 11, 20, 5, 38, -1, 4, 42, -1, 4, 42, -1, 2, 20, 2, 42, 0, 62, 0, 2796, 8, -7, 7, 11, 26, 42, -1, 4, 22, 0, 16, 1991, 6, 10, 2002, 52, 38, -1, 10, 22, 0, 16, 2518, 20, 0, 53, 11, 26, 29, 1, 0, 1, 42, -1, 1, 0, 4304, 16, -7, 7, 0, 3216, 8, 4, 7, 16, 2033, 42, 0, 61, 22, 0, 16, 2517, 20, 0, 42, -1, 1, 0, 2984, 12, -10, 7, 0, 4604, 44, -13, 7, 11, 0, 916, 28, -11, 41, 16, 2063, 42, 0, 55, 22, 0, 16, 2517, 42, -1, 1, 0, 736, 16, -8, 7, 16, 2093, 20, 0, 42, -1, 1, 0, 736, 16, -8, 7, 0, 4604, 44, -13, 7, 11, 22, 0, 16, 2097, 0, 1772, 0, 19, 38, -1, 2, 42, -1, 2, 0, 1772, 8, -12, 41, 16, 2121, 42, 0, 53, 22, 0, 16, 2517, 22, 0, 16, 2131, 42, -1, 2, 0, 200, 52, -17, 41, 16, 2142, 42, 0, 54, 22, 0, 16, 2517, 22, 0, 16, 2152, 42, -1, 2, 0, 3596, 12, -6, 41, 16, 2163, 42, 0, 56, 22, 0, 16, 2517, 22, 0, 16, 2173, 42, -1, 2, 0, 708, 12, -18, 41, 16, 2184, 42, 0, 58, 22, 0, 16, 2517, 22, 0, 16, 2194, 42, -1, 2, 0, 1132, 16, -11, 41, 16, 2205, 42, 0, 59, 22, 0, 16, 2517, 22, 0, 16, 2215, 42, -1, 2, 0, 4520, 8, 14, 41, 16, 2226, 42, 0, 57, 22, 0, 16, 2517, 22, 0, 16, 2230, 22, 0, 16, 2504, 42, -1, 1, 0, 3928, 8, 21, 7, 24, 44, 16, 2247, 26, 0, 1772, 0, 19, 0, 2364, 4, 6, 14, 42, -1, 1, 0, 4400, 4, -7, 7, 24, 44, 16, 2269, 26, 0, 1772, 0, 19, 14, 0, 2364, 4, 6, 14, 42, -1, 1, 0, 1332, 24, 17, 7, 24, 44, 16, 2292, 26, 0, 1772, 0, 19, 14, 0, 2364, 4, 6, 14, 42, -1, 1, 0, 3264, 24, 5, 7, 24, 44, 16, 2315, 26, 0, 1772, 0, 19, 14, 38, -1, 3, 20, 0, 42, -1, 3, 0, 4604, 44, -13, 7, 11, 38, -1, 4, 42, 0, 58, 0, 2972, 12, -15, 20, 2, 42, 0, 54, 0, 200, 52, -17, 20, 2, 42, 0, 53, 0, 1772, 8, -12, 20, 2, 20, 3, 38, -1, 5, 10, 0, 38, -1, 6, 42, -1, 5, 0, 4248, 20, -15, 7, 38, -1, 7, 42, -1, 6, 42, -1, 7, 18, 16, 2440, 42, -1, 5, 42, -1, 6, 7, 10, 0, 7, 20, 1, 42, -1, 4, 0, 504, 20, 8, 7, 11, 10, 1, 27, 12, 16, 2431, 42, -1, 5, 42, -1, 6, 7, 10, 1, 7, 22, 0, 16, 2517, 36, -1, 6, 0, 26, 22, 0, 16, 2381, 42, -1, 3, 20, 1, 0, 1800, 4, -1, 0, 752, 12, 19, 20, 2, 0, 1696, 8, 0, 48, 5, 0, 3216, 8, 4, 7, 11, 16, 2476, 42, 0, 58, 22, 0, 16, 2517, 42, -1, 2, 0, 3616, 28, -15, 41, 16, 2493, 42, 0, 55, 22, 0, 16, 2496, 42, 0, 60, 22, 0, 16, 2517, 22, 0, 16, 2508, 22, 0, 16, 2230, 0, 3196, 20, 11, 48, 22, 0, 16, 2517, 6, 10, 2528, 52, 38, -1, 11, 22, 0, 16, 2666, 20, 0, 53, 12, 26, 29, 1, 0, 1, 0, 1332, 24, 17, 0, 1632, 12, 4, 0, 3928, 8, 21, 0, 4400, 4, -7, 20, 4, 38, -1, 2, 20, 0, 38, -1, 3, 42, -1, 2, 0, 4248, 20, -15, 7, 38, -1, 4, 10, 0, 38, -1, 5, 42, -1, 5, 42, -1, 4, 18, 16, 2658, 42, -1, 2, 42, -1, 5, 7, 38, -1, 6, 42, -1, 6, 20, 1, 42, -1, 1, 0, 2368, 56, -14, 7, 11, 16, 2636, 42, -1, 6, 20, 1, 42, -1, 1, 0, 1572, 60, -21, 7, 11, 20, 1, 2, 11, 22, 0, 16, 2637, 35, 20, 1, 42, -1, 3, 0, 2332, 24, -15, 7, 11, 26, 36, -1, 5, 0, 26, 22, 0, 16, 2579, 42, -1, 3, 22, 0, 16, 2665, 6, 10, 2676, 52, 38, -1, 12, 22, 0, 16, 2796, 20, 0, 53, 13, 26, 29, 1, 0, 1, 42, -1, 1, 0, 2492, 16, -4, 41, 16, 2706, 42, 0, 63, 22, 0, 16, 2795, 22, 0, 16, 2716, 42, -1, 1, 0, 1168, 16, 11, 41, 16, 2727, 42, 0, 64, 22, 0, 16, 2795, 22, 0, 16, 2737, 42, -1, 1, 0, 1856, 16, 21, 41, 16, 2748, 42, 0, 65, 22, 0, 16, 2795, 22, 0, 16, 2758, 42, -1, 1, 0, 4076, 20, -6, 41, 16, 2769, 42, 0, 66, 22, 0, 16, 2795, 22, 0, 16, 2773, 22, 0, 16, 2782, 35, 22, 0, 16, 2795, 22, 0, 16, 2786, 22, 0, 16, 2773, 0, 3196, 20, 11, 48, 22, 0, 16, 2795, 6, 10, 2806, 52, 38, -1, 13, 22, 0, 16, 2926, 20, 0, 53, 14, 26, 29, 1, 0, 1, 42, -1, 1, 0, 1308, 20, -8, 41, 16, 2836, 42, 0, 67, 22, 0, 16, 2925, 22, 0, 16, 2846, 42, -1, 1, 0, 1056, 36, -13, 41, 16, 2857, 42, 0, 68, 22, 0, 16, 2925, 22, 0, 16, 2867, 42, -1, 1, 0, 1188, 40, -13, 41, 16, 2878, 42, 0, 69, 22, 0, 16, 2925, 22, 0, 16, 2888, 42, -1, 1, 0, 2568, 12, -4, 41, 16, 2899, 42, 0, 70, 22, 0, 16, 2925, 22, 0, 16, 2903, 22, 0, 16, 2912, 35, 22, 0, 16, 2925, 22, 0, 16, 2916, 22, 0, 16, 2903, 0, 3196, 20, 11, 48, 22, 0, 16, 2925, 6, 10, 2936, 52, 38, -1, 14, 22, 0, 16, 3014, 20, 0, 53, 15, 26, 29, 1, 0, 1, 42, -1, 1, 0, 1280, 28, -12, 41, 16, 2966, 42, 0, 71, 22, 0, 16, 3013, 22, 0, 16, 2976, 42, -1, 1, 0, 1380, 12, 7, 41, 16, 2987, 42, 0, 72, 22, 0, 16, 3013, 22, 0, 16, 2991, 22, 0, 16, 3e3, 35, 22, 0, 16, 3013, 22, 0, 16, 3004, 22, 0, 16, 2991, 0, 3196, 20, 11, 48, 22, 0, 16, 3013, 6, 10, 3024, 52, 38, -1, 15, 22, 0, 16, 3056, 20, 0, 53, 16, 26, 29, 1, 0, 1, 42, -1, 1, 0, 1104, 8, -5, 41, 16, 3050, 42, 0, 73, 22, 0, 16, 3055, 35, 22, 0, 16, 3055, 6, 10, 3066, 52, 38, -1, 16, 22, 0, 16, 3144, 20, 0, 53, 17, 26, 29, 1, 0, 1, 42, -1, 1, 0, 2940, 28, -19, 41, 16, 3096, 42, 0, 74, 22, 0, 16, 3143, 22, 0, 16, 3106, 42, -1, 1, 0, 448, 12, 19, 41, 16, 3117, 42, 0, 75, 22, 0, 16, 3143, 22, 0, 16, 3121, 22, 0, 16, 3130, 35, 22, 0, 16, 3143, 22, 0, 16, 3134, 22, 0, 16, 3121, 0, 3196, 20, 11, 48, 22, 0, 16, 3143, 6, 10, 3154, 52, 38, -1, 17, 22, 0, 16, 3274, 20, 0, 53, 18, 26, 29, 1, 0, 1, 42, -1, 1, 0, 3300, 12, 3, 41, 16, 3184, 42, 0, 76, 22, 0, 16, 3273, 22, 0, 16, 3194, 42, -1, 1, 0, 2932, 8, 5, 41, 16, 3205, 42, 0, 77, 22, 0, 16, 3273, 22, 0, 16, 3215, 42, -1, 1, 0, 3720, 24, 21, 41, 16, 3226, 42, 0, 78, 22, 0, 16, 3273, 22, 0, 16, 3236, 42, -1, 1, 0, 2632, 52, -19, 41, 16, 3247, 42, 0, 79, 22, 0, 16, 3273, 22, 0, 16, 3251, 22, 0, 16, 3260, 35, 22, 0, 16, 3273, 22, 0, 16, 3264, 22, 0, 16, 3251, 0, 3196, 20, 11, 48, 22, 0, 16, 3273, 6, 10, 3284, 52, 38, -1, 18, 22, 0, 16, 3383, 20, 0, 53, 19, 26, 29, 1, 0, 1, 42, -1, 1, 0, 3160, 24, 9, 41, 16, 3314, 42, 0, 80, 22, 0, 16, 3382, 22, 0, 16, 3324, 42, -1, 1, 0, 2700, 24, 21, 41, 16, 3335, 42, 0, 81, 22, 0, 16, 3382, 22, 0, 16, 3345, 42, -1, 1, 0, 320, 44, -15, 41, 16, 3356, 42, 0, 82, 22, 0, 16, 3382, 22, 0, 16, 3360, 22, 0, 16, 3369, 35, 22, 0, 16, 3382, 22, 0, 16, 3373, 22, 0, 16, 3360, 0, 3196, 20, 11, 48, 22, 0, 16, 3382, 6, 10, 3393, 52, 38, -1, 19, 22, 0, 16, 3479, 20, 0, 53, 20, 26, 29, 2, 0, 1, 2, 10, 3410, 52, 22, 0, 16, 3474, 20, 0, 53, 21, 38, -1, 0, 29, 2, 1, 2, 3, 10, 3429, 52, 22, 0, 16, 3469, 20, 0, 53, 22, 38, -1, 0, 29, 1, 1, 2, 42, -1, 2, 20, 1, 42, 20, 2, 11, 42, 21, 2, 20, 1, 42, 20, 1, 11, 20, 2, 42, 21, 3, 11, 22, 0, 16, 3468, 6, 22, 0, 16, 3473, 6, 22, 0, 16, 3478, 6, 10, 3489, 52, 38, -1, 20, 22, 0, 16, 3592, 20, 0, 53, 23, 26, 29, 1, 0, 1, 20, 0, 0, 816, 12, 10, 48, 0, 4268, 8, -4, 7, 11, 42, -1, 1, 0, 3692, 28, -16, 7, 20, 1, 42, 0, 6, 11, 42, -1, 1, 0, 1392, 24, -9, 7, 16, 3547, 42, -1, 1, 0, 1392, 24, -9, 7, 22, 0, 16, 3555, 42, -1, 1, 0, 4344, 32, -21, 7, 42, -1, 1, 0, 2532, 12, 6, 7, 16, 3577, 42, -1, 1, 0, 2532, 12, 6, 7, 22, 0, 16, 3585, 42, -1, 1, 0, 2224, 32, -21, 7, 20, 4, 22, 0, 16, 3591, 6, 10, 3602, 52, 38, -1, 21, 22, 0, 16, 3713, 20, 0, 53, 24, 26, 29, 1, 0, 1, 20, 0, 0, 816, 12, 10, 48, 0, 4268, 8, -4, 7, 11, 42, -1, 1, 0, 3692, 28, -16, 7, 20, 1, 42, 0, 6, 11, 42, -1, 1, 0, 2996, 16, 19, 7, 42, -1, 1, 0, 1392, 24, -9, 7, 16, 3668, 42, -1, 1, 0, 1392, 24, -9, 7, 22, 0, 16, 3676, 42, -1, 1, 0, 4344, 32, -21, 7, 42, -1, 1, 0, 2532, 12, 6, 7, 16, 3698, 42, -1, 1, 0, 2532, 12, 6, 7, 22, 0, 16, 3706, 42, -1, 1, 0, 2224, 32, -21, 7, 20, 5, 22, 0, 16, 3712, 6, 10, 3723, 52, 38, -1, 22, 22, 0, 16, 3986, 20, 0, 53, 25, 26, 29, 1, 0, 1, 10, 0, 38, -1, 2, 0, 2684, 16, 16, 42, 0, 94, 0, 1416, 24, -13, 42, 0, 93, 0, 4060, 16, -6, 42, 0, 92, 0, 1704, 16, 12, 42, 0, 91, 49, 4, 38, -1, 3, 0, 2804, 12, 11, 42, 0, 99, 0, 3476, 12, 2, 42, 0, 98, 0, 108, 16, -8, 42, 0, 97, 0, 3316, 20, -17, 42, 0, 96, 0, 3544, 4, -14, 42, 0, 95, 49, 5, 38, -1, 4, 42, -1, 3, 20, 1, 0, 4384, 16, 20, 48, 0, 840, 8, 15, 7, 11, 38, -1, 5, 42, -1, 5, 0, 4248, 20, -15, 7, 38, -1, 6, 10, 0, 38, -1, 7, 42, -1, 7, 42, -1, 6, 18, 16, 3902, 42, -1, 5, 42, -1, 7, 7, 38, -1, 8, 42, -1, 1, 42, -1, 8, 7, 16, 3893, 42, -1, 3, 42, -1, 8, 7, 42, -1, 2, 20, 2, 42, 0, 8, 11, 30, -1, 2, 26, 36, -1, 7, 0, 26, 22, 0, 16, 3845, 42, -1, 4, 42, -1, 1, 0, 3136, 8, 10, 7, 7, 16, 3941, 42, -1, 4, 42, -1, 1, 0, 3136, 8, 10, 7, 7, 42, -1, 2, 20, 2, 42, 0, 8, 11, 30, -1, 2, 26, 20, 0, 0, 816, 12, 10, 48, 0, 4268, 8, -4, 7, 11, 42, -1, 1, 0, 3692, 28, -16, 7, 20, 1, 42, 0, 6, 11, 42, -1, 2, 42, -1, 1, 0, 1804, 12, -2, 7, 20, 4, 22, 0, 16, 3985, 6, 10, 3996, 52, 38, -1, 23, 22, 0, 16, 4338, 20, 0, 53, 26, 26, 29, 1, 0, 1, 20, 0, 38, -1, 2, 4, 4318, 42, -1, 1, 0, 3184, 12, 4, 7, 24, 16, 4040, 26, 42, -1, 1, 0, 3184, 12, 4, 7, 0, 4248, 20, -15, 7, 10, 1, 13, 16, 4058, 42, -1, 1, 0, 3184, 12, 4, 7, 30, -1, 3, 26, 22, 0, 16, 4100, 42, -1, 1, 0, 4152, 20, 0, 7, 24, 16, 4086, 26, 42, -1, 1, 0, 4152, 20, 0, 7, 0, 4248, 20, -15, 7, 10, 1, 13, 16, 4100, 42, -1, 1, 0, 4152, 20, 0, 7, 30, -1, 3, 26, 42, -1, 3, 16, 4305, 42, -1, 3, 0, 4248, 20, -15, 7, 38, -1, 5, 10, 0, 38, -1, 6, 42, -1, 6, 42, -1, 5, 18, 16, 4254, 42, -1, 3, 42, -1, 6, 7, 20, 1, 54, 0, 4532, 20, 21, 7, 11, 30, -1, 4, 26, 42, -1, 4, 16, 4245, 42, -1, 3, 42, -1, 6, 7, 0, 3896, 32, -14, 7, 20, 1, 42, -1, 2, 0, 2332, 24, -15, 7, 11, 26, 42, -1, 4, 0, 1328, 4, -6, 7, 20, 1, 0, 2476, 8, 15, 48, 0, 3608, 8, -5, 7, 11, 20, 1, 42, -1, 2, 0, 2332, 24, -15, 7, 11, 26, 42, -1, 4, 0, 2792, 4, 20, 7, 20, 1, 0, 2476, 8, 15, 48, 0, 3608, 8, -5, 7, 11, 20, 1, 42, -1, 2, 0, 2332, 24, -15, 7, 11, 26, 36, -1, 6, 0, 26, 22, 0, 16, 4121, 42, -1, 1, 0, 3692, 28, -16, 7, 20, 1, 42, 0, 6, 11, 20, 1, 42, -1, 2, 0, 2332, 24, -15, 7, 11, 26, 20, 0, 0, 816, 12, 10, 48, 0, 4268, 8, -4, 7, 11, 20, 1, 42, -1, 2, 0, 2332, 24, -15, 7, 11, 26, 42, -1, 2, 22, 0, 16, 4337, 9, 4314, 22, 0, 16, 4328, 38, -1, 7, 42, -1, 2, 22, 0, 16, 4337, 0, 3196, 20, 11, 48, 22, 0, 16, 4337, 6, 10, 4348, 52, 38, -1, 24, 22, 0, 16, 4391, 20, 0, 53, 27, 26, 29, 1, 0, 1, 20, 0, 0, 816, 12, 10, 48, 0, 4268, 8, -4, 7, 11, 42, -1, 1, 0, 3692, 28, -16, 7, 20, 1, 42, 0, 6, 11, 20, 2, 22, 0, 16, 4390, 6, 10, 4401, 52, 38, -1, 25, 22, 0, 16, 4688, 20, 0, 53, 28, 26, 29, 1, 0, 1, 42, -1, 1, 0, 3692, 28, -16, 7, 38, -1, 2, 42, -1, 1, 0, 736, 16, -8, 7, 0, 2940, 28, -19, 41, 16, 4443, 42, 0, 100, 22, 0, 16, 4446, 42, 0, 101, 38, -1, 3, 42, -1, 2, 0, 3680, 8, -3, 7, 24, 44, 16, 4466, 26, 0, 1772, 0, 19, 38, -1, 4, 0, 3616, 28, -15, 20, 1, 42, -1, 1, 0, 1512, 32, -13, 7, 0, 1092, 12, -3, 7, 11, 38, -1, 5, 10, 0, 38, -1, 6, 42, -1, 3, 42, 0, 101, 41, 16, 4582, 42, -1, 2, 0, 624, 56, -13, 7, 10, 0, 20, 2, 42, -1, 4, 0, 592, 16, -18, 7, 11, 42, -1, 5, 14, 42, -1, 2, 0, 4276, 28, 5, 7, 20, 1, 42, -1, 4, 0, 592, 16, -18, 7, 11, 14, 38, -1, 7, 42, -1, 5, 0, 4248, 20, -15, 7, 42, -1, 7, 0, 4248, 20, -15, 7, 31, 10, 100, 3, 30, -1, 6, 26, 22, 0, 16, 4636, 42, -1, 2, 0, 4276, 28, 5, 7, 42, -1, 2, 0, 624, 56, -13, 7, 20, 2, 42, -1, 4, 0, 592, 16, -18, 7, 11, 38, -1, 8, 42, -1, 8, 0, 4248, 20, -15, 7, 42, -1, 4, 0, 4248, 20, -15, 7, 31, 10, 100, 3, 30, -1, 6, 26, 20, 0, 0, 816, 12, 10, 48, 0, 4268, 8, -4, 7, 11, 42, -1, 2, 20, 1, 42, 0, 6, 11, 42, -1, 3, 42, 0, 101, 41, 16, 4674, 10, 1, 27, 22, 0, 16, 4675, 35, 42, -1, 6, 42, -1, 3, 20, 5, 22, 0, 16, 4687, 6, 10, 4698, 52, 38, -1, 26, 22, 0, 16, 4915, 20, 0, 53, 29, 26, 29, 1, 0, 1, 10, 0, 38, -1, 2, 42, -1, 1, 0, 3692, 28, -16, 7, 0, 4096, 24, 2, 48, 46, 24, 44, 16, 4745, 26, 42, -1, 1, 0, 3692, 28, -16, 7, 0, 3820, 36, 15, 48, 46, 16, 4773, 42, -1, 1, 0, 3692, 28, -16, 7, 0, 3680, 8, -3, 7, 0, 4248, 20, -15, 7, 30, -1, 2, 26, 22, 0, 16, 4828, 42, -1, 1, 0, 3692, 28, -16, 7, 0, 1148, 20, -11, 48, 46, 24, 16, 4804, 26, 42, -1, 1, 0, 3692, 28, -16, 7, 0, 4444, 36, 17, 7, 16, 4828, 42, -1, 1, 0, 3692, 28, -16, 7, 0, 52, 56, -22, 7, 0, 4248, 20, -15, 7, 30, -1, 2, 26, 42, -1, 1, 0, 312, 8, -1, 7, 16, 4855, 42, -1, 1, 0, 312, 8, -1, 7, 0, 4248, 20, -15, 7, 22, 0, 16, 4858, 10, 1, 27, 38, -1, 3, 20, 0, 0, 816, 12, 10, 48, 0, 4268, 8, -4, 7, 11, 42, -1, 1, 0, 3692, 28, -16, 7, 20, 1, 42, 0, 6, 11, 42, -1, 1, 0, 3692, 28, -16, 7, 20, 1, 42, 0, 9, 11, 42, -1, 3, 42, -1, 2, 20, 5, 22, 0, 16, 4914, 6, 10, 4925, 52, 38, -1, 27, 22, 0, 16, 5177, 20, 0, 53, 30, 26, 29, 1, 0, 1, 42, -1, 1, 0, 736, 16, -8, 7, 0, 320, 44, -15, 41, 24, 16, 4959, 26, 42, -1, 1, 0, 2832, 24, -1, 7, 16, 5094, 20, 0, 42, -1, 1, 0, 2832, 24, -1, 7, 11, 38, -1, 2, 20, 0, 10, 4984, 52, 22, 0, 16, 5069, 20, 0, 53, 31, 38, -1, 0, 29, 1, 1, 2, 20, 0, 0, 816, 12, 10, 48, 0, 4268, 8, -4, 7, 11, 42, -1, 2, 0, 3692, 28, -16, 7, 20, 1, 42, 0, 6, 11, 42, -1, 2, 0, 2520, 12, -5, 7, 42, -1, 2, 0, 1456, 20, 7, 7, 42, -1, 2, 0, 3496, 40, -14, 7, 42, -1, 2, 0, 4344, 32, -21, 7, 42, -1, 2, 0, 2224, 32, -21, 7, 20, 7, 22, 0, 16, 5068, 6, 20, 1, 42, -1, 2, 0, 2776, 16, -16, 7, 11, 0, 2744, 8, 8, 7, 11, 22, 0, 16, 5176, 22, 0, 16, 5167, 20, 0, 0, 816, 12, 10, 48, 0, 4268, 8, -4, 7, 11, 42, -1, 1, 0, 3692, 28, -16, 7, 20, 1, 42, 0, 6, 11, 42, -1, 1, 0, 2520, 12, -5, 7, 42, -1, 1, 0, 1456, 20, 7, 7, 42, -1, 1, 0, 3496, 40, -14, 7, 42, -1, 1, 0, 4344, 32, -21, 7, 42, -1, 1, 0, 2224, 32, -21, 7, 20, 7, 22, 0, 16, 5176, 0, 3196, 20, 11, 48, 22, 0, 16, 5176, 6, 10, 5187, 52, 38, -1, 28, 22, 0, 16, 5420, 20, 0, 53, 32, 26, 29, 0, 0, 49, 0, 34, 0, 1480, 32, -14, 51, 26, 0, 3880, 16, 4, 20, 0, 0, 816, 12, 10, 48, 0, 4268, 8, -4, 7, 11, 0, 1720, 52, -20, 10, 0, 0, 3644, 24, 11, 49, 0, 0, 848, 4, -4, 49, 0, 0, 4480, 20, 14, 49, 0, 0, 4040, 20, -10, 22, 0, 0, 3356, 16, 16, 22, 0, 49, 7, 34, 0, 3344, 12, -7, 51, 26, 49, 0, 34, 0, 3344, 12, -7, 7, 0, 3144, 16, -13, 51, 26, 22, 1, 34, 0, 3344, 12, -7, 7, 0, 3144, 16, -13, 7, 42, 0, 104, 51, 26, 22, 1, 34, 0, 3344, 12, -7, 7, 0, 3144, 16, -13, 7, 42, 0, 105, 51, 26, 22, 1, 34, 0, 3344, 12, -7, 7, 0, 3144, 16, -13, 7, 42, 0, 106, 51, 26, 22, 1, 34, 0, 3344, 12, -7, 7, 0, 3144, 16, -13, 7, 42, 0, 107, 51, 26, 22, 1, 34, 0, 3344, 12, -7, 7, 0, 3144, 16, -13, 7, 42, 0, 108, 51, 26, 22, 1, 34, 0, 3344, 12, -7, 7, 0, 3144, 16, -13, 7, 42, 0, 109, 51, 26, 34, 20, 1, 34, 0, 1876, 24, 17, 7, 0, 2752, 8, -16, 7, 11, 34, 0, 1876, 24, 17, 51, 26, 0, 3196, 20, 11, 48, 22, 0, 16, 5419, 6, 10, 5430, 52, 38, -1, 29, 22, 0, 16, 5483, 20, 0, 53, 33, 26, 29, 0, 0, 4, 5465, 0, 4412, 12, -2, 48, 0, 1804, 12, -2, 7, 0, 3668, 8, 22, 7, 22, 0, 16, 5482, 9, 5461, 22, 0, 16, 5473, 38, -1, 1, 35, 22, 0, 16, 5482, 0, 3196, 20, 11, 48, 22, 0, 16, 5482, 6, 10, 5493, 52, 38, -1, 30, 22, 0, 16, 5542, 20, 0, 53, 34, 26, 29, 0, 0, 4, 5524, 20, 0, 42, 0, 49, 0, 1092, 12, -3, 7, 11, 22, 0, 16, 5541, 9, 5520, 22, 0, 16, 5532, 38, -1, 1, 35, 22, 0, 16, 5541, 0, 3196, 20, 11, 48, 22, 0, 16, 5541, 6, 10, 5552, 52, 38, -1, 31, 22, 0, 16, 5605, 20, 0, 53, 35, 26, 29, 0, 0, 4, 5587, 0, 3488, 8, -1, 48, 0, 1804, 12, -2, 7, 0, 3668, 8, 22, 7, 22, 0, 16, 5604, 9, 5583, 22, 0, 16, 5595, 38, -1, 1, 35, 22, 0, 16, 5604, 0, 3196, 20, 11, 48, 22, 0, 16, 5604, 6, 10, 5615, 52, 38, -1, 32, 22, 0, 16, 5664, 20, 0, 53, 36, 26, 29, 0, 0, 4, 5646, 20, 0, 42, 0, 110, 0, 1092, 12, -3, 7, 11, 22, 0, 16, 5663, 9, 5642, 22, 0, 16, 5654, 38, -1, 1, 35, 22, 0, 16, 5663, 0, 3196, 20, 11, 48, 22, 0, 16, 5663, 6, 10, 5674, 52, 38, -1, 33, 22, 0, 16, 5767, 20, 0, 53, 37, 26, 29, 0, 0, 4, 5749, 0, 4428, 16, -6, 20, 1, 0, 880, 20, -12, 48, 0, 4120, 32, 19, 7, 11, 38, -1, 1, 42, -1, 1, 0, 4248, 20, -15, 7, 10, 0, 40, 16, 5736, 42, -1, 1, 10, 0, 7, 0, 1644, 36, -14, 7, 22, 0, 16, 5766, 22, 0, 16, 5743, 10, 1, 27, 22, 0, 16, 5766, 9, 5745, 22, 0, 16, 5757, 38, -1, 2, 35, 22, 0, 16, 5766, 0, 3196, 20, 11, 48, 22, 0, 16, 5766, 6, 10, 5777, 52, 38, -1, 34, 22, 0, 16, 5987, 20, 0, 53, 38, 26, 29, 1, 0, 1, 4, 5974, 42, -1, 1, 0, 312, 8, -1, 7, 38, -1, 2, 42, -1, 2, 10, 0, 8, 12, 24, 16, 5822, 26, 42, -1, 2, 0, 2580, 8, -21, 7, 10, 0, 8, 12, 16, 5968, 42, -1, 2, 0, 2580, 8, -21, 7, 0, 3688, 4, -11, 41, 16, 5876, 42, -1, 1, 0, 724, 12, 15, 7, 42, -1, 1, 0, 1816, 40, -22, 7, 20, 2, 20, 1, 42, 0, 113, 10, 0, 7, 0, 2332, 24, -15, 7, 11, 26, 22, 0, 16, 5968, 42, -1, 2, 0, 2580, 8, -21, 7, 0, 1780, 4, -7, 41, 16, 5920, 42, -1, 1, 0, 724, 12, 15, 7, 42, -1, 1, 0, 1816, 40, -22, 7, 20, 2, 42, 0, 113, 10, 1, 51, 26, 22, 0, 16, 5968, 42, -1, 2, 0, 2580, 8, -21, 7, 0, 4380, 4, -13, 41, 16, 5968, 42, -1, 2, 0, 3688, 4, -11, 7, 42, -1, 2, 0, 4528, 4, 17, 7, 20, 2, 20, 1, 42, 0, 113, 10, 2, 7, 0, 2332, 24, -15, 7, 11, 26, 9, 5970, 22, 0, 16, 5977, 38, -1, 3, 0, 3196, 20, 11, 48, 22, 0, 16, 5986, 6, 10, 5997, 52, 38, -1, 35, 22, 0, 16, 6160, 20, 0, 53, 39, 26, 29, 2, 0, 1, 2, 4, 6147, 42, -1, 1, 0, 312, 8, -1, 7, 38, -1, 3, 42, -1, 3, 10, 0, 8, 12, 24, 16, 6043, 26, 42, -1, 3, 0, 2580, 8, -21, 7, 10, 0, 8, 12, 16, 6141, 42, -1, 3, 0, 2580, 8, -21, 7, 0, 3312, 4, -6, 41, 16, 6141, 20, 0, 42, 0, 36, 11, 26, 0, 1476, 4, -3, 0, 3688, 4, -11, 42, 0, 111, 20, 1, 0, 3372, 8, 11, 48, 0, 680, 24, -11, 7, 11, 20, 1, 42, 0, 37, 11, 0, 4528, 4, 17, 42, -1, 2, 0, 2580, 8, -21, 0, 4380, 4, -13, 0, 1816, 40, -22, 0, 2620, 12, 0, 49, 4, 20, 2, 0, 3488, 8, -1, 48, 0, 2292, 40, -22, 7, 0, 3800, 20, 6, 7, 11, 26, 9, 6143, 22, 0, 16, 6150, 38, -1, 4, 0, 3196, 20, 11, 48, 22, 0, 16, 6159, 6, 10, 6170, 52, 38, -1, 36, 22, 0, 16, 6249, 20, 0, 53, 40, 26, 29, 0, 0, 10, 0, 38, -1, 1, 42, -1, 1, 42, 0, 112, 0, 4248, 20, -15, 7, 18, 16, 6239, 42, 0, 112, 42, -1, 1, 7, 15, 0, 4552, 20, -11, 41, 16, 6230, 20, 0, 42, 0, 112, 42, -1, 1, 7, 11, 42, 0, 111, 42, -1, 1, 51, 26, 36, -1, 1, 0, 26, 22, 0, 16, 6183, 0, 3196, 20, 11, 48, 22, 0, 16, 6248, 6, 10, 6259, 52, 38, -1, 37, 22, 0, 16, 6276, 20, 0, 53, 41, 26, 29, 1, 0, 1, 42, -1, 1, 22, 0, 16, 6275, 6, 10, 6286, 52, 38, -1, 38, 22, 0, 16, 6819, 20, 0, 53, 42, 26, 29, 0, 0, 4, 6759, 20, 0, 42, 0, 36, 11, 26, 10, 0, 38, -1, 1, 42, -1, 1, 42, 0, 113, 10, 0, 7, 0, 4248, 20, -15, 7, 18, 16, 6387, 42, 0, 113, 10, 0, 7, 42, -1, 1, 7, 10, 1, 7, 0, 2580, 8, -21, 0, 3312, 4, -6, 0, 1816, 40, -22, 0, 2620, 12, 0, 49, 2, 20, 2, 42, 0, 113, 10, 0, 7, 42, -1, 1, 7, 10, 0, 7, 0, 3800, 20, 6, 7, 11, 26, 36, -1, 1, 0, 26, 22, 0, 16, 6308, 42, 0, 111, 20, 1, 0, 3372, 8, 11, 48, 0, 680, 24, -11, 7, 11, 20, 1, 42, 0, 37, 11, 10, 0, 20, 2, 20, 1, 42, 0, 113, 10, 2, 7, 0, 2332, 24, -15, 7, 11, 26, 10, 6435, 52, 22, 0, 16, 6741, 20, 0, 53, 43, 38, -1, 0, 29, 1, 1, 2, 10, 6456, 52, 38, -1, 3, 22, 0, 16, 6722, 20, 0, 53, 44, 26, 29, 1, 0, 1, 42, 0, 113, 10, 1, 7, 38, -1, 2, 42, 0, 113, 10, 2, 7, 38, -1, 3, 42, -1, 2, 10, 0, 8, 41, 24, 44, 16, 6502, 26, 42, -1, 3, 10, 0, 8, 41, 24, 44, 16, 6518, 26, 42, -1, 3, 0, 4248, 20, -15, 7, 10, 3, 18, 24, 16, 6528, 26, 42, -1, 1, 10, 30, 18, 16, 6600, 42, -1, 1, 10, 10, 18, 16, 6544, 10, 1, 22, 0, 16, 6546, 10, 3, 38, -1, 4, 42, -1, 4, 10, 6559, 52, 22, 0, 16, 6587, 20, 0, 53, 45, 38, -1, 0, 29, 0, 1, 42, 44, 1, 42, 44, 4, 14, 20, 1, 42, 43, 3, 11, 22, 0, 16, 6586, 6, 20, 2, 0, 3856, 24, -10, 48, 11, 26, 22, 0, 16, 6712, 42, -1, 2, 10, 0, 8, 12, 24, 16, 6622, 26, 42, -1, 2, 0, 4248, 20, -15, 7, 10, 2, 41, 16, 6689, 0, 2288, 4, 10, 42, -1, 3, 20, 1, 0, 3372, 8, 11, 48, 0, 680, 24, -11, 7, 11, 0, 2580, 8, -21, 0, 3036, 4, -16, 0, 1816, 40, -22, 0, 2620, 12, 0, 49, 3, 38, -1, 5, 42, -1, 2, 10, 1, 7, 42, -1, 5, 20, 2, 42, -1, 2, 10, 0, 7, 0, 3800, 20, 6, 7, 11, 26, 20, 0, 42, 0, 113, 10, 2, 51, 26, 10, 0, 42, 43, 2, 20, 2, 0, 3856, 24, -10, 48, 11, 26, 0, 3196, 20, 11, 48, 22, 0, 16, 6721, 6, 10, 0, 20, 1, 42, -1, 3, 11, 26, 0, 3196, 20, 11, 48, 22, 0, 16, 6740, 6, 20, 1, 0, 1e3, 32, -17, 48, 5, 22, 0, 16, 6818, 9, 6755, 22, 0, 16, 6809, 38, -1, 2, 10, 6769, 52, 22, 0, 16, 6797, 20, 0, 53, 46, 38, -1, 0, 29, 1, 1, 2, 20, 0, 42, -1, 2, 11, 26, 0, 3196, 20, 11, 48, 22, 0, 16, 6796, 6, 20, 1, 0, 1e3, 32, -17, 48, 5, 22, 0, 16, 6818, 0, 3196, 20, 11, 48, 22, 0, 16, 6818, 6, 10, 6829, 52, 38, -1, 39, 22, 0, 16, 7030, 20, 0, 53, 47, 26, 29, 1, 0, 1, 42, -1, 1, 10, 0, 41, 16, 6871, 42, 0, 34, 0, 2724, 20, 5, 20, 2, 0, 3488, 8, -1, 48, 0, 3556, 40, 22, 7, 11, 26, 22, 0, 16, 7020, 10, 6878, 52, 22, 0, 16, 6912, 20, 0, 53, 48, 38, -1, 0, 29, 1, 1, 2, 42, 47, 1, 42, -1, 2, 20, 2, 42, 0, 35, 11, 26, 0, 3196, 20, 11, 48, 22, 0, 16, 6911, 6, 0, 2724, 20, 5, 20, 2, 0, 3488, 8, -1, 48, 0, 3556, 40, 22, 7, 11, 26, 0, 1476, 4, -3, 0, 2580, 8, -21, 0, 3688, 4, -11, 0, 1816, 40, -22, 0, 2620, 12, 0, 49, 2, 20, 2, 0, 3488, 8, -1, 48, 0, 2292, 40, -22, 7, 0, 3800, 20, 6, 7, 11, 26, 42, -1, 1, 10, 2, 41, 16, 7020, 0, 1476, 4, -3, 0, 2580, 8, -21, 0, 1780, 4, -7, 0, 1816, 40, -22, 0, 2620, 12, 0, 49, 2, 20, 2, 0, 3488, 8, -1, 48, 0, 2292, 40, -22, 7, 0, 3800, 20, 6, 7, 11, 26, 0, 3196, 20, 11, 48, 22, 0, 16, 7029, 6, 0, 4076, 20, -6, 0, 1184, 4, 18, 0, 1856, 16, 21, 0, 4516, 4, 12, 0, 1168, 16, 11, 0, 3744, 8, 22, 0, 2492, 16, -4, 0, 0, 16, -19, 49, 4, 38, -1, 40, 0, 1188, 40, -13, 0, 2356, 8, -18, 0, 1056, 36, -13, 0, 1440, 4, 6, 0, 1308, 20, -8, 0, 3068, 4, -1, 49, 3, 38, -1, 41, 0, 320, 44, -15, 0, 3336, 8, 18, 49, 1, 38, -1, 42, 0, 1380, 12, 7, 0, 4376, 4, -5, 0, 1280, 28, -12, 0, 2968, 4, 21, 49, 2, 38, -1, 43, 0, 2760, 16, 1, 0, 1052, 4, 2, 49, 1, 38, -1, 44, 0, 524, 24, 4, 10, 7154, 52, 22, 0, 16, 7297, 20, 0, 53, 49, 38, -1, 0, 29, 1, 1, 2, 35, 38, -1, 3, 42, 0, 40, 42, -1, 2, 7, 10, 0, 8, 12, 16, 7193, 42, 0, 40, 42, -1, 2, 7, 30, -1, 3, 26, 42, 0, 41, 42, -1, 2, 7, 10, 0, 8, 12, 16, 7217, 42, 0, 41, 42, -1, 2, 7, 30, -1, 3, 26, 42, 0, 42, 42, -1, 2, 7, 10, 0, 8, 12, 16, 7241, 42, 0, 42, 42, -1, 2, 7, 30, -1, 3, 26, 42, 0, 43, 42, -1, 2, 7, 10, 0, 8, 12, 16, 7265, 42, 0, 43, 42, -1, 2, 7, 30, -1, 3, 26, 42, 0, 44, 42, -1, 2, 7, 10, 0, 8, 12, 16, 7289, 42, 0, 44, 42, -1, 2, 7, 30, -1, 3, 26, 42, -1, 3, 22, 0, 16, 7296, 6, 0, 4404, 8, -1, 10, 7308, 52, 22, 0, 16, 7437, 20, 0, 53, 50, 38, -1, 0, 29, 2, 1, 2, 3, 42, 0, 44, 42, -1, 2, 7, 38, -1, 4, 35, 38, -1, 5, 20, 0, 38, -1, 6, 10, 7346, 52, 22, 0, 16, 7432, 20, 0, 53, 51, 38, -1, 0, 29, 1, 1, 2, 42, 50, 6, 42, -1, 2, 20, 2, 42, 0, 4, 11, 30, 50, 5, 26, 42, 50, 5, 35, 41, 16, 7385, 47, 22, 0, 16, 7431, 42, 50, 5, 0, 972, 24, 15, 7, 30, 50, 6, 26, 42, 50, 5, 0, 460, 44, -21, 7, 30, 50, 5, 26, 42, 50, 5, 42, 50, 4, 20, 2, 42, 50, 3, 11, 26, 0, 3196, 20, 11, 48, 22, 0, 16, 7431, 6, 22, 0, 16, 7436, 6, 0, 3752, 36, -13, 10, 7448, 52, 22, 0, 16, 7533, 20, 0, 53, 52, 38, -1, 0, 29, 2, 1, 2, 3, 42, 0, 43, 42, -1, 2, 7, 38, -1, 4, 35, 38, -1, 5, 10, 7481, 52, 22, 0, 16, 7528, 20, 0, 53, 53, 38, -1, 0, 29, 1, 1, 2, 42, -1, 2, 20, 1, 42, 0, 2, 11, 30, 52, 5, 26, 42, 52, 5, 42, 52, 4, 20, 2, 42, 52, 3, 11, 26, 0, 3196, 20, 11, 48, 22, 0, 16, 7527, 6, 22, 0, 16, 7532, 6, 0, 2508, 8, 0, 10, 7544, 52, 22, 0, 16, 7629, 20, 0, 53, 54, 38, -1, 0, 29, 2, 1, 2, 3, 42, 0, 40, 42, -1, 2, 7, 38, -1, 4, 35, 38, -1, 5, 10, 7577, 52, 22, 0, 16, 7624, 20, 0, 53, 55, 38, -1, 0, 29, 1, 1, 2, 42, -1, 2, 20, 1, 42, 0, 3, 11, 30, 54, 5, 26, 42, 54, 5, 42, 54, 4, 20, 2, 42, 54, 3, 11, 26, 0, 3196, 20, 11, 48, 22, 0, 16, 7623, 6, 22, 0, 16, 7628, 6, 0, 320, 44, -15, 10, 7640, 52, 22, 0, 16, 7757, 20, 0, 53, 56, 38, -1, 0, 29, 2, 1, 2, 3, 42, 0, 42, 42, -1, 2, 7, 38, -1, 4, 35, 38, -1, 5, 10, 7673, 52, 22, 0, 16, 7752, 20, 0, 53, 57, 38, -1, 0, 29, 1, 1, 2, 42, -1, 2, 20, 1, 42, 0, 1, 11, 30, 56, 5, 26, 10, 0, 38, -1, 3, 42, -1, 3, 42, 56, 5, 0, 4248, 20, -15, 7, 18, 16, 7742, 42, 56, 5, 42, -1, 3, 7, 42, 56, 4, 20, 2, 42, 56, 3, 11, 26, 36, -1, 3, 0, 26, 22, 0, 16, 7702, 0, 3196, 20, 11, 48, 22, 0, 16, 7751, 6, 22, 0, 16, 7756, 6, 0, 2544, 24, -15, 10, 7768, 52, 22, 0, 16, 7853, 20, 0, 53, 58, 38, -1, 0, 29, 2, 1, 2, 3, 42, 0, 41, 42, -1, 2, 7, 38, -1, 4, 35, 38, -1, 5, 10, 7801, 52, 22, 0, 16, 7848, 20, 0, 53, 59, 38, -1, 0, 29, 1, 1, 2, 42, -1, 2, 20, 1, 42, 0, 0, 11, 30, 58, 5, 26, 42, 58, 5, 42, 58, 4, 20, 2, 42, 58, 3, 11, 26, 0, 3196, 20, 11, 48, 22, 0, 16, 7847, 6, 22, 0, 16, 7852, 6, 49, 6, 38, -1, 45, 10, 16, 38, -1, 46, 10, 15, 10, 1e3, 3, 38, -1, 47, 10, 7878, 52, 22, 0, 16, 8714, 20, 0, 53, 60, 38, -1, 0, 29, 4, 1, 2, 3, 4, 5, 20, 0, 0, 816, 12, 10, 48, 0, 4268, 8, -4, 7, 11, 34, 0, 1480, 32, -14, 7, 0, 3676, 4, 14, 51, 26, 42, -1, 2, 10, 0, 8, 41, 16, 7946, 34, 0, 3344, 12, -7, 7, 0, 3144, 16, -13, 7, 0, 2544, 24, -15, 7, 22, 0, 16, 7949, 42, -1, 2, 34, 0, 3344, 12, -7, 7, 0, 3144, 16, -13, 7, 0, 2544, 24, -15, 51, 26, 42, -1, 4, 10, 0, 8, 41, 16, 7995, 34, 0, 3344, 12, -7, 7, 0, 3144, 16, -13, 7, 0, 2508, 8, 0, 7, 22, 0, 16, 7998, 42, -1, 4, 34, 0, 3344, 12, -7, 7, 0, 3144, 16, -13, 7, 0, 2508, 8, 0, 51, 26, 42, -1, 3, 10, 0, 8, 41, 16, 8044, 34, 0, 3344, 12, -7, 7, 0, 3144, 16, -13, 7, 0, 840, 8, 15, 7, 22, 0, 16, 8047, 42, -1, 3, 34, 0, 3344, 12, -7, 7, 0, 3144, 16, -13, 7, 0, 840, 8, 15, 51, 26, 42, -1, 5, 10, 0, 8, 41, 16, 8093, 34, 0, 3344, 12, -7, 7, 0, 3144, 16, -13, 7, 0, 460, 44, -21, 7, 22, 0, 16, 8096, 42, -1, 5, 34, 0, 3344, 12, -7, 7, 0, 3144, 16, -13, 7, 0, 460, 44, -21, 51, 26, 34, 0, 3344, 12, -7, 7, 0, 4040, 20, -10, 7, 22, 0, 41, 16, 8690, 0, 4412, 12, -2, 48, 0, 3536, 8, 5, 7, 20, 1, 32, 5, 38, -1, 6, 34, 0, 3344, 12, -7, 7, 0, 3144, 16, -13, 7, 0, 2544, 24, -15, 7, 16, 8320, 22, 1, 34, 0, 1876, 24, 17, 7, 0, 1308, 20, -8, 20, 2, 42, 0, 45, 0, 2544, 24, -15, 7, 11, 0, 1308, 20, -8, 20, 3, 42, -1, 6, 0, 3556, 40, 22, 7, 11, 26, 22, 1, 34, 0, 1876, 24, 17, 7, 0, 1188, 40, -13, 20, 2, 42, 0, 45, 0, 2544, 24, -15, 7, 11, 0, 1188, 40, -13, 20, 3, 42, -1, 6, 0, 3556, 40, 22, 7, 11, 26, 22, 1, 34, 0, 1876, 24, 17, 7, 0, 1056, 36, -13, 20, 2, 42, 0, 45, 0, 2544, 24, -15, 7, 11, 0, 1056, 36, -13, 20, 3, 42, -1, 6, 0, 3556, 40, 22, 7, 11, 26, 22, 1, 34, 0, 1876, 24, 17, 7, 0, 320, 44, -15, 20, 2, 42, 0, 45, 0, 320, 44, -15, 7, 11, 0, 320, 44, -15, 20, 3, 42, -1, 6, 0, 3556, 40, 22, 7, 11, 26, 34, 0, 3344, 12, -7, 7, 0, 3144, 16, -13, 7, 0, 840, 8, 15, 7, 22, 1, 41, 16, 8419, 22, 1, 34, 0, 1876, 24, 17, 7, 0, 1380, 12, 7, 20, 2, 42, 0, 45, 0, 3752, 36, -13, 7, 11, 0, 1380, 12, 7, 20, 3, 42, -1, 6, 0, 3556, 40, 22, 7, 11, 26, 22, 1, 34, 0, 1876, 24, 17, 7, 0, 1280, 28, -12, 20, 2, 42, 0, 45, 0, 3752, 36, -13, 7, 11, 0, 1280, 28, -12, 20, 3, 42, -1, 6, 0, 3556, 40, 22, 7, 11, 26, 34, 0, 3344, 12, -7, 7, 0, 3144, 16, -13, 7, 0, 2508, 8, 0, 7, 24, 16, 8470, 26, 0, 4412, 12, -2, 48, 0, 3536, 8, 5, 7, 0, 2492, 16, -4, 20, 2, 28, 0, 3788, 12, -2, 7, 0, 952, 20, 5, 7, 11, 22, 1, 41, 16, 8589, 22, 1, 34, 0, 1876, 24, 17, 7, 0, 2492, 16, -4, 20, 2, 42, 0, 45, 0, 2508, 8, 0, 7, 11, 0, 2492, 16, -4, 20, 3, 42, -1, 6, 0, 3556, 40, 22, 7, 11, 26, 22, 1, 34, 0, 1876, 24, 17, 7, 0, 1856, 16, 21, 20, 2, 42, 0, 45, 0, 2508, 8, 0, 7, 11, 0, 1856, 16, 21, 20, 3, 42, -1, 6, 0, 3556, 40, 22, 7, 11, 26, 22, 1, 34, 0, 1876, 24, 17, 7, 0, 1168, 16, 11, 20, 2, 42, 0, 45, 0, 2508, 8, 0, 7, 11, 0, 1168, 16, 11, 20, 3, 42, -1, 6, 0, 3556, 40, 22, 7, 11, 26, 34, 0, 3344, 12, -7, 7, 0, 3144, 16, -13, 7, 0, 460, 44, -21, 7, 24, 16, 8635, 26, 0, 3488, 8, -1, 48, 0, 2760, 16, 1, 20, 2, 28, 0, 3788, 12, -2, 7, 0, 952, 20, 5, 7, 11, 22, 1, 41, 16, 8676, 22, 1, 34, 0, 1876, 24, 17, 7, 0, 2760, 16, 1, 20, 2, 42, 0, 45, 0, 4404, 8, -1, 7, 11, 0, 2760, 16, 1, 20, 3, 42, -1, 6, 0, 3556, 40, 22, 7, 11, 26, 22, 1, 34, 0, 3344, 12, -7, 7, 0, 4040, 20, -10, 51, 26, 22, 1, 34, 0, 3344, 12, -7, 7, 0, 3356, 16, 16, 51, 26, 0, 3196, 20, 11, 48, 22, 0, 16, 8713, 6, 42, -1, 5, 0, 2200, 12, 0, 7, 0, 3144, 16, -13, 51, 26, 10, 8735, 52, 22, 0, 16, 8769, 20, 0, 53, 61, 38, -1, 0, 29, 0, 1, 22, 0, 34, 0, 3344, 12, -7, 7, 0, 3356, 16, 16, 51, 26, 0, 3196, 20, 11, 48, 22, 0, 16, 8768, 6, 42, -1, 5, 0, 2200, 12, 0, 7, 0, 4648, 8, 12, 51, 26, 10, 8790, 52, 22, 0, 16, 8816, 20, 0, 53, 62, 38, -1, 0, 29, 0, 1, 34, 0, 3344, 12, -7, 7, 0, 3880, 16, 4, 7, 22, 0, 16, 8815, 6, 42, -1, 5, 0, 2200, 12, 0, 7, 0, 3012, 8, 17, 51, 26, 10, 8837, 52, 22, 0, 16, 9002, 20, 0, 53, 63, 38, -1, 0, 29, 0, 1, 34, 0, 3344, 12, -7, 7, 0, 4480, 20, 14, 7, 20, 1, 0, 4384, 16, 20, 48, 0, 840, 8, 15, 7, 11, 38, -1, 2, 42, -1, 2, 0, 4248, 20, -15, 7, 38, -1, 3, 10, 0, 38, -1, 4, 42, -1, 4, 42, -1, 3, 18, 16, 8991, 42, -1, 2, 42, -1, 4, 7, 38, -1, 5, 20, 0, 34, 0, 3344, 12, -7, 7, 0, 4480, 20, 14, 7, 42, -1, 5, 7, 0, 1092, 12, -3, 7, 11, 34, 0, 1480, 32, -14, 7, 42, -1, 5, 51, 26, 20, 0, 34, 0, 3344, 12, -7, 7, 0, 4480, 20, 14, 7, 42, -1, 5, 7, 0, 400, 48, -18, 7, 11, 34, 0, 1480, 32, -14, 7, 42, -1, 5, 0, 2516, 4, 12, 14, 51, 26, 36, -1, 4, 0, 26, 22, 0, 16, 8890, 34, 0, 1480, 32, -14, 7, 22, 0, 16, 9001, 6, 42, -1, 5, 0, 2200, 12, 0, 7, 0, 1092, 12, -3, 51, 26, 10, 9023, 52, 22, 0, 16, 9059, 20, 0, 53, 64, 38, -1, 0, 29, 2, 1, 2, 3, 42, -1, 3, 34, 0, 1480, 32, -14, 7, 42, -1, 2, 51, 26, 0, 3196, 20, 11, 48, 22, 0, 16, 9058, 6, 42, -1, 5, 0, 2200, 12, 0, 7, 0, 3288, 12, 17, 51, 26, 10, 9080, 52, 22, 0, 16, 9123, 20, 0, 53, 65, 38, -1, 0, 29, 0, 1, 49, 0, 34, 0, 1480, 32, -14, 51, 26, 49, 0, 34, 0, 3344, 12, -7, 7, 0, 4480, 20, 14, 51, 26, 0, 3196, 20, 11, 48, 22, 0, 16, 9122, 6, 42, -1, 5, 0, 2200, 12, 0, 7, 0, 16, 16, 18, 51, 26, 10, 9144, 52, 22, 0, 16, 9182, 20, 0, 53, 66, 38, -1, 0, 29, 2, 1, 2, 3, 42, -1, 3, 42, -1, 2, 20, 2, 34, 0, 1876, 24, 17, 7, 11, 26, 0, 3196, 20, 11, 48, 22, 0, 16, 9181, 6, 42, -1, 5, 0, 2200, 12, 0, 7, 0, 2256, 32, 6, 51, 26, 10, 9203, 52, 22, 0, 16, 9377, 20, 0, 53, 67, 38, -1, 0, 29, 2, 1, 2, 3, 34, 0, 3344, 12, -7, 7, 0, 3356, 16, 16, 7, 22, 0, 41, 16, 9236, 47, 22, 0, 16, 9376, 4, 9347, 42, -1, 3, 0, 4248, 20, -15, 7, 10, 1, 25, 38, -1, 4, 42, -1, 3, 42, -1, 4, 7, 38, -1, 5, 34, 0, 3344, 12, -7, 7, 0, 4480, 20, 14, 7, 42, -1, 2, 7, 44, 16, 9311, 42, 0, 47, 42, 0, 46, 20, 2, 50, 0, 3052, 16, 15, 7, 5, 34, 0, 3344, 12, -7, 7, 0, 4480, 20, 14, 7, 42, -1, 2, 51, 26, 42, -1, 3, 42, -1, 5, 20, 2, 34, 0, 3344, 12, -7, 7, 0, 4480, 20, 14, 7, 42, -1, 2, 7, 0, 2332, 24, -15, 7, 11, 26, 9, 9343, 22, 0, 16, 9367, 38, -1, 6, 42, -1, 6, 0, 460, 44, -21, 20, 2, 50, 0, 3072, 64, -16, 7, 11, 26, 0, 3196, 20, 11, 48, 22, 0, 16, 9376, 6, 42, -1, 5, 0, 2200, 12, 0, 7, 0, 1876, 24, 17, 51, 26, 20, 0, 42, -1, 5, 5, 38, -1, 48, 42, -1, 48, 38, -1, 49, 10, 1, 38, -1, 50, 10, 2, 38, -1, 51, 0, 3948, 16, -15, 48, 15, 0, 3196, 20, 11, 12, 16, 9441, 20, 0, 0, 3948, 16, -15, 48, 5, 22, 0, 16, 9442, 35, 38, -1, 52, 10, 0, 38, -1, 53, 10, 1, 38, -1, 54, 10, 2, 38, -1, 55, 10, 3, 38, -1, 56, 10, 4, 38, -1, 57, 10, 5, 38, -1, 58, 10, 6, 38, -1, 59, 10, 7, 38, -1, 60, 10, 8, 38, -1, 61, 20, 0, 10, 9499, 52, 22, 0, 16, 9599, 20, 0, 53, 68, 38, -1, 0, 29, 0, 1, 49, 0, 38, -1, 2, 0, 2796, 8, -7, 10, 9525, 52, 22, 0, 16, 9558, 20, 0, 53, 69, 38, -1, 0, 29, 2, 1, 2, 3, 42, -1, 3, 42, 68, 2, 42, -1, 2, 51, 26, 0, 3196, 20, 11, 48, 22, 0, 16, 9557, 6, 0, 3548, 8, 8, 10, 9569, 52, 22, 0, 16, 9592, 20, 0, 53, 70, 38, -1, 0, 29, 1, 1, 2, 42, 68, 2, 42, -1, 2, 7, 22, 0, 16, 9591, 6, 49, 2, 22, 0, 16, 9598, 6, 11, 38, -1, 62, 10, 0, 38, -1, 63, 10, 1, 38, -1, 64, 10, 2, 38, -1, 65, 10, 3, 38, -1, 66, 10, 10, 38, -1, 67, 10, 11, 38, -1, 68, 10, 12, 38, -1, 69, 10, 13, 38, -1, 70, 10, 20, 38, -1, 71, 10, 21, 38, -1, 72, 10, 30, 38, -1, 73, 10, 40, 38, -1, 74, 10, 41, 38, -1, 75, 10, 50, 38, -1, 76, 10, 51, 38, -1, 77, 10, 52, 38, -1, 78, 10, 53, 38, -1, 79, 10, 60, 38, -1, 80, 10, 61, 38, -1, 81, 10, 62, 38, -1, 82, 42, -1, 20, 42, -1, 13, 20, 2, 42, -1, 19, 11, 38, -1, 83, 42, -1, 21, 42, -1, 13, 20, 2, 42, -1, 19, 11, 38, -1, 84, 42, -1, 23, 42, -1, 12, 20, 2, 42, -1, 19, 11, 38, -1, 85, 42, -1, 22, 42, -1, 14, 20, 2, 42, -1, 19, 11, 38, -1, 86, 42, -1, 24, 42, -1, 17, 20, 2, 42, -1, 19, 11, 38, -1, 87, 42, -1, 25, 42, -1, 16, 20, 2, 42, -1, 19, 11, 38, -1, 88, 42, -1, 26, 42, -1, 15, 20, 2, 42, -1, 19, 11, 38, -1, 89, 42, -1, 27, 42, -1, 18, 20, 2, 42, -1, 19, 11, 38, -1, 90, 10, 1, 10, 0, 37, 38, -1, 91, 10, 1, 10, 1, 37, 38, -1, 92, 10, 1, 10, 2, 37, 38, -1, 93, 10, 1, 10, 3, 37, 38, -1, 94, 10, 1, 10, 4, 37, 38, -1, 95, 10, 1, 10, 5, 37, 38, -1, 96, 10, 1, 10, 6, 37, 38, -1, 97, 10, 1, 10, 7, 37, 38, -1, 98, 10, 1, 10, 8, 37, 38, -1, 99, 10, 0, 38, -1, 100, 10, 1, 38, -1, 101, 10, 16, 38, -1, 102, 10, 150, 10, 1e3, 3, 38, -1, 103, 10, 1, 38, -1, 104, 10, 2, 38, -1, 105, 10, 3, 38, -1, 106, 10, 4, 38, -1, 107, 10, 5, 38, -1, 108, 10, 6, 38, -1, 109, 10, 9955, 52, 22, 0, 16, 10279, 20, 0, 53, 71, 38, -1, 0, 29, 0, 1, 34, 38, -1, 2, 10, 9976, 52, 22, 0, 16, 10142, 20, 0, 53, 72, 38, -1, 0, 29, 1, 1, 2, 10, 9994, 52, 22, 0, 16, 10120, 20, 0, 53, 73, 38, -1, 0, 29, 1, 1, 2, 42, -1, 2, 0, 736, 16, -8, 7, 0, 1680, 16, 3, 41, 16, 10110, 10, 0, 38, -1, 3, 42, -1, 2, 0, 296, 16, 12, 7, 0, 4248, 20, -15, 7, 38, -1, 4, 42, -1, 3, 42, -1, 4, 18, 16, 10110, 42, -1, 2, 0, 296, 16, 12, 7, 42, -1, 3, 7, 38, -1, 5, 42, -1, 5, 0, 1032, 20, -9, 7, 0, 944, 8, 3, 48, 0, 3236, 28, -22, 7, 41, 16, 10101, 42, -1, 5, 20, 1, 42, 71, 2, 0, 1228, 48, -9, 7, 11, 26, 36, -1, 3, 0, 26, 22, 0, 16, 10041, 0, 3196, 20, 11, 48, 22, 0, 16, 10119, 6, 20, 1, 42, -1, 2, 0, 184, 16, 3, 7, 11, 26, 0, 3196, 20, 11, 48, 22, 0, 16, 10141, 6, 38, -1, 3, 0, 4500, 12, -6, 48, 15, 0, 2588, 32, -22, 41, 24, 16, 10176, 26, 0, 4500, 12, -6, 48, 0, 3040, 12, 1, 7, 15, 0, 4552, 20, -11, 41, 16, 10212, 42, -1, 3, 20, 1, 0, 3964, 76, -15, 48, 20, 2, 0, 4500, 12, -6, 48, 0, 3040, 12, 1, 7, 11, 34, 0, 4588, 16, -5, 51, 26, 22, 0, 16, 10230, 42, -1, 3, 20, 1, 0, 3964, 76, -15, 48, 5, 34, 0, 4588, 16, -5, 51, 26, 0, 124, 12, 17, 22, 1, 0, 1680, 16, 3, 22, 1, 49, 2, 0, 4412, 12, -2, 48, 0, 3536, 8, 5, 7, 20, 2, 34, 0, 4588, 16, -5, 7, 0, 3020, 16, 9, 7, 11, 26, 0, 3196, 20, 11, 48, 22, 0, 16, 10278, 6, 42, -1, 28, 0, 2200, 12, 0, 7, 0, 3380, 96, -14, 51, 26, 10, 10300, 52, 22, 0, 16, 10452, 20, 0, 53, 74, 38, -1, 0, 29, 0, 1, 49, 0, 38, -1, 2, 34, 0, 3344, 12, -7, 7, 0, 848, 4, -4, 7, 20, 1, 0, 4384, 16, 20, 48, 0, 840, 8, 15, 7, 11, 38, -1, 3, 42, -1, 3, 0, 4248, 20, -15, 7, 38, -1, 4, 10, 0, 38, -1, 5, 42, -1, 5, 42, -1, 4, 18, 16, 10444, 42, -1, 3, 42, -1, 5, 7, 38, -1, 6, 42, -1, 6, 34, 0, 3344, 12, -7, 7, 0, 3644, 24, 11, 7, 23, 16, 10435, 34, 0, 3344, 12, -7, 7, 0, 3644, 24, 11, 7, 42, -1, 6, 7, 38, -1, 7, 34, 0, 3344, 12, -7, 7, 0, 848, 4, -4, 7, 42, -1, 6, 7, 42, -1, 2, 42, -1, 7, 51, 26, 36, -1, 5, 0, 26, 22, 0, 16, 10358, 42, -1, 2, 22, 0, 16, 10451, 6, 42, -1, 28, 0, 2200, 12, 0, 7, 0, 252, 44, 13, 51, 26, 10, 10473, 52, 22, 0, 16, 10633, 20, 0, 53, 75, 38, -1, 0, 29, 1, 1, 2, 34, 0, 3344, 12, -7, 7, 0, 848, 4, -4, 7, 44, 16, 10512, 49, 0, 34, 0, 3344, 12, -7, 7, 0, 848, 4, -4, 51, 26, 34, 0, 3344, 12, -7, 7, 0, 3644, 24, 11, 7, 44, 16, 10554, 49, 0, 34, 0, 3344, 12, -7, 7, 0, 3644, 24, 11, 51, 26, 10, 0, 34, 0, 3344, 12, -7, 7, 0, 1720, 52, -20, 51, 26, 0, 2424, 40, -5, 20, 1, 42, -1, 2, 0, 2856, 76, -19, 7, 11, 38, -1, 3, 42, -1, 3, 0, 4248, 20, -15, 7, 38, -1, 4, 10, 0, 38, -1, 5, 42, -1, 5, 42, -1, 4, 18, 16, 10623, 42, -1, 3, 42, -1, 5, 7, 20, 1, 34, 0, 1112, 20, -4, 7, 11, 26, 36, -1, 5, 0, 26, 22, 0, 16, 10588, 0, 3196, 20, 11, 48, 22, 0, 16, 10632, 6, 42, -1, 28, 0, 2200, 12, 0, 7, 0, 1228, 48, -9, 51, 26, 10, 10654, 52, 22, 0, 16, 10777, 20, 0, 53, 76, 38, -1, 0, 29, 1, 1, 2, 42, -1, 2, 20, 1, 42, 0, 6, 11, 38, -1, 3, 42, -1, 3, 34, 0, 3344, 12, -7, 7, 0, 848, 4, -4, 7, 23, 44, 16, 10767, 42, -1, 2, 20, 1, 42, 0, 9, 11, 38, -1, 4, 42, -1, 4, 34, 0, 3344, 12, -7, 7, 0, 848, 4, -4, 7, 42, -1, 3, 51, 26, 34, 0, 3344, 12, -7, 7, 0, 1720, 52, -20, 7, 34, 0, 3344, 12, -7, 7, 0, 3644, 24, 11, 7, 42, -1, 3, 51, 26, 10, 1, 34, 0, 3344, 12, -7, 7, 0, 1720, 52, -20, 43, 26, 0, 3196, 20, 11, 48, 22, 0, 16, 10776, 6, 42, -1, 28, 0, 2200, 12, 0, 7, 0, 1112, 20, -4, 51, 26, 10, 10798, 52, 22, 0, 16, 11463, 20, 0, 53, 77, 38, -1, 0, 29, 1, 1, 2, 42, -1, 2, 24, 44, 16, 10819, 26, 49, 0, 30, -1, 2, 26, 49, 0, 34, 0, 3344, 12, -7, 7, 0, 3144, 16, -13, 51, 26, 42, -1, 2, 42, 0, 104, 7, 22, 0, 12, 34, 0, 3344, 12, -7, 7, 0, 3144, 16, -13, 7, 42, 0, 104, 51, 26, 42, -1, 2, 42, 0, 105, 7, 22, 0, 12, 34, 0, 3344, 12, -7, 7, 0, 3144, 16, -13, 7, 42, 0, 105, 51, 26, 42, -1, 2, 42, 0, 106, 7, 22, 0, 12, 34, 0, 3344, 12, -7, 7, 0, 3144, 16, -13, 7, 42, 0, 106, 51, 26, 42, -1, 2, 42, 0, 107, 7, 22, 0, 12, 34, 0, 3344, 12, -7, 7, 0, 3144, 16, -13, 7, 42, 0, 107, 51, 26, 42, -1, 2, 42, 0, 108, 7, 22, 0, 12, 34, 0, 3344, 12, -7, 7, 0, 3144, 16, -13, 7, 42, 0, 108, 51, 26, 42, -1, 2, 42, 0, 109, 7, 22, 0, 12, 34, 0, 3344, 12, -7, 7, 0, 3144, 16, -13, 7, 42, 0, 109, 51, 26, 20, 0, 0, 816, 12, 10, 48, 0, 4268, 8, -4, 7, 11, 34, 0, 3344, 12, -7, 7, 0, 1784, 16, 4, 51, 26, 20, 0, 34, 0, 3380, 96, -14, 7, 11, 26, 0, 4412, 12, -2, 48, 0, 3536, 8, 5, 7, 20, 1, 34, 0, 1228, 48, -9, 7, 11, 26, 34, 0, 3344, 12, -7, 7, 0, 4040, 20, -10, 7, 22, 0, 41, 16, 11439, 0, 4412, 12, -2, 48, 0, 3536, 8, 5, 7, 20, 1, 32, 5, 38, -1, 3, 42, 0, 88, 0, 448, 12, 19, 42, 0, 109, 20, 3, 42, 0, 88, 0, 2940, 28, -19, 42, 0, 109, 20, 3, 42, 0, 89, 0, 1104, 8, -5, 42, 0, 108, 20, 3, 42, 0, 87, 0, 2632, 52, -19, 42, 0, 107, 20, 3, 42, 0, 87, 0, 3720, 24, 21, 42, 0, 107, 20, 3, 42, 0, 87, 0, 2932, 8, 5, 42, 0, 107, 20, 3, 42, 0, 87, 0, 3300, 12, 3, 42, 0, 107, 20, 3, 42, 0, 85, 0, 1168, 16, 11, 42, 0, 106, 20, 3, 42, 0, 85, 0, 1856, 16, 21, 42, 0, 106, 20, 3, 42, 0, 85, 0, 2492, 16, -4, 42, 0, 106, 20, 3, 42, 0, 86, 0, 1280, 28, -12, 42, 0, 105, 20, 3, 42, 0, 86, 0, 1380, 12, 7, 42, 0, 105, 20, 3, 42, 0, 84, 0, 2568, 12, -4, 42, 0, 104, 20, 3, 42, 0, 84, 0, 1056, 36, -13, 42, 0, 104, 20, 3, 42, 0, 83, 0, 1188, 40, -13, 42, 0, 104, 20, 3, 42, 0, 84, 0, 1308, 20, -8, 42, 0, 104, 20, 3, 42, 0, 90, 0, 2700, 24, 21, 42, 0, 104, 20, 3, 42, 0, 90, 0, 320, 44, -15, 42, 0, 104, 20, 3, 42, 0, 90, 0, 3160, 24, 9, 42, 0, 104, 20, 3, 20, 19, 38, -1, 4, 42, -1, 4, 0, 4248, 20, -15, 7, 38, -1, 5, 10, 0, 38, -1, 6, 42, -1, 6, 42, -1, 5, 18, 16, 11425, 42, -1, 4, 42, -1, 6, 7, 38, -1, 7, 42, -1, 7, 10, 1, 7, 38, -1, 8, 34, 0, 3344, 12, -7, 7, 0, 3144, 16, -13, 7, 42, -1, 7, 10, 0, 7, 7, 22, 1, 41, 16, 11416, 22, 1, 34, 0, 1876, 24, 17, 7, 42, -1, 8, 20, 2, 42, -1, 7, 10, 2, 7, 11, 42, -1, 8, 20, 3, 42, -1, 3, 0, 3556, 40, 22, 7, 11, 26, 36, -1, 6, 0, 26, 22, 0, 16, 11330, 22, 1, 34, 0, 3344, 12, -7, 7, 0, 4040, 20, -10, 51, 26, 22, 1, 34, 0, 3344, 12, -7, 7, 0, 3356, 16, 16, 51, 26, 0, 3196, 20, 11, 48, 22, 0, 16, 11462, 6, 42, -1, 28, 0, 2200, 12, 0, 7, 0, 3144, 16, -13, 51, 26, 10, 11484, 52, 22, 0, 16, 11541, 20, 0, 53, 78, 38, -1, 0, 29, 0, 1, 34, 0, 4588, 16, -5, 7, 16, 11517, 20, 0, 34, 0, 4588, 16, -5, 7, 0, 4656, 16, -4, 7, 11, 26, 22, 0, 34, 0, 3344, 12, -7, 7, 0, 3356, 16, 16, 51, 26, 0, 3196, 20, 11, 48, 22, 0, 16, 11540, 6, 42, -1, 28, 0, 2200, 12, 0, 7, 0, 4648, 8, 12, 51, 26, 10, 11562, 52, 22, 0, 16, 11718, 20, 0, 53, 79, 38, -1, 0, 29, 0, 1, 49, 0, 38, -1, 2, 34, 0, 3344, 12, -7, 7, 0, 4480, 20, 14, 7, 20, 1, 0, 4384, 16, 20, 48, 0, 840, 8, 15, 7, 11, 38, -1, 3, 42, -1, 3, 0, 4248, 20, -15, 7, 38, -1, 4, 10, 0, 38, -1, 5, 42, -1, 5, 42, -1, 4, 18, 16, 11679, 42, -1, 3, 42, -1, 5, 7, 38, -1, 6, 20, 0, 34, 0, 3344, 12, -7, 7, 0, 4480, 20, 14, 7, 42, -1, 6, 7, 0, 1092, 12, -3, 7, 11, 42, -1, 2, 42, -1, 6, 51, 26, 36, -1, 5, 0, 26, 22, 0, 16, 11620, 34, 0, 3344, 12, -7, 7, 0, 1784, 16, 4, 7, 20, 0, 34, 0, 252, 44, 13, 7, 11, 42, -1, 2, 20, 0, 34, 0, 764, 52, 7, 7, 11, 20, 4, 22, 0, 16, 11717, 6, 42, -1, 28, 0, 2200, 12, 0, 7, 0, 1092, 12, -3, 51, 26, 10, 11739, 52, 22, 0, 16, 11775, 20, 0, 53, 80, 38, -1, 0, 29, 2, 1, 2, 3, 42, -1, 3, 34, 0, 1480, 32, -14, 7, 42, -1, 2, 51, 26, 0, 3196, 20, 11, 48, 22, 0, 16, 11774, 6, 42, -1, 28, 0, 2200, 12, 0, 7, 0, 3288, 12, 17, 51, 26, 10, 11796, 52, 22, 0, 16, 11839, 20, 0, 53, 81, 38, -1, 0, 29, 0, 1, 49, 0, 34, 0, 1480, 32, -14, 51, 26, 49, 0, 34, 0, 3344, 12, -7, 7, 0, 4480, 20, 14, 51, 26, 0, 3196, 20, 11, 48, 22, 0, 16, 11838, 6, 42, -1, 28, 0, 2200, 12, 0, 7, 0, 16, 16, 18, 51, 26, 10, 11860, 52, 22, 0, 16, 12284, 20, 0, 53, 82, 38, -1, 0, 29, 2, 1, 2, 3, 34, 0, 3344, 12, -7, 7, 0, 3356, 16, 16, 7, 22, 0, 41, 16, 11893, 47, 22, 0, 16, 12283, 4, 12254, 10, 10, 42, -1, 2, 20, 2, 0, 2816, 16, -10, 48, 11, 30, -1, 2, 26, 42, -1, 3, 0, 4248, 20, -15, 7, 10, 1, 25, 38, -1, 4, 42, -1, 3, 42, -1, 4, 7, 38, -1, 5, 42, -1, 3, 42, -1, 3, 0, 4248, 20, -15, 7, 10, 2, 25, 7, 38, -1, 6, 34, 0, 3344, 12, -7, 7, 0, 4480, 20, 14, 7, 42, -1, 2, 7, 44, 16, 12003, 42, 0, 103, 42, 0, 102, 20, 2, 19, 0, 3052, 16, 15, 7, 5, 34, 0, 3344, 12, -7, 7, 0, 4480, 20, 14, 7, 42, -1, 2, 51, 26, 42, -1, 2, 42, 0, 73, 13, 24, 16, 12021, 26, 42, -1, 2, 42, 0, 74, 18, 16, 12081, 42, -1, 3, 10, 2, 7, 38, -1, 7, 42, -1, 7, 34, 0, 3344, 12, -7, 7, 0, 848, 4, -4, 7, 42, -1, 6, 51, 26, 42, -1, 3, 10, 4, 7, 42, -1, 3, 10, 3, 7, 42, -1, 3, 10, 1, 7, 42, -1, 3, 10, 0, 7, 20, 4, 30, -1, 3, 26, 42, -1, 3, 0, 4248, 20, -15, 7, 10, 1, 25, 30, -1, 4, 26, 42, -1, 3, 42, -1, 4, 7, 34, 0, 3344, 12, -7, 7, 0, 1784, 16, 4, 7, 25, 42, -1, 3, 42, -1, 4, 51, 26, 42, -1, 3, 0, 4248, 20, -15, 7, 10, 2, 25, 38, -1, 8, 34, 0, 3344, 12, -7, 7, 0, 3644, 24, 11, 7, 42, -1, 6, 7, 38, -1, 9, 42, -1, 9, 42, -1, 3, 42, -1, 8, 51, 26, 34, 0, 3344, 12, -7, 7, 0, 848, 4, -4, 7, 42, -1, 6, 7, 38, -1, 10, 42, -1, 10, 44, 16, 12195, 47, 22, 0, 16, 12283, 42, -1, 10, 10, 0, 7, 38, -1, 11, 42, -1, 11, 42, 0, 60, 41, 16, 12218, 47, 22, 0, 16, 12283, 42, -1, 3, 42, -1, 5, 20, 2, 34, 0, 3344, 12, -7, 7, 0, 4480, 20, 14, 7, 42, -1, 2, 7, 0, 2332, 24, -15, 7, 11, 26, 9, 12250, 22, 0, 16, 12274, 38, -1, 12, 42, -1, 12, 0, 548, 44, -18, 20, 2, 19, 0, 3072, 64, -16, 7, 11, 26, 0, 3196, 20, 11, 48, 22, 0, 16, 12283, 6, 42, -1, 28, 0, 2200, 12, 0, 7, 0, 1876, 24, 17, 51, 26, 10, 12305, 52, 22, 0, 16, 12343, 20, 0, 53, 83, 38, -1, 0, 29, 2, 1, 2, 3, 42, -1, 3, 42, -1, 2, 20, 2, 34, 0, 1876, 24, 17, 7, 11, 26, 0, 3196, 20, 11, 48, 22, 0, 16, 12342, 6, 42, -1, 28, 0, 2200, 12, 0, 7, 0, 1360, 20, 21, 51, 26, 10, 12364, 52, 22, 0, 16, 12509, 20, 0, 53, 84, 38, -1, 0, 29, 0, 1, 10, 0, 38, -1, 2, 34, 0, 3344, 12, -7, 7, 0, 3144, 16, -13, 7, 38, -1, 3, 42, -1, 3, 42, 0, 104, 7, 16, 12411, 10, 1, 10, 0, 37, 21, -1, 2, 26, 42, -1, 3, 42, 0, 105, 7, 16, 12429, 10, 1, 10, 1, 37, 21, -1, 2, 26, 42, -1, 3, 42, 0, 106, 7, 16, 12447, 10, 1, 10, 2, 37, 21, -1, 2, 26, 42, -1, 3, 42, 0, 107, 7, 16, 12465, 10, 1, 10, 3, 37, 21, -1, 2, 26, 42, -1, 3, 42, 0, 108, 7, 16, 12483, 10, 1, 10, 4, 37, 21, -1, 2, 26, 42, -1, 3, 42, 0, 109, 7, 16, 12501, 10, 1, 10, 5, 37, 21, -1, 2, 26, 42, -1, 2, 22, 0, 16, 12508, 6, 42, -1, 28, 0, 2200, 12, 0, 7, 0, 764, 52, 7, 51, 26, 20, 0, 42, -1, 28, 5, 38, -1, 110, 0, 1900, 300, -17, 20, 0, 42, -1, 33, 11, 10, 1, 27, 20, 0, 42, -1, 31, 11, 10, 1, 27, 20, 0, 42, -1, 29, 11, 20, 6, 38, -1, 111, 35, 10, 12573, 52, 22, 0, 16, 12588, 20, 0, 53, 85, 26, 29, 0, 0, 20, 0, 42, 0, 32, 11, 6, 35, 10, 12596, 52, 22, 0, 16, 12611, 20, 0, 53, 86, 26, 29, 0, 0, 20, 0, 42, 0, 30, 11, 6, 35, 20, 5, 38, -1, 112, 20, 0, 10, 0, 8, 20, 0, 20, 3, 38, -1, 113, 42, -1, 110, 0, 720, 4, 2, 33, 42, -1, 49, 0, 1872, 4, -4, 33, 42, -1, 38, 0, 2484, 8, -13, 33, 42, -1, 39, 0, 4572, 16, -11, 33, 42, -1, 38, 0, 4172, 28, 7, 33],
                _pT0dc: atob("SlVNeUpUZzNKVU15SlRnMkpUWXdVMkZUWWpKUFlrOD1XaVV6Um0wbE5qQnNaQ1V6UXlFPUpUZEdKVU15SlRnMEpVTXlKVGcwSlRkQ0pVTXlKVGc0YWlVM1FpVkRNaVU0UlNWRE1pVTRRUT09U21scmN5VTNRbmhwYTIwPVltUlJZMkZVVkE9PVFpVTNRaVZETWlVNE55VkRNaVU0TUNVM1JrSjFKVU15SlRneWR5VkRNaVU0UXc9PVkyeHZRaVUxUlNVMk1HVT1KVU15SlRneGNpVkRNaVU0TkNWRE1pVTROQ1ZETWlVNE9DVkRNaVU0TUNWRE1pVTRNM1U9V2xobk9TVTJNRVpuVkdkWVNpVTFRMmNsTlVJbE0wTmhWeVUxUTFaWVpnPT1WVmhZV1ZoQ1kxaFpadz09WldKMVlnPT1KVGRHZm5nbE4wUWxReklsT0ROMEpVTXlKVGd4SlRkRGZpVkRNaVU0TlhRPUpVTXlKVGcxZUhSM1lpVkRNaVU0TVNVM1JpVkRNaVU0UXc9PWVYY2xReklsT0RaZmQzTWxReklsT0RCaWR5VkRNaVU0TkNVM1FpVkRNaVU0TVhZPUpUVkVUaVUyTUdGU0pVTXlKVGd5SlVNeUpUZzBKVU15SlRnNWZpVkRNaVU0TkNWRE1pVTRNdz09WVdZbE5VTWxOVVJ3UnlVMVJRPT1ZMkZ3UVhKaGFuQWxNMFpySlRZd1lRPT1WQ1UxUWw4bFF6SWxPREVsUXpJbE9EWWxOMElsUXpJbE9ERWxReklsT0RBPUpVTXlKVGcxZmlVM1FuVjNabGxsYVNVMVJHWlpXQT09SlVNeUpUZ3djbmx5Y0NWRE1pVTRNWFlsTjBNbE4wSWxOakFsUXpJbE9ERnVKVGRHSlVNeUpUZ3hmaVUzUmlVM1JIUjVjblJ4SlVNeUpUZzBKMkk9SlVNeUpUZzJkMzQ9SlRZd0pUWXdZMXBZV2w4PUpUZERKVU15SlRneGVHMD1TVTloVWxsSlR3PT1XQ1UxUldjbE5VTm9KVFZFSlRWRkpUTkRhR2RmWWlVMk1FMW9KVE5DWW0xZlpWb2xOakJzSlROQlYyb2xOVUk9SlRZd1dtWm1XZz09SlRWRFZtcGthbkU9SlRWQ0pUWXdZV1FsTlVOR1p5VTFReVUxUkdzPUpUZERjWDV5SlRkQ2ZubHRlbTl4Wm1ob2FuRnFkMlo1Ym5SekpUZEdjQ1ZETWlVNE15VTNSbXdsTjBSd2JBPT1TMnhoWWc9PVl5VTFRMjRsTkRCeEpUWXdhVzg9WVdOV1p5VTFSU1UyTUdWYUpUWXdYdz09SlRGRFlTVkRNaVU0TXlWRE1pVTRNSDU2SlVNeUpUZzBkZz09ZDNodGJpVTFSQ1ZETWlVNE1ubHVZbXM9ZWlVM1F5VkRNaVU0TWlWRE1pVTRNSElsUXpJbE9ESWxOMFE9YW1oM1IyUjNaQT09Ym5OMWVuaz1aV2hvU25OMmNVbHdhWEZwY25nPUpVTXlKVGd3SlRkRWR3PT1VMTlZVjFCM2NIaHdlU1UzUmc9PWFXUnFXQ1UxUkZwaldRPT1ZbEU9ZWlVM1F5VkRNaVU0TWlWRE1pVTRNSEo2SlRkREpVTXlKVGd6Y2c9PWVXb2xOMElsTjBOdVYyNGxReklsT0RCUGVDVTNRblpPZFc1MmJuY2xOMFFsTjBNPVlXSnpkM0VsUXpJbE9EVndKVGRDSlVNeUpUZ3plZz09ZFhjbE4wUWxOMEp0YkhjbE4wWjJmZz09WHlVMVFsQlNWRmNsTlVVbE5VSlRWR0U9Wm1KbkpUVkNKVFl3SlRWRlV6QmhVRmxmWkNVMVJYSnVhUT09SlVNeUpUZ3djbmR0ZUNWRE1pVTRNR0k9Ym5rbFF6SWxPREZZY2lWRE1pVTROZz09WjI4PWRIVnFhMVJuYzJzPWFXaGlaMjBsTlVWclFpVTFSQT09TFE9PWJTVTNRbThsTjBOM2RITWxReklsT0RFbFF6SWxPREk9Y0hsMkpUZEVieVUzUTI0bE4wWnhVVzRsUXpJbE9ERnVKVEpHSlRKR0tpVTFRaVUwTUdsa0pUTkVKVEl5SlRkRGVpVkRNaVU0T1ZZbFF6SWxPRGtsUXpJbE9Ea2xReklsT0RkK2R5VkRNaVU0UVNWRE1pVTRPWG89WDJnbE5VUnZidz09Y2lWRE1pVTRNeVZETWlVNE1HOGxReklsT0RKM0pUZEVKVGRESlRZd1pXWnBZVWxtY0hFPVVtVm5SWGh3VjJobUpUWXdKVE5HV1cwPWVpVkRNaVU0TVhNbE4wTjFKVU15SlRnM0pUZERjeVUzUkNWRE1pVTRNbmg1SlVNeUpUaERjWGx0ZFhnPWVYQT1ibUZmYTI0bE5qQlFaV2xoYWc9PWJuRmxZM1pyY1hBPUpVTXlKVGc1SlVNeUpUZzFKVU15SlRoQ0pVTXlKVGc0ZVNVM1FnPT1YMW9sTmpCT1UxaGFZVkE9Y1E9PVRtRlVVaVUxUldGVE5HVlVKVFZFWXc9PWRtUWxReklsT0RBbE5VSWxReklsT0VJbE4wTnFZV2RVWDJ0RGFtSkZkV2xFV21SNEpVTXlKVGd6SlVNeUpUaENaWFJUUjNKRkpVTXlKVGhCSlVNeUpUZzFKVU15SlRnM1ZsZEVVa1ZhUW5KaVdubG9aM0pJSlRWRWRrVWxOME1sTlVVbE5VTWxOREFsUXpJbE9EWlNSaVUzUmlVM1JIZEVaeVZETWlVNE15VTFSWGNsTmpCMkpUZERKVU15SlRnNGVXSllkbXRaSlVNeUpUZzNKVGRDSlVNeUpUZ3pWU1UzUkVSQkpVTXlKVGd5VW5SNEpUZEdTR0VsUXpJbE9EWjVkM1ppUXlWRE1pVTRNbDhsUXpJbE9EZ2xOakFsUXpJbE9EUmhSRlpxVkhST2NISnZkRzkwZVhCbFRFOGxOVVZMZFE9PWVDVkRNaVU0TVg1NkpVTXlKVGd6SlVNeUpUZzViUT09SlRWRVkyd2xOVVFsTTBOdkpUWXdKVFl3U205dFlnPT1aZz09SlVNeUpUZzJkeVZETWlVNE9DVTNRaVZETWlVNE5DVkRNaVU0UVE9PUpUZEdKVU15SlRnMEpVTXlKVGd5ZHc9PUpUZEdKVGRHSlRJMmRtOGxReklsT0RGUEpVTXlKVGd5SlVNeUpUZ3lKVU15SlRnd2QzQWxReklsT0RNbFF6SWxPREp6Ym5OMWVua3hKVEkxZUdweGFtaDVNU1V5TlhscUpUZEVlV1ozYW1ZPVdGSm1KVE5DWWxvPUpUTkZVbVZaSlVNeUpUZ3dlSE41WjJ4M2VHVjJlQT09ZEc5MVkyZz1JV0ZrZFhkcWVIaDZkMm89Y1dOb0pUVkZhWEZTSlRkRGZpVkRNaVU0TkNWRE1pVTRNblE9YUdad1ozQnRaMjg9SlVNeUpUZzVKVU15SlRnMWVDVkRNaVU0TUNVM1Fua2xReklsT0VFPWFHTmhjSFJqYUdFPUpVTXlKVGd3SlVNeUpUZ3lKVU15SlRnNEpVTXlKVGcyZUNVM1JuaDBKVU15SlRnNWVBPT1KVFZFVldSUkpUTkNWV2s9SlRWQ1dsUlpYMUFsTlVRbE5qQWxOVUk9YUNVMk1HNXVKVFZEWWlVMk1BPT1KVFZGWkZsc2NubCtkQT09WTJSMWFHSmtiRzV6YUc1dEpUZEVjU1ZETWlVNE1BPT1aUT09ZW13bE4wST1KVE5CWTJsYVp3PT1lbXNsTjBNbE4wUnZVM2grYUdaMVJIQmliV1owWkdabFJuZG1iM1YwSlVNeUpUZzBKVU15SlRnNGVDVkRNaVU0TlNWRE1pVTRRMlo0SlRkR2VIWWxReklsT0RjbFF6SWxPRElsUXpJbE9EVlVKVGRHSlRkR0pUVkVaM0J0ZGlWRE1pVTRNaVZETWlVNE15VkRNaVU0UXc9PVZrOD1KVGRHZDM0bE4wUjBmbXR4V0d0M2J3PT1UMkpoWVNVMVF5VTFRZz09WTFnbE5VTlVabGxxSlRWRGFXMGxOVU09ZEE9PVltNXRjbk54ZEdKelJWb2xOVVZXTTJaWFYxWmpibVU9SlVNeUpUZ3pkWDRsUXpJbE9EUWxReklsT0RJbFF6SWxPRGxWSlVNeUpUZ3lKVU15SlRneUpUZEdKVU15SlRneVlTVTFRbTg9SlRkR2NuQWxOME1sTjBaeFoyWWxOakJsYXlVMVEya2xOVUptYm1VPWNHdHhYMlJoYnc9PWFtTlpXaVUxUWlVMVJXTmFXUT09Y0dGdmNBPT1URmNsTlVKVFRBPT1KVFZDWWlVMVFtTWxOVUprYW5Wa1pWb2xOVUk9SlRWRlp5VTFRMjV1U1NVMVEyZ2xOakE9WWxSak0xQmpVQT09WTJ3bE5qQnljQT09ZUdrPVZYWWxOMFIySlVNeUpUZzFkZz09SlRWRkpUVkNlaVUzUW1nbE4wSnNZbFZUWDJKVVdTVTFSVmM9SlROR1NFUkRkeVUzUTNjbFF6SWxPRElsTlVJbFF6SWxPRE1sUXpJbE9ESnZKVU15SlRneWR5VTNSQ1UzUXlVMVJIQWxReklsT0RGekpVTXlKVGd3SlVNeUpUZzBjeVZETWlVNE1BPT1RVjl1Y1VwdFlXaz1lR3B2WlhCNGZpVTNSSGNsTjBNbFF6SWxPREp6SlVNeUpUZ3dZaVZETWlVNE4zNXpKVFZFYWw5MFltOXdYeVUxUkd3PVMwNU9KVEpHSlRZd1QxZ2xOVVUyVXlVMVJDVTFSVTlZVHlVMVF3PT1kQ1UzUW5Ob2EzZz1kM1I2YzJrPUpVTXlKVGd6ZENWRE1pVTROeVZETWlVNE13PT1KVFZDWWxRbE5VUldhQ1UxUkZSaVZtVT1VaVUxUTA5UVpXWT1lV1J2ZUdnPUpUZEVKVU15SlRnMGNTVkRNaVU0TW5kMUpVTXlKVGcwV0ZvbE5qQWxOVVZRVUZsZlVDVTFSQT09SlRWRlR3PT1lSElsUXpJbE9EWWxOMFFsTjBaeUpVTXlKVGd3SlVNeUpUZ3dSSFJ4ZVhWbmRBPT1hbWx0YmtkZmJXMGxOVUpoWHc9PU9VVWxNMFVsTTBSRlZtbGxNbU5XVWpZbE5VUldKVFZGVmw5bEpUZEViMzRsTlVWemQyOTVKVGRHZmc9PWFHc2xOVVFsTmpCUVpXbGhkM0p6SlRkREpVTXlKVGd5ZDNSM2N5VkRNaVU0TUE9PVdVeFlVQT09YTNCNmFHbHpiR3M9Wm5Sd2VpVTFRM0FsTjBZPUpUVkRKVU15SlRnMEpVTXlKVGd6Y0NWRE1pVTRNM2grSlRkRUpUVkZjU1ZETWlVNE1uUWxReklsT0RFbFF6SWxPRFYwSlVNeUpUZ3hjM2h6ZmlVMVEyOXRlU1UzUTI0PWVXNXZiSHBSYXlVM1JnPT1lblVsTjBKcGJtbG5kR2xyY2c9PVJsSkxTa2RzYm5OeVEycGphMk5zY2c9PVZGSmhNaVUxUW1GZlZsSWxOakFsTWtabVFXWWxOVVJTWTJoaGJtZGxaRlJ2ZFdOb1pYTT1iRzRsTlVKbVltMU5hRUpuYkdrbE5VVmtiUT09SlVNeUpUZzBkU1ZETWlVNE5ua2xReklsT0RJbFF6SWxPRGhpSlVNeUpUZ3plSGs9SlRkQ2RDVTNSSFlsUXpJbE9ETjNjbk1sTjBJPWJpVTJNR2NsTmpBbE5VVnZaR3BwSlRRd2FWOD1hMmdsTjBKb2Vtd2xOMEk9ZW5jbE4wTnBKVGREY1hkMldta2xOME50ZUNWRE1pVTRNWDU2SlVNeUpUZ3pKVU15SlRnNWJnPT1jSG89Y0E9PUpUTkNUbFpSVHlVMk1BPT1jR3M9WldaM2FtUm1abkZsZDI5bmNIWT1Sdz09ZEdjbE4wTnZiV2Q2YjNWMFdHSXlKVFZGSlRWRVkxUWxOVVJqTkZOWVkxQlJKVFZDVkE9PVppVTFRbDlYTkdkWVdGZGtaUT09V0d0c2NtdHBlZz09WVE9PWFHRT1aVmRUWkZWYVZRPT1VR0ZRV1Y4dVdsb2xOVVJQSlRWRmNTVkRNaVU0TUhsdUpUZEdkSHA1ZmlVM1Jtd2xOMFFsTjBZPVpIUm5lR3AzSlRkQ2FuYz1KVU15SlRneEpUZERXU1UzUXlWRE1pVTROSElsTjBaUWJpVkRNaVU0TUhJPVoyaGpaQT09YUcxM1ozTnljbWxuZUE9PQ==")
            };
            function e(t) {
                for (; t._7rqA3K !== t._1WwRqdliG;) {
                    var e = t._v1GqXmT5[t._7rqA3K++];
                    t._lh1U[e](t);
                }
            }
            t._1WwRqdliG = t._v1GqXmT5.length;
            e(t);
            return t._RAeEtcCud;
        }();
        ei.s;
        ii = ei.m;
        ni = ei.b;
        ri = ei.start;
    } catch (Fo) {
        Et("ob-error", "error", "api", {
            message: Fo.message
        });
        function si() {}
        (function () {
            return Promise.resolve();
        });
        ii = {
            record: si,
            resetData: si,
            setData: si,
            stop: si,
            circBuffPush: si
        };
        ni = {
            record: si,
            stop: si
        };
        ri = si;
    }
    function ai(t) {
        t = t || {};
        this.x = t.x || 0;
        this.y = t.y || 0;
        this.rotate = this.rotate.bind(this);
        this.getDistance = this.getDistance.bind(this);
        this.radius = 0;
        this.tolerance = 0;
        this.fill = !1;
        this.stroke = !1;
        this.fillColor = "#fff";
        this.strokeColor = "#fff";
        this.strokeWidth = 1;
    }
    function li(t, e, i) {
        le.self(this, ai, t);
        this.handleIn = new ai(e);
        this.handleOut = new ai(i);
        this.prev = null;
        this.next = null;
        this.index = 0;
    }
    function ci(t) {
        this._closed = !1;
        this.stroke = !1;
        this.fill = !1;
        this.fillColor = "#fff";
        this.strokeColor = "#fff";
        this.strokeWidth = 1;
        this.showPoints = !1;
        this.pointRadius = 0;
        this._head = null;
        this._tail = null;
        this.segments = [];
        this.addPoint = this.addPoint.bind(this);
        this.removePoint = this.removePoint.bind(this);
        this.forEachPoint = this.forEachPoint.bind(this);
        this.getBounding = this.getBounding.bind(this);
        this.getCenter = this.getCenter.bind(this);
        this.destroy = this.destroy.bind(this);
        t && t.length && this.addPoints(t);
    }
    function hi(t, e) {
        if (e.y <= t.y) {
            if (e.next.y > t.y && ui(e, e.next, t) > 0) {
                return 1;
            }
        } else {
            if (e.next.y <= t.y && ui(e, e.next, t) < 0) {
                return -1;
            }
        }
        return 0;
    }
    function ui(t, e, i) {
        return (e.x - t.x) * (i.y - t.y) - (i.x - t.x) * (e.y - t.y);
    }
    function fi(t) {
        le.self(this, ci);
        this.bounding = {
            left: 0,
            top: 0,
            width: 0,
            height: 0
        };
        this.svgData = function (t) {
            if ("string" != typeof t) {
                return null;
            }
            var e = decodeURIComponent(t);
            var i = e.indexOf('d="') + 3;
            var n = e.indexOf('"', i);
            var r = t.slice(i, n);
            var o = function (t) {
                var e = 0;
                var i = 0;
                var n = 0;
                var r = 0;
                var o = t.match(/<svg[^>]*width=['"]([^'"]+)['"]/);
                var s = t.match(/<svg[^>]*height=['"]([^'"]+)['"]/);
                if (o && s && (n = parseFloat(o[1]), r = parseFloat(s[1]), !isNaN(n) && !isNaN(r))) {
                    return {
                        left: e,
                        top: i,
                        width: n,
                        height: r
                    };
                }
                var a = t.match(/<svg[^>]*viewBox=['"]([^'"]+)['"]/);
                if (a) {
                    var l = a[1].split(" ");
                    e = parseFloat(l[0]);
                    i = parseFloat(l[1]);
                    n = parseFloat(l[2]);
                    r = parseFloat(l[3]);
                    if (!(isNaN(e) || isNaN(i) || isNaN(n) || isNaN(r))) {
                        return {
                            left: e,
                            top: i,
                            width: n,
                            height: r
                        };
                    }
                }
                return {
                    left: 0,
                    top: 0,
                    width: 0,
                    height: 0
                };
            }(e);
            return {
                pathCommands: pi(r),
                viewport: o
            };
        }(t);
        this.svgData && (this.bounding.width = this.svgData.viewport.width, this.bounding.height = this.svgData.viewport.height);
    }
    function pi(t) {
        for (var e = t.match(/[a-df-zA-DF-Z][^a-df-zA-DF-Z]*/g) || [], i = [], n = 0; n < e.length;) {
            for (var r = e[n], o = r[0], s = r.slice(1).trim().split(/[\s,]+/), a = [], l = 0; l < s.length;) {
                a.push(parseFloat(s[l]));
                l++;
            }
            i.push({
                type: o,
                params: a
            });
            n++;
        }
        return i;
    }
    ai.prototype.rotate = function (t, e) {
        var i = Nt(e);
        var n = Math.sin(i);
        var r = Math.cos(i);
        var o = this.x - t.x;
        var s = this.y - t.y;
        this.x = o * r - s * n + t.x;
        this.y = o * n + s * r + t.y;
    };
    ai.prototype.getDistance = function (t) {
        return Math.sqrt(Math.pow(this.x - t.x, 2) + Math.pow(this.y - t.y, 2));
    };
    ai.prototype.getAngle = function (t) {
        var e = t.x - this.x;
        var i = t.y - this.y;
        var n = Dt(Math.atan2(i, e));
        n < 0 && (n += 360);
        return n;
    };
    ai.prototype.hitTest = function (t) {
        return this.radius + this.tolerance >= this.getDistance(t);
    };
    ai.prototype.restrict = function (t, e, i, n) {
        if ("x" !== t && "y" !== t) {
            throw new Error("Point.restrict requires a value: x or y");
        }
        e + this[t] < i ? e = this[t] - i : e + this[t] > n && (e = n - this[t]);
        return this[t] + e;
    };
    ai.prototype.draw = function (t) {
        t.ctx.beginPath();
        t.ctx.arc(this.x, this.y, this.radius / t.scale, 0, 2 * Math.PI, !1);
        this.fill && (t.ctx.fillStyle = this.fillColor, t.ctx.fill());
        this.stroke && (t.ctx.strokeStyle = this.strokeColor, t.ctx.lineWidth = this.strokeWidth / t.scale, t.ctx.stroke());
    };
    le.proto(li, ai);
    li.prototype.set = function (t, e, i) {
        this.x = t.x || this.x;
        this.y = t.y || this.y;
        e === undefined ? (this.handleIn.x = this.x, this.handleIn.y = this.y) : (this.handleIn.x = e.x, this.handleIn.y = e.y);
        i === undefined ? (this.handleOut.x = this.x, this.handleOut.y = this.y) : (this.handleOut.x = i.x, this.handleOut.y = i.y);
    };
    li.prototype.clone = function () {
        var t = {
            x: this.x,
            y: this.y
        };
        var e = {
            x: this.handleIn.x,
            y: this.handleIn.y
        };
        var i = {
            x: this.handleOut.x,
            y: this.handleOut.y
        };
        var n = new li();
        e.x === i.x && e.y === i.y ? n.set(t) : n.set(t, e, i);
        n.index = this.index;
        n.prev = this.prev;
        n.next = this.next;
        n.radius = this.radius;
        n.tolerance = this.tolerance;
        n.fill = this.fill;
        n.stroke = this.stroke;
        n.fillColor = this.fillColor;
        n.strokeColor = this.strokeColor;
        n.strokeWidth = this.strokeWidth;
        return n;
    };
    li.prototype.move = function (t, e) {
        this.x += t;
        this.y += e;
        this.handleIn.x += t;
        this.handleIn.y += e;
        this.handleOut.x += t;
        this.handleOut.y += e;
    };
    li.prototype.render = function (t) {
        this.handleIn.x !== this.x && this.handleIn.y !== this.y && this.handleIn.draw(t);
        this.handleOut.x !== this.x && this.handleOut.y !== this.y && this.handleOut.draw(t);
        this.draw(t);
    };
    ci.prototype.addPoint = function (t) {
        var e;
        t instanceof li ? e = t.clone() : ((e = new li()).set(t), e.radius = this.pointRadius);
        e.index = this.segments.length;
        null === this._head ? (this._head = e, this._tail = e) : (e.prev = this._tail, this._tail.next = e, this._tail = e);
        this._head.prev = this._tail;
        this._tail.next = this._head;
        this.segments.push(e);
        return e;
    };
    ci.prototype.addPoints = function (t) {
        for (var e = 0; e < t.length; e++) {
            this.addPoint(t[e]);
        }
        t = null;
    };
    ci.prototype.setPoints = function (t, e) {
        e === undefined && (e = 0);
        for (var i = e; i < t.length; i++) {
            this.segments[i] === undefined ? this.addPoint(t[i]) : this.segments[i].set(t[i]);
        }
        t = null;
        e = null;
    };
    ci.prototype.setPointRadius = function (t) {
        for (var e = -1; ++e < this.segments.length;) {
            undefined.radius = t;
        }
    };
    ci.prototype.removePoint = function (t) {
        for (var e = this.segments.length, i = null; --e > -1 && null === i;) {
            i = this.segments[e];
            t.x === i.x && t.y === i.y && (this.segments.splice(e, 1), i === this._head && i === this._tail ? (this._head = null, this._tail = null) : i === this.head ? (this._head = this._head.next, this._head.prev = null) : i === this._tail ? (this._tail = this._tail.prev, this._tail.next = null) : (i.prev.next = i.next, i.next.prev = i.prev));
        }
        return i;
    };
    ci.prototype.forEachPoint = function (t, e) {
        if (0 !== this.segments.length && this.segments) {
            for (var i, n = !1, r = this.segments.length; --r > -1 && !n;) {
                i = this.segments[e ? this.segments.length - 1 - r : r];
                t && (n = t(i));
            }
        }
    };
    ci.prototype.close = function (t) {
        this._closed = t;
    };
    ci.prototype.isClosed = function () {
        return this._closed;
    };
    ci.prototype.start = function () {
        return this._head;
    };
    ci.prototype.end = function () {
        return this._tail;
    };
    ci.prototype.rotate = function (t, e) {
        e === undefined && (e = this.getCenter());
        for (var i, n = -1; ++n < this.segments.length;) {
            (i = this.segments[n]).handleIn.rotate(e, t);
            i.rotate(e, t);
            i.handleOut.rotate(e, t);
        }
    };
    ci.prototype.move = function (t, e) {
        for (var i = -1; ++i < this.segments.length;) {
            this.segments[i].move(t, e);
        }
    };
    ci.prototype.getPoint = function (t) {
        return this.segments[t];
    };
    ci.prototype.getLength = function () {
        return this.segments.length;
    };
    ci.prototype.getCenter = function () {
        var t = this.getBounding();
        return {
            x: (t.right - t.left) / 2 + t.left,
            y: (t.bottom - t.top) / 2 + t.top
        };
    };
    ci.prototype.getDimensions = function () {
        var t = this.getBounding();
        return {
            width: t.right - t.left,
            height: t.bottom - t.top
        };
    };
    ci.prototype.getBounding = function () {
        for (var t, e = null, i = null, n = null, r = null, o = -1; ++o < this.segments.length;) {
            t = this.segments[o];
            (null === e || t.x < e) && (e = t.x);
            (null === i || t.x > i) && (i = t.x);
            (null === n || t.y < n) && (n = t.y);
            (null === r || t.y > r) && (r = t.y);
        }
        return {
            left: e,
            top: n,
            bottom: r,
            right: i
        };
    };
    ci.prototype.draw = function (t) {
        t.ctx.beginPath();
        for (var e = -1, i = this.segments.length; ++e < i;) {
            var n = this.segments[e];
            var r = n.x !== n.handleIn.x || n.y !== n.handleIn.y || n.prev.x !== n.prev.handleOut.x || n.prev.y !== n.prev.handleOut.y;
            if (0 === n.index) {
                t.ctx.moveTo(n.x, n.y);
            } else {
                if (r) {
                    t.ctx.bezierCurveTo(n.prev.handleOut.x, n.prev.handleOut.y, n.handleIn.x, n.handleIn.y, n.x, n.y);
                    (n.next.x !== n.next.handleIn.x || n.next.y !== n.next.handleIn.y) && this._closed && this._tail === n && t.ctx.bezierCurveTo(n.handleOut.x, n.handleOut.y, n.next.handleIn.x, n.next.handleIn.y, n.next.x, n.next.y);
                } else {
                    t.ctx.lineTo(n.x, n.y);
                }
            }
        }
        this._closed && t.ctx.closePath();
        this.fill && (t.ctx.fillStyle = this.fillColor, t.ctx.fill());
        this.stroke && (t.ctx.strokeStyle = this.strokeColor, t.ctx.lineWidth = this.strokeWidth / t.scale, t.ctx.stroke());
        !0 === this.showPoints && this.forEachPoint(function (e) {
            e.fill = !0;
            e.render(t);
        });
    };
    ci.prototype.hitTest = function (t, e) {
        e === undefined && (e = {});
        var i;
        var n = !1;
        var r = 0;
        var o = !1;
        e.segment = e.segment === undefined || e.segment;
        e.path = e.path === undefined || e.path;
        for (var s = -1; ++s < this.segments.length;) {
            i = this.segments[s];
            e.path && this._closed && (r += hi(t, i));
            e.segment && i.hitTest(t) && (o = i);
        }
        e.path && 0 !== r && !1 === o ? n = {
            type: "path",
            geometry: this
        } : o && (n = {
            type: "segment",
            geometry: o
        });
        return n;
    };
    ci.prototype.destroy = function () {
        for (var t = this.segments.length; --t > -1;) {
            this.segments.splice(t, 1);
        }
        this._head = null;
        this._tail = null;
        this.segments = [];
        return null;
    };
    le.proto(fi, ci);
    fi.prototype.size = function (t, e) {
        t ? (e || (e = t), this.bounding.width = t, this.bounding.height = e) : (this.bounding.width = this.svgData.viewport.width, this.bounding.height = this.svgData.viewport.height);
    };
    fi.prototype.move = function (t, e) {
        t && (e || (e = t), this.bounding.left = t, this.bounding.top = e);
    };
    fi.prototype.destroy = function () {
        this.bounding = {
            left: 0,
            top: 0,
            width: 0,
            height: 0
        };
        this.svgData = null;
    };
    fi.prototype.getBounding = function () {
        return this.bounding;
    };
    fi.prototype.drawSVG = function (t) {
        di(t, this.svgData, this.bounding);
    };
    function di(t, e, i) {
        if (t && e && i) {
            var n = t.ctx;
            var r = 0;
            var o = 0;
            var s = e.pathCommands;
            var a = e.viewport;
            var l = i.width / a.width;
            var c = i.height / a.height;
            var h = Math.min(l, c);
            n.translate(i.left + a.left, i.top + a.top);
            n.beginPath();
            for (var u = 0; u < s.length;) {
                var f = s[u].params;
                switch (s[u].type) {
                    case "M":
                        n.moveTo(f[0] * h, f[1] * h);
                        r = f[0] * h;
                        o = f[1] * h;
                        break;
                    case "m":
                        n.moveTo(r + f[0] * h, o + f[1] * h);
                        r += f[0] * h;
                        o += f[1] * h;
                        break;
                    case "L":
                        n.lineTo(f[0] * h, f[1] * h);
                        r = f[0] * h;
                        o = f[1] * h;
                        break;
                    case "l":
                        n.lineTo(r + f[0] * h, o + f[1] * h);
                        r += f[0] * h;
                        o += f[1] * h;
                        break;
                    case "H":
                        n.lineTo(f[0] * h, o);
                        r = f[0] * h;
                        break;
                    case "h":
                        n.lineTo(r + f[0] * h, o);
                        r += f[0] * h;
                        break;
                    case "V":
                        n.lineTo(r, f[0] * h);
                        o = f[0] * h;
                        break;
                    case "v":
                        n.lineTo(r, o + f[0] * h);
                        o += f[0] * h;
                        break;
                    case "C":
                        n.bezierCurveTo(f[0] * h, f[1] * h, f[2] * h, f[3] * h, f[4] * h, f[5] * h);
                        r = f[4] * h;
                        o = f[5] * h;
                        break;
                    case "c":
                        n.bezierCurveTo(r + f[0] * h, o + f[1] * h, r + f[2] * h, o + f[3] * h, r + f[4] * h, o + f[5] * h);
                        r += f[4] * h;
                        o += f[5] * h;
                        break;
                    case "Z":
                    case "z":
                        n.closePath();
                }
                u++;
            }
            n.stroke();
        }
    }
    function mi() {
        le.self(this, ai);
        this.radius = 0;
        this.tolerance = 0;
        this.fill = !1;
        this.stroke = !1;
        this.fillColor = "#fff";
        this.strokeWidth = 1;
        this.hovered = !1;
        this.complete = !1;
    }
    function yi() {
        le.self(this, ae, "canvas");
        var t = this;
        this.element = this.dom;
        this.ctx = this.element.getContext("2d");
        this.scale = 1;
        this.dpr = window.devicePixelRatio || 1;
        this.clearColor = "#fff";
        this.ctx.roundedRect = function (e, i, n, r, o) {
            var s = n > 0 ? o : -o;
            var a = r > 0 ? o : -o;
            t.ctx.beginPath();
            t.ctx.moveTo(e + s, i);
            t.ctx.lineTo(e + n - s, i);
            t.ctx.quadraticCurveTo(e + n, i, e + n, i + a);
            t.ctx.lineTo(e + n, i + r - a);
            t.ctx.quadraticCurveTo(e + n, i + r, e + n - s, i + r);
            t.ctx.lineTo(e + s, i + r);
            t.ctx.quadraticCurveTo(e, i + r, e, i + r - a);
            t.ctx.lineTo(e, i + a);
            t.ctx.quadraticCurveTo(e, i, e + s, i);
            t.ctx.closePath();
        };
    }
    function gi() {
        this._events = Object.create(null);
    }
    function bi(t, e, i, n) {
        this._events[t] || (this._events[t] = []);
        this._events[t].unshift({
            fn: e,
            once: n,
            context: i
        });
    }
    function vi(t, e, i) {
        this.target = t;
        this.setTargetOrigin(i);
        this.id = e;
        this.messages = [];
        this.incoming = [];
        this.waiting = [];
        this.isReady = !0;
        this.queue = [];
    }
    le.proto(mi, ai);
    mi.prototype.draw = function (t) {
        var e = this.radius / t.scale;
        if (this.complete) {
            t.ctx.save();
            t.ctx.beginPath();
            t.ctx.arc(this.x, this.y, e + 2, 0, 2 * Math.PI);
            t.ctx.strokeStyle = ht.white;
            t.ctx.fillStyle = ht.white;
            t.ctx.lineWidth = 2;
            t.ctx.stroke();
            t.ctx.fill();
            t.ctx.beginPath();
            t.ctx.arc(this.x, this.y, e + 3, 0, 2 * Math.PI);
            t.ctx.strokeStyle = ht.outline;
            t.ctx.lineWidth = 1;
            t.ctx.stroke();
            t.ctx.restore();
            this.hovered && (t.ctx.beginPath(), t.ctx.arc(this.x, this.y, e + 9, 0, 2 * Math.PI), t.ctx.strokeStyle = ht.white, t.ctx.lineWidth = 2, t.ctx.stroke(), t.ctx.beginPath(), t.ctx.arc(this.x, this.y, e + 10, 0, 2 * Math.PI), t.ctx.strokeStyle = ht.outline, t.ctx.lineWidth = 1, t.ctx.stroke());
        } else {
            var i = 2.5;
            var n = [2.5, 4];
            t.ctx.beginPath();
            t.ctx.arc(this.x, this.y, 1.5, 0, 2 * Math.PI, !1);
            t.ctx.strokeStyle = ht.white;
            t.ctx.lineWidth = .5;
            t.ctx.fillStyle = this.fillColor;
            t.ctx.fill();
            t.ctx.strokeStyle = ht.outline;
            t.ctx.lineWidth = .5;
            t.ctx.stroke();
            t.ctx.beginPath();
            t.ctx.arc(this.x, this.y, e + 2, 0, 2 * Math.PI);
            t.ctx.strokeStyle = ht.white;
            t.ctx.lineWidth = 2;
            t.ctx.stroke();
            t.ctx.beginPath();
            t.ctx.arc(this.x, this.y, e + 3, 0, 2 * Math.PI);
            t.ctx.strokeStyle = ht.outline;
            t.ctx.lineWidth = 1;
            t.ctx.stroke();
            t.ctx.fillStyle = ht.outline;
            t.ctx.roundedRect(this.x - (e + 5), this.y - 2, n[0], n[1], 2);
            t.ctx.fill();
            t.ctx.fillStyle = ht.white;
            t.ctx.roundedRect(this.x - (e + 5 - 1), this.y - 1, n[0], n[1] / 2, 1);
            t.ctx.fill();
            t.ctx.fillStyle = ht.outline;
            t.ctx.roundedRect(this.x + e + i, this.y - 2, n[0], n[1], 2);
            t.ctx.fill();
            t.ctx.fillStyle = ht.white;
            t.ctx.roundedRect(this.x + e + i - 1, this.y - 1, n[0], n[1] / 2, 1);
            t.ctx.fill();
            t.ctx.fillStyle = ht.outline;
            t.ctx.roundedRect(this.x - 2, this.y - e - 5, n[1], n[0], 2);
            t.ctx.fill();
            t.ctx.fillStyle = ht.white;
            t.ctx.roundedRect(this.x - 1, this.y - e - 5 + 1, n[1] / 2, n[0], 1);
            t.ctx.fill();
            t.ctx.fillStyle = ht.outline;
            t.ctx.roundedRect(this.x - 2, this.y + e + i, n[1], n[0], 2);
            t.ctx.fill();
            t.ctx.fillStyle = ht.white;
            t.ctx.roundedRect(this.x - 1, this.y + e + i - 1, n[1] / 2, n[0], 1);
            t.ctx.fill();
        }
    };
    le.proto(yi, ae);
    yi.prototype.dimensions = function (t, e) {
        this.css({
            width: t,
            height: e
        });
        this.element.width = Math.round(t / this.scale) * this.dpr;
        this.element.height = Math.round(e / this.scale) * this.dpr;
        this.ctx.scale(this.dpr, this.dpr);
        this.width = Math.round(t / this.scale);
        this.height = Math.round(e / this.scale);
    };
    yi.prototype.clear = function () {
        this.ctx && this.ctx.clearRect(0, 0, this.element.width, this.element.height);
    };
    yi.prototype.draw = function () {
        this.ctx && (this.ctx.fillStyle = this.clearColor, this.ctx.fillRect(0, 0, this.element.width, this.element.height));
    };
    yi.prototype._destroy = function () {
        this.__destroy();
        this.element = null;
        this.ctx = null;
        this.width = null;
        this.height = null;
    };
    gi.prototype.on = function (t, e, i) {
        bi.call(this, t, e, i, !1);
    };
    gi.prototype.once = function (t, e, i) {
        bi.call(this, t, e, i, !0);
    };
    gi.prototype.off = function (t, e) {
        var i = this._events[t];
        if (i) {
            for (var n = i.length; --n > -1;) {
                i[n].fn === e && i.splice(n, 1);
            }
            0 === i.length && delete this._events[t];
        }
    };
    gi.prototype.emit = function (t) {
        var e = this._events[t];
        if (e) {
            for (var i, n = Array.prototype.slice.call(arguments, 1), r = e.length; --r > -1;) {
                (i = e[r]).fn.apply(i.context, n);
                i.once && e.splice(r, 1);
            }
            0 === e.length && delete this._events[t];
        }
    };
    gi.prototype.removeAllListeners = function () {
        this._events = Object.create(null);
    };
    vi.prototype._sendMessage = function (t, e) {
        var i = t instanceof HTMLIFrameElement;
        try {
            i ? t.contentWindow.postMessage(JSON.stringify(e), this.targetOrigin) : t.postMessage(JSON.stringify(e), this.targetOrigin);
        } catch (Oo) {
            Ct("messaging", Oo);
            "*" !== this.targetOrigin && (this.setTargetOrigin("*"), this._sendMessage(t, e));
        }
    };
    vi.prototype.setReady = function (t) {
        var e = this;
        e.isReady = t;
        e.isReady && e.queue.length && (e.queue.forEach(function (t) {
            e._sendMessage.apply(e, t);
        }), e.clearQueue());
    };
    vi.prototype.clearQueue = function () {
        this.queue = [];
    };
    vi.prototype.setID = function (t) {
        this.id = t;
    };
    vi.prototype.setTargetOrigin = function (t) {
        this.targetOrigin = "*";
    };
    vi.prototype.contact = function (t, e) {
        if (!this.id) {
            throw new Error("Chat requires unique id to communicate between windows");
        }
        var i = this;
        var n = Math.random().toString(36).substr(2);
        var r = {
            source: "hcaptcha",
            label: t,
            id: this.id,
            promise: "create",
            lookup: n
        };
        if (e) {
            if ("object" != typeof e) {
                throw new Error("Message must be an object.");
            }
            r.contents = e;
        }
        return new Promise(function (e, o) {
            i.waiting.push({
                label: t,
                reject: o,
                resolve: e,
                lookup: n
            });
            i._addToQueue(i.target, r);
        });
    };
    vi.prototype.listen = function (t, e) {
        if (!this.id) {
            throw new Error("Chat requires unique id to communicate between windows");
        }
        for (var i = this.messages.length, n = !1; --i > -1 && !1 === n;) {
            this.messages[i].label === t && (n = this.messages[i]);
        }
        !1 === n && (n = {
            label: t,
            listeners: []
        }, this.messages.push(n));
        n.listeners.push(e);
    };
    vi.prototype.answer = function (t, e) {
        if (!this.id) {
            throw new Error("Chat requires unique id to communicate between windows");
        }
        for (var i = this.incoming.length, n = !1; --i > -1 && !1 === n;) {
            this.incoming[i].label === t && (n = this.incoming[i]);
        }
        !1 === n && (n = {
            label: t,
            listeners: []
        }, this.incoming.push(n));
        n.listeners.push(e);
    };
    vi.prototype.send = function (t, e) {
        var i = this;
        if (!i.id) {
            throw new Error("Chat requires unique id to communicate between windows");
        }
        var n = {
            source: "hcaptcha",
            label: t,
            id: i.id
        };
        if (e) {
            if ("object" != typeof e) {
                throw new Error("Message must be an object.");
            }
            n.contents = e;
        }
        i._addToQueue(i.target, n);
    };
    vi.prototype.check = function (t, e) {
        for (var i = [].concat.apply([], [this.messages, this.incoming, this.waiting]), n = [], r = -1; ++r < i.length;) {
            if (i[r].label === t) {
                if (e && i[r].lookup && e !== i[r].lookup) {
                    continue;
                }
                n.push(i[r]);
            }
        }
        return n;
    };
    vi.prototype.respond = function (t) {
        for (var e, i, n = -1, r = 0, o = [].concat.apply([], [this.messages, this.incoming, this.waiting]); ++n < o.length;) {
            if (o[n].label === t.label) {
                if (t.lookup && o[n].lookup && t.lookup !== o[n].lookup) {
                    continue;
                }
                var s = [];
                e = o[n];
                t.error && s.push(t.error);
                t.contents && s.push(t.contents);
                if (t.promise && "create" !== t.promise) {
                    e[t.promise].apply(e[t.promise], s);
                    for (var a = this.waiting.length, l = !1; --a > -1 && !1 === l;) {
                        this.waiting[a].label === e.label && this.waiting[a].lookup === e.lookup && (l = !0, this.waiting.splice(a, 1));
                    }
                    continue;
                }
                for (r = 0; r < e.listeners.length; r++) {
                    i = e.listeners[r];
                    if ("create" === t.promise) {
                        var c = this._contactPromise(e.label, t.lookup);
                        s.push(c);
                    }
                    i.apply(i, s);
                }
            }
        }
        o = null;
    };
    vi.prototype.destroy = function () {
        this.clearQueue();
        this.messages = null;
        this.incoming = null;
        this.waiting = null;
        this.isReady = !1;
        return null;
    };
    vi.prototype._contactPromise = function (t, e) {
        var i = this;
        var n = {};
        var r = new Promise(function (t, e) {
            n.resolve = t;
            n.reject = e;
        });
        var o = {
            source: "hcaptcha",
            label: t,
            id: i.id,
            promise: null,
            lookup: e
        };
        r.then(function (t) {
            o.promise = "resolve";
            null !== t && (o.contents = t);
            i._addToQueue(i.target, o);
        })["catch"](function (t) {
            o.promise = "reject";
            null !== t && (o.error = t);
            i._addToQueue(i.target, o);
        });
        return n;
    };
    vi.prototype._addToQueue = function (t, e) {
        this.isReady ? this._sendMessage(t, e) : this.queue.push([t, e]);
    };
    var wi = {
        chats: [],
        messages: [],
        globalEnabled: !1,
        isSupported: function () {
            return !!window.postMessage;
        },
        createChat: function (t, e, i) {
            var n = new vi(t, e, i);
            wi.chats.push(n);
            return n;
        },
        addChat: function (t) {
            wi.chats.push(t);
        },
        removeChat: function (t) {
            for (var e = !1, i = wi.chats.length; --i > -1 && !1 === e;) {
                t.id === wi.chats[i].id && t.target === wi.chats[i].target && (e = wi.chats[i], wi.chats.splice(i, 1));
            }
            return e;
        },
        consumeMessages: function () {
            var t = wi.messages;
            wi.messages = [];
            return t;
        },
        handleGlobal: function (t) {
            if (wi.globalEnabled) {
                var e = wi.messages;
                if (e.length >= 10) {
                    wi.globalEnabled = !1;
                } else {
                    var i = e.some(function (e) {
                        return JSON.stringify(e.data) === JSON.stringify(t.data);
                    });
                    i || e.push(t);
                }
            }
        },
        handle: function (t) {
            var e = t.data;
            var i = "string" == typeof e && e.indexOf("hcaptcha") >= 0 || "object" == typeof e && JSON.stringify(e).indexOf("hcaptcha") >= 0;
            try {
                if (!i) {
                    return void wi.handleGlobal(t);
                }
                "string" == typeof e && (e = JSON.parse(e));
                "d" === e.t && wi.messages.push(t);
                for (var n, r = wi.chats, o = -1; ++o < r.length;) {
                    var s = "*" === (n = r[o]).targetOrigin || t.origin === n.targetOrigin;
                    n.id === e.id && s && n.respond(e);
                }
            } catch (Oo) {
                St("postMessage handler error", "postMessage", "debug", {
                    event: t,
                    error: Oo
                });
            }
        }
    };
    window.addEventListener ? window.addEventListener("message", wi.handle) : window.attachEvent("onmessage", wi.handle);
    var xi = new vi(window.parent);
    xi.init = function (t, e) {
        xi.setID(t);
        xi.setTargetOrigin(e);
        wi.globalEnabled = !0;
        wi.addChat(xi);
    };
    var ki = null;
    function _i(t) {
        ki && ut.confirmNav ? ki.display("link", {
            url: t
        }) : window.open(t, "_blank");
    }
    function Ei(t, e) {
        for (var i in e) {
            var n = e[i];
            switch (typeof n) {
                case "string":
                    t[i] = n;
                    break;
                case "object":
                    t[i] = t[i] || {};
                    Ei(t[i], n);
                    break;
                default:
                    throw new Error("Source theme contains invalid data types. Only string and object types are supported.");
            }
        }
    }
    function Ci(t, e) {
        try {
            return t in e;
        } catch (i) {
            return !1;
        }
    }
    function Si(t) {
        return !!t && "object" == typeof t;
    }
    function Vi(t) {
        return Si(t) ? Ti({}, t) : t;
    }
    function Ti(t, e) {
        var i;
        var n = {};
        var r = Object.keys(t);
        for (i = 0; i < r.length; i++) {
            n[r[i]] = Vi(t[r[i]]);
        }
        var o;
        var s;
        var a = Object.keys(e);
        for (i = 0; i < a.length; i++) {
            var l = a[i];
            if (!(!Ci(o = l, s = t) || Object.hasOwnProperty.call(s, o) && Object.propertyIsEnumerable.call(s, o))) {
                return;
            }
            Ci(l, t) && Si(t[l]) ? n[l] = Ti(t[l], e[l]) : n[l] = Vi(e[l]);
        }
        return n;
    }
    var Ai = {
        transparent: "transparent",
        white: "#ffffff",
        black: "#000000"
    };
    var Mi = {
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
    };
    var Ri = {
        300: "#4DE1D2",
        500: "#00838F"
    };
    var Bi = {
        300: "#BF1722",
        500: "#BF1722",
        700: "#9D1B1B"
    };
    var Ui = {
        __proto__: null,
        common: Ai,
        grey: Mi,
        teal: Ri,
        red: Bi
    };
    var Li = {
        mode: "light",
        grey: Mi,
        primary: {
            main: Ri[500]
        },
        secondary: {
            main: Ri[300]
        },
        warn: {
            light: Bi[300],
            main: Bi[500],
            dark: Bi[700]
        },
        text: {
            heading: Mi[700],
            body: Mi[700]
        }
    };
    var Hi = {
        mode: "dark",
        grey: Mi,
        primary: {
            main: Ri[500]
        },
        secondary: {
            main: Ri[300]
        },
        text: {
            heading: Mi[200],
            body: Mi[200]
        }
    };
    function Oi(t, e) {
        return "dark" === e && t in Hi ? Hi[t] : Li[t];
    }
    function Pi() {
        this._themes = Object.create(null);
        this._active = "light";
        this.add("light", {});
        this.add("dark", {
            palette: {
                mode: "dark"
            }
        });
    }
    Pi.prototype.get = function (t) {
        if (!t) {
            return this._themes[this._active];
        }
        var e = this._themes[t];
        if (!e) {
            throw new Error("Cannot find theme with name: " + t);
        }
        return e;
    };
    Pi.prototype.use = function (t) {
        this._themes[t] ? this._active = t : console.error("Cannot find theme with name: " + t);
    };
    Pi.prototype.active = function () {
        return this._active;
    };
    Pi.prototype.add = function (t, e) {
        e || (e = {});
        e.palette = function (t) {
            t || (t = {});
            var e = t.mode || "light";
            var i = t.primary || Oi("primary", e);
            var n = t.secondary || Oi("secondary", e);
            var r = t.warn || Oi("warn", e);
            var o = t.grey || Oi("grey", e);
            var s = t.text || Oi("text", e);
            return Ti({
                common: Ai,
                mode: e,
                primary: i,
                secondary: n,
                grey: o,
                warn: r,
                text: s
            }, t);
        }(e.palette);
        e.component = e.component || Object.create(null);
        this._themes[t] = e;
    };
    Pi.prototype.extend = function (t, e) {
        "string" == typeof e && (e = JSON.parse(e));
        var i = JSON.parse(JSON.stringify(this.get(t)));
        Ei(i, e);
        return i;
    };
    Pi.merge = function (t, e) {
        return Ti(t, e || {});
    };
    var Fi = {
        __proto__: null,
        Colors: Ui,
        Theme: Pi
    };
    var Zi = new Pi();
    function Ni(t) {
        var e = t.palette;
        var i = t.component;
        return Pi.merge({
            focus: {
                outline: e.primary.main
            }
        }, i.link);
    }
    function Di(t) {
        le.self(this, ce, "link", "a");
        this.config = {
            url: t.url,
            text: t.text,
            underline: t.underline || !1,
            theme: t.theme,
            linkToLocale: t.linkToLocale,
            onDarkBg: t.onDarkBg
        };
        this.setAttribute("tabindex", 0);
        this.config.url && (this.setAttribute("href", this.config.url), this.setAttribute("target", "_blank"));
        this.onSelect = this.onSelect.bind(this);
        this.onHover = this.onHover.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.addEventListener("click", this.onSelect);
        this.addEventListener("enter", this.onSelect);
        this.addEventListener("over", this.onHover);
        this.addEventListener("out", this.onHover);
        this.addEventListener("focus", this.onFocus);
        this.addEventListener("blur", this.onBlur);
        this.translate();
    }
    function Wi(t) {
        le.self(this, ce, null, "span");
        this.config = {
            text: t.text,
            bold: t.bold
        };
        this.text(this.config.text);
    }
    function zi(t) {
        le.self(this, ce, t.selector || null, t.element || "div");
        this.state = {
            theme: t.theme
        };
    }
    function Ii(t) {
        if ("string" != typeof t.src && !(t.src instanceof HTMLElement)) {
            throw new TypeError("Graphic src must be string or HTMLElement. Passed src: " + t.src);
        }
        le.self(this, ce, t.selector || ".graphic");
        this.state = {
            loaded: !1
        };
        this.config = {
            src: t.src,
            fallback: t.fallback || !1,
            width: t.width || 0,
            height: t.height || t.width || 0,
            fill: t.fill,
            stroke: t.stroke,
            label: t.label
        };
        this.image = null;
        (t.autoLoad || t.autoLoad === undefined) && this.load();
    }
    function ji(t, e) {
        var i = t.nodeName;
        if ("svg" === i || "g" === i || "clipPath" === i) {
            var n = t && (t.children || t.childNodes);
            if (!n) {
                return;
            }
            for (var r = 0; r < n.length; r++) {
                ji(n[r], e);
            }
        } else {
            if (t && t.style && ("path" === i || "rect" === i || "circle" === i || "polygon" === i)) {
                var o = !!t.getAttribute("stroke");
                var s = !!t.getAttribute("fill");
                o && (t.style.stroke = e);
                s && (t.style.fill = e);
                s || o || (t.style.fill = e);
            }
        }
    }
    function Ki(t) {
        var e = t.palette;
        var i = t.component;
        return Pi.merge({
            main: {
                fill: e.common.white,
                icon: e.grey[700],
                text: e.text.main
            },
            hover: {
                fill: e.grey[200],
                icon: e.primary.main,
                text: e.text.main
            },
            focus: {
                icon: e.primary.main,
                outline: e.primary.main
            },
            active: {
                icon: e.grey[700]
            }
        }, i.button);
    }
    function qi(t) {
        le.self(this, ce, t.selector);
        this._theme = t.theme;
        this.state = {
            selectable: !1 !== t.selectable,
            title: t.title,
            label: t.label,
            value: t.value,
            visible: !0,
            locked: !1,
            mobile: !1,
            selected: !1,
            width: t.width,
            height: t.height,
            closedAt: Date.now(),
            downAt: 0,
            style: Ki(this._theme.get())
        };
        this.addClass("button");
        this.setAttribute("tabindex", 0);
        this.setAttribute("role", "button");
        this.onDown = this.onDown.bind(this);
        this.onHover = this.onHover.bind(this);
        this.onSelect = this.onSelect.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.addEventListener("down", this.onDown);
        this.addEventListener("click", this.onSelect);
        this.addEventListener("enter", this.onSelect);
        this.addEventListener("focus", this.onFocus);
        this.addEventListener("blur", this.onBlur);
        !1 === tt.System.mobile && (this.addEventListener("over", this.onHover), this.addEventListener("out", this.onHover));
        this.setCopy();
    }
    Zi.add("contrast", {
        component: {
            prompt: {
                main: {
                    fill: "#fff",
                    text: "#000"
                }
            },
            expandButton: {
                main: {
                    fill: "#000"
                }
            }
        }
    });
    Zi.add("grey-red", {
        component: {
            breadcrumb: {
                active: {
                    fill: "#FF0000"
                }
            },
            prompt: {
                main: {
                    fill: "#6a6a6a"
                }
            },
            task: {
                selected: {
                    border: "#ff1f17"
                }
            },
            expandButton: {
                main: {
                    fill: "#6a6a6a"
                }
            },
            verifyButton: {
                main: {
                    fill: "#ff1f17"
                },
                hover: {
                    fill: "#ff1f17"
                }
            },
            skipButton: {
                main: {
                    fill: "#6a6a6a"
                },
                hover: {
                    fill: "#6a6a6a"
                }
            }
        }
    });
    le.proto(Di, ce);
    Di.prototype.style = function (t) {
        var e = t.fontSize || 12;
        var i = t.color || "inherit";
        var n = Ni(this.config.theme.get());
        this.css({
            color: i,
            fontWeight: 500,
            fontSize: e,
            cursor: "pointer",
            textDecoration: this.config.underline ? "underline" : "none",
            outlineColor: n.focus.outline,
            display: "inline-block",
            lineHeight: e
        });
    };
    Di.prototype.translate = function () {
        var t = ge.translate(this.config.text);
        this.content(t);
        this.config.linkToLocale && this.setAttribute("href", this.config.url + "&hl=" + ge.getLocale());
    };
    Di.prototype.onHover = function (t) {
        var e = "over" === t.action;
        this.css({
            textDecoration: e || this.config.underline ? "underline" : "none"
        });
    };
    Di.prototype.onSelect = function (t) {
        this.emit("click", t);
    };
    Di.prototype.onFocus = function (t) {
        var e = Ni(this.config.theme.get()).focus.outline;
        this.css({
            outline: "2px solid " + e
        });
    };
    Di.prototype.onBlur = function (t) {
        this.css({
            outline: "none"
        });
    };
    le.proto(Wi, ce);
    Wi.prototype.style = function (t) {
        var e = t.fontSize || 12;
        var i = t.color || "#000";
        this.css({
            color: i,
            fontWeight: this.config.bold ? 700 : 500,
            fontSize: e,
            lineHeight: e
        });
    };
    Wi.prototype.translate = function () {
        var t = ge.translate(this.config.text);
        this.text(t);
    };
    le.proto(zi, ce);
    zi.prototype.style = function (t) {
        for (var e = this.children.length; --e > -1;) {
            this.children[e].style(t);
        }
    };
    zi.prototype.parseText = function (t) {
        var e;
        var i;
        var n = [{
            type: "BOLD",
            regex: /\*\*([^*]*)\*\*/g
        }, {
            type: "LINK",
            regex: /\[([^[]+)]\(([^)]*)\)/g
        }];
        var r = [];
        for (e = n.length; --e > -1;) {
            for (; null != (i = n[e].regex.exec(t));) {
                i.type = n[e].type;
                r.push(i);
            }
        }
        r = r.sort(function (t, e) {
            return t.index - e.index;
        });
        this.removeAllComponents();
        var o = 0;
        for (e = 0; e < r.length; e++) {
            i = r[e];
            this.initComponent(Wi, {
                text: t.substring(o, i.index)
            });
            o = i.index + i[0].length;
            switch (i.type) {
                case "BOLD":
                    this.initComponent(Wi, {
                        text: i[1],
                        bold: !0
                    });
                    break;
                case "LINK":
                    this.initComponent(Di, {
                        text: i[1],
                        url: i[2],
                        underline: !0,
                        onDarkBg: !0,
                        theme: this.state.theme
                    });
            }
        }
        o < t.length && this.initComponent(Wi, {
            text: t.substring(o)
        });
        this.style({
            fontSize: "inherit",
            color: "inherit"
        });
    };
    le.proto(Ii, ce);
    Ii.prototype.load = function () {
        if (this.state.loaded) {
            return Promise.resolve();
        }
        this.state.loaded = !0;
        var t = this;
        var e = this.config.src;
        return Le.image(e, {
            fallback: this.config.fallback
        }).then(function (e) {
            t.image = e;
            t.appendElement(e.element);
            t.size();
            t.fill();
            t.translate();
        })["catch"](function () {
            St("graphic failed to load", "image", "info", {
                src: e
            });
        });
    };
    Ii.prototype.size = function (t, e) {
        this.config.width = t || this.config.width;
        this.config.height = e || t || this.config.height;
        this.css({
            width: this.config.width,
            height: this.config.height
        });
        this.image && this.image.element.css({
            width: this.config.width,
            height: this.config.height,
            display: "block"
        });
    };
    Ii.prototype.translate = function () {
        var t = this.config.label;
        t && this.image && this.image.element && this.image.element.setAttribute("alt", ge.translate(t));
    };
    Ii.prototype.fill = function (t) {
        (this.config.fill = t || this.config.fill, this.image && "svg" === this.image.ext && this.config.fill) && ji(this.image.element.dom, this.config.fill);
    };
    le.proto(qi, ce);
    qi.prototype.style = function (t) {
        this.state.mobile = t;
        this.state.style = Ki(this._theme.get());
        this.css({
            width: this.state.width,
            height: this.state.height,
            cursor: this.state.locked ? "default" : "pointer",
            display: this.state.visible ? "inline-block" : "none",
            color: this.state.style.main.text,
            backgroundColor: this.state.style.main.fill,
            outlineColor: this.state.style.focus.outline,
            border: "1px solid " + this.state.style.main.border,
            borderRadius: 4
        });
        this.emit("style");
    };
    qi.prototype.getWidth = function () {
        return this.state.width;
    };
    qi.prototype.getHeight = function () {
        return this.state.height;
    };
    qi.prototype._updateStyle = function (t) {
        this.state.style = Ki(this._theme.get());
        var e = t ? "hover" : "main";
        this.css({
            backgroundColor: this.state.style[e].fill,
            borderColor: this.state.style[e].border,
            color: this.state.style[e].text
        });
        this.emit("style-update", t);
    };
    qi.prototype.onDown = function () {
        this.state.downAt = Date.now();
    };
    qi.prototype.onHover = function (t) {
        null === this.emit || !0 === this.state.locked || this.state.selected || (this.emit("hover", t), this._updateStyle("over" === t.action));
    };
    qi.prototype.onSelect = function (t) {
        this.emit && !0 !== this.state.locked && (Math.abs(this.state.downAt - this.state.closedAt) < 30 || (this._setState(!!this.state.selectable && !this.state.selected), this.emit("click", {
            selected: this.state.selected,
            usingKb: "enter" === t.action
        })));
    };
    qi.prototype.onFocus = function (t) {
        var e = this.state.style.focus.outline;
        this.css({
            outline: "2px solid " + e
        });
    };
    qi.prototype.onBlur = function (t) {
        this.css({
            outline: "none"
        });
    };
    qi.prototype.setLock = function (t) {
        this.state.locked = t;
        this.css({
            cursor: t ? "default" : "pointer"
        });
    };
    qi.prototype.enable = function (t) {
        this.state.visible = t;
        this.css({
            display: t ? "inline-block" : "none"
        });
        this.setLock.call(this, !t);
    };
    qi.prototype.reset = function () {
        this._setState(!1);
    };
    qi.prototype._setState = function (t) {
        this.state.style = Ki(this._theme.get());
        this.state.selected = t;
        this.css({
            backgroundColor: this.state.style.main.fill
        });
        t ? this._updateStyle(!0) : this.state.closedAt = Date.now();
        this.emit("state-changed", t);
    };
    qi.prototype.setLabel = function (t) {
        t && (this.state.label = t);
        this.state.label && this.setAttribute("aria-label", ge.translate(this.state.label));
    };
    qi.prototype.setTitle = function (t) {
        t && (this.state.title = t);
        this.state.title && this.setAttribute("title", ge.translate(this.state.title));
    };
    qi.prototype.setCopy = function () {
        this.setLabel();
        this.setTitle();
    };
    qi.prototype.controlsMenu = function (t) {
        this.setAttribute("role", "menu");
        this.setAttribute("aria-expanded", !1);
        this.setAttribute("aria-haspopup", "menu");
        this.setAttribute("aria-controls", t.dom.id);
        t.setAttribute("aria-labelledby", this.dom.id);
        t.setAttribute("tabindex", -1);
        this.on("state-changed", function (t) {
            this.setAttribute("aria-expanded", t);
        });
    };
    qi.prototype.ownsListBox = function (t) {
        this.setAttribute("aria-expanded", !1);
        this.setAttribute("aria-haspopup", "listbox");
        this.setAttribute("aria-owns", t.dom.id);
        t.setAttribute("aria-labelledby", this.dom.id);
        t.setAttribute("role", "listbox");
        this.on("state-changed", function (t) {
            this.setAttribute("aria-expanded", t);
        });
    };
    qi.prototype.getValue = function () {
        return this.state.value;
    };
    var $i = "https://newassets.hcaptcha.com/captcha/v1/a28812e910b57e4ac097884908bc2d05a8975c8a/static/images";
    function Gi(t) {
        t.selector = t.selector || t.name;
        le.self(this, qi, t);
        this.$on = this.initComponent(Ii, {
            selector: "." + t.name + "-on",
            src: t.src,
            fallback: $i + "/" + t.name + "-on.png",
            autoLoad: !1
        });
        this.$off = this.initComponent(Ii, {
            selector: "." + t.name + "-off",
            src: t.src,
            fallback: $i + "/" + t.name + "-off.png",
            autoLoad: !1
        });
        this.on("state-changed", this._onStateChange.bind(this));
        this.on("style", this._onStyle.bind(this));
        this.on("style-update", this._onStyleUpdate.bind(this));
    }
    function Ji(t) {
        le.self(this, qi, t);
        this.state.text = t.text;
        t.a11y && (this.a11yText = this.createElement(".text"), this.a11yText.css({
            position: "absolute",
            opacity: 0
        }));
        this.$text = this.createElement(".text");
        this.on("style", this._onStyle.bind(this));
        this.setText();
    }
    function Xi(t) {
        le.self(this, qi, t);
        this.state.text = t.text;
        this.state.type = t.type || "confirm";
        this.$text = this.createElement(".text");
        this.on("style", this._onStyle.bind(this));
        this.setText();
    }
    function Yi(t) {
        var e = t.palette;
        var i = t.component;
        return Pi.merge({
            main: {
                fill: e.grey[200],
                border: e.grey[600]
            },
            selected: {
                check: e.primary.main
            },
            focus: {
                outline: e.primary.main
            }
        }, i.radio);
    }
    function Qi(t) {
        le.self(this, ce, "radio-button");
        this.state = {
            theme: t.theme,
            locked: !1,
            selected: !1,
            text: t.text,
            value: t.value
        };
        this.$wrapper = this.createElement(".wrapper");
        this.$radio = this.$wrapper.createElement(".radio");
        this.$radio.bg = this.$radio.createElement(".radio-bg");
        this.$radio.check = this.$radio.createElement(".radio-indicator");
        this.$radio.check.css({
            opacity: 0
        });
        this.$text = this.$wrapper.createElement(".radio-text");
        this.$text.dom.id = "RadioButton-" + this.state.value;
        this.$radio.setAttribute("tabindex", "0");
        this.$radio.setAttribute("role", "radio");
        this.$radio.setAttribute("aria-pressed", !1);
        this.$radio.setAttribute("aria-labelledby", this.$text.dom.id);
        this.onSelect = this.onSelect.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.$radio.addEventListener("click", this.onSelect);
        this.$radio.addEventListener("enter", this.onSelect);
        this.$radio.addEventListener("focus", this.onFocus);
        this.$radio.addEventListener("blur", this.onBlur);
    }
    function tn(t) {
        var e = t.palette;
        var i = t.component;
        var n = "light" === e.mode;
        return Pi.merge({
            main: {
                fill: e.grey[100],
                border: e.grey[n ? 600 : 200]
            },
            focus: {
                fill: e.grey[200],
                outline: e.grey[n ? 800 : 100]
            },
            disabled: {
                fill: e.grey[300]
            }
        }, i.textarea);
    }
    function en(t) {
        le.self(this, ce, "input-textarea");
        var e = this;
        this.state = {
            visible: !1,
            placeholder: t.placeholder,
            theme: t.theme
        };
        this.$textarea = this.createElement("textarea", ".textarea");
        this.setPlaceholder.call(this);
        this.$textarea.addEventListener("input", function (t) {
            e.emit("change", t.target.value);
        });
    }
    function nn(t) {
        le.self(this, ce, t.selector || "list-native", "select");
        var e = this;
        this._options = [];
        this._selected = null;
        this.setAttribute("tabindex", -1);
        this.addEventListener("change", function () {
            e.dom.value && e.select(e.dom.value);
        });
    }
    le.proto(Gi, qi);
    Gi.prototype.load = function () {
        return Promise.all([this.$on.load(), this.$off.load()]);
    };
    Gi.prototype._onStyle = function () {
        var t = this.getWidth();
        var e = t - 10;
        var i = (t - e) / 2;
        this.$on.size(e);
        this.$on.fill(this.state.style.focus.icon);
        this.$on.css({
            "-ms-high-contrast-adjust": "none",
            position: "absolute",
            top: i,
            left: i
        });
        this.$off.size(e);
        this.$off.fill(this.state.style.main.icon);
        this.$off.css({
            "-ms-high-contrast-adjust": "none",
            position: "absolute",
            top: i,
            left: i
        });
    };
    Gi.prototype._onStyleUpdate = function (t) {
        "ie" === tt.Browser.type && 8 === tt.Browser.version ? (this.$on.css({
            display: t ? "block" : "none"
        }), this.$off.css({
            display: t ? "none" : "block"
        })) : (this.$on.css({
            opacity: t ? 1 : 0
        }), this.$off.css({
            opacity: t ? 0 : 1
        }));
    };
    Gi.prototype._onStateChange = function (t) {
        "ie" === tt.Browser.type && 8 === tt.Browser.version ? (this.$on.css({
            display: t ? "block" : "none"
        }), this.$off.css({
            display: t ? "none" : "block"
        })) : (this.$on.css({
            opacity: t ? 1 : 0
        }), this.$off.css({
            opacity: t ? 0 : 1
        }));
    };
    le.proto(Ji, qi);
    Ji.prototype.setText = function (t) {
        this.$text.text(t || this.state.text || this.state.title);
    };
    Ji.prototype.setA11yText = function (t) {
        this.a11yText && this.a11yText.text(t || this.state.text || this.state.title);
    };
    Ji.prototype._onStyle = function () {
        this.css({
            cursor: "pointer"
        });
        this.$text.css({
            width: "100%",
            height: "100%",
            textAlign: "center",
            fontSize: 11,
            fontWeight: 600,
            lineHeight: this.state.height,
            position: "absolute"
        });
    };
    le.proto(Xi, qi);
    Xi.prototype.setText = function (t) {
        t && (this.state.text = t);
        this.$text.text(ge.translate(this.state.text || this.state.title));
        this.setCopy();
    };
    Xi.prototype._onStyle = function () {
        var t = this._theme.get().palette;
        var e = "light" === t.mode;
        var i = "warn" === this.state.type ? t.warn.main : t.primary.main;
        this.css({
            width: "auto",
            height: 15,
            cursor: this.state.locked ? "default" : "pointer",
            display: "block",
            margin: "0 auto",
            textAlign: "center",
            lineHeight: 15,
            borderRadius: 4,
            padding: "10px 15px"
        });
        this.$text.css({
            color: this.state.locked ? e ? t.text.body : t.grey[700] : i,
            fontSize: 15,
            fontWeight: 500,
            display: "inline-block"
        });
    };
    Xi.prototype.lock = function (t) {
        var e = this._theme.get().palette;
        var i = "warn" === this.state.type ? e.warn.main : e.primary.main;
        var n = "light" === e.mode;
        this.state.locked = t;
        this.css({
            cursor: t ? "default" : "pointer"
        });
        this.$text.css({
            color: t ? n ? e.text.body : e.grey[700] : i
        });
        t ? this.setAttribute("aria-disabled", t) : this.removeAttribute("aria-disabled");
    };
    le.proto(Qi, ce);
    Qi.prototype.style = function (t) {
        var e = Zt(t, 125, 150, 13, 14);
        var i = 15;
        var n = t - 27;
        var r = this.state.theme;
        var o = Yi(r.get());
        var s = r.get().palette;
        var a = "light" === s.mode;
        this.css({
            height: "auto",
            marginTop: 5,
            marginBottom: 5,
            position: "relative"
        });
        this.$wrapper.css({
            cursor: "pointer",
            height: "auto",
            width: "auto",
            position: "relative",
            display: "inline-block"
        });
        this.$radio.css({
            position: "relative",
            display: "inline-block",
            width: i,
            height: i,
            borderRadius: 2,
            overflow: "hidden",
            border: "1px solid " + o.main.border,
            float: "left"
        });
        this.$radio.check.css({
            position: "absolute",
            top: 2,
            left: 2,
            zIndex: 10,
            width: 11,
            height: 11,
            borderRadius: 1,
            backgroundColor: o.selected.check
        });
        this.$radio.bg.css({
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 0,
            width: i,
            height: i,
            backgroundColor: o.main.fill
        });
        this.$text.css({
            position: "relative",
            display: "inline-block",
            width: n,
            fontSize: e,
            fontWeight: 400,
            color: a ? s.text.body : s.grey[700],
            float: "right",
            marginLeft: 10,
            marginTop: 1,
            wordBreak: "break-word"
        });
    };
    Qi.prototype.toggle = function (t) {
        this.state.locked || (this.state.selected = t, this.$radio.check.css({
            opacity: t ? 1 : 0
        }), this.$radio.setAttribute("aria-pressed", t));
    };
    Qi.prototype.lock = function (t) {
        this.state.locked = t;
    };
    Qi.prototype.setCopy = function () {
        var t = ge.translate(this.state.text);
        this.$text.text(t);
    };
    Qi.prototype.onSelect = function (t) {
        this.emit("select", this);
    };
    Qi.prototype.onFocus = function (t) {
        var e = Yi(this.state.theme.get()).focus.outline;
        this.$radio.css({
            outline: "2px solid " + e
        });
    };
    Qi.prototype.onBlur = function (t) {
        this.$radio.css({
            outline: "none"
        });
    };
    le.proto(en, ce);
    en.prototype.style = function (t, e) {
        var i = this.state.theme;
        var n = tn(i.get());
        var r = i.get().palette;
        var o = "light" === r.mode;
        this.$textarea.css({
            width: t - 30,
            height: 50,
            borderRadius: 4,
            backgroundColor: n.main.fill,
            color: o ? r.text.body : r.grey[700],
            border: "1px solid " + n.main.border,
            fontSize: e ? 12 : 14,
            lineHeight: e ? 16 : 18,
            fontWeight: 500,
            boxSizing: "border-box",
            MozBoxSizing: "border-box",
            padding: "8px 12px",
            position: "absolute",
            left: "50%",
            marginLeft: -(t - 30) / 2
        });
        this.css({
            height: 50,
            width: t,
            position: "relative"
        });
        this.visible(this.state.visible);
    };
    en.prototype.visible = function (t) {
        this.state.visible = t;
        this.css({
            display: t ? "block" : "none"
        });
    };
    en.prototype.disable = function (t) {
        if (this.state.visible) {
            var e = tn(this.state.theme.get());
            this.$textarea.dom.disabled = !t;
            this.$textarea.css({
                backgroundColor: t ? e.main.fill : e.disabled.fill
            });
        }
    };
    en.prototype.getValue = function () {
        return this.$textarea.dom.value;
    };
    en.prototype.setValue = function (t) {
        this.$textarea.dom.value = t;
    };
    en.prototype.setPlaceholder = function () {
        this.$textarea.setAttribute("placeholder", ge.translate(this.state.placeholder));
    };
    le.proto(nn, ce);
    nn.prototype.getSelected = function () {
        return this._selected;
    };
    nn.prototype.setCopy = function () {
        for (var t = this._options.length; t--;) {
            this._options[t].element.text(ge.translate(this._options[t].text));
        }
    };
    nn.prototype.setOptions = function (t) {
        for (var e, i = this._options.length; i--;) {
            this.removeElement(this._options[i].element);
        }
        this._options = t;
        i = 0;
        for (; i < t.length; i++) {
            (e = this.createElement("option", t[i].selector || ".option")).dom.value = t[i].value;
            e.text(t[i].text);
            this._options[i].element = e;
        }
    };
    nn.prototype.select = function (t) {
        for (var e = null, i = this._options.length; i--;) {
            t === this._options[i].value && (e = this._options[i]);
        }
        if (!e) {
            throw new Error("Cannot select a missing option value: " + t);
        }
        this._selected && this._selected.element.removeAttribute("selected");
        e.element.setAttribute("selected", "selected");
        this._selected = e;
        this.dom.value = e.value;
        this.emit("hide");
        this.emit("select", e);
    };
    nn.prototype.deselect = function () {
        this._selected && this._selected.element.removeAttribute("selected");
        this._selected = null;
        this.dom.value = null;
    };
    nn.prototype.style = function () {
        this.css({
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            opacity: 0,
            zIndex: 50
        });
    };
    var rn = 37;
    var on = 39;
    var sn = 38;
    var an = 40;
    "onwheel" in document || document;
    document;
    var ln = "ontouchstart" in document;
    var cn = navigator.maxTouchPoints && navigator.maxTouchPoints > 1;
    var hn = !!window.navigator.msPointerEnabled;
    var un = "onkeydown" in document;
    function fn(t) {
        this.state = {
            pause: !1,
            action: null,
            position: {
                x: 0,
                y: 0
            },
            delta: {
                x: 0,
                y: 0
            },
            created: !1
        };
        this.config = {
            arrowScrolling: !1 !== t.arrowScrolling,
            keyStep: t.keyStep || 120,
            firefoxMult: t.firefoxMult || 15,
            touchMult: t.touchMult || 2,
            mouseMult: t.mouseMult || 1
        };
        var e = t.element || document.body;
        e instanceof ae || (e = new ae(e), this.state.created = !0);
        this.element = e;
        this.msBodyTouch = null;
        this.clamp = {
            enabled: !1,
            min: {
                x: 0,
                y: 0
            },
            max: {
                x: 0,
                y: 0
            }
        };
        this.onWheel = this.onWheel.bind(this);
        this.onKey = this.onKey.bind(this);
        this.onTouch = this.onTouch.bind(this);
        this.destroy = this.destroy.bind(this);
        this._addListeners();
    }
    function pn() {
        le.self(this, ce, "scroll-container");
    }
    function dn(t) {
        le.self(this, ce, t.selector || "list-custom");
        this.state = {
            skipAnimationOnce: !1
        };
        this.scroll = new fn({
            element: this,
            arrowScrolling: !1,
            mouseMult: .5,
            keyStep: 46
        });
        this._container = this.initComponent(pn);
        this._handle = this.createElement("div");
        this.on("scroll-update", this._onScrollUpdate.bind(this));
    }
    function mn(t) {
        var e = t.palette;
        var i = t.component;
        return Pi.merge({
            main: {
                fill: e.common.transparent,
                line: e.grey[200],
                text: e.grey[700]
            },
            hover: {
                fill: e.grey[200],
                text: e.grey[900],
                border: e.primary.main + "b3"
            },
            selected: {
                fill: "#5C6F8A",
                text: e.grey[100]
            }
        }, i.listItem);
    }
    function yn(t) {
        le.self(this, ce, t.option.selector || ".option");
        var e = this;
        this.state = {
            style: mn(t.theme.get()),
            selected: !1,
            usingKb: !1,
            isLast: !1,
            size: t.size,
            option: t.option,
            theme: t.theme,
            isMenu: t.isMenu,
            height: t.height
        };
        this.text = this.text.bind(this);
        this._text = this.createElement("span");
        this._separator = this.createElement("div");
        this.addEventListener("click", this.select.bind(this));
        this.addEventListener("enter", this.select.bind(this));
        this.addEventListener("over", this._onHover.bind(this, !0));
        this.addEventListener("out", this._onHover.bind(this, !1));
        this.addEventListener("blur", function () {
            e.updateStyle(!1);
            e.emit("blur");
        });
        this.addEventListener("focus", function () {
            e.updateStyle(e.state.usingKb);
            e.emit("focus");
        });
        this.setAttribute("tabindex", 0);
        this.setAttribute("aria-selected", this.state.selected);
        this.setAttribute("aria-setsize", this.state.size);
        this.setAttribute("role", this.state.isMenu ? "menuitem" : "option");
        this.setCopy();
    }
    function gn(t) {
        le.self(this, dn, {
            selector: t.selector || "list-custom"
        });
        this.state = {
            theme: t.theme,
            isMenu: t.isMenu,
            usingKb: !1,
            visible: !1,
            centerOnce: !1,
            search: "",
            focusedId: -1,
            selected: null,
            optionStyle: null,
            searchTimer: null,
            optionsVisible: t.optionsVisible || 6,
            optionHeight: 46
        };
        this._options = [];
        this.setAttribute("tabindex", -1);
        this.setAttribute("aria-expanded", !1);
        this.setAttribute("role", this.state.isMenu ? "presentation" : "listbox");
        this.addEventListener("keydown", this.onKeyPress.bind(this));
    }
    function bn(t) {
        le.self(this, ce, (t = t || {}).selector || ".box-container");
        this._theme = t.theme;
        this._tabbable = "boolean" != typeof t.tabbable || t.tabbable;
        this.boxState = {
            ariaLabel: t.ariaLabel,
            visible: !0,
            css: {
                boxSizing: t.boxSizing,
                width: t.width,
                height: t.height,
                padding: t.padding,
                margin: t.margin,
                borderWidth: t.borderWidth,
                borderStyle: t.borderStyle,
                borderRadius: t.borderRadius,
                borderColor: t.borderColor,
                backgroundColor: t.backgroundColor,
                cursor: t.cursor
            }
        };
        this.setStyle(this.boxState);
        this.setAriaLabel();
        this.setVisible(!0);
    }
    function vn(t) {
        le.self(this, ce, t.selector || ".border");
        this.state = {
            visible: t.visible === undefined || t.visible,
            thickness: t.thickness || 1,
            color: t.color || "#000000",
            rounded: t.rounded || 0
        };
        this.$top = this.createElement("div");
        this.$right = this.createElement("div");
        this.$left = this.createElement("div");
        this.$bottom = this.createElement("div");
    }
    function wn(t) {
        var e = t.palette;
        var i = t.component;
        return Pi.merge({
            focus: {
                outline: e.primary.main
            }
        }, i.link);
    }
    function xn(t) {
        le.self(this, ce, "logo", "a");
        this.state = {
            theme: t.theme,
            url: t.url || "",
            width: t.width || 0,
            height: t.height || 0
        };
        this.setAttribute("tabindex", 0);
        this.setAttribute("target", "_blank");
        this.setAttribute("href", this.state.url);
        this.setAttribute("role", "button");
        var e = {
            selector: ".logo-graphic",
            src: t.src,
            fallback: t.fallback,
            autoLoad: t.autoLoad
        };
        this.graphic = this.initComponent(Ii, e);
        this.graphic.css({
            cursor: "pointer",
            "-ms-high-contrast-adjust": "none"
        });
        this.onSelect = this.onSelect.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.addEventListener("click", this.onSelect);
        this.addEventListener("enter", this.onSelect);
        this.addEventListener("focus", this.onFocus);
        this.addEventListener("blur", this.onBlur);
    }
    function kn(t) {
        le.self(this, ce, t.selector || "spinner");
        this.config = {
            src: t.src
        };
        this.state = {
            visible: !1
        };
        this._angle = 0;
        this._timer = null;
        this._interval = 16;
        this.icon = this.initComponent(Ii, {
            selector: "spinner-icon",
            src: t.src,
            fallback: !1,
            autoLoad: !0
        });
        this.icon.css({
            "-ms-high-contrast-adjust": "none"
        });
        this.css({
            display: "none"
        });
    }
    function _n(t) {
        var e = t.palette;
        var i = t.component;
        return Pi.merge({
            main: {
                fill: e.primary.main,
                icon: e.common.white
            }
        }, i.badge);
    }
    function En(t) {
        le.self(this, ce, t.selector || ".badge");
        t || (t = {});
        this._theme = t.theme;
        this._style = _n(this._theme.get());
        this._timer = null;
        this.state = {
            loaded: !1,
            visible: !1
        };
        this.config = {
            icon: t.icon,
            value: t.value,
            size: t.size || 0
        };
        if (t.icon) {
            var e;
            var i = t.icon;
            "object" == typeof t.icon && (i = t.icon.src, e = t.icon.fallback);
            this.$wrapper = this.createElement(".badge-icon-wrapper");
            this.icon = this.initComponent(Ii, {
                selector: ".icon",
                src: i,
                fallback: e
            }, this.$wrapper);
        }
        this.$fill = this.createElement(".badge-fill");
        this.$radial = this.createElement(".badge-radial");
    }
    fn.prototype.pause = function (t) {
        this.state.pause = t;
    };
    fn.prototype.update = function (t) {
        if (!this.state.pause) {
            var e = this.state.position;
            var i = this.state.delta;
            var n = this.state.action;
            e.x += i.x;
            e.y += i.y;
            this.clamp.enabled ? (e.x = Ft(e.x, this.clamp.min.x, this.clamp.max.x), e.y = Ft(e.y, this.clamp.min.y, this.clamp.max.y)) : console.log(e.y, this.element.dom.scrollHeight);
            this.element.emit("scroll-update", {
                x: e.x,
                y: e.y,
                delta: i,
                action: n,
                original: t
            });
        }
    };
    fn.prototype._addListeners = function () {
        var t = {
            passive: !1
        };
        ("ie" !== tt.Browser.type || "ie" === tt.Browser.type && 8 !== tt.Browser.version) && (this.element.addEventListener("DOMMouseScroll", this.onWheel), this.element.addEventListener("wheel", this.onWheel, t));
        this.element.addEventListener("mousewheel", this.onWheel, t);
        ln && (this.element.addEventListener("touchstart", this.onTouch), this.element.addEventListener("touchmove", this.onTouch));
        hn && cn && (this.msBodyTouch = document.body.style.msTouchAction, document.body.style.msTouchAction = "none", this.element.addEventListener("MSPointerDown", this.onTouch, !0), this.element.addEventListener("MSPointerMove", this.onTouch, !0));
        this.config.arrowScrolling && un && this.element.addEventListener("keydown", this.onKey);
    };
    fn.prototype._removeListeners = function () {
        var t = {
            passive: !1
        };
        ("ie" !== tt.Browser.type || "ie" === tt.Browser.type && 8 !== tt.Browser.version) && (this.element.removeEventListener("DOMMouseScroll", this.onWheel), this.element.removeEventListener("wheel", this.onWheel, t));
        this.element.removeEventListener("mousewheel", this.onWheel, t);
        ln && (this.element.removeEventListener("touchstart", this.onTouch), this.element.removeEventListener("touchmove", this.onTouch));
        hn && cn && (this.msBodyTouch = document.body.style.msTouchAction, document.body.style.msTouchAction = "none", this.element.removeEventListener("MSPointerDown", this.onTouch, !0), this.element.removeEventListener("MSPointerMove", this.onTouch, !0));
        this.config.arrowScrolling && un && this.element.removeEventListener("keydown", this.onKey);
    };
    fn.prototype.onWheel = function (t) {
        if (!this.state.pause) {
            (t = window.event || t).preventDefault && t.preventDefault();
            var e = this.state.delta;
            var i = this.config.mouseMult;
            var n = this.config.firefoxMult;
            "detail" in t && "wheel" !== t.type && 0 !== t.detail ? (e.y = -1 * t.detail, e.y *= n) : "wheelDelta" in t && !("wheelDeltaY" in t) ? e.y = -1 * t.wheelDelta : (e.x = -1 * (t.deltaX || t.wheelDeltaX), e.y = -1 * (t.deltaY || t.wheelDeltaY), "firefox" === tt.Browser.type && 1 === t.deltaMode && n && (e.x *= n, e.y *= n));
            i && (e.x *= i, e.y *= i);
            this.state.action = "wheel";
            this.update.call(this, t);
        }
    };
    fn.prototype.onTouch = function (t) {
        if (!this.state.pause) {
            var e = this.state.position;
            var i = this.state.delta;
            var n = this.config.touchMult;
            var r = t.targetTouches[0];
            "move" === t.action ? (i.x = (r.pageX - e.x) * n, i.y = (r.pageY - e.y) * n) : (i.x = 0, i.y = 0);
            this.state.action = "touch";
            this.update.call(this, t);
        }
    };
    fn.prototype.onKey = function (t) {
        if (!this.state.pause && !t.metaKey) {
            var e = this.state.delta;
            var i = this.config.keyStep;
            switch (t.keyCode) {
                case an:
                    t.preventDefault && t.preventDefault();
                    e.x = 0;
                    e.y = -i;
                    break;
                case sn:
                    t.preventDefault && t.preventDefault();
                    e.x = 0;
                    e.y = i;
                    break;
                case rn:
                    e.x = -i;
                    e.y = 0;
                    break;
                case on:
                    e.x = i;
                    e.y = 0;
                    break;
                default:
                    e.x = 0;
                    return void (e.y = 0);
            }
            this.state.action = "keypress";
            this.update.call(this, t);
        }
    };
    fn.prototype.clampX = function (t, e, i) {
        this.clamp.enabled = t;
        this.clamp.min.x = e || 0;
        this.clamp.max.x = i || 0;
    };
    fn.prototype.clampY = function (t, e, i) {
        this.clamp.enabled = t;
        this.clamp.min.y = e || 0;
        this.clamp.max.y = i || 0;
    };
    fn.prototype.reset = function () {
        this.state.position = {
            x: 0,
            y: 0
        };
        this.state.delta = {
            x: 0,
            y: 0
        };
    };
    fn.prototype.setPosX = function (t) {
        this.setPos(t, this.state.position.y);
    };
    fn.prototype.setPosY = function (t) {
        this.setPos(this.state.position.x, t);
    };
    fn.prototype.moveYBy = function (t) {
        this.setPos(this.state.position.x, this.state.position.y + t);
    };
    fn.prototype.getY = function () {
        return this.state.position.y;
    };
    fn.prototype.setPos = function (t, e) {
        this.clamp.enabled && (t = Ft(t, this.clamp.min.x, this.clamp.max.x), e = Ft(e, this.clamp.min.y, this.clamp.max.y));
        this.state.position = {
            x: t,
            y: e
        };
        this.state.delta = {
            x: 0,
            y: 0
        };
        this.element.emit("scroll-update", {
            x: t,
            y: e,
            delta: this.state.delta,
            action: null
        });
    };
    fn.prototype.destroy = function () {
        var t = this.state.created;
        this._removeListeners();
        this.state = {
            pause: !1,
            action: null,
            position: {
                x: 0,
                y: 0
            },
            delta: {
                x: 0,
                y: 0
            },
            created: !1
        };
        t && (this.element = this.element.destroy());
    };
    le.proto(pn, ce);
    le.proto(dn, ce);
    dn.prototype.getContainer = function () {
        return this._container;
    };
    dn.prototype.scrollInView = function (t, e, i) {
        this.dom.scrollTop = 0;
        this.state.skipAnimationOnce = i;
        var n = -t.offsetTop;
        var r = t.offsetHeight;
        var o = this.dom.clientHeight;
        var s = this._container.dom.scrollHeight;
        var a = this.scroll.getY();
        var l = a - o;
        this._handle.css({
            display: s <= o ? "none" : "block"
        });
        this.scroll.clampY(!0, o - s, 0);
        e ? this.scroll.setPosY(n + o / 2 - r / 2) : n > a ? this.scroll.setPosY(n) : n - r < l && this.scroll.setPosY(n + o - r);
    };
    dn.prototype._onScrollUpdate = function (t) {
        var e = t.y;
        var i = this._handle.dom.offsetHeight;
        var n = this.dom.clientHeight;
        var r = (Zt(e, 0, n - this._container.dom.scrollHeight, 0, 1) || 0) * (n - i - 4);
        "ie" === tt.Browser.type && 8 === tt.Browser.version ? (this._container.css({
            top: e
        }), this._handle.css({
            top: r
        })) : (this._container.css({
            transform: "translateY(" + e + "px)",
            transition: this.state.skipAnimationOnce ? "none" : "transform 300ms"
        }), this._handle.css({
            transform: "translateY(" + r + "px)",
            transition: this.state.skipAnimationOnce ? "none" : "transform 300ms"
        }), this.state.skipAnimationOnce = !1);
    };
    dn.prototype.baseStyle = function () {
        this._container.css({
            width: "100%",
            position: "absolute",
            overflowY: "hidden"
        });
        this._handle.css({
            position: "absolute",
            willChange: "transform",
            width: 3,
            height: 40,
            top: 2,
            right: 5,
            borderRadius: 4,
            backgroundColor: "#6E829E"
        });
    };
    dn.prototype.onDestroy = function () {
        this.scroll.destroy && this.scroll.destroy();
    };
    le.proto(yn, ce);
    yn.prototype.usingKb = function (t) {
        this.state.usingKb = t;
    };
    yn.prototype.select = function () {
        this.state.selected = !0;
        this.setAttribute("aria-selected", this.state.selected);
        this.updateStyle(this.state.usingKb);
        this.emit("select", this);
    };
    yn.prototype.deselect = function () {
        this.state.selected = !1;
        this.dom && (this.setAttribute("aria-selected", this.state.selected), this.updateStyle());
    };
    yn.prototype.focus = function () {
        this.dom && (this.dom.focus(), this.emit("focus"));
    };
    yn.prototype.getOptionData = function () {
        return this.state.option;
    };
    yn.prototype.setCopy = function () {
        this._text.text(ge.translate(this.state.option.text));
    };
    yn.prototype._onHover = function (t) {
        this.emit("hover", t);
        this.usingKb(!1);
        this.updateStyle(t);
    };
    yn.prototype.updateStyle = function (t) {
        if (this.dom) {
            var e = this.state.theme.get().palette;
            var i = this.state.style;
            this.css({
                background: this.state.selected ? i.selected.fill : t ? i.hover.fill : i.main.fill,
                color: this.state.option.warn ? e.warn.main : this.state.selected ? i.selected.text : t ? i.hover.text : i.main.text,
                borderColor: this.state.usingKb && t ? i.hover.border : "transparent"
            });
            this._separator.css({
                display: this.state.isLast || this.state.selected || t ? "none" : "block"
            });
        }
    };
    yn.prototype.text = function () {
        return this._text.text();
    };
    yn.prototype.style = function (t) {
        this.state.isLast = t;
        this.state.style = mn(this.state.theme.get());
        this.css({
            position: "relative",
            cursor: "pointer",
            height: this.state.height - 6,
            fontSize: 14,
            fontWeight: 400,
            borderWidth: 3,
            borderStyle: "solid",
            borderColor: "transparent"
        });
        this._separator.css({
            position: "absolute",
            height: 1,
            bottom: -4,
            left: 10,
            right: 10,
            background: this.state.style.main.line
        });
        this.updateStyle();
    };
    le.proto(gn, dn);
    gn.prototype.getSelected = function () {
        return this.state.selected && this.state.selected.getOptionData();
    };
    gn.prototype.setCopy = function () {
        for (var t = this._options.length; t--;) {
            this._options[t].setCopy();
        }
    };
    gn.prototype.setOptions = function (t) {
        for (var e, i = this._options.length; i--;) {
            this.getContainer().removeElement(this._options[i]);
        }
        this._options = [];
        i = 0;
        for (; i < t.length; i++) {
            e = this.getContainer().initComponent(yn, {
                theme: this.state.theme,
                isMenu: this.state.isMenu,
                size: t.length,
                height: this.state.optionHeight,
                option: t[i]
            });
            var n = i === t.length - 1;
            var r = !!t[i].label;
            e.usingKb(this.state.usingKb);
            e.style(n);
            r && e.setAttribute("aria-label", ge.translate(t[i].label));
            this._options.push(e);
            e.on("select", this._onOptionSelect.bind(this, e));
            e.on("focus", this._onOptionFocus.bind(this, i));
            e.on("blur", this._onOptionBlur.bind(this, i));
            e.on("hover", this._onOptionHover.bind(this));
        }
        var o = -1 === this.state.optionsVisible ? this._options.length : this.state.optionsVisible;
        this.css({
            height: o * this.state.optionHeight
        });
    };
    gn.prototype.select = function (t) {
        for (var e = null, i = this._options.length; i--;) {
            t === this._options[i].getOptionData().value && (e = this._options[i]);
        }
        if (!e) {
            throw new Error("Cannot select a missing option value: " + t);
        }
        e.select();
    };
    gn.prototype.deselect = function () {
        this.state.selected && this.state.selected.deselect();
        this.state.selected = null;
    };
    gn.prototype._onOptionSelect = function (t) {
        this.hide();
        this.state.selected && this.state.selected !== t && this.state.selected.deselect();
        this.state.selected = t;
        this.emit("select", t.getOptionData());
    };
    gn.prototype._onOptionFocus = function (t) {
        this.state.focusedId = t;
        var e = this._options[t];
        var i = !this.state.centerOnce && e === this.state.selected;
        i && (this.state.centerOnce = !0);
        this.scrollInView(e.dom, i, i);
    };
    gn.prototype._onOptionHover = function () {
        for (var t = this._options.length; t--;) {
            this._options[t].updateStyle(!1);
        }
    };
    gn.prototype._onOptionBlur = function () {
        var t = this;
        this.state.focusedId = -1;
        setTimeout(function () {
            t.dom && -1 === t.state.focusedId && t.hide();
        }, 0);
    };
    gn.prototype.isVisible = function () {
        return this.state.visible;
    };
    gn.prototype.hide = function () {
        this.state.visible && (this.state.visible = !1, this.setAttribute("aria-expanded", !1), this.css({
            display: "none"
        }), this.emit("hide"));
    };
    gn.prototype.open = function () {
        if (!this.state.visible) {
            this.state.centerOnce = !1;
            this.state.visible = !0;
            this.setAttribute("aria-expanded", !0);
            this.css({
                display: "block"
            });
            var t = this.state.selected ? this.state.selected : this._options[0];
            t && t.focus();
            this.emit("open");
        }
    };
    gn.prototype.usingKb = function (t) {
        this.state.usingKb = t;
        for (var e = this._options.length; e--;) {
            this._options[e].usingKb(t);
        }
    };
    gn.prototype.style = function (t) {
        var e = function (t) {
            var e = t.palette;
            var i = t.component;
            return Pi.merge({
                main: {
                    fill: e.common.white,
                    border: "#6E829E"
                }
            }, i.list);
        }(this.state.theme.get());
        this.css({
            width: t || 160,
            display: this.isVisible() ? "block" : "none",
            zIndex: 100,
            background: e.main.fill,
            boxShadow: "rgba(0, 0, 0, 0.3) 0px 0px 4px",
            borderWidth: 1,
            borderRadius: 4,
            borderStyle: "solid",
            borderColor: e.main.border,
            position: "absolute",
            overflow: "hidden",
            left: 0
        });
        this.getContainer().css({
            lineHeight: this.state.optionHeight - 6,
            whiteSpace: "nowrap",
            textAlign: "center"
        });
        for (var i = this._options.length; --i > -1;) {
            this._options[i].style(i === this._options.length - 1);
        }
        this.baseStyle();
    };
    gn.prototype.onKeyPress = function (t) {
        var e = this;
        if (27 === t.keyNum) {
            t.stopPropagation && t.stopPropagation();
            t.preventDefault && t.preventDefault();
            return void e.hide();
        }
        if (-1 === [13, 32].indexOf(t.keyNum)) {
            this.usingKb(!0);
            if (-1 !== [38, 40].indexOf(t.keyNum)) {
                var i = (e.state.focusedId + (38 === t.keyNum ? -1 : 1)) % e._options.length;
                -1 === i && (i = e._options.length - 1);
                t.stopPropagation && t.stopPropagation();
                t.preventDefault && t.preventDefault();
                return void e._options[i].focus();
            }
            this.state.searchTimer && clearTimeout(this.state.searchTimer);
            this.state.searchTimer = setTimeout(function () {
                e.state.search = "";
            }, 500);
            this.state.search += String.fromCharCode(t.keyCode);
            var n = this._findByValue(this.state.search);
            n && n.focus();
        }
    };
    gn.prototype._findByValue = function (t) {
        t = t.toLowerCase();
        for (var e = null, i = this._options.length; i--;) {
            0 === this._options[i].text().toLowerCase().indexOf(t) && (e = this._options[i]);
        }
        return e;
    };
    le.proto(bn, ce);
    bn.prototype.setStyle = function (t) {
        t = t || {};
        var e = function (t) {
            var e = t.palette;
            var i = t.component;
            var n = "light" === e.mode;
            return Pi.merge({
                main: {
                    fill: e.grey[n ? 100 : 800],
                    border: e.grey[n ? 300 : 200]
                },
                hover: {
                    fill: e.grey[n ? 200 : 900]
                }
            }, i.box);
        }(this._theme.get());
        this.boxState.css.boxSizing = t.boxSizing || this.boxState.css.boxSizing || "content-box";
        this.boxState.css.width = t.width || this.boxState.css.width || "100%";
        this.boxState.css.height = t.height || this.boxState.css.height || "100%";
        this.boxState.css.padding = t.padding || this.boxState.css.padding || 0;
        this.boxState.css.margin = t.margin || this.boxState.css.margin || 0;
        this.boxState.css.borderWidth = t.borderWidth || this.boxState.css.borderWidth || 0;
        this.boxState.css.borderRadius = t.borderRadius || this.boxState.css.borderRadius || 0;
        this.boxState.css.borderStyle = t.borderStyle || this.boxState.css.borderStyle || "solid";
        this.boxState.css.borderColor = t.borderColor || this.boxState.css.borderColor || e.main.border;
        this.boxState.css.backgroundColor = t.backgroundColor || this.boxState.css.backgroundColor || e.main.fill;
        this.boxState.css.cursor = t.cursor || this.boxState.css.cursor || "default";
        this.css(this.boxState.css);
    };
    bn.prototype.setVisible = function (t) {
        this.boxState.visible = t;
        this.css({
            display: t ? "block" : "none"
        });
        this._tabbable && (this.setAttribute("aria-hidden", !t), this.setAttribute("tabindex", t ? "0" : "-1"));
    };
    bn.prototype.setAriaLabel = function (t) {
        t ? this.setAttribute("aria-label", t) : this.boxState.ariaLabel && this.setAttribute("aria-label", ge.translate(this.boxState.ariaLabel));
    };
    le.proto(vn, ce);
    vn.prototype.style = function (t, e, i) {
        e || (e = t);
        i !== undefined && (this.state.thickness = i);
        this.css({
            width: t,
            height: e,
            opacity: this.state.visible ? 1 : 0,
            position: "absolute",
            left: 0,
            top: 0,
            overflow: "hidden",
            borderRadius: this.state.rounded
        });
        this.$top.css({
            position: "absolute",
            left: 0,
            top: 0,
            width: t,
            height: this.state.thickness,
            backgroundColor: this.state.color
        });
        this.$bottom.css({
            position: "absolute",
            left: 0,
            bottom: 0,
            width: t,
            height: this.state.thickness,
            backgroundColor: this.state.color
        });
        this.$right.css({
            position: "absolute",
            right: 0,
            top: 0,
            width: this.state.thickness,
            height: e,
            backgroundColor: this.state.color
        });
        this.$left.css({
            position: "absolute",
            left: 0,
            top: 0,
            width: this.state.thickness,
            height: e,
            backgroundColor: this.state.color
        });
    };
    vn.prototype.setVisibility = function (t) {
        this.state.visible = t;
        this.css({
            opacity: t ? 1 : 0
        });
    };
    vn.prototype.setColor = function (t) {
        this.state.color = t;
        this.$top.css({
            backgroundColor: this.state.color
        });
        this.$bottom.css({
            backgroundColor: this.state.color
        });
        this.$right.css({
            backgroundColor: this.state.color
        });
        this.$left.css({
            backgroundColor: this.state.color
        });
    };
    vn.prototype.isVisible = function () {
        return this.state.visible;
    };
    le.proto(xn, ce);
    xn.prototype.setUrl = function (t) {
        this.state.url = t;
    };
    xn.prototype.getUrl = function () {
        return this.state.url;
    };
    xn.prototype.size = function (t, e) {
        var i = wn(this.state.theme.get());
        t && (this.state.width = t);
        e ? this.state.height = e : t && (this.state.height = t);
        this.css({
            outlineColor: i.focus.outline,
            display: "block",
            width: this.state.width,
            height: this.state.height
        });
        this.graphic.size(this.state.width, this.state.height);
    };
    xn.prototype.onSelect = function (t) {
        t.preventDefault && t.preventDefault();
        window.open(this.state.url, "_blank");
    };
    xn.prototype.onFocus = function (t) {
        var e = wn(this.state.theme.get()).focus.outline;
        this.css({
            outline: "2px solid " + e
        });
    };
    xn.prototype.onBlur = function (t) {
        this.css({
            outline: "none"
        });
    };
    le.proto(kn, ce);
    kn.prototype.setVisible = function (t) {
        this.state.visible = t;
        this.css({
            display: t ? "block" : "none"
        });
    };
    kn.prototype.style = function (t, e) {
        var i = t;
        var n = t;
        this.icon.size(i, n);
        this.icon.fill(e);
        this.css({
            width: i,
            height: n
        });
        return {
            width: i,
            height: n
        };
    };
    kn.prototype.spin = function () {
        this._angle = (this._angle + 8) % 360;
        this.icon.css({
            transform: "rotate(" + this._angle + "deg) translateZ(1px)"
        });
    };
    kn.prototype.startSpinning = function () {
        var t = this;
        t.stopSpinning();
        (function e() {
            t.spin();
            t._timer = setTimeout(e, t._interval);
        })();
    };
    kn.prototype.stopSpinning = function () {
        this._timer && (clearTimeout(this._timer), this._timer = null);
    };
    kn.prototype.onDestroy = function () {
        this.stopSpinning();
    };
    le.proto(En, ce);
    En.prototype.size = function (t, e) {
        this.config.size = t || this.config.size;
        this._style = _n(this._theme.get());
        var i = e || this._style.main.fill;
        var n = this.state.visible ? 1 : 1.2;
        this.css({
            width: this.config.size,
            height: this.config.size,
            borderRadius: "50%",
            opacity: this.state.visible ? 1 : 0,
            transition: "none"
        });
        this.$fill.css({
            backgroundColor: i,
            width: this.config.size,
            height: this.config.size,
            position: "absolute",
            transform: "scale(" + n + ")",
            top: 0,
            left: 0,
            zIndex: 5,
            transition: "none",
            borderRadius: "50%",
            border: 1,
            borderColor: "#fff"
        });
        this.$radial.css({
            backgroundColor: i,
            width: this.config.size,
            height: this.config.size,
            transform: "scale(1)",
            position: "absolute",
            opacity: .5,
            top: 0,
            left: 0,
            zIndex: 0,
            transition: "none",
            borderRadius: "50%"
        });
        if (this.icon) {
            var r = this._style.main.icon;
            this.$wrapper.css({
                width: this.config.size,
                height: this.config.size,
                overflow: "hidden"
            });
            this.icon.fill(r);
            this.icon.size(this.config.size, this.config.size);
            this.icon.css({
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: 15
            });
        }
    };
    En.prototype.display = function (t, e) {
        this._timer && (this._timer = clearTimeout(this._timer));
        this.resetAnimation();
        e ? this._timer = setTimeout(function () {
            this.state.visible = t;
            t ? this.animateIn() : this.animateOut();
        }.bind(this), 16) : this.reset(t);
    };
    En.prototype.reset = function (t) {
        this.state.visible = t;
        this.css({
            transition: "none",
            opacity: t ? 1 : 0
        });
        this.icon.css({
            top: t ? 0 : this.config.size / 4,
            opacity: t ? 1 : 0,
            transition: "none"
        });
        this.$radial.css({
            opacity: 0,
            transition: "none"
        });
        this.$fill.css({
            transition: "none",
            transform: "scale(1)"
        });
    };
    En.prototype.resetAnimation = function () {
        var t = this.state.visible ? 1 : .75;
        this.$fill.css({
            transition: "none",
            transform: "scale(" + t + ")"
        });
        this.$radial.css({
            opacity: .25,
            transition: "none",
            transform: "scale(1)"
        });
        this.icon.css({
            top: this.state.visible ? 0 : this.config.size / 4,
            opacity: this.state.visible ? 1 : 0,
            transition: "none"
        });
    };
    En.prototype.animateIn = function () {
        this.css({
            transition: "all 0.25s cubic-bezier(0.33, 1, 0.68, 1)",
            opacity: 1
        });
        this.$fill.css({
            transition: "all 0.25s cubic-bezier(.18,1.78,.66,.84) 0.05s",
            transform: "scale(1)"
        });
        this.$radial.css({
            opacity: 0,
            transition: "all 0.35s cubic-bezier(0.33, 1, 0.68, 1) 0.05s",
            transform: "scale(1.5)"
        });
        this.icon.css({
            top: 0,
            opacity: 1,
            transition: "all 0.25s cubic-bezier(0.33, 1, 0.68, 1) 0.05s"
        });
    };
    En.prototype.animateOut = function () {
        this.css({
            transition: "opacity 0.2s cubic-bezier(0.25, 1, 0.5, 1) 0.05s",
            opacity: 0
        });
        this.$fill.css({
            transition: "transform 0.2s cubic-bezier(0.25, 1, 0.5, 1) 0.05s",
            transform: "scale(0.65)"
        });
        this.$radial.css({
            opacity: 0,
            transition: "none"
        });
        this.icon.css({
            top: -this.config.size / 4,
            opacity: 0,
            transition: "all 0.2s cubic-bezier(0.25, 1, 0.5, 1)"
        });
    };
    En.prototype.fill = function (t) {
        this.$fill.css({
            backgroundColor: t,
            transition: "none"
        });
        this.$radial.css({
            backgroundColor: t,
            transition: "none"
        });
    };
    var Cn = {
        __proto__: null,
        Graphic: Ii,
        ListNative: nn,
        ListCustom: gn,
        Link: Di,
        Logo: xn,
        Span: Wi,
        Markdown: zi,
        IconButton: Gi,
        TextButton: Ji,
        ActionButton: Xi,
        RadioButton: Qi,
        TextArea: en,
        Box: bn,
        Border: vn,
        Badge: En,
        Spinner: kn,
        Button: qi
    };
    function Sn() {
        le.self(this, Gi, {
            title: "Close Modal",
            name: "close",
            src: "data:image/svg+xml,%3csvg width='22' height='22' viewBox='0 0 22 22' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath fill-rule='evenodd' clip-rule='evenodd' d='M17.5669 4.17308C17.1764 3.78256 16.5432 3.78256 16.1527 4.17308L11 9.32578L5.84731 4.17309C5.45678 3.78257 4.82362 3.78257 4.43309 4.17309L4.17308 4.43311C3.78256 4.82363 3.78256 5.4568 4.17308 5.84732L9.32577 11L4.17309 16.1527C3.78257 16.5432 3.78257 17.1764 4.17309 17.5669L4.4331 17.8269C4.82363 18.2174 5.45679 18.2174 5.84732 17.8269L11 12.6742L16.1527 17.8269C16.5432 18.2174 17.1764 18.2174 17.5669 17.8269L17.8269 17.5669C18.2174 17.1764 18.2174 16.5432 17.8269 16.1527L12.6742 11L17.8269 5.84731C18.2174 5.45678 18.2174 4.82362 17.8269 4.43309L17.5669 4.17308Z'/%3e%3c/svg%3e",
            theme: Zi,
            width: 30,
            height: 30
        });
    }
    function Vn() {
        le.self(this, ce, "header");
        this.state = {
            visible: !0
        };
        this.$title = this.createElement("h2", "#modal-title");
        this.$underline = this.createElement(".underline");
        this.setAttribute("role", "heading");
    }
    function Tn(t) {
        var e = t.palette;
        var i = t.component;
        var n = "light" === e.mode;
        return Pi.merge({
            main: {
                fill: e.common.white,
                border: e.grey[n ? 300 : 200]
            },
            hover: {
                fill: e.grey[n ? 200 : 700]
            },
            focus: {
                outline: e.primary.main
            }
        }, i.modal);
    }
    function An() {
        le.self(this, ce, "modal");
        var t = this;
        this.state = {
            visible: !1,
            curr: null,
            prev: null
        };
        this._style = Tn(Zi.get());
        this.addClass("no-outline");
        this.setAttribute("role", "dialog");
        this.setAttribute("aria-modal", !0);
        this.setAttribute("tabindex", "0");
        this.header = this.initComponent(Vn);
        this.header.on("close", function () {
            t.emit("close");
        });
        this.$content = this.createElement("#modal-content");
        this.$content.addClass("content");
        this.setAttribute("aria-describedby", "modal-content");
        this.close = this.initComponent(Sn);
        this.close.on("click", function () {
            t.emit("close");
        });
        this.addEventListener("keydown", function (e) {
            t.dom && 9 === e.keyNum && (e.shiftKey ? document.activeElement === t.dom && (t.close.focus(), e.preventDefault && e.preventDefault()) : document.activeElement === t.close.dom && (t.focus(), e.preventDefault && e.preventDefault()));
        });
        this.addEventListener("focus", function () {
            t.css({
                border: "2px solid " + t._style.focus.outline
            });
        });
        this.addEventListener("blur", function () {
            t.css({
                border: "none"
            });
        });
    }
    function Mn(t) {
        le.self(this, ce, "copy", "p");
        var e = this;
        t || (t = {});
        this.state = {
            text: t.text || "",
            linkUnderline: t.linkUnderline || !1,
            linkTranslate: t.linkTranslate || !1,
            link: t.link || !1,
            linkText: t.linkText || "",
            linkTo: t.linkTo || null,
            replaceText: t.replaceText || null
        };
        this.state.link && (this.link = new Di({
            theme: Zi,
            text: this.state.linkText,
            url: this.state.linkTo,
            underline: this.state.linkUnderline,
            linkToLocale: this.state.linkTranslate
        }), this.state.linkTo && this.link.on("click", function (t) {
            e.emit("click", t);
        }));
    }
    le.proto(Sn, Gi);
    Sn.size = Sn.prototype.size = 30;
    le.proto(Vn, ce);
    Vn.prototype.style = function (t, e) {
        var i = e ? 40 : 44;
        var n = Zi.get().palette;
        var r = "light" === n.mode;
        this.$title.css({
            color: r ? n.text.heading : n.grey[700],
            fontWeight: 600,
            textAlign: "left",
            fontSize: e ? 15 : 16,
            display: this.state.visible ? "table-cell" : "none",
            verticalAlign: "middle",
            paddingTop: 2,
            height: i,
            width: t - Sn.size
        });
        this.$underline.css({
            backgroundColor: n.primary.main,
            width: t,
            height: 1,
            top: i,
            position: "absolute"
        });
        this.css({
            width: t,
            height: i,
            position: "relative",
            top: 0
        });
        return {
            height: i,
            width: t
        };
    };
    Vn.prototype.setCopy = function (t) {
        var e = ge.translate(t);
        this.$title.text(e);
    };
    Vn.prototype.display = function (t) {
        this.state.visible = t;
        this.css({
            display: t ? "table-cell" : "none"
        });
    };
    Vn.prototype.isVisible = function () {
        return this.state.visible;
    };
    le.proto(An, ce);
    An.prototype.load = function () {
        this.close.load();
    };
    An.prototype.style = function (t, e) {
        var i = t < 300;
        this._style = Tn(Zi.get());
        this.css({
            width: t,
            maxHeight: e,
            position: "relative",
            margin: "0 auto",
            backgroundColor: this._style.main.fill,
            display: this.header ? "block" : "table",
            borderRadius: 4,
            zIndex: 10,
            overflow: "hidden",
            border: "1px solid " + this._style.main.border,
            boxShadow: "rgba(0, 0, 0, 0.15) 0px 0px 2px",
            padding: "0px 15px 15px"
        });
        this.header.isVisible() ? (this.header.style(t, i), this.$content.css({
            display: "block",
            height: "auto",
            marginTop: 10
        })) : this.$content.css({
            display: "table-cell",
            verticalAlign: "middle",
            marginTop: 0,
            height: e
        });
        this.close.style();
        this.close.css({
            position: "absolute",
            right: 20,
            top: i ? 5 : 7
        });
    };
    An.prototype.setTitle = function (t) {
        t ? (this.header.display(!0), this.header.setCopy(t), this.close.setTitle()) : this.header.display(!1);
    };
    le.proto(Mn, ce);
    Mn.prototype.style = function (t, e) {
        var i = Zi.get().palette;
        var n = "light" === i.mode;
        e || (e = "center");
        this.css({
            width: "100%",
            fontSize: t,
            textAlign: e,
            fontWeight: 400,
            color: n ? i.text.body : i.grey[700],
            lineHeight: t + 6,
            display: "inline"
        });
        this.state.link && (this.link.style(t), this.link.css({
            display: "inline"
        }));
    };
    Mn.prototype.translate = function () {
        var t = ge.translate(this.state.text);
        if (this.state.link) {
            this.link.translate();
            if (this.state.replaceText) {
                var e = t.split("{{" + this.state.replaceText + "}}");
                var i = document.createTextNode(e[0]);
                this.appendElement(i);
                this.appendElement(this.link);
                if ("" !== e[1]) {
                    var n = document.createTextNode(e[1]);
                    this.appendElement(n);
                }
            } else {
                var r = document.createTextNode(t + " ");
                this.appendElement(r);
                this.appendElement(this.link);
            }
        } else {
            this.content(t);
        }
    };
    function Rn() {
        le.self(this, ce, "instructions");
        var t = this;
        this.copy = this.initComponent(Mn, {
            text: "hCaptcha is a service that reduces bots and spam by asking simple questions. Please follow the instructions at the top of the screen for each challenge. For more information visit {{site-url}}",
            link: !0,
            linkText: "hcaptcha.com",
            linkTo: "https://www.hcaptcha.com/what-is-hcaptcha-about?ref=" + ct.host + "&utm_campaign=" + ct.sitekey + "&utm_medium=embed_about",
            linkTranslate: !0,
            replaceText: "site-url"
        });
        this.copy.on("click", function (e) {
            e.preventDefault();
            _i(t.copy.state.linkTo);
        });
    }
    function Bn() {
        le.self(this, ce, "feedback");
        var t = this;
        this.info = this.initComponent(Wi, {
            text: "Having a problem?"
        });
        this.link = this.initComponent(Di, {
            theme: Zi,
            underline: !0,
            text: "Give feedback."
        });
        this.link.on("click", function () {
            t.emit("click");
        });
    }
    function Un() {
        le.self(this, ce, "information");
        var t = this;
        this.instructions = this.initComponent(Rn, null, this.$content);
        this.feedback = this.initComponent(Bn, null, this.$content);
        this.feedback.on("click", function () {
            t.emit("change", "feedback");
        });
    }
    function Ln() {
        le.self(this, ce, "actions");
        var t = this;
        this.cancel = this.initComponent(Xi, {
            theme: Zi,
            selector: "button-cancel",
            title: "Cancel",
            type: "warn"
        });
        this.send = this.initComponent(Xi, {
            theme: Zi,
            selector: "button-send",
            title: "Send",
            type: "confirm"
        });
        this.cancel.on("click", function () {
            t.emit("cancel");
        });
        this.send.on("click", function () {
            t.emit("confirm");
        });
    }
    le.proto(Rn, ce);
    Rn.prototype.style = function (t) {
        this.copy.style(t, "left");
    };
    Rn.prototype.setCopy = function () {
        this.copy.translate();
    };
    le.proto(Bn, ce);
    Bn.prototype.style = function (t) {
        var e = Math.floor(Zt(t, 250, 300, 11, 13));
        var i = Zi.get().palette;
        var n = "light" === i.mode;
        this.css({
            textAlign: "center",
            color: n ? i.text.body : i.grey[700],
            fontSize: e,
            fontWeight: 500,
            width: t,
            margin: "0 auto"
        });
        this.link.css({
            fontWeight: 500,
            marginLeft: 3
        });
    };
    Bn.prototype.setCopy = function () {
        var t = ge.translate("Provide feedback regarding the hCaptcha service.");
        this.info.translate();
        this.link.translate();
        this.link.setAttribute("aria-label", t);
    };
    le.proto(Un, ce);
    Un.prototype.style = function (t, e, i) {
        var n = Math.floor(Zt(t, 250, 275, 12, 14));
        this.instructions.style(n);
        this.instructions.css({
            marginBottom: 10
        });
        this.feedback.style(t);
    };
    Un.prototype.setCopy = function () {
        this.instructions.setCopy();
        this.feedback.setCopy();
    };
    le.proto(Ln, ce);
    Ln.prototype.style = function (t, e, i) {
        this.send.style();
        this.cancel.style(t, i);
        this.cancel.css({
            position: "absolute",
            left: 0
        });
        this.send.css({
            position: "absolute",
            right: 0
        });
    };
    Ln.prototype.setCopy = function () {
        this.cancel.setText();
        this.send.setText();
    };
    Ln.prototype.lockSend = function (t) {
        this.send.lock(t);
        t ? this.send.setLabel("Please select an option to send response.") : this.send.removeAttribute("aria-label");
    };
    Ln.prototype.visible = function (t) {
        this.cancel.enable(t);
        this.send.enable(t);
    };
    function Hn() {
        le.self(this, ce, "instructions");
        this.copy = this.initComponent(Mn, {
            text: "Please select Confirm to follow the link, or Cancel to stay on the current screen."
        });
    }
    function On(t) {
        le.self(this, ce, "navigation");
        var e = this;
        this.confirmation = this.initComponent(Hn);
        this.actions = this.initComponent(Ln);
        this.actions.on("confirm", function () {
            window.open(t.url, "_blank");
            e.emit("close");
        });
        this.actions.on("cancel", function () {
            e.emit("close");
        });
    }
    function Pn(t) {
        le.self(this, ce, "options");
        this.state = {
            visible: !0
        };
        this.handeSelect = this.handeSelect.bind(this);
        this.$wrapper = this.createElement(".column-wrapper");
        this.$left = this.$wrapper.createElement(".column-left");
        this.$right = this.$wrapper.createElement(".column-right");
        this.options = [];
        for (var e = null, i = null, n = null, r = 0; r < t.length; r++) {
            n = t[r];
            i = r >= t.length / 2 ? this.$right : this.$left;
            (e = this.initComponent(Qi, {
                theme: Zi,
                text: n.text,
                value: n.value
            }, i)).setCopy();
            e.on("select", this.handeSelect);
            this.options.push(e);
        }
    }
    le.proto(Hn, ce);
    Hn.prototype.style = function (t) {
        this.copy.style(t, "left");
    };
    Hn.prototype.setCopy = function () {
        this.copy.translate();
    };
    le.proto(On, ce);
    On.prototype.style = function (t, e, i) {
        var n = Math.floor(Zt(t, 250, 275, 12, 14));
        this.confirmation.style(n);
        this.confirmation.css({
            marginBottom: 10
        });
        this.actions.style(t, i);
        this.actions.css({
            width: i ? 200 : 220,
            height: 35,
            position: "relative",
            margin: "10px auto 0px"
        });
    };
    On.prototype.setCopy = function () {
        this.confirmation.setCopy();
        this.actions.setCopy();
    };
    le.proto(Pn, ce);
    Pn.prototype.style = function (t, e) {
        var i = Math.floor(t / 2);
        this.$left.css({
            width: "50%",
            display: "inline-block"
        });
        this.$right.css({
            width: "50%",
            display: "inline-block"
        });
        for (var n = 0; n < this.options.length; n++) {
            this.options[n].style(i);
        }
    };
    Pn.prototype.handeSelect = function (t) {
        if (this.state.visible) {
            for (var e = !1, i = 0; i < this.options.length; i++) {
                (e = this.options[i] === t) && e === t.state.selected && (e = !e);
                this.options[i].toggle(e);
            }
            this.emit("update", t);
        }
    };
    Pn.prototype.visible = function (t) {
        this.state.visible = t;
        this.css({
            display: t ? "inline-block" : "none"
        });
        for (var e = 0; e < this.options.length; e++) {
            this.options[e].lock(!t);
        }
    };
    Pn.prototype.setCopy = function () {
        for (var t = 0; t < this.options.length; t++) {
            this.options[t].setCopy();
        }
    };
    var Fn = "Please provide details and steps to reproduce.";
    var Zn = [{
        text: "Can't Solve",
        value: "captcha_solve"
    }, {
        text: "Can't Click",
        value: "captcha_usability"
    }, {
        text: "Off Screen",
        value: "captcha_position"
    }, {
        text: "Other",
        value: "other"
    }];
    var Nn = "Please describe your issue.";
    var Dn = [{
        text: "Inappropriate",
        value: "inappropriate"
    }, {
        text: "Violent",
        value: "violent"
    }, {
        text: "Too Difficult",
        value: "difficulty"
    }, {
        text: "Other",
        value: "other"
    }];
    var Wn = "Please describe your issue.";
    var zn = [{
        text: "Inappropriate",
        value: "content"
    }, {
        text: "Software Bug",
        value: "software"
    }, {
        text: "Too Difficult",
        value: "difficulty"
    }, {
        text: "Other",
        value: "other"
    }];
    function In(t) {
        le.self(this, ce, "report");
        var e = this;
        this.state = {
            selected: null,
            taskKey: t.key,
            type: t.type
        };
        var i;
        var n;
        var r;
        i = t.type;
        n = Wn;
        r = zn;
        "bug" === i ? (n = Fn, r = Zn) : "image" === i && (n = Nn, r = Dn);
        var o = {
            prompt: n,
            options: r
        };
        this.options = this.initComponent(Pn, o.options);
        this.comment = this.initComponent(en, {
            placeholder: o.prompt,
            theme: Zi
        });
        this.actions = this.initComponent(Ln);
        this.actions.lockSend(!0);
        this.options.on("update", this.storeAnswer.bind(this));
        this.actions.on("confirm", this.sendMessage.bind(this));
        this.actions.on("cancel", function () {
            e.emit("close");
        });
        this.setAttribute("role", "radiogroup");
    }
    function jn() {
        le.self(this, ce, "thanks-feedback");
        var t = this;
        this.$copy = this.createElement(".feedback-thanks");
        this.$resolve = this.createElement(".feedback-resolve");
        this.$option = this.createElement(".accessibility-option");
        this.$option.content = this.initComponent(Wi, {
            theme: Zi,
            text: "Please also try turning off your ad blocker.‍"
        }, this.$option);
        this.$option.link = this.initComponent(Di, {
            theme: Zi,
            text: "Our accessibility option may help."
        }, this.$option);
        this.$bug = this.createElement(".feedback-bug");
        this.$bug.content = this.initComponent(Wi, {
            theme: Zi,
            text: "Reporting a functionality issue?"
        }, this.$bug);
        this.$bug.link = this.initComponent(Di, {
            theme: Zi,
            text: "See how to report issues with detailed logs."
        }, this.$bug);
        this.$bug.link.addEventListener("click", function () {
            _i("https://www.hcaptcha.com/reporting-bugs?hl=" + ge.getLocale());
        });
        this.$option.link.on("click", function () {
            _i("https://hcaptcha.com/accessibility?hl=" + ge.getLocale());
        });
        if (!1 === tt.System.mobile) {
            function e(e) {
                var i = Zi.get().palette;
                var n = "light" === i.mode;
                t.$bug.link.css("over" === e.action ? {
                    color: i.primary.main,
                    textDecoration: "underline"
                } : {
                    color: n ? i.text.body : i.grey[700],
                    textDecoration: "none"
                });
            }
            this.$bug.link.addEventListener("over", e);
            this.$bug.link.addEventListener("out", e);
            function i(e) {
                var i = Zi.get().palette;
                var n = "light" === i.mode;
                t.$option.link.css("over" === e.action ? {
                    color: i.primary.main,
                    textDecoration: "underline"
                } : {
                    color: n ? i.text.body : i.grey[700],
                    textDecoration: "none"
                });
            }
            this.$option.link.addEventListener("over", i);
            this.$option.link.addEventListener("out", i);
        }
    }
    function Kn() {
        le.self(this, ce, "thanks-accessibility");
        var t = this;
        this.$sorry = this.createElement(".accessibility-text");
        this.$option = this.createElement(".accessibility-option");
        this.$avoid = this.createElement(".accessibility-avoid");
        function e(t) {
            _i("https://hcaptcha.com/accessibility");
        }
        this.$option.addEventListener("enter", e);
        this.$option.addEventListener("down", e);
        if (!1 === tt.System.mobile) {
            function i(e) {
                var i = Zi.get().palette;
                var n = "light" === i.mode;
                t.$option.css("over" === e.action ? {
                    color: i.primary.main,
                    textDecoration: "underline"
                } : {
                    color: n ? i.text.body : i.grey[700],
                    textDecoration: "none"
                });
            }
            this.$option.addEventListener("over", i);
            this.$option.addEventListener("out", i);
        }
    }
    function qn() {
        le.self(this, ce, "thanks-feedback");
        this.$copy = this.createElement(".feedback-thanks");
        this.$resolve = this.createElement(".feedback-resolve");
    }
    function $n(t) {
        le.self(this, ce, "thanks");
        "accessibility" === t.response ? this.copy = this.initComponent(Kn, null, this.$content) : "image" === t.response ? this.copy = this.initComponent(qn, null, this.$content) : this.copy = this.initComponent(jn, null, this.$content);
    }
    le.proto(In, ce);
    In.prototype.style = function (t, e, i) {
        this.options.style(t, i);
        this.options.css({
            marginBottom: 10
        });
        this.comment.style(t, i);
        this.comment.css({
            marginTop: 10
        });
        this.actions.style(t, i);
        this.actions.css({
            width: i ? 200 : 220,
            height: 35,
            position: "relative",
            margin: "10px auto 0px"
        });
    };
    In.prototype.sendMessage = function () {
        var t = "";
        var e = this.comment.getValue();
        this.state.selected && (t = this.state.selected.state.text);
        this.comment.setValue("");
        this.comment.visible(!1);
        this.options.visible(!1);
        this.actions.visible(!1);
        this.emit("report", {
            reason: t,
            comment: e,
            key: this.state.taskKey
        });
        this.emit("change", "thanks", {
            response: this.state.type
        });
    };
    In.prototype.storeAnswer = function (t) {
        var e = t.state.selected;
        var i = "other" === t.state.value && e;
        this.comment.visible(i);
        this.state.selected = e ? t : null;
        this.actions.lockSend(null === this.selected);
    };
    In.prototype.setCopy = function (t) {
        this.options.setCopy();
        this.comment.setPlaceholder();
        this.actions.setCopy();
    };
    le.proto(jn, ce);
    jn.prototype.style = function (t, e) {
        var i = Zt(t, 280, 310, 260, 310);
        var n = Zt(t, 280, 300, 12, 13);
        var r = n + 4;
        var o = Zi.get().palette;
        var s = "light" === o.mode;
        this.css({
            fontWeight: 500,
            textAlign: "center",
            fontSize: n + 1,
            lineHeight: n + 4,
            color: s ? o.text.body : o.grey[700],
            width: t
        });
        this.$copy.css({
            width: i,
            margin: "0 auto",
            fontWeight: 600,
            marginBottom: 2
        });
        this.$resolve.css({
            fontSize: n,
            lineHeight: r,
            width: i,
            margin: "0 auto",
            marginBottom: 10
        });
        this.$option.css({
            fontSize: n,
            lineHeight: r,
            marginBottom: 10
        });
        this.$option.link.css({
            fontSize: n,
            lineHeight: r,
            cursor: "pointer"
        });
        this.$bug.css({
            fontSize: n - 1,
            lineHeight: r - 1,
            width: i,
            margin: "0 auto",
            marginBottom: -2
        });
        this.$bug.link.css({
            fontSize: n - 1,
            lineHeight: r - 1,
            width: i,
            margin: "0 auto",
            cursor: "pointer"
        });
    };
    jn.prototype.setCopy = function () {
        var t = ge.translate("Thank you for your feedback.");
        var e = ge.translate("We'll resolve your issue as quickly as we can.");
        this.$copy.text(t);
        this.$resolve.text(e);
        this.$bug.content.translate();
        this.$bug.link.translate();
        this.$option.content.translate();
        this.$option.link.translate();
        var i = ge.translate("View our accessibility option.");
        var n = ge.translate("Give a detailed report of a bug you've encountered.");
        this.$option.link.setAttribute("aria-label", i);
        this.$bug.link.setAttribute("aria-label", n);
    };
    le.proto(Kn, ce);
    Kn.prototype.style = function (t, e) {
        var i = Zt(t, 280, 310, 260, 310);
        var n = Zt(t, 280, 300, 12, 13);
        var r = n + 4;
        var o = Zi.get().palette;
        var s = "light" === o.mode;
        this.css({
            fontWeight: 500,
            fontSize: n + 1,
            lineHeight: r,
            textAlign: "center",
            color: s ? o.text.body : o.grey[700],
            width: t
        });
        this.$sorry.css({
            fontWeight: 600,
            width: i,
            margin: "0 auto",
            marginBottom: 2
        });
        this.$option.css({
            fontSize: n,
            lineHeight: r,
            color: s ? o.text.body : o.grey[700],
            cursor: "pointer",
            marginBottom: 10
        });
        this.$avoid.css({
            width: i,
            textAlign: "center",
            fontSize: n,
            lineHeight: r,
            margin: "0 auto"
        });
    };
    Kn.prototype.setCopy = function () {
        var t = ge.translate("Sorry to hear that!");
        var e = ge.translate("Our accessibility option may help.");
        var i = ge.translate("This lets you avoid future questions by registering and setting a cookie.");
        var n = ge.translate("Please also try turning off your ad blocker.‍");
        this.$sorry.text(t + " ");
        this.$option.text(e);
        this.$avoid.text(i + " " + n);
    };
    le.proto(qn, ce);
    qn.prototype.style = function (t, e) {
        var i = Zt(t, 280, 310, 260, 310);
        var n = Zt(t, 280, 300, 12, 13);
        var r = n + 4;
        this.css({
            fontWeight: 500,
            textAlign: "center",
            fontSize: n + 1,
            lineHeight: n + 4,
            color: "#707070",
            width: t
        });
        this.$copy.css({
            width: i,
            margin: "0 auto",
            fontWeight: 600,
            marginBottom: 2
        });
        this.$resolve.css({
            fontSize: n,
            lineHeight: r,
            width: i,
            margin: "0 auto",
            marginBottom: 10
        });
    };
    qn.prototype.setCopy = function () {
        var t = {
            thanks: ge.translate("Thank you for your feedback."),
            resolve: ge.translate("We will look into the issue immediately.")
        };
        this.$copy.text(t.thanks);
        this.$resolve.text(t.resolve);
    };
    le.proto($n, An);
    $n.prototype.style = function (t, e, i) {
        this.copy.style(t, i);
    };
    $n.prototype.setCopy = function () {
        this.copy.setCopy();
    };
    $n.prototype.setFocus = function () {
        this.copy.focus();
    };
    var Gn = "https://newassets.hcaptcha.com/captcha/v1/a28812e910b57e4ac097884908bc2d05a8975c8a/static/images";
    function Jn() {
        le.self(this, ce, "cookie-icon");
        this.$none = this.initComponent(Ii, {
            selector: ".icon-none",
            src: "data:image/svg+xml,%3csvg width='155' height='155' viewBox='0 0 155 155' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cmask id='mask0' mask-type='alpha' maskUnits='userSpaceOnUse' x='3' y='4' width='150' height='149'%3e%3cpath d='M153 78C153 119.421 119.421 153 78 153C36.5786 153 3 119.421 3 78C3 42.6044 27.5196 12.9356 60.5 5.0526C66.1145 3.71061 68 4 69.5 5.0526C71.6884 6.5883 62.5 20 69.5 31.5C76.5 43 89.5 39.5 101.5 53C107.488 59.7371 105.376 73.2409 117.5 79C137.5 88.5 151 71 153 78Z' fill='%23555555'/%3e%3c/mask%3e%3cg mask='url(%23mask0)'%3e%3cpath fill-rule='evenodd' clip-rule='evenodd' d='M78 153C119.421 153 153 119.421 153 78C153 36.5786 119.421 3 78 3C36.5786 3 3 36.5786 3 78C3 119.421 36.5786 153 78 153ZM57 41.5C57 45.6421 53.6421 49 49.5 49C45.3579 49 42 45.6421 42 41.5C42 37.3579 45.3579 34 49.5 34C53.6421 34 57 37.3579 57 41.5ZM83 74C83 79.5228 78.5228 84 73 84C67.4772 84 63 79.5228 63 74C63 68.4772 67.4772 64 73 64C78.5228 64 83 68.4772 83 74ZM54 117C54 122.523 49.5229 127 44 127C38.4772 127 34 122.523 34 117C34 111.477 38.4772 107 44 107C49.5229 107 54 111.477 54 117ZM119.5 122C123.642 122 127 118.642 127 114.5C127 110.358 123.642 107 119.5 107C115.358 107 112 110.358 112 114.5C112 118.642 115.358 122 119.5 122ZM32 83C34.7614 83 37 80.7614 37 78C37 75.2386 34.7614 73 32 73C29.2386 73 27 75.2386 27 78C27 80.7614 29.2386 83 32 83ZM88 111C88 113.761 85.7614 116 83 116C80.2386 116 78 113.761 78 111C78 108.239 80.2386 106 83 106C85.7614 106 88 108.239 88 111Z' fill='%23555555'/%3e%3c/g%3e%3c/svg%3e",
            fallback: Gn + "/cookie-none.png",
            width: 18
        });
        this.$blocked = this.initComponent(Ii, {
            selector: ".icon-blocked",
            src: "data:image/svg+xml,%3csvg width='155' height='155' viewBox='0 0 155 155' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cmask id='mask0' mask-type='alpha' maskUnits='userSpaceOnUse' x='3' y='4' width='150' height='149'%3e%3cpath fill-rule='evenodd' clip-rule='evenodd' d='M78 153C119.421 153 153 119.421 153 78C152.203 75.2117 149.582 76.3107 145.452 78.0421C139.214 80.6575 129.534 84.7159 117.5 79C115.427 78.0152 113.77 76.804 112.418 75.4389L43.3324 144.524C53.7009 149.939 65.4929 153 78 153ZM26.783 132.789L103.528 56.0443C102.962 54.931 102.304 53.9045 101.5 53C95.5 46.25 89.25 43.75 83.625 41.5C78 39.25 73 37.25 69.5 31.5C64.8464 23.8548 67.3474 15.3646 68.904 10.0807C69.6888 7.41648 70.2336 5.56736 69.5 5.05259C68 3.99999 66.1145 3.7106 60.5 5.05259C27.5196 12.9356 3 42.6044 3 78C3 99.6193 12.1474 119.102 26.783 132.789Z' fill='%23EB4040'/%3e%3c/mask%3e%3cg mask='url(%23mask0)'%3e%3cpath fill-rule='evenodd' clip-rule='evenodd' d='M78 153C119.421 153 153 119.421 153 78C153 36.5786 119.421 3 78 3C36.5786 3 3 36.5786 3 78C3 119.421 36.5786 153 78 153ZM57 41.5C57 45.6421 53.6421 49 49.5 49C45.3579 49 42 45.6421 42 41.5C42 37.3579 45.3579 34 49.5 34C53.6421 34 57 37.3579 57 41.5ZM83 74C83 79.5228 78.5228 84 73 84C67.4772 84 63 79.5228 63 74C63 68.4772 67.4772 64 73 64C78.5228 64 83 68.4772 83 74ZM54 117C54 122.523 49.5229 127 44 127C38.4772 127 34 122.523 34 117C34 111.477 38.4772 107 44 107C49.5229 107 54 111.477 54 117ZM119.5 122C123.642 122 127 118.642 127 114.5C127 110.358 123.642 107 119.5 107C115.358 107 112 110.358 112 114.5C112 118.642 115.358 122 119.5 122ZM32 83C34.7614 83 37 80.7614 37 78C37 75.2386 34.7614 73 32 73C29.2386 73 27 75.2386 27 78C27 80.7614 29.2386 83 32 83ZM88 111C88 113.761 85.7614 116 83 116C80.2386 116 78 113.761 78 111C78 108.239 80.2386 106 83 106C85.7614 106 88 108.239 88 111Z' fill='%23E25C5C'/%3e%3c/g%3e%3crect x='140.572' y='19' width='13' height='179' transform='rotate(45 140.572 19)' fill='%23555555'/%3e%3c/svg%3e",
            fallback: Gn + "/cookie-blocked.png",
            width: 18
        });
        this.$found = this.initComponent(Ii, {
            selector: ".icon-found",
            src: "data:image/svg+xml,%3csvg width='155' height='155' viewBox='0 0 155 155' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cmask id='mask0' mask-type='alpha' maskUnits='userSpaceOnUse' x='3' y='4' width='150' height='149'%3e%3cpath d='M153 78C153 119.421 119.421 153 78 153C36.5786 153 3 119.421 3 78C3 42.6044 27.5196 12.9356 60.5 5.05259C66.1145 3.7106 68 3.99999 69.5 5.05259C71.6884 6.58829 62.5 20 69.5 31.5C76.5 43 89.5 39.5 101.5 53C107.488 59.737 105.376 73.2409 117.5 79C137.5 88.5 151 71 153 78Z' fill='%23555555'/%3e%3c/mask%3e%3cg mask='url(%23mask0)'%3e%3cpath fill-rule='evenodd' clip-rule='evenodd' d='M78 153C119.421 153 153 119.421 153 78C153 36.5786 119.421 3 78 3C36.5786 3 3 36.5786 3 78C3 119.421 36.5786 153 78 153ZM57 41.5C57 45.6421 53.6421 49 49.5 49C45.3579 49 42 45.6421 42 41.5C42 37.3579 45.3579 34 49.5 34C53.6421 34 57 37.3579 57 41.5ZM83 74C83 79.5228 78.5228 84 73 84C67.4772 84 63 79.5228 63 74C63 68.4772 67.4772 64 73 64C78.5228 64 83 68.4772 83 74ZM54 117C54 122.523 49.5229 127 44 127C38.4772 127 34 122.523 34 117C34 111.477 38.4772 107 44 107C49.5229 107 54 111.477 54 117ZM119.5 122C123.642 122 127 118.642 127 114.5C127 110.358 123.642 107 119.5 107C115.358 107 112 110.358 112 114.5C112 118.642 115.358 122 119.5 122ZM32 83C34.7614 83 37 80.7614 37 78C37 75.2386 34.7614 73 32 73C29.2386 73 27 75.2386 27 78C27 80.7614 29.2386 83 32 83ZM88 111C88 113.761 85.7614 116 83 116C80.2386 116 78 113.761 78 111C78 108.239 80.2386 106 83 106C85.7614 106 88 108.239 88 111Z' fill='%2300838f'/%3e%3c/g%3e%3c/svg%3e",
            fallback: Gn + "/cookie-found.png",
            width: 18
        });
        "ie" === tt.Browser.type && 8 === tt.Browser.version ? (this.$none.css({
            display: "none"
        }), this.$blocked.css({
            display: "none"
        }), this.$found.css({
            display: "none"
        })) : (this.$none.css({
            opacity: 0
        }), this.$blocked.css({
            opacity: 0
        }), this.$found.css({
            opacity: 0
        }));
    }
    le.proto(Jn, ce);
    Jn.prototype.style = function () {
        this.css({
            width: 18,
            height: 18,
            display: "inline",
            position: "relative",
            background: "rgba(0,0,0,0)"
        });
        var t = {
            "-ms-high-contrast-adjust": "none",
            position: "absolute",
            left: 0,
            top: 0
        };
        this.$none.css(t);
        this.$blocked.css(t);
        this.$found.css(t);
    };
    Jn.prototype.display = function (t) {
        "ie" === tt.Browser.type && 8 === tt.Browser.version ? (this.$none.css({
            display: "none" === t ? "block" : "none"
        }), this.$blocked.css({
            display: "blocked" === t ? "block" : "none"
        }), this.$found.css({
            display: "found" === t ? "block" : "none"
        })) : (this.$none.css({
            opacity: "none" === t ? 1 : 0
        }), this.$blocked.css({
            opacity: "blocked" === t ? 1 : 0
        }), this.$found.css({
            opacity: "found" === t ? 1 : 0
        }));
    };
    var Xn = {
        noAccess: "Accessibility cookie is not set. {{retrieve-cookie}}",
        hasAccess: "Cookies are disabled or the accessibility cookie is not set. {{enable-cookies}}"
    };
    var Yn = "Accessibility cookie is set. For help, please email {{support}}";
    var Qn = "support@hcaptcha.com";
    function tr() {
        le.self(this, ce, "status");
        var t = this;
        this.state = {
            hasCookie: !1,
            hasAccess: !1,
            allowedAccess: !1
        };
        this.$header = this.createElement(".header");
        this.$header.copy = this.$header.createElement(".text");
        this.$header.setAttribute("aria-hidden", !0);
        this.icon = this.initComponent(Jn, null, this.$header);
        this.retrieve = this.initComponent(Mn, {
            text: Xn.noAccess,
            link: !0,
            linkText: "Retrieve accessibility cookie.",
            linkUnderline: !0,
            linkTranslate: !0,
            linkTo: "https://dashboard.hcaptcha.com/signup?type=accessibility",
            replaceText: "retrieve-cookie"
        });
        this.disabled = this.initComponent(Mn, {
            text: Xn.hasAccess,
            link: !0,
            linkText: "Enable cross-site cookies.",
            linkUnderline: !0,
            replaceText: "enable-cookies"
        });
        this.help = this.initComponent(Mn, {
            text: Yn,
            link: !0,
            linkText: Qn,
            linkUnderline: !0,
            linkTo: "mailto:" + Qn,
            replaceText: "support"
        });
        this.retrieve.dom.id = "status-retrieve";
        this.disabled.dom.id = "status-disabled";
        this.help.dom.id = "status-help";
        this.disabled.on("click", function () {
            At.requestAccess().then(function () {
                t.setType();
            });
        });
    }
    le.proto(tr, ce);
    tr.prototype.style = function (t) {
        this.css({
            fontSize: t,
            color: "#555555"
        });
        this.$header.css({
            fontWeight: 600,
            marginBottom: 5
        });
        this.$header.copy.css({
            display: "inline",
            position: "relative"
        });
        this.icon.style();
        this.icon.css({
            top: -2,
            marginLeft: 5
        });
        this.retrieve.style(t, "left");
        this.disabled.style(t, "left");
        this.help.style(t, "left");
        var e = this.state.hasCookie;
        this.help.css({
            display: e ? "block" : "none"
        });
        var i = !this.state.hasCookie && (!this.hasAccess || this.state.hasAccess && !this.state.allowedAccess);
        this.retrieve.css({
            display: i ? "block" : "none"
        });
        var n = !this.state.hasCookie && this.state.hasAccess && !this.state.allowedAccess;
        this.disabled.css({
            display: n ? "block" : "none"
        });
    };
    tr.prototype.checkAccess = function () {
        var t = this;
        xi.contact("get-ac").then(function (e) {
            t.state.hasCookie = !!e;
            At.supportsAPI() ? (t.state.hasAccess = !0, At.hasAccess().then(function (e) {
                t.state.allowedAccess = e;
                t.setType();
            })) : (t.state.hasAccess = !1, t.setType());
        });
    };
    tr.prototype.setType = function () {
        this.$header.copy.text(ge.translate("Status:"));
        var t = this.state.hasCookie;
        this.help.css({
            display: t ? "block" : "none"
        });
        var e = !this.state.hasCookie && (!this.hasAccess || this.state.hasAccess && !this.state.allowedAccess);
        this.retrieve.css({
            display: e ? "block" : "none"
        });
        var i = !this.state.hasCookie && this.state.hasAccess && !this.state.allowedAccess;
        this.disabled.css({
            display: i ? "block" : "none"
        });
        var n = this.state.hasCookie ? "found" : this.state.hasAccess ? "blocked" : "none";
        this.icon.display(n);
    };
    tr.prototype.translate = function () {
        this.$header.copy.text(ge.translate("Status:"));
        this.retrieve.translate();
        this.disabled.translate();
        this.help.translate();
    };
    function er() {
        le.self(this, ce, "accessibility");
        var t = this;
        this.copy = this.initComponent(Mn, {
            text: "To bypass our visual challenge, we offer an accessibility cookie.",
            link: !0,
            linkText: "Learn more about hCaptcha Accessibility.",
            linkUnderline: !0,
            linkTranslate: !0,
            linkTo: "https://hcaptcha.com/accessibility?ref=" + ct.host + "&utm_campaign=" + ct.sitekey + "&utm_medium=challenge"
        });
        this.copy.on("click", function (e) {
            e.preventDefault();
            _i(t.copy.state.linkTo);
        });
        this.status = this.initComponent(tr);
        this.status.checkAccess();
    }
    function ir() {
        le.self(this, ce, "challenge-modal");
        this.modalContent = null;
        this.state = {
            visible: !1,
            curr: null,
            prev: null
        };
        this.config = {
            width: 0,
            height: 0,
            mobile: !1
        };
        this.display = this.display.bind(this);
        this.close = this.close.bind(this);
        this.$container = this.createElement(".container");
        this.modal = this.initComponent(An, null, this.$container);
        this.modal.on("close", this.close);
        this.$bg = this.createElement(".modal-bg");
        this.$bg.addEventListener("click", this.close);
        var t = "ie" === tt.Browser.type && 8 === tt.Browser.version;
        this.css({
            visibility: "hidden",
            display: t ? "none" : "table",
            zIndex: -1
        });
    }
    function nr() {
        le.self(this, ce, null, ".challenge-container");
        this.handleResize = null;
        this.handleCheck = null;
        this.handleFocus = null;
        this.handleSubmit = null;
    }
    function rr() {
        le.self(this, ce, "display-error");
        this.visible = !1;
        this.setAttribute("aria-hidden", !0);
        this.setAttribute("role", "alert");
        this.copy = this.createElement(".error-text");
        this.appendElement(this.copy);
        this.setCopy.call(this);
        this.css({
            opacity: 0
        });
    }
    function or() {
        le.self(this, ce, "Crumb");
        this.$bg = this.createElement(".crumb-bg");
    }
    function sr() {
        le.self(this, ce, "challenge-breadcrumbs");
        this.width = 0;
        this.size = 0;
        this.crumbs = [];
        this.$wrapper = this.createElement(".crumbs-wrapper");
    }
    le.proto(er, ce);
    er.prototype.style = function (t) {
        var e = Math.floor(Zt(t, 250, 275, 12, 14));
        this.copy.style(e, "left");
        this.copy.css({
            position: "relative",
            display: "inline"
        });
        this.status.style(e);
        this.status.css({
            marginTop: 10
        });
    };
    er.prototype.setCopy = function () {
        this.copy.translate();
        this.status.translate();
    };
    le.proto(ir, ce);
    ir.prototype.load = function () {
        this.modal.load();
    };
    ir.prototype.style = function (t, e, i) {
        var n = Zt(t, 300, 450, 290, 375);
        var r = Zt(e, 275, 300, 260, 275);
        var o = n - 2 * Zt(t, 300, 450, 20, 25);
        var s = "ie" === tt.Browser.type && 8 === tt.Browser.version;
        this.css({
            position: "absolute",
            width: "100%",
            height: "100%",
            display: s && !this.state.visible ? "none" : "table",
            top: 0,
            left: 0
        });
        this.$container.css({
            display: "table-cell",
            verticalAlign: "middle"
        });
        this.$bg.css({
            position: "fixed",
            width: "100%",
            height: "100%",
            top: 0,
            left: 0,
            backgroundColor: "#000",
            opacity: 0,
            zindex: 0,
            cursor: "pointer"
        });
        this.config.width = o;
        this.config.height = r;
        this.config.mobile = i;
        this._styleContent();
    };
    ir.prototype._styleContent = function () {
        this.modal.style(this.config.width, this.config.height);
        this.modalContent && this.modalContent.style(this.config.width, this.config.height, this.config.mobile);
    };
    ir.prototype.close = function () {
        if (this.state.visible) {
            this.state.visible = !1;
            this.modalContent && (this.modalContent.off("close", this.close), this.modalContent = this.modalContent.destroy());
            var t = "ie" === tt.Browser.type && 8 === tt.Browser.version;
            this.css({
                visibility: "hidden",
                display: t ? "none" : "table",
                zIndex: -1
            });
            "report_image" === this.state.prev && "thanks" === this.state.curr && this.emit("refresh");
            this.emit("close");
        }
    };
    ir.prototype.display = function (t, e) {
        var i = this;
        var n = null;
        e || (e = {});
        this.modalContent && (this.modalContent = this.modalContent.destroy());
        this.state.prev = this.state.curr;
        this.state.curr = t;
        var r = null;
        "info" === t ? (n = Un, r = "Information") : "link" === t ? (n = On, r = "Confirm Navigation") : "feedback" === t ? (n = In, r = "Feedback", e.type = "feedback") : "report_bug" === t ? (n = In, r = "Software Bug", e.type = "bug") : "report_image" === t ? (n = In, r = "Tell Us Why", e.type = "image") : t.indexOf("thanks") >= 0 ? n = $n : t.indexOf("accessibility") >= 0 && (n = er, r = "Accessibility");
        this.state.visible && (this.modal.destroy(), this.modal = this.initComponent(An, null, this.$container), this.modal.load(), this.modal.on("close", this.close));
        this.modalContent = this.initComponent(n, e, this.modal.$content);
        this.modal.setTitle(r);
        this.modalContent.setCopy();
        this.modalContent.on("close", this.close);
        this.modalContent.on("change", this.display);
        this.modalContent.on("report", function (t) {
            i.emit("report", t);
        });
        this._styleContent();
        this.css({
            visibility: "visible",
            display: "table",
            zIndex: 200
        });
        this.modal.focus();
        this.state.visible = !0;
        this.emit("open");
    };
    ir.prototype.isOpen = function () {
        return this.state.visible;
    };
    le.proto(nr, ce);
    nr.prototype.style = function (t, e) {
        this.css({
            width: t,
            height: e,
            position: "relative",
            zIndex: 0
        });
    };
    nr.prototype.mount = function (t) {
        var e = this;
        this.appendElement(t);
        this.handleResize = function () {
            e.emit("resize");
        };
        this.handleSetAction = function (t) {
            e.emit("action-changed", t);
        };
        this.handleCheck = function (i) {
            var n = "skip";
            i ? n = t.breadcrumbs && t.served < t.breadcrumbs ? "next" : "check" : "landscape" === ct.orientation && t.breadcrumbs && t.served === t.breadcrumbs && (n = "check");
            e.emit("action-changed", n);
        };
        this.handleFocus = function () {
            e.emit("focus-check");
        };
        this.handleSubmit = function () {
            e.emit("submit");
        };
        t.on && t.on("set-action", this.handleSetAction);
        t.on && t.on("display-check", this.handleCheck);
        t.on && t.on("challenge-resize", this.handleResize);
        t.on && t.on("focus-check", this.handleFocus);
        t.on && t.on("submit", this.handleSubmit);
        this.isMounted = !0;
    };
    nr.prototype.unmount = function (t) {
        if (t.destroy) {
            try {
                t.off && t.off("display-check", this.handleCheck);
                t.off && t.off("challenge-resize", this.handleResize);
                t.off && t.off("focus-check", this.handleFocus);
                t.off && t.off("submit", this.handleSubmit);
                t.destroy();
            } catch (Oo) {}
        } else {
            this.removeElement(t);
        }
        this.isMounted = !1;
        return null;
    };
    le.proto(rr, ce);
    rr.prototype.style = function (t) {
        var e = Zi.get().palette;
        var i = "landscape" === ct.orientation && ("image_label_binary" === ct.challenge_type || "image_label_area_select" === ct.challenge_type || "image_drag_drop" === ct.challenge_type || "mfa" === ct.challenge_type);
        this.copy.css({
            display: "table-cell",
            verticalAlign: "middle"
        });
        this.css({
            display: "table",
            fontSize: t,
            color: e.warn.main,
            width: "100%",
            textAlign: i ? "left" : "right"
        });
    };
    rr.prototype.display = function (t) {
        this.css({
            opacity: t ? 1 : 0
        });
        this.visible = t;
        this.setAttribute("aria-hidden", !t);
    };
    rr.prototype.setCopy = function () {
        var t = ge.translate("Please try again.");
        this.copy.text(t + "  ⚠️");
    };
    le.proto(or, ce);
    or.prototype.style = function (t) {
        this.css({
            width: t,
            height: t,
            overflow: "hidden",
            borderRadius: "50%"
        });
        this.$bg.css({
            width: t,
            height: t
        });
    };
    or.prototype.active = function (t) {
        var e = function (t) {
            var e = t.palette;
            var i = t.component;
            return Pi.merge({
                main: {
                    fill: e.grey[200]
                },
                active: {
                    fill: e.primary.main
                }
            }, i.breadcrumb);
        }(Zi.get());
        this.$bg.css({
            backgroundColor: t ? e.active.fill : e.main.fill
        });
    };
    or.prototype.hide = function () {
        this.css({
            opacity: 0
        });
    };
    le.proto(sr, ce);
    sr.prototype.createCrumbs = function (t) {
        this.display = !0;
        for (var e = null, i = 0; i < t; i++) {
            e = this.initComponent(or, null, this.$wrapper);
            this.crumbs.push(e);
        }
    };
    sr.prototype.removeCrumbs = function () {
        this.display = !1;
        if (0 !== this.crumbs.length) {
            for (var t = -1; ++t < this.crumbs.length;) {
                this.crumbs[t].destroy();
            }
            this.crumbs = [];
        }
    };
    sr.prototype.style = function (t, e) {
        for (var i = e ? 6 : 7, n = e ? 4 : 5, r = -1; ++r < this.crumbs.length;) {
            this.crumbs[r].style(i);
            this.crumbs[r].css({
                left: r * i + r * n,
                top: 0,
                position: "absolute"
            });
        }
        this.css({
            width: t,
            height: i
        });
        var o = this.crumbs.length * i + n * (this.crumbs.length - 1);
        this.$wrapper.css({
            width: o,
            height: i,
            position: "absolute",
            left: (t - o) / 2
        });
        this.size = i;
        this.width = t;
        this.mobile = e;
    };
    sr.prototype.setIndex = function (t) {
        for (var e = -1; ++e < this.crumbs.length;) {
            this.crumbs[e].active(t === e);
        }
    };
    sr.prototype.hide = function () {
        for (var t = -1; ++t < this.crumbs.length;) {
            this.crumbs[t].hide();
        }
    };
    function ar() {
        le.self(this, Gi, {
            selector: "#menu-info",
            title: "Get information about hCaptcha and accessibility options.",
            label: "Get information about hCaptcha and accessibility options.",
            name: "info",
            src: "data:image/svg+xml,%3csvg width='25' height='25' viewBox='0 0 25 25' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3ccircle cx='12.5' cy='21.6' r='2' fill='%23787878'/%3e%3ccircle cx='12.5' cy='12.5' r='2' fill='%23787878'/%3e%3ccircle cx='12.5' cy='3.40002' r='2' fill='%23787878'/%3e%3c/svg%3e",
            theme: Zi,
            width: 35,
            height: 35
        });
        this._ignoreHighlight = !1;
    }
    le.proto(ar, Gi);
    ar.prototype.focus = function (t) {
        this._ignoreHighlight = t;
        this.dom.focus();
    };
    ar.prototype.onFocus = function (t) {
        if (this._ignoreHighlight) {
            this._ignoreHighlight = !1;
        } else {
            var e = this.state.style.focus.outline;
            this.css({
                outline: "2px solid " + e
            });
        }
    };
    function lr() {
        le.self(this, Gi, {
            title: "Refresh Challenge.",
            label: "Refresh Challenge.",
            name: "refresh",
            src: "data:image/svg+xml,%3csvg width='25' height='25' viewBox='0 0 25 25' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M20.9148 19.6529C20.9994 19.7239 21.0106 19.8501 20.9381 19.9335C19.5234 21.5598 17.6702 22.7467 15.5981 23.3506C13.4619 23.9733 11.1891 23.9485 9.06708 23.2794C6.94502 22.6103 5.06902 21.327 3.67632 19.5917C2.28361 17.8564 1.43675 15.7471 1.24283 13.5306C1.0489 11.314 1.51662 9.08969 2.58684 7.13894C3.65706 5.18818 5.28171 3.5986 7.25535 2.57119C9.22898 1.54378 11.463 1.12469 13.6748 1.36692C15.8203 1.6019 17.8514 2.44889 19.527 3.80487C19.6129 3.87435 19.6238 4.00065 19.5528 4.08527L18.3637 5.50245C18.2927 5.58707 18.1666 5.5979 18.0805 5.5288C16.746 4.45867 15.1329 3.79007 13.4298 3.60355C11.6604 3.40977 9.87319 3.74503 8.29428 4.56696C6.71537 5.38889 5.41565 6.66056 4.55948 8.22116C3.7033 9.78176 3.32913 11.5612 3.48427 13.3345C3.63941 15.1077 4.3169 16.7952 5.43106 18.1834C6.54522 19.5716 8.04602 20.5982 9.74367 21.1335C11.4413 21.6688 13.2596 21.6886 14.9685 21.1905C16.6133 20.7111 18.0858 19.7725 19.2142 18.4869C19.287 18.4039 19.413 18.3927 19.4976 18.4637L20.9148 19.6529Z' fill='%23787878'/%3e%3cpath d='M22.7248 7.93974C22.7557 8.07007 22.6522 8.19336 22.5185 8.18555L14.9712 7.74462C14.807 7.73502 14.7239 7.54239 14.8297 7.4164L20.6321 0.501257C20.7379 0.375269 20.942 0.423631 20.98 0.583657L22.7248 7.93974Z' fill='%23787878'/%3e%3c/svg%3e",
            theme: Zi,
            width: 35,
            height: 35,
            selectable: !1
        });
    }
    le.proto(lr, Gi);
    function cr(t) {
        var e = t.palette;
        var i = t.component;
        return Pi.merge({
            main: {
                fill: e.primary.main,
                text: e.common.white,
                border: e.primary.main
            },
            hover: {
                fill: e.primary.main,
                text: e.common.white,
                border: e.primary.main
            },
            focus: {
                outline: e.primary.main
            }
        }, i.verifyButton);
    }
    function hr(t) {
        var e = t.palette;
        var i = t.component;
        return Pi.merge({
            main: {
                fill: e.grey[700],
                text: e.common.white,
                border: e.grey[700]
            },
            hover: {
                fill: e.grey[800],
                text: e.common.white,
                border: e.grey[800]
            },
            focus: {
                outline: e.primary.main
            }
        }, i.skipButton);
    }
    function ur() {
        le.self(this, ce, "button-submit");
        this.state = {
            text: "Check",
            type: "check",
            label: "Verify Answers",
            locked: !1
        };
        this._verifyStyle = cr(Zi.get());
        this._skipStyle = hr(Zi.get());
        this.copy = this.createElement(".text");
        this.spinner = this.initComponent(kn, {
            src: "data:image/svg+xml,%3csvg width='17' height='16' viewBox='0 0 17 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cmask id='spinner-mask-1' fill='white'%3e%3cpath d='M8.5 0C10.0823 1.88682e-08 11.629 0.469192 12.9446 1.34824C14.2602 2.2273 15.2855 3.47673 15.891 4.93854C16.4965 6.40035 16.655 8.00888 16.3463 9.56073C16.0376 11.1126 15.2757 12.538 14.1568 13.6569C13.038 14.7757 11.6126 15.5376 10.0607 15.8463C8.50886 16.155 6.90033 15.9965 5.43852 15.391C3.97671 14.7855 2.72728 13.7601 1.84824 12.4446C0.969186 11.129 0.499997 9.58224 0.5 7.99998L2.9 7.99999C2.9 9.10756 3.22843 10.1903 3.84377 11.1112C4.4591 12.0321 5.3337 12.7499 6.35697 13.1737C7.38023 13.5976 8.5062 13.7085 9.5925 13.4924C10.6788 13.2763 11.6766 12.743 12.4598 11.9598C13.243 11.1766 13.7763 10.1788 13.9924 9.09251C14.2085 8.00622 14.0976 6.88024 13.6737 5.85698C13.2499 4.83371 12.5321 3.95911 11.6112 3.34377C10.6903 2.72843 9.60758 2.4 8.5 2.4V0Z'/%3e%3c/mask%3e%3cpath d='M8.5 0C10.0823 1.88682e-08 11.629 0.469192 12.9446 1.34824C14.2602 2.2273 15.2855 3.47673 15.891 4.93854C16.4965 6.40035 16.655 8.00888 16.3463 9.56073C16.0376 11.1126 15.2757 12.538 14.1568 13.6569C13.038 14.7757 11.6126 15.5376 10.0607 15.8463C8.50886 16.155 6.90033 15.9965 5.43852 15.391C3.97671 14.7855 2.72728 13.7601 1.84824 12.4446C0.969186 11.129 0.499997 9.58224 0.5 7.99998L2.9 7.99999C2.9 9.10756 3.22843 10.1903 3.84377 11.1112C4.4591 12.0321 5.3337 12.7499 6.35697 13.1737C7.38023 13.5976 8.5062 13.7085 9.5925 13.4924C10.6788 13.2763 11.6766 12.743 12.4598 11.9598C13.243 11.1766 13.7763 10.1788 13.9924 9.09251C14.2085 8.00622 14.0976 6.88024 13.6737 5.85698C13.2499 4.83371 12.5321 3.95911 11.6112 3.34377C10.6903 2.72843 9.60758 2.4 8.5 2.4V0Z' stroke='%23262D38' stroke-width='8' mask='url(%23spinner-mask-1)'/%3e%3c/svg%3e",
            selector: ".button-submit-spinner"
        });
        this.addClass("button");
        this.setAttribute("tabindex", 0);
        this.setAttribute("role", "button");
        this.setLabel.call(this);
        this.onHover = this.onHover.bind(this);
        this.onSelect = this.onSelect.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.addEventListener("click", this.onSelect);
        this.addEventListener("enter", this.onSelect);
        this.addEventListener("focus", this.onFocus);
        this.addEventListener("blur", this.onBlur);
        !1 === tt.System.mobile && (this.addEventListener("over", this.onHover), this.addEventListener("out", this.onHover));
    }
    function fr() {
        le.self(this, ce, "interface-challenge");
        var t = this;
        this.state = {
            loaded: !1,
            action: null,
            locked: !1,
            visible: !1,
            whiteLabel: !1
        };
        this.text = this.initComponent(rr);
        this.breadcrumbs = this.initComponent(sr);
        this.submit = this.initComponent(ur);
        this.submit.on("click", function () {
            t.emit("submit");
        });
    }
    function pr(t) {
        le.self(this, Ji, {
            selector: "display-language",
            theme: Zi,
            width: 26,
            height: 16,
            a11y: !0
        });
        this.$text.setAttribute("aria-hidden", !0);
        var e = this;
        this._theme = t.theme;
        this.on("style", function () {
            e.css({
                display: "block"
            });
        });
    }
    function dr() {
        le.self(this, ce, "language-selector");
        var t = this;
        this.state = {
            locked: !1
        };
        var e = tt.System.mobile;
        this.list = this.initComponent(e ? nn : gn, {
            theme: Zi,
            selector: "#language-list",
            optionsVisible: 5
        });
        this.display = this.initComponent(pr, {
            theme: Zi
        });
        this.display.ownsListBox(this.list);
        var i = [];
        for (var n in de) {
            i.push({
                value: n,
                text: de[n]
            });
        }
        this.list.setOptions(i);
        this.list.on("select", function (e) {
            t.display.setLocale(e.value);
            e.value !== ge.getLocale() && (ge.setLocale(e.value), xi.send("challenge-language", {
                locale: e.value
            }));
        });
        e || this.display.on("click", function (e) {
            e.selected ? (t.list.usingKb && t.list.usingKb(e.usingKb), t.list.open()) : t.list.hide();
        });
        this.list.on("hide", function () {
            t.display.reset();
        });
        this.style();
        this.updateLocale();
    }
    le.proto(ur, ce);
    ur.prototype.style = function (t) {
        var e = t ? 30 : 35;
        var i = "check" === this.state.type || "next" === this.state.type;
        this._verifyStyle = cr(Zi.get());
        this._skipStyle = hr(Zi.get());
        var n = function (t) {
            try {
                var e = t.palette;
                return t.component && t.component.challenge ? t.component.challenge.main.fill : e.common && e.common.white ? e.common.white : "#FFF";
            } catch (Oo) {
                return "#FFF";
            }
        }(Zi.get());
        this.css({
            height: e,
            cursor: "pointer",
            minWidth: t ? 50 : 70,
            padding: "0px 5px",
            outlineColor: "none",
            borderRadius: 4,
            border: "2px solid " + n,
            position: "relative"
        });
        var r = i ? this._verifyStyle.main.text : this._skipStyle.main.text;
        this.copy.css({
            color: r,
            width: "100%",
            height: "100%",
            textAlign: "center",
            position: "relative",
            pointerEvents: "none",
            lineHeight: e,
            fontSize: 14,
            fontWeight: 600,
            zIndex: 5
        });
        this.spinner.style(16, ht.white);
        this.spinner.css({
            position: "absolute",
            left: "50%",
            top: "50%",
            marginLeft: -8,
            marginTop: -8,
            zIndex: 6
        });
        this.height = e;
    };
    ur.prototype.showLoader = function () {
        this.spinner.setVisible(!0);
        this.spinner.startSpinning();
        this.copy.css({
            display: "none"
        });
    };
    ur.prototype.hideLoader = function () {
        this.spinner.setVisible(!1);
        this.spinner.stopSpinning();
        this.copy.css({
            display: "block"
        });
    };
    ur.prototype.action = function (t) {
        var e;
        var i = t.charAt(0).toUpperCase() + t.slice(1);
        var n = "loading" === t;
        var r = "check" === t || "next" === t || "report" === t ? this._verifyStyle.main.fill : this._skipStyle.main.fill;
        if (n) {
            e = "Loading";
            t = "loading";
            this.showLoader();
        } else {
            this.hideLoader();
            switch (t) {
                case "check":
                    e = "Verify Answers";
                    break;
                case "next":
                    e = "Next Challenge";
                    break;
                case "report":
                    e = "Report Images";
                    break;
                case "confirm":
                    e = "Confirm Code";
                    break;
                default:
                    e = "Skip Challenge";
                    t = "skip";
            }
        }
        this.state.type = t;
        this.state.text = i;
        this.state.label = e;
        this.css({
            backgroundColor: r
        });
        this.setLabel.call(this);
    };
    ur.prototype.onHover = function (t) {
        if (null !== this.emit && !0 !== this.state.locked) {
            var e = "over" === t.action;
            var i = "check" === this.state.type || "next" === this.state.type ? this._verifyStyle : this._skipStyle;
            var n = e ? "hover" : "main";
            this.css({
                backgroundColor: i[n].fill
            });
        }
    };
    ur.prototype.onSelect = function (t) {
        null !== this.emit && !0 !== this.state.locked && this.emit("click", t);
    };
    ur.prototype.onFocus = function (t) {
        var e = "check" === this.state.type ? "_verifyStyle" : "_skipStyle";
        var i = this[e].focus.border || this[e].focus.outline;
        this.css({
            outline: "2px solid " + i
        });
    };
    ur.prototype.onBlur = function (t) {
        this.css({
            outline: "none"
        });
    };
    ur.prototype.setLock = function (t) {
        this.state.locked = t;
        var e = "check" === this.state.type || "next" === this.state.type ? this._verifyStyle : this._skipStyle;
        this.css({
            cursor: t ? "default" : "pointer",
            backgroundColor: e.main.fill
        });
    };
    ur.prototype.setLabel = function () {
        var t = ge.translate(this.state.text);
        var e = ge.translate(this.state.label);
        ge.getLocale().indexOf("en") >= 0 && "check" === this.state.type && (t = "Verify");
        this.copy.text(t);
        this.setAttribute("title", e);
        this.setAttribute("aria-label", e);
    };
    ur.prototype.getElement = function () {
        return this && this.dom || null;
    };
    ur.prototype.removeAnimation = function () {
        this.spinner.stopSpinning();
    };
    le.proto(fr, ce);
    fr.prototype.removeCrumbs = function () {
        this.breadcrumbs.removeCrumbs();
    };
    fr.prototype.style = function (t, e, i) {
        var n = "landscape" === ct.orientation && ("image_label_binary" === ct.challenge_type || "image_label_area_select" === ct.challenge_type || "image_drag_drop" === ct.challenge_type || "mfa" === ct.challenge_type);
        var r = n ? e : 16;
        this.breadcrumbs.display && (this.breadcrumbs.style(t, i), this.breadcrumbs.css({
            position: "absolute",
            top: (r - this.breadcrumbs.size) / 2
        }));
        var o = i ? 11 : 12;
        this.text.style(o);
        this.text.css({
            position: "absolute",
            height: r,
            top: 0,
            right: n ? "auto" : 0,
            left: n ? 0 : "auto",
            width: n ? 140 : "100%"
        });
        this.submit.style(i);
        this.submit.css({
            position: "absolute",
            right: 0,
            bottom: 0,
            zIndex: 100
        });
        this.css({
            width: t,
            height: e
        });
        return {
            width: t,
            height: e
        };
    };
    fr.prototype.setAction = function (t) {
        this.state.action = t;
        this.submit.action(t);
    };
    fr.prototype.getAction = function () {
        return this.state.action;
    };
    fr.prototype.displayTryAgain = function (t) {
        this.text.display(t);
    };
    fr.prototype.setWhiteLabelEnabled = function (t) {
        this.state.whiteLabel = t;
    };
    fr.prototype.translate = function () {
        this.text.setCopy();
        this.submit.setLabel();
    };
    fr.prototype.setLock = function (t) {
        this.state.locked = t;
        this.submit.setLock(t);
    };
    fr.prototype.isLocked = function () {
        return this.state.locked;
    };
    fr.prototype.removeAnimations = function () {
        this.submit.removeAnimation();
    };
    le.proto(pr, Ji);
    pr.prototype.setLocale = function (t) {
        this.setText(ge.getShortLocale(t).toUpperCase());
        this.setA11yText(ge.getLangName(t));
    };
    pr.prototype.style = function () {
        var t = function (t) {
            var e = t.palette;
            var i = t.component;
            return Pi.merge({
                focus: {
                    outline: e.primary.main
                }
            }, i.button);
        }(this._theme.get());
        var e = "landscape" === ct.orientation && ("image_label_binary" === ct.challenge_type || "image_label_area_select" === ct.challenge_type || "image_drag_drop" === ct.challenge_type || "mfa" === ct.challenge_type);
        var i = e ? 14 : 11;
        var n = e ? 35 : 26;
        var r = e ? 35 : 16;
        this.state.width = n;
        this.state.height = r;
        this.css({
            display: "table",
            cursor: "pointer",
            textAlign: "center",
            fontWeight: 600,
            width: n,
            height: r,
            fontSize: i,
            outlineColor: t.focus.outline,
            borderRadius: 4
        });
        this.$text.css({
            display: "table-cell",
            verticalAlign: "middle"
        });
        this.a11yText.css({
            width: n,
            height: r
        });
    };
    le.proto(dr, ce);
    dr.prototype.style = function (t) {
        var e = "landscape" === ct.orientation && ("image_label_binary" === ct.challenge_type || "image_label_area_select" === ct.challenge_type || "image_drag_drop" === ct.challenge_type || "mfa" === ct.challenge_type);
        this.display.style();
        this.css({
            position: "relative",
            display: "inline-block",
            top: t ? 5 : 10,
            left: 0,
            zIndex: 100
        });
        this.list.style();
        this.list.css({
            bottom: e ? -128 : 30,
            left: e ? 45 : "auto"
        });
    };
    dr.prototype.getDimensions = function () {
        return {
            width: this.display.getWidth(),
            height: this.display.getHeight()
        };
    };
    dr.prototype.setLabel = function () {
        var t = this.list.getSelected().text;
        var e = ge.translate("Select a language {{language}}", {
            language: t
        });
        this.display.setLabel(e);
        this.display.setTitle(ge.translate("Language"));
    };
    dr.prototype.updateLocale = function () {
        this.list.select(ge.getLocale());
    };
    dr.prototype.setVisible = function (t) {
        this.css({
            display: t ? "block" : "none "
        });
    };
    dr.prototype.setLock = function (t) {
        this.state.locked = t;
        t ? this.list.setAttribute("disabled", t) : this.list.removeAttribute("disabled");
    };
    function mr(t) {
        le.self(this, ce, "hcaptcha-logo");
        this.mobile = !1;
        this.charity = t;
        var e = this.charity ? "data:image/svg+xml,%3csvg id='logo_charity' role='img' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 500 500'%3e%3crect x='306.25' y='418.75' width='56.25' height='56.25' style='fill:%230074bf%3bopacity:0.5%3bisolation:isolate'/%3e%3crect x='250' y='418.75' width='56.25' height='56.25' style='fill:%230074bf%3bopacity:0.699999988079071%3bisolation:isolate'/%3e%3crect x='193.75' y='418.75' width='56.25' height='56.25' style='fill:%230074bf%3bopacity:0.699999988079071%3bisolation:isolate'/%3e%3crect x='137.5' y='418.75' width='56.25' height='56.25' style='fill:%230074bf%3bopacity:0.5%3bisolation:isolate'/%3e%3crect x='362.5' y='362.5' width='56.25' height='56.25' style='fill:%230082bf%3bopacity:0.699999988079071%3bisolation:isolate'/%3e%3crect x='306.25' y='362.5' width='56.25' height='56.25' style='fill:%230082bf%3bopacity:0.800000011920929%3bisolation:isolate'/%3e%3crect x='250' y='362.5' width='56.25' height='56.25' style='fill:%230082bf'/%3e%3crect x='193.75' y='362.5' width='56.25' height='56.25' style='fill:%230082bf'/%3e%3crect x='137.5' y='362.5' width='56.25' height='56.25' style='fill:%230082bf%3bopacity:0.800000011920929%3bisolation:isolate'/%3e%3crect x='81.25' y='362.5' width='56.25' height='56.25' style='fill:%230082bf%3bopacity:0.699999988079071%3bisolation:isolate'/%3e%3crect x='418.75' y='306.25' width='56.25' height='56.25' style='fill:%23008fbf%3bopacity:0.5%3bisolation:isolate'/%3e%3crect x='362.5' y='306.25' width='56.25' height='56.25' style='fill:%23008fbf%3bopacity:0.800000011920929%3bisolation:isolate'/%3e%3crect x='306.25' y='306.25' width='56.25' height='56.25' style='fill:%23008fbf'/%3e%3crect x='250' y='306.25' width='56.25' height='56.25' style='fill:%23008fbf'/%3e%3crect x='193.75' y='306.25' width='56.25' height='56.25' style='fill:%23008fbf'/%3e%3crect x='137.5' y='306.25' width='56.25' height='56.25' style='fill:%23008fbf'/%3e%3crect x='81.25' y='306.25' width='56.25' height='56.25' style='fill:%23008fbf%3bopacity:0.800000011920929%3bisolation:isolate'/%3e%3crect x='25' y='306.25' width='56.25' height='56.25' style='fill:%23008fbf%3bopacity:0.5%3bisolation:isolate'/%3e%3crect x='418.75' y='250' width='56.25' height='56.25' style='fill:%23009dbf%3bopacity:0.699999988079071%3bisolation:isolate'/%3e%3crect x='362.5' y='250' width='56.25' height='56.25' style='fill:%23009dbf'/%3e%3crect x='306.25' y='250' width='56.25' height='56.25' style='fill:%23009dbf'/%3e%3crect x='250' y='250' width='56.25' height='56.25' style='fill:%23009dbf'/%3e%3crect x='193.75' y='250' width='56.25' height='56.25' style='fill:%23009dbf'/%3e%3crect x='137.5' y='250' width='56.25' height='56.25' style='fill:%23009dbf'/%3e%3crect x='81.25' y='250' width='56.25' height='56.25' style='fill:%23009dbf'/%3e%3crect x='25' y='250' width='56.25' height='56.25' style='fill:%23009dbf%3bopacity:0.699999988079071%3bisolation:isolate'/%3e%3crect x='418.75' y='193.75' width='56.25' height='56.25' style='fill:%2300abbf%3bopacity:0.699999988079071%3bisolation:isolate'/%3e%3crect x='362.5' y='193.75' width='56.25' height='56.25' style='fill:%2300abbf'/%3e%3crect x='306.25' y='193.75' width='56.25' height='56.25' style='fill:%2300abbf'/%3e%3crect x='250' y='193.75' width='56.25' height='56.25' style='fill:%2300abbf'/%3e%3crect x='193.75' y='193.75' width='56.25' height='56.25' style='fill:%2300abbf'/%3e%3crect x='137.5' y='193.75' width='56.25' height='56.25' style='fill:%2300abbf'/%3e%3crect x='81.25' y='193.75' width='56.25' height='56.25' style='fill:%2300abbf'/%3e%3crect x='25' y='193.75' width='56.25' height='56.25' style='fill:%2300abbf%3bopacity:0.699999988079071%3bisolation:isolate'/%3e%3crect x='418.75' y='137.5' width='56.25' height='56.25' style='fill:%2300b9bf%3bopacity:0.5%3bisolation:isolate'/%3e%3crect x='362.5' y='137.5' width='56.25' height='56.25' style='fill:%2300b9bf%3bopacity:0.800000011920929%3bisolation:isolate'/%3e%3crect x='306.25' y='137.5' width='56.25' height='56.25' style='fill:%2300b9bf'/%3e%3crect x='250' y='137.5' width='56.25' height='56.25' style='fill:%2300b9bf'/%3e%3crect x='193.75' y='137.5' width='56.25' height='56.25' style='fill:%2300b9bf'/%3e%3crect x='137.5' y='137.5' width='56.25' height='56.25' style='fill:%2300b9bf'/%3e%3crect x='81.25' y='137.5' width='56.25' height='56.25' style='fill:%2300b9bf%3bopacity:0.800000011920929%3bisolation:isolate'/%3e%3crect x='25' y='137.5' width='56.25' height='56.25' style='fill:%2300b9bf%3bopacity:0.5%3bisolation:isolate'/%3e%3crect x='362.5' y='81.25' width='56.25' height='56.25' style='fill:%2300c6bf%3bopacity:0.699999988079071%3bisolation:isolate'/%3e%3crect x='306.25' y='81.25' width='56.25' height='56.25' style='fill:%2300c6bf%3bopacity:0.800000011920929%3bisolation:isolate'/%3e%3crect x='250' y='81.25' width='56.25' height='56.25' style='fill:%2300c6bf'/%3e%3crect x='193.75' y='81.25' width='56.25' height='56.25' style='fill:%2300c6bf'/%3e%3crect x='137.5' y='81.25' width='56.25' height='56.25' style='fill:%2300c6bf%3bopacity:0.800000011920929%3bisolation:isolate'/%3e%3crect x='81.25' y='81.25' width='56.25' height='56.25' style='fill:%2300c6bf%3bopacity:0.699999988079071%3bisolation:isolate'/%3e%3crect x='306.25' y='25' width='56.25' height='56.25' style='fill:%2300d4bf%3bopacity:0.5%3bisolation:isolate'/%3e%3crect x='250' y='25' width='56.25' height='56.25' style='fill:%2300d4bf%3bopacity:0.699999988079071%3bisolation:isolate'/%3e%3crect x='193.75' y='25' width='56.25' height='56.25' style='fill:%2300d4bf%3bopacity:0.699999988079071%3bisolation:isolate'/%3e%3crect x='137.5' y='25' width='56.25' height='56.25' style='fill:%2300d4bf%3bopacity:0.5%3bisolation:isolate'/%3e%3cpath d='M190.87%2c158.6c36.33%2c0%2c46.52%2c26.05%2c59.6%2c34.41%2c12.11-8.36%2c22.29-34.41%2c59.59-34.41%2c36.34%2c0%2c65.18%2c29.8%2c66%2c67%2c2.78%2c54-90.26%2c135.93-125.63%2c159.19-36.34-23.26-128.42-105.16-126.6-159.19C125.69%2c188.4%2c153.56%2c158.6%2c190.87%2c158.6Z' style='fill:white'/%3e%3c/svg%3e" : "data:image/svg+xml,%3csvg width='32' height='32' viewBox='0 0 32 32' role='img' aria-hidden='true' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath opacity='0.5' d='M24 28H20V32H24V28Z' fill='%230074BF'/%3e%3cpath opacity='0.7' d='M20 28H16V32H20V28Z' fill='%230074BF'/%3e%3cpath opacity='0.7' d='M16 28H12V32H16V28Z' fill='%230074BF'/%3e%3cpath opacity='0.5' d='M12 28H8V32H12V28Z' fill='%230074BF'/%3e%3cpath opacity='0.7' d='M28 24H24V28H28V24Z' fill='%230082BF'/%3e%3cpath opacity='0.8' d='M24 24H20V28H24V24Z' fill='%230082BF'/%3e%3cpath d='M20 24H16V28H20V24Z' fill='%230082BF'/%3e%3cpath d='M16 24H12V28H16V24Z' fill='%230082BF'/%3e%3cpath opacity='0.8' d='M12 24H8V28H12V24Z' fill='%230082BF'/%3e%3cpath opacity='0.7' d='M8 24H4V28H8V24Z' fill='%230082BF'/%3e%3cpath opacity='0.5' d='M32 20H28V24H32V20Z' fill='%23008FBF'/%3e%3cpath opacity='0.8' d='M28 20H24V24H28V20Z' fill='%23008FBF'/%3e%3cpath d='M24 20H20V24H24V20Z' fill='%23008FBF'/%3e%3cpath d='M20 20H16V24H20V20Z' fill='%23008FBF'/%3e%3cpath d='M16 20H12V24H16V20Z' fill='%23008FBF'/%3e%3cpath d='M12 20H8V24H12V20Z' fill='%23008FBF'/%3e%3cpath opacity='0.8' d='M8 20H4V24H8V20Z' fill='%23008FBF'/%3e%3cpath opacity='0.5' d='M4 20H0V24H4V20Z' fill='%23008FBF'/%3e%3cpath opacity='0.7' d='M32 16H28V20H32V16Z' fill='%23009DBF'/%3e%3cpath d='M28 16H24V20H28V16Z' fill='%23009DBF'/%3e%3cpath d='M24 16H20V20H24V16Z' fill='%23009DBF'/%3e%3cpath d='M20 16H16V20H20V16Z' fill='%23009DBF'/%3e%3cpath d='M16 16H12V20H16V16Z' fill='%23009DBF'/%3e%3cpath d='M12 16H8V20H12V16Z' fill='%23009DBF'/%3e%3cpath d='M8 16H4V20H8V16Z' fill='%23009DBF'/%3e%3cpath opacity='0.7' d='M4 16H0V20H4V16Z' fill='%23009DBF'/%3e%3cpath opacity='0.7' d='M32 12H28V16H32V12Z' fill='%2300ABBF'/%3e%3cpath d='M28 12H24V16H28V12Z' fill='%2300ABBF'/%3e%3cpath d='M24 12H20V16H24V12Z' fill='%2300ABBF'/%3e%3cpath d='M20 12H16V16H20V12Z' fill='%2300ABBF'/%3e%3cpath d='M16 12H12V16H16V12Z' fill='%2300ABBF'/%3e%3cpath d='M12 12H8V16H12V12Z' fill='%2300ABBF'/%3e%3cpath d='M8 12H4V16H8V12Z' fill='%2300ABBF'/%3e%3cpath opacity='0.7' d='M4 12H0V16H4V12Z' fill='%2300ABBF'/%3e%3cpath opacity='0.5' d='M32 8H28V12H32V8Z' fill='%2300B9BF'/%3e%3cpath opacity='0.8' d='M28 8H24V12H28V8Z' fill='%2300B9BF'/%3e%3cpath d='M24 8H20V12H24V8Z' fill='%2300B9BF'/%3e%3cpath d='M20 8H16V12H20V8Z' fill='%2300B9BF'/%3e%3cpath d='M16 8H12V12H16V8Z' fill='%2300B9BF'/%3e%3cpath d='M12 8H8V12H12V8Z' fill='%2300B9BF'/%3e%3cpath opacity='0.8' d='M8 8H4V12H8V8Z' fill='%2300B9BF'/%3e%3cpath opacity='0.5' d='M4 8H0V12H4V8Z' fill='%2300B9BF'/%3e%3cpath opacity='0.7' d='M28 4H24V8H28V4Z' fill='%2300C6BF'/%3e%3cpath opacity='0.8' d='M24 4H20V8H24V4Z' fill='%2300C6BF'/%3e%3cpath d='M20 4H16V8H20V4Z' fill='%2300C6BF'/%3e%3cpath d='M16 4H12V8H16V4Z' fill='%2300C6BF'/%3e%3cpath opacity='0.8' d='M12 4H8V8H12V4Z' fill='%2300C6BF'/%3e%3cpath opacity='0.7' d='M8 4H4V8H8V4Z' fill='%2300C6BF'/%3e%3cpath opacity='0.5' d='M24 0H20V4H24V0Z' fill='%2300D4BF'/%3e%3cpath opacity='0.7' d='M20 0H16V4H20V0Z' fill='%2300D4BF'/%3e%3cpath opacity='0.7' d='M16 0H12V4H16V0Z' fill='%2300D4BF'/%3e%3cpath opacity='0.5' d='M12 0H8V4H12V0Z' fill='%2300D4BF'/%3e%3cpath d='M10.5141 14.9697L11.6379 12.4572C12.0459 11.8129 11.9958 11.0255 11.5449 10.5745C11.4876 10.5173 11.416 10.46 11.3444 10.4171C11.0366 10.2238 10.6572 10.1808 10.3065 10.2954C9.91993 10.4171 9.58349 10.6748 9.36875 11.0184C9.36875 11.0184 7.82972 14.6046 7.26421 16.2153C6.69871 17.8259 6.92062 20.7822 9.12536 22.987C11.4661 25.3277 14.8448 25.8575 17.0066 24.2397C17.0997 24.1967 17.1784 24.1395 17.2572 24.0751L23.9072 18.5202C24.2293 18.2554 24.7089 17.7042 24.2794 17.0743C23.8642 16.4586 23.0697 16.881 22.7404 17.0886L18.9107 19.8731C18.8391 19.9304 18.7318 19.9232 18.6673 19.8517C18.6673 19.8517 18.6673 19.8445 18.6602 19.8445C18.56 19.7228 18.5456 19.4079 18.696 19.2862L24.5657 14.304C25.074 13.8459 25.1456 13.1802 24.7304 12.7292C24.3295 12.2854 23.6924 12.2997 23.1842 12.7578L17.9157 16.881C17.8155 16.9597 17.6652 16.9454 17.5864 16.8452L17.5793 16.838C17.4719 16.7235 17.4361 16.5231 17.5506 16.4014L23.535 10.596C24.0074 10.1522 24.036 9.4149 23.5922 8.94245C23.3775 8.72054 23.084 8.59169 22.7762 8.59169C22.4612 8.59169 22.1606 8.70623 21.9387 8.92813L15.8255 14.6691C15.6823 14.8122 15.396 14.6691 15.3602 14.4973C15.3459 14.4328 15.3674 14.3684 15.4103 14.3255L20.0918 8.99972C20.5571 8.56306 20.5858 7.83292 20.1491 7.36763C19.7124 6.90234 18.9823 6.87371 18.517 7.31036C18.4955 7.32468 18.4812 7.34615 18.4597 7.36763L11.3659 15.2203C11.1082 15.478 10.736 15.4851 10.557 15.342C10.4425 15.2489 10.4282 15.0843 10.5141 14.9697Z' fill='white'/%3e%3c/svg%3e";
        var i = "https://newassets.hcaptcha.com/captcha/v1/a28812e910b57e4ac097884908bc2d05a8975c8a/static/images" + (this.charity ? "/icon-charity" : "/icon") + ".png";
        this.color = this.initComponent(Ii, {
            selector: ".logo",
            src: e,
            width: 32,
            fallback: i,
            autoLoad: !1
        });
    }
    function yr(t) {
        var e = t.palette;
        var i = t.component;
        return Pi.merge({
            focus: {
                outline: e.primary.main
            }
        }, i.logo);
    }
    function gr(t) {
        le.self(this, ce, "hcaptcha-logo");
        t || (t = {});
        this._theme = t.theme || Zi;
        this.state = {
            label: "hCaptcha",
            ariaLabel: "Visit hcaptcha.com to learn more about the service and its accessibility options.",
            style: yr(this._theme.get())
        };
        this.padding = 1.5;
        this.mobile = !1;
        this.link = "https://www.hcaptcha.com/what-is-hcaptcha-about?ref=" + ct.host + "&utm_campaign=" + ct.sitekey + "&utm_medium=challenge";
        this.icon = this.initComponent(mr, !!t.charity);
        this.setAttribute("tabindex", "0");
        this.setAttribute("role", "button");
        this.setAriaLabel();
        this.onOpenLink = this.onOpenLink.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.addEventListener("click", this.onOpenLink);
        this.addEventListener("enter", this.onOpenLink);
        this.addEventListener("focus", this.onFocus);
        this.addEventListener("blur", this.onBlur);
    }
    le.proto(mr, ce);
    mr.prototype.load = function () {
        this.color.load();
    };
    mr.prototype.style = function (t) {
        this.mobile = t;
        var e = 32;
        var i = this._parent && this._parent.padding || 0;
        this.css({
            width: e,
            height: e,
            position: "absolute",
            top: i,
            left: i
        });
        this.color.css({
            "-ms-high-contrast-adjust": "none",
            width: e,
            height: e,
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 5
        });
        return {
            width: e,
            height: e
        };
    };
    le.proto(gr, ce);
    gr.prototype.load = function () {
        this.icon.load();
    };
    gr.prototype.style = function (t, e) {
        t !== undefined && (this.mobile = t);
        var i = this.icon.style(this.mobile);
        var n = 2 * this.padding;
        this.css({
            display: e ? "block" : "none",
            width: i.width + n,
            height: i.height + n,
            left: "50%",
            marginLeft: -i.width / 2,
            cursor: "pointer",
            position: "absolute",
            borderRadius: 4
        });
        this.height = i.height;
    };
    gr.prototype.onOpenLink = function () {
        null !== this.fireEvent && _i(this.link + "&hl=" + ge.getLocale());
    };
    gr.prototype.onFocus = function () {
        var t = this.state.style.focus.outline;
        this.css({
            outline: "2px solid " + t
        });
    };
    gr.prototype.onBlur = function () {
        this.css({
            outline: "none"
        });
    };
    gr.prototype.setLabel = function () {
        var t = this.state.label;
        this.setAttribute("title", t);
    };
    gr.prototype.setAriaLabel = function () {
        var t = this.state.ariaLabel;
        this.setAttribute("aria-label", ge.translate(t));
    };
    var br = [{
        text: "Accessibility Cookie",
        label: "Accessibility: Retrieve Cookie",
        value: "accessibility",
        selector: "#accessibility",
        type: "modal"
    }, {
        text: "Report Image",
        label: "Report Image",
        value: "report_image",
        selector: "#report_image",
        type: "custom",
        warn: !0
    }, {
        text: "Report Bug",
        label: "Report Bug",
        value: "report_bug",
        selector: "#report_bug",
        type: "modal"
    }, {
        text: "Information",
        label: "Information",
        value: "info",
        selector: "#info",
        type: "modal"
    }];
    var vr = {
        visual_challenge: {
            text: "Visual Challenge",
            label: "Visual Challenge",
            value: "visual_challenge",
            selector: "#visual_challenge",
            type: "challenge"
        },
        text_challenge: {
            text: "Accessibility Challenge",
            label: "Accessibility: Text Challenge",
            value: "text_challenge",
            selector: "#text_challenge",
            type: "challenge"
        }
    };
    function wr() {
        le.self(this, gn, {
            isMenu: !0,
            theme: Zi,
            selector: "#menu",
            optionsVisible: -1
        });
        this.width = 250;
        this.state.a11yChallenge = !1;
        this.options = [];
        this.on("select", function (t) {
            t && ("link" === t.type ? _i(t.value) : "modal" === t.type ? this.emit("display", t.value) : "challenge" === t.type && ("text_challenge" === t.value && (ct.a11y_tfe = !0, this.emit("refresh")), "visual_challenge" === t.value && (ct.a11y_tfe = !1, this.emit("refresh"))));
        });
    }
    function xr() {
        le.self(this, ce, "interface-user");
        var t = this;
        this.state = {
            isRq: !1,
            loaded: !1,
            locked: !1,
            visible: !1,
            whiteLabel: !1
        };
        this.language = this.initComponent(dr);
        this.menu = this.initComponent(ar);
        this.menuList = this.initComponent(wr);
        this.refresh = this.initComponent(lr);
        this.logo = this.initComponent(gr);
        this.menu.controlsMenu(this.menuList);
        this.menu.on("click", function (e) {
            t.menuList.usingKb(e.usingKb);
            t.menuList.visible(e.selected, t.state.isRq);
        });
        this.menuList.on("hide", function () {
            t.menu.reset();
        });
        this.refresh.on("click", function () {
            t.emit("refresh");
        });
        this.menuList.on("select", function (e) {
            e && "report_image" === e.value && t.emit("report");
        });
        this.menuList.on("refresh", function () {
            t.refresh.dom.click();
        });
        this.menuList.on("display", function (e) {
            t.emit("display", e);
        });
    }
    le.proto(wr, gn);
    wr.prototype.setA11yChallenge = function (t) {
        this.state.a11yChallenge = t;
    };
    wr.prototype._setOptions = function (t) {
        var e;
        var i = "mfa" === ct.challenge_type;
        this.options = [];
        e = 0;
        for (; e < br.length; e++) {
            "report_image" === br[e].value && (t || i) || "accessibility" === br[e].value && i || this.options.push(br[e]);
        }
        this.state.a11yChallenge && this.options.splice(1, 0, ct.a11y_tfe ? vr.visual_challenge : vr.text_challenge);
        this.style(this.width);
        this.setOptions(this.options);
    };
    wr.prototype.visible = function (t, e) {
        t ? (this._setOptions(e), this.deselect(), this.open()) : this.hide();
    };
    le.proto(xr, ce);
    xr.prototype.refresh = function () {
        this.refresh.dom.click();
    };
    xr.prototype.load = function (t) {
        this.state.isRq = t;
        this.state.loaded || (this.menu.load(), this.refresh.load(), this.logo.load());
    };
    xr.prototype.setupLogo = function (t, e) {
        t && (this.logo.destroy(), this.logo = this.initComponent(gr, {
            charity: t,
            theme: Zi
        }), this.logo.load());
        this.logo.link = e || this.logo.link;
    };
    xr.prototype.style = function (t, e, i) {
        var n = "landscape" === ct.orientation && ("image_label_binary" === ct.challenge_type || "image_label_area_select" === ct.challenge_type || "image_drag_drop" === ct.challenge_type || "mfa" === ct.challenge_type);
        var r = !this.state.whiteLabel;
        var o = !this.state.whiteLabel;
        this.language.style(i);
        this.refresh.style(i);
        this.menu.style(i, r);
        this.logo.style(t < 400, o);
        if (n) {
            var s = this.language.getDimensions();
            var a = (e - (this.refresh.getHeight() + 16 + s.height)) / 2;
            this.language.css({
                top: a,
                left: (t - s.width) / 2,
                position: "absolute"
            });
            this.refresh.css({
                position: "absolute",
                top: a + 16 + s.height,
                bottom: "auto",
                left: r ? (t - this.refresh.getWidth()) / 2 : 0,
                zIndex: 100
            });
            this.menu.css({
                position: "absolute",
                left: (t - this.menu.getWidth()) / 2,
                bottom: 0,
                zIndex: 100
            });
            this.menuList.css({
                position: "absolute",
                zIndex: 1e3,
                left: this.menu.getWidth() + 10,
                bottom: 0
            });
            this.logo.css({
                top: 0,
                bottom: "auto"
            });
        } else {
            this.language.css({
                top: 0,
                left: 0,
                position: "absolute"
            });
            this.refresh.css({
                position: "absolute",
                top: "auto",
                bottom: (40 - this.menu.getHeight()) / 2,
                left: r ? this.menu.getWidth() + 10 : 0,
                zIndex: 100
            });
            this.menu.css({
                position: "absolute",
                left: 0,
                bottom: (40 - this.menu.getHeight()) / 2,
                zIndex: 100
            });
            this.menuList.css({
                position: "absolute",
                zIndex: 1e3,
                left: 0,
                bottom: this.menu.getHeight() + 10
            });
            this.logo.css({
                top: "auto",
                bottom: (40 - this.logo.height) / 2
            });
        }
        this.css({
            width: t,
            height: e
        });
        return {
            width: t,
            height: e
        };
    };
    xr.prototype.focus = function (t) {
        "menu" === t && this.menu.focus();
    };
    xr.prototype.displayLanguage = function (t) {
        this.language.setVisible(t);
    };
    xr.prototype.setWhiteLabel = function (t) {
        this.state.whiteLabel = t;
    };
    xr.prototype.enableRefresh = function (t) {
        this.refresh.enable(t);
    };
    xr.prototype.translate = function () {
        this.language.updateLocale();
        this.language.setLabel();
        this.menu.setCopy();
        this.refresh.setCopy();
        this.logo.setLabel();
        this.logo.setAriaLabel();
    };
    xr.prototype.setLock = function (t) {
        this.state.locked = t;
        this.language.setLock(t);
        this.menu.setLock(t);
        this.refresh.setLock(t);
    };
    xr.prototype.isLocked = function () {
        return this.state.locked;
    };
    var kr = null;
    function _r(t, e) {
        var i = this;
        e || (e = {});
        ct.host = e.host ? e.host : "";
        ct.sitekey = e.sitekey ? e.sitekey : "";
        ct.charity = !!e.charity;
        ct.orientation = e.orientation;
        var n = new gi();
        var r = {
            visible: !1,
            create: !1,
            locked: !1,
            timer: null,
            timerExpired: !1,
            preventClose: !1,
            focus: "challenge",
            interaction: "mouse"
        };
        t instanceof ae || (t = new ae(t));
        var o = new ae(".interface-wrapper");
        var s = new nr();
        var a = new fr();
        var l = new xr();
        var c = new ir();
        t.appendElement(o);
        o.appendElement(s);
        o.appendElement(l);
        o.appendElement(a);
        o.appendElement(c);
        l.on("display", c.display);
        t.setAttribute("aria-hidden", !0);
        ki = c;
        c.on("open", function () {
            r.preventClose = !0;
        });
        c.on("close", function () {
            r.visible && l.menu.focus();
            i.hideReport(!1);
            r.preventClose && (r.preventClose = !1, r.timerExpired && (r.timerExpired = !1, n.emit("refresh")));
        });
        s.on("action-changed", function (t) {
            a.setAction(t);
        });
        s.on("submit", function () {
            n.emit("submit");
        });
        s.on("focus-check", function () {
            n.emit("focus-check");
        });
        s.on("resize", function () {
            n.emit("resize");
        });
        a.on("submit", function () {
            n.emit("submit");
        });
        l.on("refresh", function () {
            n.emit("refresh");
        });
        l.on("report", function () {
            n.emit("report");
        });
        c.on("report", function (t) {
            n.emit("report-submission", t);
        });
        o.addEventListener("keydown", function (t) {
            r.interaction = "keyboard";
        });
        o.addEventListener("click", function (t) {
            r.interaction = "mouse";
        });
        i.events = n;
        i.addTheme = function (t, e) {
            Zi.add(t, e);
        };
        i.useTheme = function (t) {
            Zi.use(t);
        };
        i.size = function (t, e) {
            return i.style(t, e);
        };
        i.create = function (t) {
            r.create = !0;
            l.load(!!t.rq);
            l.displayLanguage(!t.rq);
            l.enableRefresh(!t.rq);
        };
        i.isMounted = function () {
            return !!kr;
        };
        i.init = function (t) {
            var e = t.charity && !0 === t.charity;
            l.setupLogo(e, t.link);
            t.a11yChallenge && l.menuList.setA11yChallenge(t.a11yChallenge);
        };
        i.setWhiteLabel = function (t) {
            l.setWhiteLabel(t);
        };
        i.setup = function (t, e) {
            return new Promise(function (i, n) {
                try {
                    kr && kr.type !== e.request_type && (s.unmount(kr), kr = null);
                    kr || (ct.challenge_type = e.request_type, kr = new t({
                        theme: {
                            name: Zi.active(),
                            config: Zi.get()
                        }
                    }), s.mount(kr));
                    a.removeCrumbs();
                    kr.setup(e, ct.orientation).then(i)["catch"](function (t) {
                        var e = t;
                        t instanceof Error && (e = {
                            event: it.CHALLENGE_ERROR,
                            message: "Challenge encountered an error during setup.",
                            reason: t.toString()
                        });
                        n(e);
                    });
                    kr.breadcrumbs && "number" == typeof kr.breadcrumbs && kr.breadcrumbs > 1 && (a.breadcrumbs.createCrumbs(kr.breadcrumbs), a.breadcrumbs.setIndex(kr.served));
                } catch (Oo) {
                    s.isMounted || (kr = null);
                    n({
                        event: it.CHALLENGE_ERROR,
                        message: "Creating challenge failed.",
                        reason: Oo.toString()
                    });
                }
            });
        };
        i.show = function (e) {
            if (!r.create) {
                return Promise.reject(new Error(et.CHALLENGE_ALREADY_CLOSED));
            }
            r.visible = !0;
            t.removeAttribute("aria-hidden");
            var n = Date.now();
            oi.resetData();
            oi.record(!0, !0, !0, !1);
            oi.setData("dct", n);
            ii.resetData();
            ii.record(!0, !0, !0, !1);
            ii.setData("dct", Date.now());
            var o = i.setup(e.bundle, e.bundleData);
            var s = i.style(e.width, e.height).then(function (e) {
                r.visible && (a.setLock(!1), l.setLock(!1), xi.contact("challenge-ready", e).then(function () {
                    var e = t.hasClass("using-kb");
                    l.menu.focus(!e);
                    i.focus();
                }));
            });
            return new Promise(function (t, i) {
                s["catch"](i);
                o.then(t, i);
                r.timer && clearTimeout(r.timer);
                r.timer = setTimeout(function () {
                    r.timerExpired = !0;
                    r.preventClose || i({
                        event: et.CHALLENGE_EXPIRED
                    });
                }, e.expiration);
            });
        };
        i.style = function (e, i) {
            return kr ? new Promise(function (n, r) {
                try {
                    kr.style(e, i).then(function (e) {
                        var i = 10;
                        var r = e.mobile ? 60 : 70;
                        var h = e.width;
                        var u = e.height + i + r;
                        s.style(e.width, e.height, i);
                        "landscape" !== ct.orientation || "image_label_binary" !== ct.challenge_type && "image_label_area_select" !== ct.challenge_type && "image_drag_drop" !== ct.challenge_type && "mfa" !== ct.challenge_type ? (a.style(e.width, r), a.css({
                            position: "absolute",
                            left: 0,
                            bottom: 0
                        }), l.style(e.width, r), l.css({
                            position: "absolute",
                            left: 0,
                            bottom: 0
                        }), s.css({
                            position: "relative",
                            marginBottom: i,
                            right: "auto"
                        })) : (r = 35, h = e.width + r + i, u = e.height + r + i, a.style(e.width, r), a.css({
                            position: "absolute",
                            right: 0,
                            bottom: 0
                        }), l.style(r, u), l.css({
                            position: "absolute",
                            left: 0,
                            bottom: 0
                        }), s.css({
                            position: "absolute",
                            top: 0,
                            left: r + i
                        }));
                        o.css({
                            width: h,
                            height: u,
                            margin: i,
                            position: "relative"
                        });
                        t.css({
                            width: h + 20,
                            height: u + 20
                        });
                        c.style(h, u, e.mobile);
                        c.load();
                        n({
                            width: h + 20,
                            height: u + 20,
                            mobile: e.mobile
                        });
                    })["catch"](function (t) {
                        r({
                            event: it.CHALLENGE_ERROR,
                            message: "Error occurred in promise of .style()",
                            reason: t.toString()
                        });
                    });
                } catch (Oo) {
                    r({
                        event: it.CHALLENGE_ERROR,
                        message: "Error when calling .style()",
                        reason: Oo.toString()
                    });
                }
            }) : Promise.resolve({
                width: 0,
                height: 0,
                mobile: !1
            });
        };
        i.submit = function () {
            return i.hasBreadcrumbs() && i.getTotalServed() !== i.getTotalBreadcrumbs() || "skip" !== a.getAction() ? new Promise(function (t, e) {
                try {
                    kr && kr.submit();
                    if (i.hasBreadcrumbs()) {
                        var n = i.getTotalServed();
                        a.breadcrumbs.setIndex(n);
                    }
                    t("challenge-complete");
                    null !== r._timer && "check" === a.getAction() && (clearTimeout(r._timer), r._timer = null);
                } catch (Oo) {
                    e(Oo);
                }
            }) : Promise.resolve("challenge-skip");
        };
        i.displayReport = function (t) {
            return new Promise(function (e, n) {
                try {
                    if (!i.isMounted()) {
                        return e();
                    }
                    if (!i.canReport()) {
                        var r;
                        if ("fallback" === t.request_type) {
                            r = t.key;
                        } else {
                            var o = i.hasBreadcrumbs() ? i.getTotalServed() - 1 : 0;
                            r = t.tasklist[o].task_key;
                        }
                        return e(r);
                    }
                    i.report().then(e);
                    a.breadcrumbs && a.breadcrumbs.hide();
                } catch (Po) {
                    n(Po);
                }
            });
        };
        i.hideReport = function () {
            kr && kr.report && kr.report(!1);
        };
        i.close = function () {
            kr && (kr = s.unmount(kr));
            r.timer && clearTimeout(r.timer);
            r.timer = null;
            t.setAttribute("aria-hidden", !0);
            a.displayTryAgain(!1);
            a.removeCrumbs();
            a.removeAnimations();
            c.close();
            r.visible = !1;
            r.create = !1;
        };
        i.translateInterface = function (t) {
            if (t && t.locale && t.table) {
                try {
                    t.table && (ge.setLocale(t.locale), ge.addTable(t.locale, t.table));
                    kr && kr.translate && kr.translate();
                    a.translate();
                    l.translate();
                    document.documentElement.setAttribute("lang", ge.getLocale());
                } catch (Oo) {
                    Ct("translation", Oo);
                }
            }
        };
        i.translateBundle = function () {
            kr && kr.translate && kr.translate();
        };
        i.isVisible = function () {
            return r.visible;
        };
        i.setFocus = function (t) {
            r.focus = t;
        };
        i.triggerFocus = function (t, e) {
            "submit" === t ? a.submit.focus() : i.focus(e);
        };
        i.isInterfaceLocked = function () {
            return r.locked;
        };
        i.lockInterface = function (t) {
            r.locked = t;
            a.setLock(t);
            l.setLock(t);
        };
        i.hasActiveElement = function () {
            return document.activeElement === a.submit.dom || document.activeElement === l.refresh.dom || document.activeElement === l.menu.dom;
        };
        i.getActiveElement = function () {
            return document.activeElement === a.submit.dom ? "submit" : document.activeElement === l.refresh.dom ? "refresh" : document.activeElement === l.menu.dom ? "menu" : null;
        };
        i.getModal = function () {
            return c;
        };
        i.getTotalServed = function () {
            return kr.served;
        };
        i.getTotalBreadcrumbs = function () {
            return kr ? kr.breadcrumbs : 0;
        };
        i.hasBreadcrumbs = function () {
            return !(!kr || !kr.breadcrumbs);
        };
        i.canReport = function () {
            return kr.report && "function" == typeof kr.report;
        };
        i.report = function () {
            return new Promise(function (t) {
                function e(i) {
                    kr.off("report-image", e);
                    t(i);
                }
                kr.report(!0);
                kr.on("report-image", e);
            });
        };
        i.focus = function (t) {
            kr && kr.setFocus && kr.setFocus(t || 0, r.interaction);
        };
        i.displayTryAgain = function (t) {
            a.displayTryAgain(t);
        };
        i.enableA11yChallenge = function (t) {
            l.menuList.setA11yChallenge(t);
        };
        return i;
    }
    !function (t) {
        if ("object" == typeof exports && "undefined" != typeof module) {
            module.exports = t();
        } else {
            if ("function" == typeof define && define.amd) {
                define("raven-js", t);
            } else {
                ("undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this).msgpack = t();
            }
        }
    }(function () {
        return function t(e, i, n) {
            function r(s, a) {
                if (!i[s]) {
                    if (!e[s]) {
                        var l = "function" == typeof require && require;
                        if (!a && l) {
                            return l(s, !0);
                        }
                        if (o) {
                            return o(s, !0);
                        }
                        var c = new Error("Cannot find module '" + s + "'");
                        c.code = "MODULE_NOT_FOUND";
                        throw c;
                    }
                    var h = i[s] = {
                        exports: {}
                    };
                    e[s][0].call(h.exports, function (t) {
                        var i = e[s][1][t];
                        return r(i || t);
                    }, h, h.exports, t, e, i, n);
                }
                return i[s].exports;
            }
            for (var o = "function" == typeof require && require, s = 0; s < n.length; s++) {
                r(n[s]);
            }
            return r;
        }({
            1: [function (t, e, i) {
                i.encode = t("./encode").encode;
                i.decode = t("./decode").decode;
                i.Encoder = t("./encoder").Encoder;
                i.Decoder = t("./decoder").Decoder;
                i.createCodec = t("./ext").createCodec;
                i.codec = t("./codec").codec;
            }, {
                "./codec": 10,
                "./decode": 12,
                "./decoder": 13,
                "./encode": 15,
                "./encoder": 16,
                "./ext": 20
            }],
            2: [function (t, e, i) {
                (function (t) {
                    function i(t) {
                        return t && t.isBuffer && t;
                    }
                    e.exports = i(void 0 !== t && t) || i(this.Buffer) || i("undefined" != typeof window && window.Buffer) || this.Buffer;
                }).call(this, t("buffer").Buffer);
            }, {
                buffer: 29
            }],
            3: [function (t, e, i) {
                i.copy = function (t, e, i, n) {
                    var r;
                    i || (i = 0);
                    n || 0 === n || (n = this.length);
                    e || (e = 0);
                    var o = n - i;
                    if (t === this && i < e && e < n) {
                        for (r = o - 1; r >= 0; r--) {
                            t[r + e] = this[r + i];
                        }
                    } else {
                        for (r = 0; r < o; r++) {
                            t[r + e] = this[r + i];
                        }
                    }
                    return o;
                };
                i.toString = function (t, e, i) {
                    var n = this;
                    var r = 0 | e;
                    i || (i = n.length);
                    for (var o = "", s = 0; r < i;) {
                        (s = n[r++]) < 128 ? o += String.fromCharCode(s) : (192 == (224 & s) ? s = (31 & s) << 6 | 63 & n[r++] : 224 == (240 & s) ? s = (15 & s) << 12 | (63 & n[r++]) << 6 | 63 & n[r++] : 240 == (248 & s) && (s = (7 & s) << 18 | (63 & n[r++]) << 12 | (63 & n[r++]) << 6 | 63 & n[r++]), s >= 65536 ? (s -= 65536, o += String.fromCharCode(55296 + (s >>> 10), 56320 + (1023 & s))) : o += String.fromCharCode(s));
                    }
                    return o;
                };
                i.write = function (t, e) {
                    for (var i = this, n = e || (e |= 0), r = t.length, o = 0, s = 0; s < r;) {
                        (o = t.charCodeAt(s++)) < 128 ? i[n++] = o : o < 2048 ? (i[n++] = 192 | o >>> 6, i[n++] = 128 | 63 & o) : o < 55296 || o > 57343 ? (i[n++] = 224 | o >>> 12, i[n++] = 128 | o >>> 6 & 63, i[n++] = 128 | 63 & o) : (o = 65536 + (o - 55296 << 10 | t.charCodeAt(s++) - 56320), i[n++] = 240 | o >>> 18, i[n++] = 128 | o >>> 12 & 63, i[n++] = 128 | o >>> 6 & 63, i[n++] = 128 | 63 & o);
                    }
                    return n - e;
                };
            }, {}],
            4: [function (t, e, i) {
                function n(t) {
                    return new Array(t);
                }
                var r = t("./bufferish");
                (i = e.exports = n(0)).alloc = n;
                i.concat = r.concat;
                i.from = function (t) {
                    if (!r.isBuffer(t) && r.isView(t)) {
                        t = r.Uint8Array.from(t);
                    } else {
                        if (r.isArrayBuffer(t)) {
                            t = new Uint8Array(t);
                        } else {
                            if ("string" == typeof t) {
                                return r.from.call(i, t);
                            }
                            if ("number" == typeof t) {
                                throw new TypeError('"value" argument must not be a number');
                            }
                        }
                    }
                    return Array.prototype.slice.call(t);
                };
            }, {
                "./bufferish": 8
            }],
            5: [function (t, e, i) {
                function n(t) {
                    return new o(t);
                }
                var r = t("./bufferish");
                var o = r.global;
                (i = e.exports = r.hasBuffer ? n(0) : []).alloc = r.hasBuffer && o.alloc || n;
                i.concat = r.concat;
                i.from = function (t) {
                    if (!r.isBuffer(t) && r.isView(t)) {
                        t = r.Uint8Array.from(t);
                    } else {
                        if (r.isArrayBuffer(t)) {
                            t = new Uint8Array(t);
                        } else {
                            if ("string" == typeof t) {
                                return r.from.call(i, t);
                            }
                            if ("number" == typeof t) {
                                throw new TypeError('"value" argument must not be a number');
                            }
                        }
                    }
                    return o.from && 1 !== o.from.length ? o.from(t) : new o(t);
                };
            }, {
                "./bufferish": 8
            }],
            6: [function (t, e, i) {
                function n(t, e, i, n) {
                    var a = s.isBuffer(this);
                    var l = s.isBuffer(t);
                    if (a && l) {
                        return this.copy(t, e, i, n);
                    }
                    if (c || a || l || !s.isView(this) || !s.isView(t)) {
                        return o.copy.call(this, t, e, i, n);
                    }
                    var h = i || null != n ? r.call(this, i, n) : this;
                    t.set(h, e);
                    return h.length;
                }
                function r(t, e) {
                    var i = this.slice || !c && this.subarray;
                    if (i) {
                        return i.call(this, t, e);
                    }
                    var r = s.alloc.call(this, e - t);
                    n.call(this, r, 0, t, e);
                    return r;
                }
                var o = t("./buffer-lite");
                i.copy = n;
                i.slice = r;
                i.toString = function (t, e, i) {
                    var n = !l && s.isBuffer(this) ? this.toString : o.toString;
                    return n.apply(this, arguments);
                };
                i.write = function (t) {
                    return function () {
                        var e = this[t] || o[t];
                        return e.apply(this, arguments);
                    };
                }("write");
                var s = t("./bufferish");
                var a = s.global;
                var l = s.hasBuffer && "TYPED_ARRAY_SUPPORT" in a;
                var c = l && !a.TYPED_ARRAY_SUPPORT;
            }, {
                "./buffer-lite": 3,
                "./bufferish": 8
            }],
            7: [function (t, e, i) {
                function n(t) {
                    return new Uint8Array(t);
                }
                var r = t("./bufferish");
                (i = e.exports = r.hasArrayBuffer ? n(0) : []).alloc = n;
                i.concat = r.concat;
                i.from = function (t) {
                    if (r.isView(t)) {
                        var e = t.byteOffset;
                        var n = t.byteLength;
                        (t = t.buffer).byteLength !== n && (t.slice ? t = t.slice(e, e + n) : (t = new Uint8Array(t)).byteLength !== n && (t = Array.prototype.slice.call(t, e, e + n)));
                    } else {
                        if ("string" == typeof t) {
                            return r.from.call(i, t);
                        }
                        if ("number" == typeof t) {
                            throw new TypeError('"value" argument must not be a number');
                        }
                    }
                    return new Uint8Array(t);
                };
            }, {
                "./bufferish": 8
            }],
            8: [function (t, e, i) {
                function n(t) {
                    return o(this).alloc(t);
                }
                function r(t) {
                    var e = 3 * t.length;
                    var i = n.call(this, e);
                    var r = g.write.call(i, t);
                    e !== r && (i = g.slice.call(i, 0, r));
                    return i;
                }
                function o(t) {
                    return f(t) ? m : p(t) ? y : u(t) ? d : c ? m : h ? y : d;
                }
                function s() {
                    return !1;
                }
                function a(t, e) {
                    t = "[object " + t + "]";
                    return function (i) {
                        return null != i && {}.toString.call(e ? i[e] : i) === t;
                    };
                }
                var l = i.global = t("./buffer-global");
                var c = i.hasBuffer = l && !!l.isBuffer;
                var h = i.hasArrayBuffer = "undefined" != typeof ArrayBuffer;
                var u = i.isArray = t("isarray");
                i.isArrayBuffer = h ? function (t) {
                    return t instanceof ArrayBuffer || b(t);
                } : s;
                var f = i.isBuffer = c ? l.isBuffer : s;
                var p = i.isView = h ? ArrayBuffer.isView || a("ArrayBuffer", "buffer") : s;
                i.alloc = n;
                i.concat = function (t, e) {
                    e || (e = 0, Array.prototype.forEach.call(t, function (t) {
                        e += t.length;
                    }));
                    var r = this !== i && this || t[0];
                    var o = n.call(r, e);
                    var s = 0;
                    Array.prototype.forEach.call(t, function (t) {
                        s += g.copy.call(t, o, s);
                    });
                    return o;
                };
                i.from = function (t) {
                    return "string" == typeof t ? r.call(this, t) : o(this).from(t);
                };
                var d = i.Array = t("./bufferish-array");
                var m = i.Buffer = t("./bufferish-buffer");
                var y = i.Uint8Array = t("./bufferish-uint8array");
                var g = i.prototype = t("./bufferish-proto");
                var b = a("ArrayBuffer");
            }, {
                "./buffer-global": 2,
                "./bufferish-array": 4,
                "./bufferish-buffer": 5,
                "./bufferish-proto": 6,
                "./bufferish-uint8array": 7,
                isarray: 34
            }],
            9: [function (t, e, i) {
                function n(t) {
                    return this instanceof n ? (this.options = t, void this.init()) : new n(t);
                }
                function r(t, e) {
                    return t && e ? function () {
                        t.apply(this, arguments);
                        return e.apply(this, arguments);
                    } : t || e;
                }
                function o(t) {
                    return new n(t);
                }
                var s = t("isarray");
                i.createCodec = o;
                i.install = function (t) {
                    for (var e in t) {
                        n.prototype[e] = r(n.prototype[e], t[e]);
                    }
                };
                i.filter = function (t) {
                    return s(t) ? function (t) {
                        function e(t, e) {
                            return e(t);
                        }
                        t = t.slice();
                        return function (i) {
                            return t.reduce(e, i);
                        };
                    }(t) : t;
                };
                var a = t("./bufferish");
                n.prototype.init = function () {
                    var t = this.options;
                    t && t.uint8array && (this.bufferish = a.Uint8Array);
                    return this;
                };
                i.preset = o({
                    preset: !0
                });
            }, {
                "./bufferish": 8,
                isarray: 34
            }],
            10: [function (t, e, i) {
                t("./read-core");
                t("./write-core");
                i.codec = {
                    preset: t("./codec-base").preset
                };
            }, {
                "./codec-base": 9,
                "./read-core": 22,
                "./write-core": 25
            }],
            11: [function (t, e, i) {
                function n(t) {
                    if (!(this instanceof n)) {
                        return new n(t);
                    }
                    if (t && (this.options = t, t.codec)) {
                        var e = this.codec = t.codec;
                        e.bufferish && (this.bufferish = e.bufferish);
                    }
                }
                i.DecodeBuffer = n;
                var r = t("./read-core").preset;
                t("./flex-buffer").FlexDecoder.mixin(n.prototype);
                n.prototype.codec = r;
                n.prototype.fetch = function () {
                    return this.codec.decode(this);
                };
            }, {
                "./flex-buffer": 21,
                "./read-core": 22
            }],
            12: [function (t, e, i) {
                i.decode = function (t, e) {
                    var i = new n(e);
                    i.write(t);
                    return i.read();
                };
                var n = t("./decode-buffer").DecodeBuffer;
            }, {
                "./decode-buffer": 11
            }],
            13: [function (t, e, i) {
                function n(t) {
                    return this instanceof n ? void o.call(this, t) : new n(t);
                }
                i.Decoder = n;
                var r = t("event-lite");
                var o = t("./decode-buffer").DecodeBuffer;
                n.prototype = new o();
                r.mixin(n.prototype);
                n.prototype.decode = function (t) {
                    arguments.length && this.write(t);
                    this.flush();
                };
                n.prototype.push = function (t) {
                    this.emit("data", t);
                };
                n.prototype.end = function (t) {
                    this.decode(t);
                    this.emit("end");
                };
            }, {
                "./decode-buffer": 11,
                "event-lite": 31
            }],
            14: [function (t, e, i) {
                function n(t) {
                    if (!(this instanceof n)) {
                        return new n(t);
                    }
                    if (t && (this.options = t, t.codec)) {
                        var e = this.codec = t.codec;
                        e.bufferish && (this.bufferish = e.bufferish);
                    }
                }
                i.EncodeBuffer = n;
                var r = t("./write-core").preset;
                t("./flex-buffer").FlexEncoder.mixin(n.prototype);
                n.prototype.codec = r;
                n.prototype.write = function (t) {
                    this.codec.encode(this, t);
                };
            }, {
                "./flex-buffer": 21,
                "./write-core": 25
            }],
            15: [function (t, e, i) {
                i.encode = function (t, e) {
                    var i = new n(e);
                    i.write(t);
                    return i.read();
                };
                var n = t("./encode-buffer").EncodeBuffer;
            }, {
                "./encode-buffer": 14
            }],
            16: [function (t, e, i) {
                function n(t) {
                    return this instanceof n ? void o.call(this, t) : new n(t);
                }
                i.Encoder = n;
                var r = t("event-lite");
                var o = t("./encode-buffer").EncodeBuffer;
                n.prototype = new o();
                r.mixin(n.prototype);
                n.prototype.encode = function (t) {
                    this.write(t);
                    this.emit("data", this.read());
                };
                n.prototype.end = function (t) {
                    arguments.length && this.encode(t);
                    this.flush();
                    this.emit("end");
                };
            }, {
                "./encode-buffer": 14,
                "event-lite": 31
            }],
            17: [function (t, e, i) {
                i.ExtBuffer = function r(t, e) {
                    return this instanceof r ? (this.buffer = n.from(t), void (this.type = e)) : new r(t, e);
                };
                var n = t("./bufferish");
            }, {
                "./bufferish": 8
            }],
            18: [function (t, e, i) {
                function n(e) {
                    a || (a = t("./encode").encode);
                    return a(e);
                }
                function r(t) {
                    return t.valueOf();
                }
                function o(t) {
                    (t = RegExp.prototype.toString.call(t).split("/")).shift();
                    var e = [t.pop()];
                    e.unshift(t.join("/"));
                    return e;
                }
                function s(t) {
                    var e = {};
                    for (var i in u) {
                        e[i] = t[i];
                    }
                    return e;
                }
                i.setExtPackers = function (t) {
                    t.addExtPacker(14, Error, [s, n]);
                    t.addExtPacker(1, EvalError, [s, n]);
                    t.addExtPacker(2, RangeError, [s, n]);
                    t.addExtPacker(3, ReferenceError, [s, n]);
                    t.addExtPacker(4, SyntaxError, [s, n]);
                    t.addExtPacker(5, TypeError, [s, n]);
                    t.addExtPacker(6, URIError, [s, n]);
                    t.addExtPacker(10, RegExp, [o, n]);
                    t.addExtPacker(11, Boolean, [r, n]);
                    t.addExtPacker(12, String, [r, n]);
                    t.addExtPacker(13, Date, [Number, n]);
                    t.addExtPacker(15, Number, [r, n]);
                    "undefined" != typeof Uint8Array && (t.addExtPacker(17, Int8Array, h), t.addExtPacker(18, Uint8Array, h), t.addExtPacker(19, Int16Array, h), t.addExtPacker(20, Uint16Array, h), t.addExtPacker(21, Int32Array, h), t.addExtPacker(22, Uint32Array, h), t.addExtPacker(23, Float32Array, h), "undefined" != typeof Float64Array && t.addExtPacker(24, Float64Array, h), "undefined" != typeof Uint8ClampedArray && t.addExtPacker(25, Uint8ClampedArray, h), t.addExtPacker(26, ArrayBuffer, h), t.addExtPacker(29, DataView, h));
                    l.hasBuffer && t.addExtPacker(27, c, l.from);
                };
                var a;
                var l = t("./bufferish");
                var c = l.global;
                var h = l.Uint8Array.from;
                var u = {
                    name: 1,
                    message: 1,
                    stack: 1,
                    columnNumber: 1,
                    fileName: 1,
                    lineNumber: 1
                };
            }, {
                "./bufferish": 8,
                "./encode": 15
            }],
            19: [function (t, e, i) {
                function n(e) {
                    l || (l = t("./decode").decode);
                    return l(e);
                }
                function r(t) {
                    return RegExp.apply(null, t);
                }
                function o(t) {
                    return function (e) {
                        var i = new t();
                        for (var n in u) {
                            i[n] = e[n];
                        }
                        return i;
                    };
                }
                function s(t) {
                    return function (e) {
                        return new t(e);
                    };
                }
                function a(t) {
                    return new Uint8Array(t).buffer;
                }
                i.setExtUnpackers = function (t) {
                    t.addExtUnpacker(14, [n, o(Error)]);
                    t.addExtUnpacker(1, [n, o(EvalError)]);
                    t.addExtUnpacker(2, [n, o(RangeError)]);
                    t.addExtUnpacker(3, [n, o(ReferenceError)]);
                    t.addExtUnpacker(4, [n, o(SyntaxError)]);
                    t.addExtUnpacker(5, [n, o(TypeError)]);
                    t.addExtUnpacker(6, [n, o(URIError)]);
                    t.addExtUnpacker(10, [n, r]);
                    t.addExtUnpacker(11, [n, s(Boolean)]);
                    t.addExtUnpacker(12, [n, s(String)]);
                    t.addExtUnpacker(13, [n, s(Date)]);
                    t.addExtUnpacker(15, [n, s(Number)]);
                    "undefined" != typeof Uint8Array && (t.addExtUnpacker(17, s(Int8Array)), t.addExtUnpacker(18, s(Uint8Array)), t.addExtUnpacker(19, [a, s(Int16Array)]), t.addExtUnpacker(20, [a, s(Uint16Array)]), t.addExtUnpacker(21, [a, s(Int32Array)]), t.addExtUnpacker(22, [a, s(Uint32Array)]), t.addExtUnpacker(23, [a, s(Float32Array)]), "undefined" != typeof Float64Array && t.addExtUnpacker(24, [a, s(Float64Array)]), "undefined" != typeof Uint8ClampedArray && t.addExtUnpacker(25, s(Uint8ClampedArray)), t.addExtUnpacker(26, a), t.addExtUnpacker(29, [a, s(DataView)]));
                    c.hasBuffer && t.addExtUnpacker(27, s(h));
                };
                var l;
                var c = t("./bufferish");
                var h = c.global;
                var u = {
                    name: 1,
                    message: 1,
                    stack: 1,
                    columnNumber: 1,
                    fileName: 1,
                    lineNumber: 1
                };
            }, {
                "./bufferish": 8,
                "./decode": 12
            }],
            20: [function (t, e, i) {
                t("./read-core");
                t("./write-core");
                i.createCodec = t("./codec-base").createCodec;
            }, {
                "./codec-base": 9,
                "./read-core": 22,
                "./write-core": 25
            }],
            21: [function (t, e, i) {
                function n() {
                    if (!(this instanceof n)) {
                        return new n();
                    }
                }
                function r() {
                    if (!(this instanceof r)) {
                        return new r();
                    }
                }
                function o() {
                    throw new Error("method not implemented: write()");
                }
                function s() {
                    throw new Error("method not implemented: fetch()");
                }
                function a() {
                    return this.buffers && this.buffers.length ? (this.flush(), this.pull()) : this.fetch();
                }
                function l(t) {
                    (this.buffers || (this.buffers = [])).push(t);
                }
                function c() {
                    return (this.buffers || (this.buffers = [])).shift();
                }
                function h(t) {
                    return function (e) {
                        for (var i in t) {
                            e[i] = t[i];
                        }
                        return e;
                    };
                }
                i.FlexDecoder = n;
                i.FlexEncoder = r;
                var u = t("./bufferish");
                var f = 2048;
                var p = 65536;
                var d = "BUFFER_SHORTAGE";
                n.mixin = h({
                    bufferish: u,
                    write: function (t) {
                        var e = this.offset ? u.prototype.slice.call(this.buffer, this.offset) : this.buffer;
                        this.buffer = e ? t ? this.bufferish.concat([e, t]) : e : t;
                        this.offset = 0;
                    },
                    fetch: s,
                    flush: function () {
                        for (; this.offset < this.buffer.length;) {
                            var t;
                            var e = this.offset;
                            try {
                                t = this.fetch();
                            } catch (t) {
                                if (t && t.message != d) {
                                    throw t;
                                }
                                this.offset = e;
                                break;
                            }
                            this.push(t);
                        }
                    },
                    push: l,
                    pull: c,
                    read: a,
                    reserve: function (t) {
                        var e = this.offset;
                        var i = e + t;
                        if (i > this.buffer.length) {
                            throw new Error(d);
                        }
                        this.offset = i;
                        return e;
                    },
                    offset: 0
                });
                n.mixin(n.prototype);
                r.mixin = h({
                    bufferish: u,
                    write: o,
                    fetch: function () {
                        var t = this.start;
                        if (t < this.offset) {
                            var e = this.start = this.offset;
                            return u.prototype.slice.call(this.buffer, t, e);
                        }
                    },
                    flush: function () {
                        for (; this.start < this.offset;) {
                            var t = this.fetch();
                            t && this.push(t);
                        }
                    },
                    push: l,
                    pull: function () {
                        var t = this.buffers || (this.buffers = []);
                        var e = t.length > 1 ? this.bufferish.concat(t) : t[0];
                        t.length = 0;
                        return e;
                    },
                    read: a,
                    reserve: function (t) {
                        var e = 0 | t;
                        if (this.buffer) {
                            var i = this.buffer.length;
                            var n = 0 | this.offset;
                            var r = n + e;
                            if (r < i) {
                                this.offset = r;
                                return n;
                            }
                            this.flush();
                            t = Math.max(t, Math.min(2 * i, this.maxBufferSize));
                        }
                        t = Math.max(t, this.minBufferSize);
                        this.buffer = this.bufferish.alloc(t);
                        this.start = 0;
                        this.offset = e;
                        return 0;
                    },
                    send: function (t) {
                        var e = t.length;
                        if (e > this.minBufferSize) {
                            this.flush();
                            this.push(t);
                        } else {
                            var i = this.reserve(e);
                            u.prototype.copy.call(t, this.buffer, i);
                        }
                    },
                    maxBufferSize: p,
                    minBufferSize: f,
                    offset: 0,
                    start: 0
                });
                r.mixin(r.prototype);
            }, {
                "./bufferish": 8
            }],
            22: [function (t, e, i) {
                function n() {
                    var t = this.options;
                    this.decode = function (t) {
                        var e = a.getReadToken(t);
                        return function (t) {
                            var i = s(t);
                            var n = e[i];
                            if (!n) {
                                throw new Error("Invalid type: " + (i ? "0x" + i.toString(16) : i));
                            }
                            return n(t);
                        };
                    }(t);
                    t && t.preset && o.setExtUnpackers(this);
                    return this;
                }
                var r = t("./ext-buffer").ExtBuffer;
                var o = t("./ext-unpacker");
                var s = t("./read-format").readUint8;
                var a = t("./read-token");
                var l = t("./codec-base");
                l.install({
                    addExtUnpacker: function (t, e) {
                        (this.extUnpackers || (this.extUnpackers = []))[t] = l.filter(e);
                    },
                    getExtUnpacker: function (t) {
                        return (this.extUnpackers || (this.extUnpackers = []))[t] || function (e) {
                            return new r(e, t);
                        };
                    },
                    init: n
                });
                i.preset = n.call(l.preset);
            }, {
                "./codec-base": 9,
                "./ext-buffer": 17,
                "./ext-unpacker": 19,
                "./read-format": 23,
                "./read-token": 24
            }],
            23: [function (t, e, i) {
                function n(t, e) {
                    var i;
                    var n = {};
                    var r = new Array(e);
                    var o = new Array(e);
                    var s = t.codec.decode;
                    for (i = 0; i < e; i++) {
                        r[i] = s(t);
                        o[i] = s(t);
                    }
                    for (i = 0; i < e; i++) {
                        n[r[i]] = o[i];
                    }
                    return n;
                }
                function r(t, e) {
                    var i;
                    var n = new Map();
                    var r = new Array(e);
                    var o = new Array(e);
                    var s = t.codec.decode;
                    for (i = 0; i < e; i++) {
                        r[i] = s(t);
                        o[i] = s(t);
                    }
                    for (i = 0; i < e; i++) {
                        n.set(r[i], o[i]);
                    }
                    return n;
                }
                function o(t, e) {
                    for (var i = new Array(e), n = t.codec.decode, r = 0; r < e; r++) {
                        i[r] = n(t);
                    }
                    return i;
                }
                function s(t, e) {
                    var i = t.reserve(e);
                    var n = i + e;
                    return T.toString.call(t.buffer, "utf-8", i, n);
                }
                function a(t, e) {
                    var i = t.reserve(e);
                    var n = i + e;
                    var r = T.slice.call(t.buffer, i, n);
                    return V.from(r);
                }
                function l(t, e) {
                    var i = t.reserve(e);
                    var n = i + e;
                    var r = T.slice.call(t.buffer, i, n);
                    return V.Uint8Array.from(r).buffer;
                }
                function c(t, e) {
                    var i = t.reserve(e + 1);
                    var n = t.buffer[i++];
                    var r = i + e;
                    var o = t.codec.getExtUnpacker(n);
                    if (!o) {
                        throw new Error("Invalid ext type: " + (n ? "0x" + n.toString(16) : n));
                    }
                    return o(T.slice.call(t.buffer, i, r));
                }
                function h(t) {
                    var e = t.reserve(1);
                    return t.buffer[e];
                }
                function u(t) {
                    var e = t.reserve(1);
                    var i = t.buffer[e];
                    return 128 & i ? i - 256 : i;
                }
                function f(t) {
                    var e = t.reserve(2);
                    var i = t.buffer;
                    return i[e++] << 8 | i[e];
                }
                function p(t) {
                    var e = t.reserve(2);
                    var i = t.buffer;
                    var n = i[e++] << 8 | i[e];
                    return 32768 & n ? n - 65536 : n;
                }
                function d(t) {
                    var e = t.reserve(4);
                    var i = t.buffer;
                    return 16777216 * i[e++] + (i[e++] << 16) + (i[e++] << 8) + i[e];
                }
                function m(t) {
                    var e = t.reserve(4);
                    var i = t.buffer;
                    return i[e++] << 24 | i[e++] << 16 | i[e++] << 8 | i[e];
                }
                function y(t, e) {
                    return function (i) {
                        var n = i.reserve(t);
                        return e.call(i.buffer, n, M);
                    };
                }
                function g(t) {
                    return new C(this, t).toNumber();
                }
                function b(t) {
                    return new S(this, t).toNumber();
                }
                function v(t) {
                    return new C(this, t);
                }
                function w(t) {
                    return new S(this, t);
                }
                function x(t) {
                    return _.read(this, t, !1, 23, 4);
                }
                function k(t) {
                    return _.read(this, t, !1, 52, 8);
                }
                var _ = t("ieee754");
                var E = t("int64-buffer");
                var C = E.Uint64BE;
                var S = E.Int64BE;
                i.getReadFormat = function (t) {
                    var e = V.hasArrayBuffer && t && t.binarraybuffer;
                    var i = t && t.int64;
                    return {
                        map: A && t && t.usemap ? r : n,
                        array: o,
                        str: s,
                        bin: e ? l : a,
                        ext: c,
                        uint8: h,
                        uint16: f,
                        uint32: d,
                        uint64: y(8, i ? v : g),
                        int8: u,
                        int16: p,
                        int32: m,
                        int64: y(8, i ? w : b),
                        float32: y(4, x),
                        float64: y(8, k)
                    };
                };
                i.readUint8 = h;
                var V = t("./bufferish");
                var T = t("./bufferish-proto");
                var A = "undefined" != typeof Map;
                var M = !0;
            }, {
                "./bufferish": 8,
                "./bufferish-proto": 6,
                ieee754: 32,
                "int64-buffer": 33
            }],
            24: [function (t, e, i) {
                function n(t) {
                    var e;
                    var i = new Array(256);
                    for (e = 0; e <= 127; e++) {
                        i[e] = r(e);
                    }
                    for (e = 128; e <= 143; e++) {
                        i[e] = s(e - 128, t.map);
                    }
                    for (e = 144; e <= 159; e++) {
                        i[e] = s(e - 144, t.array);
                    }
                    for (e = 160; e <= 191; e++) {
                        i[e] = s(e - 160, t.str);
                    }
                    i[192] = r(null);
                    i[193] = null;
                    i[194] = r(!1);
                    i[195] = r(!0);
                    i[196] = o(t.uint8, t.bin);
                    i[197] = o(t.uint16, t.bin);
                    i[198] = o(t.uint32, t.bin);
                    i[199] = o(t.uint8, t.ext);
                    i[200] = o(t.uint16, t.ext);
                    i[201] = o(t.uint32, t.ext);
                    i[202] = t.float32;
                    i[203] = t.float64;
                    i[204] = t.uint8;
                    i[205] = t.uint16;
                    i[206] = t.uint32;
                    i[207] = t.uint64;
                    i[208] = t.int8;
                    i[209] = t.int16;
                    i[210] = t.int32;
                    i[211] = t.int64;
                    i[212] = s(1, t.ext);
                    i[213] = s(2, t.ext);
                    i[214] = s(4, t.ext);
                    i[215] = s(8, t.ext);
                    i[216] = s(16, t.ext);
                    i[217] = o(t.uint8, t.str);
                    i[218] = o(t.uint16, t.str);
                    i[219] = o(t.uint32, t.str);
                    i[220] = o(t.uint16, t.array);
                    i[221] = o(t.uint32, t.array);
                    i[222] = o(t.uint16, t.map);
                    i[223] = o(t.uint32, t.map);
                    e = 224;
                    for (; e <= 255; e++) {
                        i[e] = r(e - 256);
                    }
                    return i;
                }
                function r(t) {
                    return function () {
                        return t;
                    };
                }
                function o(t, e) {
                    return function (i) {
                        var n = t(i);
                        return e(i, n);
                    };
                }
                function s(t, e) {
                    return function (i) {
                        return e(i, t);
                    };
                }
                var a = t("./read-format");
                i.getReadToken = function (t) {
                    var e = a.getReadFormat(t);
                    return t && t.useraw ? function (t) {
                        var e;
                        var i = n(t).slice();
                        i[217] = i[196];
                        i[218] = i[197];
                        i[219] = i[198];
                        e = 160;
                        for (; e <= 191; e++) {
                            i[e] = s(e - 160, t.bin);
                        }
                        return i;
                    }(e) : n(e);
                };
            }, {
                "./read-format": 23
            }],
            25: [function (t, e, i) {
                function n() {
                    var t = this.options;
                    this.encode = function (t) {
                        var e = s.getWriteType(t);
                        return function (t, i) {
                            var n = e[typeof i];
                            if (!n) {
                                throw new Error('Unsupported type "' + typeof i + '": ' + i);
                            }
                            n(t, i);
                        };
                    }(t);
                    t && t.preset && o.setExtPackers(this);
                    return this;
                }
                var r = t("./ext-buffer").ExtBuffer;
                var o = t("./ext-packer");
                var s = t("./write-type");
                var a = t("./codec-base");
                a.install({
                    addExtPacker: function (t, e, i) {
                        function n(e) {
                            i && (e = i(e));
                            return new r(e, t);
                        }
                        i = a.filter(i);
                        var o = e.name;
                        o && "Object" !== o ? (this.extPackers || (this.extPackers = {}))[o] = n : (this.extEncoderList || (this.extEncoderList = [])).unshift([e, n]);
                    },
                    getExtPacker: function (t) {
                        var e = this.extPackers || (this.extPackers = {});
                        var i = t.constructor;
                        var n = i && i.name && e[i.name];
                        if (n) {
                            return n;
                        }
                        for (var r = this.extEncoderList || (this.extEncoderList = []), o = r.length, s = 0; s < o; s++) {
                            var a = r[s];
                            if (i === a[0]) {
                                return a[1];
                            }
                        }
                    },
                    init: n
                });
                i.preset = n.call(a.preset);
            }, {
                "./codec-base": 9,
                "./ext-buffer": 17,
                "./ext-packer": 18,
                "./write-type": 27
            }],
            26: [function (t, e, i) {
                function n() {
                    var t = y.slice();
                    t[196] = r(196);
                    t[197] = o(197);
                    t[198] = s(198);
                    t[199] = r(199);
                    t[200] = o(200);
                    t[201] = s(201);
                    t[202] = a(202, 4, w.writeFloatBE || h, !0);
                    t[203] = a(203, 8, w.writeDoubleBE || u, !0);
                    t[204] = r(204);
                    t[205] = o(205);
                    t[206] = s(206);
                    t[207] = a(207, 8, l);
                    t[208] = r(208);
                    t[209] = o(209);
                    t[210] = s(210);
                    t[211] = a(211, 8, c);
                    t[217] = r(217);
                    t[218] = o(218);
                    t[219] = s(219);
                    t[220] = o(220);
                    t[221] = s(221);
                    t[222] = o(222);
                    t[223] = s(223);
                    return t;
                }
                function r(t) {
                    return function (e, i) {
                        var n = e.reserve(2);
                        var r = e.buffer;
                        r[n++] = t;
                        r[n] = i;
                    };
                }
                function o(t) {
                    return function (e, i) {
                        var n = e.reserve(3);
                        var r = e.buffer;
                        r[n++] = t;
                        r[n++] = i >>> 8;
                        r[n] = i;
                    };
                }
                function s(t) {
                    return function (e, i) {
                        var n = e.reserve(5);
                        var r = e.buffer;
                        r[n++] = t;
                        r[n++] = i >>> 24;
                        r[n++] = i >>> 16;
                        r[n++] = i >>> 8;
                        r[n] = i;
                    };
                }
                function a(t, e, i, n) {
                    return function (r, o) {
                        var s = r.reserve(e + 1);
                        r.buffer[s++] = t;
                        i.call(r.buffer, o, s, n);
                    };
                }
                function l(t, e) {
                    new d(this, e, t);
                }
                function c(t, e) {
                    new m(this, e, t);
                }
                function h(t, e) {
                    f.write(this, t, e, !1, 23, 4);
                }
                function u(t, e) {
                    f.write(this, t, e, !1, 52, 8);
                }
                var f = t("ieee754");
                var p = t("int64-buffer");
                var d = p.Uint64BE;
                var m = p.Int64BE;
                var y = t("./write-uint8").uint8;
                var g = t("./bufferish");
                var b = g.global;
                var v = g.hasBuffer && "TYPED_ARRAY_SUPPORT" in b && !b.TYPED_ARRAY_SUPPORT;
                var w = g.hasBuffer && b.prototype || {};
                i.getWriteToken = function (t) {
                    return t && t.uint8array ? function () {
                        var t = n();
                        t[202] = a(202, 4, h);
                        t[203] = a(203, 8, u);
                        return t;
                    }() : v || g.hasBuffer && t && t.safe ? function () {
                        var t = y.slice();
                        t[196] = a(196, 1, b.prototype.writeUInt8);
                        t[197] = a(197, 2, b.prototype.writeUInt16BE);
                        t[198] = a(198, 4, b.prototype.writeUInt32BE);
                        t[199] = a(199, 1, b.prototype.writeUInt8);
                        t[200] = a(200, 2, b.prototype.writeUInt16BE);
                        t[201] = a(201, 4, b.prototype.writeUInt32BE);
                        t[202] = a(202, 4, b.prototype.writeFloatBE);
                        t[203] = a(203, 8, b.prototype.writeDoubleBE);
                        t[204] = a(204, 1, b.prototype.writeUInt8);
                        t[205] = a(205, 2, b.prototype.writeUInt16BE);
                        t[206] = a(206, 4, b.prototype.writeUInt32BE);
                        t[207] = a(207, 8, l);
                        t[208] = a(208, 1, b.prototype.writeInt8);
                        t[209] = a(209, 2, b.prototype.writeInt16BE);
                        t[210] = a(210, 4, b.prototype.writeInt32BE);
                        t[211] = a(211, 8, c);
                        t[217] = a(217, 1, b.prototype.writeUInt8);
                        t[218] = a(218, 2, b.prototype.writeUInt16BE);
                        t[219] = a(219, 4, b.prototype.writeUInt32BE);
                        t[220] = a(220, 2, b.prototype.writeUInt16BE);
                        t[221] = a(221, 4, b.prototype.writeUInt32BE);
                        t[222] = a(222, 2, b.prototype.writeUInt16BE);
                        t[223] = a(223, 4, b.prototype.writeUInt32BE);
                        return t;
                    }() : n();
                };
            }, {
                "./bufferish": 8,
                "./write-uint8": 28,
                ieee754: 32,
                "int64-buffer": 33
            }],
            27: [function (t, e, i) {
                var n = t("isarray");
                var r = t("int64-buffer");
                var o = r.Uint64BE;
                var s = r.Int64BE;
                var a = t("./bufferish");
                var l = t("./bufferish-proto");
                var c = t("./write-token");
                var h = t("./write-uint8").uint8;
                var u = t("./ext-buffer").ExtBuffer;
                var f = "undefined" != typeof Uint8Array;
                var p = "undefined" != typeof Map;
                var d = [];
                d[1] = 212;
                d[2] = 213;
                d[4] = 214;
                d[8] = 215;
                d[16] = 216;
                i.getWriteType = function (t) {
                    function e(t, e) {
                        if (null === e) {
                            return i(t, e);
                        }
                        if (v(e)) {
                            return w(t, e);
                        }
                        if (n(e)) {
                            return function (t, e) {
                                var i = e.length;
                                y[i < 16 ? 144 + i : i <= 65535 ? 220 : 221](t, i);
                                for (var n = t.codec.encode, r = 0; r < i; r++) {
                                    n(t, e[r]);
                                }
                            }(t, e);
                        }
                        if (o.isUint64BE(e)) {
                            return function (t, e) {
                                y[207](t, e.toArray());
                            }(t, e);
                        }
                        if (s.isInt64BE(e)) {
                            return function (t, e) {
                                y[211](t, e.toArray());
                            }(t, e);
                        }
                        var r = t.codec.getExtPacker(e);
                        r && (e = r(e));
                        return e instanceof u ? function (t, e) {
                            var i = e.buffer;
                            var n = i.length;
                            var r = d[n] || (n < 255 ? 199 : n <= 65535 ? 200 : 201);
                            y[r](t, n);
                            h[e.type](t);
                            t.send(i);
                        }(t, e) : void x(t, e);
                    }
                    function i(t, e) {
                        y[192](t, e);
                    }
                    function r(t, e) {
                        var i = e.length;
                        y[i < 255 ? 196 : i <= 65535 ? 197 : 198](t, i);
                        t.send(e);
                    }
                    function m(t, e) {
                        var i = Object.keys(e);
                        var n = i.length;
                        y[n < 16 ? 128 + n : n <= 65535 ? 222 : 223](t, n);
                        var r = t.codec.encode;
                        i.forEach(function (i) {
                            r(t, i);
                            r(t, e[i]);
                        });
                    }
                    var y = c.getWriteToken(t);
                    var g = t && t.useraw;
                    var b = f && t && t.binarraybuffer;
                    var v = b ? a.isArrayBuffer : a.isBuffer;
                    var w = b ? function (t, e) {
                        r(t, new Uint8Array(e));
                    } : r;
                    var x = p && t && t.usemap ? function (t, e) {
                        if (!(e instanceof Map)) {
                            return m(t, e);
                        }
                        var i = e.size;
                        y[i < 16 ? 128 + i : i <= 65535 ? 222 : 223](t, i);
                        var n = t.codec.encode;
                        e.forEach(function (e, i, r) {
                            n(t, i);
                            n(t, e);
                        });
                    } : m;
                    var k = {
                        boolean: function (t, e) {
                            y[e ? 195 : 194](t, e);
                        },
                        "function": i,
                        number: function (t, e) {
                            var i = 0 | e;
                            return e !== i ? void y[203](t, e) : void y[-32 <= i && i <= 127 ? 255 & i : 0 <= i ? i <= 255 ? 204 : i <= 65535 ? 205 : 206 : -128 <= i ? 208 : -32768 <= i ? 209 : 210](t, i);
                        },
                        object: g ? function (t, i) {
                            return v(i) ? function (t, e) {
                                var i = e.length;
                                y[i < 32 ? 160 + i : i <= 65535 ? 218 : 219](t, i);
                                t.send(e);
                            }(t, i) : void e(t, i);
                        } : e,
                        string: function (t) {
                            return function (e, i) {
                                var n = i.length;
                                var r = 5 + 3 * n;
                                e.offset = e.reserve(r);
                                var o = e.buffer;
                                var s = t(n);
                                var a = e.offset + s;
                                n = l.write.call(o, i, a);
                                var c = t(n);
                                if (s !== c) {
                                    var h = a + c - s;
                                    var u = a + n;
                                    l.copy.call(o, o, h, a, u);
                                }
                                y[1 === c ? 160 + n : c <= 3 ? 215 + c : 219](e, n);
                                e.offset += n;
                            };
                        }(g ? function (t) {
                            return t < 32 ? 1 : t <= 65535 ? 3 : 5;
                        } : function (t) {
                            return t < 32 ? 1 : t <= 255 ? 2 : t <= 65535 ? 3 : 5;
                        }),
                        symbol: i,
                        undefined: i
                    };
                    return k;
                };
            }, {
                "./bufferish": 8,
                "./bufferish-proto": 6,
                "./ext-buffer": 17,
                "./write-token": 26,
                "./write-uint8": 28,
                "int64-buffer": 33,
                isarray: 34
            }],
            28: [function (t, e, i) {
                function n(t) {
                    return function (e) {
                        var i = e.reserve(1);
                        e.buffer[i] = t;
                    };
                }
                for (var r = i.uint8 = new Array(256), o = 0; o <= 255; o++) {
                    r[o] = n(o);
                }
            }, {}],
            29: [function (t, e, i) {
                (function (e) {
                    function n() {
                        return o.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823;
                    }
                    function r(t, e) {
                        if (n() < e) {
                            throw new RangeError("Invalid typed array length");
                        }
                        o.TYPED_ARRAY_SUPPORT ? (t = new Uint8Array(e)).__proto__ = o.prototype : (null === t && (t = new o(e)), t.length = e);
                        return t;
                    }
                    function o(t, e, i) {
                        if (!(o.TYPED_ARRAY_SUPPORT || this instanceof o)) {
                            return new o(t, e, i);
                        }
                        if ("number" == typeof t) {
                            if ("string" == typeof e) {
                                throw new Error("If encoding is specified then the first argument must be a string");
                            }
                            return l(this, t);
                        }
                        return s(this, t, e, i);
                    }
                    function s(t, e, i, n) {
                        if ("number" == typeof e) {
                            throw new TypeError('"value" argument must not be a number');
                        }
                        return "undefined" != typeof ArrayBuffer && e instanceof ArrayBuffer ? function (t, e, i, n) {
                            e.byteLength;
                            if (i < 0 || e.byteLength < i) {
                                throw new RangeError("'offset' is out of bounds");
                            }
                            if (e.byteLength < i + (n || 0)) {
                                throw new RangeError("'length' is out of bounds");
                            }
                            e = void 0 === i && void 0 === n ? new Uint8Array(e) : void 0 === n ? new Uint8Array(e, i) : new Uint8Array(e, i, n);
                            o.TYPED_ARRAY_SUPPORT ? (t = e).__proto__ = o.prototype : t = c(t, e);
                            return t;
                        }(t, e, i, n) : "string" == typeof e ? function (t, e, i) {
                            "string" == typeof i && "" !== i || (i = "utf8");
                            if (!o.isEncoding(i)) {
                                throw new TypeError('"encoding" must be a valid string encoding');
                            }
                            var n = 0 | u(e, i);
                            var s = (t = r(t, n)).write(e, i);
                            s !== n && (t = t.slice(0, s));
                            return t;
                        }(t, e, i) : function (t, e) {
                            if (o.isBuffer(e)) {
                                var i = 0 | h(e.length);
                                0 === (t = r(t, i)).length || e.copy(t, 0, 0, i);
                                return t;
                            }
                            if (e) {
                                if ("undefined" != typeof ArrayBuffer && e.buffer instanceof ArrayBuffer || "length" in e) {
                                    return "number" != typeof e.length || function (t) {
                                        return t != t;
                                    }(e.length) ? r(t, 0) : c(t, e);
                                }
                                if ("Buffer" === e.type && D(e.data)) {
                                    return c(t, e.data);
                                }
                            }
                            throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.");
                        }(t, e);
                    }
                    function a(t) {
                        if ("number" != typeof t) {
                            throw new TypeError('"size" argument must be a number');
                        }
                        if (t < 0) {
                            throw new RangeError('"size" argument must not be negative');
                        }
                    }
                    function l(t, e) {
                        a(e);
                        t = r(t, e < 0 ? 0 : 0 | h(e));
                        if (!o.TYPED_ARRAY_SUPPORT) {
                            for (var i = 0; i < e; ++i) {
                                t[i] = 0;
                            }
                        }
                        return t;
                    }
                    function c(t, e) {
                        var i = e.length < 0 ? 0 : 0 | h(e.length);
                        t = r(t, i);
                        for (var n = 0; n < i; n += 1) {
                            t[n] = 255 & e[n];
                        }
                        return t;
                    }
                    function h(t) {
                        if (t >= n()) {
                            throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + n().toString(16) + " bytes");
                        }
                        return 0 | t;
                    }
                    function u(t, e) {
                        if (o.isBuffer(t)) {
                            return t.length;
                        }
                        if ("undefined" != typeof ArrayBuffer && "function" == typeof ArrayBuffer.isView && (ArrayBuffer.isView(t) || t instanceof ArrayBuffer)) {
                            return t.byteLength;
                        }
                        "string" != typeof t && (t = "" + t);
                        var i = t.length;
                        if (0 === i) {
                            return 0;
                        }
                        for (var n = !1;;) {
                            switch (e) {
                                case "ascii":
                                case "latin1":
                                case "binary":
                                    return i;
                                case "utf8":
                                case "utf-8":
                                case void 0:
                                    return O(t).length;
                                case "ucs2":
                                case "ucs-2":
                                case "utf16le":
                                case "utf-16le":
                                    return 2 * i;
                                case "hex":
                                    return i >>> 1;
                                case "base64":
                                    return P(t).length;
                                default:
                                    if (n) {
                                        return O(t).length;
                                    }
                                    e = ("" + e).toLowerCase();
                                    n = !0;
                            }
                        }
                    }
                    function f(t, e, i) {
                        var n = !1;
                        (void 0 === e || e < 0) && (e = 0);
                        if (e > this.length) {
                            return "";
                        }
                        (void 0 === i || i > this.length) && (i = this.length);
                        if (i <= 0) {
                            return "";
                        }
                        if ((i >>>= 0) <= (e >>>= 0)) {
                            return "";
                        }
                        for (t || (t = "utf8");;) {
                            switch (t) {
                                case "hex":
                                    return S(this, e, i);
                                case "utf8":
                                case "utf-8":
                                    return _(this, e, i);
                                case "ascii":
                                    return E(this, e, i);
                                case "latin1":
                                case "binary":
                                    return C(this, e, i);
                                case "base64":
                                    return k(this, e, i);
                                case "ucs2":
                                case "ucs-2":
                                case "utf16le":
                                case "utf-16le":
                                    return V(this, e, i);
                                default:
                                    if (n) {
                                        throw new TypeError("Unknown encoding: " + t);
                                    }
                                    t = (t + "").toLowerCase();
                                    n = !0;
                            }
                        }
                    }
                    function p(t, e, i) {
                        var n = t[e];
                        t[e] = t[i];
                        t[i] = n;
                    }
                    function d(t, e, i, n, r) {
                        if (0 === t.length) {
                            return -1;
                        }
                        "string" == typeof i ? (n = i, i = 0) : i > 2147483647 ? i = 2147483647 : i < -2147483648 && (i = -2147483648);
                        i = +i;
                        isNaN(i) && (i = r ? 0 : t.length - 1);
                        i < 0 && (i = t.length + i);
                        if (i >= t.length) {
                            if (r) {
                                return -1;
                            }
                            i = t.length - 1;
                        } else {
                            if (i < 0) {
                                if (!r) {
                                    return -1;
                                }
                                i = 0;
                            }
                        }
                        "string" == typeof e && (e = o.from(e, n));
                        if (o.isBuffer(e)) {
                            return 0 === e.length ? -1 : m(t, e, i, n, r);
                        }
                        if ("number" == typeof e) {
                            e &= 255;
                            return o.TYPED_ARRAY_SUPPORT && "function" == typeof Uint8Array.prototype.indexOf ? r ? Uint8Array.prototype.indexOf.call(t, e, i) : Uint8Array.prototype.lastIndexOf.call(t, e, i) : m(t, [e], i, n, r);
                        }
                        throw new TypeError("val must be string, number or Buffer");
                    }
                    function m(t, e, i, n, r) {
                        function o(t, e) {
                            return 1 === a ? t[e] : t.readUInt16BE(e * a);
                        }
                        var s;
                        var a = 1;
                        var l = t.length;
                        var c = e.length;
                        if (void 0 !== n && ("ucs2" === (n = String(n).toLowerCase()) || "ucs-2" === n || "utf16le" === n || "utf-16le" === n)) {
                            if (t.length < 2 || e.length < 2) {
                                return -1;
                            }
                            a = 2;
                            l /= 2;
                            c /= 2;
                            i /= 2;
                        }
                        if (r) {
                            var h = -1;
                            for (s = i; s < l; s++) {
                                if (o(t, s) === o(e, -1 === h ? 0 : s - h)) {
                                    -1 === h && (h = s);
                                    if (s - h + 1 === c) {
                                        return h * a;
                                    }
                                } else {
                                    -1 !== h && (s -= s - h);
                                    h = -1;
                                }
                            }
                        } else {
                            i + c > l && (i = l - c);
                            s = i;
                            for (; s >= 0; s--) {
                                for (var u = !0, f = 0; f < c; f++) {
                                    if (o(t, s + f) !== o(e, f)) {
                                        u = !1;
                                        break;
                                    }
                                }
                                if (u) {
                                    return s;
                                }
                            }
                        }
                        return -1;
                    }
                    function y(t, e, i, n) {
                        i = Number(i) || 0;
                        var r = t.length - i;
                        n ? (n = Number(n)) > r && (n = r) : n = r;
                        var o = e.length;
                        if (o % 2 != 0) {
                            throw new TypeError("Invalid hex string");
                        }
                        n > o / 2 && (n = o / 2);
                        for (var s = 0; s < n; ++s) {
                            var a = parseInt(e.substr(2 * s, 2), 16);
                            if (isNaN(a)) {
                                return s;
                            }
                            t[i + s] = a;
                        }
                        return s;
                    }
                    function g(t, e, i, n) {
                        return F(O(e, t.length - i), t, i, n);
                    }
                    function b(t, e, i, n) {
                        return F(function (t) {
                            for (var e = [], i = 0; i < t.length; ++i) {
                                e.push(255 & t.charCodeAt(i));
                            }
                            return e;
                        }(e), t, i, n);
                    }
                    function v(t, e, i, n) {
                        return b(t, e, i, n);
                    }
                    function w(t, e, i, n) {
                        return F(P(e), t, i, n);
                    }
                    function x(t, e, i, n) {
                        return F(function (t, e) {
                            for (var i, n, r, o = [], s = 0; s < t.length && !((e -= 2) < 0); ++s) {
                                i = t.charCodeAt(s);
                                n = i >> 8;
                                r = i % 256;
                                o.push(r);
                                o.push(n);
                            }
                            return o;
                        }(e, t.length - i), t, i, n);
                    }
                    function k(t, e, i) {
                        return 0 === e && i === t.length ? Z.fromByteArray(t) : Z.fromByteArray(t.slice(e, i));
                    }
                    function _(t, e, i) {
                        i = Math.min(t.length, i);
                        for (var n = [], r = e; r < i;) {
                            var o;
                            var s;
                            var a;
                            var l;
                            var c = t[r];
                            var h = null;
                            var u = c > 239 ? 4 : c > 223 ? 3 : c > 191 ? 2 : 1;
                            if (r + u <= i) {
                                switch (u) {
                                    case 1:
                                        c < 128 && (h = c);
                                        break;
                                    case 2:
                                        128 == (192 & (o = t[r + 1])) && (l = (31 & c) << 6 | 63 & o) > 127 && (h = l);
                                        break;
                                    case 3:
                                        o = t[r + 1];
                                        s = t[r + 2];
                                        128 == (192 & o) && 128 == (192 & s) && (l = (15 & c) << 12 | (63 & o) << 6 | 63 & s) > 2047 && (l < 55296 || l > 57343) && (h = l);
                                        break;
                                    case 4:
                                        o = t[r + 1];
                                        s = t[r + 2];
                                        a = t[r + 3];
                                        128 == (192 & o) && 128 == (192 & s) && 128 == (192 & a) && (l = (15 & c) << 18 | (63 & o) << 12 | (63 & s) << 6 | 63 & a) > 65535 && l < 1114112 && (h = l);
                                }
                            }
                            null === h ? (h = 65533, u = 1) : h > 65535 && (h -= 65536, n.push(h >>> 10 & 1023 | 55296), h = 56320 | 1023 & h);
                            n.push(h);
                            r += u;
                        }
                        return function (t) {
                            var e = t.length;
                            if (e <= W) {
                                return String.fromCharCode.apply(String, t);
                            }
                            for (var i = "", n = 0; n < e;) {
                                i += String.fromCharCode.apply(String, t.slice(n, n += W));
                            }
                            return i;
                        }(n);
                    }
                    function E(t, e, i) {
                        var n = "";
                        i = Math.min(t.length, i);
                        for (var r = e; r < i; ++r) {
                            n += String.fromCharCode(127 & t[r]);
                        }
                        return n;
                    }
                    function C(t, e, i) {
                        var n = "";
                        i = Math.min(t.length, i);
                        for (var r = e; r < i; ++r) {
                            n += String.fromCharCode(t[r]);
                        }
                        return n;
                    }
                    function S(t, e, i) {
                        var n = t.length;
                        (!e || e < 0) && (e = 0);
                        (!i || i < 0 || i > n) && (i = n);
                        for (var r = "", o = e; o < i; ++o) {
                            r += H(t[o]);
                        }
                        return r;
                    }
                    function V(t, e, i) {
                        for (var n = t.slice(e, i), r = "", o = 0; o < n.length; o += 2) {
                            r += String.fromCharCode(n[o] + 256 * n[o + 1]);
                        }
                        return r;
                    }
                    function T(t, e, i) {
                        if (t % 1 != 0 || t < 0) {
                            throw new RangeError("offset is not uint");
                        }
                        if (t + e > i) {
                            throw new RangeError("Trying to access beyond buffer length");
                        }
                    }
                    function A(t, e, i, n, r, s) {
                        if (!o.isBuffer(t)) {
                            throw new TypeError('"buffer" argument must be a Buffer instance');
                        }
                        if (e > r || e < s) {
                            throw new RangeError('"value" argument is out of bounds');
                        }
                        if (i + n > t.length) {
                            throw new RangeError("Index out of range");
                        }
                    }
                    function M(t, e, i, n) {
                        e < 0 && (e = 65535 + e + 1);
                        for (var r = 0, o = Math.min(t.length - i, 2); r < o; ++r) {
                            t[i + r] = (e & 255 << 8 * (n ? r : 1 - r)) >>> 8 * (n ? r : 1 - r);
                        }
                    }
                    function R(t, e, i, n) {
                        e < 0 && (e = 4294967295 + e + 1);
                        for (var r = 0, o = Math.min(t.length - i, 4); r < o; ++r) {
                            t[i + r] = e >>> 8 * (n ? r : 3 - r) & 255;
                        }
                    }
                    function B(t, e, i, n, r, o) {
                        if (i + n > t.length) {
                            throw new RangeError("Index out of range");
                        }
                        if (i < 0) {
                            throw new RangeError("Index out of range");
                        }
                    }
                    function U(t, e, i, n, r) {
                        r || B(t, 0, i, 4);
                        N.write(t, e, i, n, 23, 4);
                        return i + 4;
                    }
                    function L(t, e, i, n, r) {
                        r || B(t, 0, i, 8);
                        N.write(t, e, i, n, 52, 8);
                        return i + 8;
                    }
                    function H(t) {
                        return t < 16 ? "0" + t.toString(16) : t.toString(16);
                    }
                    function O(t, e) {
                        e = e || 1 / 0;
                        for (var i, n = t.length, r = null, o = [], s = 0; s < n; ++s) {
                            if ((i = t.charCodeAt(s)) > 55295 && i < 57344) {
                                if (!r) {
                                    if (i > 56319) {
                                        (e -= 3) > -1 && o.push(239, 191, 189);
                                        continue;
                                    }
                                    if (s + 1 === n) {
                                        (e -= 3) > -1 && o.push(239, 191, 189);
                                        continue;
                                    }
                                    r = i;
                                    continue;
                                }
                                if (i < 56320) {
                                    (e -= 3) > -1 && o.push(239, 191, 189);
                                    r = i;
                                    continue;
                                }
                                i = 65536 + (r - 55296 << 10 | i - 56320);
                            } else {
                                r && (e -= 3) > -1 && o.push(239, 191, 189);
                            }
                            r = null;
                            if (i < 128) {
                                if ((e -= 1) < 0) {
                                    break;
                                }
                                o.push(i);
                            } else {
                                if (i < 2048) {
                                    if ((e -= 2) < 0) {
                                        break;
                                    }
                                    o.push(i >> 6 | 192, 63 & i | 128);
                                } else {
                                    if (i < 65536) {
                                        if ((e -= 3) < 0) {
                                            break;
                                        }
                                        o.push(i >> 12 | 224, i >> 6 & 63 | 128, 63 & i | 128);
                                    } else {
                                        if (!(i < 1114112)) {
                                            throw new Error("Invalid code point");
                                        }
                                        if ((e -= 4) < 0) {
                                            break;
                                        }
                                        o.push(i >> 18 | 240, i >> 12 & 63 | 128, i >> 6 & 63 | 128, 63 & i | 128);
                                    }
                                }
                            }
                        }
                        return o;
                    }
                    function P(t) {
                        return Z.toByteArray(function (t) {
                            if ((t = function (t) {
                                return t.trim ? t.trim() : t.replace(/^\s+|\s+$/g, "");
                            }(t).replace(z, "")).length < 2) {
                                return "";
                            }
                            for (; t.length % 4 != 0;) {
                                t += "=";
                            }
                            return t;
                        }(t));
                    }
                    function F(t, e, i, n) {
                        for (var r = 0; r < n && !(r + i >= e.length || r >= t.length); ++r) {
                            e[r + i] = t[r];
                        }
                        return r;
                    }
                    var Z = t("base64-js");
                    var N = t("ieee754");
                    var D = t("isarray");
                    i.Buffer = o;
                    i.SlowBuffer = function (t) {
                        +t != t && (t = 0);
                        return o.alloc(+t);
                    };
                    i.INSPECT_MAX_BYTES = 50;
                    o.TYPED_ARRAY_SUPPORT = void 0 !== e.TYPED_ARRAY_SUPPORT ? e.TYPED_ARRAY_SUPPORT : function () {
                        try {
                            var t = new Uint8Array(1);
                            t.__proto__ = {
                                __proto__: Uint8Array.prototype,
                                foo: function () {
                                    return 42;
                                }
                            };
                            return 42 === t.foo() && "function" == typeof t.subarray && 0 === t.subarray(1, 1).byteLength;
                        } catch (t) {
                            return !1;
                        }
                    }();
                    i.kMaxLength = n();
                    o.poolSize = 8192;
                    o._augment = function (t) {
                        t.__proto__ = o.prototype;
                        return t;
                    };
                    o.from = function (t, e, i) {
                        return s(null, t, e, i);
                    };
                    o.TYPED_ARRAY_SUPPORT && (o.prototype.__proto__ = Uint8Array.prototype, o.__proto__ = Uint8Array, "undefined" != typeof Symbol && Symbol.species && o[Symbol.species] === o && Object.defineProperty(o, Symbol.species, {
                        value: null,
                        configurable: !0
                    }));
                    o.alloc = function (t, e, i) {
                        return function (t, e, i, n) {
                            a(e);
                            return e <= 0 ? r(t, e) : void 0 !== i ? "string" == typeof n ? r(t, e).fill(i, n) : r(t, e).fill(i) : r(t, e);
                        }(null, t, e, i);
                    };
                    o.allocUnsafe = function (t) {
                        return l(null, t);
                    };
                    o.allocUnsafeSlow = function (t) {
                        return l(null, t);
                    };
                    o.isBuffer = function (t) {
                        return !(null == t || !t._isBuffer);
                    };
                    o.compare = function (t, e) {
                        if (!o.isBuffer(t) || !o.isBuffer(e)) {
                            throw new TypeError("Arguments must be Buffers");
                        }
                        if (t === e) {
                            return 0;
                        }
                        for (var i = t.length, n = e.length, r = 0, s = Math.min(i, n); r < s; ++r) {
                            if (t[r] !== e[r]) {
                                i = t[r];
                                n = e[r];
                                break;
                            }
                        }
                        return i < n ? -1 : n < i ? 1 : 0;
                    };
                    o.isEncoding = function (t) {
                        switch (String(t).toLowerCase()) {
                            case "hex":
                            case "utf8":
                            case "utf-8":
                            case "ascii":
                            case "latin1":
                            case "binary":
                            case "base64":
                            case "ucs2":
                            case "ucs-2":
                            case "utf16le":
                            case "utf-16le":
                                return !0;
                            default:
                                return !1;
                        }
                    };
                    o.concat = function (t, e) {
                        if (!D(t)) {
                            throw new TypeError('"list" argument must be an Array of Buffers');
                        }
                        if (0 === t.length) {
                            return o.alloc(0);
                        }
                        var i;
                        if (void 0 === e) {
                            e = 0;
                            i = 0;
                            for (; i < t.length; ++i) {
                                e += t[i].length;
                            }
                        }
                        var n = o.allocUnsafe(e);
                        var r = 0;
                        for (i = 0; i < t.length; ++i) {
                            var s = t[i];
                            if (!o.isBuffer(s)) {
                                throw new TypeError('"list" argument must be an Array of Buffers');
                            }
                            s.copy(n, r);
                            r += s.length;
                        }
                        return n;
                    };
                    o.byteLength = u;
                    o.prototype._isBuffer = !0;
                    o.prototype.swap16 = function () {
                        var t = this.length;
                        if (t % 2 != 0) {
                            throw new RangeError("Buffer size must be a multiple of 16-bits");
                        }
                        for (var e = 0; e < t; e += 2) {
                            p(this, e, e + 1);
                        }
                        return this;
                    };
                    o.prototype.swap32 = function () {
                        var t = this.length;
                        if (t % 4 != 0) {
                            throw new RangeError("Buffer size must be a multiple of 32-bits");
                        }
                        for (var e = 0; e < t; e += 4) {
                            p(this, e, e + 3);
                            p(this, e + 1, e + 2);
                        }
                        return this;
                    };
                    o.prototype.swap64 = function () {
                        var t = this.length;
                        if (t % 8 != 0) {
                            throw new RangeError("Buffer size must be a multiple of 64-bits");
                        }
                        for (var e = 0; e < t; e += 8) {
                            p(this, e, e + 7);
                            p(this, e + 1, e + 6);
                            p(this, e + 2, e + 5);
                            p(this, e + 3, e + 4);
                        }
                        return this;
                    };
                    o.prototype.toString = function () {
                        var t = 0 | this.length;
                        return 0 === t ? "" : 0 === arguments.length ? _(this, 0, t) : f.apply(this, arguments);
                    };
                    o.prototype.equals = function (t) {
                        if (!o.isBuffer(t)) {
                            throw new TypeError("Argument must be a Buffer");
                        }
                        return this === t || 0 === o.compare(this, t);
                    };
                    o.prototype.inspect = function () {
                        var t = "";
                        var e = i.INSPECT_MAX_BYTES;
                        this.length > 0 && (t = this.toString("hex", 0, e).match(/.{2}/g).join(" "), this.length > e && (t += " ... "));
                        return "<Buffer " + t + ">";
                    };
                    o.prototype.compare = function (t, e, i, n, r) {
                        if (!o.isBuffer(t)) {
                            throw new TypeError("Argument must be a Buffer");
                        }
                        void 0 === e && (e = 0);
                        void 0 === i && (i = t ? t.length : 0);
                        void 0 === n && (n = 0);
                        void 0 === r && (r = this.length);
                        if (e < 0 || i > t.length || n < 0 || r > this.length) {
                            throw new RangeError("out of range index");
                        }
                        if (n >= r && e >= i) {
                            return 0;
                        }
                        if (n >= r) {
                            return -1;
                        }
                        if (e >= i) {
                            return 1;
                        }
                        if (this === t) {
                            return 0;
                        }
                        for (var s = (r >>>= 0) - (n >>>= 0), a = (i >>>= 0) - (e >>>= 0), l = Math.min(s, a), c = this.slice(n, r), h = t.slice(e, i), u = 0; u < l; ++u) {
                            if (c[u] !== h[u]) {
                                s = c[u];
                                a = h[u];
                                break;
                            }
                        }
                        return s < a ? -1 : a < s ? 1 : 0;
                    };
                    o.prototype.includes = function (t, e, i) {
                        return -1 !== this.indexOf(t, e, i);
                    };
                    o.prototype.indexOf = function (t, e, i) {
                        return d(this, t, e, i, !0);
                    };
                    o.prototype.lastIndexOf = function (t, e, i) {
                        return d(this, t, e, i, !1);
                    };
                    o.prototype.write = function (t, e, i, n) {
                        if (void 0 === e) {
                            n = "utf8";
                            i = this.length;
                            e = 0;
                        } else {
                            if (void 0 === i && "string" == typeof e) {
                                n = e;
                                i = this.length;
                                e = 0;
                            } else {
                                if (!isFinite(e)) {
                                    throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
                                }
                                e |= 0;
                                isFinite(i) ? (i |= 0, void 0 === n && (n = "utf8")) : (n = i, i = void 0);
                            }
                        }
                        var r = this.length - e;
                        (void 0 === i || i > r) && (i = r);
                        if (t.length > 0 && (i < 0 || e < 0) || e > this.length) {
                            throw new RangeError("Attempt to write outside buffer bounds");
                        }
                        n || (n = "utf8");
                        for (var o = !1;;) {
                            switch (n) {
                                case "hex":
                                    return y(this, t, e, i);
                                case "utf8":
                                case "utf-8":
                                    return g(this, t, e, i);
                                case "ascii":
                                    return b(this, t, e, i);
                                case "latin1":
                                case "binary":
                                    return v(this, t, e, i);
                                case "base64":
                                    return w(this, t, e, i);
                                case "ucs2":
                                case "ucs-2":
                                case "utf16le":
                                case "utf-16le":
                                    return x(this, t, e, i);
                                default:
                                    if (o) {
                                        throw new TypeError("Unknown encoding: " + n);
                                    }
                                    n = ("" + n).toLowerCase();
                                    o = !0;
                            }
                        }
                    };
                    o.prototype.toJSON = function () {
                        return {
                            type: "Buffer",
                            data: Array.prototype.slice.call(this._arr || this, 0)
                        };
                    };
                    var W = 4096;
                    o.prototype.slice = function (t, e) {
                        var i;
                        var n = this.length;
                        (t = ~~t) < 0 ? (t += n) < 0 && (t = 0) : t > n && (t = n);
                        (e = void 0 === e ? n : ~~e) < 0 ? (e += n) < 0 && (e = 0) : e > n && (e = n);
                        e < t && (e = t);
                        if (o.TYPED_ARRAY_SUPPORT) {
                            (i = this.subarray(t, e)).__proto__ = o.prototype;
                        } else {
                            var r = e - t;
                            i = new o(r, void 0);
                            for (var s = 0; s < r; ++s) {
                                i[s] = this[s + t];
                            }
                        }
                        return i;
                    };
                    o.prototype.readUIntLE = function (t, e, i) {
                        t |= 0;
                        e |= 0;
                        i || T(t, e, this.length);
                        for (var n = this[t], r = 1, o = 0; ++o < e && (r *= 256);) {
                            n += this[t + o] * r;
                        }
                        return n;
                    };
                    o.prototype.readUIntBE = function (t, e, i) {
                        t |= 0;
                        e |= 0;
                        i || T(t, e, this.length);
                        for (var n = this[t + --e], r = 1; e > 0 && (r *= 256);) {
                            n += this[t + --e] * r;
                        }
                        return n;
                    };
                    o.prototype.readUInt8 = function (t, e) {
                        e || T(t, 1, this.length);
                        return this[t];
                    };
                    o.prototype.readUInt16LE = function (t, e) {
                        e || T(t, 2, this.length);
                        return this[t] | this[t + 1] << 8;
                    };
                    o.prototype.readUInt16BE = function (t, e) {
                        e || T(t, 2, this.length);
                        return this[t] << 8 | this[t + 1];
                    };
                    o.prototype.readUInt32LE = function (t, e) {
                        e || T(t, 4, this.length);
                        return (this[t] | this[t + 1] << 8 | this[t + 2] << 16) + 16777216 * this[t + 3];
                    };
                    o.prototype.readUInt32BE = function (t, e) {
                        e || T(t, 4, this.length);
                        return 16777216 * this[t] + (this[t + 1] << 16 | this[t + 2] << 8 | this[t + 3]);
                    };
                    o.prototype.readIntLE = function (t, e, i) {
                        t |= 0;
                        e |= 0;
                        i || T(t, e, this.length);
                        for (var n = this[t], r = 1, o = 0; ++o < e && (r *= 256);) {
                            n += this[t + o] * r;
                        }
                        n >= (r *= 128) && (n -= Math.pow(2, 8 * e));
                        return n;
                    };
                    o.prototype.readIntBE = function (t, e, i) {
                        t |= 0;
                        e |= 0;
                        i || T(t, e, this.length);
                        for (var n = e, r = 1, o = this[t + --n]; n > 0 && (r *= 256);) {
                            o += this[t + --n] * r;
                        }
                        o >= (r *= 128) && (o -= Math.pow(2, 8 * e));
                        return o;
                    };
                    o.prototype.readInt8 = function (t, e) {
                        e || T(t, 1, this.length);
                        return 128 & this[t] ? -1 * (255 - this[t] + 1) : this[t];
                    };
                    o.prototype.readInt16LE = function (t, e) {
                        e || T(t, 2, this.length);
                        var i = this[t] | this[t + 1] << 8;
                        return 32768 & i ? 4294901760 | i : i;
                    };
                    o.prototype.readInt16BE = function (t, e) {
                        e || T(t, 2, this.length);
                        var i = this[t + 1] | this[t] << 8;
                        return 32768 & i ? 4294901760 | i : i;
                    };
                    o.prototype.readInt32LE = function (t, e) {
                        e || T(t, 4, this.length);
                        return this[t] | this[t + 1] << 8 | this[t + 2] << 16 | this[t + 3] << 24;
                    };
                    o.prototype.readInt32BE = function (t, e) {
                        e || T(t, 4, this.length);
                        return this[t] << 24 | this[t + 1] << 16 | this[t + 2] << 8 | this[t + 3];
                    };
                    o.prototype.readFloatLE = function (t, e) {
                        e || T(t, 4, this.length);
                        return N.read(this, t, !0, 23, 4);
                    };
                    o.prototype.readFloatBE = function (t, e) {
                        e || T(t, 4, this.length);
                        return N.read(this, t, !1, 23, 4);
                    };
                    o.prototype.readDoubleLE = function (t, e) {
                        e || T(t, 8, this.length);
                        return N.read(this, t, !0, 52, 8);
                    };
                    o.prototype.readDoubleBE = function (t, e) {
                        e || T(t, 8, this.length);
                        return N.read(this, t, !1, 52, 8);
                    };
                    o.prototype.writeUIntLE = function (t, e, i, n) {
                        (t = +t, e |= 0, i |= 0, n) || A(this, t, e, i, Math.pow(2, 8 * i) - 1, 0);
                        var r = 1;
                        var o = 0;
                        for (this[e] = 255 & t; ++o < i && (r *= 256);) {
                            this[e + o] = t / r & 255;
                        }
                        return e + i;
                    };
                    o.prototype.writeUIntBE = function (t, e, i, n) {
                        (t = +t, e |= 0, i |= 0, n) || A(this, t, e, i, Math.pow(2, 8 * i) - 1, 0);
                        var r = i - 1;
                        var o = 1;
                        for (this[e + r] = 255 & t; --r >= 0 && (o *= 256);) {
                            this[e + r] = t / o & 255;
                        }
                        return e + i;
                    };
                    o.prototype.writeUInt8 = function (t, e, i) {
                        t = +t;
                        e |= 0;
                        i || A(this, t, e, 1, 255, 0);
                        o.TYPED_ARRAY_SUPPORT || (t = Math.floor(t));
                        this[e] = 255 & t;
                        return e + 1;
                    };
                    o.prototype.writeUInt16LE = function (t, e, i) {
                        t = +t;
                        e |= 0;
                        i || A(this, t, e, 2, 65535, 0);
                        o.TYPED_ARRAY_SUPPORT ? (this[e] = 255 & t, this[e + 1] = t >>> 8) : M(this, t, e, !0);
                        return e + 2;
                    };
                    o.prototype.writeUInt16BE = function (t, e, i) {
                        t = +t;
                        e |= 0;
                        i || A(this, t, e, 2, 65535, 0);
                        o.TYPED_ARRAY_SUPPORT ? (this[e] = t >>> 8, this[e + 1] = 255 & t) : M(this, t, e, !1);
                        return e + 2;
                    };
                    o.prototype.writeUInt32LE = function (t, e, i) {
                        t = +t;
                        e |= 0;
                        i || A(this, t, e, 4, 4294967295, 0);
                        o.TYPED_ARRAY_SUPPORT ? (this[e + 3] = t >>> 24, this[e + 2] = t >>> 16, this[e + 1] = t >>> 8, this[e] = 255 & t) : R(this, t, e, !0);
                        return e + 4;
                    };
                    o.prototype.writeUInt32BE = function (t, e, i) {
                        t = +t;
                        e |= 0;
                        i || A(this, t, e, 4, 4294967295, 0);
                        o.TYPED_ARRAY_SUPPORT ? (this[e] = t >>> 24, this[e + 1] = t >>> 16, this[e + 2] = t >>> 8, this[e + 3] = 255 & t) : R(this, t, e, !1);
                        return e + 4;
                    };
                    o.prototype.writeIntLE = function (t, e, i, n) {
                        t = +t;
                        e |= 0;
                        if (!n) {
                            var r = Math.pow(2, 8 * i - 1);
                            A(this, t, e, i, r - 1, -r);
                        }
                        var o = 0;
                        var s = 1;
                        var a = 0;
                        for (this[e] = 255 & t; ++o < i && (s *= 256);) {
                            t < 0 && 0 === a && 0 !== this[e + o - 1] && (a = 1);
                            this[e + o] = (t / s >> 0) - a & 255;
                        }
                        return e + i;
                    };
                    o.prototype.writeIntBE = function (t, e, i, n) {
                        t = +t;
                        e |= 0;
                        if (!n) {
                            var r = Math.pow(2, 8 * i - 1);
                            A(this, t, e, i, r - 1, -r);
                        }
                        var o = i - 1;
                        var s = 1;
                        var a = 0;
                        for (this[e + o] = 255 & t; --o >= 0 && (s *= 256);) {
                            t < 0 && 0 === a && 0 !== this[e + o + 1] && (a = 1);
                            this[e + o] = (t / s >> 0) - a & 255;
                        }
                        return e + i;
                    };
                    o.prototype.writeInt8 = function (t, e, i) {
                        t = +t;
                        e |= 0;
                        i || A(this, t, e, 1, 127, -128);
                        o.TYPED_ARRAY_SUPPORT || (t = Math.floor(t));
                        t < 0 && (t = 255 + t + 1);
                        this[e] = 255 & t;
                        return e + 1;
                    };
                    o.prototype.writeInt16LE = function (t, e, i) {
                        t = +t;
                        e |= 0;
                        i || A(this, t, e, 2, 32767, -32768);
                        o.TYPED_ARRAY_SUPPORT ? (this[e] = 255 & t, this[e + 1] = t >>> 8) : M(this, t, e, !0);
                        return e + 2;
                    };
                    o.prototype.writeInt16BE = function (t, e, i) {
                        t = +t;
                        e |= 0;
                        i || A(this, t, e, 2, 32767, -32768);
                        o.TYPED_ARRAY_SUPPORT ? (this[e] = t >>> 8, this[e + 1] = 255 & t) : M(this, t, e, !1);
                        return e + 2;
                    };
                    o.prototype.writeInt32LE = function (t, e, i) {
                        t = +t;
                        e |= 0;
                        i || A(this, t, e, 4, 2147483647, -2147483648);
                        o.TYPED_ARRAY_SUPPORT ? (this[e] = 255 & t, this[e + 1] = t >>> 8, this[e + 2] = t >>> 16, this[e + 3] = t >>> 24) : R(this, t, e, !0);
                        return e + 4;
                    };
                    o.prototype.writeInt32BE = function (t, e, i) {
                        t = +t;
                        e |= 0;
                        i || A(this, t, e, 4, 2147483647, -2147483648);
                        t < 0 && (t = 4294967295 + t + 1);
                        o.TYPED_ARRAY_SUPPORT ? (this[e] = t >>> 24, this[e + 1] = t >>> 16, this[e + 2] = t >>> 8, this[e + 3] = 255 & t) : R(this, t, e, !1);
                        return e + 4;
                    };
                    o.prototype.writeFloatLE = function (t, e, i) {
                        return U(this, t, e, !0, i);
                    };
                    o.prototype.writeFloatBE = function (t, e, i) {
                        return U(this, t, e, !1, i);
                    };
                    o.prototype.writeDoubleLE = function (t, e, i) {
                        return L(this, t, e, !0, i);
                    };
                    o.prototype.writeDoubleBE = function (t, e, i) {
                        return L(this, t, e, !1, i);
                    };
                    o.prototype.copy = function (t, e, i, n) {
                        i || (i = 0);
                        n || 0 === n || (n = this.length);
                        e >= t.length && (e = t.length);
                        e || (e = 0);
                        n > 0 && n < i && (n = i);
                        if (n === i) {
                            return 0;
                        }
                        if (0 === t.length || 0 === this.length) {
                            return 0;
                        }
                        if (e < 0) {
                            throw new RangeError("targetStart out of bounds");
                        }
                        if (i < 0 || i >= this.length) {
                            throw new RangeError("sourceStart out of bounds");
                        }
                        if (n < 0) {
                            throw new RangeError("sourceEnd out of bounds");
                        }
                        n > this.length && (n = this.length);
                        t.length - e < n - i && (n = t.length - e + i);
                        var r;
                        var s = n - i;
                        if (this === t && i < e && e < n) {
                            for (r = s - 1; r >= 0; --r) {
                                t[r + e] = this[r + i];
                            }
                        } else {
                            if (s < 1e3 || !o.TYPED_ARRAY_SUPPORT) {
                                for (r = 0; r < s; ++r) {
                                    t[r + e] = this[r + i];
                                }
                            } else {
                                Uint8Array.prototype.set.call(t, this.subarray(i, i + s), e);
                            }
                        }
                        return s;
                    };
                    o.prototype.fill = function (t, e, i, n) {
                        if ("string" == typeof t) {
                            "string" == typeof e ? (n = e, e = 0, i = this.length) : "string" == typeof i && (n = i, i = this.length);
                            if (1 === t.length) {
                                var r = t.charCodeAt(0);
                                r < 256 && (t = r);
                            }
                            if (void 0 !== n && "string" != typeof n) {
                                throw new TypeError("encoding must be a string");
                            }
                            if ("string" == typeof n && !o.isEncoding(n)) {
                                throw new TypeError("Unknown encoding: " + n);
                            }
                        } else {
                            "number" == typeof t && (t &= 255);
                        }
                        if (e < 0 || this.length < e || this.length < i) {
                            throw new RangeError("Out of range index");
                        }
                        if (i <= e) {
                            return this;
                        }
                        var s;
                        e >>>= 0;
                        i = void 0 === i ? this.length : i >>> 0;
                        t || (t = 0);
                        if ("number" == typeof t) {
                            for (s = e; s < i; ++s) {
                                this[s] = t;
                            }
                        } else {
                            var a = o.isBuffer(t) ? t : O(new o(t, n).toString());
                            var l = a.length;
                            for (s = 0; s < i - e; ++s) {
                                this[s + e] = a[s % l];
                            }
                        }
                        return this;
                    };
                    var z = /[^+\/0-9A-Za-z-_]/g;
                }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
            }, {
                "base64-js": 30,
                ieee754: 32,
                isarray: 34
            }],
            30: [function (t, e, i) {
                function n(t) {
                    var e = t.length;
                    if (e % 4 > 0) {
                        throw new Error("Invalid string. Length must be a multiple of 4");
                    }
                    return "=" === t[e - 2] ? 2 : "=" === t[e - 1] ? 1 : 0;
                }
                function r(t) {
                    return s[t >> 18 & 63] + s[t >> 12 & 63] + s[t >> 6 & 63] + s[63 & t];
                }
                function o(t, e, i) {
                    for (var n, o = [], s = e; s < i; s += 3) {
                        n = (t[s] << 16) + (t[s + 1] << 8) + t[s + 2];
                        o.push(r(n));
                    }
                    return o.join("");
                }
                i.byteLength = function (t) {
                    return 3 * t.length / 4 - n(t);
                };
                i.toByteArray = function (t) {
                    var e;
                    var i;
                    var r;
                    var o;
                    var s;
                    var c;
                    var h = t.length;
                    s = n(t);
                    c = new l(3 * h / 4 - s);
                    r = s > 0 ? h - 4 : h;
                    var u = 0;
                    e = 0;
                    i = 0;
                    for (; e < r; e += 4, i += 3) {
                        o = a[t.charCodeAt(e)] << 18 | a[t.charCodeAt(e + 1)] << 12 | a[t.charCodeAt(e + 2)] << 6 | a[t.charCodeAt(e + 3)];
                        c[u++] = o >> 16 & 255;
                        c[u++] = o >> 8 & 255;
                        c[u++] = 255 & o;
                    }
                    2 === s ? (o = a[t.charCodeAt(e)] << 2 | a[t.charCodeAt(e + 1)] >> 4, c[u++] = 255 & o) : 1 === s && (o = a[t.charCodeAt(e)] << 10 | a[t.charCodeAt(e + 1)] << 4 | a[t.charCodeAt(e + 2)] >> 2, c[u++] = o >> 8 & 255, c[u++] = 255 & o);
                    return c;
                };
                i.fromByteArray = function (t) {
                    for (var e, i = t.length, n = i % 3, r = "", a = [], l = 16383, c = 0, h = i - n; c < h; c += l) {
                        a.push(o(t, c, c + l > h ? h : c + l));
                    }
                    1 === n ? (e = t[i - 1], r += s[e >> 2], r += s[e << 4 & 63], r += "==") : 2 === n && (e = (t[i - 2] << 8) + t[i - 1], r += s[e >> 10], r += s[e >> 4 & 63], r += s[e << 2 & 63], r += "=");
                    a.push(r);
                    return a.join("");
                };
                for (var s = [], a = [], l = "undefined" != typeof Uint8Array ? Uint8Array : Array, c = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", h = 0, u = c.length; h < u; ++h) {
                    s[h] = c[h];
                    a[c.charCodeAt(h)] = h;
                }
                a["-".charCodeAt(0)] = 62;
                a["_".charCodeAt(0)] = 63;
            }, {}],
            31: [function (t, e, i) {
                !function (t) {
                    function i(t) {
                        for (var e in s) {
                            t[e] = s[e];
                        }
                        return t;
                    }
                    function n(t, e) {
                        function i(t) {
                            return t !== e && t.originalListener !== e;
                        }
                        var s;
                        var a = this;
                        if (arguments.length) {
                            if (e) {
                                if (s = r(a, t, !0)) {
                                    if (!(s = s.filter(i)).length) {
                                        return n.call(a, t);
                                    }
                                    a[o][t] = s;
                                }
                            } else {
                                if ((s = a[o]) && (delete s[t], !Object.keys(s).length)) {
                                    return n.call(a);
                                }
                            }
                        } else {
                            delete a[o];
                        }
                        return a;
                    }
                    function r(t, e, i) {
                        if (!i || t[o]) {
                            var n = t[o] || (t[o] = {});
                            return n[e] || (n[e] = []);
                        }
                    }
                    void 0 !== e && (e.exports = t);
                    var o = "listeners";
                    var s = {
                        on: function (t, e) {
                            r(this, t).push(e);
                            return this;
                        },
                        once: function (t, e) {
                            function i() {
                                n.call(o, t, i);
                                e.apply(this, arguments);
                            }
                            var o = this;
                            i.originalListener = e;
                            r(o, t).push(i);
                            return o;
                        },
                        off: n,
                        emit: function (t, e) {
                            function i(t) {
                                t.call(s);
                            }
                            function n(t) {
                                t.call(s, e);
                            }
                            function o(t) {
                                t.apply(s, c);
                            }
                            var s = this;
                            var a = r(s, t, !0);
                            if (!a) {
                                return !1;
                            }
                            var l = arguments.length;
                            if (1 === l) {
                                a.forEach(i);
                            } else {
                                if (2 === l) {
                                    a.forEach(n);
                                } else {
                                    var c = Array.prototype.slice.call(arguments, 1);
                                    a.forEach(o);
                                }
                            }
                            return !!a.length;
                        }
                    };
                    i(t.prototype);
                    t.mixin = i;
                }(function n() {
                    if (!(this instanceof n)) {
                        return new n();
                    }
                });
            }, {}],
            32: [function (t, e, i) {
                i.read = function (t, e, i, n, r) {
                    var o;
                    var s;
                    var a = 8 * r - n - 1;
                    var l = (1 << a) - 1;
                    var c = l >> 1;
                    var h = -7;
                    var u = i ? r - 1 : 0;
                    var f = i ? -1 : 1;
                    var p = t[e + u];
                    u += f;
                    o = p & (1 << -h) - 1;
                    p >>= -h;
                    h += a;
                    for (; h > 0; h -= 8) {
                        o = 256 * o + t[e + u];
                        u += f;
                    }
                    s = o & (1 << -h) - 1;
                    o >>= -h;
                    h += n;
                    for (; h > 0; h -= 8) {
                        s = 256 * s + t[e + u];
                        u += f;
                    }
                    if (0 === o) {
                        o = 1 - c;
                    } else {
                        if (o === l) {
                            return s ? NaN : 1 / 0 * (p ? -1 : 1);
                        }
                        s += Math.pow(2, n);
                        o -= c;
                    }
                    return (p ? -1 : 1) * s * Math.pow(2, o - n);
                };
                i.write = function (t, e, i, n, r, o) {
                    var s;
                    var a;
                    var l;
                    var c = 8 * o - r - 1;
                    var h = (1 << c) - 1;
                    var u = h >> 1;
                    var f = 23 === r ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
                    var p = n ? 0 : o - 1;
                    var d = n ? 1 : -1;
                    var m = e < 0 || 0 === e && 1 / e < 0 ? 1 : 0;
                    e = Math.abs(e);
                    isNaN(e) || e === 1 / 0 ? (a = isNaN(e) ? 1 : 0, s = h) : (s = Math.floor(Math.log(e) / Math.LN2), e * (l = Math.pow(2, -s)) < 1 && (s--, l *= 2), (e += s + u >= 1 ? f / l : f * Math.pow(2, 1 - u)) * l >= 2 && (s++, l /= 2), s + u >= h ? (a = 0, s = h) : s + u >= 1 ? (a = (e * l - 1) * Math.pow(2, r), s += u) : (a = e * Math.pow(2, u - 1) * Math.pow(2, r), s = 0));
                    for (; r >= 8; r -= 8) {
                        t[i + p] = 255 & a;
                        p += d;
                        a /= 256;
                    }
                    s = s << r | a;
                    c += r;
                    for (; c > 0; c -= 8) {
                        t[i + p] = 255 & s;
                        p += d;
                        s /= 256;
                    }
                    t[i + p - d] |= 128 * m;
                };
            }, {}],
            33: [function (t, e, i) {
                (function (t) {
                    !function (e) {
                        function i(t, i, v) {
                            function k(t, e, i, n) {
                                return this instanceof k ? function (t, e, i, n, r) {
                                    y && g && (e instanceof g && (e = new y(e)), n instanceof g && (n = new y(n)));
                                    if (!(e || i || n || p)) {
                                        return void (t.buffer = l(b, 0));
                                    }
                                    if (!s(e, i)) {
                                        r = i;
                                        n = e;
                                        i = 0;
                                        e = new (p || Array)(8);
                                    }
                                    t.buffer = e;
                                    t.offset = i |= 0;
                                    d !== typeof n && ("string" == typeof n ? function (t, e, i, n) {
                                        var r = 0;
                                        var o = i.length;
                                        var s = 0;
                                        var a = 0;
                                        "-" === i[0] && r++;
                                        for (var l = r; r < o;) {
                                            var c = parseInt(i[r++], n);
                                            if (!(c >= 0)) {
                                                break;
                                            }
                                            a = a * n + c;
                                            s = s * n + Math.floor(a / w);
                                            a %= w;
                                        }
                                        l && (s = ~s, a ? a = w - a : s++);
                                        E(t, e + S, s);
                                        E(t, e + V, a);
                                    }(e, i, n, r || 10) : s(n, r) ? a(e, i, n, r) : "number" == typeof r ? (E(e, i + S, n), E(e, i + V, r)) : n > 0 ? B(e, i, n) : n < 0 ? U(e, i, n) : a(e, i, b, 0));
                                }(this, t, e, i, n) : new k(t, e, i, n);
                            }
                            function _() {
                                var t = this.buffer;
                                var e = this.offset;
                                var i = C(t, e + S);
                                var n = C(t, e + V);
                                v || (i |= 0);
                                return i ? i * w + n : n;
                            }
                            function E(t, e, i) {
                                t[e + R] = 255 & i;
                                i >>= 8;
                                t[e + M] = 255 & i;
                                i >>= 8;
                                t[e + A] = 255 & i;
                                i >>= 8;
                                t[e + T] = 255 & i;
                            }
                            function C(t, e) {
                                return t[e + T] * x + (t[e + A] << 16) + (t[e + M] << 8) + t[e + R];
                            }
                            var S = i ? 0 : 4;
                            var V = i ? 4 : 0;
                            var T = i ? 0 : 3;
                            var A = i ? 1 : 2;
                            var M = i ? 2 : 1;
                            var R = i ? 3 : 0;
                            var B = i ? c : u;
                            var U = i ? h : f;
                            var L = k.prototype;
                            var H = "is" + t;
                            var O = "_" + H;
                            L.buffer = void 0;
                            L.offset = 0;
                            L[O] = !0;
                            L.toNumber = _;
                            L.toString = function (t) {
                                var e = this.buffer;
                                var i = this.offset;
                                var n = C(e, i + S);
                                var r = C(e, i + V);
                                var o = "";
                                var s = !v && 2147483648 & n;
                                s && (n = ~n, r = w - r);
                                t = t || 10;
                                for (;;) {
                                    var a = n % t * w + r;
                                    n = Math.floor(n / t);
                                    r = Math.floor(a / t);
                                    o = (a % t).toString(t) + o;
                                    if (!n && !r) {
                                        break;
                                    }
                                }
                                s && (o = "-" + o);
                                return o;
                            };
                            L.toJSON = _;
                            L.toArray = n;
                            m && (L.toBuffer = r);
                            y && (L.toArrayBuffer = o);
                            k[H] = function (t) {
                                return !(!t || !t[O]);
                            };
                            e[t] = k;
                            return k;
                        }
                        function n(t) {
                            var e = this.buffer;
                            var i = this.offset;
                            p = null;
                            return !1 !== t && 0 === i && 8 === e.length && v(e) ? e : l(e, i);
                        }
                        function r(e) {
                            var i = this.buffer;
                            var n = this.offset;
                            p = m;
                            if (!1 !== e && 0 === n && 8 === i.length && t.isBuffer(i)) {
                                return i;
                            }
                            var r = new m(8);
                            a(r, 0, i, n);
                            return r;
                        }
                        function o(t) {
                            var e = this.buffer;
                            var i = this.offset;
                            var n = e.buffer;
                            p = y;
                            if (!1 !== t && 0 === i && n instanceof g && 8 === n.byteLength) {
                                return n;
                            }
                            var r = new y(8);
                            a(r, 0, e, i);
                            return r.buffer;
                        }
                        function s(t, e) {
                            var i = t && t.length;
                            e |= 0;
                            return i && e + 8 <= i && "string" != typeof t[e];
                        }
                        function a(t, e, i, n) {
                            e |= 0;
                            n |= 0;
                            for (var r = 0; r < 8; r++) {
                                t[e++] = 255 & i[n++];
                            }
                        }
                        function l(t, e) {
                            return Array.prototype.slice.call(t, e, e + 8);
                        }
                        function c(t, e, i) {
                            for (var n = e + 8; n > e;) {
                                t[--n] = 255 & i;
                                i /= 256;
                            }
                        }
                        function h(t, e, i) {
                            var n = e + 8;
                            for (i++; n > e;) {
                                t[--n] = 255 & -i ^ 255;
                                i /= 256;
                            }
                        }
                        function u(t, e, i) {
                            for (var n = e + 8; e < n;) {
                                t[e++] = 255 & i;
                                i /= 256;
                            }
                        }
                        function f(t, e, i) {
                            var n = e + 8;
                            for (i++; e < n;) {
                                t[e++] = 255 & -i ^ 255;
                                i /= 256;
                            }
                        }
                        var p;
                        var d = "undefined";
                        var m = d !== typeof t && t;
                        var y = d !== typeof Uint8Array && Uint8Array;
                        var g = d !== typeof ArrayBuffer && ArrayBuffer;
                        var b = [0, 0, 0, 0, 0, 0, 0, 0];
                        var v = Array.isArray || function (t) {
                            return !!t && "[object Array]" == Object.prototype.toString.call(t);
                        };
                        var w = 4294967296;
                        var x = 16777216;
                        i("Uint64BE", !0, !0);
                        i("Int64BE", !0, !1);
                        i("Uint64LE", !1, !0);
                        i("Int64LE", !1, !1);
                    }("object" == typeof i && "string" != typeof i.nodeName ? i : this || {});
                }).call(this, t("buffer").Buffer);
            }, {
                buffer: 29
            }],
            34: [function (t, e, i) {
                var n = {}.toString;
                e.exports = Array.isArray || function (t) {
                    return "[object Array]" == n.call(t);
                };
            }, {}]
        }, {}, [1])(1);
    });
    var Er = Object.create(null);
    var Cr = window.msgpack;
    delete window.msgpack;
    var Sr = null;
    var Vr = null;
    var Tr = [];
    var Ar = null;
    function Mr(t) {
        if (Array.isArray(t) && 0 !== t.length) {
            t.forEach(function (t) {
                -1 === Tr.indexOf(t) && Tr.push(t);
            });
        }
    }
    function Rr() {
        return !(!Sr || !Vr) && -1 !== ["hsw", "hsj", "hsl"].indexOf(Sr.type) && (!("n" in Vr.payload) || Vr.payload.n === Sr.type);
    }
    function Br(t) {
        St("Set spec", "proof", "info", t);
        if (t) {
            Sr = t;
            Vr = null;
            try {
                Fr(Vr = Ut.decode(t.req))["catch"](function () {});
            } catch (Oo) {
                Ct("proof", Oo);
            }
        }
    }
    function Ur(t) {
        t && (Ar = t);
    }
    function Lr() {
        return new Promise(function (t) {
            var e;
            var i = Sr;
            var n = Vr;
            if (i) {
                try {
                    St("Solve Proof", "proof", "info", i);
                    if (!Rr()) {
                        Et("Asset script invalid file", "error", "proof", {
                            seen: i.type,
                            wanted: n && n.n
                        });
                        return void t({
                            solved: null,
                            spec: i
                        });
                    }
                    Promise.resolve().then(function () {
                        return Fr(n);
                    }).then(function (n) {
                        if ("function" != typeof n) {
                            return Promise.reject(new Error("Script is not a function"));
                        }
                        var r = {
                            assethost: ut.assethost,
                            fetchAsset: function (t) {
                                return Le.retrieve(t).then(function (e) {
                                    return e || Le.file(t, {
                                        responseType: "arraybuffer"
                                    });
                                }).then(function (t) {
                                    return t.data;
                                });
                            },
                            href: Ar,
                            ardata: null
                        };
                        Tr.length && (r.errors = Tr);
                        wi.messages.length && (r.messages = wi.consumeMessages());
                        e = setTimeout(function () {
                            Et("Timeout", "error", "proof", {
                                type: i.type,
                                req: i.req
                            });
                            t({
                                solved: "fail",
                                spec: i
                            });
                        }, 1e4);
                        return n(i.req, r);
                    }).then(function (n) {
                        clearTimeout(e);
                        t({
                            solved: n,
                            spec: i
                        });
                    })["catch"](function (e) {
                        "string" == typeof e && -1 !== e.indexOf("http") ? Et("Asset Script Failed", "error", "proof", {
                            error: e
                        }) : Ct("proof", e);
                        t({
                            solved: "fail",
                            spec: i
                        });
                    });
                } catch (Oo) {
                    Ct("proof", Oo);
                    t({
                        solved: null,
                        spec: i
                    });
                }
            } else {
                t({
                    solved: null,
                    spec: null
                });
            }
        });
    }
    function Hr(t) {
        return new Promise(function (e) {
            St("d0", "proof", "info", Sr);
            if (!Rr()) {
                Et("Asset script invalid file", "error", "proof", {
                    seen: !!Sr && Sr.type,
                    wanted: !!Vr && Vr.n
                });
                return e(undefined);
            }
            Fr(Vr).then(function (e) {
                return "function" != typeof e ? Promise.reject(new Error("Script is not a function")) : e(0, t);
            }).then(function (t) {
                e(Cr.decode(t));
            })["catch"](function (t) {
                Ct("d0", t);
                e(undefined);
            });
        });
    }
    function Or(t) {
        return new Promise(function (e) {
            St("e1", "proof", "info", Sr);
            if (!Rr()) {
                Et("Asset script invalid file", "error", "proof", {
                    seen: !!Sr && Sr.type,
                    wanted: !!Vr && Vr.n
                });
                return e(undefined);
            }
            Fr(Vr).then(function (e) {
                return "function" != typeof e ? Promise.reject(new Error("Script is not a function")) : e(1, Cr.encode(t));
            }).then(function (t) {
                e(t);
            })["catch"](function (t) {
                Ct("e1", t);
                e(undefined);
            });
        });
    }
    function Pr(t) {
        return Cr.encode(t);
    }
    function Fr(t) {
        var e = t.payload.l;
        "/" === e[0] && (e = ct.assetDomain + e);
        var i = t.payload.i;
        var n = t.payload.n;
        var r = Er[n];
        if (r && r.location === e) {
            return r.promise;
        }
        var o = Le.script(e + "/" + n + ".js", {
            integrity: i
        }).then(function () {
            var t = window[n];
            try {
                t("IiI=.eyJzIjowLCJmIjowLCJjIjowfQ==.")["catch"](function () {});
            } catch (Po) {}
            return t;
        });
        Er[n] = {
            location: e,
            promise: o
        };
        return o;
    }
    var Zr = null;
    var Nr = null;
    function Dr(t) {
        Nr && (Nr.e = Date.now() - Nr.s, Nr.r = t, Zr = Nr);
    }
    function Wr(t) {
        return isNaN(t) ? -1 : t;
    }
    function zr() {
        return -1 !== ["pt-BR", "es-BR"].indexOf(navigator.language);
    }
    var Ir = null;
    var jr = null;
    var Kr = null;
    var qr = null;
    var $r = {};
    var Gr = null;
    var Jr = !1;
    var Xr = !1;
    var Yr = !1;
    var Qr = null;
    var to = !1;
    var eo = 100;
    var io = {
        logAction: function (t) {
            Gr = t;
        },
        setEncryptionSupport: function (t) {
            Jr = t;
        },
        getTaskData: function (t, e, i, n, r) {
            t === undefined && (t = {});
            var o = e.proof;
            var s = {
                v: "a28812e910b57e4ac097884908bc2d05a8975c8a",
                sitekey: ct.sitekey,
                host: ct.host,
                hl: ge.getLocale()
            };
            r && (s.r = r);
            ut.se && (s.se = ut.se);
            !0 === ct.a11y_tfe && (s.a11y_tfe = !0);
            null !== Gr && (s.action = Gr, Gr = null);
            null !== qr && (s.extraData = JSON.stringify(qr), qr = null);
            t && (s.motionData = JSON.stringify(t));
            i && (s.pd = JSON.stringify(i));
            n && (s.pdc = JSON.stringify(n));
            var a = function () {
                if (!performance || !performance.getEntriesByType) {
                    return null;
                }
                var t;
                var e;
                var i = {};
                var n = performance.getEntriesByType("resource");
                for (t = 0; t < n.length; t += 1) {
                    -1 !== (e = n[t]).name.indexOf("checksiteconfig") ? (i.csc = e.duration, i.csch = (e.name.split("://")[1] || "").split("/")[0], i.cscrt = Wr(e.responseStart - e.requestStart), i.cscft = Wr(e.responseEnd - e.fetchStart)) : -1 !== e.name.indexOf("getcaptcha") && (i.gc = e.duration, i.gch = (e.name.split("://")[1] || "").split("/")[0], i.gcrt = Wr(e.responseStart - e.requestStart), i.gcft = Wr(e.responseEnd - e.fetchStart));
                }
                return i;
            }();
            a && (s.pem = JSON.stringify(a));
            null !== Ir && (jr = Ir, s.old_ekey = Ir);
            null !== Qr && (s.rqdata = Qr);
            o && (s.n = o.solved || null, s.c = o.spec ? JSON.stringify(o.spec) : null);
            e.authToken && (s.auth_token = e.authToken);
            e.hasPst !== undefined && (s.pst = e.hasPst);
            return new Promise(function (t, i) {
                try {
                    var n = "arraybuffer";
                    var r = "query";
                    var o = {
                        accept: "application/json, application/octet-stream",
                        "content-type": "application/x-www-form-urlencoded"
                    };
                    Xr && (n = "json", o.accept = "application/json");
                    var a;
                    var l = s;
                    "ArrayBuffer" in window || (Jr = !1);
                    if (Jr) {
                        Nr && (Nr.gces = Date.now() - Nr.s, Nr.gcee = null);
                        var c = JSON.parse(JSON.stringify(s));
                        delete c.c;
                        a = Or(c).then(function (t) {
                            t ? (Nr && (Nr.gcee = Date.now() - Nr.s), l = Pr([s.c, t]), r = "arraybuffer", o["content-type"] = "application/octet-stream") : Jr = !1;
                        });
                    } else {
                        a = Promise.resolve();
                    }
                    a.then(function () {
                        return Ce({
                            url: ut.endpoint + "/getcaptcha/" + s.sitekey,
                            data: l,
                            dataType: r,
                            responseType: n,
                            withCredentials: !0,
                            pst: e.hasPst ? "send-redemption-record" : null,
                            headers: o
                        });
                    }).then(function (t) {
                        var e = t.body || null;
                        if (!e) {
                            throw new Error("Missing response body.");
                        }
                        if ("ArrayBuffer" in window && e instanceof ArrayBuffer) {
                            Nr && (Nr.gcds = Date.now() - Nr.s, Nr.gcde = null);
                            return Hr(new Uint8Array(e)).then(function (t) {
                                if (!t) {
                                    throw new Error("error-parse-body");
                                }
                                Nr && (Nr.gcde = Date.now() - Nr.s);
                                return t;
                            });
                        }
                        if ("string" == typeof e) {
                            throw new Error("unhandled-getcaptcha-res-type-string");
                        }
                        return e;
                    }).then(function (e) {
                        if (!1 === e.success) {
                            var i = e["error-codes"] || [];
                            !1 === Yr && !0 === Xr && 0 === i.length && (i.push("expired-session"), Yr = !0);
                            -1 !== i.indexOf("invalid-data") && Et("invalid-data", "error", "api", {
                                motionData: s.motionData
                            });
                            return void t(e);
                        }
                        io.setData(e);
                        t(e);
                    })["catch"](function (t) {
                        Xr = !0;
                        Jr = !1;
                        i(t);
                    });
                } catch (Po) {
                    i(Po);
                }
            });
        },
        loadBundle: function (t) {
            return new Promise(function (e, i) {
                if ($r[t]) {
                    e($r[t]);
                } else {
                    var n = io.createBundleUrl(t);
                    Le.script(n).then(function () {
                        $r[t] = window[t];
                        e($r[t]);
                    })["catch"](function (t) {
                        i({
                            event: it.BUNDLE_ERROR,
                            message: "Failed to get challenge bundle.",
                            reason: t
                        });
                    });
                }
            });
        },
        createBundleUrl: function (t) {
            return (ut.assethost || ct.assetDomain) + "/captcha/v1/a28812e910b57e4ac097884908bc2d05a8975c8a/challenge/" + t + "/challenge.js";
        },
        checkAnswers: function (t, e, i) {
            var n = {
                v: "a28812e910b57e4ac097884908bc2d05a8975c8a",
                job_mode: qr.request_type,
                answers: t,
                serverdomain: ct.host,
                sitekey: ct.sitekey,
                motionData: JSON.stringify(e)
            };
            ut.se && (n.se = ut.se);
            i && (n.n = i.solved, n.c = JSON.stringify(i.spec));
            var r = 0;
            return new Promise(function (t, e) {
                try {
                    Ce({
                        url: function () {
                            return ut.endpoint + "/checkcaptcha/" + n.sitekey + "/" + qr.key;
                        },
                        data: function () {
                            r > 0 && (n.r = r);
                            return n;
                        },
                        dataType: "json",
                        responseType: "json",
                        withCredentials: !0,
                        headers: {
                            "Content-type": "application/json;charset=UTF-8"
                        },
                        retry: {
                            attempts: 4,
                            delay: eo,
                            onFail: function (t, e) {
                                r += 1;
                                St("checkcaptcha", "api", "debug", t);
                                var i = t && 0 === t.status;
                                return e > 1 && !i ? {
                                    retry: !0,
                                    delay: eo
                                } : 0 === e && -1 !== at.indexOf(ut.endpoint) ? (ut.endpoint = nt, {
                                    retry: !0,
                                    delay: 0
                                }) : ut.endpoint === st || ut.endpoint === nt ? (ut.endpoint = rt, {
                                    retry: !0,
                                    delay: 0
                                }) : ut.endpoint === rt ? zr() ? {
                                    retry: !0,
                                    delay: eo
                                } : (ut.endpoint = ot, {
                                    retry: !0,
                                    delay: 0
                                }) : ut.endpoint === ot ? (ut.endpoint = rt, {
                                    retry: !0,
                                    delay: 0
                                }) : (Et("api:checkcaptcha failed", "error", "challenge", {
                                    error: t
                                }), {
                                    retry: !0,
                                    delay: eo
                                });
                            }
                        }
                    }).then(function (e) {
                        var i = e.body || null;
                        if (!i) {
                            throw new Error("Missing response body.");
                        }
                        if (!1 === i.success) {
                            var r = i["error-codes"] || [""];
                            -1 !== r.indexOf("invalid-data") && Et("invalid-data", "error", "api", {
                                motionData: n.motionData
                            });
                            var o = r.join(", ");
                            throw new Error(o);
                        }
                        t(i);
                    })["catch"](e);
                } catch (Po) {
                    e(Po);
                }
            });
        },
        reportIssue: function (t, e, i) {
            var n = {
                taskdata: qr,
                on_url: ct.url,
                report_category: t,
                sid: Kr
            };
            e && (n.user_comments = e);
            jr && (n.last_ekey = jr);
            if (i && qr && "fallback" !== qr.request_type) {
                for (var r = qr.tasklist, o = null, s = -1; ++s < r.length && !o;) {
                    r[s].task_key === i && (o = r[s]);
                }
                n.taskdata.tasklist = [o];
            }
            return Ce({
                url: ut.reportapi + "/bug-report",
                data: n,
                dataType: "json",
                responseType: "json",
                withCredentials: !0,
                headers: {
                    "Content-type": "application/json;charset=UTF-8"
                }
            });
        },
        getEKey: function () {
            return Ir;
        },
        setData: function (t) {
            qr = t;
            Ir = t.key;
            to = !!t.rq;
            Kr || (Kr = Ir);
        },
        setRqData: function (t) {
            Qr = t;
        },
        getRqData: function () {
            return Qr;
        },
        hasPrivateStateToken: function () {
            return document.hasPrivateToken ? new Promise(function (t) {
                document.hasRedemptionRecord(ut.pstIssuer).then(function (e) {
                    e ? t(!0) : document.hasPrivateToken(ut.pstIssuer, "private-state-token").then(function (e) {
                        if (e) {
                            var i = {
                                v: "a28812e910b57e4ac097884908bc2d05a8975c8a",
                                sitekey: ct.sitekey,
                                host: ct.host
                            };
                            Ce({
                                url: ut.pstIssuer + "/pst/redemption",
                                data: i,
                                dataType: "json",
                                responseType: "json",
                                timeout: 1500,
                                pst: "token-redemption",
                                headers: {
                                    Accept: "application/json",
                                    "Content-Type": "application/json"
                                }
                            }).then(function () {
                                t(!0);
                            })["catch"](function (e) {
                                xt(e);
                                t(undefined);
                            });
                        } else {
                            t(!1);
                        }
                    })["catch"](function (e) {
                        xt(e);
                        t(undefined);
                    });
                })["catch"](function (e) {
                    xt(e);
                    t(undefined);
                });
            }) : Promise.resolve(undefined);
        },
        isRqChl: function () {
            return to;
        },
        getData: function () {
            return qr;
        },
        authenticate: function (t) {
            var e = {
                v: "a28812e910b57e4ac097884908bc2d05a8975c8a",
                sitekey: ct.sitekey,
                host: ct.host
            };
            var i = -1 === at.indexOf(ut.endpoint) ? ut.endpoint : rt;
            ut.se && (e.se = ut.se);
            t && (e.n = t.solved || null, e.c = t.spec ? JSON.stringify(t.spec) : null);
            return Ce({
                url: i + "/authenticate",
                data: e,
                dataType: "json",
                responseType: "json",
                withCredentials: !0,
                timeout: 1500,
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                }
            }).then(function (t) {
                return t.body;
            })["catch"](function (t) {
                if (401 === t.status) {
                    return t.response;
                }
                throw t;
            });
        }
    };
    var no = Tt();
    var ro = 100;
    var oo = ["10000000-ffff-ffff-ffff-000000000001", "20000000-ffff-ffff-ffff-000000000002", "30000000-ffff-ffff-ffff-000000000003"];
    var so = {
        sitekey: function (t) {
            return Gt.UUIDv4(t) || "00000000-0000-0000-0000-000000000000" === t || -1 !== oo.indexOf(t);
        },
        dummykey: function (t) {
            return -1 !== oo.indexOf(t);
        },
        logo: function (t) {
            if ("string" == typeof t) {
                return Gt.IMAGE(t);
            }
            if (t && "object" == typeof t && !Array.isArray(t)) {
                for (var e in t) {
                    var i = t[e];
                    if ("string" == typeof i && !Gt.IMAGE(i)) {
                        return !1;
                    }
                }
                return !0;
            }
            return !1;
        }
    };
    function ao() {
        var t;
        var e;
        var i;
        var n;
        var r;
        var o = so.dummykey(ct.sitekey);
        if ("localhost" === ct.host && !o) {
            var s = "Warning: localhost detected. Please use a valid host.";
            console.error(s);
            return Promise.reject(new Error(s));
        }
        return (t = ct.sitekey, e = ct.host, i = tt.Browser.supportsCanvas() >>> 0, n = tt.Browser.supportsWebAssembly() >>> 0, r = tt.Browser.supportsPST() >>> 0, new Promise(function (o, s) {
            var a = {
                v: "a28812e910b57e4ac097884908bc2d05a8975c8a",
                host: e,
                sitekey: t,
                sc: i,
                swa: n,
                spst: r
            };
            ut.se && (a.se = ut.se);
            var l = 0;
            Ce({
                url: function () {
                    var e = ut.endpoint;
                    e === rt && 0 === l && !zr() && Math.random() < .01 && -1 === t.indexOf("-0000-0000-0000-") && (e = ot);
                    l > 0 && (a.r = l);
                    return e + "/checksiteconfig?" + Ot(a);
                },
                responseType: "json",
                withCredentials: !0,
                timeout: function (t) {
                    return t && -1 !== t.indexOf(ot) ? 3e3 : 5e3;
                },
                headers: {
                    Accept: "application/json",
                    "Content-Type": "text/plain"
                },
                retry: {
                    attempts: 4,
                    delay: ro,
                    onFail: function (t, e) {
                        l += 1;
                        St("challenge", "api", "debug", t);
                        var i = t && (0 === t.status || 477 === t.status);
                        return e > 1 && !i ? {
                            retry: !0,
                            delay: ro
                        } : 0 === e && -1 !== at.indexOf(ut.endpoint) ? (ut.endpoint = nt, {
                            retry: !0,
                            delay: 0
                        }) : ut.endpoint === st || ut.endpoint === nt ? (ut.endpoint = rt, {
                            retry: !0,
                            delay: 0
                        }) : ut.endpoint === rt ? zr() ? {
                            retry: !0,
                            delay: ro
                        } : (ut.endpoint = ot, {
                            retry: !0,
                            delay: 0
                        }) : ut.endpoint === ot ? (ut.endpoint = rt, {
                            retry: !0,
                            delay: 0
                        }) : (Et("api:checksiteconfig failed", "error", "challenge", {
                            error: t
                        }), {
                            retry: t instanceof Error || 400 === t.status,
                            delay: ro
                        });
                    }
                }
            }).then(function (t) {
                var e = t.body || null;
                if (e) {
                    if (!1 === e.success) {
                        var i = (e["error-codes"] || []).join(", ");
                        s({
                            message: i,
                            body: e
                        });
                    } else {
                        !e.pass && e.error ? s({
                            message: e.error,
                            body: e
                        }) : o(e);
                    }
                } else {
                    s({
                        message: "Missing response body.",
                        body: e
                    });
                }
            })["catch"](s);
        })).then(function (t) {
            St("/checksiteconfig success", "request", "info", t);
            return t.endpoint && -1 !== at.indexOf(ut.endpoint) ? (ut.endpoint = t.endpoint, ao()) : (t.endpoint && -1 !== at.indexOf(ut.endpoint) && (ut.endpoint = t.endpoint), delete t.endpoint, t);
        });
    }
    var lo = new Pi();
    lo.add("contrast", {});
    lo.add("grey-red", {
        component: {
            checkbox: {
                main: {
                    border: "#6a6a6a"
                }
            }
        }
    });
    function co() {
        le.self(this, ce, "#a11y-label");
        this.state = {
            ticked: !1
        };
        this.setAttribute("aria-hidden", !0);
        this.css({
            display: "none"
        });
        this.translate();
    }
    function ho(t) {
        var e = t.get();
        var i = e.palette;
        var n = e.component;
        var r = "light" === i.mode;
        return Pi.merge({
            main: {
                fill: i.grey[100],
                border: i.grey[r ? 600 : 200]
            },
            focus: {
                fill: i.grey[200],
                border: i.grey[r ? 800 : 100],
                outline: "dark" === t.active() ? i.secondary.main : i.primary.main
            }
        }, n.input);
    }
    function uo() {
        le.self(this, ce, "#checkbox");
        this.state = {
            disabled: !1,
            focused: !1,
            visible: !0,
            passed: !1
        };
        this._style = ho(lo);
        this.setAttribute("aria-haspopup", !0);
        this.setAttribute("aria-checked", !1);
        this.setAttribute("role", "checkbox");
        this.setAttribute("tabindex", "0");
        this.setAttribute("aria-live", "assertive");
        this.setAttribute("aria-labelledby", "a11y-label");
        this.onOver = this.onOver.bind(this);
        this.onOut = this.onOut.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.addEventListener("over", this.onOver);
        this.addEventListener("out", this.onOut);
        this.addEventListener("focus", this.onFocus);
        this.addEventListener("blur", this.onBlur);
    }
    le.proto(co, ce);
    co.prototype.setState = function (t) {
        this.state.ticked = "passed" === t;
        this.translate();
    };
    co.prototype.translate = function () {
        var t = this.state.ticked ? "hCaptcha checkbox with text 'I am human' is now checked. You are verified" : "hCaptcha checkbox with text 'I am human'. Select in order to trigger the challenge, or to bypass it if you have an accessibility cookie.";
        this.content(ge.translate(t));
    };
    le.proto(uo, ce);
    uo.prototype.style = function () {
        this._style = ho(lo);
        var t = this.state.visible ? this._style.main.fill : "transparent";
        var e = this.state.focused ? this._style.focus.border : this._style.main.border;
        var i = this.state.visible ? e : "transparent";
        var n = this._style.focus.outline;
        this.css({
            position: "absolute",
            width: 28,
            height: 28,
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: i,
            borderRadius: 4,
            backgroundColor: t,
            outlineColor: n,
            top: 0,
            left: 0
        });
    };
    uo.prototype.onOver = function (t) {
        this.state.focused || this.state.disabled || (this.state.focused = "focus" === t.action, this.css({
            borderColor: this._style.focus.border
        }));
    };
    uo.prototype.onOut = function (t) {
        if ("blur" === t.action) {
            this.state.focused = !1;
        } else {
            if (this.state.focused) {
                return;
            }
        }
        this.css({
            borderColor: this._style.main.border
        });
    };
    uo.prototype.onFocus = function () {
        if (!this.state.disabled) {
            var t = this._style.focus.outline;
            this.css({
                outline: "2px solid " + t
            });
        }
    };
    uo.prototype.onBlur = function () {
        this.css({
            outline: "none"
        });
    };
    uo.prototype.display = function (t) {
        this.state.visible = t;
        this.setAttribute("tabindex", t ? 0 : -1);
        this.style();
    };
    uo.prototype.setState = function (t) {
        this.state.disabled = "disabled" === t;
        this.state.passed = "passed" === t;
        this.state.visible = "loading" !== t && "passed" !== t;
        this.setAttribute("tabindex", "loading" === t || "solving" === t ? -1 : 0);
        this.setAttribute("aria-hidden", "loading" === t || "solving" === t);
        this.setAttribute("aria-checked", this.state.passed);
        this.state.disabled ? this.setAttribute("disabled", "") : this.removeAttribute("disabled");
        this.style();
    };
    function fo() {
        le.self(this, Ii, {
            selector: ".pulse",
            src: "data:image/svg+xml,%3c%3fxml version='1.0' encoding='utf-8'%3f%3e%3c!-- Generator: Adobe Illustrator 21.0.2%2c SVG Export Plug-In . SVG Version: 6.00 Build 0) --%3e%3csvg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 44 44' style='enable-background:new 0 0 44 44%3b' xml:space='preserve'%3e%3cstyle type='text/css'%3e .st0%7bfill:none%3bstroke:%23FF7B00%3bstroke-width:2%3b%7d%3c/style%3e%3cg%3e %3ccircle class='st0' cx='22' cy='22' r='1'%3e %3canimate accumulate='none' additive='replace' attributeName='r' begin='0s' calcMode='spline' dur='1.8s' fill='remove' keySplines='0.165%2c 0.84%2c 0.44%2c 1' keyTimes='0%3b 1' repeatCount='indefinite' restart='always' values='1%3b 20'%3e %3c/animate%3e %3canimate accumulate='none' additive='replace' attributeName='stroke-opacity' begin='0s' calcMode='spline' dur='1.8s' fill='remove' keySplines='0.3%2c 0.61%2c 0.355%2c 1' keyTimes='0%3b 1' repeatCount='indefinite' restart='always' values='1%3b 0'%3e %3c/animate%3e %3c/circle%3e %3ccircle class='st0' cx='22' cy='22' r='1'%3e %3canimate accumulate='none' additive='replace' attributeName='r' begin='-0.9s' calcMode='spline' dur='1.8s' fill='remove' keySplines='0.165%2c 0.84%2c 0.44%2c 1' keyTimes='0%3b 1' repeatCount='indefinite' restart='always' values='1%3b 20'%3e %3c/animate%3e %3canimate accumulate='none' additive='replace' attributeName='stroke-opacity' begin='-0.9s' calcMode='spline' dur='1.8s' fill='remove' keySplines='0.3%2c 0.61%2c 0.355%2c 1' keyTimes='0%3b 1' repeatCount='indefinite' restart='always' values='1%3b 0'%3e %3c/animate%3e %3c/circle%3e%3c/g%3e%3c/svg%3e",
            width: 30,
            fallback: "https://newassets.hcaptcha.com/captcha/v1/a28812e910b57e4ac097884908bc2d05a8975c8a/static/images/pulse.gif"
        });
        this.state = {
            visible: !1
        };
    }
    le.proto(fo, Ii);
    fo.prototype.style = function () {
        this.size();
        this.css({
            display: this.state.visible ? "block" : "none",
            position: "absolute",
            top: 0,
            left: 0
        });
    };
    fo.prototype.display = function (t) {
        this.state.visible = t;
        this.style();
    };
    function po() {
        le.self(this, Ii, {
            selector: ".check",
            src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABmJLR0QA/wD/AP+gvaeTAAAC00lEQVR4nO2aTU8TQRyHn39bIdXEm3jwLQhefPkAJorYLYslIF64ohwM8eQH0A/gzYSLIRooxBORKJr4Ultq4smz8YgQb3ow4YAmUHY8IEpgd7vQ3e0smee4+5/uPL+daXdmCwaDwWAwGAwGg8FgMBgM+wBr0u7JFe17QWrTUXcmbqxJuwdhTpDejsHO7Ne5hbJf/b4KYFMeJAuAcKleCPsmgB3ymwiX2m901BZfLHx0a5eKpXcR4ykPgPqdEvnk1Vai7Fgc1JMXkevlm+88p0CiA2hUHhIcQBjykNAAwpKHBAYQpjwkLICw5SFBAUQhDwkJICp5SEAAUcqD5gFELQ8aBxCHPGgaQFzyoGEAccpDwNXgxZmhLCr6sPJTvXk/eRSDYcpDgAAGxgcOZleW31hF+1GUIViTdo9S6qXfna+MlN6HfV3fAApjhdZfrauzInIFkdGoQoh72G/FM4ChmaGW1cPOM+Dav4MRhNBMefAJ4OfK8hjQv+OEyKhV7H0YRgjNmPPb8QxgndQDYMn1pHC30ZHQrDm/Hc8APoy8XVK1dDew6FrQwHTIFe0uRJ43a9hvpW7nc0/6TklmvQq0uxYoNV65VbqDoIJcMFe0uwR5DRxy+bBY5SHgg1B+On9SOZkqqNOuBQFD0E0edvEkuBFCeh7ocC2oE4KO8rCL9wLl4fK3tKOuAguuBT7fCbrKwx7WAvaEfcJJybyCTteCbSNBZ3nY42Ko+2nheKbmVOuFkJuyL+ssDw2sBnNT/cdErVWBMx4ls6D6/B5y4vidr0dDT3PWY+soBzLzwNngrfS485s09HK0crvynbVaDvgSrIVe8hDShsjfkVABznlX6ScPIe4I2dN2W82RisD5nWf1lIeQt8Tsabtt3aEMcuH/UX3lIeQ/SJSGSz9anLQF6vPGEb3lIaJN0cJE4ciaOK9IcV9n+WiJYRPVYDAYDAaDoRH+ALzfixyrasnFAAAAAElFTkSuQmCC",
            width: 30,
            label: "Check mark"
        });
        this.state = {
            visible: !1
        };
    }
    function mo() {
        le.self(this, ce, "#anchor-wr");
        this.state = {
            disabled: !1,
            loading: !1,
            checked: !1
        };
        var t = this.createElement("#anchor-td");
        var e = t.createElement("#anchor-tc");
        var i = e.createElement("#anchor-state");
        this.a11y = this.initComponent(co);
        this.input = this.initComponent(uo, null, i);
        this.loading = this.initComponent(fo, null, i);
        this.checked = this.initComponent(po, null, i);
        this.table = t;
        this.cell = e;
        this.wrapper = i;
    }
    le.proto(po, Ii);
    po.prototype.style = function () {
        this.size();
        this.css({
            display: this.state.visible ? "block" : "none",
            position: "absolute",
            top: 0,
            left: 0,
            animation: this.state.visible ? "pop 0.4s linear" : "auto"
        });
    };
    po.prototype.display = function (t) {
        this.state.visible = t;
        this.style();
    };
    le.proto(mo, ce);
    mo.prototype.style = function (t) {
        var e = t ? 60 : "100%";
        var i = t ? "0px 12px" : "0px 15px";
        this.css({
            position: "relative",
            display: "inline-block",
            height: e,
            "-ms-high-contrast-adjust": "none"
        });
        this.table.css({
            position: "relative",
            display: "table",
            top: 0,
            height: "100%"
        });
        this.cell.css({
            display: "table-cell",
            verticalAlign: "middle"
        });
        this.wrapper.css({
            position: "relative",
            width: 30,
            height: 30,
            margin: i
        });
        this.input.style();
        this.loading.style();
        this.checked.style();
    };
    mo.prototype.describeBy = function (t) {
        t && t.dom && t.dom.id ? this.input.setAttribute("aria-describedby", t.dom.id) : this.input.removeAttribute("aria-describedby");
    };
    mo.prototype.setState = function (t) {
        var e = "loading" === t;
        var i = "passed" === t;
        var n = "disabled" === t;
        this.checked.display(i);
        this.loading.display(e);
        this.a11y.setState(t);
        this.input.setState(t);
        this.state.loading = e;
        this.state.checked = i;
        this.state.disabled = n;
    };
    mo.prototype.focus = function () {
        this.input.focus();
    };
    mo.prototype.getLocation = function () {
        var t = this.input.dom.getBoundingClientRect();
        var e = t.bottom - t.top;
        var i = t.right - t.left;
        return {
            left: t.left,
            right: t.right,
            top: t.top,
            bottom: t.bottom,
            width: i,
            height: e,
            x: t.left + i / 2,
            y: t.top + e / 2
        };
    };
    mo.prototype.translate = function () {
        this.a11y.translate();
        this.checked.translate();
    };
    function yo() {
        le.self(this, ce, "label-container");
        this.table = this.createElement("label-td");
        this.cell = this.table.createElement("label-tc");
        this.text = this.cell.createElement("#label");
        this.translate();
    }
    le.proto(yo, ce);
    yo.prototype.style = function (t) {
        var e = t ? 60 : "100%";
        var i = t ? 100 : 170;
        var n = lo.get().palette;
        this.css({
            position: "relative",
            display: "inline-block",
            height: e,
            width: i
        });
        this.table.css({
            position: "relative",
            display: "table",
            top: 0,
            height: "100%"
        });
        this.cell.css({
            display: "table-cell",
            verticalAlign: "middle"
        });
        this.text.css({
            color: n.text.body,
            fontSize: 14
        });
    };
    yo.prototype.translate = function () {
        var t = ge.translate("I am human");
        this.text.content(t);
    };
    var go = "Privacy";
    var bo = "https://hcaptcha.com/privacy";
    var vo = "hCaptcha Privacy Policy";
    var wo = "Terms";
    var xo = "https://hcaptcha.com/terms";
    var ko = "hCaptcha Terms of Service";
    function _o(t) {
        le.self(this, ce, "anchor-links");
        this.state = {
            theme: t.theme,
            size: t.size
        };
        this.privacy = this.initComponent(Di, {
            theme: lo,
            linkToLocale: !0,
            text: go,
            url: (t.privacyUrl || bo) + "?ref=" + ct.host + "&utm_campaign=" + ct.sitekey + "&utm_medium=checkbox"
        });
        this.hyphen = this.initComponent(Wi, {
            text: " - "
        });
        this.terms = this.initComponent(Di, {
            theme: lo,
            linkToLocale: !0,
            text: wo,
            url: (t.termsUrl || xo) + "?ref=" + ct.host + "&utm_campaign=" + ct.sitekey + "&utm_medium=checkbox"
        });
        this.translate();
    }
    le.proto(_o, ce);
    _o.prototype.style = function () {
        var t = function (t) {
            var e = t.palette;
            var i = t.component;
            var n = "light" === e.mode;
            return Pi.merge({
                main: e.grey[n ? 700 : 200]
            }, i.link);
        }(lo.get());
        var e = {
            fontSize: 8,
            color: t.main
        };
        this.privacy.style(e);
        this.hyphen.style(e);
        this.terms.style(e);
    };
    _o.prototype.translate = function () {
        this.privacy.translate();
        this.terms.translate();
        this.privacy.setAttribute("aria-label", ge.translate(vo));
        this.terms.setAttribute("aria-label", ge.translate(ko));
    };
    var Eo = "https://www.hcaptcha.com/what-is-hcaptcha-about";
    var Co = "Visit hcaptcha.com to learn more about the service and its accessibility options.";
    function So(t) {
        le.self(this, ce, "anchor-brand");
        this.state = {
            url: t.logoUrl || Eo + "?ref=" + ct.host + "&utm_campaign=" + ct.sitekey + "&utm_medium=checkbox",
            theme: "dark" === t.theme ? "dark" : "light",
            display: t.displayLogo,
            label: "hCaptcha"
        };
        var e = "light" === this.state.theme ? "data:image/svg+xml,%3csvg width='44' height='46' viewBox='0 0 44 46' role='img' aria-hidden='true' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath opacity='0.5' d='M30 28H26V32H30V28Z' fill='%230074BF'/%3e%3cpath opacity='0.7' d='M26 28H22V32H26V28Z' fill='%230074BF'/%3e%3cpath opacity='0.7' d='M22 28H18V32H22V28Z' fill='%230074BF'/%3e%3cpath opacity='0.5' d='M18 28H14V32H18V28Z' fill='%230074BF'/%3e%3cpath opacity='0.7' d='M34 24H30V28H34V24Z' fill='%230082BF'/%3e%3cpath opacity='0.8' d='M30 24H26V28H30V24Z' fill='%230082BF'/%3e%3cpath d='M26 24H22V28H26V24Z' fill='%230082BF'/%3e%3cpath d='M22 24H18V28H22V24Z' fill='%230082BF'/%3e%3cpath opacity='0.8' d='M18 24H14V28H18V24Z' fill='%230082BF'/%3e%3cpath opacity='0.7' d='M14 24H10V28H14V24Z' fill='%230082BF'/%3e%3cpath opacity='0.5' d='M38 20H34V24H38V20Z' fill='%23008FBF'/%3e%3cpath opacity='0.8' d='M34 20H30V24H34V20Z' fill='%23008FBF'/%3e%3cpath d='M30 20H26V24H30V20Z' fill='%23008FBF'/%3e%3cpath d='M26 20H22V24H26V20Z' fill='%23008FBF'/%3e%3cpath d='M22 20H18V24H22V20Z' fill='%23008FBF'/%3e%3cpath d='M18 20H14V24H18V20Z' fill='%23008FBF'/%3e%3cpath opacity='0.8' d='M14 20H10V24H14V20Z' fill='%23008FBF'/%3e%3cpath opacity='0.5' d='M10 20H6V24H10V20Z' fill='%23008FBF'/%3e%3cpath opacity='0.7' d='M38 16H34V20H38V16Z' fill='%23009DBF'/%3e%3cpath d='M34 16H30V20H34V16Z' fill='%23009DBF'/%3e%3cpath d='M30 16H26V20H30V16Z' fill='%23009DBF'/%3e%3cpath d='M26 16H22V20H26V16Z' fill='%23009DBF'/%3e%3cpath d='M22 16H18V20H22V16Z' fill='%23009DBF'/%3e%3cpath d='M18 16H14V20H18V16Z' fill='%23009DBF'/%3e%3cpath d='M14 16H10V20H14V16Z' fill='%23009DBF'/%3e%3cpath opacity='0.7' d='M10 16H6V20H10V16Z' fill='%23009DBF'/%3e%3cpath opacity='0.7' d='M38 12H34V16H38V12Z' fill='%2300ABBF'/%3e%3cpath d='M34 12H30V16H34V12Z' fill='%2300ABBF'/%3e%3cpath d='M30 12H26V16H30V12Z' fill='%2300ABBF'/%3e%3cpath d='M26 12H22V16H26V12Z' fill='%2300ABBF'/%3e%3cpath d='M22 12H18V16H22V12Z' fill='%2300ABBF'/%3e%3cpath d='M18 12H14V16H18V12Z' fill='%2300ABBF'/%3e%3cpath d='M14 12H10V16H14V12Z' fill='%2300ABBF'/%3e%3cpath opacity='0.7' d='M10 12H6V16H10V12Z' fill='%2300ABBF'/%3e%3cpath opacity='0.5' d='M38 8H34V12H38V8Z' fill='%2300B9BF'/%3e%3cpath opacity='0.8' d='M34 8H30V12H34V8Z' fill='%2300B9BF'/%3e%3cpath d='M30 8H26V12H30V8Z' fill='%2300B9BF'/%3e%3cpath d='M26 8H22V12H26V8Z' fill='%2300B9BF'/%3e%3cpath d='M22 8H18V12H22V8Z' fill='%2300B9BF'/%3e%3cpath d='M18 8H14V12H18V8Z' fill='%2300B9BF'/%3e%3cpath opacity='0.8' d='M14 8H10V12H14V8Z' fill='%2300B9BF'/%3e%3cpath opacity='0.5' d='M10 8H6V12H10V8Z' fill='%2300B9BF'/%3e%3cpath opacity='0.7' d='M34 4H30V8H34V4Z' fill='%2300C6BF'/%3e%3cpath opacity='0.8' d='M30 4H26V8H30V4Z' fill='%2300C6BF'/%3e%3cpath d='M26 4H22V8H26V4Z' fill='%2300C6BF'/%3e%3cpath d='M22 4H18V8H22V4Z' fill='%2300C6BF'/%3e%3cpath opacity='0.8' d='M18 4H14V8H18V4Z' fill='%2300C6BF'/%3e%3cpath opacity='0.7' d='M14 4H10V8H14V4Z' fill='%2300C6BF'/%3e%3cpath opacity='0.5' d='M30 0H26V4H30V0Z' fill='%2300D4BF'/%3e%3cpath opacity='0.7' d='M26 0H22V4H26V0Z' fill='%2300D4BF'/%3e%3cpath opacity='0.7' d='M22 0H18V4H22V0Z' fill='%2300D4BF'/%3e%3cpath opacity='0.5' d='M18 0H14V4H18V0Z' fill='%2300D4BF'/%3e%3cpath d='M16.5141 14.9697L17.6379 12.4572C18.0459 11.8129 17.9958 11.0255 17.5449 10.5745C17.4876 10.5173 17.416 10.46 17.3444 10.4171C17.0366 10.2238 16.6572 10.1808 16.3065 10.2954C15.9199 10.4171 15.5835 10.6748 15.3687 11.0184C15.3687 11.0184 13.8297 14.6046 13.2642 16.2153C12.6987 17.8259 12.9206 20.7822 15.1254 22.987C17.4661 25.3277 20.8448 25.8575 23.0066 24.2397C23.0997 24.1967 23.1784 24.1395 23.2572 24.0751L29.9072 18.5202C30.2293 18.2554 30.7089 17.7042 30.2794 17.0743C29.8642 16.4586 29.0697 16.881 28.7404 17.0886L24.9107 19.8731C24.8391 19.9304 24.7318 19.9232 24.6673 19.8517C24.6673 19.8517 24.6673 19.8445 24.6602 19.8445C24.56 19.7228 24.5456 19.4079 24.696 19.2862L30.5657 14.304C31.074 13.8459 31.1456 13.1802 30.7304 12.7292C30.3295 12.2854 29.6924 12.2997 29.1842 12.7578L23.9157 16.881C23.8155 16.9597 23.6652 16.9454 23.5864 16.8452L23.5793 16.838C23.4719 16.7235 23.4361 16.5231 23.5506 16.4014L29.535 10.596C30.0074 10.1522 30.036 9.4149 29.5922 8.94245C29.3775 8.72054 29.084 8.59169 28.7762 8.59169C28.4612 8.59169 28.1606 8.70623 27.9387 8.92813L21.8255 14.6691C21.6823 14.8122 21.396 14.6691 21.3602 14.4973C21.3459 14.4328 21.3674 14.3684 21.4103 14.3255L26.0918 8.99972C26.5571 8.56306 26.5858 7.83292 26.1491 7.36763C25.7124 6.90234 24.9823 6.87371 24.517 7.31036C24.4955 7.32468 24.4812 7.34615 24.4597 7.36763L17.3659 15.2203C17.1082 15.478 16.736 15.4851 16.557 15.342C16.4425 15.2489 16.4282 15.0843 16.5141 14.9697Z' fill='white'/%3e%3cpath d='M4.99195 43.6627H3.32946V40.8306C3.32946 40.1764 3.2488 39.6073 2.55423 39.6073C1.85966 39.6073 1.64905 40.2167 1.64905 41.0144V43.6627H0V36.112H1.64905V37.9045C1.64905 38.4512 1.64008 39.0427 1.64008 39.0427C1.89999 38.5632 2.38395 38.1689 3.13677 38.1689C4.61106 38.1689 4.99195 39.1637 4.99195 40.4766V43.6627Z' fill='%23555555'/%3e%3cpath d='M12.081 42.762C11.7181 43.1563 10.9652 43.7882 9.51337 43.7882C7.42069 43.7882 5.77612 42.3228 5.77612 39.8941C5.77612 37.4564 7.43861 36 9.50889 36C10.9742 36 11.7674 36.6453 11.9556 36.8514L11.4402 38.3167C11.3058 38.1285 10.544 37.5281 9.60299 37.5281C8.39757 37.5281 7.4655 38.3795 7.4655 39.8582C7.4655 41.337 8.43342 42.175 9.60299 42.175C10.4902 42.175 11.131 41.803 11.5209 41.3773L12.081 42.762Z' fill='%23555555'/%3e%3cpath d='M17.3016 43.6627H15.7242L15.6928 43.0936C15.4777 43.3221 15.0655 43.7837 14.2365 43.7837C13.3403 43.7837 12.3903 43.2684 12.3903 42.0674C12.3903 40.8665 13.4344 40.4587 14.3709 40.4139L15.6525 40.3601V40.2391C15.6525 39.67 15.2716 39.3743 14.6084 39.3743C13.9586 39.3743 13.3089 39.679 13.049 39.8538L12.6143 38.72C13.049 38.4915 13.8421 38.1733 14.7921 38.1733C15.7421 38.1733 16.2888 38.4019 16.6921 38.7962C17.082 39.1906 17.3016 39.7148 17.3016 40.6245V43.6627ZM15.657 41.2877L14.8414 41.3415C14.3351 41.3639 14.0348 41.5924 14.0348 41.9957C14.0348 42.4125 14.353 42.6634 14.8101 42.6634C15.2537 42.6634 15.5539 42.3587 15.657 42.1705V41.2877Z' fill='%23555555'/%3e%3cpath d='M21.6034 43.7792C20.8506 43.7792 20.3129 43.4835 19.9947 42.9816V45.6389H18.3456V38.2674H19.914L19.9051 38.9575H19.9275C20.2994 38.487 20.8461 38.1689 21.6213 38.1689C23.0867 38.1689 24.0142 39.3832 24.0142 40.9696C24.0142 42.5559 23.0777 43.7792 21.6034 43.7792ZM21.1284 39.549C20.4249 39.549 19.9409 40.1181 19.9409 40.9471C19.9409 41.7762 20.4249 42.3453 21.1284 42.3453C21.8409 42.3453 22.3249 41.7762 22.3249 40.9471C22.3249 40.1181 21.8409 39.549 21.1284 39.549Z' fill='%23555555'/%3e%3cpath d='M27.8321 39.6028H26.7074V41.5386C26.7074 42.0002 26.7701 42.1077 26.8508 42.2063C26.9225 42.296 27.0255 42.3363 27.2406 42.3363C27.4109 42.3318 27.5767 42.3004 27.738 42.2377L27.8187 43.6044C27.4378 43.7165 27.039 43.7747 26.6446 43.7792C26.0576 43.7792 25.6633 43.591 25.4079 43.2773C25.1524 42.9636 25.0449 42.511 25.0449 41.691V39.6028H24.3234V38.2809H25.0449V36.8156H26.7074V38.2809H27.8321V39.6028Z' fill='%23555555'/%3e%3cpath d='M32.7121 43.1339C32.6583 43.1787 32.1251 43.7792 30.7718 43.7792C29.3781 43.7792 28.0876 42.771 28.0876 40.9785C28.0876 39.1726 29.3961 38.1689 30.7897 38.1689C32.0892 38.1689 32.6762 38.738 32.6762 38.738L32.3133 40.0599C31.9458 39.7507 31.4843 39.5804 31.0048 39.5804C30.3013 39.5804 29.7456 40.0957 29.7456 40.9471C29.7456 41.7986 30.252 42.3363 31.0272 42.3363C31.8024 42.3363 32.3178 41.812 32.3178 41.812L32.7121 43.1339Z' fill='%23555555'/%3e%3cpath d='M38.3986 43.6627H36.7361V40.8306C36.7361 40.1764 36.6555 39.6073 35.9609 39.6073C35.2663 39.6073 35.0512 40.2212 35.0512 41.0188V43.6672H33.4067V36.112H35.0557V37.9045C35.0557 38.4512 35.0468 39.0427 35.0468 39.0427C35.3067 38.5632 35.7906 38.1689 36.5435 38.1689C38.0177 38.1689 38.3986 39.1637 38.3986 40.4766V43.6627Z' fill='%23555555'/%3e%3cpath d='M44 43.6627H42.4226L42.3913 43.0936C42.1762 43.3221 41.7639 43.7837 40.9349 43.7837C40.0387 43.7837 39.0887 43.2684 39.0887 42.0674C39.0887 40.8665 40.1328 40.4587 41.0693 40.4139L42.3509 40.3601V40.2391C42.3509 39.67 41.97 39.3743 41.3068 39.3743C40.6571 39.3743 40.0073 39.679 39.7474 39.8538L39.3127 38.7156C39.7474 38.487 40.5406 38.1689 41.4906 38.1689C42.4405 38.1689 42.9872 38.3974 43.3905 38.7917C43.7804 39.1861 44 39.7104 44 40.62V43.6627ZM42.3599 41.2877L41.5443 41.3415C41.038 41.3639 40.7377 41.5924 40.7377 41.9957C40.7377 42.4125 41.0559 42.6634 41.513 42.6634C41.9566 42.6634 42.2568 42.3587 42.3599 42.1705V41.2877V41.2877Z' fill='%23555555'/%3e%3c/svg%3e" : "data:image/svg+xml,%3csvg width='44' height='46' viewBox='0 0 44 46' role='img' aria-hidden='true' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath opacity='0.5' d='M30 28H26V32H30V28Z' fill='%230074BF'/%3e%3cpath opacity='0.7' d='M26 28H22V32H26V28Z' fill='%230074BF'/%3e%3cpath opacity='0.7' d='M22 28H18V32H22V28Z' fill='%230074BF'/%3e%3cpath opacity='0.5' d='M18 28H14V32H18V28Z' fill='%230074BF'/%3e%3cpath opacity='0.7' d='M34 24H30V28H34V24Z' fill='%230082BF'/%3e%3cpath opacity='0.8' d='M30 24H26V28H30V24Z' fill='%230082BF'/%3e%3cpath d='M26 24H22V28H26V24Z' fill='%230082BF'/%3e%3cpath d='M22 24H18V28H22V24Z' fill='%230082BF'/%3e%3cpath opacity='0.8' d='M18 24H14V28H18V24Z' fill='%230082BF'/%3e%3cpath opacity='0.7' d='M14 24H10V28H14V24Z' fill='%230082BF'/%3e%3cpath opacity='0.5' d='M38 20H34V24H38V20Z' fill='%23008FBF'/%3e%3cpath opacity='0.8' d='M34 20H30V24H34V20Z' fill='%23008FBF'/%3e%3cpath d='M30 20H26V24H30V20Z' fill='%23008FBF'/%3e%3cpath d='M26 20H22V24H26V20Z' fill='%23008FBF'/%3e%3cpath d='M22 20H18V24H22V20Z' fill='%23008FBF'/%3e%3cpath d='M18 20H14V24H18V20Z' fill='%23008FBF'/%3e%3cpath opacity='0.8' d='M14 20H10V24H14V20Z' fill='%23008FBF'/%3e%3cpath opacity='0.5' d='M10 20H6V24H10V20Z' fill='%23008FBF'/%3e%3cpath opacity='0.7' d='M38 16H34V20H38V16Z' fill='%23009DBF'/%3e%3cpath d='M34 16H30V20H34V16Z' fill='%23009DBF'/%3e%3cpath d='M30 16H26V20H30V16Z' fill='%23009DBF'/%3e%3cpath d='M26 16H22V20H26V16Z' fill='%23009DBF'/%3e%3cpath d='M22 16H18V20H22V16Z' fill='%23009DBF'/%3e%3cpath d='M18 16H14V20H18V16Z' fill='%23009DBF'/%3e%3cpath d='M14 16H10V20H14V16Z' fill='%23009DBF'/%3e%3cpath opacity='0.7' d='M10 16H6V20H10V16Z' fill='%23009DBF'/%3e%3cpath opacity='0.7' d='M38 12H34V16H38V12Z' fill='%2300ABBF'/%3e%3cpath d='M34 12H30V16H34V12Z' fill='%2300ABBF'/%3e%3cpath d='M30 12H26V16H30V12Z' fill='%2300ABBF'/%3e%3cpath d='M26 12H22V16H26V12Z' fill='%2300ABBF'/%3e%3cpath d='M22 12H18V16H22V12Z' fill='%2300ABBF'/%3e%3cpath d='M18 12H14V16H18V12Z' fill='%2300ABBF'/%3e%3cpath d='M14 12H10V16H14V12Z' fill='%2300ABBF'/%3e%3cpath opacity='0.7' d='M10 12H6V16H10V12Z' fill='%2300ABBF'/%3e%3cpath opacity='0.5' d='M38 8H34V12H38V8Z' fill='%2300B9BF'/%3e%3cpath opacity='0.8' d='M34 8H30V12H34V8Z' fill='%2300B9BF'/%3e%3cpath d='M30 8H26V12H30V8Z' fill='%2300B9BF'/%3e%3cpath d='M26 8H22V12H26V8Z' fill='%2300B9BF'/%3e%3cpath d='M22 8H18V12H22V8Z' fill='%2300B9BF'/%3e%3cpath d='M18 8H14V12H18V8Z' fill='%2300B9BF'/%3e%3cpath opacity='0.8' d='M14 8H10V12H14V8Z' fill='%2300B9BF'/%3e%3cpath opacity='0.5' d='M10 8H6V12H10V8Z' fill='%2300B9BF'/%3e%3cpath opacity='0.7' d='M34 4H30V8H34V4Z' fill='%2300C6BF'/%3e%3cpath opacity='0.8' d='M30 4H26V8H30V4Z' fill='%2300C6BF'/%3e%3cpath d='M26 4H22V8H26V4Z' fill='%2300C6BF'/%3e%3cpath d='M22 4H18V8H22V4Z' fill='%2300C6BF'/%3e%3cpath opacity='0.8' d='M18 4H14V8H18V4Z' fill='%2300C6BF'/%3e%3cpath opacity='0.7' d='M14 4H10V8H14V4Z' fill='%2300C6BF'/%3e%3cpath opacity='0.5' d='M30 0H26V4H30V0Z' fill='%2300D4BF'/%3e%3cpath opacity='0.7' d='M26 0H22V4H26V0Z' fill='%2300D4BF'/%3e%3cpath opacity='0.7' d='M22 0H18V4H22V0Z' fill='%2300D4BF'/%3e%3cpath opacity='0.5' d='M18 0H14V4H18V0Z' fill='%2300D4BF'/%3e%3cpath d='M16.5141 14.9697L17.6379 12.4572C18.0459 11.8129 17.9958 11.0255 17.5449 10.5745C17.4876 10.5173 17.416 10.46 17.3444 10.4171C17.0366 10.2238 16.6572 10.1808 16.3065 10.2954C15.9199 10.4171 15.5835 10.6748 15.3687 11.0184C15.3687 11.0184 13.8297 14.6046 13.2642 16.2153C12.6987 17.8259 12.9206 20.7822 15.1254 22.987C17.4661 25.3277 20.8448 25.8575 23.0066 24.2397C23.0997 24.1967 23.1784 24.1395 23.2572 24.0751L29.9072 18.5202C30.2293 18.2554 30.7089 17.7042 30.2794 17.0743C29.8642 16.4586 29.0697 16.881 28.7404 17.0886L24.9107 19.8731C24.8391 19.9304 24.7318 19.9232 24.6673 19.8517C24.6673 19.8517 24.6673 19.8445 24.6602 19.8445C24.56 19.7228 24.5456 19.4079 24.696 19.2862L30.5657 14.304C31.074 13.8459 31.1456 13.1802 30.7304 12.7292C30.3295 12.2854 29.6924 12.2997 29.1842 12.7578L23.9157 16.881C23.8155 16.9597 23.6652 16.9454 23.5864 16.8452L23.5793 16.838C23.4719 16.7235 23.4361 16.5231 23.5506 16.4014L29.535 10.596C30.0074 10.1522 30.036 9.4149 29.5922 8.94245C29.3775 8.72054 29.084 8.59169 28.7762 8.59169C28.4612 8.59169 28.1606 8.70623 27.9387 8.92813L21.8255 14.6691C21.6823 14.8122 21.396 14.6691 21.3602 14.4973C21.3459 14.4328 21.3674 14.3684 21.4103 14.3255L26.0918 8.99972C26.5571 8.56306 26.5858 7.83292 26.1491 7.36763C25.7124 6.90234 24.9823 6.87371 24.517 7.31036C24.4955 7.32468 24.4812 7.34615 24.4597 7.36763L17.3659 15.2203C17.1082 15.478 16.736 15.4851 16.557 15.342C16.4425 15.2489 16.4282 15.0843 16.5141 14.9697Z' fill='white'/%3e%3cpath d='M4.99195 43.6627H3.32946V40.8306C3.32946 40.1764 3.2488 39.6073 2.55423 39.6073C1.85966 39.6073 1.64905 40.2167 1.64905 41.0144V43.6627H0V36.112H1.64905V37.9045C1.64905 38.4512 1.64008 39.0427 1.64008 39.0427C1.89999 38.5632 2.38395 38.1689 3.13677 38.1689C4.61106 38.1689 4.99195 39.1637 4.99195 40.4766V43.6627Z' fill='white'/%3e%3cpath d='M12.081 42.762C11.7181 43.1563 10.9652 43.7882 9.51337 43.7882C7.42069 43.7882 5.77612 42.3228 5.77612 39.8941C5.77612 37.4564 7.43861 36 9.50889 36C10.9742 36 11.7674 36.6453 11.9556 36.8514L11.4402 38.3167C11.3058 38.1285 10.544 37.5281 9.60299 37.5281C8.39757 37.5281 7.4655 38.3795 7.4655 39.8582C7.4655 41.337 8.43342 42.175 9.60299 42.175C10.4902 42.175 11.131 41.803 11.5209 41.3773L12.081 42.762Z' fill='white'/%3e%3cpath d='M17.3016 43.6627H15.7242L15.6928 43.0936C15.4777 43.3221 15.0655 43.7837 14.2365 43.7837C13.3403 43.7837 12.3903 43.2684 12.3903 42.0674C12.3903 40.8665 13.4344 40.4587 14.3709 40.4139L15.6525 40.3601V40.2391C15.6525 39.67 15.2716 39.3743 14.6084 39.3743C13.9586 39.3743 13.3089 39.679 13.049 39.8538L12.6143 38.72C13.049 38.4915 13.8421 38.1733 14.7921 38.1733C15.7421 38.1733 16.2888 38.4019 16.6921 38.7962C17.082 39.1906 17.3016 39.7148 17.3016 40.6245V43.6627ZM15.657 41.2877L14.8414 41.3415C14.3351 41.3639 14.0348 41.5924 14.0348 41.9957C14.0348 42.4125 14.353 42.6634 14.8101 42.6634C15.2537 42.6634 15.5539 42.3587 15.657 42.1705V41.2877Z' fill='white'/%3e%3cpath d='M21.6035 43.7792C20.8506 43.7792 20.3129 43.4835 19.9948 42.9816V45.6389H18.3457V38.2674H19.9141L19.9051 38.9575H19.9275C20.2995 38.487 20.8462 38.1689 21.6214 38.1689C23.0867 38.1689 24.0143 39.3832 24.0143 40.9696C24.0143 42.5559 23.0778 43.7792 21.6035 43.7792ZM21.1285 39.549C20.4249 39.549 19.941 40.1181 19.941 40.9471C19.941 41.7762 20.4249 42.3453 21.1285 42.3453C21.841 42.3453 22.3249 41.7762 22.3249 40.9471C22.3249 40.1181 21.841 39.549 21.1285 39.549Z' fill='white'/%3e%3cpath d='M27.8322 39.6028H26.7074V41.5386C26.7074 42.0002 26.7702 42.1077 26.8508 42.2063C26.9225 42.296 27.0256 42.3363 27.2407 42.3363C27.411 42.3318 27.5768 42.3004 27.7381 42.2377L27.8188 43.6044C27.4379 43.7165 27.039 43.7747 26.6447 43.7792C26.0577 43.7792 25.6633 43.591 25.4079 43.2773C25.1525 42.9636 25.0449 42.511 25.0449 41.691V39.6028H24.3235V38.2809H25.0449V36.8156H26.7074V38.2809H27.8322V39.6028Z' fill='white'/%3e%3cpath d='M32.712 43.1339C32.6583 43.1787 32.125 43.7792 30.7717 43.7792C29.3781 43.7792 28.0875 42.771 28.0875 40.9785C28.0875 39.1726 29.396 38.1689 30.7896 38.1689C32.0892 38.1689 32.6762 38.738 32.6762 38.738L32.3132 40.0599C31.9458 39.7507 31.4842 39.5804 31.0047 39.5804C30.3012 39.5804 29.7455 40.0957 29.7455 40.9471C29.7455 41.7986 30.2519 42.3363 31.0271 42.3363C31.8024 42.3363 32.3177 41.812 32.3177 41.812L32.712 43.1339Z' fill='white'/%3e%3cpath d='M38.3986 43.6627H36.7361V40.8306C36.7361 40.1764 36.6554 39.6073 35.9608 39.6073C35.2663 39.6073 35.0512 40.2212 35.0512 41.0188V43.6672H33.4066V36.112H35.0557V37.9045C35.0557 38.4512 35.0467 39.0427 35.0467 39.0427C35.3066 38.5632 35.7906 38.1689 36.5434 38.1689C38.0177 38.1689 38.3986 39.1637 38.3986 40.4766V43.6627Z' fill='white'/%3e%3cpath d='M44 43.6627H42.4227L42.3913 43.0936C42.1762 43.3221 41.764 43.7837 40.935 43.7837C40.0387 43.7837 39.0887 43.2684 39.0887 42.0674C39.0887 40.8665 40.1328 40.4587 41.0694 40.4139L42.351 40.3601V40.2391C42.351 39.67 41.9701 39.3743 41.3069 39.3743C40.6571 39.3743 40.0074 39.679 39.7475 39.8538L39.3128 38.7156C39.7475 38.487 40.5406 38.1689 41.4906 38.1689C42.4406 38.1689 42.9873 38.3974 43.3906 38.7917C43.7805 39.1861 44 39.7104 44 40.62V43.6627ZM42.3599 41.2877L41.5444 41.3415C41.038 41.3639 40.7378 41.5924 40.7378 41.9957C40.7378 42.4125 41.0559 42.6634 41.513 42.6634C41.9566 42.6634 42.2569 42.3587 42.3599 42.1705V41.2877V41.2877Z' fill='white'/%3e%3c/svg%3e";
        var i = "https://newassets.hcaptcha.com/captcha/v1/a28812e910b57e4ac097884908bc2d05a8975c8a/static/images/logo_combination-" + this.state.theme + ".png";
        t.logo && (i = "png", e = "object" == typeof t.logo ? t.logo[this.state.theme] || t.logo.light : t.logo);
        var n = {
            theme: lo,
            url: this.state.url,
            src: e,
            fallback: i,
            autoLoad: this.state.display
        };
        this.logo = this.initComponent(xn, n);
    }
    function Vo(t) {
        le.self(this, ce, "anchor-info");
        this.state = {
            size: t.size
        };
        this.brand = this.initComponent(So, t);
        t.linksOff || (this.links = this.initComponent(_o, t));
    }
    function To() {
        le.self(this, ce, "#status");
        this.state = {
            visible: !1,
            copy: ""
        };
        this.translate();
        this.setAttribute("aria-hidden", !0);
        this.setAttribute("aria-live", "polite");
    }
    function Ao() {
        le.self(this, ce, "#warning");
        this.state = {
            visible: !1,
            copy: ""
        };
        this.$copy = this.initComponent(zi, {
            selector: ".warning-text",
            theme: lo
        });
        this.setAttribute("aria-hidden", !0);
        this.setAttribute("aria-live", "polite");
    }
    function Mo(t) {
        var e = t.palette;
        var i = t.component;
        var n = "light" === e.mode;
        return Pi.merge({
            main: {
                fill: e.grey[n ? 100 : 800],
                border: e.grey[n ? 300 : 200]
            },
            hover: {
                fill: e.grey[n ? 200 : 900]
            }
        }, i.checkbox);
    }
    function Ro(t) {
        le.self(this, bn, {
            selector: "#anchor",
            theme: lo,
            tabbable: !1
        });
        this.state = {
            disabled: !1,
            selected: !1,
            warning: !1,
            error: !1,
            ticked: !1,
            defaultVisible: "invisible" !== t.size
        };
        this.config = t;
        this._style = Mo(lo.get());
        this.setVisible(this.state.defaultVisible);
        this.onClick = this.onClick.bind(this);
        this.onHover = this.onHover.bind(this);
        this.anchor = this.initComponent(mo);
        this.label = this.initComponent(yo);
        this.info = this.initComponent(Vo, this.config);
        this.status = this.initComponent(To);
        this.warning = this.initComponent(Ao);
        this.addEventListener("enter", this.onClick);
        this.addEventListener("click", this.onClick);
        this.addEventListener("over", this.onHover);
        this.addEventListener("out", this.onHover);
    }
    function Bo(t, e) {
        var i = this;
        t instanceof ae || (t = new ae(t));
        ct.host = e.host ? e.host : "";
        ct.sitekey = e.sitekey ? e.sitekey : "";
        var n = new gi();
        var r = new Ro(e);
        r.style();
        r.reset();
        t.appendElement(r);
        t.css({
            display: "block"
        });
        t.addEventListener("down", function () {
            t.hasClass("using-kb") && t.removeClass("using-kb");
        });
        t.addEventListener("keyup", function (e) {
            9 === e.keyNum && t.addClass("using-kb");
        });
        r.on("select", function (t) {
            r.select();
            n.emit("select", t.action);
        });
        i.tick = function () {
            r.tick();
            r.anchor.focus();
        };
        i.reset = function () {
            r.reset();
            r.anchor.focus();
        };
        i.disable = function () {
            r.disable();
        };
        i.translate = function () {
            r.translate();
        };
        i.setStatus = function (t, e) {
            t ? (r.status.set(t, e), r.anchor.describeBy(r.status)) : (r.status.reset(), r.anchor.describeBy(null));
        };
        i.setWarning = function (t) {
            r.warning.set(t);
            r.warning.isVisible() ? r.anchor.describeBy(r.warning) : r.anchor.describeBy(null);
        };
        i.on = function (t, e) {
            n.on(t, e);
        };
        i.off = function (t, e) {
            n.off(t, e);
        };
        i.getLocation = function () {
            return r.anchor.getLocation();
        };
        i.setLoading = function (t) {
            return r.setLoading(t);
        };
        i.getLogoUrl = function () {
            return r.getLogoUrl();
        };
        i.theme = function (t, e) {
            e ? (lo.add(t, lo.extend(lo.active(), e)), lo.use(t)) : lo.use(t);
            r.style();
        };
        return i;
    }
    le.proto(So, ce);
    So.prototype.style = function () {
        if (this.state.display) {
            this.logo.size(44, 50);
            this.logo.css({
                margin: "0 auto"
            });
        }
    };
    So.prototype.translate = function () {
        this.logo.setAttribute("aria-label", ge.translate(Co));
        this.logo.setAttribute("href", this.logo.state.url + "&hl=" + ge.getLocale());
        this.setAttribute("title", this.state.label);
    };
    So.prototype.getLogoUrl = function () {
        return this.state.url;
    };
    le.proto(Vo, ce);
    Vo.prototype.style = function () {
        var t = this.state.size;
        var e = {
            display: "inline-block",
            height: "100%",
            width: 65
        };
        var i = {
            margin: "0 auto",
            top: this.links ? 6 : 10,
            position: "relative"
        };
        var n = {
            textAlign: "right",
            position: "fixed",
            bottom: 8,
            right: 11
        };
        "compact" === t && (e.width = "100%", e.height = "auto", e.marginTop = 5, i.top = this.links ? 0 : 10, n.textAlign = "center", n.position = "relative", n.bottom = 4, n.right = "auto");
        this.css(e);
        this.links && (this.links.style(), this.links.css(n));
        this.brand.style();
        this.brand.css(i);
    };
    Vo.prototype.setVisible = function (t) {
        if (this.links) {
            var e = "-1";
            t && (e = "0");
            this.brand.logo.setAttribute("tabindex", e);
            this.links.privacy.setAttribute("tabindex", e);
            this.links.terms.setAttribute("tabindex", e);
        }
    };
    Vo.prototype.translate = function () {
        this.links && this.links.translate();
        this.brand.translate();
    };
    Vo.prototype.getLogoUrl = function () {
        return this.brand.getLogoUrl();
    };
    le.proto(To, ce);
    To.prototype.style = function () {
        var t = lo.get().palette;
        this.css({
            display: this.state.visible ? "block" : "none",
            color: t.warn.main,
            fontSize: 10,
            top: 5,
            left: 5,
            position: "absolute"
        });
    };
    To.prototype.set = function (t, e) {
        if (t && t.indexOf("invalid-challenge") >= 0) {
            var i = t.replace(/-/g, " ");
            t = i.charAt(0).toUpperCase() + i.slice(1) + ".";
        }
        this.state.visible = t && "" !== t && !e;
        this.state.copy = t;
        this.state.visible ? (this.translate(), this.setAttribute("aria-hidden", e || !t)) : this.removeAttribute("aria-label");
        this.css({
            display: this.state.visible ? "block" : "none"
        });
    };
    To.prototype.reset = function () {
        this.state.visible = !1;
        this.state.copy = "";
        this.removeAttribute("aria-label");
        this.setAttribute("aria-hidden", !0);
        this.css({
            display: "none"
        });
    };
    To.prototype.translate = function () {
        if ("" !== this.state.copy) {
            var t = ge.translate(this.state.copy);
            this.setAttribute("aria-label", t);
            this.content(t);
        }
    };
    To.prototype.isVisible = function () {
        return this.state.visible;
    };
    le.proto(Ao, ce);
    Ao.prototype.style = function (t) {
        var e = t ? "95%" : "75%";
        var i = t ? 42 : 4;
        var n = lo.get().palette;
        this.css({
            display: this.state.visible ? "block" : "none",
            color: n.warn.main,
            fontSize: 10,
            bottom: i,
            left: 5,
            width: e,
            position: "absolute"
        });
    };
    Ao.prototype.set = function (t) {
        this.state.visible = t && "" !== t;
        this.state.copy = t;
        this.state.visible ? this.translate() : this.removeAttribute("aria-label");
        this.css({
            display: this.state.visible ? "block" : "none"
        });
    };
    Ao.prototype.translate = function () {
        if ("" !== this.state.copy) {
            var t = ge.translate(this.state.copy);
            this.setAttribute("aria-label", t);
            this.$copy.parseText(t);
        }
    };
    Ao.prototype.isVisible = function () {
        return this.state.visible;
    };
    le.proto(Ro, bn);
    Ro.prototype.style = function () {
        var t = "compact" === this.config.size;
        this._style = Mo(lo.get());
        this.info.style();
        this.anchor.style(t);
        this.label.style(t);
        this.status.style();
        this.warning.style(t);
        var e = t ? 156 : 300;
        var i = t ? 136 : 74;
        var n = {
            backgroundColor: this._style.main.fill,
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: this._style.main.border,
            borderRadius: 4,
            cursor: this.state.ticked || this.state.disabled ? "default" : "pointer",
            width: e,
            height: i
        };
        this.setStyle(n);
    };
    Ro.prototype.onHover = function (t) {
        var e = "over" === t.action ? "hover" : "main";
        this.css({
            backgroundColor: this._style[e].fill
        });
    };
    Ro.prototype.onClick = function (t) {
        var e = t.target || t.srcElement;
        var i = "string" == typeof e.className ? e.className : "";
        var n = i.indexOf("logo") >= 0 || i.indexOf("link") >= 0;
        if (this.state.selected || this.state.disabled || t.defaultPrevented || n) {
            return !0;
        }
        this.emit("select", t);
    };
    Ro.prototype.select = function () {
        this.state.selected = !0;
        this.setLoading(!0);
        this.info.setVisible(!1);
    };
    Ro.prototype.disable = function () {
        this.state.disabled = !0;
        this.anchor.setState("disabled");
        this.css({
            cursor: "default"
        });
    };
    Ro.prototype.reset = function () {
        this.state.disabbled = !1;
        this.state.ticked = !1;
        this.state.selected = !1;
        this.setVisible(this.state.defaultVisible);
        this.info.setVisible(this.state.defaultVisible);
        this.anchor.setState(null);
        this.css({
            cursor: "pointer"
        });
    };
    Ro.prototype.setLoading = function (t) {
        this.state.loading = t;
        var e = t ? "loading" : this.state.selected ? "solving" : null;
        this.anchor.setState(e);
        this.css({
            cursor: "default"
        });
    };
    Ro.prototype.tick = function () {
        this.state.ticked = !0;
        this.info.setVisible(this.state.defaultVisible);
        this.anchor.setState("passed");
        this.css({
            cursor: "default"
        });
    };
    Ro.prototype.translate = function () {
        this.anchor.translate();
        this.info.translate();
        this.label.translate();
        this.status.translate();
        this.warning.translate();
    };
    Ro.prototype.getLogoUrl = function () {
        return this.info.getLogoUrl();
    };
    var Uo = "hcaptcha-frame-a28812e910b57e4ac097884908bc2d05a8975c8a" === document.documentElement.getAttribute("data-id");
    var Lo = window.location.hash.slice(1);
    var Ho = Ht(Lo).frame;
    Uo && "challenge" === Ho ? function () {
        ri(2);
        var t = undefined;
        var e = 0;
        var i = undefined;
        var n = null;
        var r = null;
        var o = null;
        var s = [et.CHALLENGE_ALREADY_CLOSED, et.CHALLENGE_EXPIRED];
        window._sharedLibs = {
            packages: {
                config: {
                    Options: ut,
                    Color: ht,
                    Context: ct
                },
                utils: {
                    MathUtil: Wt,
                    Query: Pt,
                    Render: Lt,
                    Color: Rt,
                    Shuffle: Mt,
                    JWT: Ut,
                    TaskContext: Xt,
                    ErrorUtil: Vt,
                    PromiseUtil: Kt
                },
                canvas: {
                    Canvas: yi,
                    Path: ci,
                    Segment: li,
                    Point: ai,
                    PathSVG: fi,
                    ReticlePoint: mi
                },
                constants: lt,
                device: tt,
                language: ge,
                theme: Fi,
                core: ze,
                ui: Cn
            }
        };
        var a = window.location.hash.slice(1);
        var l = Ht(a);
        !function (t) {
            ct.host = t.host;
            ct.sitekey = t.sitekey;
            ct.file = "challenge";
            ut.sentry = !1 !== t.sentry;
            _t(!0);
            t.endpoint !== undefined && "undefined" !== t.endpoint && (ut.endpoint = t.endpoint);
            t.reportapi !== undefined && "undefined" !== t.reportapi && (ut.reportapi = t.reportapi);
            t.assethost !== undefined && "undefined" !== t.assethost && (Gt.URL(t.assethost) ? ut.assethost = t.assethost : console.error("Invalid assethost uri."));
            t.imghost !== undefined && "undefined" !== t.imghost && (ut.imghost = t.imghost);
            t.hl !== undefined && "undefined" !== t.hl && (ut.language = t.hl, ge.setLocale(ut.language));
            t.se !== undefined && "undefined" !== t.se && (ut.se = t.se);
            t.pstissuer !== undefined && "undefined" !== t.pstissuer && (ut.pstIssuer = t.pstissuer);
            t.pat !== undefined && "undefined" !== t.pat && (ut.pat = t.pat);
            ut.theme = t.theme || ut.theme;
            t.themeConfig && (ut.themeConfig = t.themeConfig);
            t["confirm-nav"] && (ut.confirmNav = !0);
        }(l);
        var c = setTimeout(function () {
            Et("Slow iframe initialization", "error", "frame:challenge", {
                readyState: document.readyState
            });
        }, 6e4);
        function h(i, r) {
            Ur(i && i.href);
            Xt.clear();
            null !== n && (clearTimeout(n), n = null);
            o.lockInterface(!0);
            Nr && (Nr.p = Date.now() - Nr.s);
            Lr().then(function (t) {
                return function (t, e) {
                    return e || "on" !== ut.pat || !tt.supportsPAT() ? Promise.resolve({
                        proof: t,
                        pass: !1
                    }) : io.authenticate(t).then(function (t) {
                        Br(t.c);
                        return Lr().then(function (e) {
                            return {
                                proof: e,
                                pass: t.pass,
                                authToken: t.auth_token
                            };
                        });
                    })["catch"](function (t) {
                        xt(t);
                        io.logAction(it.AUTHENTICATION_ERROR);
                        var e = t && t.response;
                        var i = e && e.body;
                        Br(i.c);
                        return Lr().then(function (t) {
                            return {
                                proof: t,
                                pass: i.pass || !1
                            };
                        });
                    });
                }(t, r);
            }).then(function (t) {
                return io.hasPrivateStateToken().then(function (e) {
                    t.hasPst = e;
                    return t;
                });
            }).then(function (t) {
                Nr && (Nr.gcs = Date.now() - Nr.s);
                return io.getTaskData(i, t, (n = Zr, Zr = null, n), Nr, e);
                var n;
            }).then(function (t) {
                Nr && (Nr.gce = Date.now() - Nr.s);
                return t.pass || !1 === t.success ? u(t) : (e = {
                    c: t.c,
                    rq: t.rq,
                    key: t.key,
                    challengeType: t.request_type
                }, e.challengeType ? (e.key && xi.send("challenge-key", {
                    key: e.key
                }), o.create({
                    rq: e.rq
                }), Br(e.c), i = e.challengeType, Nr && (Nr.l = Date.now() - Nr.s, Nr.t = i), io.loadBundle(e.challengeType).then(function (t) {
                    var i = io.getData();
                    o.lockInterface(!1);
                    Nr && (Nr.o = Date.now() - Nr.s);
                    return o.show({
                        width: ct.browserWidth,
                        height: ct.browserHeight,
                        bundle: t,
                        bundleData: i,
                        expiration: 1e3 * (i.expiration || 120),
                        challengeType: e.challengeType
                    });
                }).then(function (t) {
                    return xi.contact("check-api").then(function (e) {
                        return {
                            answers: t,
                            motionData: e
                        };
                    });
                }).then(function (t) {
                    return Lr().then(function (e) {
                        oi.stop();
                        ii.stop();
                        ni.stop();
                        var i = oi.getData();
                        i.topLevel = t.motionData;
                        i.v = 1;
                        i.tc = Xt.container;
                        Nr && (Nr.c = Date.now() - Nr.s);
                        return io.checkAnswers(t.answers, i, e);
                    })["catch"](function (t) {
                        if (o.isVisible() || t && -1 === s.indexOf(t.message)) {
                            o.lockInterface(!0);
                            throw t;
                        }
                    });
                })) : Promise.resolve({
                    c: e.c,
                    skip: !0
                })).then(u);
                var e;
                var i;
            })["catch"](function (i) {
                var n = i instanceof Error || "string" == typeof i ? {
                    event: it.CHALLENGE_ERROR,
                    message: ("string" == typeof i ? i : i.message) || ""
                } : i;
                io.logAction(n.event);
                if ("mfa" === ct.challenge_type && n.event === it.CHALLENGE_FAILED) {
                    Et("api:challenge failed", "error", "challenge", {
                        error: i
                    });
                    o.displayTryAgain(!0);
                    return void f();
                }
                var r = 429 === i.status;
                var s = i.response && i.response["error-codes"] || [];
                var a = -1 !== s.indexOf("invalid-data");
                St("challenge", "api", "debug", i);
                !t && !r && !a && (n.event === it.NETWORK_ERROR && 409 !== n.status || n.event === it.CHALLENGE_ERROR || n.event === it.BUNDLE_ERROR) && e <= 3 ? (e < 2 || (e < 3 ? ut.endpoint === st || ut.endpoint === nt ? ut.endpoint = rt : ut.endpoint === rt ? zr() || (ut.endpoint = ot) : ut.endpoint === ot && (ut.endpoint = rt) : -1 !== at.indexOf(ut.endpoint) && (ut.endpoint = nt)), e += 1, f()) : (e > 3 && 0 !== i.status && 429 !== i.status && 403 !== i.status && 400 !== i.status && Et("api:getcaptcha failed", "error", "challenge", {
                    error: i
                }), a ? n = {
                    event: it.NETWORK_ERROR,
                    message: s.join(", ")
                } : t ? (n = {
                    event: it.NETWORK_ERROR,
                    message: t
                }, console.error("[hCaptcha] " + t), t = undefined) : n.event || (e < 3 ? (e++, f()) : (n = {
                    event: it.NETWORK_ERROR,
                    message: "Rate limited or network error. Please retry."
                }, Et("api:getcaptcha generic failure", "error", "challenge", {
                    error: i
                }))), n.event && (e = 0), Dr(n.event), xi.send(et.CHALLENGE_CLOSED, n));
            });
        }
        function u(t) {
            Br(t.c);
            if (t.skip) {
                Dr(et.CHALLENGE_ESCAPED);
                xi.send(et.CHALLENGE_CLOSED, {
                    event: et.CHALLENGE_ESCAPED
                });
            } else {
                if (t.pass) {
                    Dr(et.CHALLENGE_PASSED);
                    xi.send(et.CHALLENGE_CLOSED, {
                        event: et.CHALLENGE_PASSED,
                        response: t.generated_pass_UUID,
                        expiration: t.expiration
                    });
                    t.generated_pass_UUID || Et("no pass id", "error", "frame:challenge");
                } else {
                    if (!1 === t.success) {
                        var e = t["error-codes"] || [];
                        if (-1 !== e.indexOf("expired-session") || -1 !== e.indexOf("client-fail")) {
                            return void f();
                        }
                        Dr(it.NETWORK_ERROR);
                        xi.send(et.CHALLENGE_CLOSED, {
                            event: it.NETWORK_ERROR,
                            message: e.join(", ")
                        });
                    } else {
                        o.displayTryAgain(!0);
                        io.logAction("challenge-failed");
                        f();
                    }
                }
            }
        }
        function f() {
            Nr && (Nr = {
                s: Date.now(),
                n: Nr.n + 1
            });
            if (io.isRqChl() && !ut.a11yChallenge) {
                o.lockInterface(!0);
                return void (n = setTimeout(function () {
                    Dr(it.CHALLENGE_ERROR);
                    xi.send(et.CHALLENGE_CLOSED, {
                        event: it.CHALLENGE_ERROR,
                        message: "Challenge Retry Failed"
                    });
                }, 2e3));
            }
            xi.contact("getcaptcha-manifest").then(function (t) {
                h(t, !0);
            });
        }
        function p(t, e) {
            ct.browserWidth = t.width;
            ct.browserHeight = t.height;
            o.size(t.width, t.height).then(function (t) {
                e.resolve(t);
                St("challenge resized", "challenge", "info", t);
            });
        }
        function d() {
            St("challenge refresh", "challenge", "info");
            io.logAction("challenge-refresh");
            f();
        }
        function m() {
            Mr(no.collect());
            o.submit().then(function (t) {
                io.logAction(t);
                "challenge-skip" !== t || f();
            })["catch"](function (t) {
                xt(t);
                io.logAction(it.CHALLENGE_ERROR);
                f();
            });
        }
        function y() {
            var t = io.getData();
            o.displayReport(t).then(function (t) {
                if (t) {
                    function e() {
                        d();
                        o.getModal().off("refresh", e);
                    }
                    o.getModal().display("report_image", {
                        key: t
                    });
                    o.getModal().on("refresh", e);
                }
            })["catch"](function (t) {
                xt(t);
                d();
            });
        }
        window.addEventListener("load", function () {
            c && (clearTimeout(c), c = null);
            St("iframe:load", "challenge", "info");
        });
        document.addEventListener("DOMContentLoaded", function () {
            St("iframe:DOMContentLoaded", "challenge", "info");
        });
        document.addEventListener("readystatechange", function () {
            St("iframe:readystatechange", "challenge", "info", {
                readyState: document.readyState
            });
        });
        no.run();
        o = new _r(document.body, {
            host: ct.host,
            sitekey: ct.sitekey,
            orientation: l.orientation || "portrait"
        });
        document.addEventListener("securitypolicyviolation", function (e) {
            "img-src" === e.violatedDirective && (t = "CSP blocks images (" + e.originalPolicy + ").");
        });
        ut.themeConfig && o.addTheme("custom", ut.themeConfig);
        xi.init(l.id, l.origin);
        r = new ae(document.body);
        xi.answer("create-challenge", function (t) {
            if (i && !1 === i.success) {
                xi.send(et.CHALLENGE_CLOSED, {
                    event: it.NETWORK_ERROR,
                    message: (i["error-codes"] || [""]).join(", ")
                });
            } else {
                Nr = {
                    s: Date.now(),
                    n: 0
                };
                var e;
                var n = {};
                t && (io.setRqData(t.rqdata || io.getRqData()), t.wdata && (e = t.wdata, window.__wdata = e), Mr(t.errors), t.width && (ct.browserWidth = t.width, ct.browserHeight = t.height), t.manifest && (n = t.manifest), "enter" === t.action ? r.addClass("using-kb") : r.hasClass("using-kb") && r.removeClass("using-kb"), o.init(t));
                o.setFocus("info");
                h(n, !1);
            }
        });
        xi.answer("close-challenge", function (t) {
            Dr(t.event);
            null !== n && (clearTimeout(n), n = null);
            t && t.event === et.CHALLENGE_ESCAPED && io.logAction("challenge-abandon-retry");
            io.setRqData(null);
            o.close();
        });
        xi.answer("resize-challenge", p);
        xi.answer("challenge-translate", function (t) {
            o.translateInterface(t);
            o.isVisible() && ("en" !== t.locale ? (io.logAction("challenge-language-change"), f()) : o.translateBundle());
        });
        xi.contact("get-url").then(function (t) {
            ct.url = t;
        });
        xi.answer("challenge-data", function (t) {
            t.rqdata && io.setRqData(t.rqdata);
        });
        o.events.on("refresh", d);
        o.events.on("submit", m);
        o.events.on("report", y);
        o.events.on("report-submission", function (t) {
            io.reportIssue(t.reason, t.comment, t.key)["catch"](function (t) {});
        });
        o.events.on("resize", function () {
            xi.send("challenge-resize");
        });
        o.events.on("focus-check", function () {
            r.addClass("using-kb");
            o.triggerFocus("submit");
        });
        r.addEventListener("down", function (t) {
            o.isInterfaceLocked() || o.displayTryAgain(!1);
        });
        r.addEventListener("keydown", function (t) {
            27 === t.keyNum && (o.getModal().isOpen() ? (o.getModal().close(), o.hideReport()) : (Dr(et.CHALLENGE_ESCAPED), xi.send(et.CHALLENGE_CLOSED, {
                event: et.CHALLENGE_ESCAPED
            }), o.close()));
        });
        r.addEventListener("down", function () {
            "menu" !== o.getActiveElement() && r.hasClass("using-kb") && r.removeClass("using-kb");
        }, !0);
        r.addEventListener("keydown", function (t) {
            9 === t.keyNum && (r.addClass("using-kb"), t.shiftKey || "submit" === o.getActiveElement() && (o.triggerFocus("challenge", 0), t.preventDefault && t.preventDefault()));
        }, !0);
        r.addEventListener("keydown", function (t) {
            if ("submit" === o.getActiveElement()) {
                var e = t.keyNum;
                37 === e || 38 === e ? (r.addClass("using-kb"), o.triggerFocus("challenge", -1), t.preventDefault && t.preventDefault()) : 39 !== e && 40 !== e || (r.addClass("using-kb"), o.triggerFocus("challenge", 0), t.preventDefault && t.preventDefault());
            }
        });
        ao().then(function (t) {
            i = t;
            var e = t.features;
            "object" != typeof e && (e = {});
            o.setWhiteLabel(!!t.custom);
            Br(t.c);
            ut.themeConfig && e.custom_theme ? o.useTheme("custom") : o.useTheme(ut.theme);
            e.a11y_challenge && (ut.a11yChallenge = !0, o.enableA11yChallenge(!0));
            !0 === e.enc_get_req && io.setEncryptionSupport(!0);
            return {
                ok: t
            };
        }, function (t) {
            var e = t instanceof Error ? {
                name: t.name,
                message: t.message
            } : t;
            "object" == typeof e && e.body && (i = e.body);
            return {
                err: e
            };
        }).then(function (t) {
            xi.send("site-setup", t);
        });
        xi.send("challenge-loaded");
    }() : Uo && "checkbox" === Ho && function () {
        ri(1);
        var t = !1;
        var e = window.location.hash.slice(1);
        var i = Ht(e);
        var n = wi.createChat(window.parent, i.id, i.origin);
        !function (t) {
            ct.id = t.id;
            ct.host = t.host;
            ct.sitekey = t.sitekey;
            ct.file = "checkbox";
            ut.sentry = !1 !== t.sentry;
            _t(!0);
            ut.size = t.size || ut.compact;
            ut.custom = t.custom || ut.custom;
            ut.mode = t.mode || ut.mode;
            ut.se = t.se || null;
            t.endpoint !== undefined && "undefined" !== t.endpoint && (ut.endpoint = t.endpoint);
            t.assethost !== undefined && "undefined" !== t.assethost && (Gt.URL(t.assethost) ? ut.assethost = t.assethost : console.error("Invalid assethost uri."));
            t.imghost !== undefined && "undefined" !== t.imghost && (ut.imghost = t.imghost);
            t.hl !== undefined && "undefined" !== t.hl && (ut.language = t.hl, ge.setLocale(t.hl));
            t.tplinks !== undefined && "undefined" !== t.tplinks && (ut.tplinks = t.tplinks);
            t.pat !== undefined && "undefined" !== t.pat && (ut.pat = t.pat);
            t.pstissuer !== undefined && "undefined" !== t.pstissuer && (ut.pstIssuer = t.pstissuer);
            ut.theme = t.theme || ut.theme;
            ut.themeConfig = t.themeConfig;
            ut.themeConfig && (t.custom = !0);
        }(i);
        var r = setTimeout(function () {
            Et("Slow iframe initialization", "error", "frame:checkbox", {
                readyState: document.readyState
            });
        }, 6e4);
        window.addEventListener("load", function () {
            r && (clearTimeout(r), r = null);
            St("iframe:load", "checkbox", "info");
        });
        document.addEventListener("DOMContentLoaded", function () {
            St("iframe:DOMContentLoaded", "checkbox", "info");
        });
        document.addEventListener("readystatechange", function () {
            St("iframe:readystatechange", "checkbox", "info", {
                readyState: document.readyState
            });
        });
        var o = so.sitekey(ct.sitekey);
        var s = so.dummykey(ct.sitekey);
        no.run();
        var a = null;
        var l = null;
        var c = new Promise(function (t) {
            l = t;
        });
        var h = null;
        function u(e, i) {
            var n = {
                host: ct.host,
                sitekey: ct.sitekey,
                size: ut.size,
                theme: ut.theme,
                mode: ut.mode,
                linksOff: "off" === ut.tplinks,
                displayLogo: "invisible" !== ut.size,
                logo: null,
                logoUrl: null,
                privacyUrl: null,
                termsUrl: null
            };
            var r = e && e.custom;
            if (r) {
                so.logo(r.logo) && (n.logo = r.logo);
                r.links && (n.logoUrl = r.links.logo, n.privacyUrl = r.links.privacy, n.termsUrl = r.links.terms);
                var a = r.copy;
                if (a) {
                    var l = {
                        checkbox_prompt: "I am human",
                        checkbox_a11y: "hCaptcha checkbox with text 'I am human'. Select in order to trigger the challenge, or to bypass it if you have an accessibility cookie."
                    };
                    for (var h in l) {
                        var u = a[h];
                        for (var f in u) {
                            var p = {};
                            p[l[h]] = u[f];
                            ge.addTable(f, p);
                        }
                    }
                    c.then(function (t) {
                        t.translate();
                    });
                }
            }
            var d = new Bo(document.body, n);
            var m = e && e.features && e.features.custom_theme;
            ut.themeConfig && m ? d.theme("custom", ut.themeConfig) : d.theme(ut.theme);
            d.setStatus(!1);
            o || s ? s && d.setWarning("This hCaptcha is for testing only. Please contact the site admin if you see this.") : d.setWarning("The sitekey for this hCaptcha is incorrect. Please contact the site admin if you see this.");
            d.on("select", function (e) {
                d.setStatus(!1);
                setTimeout(function () {
                    i.send("checkbox-selected", {
                        manifest: oi.getData(),
                        charity: t,
                        a11yChallenge: ut.a11yChallenge || !1,
                        link: d.getLogoUrl(),
                        action: e,
                        errors: no.collect()
                    });
                }, 1);
            });
            return d;
        }
        new Promise(function (t) {
            h = t;
        }).then(function (t) {
            if ("ok" in t) {
                return t.ok;
            }
            throw t.err;
        }).then(function (e) {
            a || (a = u(e, n), l(a));
            var i = e.features || {};
            ut.a11yChallenge = i.a11y_challenge || !1;
            t = e.charity || !1;
            e.status_message && o && !s && a.setWarning(e.status_message);
        }, function (t) {
            a || (a = u(null, n), l(a));
            t.message && a.setStatus(t.message);
            t.body && !1 === t.body.success && a.disable();
        }).then(function () {
            oi.resetData();
            oi.record(!0, !0, !0, !1);
            ii.resetData();
            ii.record(!0, !0, !0, !1);
            n.send("checkbox-loaded", a.getLocation());
        });
        (function (t, e, i) {
            i.listen("site-setup", e);
            i.listen("checkbox-tick", function () {
                t.then(function (t) {
                    t.tick();
                });
            });
            i.listen("checkbox-translate", function (e) {
                try {
                    if (!e || !e.locale || !e.table) {
                        return;
                    }
                    ge.setLocale(e.locale);
                    ge.addTable(e.locale, e.table);
                    t.then(function (t) {
                        t.translate();
                    });
                    document.documentElement.setAttribute("lang", ge.getLocale());
                } catch (Oo) {
                    Ct("translation", Oo);
                }
            });
            i.listen("checkbox-status", function (e) {
                t.then(function (t) {
                    t.setStatus(e.text, e.a11yOnly);
                });
            });
            i.listen("checkbox-reset", function () {
                t.then(function (t) {
                    t.reset();
                    oi.resetData();
                    oi.record();
                    ii.resetData();
                    ii.record();
                });
            });
            i.listen("checkbox-clear", function () {
                t.then(function (t) {
                    t.setLoading(!1);
                });
            });
            i.listen("checkbox-location", function (e) {
                t.then(function (t) {
                    var i = t.getLocation();
                    e.resolve(i);
                });
            });
        })(c, h, n);
        n.send("checkbox-ready");
        i.custom || (a = u(null, n), l(a));
    }();
}();