react-foaf
==========

foaf AddressBook for LDP written with [Facebook react.js](http://facebook.github.io/react/)

For the moment to run it you need a CORS proxy running, and you need to set
a pointer to the cors proxy in [scripts/foaf.js](scripts/AppConfig.js). We have
one up usually at this address

```javascript
$rdf.Fetcher.crossSiteProxyTemplate = "http://stample.io/srv/cors?url=";
```

For editing documents you will need an [LDP server](https://dvcs.w3.org/hg/ldpwg/raw-file/default/ldp.html).
LDP is not yet finalised ( but is close ).

This code has been developed against the   
[rww-play](https://github.com/stample/rww-play) LDP server. As LDP is still changing
it is unlikely to work well on other servers right now, but our aim is to have it work 
on any compliant server.

If you do not require Write mode you can start the address book by cloning this repository in a web server, and then opening `index.html`.  (From IntelliJ you can just click _Open in Browser_ when clicking on `index.html`, and it
will start a little server and launch the file in it)

If you want to run the address book app on rww-play then clone `rww-play` inside the `public/apps` directory. ( see
the [install-app.sh](https://github.com/stample/rww-play/blob/master/install-app.sh) script there ).
