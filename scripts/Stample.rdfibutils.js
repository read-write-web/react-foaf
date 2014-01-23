/**
 * Created by hjs on 23/01/2014.
 */

$rdf.Stmpl = {

	/**
	 * remove hash from URL - this gets the document location
	 * @param url
	 * @returns {*}
	 */
	fragmentless: function(url) {
		return url.split('#')[0];
	}
}