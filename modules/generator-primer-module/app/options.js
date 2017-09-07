const chalk = require("chalk")
const fse = require("fs-extra")

const capitalize = require("./lib/capitalize")
const stripPrimerPrefix = require("./lib/strip-prefix")

const META_PACKAGES = [
  "primer-css",
  "primer-core",
  "primer-product",
  "primer-marketing",
]

const MODULE_TYPES = [
  "components",
  "objects",
  "utilities",
  "meta",
  "tools",
]

/**
 * Primer module options
 *
 * Each key is the name of the option in the generator's
 * `this.options` hash, and should be an object with one or more
 * of the following keys:
 *
 * - "argument" indicates that this option is a positional
 *   argument to the `yo` CLI.
 *
 * - "option" indicates that this option an be passed via a
 *   `--name` flag to `yo`. For convenience, "_" characters are
 *   replaced with "-".
 *
 * - "prompt" will trigger a prompt for this option if it was not
 *   already set via positional argument or CLI option.
 */
module.exports = {

  // the module name in npm
  "module": {
    argument: {
      desc: "The name of your module (on npm)",
      type: String,
      required: false,
    },
    prompt: {
      name: "module",
      message: "What should the module name be (on npm)?",
      type: "input",
      // the name must include primer somewhere
      // FIXME: this should be validate in configuring()
      validate: (name) => name.includes("primer")
    },
  },

  // the module type (currently only CSS is supported)
  "type": {
    option: {
      type: String,
      default: "css",
    },
  },

  // the human-readable title of the module
  "title": {
    option: {
      type: String,
      alias: "t",
    },
    prompt: {
      message: "What should the title be (for humans)?",
      type: "input",
      default: ({module}) => {
        return capitalize(
          stripPrimerPrefix(module || this.options.module)
        )
      },
    },
  },

  "description": {
    option: {type: String},
    prompt: {
      message: [
        "Describe your module in a single sentence.",
        chalk.yellow("(This will go into the package.json and README.md.)"),
      ].join("\n"),
      type: "input",
      default: "TODO: fill in this description later",
    },
  },

  "category": {
    option: {type: String},
    prompt: {
      message: "Which meta-package does this belong to?",
      type: "list",
      choices: [
        "core",
        "product",
        "marketing",
        "meta",
        ""
      ],
      default: "core"
    },
  },

  "module_type": {
    option: {type: String},
    prompt: {
      message: "What type of module is this?",
      type: "list",
      choices: MODULE_TYPES,
      default: 0
    },
  },

  "dependents": {
    // This allows users (and our tests) to pass --no-dependents
    // to disable updating dependent packages. XXX Note that the
    // prompt will be skipped if --dependents is passed!
    option: {
      desc: "Update dependent package.json files (use --no-dependents to disable)",
      type: Boolean,
    },
    prompt: {
      message: "Which meta-package(s) should we add this to?",
      type: "checkbox",
      choices: META_PACKAGES,
      default: ({category}) => {
        const pkgs = ["primer-css"]
        return (category === "meta")
          ? pkgs
          : pkgs.concat(`primer-${category}`)
      },
    },
  },

  "docs": {
    option: {
      type: String,
    },
    prompt: {
      type: "input",
      message: [
        "Where can we find the docs?",
        chalk.yellow("(We'll read this file from the path you provide.)"),
      ].join("\n"),
      validate: (filePath) => {
        if (!filePath) {
          return true
        }
        return fse.exists(filePath)
          .then(exists => {
            return exists ||
              `No such file: "${filePath}" in ${process.cwd()}`
          })
      },
    },
  },

  "status": {
    option: {
      type: String,
      default: "Experimental",
    },
  },

  "todo": {
    option: {
      desc: "Output TODO reminders (use --no-todo to disable)",
      type: Boolean,
      default: true,
    },
  },

  "verbose": {
    option: {
      desc: "Ouput more useful debugging info",
      type: Boolean,
      alias: "v",
    },
  }

}