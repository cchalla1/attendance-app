angular.module("attendanceApp", ["ngRoute", "Controllers"])
.config(['$routeProvider','$locationProvider', function($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  $routeProvider
    .when("/", {
      templateUrl : "templates/userForm.html",
      controller : "FormCtrl"
    }).when("/logger", {
      templateUrl : "templates/logger.html",
      controller : "AttendanceCtrl"
    }).when("/calendar", {
      templateUrl : "templates/calendar.html",
      controller : "CalendarCtrl"
    });
}])
