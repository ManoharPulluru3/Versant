/**
 * Runs before Metro / native runs.
 * On Linux, React Native DevTools aborts unless chrome-sandbox is setuid-root.
 * Passing --no-sandbox on the command line is rejected by the DevTools argument
 * parser, so the window never opens. Disable the sandbox through the environment
 * instead.
 */
const fs = require('fs')
const path = require('path')

const target = path.join(
  __dirname,
  '../node_modules/@react-native/debugger-shell/dist/node/index.js',
)
const marker = '/* versant:linux-devtools-no-sandbox */'
const envNeedle = 'const { ELECTRON_RUN_AS_NODE: _, ...env } = process.env;'
const badSpawn =
  'const child = spawn(binaryPath, [...baseArgs, "--no-sandbox", "--disable-setuid-sandbox", ...args],'
const goodSpawn = 'const child = spawn(binaryPath, [...baseArgs, ...args],'

if (process.platform === 'linux' && fs.existsSync(target)) {
  let source = fs.readFileSync(target, 'utf8')
  if (source.includes(badSpawn)) {
    source = source.replace(badSpawn, goodSpawn)
  }
  source = source.replace(/\n\s*\/\* versant:linux-devtools-no-sandbox \*\/\n/g, '\n')
  source = source.replace(/\n\s*env\.ELECTRON_DISABLE_SANDBOX = "1";\n/g, '\n')
  if (!source.includes(envNeedle)) {
    console.warn('prepare-dev: debugger-shell env site not found; DevTools patch skipped')
  } else {
    source = source.replace(
      envNeedle,
      `${envNeedle}\n    ${marker}\n    env.ELECTRON_DISABLE_SANDBOX = "1";`,
    )
    fs.writeFileSync(target, source)
    console.log('prepare-dev: DevTools will launch with ELECTRON_DISABLE_SANDBOX')
  }
}

console.log('prepare-dev: ok')
