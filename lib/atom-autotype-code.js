'use babel';

import Commands from './atom-autotype-commands';

export default class AtomAutotypeCode {

  constructor() {
    this.lines = []
    this.actions = this.getActions()
    this.commands = new Commands()
  }

  getActions() {
    let editor
    if (editor = atom.workspace.getActiveTextEditor()) {
      return {
        '^':  () => editor.moveToFirstCharacterOfLine(),
        '$':  () => editor.moveToEndOfLine(),
        '0':  () => editor.moveToBeginningOfLine(),
        'j':  () => editor.moveDown(),
        'k':  () => editor.moveUp(),
        'gg': () => editor.moveToTop(),
        'G':  () => editor.moveToBottom(),
        'o':  () => editor.insertNewlineBelow(),
        'O':  () => editor.insertNewlineAbove(),
        '\n': () => editor.insertNewline(),
      }
    } else {
      return {}
    }
  }

  setScript(script) {
    let lines = script.split(/\r?\n/)
    this.lines = lines.map(i => i.trim())
  }

  getLines() {
    return this.lines
  }

  doAction(action) {
    if (action in this.actions) {
      this.actions[action]()
    }
  }

  isCommand(line) {
      return line.startsWith('{%') && line.endsWith('%}')
  }

  isLastCommandInline() {
    let result = this.commands.startsInline
    this.commands.startsInline = false;
    return result
  }

  getCommands(line) {
    this.commands = new Commands(line)
    return this.commands.get()
  }

  processCommands(line) {
    for (command of this.getCommands(line)) {
      if (command in this.actions) {
        this.actions[command]()
      }
    }
  }

  // Tear down any state and detach
  destroy() {
  }
}
