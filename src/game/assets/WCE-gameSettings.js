WCE.path = {
    pathPrefix: 'root@ubuntu:/',
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

                var mapPath = WCE.getInstance().config.map;
                if (!mapPath)
                {
                    WCE.getInstance().log('[Warning] There is no map set in config file!');
                    return;
                }

                var AJAXpathDir = this.path;

                if (AJAXpathDir[0] == '/')
                    AJAXpathDir = AJAXpathDir.slice(1);

                XXHR().request(mapPath + '?dir=' 
                        + (AJAXpathDir || 'Home')
                        + WCE.getInstance().getUrlItems(),
                    function(r) {
                        var response = JSON.parse(r.toString()),
                            type = response.type,
                            data = response.data,
                            dirData = data ? data.dirs : [],
                            message = data ? data.message : [];

                        if (data.hasOwnProperty('items')
                                && !data.items)
                        {
                            WCE.getInstance().log('&c[Error] You need an item to go there. Use "pick" command to pick an item.');
                        }

                        switch (type) {
                            case 'map':
                                if (data.hasOwnProperty('text')
                                        && data.text.length > 0)
                                    WCE.getInstance().log(data.text.join('\n') + '\n');
                            break;
                            case 'error':
                            default:
                                WCE.getInstance().log(
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
                        WCE.getInstance().log('&c[Error] An error happened with AJAX request. Message: '
                            + err);
                    }
                );
            }
            else
            {
                var mapPath = WCE.getInstance().config.map;
                if (!mapPath)
                {
                    WCE.getInstance().log('[Warning] There is no map set in config file!');
                    return;
                }

                var AJAXpathDir = this.path + '/' + path;

                if (AJAXpathDir[0] == '/')
                    AJAXpathDir = AJAXpathDir.slice(1);

                XXHR().request(mapPath + '?dir=' 
                        + (AJAXpathDir || 'Home')
                        + WCE.getInstance().getUrlItems(), 
                    function(r) {
                        var response = JSON.parse(r.toString()),
                            type = response.type,
                            data = response.data,
                            dirData = data ? data.dirs : [],
                            message = data ? data.message : [];

                        if (data.hasOwnProperty('items')
                                && !data.items)
                        {
                            WCE.getInstance().log('&c[Error] You need an item to go there. Use "pick" command to pick an item.');
                        }

                        switch (type) {
                            case 'map':
                                if (dirData.length > 0)
                                {
                                    if (data.hasOwnProperty('text')
                                            && data.text.length > 0)
                                        WCE.getInstance().log(data.text.join('\n') + '\n');

                                    this.path += 
                                        // don't put / at the start if there was / at end
                                        (this.path.indexOf('/') == this.path.length - 1
                                            ? '' : '/') 
                                        + path;

                                    var WCEi = WCE.getInstance();

                                    WCEi.sel(WCEi.environment + ' #cmdline').innerHTML = 
                                            WCE.path.get() 
                                            + WCEi.config.look.terminal.replaceHTMLCharacters() 
                                            + WCEi.sel(WCEi.environment + ' #input')
                                                .value.replaceHTMLCharacters();
                                }
                                else
                                {
                                    WCE.getInstance().log('&c[Error] The directory doesn\'t exist.');
                                }
                            break;
                            case 'error':
                            default:
                                WCE.getInstance().log(
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
                        WCE.getInstance().log('&c[Error] An error happened with AJAX request. Message: '
                            + err);
                    }
                );
            }
        }
    }
};