## simple-ajax-request

**Description**: a library that simplifies making ajax requests from the frontend without having to use jquery

**Usage**:
```
npm install simple-ajax-request
```

**Example**:
```javascript

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
*/

ajaxRequest({
  method: "GET",
  url: "a url",
  sendCookies: true
}, function(error, response){
  console.log(arguments)
});

```
