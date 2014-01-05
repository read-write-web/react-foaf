react-foaf
==========

foaf AddressBook for LDP written with react.js

For the moment to run it you need a CORS proxy running, and you need to set
a pointer to the cors proxy in [scripts/foaf.js](scripts/foaf.js). Currently
it is

```javascript
$rdf.Fetcher.crossSiteProxyTemplate = "http://localhost:9000/srv/cors?url=";
```

You can get a CORS proxy to work by running [rww-play](https://github.com/stample/rww-play)
Currently that CORS proxy is not very stable. This is a very first version...


