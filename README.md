## axed 


```bash 
npm install axed 
```


```js
const axed = require('axed') 
const { got, posted, didErr } = axed 
//(or ES module import) 
```

axed is a wrapper around [axios] to cut down on boilerplate in both the request and err handling.

Ex- 

```js
const url = `http://myendpoint.com/stuff` 
const res = await posted(url, { cool : true })  
if(didErr(res)) throw didErr(res) 
```   

If posted (or got) returns null it means the result was blank. 

If didErr returns null it means there was no error, otherwise it returns the error. 


[axios]:https://github.com/axios/axios