SystemJS.config({
  packages: {
    "alkindi-task": {
      "main": "main.js"
    }
  },
  paths: {
    "npm:": "jspm_packages/npm/",
    "github:": "jspm_packages/github/",
    "alkindi-task/": "src/",
  },
  browserConfig: {
    "baseURL": "."
  },
  meta: {
    "*.css": {
      "loader": "css"
    },
    "*.scss": {
      "loader": "sass"
    }
  },
  transpiler: "plugin-babel",
  babelOptions: {
    "optional": [
      "runtime"
    ],
    "plugins": [
      "babel-plugin-transform-react-jsx"
    ],
    "blacklist": []
  },
  sassPluginOptions: {
    "rewriteUrl": true
  },
  devConfig: {
    "map": {
      "babel": "npm:babel-core@6.20.0",
      "module": "npm:jspm-nodelibs-module@0.2.0",
      "core-js": "npm:core-js@2.4.1",
      "systemjs-plugin-babel": "npm:systemjs-plugin-babel@0.0.17",
      "babel-plugin-transform-react-jsx": "npm:babel-plugin-transform-react-jsx@6.8.0",
      "plugin-babel": "npm:systemjs-plugin-babel@0.0.17",
      "postcss": "npm:postcss@5.2.6",
      "normalize.css": "github:necolas/normalize.css@5.0.0",
      "css": "github:systemjs/plugin-css@0.1.32",
      "graceful-fs": "npm:graceful-fs@4.1.11",
      "sass": "github:mobilexag/plugin-sass@0.5.1"
    },
    "packages": {
      "npm:babel-core@6.20.0": {
        "map": {
          "babel-code-frame": "npm:babel-code-frame@6.20.0",
          "babel-messages": "npm:babel-messages@6.8.0",
          "babel-template": "npm:babel-template@6.16.0",
          "babel-helpers": "npm:babel-helpers@6.16.0",
          "babel-generator": "npm:babel-generator@6.20.0",
          "babel-runtime": "npm:babel-runtime@6.20.0",
          "debug": "npm:debug@2.4.1",
          "babel-traverse": "npm:babel-traverse@6.20.0",
          "convert-source-map": "npm:convert-source-map@1.3.0",
          "json5": "npm:json5@0.5.1",
          "babel-types": "npm:babel-types@6.20.0",
          "babel-register": "npm:babel-register@6.18.0",
          "path-is-absolute": "npm:path-is-absolute@1.0.1",
          "slash": "npm:slash@1.0.0",
          "lodash": "npm:lodash@4.17.2",
          "minimatch": "npm:minimatch@3.0.3",
          "private": "npm:private@0.1.6",
          "babylon": "npm:babylon@6.14.1",
          "source-map": "npm:source-map@0.5.6"
        }
      },
      "npm:babel-messages@6.8.0": {
        "map": {
          "babel-runtime": "npm:babel-runtime@6.20.0"
        }
      },
      "npm:babel-template@6.16.0": {
        "map": {
          "babel-runtime": "npm:babel-runtime@6.20.0",
          "babel-traverse": "npm:babel-traverse@6.20.0",
          "babel-types": "npm:babel-types@6.20.0",
          "lodash": "npm:lodash@4.17.2",
          "babylon": "npm:babylon@6.14.1"
        }
      },
      "npm:babel-generator@6.20.0": {
        "map": {
          "babel-runtime": "npm:babel-runtime@6.20.0",
          "babel-messages": "npm:babel-messages@6.8.0",
          "babel-types": "npm:babel-types@6.20.0",
          "lodash": "npm:lodash@4.17.2",
          "source-map": "npm:source-map@0.5.6",
          "detect-indent": "npm:detect-indent@4.0.0",
          "jsesc": "npm:jsesc@1.3.0"
        }
      },
      "npm:babel-helpers@6.16.0": {
        "map": {
          "babel-runtime": "npm:babel-runtime@6.20.0",
          "babel-template": "npm:babel-template@6.16.0"
        }
      },
      "npm:babel-traverse@6.20.0": {
        "map": {
          "babel-runtime": "npm:babel-runtime@6.20.0",
          "lodash": "npm:lodash@4.17.2",
          "babel-code-frame": "npm:babel-code-frame@6.20.0",
          "babel-messages": "npm:babel-messages@6.8.0",
          "babel-types": "npm:babel-types@6.20.0",
          "debug": "npm:debug@2.4.1",
          "babylon": "npm:babylon@6.14.1",
          "invariant": "npm:invariant@2.2.2",
          "globals": "npm:globals@9.14.0"
        }
      },
      "npm:babel-types@6.20.0": {
        "map": {
          "babel-runtime": "npm:babel-runtime@6.20.0",
          "lodash": "npm:lodash@4.17.2",
          "esutils": "npm:esutils@2.0.2",
          "to-fast-properties": "npm:to-fast-properties@1.0.2"
        }
      },
      "npm:babel-register@6.18.0": {
        "map": {
          "babel-runtime": "npm:babel-runtime@6.20.0",
          "lodash": "npm:lodash@4.17.2",
          "babel-core": "npm:babel-core@6.20.0",
          "home-or-tmp": "npm:home-or-tmp@2.0.0",
          "mkdirp": "npm:mkdirp@0.5.1",
          "source-map-support": "npm:source-map-support@0.4.6",
          "core-js": "npm:core-js@2.4.1"
        }
      },
      "npm:babel-code-frame@6.20.0": {
        "map": {
          "js-tokens": "npm:js-tokens@2.0.0",
          "esutils": "npm:esutils@2.0.2",
          "chalk": "npm:chalk@1.1.3"
        }
      },
      "npm:debug@2.4.1": {
        "map": {
          "ms": "npm:ms@0.7.2"
        }
      },
      "npm:source-map-support@0.4.6": {
        "map": {
          "source-map": "npm:source-map@0.5.6"
        }
      },
      "npm:minimatch@3.0.3": {
        "map": {
          "brace-expansion": "npm:brace-expansion@1.1.6"
        }
      },
      "npm:detect-indent@4.0.0": {
        "map": {
          "repeating": "npm:repeating@2.0.1"
        }
      },
      "npm:home-or-tmp@2.0.0": {
        "map": {
          "os-homedir": "npm:os-homedir@1.0.2",
          "os-tmpdir": "npm:os-tmpdir@1.0.2"
        }
      },
      "npm:mkdirp@0.5.1": {
        "map": {
          "minimist": "npm:minimist@0.0.8"
        }
      },
      "npm:brace-expansion@1.1.6": {
        "map": {
          "concat-map": "npm:concat-map@0.0.1",
          "balanced-match": "npm:balanced-match@0.4.2"
        }
      },
      "npm:repeating@2.0.1": {
        "map": {
          "is-finite": "npm:is-finite@1.0.2"
        }
      },
      "npm:is-finite@1.0.2": {
        "map": {
          "number-is-nan": "npm:number-is-nan@1.0.1"
        }
      },
      "npm:babel-plugin-transform-react-jsx@6.8.0": {
        "map": {
          "babel-helper-builder-react-jsx": "npm:babel-helper-builder-react-jsx@6.18.0",
          "babel-runtime": "npm:babel-runtime@6.20.0",
          "babel-plugin-syntax-jsx": "npm:babel-plugin-syntax-jsx@6.18.0"
        }
      },
      "npm:babel-helper-builder-react-jsx@6.18.0": {
        "map": {
          "babel-runtime": "npm:babel-runtime@6.20.0",
          "esutils": "npm:esutils@2.0.2",
          "babel-types": "npm:babel-types@6.20.0",
          "lodash": "npm:lodash@4.17.2"
        }
      },
      "github:mobilexag/plugin-sass@0.5.1": {
        "map": {
          "autoprefixer": "npm:autoprefixer@6.5.4",
          "postcss": "npm:postcss@5.2.6",
          "sass.js": "npm:sass.js@0.9.13",
          "css-asset-copier": "npm:css-asset-copier@1.0.2",
          "reqwest": "github:ded/reqwest@2.0.5",
          "css-url-rewriter-ex": "npm:css-url-rewriter-ex@1.0.6",
          "fs": "npm:jspm-nodelibs-fs@0.2.0",
          "url": "npm:jspm-nodelibs-url@0.2.0",
          "path": "npm:jspm-nodelibs-path@0.2.0"
        }
      },
      "npm:css-asset-copier@1.0.2": {
        "map": {
          "babel-runtime": "npm:babel-runtime@6.20.0",
          "fs-extra": "npm:fs-extra@0.30.0"
        }
      },
      "npm:css-url-rewriter-ex@1.0.6": {
        "map": {
          "babel-runtime": "npm:babel-runtime@6.20.0"
        }
      },
      "npm:fs-extra@0.30.0": {
        "map": {
          "graceful-fs": "npm:graceful-fs@4.1.11",
          "path-is-absolute": "npm:path-is-absolute@1.0.1",
          "jsonfile": "npm:jsonfile@2.4.0",
          "rimraf": "npm:rimraf@2.5.4",
          "klaw": "npm:klaw@1.3.1"
        }
      },
      "npm:rimraf@2.5.4": {
        "map": {
          "glob": "npm:glob@7.1.1"
        }
      },
      "npm:glob@7.1.1": {
        "map": {
          "inherits": "npm:inherits@2.0.3",
          "minimatch": "npm:minimatch@3.0.3",
          "path-is-absolute": "npm:path-is-absolute@1.0.1",
          "fs.realpath": "npm:fs.realpath@1.0.0",
          "inflight": "npm:inflight@1.0.6",
          "once": "npm:once@1.4.0"
        }
      },
      "npm:inflight@1.0.6": {
        "map": {
          "once": "npm:once@1.4.0",
          "wrappy": "npm:wrappy@1.0.2"
        }
      },
      "npm:once@1.4.0": {
        "map": {
          "wrappy": "npm:wrappy@1.0.2"
        }
      },
      "npm:chalk@1.1.3": {
        "map": {
          "has-ansi": "npm:has-ansi@2.0.0",
          "ansi-styles": "npm:ansi-styles@2.2.1",
          "strip-ansi": "npm:strip-ansi@3.0.1",
          "escape-string-regexp": "npm:escape-string-regexp@1.0.5",
          "supports-color": "npm:supports-color@2.0.0"
        }
      },
      "npm:has-ansi@2.0.0": {
        "map": {
          "ansi-regex": "npm:ansi-regex@2.0.0"
        }
      },
      "npm:strip-ansi@3.0.1": {
        "map": {
          "ansi-regex": "npm:ansi-regex@2.0.0"
        }
      },
      "npm:postcss@5.2.6": {
        "map": {
          "supports-color": "npm:supports-color@3.1.2",
          "source-map": "npm:source-map@0.5.6",
          "chalk": "npm:chalk@1.1.3",
          "js-base64": "npm:js-base64@2.1.9"
        }
      },
      "npm:supports-color@3.1.2": {
        "map": {
          "has-flag": "npm:has-flag@1.0.0"
        }
      },
      "npm:autoprefixer@6.5.4": {
        "map": {
          "postcss": "npm:postcss@5.2.6",
          "normalize-range": "npm:normalize-range@0.1.2",
          "postcss-value-parser": "npm:postcss-value-parser@3.3.0",
          "browserslist": "npm:browserslist@1.4.0",
          "caniuse-db": "npm:caniuse-db@1.0.30000597",
          "num2fraction": "npm:num2fraction@1.2.2"
        }
      },
      "npm:browserslist@1.4.0": {
        "map": {
          "caniuse-db": "npm:caniuse-db@1.0.30000597"
        }
      }
    }
  }
});

SystemJS.config({
  packageConfigPaths: [
    "npm:@*/*.json",
    "npm:*.json",
    "github:*/*.json"
  ],
  map: {
    "bootstrap": "github:twbs/bootstrap@3.3.7",
    "array.prototype.fill": "npm:array.prototype.fill@1.0.1",
    "assert": "npm:jspm-nodelibs-assert@0.2.0",
    "babel-runtime": "npm:babel-runtime@6.20.0",
    "buffer": "npm:jspm-nodelibs-buffer@0.2.1",
    "child_process": "npm:jspm-nodelibs-child_process@0.2.0",
    "classnames": "npm:classnames@2.2.5",
    "collections": "npm:collections@5.0.5",
    "constants": "npm:jspm-nodelibs-constants@0.2.0",
    "crypto": "npm:jspm-nodelibs-crypto@0.2.0",
    "deepmerge": "npm:deepmerge@1.3.1",
    "domain": "npm:jspm-nodelibs-domain@0.2.0",
    "epic-component": "npm:epic-component@0.3.1",
    "epic-linker": "npm:epic-linker@1.0.6",
    "es5-sham-ie8": "npm:es5-sham-ie8@1.0.1",
    "es5-shim": "npm:es5-shim@4.5.9",
    "es6-promise": "npm:es6-promise@4.0.5",
    "es6-shim": "npm:es6-shim@0.35.2",
    "events": "npm:jspm-nodelibs-events@0.2.0",
    "flatten": "npm:flatten@1.0.2",
    "font-awesome": "npm:font-awesome@4.7.0",
    "fs": "npm:jspm-nodelibs-fs@0.2.0",
    "html5shiv": "npm:html5shiv@3.7.3",
    "http": "npm:jspm-nodelibs-http@0.2.0",
    "https": "npm:jspm-nodelibs-https@0.2.1",
    "intersperse": "npm:intersperse@1.0.0",
    "lodash": "npm:lodash@4.17.2",
    "memoizejs": "npm:memoizejs@0.1.1",
    "node-range": "npm:node-range@0.1.0",
    "object.assign": "npm:object.assign@4.0.4",
    "os": "npm:jspm-nodelibs-os@0.2.0",
    "path": "npm:jspm-nodelibs-path@0.2.1",
    "process": "npm:jspm-nodelibs-process@0.2.0",
    "querystring": "npm:jspm-nodelibs-querystring@0.2.0",
    "rc-tooltip": "npm:rc-tooltip@3.4.2",
    "react": "npm:react@15.4.1",
    "react-bootstrap": "npm:react-bootstrap@0.30.7",
    "react-dnd": "npm:react-dnd@2.1.4",
    "react-dnd-html5-backend": "npm:react-dnd-html5-backend@2.1.2",
    "react-dom": "npm:react-dom@15.4.1",
    "react-redux": "npm:react-redux@4.4.6",
    "redux": "npm:redux@3.6.0",
    "redux-saga": "npm:redux-saga@0.12.1",
    "reselect": "npm:reselect@2.5.4",
    "shuffle": "npm:shuffle@0.2.2",
    "stream": "npm:jspm-nodelibs-stream@0.2.0",
    "string_decoder": "npm:jspm-nodelibs-string_decoder@0.2.0",
    "superagent": "npm:superagent@3.1.0",
    "url": "npm:jspm-nodelibs-url@0.2.0",
    "util": "npm:jspm-nodelibs-util@0.2.1",
    "vm": "npm:jspm-nodelibs-vm@0.2.0",
    "zlib": "npm:jspm-nodelibs-zlib@0.2.2"
  },
  packages: {
    "npm:react@15.4.1": {
      "map": {
        "fbjs": "npm:fbjs@0.8.6",
        "loose-envify": "npm:loose-envify@1.3.0",
        "object-assign": "npm:object-assign@4.1.0"
      }
    },
    "npm:fbjs@0.8.6": {
      "map": {
        "loose-envify": "npm:loose-envify@1.3.0",
        "object-assign": "npm:object-assign@4.1.0",
        "promise": "npm:promise@7.1.1",
        "isomorphic-fetch": "npm:isomorphic-fetch@2.2.1",
        "ua-parser-js": "npm:ua-parser-js@0.7.12",
        "core-js": "npm:core-js@1.2.7"
      }
    },
    "npm:loose-envify@1.3.0": {
      "map": {
        "js-tokens": "npm:js-tokens@2.0.0"
      }
    },
    "npm:promise@7.1.1": {
      "map": {
        "asap": "npm:asap@2.0.5"
      }
    },
    "npm:isomorphic-fetch@2.2.1": {
      "map": {
        "whatwg-fetch": "npm:whatwg-fetch@2.0.1",
        "node-fetch": "npm:node-fetch@1.6.3"
      }
    },
    "npm:node-fetch@1.6.3": {
      "map": {
        "is-stream": "npm:is-stream@1.1.0",
        "encoding": "npm:encoding@0.1.12"
      }
    },
    "npm:encoding@0.1.12": {
      "map": {
        "iconv-lite": "npm:iconv-lite@0.4.15"
      }
    },
    "npm:jspm-nodelibs-stream@0.2.0": {
      "map": {
        "stream-browserify": "npm:stream-browserify@2.0.1"
      }
    },
    "npm:jspm-nodelibs-domain@0.2.0": {
      "map": {
        "domain-browserify": "npm:domain-browser@1.1.7"
      }
    },
    "npm:stream-browserify@2.0.1": {
      "map": {
        "inherits": "npm:inherits@2.0.3",
        "readable-stream": "npm:readable-stream@2.2.2"
      }
    },
    "npm:readable-stream@2.2.2": {
      "map": {
        "inherits": "npm:inherits@2.0.3",
        "core-util-is": "npm:core-util-is@1.0.2",
        "string_decoder": "npm:string_decoder@0.10.31",
        "buffer-shims": "npm:buffer-shims@1.0.0",
        "isarray": "npm:isarray@1.0.0",
        "process-nextick-args": "npm:process-nextick-args@1.0.7",
        "util-deprecate": "npm:util-deprecate@1.0.2"
      }
    },
    "npm:jspm-nodelibs-string_decoder@0.2.0": {
      "map": {
        "string_decoder-browserify": "npm:string_decoder@0.10.31"
      }
    },
    "npm:jspm-nodelibs-buffer@0.2.1": {
      "map": {
        "buffer": "npm:buffer@4.9.1"
      }
    },
    "npm:buffer@4.9.1": {
      "map": {
        "isarray": "npm:isarray@1.0.0",
        "base64-js": "npm:base64-js@1.2.0",
        "ieee754": "npm:ieee754@1.1.8"
      }
    },
    "npm:jspm-nodelibs-crypto@0.2.0": {
      "map": {
        "crypto-browserify": "npm:crypto-browserify@3.11.0"
      }
    },
    "npm:crypto-browserify@3.11.0": {
      "map": {
        "inherits": "npm:inherits@2.0.3",
        "browserify-cipher": "npm:browserify-cipher@1.0.0",
        "browserify-sign": "npm:browserify-sign@4.0.0",
        "create-ecdh": "npm:create-ecdh@4.0.0",
        "pbkdf2": "npm:pbkdf2@3.0.9",
        "create-hmac": "npm:create-hmac@1.1.4",
        "public-encrypt": "npm:public-encrypt@4.0.0",
        "diffie-hellman": "npm:diffie-hellman@5.0.2",
        "randombytes": "npm:randombytes@2.0.3",
        "create-hash": "npm:create-hash@1.1.2"
      }
    },
    "npm:jspm-nodelibs-os@0.2.0": {
      "map": {
        "os-browserify": "npm:os-browserify@0.2.1"
      }
    },
    "npm:browserify-sign@4.0.0": {
      "map": {
        "inherits": "npm:inherits@2.0.3",
        "create-hmac": "npm:create-hmac@1.1.4",
        "create-hash": "npm:create-hash@1.1.2",
        "browserify-rsa": "npm:browserify-rsa@4.0.1",
        "parse-asn1": "npm:parse-asn1@5.0.0",
        "elliptic": "npm:elliptic@6.3.2",
        "bn.js": "npm:bn.js@4.11.6"
      }
    },
    "npm:pbkdf2@3.0.9": {
      "map": {
        "create-hmac": "npm:create-hmac@1.1.4"
      }
    },
    "npm:create-hmac@1.1.4": {
      "map": {
        "inherits": "npm:inherits@2.0.3",
        "create-hash": "npm:create-hash@1.1.2"
      }
    },
    "npm:public-encrypt@4.0.0": {
      "map": {
        "randombytes": "npm:randombytes@2.0.3",
        "create-hash": "npm:create-hash@1.1.2",
        "browserify-rsa": "npm:browserify-rsa@4.0.1",
        "parse-asn1": "npm:parse-asn1@5.0.0",
        "bn.js": "npm:bn.js@4.11.6"
      }
    },
    "npm:diffie-hellman@5.0.2": {
      "map": {
        "randombytes": "npm:randombytes@2.0.3",
        "miller-rabin": "npm:miller-rabin@4.0.0",
        "bn.js": "npm:bn.js@4.11.6"
      }
    },
    "npm:create-hash@1.1.2": {
      "map": {
        "inherits": "npm:inherits@2.0.3",
        "sha.js": "npm:sha.js@2.4.8",
        "cipher-base": "npm:cipher-base@1.0.3",
        "ripemd160": "npm:ripemd160@1.0.1"
      }
    },
    "npm:browserify-cipher@1.0.0": {
      "map": {
        "browserify-des": "npm:browserify-des@1.0.0",
        "browserify-aes": "npm:browserify-aes@1.0.6",
        "evp_bytestokey": "npm:evp_bytestokey@1.0.0"
      }
    },
    "npm:browserify-des@1.0.0": {
      "map": {
        "inherits": "npm:inherits@2.0.3",
        "cipher-base": "npm:cipher-base@1.0.3",
        "des.js": "npm:des.js@1.0.0"
      }
    },
    "npm:browserify-rsa@4.0.1": {
      "map": {
        "randombytes": "npm:randombytes@2.0.3",
        "bn.js": "npm:bn.js@4.11.6"
      }
    },
    "npm:browserify-aes@1.0.6": {
      "map": {
        "inherits": "npm:inherits@2.0.3",
        "create-hash": "npm:create-hash@1.1.2",
        "evp_bytestokey": "npm:evp_bytestokey@1.0.0",
        "cipher-base": "npm:cipher-base@1.0.3",
        "buffer-xor": "npm:buffer-xor@1.0.3"
      }
    },
    "npm:parse-asn1@5.0.0": {
      "map": {
        "browserify-aes": "npm:browserify-aes@1.0.6",
        "create-hash": "npm:create-hash@1.1.2",
        "pbkdf2": "npm:pbkdf2@3.0.9",
        "evp_bytestokey": "npm:evp_bytestokey@1.0.0",
        "asn1.js": "npm:asn1.js@4.9.0"
      }
    },
    "npm:evp_bytestokey@1.0.0": {
      "map": {
        "create-hash": "npm:create-hash@1.1.2"
      }
    },
    "npm:create-ecdh@4.0.0": {
      "map": {
        "elliptic": "npm:elliptic@6.3.2",
        "bn.js": "npm:bn.js@4.11.6"
      }
    },
    "npm:elliptic@6.3.2": {
      "map": {
        "inherits": "npm:inherits@2.0.3",
        "bn.js": "npm:bn.js@4.11.6",
        "brorand": "npm:brorand@1.0.6",
        "hash.js": "npm:hash.js@1.0.3"
      }
    },
    "npm:miller-rabin@4.0.0": {
      "map": {
        "bn.js": "npm:bn.js@4.11.6",
        "brorand": "npm:brorand@1.0.6"
      }
    },
    "npm:sha.js@2.4.8": {
      "map": {
        "inherits": "npm:inherits@2.0.3"
      }
    },
    "npm:cipher-base@1.0.3": {
      "map": {
        "inherits": "npm:inherits@2.0.3"
      }
    },
    "npm:des.js@1.0.0": {
      "map": {
        "inherits": "npm:inherits@2.0.3",
        "minimalistic-assert": "npm:minimalistic-assert@1.0.0"
      }
    },
    "npm:asn1.js@4.9.0": {
      "map": {
        "inherits": "npm:inherits@2.0.3",
        "bn.js": "npm:bn.js@4.11.6",
        "minimalistic-assert": "npm:minimalistic-assert@1.0.0"
      }
    },
    "npm:hash.js@1.0.3": {
      "map": {
        "inherits": "npm:inherits@2.0.3"
      }
    },
    "npm:jspm-nodelibs-url@0.2.0": {
      "map": {
        "url-browserify": "npm:url@0.11.0"
      }
    },
    "npm:jspm-nodelibs-http@0.2.0": {
      "map": {
        "http-browserify": "npm:stream-http@2.5.0"
      }
    },
    "npm:stream-http@2.5.0": {
      "map": {
        "inherits": "npm:inherits@2.0.3",
        "readable-stream": "npm:readable-stream@2.2.2",
        "builtin-status-codes": "npm:builtin-status-codes@2.0.0",
        "to-arraybuffer": "npm:to-arraybuffer@1.0.1",
        "xtend": "npm:xtend@4.0.1"
      }
    },
    "npm:jspm-nodelibs-zlib@0.2.2": {
      "map": {
        "browserify-zlib": "npm:browserify-zlib@0.1.4"
      }
    },
    "npm:browserify-zlib@0.1.4": {
      "map": {
        "readable-stream": "npm:readable-stream@2.2.2",
        "pako": "npm:pako@0.2.9"
      }
    },
    "npm:url@0.11.0": {
      "map": {
        "punycode": "npm:punycode@1.3.2",
        "querystring": "npm:querystring@0.2.0"
      }
    },
    "npm:collections@5.0.5": {
      "map": {
        "weak-map": "npm:weak-map@1.0.5"
      }
    },
    "npm:object.assign@4.0.4": {
      "map": {
        "object-keys": "npm:object-keys@1.0.11",
        "function-bind": "npm:function-bind@1.1.0",
        "define-properties": "npm:define-properties@1.1.2"
      }
    },
    "npm:define-properties@1.1.2": {
      "map": {
        "object-keys": "npm:object-keys@1.0.11",
        "foreach": "npm:foreach@2.0.5"
      }
    },
    "npm:rc-tooltip@3.4.2": {
      "map": {
        "rc-trigger": "npm:rc-trigger@1.8.0"
      }
    },
    "npm:rc-trigger@1.8.0": {
      "map": {
        "rc-util": "npm:rc-util@4.0.2",
        "rc-align": "npm:rc-align@2.3.2",
        "babel-runtime": "npm:babel-runtime@6.20.0",
        "rc-animate": "npm:rc-animate@2.3.1"
      }
    },
    "npm:rc-align@2.3.2": {
      "map": {
        "rc-util": "npm:rc-util@3.4.1",
        "dom-align": "npm:dom-align@1.5.2"
      }
    },
    "npm:rc-util@4.0.2": {
      "map": {
        "add-dom-event-listener": "npm:add-dom-event-listener@1.0.1",
        "shallowequal": "npm:shallowequal@0.2.2"
      }
    },
    "npm:rc-util@3.4.1": {
      "map": {
        "add-dom-event-listener": "npm:add-dom-event-listener@1.0.1",
        "shallowequal": "npm:shallowequal@0.2.2",
        "classnames": "npm:classnames@2.2.5"
      }
    },
    "npm:babel-runtime@6.20.0": {
      "map": {
        "regenerator-runtime": "npm:regenerator-runtime@0.10.1",
        "core-js": "npm:core-js@2.4.1"
      }
    },
    "npm:rc-animate@2.3.1": {
      "map": {
        "css-animation": "npm:css-animation@1.3.0"
      }
    },
    "npm:add-dom-event-listener@1.0.1": {
      "map": {
        "object-assign": "npm:object-assign@4.1.0"
      }
    },
    "npm:shallowequal@0.2.2": {
      "map": {
        "lodash.keys": "npm:lodash.keys@3.1.2"
      }
    },
    "npm:css-animation@1.3.0": {
      "map": {
        "component-classes": "npm:component-classes@1.2.6"
      }
    },
    "npm:lodash.keys@3.1.2": {
      "map": {
        "lodash._getnative": "npm:lodash._getnative@3.9.1",
        "lodash.isarguments": "npm:lodash.isarguments@3.1.0",
        "lodash.isarray": "npm:lodash.isarray@3.0.4"
      }
    },
    "npm:component-classes@1.2.6": {
      "map": {
        "component-indexof": "npm:component-indexof@0.0.3"
      }
    },
    "npm:react-bootstrap@0.30.7": {
      "map": {
        "invariant": "npm:invariant@2.2.2",
        "dom-helpers": "npm:dom-helpers@2.4.0",
        "classnames": "npm:classnames@2.2.5",
        "warning": "npm:warning@3.0.0",
        "babel-runtime": "npm:babel-runtime@6.20.0",
        "react-prop-types": "npm:react-prop-types@0.4.0",
        "uncontrollable": "npm:uncontrollable@4.0.3",
        "react-overlays": "npm:react-overlays@0.6.10",
        "keycode": "npm:keycode@2.1.7"
      }
    },
    "npm:react-prop-types@0.4.0": {
      "map": {
        "warning": "npm:warning@3.0.0"
      }
    },
    "npm:uncontrollable@4.0.3": {
      "map": {
        "invariant": "npm:invariant@2.2.2"
      }
    },
    "npm:react-overlays@0.6.10": {
      "map": {
        "classnames": "npm:classnames@2.2.5",
        "dom-helpers": "npm:dom-helpers@2.4.0",
        "react-prop-types": "npm:react-prop-types@0.4.0",
        "warning": "npm:warning@3.0.0"
      }
    },
    "npm:invariant@2.2.2": {
      "map": {
        "loose-envify": "npm:loose-envify@1.3.0"
      }
    },
    "npm:react-dom@15.4.1": {
      "map": {
        "loose-envify": "npm:loose-envify@1.3.0",
        "object-assign": "npm:object-assign@4.1.0",
        "fbjs": "npm:fbjs@0.8.6"
      }
    },
    "npm:warning@3.0.0": {
      "map": {
        "loose-envify": "npm:loose-envify@1.3.0"
      }
    },
    "npm:react-dnd@2.1.4": {
      "map": {
        "dnd-core": "npm:dnd-core@2.0.2",
        "invariant": "npm:invariant@2.2.2",
        "lodash": "npm:lodash@4.17.2",
        "disposables": "npm:disposables@1.0.1"
      }
    },
    "npm:dnd-core@2.0.2": {
      "map": {
        "invariant": "npm:invariant@2.2.2",
        "lodash": "npm:lodash@4.17.2",
        "asap": "npm:asap@2.0.5",
        "redux": "npm:redux@3.6.0"
      }
    },
    "npm:redux@3.6.0": {
      "map": {
        "loose-envify": "npm:loose-envify@1.3.0",
        "lodash": "npm:lodash@4.17.2",
        "lodash-es": "npm:lodash-es@4.17.2",
        "symbol-observable": "npm:symbol-observable@1.0.4"
      }
    },
    "npm:react-dnd-html5-backend@2.1.2": {
      "map": {
        "lodash": "npm:lodash@4.17.2"
      }
    },
    "npm:react-redux@4.4.6": {
      "map": {
        "lodash": "npm:lodash@4.17.2",
        "invariant": "npm:invariant@2.2.2",
        "loose-envify": "npm:loose-envify@1.3.0",
        "hoist-non-react-statics": "npm:hoist-non-react-statics@1.2.0"
      }
    },
    "npm:superagent@3.1.0": {
      "map": {
        "readable-stream": "npm:readable-stream@2.2.2",
        "component-emitter": "npm:component-emitter@1.2.1",
        "debug": "npm:debug@2.3.3",
        "mime": "npm:mime@1.3.4",
        "cookiejar": "npm:cookiejar@2.1.0",
        "extend": "npm:extend@3.0.0",
        "form-data": "npm:form-data@2.1.2",
        "methods": "npm:methods@1.1.2",
        "formidable": "npm:formidable@1.0.17",
        "qs": "npm:qs@6.3.0"
      }
    },
    "npm:form-data@2.1.2": {
      "map": {
        "asynckit": "npm:asynckit@0.4.0",
        "combined-stream": "npm:combined-stream@1.0.5",
        "mime-types": "npm:mime-types@2.1.13"
      }
    },
    "npm:debug@2.3.3": {
      "map": {
        "ms": "npm:ms@0.7.2"
      }
    },
    "npm:combined-stream@1.0.5": {
      "map": {
        "delayed-stream": "npm:delayed-stream@1.0.0"
      }
    },
    "npm:mime-types@2.1.13": {
      "map": {
        "mime-db": "npm:mime-db@1.25.0"
      }
    },
    "npm:epic-linker@1.0.6": {
      "map": {
        "babel-runtime": "npm:babel-runtime@6.20.0"
      }
    },
    "npm:font-awesome@4.7.0": {
      "map": {
        "css": "github:systemjs/plugin-css@0.1.32"
      }
    },
    "github:twbs/bootstrap@3.3.7": {
      "map": {
        "jquery": "npm:jquery@3.1.1"
      }
    }
  }
});
