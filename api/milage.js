module.exports = function (ical_url, callback) {
    var http = require('http');
    var ical = require('ical');
    var distance_url = "http://www.webflyer.com/travel/mileage_calculator/getmileage.php";
    var now = Date.now();
    var report = [];
    
    
    ical.fromURL(ical_url, {}, function (err, data) {
    
        var countOfMilesProcessed = 0;
        
        for (var k in data){
            if (data.hasOwnProperty(k)) {
                var ev = data[k];
                
                if (isFlight(ev)) {
                    var flight = extractFlight(ev);
                    report.push(flight);
                }    
            }
        }
        
        
        
        for (var j= 0; j < report.length; j++) {
           
            var getFlight = function () {
                var localIndex = j;
                var flight = report[localIndex];
                var options = getMilageOptions(flight.origin, flight.destination);
                var httpcallback = function (response) {
                    var localflight = flight;
                    var str = '';
                    response.on('data', function (chunk) {
                        str += chunk;
                    });
                    response.on('end', function () {
                        var milage = extractMilage(str);
                        countOfMilesProcessed++;
                        report[localIndex].milage = milage;
                        if (countOfMilesProcessed === report.length) {
                            return callback(report);
                        }    
                        
                        
                    });
        
                }
                http.request(options, httpcallback).end();
            }
            getFlight();    
            
        }    
        
        
    });
    
    
    
        
    
    
    function processMilageHTML(response) {
        var str = '';
        response.on('data', function (chunk) {
            str += chunk;
        });
        response.on('end', function () {
            var milage = extractMilage(str);
            return milage;
        });
        
    }   
    
    
    function getMilageOptions(origin, destination) {
        var options = {
            host: 'www.webflyer.com',
            path: '/travel/mileage_calculator/getmileage.php?city=' + origin + '&city=' + destination  
        };
        return options;
    }    
    
    function extractMilage(str) {
        var pos_start = str.indexOf('<td><b><span class="row_odd_font">Distance</span></b></td>');
        var pos_end = str.indexOf('miles</span>', pos_start);
        var milageArray = str.substring(pos_start,pos_end).split(">");
        var milage = milageArray.pop();
        return milage;
    }    
    
    
    function extractFlight(ev) {
        var flight = {};
        var arr = ev.summary.split(" ");
        flight.number = arr[0];
        flight.origin = arr[1];
        flight.destination = arr[3];
        flight.date = ev.start;
        flight.milage = 0;
        return flight;
    }
    
    function isFlight(ev){
        var sum = ev.summary;
        if ( (now < ev.start) && (sum.indexOf(" to ") >= 0 ) && 
                (sum.indexOf("Directions") < 0) &&
                (sum.indexOf("Amtrak") < 0)
                   ) { 
            return true;
            
        } else {
            return false;
        }    
    }   
}    