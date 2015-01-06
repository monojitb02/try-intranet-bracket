'use strict';

define(['Util', 'jquery', 'underscore', 'lang'], function(util, $, _, lang) {
  return ['$scope', '$http', '$location', 'UserService', '$element',
    function($scope, $http, $location, UserService, $element) {

      $scope.employee = {};
      $scope.profile = {};
      var userRole = util.loggedInUser.companyProfile.role,
        init = function() {

          /**
           * start of datePicker function
           */
          $scope.clear = function() {
            $scope.employee.DOJ = null;
            $scope.employee.DOB = null;
          };

          // Disable weekend selection
          $scope.DOBDisabled = function(date, mode) {
            return (mode === 'day' && (date.getDay() === -1 || date.getDay() === 7));
          };

          $scope.DOJDisabled = function(date, mode) {
            return (mode === 'day' && (date.getDay() === -1 || date.getDay() === 7));
          };

          $scope.toggleMin = function() {
            $scope.minDate = $scope.minDate ? null : new Date();
          };
          // $scope.toggleMin();

          $scope.DOBOpen = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.DOBOpened = !$scope.DOBOpened;
          };

          $scope.DOJOpen = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.DOJOpened = !$scope.DOJOpened;
          };

          $scope.accountStartDateOpen = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.accountStartDateOpened = !$scope.accountStartDateOpened;
          };

          $scope.accountEndDateOpen = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.accountEndDateOpened = !$scope.accountEndDateOpened;
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

          $scope.designations = util.appDetails.designations;
          if ($scope.employee && $scope.employee.companyProfile.designation) {
            $scope.selectedDesignation = _.find($scope.designations, function(eachDesignation) {
              if (eachDesignation._id === $scope.employee.companyProfile.designation._id) {
                return eachDesignation;
              }
            });
          } else {
            $scope.selectedDesignation = $scope.designations[0];
          }

          $scope.roles = _.filter(util.appDetails.roles, function(eachRole) {
            if (!util.loggedInUser.companyProfile.manager) {
              return eachRole;
            } else if (eachRole.name !== 'admin') {
              return eachRole;
            }
          });

          if ($scope.employee && $scope.employee.companyProfile.role) {
            $scope.selectedRole = _.find($scope.roles, function(eachRole) {
              if (eachRole._id === $scope.employee.companyProfile.role._id) {
                return eachRole;
              }
            });
          } else {
            $scope.selectedRole = util.appDetails.roles[0];
          }

          if ($scope.employee.personalProfile.contactNumbers.length !== 0) {
            $scope.employee.contactNumbers = [];
            _.each($scope.employee.personalProfile.contactNumbers, function(number) {

              $scope.employee.contactNumbers.push({
                text: number,
                isEditing: false
              });
            });
          } else {
            $scope.employee.contactNumbers = [];
            $scope.employee.contactNumbers.push({
              text: '',
              isEditing: true
            });
          }


          if ($scope.mode === 1) {
            if ($scope.employee.personalProfile &&
              $scope.employee.personalProfile.currentAddress &&
              Object.keys($scope.employee.personalProfile.currentAddress).keys !== 0) {
              $scope.checked = true;
            } else {
              $scope.checked = false;
              // $scope.employee.personalProfile.currentAddress = $scope.employee.personalProfile.permanentAddress;
              // console.log($scope.employee.personalProfile.currentAddress);
            }

            if ($scope.employee.companyProfile && $scope.employee.companyProfile.manager) {
              $scope.employee.managers = [$scope.employee.companyProfile.manager];
            } else {
              $scope.employee.managers = [];
            }
            if (userRole.user.others.personalProfile.edit) {
              $scope.profile.editPersonalProfile = true;
            }
            if (userRole.user.others.companyProfile.edit) {
              $scope.profile.editCompanyProfile = true;
            }
            if (Object.keys($scope.profile).length === 0) {
              $location.path('/employees/list');
            }
          } else {
            if (userRole.user.others.add) {
              $scope.profile.editPersonalProfile = true;
              $scope.profile.editCompanyProfile = true;
            } else {
              $location.path('/employees/list');
            }
          }

          $scope.$apply();
        },
        location = $location.$$path.split('/'),
        readImage = function(file) {
          var reader = new FileReader();
          var image = new Image();
          reader.readAsDataURL(file);
          reader.onload = function(_file) {
            image.src = _file.target.result;
            image.onload = function() {
              $('img.speaker-picture-small').attr('src', image.src);
            };
            image.onerror = function() {
              window.alert('Invalid file type: ' + file.type);
            };
          };
        };

      location.shift();

      if (location.length === 3 && location[2] !== '') {
        $scope.heading = 'Update';
        $scope.mode = 1;
        $http.get(util.api.getSingleEmployee + '?senderId=' + util.loggedInUser._id + '&userId=' + location[2])
          .success(function(response) {
            if (response.success) {
              $scope.employee = response.data;
              $scope.employee.companyProfile.DOJ = $scope.employee.companyProfile.DOJ ? new Date($scope.employee.companyProfile.DOJ) : new Date();
              $scope.employee.companyProfile.DOB = $scope.employee.companyProfile.DOB ? new Date($scope.employee.companyProfile.DOB) : new Date();
              $scope.employee.companyProfile.accountStartDate = $scope.employee.leaveDetails.duration.from ? new Date($scope.employee.leaveDetails.duration.from) : new Date();
              $scope.employee.companyProfile.accountEndDate = $scope.employee.leaveDetails.duration.to ? new Date($scope.employee.leaveDetails.duration.to) : new Date();
              $scope.employee.companyProfile.maxCL = $scope.employee.leaveDetails.maxCL;
              $scope.employee.companyProfile.maxEL = $scope.employee.leaveDetails.maxEL;
              if ($scope.employee.companyProfile.manager) {
                $scope.employee.managers = [$scope.employee.companyProfile.manager];
              } else {
                $scope.employee.managers = [];
              }
              init();
            } else {
              $location.path('/employees/list');
            }
          })
      } else {
        $scope.heading = 'Add';
        $scope.employee = {
          managers: [],
          personalProfile: {
            currentAddress: {},
            permanentAddress: {},
            contactNumbers: []
          },
          companyProfile: {
            managers: [],
            name: {},
            DOJ: new Date(),
            DOB: new Date(),
            accountStartDate: new Date(),
            accountEndDate: new Date(),
            maxCL: 0,
            maxEL: 0,
          },
        };
        $scope.mode = 99;
        init();
      }

      $('#addEmployee').validate({
        rules: {
          machineId: 'required',
          empId: 'required',
          ctc: {
            required: true,
            number: true
          },
          email: {
            required: true,
            email: true
          },
          DOB: {
            required: true,
            date: true
          },
          DOJ: {
            required: true,
            date: true
          },
          /*fullAddress: 'required',
          city: 'required',
          state: 'required',
          country: 'required',*/
          pin: {
            // required: true,
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
          firstName: 'required',
          lastName: 'required',
          gender: 'required',
          phoneNumber: 'required',
          designation: 'required',
          pan: 'required',
          role: 'required'
        },
        messages: {
          machineId: lang.validationMessages.machineCodeRequired,
          empId: lang.validationMessages.empIdRequired,
          ctc: {
            required: lang.validationMessages.empIdRequired,
            number: lang.validationMessages.empIdInvalid
          },
          email: {
            required: lang.validationMessages.email.required,
            email: lang.validationMessages.email.email,
          },
          DOB: {
            required: lang.validationMessages.DOBRequired,
            date: lang.validationMessages.DOBDateRequired
          },
          DOJ: {
            required: lang.validationMessages.DOJRequired,
            date: lang.validationMessages.DOJDateRequired
          },
          phoneNumber: lang.validationMessages.phoneNumberRequired,
          designation: lang.validationMessages.designationRequired,
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
          firstName: lang.validationMessages.firstNameRequired,
          lastName: lang.validationMessages.lastNameRequired,
          gender: lang.validationMessages.genderRequired,
          pan: lang.validationMessages.pan,
          role: lang.validationMessages.role
        },
        highlight: function(element) {
          $(element).closest('.form-control').removeClass('has-success').addClass('has-error');
        },
        errorPlacement: function(error, element) {
          if (element.attr('name') == 'gender') {
            error.css({
              position: 'relative',
              right: '100px',
              top: '6px'
            });
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



      $scope.addContactNumber = function() {
        if ($scope.employee.contactNumbers[$scope.employee.contactNumbers.length - 1].text.trim() !== '') {
          $scope.employee.contactNumbers.push({
            text: '',
            isEditing: true
          });
        }
      };


      $scope.activateChangeEvent = function() {
        $('#choose').change(function(e) {
          if (this.disabled) {
            return window.alert('File upload not supported!');
          } else {
            if (this.files && this.files[0]) {
              $scope.profilePicture = e.target.files[0];
              readImage(this.files[0]);
            }
          }
        });
      };

      /*$scope.$watch('checked', function(newValue) {
        if (!newValue) {
          $scope.employee.personalProfile.currentAddress = {};
        } else {
          $scope.employee.personalProfile.currentAddress = $scope.employee.personalProfile.permanentAddress;
        }
      });*/

      $scope.manageAddress = function(newValue) {
        if (newValue) {
          $scope.employee.personalProfile.currentAddress = {};
        } else {
          $scope.employee.personalProfile.currentAddress = $scope.employee.personalProfile.permanentAddress;
        }
      };

      $scope.cancel = function() {
        $location.path('/employees/list');
      };

      /** 
       * Searching managers
       */
      $scope.getManagerList = function() {
        $scope.managers = [];
        $scope.displayResult = true;

        UserService.getManagers({
          name: $scope.employee.managerAutoSearch,
          senderId: util.loggedInUser._id,
          searchFor: ['manager', 'admin']
        }).success(function(emp) {
          if (emp.success) {
            if (emp.data.length > 0) {
              $scope.managers = _.filter(emp.data, function(eachEmp) {
                if ($scope.employee._id !== eachEmp._id) {
                  return eachEmp;
                }
              });
            } else {
              $('#no_speaker').empty();
              $($element).find('#no_speaker').append('<span>No speaker found!</span>');
            }
          }
        }).error(function() {});
      };

      $scope.closeSearchResult = function() {
        $scope.managers = [];
        $scope.displayResult = false;
      };

      $scope.addManager = function(index) {
        console.log('adding Manager');
        if ($scope.employee.managers.length > 0) {
          $scope.removeManager(0);
        }
        // $scope.employee.managers.push($scope.managers[index]);
        $scope.employee.managers = [$scope.managers[index]];
        $scope.managers.splice(index, 1);
        $scope.managers = _.difference($scope.managers, $scope.employee.managers);
        if (!$scope.managers.length) {
          $('#no_speaker').empty();
          $($element).find('#no_speaker').append('<span>No speaker found!</span>');
        }
        $scope.employee.managerAutoSearch = '';
      };

      $scope.removeManager = function(index) {
        // $scope.managers.push($scope.employee.managers[index]);
        // $scope.employee.managers.splice(index, 1);
        $scope.employee.managers = [];
      };
      /** 
       * Searching managers ENDS
       */

      $scope.checkAdmin = function() {
        return !util.loggedInUser.companyProfile.manager;
      };

      $scope.$watch('checked', function(value) {
        if ($scope.employee.personalProfile) {
          if (!value) {
            $scope.employee.personalProfile.currentAddress = {};
          } else {
            $scope.employee.personalProfile.currentAddress = $scope.employee.personalProfile.permanentAddress;
          }
        }
      });

      $scope.addEmployee = function() {
        if ($('#addEmployee').valid()) {
          // if (true) {
          
          $('[name="addEmployeeButton"]').attr('disabled', 'disabled');
          
          $scope.loading = true;
          console.log($scope.employee.companyProfile.DOJ,
            $scope.employee.companyProfile.DOB);
          // $scope.employee.companyProfile.DOJ = $scope.employee.DOJ;
          // $scope.employee.companyProfile.DOB = $scope.employee.DOB;
          if ($scope.employee.managers && $scope.employee.managers.length > 0) {
            // console.log($scope.employee.managers);
            $scope.employee.companyProfile.manager = $scope.employee.managers[0]._id;
          } else {
            $scope.employee.companyProfile.manager = null;
          }
          $scope.employee.personalProfile.contactNumbers = _.pluck(_.filter($scope.employee.contactNumbers, function(number) {
            if (number.text && number.text.trim().length !== 0) {
              return number;
            }
          }), 'text');
          var jsonObj = _.extend({}, $scope.employee);

          jsonObj.leaveConfig = {
            startDate: jsonObj.companyProfile.accountStartDate,
            endDate: jsonObj.companyProfile.accountEndDate,
            maxCL: jsonObj.companyProfile.maxCL,
            maxEL: jsonObj.companyProfile.maxEL
          };

          delete jsonObj.companyProfile.accountStartDate;
          delete jsonObj.companyProfile.accountEndDate;
          delete jsonObj.companyProfile.maxCL;
          delete jsonObj.companyProfile.maxEL;
          delete jsonObj.$$hashKey;
          delete jsonObj.contactNumbers;
          delete jsonObj.managerAutoSearch;
          delete jsonObj.managers;
          if ($scope.checked) {
            delete jsonObj.personalProfile.currentAddress;
          }
          if ($scope.selectedRole) {
            $scope.employee.companyProfile.role = $scope.selectedRole._id;
          }
          if (jsonObj.companyProfile.company) {
            delete jsonObj.companyProfile.company;
          }
          if ($scope.selectedDesignation) {
            $scope.employee.companyProfile.designation = $scope.selectedDesignation._id;
          }

          jsonObj.senderId = util.loggedInUser._id;



          if ($scope.mode === 1) {
            UserService.updateEmp(jsonObj, $scope.profilePicture, $location, $scope);
          } else {
            UserService.addEmp(jsonObj, $scope.profilePicture, $location, $scope);
          }
        }
      };

      $scope.$apply();
    }
  ];
});
