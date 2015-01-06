'use strict';

define(['Util', 'lang', 'md5', 'underscore'], function(util, lang, MD5, _) {
  return ['$scope', '$http', '$location', 'ownProfile',
    function($scope, $http, $location, ownProfile) {

      $scope.employee = angular.copy(util.editingOwnProfile);

      ownProfile.user = angular.copy(util.editingOwnProfile);

      if (!ownProfile.user.currentAddress ||
        Object.keys(ownProfile.user.currentAddress).length === 0) {
        $scope.checked = true;
      }
      $scope.employee.contactNumbers = [];
      if (ownProfile.user.contactNumbers && ownProfile.user.contactNumbers.length) {
        ownProfile.user.contactNumbers.forEach(function(text) {
          $scope.employee.contactNumbers.push({
            text: text,
            isEditing: false
          })
        })
      } else {
        $scope.employee.contactNumbers.push({
          text: '',
          isEditing: true
        })
      }
      /**
       * Form Validator cofig start
       */
      $('#editProfile').validate({
        rules: {
          /*
                    fullAddress: 'required',
                    city: 'required',
                    state: 'required',
                    country: 'required',*/
          pin: {
            number: true
          },
          permanentFullAddress: 'required',
          permanentCity: 'required',
          permanentState: 'required',
          permanentCountry: 'required',
          permanentPin: {
            required: true,
            number: true
          },
          phoneNumber: 'required',
        },
        messages: {
          phoneNumber: lang.validationMessages.phoneNumberRequired,
          /*fullAddress: lang.validationMessages.fullAddressRequired,
          city: lang.validationMessages.cityRequired,
          state: lang.validationMessages.stateRequired,
          country: lang.validationMessages.countryRequired,*/
          pin: {
            // required: lang.validationMessages.pinRequired,
            number: lang.validationMessages.invalidPin
          },
          permanenntFullAddress: lang.validationMessages.permanentFullAddressRequired,
          permanenntCity: lang.validationMessages.permanentCityRequired,
          permanenntState: lang.validationMessages.permanentStateRequired,
          permanenntCountry: lang.validationMessages.permanentCountryRequired,
          permanenntPin: {
            required: lang.validationMessages.permanentPinRequired,
            number: lang.validationMessages.permanentInvalidPin
          },
        },
        highlight: function(element) {
          $(element).closest('.form-control').removeClass('has-success').addClass('has-error');
        },
        success: function(element) {
          $(element).closest('.form-control').removeClass('has-error');
          $(element).closest('label').remove();
        }
      });

      $scope.addContactNumber = function() {
        if ($scope.employee.contactNumbers[$scope.employee.contactNumbers.length - 1].text.trim() !== '') {
          $scope.employee.contactNumbers.push({
            text: '',
            isEditing: false
          });
        }
      };

      $scope.close = function() {

        util.instances.modal.dismiss();
      };

      $scope.$watch('checked', function(newValue) {
        if (newValue) {
          $scope.employee.currentAddress = $scope.employee.permanentAddress;
        } else {
          $scope.employee.currentAddress = {};
        }
      });

      $scope.save = function() {

        if ($('#editProfile').valid()) {
          $scope.loading = true;
          var requestObj = {};

          requestObj.contactNumbers = _.filter(_.pluck($scope.employee.contactNumbers, 'text'), function(number) {
            if (number.trim().length > 0) {
              return number;
            }
          });
          requestObj.permanentAddress = $scope.employee.permanentAddress;
          if (!$scope.checked) {
            requestObj.currentAddress = $scope.employee.currentAddress;
          }
          $http.put(util.api.updateMyProfile, {
            senderId: util.loggedInUser._id,
            personalProfile: requestObj
          }).success(function(response) {
            if (response.success) {
              $scope.loading = false;
              var role = _.extend({}, util.loggedInUser.companyProfile.role);
              util.loggedInUser.companyProfile = response.data.companyProfile;
              util.loggedInUser.personalProfile = response.data.personalProfile;
              util.loggedInUser.companyProfile.role = role;
              console.log('after save own: ', util.loggedInUser);
              // ownProfile.user = util.loggedInUser;
              util.instances.modal.close();
            } else {
              $scope.loading = false;
            }
          }).error(function() {})
        }
      }
      $scope.$apply();
    }
  ];
});
