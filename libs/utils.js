module.exports = {
	promisifyChrome: function(apis){
		for(var i in apis){
			var api = apis[i];
			console.debug("Promisifying chrome." + api);
			var chromeKeys = Object.keys(chrome[api]);
			for(var func of chromeKeys){
				if(typeof chrome[api][func] == "function"){
					new function(func, api){
						chrome[api][func+"Async"] = function(args){
							return new Promise(function(resolve, reject){
								var newArgs = Array.prototype.slice.call(this);
								newArgs.push(function(args){
									this(args);
								}.bind(resolve));
								chrome[api][func].apply(this, newArgs);
							}.bind(arguments));
						}
					}(func, api);

				}
			}
		}
	},
	escapeXml:function(s) {
		var XML_CHAR_MAP = {
			'<': '&lt;',
			'>': '&gt;',
			'&': '&amp;',
			'"': '&quot;',
			"'": '&apos;'
		};
		return s.replace(/[\<\>\&\"\']/g, function (ch) {
			return XML_CHAR_MAP[ch];
		});
	}

}