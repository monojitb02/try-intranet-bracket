'use strict';

define(['Util', 'md5', 'lang', 'underscore'], function(util, MD5, lang, _) {
  return ['$scope', '$http', '$location', '$modal',
    function($scope, $http, $location, $modal) {

      var clearSuccess = function() {
        $scope.success = '';
        $scope.errors = [];
        $scope.$apply();
      };

      var location = $location.$$path.split('/');
      location.shift();

      var init = function(date, inTime, outTime) {
        /**
         * start of datePicker function
         */

        if (inTime) {
          inTime = inTime.split(':');
        }
        if (outTime) {
          outTime = outTime.split(':');
        }
        $scope.today = function() {
          $scope.startdt = new Date(date);
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

            startDate: inTime ? new Date().setHours(inTime[0], inTime[1]) : new Date(),
            endDate: outTime ? new Date().setHours(outTime[0], outTime[1]) : new Date()
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

      /**
       * Validator

       */

      $('#AttendanceDetails').validate({
        rules: {
          user: 'required',
          startDate: 'required',
          startTime: 'required',
          endTime: 'required'
        },
        messages: {
          user: lang.validationMessages.user,
          startDate: lang.validationMessages.date,
          startTime: lang.validationMessages.startTime,
          endTime: lang.validationMessages.endTime
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
              $scope.loading = true;

              if (this.files[0].type === 'text/csv') {
                console.log(this.files[0].type);
                // Write Upload csv api here
                var fd = new FormData();
                fd.append('attendanceFile', this.files[0], this.files[0].name);

                // Set up the request.
                var xhr = new XMLHttpRequest();

                // Open the connection.
                xhr.open('POST', util.api.uploadAttendanceCSV + '?senderId=' + util.loggedInUser._id, true);

                // Set up a handler for when the request finishes.
                xhr.onload = function(response) {
                  $scope.loading = false;
                  if (xhr.status === 200) {
                    if (JSON.parse(xhr.response).success) {
                      $scope.success = 'CSV upload done';
                      util.successMessageTimeout({
                        success: function() {
                          clearSuccess();
                        }
                      });
                      $scope.$apply();
                    }
                  } else {
                    $scope.loading = false;
                    $scope.errors = [lang.networkError];
                    $scope.showErrors = true;
                    util.successMessageTimeout({
                      success: function() {
                        clearSuccess();
                      }
                    });
                    $scope.$apply();
                  }
                };

                // Send the Data.
                xhr.send(fd);

              } else {
                $scope.loading = false;
                $scope.errors = ['Please upload a csv file'];
                $scope.showErrors = true;
                util.successMessageTimeout({
                  success: function() {
                    clearSuccess();
                  }
                });
                $scope.$apply();
              }
            }
          }

        });
      };

      $scope.closeSearchResult = function() {
        $scope.managers = [];
        $scope.displayResult = false;
      };

      $scope.getUserList = function() {

        $scope.managers = [];
        $scope.displayResult = true;

        $http({
          method: 'GET',
          url: util.api.getManagers,
          params: {
            name: $scope.attendanceDetails.searchString,
            senderId: util.loggedInUser._id,
            // searchFor: ['manager', 'admin', 'employee']
          }
        }).success(function(emp) {
          if (emp.success) {
            if (emp.data.length > 0) {
              $scope.managers = _.filter(emp.data, function(eachEmp) {
                if ($scope.employee._id !== eachEmp._id) {
                  return eachEmp;
                }
              });
              $scope.$apply();
            } else {
              $('#no_speaker').empty();
              $($element).find('#no_speaker').append('<span>No user found!</span>');
            }
          }
        }).error(function() {});
      };

      $scope.addManager = function(index) {
        $scope.attendanceDetails.user = angular.copy($scope.managers[index]);
        console.log($scope.attendanceDetails.user);
        // $scope.attendanceDetails.searchString = '';
        $scope.closeSearchResult();
        // $scope.$apply();
      };

      $scope.removeUser = function() {
        $scope.attendanceDetails.user = {};
        $scope.attendanceDetails.searchString = '';
      };

      $scope.cancel = function() {};

      $scope.addAttendance = function() {

        if ($('#AttendanceDetails').valid()) {
          $scope.loadingForm = true;

          var jsonObj = {
            senderId: util.loggedInUser._id,
            date: new Date($scope.startdt),
            inTime: $scope.timepicker.event.startDate.getHours() + ':' + $scope.timepicker.event.startDate.getMinutes(),
            outTime: $scope.timepicker.event.endDate.getHours() + ':' + $scope.timepicker.event.endDate.getMinutes(),
            user: $scope.attendanceDetails.user._id,
          }

          if ($scope.action === 'Add') {

            $http.post(util.api.addAttendance, jsonObj).success(function(response) {
              if (response.success) {
                $scope.loadingForm = false;
                $scope.successForm = true;
                $scope.success = response.message;
                util.successMessageTimeout({
                  success: function() {
                    clearSuccess();
                  }
                });
                $scope.apply();
              } else {
                $scope.loadingForm = false;
                $scope.showErrorsForm = true;
                if (_.values(response.errfor).length) {
                  $scope.errors = _.values(response.errfor);
                  console.log('error: ', $scope.errors);
                } else {
                  $scope.errors = [lang.networkError];
                }
                $scope.apply();
                util.successMessageTimeout({
                  success: function() {
                    clearSuccess();
                  }
                });
              }
            });

          } else {

            $http.put(util.api.editAttendance, jsonObj).success(function(response) {
              if (response.success) {
                $scope.loadingForm = false;
                $scope.successForm = true;
                $scope.success = response.message;
                util.successMessageTimeout({
                  success: function() {
                    clearSuccess();
                  }
                });
                $scope.apply();
              } else {
                $scope.loadingForm = false;
                $scope.showErrorsForm = true;
                if (_.values(response.errfor).length) {
                  $scope.errors = _.values(response.errfor);
                  console.log('error: ', $scope.errors);
                } else {
                  $scope.errors = [lang.networkError];
                }
                $scope.apply();
                util.successMessageTimeout({
                  success: function() {
                    clearSuccess();
                  }
                });
              }
            });

          }

        }

      };

      if (location[1] === 'add') {

        $scope.action = 'Add'
        $scope.addAction = true;
        $scope.attendanceDetails = {
          user: {}
        };

        init(new Date());

      } else if (location[1] === 'edit') {
        $scope.action = 'Edit'
        $scope.addAction = false;
        $scope.attendanceDetails = {
          user: util.editingAttendance.user
        };

        init(util.editingAttendance.date, util.editingAttendance.inTime, util.editingAttendance.outTime);

        console.log(util.editingAttendance);
      }

    }
  ];
});
