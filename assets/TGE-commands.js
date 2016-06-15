// My own XXHR library, grabbed from https://github.com/PDKnight/XXHR
var XXHR=function(){var t=[":(",":[","._.","(O.o)","d[O_O]b",";(",":'("],e="No XHR, no more fun.",n="The XHR failed",r=function(t){if("undefined"!=typeof XMLHttpRequest)return new XMLHttpRequest;if("undefined"!=typeof ActiveXObject){if("string"!=typeof arguments.callee.activeXString)for(var n=["MSXML2.XMLHttp.6.0","MSXML2.XMLHttp.3.0","MSXML2.XMLHttp"],r=0,a=n.length;a>r;r++)try{var o=new ActiveXObject(n[r]);return arguments.callee.activeXString=n[r],o}catch(i){}return new ActiveXObject(arguments.callee.activeXString)}throw"function"==typeof t&&t(e),new Error(e)};return{request:function(e,a,o,i,u){if("string"!=typeof e)throw new Error("XXHR.getText function requires at least 1 parameter (string).");var s=r(o),i=i||!0,f=u?"post":"get",u=u?u:null;s.onreadystatechange=function(){if(4==s.readyState){if(!(s.status>=200&&s.status<300||304==s.status)){var e=n+" "+t[Math.floor(Math.random()*t.length)]+" [status:"+s.status+"]";throw"function"==typeof o&&o(e,s.status),new Error(e)}var r=s.responseText;"function"==typeof a&&a(r)}},s.open(f,e,i),s.send(u)}}};

var Commands = {
    'ping': {
        description: 'Pong!',
        exec: function(args) {
            TGE.getInstance().log('&aP&6o&bn&eg&7!');
        }
    },
    'clear': {
        description: 'Clears the console.',
        exec: function() {
            document.querySelector(
                TGE.getInstance().environment + ' #terminal'
            ).innerHTML = '';
        }
    },
    'ls': {
        description: 'Lists files.',
        exec: function() {
            var mapPath = TGE.getInstance().config.map;
            if (!mapPath)
            {
                TGE.getInstance().log('[Warning] There is no map set in config file!');
                return;
            }

            var AJAXpathDir = TGE.path.path;

            XXHR().request(mapPath + TGE.getInstance().getUrlPath(),
                function(r) {
                    var response = JSON.parse(r),
                        type = response.type,
                        data = response.data,
                        dirData = data ? data.dirs : [],
                        message = data ? data.message : [],
                        pick = data ? data.pick : [];

                    if (data.hasOwnProperty('items')
                            && !data.items)
                    {
                        TGE.getInstance().log('&c[Error] You need an item to go there. Use "pick" command to pick an item.');
                    }

                    switch (type) {
                        case 'map':
                            if (dirData.length > 0)
                                TGE.getInstance().log('- Directories:\n'
                                    + dirData.join('\n')
                                );
                            if (pick.length > 0)
                                TGE.getInstance().log('- Items:\n&a'
                                    + pick.join('\n')
                                );
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
        }
    },
    'cd': {
        description: 'Changes directory.',
        exec: function(args) {
            if (args.length == 0)
            {
                TGE.getInstance().log('&c[Error] Usage: cd path.');
                return;
            }
            else if (!/^[\S\/]+$/.test(args[0]))
            {
                TGE.getInstance().log('&c[Error] Path must be alphanumerical (with optional slash/s)!');
                return; 
            }

            TGE.path.cd(args[0]);

            var TGEi = TGE.getInstance();

            TGEi.sel(TGEi.environment + ' #cmdline').innerHTML = 
                    TGE.path.get() 
                    + TGEi.config.game.terminal.replaceHTMLCharacters() 
                    + TGEi.sel(TGEi.environment + ' #input')
                        .value.replaceHTMLCharacters();
        }
    },
    'pick': {
        description: 'Picks up an item. Type "ls" to list current items in directory.',
        exec: function(args) {
            if (args.length == 0)
            {
                TGE.getInstance().log('&c[Error] Usage: pick item.');
            }
            else
            {
                var mapPath = TGE.getInstance().config.map;
                if (!mapPath)
                {
                    TGE.getInstance().log('[Warning] There is no map set in config file!');
                    return;
                }

                var AJAXpathDir = TGE.path.path;

                XXHR().request(mapPath + TGE.getInstance().getUrlPath(),
                    function(r) {
                        var response = JSON.parse(r),
                            type = response.type,
                            data = response.data,
                            dirData = data ? data.dirs : [],
                            message = data ? data.message : [],
                            pick = data ? data.pick : [];

                        if (data.hasOwnProperty('items')
                                && !data.items)
                        {
                            TGE.getInstance().log('&c[Error] You need an item to go there. Use "pick" command to pick an item.');
                        }

                        switch (type) {
                            case 'map':
                                var newPick = pick;
                                for (var i = newPick.length - 1; i >= 0; i--)
                                    newPick[i] = newPick[i].toLowerCase();

                                if (pick.length > 0
                                        && newPick.indexOf(
                                            args[0].toLowerCase()
                                        ) > -1)
                                {
                                    TGE.getInstance().items.push(args[0]);
                                    TGE.getInstance().log('&6Picked "' 
                                        + args[0] 
                                        + '".');
                                }
                                else
                                {
                                    TGE.getInstance().log(
                                        '&c[Error] There is no item called "'
                                        + args[0]
                                        + '".');
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
                    }, function(err) {
                        TGE.getInstance().log('&c[Error] An error happened with AJAX request. Message: '
                            + err);
                    }
                );
            }
        }
    },
    'items': {
        description: 'Lists current items.',
        exec: function() {
            var items = TGE.getInstance().items;
            if (items.length > 0)
            {
                TGE.getInstance().log(
                    'Available items: &a'
                    + items.join(',')
                );
            }
            else
            {
                TGE.getInstance().log('There are no items to display right now.');
            }
        }
    }
};
