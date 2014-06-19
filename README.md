react-foaf
==========

foaf AddressBook for LDP written with [Facebook react.js](http://facebook.github.io/react/)

For the moment to run it you need a CORS proxy running, and you need to set
a pointer to the cors proxy in [js/scripts/globalRdfStore.js](js/scripts/globalRdfStore.js). 
We used to have one up here, and are working on another server: 

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

Licence
-------

   Copyright 2013 Henry Story

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
