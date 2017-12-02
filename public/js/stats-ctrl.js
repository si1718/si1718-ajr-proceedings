/*global angular, Highcharts*/

var API_HTTP = "/api/v1/proceedings"

angular.module("ProceedingManagerApp")
    .controller("StatsCtrl", ["$scope", "$http", function($scope, $http) {
        function refresh(){
            $http
                .get(API_HTTP + "/stats/map")
                .then((response) => {
                    stats_map(response.data);
                }, (error) => {
                    $scope.errorMessage = "An unexpected error has ocurred.";
                });
            $http
                .get(API_HTTP + "/stats/year")
                .then((response) => {
                    stats_year(response.data.years, response.data.data);
                }, (error) => {
                    $scope.errorMessage = "An unexpected error has ocurred.";
                });
        }
        
        refresh();
    }]);


/**
 * Reference: http://jsfiddle.net/gh/get/jquery/1.11.0/highcharts/highcharts/tree/master/samples/mapdata/custom/world
 */
function stats_map(data) {
    // Create the chart
    Highcharts.mapChart('stats_map', {
        chart: {
            map: 'custom/world'
        },
    
        title: {
            text: 'Proceedings by countries'
        },
    
        subtitle: {
            text: 'Resume of proceedings by country'
        },
    
        mapNavigation: {
            enabled: true,
            buttonOptions: {
                verticalAlign: 'bottom'
            }
        },
    
        colorAxis: {
            min: 0
        },
    
        series: [{
            data: data,
            name: 'Number of proceedings',
            states: {
                hover: {
                    color: '#BADA55'
                }
            },
            dataLabels: {
                enabled: true,
                format: '{point.name}'
            }
        }]
    });
}

/**
 * Reference: http://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/demo/column-basic/
 */
function stats_year(years, data) {
    Highcharts.chart('stats_year', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Proceedings by years'
        },
        subtitle: {
            text: 'Resume of proceedings by year'
        },
        xAxis: {
            categories: years,
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Number'
            }
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            name: 'Years',
            data: data
    
        }]
    });
}