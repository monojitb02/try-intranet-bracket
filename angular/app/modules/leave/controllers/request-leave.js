'use strict';

define(['lang', 'Util'], function(lang, util) {
  return ['$scope', '$http', '$location',
    function($scope, $http, $location) {
      console.log(util.loggedInUser);
      $scope.leave = {
        leaveType: '2',
        reason: ''
      };
      var clearSuccess = function() {
        $scope.success = '';
        $scope.$apply();
      };

      var init = function(config) {

        $scope.today = function() {
          /*$scope.leaveStartDate = new Date(config.startdt.setHours(0, 0));
          $scope.leaveEndDate = new Date(config.enddt.setHours(0, 0));*/
          $scope.dateObj = {
            sdt: new Date(config.startdt.setHours(0, 0)),
            edt: new Date(config.enddt.setHours(0, 0))
          }
        };
        $scope.today();

        $scope.clear = function() {
          $scope.dt = null;
          $scope.leaveEndDate = null;
          $scope.leaveStartDate = null;
        };

        // Disable weekend selection
        $scope.leaveStartDisabled = function(date, mode) {
          return (mode === 'day' && (date.getDay() === -1 || date.getDay() === 7));
        };

        $scope.leaveEndDisabled = function(date, mode) {
          return (mode === 'day' && (date.getDay() === -1 || date.getDay() === 7));
        };

        $scope.toggleMin = function() {
          $scope.minDate = $scope.minDate ? null : new Date();
        };
        // $scope.toggleMin();

        $scope.leaveStartOpen = function($event) {
          $event.preventDefault();
          $event.stopPropagation();
          $scope.leaveStartOpened = !$scope.leaveStartOpened;
        };

        $scope.leaveEndOpen = function($event) {
          $event.preventDefault();
          $event.stopPropagation();
          $scope.leaveEndOpened = !$scope.leaveEndOpened;
        };

        $scope.dateOptions = {
          formatYear: 'yy',
          startingDay: 1
        };

        $scope.initDate = new Date('2016-15-20');
        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[2];

        /**
         * end of datePicker function
         */

      };

      init({
        startdt: new Date(),
        enddt: new Date()
      });


      $('leaveRequest').validate({
        rules: {
          startDate: 'required',
          endDate: 'required',
          leaveType: 'required',
          reason: 'required',
        },
        messages: {
          startDate: lang.validationMessages.startDate,
          endDate: lang.validationMessages.endDate,
          leaveType: lang.validationMessages.leaveType,
          reason: lang.validationMessages.reason,
        },
        highlight: function(element) {
          $(element).closest('.form-control').removeClass('has-success').addClass('has-error');
        },
        errorPlacement: function(error, element) {
          if (element.attr('name') == 'leaveType') {
            error.insertAfter($(element).parent().parent());
          } else {
            error.insertAfter(element);
          }
        },
        success: function(element) {
          $(element).closest('.form-control').removeClass('has-error');
          $(element).closest('label').remove();
        }
      });

      /*$scope.$watch('sdt', function(sdt) {
        console.log('sdt', sdt);
      });

      $scope.$watch('edt', function(edt) {
        console.log('edt', edt);
      });*/

      $scope.apply = function() {
        if ($('#leaveRequest').valid()) {
          var jsonObj = {};
          /*jsonObj.startDate = $scope.leaveStartDate;
          jsonObj.endDate = $scope.leaveEndDate;*/
          jsonObj.startDate = $scope.dateObj.sdt;
          jsonObj.endDate = $scope.dateObj.edt;
          jsonObj.leaveType = $scope.leave.leaveType;
          jsonObj.reason = $scope.leave.reason;
          jsonObj.senderId = util.loggedInUser._id;

          // console.log(jsonObj);

          $http.post(util.api.applyForLeave, jsonObj)
            .success(function(response) {
              console.log(response);
              if (response.success) {
                if (response.message) {
                  $scope.success = response.message;
                  $scope.showSuccess = true;
                  util.successMessageTimeout({
                    success: function() {
                      clearSuccess();
                    }
                  });
                }
              } else {
                if (response.errors.length > 0) {
                  $scope.errors = [lang.networkError];
                  $scope.showErrors = true;
                  util.errorMessageTimeout({
                    success: function() {
                      $scope.errors = [];
                      $scope.showErrors = false;
                      $scope.$apply();
                    }
                  });
                } else {
                  $scope.errors = _.values(response.errfor);
                  $scope.showErrors = true;
                  util.errorMessageTimeout({
                    success: function() {
                      $scope.errors = [];
                      $scope.showErrors = false;
                      $scope.$apply();
                    }
                  });
                }
              }
            }).error(function() {})
            // return $location.path('/employees/list');
        }
      };
      $scope.goBack = function() {
        return $location.path('/dashboard');
      };
      $scope.$apply();
    }
  ];
});
