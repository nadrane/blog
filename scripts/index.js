const querystring = require('querystring');
hexo.extend.helper.register('escapeUrl', function(url){
  return querystring.escape(url);
});