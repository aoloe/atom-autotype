'use babel';

export default class AtomAutotypeCommands {

  constructor(line) {
    this.startsInline = false
    this.commands = typeof line == "undefined" ? [] : this.commands = this.parse(line)
  }

  parse(line) {
    line = line.slice(2, -2)

    if (line.charAt(0) == '-') {
      this.startsInline = true
      line = line.substr(1)
    }

    line = line.trim()

    return line.split('-')
  }

  get() {
    return this.commands
  }

  destroy() {
  }
}
