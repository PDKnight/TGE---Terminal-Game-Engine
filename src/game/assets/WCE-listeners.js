var WCEi = WCE.getInstance(),
	changeInput = function(e)
	{
		WCEi.sel(WCEi.environment + ' #cmdline').innerHTML =
			WCE.path.get()
			+ WCEi.config.look.terminal.replaceHTMLCharacters()
			+ (
				e 
					? e.target.value.replaceHTMLCharacters()
					: ''
			)
	};
WCE.addInitListener(function()
{
	WCE.getInstance().config.map = 'assets/maps/mapper.php';

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
	    }, function(err) {
	        WCE.getInstance().log('&c[Error] An error happened with AJAX request. Message: '
	            + err);
	    }
	);
}.bind(WCEi));
WCE.addInitListener(changeInput);
WCE.addKeydownListener(changeInput);