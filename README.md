react-foaf
==========

foaf AddressBook for LDP written with react.js

For the moment to run it you need a CORS proxy running, and you need to set
a pointer to the cors proxy in [scripts/foaf.js](scripts/AppConfig.js). Currently
it is

```javascript
$rdf.Fetcher.crossSiteProxyTemplate = "http://data.fm/proxy?uri=";
```

For editing documents you will need to deploy an LDP server such as 
[rww-play](https://github.com/stample/rww-play). ( Note that at present 
that is the only one we are testing on.) [rww-play](https://github.com/stample/rww-play) 
also comes with a CORS proxy, though you'd need to change it.

The address book is run by placing `index.html` behind a web server, and starting it.
(From IntelliJ you can just click _Open in Browser_ )
