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

    // Simple GET request example:
    $http({
        method: 'GET',
        url: HOSTNAME_ROOT + '/api/author/' + $routeParams['authorName'] + '/'
    }).then(function successCallback(response) {
        // this callback will be called asynchronously
        // when the response is available
        // obj to append data to
        var div = document.getElementById("results");
        var cardtitle = document.getElementById("card-title");

        var table = document.createElement("table");
        var tr = document.createElement("tr");
        var th = document.createElement("th");
        var node = document.createTextNode("Author");
        th.appendChild(node);
        tr.appendChild(th);
        table.appendChild(tr);

        th = document.createElement("th");
        node = document.createTextNode("Article");
        th.appendChild(node);
        tr.appendChild(th);
        table.appendChild(tr);

        th = document.createElement("th");
        node = document.createTextNode("Company");
        th.appendChild(node);
        tr.appendChild(th);
        table.appendChild(tr);

        th = document.createElement("th");
        node = document.createTextNode("Url");
        th.appendChild(node);
        tr.appendChild(th);
        table.appendChild(tr);

        th = document.createElement("th");
        node = document.createTextNode("Rating");
        th.appendChild(node);
        tr.appendChild(th);
        table.appendChild(tr);

        div.appendChild(table);

        // result object
        var result = response.data.result;
        cardtitle.innerHTML = "Search Results: " + parseInt(result.articles.length);

        console.log(result);

        // author
        var author = result.author.name;

        var rating = result.rating;

        // div.append(author);

        // individual article data
        for (var i = 0; i < result.articles.length; i++) {
            var company = result.articles[i].site.company;
            var website = result.articles[i].site.website_url;
            var snapshot = result.articles[i].snapshot;
            var title = result.articles[i].title;
            var url = result.articles[i].url;
            // div.append(company);
            //
            // div.append(website);
            // div.append(title);
            // div.append(url);

            var tr = document.createElement("tr");
            var th = document.createElement("th");
            var node = document.createTextNode(author);
            th.appendChild(node);
            tr.appendChild(th);
            table.appendChild(tr);

            th = document.createElement("th");
            node = document.createTextNode(title);
            th.appendChild(node);
            tr.appendChild(th);
            table.appendChild(tr);

            th = document.createElement("th");
            node = document.createTextNode(company);
            th.appendChild(node);
            tr.appendChild(th);
            table.appendChild(tr);

            th = document.createElement("th");
            node = document.createTextNode(url);
            th.appendChild(node);
            tr.appendChild(th);
            table.appendChild(tr);

            th = document.createElement("th");
            node = document.createTextNode(rating);
            th.appendChild(node);
            tr.appendChild(th);
            table.appendChild(tr);
        }

        function addStyleString(str) {
            var node = document.createElement('style');
            node.innerHTML = str;
            document.body.appendChild(node);
        }

        addStyleString('table { font-family: arial, sans-serif; border-collapse: collapse; width: 100%; }');
        addStyleString('td, th { border: 1px solid #dddddd; text-align: left; padding: 8px; }');

        console.log(table);

    }, function errorCallback(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        console, log('fail');
    });


}]);