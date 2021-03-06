## Installation

1. `npm install`
2. `npm start`
3. open <http://localhost:4002/>

## HTML4 File Upload

- create an file tag `<input type="file" name="file" />`
- put into an form `<form method="POST" action="/upload" enctype="multipart/form-data"></form>`
- form must have `enctype=multipart/form-data`
- create an iframe
- set `form.target` to the iframe
- submit the form and will find result in the iframe. usually listner to iframe.load event.

## HTML5 File API

- File API `<input type="file" name="file" />`
- FileReader API
- FormData
- send the FormData async

## Reference

- [Using Files from Web applications](https://developer.mozilla.org/en-US/docs/Using_files_from_web_applications)
- [File API](http://caniuse.com/#search=File)
- [FormData API](http://caniuse.com/#search=FormData)
    + It was mentioned that for IE 10/11, "Partial support refers to not supporting json as responseType". But did not find such issue during testing in IE 10/11

## Spec

- [Input File type](https://www.w3.org/TR/html-markup/input.file.html)
- [RFC1867 - Form-based File Upload in HTML](https://www.ietf.org/rfc/rfc1867.txt)
- [RFC2388 - Returning Values from Forms:  multipart/form-data](https://www.ietf.org/rfc/rfc2388.txt)
- [W3 - File API](https://www.w3.org/TR/FileAPI/)

## License

- See the LICENSE file
