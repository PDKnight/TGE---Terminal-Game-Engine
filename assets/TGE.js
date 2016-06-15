// Terminal Game Engine by PDKnight. (c) 2016.

// compressed Mozilla's Function.prototype.bind polyfill.
// taken from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
Function.prototype.bind=(function(){}).bind||function(b){if(typeof this!=="function"){throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");}function c(){}var a=[].slice,f=a.call(arguments,1),e=this,d=function(){return e.apply(this instanceof c?this:b||window,f.concat(a.call(arguments)));};c.prototype=this.prototype;d.prototype=new c();return d;};


var TGE = function(environment, config, commands)
{
    this.version = '1.1';
    this.cmds = {
        history: [],
        count: 0,
        current: 0
    };
    //this.cmdListeners = [];

    var addEvent = function(el, name, func)
    {
        if (el.addEventListener)
            el.addEventListener(name, func, false);
        else if (el.attachEvent)
            el.attachEvent('on' + name, func);
        else el['on' + name] = func;
    },
    sel = function(s, b)
    {
        return b
            ? document.querySelectorAll(s)
            : document.querySelector(s);
    },
    log = function(s, type)
    {
        terminal.innerHTML += 
            '<div>'
            + (type == 'cmd' ? TGE.path.get() : '')
            + (type == 'cmd' ? this.config.game.terminal : '')
            + (type == 'cmd'
                ? s.replaceHTMLCharacters()
                : s.replaceHTMLCharacters()
                    .replaceChatColors()
            ).nl2br().trim()
            + '</div>';
        document.body.scrollTop = document.body.scrollHeight;
    }.bind(this),
    printCommands = function()
    {
        var cmds = Object.keys(this.commands), i;
        log('\n----- Commands ------------------------------');
        log(' ?,help - Shows this help.');
        for (i=0; i < cmds.length; i++)
        {
            if (this.commands[cmds[i]].hasOwnProperty('description'))
                log(' ' + cmds[i]
                    + ' - '
                    + this.commands[cmds[i]].description
                );
        }
    }.bind(this),
    // decide what to do with command and args
    command = function(cmdArgs)
    {
        var cmd = cmdArgs[0],
            args = cmdArgs[1], i, win;

        if (cmd.length == 0) return;
        if (cmd == 'github')
            win = window.open('https://github.com/PDKnight/', '_blank'),
            win.focus();
        else {
            if (Object.keys(this.commands).length == 0)
                log('[Warning] There are no commands set in engine! Type "github" to open TGE github page.');
            if (this.commands.hasOwnProperty(cmd)) {
                if (!this.commands[cmd].hasOwnProperty('description'))
                    log('[Warning] The command has no description set yet!');
                if (!this.commands[cmd].hasOwnProperty('exec'))
                    log('[Warning] The command has no exec function set yet!');
            }
        }

        if (cmd == '?' || cmd == 'help')
        {
            printCommands();
            return;
        }

        if (this.commands.hasOwnProperty(cmd))
        {
            if (this.commands[cmd].hasOwnProperty('exec'))
                this.commands[cmd].exec(args);
            else
                this.log('&c[Error] The command "' + cmd + '" has no exec function set yet.');
        }
        else
            this.log('&c[Error] Unknown command "' + cmd + '".');


    }.bind(this),
    // process an input (as string) to an array with cmd and args
    processCmdInput = function(value)
    {
        var cmd, args;
        cmd = args = '';

        value = value.replace(/\s+/, ' ').split(' ');

        cmd = value[0];
        value.shift();
        args = value;

        return [cmd, args];
    },


    init = function()
    {
        // trim
        String.prototype.trim = function()
        {
            return this.replace(/^\s*|\s*$/g, '');
        };
        // make safe HTML
        String.prototype.replaceHTMLCharacters = function()
        {
            return this.replace(/<|>|&| /g,function(a){
                return {
                    '<': '&lt;',
                    '>': '&gt;', 
                    '&': '&amp;',
                    ' ': '&nbsp;'
                }[a]
            });
        };
        // replace all \n's with <br> tags
        String.prototype.nl2br = function()
        {
            return this.replace(/\r|\n/g, '<br>');
        };
        // replace &[0-9a-f] with colors
        String.prototype.replaceChatColors = function() {
            var w = window;
            return this.replace(/&amp;(r|[0-9a-f])/g, function(a)
            {
                return '<font color="#'+{
                    '0': '000',
                    '1': '00A',
                    '2': '0A0',
                    '3': '0AA',
                    '4': 'A00',
                    '5': 'A0A',
                    '6': 'FA0',
                    '7': 'AAA',
                    '8': '555',
                    '9': '55F',
                    'a': '5F5',
                    'b': '5FF', 
                    'c': 'F55',
                    'd': 'F5F',
                    'e': 'FF5',
                    'f': 'FFF',
                    'r': config.game.textColor.slice(1)
                }[a[a.length-1]] + '">'
            });
        };

        // setting environment
        var environmentElement = sel(this.environment);
        if (!environmentElement)
            throw new Error('Unknown element selector '
                + this.environment
                + '. Please make sure you haven\'t make any mistake.');

        var addElement = function(tagName, params, to)
        {
            var el = document.createElement(tagName);
            for (param in params)
                if (param == 'inner')
                    el.innerHTML = params[param];
                else
                    el[param] = params[param];

            if (to)
                to.appendChild(el);
            else
                environmentElement.appendChild(el);
        }
        
        addElement('div', {id: 'terminal'});
        addElement('span', {
            id: 'cmdline', 
            inner: TGE.path.get() 
                + this.config.game.terminal.replaceHTMLCharacters()
        });
        addElement('div', {id: 'cursor', className: 'off'});
        addElement('input', {id: 'input', type: 'text'});

        var input = sel(this.environment + ' #input');


        document.title = this.config.game.name;
        document.body.style.background = this.config.game.bgColor;
        document.body.style.color = this.config.game.textColor;
        document.body.style.overflow = this.config.game.scrollable
            ? '' : 'hidden';

        log(this.config.welcome
                .replace(/%version%/g, this.version)
        );


        // input must be still focused
        var focusFn = function()
        {
            input.focus();
            setTimeout(function()
            {
                input.selectionStart = input.selectionEnd = 100000;
            }, 0);
        };

        addEvent(document, 'keydown', focusFn);
        addEvent(document, 'keyup', focusFn);
        addEvent(document, 'click', focusFn);
        addEvent(input, 'blur', focusFn);

        // determine if we pressed a key
        var setCmdLine = function(e)
        {
            var val = input.value.trim(),
                key = e.keyCode || e.which;

            // if user presses enter key to execute command
            if (key == 13 && val.length > 0)
            {
                input.value = '';
                log(val, 'cmd');

                var cmdArgs = processCmdInput(val);
                command(cmdArgs);

                this.cmds.history.push(val);
                this.cmds.count++;
                this.cmds.current = this.cmds.count;
            }

            if (e.type == 'keydown')
            {
                switch (key)
                {
                    case 38: // arrow up
                        if (this.cmds.current > 0)
                        {
                            this.cmds.current--;
                            input.value = this.cmds.history [
                                this.cmds.current
                            ];
                        }
                    break;
                    case 40: // arrow down
                        if (this.cmds.current < this.cmds.count - 1)
                        {
                            this.cmds.current++;
                            input.value = this.cmds.history [
                                this.cmds.current - 1
                            ];
                        }
                        else
                        {
                            input.value = '';
                            if (this.cmds.current == this.cmds.count - 1)
                                this.cmds.current++;
                        }
                    break;
                }
            }

            // prevent going back in browser history using backspace
            if (key == 8 && input.value.length == 0)
                e.preventDefault 
                    ? e.preventDefault() 
                    : e.returnValue = false,
                input.focus();

            sel(this.environment + ' #cmdline').innerHTML = 
                TGE.path.get()
                + this.config.game.terminal.replaceHTMLCharacters() 
                    + input.value.replaceHTMLCharacters();
        }.bind(this);
        addEvent(input, 'keydown', setCmdLine);
        addEvent(input, 'keyup', setCmdLine);


        XXHR().request(this.config.map + this.getUrlPath(),
            function(r) {
                var response = JSON.parse(r.toString()),
                    type = response.type,
                    data = response.data,
                    dirData = data.dirs,
                    message = data.message;

                if (data.hasOwnProperty('items')
                        && !data.items)
                {
                    TGE.getInstance().log('&c[Error] You need an item to go there. Use "pick" command to pick an item.');
                }

                switch (type) {
                    case 'map':
                        if (data.hasOwnProperty('text')
                                && data.text.length > 0)
                            TGE.getInstance().log(data.text.join('\n') + '\n');
                    break;
                    case 'error':
                    default:
                        TGE.getInstance().log(
                            '&c[Error] ' 
                            + (
                                type == 'error' 
                                    ? message 
                                    : 'Unknown error type: ' + type
                            )
                        );
                    break;
                }
            }, function(err) {
                TGE.getInstance().log('&c[Error] An error happened with AJAX request. Message: '
                    + err);
            }
        );


        // cursor animation
        setInterval(function()
        {
            var newClass = (cursor.className || 'off') == 'on' 
                    ? 'off' : 'on';
            cursor.className = newClass;
        }, 600);
    }.bind(this);

    this.environment = environment;
    this.config = config;
    this.commands = commands;
    this.log = log;
    this.sel = sel;

    this.items = [];
    this.getUrlPath = function()
    {
        return '?dir='
            + (TGE.path.path || 'home')
            + '&items='
            + this.items.join(',');
    }.bind(this);

    this.getUrlItems = function()
    {
        return '&items='
            + this.items.join(',');
    }.bind(this);

    init();

};

TGE.getInstance = function()
{
    return window[TGE.instanceName];
};
TGE.getInstanceName = function()
{
    return TGE.instanceName;
};
TGE.path = {
    pathPrefix: 'C:/',
    path: '',
    get: function()
    {
        return this.pathPrefix + this.path;
    },
    set: function(path)
    {
        this.path = path;
    },
    cd: function(path, dirs, i)
    {
        var pathSpl = path.split('/'),
            dirs = dirs || (pathSpl.length > 0 ? pathSpl : dirs);
        if (dirs.length > 1 
                && typeof i != 'number') // calling 1st time
        {
            this.cd(dirs[0], dirs, 0);
        }
        else if (path.length > 0)
        {
            if (path == '..')
            {   
                var splitPath = this.path.split('/');
                splitPath.pop();
                this.path = splitPath.join('/');

                var mapPath = TGE.getInstance().config.map;
                if (!mapPath)
                {
                    TGE.getInstance().log('[Warning] There is no map set in config file!');
                    return;
                }

                var AJAXpathDir = this.path;

                if (AJAXpathDir[0] == '/')
                    AJAXpathDir = AJAXpathDir.slice(1);

                XXHR().request(mapPath + '?dir=' 
                        + (AJAXpathDir || 'Home')
                        + TGE.getInstance().getUrlItems(),
                    function(r) {
                        var response = JSON.parse(r.toString()),
                            type = response.type,
                            data = response.data,
                            dirData = data ? data.dirs : [],
                            message = data ? data.message : [];

                        if (data.hasOwnProperty('items')
                                && !data.items)
                        {
                            TGE.getInstance().log('&c[Error] You need an item to go there. Use "pick" command to pick an item.');
                        }

                        switch (type) {
                            case 'map':
                                if (data.hasOwnProperty('text')
                                        && data.text.length > 0)
                                    TGE.getInstance().log(data.text.join('\n') + '\n');
                            break;
                            case 'error':
                            default:
                                TGE.getInstance().log(
                                    '&c[Error] ' 
                                    + (
                                        type == 'error' 
                                            ? message 
                                            : 'Unknown error type: ' + type
                                    )
                                );
                            break;
                        }

                        if (i < dirs.length - 1)
                            this.cd(dirs[i + 1], dirs, i + 1);
                    }.bind(this), function(err) {
                        TGE.getInstance().log('&c[Error] An error happened with AJAX request. Message: '
                            + err);
                    }
                );
            }
            else
            {
                var mapPath = TGE.getInstance().config.map;
                if (!mapPath)
                {
                    TGE.getInstance().log('[Warning] There is no map set in config file!');
                    return;
                }

                var AJAXpathDir = this.path + '/' + path;

                if (AJAXpathDir[0] == '/')
                    AJAXpathDir = AJAXpathDir.slice(1);

                XXHR().request(mapPath + '?dir=' 
                        + (AJAXpathDir || 'Home')
                        + TGE.getInstance().getUrlItems(), 
                    function(r) {
                        var response = JSON.parse(r.toString()),
                            type = response.type,
                            data = response.data,
                            dirData = data ? data.dirs : [],
                            message = data ? data.message : [];

                        if (data.hasOwnProperty('items')
                                && !data.items)
                        {
                            TGE.getInstance().log('&c[Error] You need an item to go there. Use "pick" command to pick an item.');
                        }

                        switch (type) {
                            case 'map':
                                if (dirData.length > 0)
                                {
                                    if (data.hasOwnProperty('text')
                                            && data.text.length > 0)
                                        TGE.getInstance().log(data.text.join('\n') + '\n');

                                    this.path += 
                                        // don't put / at the start if there was / at end
                                        (this.path.indexOf('/') == this.path.length - 1
                                            ? '' : '/') 
                                        + path;

                                    var TGEi = TGE.getInstance();

                                    TGEi.sel(TGEi.environment + ' #cmdline').innerHTML = 
                                            TGE.path.get() 
                                            + TGEi.config.game.terminal.replaceHTMLCharacters() 
                                            + TGEi.sel(TGEi.environment + ' #input')
                                                .value.replaceHTMLCharacters();
                                }
                            break;
                            case 'error':
                            default:
                                TGE.getInstance().log(
                                    '&c[Error] ' 
                                    + (
                                        type == 'error' 
                                            ? message 
                                            : 'Unknown error type: ' + type
                                    )
                                );
                            break;
                        }
                        if (i < dirs.length - 1)
                            this.cd(dirs[i + 1], dirs, i + 1);

                    }.bind(this), function(err) {
                        TGE.getInstance().log('&c[Error] An error happened with AJAX request. Message: '
                            + err);
                    }
                );
            }
        }
    }
};
