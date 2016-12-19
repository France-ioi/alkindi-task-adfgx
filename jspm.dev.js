SystemJS.config({
  map: {
    "babel": "npm:babel-core@6.21.0",
    "module": "npm:jspm-nodelibs-module@0.2.0",
    "core-js": "npm:core-js@2.4.1",
    "babel-plugin-transform-react-jsx": "npm:babel-plugin-transform-react-jsx@6.8.0",
    "plugin-babel": "npm:systemjs-plugin-babel@0.0.17",
    "normalize.css": "github:necolas/normalize.css@5.0.0",
    "css": "github:systemjs/plugin-css@0.1.32",
    "graceful-fs": "npm:graceful-fs@4.1.11"
  },
  packages: {
    "npm:babel-messages@6.8.0": {
      "map": {
        "babel-runtime": "npm:babel-runtime@6.20.0"
      }
    },
    "npm:babel-template@6.16.0": {
      "map": {
        "babel-runtime": "npm:babel-runtime@6.20.0",
        "babel-traverse": "npm:babel-traverse@6.21.0",
        "babel-types": "npm:babel-types@6.21.0",
        "lodash": "npm:lodash@4.17.2",
        "babylon": "npm:babylon@6.14.1"
      }
    },
    "npm:babel-helpers@6.16.0": {
      "map": {
        "babel-runtime": "npm:babel-runtime@6.20.0",
        "babel-template": "npm:babel-template@6.16.0"
      }
    },
    "npm:babel-register@6.18.0": {
      "map": {
        "babel-runtime": "npm:babel-runtime@6.20.0",
        "lodash": "npm:lodash@4.17.2",
        "babel-core": "npm:babel-core@6.21.0",
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
        "babel-helper-builder-react-jsx": "npm:babel-helper-builder-react-jsx@6.21.1",
        "babel-runtime": "npm:babel-runtime@6.20.0",
        "babel-plugin-syntax-jsx": "npm:babel-plugin-syntax-jsx@6.18.0"
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
    "npm:babel-core@6.21.0": {
      "map": {
        "babel-runtime": "npm:babel-runtime@6.20.0",
        "babel-generator": "npm:babel-generator@6.21.0",
        "babel-traverse": "npm:babel-traverse@6.21.0",
        "babel-helpers": "npm:babel-helpers@6.16.0",
        "babel-code-frame": "npm:babel-code-frame@6.20.0",
        "babel-types": "npm:babel-types@6.21.0",
        "babel-register": "npm:babel-register@6.18.0",
        "babel-template": "npm:babel-template@6.16.0",
        "debug": "npm:debug@2.4.5",
        "babylon": "npm:babylon@6.14.1",
        "lodash": "npm:lodash@4.17.2",
        "path-is-absolute": "npm:path-is-absolute@1.0.1",
        "minimatch": "npm:minimatch@3.0.3",
        "private": "npm:private@0.1.6",
        "slash": "npm:slash@1.0.0",
        "babel-messages": "npm:babel-messages@6.8.0",
        "json5": "npm:json5@0.5.1",
        "convert-source-map": "npm:convert-source-map@1.3.0",
        "source-map": "npm:source-map@0.5.6"
      }
    },
    "npm:babel-generator@6.21.0": {
      "map": {
        "babel-messages": "npm:babel-messages@6.8.0",
        "babel-runtime": "npm:babel-runtime@6.20.0",
        "lodash": "npm:lodash@4.17.2",
        "source-map": "npm:source-map@0.5.6",
        "babel-types": "npm:babel-types@6.21.0",
        "detect-indent": "npm:detect-indent@4.0.0",
        "jsesc": "npm:jsesc@1.3.0"
      }
    },
    "npm:babel-traverse@6.21.0": {
      "map": {
        "babel-code-frame": "npm:babel-code-frame@6.20.0",
        "babel-messages": "npm:babel-messages@6.8.0",
        "debug": "npm:debug@2.4.5",
        "invariant": "npm:invariant@2.2.2",
        "babel-runtime": "npm:babel-runtime@6.20.0",
        "babel-types": "npm:babel-types@6.21.0",
        "babylon": "npm:babylon@6.14.1",
        "lodash": "npm:lodash@4.17.2",
        "globals": "npm:globals@9.14.0"
      }
    },
    "npm:babel-types@6.21.0": {
      "map": {
        "babel-runtime": "npm:babel-runtime@6.20.0",
        "lodash": "npm:lodash@4.17.2",
        "esutils": "npm:esutils@2.0.2",
        "to-fast-properties": "npm:to-fast-properties@1.0.2"
      }
    },
    "npm:babel-helper-builder-react-jsx@6.21.1": {
      "map": {
        "babel-types": "npm:babel-types@6.21.0",
        "lodash": "npm:lodash@4.17.2",
        "babel-runtime": "npm:babel-runtime@6.20.0",
        "esutils": "npm:esutils@2.0.2"
      }
    },
    "npm:debug@2.4.5": {
      "map": {
        "ms": "npm:ms@0.7.2"
      }
    }
  }
});
