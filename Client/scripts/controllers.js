angular.module("Controllers", ["mwl.calendar"])
.controller("FormCtrl", ['$scope', '$http', '$rootScope', function($scope, $http, $rootScope) {
  $scope.data = {};
  $rootScope.activePage = "form";

  $scope.doRegister = function() {
    $http.post("/api/registerEmployee", $scope.data).then(function(response) {
      if(response.data.status == "200") {
        $scope.data = {};
        alert(response.data.msg);
      } else {
        alert("Error occured while registering");
      }
    });
  }
}])

.controller("AttendanceCtrl", ['$scope', '$http', '$rootScope', function($scope, $http, $rootScope) {
  $rootScope.activePage = "logger";
  $scope.employees = [];
  $scope.data = [];
  $scope.date = {};
  $scope.init = function() {
    $http.post("/api/getEmployees", {today:moment($scope.date.date).format("DD/MMM/YYYY")}).then(function(response) {
      $scope.employees = [];   
      for(var i=0; i<response.data.length; i++) {
        if(!response.data[i].att[0]) {
          response.data[i].att.push({employee:response.data[i]._id, employee_id:response.data[i].employee_id, date:moment().format("DD/MMM/YYYY")});
        }
        $scope.employees.push(response.data[i]);
        // $scope.data.push(response.data[i].att[0]);
      }
    });
  }

  //$scope.init();

  $scope.submit = function() {
    for(var i=0; i<$scope.employees.length; i++) {
      $scope.data.push($scope.employees[i].att[0]);
    }
    $http.post("/api/postAttendance", {data:$scope.data, today:moment($scope.date.date).format("DD/MMM/YYYY")}).then(function(response) {
      alert(response.data.msg);
    })
  }
}])

.controller("CalendarCtrl", ['$scope', '$http', '$rootScope', function($scope, $http, $rootScope) {
  $scope.data = {};
  $scope.employee = {};
  $scope.data.today = new Date();
  $scope.data.events = [];
  $scope.data.view = "month";
  $scope.data.calendarTitle = $scope.calendarTitle;
  $rootScope.activePage = "calendar";
  $http.get("/api/getAllEmployees").then(function(response) {
    $scope.employees = response.data;
  })

  $scope.fetchCalendar = function(view) {
    if(!$scope.employee.employee_id) {
      return;
    }
    if(view) {
      $scope.data.view = view;
    }
    $scope.data.events = [];
    $scope.employee.view = $scope.data.view;
    $scope.employee.today = moment($scope.data.today).format("DD/MMM/YYYY");
    $http.post("/api/fetchAttendance", $scope.employee).then(function(response) {
      for(var i=0; i<response.data.length; i++) {
        var event = {startsAt: moment(response.data[i].date), endsAt:moment(response.data[i].date), title:"Late Login on " + moment(response.data[i].date).format("DD/MMM/YYYY")}
        $scope.data.events.push(event)
      }
    })
  }
}])
