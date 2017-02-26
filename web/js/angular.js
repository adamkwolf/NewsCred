/**
 * Created by perrohunter on 2/26/17.
 */
/**
 * You must include the dependency on 'ngMaterial'
 */

//CHANGE TO EMPTY ON PROD

HOSTNAME_ROOT = ""
if (window.location.hostname == "127.0.0.1" || window.location.hostname == "localhost") {
    HOSTNAME_ROOT = "http://localhost:5000"
}


newsApp = angular.module('BlankApp', ['ngMaterial', 'ngRoute']);

newsApp.config(['$locationProvider', '$routeProvider',
    function config($locationProvider, $routeProvider) {
        $routeProvider.when('/', {
            controller: 'GreetingController',
            templateUrl: 'controllers/welcome.html'
        }).when('/author/:authorName', {
            controller: 'SearchController',
            templateUrl: 'controllers/search.html'
        }).otherwise('/');
    }
]);

greetingctrl = newsApp.controller('GreetingController', ['$scope', '$location', function ($scope, $location) {

    $scope.doSearch = function () {
        $location.path("/author/" + $scope.query);
    }

}]);

searchctrl = newsApp.controller('SearchController', ['$scope', '$http', '$routeParams', function ($scope, $http, $routeParams) {
    $scope.greeting = 'Hola!';

    $scope.notFound = false;
    $scope.results = [];
    $scope.author = {};
    $scope.rating = 0;

    // Simple GET request example:
    $http({
        method: 'GET',
        url: HOSTNAME_ROOT + '/api/author/' + $routeParams['authorName'] + '/'
    }).then(function successCallback(response) {
        // this callback will be called asynchronously
        // when the response is available
        // obj to append data to
        console.log(response.data)
        if ('error' in response.data['result']) {
            console.log("404")
            $scope.notFound = true;
        } else {

            $scope.results = response.data['result']['articles'];
            $scope.author = response.data['result']['author'];
            $scope.rating = response.data['result']['rating'];

        }

    }, function errorCallback(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        console, log('fail');
    });


}]);