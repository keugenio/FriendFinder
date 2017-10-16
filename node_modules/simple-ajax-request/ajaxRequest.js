/*
  @param: <Object> params {
    method: <String> (required),
    url: <String> (required),
    sendCookies: <Boolean> (optional),
    auth: <String> || <Object> (optional),
      {
        username: <String>,
        password: <String>
      }
    headers: <Object> (optional)
  }
  
  @param: <Function> callback(<Error> err, <Object> response):
    <Object> response {
      status: <Number>,
      headers: <Object>,
      body: <String>,
      xhr: <XMLHttpRequest>
    }

  @example:
    ajaxRequest({
      method: "GET",
      url: "a url",
      sendCookies: true
    }, function(error, response){
      console.log(arguments)
    });

  @note: the response argument will always be populated regardless of if error is null.
*/

var ajaxRequest = function(params, callback) {
  var req = new XMLHttpRequest();

  if (!params.method)
    return callback(new ReferenceError("please provide a method (i.e. GET, PUT, POST)"))
  if (!params.url)
    return callback(new ReferenceError("please provide a url"))
  
  req.open(params.method.toUpperCase(), params.url);
  
  var headers = params.headers || {};
  if (params.auth && !headers["Authorization"]) {
    var auth = params.auth;
    
    var encodedAuth;
    if (typeof auth == "string")
      encodedAuth = btoa(auth + ":");
    else
      encodedAuth = btoa(auth.username + ":" + auth.password);
    
    var encodedAuth = btoa(auth + ":");
    headers["Authorization"] = `Basic ${encodedAuth}`;
  }
  
  for (var key in headers)
    req.setRequestHeader(key, headers[key]);

  if (params.cors)
    req.withCredentials = true;

  req.onreadystatechange = function () {
    if (req.readyState == XMLHttpRequest.DONE) {
      var response = {
        status: req.status,
        headers: {},
        body: req.responseText,
        xhr: req
      }

      var responseHeadersArray = req.getAllResponseHeaders().slice(0, -1).split("\n");
      var header;
      for (var i = 0; i < responseHeadersArray.length; i += 1) {
        header = responseHeadersArray[i].split(": ");
        response.headers[ header[0] ] = header[1];
      }
      
      if (req.status == 200) 
        callback(null, response);
      else
        callback(new Error(req.statusText), response);
    }
  };

  req.onabort = function() {}

  req.send(params.body || null);
  return req;
}

module.exports = ajaxRequest;