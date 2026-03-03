
import {Buffer} from "node:buffer";
globalThis.Buffer = Buffer;

import {AsyncLocalStorage} from "node:async_hooks";
globalThis.AsyncLocalStorage = AsyncLocalStorage;


const defaultDefineProperty = Object.defineProperty;
Object.defineProperty = function(o, p, a) {
  if(p=== '__import_unsupported' && Boolean(globalThis.__import_unsupported)) {
    return;
  }
  return defaultDefineProperty(o, p, a);
};

  
  
  globalThis.openNextDebug = false;globalThis.openNextVersion = "3.9.16";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// ../../node_modules/@opennextjs/aws/dist/utils/error.js
function isOpenNextError(e) {
  try {
    return "__openNextInternal" in e;
  } catch {
    return false;
  }
}
var init_error = __esm({
  "../../node_modules/@opennextjs/aws/dist/utils/error.js"() {
  }
});

// ../../node_modules/@opennextjs/aws/dist/adapters/logger.js
function debug(...args) {
  if (globalThis.openNextDebug) {
    console.log(...args);
  }
}
function warn(...args) {
  console.warn(...args);
}
function error(...args) {
  if (args.some((arg) => isDownplayedErrorLog(arg))) {
    return debug(...args);
  }
  if (args.some((arg) => isOpenNextError(arg))) {
    const error2 = args.find((arg) => isOpenNextError(arg));
    if (error2.logLevel < getOpenNextErrorLogLevel()) {
      return;
    }
    if (error2.logLevel === 0) {
      return console.log(...args.map((arg) => isOpenNextError(arg) ? `${arg.name}: ${arg.message}` : arg));
    }
    if (error2.logLevel === 1) {
      return warn(...args.map((arg) => isOpenNextError(arg) ? `${arg.name}: ${arg.message}` : arg));
    }
    return console.error(...args);
  }
  console.error(...args);
}
function getOpenNextErrorLogLevel() {
  const strLevel = process.env.OPEN_NEXT_ERROR_LOG_LEVEL ?? "1";
  switch (strLevel.toLowerCase()) {
    case "debug":
    case "0":
      return 0;
    case "error":
    case "2":
      return 2;
    default:
      return 1;
  }
}
var DOWNPLAYED_ERROR_LOGS, isDownplayedErrorLog;
var init_logger = __esm({
  "../../node_modules/@opennextjs/aws/dist/adapters/logger.js"() {
    init_error();
    DOWNPLAYED_ERROR_LOGS = [
      {
        clientName: "S3Client",
        commandName: "GetObjectCommand",
        errorName: "NoSuchKey"
      }
    ];
    isDownplayedErrorLog = (errorLog) => DOWNPLAYED_ERROR_LOGS.some((downplayedInput) => downplayedInput.clientName === errorLog?.clientName && downplayedInput.commandName === errorLog?.commandName && (downplayedInput.errorName === errorLog?.error?.name || downplayedInput.errorName === errorLog?.error?.Code));
  }
});

// ../../node_modules/cookie/dist/index.js
var require_dist = __commonJS({
  "../../node_modules/cookie/dist/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parseCookie = parseCookie;
    exports.parse = parseCookie;
    exports.stringifyCookie = stringifyCookie;
    exports.stringifySetCookie = stringifySetCookie;
    exports.serialize = stringifySetCookie;
    exports.parseSetCookie = parseSetCookie;
    exports.stringifySetCookie = stringifySetCookie;
    exports.serialize = stringifySetCookie;
    var cookieNameRegExp = /^[\u0021-\u003A\u003C\u003E-\u007E]+$/;
    var cookieValueRegExp = /^[\u0021-\u003A\u003C-\u007E]*$/;
    var domainValueRegExp = /^([.]?[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)([.][a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i;
    var pathValueRegExp = /^[\u0020-\u003A\u003D-\u007E]*$/;
    var maxAgeRegExp = /^-?\d+$/;
    var __toString = Object.prototype.toString;
    var NullObject = /* @__PURE__ */ (() => {
      const C = function() {
      };
      C.prototype = /* @__PURE__ */ Object.create(null);
      return C;
    })();
    function parseCookie(str, options) {
      const obj = new NullObject();
      const len = str.length;
      if (len < 2)
        return obj;
      const dec = options?.decode || decode;
      let index = 0;
      do {
        const eqIdx = eqIndex(str, index, len);
        if (eqIdx === -1)
          break;
        const endIdx = endIndex(str, index, len);
        if (eqIdx > endIdx) {
          index = str.lastIndexOf(";", eqIdx - 1) + 1;
          continue;
        }
        const key = valueSlice(str, index, eqIdx);
        if (obj[key] === void 0) {
          obj[key] = dec(valueSlice(str, eqIdx + 1, endIdx));
        }
        index = endIdx + 1;
      } while (index < len);
      return obj;
    }
    function stringifyCookie(cookie, options) {
      const enc = options?.encode || encodeURIComponent;
      const cookieStrings = [];
      for (const name of Object.keys(cookie)) {
        const val = cookie[name];
        if (val === void 0)
          continue;
        if (!cookieNameRegExp.test(name)) {
          throw new TypeError(`cookie name is invalid: ${name}`);
        }
        const value = enc(val);
        if (!cookieValueRegExp.test(value)) {
          throw new TypeError(`cookie val is invalid: ${val}`);
        }
        cookieStrings.push(`${name}=${value}`);
      }
      return cookieStrings.join("; ");
    }
    function stringifySetCookie(_name, _val, _opts) {
      const cookie = typeof _name === "object" ? _name : { ..._opts, name: _name, value: String(_val) };
      const options = typeof _val === "object" ? _val : _opts;
      const enc = options?.encode || encodeURIComponent;
      if (!cookieNameRegExp.test(cookie.name)) {
        throw new TypeError(`argument name is invalid: ${cookie.name}`);
      }
      const value = cookie.value ? enc(cookie.value) : "";
      if (!cookieValueRegExp.test(value)) {
        throw new TypeError(`argument val is invalid: ${cookie.value}`);
      }
      let str = cookie.name + "=" + value;
      if (cookie.maxAge !== void 0) {
        if (!Number.isInteger(cookie.maxAge)) {
          throw new TypeError(`option maxAge is invalid: ${cookie.maxAge}`);
        }
        str += "; Max-Age=" + cookie.maxAge;
      }
      if (cookie.domain) {
        if (!domainValueRegExp.test(cookie.domain)) {
          throw new TypeError(`option domain is invalid: ${cookie.domain}`);
        }
        str += "; Domain=" + cookie.domain;
      }
      if (cookie.path) {
        if (!pathValueRegExp.test(cookie.path)) {
          throw new TypeError(`option path is invalid: ${cookie.path}`);
        }
        str += "; Path=" + cookie.path;
      }
      if (cookie.expires) {
        if (!isDate(cookie.expires) || !Number.isFinite(cookie.expires.valueOf())) {
          throw new TypeError(`option expires is invalid: ${cookie.expires}`);
        }
        str += "; Expires=" + cookie.expires.toUTCString();
      }
      if (cookie.httpOnly) {
        str += "; HttpOnly";
      }
      if (cookie.secure) {
        str += "; Secure";
      }
      if (cookie.partitioned) {
        str += "; Partitioned";
      }
      if (cookie.priority) {
        const priority = typeof cookie.priority === "string" ? cookie.priority.toLowerCase() : void 0;
        switch (priority) {
          case "low":
            str += "; Priority=Low";
            break;
          case "medium":
            str += "; Priority=Medium";
            break;
          case "high":
            str += "; Priority=High";
            break;
          default:
            throw new TypeError(`option priority is invalid: ${cookie.priority}`);
        }
      }
      if (cookie.sameSite) {
        const sameSite = typeof cookie.sameSite === "string" ? cookie.sameSite.toLowerCase() : cookie.sameSite;
        switch (sameSite) {
          case true:
          case "strict":
            str += "; SameSite=Strict";
            break;
          case "lax":
            str += "; SameSite=Lax";
            break;
          case "none":
            str += "; SameSite=None";
            break;
          default:
            throw new TypeError(`option sameSite is invalid: ${cookie.sameSite}`);
        }
      }
      return str;
    }
    function parseSetCookie(str, options) {
      const dec = options?.decode || decode;
      const len = str.length;
      const endIdx = endIndex(str, 0, len);
      const eqIdx = eqIndex(str, 0, endIdx);
      const setCookie = eqIdx === -1 ? { name: "", value: dec(valueSlice(str, 0, endIdx)) } : {
        name: valueSlice(str, 0, eqIdx),
        value: dec(valueSlice(str, eqIdx + 1, endIdx))
      };
      let index = endIdx + 1;
      while (index < len) {
        const endIdx2 = endIndex(str, index, len);
        const eqIdx2 = eqIndex(str, index, endIdx2);
        const attr = eqIdx2 === -1 ? valueSlice(str, index, endIdx2) : valueSlice(str, index, eqIdx2);
        const val = eqIdx2 === -1 ? void 0 : valueSlice(str, eqIdx2 + 1, endIdx2);
        switch (attr.toLowerCase()) {
          case "httponly":
            setCookie.httpOnly = true;
            break;
          case "secure":
            setCookie.secure = true;
            break;
          case "partitioned":
            setCookie.partitioned = true;
            break;
          case "domain":
            setCookie.domain = val;
            break;
          case "path":
            setCookie.path = val;
            break;
          case "max-age":
            if (val && maxAgeRegExp.test(val))
              setCookie.maxAge = Number(val);
            break;
          case "expires":
            if (!val)
              break;
            const date = new Date(val);
            if (Number.isFinite(date.valueOf()))
              setCookie.expires = date;
            break;
          case "priority":
            if (!val)
              break;
            const priority = val.toLowerCase();
            if (priority === "low" || priority === "medium" || priority === "high") {
              setCookie.priority = priority;
            }
            break;
          case "samesite":
            if (!val)
              break;
            const sameSite = val.toLowerCase();
            if (sameSite === "lax" || sameSite === "strict" || sameSite === "none") {
              setCookie.sameSite = sameSite;
            }
            break;
        }
        index = endIdx2 + 1;
      }
      return setCookie;
    }
    function endIndex(str, min, len) {
      const index = str.indexOf(";", min);
      return index === -1 ? len : index;
    }
    function eqIndex(str, min, max) {
      const index = str.indexOf("=", min);
      return index < max ? index : -1;
    }
    function valueSlice(str, min, max) {
      let start = min;
      let end = max;
      do {
        const code = str.charCodeAt(start);
        if (code !== 32 && code !== 9)
          break;
      } while (++start < end);
      while (end > start) {
        const code = str.charCodeAt(end - 1);
        if (code !== 32 && code !== 9)
          break;
        end--;
      }
      return str.slice(start, end);
    }
    function decode(str) {
      if (str.indexOf("%") === -1)
        return str;
      try {
        return decodeURIComponent(str);
      } catch (e) {
        return str;
      }
    }
    function isDate(val) {
      return __toString.call(val) === "[object Date]";
    }
  }
});

// ../../node_modules/@opennextjs/aws/dist/http/util.js
function parseSetCookieHeader(cookies) {
  if (!cookies) {
    return [];
  }
  if (typeof cookies === "string") {
    return cookies.split(/(?<!Expires=\w+),/i).map((c) => c.trim());
  }
  return cookies;
}
function getQueryFromIterator(it) {
  const query = {};
  for (const [key, value] of it) {
    if (key in query) {
      if (Array.isArray(query[key])) {
        query[key].push(value);
      } else {
        query[key] = [query[key], value];
      }
    } else {
      query[key] = value;
    }
  }
  return query;
}
var init_util = __esm({
  "../../node_modules/@opennextjs/aws/dist/http/util.js"() {
    init_logger();
  }
});

// ../../node_modules/@opennextjs/aws/dist/overrides/converters/utils.js
function getQueryFromSearchParams(searchParams) {
  return getQueryFromIterator(searchParams.entries());
}
var init_utils = __esm({
  "../../node_modules/@opennextjs/aws/dist/overrides/converters/utils.js"() {
    init_util();
  }
});

// ../../node_modules/@opennextjs/aws/dist/overrides/converters/edge.js
var edge_exports = {};
__export(edge_exports, {
  default: () => edge_default
});
import { Buffer as Buffer2 } from "node:buffer";
var import_cookie, NULL_BODY_STATUSES, converter, edge_default;
var init_edge = __esm({
  "../../node_modules/@opennextjs/aws/dist/overrides/converters/edge.js"() {
    import_cookie = __toESM(require_dist(), 1);
    init_util();
    init_utils();
    NULL_BODY_STATUSES = /* @__PURE__ */ new Set([101, 103, 204, 205, 304]);
    converter = {
      convertFrom: async (event) => {
        const url = new URL(event.url);
        const searchParams = url.searchParams;
        const query = getQueryFromSearchParams(searchParams);
        const headers = {};
        event.headers.forEach((value, key) => {
          headers[key] = value;
        });
        const rawPath = url.pathname;
        const method = event.method;
        const shouldHaveBody = method !== "GET" && method !== "HEAD";
        const body = shouldHaveBody ? Buffer2.from(await event.arrayBuffer()) : void 0;
        const cookieHeader = event.headers.get("cookie");
        const cookies = cookieHeader ? import_cookie.default.parse(cookieHeader) : {};
        return {
          type: "core",
          method,
          rawPath,
          url: event.url,
          body,
          headers,
          remoteAddress: event.headers.get("x-forwarded-for") ?? "::1",
          query,
          cookies
        };
      },
      convertTo: async (result) => {
        if ("internalEvent" in result) {
          const request = new Request(result.internalEvent.url, {
            body: result.internalEvent.body,
            method: result.internalEvent.method,
            headers: {
              ...result.internalEvent.headers,
              "x-forwarded-host": result.internalEvent.headers.host
            }
          });
          if (globalThis.__dangerous_ON_edge_converter_returns_request === true) {
            return request;
          }
          const cfCache = (result.isISR || result.internalEvent.rawPath.startsWith("/_next/image")) && process.env.DISABLE_CACHE !== "true" ? { cacheEverything: true } : {};
          return fetch(request, {
            // This is a hack to make sure that the response is cached by Cloudflare
            // See https://developers.cloudflare.com/workers/examples/cache-using-fetch/#caching-html-resources
            // @ts-expect-error - This is a Cloudflare specific option
            cf: cfCache
          });
        }
        const headers = new Headers();
        for (const [key, value] of Object.entries(result.headers)) {
          if (key === "set-cookie" && typeof value === "string") {
            const cookies = parseSetCookieHeader(value);
            for (const cookie of cookies) {
              headers.append(key, cookie);
            }
            continue;
          }
          if (Array.isArray(value)) {
            for (const v of value) {
              headers.append(key, v);
            }
          } else {
            headers.set(key, value);
          }
        }
        const body = NULL_BODY_STATUSES.has(result.statusCode) ? null : result.body;
        return new Response(body, {
          status: result.statusCode,
          headers
        });
      },
      name: "edge"
    };
    edge_default = converter;
  }
});

// ../../node_modules/@opennextjs/aws/dist/overrides/wrappers/cloudflare-edge.js
var cloudflare_edge_exports = {};
__export(cloudflare_edge_exports, {
  default: () => cloudflare_edge_default
});
var cfPropNameMapping, handler, cloudflare_edge_default;
var init_cloudflare_edge = __esm({
  "../../node_modules/@opennextjs/aws/dist/overrides/wrappers/cloudflare-edge.js"() {
    cfPropNameMapping = {
      // The city name is percent-encoded.
      // See https://github.com/vercel/vercel/blob/4cb6143/packages/functions/src/headers.ts#L94C19-L94C37
      city: [encodeURIComponent, "x-open-next-city"],
      country: "x-open-next-country",
      regionCode: "x-open-next-region",
      latitude: "x-open-next-latitude",
      longitude: "x-open-next-longitude"
    };
    handler = async (handler3, converter2) => async (request, env, ctx) => {
      globalThis.process = process;
      for (const [key, value] of Object.entries(env)) {
        if (typeof value === "string") {
          process.env[key] = value;
        }
      }
      const internalEvent = await converter2.convertFrom(request);
      const cfProperties = request.cf;
      for (const [propName, mapping] of Object.entries(cfPropNameMapping)) {
        const propValue = cfProperties?.[propName];
        if (propValue != null) {
          const [encode, headerName] = Array.isArray(mapping) ? mapping : [null, mapping];
          internalEvent.headers[headerName] = encode ? encode(propValue) : propValue;
        }
      }
      const response = await handler3(internalEvent, {
        waitUntil: ctx.waitUntil.bind(ctx)
      });
      const result = await converter2.convertTo(response);
      return result;
    };
    cloudflare_edge_default = {
      wrapper: handler,
      name: "cloudflare-edge",
      supportStreaming: true,
      edgeRuntime: true
    };
  }
});

// ../../node_modules/@opennextjs/aws/dist/overrides/originResolver/pattern-env.js
var pattern_env_exports = {};
__export(pattern_env_exports, {
  default: () => pattern_env_default
});
function initializeOnce() {
  if (initialized)
    return;
  cachedOrigins = JSON.parse(process.env.OPEN_NEXT_ORIGIN ?? "{}");
  const functions = globalThis.openNextConfig.functions ?? {};
  for (const key in functions) {
    if (key !== "default") {
      const value = functions[key];
      const regexes = [];
      for (const pattern of value.patterns) {
        const regexPattern = `/${pattern.replace(/\*\*/g, "(.*)").replace(/\*/g, "([^/]*)").replace(/\//g, "\\/").replace(/\?/g, ".")}`;
        regexes.push(new RegExp(regexPattern));
      }
      cachedPatterns.push({
        key,
        patterns: value.patterns,
        regexes
      });
    }
  }
  initialized = true;
}
var cachedOrigins, cachedPatterns, initialized, envLoader, pattern_env_default;
var init_pattern_env = __esm({
  "../../node_modules/@opennextjs/aws/dist/overrides/originResolver/pattern-env.js"() {
    init_logger();
    cachedPatterns = [];
    initialized = false;
    envLoader = {
      name: "env",
      resolve: async (_path) => {
        try {
          initializeOnce();
          for (const { key, patterns, regexes } of cachedPatterns) {
            for (const regex of regexes) {
              if (regex.test(_path)) {
                debug("Using origin", key, patterns);
                return cachedOrigins[key];
              }
            }
          }
          if (_path.startsWith("/_next/image") && cachedOrigins.imageOptimizer) {
            debug("Using origin", "imageOptimizer", _path);
            return cachedOrigins.imageOptimizer;
          }
          if (cachedOrigins.default) {
            debug("Using default origin", cachedOrigins.default, _path);
            return cachedOrigins.default;
          }
          return false;
        } catch (e) {
          error("Error while resolving origin", e);
          return false;
        }
      }
    };
    pattern_env_default = envLoader;
  }
});

// ../../node_modules/@opennextjs/aws/dist/overrides/assetResolver/dummy.js
var dummy_exports = {};
__export(dummy_exports, {
  default: () => dummy_default
});
var resolver, dummy_default;
var init_dummy = __esm({
  "../../node_modules/@opennextjs/aws/dist/overrides/assetResolver/dummy.js"() {
    resolver = {
      name: "dummy"
    };
    dummy_default = resolver;
  }
});

// ../../node_modules/@opennextjs/aws/dist/utils/stream.js
import { ReadableStream } from "node:stream/web";
function toReadableStream(value, isBase64) {
  return new ReadableStream({
    pull(controller) {
      controller.enqueue(Buffer.from(value, isBase64 ? "base64" : "utf8"));
      controller.close();
    }
  }, { highWaterMark: 0 });
}
function emptyReadableStream() {
  if (process.env.OPEN_NEXT_FORCE_NON_EMPTY_RESPONSE === "true") {
    return new ReadableStream({
      pull(controller) {
        maybeSomethingBuffer ??= Buffer.from("SOMETHING");
        controller.enqueue(maybeSomethingBuffer);
        controller.close();
      }
    }, { highWaterMark: 0 });
  }
  return new ReadableStream({
    start(controller) {
      controller.close();
    }
  });
}
var maybeSomethingBuffer;
var init_stream = __esm({
  "../../node_modules/@opennextjs/aws/dist/utils/stream.js"() {
  }
});

// ../../node_modules/@opennextjs/aws/dist/overrides/proxyExternalRequest/fetch.js
var fetch_exports = {};
__export(fetch_exports, {
  default: () => fetch_default
});
var fetchProxy, fetch_default;
var init_fetch = __esm({
  "../../node_modules/@opennextjs/aws/dist/overrides/proxyExternalRequest/fetch.js"() {
    init_stream();
    fetchProxy = {
      name: "fetch-proxy",
      // @ts-ignore
      proxy: async (internalEvent) => {
        const { url, headers: eventHeaders, method, body } = internalEvent;
        const headers = Object.fromEntries(Object.entries(eventHeaders).filter(([key]) => key.toLowerCase() !== "cf-connecting-ip"));
        const response = await fetch(url, {
          method,
          headers,
          body
        });
        const responseHeaders = {};
        response.headers.forEach((value, key) => {
          responseHeaders[key] = value;
        });
        return {
          type: "core",
          headers: responseHeaders,
          statusCode: response.status,
          isBase64Encoded: true,
          body: response.body ?? emptyReadableStream()
        };
      }
    };
    fetch_default = fetchProxy;
  }
});

// .next/server/edge-runtime-webpack.js
var require_edge_runtime_webpack = __commonJS({
  ".next/server/edge-runtime-webpack.js"() {
    (() => {
      "use strict";
      var e = {}, r = {};
      function t(o) {
        var n = r[o];
        if (void 0 !== n) return n.exports;
        var i = r[o] = { exports: {} }, l = true;
        try {
          e[o](i, i.exports, t), l = false;
        } finally {
          l && delete r[o];
        }
        return i.exports;
      }
      t.m = e, t.amdO = {}, (() => {
        var e2 = [];
        t.O = (r2, o, n, i) => {
          if (o) {
            i = i || 0;
            for (var l = e2.length; l > 0 && e2[l - 1][2] > i; l--) e2[l] = e2[l - 1];
            e2[l] = [o, n, i];
            return;
          }
          for (var a = 1 / 0, l = 0; l < e2.length; l++) {
            for (var [o, n, i] = e2[l], f = true, u = 0; u < o.length; u++) a >= i && Object.keys(t.O).every((e3) => t.O[e3](o[u])) ? o.splice(u--, 1) : (f = false, i < a && (a = i));
            if (f) {
              e2.splice(l--, 1);
              var s = n();
              void 0 !== s && (r2 = s);
            }
          }
          return r2;
        };
      })(), t.d = (e2, r2) => {
        for (var o in r2) t.o(r2, o) && !t.o(e2, o) && Object.defineProperty(e2, o, { enumerable: true, get: r2[o] });
      }, t.g = function() {
        if ("object" == typeof globalThis) return globalThis;
        try {
          return this || Function("return this")();
        } catch (e2) {
          if ("object" == typeof window) return window;
        }
      }(), t.o = (e2, r2) => Object.prototype.hasOwnProperty.call(e2, r2), t.r = (e2) => {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e2, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(e2, "__esModule", { value: true });
      }, (() => {
        var e2 = { 993: 0 };
        t.O.j = (r3) => 0 === e2[r3];
        var r2 = (r3, o2) => {
          var n, i, [l, a, f] = o2, u = 0;
          if (l.some((r4) => 0 !== e2[r4])) {
            for (n in a) t.o(a, n) && (t.m[n] = a[n]);
            if (f) var s = f(t);
          }
          for (r3 && r3(o2); u < l.length; u++) i = l[u], t.o(e2, i) && e2[i] && e2[i][0](), e2[i] = 0;
          return t.O(s);
        }, o = self.webpackChunk_N_E = self.webpackChunk_N_E || [];
        o.forEach(r2.bind(null, 0)), o.push = r2.bind(null, o.push.bind(o));
      })();
    })();
  }
});

// node-built-in-modules:node:async_hooks
var node_async_hooks_exports = {};
import * as node_async_hooks_star from "node:async_hooks";
var init_node_async_hooks = __esm({
  "node-built-in-modules:node:async_hooks"() {
    __reExport(node_async_hooks_exports, node_async_hooks_star);
  }
});

// node-built-in-modules:node:buffer
var node_buffer_exports = {};
import * as node_buffer_star from "node:buffer";
var init_node_buffer = __esm({
  "node-built-in-modules:node:buffer"() {
    __reExport(node_buffer_exports, node_buffer_star);
  }
});

// .next/server/src/middleware.js
var require_middleware = __commonJS({
  ".next/server/src/middleware.js"() {
    (self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([[727], { 67: (e) => {
      "use strict";
      e.exports = (init_node_async_hooks(), __toCommonJS(node_async_hooks_exports));
    }, 195: (e) => {
      "use strict";
      e.exports = (init_node_buffer(), __toCommonJS(node_buffer_exports));
    }, 833: (e, t, r) => {
      "use strict";
      let n;
      r.r(t), r.d(t, { default: () => eW });
      var o, i, a, s, l, u, c, d, p, h, f, g, w = {};
      async function m() {
        let e2 = "_ENTRIES" in globalThis && _ENTRIES.middleware_instrumentation && (await _ENTRIES.middleware_instrumentation).register;
        if (e2) try {
          await e2();
        } catch (e3) {
          throw e3.message = `An error occurred while loading instrumentation hook: ${e3.message}`, e3;
        }
      }
      r.r(w), r.d(w, { config: () => e$, handleOptions: () => eH, middleware: () => eB });
      let b = null;
      function v() {
        return b || (b = m()), b;
      }
      function y(e2) {
        return `The edge runtime does not support Node.js '${e2}' module.
Learn More: https://nextjs.org/docs/messages/node-module-in-edge-runtime`;
      }
      process !== r.g.process && (process.env = r.g.process.env, r.g.process = process), Object.defineProperty(globalThis, "__import_unsupported", { value: function(e2) {
        let t2 = new Proxy(function() {
        }, { get(t3, r2) {
          if ("then" === r2) return {};
          throw Error(y(e2));
        }, construct() {
          throw Error(y(e2));
        }, apply(r2, n2, o2) {
          if ("function" == typeof o2[0]) return o2[0](t2);
          throw Error(y(e2));
        } });
        return new Proxy({}, { get: () => t2 });
      }, enumerable: false, configurable: false }), v();
      class x extends Error {
        constructor({ page: e2 }) {
          super(`The middleware "${e2}" accepts an async API directly with the form:
  
  export function middleware(request, event) {
    return NextResponse.redirect('/new-location')
  }
  
  Read more: https://nextjs.org/docs/messages/middleware-new-signature
  `);
        }
      }
      class S extends Error {
        constructor() {
          super(`The request.page has been deprecated in favour of \`URLPattern\`.
  Read more: https://nextjs.org/docs/messages/middleware-request-page
  `);
        }
      }
      class _ extends Error {
        constructor() {
          super(`The request.ua has been removed in favour of \`userAgent\` function.
  Read more: https://nextjs.org/docs/messages/middleware-parse-user-agent
  `);
        }
      }
      let R = { shared: "shared", reactServerComponents: "rsc", serverSideRendering: "ssr", actionBrowser: "action-browser", api: "api", middleware: "middleware", instrument: "instrument", edgeAsset: "edge-asset", appPagesBrowser: "app-pages-browser", appMetadataRoute: "app-metadata-route", appRouteHandler: "app-route-handler" };
      function C(e2) {
        var t2, r2, n2, o2, i2, a2 = [], s2 = 0;
        function l2() {
          for (; s2 < e2.length && /\s/.test(e2.charAt(s2)); ) s2 += 1;
          return s2 < e2.length;
        }
        for (; s2 < e2.length; ) {
          for (t2 = s2, i2 = false; l2(); ) if ("," === (r2 = e2.charAt(s2))) {
            for (n2 = s2, s2 += 1, l2(), o2 = s2; s2 < e2.length && "=" !== (r2 = e2.charAt(s2)) && ";" !== r2 && "," !== r2; ) s2 += 1;
            s2 < e2.length && "=" === e2.charAt(s2) ? (i2 = true, s2 = o2, a2.push(e2.substring(t2, n2)), t2 = s2) : s2 = n2 + 1;
          } else s2 += 1;
          (!i2 || s2 >= e2.length) && a2.push(e2.substring(t2, e2.length));
        }
        return a2;
      }
      function k(e2) {
        let t2 = {}, r2 = [];
        if (e2) for (let [n2, o2] of e2.entries()) "set-cookie" === n2.toLowerCase() ? (r2.push(...C(o2)), t2[n2] = 1 === r2.length ? r2[0] : r2) : t2[n2] = o2;
        return t2;
      }
      function E(e2) {
        try {
          return String(new URL(String(e2)));
        } catch (t2) {
          throw Error(`URL is malformed "${String(e2)}". Please use only absolute URLs - https://nextjs.org/docs/messages/middleware-relative-urls`, { cause: t2 });
        }
      }
      ({ ...R, GROUP: { serverOnly: [R.reactServerComponents, R.actionBrowser, R.appMetadataRoute, R.appRouteHandler, R.instrument], clientOnly: [R.serverSideRendering, R.appPagesBrowser], nonClientServerTarget: [R.middleware, R.api], app: [R.reactServerComponents, R.actionBrowser, R.appMetadataRoute, R.appRouteHandler, R.serverSideRendering, R.appPagesBrowser, R.shared, R.instrument] } });
      let N = Symbol("response"), T = Symbol("passThrough"), P = Symbol("waitUntil");
      class O {
        constructor(e2) {
          this[P] = [], this[T] = false;
        }
        respondWith(e2) {
          this[N] || (this[N] = Promise.resolve(e2));
        }
        passThroughOnException() {
          this[T] = true;
        }
        waitUntil(e2) {
          this[P].push(e2);
        }
      }
      class A extends O {
        constructor(e2) {
          super(e2.request), this.sourcePage = e2.page;
        }
        get request() {
          throw new x({ page: this.sourcePage });
        }
        respondWith() {
          throw new x({ page: this.sourcePage });
        }
      }
      function L(e2) {
        return e2.replace(/\/$/, "") || "/";
      }
      function I(e2) {
        let t2 = e2.indexOf("#"), r2 = e2.indexOf("?"), n2 = r2 > -1 && (t2 < 0 || r2 < t2);
        return n2 || t2 > -1 ? { pathname: e2.substring(0, n2 ? r2 : t2), query: n2 ? e2.substring(r2, t2 > -1 ? t2 : void 0) : "", hash: t2 > -1 ? e2.slice(t2) : "" } : { pathname: e2, query: "", hash: "" };
      }
      function M(e2, t2) {
        if (!e2.startsWith("/") || !t2) return e2;
        let { pathname: r2, query: n2, hash: o2 } = I(e2);
        return "" + t2 + r2 + n2 + o2;
      }
      function j(e2, t2) {
        if (!e2.startsWith("/") || !t2) return e2;
        let { pathname: r2, query: n2, hash: o2 } = I(e2);
        return "" + r2 + t2 + n2 + o2;
      }
      function q(e2, t2) {
        if ("string" != typeof e2) return false;
        let { pathname: r2 } = I(e2);
        return r2 === t2 || r2.startsWith(t2 + "/");
      }
      function D(e2, t2) {
        let r2;
        let n2 = e2.split("/");
        return (t2 || []).some((t3) => !!n2[1] && n2[1].toLowerCase() === t3.toLowerCase() && (r2 = t3, n2.splice(1, 1), e2 = n2.join("/") || "/", true)), { pathname: e2, detectedLocale: r2 };
      }
      let U = /(?!^https?:\/\/)(127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}|\[::1\]|localhost)/;
      function B(e2, t2) {
        return new URL(String(e2).replace(U, "localhost"), t2 && String(t2).replace(U, "localhost"));
      }
      let H = Symbol("NextURLInternal");
      class $ {
        constructor(e2, t2, r2) {
          let n2, o2;
          "object" == typeof t2 && "pathname" in t2 || "string" == typeof t2 ? (n2 = t2, o2 = r2 || {}) : o2 = r2 || t2 || {}, this[H] = { url: B(e2, n2 ?? o2.base), options: o2, basePath: "" }, this.analyze();
        }
        analyze() {
          var e2, t2, r2, n2, o2;
          let i2 = function(e3, t3) {
            var r3, n3;
            let { basePath: o3, i18n: i3, trailingSlash: a3 } = null != (r3 = t3.nextConfig) ? r3 : {}, s3 = { pathname: e3, trailingSlash: "/" !== e3 ? e3.endsWith("/") : a3 };
            o3 && q(s3.pathname, o3) && (s3.pathname = function(e4, t4) {
              if (!q(e4, t4)) return e4;
              let r4 = e4.slice(t4.length);
              return r4.startsWith("/") ? r4 : "/" + r4;
            }(s3.pathname, o3), s3.basePath = o3);
            let l2 = s3.pathname;
            if (s3.pathname.startsWith("/_next/data/") && s3.pathname.endsWith(".json")) {
              let e4 = s3.pathname.replace(/^\/_next\/data\//, "").replace(/\.json$/, "").split("/"), r4 = e4[0];
              s3.buildId = r4, l2 = "index" !== e4[1] ? "/" + e4.slice(1).join("/") : "/", true === t3.parseData && (s3.pathname = l2);
            }
            if (i3) {
              let e4 = t3.i18nProvider ? t3.i18nProvider.analyze(s3.pathname) : D(s3.pathname, i3.locales);
              s3.locale = e4.detectedLocale, s3.pathname = null != (n3 = e4.pathname) ? n3 : s3.pathname, !e4.detectedLocale && s3.buildId && (e4 = t3.i18nProvider ? t3.i18nProvider.analyze(l2) : D(l2, i3.locales)).detectedLocale && (s3.locale = e4.detectedLocale);
            }
            return s3;
          }(this[H].url.pathname, { nextConfig: this[H].options.nextConfig, parseData: true, i18nProvider: this[H].options.i18nProvider }), a2 = function(e3, t3) {
            let r3;
            if ((null == t3 ? void 0 : t3.host) && !Array.isArray(t3.host)) r3 = t3.host.toString().split(":", 1)[0];
            else {
              if (!e3.hostname) return;
              r3 = e3.hostname;
            }
            return r3.toLowerCase();
          }(this[H].url, this[H].options.headers);
          this[H].domainLocale = this[H].options.i18nProvider ? this[H].options.i18nProvider.detectDomainLocale(a2) : function(e3, t3, r3) {
            if (e3) for (let i3 of (r3 && (r3 = r3.toLowerCase()), e3)) {
              var n3, o3;
              if (t3 === (null == (n3 = i3.domain) ? void 0 : n3.split(":", 1)[0].toLowerCase()) || r3 === i3.defaultLocale.toLowerCase() || (null == (o3 = i3.locales) ? void 0 : o3.some((e4) => e4.toLowerCase() === r3))) return i3;
            }
          }(null == (t2 = this[H].options.nextConfig) ? void 0 : null == (e2 = t2.i18n) ? void 0 : e2.domains, a2);
          let s2 = (null == (r2 = this[H].domainLocale) ? void 0 : r2.defaultLocale) || (null == (o2 = this[H].options.nextConfig) ? void 0 : null == (n2 = o2.i18n) ? void 0 : n2.defaultLocale);
          this[H].url.pathname = i2.pathname, this[H].defaultLocale = s2, this[H].basePath = i2.basePath ?? "", this[H].buildId = i2.buildId, this[H].locale = i2.locale ?? s2, this[H].trailingSlash = i2.trailingSlash;
        }
        formatPathname() {
          var e2;
          let t2;
          return t2 = function(e3, t3, r2, n2) {
            if (!t3 || t3 === r2) return e3;
            let o2 = e3.toLowerCase();
            return !n2 && (q(o2, "/api") || q(o2, "/" + t3.toLowerCase())) ? e3 : M(e3, "/" + t3);
          }((e2 = { basePath: this[H].basePath, buildId: this[H].buildId, defaultLocale: this[H].options.forceLocale ? void 0 : this[H].defaultLocale, locale: this[H].locale, pathname: this[H].url.pathname, trailingSlash: this[H].trailingSlash }).pathname, e2.locale, e2.buildId ? void 0 : e2.defaultLocale, e2.ignorePrefix), (e2.buildId || !e2.trailingSlash) && (t2 = L(t2)), e2.buildId && (t2 = j(M(t2, "/_next/data/" + e2.buildId), "/" === e2.pathname ? "index.json" : ".json")), t2 = M(t2, e2.basePath), !e2.buildId && e2.trailingSlash ? t2.endsWith("/") ? t2 : j(t2, "/") : L(t2);
        }
        formatSearch() {
          return this[H].url.search;
        }
        get buildId() {
          return this[H].buildId;
        }
        set buildId(e2) {
          this[H].buildId = e2;
        }
        get locale() {
          return this[H].locale ?? "";
        }
        set locale(e2) {
          var t2, r2;
          if (!this[H].locale || !(null == (r2 = this[H].options.nextConfig) ? void 0 : null == (t2 = r2.i18n) ? void 0 : t2.locales.includes(e2))) throw TypeError(`The NextURL configuration includes no locale "${e2}"`);
          this[H].locale = e2;
        }
        get defaultLocale() {
          return this[H].defaultLocale;
        }
        get domainLocale() {
          return this[H].domainLocale;
        }
        get searchParams() {
          return this[H].url.searchParams;
        }
        get host() {
          return this[H].url.host;
        }
        set host(e2) {
          this[H].url.host = e2;
        }
        get hostname() {
          return this[H].url.hostname;
        }
        set hostname(e2) {
          this[H].url.hostname = e2;
        }
        get port() {
          return this[H].url.port;
        }
        set port(e2) {
          this[H].url.port = e2;
        }
        get protocol() {
          return this[H].url.protocol;
        }
        set protocol(e2) {
          this[H].url.protocol = e2;
        }
        get href() {
          let e2 = this.formatPathname(), t2 = this.formatSearch();
          return `${this.protocol}//${this.host}${e2}${t2}${this.hash}`;
        }
        set href(e2) {
          this[H].url = B(e2), this.analyze();
        }
        get origin() {
          return this[H].url.origin;
        }
        get pathname() {
          return this[H].url.pathname;
        }
        set pathname(e2) {
          this[H].url.pathname = e2;
        }
        get hash() {
          return this[H].url.hash;
        }
        set hash(e2) {
          this[H].url.hash = e2;
        }
        get search() {
          return this[H].url.search;
        }
        set search(e2) {
          this[H].url.search = e2;
        }
        get password() {
          return this[H].url.password;
        }
        set password(e2) {
          this[H].url.password = e2;
        }
        get username() {
          return this[H].url.username;
        }
        set username(e2) {
          this[H].url.username = e2;
        }
        get basePath() {
          return this[H].basePath;
        }
        set basePath(e2) {
          this[H].basePath = e2.startsWith("/") ? e2 : `/${e2}`;
        }
        toString() {
          return this.href;
        }
        toJSON() {
          return this.href;
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return { href: this.href, origin: this.origin, protocol: this.protocol, username: this.username, password: this.password, host: this.host, hostname: this.hostname, port: this.port, pathname: this.pathname, search: this.search, searchParams: this.searchParams, hash: this.hash };
        }
        clone() {
          return new $(String(this), this[H].options);
        }
      }
      var V = r(775);
      let z = Symbol("internal request");
      class F extends Request {
        constructor(e2, t2 = {}) {
          let r2 = "string" != typeof e2 && "url" in e2 ? e2.url : String(e2);
          E(r2), e2 instanceof Request ? super(e2, t2) : super(r2, t2);
          let n2 = new $(r2, { headers: k(this.headers), nextConfig: t2.nextConfig });
          this[z] = { cookies: new V.RequestCookies(this.headers), geo: t2.geo || {}, ip: t2.ip, nextUrl: n2, url: n2.toString() };
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return { cookies: this.cookies, geo: this.geo, ip: this.ip, nextUrl: this.nextUrl, url: this.url, bodyUsed: this.bodyUsed, cache: this.cache, credentials: this.credentials, destination: this.destination, headers: Object.fromEntries(this.headers), integrity: this.integrity, keepalive: this.keepalive, method: this.method, mode: this.mode, redirect: this.redirect, referrer: this.referrer, referrerPolicy: this.referrerPolicy, signal: this.signal };
        }
        get cookies() {
          return this[z].cookies;
        }
        get geo() {
          return this[z].geo;
        }
        get ip() {
          return this[z].ip;
        }
        get nextUrl() {
          return this[z].nextUrl;
        }
        get page() {
          throw new S();
        }
        get ua() {
          throw new _();
        }
        get url() {
          return this[z].url;
        }
      }
      class W {
        static get(e2, t2, r2) {
          let n2 = Reflect.get(e2, t2, r2);
          return "function" == typeof n2 ? n2.bind(e2) : n2;
        }
        static set(e2, t2, r2, n2) {
          return Reflect.set(e2, t2, r2, n2);
        }
        static has(e2, t2) {
          return Reflect.has(e2, t2);
        }
        static deleteProperty(e2, t2) {
          return Reflect.deleteProperty(e2, t2);
        }
      }
      let G = Symbol("internal response"), X = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
      function K(e2, t2) {
        var r2;
        if (null == e2 ? void 0 : null == (r2 = e2.request) ? void 0 : r2.headers) {
          if (!(e2.request.headers instanceof Headers)) throw Error("request.headers must be an instance of Headers");
          let r3 = [];
          for (let [n2, o2] of e2.request.headers) t2.set("x-middleware-request-" + n2, o2), r3.push(n2);
          t2.set("x-middleware-override-headers", r3.join(","));
        }
      }
      class J extends Response {
        constructor(e2, t2 = {}) {
          super(e2, t2);
          let r2 = this.headers, n2 = new Proxy(new V.ResponseCookies(r2), { get(e3, n3, o2) {
            switch (n3) {
              case "delete":
              case "set":
                return (...o3) => {
                  let i2 = Reflect.apply(e3[n3], e3, o3), a2 = new Headers(r2);
                  return i2 instanceof V.ResponseCookies && r2.set("x-middleware-set-cookie", i2.getAll().map((e4) => (0, V.stringifyCookie)(e4)).join(",")), K(t2, a2), i2;
                };
              default:
                return W.get(e3, n3, o2);
            }
          } });
          this[G] = { cookies: n2, url: t2.url ? new $(t2.url, { headers: k(r2), nextConfig: t2.nextConfig }) : void 0 };
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return { cookies: this.cookies, url: this.url, body: this.body, bodyUsed: this.bodyUsed, headers: Object.fromEntries(this.headers), ok: this.ok, redirected: this.redirected, status: this.status, statusText: this.statusText, type: this.type };
        }
        get cookies() {
          return this[G].cookies;
        }
        static json(e2, t2) {
          let r2 = Response.json(e2, t2);
          return new J(r2.body, r2);
        }
        static redirect(e2, t2) {
          let r2 = "number" == typeof t2 ? t2 : (null == t2 ? void 0 : t2.status) ?? 307;
          if (!X.has(r2)) throw RangeError('Failed to execute "redirect" on "response": Invalid status code');
          let n2 = "object" == typeof t2 ? t2 : {}, o2 = new Headers(null == n2 ? void 0 : n2.headers);
          return o2.set("Location", E(e2)), new J(null, { ...n2, headers: o2, status: r2 });
        }
        static rewrite(e2, t2) {
          let r2 = new Headers(null == t2 ? void 0 : t2.headers);
          return r2.set("x-middleware-rewrite", E(e2)), K(t2, r2), new J(null, { ...t2, headers: r2 });
        }
        static next(e2) {
          let t2 = new Headers(null == e2 ? void 0 : e2.headers);
          return t2.set("x-middleware-next", "1"), K(e2, t2), new J(null, { ...e2, headers: t2 });
        }
      }
      function Y(e2, t2) {
        let r2 = "string" == typeof t2 ? new URL(t2) : t2, n2 = new URL(e2, t2), o2 = r2.protocol + "//" + r2.host;
        return n2.protocol + "//" + n2.host === o2 ? n2.toString().replace(o2, "") : n2.toString();
      }
      let Z = [["RSC"], ["Next-Router-State-Tree"], ["Next-Router-Prefetch"]], Q = ["__nextFallback", "__nextLocale", "__nextInferredLocaleFromDefault", "__nextDefaultLocale", "__nextIsNotFound", "_rsc"], ee = ["__nextDataReq"];
      class et extends Error {
        constructor() {
          super("Headers cannot be modified. Read more: https://nextjs.org/docs/app/api-reference/functions/headers");
        }
        static callable() {
          throw new et();
        }
      }
      class er extends Headers {
        constructor(e2) {
          super(), this.headers = new Proxy(e2, { get(t2, r2, n2) {
            if ("symbol" == typeof r2) return W.get(t2, r2, n2);
            let o2 = r2.toLowerCase(), i2 = Object.keys(e2).find((e3) => e3.toLowerCase() === o2);
            if (void 0 !== i2) return W.get(t2, i2, n2);
          }, set(t2, r2, n2, o2) {
            if ("symbol" == typeof r2) return W.set(t2, r2, n2, o2);
            let i2 = r2.toLowerCase(), a2 = Object.keys(e2).find((e3) => e3.toLowerCase() === i2);
            return W.set(t2, a2 ?? r2, n2, o2);
          }, has(t2, r2) {
            if ("symbol" == typeof r2) return W.has(t2, r2);
            let n2 = r2.toLowerCase(), o2 = Object.keys(e2).find((e3) => e3.toLowerCase() === n2);
            return void 0 !== o2 && W.has(t2, o2);
          }, deleteProperty(t2, r2) {
            if ("symbol" == typeof r2) return W.deleteProperty(t2, r2);
            let n2 = r2.toLowerCase(), o2 = Object.keys(e2).find((e3) => e3.toLowerCase() === n2);
            return void 0 === o2 || W.deleteProperty(t2, o2);
          } });
        }
        static seal(e2) {
          return new Proxy(e2, { get(e3, t2, r2) {
            switch (t2) {
              case "append":
              case "delete":
              case "set":
                return et.callable;
              default:
                return W.get(e3, t2, r2);
            }
          } });
        }
        merge(e2) {
          return Array.isArray(e2) ? e2.join(", ") : e2;
        }
        static from(e2) {
          return e2 instanceof Headers ? e2 : new er(e2);
        }
        append(e2, t2) {
          let r2 = this.headers[e2];
          "string" == typeof r2 ? this.headers[e2] = [r2, t2] : Array.isArray(r2) ? r2.push(t2) : this.headers[e2] = t2;
        }
        delete(e2) {
          delete this.headers[e2];
        }
        get(e2) {
          let t2 = this.headers[e2];
          return void 0 !== t2 ? this.merge(t2) : null;
        }
        has(e2) {
          return void 0 !== this.headers[e2];
        }
        set(e2, t2) {
          this.headers[e2] = t2;
        }
        forEach(e2, t2) {
          for (let [r2, n2] of this.entries()) e2.call(t2, n2, r2, this);
        }
        *entries() {
          for (let e2 of Object.keys(this.headers)) {
            let t2 = e2.toLowerCase(), r2 = this.get(t2);
            yield [t2, r2];
          }
        }
        *keys() {
          for (let e2 of Object.keys(this.headers)) {
            let t2 = e2.toLowerCase();
            yield t2;
          }
        }
        *values() {
          for (let e2 of Object.keys(this.headers)) {
            let t2 = this.get(e2);
            yield t2;
          }
        }
        [Symbol.iterator]() {
          return this.entries();
        }
      }
      let en = Error("Invariant: AsyncLocalStorage accessed in runtime where it is not available");
      class eo {
        disable() {
          throw en;
        }
        getStore() {
        }
        run() {
          throw en;
        }
        exit() {
          throw en;
        }
        enterWith() {
          throw en;
        }
      }
      let ei = globalThis.AsyncLocalStorage;
      function ea() {
        return ei ? new ei() : new eo();
      }
      let es = ea();
      class el extends Error {
        constructor() {
          super("Cookies can only be modified in a Server Action or Route Handler. Read more: https://nextjs.org/docs/app/api-reference/functions/cookies#cookiessetname-value-options");
        }
        static callable() {
          throw new el();
        }
      }
      class eu {
        static seal(e2) {
          return new Proxy(e2, { get(e3, t2, r2) {
            switch (t2) {
              case "clear":
              case "delete":
              case "set":
                return el.callable;
              default:
                return W.get(e3, t2, r2);
            }
          } });
        }
      }
      let ec = Symbol.for("next.mutated.cookies");
      class ed {
        static wrap(e2, t2) {
          let r2 = new V.ResponseCookies(new Headers());
          for (let t3 of e2.getAll()) r2.set(t3);
          let n2 = [], o2 = /* @__PURE__ */ new Set(), i2 = () => {
            let e3 = es.getStore();
            if (e3 && (e3.pathWasRevalidated = true), n2 = r2.getAll().filter((e4) => o2.has(e4.name)), t2) {
              let e4 = [];
              for (let t3 of n2) {
                let r3 = new V.ResponseCookies(new Headers());
                r3.set(t3), e4.push(r3.toString());
              }
              t2(e4);
            }
          };
          return new Proxy(r2, { get(e3, t3, r3) {
            switch (t3) {
              case ec:
                return n2;
              case "delete":
                return function(...t4) {
                  o2.add("string" == typeof t4[0] ? t4[0] : t4[0].name);
                  try {
                    e3.delete(...t4);
                  } finally {
                    i2();
                  }
                };
              case "set":
                return function(...t4) {
                  o2.add("string" == typeof t4[0] ? t4[0] : t4[0].name);
                  try {
                    return e3.set(...t4);
                  } finally {
                    i2();
                  }
                };
              default:
                return W.get(e3, t3, r3);
            }
          } });
        }
      }
      !function(e2) {
        e2.handleRequest = "BaseServer.handleRequest", e2.run = "BaseServer.run", e2.pipe = "BaseServer.pipe", e2.getStaticHTML = "BaseServer.getStaticHTML", e2.render = "BaseServer.render", e2.renderToResponseWithComponents = "BaseServer.renderToResponseWithComponents", e2.renderToResponse = "BaseServer.renderToResponse", e2.renderToHTML = "BaseServer.renderToHTML", e2.renderError = "BaseServer.renderError", e2.renderErrorToResponse = "BaseServer.renderErrorToResponse", e2.renderErrorToHTML = "BaseServer.renderErrorToHTML", e2.render404 = "BaseServer.render404";
      }(o || (o = {})), function(e2) {
        e2.loadDefaultErrorComponents = "LoadComponents.loadDefaultErrorComponents", e2.loadComponents = "LoadComponents.loadComponents";
      }(i || (i = {})), function(e2) {
        e2.getRequestHandler = "NextServer.getRequestHandler", e2.getServer = "NextServer.getServer", e2.getServerRequestHandler = "NextServer.getServerRequestHandler", e2.createServer = "createServer.createServer";
      }(a || (a = {})), function(e2) {
        e2.compression = "NextNodeServer.compression", e2.getBuildId = "NextNodeServer.getBuildId", e2.createComponentTree = "NextNodeServer.createComponentTree", e2.clientComponentLoading = "NextNodeServer.clientComponentLoading", e2.getLayoutOrPageModule = "NextNodeServer.getLayoutOrPageModule", e2.generateStaticRoutes = "NextNodeServer.generateStaticRoutes", e2.generateFsStaticRoutes = "NextNodeServer.generateFsStaticRoutes", e2.generatePublicRoutes = "NextNodeServer.generatePublicRoutes", e2.generateImageRoutes = "NextNodeServer.generateImageRoutes.route", e2.sendRenderResult = "NextNodeServer.sendRenderResult", e2.proxyRequest = "NextNodeServer.proxyRequest", e2.runApi = "NextNodeServer.runApi", e2.render = "NextNodeServer.render", e2.renderHTML = "NextNodeServer.renderHTML", e2.imageOptimizer = "NextNodeServer.imageOptimizer", e2.getPagePath = "NextNodeServer.getPagePath", e2.getRoutesManifest = "NextNodeServer.getRoutesManifest", e2.findPageComponents = "NextNodeServer.findPageComponents", e2.getFontManifest = "NextNodeServer.getFontManifest", e2.getServerComponentManifest = "NextNodeServer.getServerComponentManifest", e2.getRequestHandler = "NextNodeServer.getRequestHandler", e2.renderToHTML = "NextNodeServer.renderToHTML", e2.renderError = "NextNodeServer.renderError", e2.renderErrorToHTML = "NextNodeServer.renderErrorToHTML", e2.render404 = "NextNodeServer.render404", e2.startResponse = "NextNodeServer.startResponse", e2.route = "route", e2.onProxyReq = "onProxyReq", e2.apiResolver = "apiResolver", e2.internalFetch = "internalFetch";
      }(s || (s = {})), (l || (l = {})).startServer = "startServer.startServer", function(e2) {
        e2.getServerSideProps = "Render.getServerSideProps", e2.getStaticProps = "Render.getStaticProps", e2.renderToString = "Render.renderToString", e2.renderDocument = "Render.renderDocument", e2.createBodyResult = "Render.createBodyResult";
      }(u || (u = {})), function(e2) {
        e2.renderToString = "AppRender.renderToString", e2.renderToReadableStream = "AppRender.renderToReadableStream", e2.getBodyResult = "AppRender.getBodyResult", e2.fetch = "AppRender.fetch";
      }(c || (c = {})), (d || (d = {})).executeRoute = "Router.executeRoute", (p || (p = {})).runHandler = "Node.runHandler", (h || (h = {})).runHandler = "AppRouteRouteHandlers.runHandler", function(e2) {
        e2.generateMetadata = "ResolveMetadata.generateMetadata", e2.generateViewport = "ResolveMetadata.generateViewport";
      }(f || (f = {})), (g || (g = {})).execute = "Middleware.execute";
      let ep = ["Middleware.execute", "BaseServer.handleRequest", "Render.getServerSideProps", "Render.getStaticProps", "AppRender.fetch", "AppRender.getBodyResult", "Render.renderDocument", "Node.runHandler", "AppRouteRouteHandlers.runHandler", "ResolveMetadata.generateMetadata", "ResolveMetadata.generateViewport", "NextNodeServer.createComponentTree", "NextNodeServer.findPageComponents", "NextNodeServer.getLayoutOrPageModule", "NextNodeServer.startResponse", "NextNodeServer.clientComponentLoading"], eh = ["NextNodeServer.findPageComponents", "NextNodeServer.createComponentTree", "NextNodeServer.clientComponentLoading"], { context: ef, propagation: eg, trace: ew, SpanStatusCode: em, SpanKind: eb, ROOT_CONTEXT: ev } = n = r(519), ey = (e2) => null !== e2 && "object" == typeof e2 && "function" == typeof e2.then, ex = (e2, t2) => {
        (null == t2 ? void 0 : t2.bubble) === true ? e2.setAttribute("next.bubble", true) : (t2 && e2.recordException(t2), e2.setStatus({ code: em.ERROR, message: null == t2 ? void 0 : t2.message })), e2.end();
      }, eS = /* @__PURE__ */ new Map(), e_ = n.createContextKey("next.rootSpanId"), eR = 0, eC = () => eR++;
      class ek {
        getTracerInstance() {
          return ew.getTracer("next.js", "0.0.1");
        }
        getContext() {
          return ef;
        }
        getActiveScopeSpan() {
          return ew.getSpan(null == ef ? void 0 : ef.active());
        }
        withPropagatedContext(e2, t2, r2) {
          let n2 = ef.active();
          if (ew.getSpanContext(n2)) return t2();
          let o2 = eg.extract(n2, e2, r2);
          return ef.with(o2, t2);
        }
        trace(...e2) {
          var t2;
          let [r2, n2, o2] = e2, { fn: i2, options: a2 } = "function" == typeof n2 ? { fn: n2, options: {} } : { fn: o2, options: { ...n2 } }, s2 = a2.spanName ?? r2;
          if (!ep.includes(r2) && "1" !== process.env.NEXT_OTEL_VERBOSE || a2.hideSpan) return i2();
          let l2 = this.getSpanContext((null == a2 ? void 0 : a2.parentSpan) ?? this.getActiveScopeSpan()), u2 = false;
          l2 ? (null == (t2 = ew.getSpanContext(l2)) ? void 0 : t2.isRemote) && (u2 = true) : (l2 = (null == ef ? void 0 : ef.active()) ?? ev, u2 = true);
          let c2 = eC();
          return a2.attributes = { "next.span_name": s2, "next.span_type": r2, ...a2.attributes }, ef.with(l2.setValue(e_, c2), () => this.getTracerInstance().startActiveSpan(s2, a2, (e3) => {
            let t3 = "performance" in globalThis ? globalThis.performance.now() : void 0, n3 = () => {
              eS.delete(c2), t3 && process.env.NEXT_OTEL_PERFORMANCE_PREFIX && eh.includes(r2 || "") && performance.measure(`${process.env.NEXT_OTEL_PERFORMANCE_PREFIX}:next-${(r2.split(".").pop() || "").replace(/[A-Z]/g, (e4) => "-" + e4.toLowerCase())}`, { start: t3, end: performance.now() });
            };
            u2 && eS.set(c2, new Map(Object.entries(a2.attributes ?? {})));
            try {
              if (i2.length > 1) return i2(e3, (t5) => ex(e3, t5));
              let t4 = i2(e3);
              if (ey(t4)) return t4.then((t5) => (e3.end(), t5)).catch((t5) => {
                throw ex(e3, t5), t5;
              }).finally(n3);
              return e3.end(), n3(), t4;
            } catch (t4) {
              throw ex(e3, t4), n3(), t4;
            }
          }));
        }
        wrap(...e2) {
          let t2 = this, [r2, n2, o2] = 3 === e2.length ? e2 : [e2[0], {}, e2[1]];
          return ep.includes(r2) || "1" === process.env.NEXT_OTEL_VERBOSE ? function() {
            let e3 = n2;
            "function" == typeof e3 && "function" == typeof o2 && (e3 = e3.apply(this, arguments));
            let i2 = arguments.length - 1, a2 = arguments[i2];
            if ("function" != typeof a2) return t2.trace(r2, e3, () => o2.apply(this, arguments));
            {
              let n3 = t2.getContext().bind(ef.active(), a2);
              return t2.trace(r2, e3, (e4, t3) => (arguments[i2] = function(e5) {
                return null == t3 || t3(e5), n3.apply(this, arguments);
              }, o2.apply(this, arguments)));
            }
          } : o2;
        }
        startSpan(...e2) {
          let [t2, r2] = e2, n2 = this.getSpanContext((null == r2 ? void 0 : r2.parentSpan) ?? this.getActiveScopeSpan());
          return this.getTracerInstance().startSpan(t2, r2, n2);
        }
        getSpanContext(e2) {
          return e2 ? ew.setSpan(ef.active(), e2) : void 0;
        }
        getRootSpanAttributes() {
          let e2 = ef.active().getValue(e_);
          return eS.get(e2);
        }
      }
      let eE = (() => {
        let e2 = new ek();
        return () => e2;
      })(), eN = "__prerender_bypass";
      Symbol("__next_preview_data"), Symbol(eN);
      class eT {
        constructor(e2, t2, r2, n2) {
          var o2;
          let i2 = e2 && function(e3, t3) {
            let r3 = er.from(e3.headers);
            return { isOnDemandRevalidate: r3.get("x-prerender-revalidate") === t3.previewModeId, revalidateOnlyGenerated: r3.has("x-prerender-revalidate-if-generated") };
          }(t2, e2).isOnDemandRevalidate, a2 = null == (o2 = r2.get(eN)) ? void 0 : o2.value;
          this.isEnabled = !!(!i2 && a2 && e2 && a2 === e2.previewModeId), this._previewModeId = null == e2 ? void 0 : e2.previewModeId, this._mutableCookies = n2;
        }
        enable() {
          if (!this._previewModeId) throw Error("Invariant: previewProps missing previewModeId this should never happen");
          this._mutableCookies.set({ name: eN, value: this._previewModeId, httpOnly: true, sameSite: "none", secure: true, path: "/" });
        }
        disable() {
          this._mutableCookies.set({ name: eN, value: "", httpOnly: true, sameSite: "none", secure: true, path: "/", expires: /* @__PURE__ */ new Date(0) });
        }
      }
      function eP(e2, t2) {
        if ("x-middleware-set-cookie" in e2.headers && "string" == typeof e2.headers["x-middleware-set-cookie"]) {
          let r2 = e2.headers["x-middleware-set-cookie"], n2 = new Headers();
          for (let e3 of C(r2)) n2.append("set-cookie", e3);
          for (let e3 of new V.ResponseCookies(n2).getAll()) t2.set(e3);
        }
      }
      let eO = { wrap(e2, { req: t2, res: r2, renderOpts: n2 }, o2) {
        let i2;
        function a2(e3) {
          r2 && r2.setHeader("Set-Cookie", e3);
        }
        n2 && "previewProps" in n2 && (i2 = n2.previewProps);
        let s2 = {}, l2 = { get headers() {
          return s2.headers || (s2.headers = function(e3) {
            let t3 = er.from(e3);
            for (let e4 of Z) t3.delete(e4.toString().toLowerCase());
            return er.seal(t3);
          }(t2.headers)), s2.headers;
        }, get cookies() {
          if (!s2.cookies) {
            let e3 = new V.RequestCookies(er.from(t2.headers));
            eP(t2, e3), s2.cookies = eu.seal(e3);
          }
          return s2.cookies;
        }, get mutableCookies() {
          if (!s2.mutableCookies) {
            let e3 = function(e4, t3) {
              let r3 = new V.RequestCookies(er.from(e4));
              return ed.wrap(r3, t3);
            }(t2.headers, (null == n2 ? void 0 : n2.onUpdateCookies) || (r2 ? a2 : void 0));
            eP(t2, e3), s2.mutableCookies = e3;
          }
          return s2.mutableCookies;
        }, get draftMode() {
          return s2.draftMode || (s2.draftMode = new eT(i2, t2, this.cookies, this.mutableCookies)), s2.draftMode;
        }, reactLoadableManifest: (null == n2 ? void 0 : n2.reactLoadableManifest) || {}, assetPrefix: (null == n2 ? void 0 : n2.assetPrefix) || "" };
        return e2.run(l2, o2, l2);
      } }, eA = ea();
      function eL() {
        return { previewModeId: process.env.__NEXT_PREVIEW_MODE_ID, previewModeSigningKey: process.env.__NEXT_PREVIEW_MODE_SIGNING_KEY || "", previewModeEncryptionKey: process.env.__NEXT_PREVIEW_MODE_ENCRYPTION_KEY || "" };
      }
      class eI extends F {
        constructor(e2) {
          super(e2.input, e2.init), this.sourcePage = e2.page;
        }
        get request() {
          throw new x({ page: this.sourcePage });
        }
        respondWith() {
          throw new x({ page: this.sourcePage });
        }
        waitUntil() {
          throw new x({ page: this.sourcePage });
        }
      }
      let eM = { keys: (e2) => Array.from(e2.keys()), get: (e2, t2) => e2.get(t2) ?? void 0 }, ej = (e2, t2) => eE().withPropagatedContext(e2.headers, t2, eM), eq = false;
      async function eD(e2) {
        let t2, n2;
        !function() {
          if (!eq && (eq = true, "true" === process.env.NEXT_PRIVATE_TEST_PROXY)) {
            let { interceptTestApis: e3, wrapRequestHandler: t3 } = r(783);
            e3(), ej = t3(ej);
          }
        }(), await v();
        let o2 = void 0 !== self.__BUILD_MANIFEST;
        e2.request.url = e2.request.url.replace(/\.rsc($|\?)/, "$1");
        let i2 = new $(e2.request.url, { headers: e2.request.headers, nextConfig: e2.request.nextConfig });
        for (let e3 of [...i2.searchParams.keys()]) {
          let t3 = i2.searchParams.getAll(e3);
          !function(e4, t4) {
            for (let r2 of ["nxtP", "nxtI"]) e4 !== r2 && e4.startsWith(r2) && t4(e4.substring(r2.length));
          }(e3, (r2) => {
            for (let e4 of (i2.searchParams.delete(r2), t3)) i2.searchParams.append(r2, e4);
            i2.searchParams.delete(e3);
          });
        }
        let a2 = i2.buildId;
        i2.buildId = "";
        let s2 = e2.request.headers["x-nextjs-data"];
        s2 && "/index" === i2.pathname && (i2.pathname = "/");
        let l2 = function(e3) {
          let t3 = new Headers();
          for (let [r2, n3] of Object.entries(e3)) for (let e4 of Array.isArray(n3) ? n3 : [n3]) void 0 !== e4 && ("number" == typeof e4 && (e4 = e4.toString()), t3.append(r2, e4));
          return t3;
        }(e2.request.headers), u2 = /* @__PURE__ */ new Map();
        if (!o2) for (let e3 of Z) {
          let t3 = e3.toString().toLowerCase();
          l2.get(t3) && (u2.set(t3, l2.get(t3)), l2.delete(t3));
        }
        let c2 = new eI({ page: e2.page, input: function(e3, t3) {
          let r2 = "string" == typeof e3, n3 = r2 ? new URL(e3) : e3;
          for (let e4 of Q) n3.searchParams.delete(e4);
          if (t3) for (let e4 of ee) n3.searchParams.delete(e4);
          return r2 ? n3.toString() : n3;
        }(i2, true).toString(), init: { body: e2.request.body, geo: e2.request.geo, headers: l2, ip: e2.request.ip, method: e2.request.method, nextConfig: e2.request.nextConfig, signal: e2.request.signal } });
        s2 && Object.defineProperty(c2, "__isData", { enumerable: false, value: true }), !globalThis.__incrementalCacheShared && e2.IncrementalCache && (globalThis.__incrementalCache = new e2.IncrementalCache({ appDir: true, fetchCache: true, minimalMode: true, fetchCacheKeyPrefix: "", dev: false, requestHeaders: e2.request.headers, requestProtocol: "https", getPrerenderManifest: () => ({ version: -1, routes: {}, dynamicRoutes: {}, notFoundRoutes: [], preview: eL() }) }));
        let d2 = new A({ request: c2, page: e2.page });
        if ((t2 = await ej(c2, () => "/middleware" === e2.page || "/src/middleware" === e2.page ? eE().trace(g.execute, { spanName: `middleware ${c2.method} ${c2.nextUrl.pathname}`, attributes: { "http.target": c2.nextUrl.pathname, "http.method": c2.method } }, () => eO.wrap(eA, { req: c2, renderOpts: { onUpdateCookies: (e3) => {
          n2 = e3;
        }, previewProps: eL() } }, () => e2.handler(c2, d2))) : e2.handler(c2, d2))) && !(t2 instanceof Response)) throw TypeError("Expected an instance of Response to be returned");
        t2 && n2 && t2.headers.set("set-cookie", n2);
        let p2 = null == t2 ? void 0 : t2.headers.get("x-middleware-rewrite");
        if (t2 && p2 && !o2) {
          let r2 = new $(p2, { forceLocale: true, headers: e2.request.headers, nextConfig: e2.request.nextConfig });
          r2.host === c2.nextUrl.host && (r2.buildId = a2 || r2.buildId, t2.headers.set("x-middleware-rewrite", String(r2)));
          let n3 = Y(String(r2), String(i2));
          s2 && t2.headers.set("x-nextjs-rewrite", n3);
        }
        let h2 = null == t2 ? void 0 : t2.headers.get("Location");
        if (t2 && h2 && !o2) {
          let r2 = new $(h2, { forceLocale: false, headers: e2.request.headers, nextConfig: e2.request.nextConfig });
          t2 = new Response(t2.body, t2), r2.host === c2.nextUrl.host && (r2.buildId = a2 || r2.buildId, t2.headers.set("Location", String(r2))), s2 && (t2.headers.delete("Location"), t2.headers.set("x-nextjs-redirect", Y(String(r2), String(i2))));
        }
        let f2 = t2 || J.next(), w2 = f2.headers.get("x-middleware-override-headers"), m2 = [];
        if (w2) {
          for (let [e3, t3] of u2) f2.headers.set(`x-middleware-request-${e3}`, t3), m2.push(e3);
          m2.length > 0 && f2.headers.set("x-middleware-override-headers", w2 + "," + m2.join(","));
        }
        return { response: f2, waitUntil: Promise.all(d2[P]), fetchMetrics: c2.fetchMetrics };
      }
      r(935), "undefined" == typeof URLPattern || URLPattern;
      let eU = /* @__PURE__ */ new Set(["https://tools.wokspec.org", "http://localhost:3000", "http://localhost:3001"]);
      function eB(e2) {
        let { pathname: t2 } = e2.nextUrl;
        if (!t2.startsWith("/api/")) return J.next();
        let r2 = e2.headers.get("origin") ?? "", n2 = eU.has(r2) || "" === r2;
        if (r2 && !n2) return new J(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: { "Content-Type": "application/json" } });
        if (Number(e2.headers.get("content-length") ?? 0) > 524288) return new J(JSON.stringify({ error: "Request body too large." }), { status: 413, headers: { "Content-Type": "application/json" } });
        let o2 = J.next();
        return n2 && r2 && (o2.headers.set("Access-Control-Allow-Origin", r2), o2.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS"), o2.headers.set("Access-Control-Allow-Headers", "Content-Type"), o2.headers.set("Vary", "Origin")), o2.headers.set("X-Content-Type-Options", "nosniff"), o2.headers.set("Cache-Control", "no-store"), o2;
      }
      async function eH(e2) {
        let t2 = e2.headers.get("origin") ?? "";
        return eU.has(t2) ? new J(null, { status: 204, headers: { "Access-Control-Allow-Origin": t2, "Access-Control-Allow-Methods": "GET, POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type", "Access-Control-Max-Age": "86400" } }) : new J(null, { status: 204 });
      }
      let e$ = { matcher: "/api/:path*" }, eV = { ...w }, ez = eV.middleware || eV.default, eF = "/src/middleware";
      if ("function" != typeof ez) throw Error(`The Middleware "${eF}" must export a \`middleware\` or a \`default\` function`);
      function eW(e2) {
        return eD({ ...e2, page: eF, handler: ez });
      }
    }, 775: (e) => {
      "use strict";
      var t = Object.defineProperty, r = Object.getOwnPropertyDescriptor, n = Object.getOwnPropertyNames, o = Object.prototype.hasOwnProperty, i = {};
      function a(e2) {
        var t2;
        let r2 = ["path" in e2 && e2.path && `Path=${e2.path}`, "expires" in e2 && (e2.expires || 0 === e2.expires) && `Expires=${("number" == typeof e2.expires ? new Date(e2.expires) : e2.expires).toUTCString()}`, "maxAge" in e2 && "number" == typeof e2.maxAge && `Max-Age=${e2.maxAge}`, "domain" in e2 && e2.domain && `Domain=${e2.domain}`, "secure" in e2 && e2.secure && "Secure", "httpOnly" in e2 && e2.httpOnly && "HttpOnly", "sameSite" in e2 && e2.sameSite && `SameSite=${e2.sameSite}`, "partitioned" in e2 && e2.partitioned && "Partitioned", "priority" in e2 && e2.priority && `Priority=${e2.priority}`].filter(Boolean), n2 = `${e2.name}=${encodeURIComponent(null != (t2 = e2.value) ? t2 : "")}`;
        return 0 === r2.length ? n2 : `${n2}; ${r2.join("; ")}`;
      }
      function s(e2) {
        let t2 = /* @__PURE__ */ new Map();
        for (let r2 of e2.split(/; */)) {
          if (!r2) continue;
          let e3 = r2.indexOf("=");
          if (-1 === e3) {
            t2.set(r2, "true");
            continue;
          }
          let [n2, o2] = [r2.slice(0, e3), r2.slice(e3 + 1)];
          try {
            t2.set(n2, decodeURIComponent(null != o2 ? o2 : "true"));
          } catch {
          }
        }
        return t2;
      }
      function l(e2) {
        var t2, r2;
        if (!e2) return;
        let [[n2, o2], ...i2] = s(e2), { domain: a2, expires: l2, httponly: d2, maxage: p2, path: h, samesite: f, secure: g, partitioned: w, priority: m } = Object.fromEntries(i2.map(([e3, t3]) => [e3.toLowerCase(), t3]));
        return function(e3) {
          let t3 = {};
          for (let r3 in e3) e3[r3] && (t3[r3] = e3[r3]);
          return t3;
        }({ name: n2, value: decodeURIComponent(o2), domain: a2, ...l2 && { expires: new Date(l2) }, ...d2 && { httpOnly: true }, ..."string" == typeof p2 && { maxAge: Number(p2) }, path: h, ...f && { sameSite: u.includes(t2 = (t2 = f).toLowerCase()) ? t2 : void 0 }, ...g && { secure: true }, ...m && { priority: c.includes(r2 = (r2 = m).toLowerCase()) ? r2 : void 0 }, ...w && { partitioned: true } });
      }
      ((e2, r2) => {
        for (var n2 in r2) t(e2, n2, { get: r2[n2], enumerable: true });
      })(i, { RequestCookies: () => d, ResponseCookies: () => p, parseCookie: () => s, parseSetCookie: () => l, stringifyCookie: () => a }), e.exports = ((e2, i2, a2, s2) => {
        if (i2 && "object" == typeof i2 || "function" == typeof i2) for (let l2 of n(i2)) o.call(e2, l2) || l2 === a2 || t(e2, l2, { get: () => i2[l2], enumerable: !(s2 = r(i2, l2)) || s2.enumerable });
        return e2;
      })(t({}, "__esModule", { value: true }), i);
      var u = ["strict", "lax", "none"], c = ["low", "medium", "high"], d = class {
        constructor(e2) {
          this._parsed = /* @__PURE__ */ new Map(), this._headers = e2;
          let t2 = e2.get("cookie");
          if (t2) for (let [e3, r2] of s(t2)) this._parsed.set(e3, { name: e3, value: r2 });
        }
        [Symbol.iterator]() {
          return this._parsed[Symbol.iterator]();
        }
        get size() {
          return this._parsed.size;
        }
        get(...e2) {
          let t2 = "string" == typeof e2[0] ? e2[0] : e2[0].name;
          return this._parsed.get(t2);
        }
        getAll(...e2) {
          var t2;
          let r2 = Array.from(this._parsed);
          if (!e2.length) return r2.map(([e3, t3]) => t3);
          let n2 = "string" == typeof e2[0] ? e2[0] : null == (t2 = e2[0]) ? void 0 : t2.name;
          return r2.filter(([e3]) => e3 === n2).map(([e3, t3]) => t3);
        }
        has(e2) {
          return this._parsed.has(e2);
        }
        set(...e2) {
          let [t2, r2] = 1 === e2.length ? [e2[0].name, e2[0].value] : e2, n2 = this._parsed;
          return n2.set(t2, { name: t2, value: r2 }), this._headers.set("cookie", Array.from(n2).map(([e3, t3]) => a(t3)).join("; ")), this;
        }
        delete(e2) {
          let t2 = this._parsed, r2 = Array.isArray(e2) ? e2.map((e3) => t2.delete(e3)) : t2.delete(e2);
          return this._headers.set("cookie", Array.from(t2).map(([e3, t3]) => a(t3)).join("; ")), r2;
        }
        clear() {
          return this.delete(Array.from(this._parsed.keys())), this;
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return `RequestCookies ${JSON.stringify(Object.fromEntries(this._parsed))}`;
        }
        toString() {
          return [...this._parsed.values()].map((e2) => `${e2.name}=${encodeURIComponent(e2.value)}`).join("; ");
        }
      }, p = class {
        constructor(e2) {
          var t2, r2, n2;
          this._parsed = /* @__PURE__ */ new Map(), this._headers = e2;
          let o2 = null != (n2 = null != (r2 = null == (t2 = e2.getSetCookie) ? void 0 : t2.call(e2)) ? r2 : e2.get("set-cookie")) ? n2 : [];
          for (let e3 of Array.isArray(o2) ? o2 : function(e4) {
            if (!e4) return [];
            var t3, r3, n3, o3, i2, a2 = [], s2 = 0;
            function l2() {
              for (; s2 < e4.length && /\s/.test(e4.charAt(s2)); ) s2 += 1;
              return s2 < e4.length;
            }
            for (; s2 < e4.length; ) {
              for (t3 = s2, i2 = false; l2(); ) if ("," === (r3 = e4.charAt(s2))) {
                for (n3 = s2, s2 += 1, l2(), o3 = s2; s2 < e4.length && "=" !== (r3 = e4.charAt(s2)) && ";" !== r3 && "," !== r3; ) s2 += 1;
                s2 < e4.length && "=" === e4.charAt(s2) ? (i2 = true, s2 = o3, a2.push(e4.substring(t3, n3)), t3 = s2) : s2 = n3 + 1;
              } else s2 += 1;
              (!i2 || s2 >= e4.length) && a2.push(e4.substring(t3, e4.length));
            }
            return a2;
          }(o2)) {
            let t3 = l(e3);
            t3 && this._parsed.set(t3.name, t3);
          }
        }
        get(...e2) {
          let t2 = "string" == typeof e2[0] ? e2[0] : e2[0].name;
          return this._parsed.get(t2);
        }
        getAll(...e2) {
          var t2;
          let r2 = Array.from(this._parsed.values());
          if (!e2.length) return r2;
          let n2 = "string" == typeof e2[0] ? e2[0] : null == (t2 = e2[0]) ? void 0 : t2.name;
          return r2.filter((e3) => e3.name === n2);
        }
        has(e2) {
          return this._parsed.has(e2);
        }
        set(...e2) {
          let [t2, r2, n2] = 1 === e2.length ? [e2[0].name, e2[0].value, e2[0]] : e2, o2 = this._parsed;
          return o2.set(t2, function(e3 = { name: "", value: "" }) {
            return "number" == typeof e3.expires && (e3.expires = new Date(e3.expires)), e3.maxAge && (e3.expires = new Date(Date.now() + 1e3 * e3.maxAge)), (null === e3.path || void 0 === e3.path) && (e3.path = "/"), e3;
          }({ name: t2, value: r2, ...n2 })), function(e3, t3) {
            for (let [, r3] of (t3.delete("set-cookie"), e3)) {
              let e4 = a(r3);
              t3.append("set-cookie", e4);
            }
          }(o2, this._headers), this;
        }
        delete(...e2) {
          let [t2, r2, n2] = "string" == typeof e2[0] ? [e2[0]] : [e2[0].name, e2[0].path, e2[0].domain];
          return this.set({ name: t2, path: r2, domain: n2, value: "", expires: /* @__PURE__ */ new Date(0) });
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return `ResponseCookies ${JSON.stringify(Object.fromEntries(this._parsed))}`;
        }
        toString() {
          return [...this._parsed.values()].map(a).join("; ");
        }
      };
    }, 167: (e) => {
      (() => {
        "use strict";
        "undefined" != typeof __nccwpck_require__ && (__nccwpck_require__.ab = "//");
        var t = {};
        (() => {
          t.parse = function(t2, r2) {
            if ("string" != typeof t2) throw TypeError("argument str must be a string");
            for (var o2 = {}, i = t2.split(n), a = (r2 || {}).decode || e2, s = 0; s < i.length; s++) {
              var l = i[s], u = l.indexOf("=");
              if (!(u < 0)) {
                var c = l.substr(0, u).trim(), d = l.substr(++u, l.length).trim();
                '"' == d[0] && (d = d.slice(1, -1)), void 0 == o2[c] && (o2[c] = function(e3, t3) {
                  try {
                    return t3(e3);
                  } catch (t4) {
                    return e3;
                  }
                }(d, a));
              }
            }
            return o2;
          }, t.serialize = function(e3, t2, n2) {
            var i = n2 || {}, a = i.encode || r;
            if ("function" != typeof a) throw TypeError("option encode is invalid");
            if (!o.test(e3)) throw TypeError("argument name is invalid");
            var s = a(t2);
            if (s && !o.test(s)) throw TypeError("argument val is invalid");
            var l = e3 + "=" + s;
            if (null != i.maxAge) {
              var u = i.maxAge - 0;
              if (isNaN(u) || !isFinite(u)) throw TypeError("option maxAge is invalid");
              l += "; Max-Age=" + Math.floor(u);
            }
            if (i.domain) {
              if (!o.test(i.domain)) throw TypeError("option domain is invalid");
              l += "; Domain=" + i.domain;
            }
            if (i.path) {
              if (!o.test(i.path)) throw TypeError("option path is invalid");
              l += "; Path=" + i.path;
            }
            if (i.expires) {
              if ("function" != typeof i.expires.toUTCString) throw TypeError("option expires is invalid");
              l += "; Expires=" + i.expires.toUTCString();
            }
            if (i.httpOnly && (l += "; HttpOnly"), i.secure && (l += "; Secure"), i.sameSite) switch ("string" == typeof i.sameSite ? i.sameSite.toLowerCase() : i.sameSite) {
              case true:
              case "strict":
                l += "; SameSite=Strict";
                break;
              case "lax":
                l += "; SameSite=Lax";
                break;
              case "none":
                l += "; SameSite=None";
                break;
              default:
                throw TypeError("option sameSite is invalid");
            }
            return l;
          };
          var e2 = decodeURIComponent, r = encodeURIComponent, n = /; */, o = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
        })(), e.exports = t;
      })();
    }, 935: (e, t, r) => {
      var n;
      (() => {
        var o = { 226: function(o2, i2) {
          !function(a2, s2) {
            "use strict";
            var l = "function", u = "undefined", c = "object", d = "string", p = "major", h = "model", f = "name", g = "type", w = "vendor", m = "version", b = "architecture", v = "console", y = "mobile", x = "tablet", S = "smarttv", _ = "wearable", R = "embedded", C = "Amazon", k = "Apple", E = "ASUS", N = "BlackBerry", T = "Browser", P = "Chrome", O = "Firefox", A = "Google", L = "Huawei", I = "Microsoft", M = "Motorola", j = "Opera", q = "Samsung", D = "Sharp", U = "Sony", B = "Xiaomi", H = "Zebra", $ = "Facebook", V = "Chromium OS", z = "Mac OS", F = function(e2, t2) {
              var r2 = {};
              for (var n2 in e2) t2[n2] && t2[n2].length % 2 == 0 ? r2[n2] = t2[n2].concat(e2[n2]) : r2[n2] = e2[n2];
              return r2;
            }, W = function(e2) {
              for (var t2 = {}, r2 = 0; r2 < e2.length; r2++) t2[e2[r2].toUpperCase()] = e2[r2];
              return t2;
            }, G = function(e2, t2) {
              return typeof e2 === d && -1 !== X(t2).indexOf(X(e2));
            }, X = function(e2) {
              return e2.toLowerCase();
            }, K = function(e2, t2) {
              if (typeof e2 === d) return e2 = e2.replace(/^\s\s*/, ""), typeof t2 === u ? e2 : e2.substring(0, 350);
            }, J = function(e2, t2) {
              for (var r2, n2, o3, i3, a3, u2, d2 = 0; d2 < t2.length && !a3; ) {
                var p2 = t2[d2], h2 = t2[d2 + 1];
                for (r2 = n2 = 0; r2 < p2.length && !a3 && p2[r2]; ) if (a3 = p2[r2++].exec(e2)) for (o3 = 0; o3 < h2.length; o3++) u2 = a3[++n2], typeof (i3 = h2[o3]) === c && i3.length > 0 ? 2 === i3.length ? typeof i3[1] == l ? this[i3[0]] = i3[1].call(this, u2) : this[i3[0]] = i3[1] : 3 === i3.length ? typeof i3[1] !== l || i3[1].exec && i3[1].test ? this[i3[0]] = u2 ? u2.replace(i3[1], i3[2]) : void 0 : this[i3[0]] = u2 ? i3[1].call(this, u2, i3[2]) : void 0 : 4 === i3.length && (this[i3[0]] = u2 ? i3[3].call(this, u2.replace(i3[1], i3[2])) : void 0) : this[i3] = u2 || s2;
                d2 += 2;
              }
            }, Y = function(e2, t2) {
              for (var r2 in t2) if (typeof t2[r2] === c && t2[r2].length > 0) {
                for (var n2 = 0; n2 < t2[r2].length; n2++) if (G(t2[r2][n2], e2)) return "?" === r2 ? s2 : r2;
              } else if (G(t2[r2], e2)) return "?" === r2 ? s2 : r2;
              return e2;
            }, Z = { ME: "4.90", "NT 3.11": "NT3.51", "NT 4.0": "NT4.0", 2e3: "NT 5.0", XP: ["NT 5.1", "NT 5.2"], Vista: "NT 6.0", 7: "NT 6.1", 8: "NT 6.2", 8.1: "NT 6.3", 10: ["NT 6.4", "NT 10.0"], RT: "ARM" }, Q = { browser: [[/\b(?:crmo|crios)\/([\w\.]+)/i], [m, [f, "Chrome"]], [/edg(?:e|ios|a)?\/([\w\.]+)/i], [m, [f, "Edge"]], [/(opera mini)\/([-\w\.]+)/i, /(opera [mobiletab]{3,6})\b.+version\/([-\w\.]+)/i, /(opera)(?:.+version\/|[\/ ]+)([\w\.]+)/i], [f, m], [/opios[\/ ]+([\w\.]+)/i], [m, [f, j + " Mini"]], [/\bopr\/([\w\.]+)/i], [m, [f, j]], [/(kindle)\/([\w\.]+)/i, /(lunascape|maxthon|netfront|jasmine|blazer)[\/ ]?([\w\.]*)/i, /(avant |iemobile|slim)(?:browser)?[\/ ]?([\w\.]*)/i, /(ba?idubrowser)[\/ ]?([\w\.]+)/i, /(?:ms|\()(ie) ([\w\.]+)/i, /(flock|rockmelt|midori|epiphany|silk|skyfire|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark|qupzilla|falkon|rekonq|puffin|brave|whale(?!.+naver)|qqbrowserlite|qq|duckduckgo)\/([-\w\.]+)/i, /(heytap|ovi)browser\/([\d\.]+)/i, /(weibo)__([\d\.]+)/i], [f, m], [/(?:\buc? ?browser|(?:juc.+)ucweb)[\/ ]?([\w\.]+)/i], [m, [f, "UC" + T]], [/microm.+\bqbcore\/([\w\.]+)/i, /\bqbcore\/([\w\.]+).+microm/i], [m, [f, "WeChat(Win) Desktop"]], [/micromessenger\/([\w\.]+)/i], [m, [f, "WeChat"]], [/konqueror\/([\w\.]+)/i], [m, [f, "Konqueror"]], [/trident.+rv[: ]([\w\.]{1,9})\b.+like gecko/i], [m, [f, "IE"]], [/ya(?:search)?browser\/([\w\.]+)/i], [m, [f, "Yandex"]], [/(avast|avg)\/([\w\.]+)/i], [[f, /(.+)/, "$1 Secure " + T], m], [/\bfocus\/([\w\.]+)/i], [m, [f, O + " Focus"]], [/\bopt\/([\w\.]+)/i], [m, [f, j + " Touch"]], [/coc_coc\w+\/([\w\.]+)/i], [m, [f, "Coc Coc"]], [/dolfin\/([\w\.]+)/i], [m, [f, "Dolphin"]], [/coast\/([\w\.]+)/i], [m, [f, j + " Coast"]], [/miuibrowser\/([\w\.]+)/i], [m, [f, "MIUI " + T]], [/fxios\/([-\w\.]+)/i], [m, [f, O]], [/\bqihu|(qi?ho?o?|360)browser/i], [[f, "360 " + T]], [/(oculus|samsung|sailfish|huawei)browser\/([\w\.]+)/i], [[f, /(.+)/, "$1 " + T], m], [/(comodo_dragon)\/([\w\.]+)/i], [[f, /_/g, " "], m], [/(electron)\/([\w\.]+) safari/i, /(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w\.]+))/i, /m?(qqbrowser|baiduboxapp|2345Explorer)[\/ ]?([\w\.]+)/i], [f, m], [/(metasr)[\/ ]?([\w\.]+)/i, /(lbbrowser)/i, /\[(linkedin)app\]/i], [f], [/((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i], [[f, $], m], [/(kakao(?:talk|story))[\/ ]([\w\.]+)/i, /(naver)\(.*?(\d+\.[\w\.]+).*\)/i, /safari (line)\/([\w\.]+)/i, /\b(line)\/([\w\.]+)\/iab/i, /(chromium|instagram)[\/ ]([-\w\.]+)/i], [f, m], [/\bgsa\/([\w\.]+) .*safari\//i], [m, [f, "GSA"]], [/musical_ly(?:.+app_?version\/|_)([\w\.]+)/i], [m, [f, "TikTok"]], [/headlesschrome(?:\/([\w\.]+)| )/i], [m, [f, P + " Headless"]], [/ wv\).+(chrome)\/([\w\.]+)/i], [[f, P + " WebView"], m], [/droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i], [m, [f, "Android " + T]], [/(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w\.]+)/i], [f, m], [/version\/([\w\.\,]+) .*mobile\/\w+ (safari)/i], [m, [f, "Mobile Safari"]], [/version\/([\w(\.|\,)]+) .*(mobile ?safari|safari)/i], [m, f], [/webkit.+?(mobile ?safari|safari)(\/[\w\.]+)/i], [f, [m, Y, { "1.0": "/8", 1.2: "/1", 1.3: "/3", "2.0": "/412", "2.0.2": "/416", "2.0.3": "/417", "2.0.4": "/419", "?": "/" }]], [/(webkit|khtml)\/([\w\.]+)/i], [f, m], [/(navigator|netscape\d?)\/([-\w\.]+)/i], [[f, "Netscape"], m], [/mobile vr; rv:([\w\.]+)\).+firefox/i], [m, [f, O + " Reality"]], [/ekiohf.+(flow)\/([\w\.]+)/i, /(swiftfox)/i, /(icedragon|iceweasel|camino|chimera|fennec|maemo browser|minimo|conkeror|klar)[\/ ]?([\w\.\+]+)/i, /(seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([-\w\.]+)$/i, /(firefox)\/([\w\.]+)/i, /(mozilla)\/([\w\.]+) .+rv\:.+gecko\/\d+/i, /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir|obigo|mosaic|(?:go|ice|up)[\. ]?browser)[-\/ ]?v?([\w\.]+)/i, /(links) \(([\w\.]+)/i, /panasonic;(viera)/i], [f, m], [/(cobalt)\/([\w\.]+)/i], [f, [m, /master.|lts./, ""]]], cpu: [[/(?:(amd|x(?:(?:86|64)[-_])?|wow|win)64)[;\)]/i], [[b, "amd64"]], [/(ia32(?=;))/i], [[b, X]], [/((?:i[346]|x)86)[;\)]/i], [[b, "ia32"]], [/\b(aarch64|arm(v?8e?l?|_?64))\b/i], [[b, "arm64"]], [/\b(arm(?:v[67])?ht?n?[fl]p?)\b/i], [[b, "armhf"]], [/windows (ce|mobile); ppc;/i], [[b, "arm"]], [/((?:ppc|powerpc)(?:64)?)(?: mac|;|\))/i], [[b, /ower/, "", X]], [/(sun4\w)[;\)]/i], [[b, "sparc"]], [/((?:avr32|ia64(?=;))|68k(?=\))|\barm(?=v(?:[1-7]|[5-7]1)l?|;|eabi)|(?=atmel )avr|(?:irix|mips|sparc)(?:64)?\b|pa-risc)/i], [[b, X]]], device: [[/\b(sch-i[89]0\d|shw-m380s|sm-[ptx]\w{2,4}|gt-[pn]\d{2,4}|sgh-t8[56]9|nexus 10)/i], [h, [w, q], [g, x]], [/\b((?:s[cgp]h|gt|sm)-\w+|sc[g-]?[\d]+a?|galaxy nexus)/i, /samsung[- ]([-\w]+)/i, /sec-(sgh\w+)/i], [h, [w, q], [g, y]], [/(?:\/|\()(ip(?:hone|od)[\w, ]*)(?:\/|;)/i], [h, [w, k], [g, y]], [/\((ipad);[-\w\),; ]+apple/i, /applecoremedia\/[\w\.]+ \((ipad)/i, /\b(ipad)\d\d?,\d\d?[;\]].+ios/i], [h, [w, k], [g, x]], [/(macintosh);/i], [h, [w, k]], [/\b(sh-?[altvz]?\d\d[a-ekm]?)/i], [h, [w, D], [g, y]], [/\b((?:ag[rs][23]?|bah2?|sht?|btv)-a?[lw]\d{2})\b(?!.+d\/s)/i], [h, [w, L], [g, x]], [/(?:huawei|honor)([-\w ]+)[;\)]/i, /\b(nexus 6p|\w{2,4}e?-[atu]?[ln][\dx][012359c][adn]?)\b(?!.+d\/s)/i], [h, [w, L], [g, y]], [/\b(poco[\w ]+)(?: bui|\))/i, /\b; (\w+) build\/hm\1/i, /\b(hm[-_ ]?note?[_ ]?(?:\d\w)?) bui/i, /\b(redmi[\-_ ]?(?:note|k)?[\w_ ]+)(?: bui|\))/i, /\b(mi[-_ ]?(?:a\d|one|one[_ ]plus|note lte|max|cc)?[_ ]?(?:\d?\w?)[_ ]?(?:plus|se|lite)?)(?: bui|\))/i], [[h, /_/g, " "], [w, B], [g, y]], [/\b(mi[-_ ]?(?:pad)(?:[\w_ ]+))(?: bui|\))/i], [[h, /_/g, " "], [w, B], [g, x]], [/; (\w+) bui.+ oppo/i, /\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i], [h, [w, "OPPO"], [g, y]], [/vivo (\w+)(?: bui|\))/i, /\b(v[12]\d{3}\w?[at])(?: bui|;)/i], [h, [w, "Vivo"], [g, y]], [/\b(rmx[12]\d{3})(?: bui|;|\))/i], [h, [w, "Realme"], [g, y]], [/\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i, /\bmot(?:orola)?[- ](\w*)/i, /((?:moto[\w\(\) ]+|xt\d{3,4}|nexus 6)(?= bui|\)))/i], [h, [w, M], [g, y]], [/\b(mz60\d|xoom[2 ]{0,2}) build\//i], [h, [w, M], [g, x]], [/((?=lg)?[vl]k\-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i], [h, [w, "LG"], [g, x]], [/(lm(?:-?f100[nv]?|-[\w\.]+)(?= bui|\))|nexus [45])/i, /\blg[-e;\/ ]+((?!browser|netcast|android tv)\w+)/i, /\blg-?([\d\w]+) bui/i], [h, [w, "LG"], [g, y]], [/(ideatab[-\w ]+)/i, /lenovo ?(s[56]000[-\w]+|tab(?:[\w ]+)|yt[-\d\w]{6}|tb[-\d\w]{6})/i], [h, [w, "Lenovo"], [g, x]], [/(?:maemo|nokia).*(n900|lumia \d+)/i, /nokia[-_ ]?([-\w\.]*)/i], [[h, /_/g, " "], [w, "Nokia"], [g, y]], [/(pixel c)\b/i], [h, [w, A], [g, x]], [/droid.+; (pixel[\daxl ]{0,6})(?: bui|\))/i], [h, [w, A], [g, y]], [/droid.+ (a?\d[0-2]{2}so|[c-g]\d{4}|so[-gl]\w+|xq-a\w[4-7][12])(?= bui|\).+chrome\/(?![1-6]{0,1}\d\.))/i], [h, [w, U], [g, y]], [/sony tablet [ps]/i, /\b(?:sony)?sgp\w+(?: bui|\))/i], [[h, "Xperia Tablet"], [w, U], [g, x]], [/ (kb2005|in20[12]5|be20[12][59])\b/i, /(?:one)?(?:plus)? (a\d0\d\d)(?: b|\))/i], [h, [w, "OnePlus"], [g, y]], [/(alexa)webm/i, /(kf[a-z]{2}wi|aeo[c-r]{2})( bui|\))/i, /(kf[a-z]+)( bui|\)).+silk\//i], [h, [w, C], [g, x]], [/((?:sd|kf)[0349hijorstuw]+)( bui|\)).+silk\//i], [[h, /(.+)/g, "Fire Phone $1"], [w, C], [g, y]], [/(playbook);[-\w\),; ]+(rim)/i], [h, w, [g, x]], [/\b((?:bb[a-f]|st[hv])100-\d)/i, /\(bb10; (\w+)/i], [h, [w, N], [g, y]], [/(?:\b|asus_)(transfo[prime ]{4,10} \w+|eeepc|slider \w+|nexus 7|padfone|p00[cj])/i], [h, [w, E], [g, x]], [/ (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i], [h, [w, E], [g, y]], [/(nexus 9)/i], [h, [w, "HTC"], [g, x]], [/(htc)[-;_ ]{1,2}([\w ]+(?=\)| bui)|\w+)/i, /(zte)[- ]([\w ]+?)(?: bui|\/|\))/i, /(alcatel|geeksphone|nexian|panasonic(?!(?:;|\.))|sony(?!-bra))[-_ ]?([-\w]*)/i], [w, [h, /_/g, " "], [g, y]], [/droid.+; ([ab][1-7]-?[0178a]\d\d?)/i], [h, [w, "Acer"], [g, x]], [/droid.+; (m[1-5] note) bui/i, /\bmz-([-\w]{2,})/i], [h, [w, "Meizu"], [g, y]], [/(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron)[-_ ]?([-\w]*)/i, /(hp) ([\w ]+\w)/i, /(asus)-?(\w+)/i, /(microsoft); (lumia[\w ]+)/i, /(lenovo)[-_ ]?([-\w]+)/i, /(jolla)/i, /(oppo) ?([\w ]+) bui/i], [w, h, [g, y]], [/(kobo)\s(ereader|touch)/i, /(archos) (gamepad2?)/i, /(hp).+(touchpad(?!.+tablet)|tablet)/i, /(kindle)\/([\w\.]+)/i, /(nook)[\w ]+build\/(\w+)/i, /(dell) (strea[kpr\d ]*[\dko])/i, /(le[- ]+pan)[- ]+(\w{1,9}) bui/i, /(trinity)[- ]*(t\d{3}) bui/i, /(gigaset)[- ]+(q\w{1,9}) bui/i, /(vodafone) ([\w ]+)(?:\)| bui)/i], [w, h, [g, x]], [/(surface duo)/i], [h, [w, I], [g, x]], [/droid [\d\.]+; (fp\du?)(?: b|\))/i], [h, [w, "Fairphone"], [g, y]], [/(u304aa)/i], [h, [w, "AT&T"], [g, y]], [/\bsie-(\w*)/i], [h, [w, "Siemens"], [g, y]], [/\b(rct\w+) b/i], [h, [w, "RCA"], [g, x]], [/\b(venue[\d ]{2,7}) b/i], [h, [w, "Dell"], [g, x]], [/\b(q(?:mv|ta)\w+) b/i], [h, [w, "Verizon"], [g, x]], [/\b(?:barnes[& ]+noble |bn[rt])([\w\+ ]*) b/i], [h, [w, "Barnes & Noble"], [g, x]], [/\b(tm\d{3}\w+) b/i], [h, [w, "NuVision"], [g, x]], [/\b(k88) b/i], [h, [w, "ZTE"], [g, x]], [/\b(nx\d{3}j) b/i], [h, [w, "ZTE"], [g, y]], [/\b(gen\d{3}) b.+49h/i], [h, [w, "Swiss"], [g, y]], [/\b(zur\d{3}) b/i], [h, [w, "Swiss"], [g, x]], [/\b((zeki)?tb.*\b) b/i], [h, [w, "Zeki"], [g, x]], [/\b([yr]\d{2}) b/i, /\b(dragon[- ]+touch |dt)(\w{5}) b/i], [[w, "Dragon Touch"], h, [g, x]], [/\b(ns-?\w{0,9}) b/i], [h, [w, "Insignia"], [g, x]], [/\b((nxa|next)-?\w{0,9}) b/i], [h, [w, "NextBook"], [g, x]], [/\b(xtreme\_)?(v(1[045]|2[015]|[3469]0|7[05])) b/i], [[w, "Voice"], h, [g, y]], [/\b(lvtel\-)?(v1[12]) b/i], [[w, "LvTel"], h, [g, y]], [/\b(ph-1) /i], [h, [w, "Essential"], [g, y]], [/\b(v(100md|700na|7011|917g).*\b) b/i], [h, [w, "Envizen"], [g, x]], [/\b(trio[-\w\. ]+) b/i], [h, [w, "MachSpeed"], [g, x]], [/\btu_(1491) b/i], [h, [w, "Rotor"], [g, x]], [/(shield[\w ]+) b/i], [h, [w, "Nvidia"], [g, x]], [/(sprint) (\w+)/i], [w, h, [g, y]], [/(kin\.[onetw]{3})/i], [[h, /\./g, " "], [w, I], [g, y]], [/droid.+; (cc6666?|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i], [h, [w, H], [g, x]], [/droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i], [h, [w, H], [g, y]], [/smart-tv.+(samsung)/i], [w, [g, S]], [/hbbtv.+maple;(\d+)/i], [[h, /^/, "SmartTV"], [w, q], [g, S]], [/(nux; netcast.+smarttv|lg (netcast\.tv-201\d|android tv))/i], [[w, "LG"], [g, S]], [/(apple) ?tv/i], [w, [h, k + " TV"], [g, S]], [/crkey/i], [[h, P + "cast"], [w, A], [g, S]], [/droid.+aft(\w)( bui|\))/i], [h, [w, C], [g, S]], [/\(dtv[\);].+(aquos)/i, /(aquos-tv[\w ]+)\)/i], [h, [w, D], [g, S]], [/(bravia[\w ]+)( bui|\))/i], [h, [w, U], [g, S]], [/(mitv-\w{5}) bui/i], [h, [w, B], [g, S]], [/Hbbtv.*(technisat) (.*);/i], [w, h, [g, S]], [/\b(roku)[\dx]*[\)\/]((?:dvp-)?[\d\.]*)/i, /hbbtv\/\d+\.\d+\.\d+ +\([\w\+ ]*; *([\w\d][^;]*);([^;]*)/i], [[w, K], [h, K], [g, S]], [/\b(android tv|smart[- ]?tv|opera tv|tv; rv:)\b/i], [[g, S]], [/(ouya)/i, /(nintendo) ([wids3utch]+)/i], [w, h, [g, v]], [/droid.+; (shield) bui/i], [h, [w, "Nvidia"], [g, v]], [/(playstation [345portablevi]+)/i], [h, [w, U], [g, v]], [/\b(xbox(?: one)?(?!; xbox))[\); ]/i], [h, [w, I], [g, v]], [/((pebble))app/i], [w, h, [g, _]], [/(watch)(?: ?os[,\/]|\d,\d\/)[\d\.]+/i], [h, [w, k], [g, _]], [/droid.+; (glass) \d/i], [h, [w, A], [g, _]], [/droid.+; (wt63?0{2,3})\)/i], [h, [w, H], [g, _]], [/(quest( 2| pro)?)/i], [h, [w, $], [g, _]], [/(tesla)(?: qtcarbrowser|\/[-\w\.]+)/i], [w, [g, R]], [/(aeobc)\b/i], [h, [w, C], [g, R]], [/droid .+?; ([^;]+?)(?: bui|\) applew).+? mobile safari/i], [h, [g, y]], [/droid .+?; ([^;]+?)(?: bui|\) applew).+?(?! mobile) safari/i], [h, [g, x]], [/\b((tablet|tab)[;\/]|focus\/\d(?!.+mobile))/i], [[g, x]], [/(phone|mobile(?:[;\/]| [ \w\/\.]*safari)|pda(?=.+windows ce))/i], [[g, y]], [/(android[-\w\. ]{0,9});.+buil/i], [h, [w, "Generic"]]], engine: [[/windows.+ edge\/([\w\.]+)/i], [m, [f, "EdgeHTML"]], [/webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i], [m, [f, "Blink"]], [/(presto)\/([\w\.]+)/i, /(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna)\/([\w\.]+)/i, /ekioh(flow)\/([\w\.]+)/i, /(khtml|tasman|links)[\/ ]\(?([\w\.]+)/i, /(icab)[\/ ]([23]\.[\d\.]+)/i, /\b(libweb)/i], [f, m], [/rv\:([\w\.]{1,9})\b.+(gecko)/i], [m, f]], os: [[/microsoft (windows) (vista|xp)/i], [f, m], [/(windows) nt 6\.2; (arm)/i, /(windows (?:phone(?: os)?|mobile))[\/ ]?([\d\.\w ]*)/i, /(windows)[\/ ]?([ntce\d\. ]+\w)(?!.+xbox)/i], [f, [m, Y, Z]], [/(win(?=3|9|n)|win 9x )([nt\d\.]+)/i], [[f, "Windows"], [m, Y, Z]], [/ip[honead]{2,4}\b(?:.*os ([\w]+) like mac|; opera)/i, /ios;fbsv\/([\d\.]+)/i, /cfnetwork\/.+darwin/i], [[m, /_/g, "."], [f, "iOS"]], [/(mac os x) ?([\w\. ]*)/i, /(macintosh|mac_powerpc\b)(?!.+haiku)/i], [[f, z], [m, /_/g, "."]], [/droid ([\w\.]+)\b.+(android[- ]x86|harmonyos)/i], [m, f], [/(android|webos|qnx|bada|rim tablet os|maemo|meego|sailfish)[-\/ ]?([\w\.]*)/i, /(blackberry)\w*\/([\w\.]*)/i, /(tizen|kaios)[\/ ]([\w\.]+)/i, /\((series40);/i], [f, m], [/\(bb(10);/i], [m, [f, N]], [/(?:symbian ?os|symbos|s60(?=;)|series60)[-\/ ]?([\w\.]*)/i], [m, [f, "Symbian"]], [/mozilla\/[\d\.]+ \((?:mobile|tablet|tv|mobile; [\w ]+); rv:.+ gecko\/([\w\.]+)/i], [m, [f, O + " OS"]], [/web0s;.+rt(tv)/i, /\b(?:hp)?wos(?:browser)?\/([\w\.]+)/i], [m, [f, "webOS"]], [/watch(?: ?os[,\/]|\d,\d\/)([\d\.]+)/i], [m, [f, "watchOS"]], [/crkey\/([\d\.]+)/i], [m, [f, P + "cast"]], [/(cros) [\w]+(?:\)| ([\w\.]+)\b)/i], [[f, V], m], [/panasonic;(viera)/i, /(netrange)mmh/i, /(nettv)\/(\d+\.[\w\.]+)/i, /(nintendo|playstation) ([wids345portablevuch]+)/i, /(xbox); +xbox ([^\);]+)/i, /\b(joli|palm)\b ?(?:os)?\/?([\w\.]*)/i, /(mint)[\/\(\) ]?(\w*)/i, /(mageia|vectorlinux)[; ]/i, /([kxln]?ubuntu|debian|suse|opensuse|gentoo|arch(?= linux)|slackware|fedora|mandriva|centos|pclinuxos|red ?hat|zenwalk|linpus|raspbian|plan 9|minix|risc os|contiki|deepin|manjaro|elementary os|sabayon|linspire)(?: gnu\/linux)?(?: enterprise)?(?:[- ]linux)?(?:-gnu)?[-\/ ]?(?!chrom|package)([-\w\.]*)/i, /(hurd|linux) ?([\w\.]*)/i, /(gnu) ?([\w\.]*)/i, /\b([-frentopcghs]{0,5}bsd|dragonfly)[\/ ]?(?!amd|[ix346]{1,2}86)([\w\.]*)/i, /(haiku) (\w+)/i], [f, m], [/(sunos) ?([\w\.\d]*)/i], [[f, "Solaris"], m], [/((?:open)?solaris)[-\/ ]?([\w\.]*)/i, /(aix) ((\d)(?=\.|\)| )[\w\.])*/i, /\b(beos|os\/2|amigaos|morphos|openvms|fuchsia|hp-ux|serenityos)/i, /(unix) ?([\w\.]*)/i], [f, m]] }, ee = function(e2, t2) {
              if (typeof e2 === c && (t2 = e2, e2 = s2), !(this instanceof ee)) return new ee(e2, t2).getResult();
              var r2 = typeof a2 !== u && a2.navigator ? a2.navigator : s2, n2 = e2 || (r2 && r2.userAgent ? r2.userAgent : ""), o3 = r2 && r2.userAgentData ? r2.userAgentData : s2, i3 = t2 ? F(Q, t2) : Q, v2 = r2 && r2.userAgent == n2;
              return this.getBrowser = function() {
                var e3, t3 = {};
                return t3[f] = s2, t3[m] = s2, J.call(t3, n2, i3.browser), t3[p] = typeof (e3 = t3[m]) === d ? e3.replace(/[^\d\.]/g, "").split(".")[0] : s2, v2 && r2 && r2.brave && typeof r2.brave.isBrave == l && (t3[f] = "Brave"), t3;
              }, this.getCPU = function() {
                var e3 = {};
                return e3[b] = s2, J.call(e3, n2, i3.cpu), e3;
              }, this.getDevice = function() {
                var e3 = {};
                return e3[w] = s2, e3[h] = s2, e3[g] = s2, J.call(e3, n2, i3.device), v2 && !e3[g] && o3 && o3.mobile && (e3[g] = y), v2 && "Macintosh" == e3[h] && r2 && typeof r2.standalone !== u && r2.maxTouchPoints && r2.maxTouchPoints > 2 && (e3[h] = "iPad", e3[g] = x), e3;
              }, this.getEngine = function() {
                var e3 = {};
                return e3[f] = s2, e3[m] = s2, J.call(e3, n2, i3.engine), e3;
              }, this.getOS = function() {
                var e3 = {};
                return e3[f] = s2, e3[m] = s2, J.call(e3, n2, i3.os), v2 && !e3[f] && o3 && "Unknown" != o3.platform && (e3[f] = o3.platform.replace(/chrome os/i, V).replace(/macos/i, z)), e3;
              }, this.getResult = function() {
                return { ua: this.getUA(), browser: this.getBrowser(), engine: this.getEngine(), os: this.getOS(), device: this.getDevice(), cpu: this.getCPU() };
              }, this.getUA = function() {
                return n2;
              }, this.setUA = function(e3) {
                return n2 = typeof e3 === d && e3.length > 350 ? K(e3, 350) : e3, this;
              }, this.setUA(n2), this;
            };
            ee.VERSION = "1.0.35", ee.BROWSER = W([f, m, p]), ee.CPU = W([b]), ee.DEVICE = W([h, w, g, v, y, S, x, _, R]), ee.ENGINE = ee.OS = W([f, m]), typeof i2 !== u ? (o2.exports && (i2 = o2.exports = ee), i2.UAParser = ee) : r.amdO ? void 0 !== (n = function() {
              return ee;
            }.call(t, r, t, e)) && (e.exports = n) : typeof a2 !== u && (a2.UAParser = ee);
            var et = typeof a2 !== u && (a2.jQuery || a2.Zepto);
            if (et && !et.ua) {
              var er = new ee();
              et.ua = er.getResult(), et.ua.get = function() {
                return er.getUA();
              }, et.ua.set = function(e2) {
                er.setUA(e2);
                var t2 = er.getResult();
                for (var r2 in t2) et.ua[r2] = t2[r2];
              };
            }
          }("object" == typeof window ? window : this);
        } }, i = {};
        function a(e2) {
          var t2 = i[e2];
          if (void 0 !== t2) return t2.exports;
          var r2 = i[e2] = { exports: {} }, n2 = true;
          try {
            o[e2].call(r2.exports, r2, r2.exports, a), n2 = false;
          } finally {
            n2 && delete i[e2];
          }
          return r2.exports;
        }
        a.ab = "//";
        var s = a(226);
        e.exports = s;
      })();
    }, 382: (e, t, r) => {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: true }), function(e2, t2) {
        for (var r2 in t2) Object.defineProperty(e2, r2, { enumerable: true, get: t2[r2] });
      }(t, { getTestReqInfo: function() {
        return a;
      }, withRequest: function() {
        return i;
      } });
      let n = new (r(67)).AsyncLocalStorage();
      function o(e2, t2) {
        let r2 = t2.header(e2, "next-test-proxy-port");
        if (r2) return { url: t2.url(e2), proxyPort: Number(r2), testData: t2.header(e2, "next-test-data") || "" };
      }
      function i(e2, t2, r2) {
        let i2 = o(e2, t2);
        return i2 ? n.run(i2, r2) : r2();
      }
      function a(e2, t2) {
        return n.getStore() || (e2 && t2 ? o(e2, t2) : void 0);
      }
    }, 5: (e, t, r) => {
      "use strict";
      var n = r(195).Buffer;
      Object.defineProperty(t, "__esModule", { value: true }), function(e2, t2) {
        for (var r2 in t2) Object.defineProperty(e2, r2, { enumerable: true, get: t2[r2] });
      }(t, { handleFetch: function() {
        return s;
      }, interceptFetch: function() {
        return l;
      }, reader: function() {
        return i;
      } });
      let o = r(382), i = { url: (e2) => e2.url, header: (e2, t2) => e2.headers.get(t2) };
      async function a(e2, t2) {
        let { url: r2, method: o2, headers: i2, body: a2, cache: s2, credentials: l2, integrity: u, mode: c, redirect: d, referrer: p, referrerPolicy: h } = t2;
        return { testData: e2, api: "fetch", request: { url: r2, method: o2, headers: [...Array.from(i2), ["next-test-stack", function() {
          let e3 = (Error().stack ?? "").split("\n");
          for (let t3 = 1; t3 < e3.length; t3++) if (e3[t3].length > 0) {
            e3 = e3.slice(t3);
            break;
          }
          return (e3 = (e3 = (e3 = e3.filter((e4) => !e4.includes("/next/dist/"))).slice(0, 5)).map((e4) => e4.replace("webpack-internal:///(rsc)/", "").trim())).join("    ");
        }()]], body: a2 ? n.from(await t2.arrayBuffer()).toString("base64") : null, cache: s2, credentials: l2, integrity: u, mode: c, redirect: d, referrer: p, referrerPolicy: h } };
      }
      async function s(e2, t2) {
        let r2 = (0, o.getTestReqInfo)(t2, i);
        if (!r2) return e2(t2);
        let { testData: s2, proxyPort: l2 } = r2, u = await a(s2, t2), c = await e2(`http://localhost:${l2}`, { method: "POST", body: JSON.stringify(u), next: { internal: true } });
        if (!c.ok) throw Error(`Proxy request failed: ${c.status}`);
        let d = await c.json(), { api: p } = d;
        switch (p) {
          case "continue":
            return e2(t2);
          case "abort":
          case "unhandled":
            throw Error(`Proxy request aborted [${t2.method} ${t2.url}]`);
        }
        return function(e3) {
          let { status: t3, headers: r3, body: o2 } = e3.response;
          return new Response(o2 ? n.from(o2, "base64") : null, { status: t3, headers: new Headers(r3) });
        }(d);
      }
      function l(e2) {
        return r.g.fetch = function(t2, r2) {
          var n2;
          return (null == r2 ? void 0 : null == (n2 = r2.next) ? void 0 : n2.internal) ? e2(t2, r2) : s(e2, new Request(t2, r2));
        }, () => {
          r.g.fetch = e2;
        };
      }
    }, 783: (e, t, r) => {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: true }), function(e2, t2) {
        for (var r2 in t2) Object.defineProperty(e2, r2, { enumerable: true, get: t2[r2] });
      }(t, { interceptTestApis: function() {
        return i;
      }, wrapRequestHandler: function() {
        return a;
      } });
      let n = r(382), o = r(5);
      function i() {
        return (0, o.interceptFetch)(r.g.fetch);
      }
      function a(e2) {
        return (t2, r2) => (0, n.withRequest)(t2, o.reader, () => e2(t2, r2));
      }
    }, 519: (e, t, r) => {
      "use strict";
      r.r(t), r.d(t, { DiagConsoleLogger: () => I, DiagLogLevel: () => n, INVALID_SPANID: () => ed, INVALID_SPAN_CONTEXT: () => eh, INVALID_TRACEID: () => ep, ProxyTracer: () => eO, ProxyTracerProvider: () => eL, ROOT_CONTEXT: () => A, SamplingDecision: () => a, SpanKind: () => s, SpanStatusCode: () => l, TraceFlags: () => i, ValueType: () => o, baggageEntryMetadataFromString: () => P, context: () => eB, createContextKey: () => O, createNoopMeter: () => ee, createTraceState: () => eU, default: () => e2, defaultTextMapGetter: () => et, defaultTextMapSetter: () => er, diag: () => eH, isSpanContextValid: () => ek, isValidSpanId: () => eC, isValidTraceId: () => eR, metrics: () => ez, propagation: () => eQ, trace: () => e1 });
      var n, o, i, a, s, l, u = "object" == typeof globalThis ? globalThis : "object" == typeof self ? self : "object" == typeof window ? window : "object" == typeof r.g ? r.g : {}, c = "1.9.0", d = /^(\d+)\.(\d+)\.(\d+)(-(.+))?$/, p = function(e3) {
        var t2 = /* @__PURE__ */ new Set([e3]), r2 = /* @__PURE__ */ new Set(), n2 = e3.match(d);
        if (!n2) return function() {
          return false;
        };
        var o2 = { major: +n2[1], minor: +n2[2], patch: +n2[3], prerelease: n2[4] };
        if (null != o2.prerelease) return function(t3) {
          return t3 === e3;
        };
        function i2(e4) {
          return r2.add(e4), false;
        }
        return function(e4) {
          if (t2.has(e4)) return true;
          if (r2.has(e4)) return false;
          var n3 = e4.match(d);
          if (!n3) return i2(e4);
          var a2 = { major: +n3[1], minor: +n3[2], patch: +n3[3], prerelease: n3[4] };
          return null != a2.prerelease || o2.major !== a2.major ? i2(e4) : 0 === o2.major ? o2.minor === a2.minor && o2.patch <= a2.patch ? (t2.add(e4), true) : i2(e4) : o2.minor <= a2.minor ? (t2.add(e4), true) : i2(e4);
        };
      }(c), h = Symbol.for("opentelemetry.js.api." + c.split(".")[0]);
      function f(e3, t2, r2, n2) {
        void 0 === n2 && (n2 = false);
        var o2, i2 = u[h] = null !== (o2 = u[h]) && void 0 !== o2 ? o2 : { version: c };
        if (!n2 && i2[e3]) {
          var a2 = Error("@opentelemetry/api: Attempted duplicate registration of API: " + e3);
          return r2.error(a2.stack || a2.message), false;
        }
        if (i2.version !== c) {
          var a2 = Error("@opentelemetry/api: Registration of version v" + i2.version + " for " + e3 + " does not match previously registered API v" + c);
          return r2.error(a2.stack || a2.message), false;
        }
        return i2[e3] = t2, r2.debug("@opentelemetry/api: Registered a global for " + e3 + " v" + c + "."), true;
      }
      function g(e3) {
        var t2, r2, n2 = null === (t2 = u[h]) || void 0 === t2 ? void 0 : t2.version;
        if (n2 && p(n2)) return null === (r2 = u[h]) || void 0 === r2 ? void 0 : r2[e3];
      }
      function w(e3, t2) {
        t2.debug("@opentelemetry/api: Unregistering a global for " + e3 + " v" + c + ".");
        var r2 = u[h];
        r2 && delete r2[e3];
      }
      var m = function(e3, t2) {
        var r2 = "function" == typeof Symbol && e3[Symbol.iterator];
        if (!r2) return e3;
        var n2, o2, i2 = r2.call(e3), a2 = [];
        try {
          for (; (void 0 === t2 || t2-- > 0) && !(n2 = i2.next()).done; ) a2.push(n2.value);
        } catch (e4) {
          o2 = { error: e4 };
        } finally {
          try {
            n2 && !n2.done && (r2 = i2.return) && r2.call(i2);
          } finally {
            if (o2) throw o2.error;
          }
        }
        return a2;
      }, b = function(e3, t2, r2) {
        if (r2 || 2 == arguments.length) for (var n2, o2 = 0, i2 = t2.length; o2 < i2; o2++) !n2 && o2 in t2 || (n2 || (n2 = Array.prototype.slice.call(t2, 0, o2)), n2[o2] = t2[o2]);
        return e3.concat(n2 || Array.prototype.slice.call(t2));
      }, v = function() {
        function e3(e4) {
          this._namespace = e4.namespace || "DiagComponentLogger";
        }
        return e3.prototype.debug = function() {
          for (var e4 = [], t2 = 0; t2 < arguments.length; t2++) e4[t2] = arguments[t2];
          return y("debug", this._namespace, e4);
        }, e3.prototype.error = function() {
          for (var e4 = [], t2 = 0; t2 < arguments.length; t2++) e4[t2] = arguments[t2];
          return y("error", this._namespace, e4);
        }, e3.prototype.info = function() {
          for (var e4 = [], t2 = 0; t2 < arguments.length; t2++) e4[t2] = arguments[t2];
          return y("info", this._namespace, e4);
        }, e3.prototype.warn = function() {
          for (var e4 = [], t2 = 0; t2 < arguments.length; t2++) e4[t2] = arguments[t2];
          return y("warn", this._namespace, e4);
        }, e3.prototype.verbose = function() {
          for (var e4 = [], t2 = 0; t2 < arguments.length; t2++) e4[t2] = arguments[t2];
          return y("verbose", this._namespace, e4);
        }, e3;
      }();
      function y(e3, t2, r2) {
        var n2 = g("diag");
        if (n2) return r2.unshift(t2), n2[e3].apply(n2, b([], m(r2), false));
      }
      !function(e3) {
        e3[e3.NONE = 0] = "NONE", e3[e3.ERROR = 30] = "ERROR", e3[e3.WARN = 50] = "WARN", e3[e3.INFO = 60] = "INFO", e3[e3.DEBUG = 70] = "DEBUG", e3[e3.VERBOSE = 80] = "VERBOSE", e3[e3.ALL = 9999] = "ALL";
      }(n || (n = {}));
      var x = function(e3, t2) {
        var r2 = "function" == typeof Symbol && e3[Symbol.iterator];
        if (!r2) return e3;
        var n2, o2, i2 = r2.call(e3), a2 = [];
        try {
          for (; (void 0 === t2 || t2-- > 0) && !(n2 = i2.next()).done; ) a2.push(n2.value);
        } catch (e4) {
          o2 = { error: e4 };
        } finally {
          try {
            n2 && !n2.done && (r2 = i2.return) && r2.call(i2);
          } finally {
            if (o2) throw o2.error;
          }
        }
        return a2;
      }, S = function(e3, t2, r2) {
        if (r2 || 2 == arguments.length) for (var n2, o2 = 0, i2 = t2.length; o2 < i2; o2++) !n2 && o2 in t2 || (n2 || (n2 = Array.prototype.slice.call(t2, 0, o2)), n2[o2] = t2[o2]);
        return e3.concat(n2 || Array.prototype.slice.call(t2));
      }, _ = function() {
        function e3() {
          function e4(e5) {
            return function() {
              for (var t3 = [], r2 = 0; r2 < arguments.length; r2++) t3[r2] = arguments[r2];
              var n2 = g("diag");
              if (n2) return n2[e5].apply(n2, S([], x(t3), false));
            };
          }
          var t2 = this;
          t2.setLogger = function(e5, r2) {
            if (void 0 === r2 && (r2 = { logLevel: n.INFO }), e5 === t2) {
              var o2, i2, a2, s2 = Error("Cannot use diag as the logger for itself. Please use a DiagLogger implementation like ConsoleDiagLogger or a custom implementation");
              return t2.error(null !== (o2 = s2.stack) && void 0 !== o2 ? o2 : s2.message), false;
            }
            "number" == typeof r2 && (r2 = { logLevel: r2 });
            var l2 = g("diag"), u2 = function(e6, t3) {
              function r3(r4, n2) {
                var o3 = t3[r4];
                return "function" == typeof o3 && e6 >= n2 ? o3.bind(t3) : function() {
                };
              }
              return e6 < n.NONE ? e6 = n.NONE : e6 > n.ALL && (e6 = n.ALL), t3 = t3 || {}, { error: r3("error", n.ERROR), warn: r3("warn", n.WARN), info: r3("info", n.INFO), debug: r3("debug", n.DEBUG), verbose: r3("verbose", n.VERBOSE) };
            }(null !== (i2 = r2.logLevel) && void 0 !== i2 ? i2 : n.INFO, e5);
            if (l2 && !r2.suppressOverrideMessage) {
              var c2 = null !== (a2 = Error().stack) && void 0 !== a2 ? a2 : "<failed to generate stacktrace>";
              l2.warn("Current logger will be overwritten from " + c2), u2.warn("Current logger will overwrite one already registered from " + c2);
            }
            return f("diag", u2, t2, true);
          }, t2.disable = function() {
            w("diag", t2);
          }, t2.createComponentLogger = function(e5) {
            return new v(e5);
          }, t2.verbose = e4("verbose"), t2.debug = e4("debug"), t2.info = e4("info"), t2.warn = e4("warn"), t2.error = e4("error");
        }
        return e3.instance = function() {
          return this._instance || (this._instance = new e3()), this._instance;
        }, e3;
      }(), R = function(e3, t2) {
        var r2 = "function" == typeof Symbol && e3[Symbol.iterator];
        if (!r2) return e3;
        var n2, o2, i2 = r2.call(e3), a2 = [];
        try {
          for (; (void 0 === t2 || t2-- > 0) && !(n2 = i2.next()).done; ) a2.push(n2.value);
        } catch (e4) {
          o2 = { error: e4 };
        } finally {
          try {
            n2 && !n2.done && (r2 = i2.return) && r2.call(i2);
          } finally {
            if (o2) throw o2.error;
          }
        }
        return a2;
      }, C = function(e3) {
        var t2 = "function" == typeof Symbol && Symbol.iterator, r2 = t2 && e3[t2], n2 = 0;
        if (r2) return r2.call(e3);
        if (e3 && "number" == typeof e3.length) return { next: function() {
          return e3 && n2 >= e3.length && (e3 = void 0), { value: e3 && e3[n2++], done: !e3 };
        } };
        throw TypeError(t2 ? "Object is not iterable." : "Symbol.iterator is not defined.");
      }, k = function() {
        function e3(e4) {
          this._entries = e4 ? new Map(e4) : /* @__PURE__ */ new Map();
        }
        return e3.prototype.getEntry = function(e4) {
          var t2 = this._entries.get(e4);
          if (t2) return Object.assign({}, t2);
        }, e3.prototype.getAllEntries = function() {
          return Array.from(this._entries.entries()).map(function(e4) {
            var t2 = R(e4, 2);
            return [t2[0], t2[1]];
          });
        }, e3.prototype.setEntry = function(t2, r2) {
          var n2 = new e3(this._entries);
          return n2._entries.set(t2, r2), n2;
        }, e3.prototype.removeEntry = function(t2) {
          var r2 = new e3(this._entries);
          return r2._entries.delete(t2), r2;
        }, e3.prototype.removeEntries = function() {
          for (var t2, r2, n2 = [], o2 = 0; o2 < arguments.length; o2++) n2[o2] = arguments[o2];
          var i2 = new e3(this._entries);
          try {
            for (var a2 = C(n2), s2 = a2.next(); !s2.done; s2 = a2.next()) {
              var l2 = s2.value;
              i2._entries.delete(l2);
            }
          } catch (e4) {
            t2 = { error: e4 };
          } finally {
            try {
              s2 && !s2.done && (r2 = a2.return) && r2.call(a2);
            } finally {
              if (t2) throw t2.error;
            }
          }
          return i2;
        }, e3.prototype.clear = function() {
          return new e3();
        }, e3;
      }(), E = Symbol("BaggageEntryMetadata"), N = _.instance();
      function T(e3) {
        return void 0 === e3 && (e3 = {}), new k(new Map(Object.entries(e3)));
      }
      function P(e3) {
        return "string" != typeof e3 && (N.error("Cannot create baggage metadata from unknown type: " + typeof e3), e3 = ""), { __TYPE__: E, toString: function() {
          return e3;
        } };
      }
      function O(e3) {
        return Symbol.for(e3);
      }
      var A = new function e3(t2) {
        var r2 = this;
        r2._currentContext = t2 ? new Map(t2) : /* @__PURE__ */ new Map(), r2.getValue = function(e4) {
          return r2._currentContext.get(e4);
        }, r2.setValue = function(t3, n2) {
          var o2 = new e3(r2._currentContext);
          return o2._currentContext.set(t3, n2), o2;
        }, r2.deleteValue = function(t3) {
          var n2 = new e3(r2._currentContext);
          return n2._currentContext.delete(t3), n2;
        };
      }(), L = [{ n: "error", c: "error" }, { n: "warn", c: "warn" }, { n: "info", c: "info" }, { n: "debug", c: "debug" }, { n: "verbose", c: "trace" }], I = function() {
        for (var e3 = 0; e3 < L.length; e3++) this[L[e3].n] = /* @__PURE__ */ function(e4) {
          return function() {
            for (var t2 = [], r2 = 0; r2 < arguments.length; r2++) t2[r2] = arguments[r2];
            if (console) {
              var n2 = console[e4];
              if ("function" != typeof n2 && (n2 = console.log), "function" == typeof n2) return n2.apply(console, t2);
            }
          };
        }(L[e3].c);
      }, M = /* @__PURE__ */ function() {
        var e3 = function(t2, r2) {
          return (e3 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(e4, t3) {
            e4.__proto__ = t3;
          } || function(e4, t3) {
            for (var r3 in t3) Object.prototype.hasOwnProperty.call(t3, r3) && (e4[r3] = t3[r3]);
          })(t2, r2);
        };
        return function(t2, r2) {
          if ("function" != typeof r2 && null !== r2) throw TypeError("Class extends value " + String(r2) + " is not a constructor or null");
          function n2() {
            this.constructor = t2;
          }
          e3(t2, r2), t2.prototype = null === r2 ? Object.create(r2) : (n2.prototype = r2.prototype, new n2());
        };
      }(), j = function() {
        function e3() {
        }
        return e3.prototype.createGauge = function(e4, t2) {
          return X;
        }, e3.prototype.createHistogram = function(e4, t2) {
          return K;
        }, e3.prototype.createCounter = function(e4, t2) {
          return G;
        }, e3.prototype.createUpDownCounter = function(e4, t2) {
          return J;
        }, e3.prototype.createObservableGauge = function(e4, t2) {
          return Z;
        }, e3.prototype.createObservableCounter = function(e4, t2) {
          return Y;
        }, e3.prototype.createObservableUpDownCounter = function(e4, t2) {
          return Q;
        }, e3.prototype.addBatchObservableCallback = function(e4, t2) {
        }, e3.prototype.removeBatchObservableCallback = function(e4) {
        }, e3;
      }(), q = function() {
      }, D = function(e3) {
        function t2() {
          return null !== e3 && e3.apply(this, arguments) || this;
        }
        return M(t2, e3), t2.prototype.add = function(e4, t3) {
        }, t2;
      }(q), U = function(e3) {
        function t2() {
          return null !== e3 && e3.apply(this, arguments) || this;
        }
        return M(t2, e3), t2.prototype.add = function(e4, t3) {
        }, t2;
      }(q), B = function(e3) {
        function t2() {
          return null !== e3 && e3.apply(this, arguments) || this;
        }
        return M(t2, e3), t2.prototype.record = function(e4, t3) {
        }, t2;
      }(q), H = function(e3) {
        function t2() {
          return null !== e3 && e3.apply(this, arguments) || this;
        }
        return M(t2, e3), t2.prototype.record = function(e4, t3) {
        }, t2;
      }(q), $ = function() {
        function e3() {
        }
        return e3.prototype.addCallback = function(e4) {
        }, e3.prototype.removeCallback = function(e4) {
        }, e3;
      }(), V = function(e3) {
        function t2() {
          return null !== e3 && e3.apply(this, arguments) || this;
        }
        return M(t2, e3), t2;
      }($), z = function(e3) {
        function t2() {
          return null !== e3 && e3.apply(this, arguments) || this;
        }
        return M(t2, e3), t2;
      }($), F = function(e3) {
        function t2() {
          return null !== e3 && e3.apply(this, arguments) || this;
        }
        return M(t2, e3), t2;
      }($), W = new j(), G = new D(), X = new B(), K = new H(), J = new U(), Y = new V(), Z = new z(), Q = new F();
      function ee() {
        return W;
      }
      !function(e3) {
        e3[e3.INT = 0] = "INT", e3[e3.DOUBLE = 1] = "DOUBLE";
      }(o || (o = {}));
      var et = { get: function(e3, t2) {
        if (null != e3) return e3[t2];
      }, keys: function(e3) {
        return null == e3 ? [] : Object.keys(e3);
      } }, er = { set: function(e3, t2, r2) {
        null != e3 && (e3[t2] = r2);
      } }, en = function(e3, t2) {
        var r2 = "function" == typeof Symbol && e3[Symbol.iterator];
        if (!r2) return e3;
        var n2, o2, i2 = r2.call(e3), a2 = [];
        try {
          for (; (void 0 === t2 || t2-- > 0) && !(n2 = i2.next()).done; ) a2.push(n2.value);
        } catch (e4) {
          o2 = { error: e4 };
        } finally {
          try {
            n2 && !n2.done && (r2 = i2.return) && r2.call(i2);
          } finally {
            if (o2) throw o2.error;
          }
        }
        return a2;
      }, eo = function(e3, t2, r2) {
        if (r2 || 2 == arguments.length) for (var n2, o2 = 0, i2 = t2.length; o2 < i2; o2++) !n2 && o2 in t2 || (n2 || (n2 = Array.prototype.slice.call(t2, 0, o2)), n2[o2] = t2[o2]);
        return e3.concat(n2 || Array.prototype.slice.call(t2));
      }, ei = function() {
        function e3() {
        }
        return e3.prototype.active = function() {
          return A;
        }, e3.prototype.with = function(e4, t2, r2) {
          for (var n2 = [], o2 = 3; o2 < arguments.length; o2++) n2[o2 - 3] = arguments[o2];
          return t2.call.apply(t2, eo([r2], en(n2), false));
        }, e3.prototype.bind = function(e4, t2) {
          return t2;
        }, e3.prototype.enable = function() {
          return this;
        }, e3.prototype.disable = function() {
          return this;
        }, e3;
      }(), ea = function(e3, t2) {
        var r2 = "function" == typeof Symbol && e3[Symbol.iterator];
        if (!r2) return e3;
        var n2, o2, i2 = r2.call(e3), a2 = [];
        try {
          for (; (void 0 === t2 || t2-- > 0) && !(n2 = i2.next()).done; ) a2.push(n2.value);
        } catch (e4) {
          o2 = { error: e4 };
        } finally {
          try {
            n2 && !n2.done && (r2 = i2.return) && r2.call(i2);
          } finally {
            if (o2) throw o2.error;
          }
        }
        return a2;
      }, es = function(e3, t2, r2) {
        if (r2 || 2 == arguments.length) for (var n2, o2 = 0, i2 = t2.length; o2 < i2; o2++) !n2 && o2 in t2 || (n2 || (n2 = Array.prototype.slice.call(t2, 0, o2)), n2[o2] = t2[o2]);
        return e3.concat(n2 || Array.prototype.slice.call(t2));
      }, el = "context", eu = new ei(), ec = function() {
        function e3() {
        }
        return e3.getInstance = function() {
          return this._instance || (this._instance = new e3()), this._instance;
        }, e3.prototype.setGlobalContextManager = function(e4) {
          return f(el, e4, _.instance());
        }, e3.prototype.active = function() {
          return this._getContextManager().active();
        }, e3.prototype.with = function(e4, t2, r2) {
          for (var n2, o2 = [], i2 = 3; i2 < arguments.length; i2++) o2[i2 - 3] = arguments[i2];
          return (n2 = this._getContextManager()).with.apply(n2, es([e4, t2, r2], ea(o2), false));
        }, e3.prototype.bind = function(e4, t2) {
          return this._getContextManager().bind(e4, t2);
        }, e3.prototype._getContextManager = function() {
          return g(el) || eu;
        }, e3.prototype.disable = function() {
          this._getContextManager().disable(), w(el, _.instance());
        }, e3;
      }();
      !function(e3) {
        e3[e3.NONE = 0] = "NONE", e3[e3.SAMPLED = 1] = "SAMPLED";
      }(i || (i = {}));
      var ed = "0000000000000000", ep = "00000000000000000000000000000000", eh = { traceId: ep, spanId: ed, traceFlags: i.NONE }, ef = function() {
        function e3(e4) {
          void 0 === e4 && (e4 = eh), this._spanContext = e4;
        }
        return e3.prototype.spanContext = function() {
          return this._spanContext;
        }, e3.prototype.setAttribute = function(e4, t2) {
          return this;
        }, e3.prototype.setAttributes = function(e4) {
          return this;
        }, e3.prototype.addEvent = function(e4, t2) {
          return this;
        }, e3.prototype.addLink = function(e4) {
          return this;
        }, e3.prototype.addLinks = function(e4) {
          return this;
        }, e3.prototype.setStatus = function(e4) {
          return this;
        }, e3.prototype.updateName = function(e4) {
          return this;
        }, e3.prototype.end = function(e4) {
        }, e3.prototype.isRecording = function() {
          return false;
        }, e3.prototype.recordException = function(e4, t2) {
        }, e3;
      }(), eg = O("OpenTelemetry Context Key SPAN");
      function ew(e3) {
        return e3.getValue(eg) || void 0;
      }
      function em() {
        return ew(ec.getInstance().active());
      }
      function eb(e3, t2) {
        return e3.setValue(eg, t2);
      }
      function ev(e3) {
        return e3.deleteValue(eg);
      }
      function ey(e3, t2) {
        return eb(e3, new ef(t2));
      }
      function ex(e3) {
        var t2;
        return null === (t2 = ew(e3)) || void 0 === t2 ? void 0 : t2.spanContext();
      }
      var eS = /^([0-9a-f]{32})$/i, e_ = /^[0-9a-f]{16}$/i;
      function eR(e3) {
        return eS.test(e3) && e3 !== ep;
      }
      function eC(e3) {
        return e_.test(e3) && e3 !== ed;
      }
      function ek(e3) {
        return eR(e3.traceId) && eC(e3.spanId);
      }
      function eE(e3) {
        return new ef(e3);
      }
      var eN = ec.getInstance(), eT = function() {
        function e3() {
        }
        return e3.prototype.startSpan = function(e4, t2, r2) {
          if (void 0 === r2 && (r2 = eN.active()), null == t2 ? void 0 : t2.root) return new ef();
          var n2 = r2 && ex(r2);
          return "object" == typeof n2 && "string" == typeof n2.spanId && "string" == typeof n2.traceId && "number" == typeof n2.traceFlags && ek(n2) ? new ef(n2) : new ef();
        }, e3.prototype.startActiveSpan = function(e4, t2, r2, n2) {
          if (!(arguments.length < 2)) {
            2 == arguments.length ? a2 = t2 : 3 == arguments.length ? (o2 = t2, a2 = r2) : (o2 = t2, i2 = r2, a2 = n2);
            var o2, i2, a2, s2 = null != i2 ? i2 : eN.active(), l2 = this.startSpan(e4, o2, s2), u2 = eb(s2, l2);
            return eN.with(u2, a2, void 0, l2);
          }
        }, e3;
      }(), eP = new eT(), eO = function() {
        function e3(e4, t2, r2, n2) {
          this._provider = e4, this.name = t2, this.version = r2, this.options = n2;
        }
        return e3.prototype.startSpan = function(e4, t2, r2) {
          return this._getTracer().startSpan(e4, t2, r2);
        }, e3.prototype.startActiveSpan = function(e4, t2, r2, n2) {
          var o2 = this._getTracer();
          return Reflect.apply(o2.startActiveSpan, o2, arguments);
        }, e3.prototype._getTracer = function() {
          if (this._delegate) return this._delegate;
          var e4 = this._provider.getDelegateTracer(this.name, this.version, this.options);
          return e4 ? (this._delegate = e4, this._delegate) : eP;
        }, e3;
      }(), eA = new (function() {
        function e3() {
        }
        return e3.prototype.getTracer = function(e4, t2, r2) {
          return new eT();
        }, e3;
      }())(), eL = function() {
        function e3() {
        }
        return e3.prototype.getTracer = function(e4, t2, r2) {
          var n2;
          return null !== (n2 = this.getDelegateTracer(e4, t2, r2)) && void 0 !== n2 ? n2 : new eO(this, e4, t2, r2);
        }, e3.prototype.getDelegate = function() {
          var e4;
          return null !== (e4 = this._delegate) && void 0 !== e4 ? e4 : eA;
        }, e3.prototype.setDelegate = function(e4) {
          this._delegate = e4;
        }, e3.prototype.getDelegateTracer = function(e4, t2, r2) {
          var n2;
          return null === (n2 = this._delegate) || void 0 === n2 ? void 0 : n2.getTracer(e4, t2, r2);
        }, e3;
      }();
      !function(e3) {
        e3[e3.NOT_RECORD = 0] = "NOT_RECORD", e3[e3.RECORD = 1] = "RECORD", e3[e3.RECORD_AND_SAMPLED = 2] = "RECORD_AND_SAMPLED";
      }(a || (a = {})), function(e3) {
        e3[e3.INTERNAL = 0] = "INTERNAL", e3[e3.SERVER = 1] = "SERVER", e3[e3.CLIENT = 2] = "CLIENT", e3[e3.PRODUCER = 3] = "PRODUCER", e3[e3.CONSUMER = 4] = "CONSUMER";
      }(s || (s = {})), function(e3) {
        e3[e3.UNSET = 0] = "UNSET", e3[e3.OK = 1] = "OK", e3[e3.ERROR = 2] = "ERROR";
      }(l || (l = {}));
      var eI = "[_0-9a-z-*/]", eM = RegExp("^(?:[a-z]" + eI + "{0,255}|" + ("[a-z0-9]" + eI) + "{0,240}@[a-z]" + eI + "{0,13})$"), ej = /^[ -~]{0,255}[!-~]$/, eq = /,|=/, eD = function() {
        function e3(e4) {
          this._internalState = /* @__PURE__ */ new Map(), e4 && this._parse(e4);
        }
        return e3.prototype.set = function(e4, t2) {
          var r2 = this._clone();
          return r2._internalState.has(e4) && r2._internalState.delete(e4), r2._internalState.set(e4, t2), r2;
        }, e3.prototype.unset = function(e4) {
          var t2 = this._clone();
          return t2._internalState.delete(e4), t2;
        }, e3.prototype.get = function(e4) {
          return this._internalState.get(e4);
        }, e3.prototype.serialize = function() {
          var e4 = this;
          return this._keys().reduce(function(t2, r2) {
            return t2.push(r2 + "=" + e4.get(r2)), t2;
          }, []).join(",");
        }, e3.prototype._parse = function(e4) {
          !(e4.length > 512) && (this._internalState = e4.split(",").reverse().reduce(function(e5, t2) {
            var r2 = t2.trim(), n2 = r2.indexOf("=");
            if (-1 !== n2) {
              var o2 = r2.slice(0, n2), i2 = r2.slice(n2 + 1, t2.length);
              eM.test(o2) && ej.test(i2) && !eq.test(i2) && e5.set(o2, i2);
            }
            return e5;
          }, /* @__PURE__ */ new Map()), this._internalState.size > 32 && (this._internalState = new Map(Array.from(this._internalState.entries()).reverse().slice(0, 32))));
        }, e3.prototype._keys = function() {
          return Array.from(this._internalState.keys()).reverse();
        }, e3.prototype._clone = function() {
          var t2 = new e3();
          return t2._internalState = new Map(this._internalState), t2;
        }, e3;
      }();
      function eU(e3) {
        return new eD(e3);
      }
      var eB = ec.getInstance(), eH = _.instance(), e$ = new (function() {
        function e3() {
        }
        return e3.prototype.getMeter = function(e4, t2, r2) {
          return W;
        }, e3;
      }())(), eV = "metrics", ez = function() {
        function e3() {
        }
        return e3.getInstance = function() {
          return this._instance || (this._instance = new e3()), this._instance;
        }, e3.prototype.setGlobalMeterProvider = function(e4) {
          return f(eV, e4, _.instance());
        }, e3.prototype.getMeterProvider = function() {
          return g(eV) || e$;
        }, e3.prototype.getMeter = function(e4, t2, r2) {
          return this.getMeterProvider().getMeter(e4, t2, r2);
        }, e3.prototype.disable = function() {
          w(eV, _.instance());
        }, e3;
      }().getInstance(), eF = function() {
        function e3() {
        }
        return e3.prototype.inject = function(e4, t2) {
        }, e3.prototype.extract = function(e4, t2) {
          return e4;
        }, e3.prototype.fields = function() {
          return [];
        }, e3;
      }(), eW = O("OpenTelemetry Baggage Key");
      function eG(e3) {
        return e3.getValue(eW) || void 0;
      }
      function eX() {
        return eG(ec.getInstance().active());
      }
      function eK(e3, t2) {
        return e3.setValue(eW, t2);
      }
      function eJ(e3) {
        return e3.deleteValue(eW);
      }
      var eY = "propagation", eZ = new eF(), eQ = function() {
        function e3() {
          this.createBaggage = T, this.getBaggage = eG, this.getActiveBaggage = eX, this.setBaggage = eK, this.deleteBaggage = eJ;
        }
        return e3.getInstance = function() {
          return this._instance || (this._instance = new e3()), this._instance;
        }, e3.prototype.setGlobalPropagator = function(e4) {
          return f(eY, e4, _.instance());
        }, e3.prototype.inject = function(e4, t2, r2) {
          return void 0 === r2 && (r2 = er), this._getGlobalPropagator().inject(e4, t2, r2);
        }, e3.prototype.extract = function(e4, t2, r2) {
          return void 0 === r2 && (r2 = et), this._getGlobalPropagator().extract(e4, t2, r2);
        }, e3.prototype.fields = function() {
          return this._getGlobalPropagator().fields();
        }, e3.prototype.disable = function() {
          w(eY, _.instance());
        }, e3.prototype._getGlobalPropagator = function() {
          return g(eY) || eZ;
        }, e3;
      }().getInstance(), e0 = "trace", e1 = function() {
        function e3() {
          this._proxyTracerProvider = new eL(), this.wrapSpanContext = eE, this.isSpanContextValid = ek, this.deleteSpan = ev, this.getSpan = ew, this.getActiveSpan = em, this.getSpanContext = ex, this.setSpan = eb, this.setSpanContext = ey;
        }
        return e3.getInstance = function() {
          return this._instance || (this._instance = new e3()), this._instance;
        }, e3.prototype.setGlobalTracerProvider = function(e4) {
          var t2 = f(e0, this._proxyTracerProvider, _.instance());
          return t2 && this._proxyTracerProvider.setDelegate(e4), t2;
        }, e3.prototype.getTracerProvider = function() {
          return g(e0) || this._proxyTracerProvider;
        }, e3.prototype.getTracer = function(e4, t2) {
          return this.getTracerProvider().getTracer(e4, t2);
        }, e3.prototype.disable = function() {
          w(e0, _.instance()), this._proxyTracerProvider = new eL();
        }, e3;
      }().getInstance();
      let e2 = { context: eB, diag: eH, metrics: ez, propagation: eQ, trace: e1 };
    } }, (e) => {
      var t = e(e.s = 833);
      (_ENTRIES = "undefined" == typeof _ENTRIES ? {} : _ENTRIES)["middleware_src/middleware"] = t;
    }]);
  }
});

// ../../node_modules/@opennextjs/aws/dist/core/edgeFunctionHandler.js
var edgeFunctionHandler_exports = {};
__export(edgeFunctionHandler_exports, {
  default: () => edgeFunctionHandler
});
async function edgeFunctionHandler(request) {
  const path3 = new URL(request.url).pathname;
  const routes = globalThis._ROUTES;
  const correspondingRoute = routes.find((route) => route.regex.some((r) => new RegExp(r).test(path3)));
  if (!correspondingRoute) {
    throw new Error(`No route found for ${request.url}`);
  }
  const entry = await self._ENTRIES[`middleware_${correspondingRoute.name}`];
  const result = await entry.default({
    page: correspondingRoute.page,
    request: {
      ...request,
      page: {
        name: correspondingRoute.name
      }
    }
  });
  globalThis.__openNextAls.getStore()?.pendingPromiseRunner.add(result.waitUntil);
  const response = result.response;
  return response;
}
var init_edgeFunctionHandler = __esm({
  "../../node_modules/@opennextjs/aws/dist/core/edgeFunctionHandler.js"() {
    globalThis._ENTRIES = {};
    globalThis.self = globalThis;
    globalThis._ROUTES = [{ "name": "src/middleware", "page": "/", "regex": ["^(?:\\/(_next\\/data\\/[^/]{1,}))?\\/api(?:\\/((?:[^\\/#\\?]+?)(?:\\/(?:[^\\/#\\?]+?))*))?(.json)?[\\/#\\?]?$"] }];
    require_edge_runtime_webpack();
    require_middleware();
  }
});

// ../../node_modules/@opennextjs/aws/dist/utils/promise.js
init_logger();
var DetachedPromise = class {
  resolve;
  reject;
  promise;
  constructor() {
    let resolve;
    let reject;
    this.promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    this.resolve = resolve;
    this.reject = reject;
  }
};
var DetachedPromiseRunner = class {
  promises = [];
  withResolvers() {
    const detachedPromise = new DetachedPromise();
    this.promises.push(detachedPromise);
    return detachedPromise;
  }
  add(promise) {
    const detachedPromise = new DetachedPromise();
    this.promises.push(detachedPromise);
    promise.then(detachedPromise.resolve, detachedPromise.reject);
  }
  async await() {
    debug(`Awaiting ${this.promises.length} detached promises`);
    const results = await Promise.allSettled(this.promises.map((p) => p.promise));
    const rejectedPromises = results.filter((r) => r.status === "rejected");
    rejectedPromises.forEach((r) => {
      error(r.reason);
    });
  }
};
async function awaitAllDetachedPromise() {
  const store = globalThis.__openNextAls.getStore();
  const promisesToAwait = store?.pendingPromiseRunner.await() ?? Promise.resolve();
  if (store?.waitUntil) {
    store.waitUntil(promisesToAwait);
    return;
  }
  await promisesToAwait;
}
function provideNextAfterProvider() {
  const NEXT_REQUEST_CONTEXT_SYMBOL = Symbol.for("@next/request-context");
  const VERCEL_REQUEST_CONTEXT_SYMBOL = Symbol.for("@vercel/request-context");
  const store = globalThis.__openNextAls.getStore();
  const waitUntil = store?.waitUntil ?? ((promise) => store?.pendingPromiseRunner.add(promise));
  const nextAfterContext = {
    get: () => ({
      waitUntil
    })
  };
  globalThis[NEXT_REQUEST_CONTEXT_SYMBOL] = nextAfterContext;
  if (process.env.EMULATE_VERCEL_REQUEST_CONTEXT) {
    globalThis[VERCEL_REQUEST_CONTEXT_SYMBOL] = nextAfterContext;
  }
}
function runWithOpenNextRequestContext({ isISRRevalidation, waitUntil, requestId = Math.random().toString(36) }, fn) {
  return globalThis.__openNextAls.run({
    requestId,
    pendingPromiseRunner: new DetachedPromiseRunner(),
    isISRRevalidation,
    waitUntil,
    writtenTags: /* @__PURE__ */ new Set()
  }, async () => {
    provideNextAfterProvider();
    let result;
    try {
      result = await fn();
    } finally {
      await awaitAllDetachedPromise();
    }
    return result;
  });
}

// ../../node_modules/@opennextjs/aws/dist/adapters/middleware.js
init_logger();

// ../../node_modules/@opennextjs/aws/dist/core/createGenericHandler.js
init_logger();

// ../../node_modules/@opennextjs/aws/dist/core/resolve.js
async function resolveConverter(converter2) {
  if (typeof converter2 === "function") {
    return converter2();
  }
  const m_1 = await Promise.resolve().then(() => (init_edge(), edge_exports));
  return m_1.default;
}
async function resolveWrapper(wrapper) {
  if (typeof wrapper === "function") {
    return wrapper();
  }
  const m_1 = await Promise.resolve().then(() => (init_cloudflare_edge(), cloudflare_edge_exports));
  return m_1.default;
}
async function resolveOriginResolver(originResolver) {
  if (typeof originResolver === "function") {
    return originResolver();
  }
  const m_1 = await Promise.resolve().then(() => (init_pattern_env(), pattern_env_exports));
  return m_1.default;
}
async function resolveAssetResolver(assetResolver) {
  if (typeof assetResolver === "function") {
    return assetResolver();
  }
  const m_1 = await Promise.resolve().then(() => (init_dummy(), dummy_exports));
  return m_1.default;
}
async function resolveProxyRequest(proxyRequest) {
  if (typeof proxyRequest === "function") {
    return proxyRequest();
  }
  const m_1 = await Promise.resolve().then(() => (init_fetch(), fetch_exports));
  return m_1.default;
}

// ../../node_modules/@opennextjs/aws/dist/core/createGenericHandler.js
async function createGenericHandler(handler3) {
  const config = await import("./open-next.config.mjs").then((m) => m.default);
  globalThis.openNextConfig = config;
  const handlerConfig = config[handler3.type];
  const override = handlerConfig && "override" in handlerConfig ? handlerConfig.override : void 0;
  const converter2 = await resolveConverter(override?.converter);
  const { name, wrapper } = await resolveWrapper(override?.wrapper);
  debug("Using wrapper", name);
  return wrapper(handler3.handler, converter2);
}

// ../../node_modules/@opennextjs/aws/dist/core/routing/util.js
import crypto from "node:crypto";
import { parse as parseQs, stringify as stringifyQs } from "node:querystring";

// ../../node_modules/@opennextjs/aws/dist/adapters/config/index.js
init_logger();
import path from "node:path";
globalThis.__dirname ??= "";
var NEXT_DIR = path.join(__dirname, ".next");
var OPEN_NEXT_DIR = path.join(__dirname, ".open-next");
debug({ NEXT_DIR, OPEN_NEXT_DIR });
var NextConfig = { "env": { "NEXT_PUBLIC_BASE_URL": "http://localhost:3001" }, "eslint": { "ignoreDuringBuilds": true }, "typescript": { "ignoreBuildErrors": true, "tsconfigPath": "tsconfig.json" }, "distDir": ".next", "cleanDistDir": true, "assetPrefix": "", "cacheMaxMemorySize": 52428800, "configOrigin": "next.config.js", "useFileSystemPublicRoutes": true, "generateEtags": true, "pageExtensions": ["tsx", "ts", "jsx", "js"], "poweredByHeader": false, "compress": true, "analyticsId": "", "images": { "deviceSizes": [640, 750, 828, 1080, 1200, 1920, 2048, 3840], "imageSizes": [16, 32, 48, 64, 96, 128, 256, 384], "path": "/_next/image", "loader": "default", "loaderFile": "", "domains": [], "disableStaticImages": false, "minimumCacheTTL": 60, "formats": ["image/webp", "image/avif"], "dangerouslyAllowSVG": false, "contentSecurityPolicy": "script-src 'none'; frame-src 'none'; sandbox;", "contentDispositionType": "inline", "remotePatterns": [{ "protocol": "https", "hostname": "lh3.googleusercontent.com" }, { "protocol": "https", "hostname": "avatars.githubusercontent.com" }, { "protocol": "https", "hostname": "**.pixabay.com" }], "unoptimized": false }, "devIndicators": { "buildActivity": true, "buildActivityPosition": "bottom-right" }, "onDemandEntries": { "maxInactiveAge": 6e4, "pagesBufferLength": 5 }, "amp": { "canonicalBase": "" }, "basePath": "", "sassOptions": {}, "trailingSlash": false, "i18n": null, "productionBrowserSourceMaps": false, "optimizeFonts": true, "excludeDefaultMomentLocales": true, "serverRuntimeConfig": {}, "publicRuntimeConfig": {}, "reactProductionProfiling": false, "reactStrictMode": null, "httpAgentOptions": { "keepAlive": true }, "outputFileTracing": true, "staticPageGenerationTimeout": 60, "swcMinify": true, "output": "standalone", "modularizeImports": { "@mui/icons-material": { "transform": "@mui/icons-material/{{member}}" }, "lodash": { "transform": "lodash/{{member}}" } }, "experimental": { "multiZoneDraftMode": false, "prerenderEarlyExit": false, "serverMinification": true, "serverSourceMaps": false, "linkNoTouchStart": false, "caseSensitiveRoutes": false, "clientRouterFilter": true, "clientRouterFilterRedirects": false, "fetchCacheKeyPrefix": "", "middlewarePrefetch": "flexible", "optimisticClientCache": true, "manualClientBasePath": false, "cpus": 11, "memoryBasedWorkersCount": false, "isrFlushToDisk": true, "workerThreads": false, "optimizeCss": false, "nextScriptWorkers": false, "scrollRestoration": false, "externalDir": false, "disableOptimizedLoading": false, "gzipSize": true, "craCompat": false, "esmExternals": true, "fullySpecified": false, "outputFileTracingRoot": "/home/user9007/main/projects/wokspec/WokTool", "swcTraceProfiling": false, "forceSwcTransforms": false, "largePageDataBytes": 128e3, "adjustFontFallbacks": false, "adjustFontFallbacksWithSizeAdjust": false, "typedRoutes": false, "instrumentationHook": false, "bundlePagesExternals": false, "parallelServerCompiles": false, "parallelServerBuildTraces": false, "ppr": false, "missingSuspenseWithCSRBailout": true, "optimizeServerReact": true, "useEarlyImport": false, "staleTimes": { "dynamic": 30, "static": 300 }, "optimizePackageImports": ["lucide-react", "date-fns", "lodash-es", "ramda", "antd", "react-bootstrap", "ahooks", "@ant-design/icons", "@headlessui/react", "@headlessui-float/react", "@heroicons/react/20/solid", "@heroicons/react/24/solid", "@heroicons/react/24/outline", "@visx/visx", "@tremor/react", "rxjs", "@mui/material", "@mui/icons-material", "recharts", "react-use", "@material-ui/core", "@material-ui/icons", "@tabler/icons-react", "mui-core", "react-icons/ai", "react-icons/bi", "react-icons/bs", "react-icons/cg", "react-icons/ci", "react-icons/di", "react-icons/fa", "react-icons/fa6", "react-icons/fc", "react-icons/fi", "react-icons/gi", "react-icons/go", "react-icons/gr", "react-icons/hi", "react-icons/hi2", "react-icons/im", "react-icons/io", "react-icons/io5", "react-icons/lia", "react-icons/lib", "react-icons/lu", "react-icons/md", "react-icons/pi", "react-icons/ri", "react-icons/rx", "react-icons/si", "react-icons/sl", "react-icons/tb", "react-icons/tfi", "react-icons/ti", "react-icons/vsc", "react-icons/wi"], "trustHostHeader": false, "isExperimentalCompile": false }, "configFileName": "next.config.js", "_originalRedirects": [] };
var BuildId = "HLxmeej9_3tLwBvczG1Av";
var RoutesManifest = { "basePath": "", "rewrites": { "beforeFiles": [], "afterFiles": [], "fallback": [] }, "redirects": [{ "source": "/:path+/", "destination": "/:path+", "internal": true, "statusCode": 308, "regex": "^(?:/((?:[^/]+?)(?:/(?:[^/]+?))*))/$" }], "routes": { "static": [{ "page": "/", "regex": "^/(?:/)?$", "routeKeys": {}, "namedRegex": "^/(?:/)?$" }, { "page": "/_not-found", "regex": "^/_not\\-found(?:/)?$", "routeKeys": {}, "namedRegex": "^/_not\\-found(?:/)?$" }, { "page": "/robots.txt", "regex": "^/robots\\.txt(?:/)?$", "routeKeys": {}, "namedRegex": "^/robots\\.txt(?:/)?$" }, { "page": "/sitemap.xml", "regex": "^/sitemap\\.xml(?:/)?$", "routeKeys": {}, "namedRegex": "^/sitemap\\.xml(?:/)?$" }, { "page": "/tools", "regex": "^/tools(?:/)?$", "routeKeys": {}, "namedRegex": "^/tools(?:/)?$" }, { "page": "/tools/aspect-ratio", "regex": "^/tools/aspect\\-ratio(?:/)?$", "routeKeys": {}, "namedRegex": "^/tools/aspect\\-ratio(?:/)?$" }, { "page": "/tools/asset-manifest", "regex": "^/tools/asset\\-manifest(?:/)?$", "routeKeys": {}, "namedRegex": "^/tools/asset\\-manifest(?:/)?$" }, { "page": "/tools/assets", "regex": "^/tools/assets(?:/)?$", "routeKeys": {}, "namedRegex": "^/tools/assets(?:/)?$" }, { "page": "/tools/audio-tools", "regex": "^/tools/audio\\-tools(?:/)?$", "routeKeys": {}, "namedRegex": "^/tools/audio\\-tools(?:/)?$" }, { "page": "/tools/background-remover", "regex": "^/tools/background\\-remover(?:/)?$", "routeKeys": {}, "namedRegex": "^/tools/background\\-remover(?:/)?$" }, { "page": "/tools/base-converter", "regex": "^/tools/base\\-converter(?:/)?$", "routeKeys": {}, "namedRegex": "^/tools/base\\-converter(?:/)?$" }, { "page": "/tools/border-radius", "regex": "^/tools/border\\-radius(?:/)?$", "routeKeys": {}, "namedRegex": "^/tools/border\\-radius(?:/)?$" }, { "page": "/tools/changelog-writer", "regex": "^/tools/changelog\\-writer(?:/)?$", "routeKeys": {}, "namedRegex": "^/tools/changelog\\-writer(?:/)?$" }, { "page": "/tools/color-converter", "regex": "^/tools/color\\-converter(?:/)?$", "routeKeys": {}, "namedRegex": "^/tools/color\\-converter(?:/)?$" }, { "page": "/tools/color-extractor", "regex": "^/tools/color\\-extractor(?:/)?$", "routeKeys": {}, "namedRegex": "^/tools/color\\-extractor(?:/)?$" }, { "page": "/tools/color-palette", "regex": "^/tools/color\\-palette(?:/)?$", "routeKeys": {}, "namedRegex": "^/tools/color\\-palette(?:/)?$" }, { "page": "/tools/color-tools", "regex": "^/tools/color\\-tools(?:/)?$", "routeKeys": {}, "namedRegex": "^/tools/color\\-tools(?:/)?$" }, { "page": "/tools/cron-builder", "regex": "^/tools/cron\\-builder(?:/)?$", "routeKeys": {}, "namedRegex": "^/tools/cron\\-builder(?:/)?$" }, { "page": "/tools/crypto-tools", "regex": "^/tools/crypto\\-tools(?:/)?$", "routeKeys": {}, "namedRegex": "^/tools/crypto\\-tools(?:/)?$" }, { "page": "/tools/css-generator", "regex": "^/tools/css\\-generator(?:/)?$", "routeKeys": {}, "namedRegex": "^/tools/css\\-generator(?:/)?$" }, { "page": "/tools/csv-tools", "regex": "^/tools/csv\\-tools(?:/)?$", "routeKeys": {}, "namedRegex": "^/tools/csv\\-tools(?:/)?$" }, { "page": "/tools/diff", "regex": "^/tools/diff(?:/)?$", "routeKeys": {}, "namedRegex": "^/tools/diff(?:/)?$" }, { "page": "/tools/encode-decode", "regex": "^/tools/encode\\-decode(?:/)?$", "routeKeys": {}, "namedRegex": "^/tools/encode\\-decode(?:/)?$" }, { "page": "/tools/exa-search", "regex": "^/tools/exa\\-search(?:/)?$", "routeKeys": {}, "namedRegex": "^/tools/exa\\-search(?:/)?$" }, { "page": "/tools/favicon", "regex": "^/tools/favicon(?:/)?$", "routeKeys": {}, "namedRegex": "^/tools/favicon(?:/)?$" }, { "page": "/tools/favicon-extractor", "regex": "^/tools/favicon\\-extractor(?:/)?$", "routeKeys": {}, "namedRegex": "^/tools/favicon\\-extractor(?:/)?$" }, { "page": "/tools/font-pairer", "regex": "^/tools/font\\-pairer(?:/)?$", "routeKeys": {}, "namedRegex": "^/tools/font\\-pairer(?:/)?$" }, { "page": "/tools/font-weight", "regex": "^/tools/font\\-weight(?:/)?$", "routeKeys": {}, "namedRegex": "^/tools/font\\-weight(?:/)?$" }, { "page": "/tools/generators", "regex": "^/tools/generators(?:/)?$", "routeKeys": {}, "namedRegex": "^/tools/generators(?:/)?$" }, { "page": "/tools/gradient-animator", "regex": "^/tools/gradient\\-animator(?:/)?$", "routeKeys": {}, "namedRegex": "^/tools/gradient\\-animator(?:/)?$" }, { "page": "/tools/gradient-generator", "regex": "^/tools/gradient\\-generator(?:/)?$", "routeKeys": {}, "namedRegex": "^/tools/gradient\\-generator(?:/)?$" }, { "page": "/tools/hash", "regex": "^/tools/hash(?:/)?$", "routeKeys": {}, "namedRegex": "^/tools/hash(?:/)?$" }, { "page": "/tools/http-status", "regex": "^/tools/http\\-status(?:/)?$", "routeKeys": {}, "namedRegex": "^/tools/http\\-status(?:/)?$" }, { "page": "/tools/icon-search", "regex": "^/tools/icon\\-search(?:/)?$", "routeKeys": {}, "namedRegex": "^/tools/icon\\-search(?:/)?$" }, { "page": "/tools/ideogram", "regex": "^/tools/ideogram(?:/)?$", "routeKeys": {}, "namedRegex": "^/tools/ideogram(?:/)?$" }, { "page": "/tools/image-compress", "regex": "^/tools/image\\-compress(?:/)?$", "routeKeys": {}, "namedRegex": "^/tools/image\\-compress(?:/)?$" }, { "page": "/tools/image-converter", "regex": "^/tools/image\\-converter(?:/)?$", "routeKeys": {}, "namedRegex": "^/tools/image\\-converter(?:/)?$" }, { "page": "/tools/image-diff", "regex": "^/tools/image\\-diff(?:/)?$", "routeKeys": {}, "namedRegex": "^/tools/image\\-diff(?:/)?$" }, { "page": "/tools/image-resize", "regex": "^/tools/image\\-resize(?:/)?$", "routeKeys": {}, "namedRegex": "^/tools/image\\-resize(?:/)?$" }, { "page": "/tools/interrogate", "regex": "^/tools/interrogate(?:/)?$", "routeKeys": {}, "namedRegex": "^/tools/interrogate(?:/)?$" }, { "page": "/tools/invoice", "regex": "^/tools/invoice(?:/)?$", "routeKeys": {}, "namedRegex": "^/tools/invoice(?:/)?$" }, { "page": "/tools/json-to-types", "regex": "^/tools/json\\-to\\-types(?:/)?$", "routeKeys": {}, "namedRegex": "^/tools/json\\-to\\-types(?:/)?$" }, { "page": "/tools/json-tools", "regex": "^/tools/json\\-tools(?:/)?$", "routeKeys": {}, "namedRegex": "^/tools/json\\-tools(?:/)?$" }, { "page": "/tools/jwt-debugger", "regex": "^/tools/jwt\\-debugger(?:/)?$", "routeKeys": {}, "namedRegex": "^/tools/jwt\\-debugger(?:/)?$" }, { "page": "/tools/link-checker", "regex": "^/tools/link\\-checker(?:/)?$", "routeKeys": {}, "namedRegex": "^/tools/link\\-checker(?:/)?$" }, { "page": "/tools/link-scraper", "regex": "^/tools/link\\-scraper(?:/)?$", "routeKeys": {}, "namedRegex": "^/tools/link\\-scraper(?:/)?$" }, { "page": "/tools/markdown", "regex": "^/tools/markdown(?:/)?$", "routeKeys": {}, "namedRegex": "^/tools/markdown(?:/)?$" }, { "page": "/tools/markdown-preview", "regex": "^/tools/markdown\\-preview(?:/)?$", "routeKeys": {}, "namedRegex": "^/tools/markdown\\-preview(?:/)?$" }, { "page": "/tools/md-to-html", "regex": "^/tools/md\\-to\\-html(?:/)?$", "routeKeys": {}, "namedRegex": "^/tools/md\\-to\\-html(?:/)?$" }, { "page": "/tools/media-downloader", "regex": "^/tools/media\\-downloader(?:/)?$", "routeKeys": {}, "namedRegex": "^/tools/media\\-downloader(?:/)?$" }, { "page": "/tools/mockup", "regex": "^/tools/mockup(?:/)?$", "routeKeys": {}, "namedRegex": "^/tools/mockup(?:/)?$" }, { "page": "/tools/music", "regex": "^/tools/music(?:/)?$", "routeKeys": {}, "namedRegex": "^/tools/music(?:/)?$" }, { "page": "/tools/og-analyzer", "regex": "^/tools/og\\-analyzer(?:/)?$", "routeKeys": {}, "namedRegex": "^/tools/og\\-analyzer(?:/)?$" }, { "page": "/tools/og-preview", "regex": "^/tools/og\\-preview(?:/)?$", "routeKeys": {}, "namedRegex": "^/tools/og\\-preview(?:/)?$" }, { "page": "/tools/palette", "regex": "^/tools/palette(?:/)?$", "routeKeys": {}, "namedRegex": "^/tools/palette(?:/)?$" }, { "page": "/tools/password-generator", "regex": "^/tools/password\\-generator(?:/)?$", "routeKeys": {}, "namedRegex": "^/tools/password\\-generator(?:/)?$" }, { "page": "/tools/pdf", "regex": "^/tools/pdf(?:/)?$", "routeKeys": {}, "namedRegex": "^/tools/pdf(?:/)?$" }, { "page": "/tools/pixel-editor", "regex": "^/tools/pixel\\-editor(?:/)?$", "routeKeys": {}, "namedRegex": "^/tools/pixel\\-editor(?:/)?$" }, { "page": "/tools/privacy-policy", "regex": "^/tools/privacy\\-policy(?:/)?$", "routeKeys": {}, "namedRegex": "^/tools/privacy\\-policy(?:/)?$" }, { "page": "/tools/readme-generator", "regex": "^/tools/readme\\-generator(?:/)?$", "routeKeys": {}, "namedRegex": "^/tools/readme\\-generator(?:/)?$" }, { "page": "/tools/recraft", "regex": "^/tools/recraft(?:/)?$", "routeKeys": {}, "namedRegex": "^/tools/recraft(?:/)?$" }, { "page": "/tools/regex", "regex": "^/tools/regex(?:/)?$", "routeKeys": {}, "namedRegex": "^/tools/regex(?:/)?$" }, { "page": "/tools/regex-tester", "regex": "^/tools/regex\\-tester(?:/)?$", "routeKeys": {}, "namedRegex": "^/tools/regex\\-tester(?:/)?$" }, { "page": "/tools/sfx", "regex": "^/tools/sfx(?:/)?$", "routeKeys": {}, "namedRegex": "^/tools/sfx(?:/)?$" }, { "page": "/tools/shadow", "regex": "^/tools/shadow(?:/)?$", "routeKeys": {}, "namedRegex": "^/tools/shadow(?:/)?$" }, { "page": "/tools/skybox", "regex": "^/tools/skybox(?:/)?$", "routeKeys": {}, "namedRegex": "^/tools/skybox(?:/)?$" }, { "page": "/tools/snippets", "regex": "^/tools/snippets(?:/)?$", "routeKeys": {}, "namedRegex": "^/tools/snippets(?:/)?$" }, { "page": "/tools/social-resize", "regex": "^/tools/social\\-resize(?:/)?$", "routeKeys": {}, "namedRegex": "^/tools/social\\-resize(?:/)?$" }, { "page": "/tools/sprite-packer", "regex": "^/tools/sprite\\-packer(?:/)?$", "routeKeys": {}, "namedRegex": "^/tools/sprite\\-packer(?:/)?$" }, { "page": "/tools/sql-formatter", "regex": "^/tools/sql\\-formatter(?:/)?$", "routeKeys": {}, "namedRegex": "^/tools/sql\\-formatter(?:/)?$" }, { "page": "/tools/tech-badges", "regex": "^/tools/tech\\-badges(?:/)?$", "routeKeys": {}, "namedRegex": "^/tools/tech\\-badges(?:/)?$" }, { "page": "/tools/text-to-3d", "regex": "^/tools/text\\-to\\-3d(?:/)?$", "routeKeys": {}, "namedRegex": "^/tools/text\\-to\\-3d(?:/)?$" }, { "page": "/tools/text-tools", "regex": "^/tools/text\\-tools(?:/)?$", "routeKeys": {}, "namedRegex": "^/tools/text\\-tools(?:/)?$" }, { "page": "/tools/tilemap", "regex": "^/tools/tilemap(?:/)?$", "routeKeys": {}, "namedRegex": "^/tools/tilemap(?:/)?$" }, { "page": "/tools/timestamp", "regex": "^/tools/timestamp(?:/)?$", "routeKeys": {}, "namedRegex": "^/tools/timestamp(?:/)?$" }, { "page": "/tools/transcribe", "regex": "^/tools/transcribe(?:/)?$", "routeKeys": {}, "namedRegex": "^/tools/transcribe(?:/)?$" }, { "page": "/tools/type-scale", "regex": "^/tools/type\\-scale(?:/)?$", "routeKeys": {}, "namedRegex": "^/tools/type\\-scale(?:/)?$" }, { "page": "/tools/upscale", "regex": "^/tools/upscale(?:/)?$", "routeKeys": {}, "namedRegex": "^/tools/upscale(?:/)?$" }, { "page": "/tools/uuid", "regex": "^/tools/uuid(?:/)?$", "routeKeys": {}, "namedRegex": "^/tools/uuid(?:/)?$" }, { "page": "/tools/vectorize", "regex": "^/tools/vectorize(?:/)?$", "routeKeys": {}, "namedRegex": "^/tools/vectorize(?:/)?$" }, { "page": "/tools/website-palette", "regex": "^/tools/website\\-palette(?:/)?$", "routeKeys": {}, "namedRegex": "^/tools/website\\-palette(?:/)?$" }, { "page": "/tools/whiteboard", "regex": "^/tools/whiteboard(?:/)?$", "routeKeys": {}, "namedRegex": "^/tools/whiteboard(?:/)?$" }, { "page": "/tools/word-counter", "regex": "^/tools/word\\-counter(?:/)?$", "routeKeys": {}, "namedRegex": "^/tools/word\\-counter(?:/)?$" }], "dynamic": [], "data": { "static": [], "dynamic": [] } }, "locales": [] };
var ConfigHeaders = [{ "source": "/(.*)", "headers": [{ "key": "Content-Security-Policy", "value": "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; img-src 'self' data: blob: https:; media-src 'self' data: blob:; worker-src 'self' blob:; connect-src 'self' https: blob:; frame-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests" }, { "key": "X-Frame-Options", "value": "DENY" }, { "key": "X-Content-Type-Options", "value": "nosniff" }, { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }, { "key": "X-DNS-Prefetch-Control", "value": "on" }, { "key": "Permissions-Policy", "value": "camera=(), microphone=(self), geolocation=(), interest-cohort=()" }, { "key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains; preload" }], "regex": "^(?:/(.*))(?:/)?$" }];
var PrerenderManifest = { "version": 4, "routes": { "/sitemap.xml": { "initialHeaders": { "cache-control": "public, max-age=0, must-revalidate", "content-type": "application/xml", "x-next-cache-tags": "_N_T_/layout,_N_T_/sitemap.xml/layout,_N_T_/sitemap.xml/route,_N_T_/sitemap.xml" }, "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/sitemap.xml", "dataRoute": null }, "/tools/aspect-ratio": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/tools/aspect-ratio", "dataRoute": "/tools/aspect-ratio.rsc" }, "/tools/assets": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/tools/assets", "dataRoute": "/tools/assets.rsc" }, "/tools/background-remover": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/tools/background-remover", "dataRoute": "/tools/background-remover.rsc" }, "/tools/audio-tools": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/tools/audio-tools", "dataRoute": "/tools/audio-tools.rsc" }, "/robots.txt": { "initialHeaders": { "cache-control": "public, max-age=0, must-revalidate", "content-type": "text/plain", "x-next-cache-tags": "_N_T_/layout,_N_T_/robots.txt/layout,_N_T_/robots.txt/route,_N_T_/robots.txt" }, "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/robots.txt", "dataRoute": null }, "/tools/changelog-writer": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/tools/changelog-writer", "dataRoute": "/tools/changelog-writer.rsc" }, "/tools/asset-manifest": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/tools/asset-manifest", "dataRoute": "/tools/asset-manifest.rsc" }, "/tools/color-converter": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/tools/color-converter", "dataRoute": "/tools/color-converter.rsc" }, "/tools/base-converter": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/tools/base-converter", "dataRoute": "/tools/base-converter.rsc" }, "/tools/border-radius": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/tools/border-radius", "dataRoute": "/tools/border-radius.rsc" }, "/tools/color-tools": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/tools/color-tools", "dataRoute": "/tools/color-tools.rsc" }, "/tools/cron-builder": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/tools/cron-builder", "dataRoute": "/tools/cron-builder.rsc" }, "/tools/color-palette": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/tools/color-palette", "dataRoute": "/tools/color-palette.rsc" }, "/tools/diff": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/tools/diff", "dataRoute": "/tools/diff.rsc" }, "/tools/csv-tools": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/tools/csv-tools", "dataRoute": "/tools/csv-tools.rsc" }, "/tools/color-extractor": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/tools/color-extractor", "dataRoute": "/tools/color-extractor.rsc" }, "/tools/favicon-extractor": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/tools/favicon-extractor", "dataRoute": "/tools/favicon-extractor.rsc" }, "/tools/exa-search": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/tools/exa-search", "dataRoute": "/tools/exa-search.rsc" }, "/tools/css-generator": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/tools/css-generator", "dataRoute": "/tools/css-generator.rsc" }, "/tools/font-pairer": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/tools/font-pairer", "dataRoute": "/tools/font-pairer.rsc" }, "/tools/font-weight": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/tools/font-weight", "dataRoute": "/tools/font-weight.rsc" }, "/tools/encode-decode": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/tools/encode-decode", "dataRoute": "/tools/encode-decode.rsc" }, "/tools/favicon": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/tools/favicon", "dataRoute": "/tools/favicon.rsc" }, "/tools/generators": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/tools/generators", "dataRoute": "/tools/generators.rsc" }, "/": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/", "dataRoute": "/index.rsc" }, "/tools/http-status": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/tools/http-status", "dataRoute": "/tools/http-status.rsc" }, "/tools/gradient-generator": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/tools/gradient-generator", "dataRoute": "/tools/gradient-generator.rsc" }, "/tools/crypto-tools": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/tools/crypto-tools", "dataRoute": "/tools/crypto-tools.rsc" }, "/tools/gradient-animator": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/tools/gradient-animator", "dataRoute": "/tools/gradient-animator.rsc" }, "/tools/ideogram": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/tools/ideogram", "dataRoute": "/tools/ideogram.rsc" }, "/tools/image-diff": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/tools/image-diff", "dataRoute": "/tools/image-diff.rsc" }, "/tools/image-converter": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/tools/image-converter", "dataRoute": "/tools/image-converter.rsc" }, "/tools/interrogate": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/tools/interrogate", "dataRoute": "/tools/interrogate.rsc" }, "/tools/image-resize": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/tools/image-resize", "dataRoute": "/tools/image-resize.rsc" }, "/tools/icon-search": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/tools/icon-search", "dataRoute": "/tools/icon-search.rsc" }, "/tools/invoice": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/tools/invoice", "dataRoute": "/tools/invoice.rsc" }, "/tools/image-compress": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/tools/image-compress", "dataRoute": "/tools/image-compress.rsc" }, "/tools/json-to-types": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/tools/json-to-types", "dataRoute": "/tools/json-to-types.rsc" }, "/tools/link-checker": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/tools/link-checker", "dataRoute": "/tools/link-checker.rsc" }, "/tools/hash": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/tools/hash", "dataRoute": "/tools/hash.rsc" }, "/tools/jwt-debugger": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/tools/jwt-debugger", "dataRoute": "/tools/jwt-debugger.rsc" }, "/tools/markdown-preview": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/tools/markdown-preview", "dataRoute": "/tools/markdown-preview.rsc" }, "/tools/json-tools": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/tools/json-tools", "dataRoute": "/tools/json-tools.rsc" }, "/tools/music": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/tools/music", "dataRoute": "/tools/music.rsc" }, "/tools/markdown": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/tools/markdown", "dataRoute": "/tools/markdown.rsc" }, "/tools/password-generator": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/tools/password-generator", "dataRoute": "/tools/password-generator.rsc" }, "/tools/link-scraper": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/tools/link-scraper", "dataRoute": "/tools/link-scraper.rsc" }, "/tools": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/tools", "dataRoute": "/tools.rsc" }, "/tools/md-to-html": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/tools/md-to-html", "dataRoute": "/tools/md-to-html.rsc" }, "/tools/og-preview": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/tools/og-preview", "dataRoute": "/tools/og-preview.rsc" }, "/tools/og-analyzer": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/tools/og-analyzer", "dataRoute": "/tools/og-analyzer.rsc" }, "/tools/media-downloader": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/tools/media-downloader", "dataRoute": "/tools/media-downloader.rsc" }, "/tools/palette": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/tools/palette", "dataRoute": "/tools/palette.rsc" }, "/tools/regex-tester": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/tools/regex-tester", "dataRoute": "/tools/regex-tester.rsc" }, "/tools/mockup": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/tools/mockup", "dataRoute": "/tools/mockup.rsc" }, "/tools/regex": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/tools/regex", "dataRoute": "/tools/regex.rsc" }, "/tools/recraft": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/tools/recraft", "dataRoute": "/tools/recraft.rsc" }, "/tools/readme-generator": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/tools/readme-generator", "dataRoute": "/tools/readme-generator.rsc" }, "/tools/privacy-policy": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/tools/privacy-policy", "dataRoute": "/tools/privacy-policy.rsc" }, "/tools/shadow": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/tools/shadow", "dataRoute": "/tools/shadow.rsc" }, "/tools/sql-formatter": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/tools/sql-formatter", "dataRoute": "/tools/sql-formatter.rsc" }, "/tools/snippets": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/tools/snippets", "dataRoute": "/tools/snippets.rsc" }, "/tools/sprite-packer": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/tools/sprite-packer", "dataRoute": "/tools/sprite-packer.rsc" }, "/tools/pixel-editor": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/tools/pixel-editor", "dataRoute": "/tools/pixel-editor.rsc" }, "/tools/skybox": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/tools/skybox", "dataRoute": "/tools/skybox.rsc" }, "/tools/text-tools": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/tools/text-tools", "dataRoute": "/tools/text-tools.rsc" }, "/tools/sfx": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/tools/sfx", "dataRoute": "/tools/sfx.rsc" }, "/tools/timestamp": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/tools/timestamp", "dataRoute": "/tools/timestamp.rsc" }, "/tools/social-resize": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/tools/social-resize", "dataRoute": "/tools/social-resize.rsc" }, "/tools/text-to-3d": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/tools/text-to-3d", "dataRoute": "/tools/text-to-3d.rsc" }, "/tools/tilemap": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/tools/tilemap", "dataRoute": "/tools/tilemap.rsc" }, "/tools/transcribe": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/tools/transcribe", "dataRoute": "/tools/transcribe.rsc" }, "/tools/pdf": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/tools/pdf", "dataRoute": "/tools/pdf.rsc" }, "/tools/tech-badges": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/tools/tech-badges", "dataRoute": "/tools/tech-badges.rsc" }, "/tools/uuid": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/tools/uuid", "dataRoute": "/tools/uuid.rsc" }, "/tools/vectorize": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/tools/vectorize", "dataRoute": "/tools/vectorize.rsc" }, "/tools/type-scale": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/tools/type-scale", "dataRoute": "/tools/type-scale.rsc" }, "/tools/upscale": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/tools/upscale", "dataRoute": "/tools/upscale.rsc" }, "/tools/whiteboard": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/tools/whiteboard", "dataRoute": "/tools/whiteboard.rsc" }, "/tools/word-counter": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/tools/word-counter", "dataRoute": "/tools/word-counter.rsc" }, "/tools/website-palette": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/tools/website-palette", "dataRoute": "/tools/website-palette.rsc" } }, "dynamicRoutes": {}, "notFoundRoutes": [], "preview": { "previewModeId": "144fdb86baad644d50d4454acb447471", "previewModeSigningKey": "eff4642e8ab1cbd3641b6edc2b5b916148be2b7a3109a8faa4e4475ab892bbfb", "previewModeEncryptionKey": "fc3c2beae8dacf9b864a2f179b39c23a3af77120a13c12ac6bd2bd9e1fd39dde" } };
var MiddlewareManifest = { "version": 3, "middleware": { "/": { "files": ["server/edge-runtime-webpack.js", "server/src/middleware.js"], "name": "src/middleware", "page": "/", "matchers": [{ "regexp": "^(?:\\/(_next\\/data\\/[^/]{1,}))?\\/api(?:\\/((?:[^\\/#\\?]+?)(?:\\/(?:[^\\/#\\?]+?))*))?(.json)?[\\/#\\?]?$", "originalSource": "/api/:path*" }], "wasm": [], "assets": [], "env": { "__NEXT_BUILD_ID": "HLxmeej9_3tLwBvczG1Av", "NEXT_SERVER_ACTIONS_ENCRYPTION_KEY": "zp3CNUIUU2fw3N9K89ry5UXtn4sHO+ZasAHOVkklbDo=", "__NEXT_PREVIEW_MODE_ID": "144fdb86baad644d50d4454acb447471", "__NEXT_PREVIEW_MODE_ENCRYPTION_KEY": "fc3c2beae8dacf9b864a2f179b39c23a3af77120a13c12ac6bd2bd9e1fd39dde", "__NEXT_PREVIEW_MODE_SIGNING_KEY": "eff4642e8ab1cbd3641b6edc2b5b916148be2b7a3109a8faa4e4475ab892bbfb" } } }, "functions": {}, "sortedMiddleware": ["/"] };
var AppPathRoutesManifest = { "/_not-found/page": "/_not-found", "/api/tools/media-downloader/route": "/api/tools/media-downloader", "/robots.txt/route": "/robots.txt", "/sitemap.xml/route": "/sitemap.xml", "/api/tools/exa-search/route": "/api/tools/exa-search", "/api/tools/favicon-extractor/route": "/api/tools/favicon-extractor", "/api/tools/vectorize/route": "/api/tools/vectorize", "/page": "/", "/api/tools/link-scraper/route": "/api/tools/link-scraper", "/api/tools/og-analyzer/route": "/api/tools/og-analyzer", "/api/tools/website-palette/route": "/api/tools/website-palette", "/tools/asset-manifest/page": "/tools/asset-manifest", "/tools/regex-tester/page": "/tools/regex-tester", "/tools/exa-search/page": "/tools/exa-search", "/tools/transcribe/page": "/tools/transcribe", "/tools/recraft/page": "/tools/recraft", "/tools/text-to-3d/page": "/tools/text-to-3d", "/tools/aspect-ratio/page": "/tools/aspect-ratio", "/tools/background-remover/page": "/tools/background-remover", "/tools/skybox/page": "/tools/skybox", "/tools/assets/page": "/tools/assets", "/tools/audio-tools/page": "/tools/audio-tools", "/tools/changelog-writer/page": "/tools/changelog-writer", "/tools/color-extractor/page": "/tools/color-extractor", "/tools/color-converter/page": "/tools/color-converter", "/tools/color-palette/page": "/tools/color-palette", "/tools/base-converter/page": "/tools/base-converter", "/tools/border-radius/page": "/tools/border-radius", "/tools/cron-builder/page": "/tools/cron-builder", "/tools/color-tools/page": "/tools/color-tools", "/tools/crypto-tools/page": "/tools/crypto-tools", "/tools/css-generator/page": "/tools/css-generator", "/tools/encode-decode/page": "/tools/encode-decode", "/tools/csv-tools/page": "/tools/csv-tools", "/tools/diff/page": "/tools/diff", "/tools/favicon-extractor/page": "/tools/favicon-extractor", "/tools/favicon/page": "/tools/favicon", "/tools/markdown-preview/page": "/tools/markdown-preview", "/tools/font-weight/page": "/tools/font-weight", "/tools/font-pairer/page": "/tools/font-pairer", "/tools/generators/page": "/tools/generators", "/tools/ideogram/page": "/tools/ideogram", "/tools/gradient-generator/page": "/tools/gradient-generator", "/tools/hash/page": "/tools/hash", "/tools/gradient-animator/page": "/tools/gradient-animator", "/tools/http-status/page": "/tools/http-status", "/tools/icon-search/page": "/tools/icon-search", "/tools/image-converter/page": "/tools/image-converter", "/tools/image-resize/page": "/tools/image-resize", "/tools/image-diff/page": "/tools/image-diff", "/tools/image-compress/page": "/tools/image-compress", "/tools/json-to-types/page": "/tools/json-to-types", "/tools/json-tools/page": "/tools/json-tools", "/tools/jwt-debugger/page": "/tools/jwt-debugger", "/tools/link-checker/page": "/tools/link-checker", "/tools/invoice/page": "/tools/invoice", "/tools/link-scraper/page": "/tools/link-scraper", "/tools/markdown/page": "/tools/markdown", "/tools/md-to-html/page": "/tools/md-to-html", "/tools/mockup/page": "/tools/mockup", "/tools/music/page": "/tools/music", "/tools/media-downloader/page": "/tools/media-downloader", "/tools/page": "/tools", "/tools/palette/page": "/tools/palette", "/tools/og-preview/page": "/tools/og-preview", "/tools/og-analyzer/page": "/tools/og-analyzer", "/tools/pixel-editor/page": "/tools/pixel-editor", "/tools/pdf/page": "/tools/pdf", "/tools/privacy-policy/page": "/tools/privacy-policy", "/tools/password-generator/page": "/tools/password-generator", "/tools/readme-generator/page": "/tools/readme-generator", "/tools/regex/page": "/tools/regex", "/tools/sfx/page": "/tools/sfx", "/tools/shadow/page": "/tools/shadow", "/tools/social-resize/page": "/tools/social-resize", "/tools/snippets/page": "/tools/snippets", "/tools/sql-formatter/page": "/tools/sql-formatter", "/tools/sprite-packer/page": "/tools/sprite-packer", "/tools/tilemap/page": "/tools/tilemap", "/tools/timestamp/page": "/tools/timestamp", "/tools/type-scale/page": "/tools/type-scale", "/tools/upscale/page": "/tools/upscale", "/tools/uuid/page": "/tools/uuid", "/tools/vectorize/page": "/tools/vectorize", "/tools/website-palette/page": "/tools/website-palette", "/tools/whiteboard/page": "/tools/whiteboard", "/tools/interrogate/page": "/tools/interrogate", "/tools/text-tools/page": "/tools/text-tools", "/tools/tech-badges/page": "/tools/tech-badges", "/tools/word-counter/page": "/tools/word-counter" };
var FunctionsConfigManifest = { "version": 1, "functions": { "/api/tools/exa-search": {}, "/api/tools/favicon-extractor": {}, "/api/tools/link-scraper": {}, "/api/tools/og-analyzer": {}, "/api/tools/vectorize": { "maxDuration": 60 }, "/api/tools/website-palette": {}, "/": {}, "/tools/aspect-ratio": {}, "/tools/assets": {}, "/tools/audio-tools": {}, "/tools/background-remover": {}, "/tools/base-converter": {}, "/tools/border-radius": {}, "/tools/changelog-writer": {}, "/tools/color-converter": {}, "/tools/color-extractor": {}, "/tools/color-palette": {}, "/tools/color-tools": {}, "/tools/cron-builder": {}, "/tools/crypto-tools": {}, "/tools/css-generator": {}, "/tools/csv-tools": {}, "/tools/diff": {}, "/tools/encode-decode": {}, "/tools/favicon-extractor": {}, "/tools/favicon": {}, "/tools/font-pairer": {}, "/tools/font-weight": {}, "/tools/generators": {}, "/tools/gradient-animator": {}, "/tools/gradient-generator": {}, "/tools/hash": {}, "/tools/http-status": {}, "/tools/icon-search": {}, "/tools/image-compress": {}, "/tools/image-converter": {}, "/tools/image-diff": {}, "/tools/image-resize": {}, "/tools/interrogate": {}, "/tools/invoice": {}, "/tools/json-to-types": {}, "/tools/json-tools": {}, "/tools/jwt-debugger": {}, "/tools/link-checker": {}, "/tools/link-scraper": {}, "/tools/markdown": {}, "/tools/md-to-html": {}, "/tools/media-downloader": {}, "/tools/mockup": {}, "/tools/music": {}, "/tools/og-analyzer": {}, "/tools/og-preview": {}, "/tools": {}, "/tools/palette": {}, "/tools/password-generator": {}, "/tools/pdf": {}, "/tools/pixel-editor": {}, "/tools/privacy-policy": {}, "/tools/readme-generator": {}, "/tools/regex": {}, "/tools/sfx": {}, "/tools/shadow": {}, "/tools/snippets": {}, "/tools/social-resize": {}, "/tools/sprite-packer": {}, "/tools/sql-formatter": {}, "/tools/tech-badges": {}, "/tools/text-tools": {}, "/tools/tilemap": {}, "/tools/timestamp": {}, "/tools/type-scale": {}, "/tools/uuid": {}, "/tools/vectorize": {}, "/tools/website-palette": {}, "/tools/whiteboard": {}, "/tools/upscale": {}, "/tools/word-counter": {} } };
var PagesManifest = { "/_app": "pages/_app.js", "/_error": "pages/_error.js", "/_document": "pages/_document.js", "/404": "pages/404.html" };
process.env.NEXT_BUILD_ID = BuildId;
process.env.NEXT_PREVIEW_MODE_ID = PrerenderManifest?.preview?.previewModeId;

// ../../node_modules/@opennextjs/aws/dist/http/openNextResponse.js
init_logger();
init_util();
import { Transform } from "node:stream";

// ../../node_modules/@opennextjs/aws/dist/core/routing/util.js
init_util();
init_logger();
import { ReadableStream as ReadableStream2 } from "node:stream/web";

// ../../node_modules/@opennextjs/aws/dist/utils/binary.js
var commonBinaryMimeTypes = /* @__PURE__ */ new Set([
  "application/octet-stream",
  // Docs
  "application/epub+zip",
  "application/msword",
  "application/pdf",
  "application/rtf",
  "application/vnd.amazon.ebook",
  "application/vnd.ms-excel",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  // Fonts
  "font/otf",
  "font/woff",
  "font/woff2",
  // Images
  "image/bmp",
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/tiff",
  "image/vnd.microsoft.icon",
  "image/webp",
  // Audio
  "audio/3gpp",
  "audio/aac",
  "audio/basic",
  "audio/flac",
  "audio/mpeg",
  "audio/ogg",
  "audio/wavaudio/webm",
  "audio/x-aiff",
  "audio/x-midi",
  "audio/x-wav",
  // Video
  "video/3gpp",
  "video/mp2t",
  "video/mpeg",
  "video/ogg",
  "video/quicktime",
  "video/webm",
  "video/x-msvideo",
  // Archives
  "application/java-archive",
  "application/vnd.apple.installer+xml",
  "application/x-7z-compressed",
  "application/x-apple-diskimage",
  "application/x-bzip",
  "application/x-bzip2",
  "application/x-gzip",
  "application/x-java-archive",
  "application/x-rar-compressed",
  "application/x-tar",
  "application/x-zip",
  "application/zip",
  // Serialized data
  "application/x-protobuf"
]);
function isBinaryContentType(contentType) {
  if (!contentType)
    return false;
  const value = contentType.split(";")[0];
  return commonBinaryMimeTypes.has(value);
}

// ../../node_modules/@opennextjs/aws/dist/core/routing/i18n/index.js
init_stream();
init_logger();

// ../../node_modules/@opennextjs/aws/dist/core/routing/i18n/accept-header.js
function parse(raw, preferences, options) {
  const lowers = /* @__PURE__ */ new Map();
  const header = raw.replace(/[ \t]/g, "");
  if (preferences) {
    let pos = 0;
    for (const preference of preferences) {
      const lower = preference.toLowerCase();
      lowers.set(lower, { orig: preference, pos: pos++ });
      if (options.prefixMatch) {
        const parts2 = lower.split("-");
        while (parts2.pop(), parts2.length > 0) {
          const joined = parts2.join("-");
          if (!lowers.has(joined)) {
            lowers.set(joined, { orig: preference, pos: pos++ });
          }
        }
      }
    }
  }
  const parts = header.split(",");
  const selections = [];
  const map = /* @__PURE__ */ new Set();
  for (let i = 0; i < parts.length; ++i) {
    const part = parts[i];
    if (!part) {
      continue;
    }
    const params = part.split(";");
    if (params.length > 2) {
      throw new Error(`Invalid ${options.type} header`);
    }
    const token = params[0].toLowerCase();
    if (!token) {
      throw new Error(`Invalid ${options.type} header`);
    }
    const selection = { token, pos: i, q: 1 };
    if (preferences && lowers.has(token)) {
      selection.pref = lowers.get(token).pos;
    }
    map.add(selection.token);
    if (params.length === 2) {
      const q = params[1];
      const [key, value] = q.split("=");
      if (!value || key !== "q" && key !== "Q") {
        throw new Error(`Invalid ${options.type} header`);
      }
      const score = Number.parseFloat(value);
      if (score === 0) {
        continue;
      }
      if (Number.isFinite(score) && score <= 1 && score >= 1e-3) {
        selection.q = score;
      }
    }
    selections.push(selection);
  }
  selections.sort((a, b) => {
    if (b.q !== a.q) {
      return b.q - a.q;
    }
    if (b.pref !== a.pref) {
      if (a.pref === void 0) {
        return 1;
      }
      if (b.pref === void 0) {
        return -1;
      }
      return a.pref - b.pref;
    }
    return a.pos - b.pos;
  });
  const values = selections.map((selection) => selection.token);
  if (!preferences || !preferences.length) {
    return values;
  }
  const preferred = [];
  for (const selection of values) {
    if (selection === "*") {
      for (const [preference, value] of lowers) {
        if (!map.has(preference)) {
          preferred.push(value.orig);
        }
      }
    } else {
      const lower = selection.toLowerCase();
      if (lowers.has(lower)) {
        preferred.push(lowers.get(lower).orig);
      }
    }
  }
  return preferred;
}
function acceptLanguage(header = "", preferences) {
  return parse(header, preferences, {
    type: "accept-language",
    prefixMatch: true
  })[0] || void 0;
}

// ../../node_modules/@opennextjs/aws/dist/core/routing/i18n/index.js
function isLocalizedPath(path3) {
  return NextConfig.i18n?.locales.includes(path3.split("/")[1].toLowerCase()) ?? false;
}
function getLocaleFromCookie(cookies) {
  const i18n = NextConfig.i18n;
  const nextLocale = cookies.NEXT_LOCALE?.toLowerCase();
  return nextLocale ? i18n?.locales.find((locale) => nextLocale === locale.toLowerCase()) : void 0;
}
function detectDomainLocale({ hostname, detectedLocale }) {
  const i18n = NextConfig.i18n;
  const domains = i18n?.domains;
  if (!domains) {
    return;
  }
  const lowercasedLocale = detectedLocale?.toLowerCase();
  for (const domain of domains) {
    const domainHostname = domain.domain.split(":", 1)[0].toLowerCase();
    if (hostname === domainHostname || lowercasedLocale === domain.defaultLocale.toLowerCase() || domain.locales?.some((locale) => lowercasedLocale === locale.toLowerCase())) {
      return domain;
    }
  }
}
function detectLocale(internalEvent, i18n) {
  const domainLocale = detectDomainLocale({
    hostname: internalEvent.headers.host
  });
  if (i18n.localeDetection === false) {
    return domainLocale?.defaultLocale ?? i18n.defaultLocale;
  }
  const cookiesLocale = getLocaleFromCookie(internalEvent.cookies);
  const preferredLocale = acceptLanguage(internalEvent.headers["accept-language"], i18n?.locales);
  debug({
    cookiesLocale,
    preferredLocale,
    defaultLocale: i18n.defaultLocale,
    domainLocale
  });
  return domainLocale?.defaultLocale ?? cookiesLocale ?? preferredLocale ?? i18n.defaultLocale;
}
function localizePath(internalEvent) {
  const i18n = NextConfig.i18n;
  if (!i18n) {
    return internalEvent.rawPath;
  }
  if (isLocalizedPath(internalEvent.rawPath)) {
    return internalEvent.rawPath;
  }
  const detectedLocale = detectLocale(internalEvent, i18n);
  return `/${detectedLocale}${internalEvent.rawPath}`;
}
function handleLocaleRedirect(internalEvent) {
  const i18n = NextConfig.i18n;
  if (!i18n || i18n.localeDetection === false || internalEvent.rawPath !== "/") {
    return false;
  }
  const preferredLocale = acceptLanguage(internalEvent.headers["accept-language"], i18n?.locales);
  const detectedLocale = detectLocale(internalEvent, i18n);
  const domainLocale = detectDomainLocale({
    hostname: internalEvent.headers.host
  });
  const preferredDomain = detectDomainLocale({
    detectedLocale: preferredLocale
  });
  if (domainLocale && preferredDomain) {
    const isPDomain = preferredDomain.domain === domainLocale.domain;
    const isPLocale = preferredDomain.defaultLocale === preferredLocale;
    if (!isPDomain || !isPLocale) {
      const scheme = `http${preferredDomain.http ? "" : "s"}`;
      const rlocale = isPLocale ? "" : preferredLocale;
      return {
        type: "core",
        statusCode: 307,
        headers: {
          Location: `${scheme}://${preferredDomain.domain}/${rlocale}`
        },
        body: emptyReadableStream(),
        isBase64Encoded: false
      };
    }
  }
  const defaultLocale = domainLocale?.defaultLocale ?? i18n.defaultLocale;
  if (detectedLocale.toLowerCase() !== defaultLocale.toLowerCase()) {
    return {
      type: "core",
      statusCode: 307,
      headers: {
        Location: constructNextUrl(internalEvent.url, `/${detectedLocale}`)
      },
      body: emptyReadableStream(),
      isBase64Encoded: false
    };
  }
  return false;
}

// ../../node_modules/@opennextjs/aws/dist/core/routing/queue.js
function generateShardId(rawPath, maxConcurrency, prefix) {
  let a = cyrb128(rawPath);
  let t = a += 1831565813;
  t = Math.imul(t ^ t >>> 15, t | 1);
  t ^= t + Math.imul(t ^ t >>> 7, t | 61);
  const randomFloat = ((t ^ t >>> 14) >>> 0) / 4294967296;
  const randomInt = Math.floor(randomFloat * maxConcurrency);
  return `${prefix}-${randomInt}`;
}
function generateMessageGroupId(rawPath) {
  const maxConcurrency = Number.parseInt(process.env.MAX_REVALIDATE_CONCURRENCY ?? "10");
  return generateShardId(rawPath, maxConcurrency, "revalidate");
}
function cyrb128(str) {
  let h1 = 1779033703;
  let h2 = 3144134277;
  let h3 = 1013904242;
  let h4 = 2773480762;
  for (let i = 0, k; i < str.length; i++) {
    k = str.charCodeAt(i);
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ h1 >>> 18, 597399067);
  h2 = Math.imul(h4 ^ h2 >>> 22, 2869860233);
  h3 = Math.imul(h1 ^ h3 >>> 17, 951274213);
  h4 = Math.imul(h2 ^ h4 >>> 19, 2716044179);
  h1 ^= h2 ^ h3 ^ h4, h2 ^= h1, h3 ^= h1, h4 ^= h1;
  return h1 >>> 0;
}

// ../../node_modules/@opennextjs/aws/dist/core/routing/util.js
function isExternal(url, host) {
  if (!url)
    return false;
  const pattern = /^https?:\/\//;
  if (!pattern.test(url))
    return false;
  if (host) {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.host !== host;
    } catch {
      return !url.includes(host);
    }
  }
  return true;
}
function convertFromQueryString(query) {
  if (query === "")
    return {};
  const queryParts = query.split("&");
  return getQueryFromIterator(queryParts.map((p) => {
    const [key, value] = p.split("=");
    return [key, value];
  }));
}
function getUrlParts(url, isExternal2) {
  if (!isExternal2) {
    const regex2 = /\/([^?]*)\??(.*)/;
    const match3 = url.match(regex2);
    return {
      hostname: "",
      pathname: match3?.[1] ? `/${match3[1]}` : url,
      protocol: "",
      queryString: match3?.[2] ?? ""
    };
  }
  const regex = /^(https?:)\/\/?([^\/\s]+)(\/[^?]*)?(\?.*)?/;
  const match2 = url.match(regex);
  if (!match2) {
    throw new Error(`Invalid external URL: ${url}`);
  }
  return {
    protocol: match2[1] ?? "https:",
    hostname: match2[2],
    pathname: match2[3] ?? "",
    queryString: match2[4]?.slice(1) ?? ""
  };
}
function constructNextUrl(baseUrl, path3) {
  const nextBasePath = NextConfig.basePath ?? "";
  const url = new URL(`${nextBasePath}${path3}`, baseUrl);
  return url.href;
}
function convertToQueryString(query) {
  const queryStrings = [];
  Object.entries(query).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((entry) => queryStrings.push(`${key}=${entry}`));
    } else {
      queryStrings.push(`${key}=${value}`);
    }
  });
  return queryStrings.length > 0 ? `?${queryStrings.join("&")}` : "";
}
function getMiddlewareMatch(middlewareManifest2, functionsManifest) {
  if (functionsManifest?.functions?.["/_middleware"]) {
    return functionsManifest.functions["/_middleware"].matchers?.map(({ regexp }) => new RegExp(regexp)) ?? [/.*/];
  }
  const rootMiddleware = middlewareManifest2.middleware["/"];
  if (!rootMiddleware?.matchers)
    return [];
  return rootMiddleware.matchers.map(({ regexp }) => new RegExp(regexp));
}
function escapeRegex(str, { isPath } = {}) {
  const result = str.replaceAll("(.)", "_\xB51_").replaceAll("(..)", "_\xB52_").replaceAll("(...)", "_\xB53_");
  return isPath ? result : result.replaceAll("+", "_\xB54_");
}
function unescapeRegex(str) {
  return str.replaceAll("_\xB51_", "(.)").replaceAll("_\xB52_", "(..)").replaceAll("_\xB53_", "(...)").replaceAll("_\xB54_", "+");
}
function convertBodyToReadableStream(method, body) {
  if (method === "GET" || method === "HEAD")
    return void 0;
  if (!body)
    return void 0;
  return new ReadableStream2({
    start(controller) {
      controller.enqueue(body);
      controller.close();
    }
  });
}
var CommonHeaders;
(function(CommonHeaders2) {
  CommonHeaders2["CACHE_CONTROL"] = "cache-control";
  CommonHeaders2["NEXT_CACHE"] = "x-nextjs-cache";
})(CommonHeaders || (CommonHeaders = {}));
function normalizeLocationHeader(location, baseUrl, encodeQuery = false) {
  if (!URL.canParse(location)) {
    return location;
  }
  const locationURL = new URL(location);
  const origin = new URL(baseUrl).origin;
  let search = locationURL.search;
  if (encodeQuery && search) {
    search = `?${stringifyQs(parseQs(search.slice(1)))}`;
  }
  const href = `${locationURL.origin}${locationURL.pathname}${search}${locationURL.hash}`;
  if (locationURL.origin === origin) {
    return href.slice(origin.length);
  }
  return href;
}

// ../../node_modules/@opennextjs/aws/dist/core/routingHandler.js
init_logger();

// ../../node_modules/@opennextjs/aws/dist/core/routing/cacheInterceptor.js
import { createHash } from "node:crypto";
init_stream();

// ../../node_modules/@opennextjs/aws/dist/utils/cache.js
init_logger();
async function hasBeenRevalidated(key, tags, cacheEntry) {
  if (globalThis.openNextConfig.dangerous?.disableTagCache) {
    return false;
  }
  const value = cacheEntry.value;
  if (!value) {
    return true;
  }
  if ("type" in cacheEntry && cacheEntry.type === "page") {
    return false;
  }
  const lastModified = cacheEntry.lastModified ?? Date.now();
  if (globalThis.tagCache.mode === "nextMode") {
    return tags.length === 0 ? false : await globalThis.tagCache.hasBeenRevalidated(tags, lastModified);
  }
  const _lastModified = await globalThis.tagCache.getLastModified(key, lastModified);
  return _lastModified === -1;
}
function getTagsFromValue(value) {
  if (!value) {
    return [];
  }
  try {
    const cacheTags = value.meta?.headers?.["x-next-cache-tags"]?.split(",") ?? [];
    delete value.meta?.headers?.["x-next-cache-tags"];
    return cacheTags;
  } catch (e) {
    return [];
  }
}

// ../../node_modules/@opennextjs/aws/dist/core/routing/cacheInterceptor.js
init_logger();
var CACHE_ONE_YEAR = 60 * 60 * 24 * 365;
var CACHE_ONE_MONTH = 60 * 60 * 24 * 30;
var VARY_HEADER = "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch, Next-Url";
var NEXT_SEGMENT_PREFETCH_HEADER = "next-router-segment-prefetch";
var NEXT_PRERENDER_HEADER = "x-nextjs-prerender";
var NEXT_POSTPONED_HEADER = "x-nextjs-postponed";
async function computeCacheControl(path3, body, host, revalidate, lastModified) {
  let finalRevalidate = CACHE_ONE_YEAR;
  const existingRoute = Object.entries(PrerenderManifest?.routes ?? {}).find((p) => p[0] === path3)?.[1];
  if (revalidate === void 0 && existingRoute) {
    finalRevalidate = existingRoute.initialRevalidateSeconds === false ? CACHE_ONE_YEAR : existingRoute.initialRevalidateSeconds;
  } else if (revalidate !== void 0) {
    finalRevalidate = revalidate === false ? CACHE_ONE_YEAR : revalidate;
  }
  const age = Math.round((Date.now() - (lastModified ?? 0)) / 1e3);
  const hash = (str) => createHash("md5").update(str).digest("hex");
  const etag = hash(body);
  if (revalidate === 0) {
    return {
      "cache-control": "private, no-cache, no-store, max-age=0, must-revalidate",
      "x-opennext-cache": "ERROR",
      etag
    };
  }
  if (finalRevalidate !== CACHE_ONE_YEAR) {
    const sMaxAge = Math.max(finalRevalidate - age, 1);
    debug("sMaxAge", {
      finalRevalidate,
      age,
      lastModified,
      revalidate
    });
    const isStale = sMaxAge === 1;
    if (isStale) {
      let url = NextConfig.trailingSlash ? `${path3}/` : path3;
      if (NextConfig.basePath) {
        url = `${NextConfig.basePath}${url}`;
      }
      await globalThis.queue.send({
        MessageBody: {
          host,
          url,
          eTag: etag,
          lastModified: lastModified ?? Date.now()
        },
        MessageDeduplicationId: hash(`${path3}-${lastModified}-${etag}`),
        MessageGroupId: generateMessageGroupId(path3)
      });
    }
    return {
      "cache-control": `s-maxage=${sMaxAge}, stale-while-revalidate=${CACHE_ONE_MONTH}`,
      "x-opennext-cache": isStale ? "STALE" : "HIT",
      etag
    };
  }
  return {
    "cache-control": `s-maxage=${CACHE_ONE_YEAR}, stale-while-revalidate=${CACHE_ONE_MONTH}`,
    "x-opennext-cache": "HIT",
    etag
  };
}
function getBodyForAppRouter(event, cachedValue) {
  if (cachedValue.type !== "app") {
    throw new Error("getBodyForAppRouter called with non-app cache value");
  }
  try {
    const segmentHeader = `${event.headers[NEXT_SEGMENT_PREFETCH_HEADER]}`;
    const isSegmentResponse = Boolean(segmentHeader) && segmentHeader in (cachedValue.segmentData || {});
    const body = isSegmentResponse ? cachedValue.segmentData[segmentHeader] : cachedValue.rsc;
    return {
      body,
      additionalHeaders: isSegmentResponse ? { [NEXT_PRERENDER_HEADER]: "1", [NEXT_POSTPONED_HEADER]: "2" } : {}
    };
  } catch (e) {
    error("Error while getting body for app router from cache:", e);
    return { body: cachedValue.rsc, additionalHeaders: {} };
  }
}
async function generateResult(event, localizedPath, cachedValue, lastModified) {
  debug("Returning result from experimental cache");
  let body = "";
  let type = "application/octet-stream";
  let isDataRequest = false;
  let additionalHeaders = {};
  if (cachedValue.type === "app") {
    isDataRequest = Boolean(event.headers.rsc);
    if (isDataRequest) {
      const { body: appRouterBody, additionalHeaders: appHeaders } = getBodyForAppRouter(event, cachedValue);
      body = appRouterBody;
      additionalHeaders = appHeaders;
    } else {
      body = cachedValue.html;
    }
    type = isDataRequest ? "text/x-component" : "text/html; charset=utf-8";
  } else if (cachedValue.type === "page") {
    isDataRequest = Boolean(event.query.__nextDataReq);
    body = isDataRequest ? JSON.stringify(cachedValue.json) : cachedValue.html;
    type = isDataRequest ? "application/json" : "text/html; charset=utf-8";
  } else {
    throw new Error("generateResult called with unsupported cache value type, only 'app' and 'page' are supported");
  }
  const cacheControl = await computeCacheControl(localizedPath, body, event.headers.host, cachedValue.revalidate, lastModified);
  return {
    type: "core",
    // Sometimes other status codes can be cached, like 404. For these cases, we should return the correct status code
    // Also set the status code to the rewriteStatusCode if defined
    // This can happen in handleMiddleware in routingHandler.
    // `NextResponse.rewrite(url, { status: xxx})
    // The rewrite status code should take precedence over the cached one
    statusCode: event.rewriteStatusCode ?? cachedValue.meta?.status ?? 200,
    body: toReadableStream(body, false),
    isBase64Encoded: false,
    headers: {
      ...cacheControl,
      "content-type": type,
      ...cachedValue.meta?.headers,
      vary: VARY_HEADER,
      ...additionalHeaders
    }
  };
}
function escapePathDelimiters(segment, escapeEncoded) {
  return segment.replace(new RegExp(`([/#?]${escapeEncoded ? "|%(2f|23|3f|5c)" : ""})`, "gi"), (char) => encodeURIComponent(char));
}
function decodePathParams(pathname) {
  return pathname.split("/").map((segment) => {
    try {
      return escapePathDelimiters(decodeURIComponent(segment), true);
    } catch (e) {
      return segment;
    }
  }).join("/");
}
async function cacheInterceptor(event) {
  if (Boolean(event.headers["next-action"]) || Boolean(event.headers["x-prerender-revalidate"]))
    return event;
  const cookies = event.headers.cookie || "";
  const hasPreviewData = cookies.includes("__prerender_bypass") || cookies.includes("__next_preview_data");
  if (hasPreviewData) {
    debug("Preview mode detected, passing through to handler");
    return event;
  }
  let localizedPath = localizePath(event);
  if (NextConfig.basePath) {
    localizedPath = localizedPath.replace(NextConfig.basePath, "");
  }
  localizedPath = localizedPath.replace(/\/$/, "");
  localizedPath = decodePathParams(localizedPath);
  debug("Checking cache for", localizedPath, PrerenderManifest);
  const isISR = Object.keys(PrerenderManifest?.routes ?? {}).includes(localizedPath ?? "/") || Object.values(PrerenderManifest?.dynamicRoutes ?? {}).some((dr) => new RegExp(dr.routeRegex).test(localizedPath));
  debug("isISR", isISR);
  if (isISR) {
    try {
      const cachedData = await globalThis.incrementalCache.get(localizedPath ?? "/index");
      debug("cached data in interceptor", cachedData);
      if (!cachedData?.value) {
        return event;
      }
      if (cachedData.value?.type === "app" || cachedData.value?.type === "route") {
        const tags = getTagsFromValue(cachedData.value);
        const _hasBeenRevalidated = cachedData.shouldBypassTagCache ? false : await hasBeenRevalidated(localizedPath, tags, cachedData);
        if (_hasBeenRevalidated) {
          return event;
        }
      }
      const host = event.headers.host;
      switch (cachedData?.value?.type) {
        case "app":
        case "page":
          return generateResult(event, localizedPath, cachedData.value, cachedData.lastModified);
        case "redirect": {
          const cacheControl = await computeCacheControl(localizedPath, "", host, cachedData.value.revalidate, cachedData.lastModified);
          return {
            type: "core",
            statusCode: cachedData.value.meta?.status ?? 307,
            body: emptyReadableStream(),
            headers: {
              ...cachedData.value.meta?.headers ?? {},
              ...cacheControl
            },
            isBase64Encoded: false
          };
        }
        case "route": {
          const cacheControl = await computeCacheControl(localizedPath, cachedData.value.body, host, cachedData.value.revalidate, cachedData.lastModified);
          const isBinary = isBinaryContentType(String(cachedData.value.meta?.headers?.["content-type"]));
          return {
            type: "core",
            statusCode: event.rewriteStatusCode ?? cachedData.value.meta?.status ?? 200,
            body: toReadableStream(cachedData.value.body, isBinary),
            headers: {
              ...cacheControl,
              ...cachedData.value.meta?.headers,
              vary: VARY_HEADER
            },
            isBase64Encoded: isBinary
          };
        }
        default:
          return event;
      }
    } catch (e) {
      debug("Error while fetching cache", e);
      return event;
    }
  }
  return event;
}

// ../../node_modules/path-to-regexp/dist.es2015/index.js
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count--;
          if (count === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
function parse2(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path3 = "";
  var tryConsume = function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  };
  var mustConsume = function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  };
  var consumeText = function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  };
  var isSafe = function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  };
  var safePattern = function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  };
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path3 += prefix;
        prefix = "";
      }
      if (path3) {
        result.push(path3);
        path3 = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path3 += value;
      continue;
    }
    if (path3) {
      result.push(path3);
      path3 = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
function compile(str, options) {
  return tokensToFunction(parse2(str, options), options);
}
function tokensToFunction(tokens, options) {
  if (options === void 0) {
    options = {};
  }
  var reFlags = flags(options);
  var _a = options.encode, encode = _a === void 0 ? function(x) {
    return x;
  } : _a, _b = options.validate, validate = _b === void 0 ? true : _b;
  var matches = tokens.map(function(token) {
    if (typeof token === "object") {
      return new RegExp("^(?:".concat(token.pattern, ")$"), reFlags);
    }
  });
  return function(data) {
    var path3 = "";
    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];
      if (typeof token === "string") {
        path3 += token;
        continue;
      }
      var value = data ? data[token.name] : void 0;
      var optional = token.modifier === "?" || token.modifier === "*";
      var repeat = token.modifier === "*" || token.modifier === "+";
      if (Array.isArray(value)) {
        if (!repeat) {
          throw new TypeError('Expected "'.concat(token.name, '" to not repeat, but got an array'));
        }
        if (value.length === 0) {
          if (optional)
            continue;
          throw new TypeError('Expected "'.concat(token.name, '" to not be empty'));
        }
        for (var j = 0; j < value.length; j++) {
          var segment = encode(value[j], token);
          if (validate && !matches[i].test(segment)) {
            throw new TypeError('Expected all "'.concat(token.name, '" to match "').concat(token.pattern, '", but got "').concat(segment, '"'));
          }
          path3 += token.prefix + segment + token.suffix;
        }
        continue;
      }
      if (typeof value === "string" || typeof value === "number") {
        var segment = encode(String(value), token);
        if (validate && !matches[i].test(segment)) {
          throw new TypeError('Expected "'.concat(token.name, '" to match "').concat(token.pattern, '", but got "').concat(segment, '"'));
        }
        path3 += token.prefix + segment + token.suffix;
        continue;
      }
      if (optional)
        continue;
      var typeOfMessage = repeat ? "an array" : "a string";
      throw new TypeError('Expected "'.concat(token.name, '" to be ').concat(typeOfMessage));
    }
    return path3;
  };
}
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path3 = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    };
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path: path3, index, params };
  };
}
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
function regexpToRegexp(path3, keys) {
  if (!keys)
    return path3;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path3.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path3.source);
  }
  return path3;
}
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path3) {
    return pathToRegexp(path3, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
function stringToRegexp(path3, keys, options) {
  return tokensToRegexp(parse2(path3, options), keys, options);
}
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
function pathToRegexp(path3, keys, options) {
  if (path3 instanceof RegExp)
    return regexpToRegexp(path3, keys);
  if (Array.isArray(path3))
    return arrayToRegexp(path3, keys, options);
  return stringToRegexp(path3, keys, options);
}

// ../../node_modules/@opennextjs/aws/dist/utils/normalize-path.js
import path2 from "node:path";
function normalizeRepeatedSlashes(url) {
  const urlNoQuery = url.host + url.pathname;
  return `${url.protocol}//${urlNoQuery.replace(/\\/g, "/").replace(/\/\/+/g, "/")}${url.search}`;
}

// ../../node_modules/@opennextjs/aws/dist/core/routing/matcher.js
init_stream();
init_logger();

// ../../node_modules/@opennextjs/aws/dist/core/routing/routeMatcher.js
var optionalLocalePrefixRegex = `^/(?:${RoutesManifest.locales.map((locale) => `${locale}/?`).join("|")})?`;
var optionalBasepathPrefixRegex = RoutesManifest.basePath ? `^${RoutesManifest.basePath}/?` : "^/";
var optionalPrefix = optionalLocalePrefixRegex.replace("^/", optionalBasepathPrefixRegex);
function routeMatcher(routeDefinitions) {
  const regexp = routeDefinitions.map((route) => ({
    page: route.page,
    regexp: new RegExp(route.regex.replace("^/", optionalPrefix))
  }));
  const appPathsSet = /* @__PURE__ */ new Set();
  const routePathsSet = /* @__PURE__ */ new Set();
  for (const [k, v] of Object.entries(AppPathRoutesManifest)) {
    if (k.endsWith("page")) {
      appPathsSet.add(v);
    } else if (k.endsWith("route")) {
      routePathsSet.add(v);
    }
  }
  return function matchRoute(path3) {
    const foundRoutes = regexp.filter((route) => route.regexp.test(path3));
    return foundRoutes.map((foundRoute) => {
      let routeType = "page";
      if (appPathsSet.has(foundRoute.page)) {
        routeType = "app";
      } else if (routePathsSet.has(foundRoute.page)) {
        routeType = "route";
      }
      return {
        route: foundRoute.page,
        type: routeType
      };
    });
  };
}
var staticRouteMatcher = routeMatcher([
  ...RoutesManifest.routes.static,
  ...getStaticAPIRoutes()
]);
var dynamicRouteMatcher = routeMatcher(RoutesManifest.routes.dynamic);
function getStaticAPIRoutes() {
  const createRouteDefinition = (route) => ({
    page: route,
    regex: `^${route}(?:/)?$`
  });
  const dynamicRoutePages = new Set(RoutesManifest.routes.dynamic.map(({ page }) => page));
  const pagesStaticAPIRoutes = Object.keys(PagesManifest).filter((route) => route.startsWith("/api/") && !dynamicRoutePages.has(route)).map(createRouteDefinition);
  const appPathsStaticAPIRoutes = Object.values(AppPathRoutesManifest).filter((route) => (route.startsWith("/api/") || route === "/api") && !dynamicRoutePages.has(route)).map(createRouteDefinition);
  return [...pagesStaticAPIRoutes, ...appPathsStaticAPIRoutes];
}

// ../../node_modules/@opennextjs/aws/dist/core/routing/matcher.js
var routeHasMatcher = (headers, cookies, query) => (redirect) => {
  switch (redirect.type) {
    case "header":
      return !!headers?.[redirect.key.toLowerCase()] && new RegExp(redirect.value ?? "").test(headers[redirect.key.toLowerCase()] ?? "");
    case "cookie":
      return !!cookies?.[redirect.key] && new RegExp(redirect.value ?? "").test(cookies[redirect.key] ?? "");
    case "query":
      return query[redirect.key] && Array.isArray(redirect.value) ? redirect.value.reduce((prev, current) => prev || new RegExp(current).test(query[redirect.key]), false) : new RegExp(redirect.value ?? "").test(query[redirect.key] ?? "");
    case "host":
      return headers?.host !== "" && new RegExp(redirect.value ?? "").test(headers.host);
    default:
      return false;
  }
};
function checkHas(matcher, has, inverted = false) {
  return has ? has.reduce((acc, cur) => {
    if (acc === false)
      return false;
    return inverted ? !matcher(cur) : matcher(cur);
  }, true) : true;
}
var getParamsFromSource = (source) => (value) => {
  debug("value", value);
  const _match = source(value);
  return _match ? _match.params : {};
};
var computeParamHas = (headers, cookies, query) => (has) => {
  if (!has.value)
    return {};
  const matcher = new RegExp(`^${has.value}$`);
  const fromSource = (value) => {
    const matches = value.match(matcher);
    return matches?.groups ?? {};
  };
  switch (has.type) {
    case "header":
      return fromSource(headers[has.key.toLowerCase()] ?? "");
    case "cookie":
      return fromSource(cookies[has.key] ?? "");
    case "query":
      return Array.isArray(query[has.key]) ? fromSource(query[has.key].join(",")) : fromSource(query[has.key] ?? "");
    case "host":
      return fromSource(headers.host ?? "");
  }
};
function convertMatch(match2, toDestination, destination) {
  if (!match2) {
    return destination;
  }
  const { params } = match2;
  const isUsingParams = Object.keys(params).length > 0;
  return isUsingParams ? toDestination(params) : destination;
}
function getNextConfigHeaders(event, configHeaders) {
  if (!configHeaders) {
    return {};
  }
  const matcher = routeHasMatcher(event.headers, event.cookies, event.query);
  const requestHeaders = {};
  const localizedRawPath = localizePath(event);
  for (const { headers, has, missing, regex, source, locale } of configHeaders) {
    const path3 = locale === false ? event.rawPath : localizedRawPath;
    if (new RegExp(regex).test(path3) && checkHas(matcher, has) && checkHas(matcher, missing, true)) {
      const fromSource = match(source);
      const _match = fromSource(path3);
      headers.forEach((h) => {
        try {
          const key = convertMatch(_match, compile(h.key), h.key);
          const value = convertMatch(_match, compile(h.value), h.value);
          requestHeaders[key] = value;
        } catch {
          debug(`Error matching header ${h.key} with value ${h.value}`);
          requestHeaders[h.key] = h.value;
        }
      });
    }
  }
  return requestHeaders;
}
function handleRewrites(event, rewrites) {
  const { rawPath, headers, query, cookies, url } = event;
  const localizedRawPath = localizePath(event);
  const matcher = routeHasMatcher(headers, cookies, query);
  const computeHas = computeParamHas(headers, cookies, query);
  const rewrite = rewrites.find((route) => {
    const path3 = route.locale === false ? rawPath : localizedRawPath;
    return new RegExp(route.regex).test(path3) && checkHas(matcher, route.has) && checkHas(matcher, route.missing, true);
  });
  let finalQuery = query;
  let rewrittenUrl = url;
  const isExternalRewrite = isExternal(rewrite?.destination);
  debug("isExternalRewrite", isExternalRewrite);
  if (rewrite) {
    const { pathname, protocol, hostname, queryString } = getUrlParts(rewrite.destination, isExternalRewrite);
    const pathToUse = rewrite.locale === false ? rawPath : localizedRawPath;
    debug("urlParts", { pathname, protocol, hostname, queryString });
    const toDestinationPath = compile(escapeRegex(pathname, { isPath: true }));
    const toDestinationHost = compile(escapeRegex(hostname));
    const toDestinationQuery = compile(escapeRegex(queryString));
    const params = {
      // params for the source
      ...getParamsFromSource(match(escapeRegex(rewrite.source, { isPath: true })))(pathToUse),
      // params for the has
      ...rewrite.has?.reduce((acc, cur) => {
        return Object.assign(acc, computeHas(cur));
      }, {}),
      // params for the missing
      ...rewrite.missing?.reduce((acc, cur) => {
        return Object.assign(acc, computeHas(cur));
      }, {})
    };
    const isUsingParams = Object.keys(params).length > 0;
    let rewrittenQuery = queryString;
    let rewrittenHost = hostname;
    let rewrittenPath = pathname;
    if (isUsingParams) {
      rewrittenPath = unescapeRegex(toDestinationPath(params));
      rewrittenHost = unescapeRegex(toDestinationHost(params));
      rewrittenQuery = unescapeRegex(toDestinationQuery(params));
    }
    if (NextConfig.i18n && !isExternalRewrite) {
      const strippedPathLocale = rewrittenPath.replace(new RegExp(`^/(${NextConfig.i18n.locales.join("|")})`), "");
      if (strippedPathLocale.startsWith("/api/")) {
        rewrittenPath = strippedPathLocale;
      }
    }
    rewrittenUrl = isExternalRewrite ? `${protocol}//${rewrittenHost}${rewrittenPath}` : new URL(rewrittenPath, event.url).href;
    finalQuery = {
      ...query,
      ...convertFromQueryString(rewrittenQuery)
    };
    rewrittenUrl += convertToQueryString(finalQuery);
    debug("rewrittenUrl", { rewrittenUrl, finalQuery, isUsingParams });
  }
  return {
    internalEvent: {
      ...event,
      query: finalQuery,
      rawPath: new URL(rewrittenUrl).pathname,
      url: rewrittenUrl
    },
    __rewrite: rewrite,
    isExternalRewrite
  };
}
function handleRepeatedSlashRedirect(event) {
  if (event.rawPath.match(/(\\|\/\/)/)) {
    return {
      type: event.type,
      statusCode: 308,
      headers: {
        Location: normalizeRepeatedSlashes(new URL(event.url))
      },
      body: emptyReadableStream(),
      isBase64Encoded: false
    };
  }
  return false;
}
function handleTrailingSlashRedirect(event) {
  const url = new URL(event.rawPath, "http://localhost");
  if (
    // Someone is trying to redirect to a different origin, let's not do that
    url.host !== "localhost" || NextConfig.skipTrailingSlashRedirect || // We should not apply trailing slash redirect to API routes
    event.rawPath.startsWith("/api/")
  ) {
    return false;
  }
  const emptyBody = emptyReadableStream();
  if (NextConfig.trailingSlash && !event.headers["x-nextjs-data"] && !event.rawPath.endsWith("/") && !event.rawPath.match(/[\w-]+\.[\w]+$/g)) {
    const headersLocation = event.url.split("?");
    return {
      type: event.type,
      statusCode: 308,
      headers: {
        Location: `${headersLocation[0]}/${headersLocation[1] ? `?${headersLocation[1]}` : ""}`
      },
      body: emptyBody,
      isBase64Encoded: false
    };
  }
  if (!NextConfig.trailingSlash && event.rawPath.endsWith("/") && event.rawPath !== "/") {
    const headersLocation = event.url.split("?");
    return {
      type: event.type,
      statusCode: 308,
      headers: {
        Location: `${headersLocation[0].replace(/\/$/, "")}${headersLocation[1] ? `?${headersLocation[1]}` : ""}`
      },
      body: emptyBody,
      isBase64Encoded: false
    };
  }
  return false;
}
function handleRedirects(event, redirects) {
  const repeatedSlashRedirect = handleRepeatedSlashRedirect(event);
  if (repeatedSlashRedirect)
    return repeatedSlashRedirect;
  const trailingSlashRedirect = handleTrailingSlashRedirect(event);
  if (trailingSlashRedirect)
    return trailingSlashRedirect;
  const localeRedirect = handleLocaleRedirect(event);
  if (localeRedirect)
    return localeRedirect;
  const { internalEvent, __rewrite } = handleRewrites(event, redirects.filter((r) => !r.internal));
  if (__rewrite && !__rewrite.internal) {
    return {
      type: event.type,
      statusCode: __rewrite.statusCode ?? 308,
      headers: {
        Location: internalEvent.url
      },
      body: emptyReadableStream(),
      isBase64Encoded: false
    };
  }
}
function fixDataPage(internalEvent, buildId) {
  const { rawPath, query } = internalEvent;
  const basePath = NextConfig.basePath ?? "";
  const dataPattern = `${basePath}/_next/data/${buildId}`;
  if (rawPath.startsWith("/_next/data") && !rawPath.startsWith(dataPattern)) {
    return {
      type: internalEvent.type,
      statusCode: 404,
      body: toReadableStream("{}"),
      headers: {
        "Content-Type": "application/json"
      },
      isBase64Encoded: false
    };
  }
  if (rawPath.startsWith(dataPattern) && rawPath.endsWith(".json")) {
    const newPath = `${basePath}${rawPath.slice(dataPattern.length, -".json".length).replace(/^\/index$/, "/")}`;
    query.__nextDataReq = "1";
    return {
      ...internalEvent,
      rawPath: newPath,
      query,
      url: new URL(`${newPath}${convertToQueryString(query)}`, internalEvent.url).href
    };
  }
  return internalEvent;
}
function handleFallbackFalse(internalEvent, prerenderManifest) {
  const { rawPath } = internalEvent;
  const { dynamicRoutes = {}, routes = {} } = prerenderManifest ?? {};
  const prerenderedFallbackRoutes = Object.entries(dynamicRoutes).filter(([, { fallback }]) => fallback === false);
  const routeFallback = prerenderedFallbackRoutes.some(([, { routeRegex }]) => {
    const routeRegexExp = new RegExp(routeRegex);
    return routeRegexExp.test(rawPath);
  });
  const locales = NextConfig.i18n?.locales;
  const routesAlreadyHaveLocale = locales?.includes(rawPath.split("/")[1]) || // If we don't use locales, we don't need to add the default locale
  locales === void 0;
  let localizedPath = routesAlreadyHaveLocale ? rawPath : `/${NextConfig.i18n?.defaultLocale}${rawPath}`;
  if (
    // Not if localizedPath is "/" tho, because that would not make it find `isPregenerated` below since it would be try to match an empty string.
    localizedPath !== "/" && NextConfig.trailingSlash && localizedPath.endsWith("/")
  ) {
    localizedPath = localizedPath.slice(0, -1);
  }
  const matchedStaticRoute = staticRouteMatcher(localizedPath);
  const prerenderedFallbackRoutesName = prerenderedFallbackRoutes.map(([name]) => name);
  const matchedDynamicRoute = dynamicRouteMatcher(localizedPath).filter(({ route }) => !prerenderedFallbackRoutesName.includes(route));
  const isPregenerated = Object.keys(routes).includes(localizedPath);
  if (routeFallback && !isPregenerated && matchedStaticRoute.length === 0 && matchedDynamicRoute.length === 0) {
    return {
      event: {
        ...internalEvent,
        rawPath: "/404",
        url: constructNextUrl(internalEvent.url, "/404"),
        headers: {
          ...internalEvent.headers,
          "x-invoke-status": "404"
        }
      },
      isISR: false
    };
  }
  return {
    event: internalEvent,
    isISR: routeFallback || isPregenerated
  };
}

// ../../node_modules/@opennextjs/aws/dist/core/routing/middleware.js
init_stream();
init_utils();
var middlewareManifest = MiddlewareManifest;
var functionsConfigManifest = FunctionsConfigManifest;
var middleMatch = getMiddlewareMatch(middlewareManifest, functionsConfigManifest);
var REDIRECTS = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
function defaultMiddlewareLoader() {
  return Promise.resolve().then(() => (init_edgeFunctionHandler(), edgeFunctionHandler_exports));
}
async function handleMiddleware(internalEvent, initialSearch, middlewareLoader = defaultMiddlewareLoader) {
  const headers = internalEvent.headers;
  if (headers["x-isr"] && headers["x-prerender-revalidate"] === PrerenderManifest?.preview?.previewModeId)
    return internalEvent;
  const normalizedPath = localizePath(internalEvent);
  const hasMatch = middleMatch.some((r) => r.test(normalizedPath));
  if (!hasMatch)
    return internalEvent;
  const initialUrl = new URL(normalizedPath, internalEvent.url);
  initialUrl.search = initialSearch;
  const url = initialUrl.href;
  const middleware = await middlewareLoader();
  const result = await middleware.default({
    // `geo` is pre Next 15.
    geo: {
      // The city name is percent-encoded.
      // See https://github.com/vercel/vercel/blob/4cb6143/packages/functions/src/headers.ts#L94C19-L94C37
      city: decodeURIComponent(headers["x-open-next-city"]),
      country: headers["x-open-next-country"],
      region: headers["x-open-next-region"],
      latitude: headers["x-open-next-latitude"],
      longitude: headers["x-open-next-longitude"]
    },
    headers,
    method: internalEvent.method || "GET",
    nextConfig: {
      basePath: NextConfig.basePath,
      i18n: NextConfig.i18n,
      trailingSlash: NextConfig.trailingSlash
    },
    url,
    body: convertBodyToReadableStream(internalEvent.method, internalEvent.body)
  });
  const statusCode = result.status;
  const responseHeaders = result.headers;
  const reqHeaders = {};
  const resHeaders = {};
  const filteredHeaders = [
    "x-middleware-override-headers",
    "x-middleware-next",
    "x-middleware-rewrite",
    // We need to drop `content-encoding` because it will be decoded
    "content-encoding"
  ];
  const xMiddlewareKey = "x-middleware-request-";
  responseHeaders.forEach((value, key) => {
    if (key.startsWith(xMiddlewareKey)) {
      const k = key.substring(xMiddlewareKey.length);
      reqHeaders[k] = value;
    } else {
      if (filteredHeaders.includes(key.toLowerCase()))
        return;
      if (key.toLowerCase() === "set-cookie") {
        resHeaders[key] = resHeaders[key] ? [...resHeaders[key], value] : [value];
      } else if (REDIRECTS.has(statusCode) && key.toLowerCase() === "location") {
        resHeaders[key] = normalizeLocationHeader(value, internalEvent.url);
      } else {
        resHeaders[key] = value;
      }
    }
  });
  const rewriteUrl = responseHeaders.get("x-middleware-rewrite");
  let isExternalRewrite = false;
  let middlewareQuery = internalEvent.query;
  let newUrl = internalEvent.url;
  if (rewriteUrl) {
    newUrl = rewriteUrl;
    if (isExternal(newUrl, internalEvent.headers.host)) {
      isExternalRewrite = true;
    } else {
      const rewriteUrlObject = new URL(rewriteUrl);
      middlewareQuery = getQueryFromSearchParams(rewriteUrlObject.searchParams);
      if ("__nextDataReq" in internalEvent.query) {
        middlewareQuery.__nextDataReq = internalEvent.query.__nextDataReq;
      }
    }
  }
  if (!rewriteUrl && !responseHeaders.get("x-middleware-next")) {
    const body = result.body ?? emptyReadableStream();
    return {
      type: internalEvent.type,
      statusCode,
      headers: resHeaders,
      body,
      isBase64Encoded: false
    };
  }
  return {
    responseHeaders: resHeaders,
    url: newUrl,
    rawPath: new URL(newUrl).pathname,
    type: internalEvent.type,
    headers: { ...internalEvent.headers, ...reqHeaders },
    body: internalEvent.body,
    method: internalEvent.method,
    query: middlewareQuery,
    cookies: internalEvent.cookies,
    remoteAddress: internalEvent.remoteAddress,
    isExternalRewrite,
    rewriteStatusCode: rewriteUrl && !isExternalRewrite ? statusCode : void 0
  };
}

// ../../node_modules/@opennextjs/aws/dist/core/routingHandler.js
var MIDDLEWARE_HEADER_PREFIX = "x-middleware-response-";
var MIDDLEWARE_HEADER_PREFIX_LEN = MIDDLEWARE_HEADER_PREFIX.length;
var INTERNAL_HEADER_PREFIX = "x-opennext-";
var INTERNAL_HEADER_INITIAL_URL = `${INTERNAL_HEADER_PREFIX}initial-url`;
var INTERNAL_HEADER_LOCALE = `${INTERNAL_HEADER_PREFIX}locale`;
var INTERNAL_HEADER_RESOLVED_ROUTES = `${INTERNAL_HEADER_PREFIX}resolved-routes`;
var INTERNAL_HEADER_REWRITE_STATUS_CODE = `${INTERNAL_HEADER_PREFIX}rewrite-status-code`;
var INTERNAL_EVENT_REQUEST_ID = `${INTERNAL_HEADER_PREFIX}request-id`;
var geoHeaderToNextHeader = {
  "x-open-next-city": "x-vercel-ip-city",
  "x-open-next-country": "x-vercel-ip-country",
  "x-open-next-region": "x-vercel-ip-country-region",
  "x-open-next-latitude": "x-vercel-ip-latitude",
  "x-open-next-longitude": "x-vercel-ip-longitude"
};
function applyMiddlewareHeaders(eventOrResult, middlewareHeaders) {
  const isResult = isInternalResult(eventOrResult);
  const headers = eventOrResult.headers;
  const keyPrefix = isResult ? "" : MIDDLEWARE_HEADER_PREFIX;
  Object.entries(middlewareHeaders).forEach(([key, value]) => {
    if (value) {
      headers[keyPrefix + key] = Array.isArray(value) ? value.join(",") : value;
    }
  });
}
async function routingHandler(event, { assetResolver }) {
  try {
    for (const [openNextGeoName, nextGeoName] of Object.entries(geoHeaderToNextHeader)) {
      const value = event.headers[openNextGeoName];
      if (value) {
        event.headers[nextGeoName] = value;
      }
    }
    for (const key of Object.keys(event.headers)) {
      if (key.startsWith(INTERNAL_HEADER_PREFIX) || key.startsWith(MIDDLEWARE_HEADER_PREFIX)) {
        delete event.headers[key];
      }
    }
    let headers = getNextConfigHeaders(event, ConfigHeaders);
    let eventOrResult = fixDataPage(event, BuildId);
    if (isInternalResult(eventOrResult)) {
      return eventOrResult;
    }
    const redirect = handleRedirects(eventOrResult, RoutesManifest.redirects);
    if (redirect) {
      redirect.headers.Location = normalizeLocationHeader(redirect.headers.Location, event.url, true);
      debug("redirect", redirect);
      return redirect;
    }
    const middlewareEventOrResult = await handleMiddleware(
      eventOrResult,
      // We need to pass the initial search without any decoding
      // TODO: we'd need to refactor InternalEvent to include the initial querystring directly
      // Should be done in another PR because it is a breaking change
      new URL(event.url).search
    );
    if (isInternalResult(middlewareEventOrResult)) {
      return middlewareEventOrResult;
    }
    const middlewareHeadersPrioritized = globalThis.openNextConfig.dangerous?.middlewareHeadersOverrideNextConfigHeaders ?? false;
    if (middlewareHeadersPrioritized) {
      headers = {
        ...headers,
        ...middlewareEventOrResult.responseHeaders
      };
    } else {
      headers = {
        ...middlewareEventOrResult.responseHeaders,
        ...headers
      };
    }
    let isExternalRewrite = middlewareEventOrResult.isExternalRewrite ?? false;
    eventOrResult = middlewareEventOrResult;
    if (!isExternalRewrite) {
      const beforeRewrite = handleRewrites(eventOrResult, RoutesManifest.rewrites.beforeFiles);
      eventOrResult = beforeRewrite.internalEvent;
      isExternalRewrite = beforeRewrite.isExternalRewrite;
      if (!isExternalRewrite) {
        const assetResult = await assetResolver?.maybeGetAssetResult?.(eventOrResult);
        if (assetResult) {
          applyMiddlewareHeaders(assetResult, headers);
          return assetResult;
        }
      }
    }
    const foundStaticRoute = staticRouteMatcher(eventOrResult.rawPath);
    const isStaticRoute = !isExternalRewrite && foundStaticRoute.length > 0;
    if (!(isStaticRoute || isExternalRewrite)) {
      const afterRewrite = handleRewrites(eventOrResult, RoutesManifest.rewrites.afterFiles);
      eventOrResult = afterRewrite.internalEvent;
      isExternalRewrite = afterRewrite.isExternalRewrite;
    }
    let isISR = false;
    if (!isExternalRewrite) {
      const fallbackResult = handleFallbackFalse(eventOrResult, PrerenderManifest);
      eventOrResult = fallbackResult.event;
      isISR = fallbackResult.isISR;
    }
    const foundDynamicRoute = dynamicRouteMatcher(eventOrResult.rawPath);
    const isDynamicRoute = !isExternalRewrite && foundDynamicRoute.length > 0;
    if (!(isDynamicRoute || isStaticRoute || isExternalRewrite)) {
      const fallbackRewrites = handleRewrites(eventOrResult, RoutesManifest.rewrites.fallback);
      eventOrResult = fallbackRewrites.internalEvent;
      isExternalRewrite = fallbackRewrites.isExternalRewrite;
    }
    const isNextImageRoute = eventOrResult.rawPath.startsWith("/_next/image");
    const isRouteFoundBeforeAllRewrites = isStaticRoute || isDynamicRoute || isExternalRewrite;
    if (!(isRouteFoundBeforeAllRewrites || isNextImageRoute || // We need to check again once all rewrites have been applied
    staticRouteMatcher(eventOrResult.rawPath).length > 0 || dynamicRouteMatcher(eventOrResult.rawPath).length > 0)) {
      eventOrResult = {
        ...eventOrResult,
        rawPath: "/404",
        url: constructNextUrl(eventOrResult.url, "/404"),
        headers: {
          ...eventOrResult.headers,
          "x-middleware-response-cache-control": "private, no-cache, no-store, max-age=0, must-revalidate"
        }
      };
    }
    if (globalThis.openNextConfig.dangerous?.enableCacheInterception && !isInternalResult(eventOrResult)) {
      debug("Cache interception enabled");
      eventOrResult = await cacheInterceptor(eventOrResult);
      if (isInternalResult(eventOrResult)) {
        applyMiddlewareHeaders(eventOrResult, headers);
        return eventOrResult;
      }
    }
    applyMiddlewareHeaders(eventOrResult, headers);
    const resolvedRoutes = [
      ...foundStaticRoute,
      ...foundDynamicRoute
    ];
    debug("resolvedRoutes", resolvedRoutes);
    return {
      internalEvent: eventOrResult,
      isExternalRewrite,
      origin: false,
      isISR,
      resolvedRoutes,
      initialURL: event.url,
      locale: NextConfig.i18n ? detectLocale(eventOrResult, NextConfig.i18n) : void 0,
      rewriteStatusCode: middlewareEventOrResult.rewriteStatusCode
    };
  } catch (e) {
    error("Error in routingHandler", e);
    return {
      internalEvent: {
        type: "core",
        method: "GET",
        rawPath: "/500",
        url: constructNextUrl(event.url, "/500"),
        headers: {
          ...event.headers
        },
        query: event.query,
        cookies: event.cookies,
        remoteAddress: event.remoteAddress
      },
      isExternalRewrite: false,
      origin: false,
      isISR: false,
      resolvedRoutes: [],
      initialURL: event.url,
      locale: NextConfig.i18n ? detectLocale(event, NextConfig.i18n) : void 0
    };
  }
}
function isInternalResult(eventOrResult) {
  return eventOrResult != null && "statusCode" in eventOrResult;
}

// ../../node_modules/@opennextjs/aws/dist/adapters/middleware.js
globalThis.internalFetch = fetch;
globalThis.__openNextAls = new AsyncLocalStorage();
var defaultHandler = async (internalEvent, options) => {
  const middlewareConfig = globalThis.openNextConfig.middleware;
  const originResolver = await resolveOriginResolver(middlewareConfig?.originResolver);
  const externalRequestProxy = await resolveProxyRequest(middlewareConfig?.override?.proxyExternalRequest);
  const assetResolver = await resolveAssetResolver(middlewareConfig?.assetResolver);
  const requestId = Math.random().toString(36);
  return runWithOpenNextRequestContext({
    isISRRevalidation: internalEvent.headers["x-isr"] === "1",
    waitUntil: options?.waitUntil,
    requestId
  }, async () => {
    const result = await routingHandler(internalEvent, { assetResolver });
    if ("internalEvent" in result) {
      debug("Middleware intercepted event", internalEvent);
      if (!result.isExternalRewrite) {
        const origin = await originResolver.resolve(result.internalEvent.rawPath);
        return {
          type: "middleware",
          internalEvent: {
            ...result.internalEvent,
            headers: {
              ...result.internalEvent.headers,
              [INTERNAL_HEADER_INITIAL_URL]: internalEvent.url,
              [INTERNAL_HEADER_RESOLVED_ROUTES]: JSON.stringify(result.resolvedRoutes),
              [INTERNAL_EVENT_REQUEST_ID]: requestId,
              [INTERNAL_HEADER_REWRITE_STATUS_CODE]: String(result.rewriteStatusCode)
            }
          },
          isExternalRewrite: result.isExternalRewrite,
          origin,
          isISR: result.isISR,
          initialURL: result.initialURL,
          resolvedRoutes: result.resolvedRoutes
        };
      }
      try {
        return externalRequestProxy.proxy(result.internalEvent);
      } catch (e) {
        error("External request failed.", e);
        return {
          type: "middleware",
          internalEvent: {
            ...result.internalEvent,
            headers: {
              ...result.internalEvent.headers,
              [INTERNAL_EVENT_REQUEST_ID]: requestId
            },
            rawPath: "/500",
            url: constructNextUrl(result.internalEvent.url, "/500"),
            method: "GET"
          },
          // On error we need to rewrite to the 500 page which is an internal rewrite
          isExternalRewrite: false,
          origin: false,
          isISR: result.isISR,
          initialURL: result.internalEvent.url,
          resolvedRoutes: [{ route: "/500", type: "page" }]
        };
      }
    }
    if (process.env.OPEN_NEXT_REQUEST_ID_HEADER || globalThis.openNextDebug) {
      result.headers[INTERNAL_EVENT_REQUEST_ID] = requestId;
    }
    debug("Middleware response", result);
    return result;
  });
};
var handler2 = await createGenericHandler({
  handler: defaultHandler,
  type: "middleware"
});
var middleware_default = {
  fetch: handler2
};
export {
  middleware_default as default,
  handler2 as handler
};
