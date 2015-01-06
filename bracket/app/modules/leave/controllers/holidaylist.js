'use strict';

define(['lang', 'Util', 'underscore'], function(lang, util, _) {
  return ['$scope', '$http', '$location',
    function($scope, $http, $location) {

      var clearSuccess = function() {
        $scope.success = '';
        $scope.errors = [];
        $scope.$apply();
      };

      $('#HolidayDetails').validate({
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

      var init = function() {

          $scope.isAdmin = (util.loggedInUser.companyProfile.role.trueName === 'admin') ? true : false;

          $scope.loadHolidayEditView = function(holidayObj) {
            $scope.actionOnHoliday = 'Edit';
            $scope.editingHoliday = holidayObj;
            holidaySettings({
              name: holidayObj.purpose,
              date: new Date(holidayObj.date)
            });
          };

          $scope.deleteHoliday = function(id, index) {

            /*  Delete Operation write Here
             *  AND
             *  Pull the data from allHolidays in SUCCESS */

            var deletedHoliday = [];
            $http.put(util.api.removeHoliday, {
              senderId: util.loggedInUser._id,
              holidayId: id
            }).success(function(response) {
              if (response.success) {
                deletedHoliday = $scope.allHolidays.splice(index, 1);
                $scope.$apply();
              } else {
                $scope.allHolidays.push(deletedHoliday[0]);
                $scope.errors = [lang.networkError];
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

          $scope.actionOnHoliday = 'Add';
          holidaySettings({
            name: '',
            date: new Date()
          });

        },
        holidaySettings = function(holidayObj) {

          $scope.holidayDetails = {
            purpose: holidayObj.name ? holidayObj.name : ''
          };
          /**
           * start of datePicker function
           */
          $scope.today = function() {
            $scope.startdt = holidayObj.date ? new Date(holidayObj.date) : new Date();
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
          $scope.startOpen = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.startOpened = !$scope.startOpened;
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
          $scope.$apply();
        };

      $scope.addAttendance = function() {


        if ($('#HolidayDetails').valid()) {
          $scope.loading = true;
          var jsonObj = {
            senderId: util.loggedInUser._id,
            date: new Date($scope.startdt),
            purpose: $scope.holidayDetails.purpose,
          };

          if ($scope.actionOnHoliday === 'Add') {

            $http.post(util.api.addHoliday, jsonObj).success(function(response) {
              if (response.success) {
                $scope.success = 'Added Successfully';
                $scope.allHolidays = response.data;
                $scope.startdt = new Date();
                $scope.holidayDetails.purpose = '';
                $scope.loading = false;
                util.successMessageTimeout({
                  success: function() {
                    clearSuccess();
                  }
                });
                // $location.path('/holiday/list');
                $scope.$apply();
              } else {
                if (_.values(response.errfor).length > 0) {
                  $scope.errors = _.values(response.errfor);
                } else {
                  $scope.errors = [];
                  $scope.errors.push(lang.networkError);
                }
                $scope.loading = false;
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
            jsonObj.holidayId = $scope.editingHoliday._id;
            $http.put(util.api.editHoliday, jsonObj).success(function(response) {
              if (response.success) {
                $scope.success = 'Edited Successfully';
                $scope.allHolidays = response.data;
                $scope.startdt = new Date();
                $scope.holidayDetails.purpose = '';
                $scope.loading = false;
                util.successMessageTimeout({
                  success: function() {
                    clearSuccess();
                  }
                });
                // $location.path('/holiday/list');
                $scope.$apply();
              } else {
                if (_.values(response.errfor).length > 0) {
                  $scope.errors = _.values(response.errfor);
                } else {
                  $scope.errors = [];
                  $scope.errors.push(lang.networkError);
                }
                $scope.loading = false;
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

      $http.get(util.api.viewHolidays + '?senderId=' + util.loggedInUser._id).success(function(response) {
        $scope.allHolidays = response.data;

        init();
      })

    }
  ]
})
