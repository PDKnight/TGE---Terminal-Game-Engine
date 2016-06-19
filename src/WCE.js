// Web Console Engine by PDKnight. (c) 2016.

// compressed Mozilla's Function.prototype.bind polyfill.
// taken from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
// I don't own any of the code that is minified in line below.
Function.prototype.bind=(function(){}).bind||function(b){if(typeof this!=="function"){throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");}function c(){}var a=[].slice,f=a.call(arguments,1),e=this,d=function(){return e.apply(this instanceof c?this:b||window,f.concat(a.call(arguments)));};c.prototype=this.prototype;d.prototype=new c();return d;};


var WCE = function(environment, config, commands)
{
    this.version = '2.0';
    this.cmds = {
        history: [],
        count: 0,
        current: 0
    };

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
            + (type == 'cmd' && WCE.path ? WCE.path.get() : '')
            + (type == 'cmd' ? this.config.look.terminal : '')
            + (type == 'cmd'
                ? s.replaceHTMLCharacters()
                : s.replaceHTMLCharacters()
                    .replaceChatColors()
            ).nl2br().trim()
            + '</div>';

        var env = sel(this.environment);
        env.scrollTop = env.scrollHeight;
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
                log('[Warning] There are no commands set in engine! Type "github" to open WCE github page.');
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
        else if (cmd != 'github')
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
    };


    this.init = function()
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
                    'r': config.look.textColor.slice(1)
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

        // set env element
        environmentElement.className +=
            (environmentElement.className.length
                ? ' ' : '')
            + 'wceevn_' + (WCE.instances.length - 1);

        environmentElement.style.background = this.config.look.bgColor;
        environmentElement.style.color = this.config.look.textColor;
        environmentElement.style.overflowY = this.config.look.scrollable
            ? 'scroll' : 'hidden';
        
        // create elements
        addElement('div', {id: 'terminal'});
        addElement('span', {
            id: 'cmdline', 
            inner: this.config.look.terminal.replaceHTMLCharacters()
        });
        addElement('div', {id: 'cursor', className: 'off'});
        addElement('input', {
            id: 'input',
            type: 'text',
            className: 'wceinput'
        });

        var input = sel(this.environment 
            + '.' + environmentElement.className
            + ' #input');


        document.title = this.config.look.name;

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

        //addEvent(document, 'keydown', focusFn);
        //addEvent(document, 'keyup', focusFn);
        addEvent(environmentElement, 'click', focusFn);
        //addEvent(input, 'blur', focusFn);

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
                this.config.look.terminal.replaceHTMLCharacters() 
                + input.value.replaceHTMLCharacters();

            if (WCE.keydownListeners.length > 0)
                for (var i = 0; i < WCE.keydownListeners.length; i++)
                {
                    WCE.keydownListeners[i](e);
                }
        }.bind(this);
        addEvent(input, 'keydown', setCmdLine);
        addEvent(input, 'keyup', setCmdLine);


        // cursor animation
        setInterval(function()
        {
            if (document.activeElement
                .className
                .split(' ')
                .indexOf('wceinput') == -1)
            {
                cursor.className = 'off';
                return;
            }

            var newClass = (cursor.className || 'off') == 'on' 
                    ? 'off' : 'on';
            cursor.className = newClass;
        }, 600);


        if (WCE.initListeners.length > 0)
                for (var i = 0; i < WCE.initListeners.length; i++)
                {
                    WCE.initListeners[i]();
                }
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
            + (WCE.path.path || 'home')
            + '&items='
            + this.items.join(',');
    }.bind(this);

    this.getUrlItems = function()
    {
        return '&items='
            + this.items.join(',');
    }.bind(this);

};

WCE.initListeners = [];
WCE.keydownListeners = [];
WCE.instances = [];

WCE.createInstance = function(environment, config, commands)
{
    if (arguments.length != 3)
        throw new Error('WCE.createInstance() needs 3 arguments, '
            + arguments.length 
            + ' represented.');

    WCE.instances.push(new WCE(environment, config, commands));
};

WCE.addInitListener = function(fn)
{
    WCE.initListeners.push(fn);
};

WCE.addKeydownListener = function(fn)
{
    WCE.keydownListeners.push(fn);
};


WCE.getInstance = function(n)
{
    var instances = WCE.instances;
    if (!(instances instanceof Array)
            || instances.length == 0)
        return {};

    return instances[n || 0];
};
WCE.getInstances = function()
{
    return WCE.instances;
};