# atom-autotype package

_Scriptable_ autotyping of text, one character at a time.

![A screenshot of your package](https://f.cloud.github.com/assets/69169/2290250/c35d867a-a017-11e3-86be-cd7c5bf3ff9b.gif)

I use it in combination with:

- https://github.com/lexcast/screen-recorder
- or https://github.com/colinkeenan/silentcast ?

## Status

This package is not yet complete nor fully tested.

This Readme and the code need some cleanup.

## Features

- The text in the clipboard is typed one character at a time
- The indents are ignored and recreated according the current settings
- You can give commands by including them in `{% ... %}`
- The commands are inspired by Vi, are listed below and are separated by a dash (`-`).
- The commands list must be on its own line. If you don't want it to start a new line add a dash (`-`) to its starting tag: `{%- ... %}`

## List of commands

The commands are inspired by VI. Here is a list of the commands and the the matching [atom actions](https://atom.io/docs/api/v1.24.0/TextEditor) called:

- ``: insertText()
- ``: insertNewLine()
- ``: delete()
- ``: backspace()
- ``: upperCase() --> gu?
- ``: lowerCase()
- `O`: insertNewlineAbove()
- `o`: insertNewlineBelow()
- ``: deleteToBeginningOfWord()
- ``: deleteToEndOfWord()
- ``: deleteToEndOfLine()
- ``: deleteToBeginningOfLine()
- ``: deleteLine()
- `gg`: moveToTop()
- `G`: moveToBottom()
- `j`: moveDown([lineCount])
- ``: moveLeft([columnCount])
- ``: moveRight([columnCount])
- `^`: moveToFirstCharacterOfLine() 
- `0`: moveToBeginningOfLine() 
- `$`: moveToEndOfLine() 
- ``: moveToBeginningOfWord() 
- ``: moveToEndOfWord() 
- ``: getSelectedText()
- ``: selectUp([rowCount]) 
- ``: selectDown([rowCount]) 
- ``: selectLeft([columnCount]) 
- ``: selectRight([columnCount]) 
- ``: selectToBeginningOfLine() 
- ``: selectToFirstCharacterOfLine() 
- ``: selectToEndOfLine() 
- ``: selectToBeginningOfWord() 
- ``: selectToEndOfWord() 
- ``: selectToPreviousWordBoundary() 
- ``: selectToNextWordBoundary() 
- ``: selectToBeginningOfNextWord() 
- ``: copySelectedText() 
- ``: cutSelectedText() 
- ``: pasteText([options]) 

Further commands to be defined:

- show current line at the top/bottom/middle of the pane
  - see https://atom.io/packages/center-line

## Usage

As an example, copy the following script (a small Lua snippet):

```
for i = 0, 100 do
end
{%- O %}
    print("abc")
{%- G %}
```

Create a file with the `.lua` extension and run the script with `ctrl-alt-a`

The result will be:

![]()

First, two lines are written
```.lua
for i = 0, 10 do
end
```

Then a new line is created above the current one:

```
{%- O %}
```

The cursor now is in the new empty line, where the `print()` command is rendered:

```
print("abc")
```

The line is indented following the current context.

Finally, the cursor goes to the end of the file:

```
{%- G %}
```

## Options

You can set a few options by adding them at in the first line of the script:

```
{= "delay":200 =}
```

## Stopping the script

The script can be stopped at any time by pressing the `Esc` key.


## Testing outside of Atom

<https://blog.david-reid.com/2016/04/16/command-line-babel/>

```sh
$ npm install --save-dev babel-cli
$ npm install --save-dev babel-preset-es2015
```

then you can run the script as

```sh
$ ./node_modules/.bin/babel-node --presets es2015 test
```

## References and notes

- [Generate your first package](https://blog.eleven-labs.com/en/create-atom-package/)
- [Building your first Atom plugin](https://github.com/blog/2231-building-your-first-atom-plugin)
- https://github.com/azat-co/copy-paste: Atom package for pasting code with delay from where I took part of the inspiration
- https://github.com/gu-fan/autotype.vim: scriptable autotype for vim, from where I took even more inspiration (including the syntax for the commands)
- The [API Documentation](https://atom.io/docs/api/v1.24.0)
- The [Atom Flight Manual](http://flight-manual.atom.io/)
- https://atom.io/packages/screenshot
- installing a package from github:

  ```sh
  git clone <package-repo>
	cd package-name
	apm link .
	apm install
  ```

	`apm link` will create a symbolic link from the package to the `~/.atom/packages` folder.

- png screenshot of an atom area:
  ```js
		var fs = require('fs')
    let rect = {x:100, y:30, width:400, height:200}
		window.capturePage(rect, function(image) {
			fs.writeFile('/tmp/test.png', image.toPNG(), function (err) {
            if (err)
                throw err;
            console.log('It\'s saved!');
        });
    })
	```

## Todo

- add a (optional?) delay between the commands (`{%-+`, where both `-` and `+` are optional)
- add two possible parameters for the commands:
  - `+`: separator for the parameter of the command
  - `*`: repeating the command
- create another package that calls this script and the screen cast one...
  - `atom.commands.dispatch(atom.views.getView(atom.workspace), "name:command");`
  - see the screen-recorder `package.json`
  - [Using a service from another package support](https://discuss.atom.io/t/using-a-service-from-another-package/20645)
- create a new package for setting up the environment:
  - size of the pane to be recorded
  - zoom level
    - https://discuss.atom.io/t/reset-zoom-on-text/8664/2
- create an own (simpler) pane recorder
  - without the tabs
  - block the recording if the pane is too big
  - code:
    ```js
    pane = atom.workspace.getActivePane()
    paneElement = atom.views.getView(pane)
    r = paneElement.getBoundingClientRect()
    // r.left, r.top,  r.right - r.left, r.bottom - r.top
    ```
- see if we can tweak/get https://github.com/lexcast/screen-recorder to also have a "textarea" mode
