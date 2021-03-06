// My own XXHR library, grabbed from https://github.com/PDKnight/XXHR
var XXHR=function(){var t=[":(",":[","._.","(O.o)","d[O_O]b",";(",":'("],e="No XHR, no more fun.",n="The XHR failed",r=function(t){if("undefined"!=typeof XMLHttpRequest)return new XMLHttpRequest;if("undefined"!=typeof ActiveXObject){if("string"!=typeof arguments.callee.activeXString)for(var n=["MSXML2.XMLHttp.6.0","MSXML2.XMLHttp.3.0","MSXML2.XMLHttp"],r=0,a=n.length;a>r;r++)try{var o=new ActiveXObject(n[r]);return arguments.callee.activeXString=n[r],o}catch(i){}return new ActiveXObject(arguments.callee.activeXString)}throw"function"==typeof t&&t(e),new Error(e)};return{request:function(e,a,o,i,u){if("string"!=typeof e)throw new Error("XXHR.getText function requires at least 1 parameter (string).");var s=r(o),i=i||!0,f=u?"post":"get",u=u?u:null;s.onreadystatechange=function(){if(4==s.readyState){if(!(s.status>=200&&s.status<300||304==s.status)){var e=n+" "+t[Math.floor(Math.random()*t.length)]+" [status:"+s.status+"]";throw"function"==typeof o&&o(e,s.status),new Error(e)}var r=s.responseText;"function"==typeof a&&a(r)}},s.open(f,e,i),s.send(u)}}};

var Commands = {
    'ping': {
        description: 'Pong!',
        exec: function(args) {
            WCE.getInstance().log('&aP&6o&bn&eg&7!');
        }
    },
    'clear': {
        description: 'Clears the console.',
        exec: function() {
            document.querySelector(
                WCE.getInstance().environment + ' #terminal'
            ).innerHTML = '';
        }
    }
};