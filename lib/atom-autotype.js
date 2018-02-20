'use babel';

import AtomAutotype from './atom-autotype-code'
import { CompositeDisposable } from 'atom'

export default {

  subscriptions: null,

  activate(state) {
    this.autotype = new AtomAutotype();

    this.subscriptions = new CompositeDisposable();
    this.stopping

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom-autotype:start': () => this.start(),
      'atom-autotype:stop': () => this.stop()
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  // TODO: probably, remove the async from here and call an async function from start... and wait for it to finish?
  async start() {
    this.stopping = false
    let autocomplete = atom.config.get('autocomplete-plus.enableAutoActivation')
    atom.config.set('autocomplete-plus.enableAutoActivation', false)

    let editor
    if (editor = atom.workspace.getActiveTextEditor()) {
      /*
			let script = `for i = 0, 10 do
      end
      {%- ^-k-o %}
          print("abc")
      {%- 0-j %}`
      */

      let script = atom.clipboard.read()
      // console.log(script)

      let config = {
        delay: 200
      }
      if (script.startsWith('{=')) {
        let scriptConfig
        [scriptConfig, script] = script.substr(2).split('=}\n')
        if (typeof script == 'undefined') {
          script = scriptConfig
        } else {
          // console.log(scriptConfig)
          scriptConfig = JSON.parse('{'+scriptConfig +'}')
          for( let key of Object.keys(scriptConfig)) {
            // console.log(key, scriptConfig[key])
            config[key] = scriptConfig[key]
          }
        }
      }

      this.autotype.setScript(script)

      // https://stackoverflow.com/a/39914235/5239250
      const timer = ms => new Promise( res => setTimeout(res, ms))

      let firstLine = true
      let commandWithNewline = true

      let delay = config.delay +  Math.random() * config.delay / 4
      parse:
      for (line of this.autotype.getLines()) {
        if (this.autotype.isCommand(line)) {
          this.autotype.processCommands(line)
        } else {
          if (!this.autotype.isLastCommandInline() && !firstLine) {
            this.autotype.doAction("\n")
          }
          for (c of line) {
            editor.insertText(c);
            await timer(delay) // wait 0.1 seconds
            if (this.stopping) {
              break parse
            }
          }
        }
        firstLine = false
      }
    }
    atom.config.set('autocomplete-plus.enableAutoActivation', autocomplete)
  },

  stop() {
    this.stopping = true;
  }

};
