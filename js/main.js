$(document).ready(function (){

    $.ajax( {
        type:'Get',
        url:'http://localhost:8000/',
        success:function(data) {
        formatReport(data);
        console.log(data);
        }
    
    })

    


});


function formatReport(summary) {
    var added = 0;
    
    for (var i = 0; i < summary.report.length; i++) {
        var t = summary.report[i];
        added += Number(t.milage);
        var tr = '<tr><th>' + t.origin + " to "  + t.destination + '</th><td>' + t.milage + '</td></tr>'
        $('#table-results tr:first').after(tr);    
    }

    $("#miles-starting").html(summary.start);
    $("#miles-ending").html(summary.final);
    $("#miles-added").html(added);    
    
}    