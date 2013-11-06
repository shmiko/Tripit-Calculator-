/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, require*/


var http = require('http');
 

var server = http.createServer(function (req, res) {
    
    var result = {}; 
    result.start = 72929;
    
    var milage = require('./milage');
    var ical_url = "https://www.tripit.com/feed/ical/private/1AF53D51-488D505D31282AC36A65F4FD788BB039/tripit.ics";
    
    
    var serverCallback = function (report) {
        var localRes = res; 
        result.report = report;
        result.final= calculateFuture(result.start, report);
        localRes.writeHead(200, { 'Content-Type': 'application/json' })
        localRes.end(JSON.stringify(result))
    }
    
    milage(ical_url, serverCallback);
    
})
server.listen(8000);




function calculateFuture(start, report) {
    var result =  Number(start);
    
    for (var i = 0; i < report.length; i++){
        result = result + Number(report[i].milage); 
        
    }
    return result;    
}    


