'use strict';

define(['lang', 'Util', 'underscore'], function(lang, util, _) {
  return ['$scope', '$http', '$location',
    function($scope, $http, $location) {

      var clearSuccess = function() {
          $scope.success = '';
          $scope.errors = [];
          $scope.$apply();
        },
        location = $location.$$path.split('/'),
        init = function(date) {

          /**
           * start of datePicker function
           */
          $scope.today = function() {
            $scope.startdt = date ? new Date(date) : new Date();
          };
          $scope.today();
          $scope.clear = function() {
            // $scope.dt = null;
            // $scope.enddt = null;
            $scope.startdt = null;
          };

          // Disable weekend selection
          $scope.startDisabled = function(date, mode) {
            return (mode === 'day' && (date.getDay() === -1 || date.getDay() === 7));
          };

          $scope.endDisabled = function(date, mode) {
            return (mode === 'day' && (date.getDay() === -1 || date.getDay() === 7));
          };

          $scope.toggleMin = function() {
            $scope.minDate = $scope.minDate ? null : new Date();
          };
          // $scope.toggleMin();

          $scope.startOpen = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.startOpened = !$scope.startOpened;
          };

          $scope.endOpen = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.endOpened = !$scope.endOpened;
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

          /**
           * start of timePicker function
           */

          $scope.timepicker = {
            config: {
              ShowMeridian: true,
              hourSteps: 1,
              minuteSteps: 5
            },
            event: {
              /*startDate: ($scope.aggendaDetails.dateSpan && $scope.aggendaDetails.dateSpan.from) ? new Date($scope.aggendaDetails.dateSpan.from) : new Date(),
              endDate: ($scope.aggendaDetails.dateSpan && $scope.aggendaDetails.dateSpan.to) ? new Date($scope.aggendaDetails.dateSpan.to) : new Date()*/

              startDate: new Date(),
              endDate: new Date()
            },
            clicked: function(e) {
              e.preventDefault();
              e.stopPropagation();
            }
          };
          /**
           * end of timePicker function
           */

          $scope.$apply();
        };


      location.shift();

      if (location.length === 3 && location[2].length === 24) {
        $scope.actionOnHoliday = 'Edit';
        $scope.holidayDetails = util.editingHoliday;
        console.log()
      } else {
        $scope.actionOnHoliday = 'Add';
        $scope.holidayDetails = {};
      }

      /**
       * Validator

       */

      $('#AttendanceDetails').validate({
        rules: {
          name: 'required',
          startDate: 'required',
        },
        messages: {
          name: lang.validationMessages.name,
          startDate: lang.validationMessages.date,
        },
        highlight: function(element) {
          $(element).closest('.form-control').removeClass('has-success').addClass('has-error');
        },
        errorPlacement: function(error, element) {
          if (element.attr('name') == 'gender') {
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


      $scope.activateChangeEvent = function() {
        $("#choose").change(function(e) {
          if (this.disabled) {
            return alert('File upload not supported!');
          } else {
            if (this.files && this.files[0]) {

              /* $scope.brandLogo = e.target.files[0];
 readImage(this.files[0]);
*/
              if (this.files[0].type === 'text/csv') {
                console.log(this.files[0].type);
                // Write Upload csv api here
              } else {
                $scope.errors = ['Please upload a csv file'];
                $scope.showErrors = true;
                $scope.$apply();
              }
            }
          }

        });
      };


      $scope.cancel = function() {};

      $scope.addAttendance = function() {

        if ($('#HolidayDetails').valid()) {
          var jsonObj = {
            senderId: util.loggedInUser._id,
            date: new Date($scope.startdt),
            purpose: $scope.holidayDetails.purpose,
          };

          if ($scope.actionOnHoliday === 'Add') {

            $http.post(util.api.addHoliday, jsonObj).success(function(response) {
              if (response.success) {
                $scope.success = 'Added Successfully';
                util.successMessageTimeout({
                  success: function() {
                    clearSuccess();
                  }
                });
                $location.path('/holiday/list');
                $scope.$apply();
              } else {
                if (_.values(response.errfor).length > 0) {
                  $scope.errors = _.values(response.errfor);
                } else {
                  $scope.errors = [];
                  $scope.errors.push(lang.networkError);
                }
                $scope.showErrors = true;
                util.successMessageTimeout({
                  success: function() {
                    clearSuccess();
                  }
                });
                $scope.$apply();
              }
            })
          } else {
            jsonObj.holidayId = $scope.holidayDetails._id
            $http.put(util.api.editHoliday, jsonObj).success(function(response) {
              if (response.success) {
                $scope.success = 'Added Successfully';
                util.successMessageTimeout({
                  success: function() {
                    clearSuccess();
                  }
                });
                $location.path('/holiday/list');
                $scope.$apply();
              } else {
                if (_.values(response.errfor).length > 0) {
                  $scope.errors = _.values(response.errfor);
                } else {
                  $scope.errors = [];
                  $scope.errors.push(lang.networkError);
                }
                $scope.showErrors = true;
                util.successMessageTimeout({
                  success: function() {
                    clearSuccess();
                  }
                });
                $scope.$apply();
              }
            })
          }
        }

      };

      if ($scope.actionOnHoliday === 'Add') {
        init();
      } else {
        console.log($scope.holidayDetails);
        init($scope.holidayDetails.date);
      }
    }
  ];
});
