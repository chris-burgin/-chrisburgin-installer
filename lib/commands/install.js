// library import
const fs = require("fs-extra")
const path = require("path")
const chalk = require("chalk")
const npm = require("npm")

// installer entry point that executes multiple installers
const install = async () =>
  new Promise(async (resolve, reject) => {
    try {
      log("Moving Configs...")

      // eslint
      await eslint()
      await eslintignore()
      logG("eslint ✓")

      // prettier
      await prettier()
      await prettierIgnore()
      logG("prettier ✓")

      // packages
      log("Installing Packages...")
      await packages()

      resolve()
    } catch (e) {
      reject(e)
    }
  })

// installers
// eslint
const eslint = async () =>
  fs.copy(current("../../configs/.eslintrc"), join(process.cwd(), ".eslintrc"))

const eslintignore = async () =>
  fs.copy(
    current("../../configs/.eslintignore"),
    join(process.cwd(), ".eslintignore")
  )

// prettier
const prettier = async () =>
  fs.copy(
    current("../../configs/prettier.config.js"),
    join(process.cwd(), "prettier.config.js")
  )

const prettierIgnore = async () =>
  fs.copy(
    current("../../configs/.prettierignore"),
    join(process.cwd(), ".prettierignore")
  )

// packages
const packages = async () =>
  new Promise(resolve => {
    npm.load(() => {
      npm.commands.install(
        ["@chrisburgin/eslint-config", "@chrisburgin/prettier-config"],
        err => (err ? reject() : resolve())
      )
    })
  })

// helpers
const current = (...args) => path.join(__dirname, ...args)
const join = (...args) => path.join(...args)
const log = msg => console.log(chalk.blue(msg))
const logG = msg => console.log(chalk.green(msg))

// export
module.exports = install
