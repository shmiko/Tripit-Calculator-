/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, require*/


var miles_start = 72929;
var miles_final = 0;
var milage = require('./milage');
var ical_url = "https://www.tripit.com/feed/ical/private/1AF53D51-488D505D31282AC36A65F4FD788BB039/tripit.ics";
 




milage(ical_url, function (report) {console.log(report);});




