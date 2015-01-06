'use strict';

define(['jquery', 'Util'], function($, util) {
  return ['$scope', '$http', '$location', '$element',
    function($scope, $http, $location, $element) {

      if (Object.keys(util.loggedInUser).length > 0) {

        //initialize active element
        $scope.active = '';
        $scope.userRole = util.loggedInUser.companyProfile.role;

        /**   
         * Showing and hiding sub menu
         */
        $scope.showSubmenu = function($event) {
          var sub = $($event.currentTarget).find('> ul');
          if ($($event.currentTarget).hasClass('nav-active')) {
            sub.slideUp(200, function() {
              $($event.currentTarget).removeClass('nav-active');
            });
          } else {
            $scope.closeVisibleSubMenu();
            sub.slideDown(200, function() {
              $($event.currentTarget).addClass('nav-active');
            });
          }
        };
        $scope.closeVisibleSubMenu = function() {
          $($element).find('.nav-parent').each(function() {
            var t = $(this);
            if (t.hasClass('nav-active')) {
              t.find('> ul').slideUp(200, function() {
                t.removeClass('nav-active');
              });
            }
          });
        };
        /**
         * Showing and hiding sub menu
         */

        /**
         * Employee Module Management
         */
        $scope.checkForEmployeeModule = function() {
          if (util.modules.employees) {
            $scope.employee = {};
            if ($scope.userRole.user.others.add) {
              $scope.employee.add = true;
            }
            if ($scope.userRole.user.others.companyProfile.view ||
              $scope.userRole.user.others.personalProfile.view) {
              $scope.employee.view = true;
            }
            if (Object.keys($scope.employee).length === 0) {
              return false;
            } else {
              return true;
            }
          } else {
            return false;
          }
        };
        $scope.showEmpList = function() {
          $location.path('/employees/list');
        };
        $scope.addEmployees = function() {
          $location.path('/employees/add/');
        };
        /**
         * Employee Module Management ENDS
         */

        /**
         * Attendance Module Management
         */
        $scope.checkForAttendanceModule = function() {
          if (util.modules.attendance) {
            $scope.attendance = {};
            if ($scope.userRole.attendance.others.add ||
              $scope.userRole.attendance.own.add) {
              $scope.attendance.add = true;
            }
            if ($scope.userRole.attendance.others.view ||
              $scope.userRole.attendance.own.view) {
              $scope.attendance.view = true;
            }
            if (Object.keys($scope.attendance).length === 0) {
              return false;
            } else {
              return true;
            }
          } else {
            return false;
          }
        };
        $scope.viewAttendance = function() {
          $location.path('/attendance/list');
        };
        $scope.showAddAttendance = function() {
          $location.path('/attendance/add');
        };
        $scope.showAttendanceSettings = function() {
          $location.path('/settings/attendance');
        };
        /**
         * Employee Module Management ENDS
         */

        /**
         * Leave Module Management
         */
        $scope.checkForLeaveModule = function() {
          if (util.modules.leave) {
            $scope.leave = {
              apply: true,
              manage: true
            };
            /*if ($scope.userRole.leave.others.manage) {
              $scope.leave.manage = true;
            }*/
            /*if ($scope.userRole.leave.others.view ||
              $scope.userRole.leave.own.viewApplication) {
              $scope.leave.view = true;
            }*/

            if ($scope.userRole.leave.others.view) {
              $scope.leave.view = true;
            }
            if (Object.keys($scope.leave).length === 0) {
              return false;
            } else {
              return true;
            }
          } else {
            return false;
          }
        };
        $scope.showRequests = function() {
          $location.path('/leave/list');
        };
        $scope.requestLeave = function() {
          $location.path('/leave/apply');
        };
        $scope.showLeaveAccount = function() {
          $location.path('/leave/account');
        };
        $scope.showHolidaySettings = function() {
          $location.path('/settings/holiday');
        };
        $scope.showDesignations = function() {
          $location.path('/settings/designation');
        };
        $scope.showLeaveSettings = function() {
          $location.path('/settings/leave');
        };
        /**
         * Leave Module Management
         */

        $scope.showSettingsModule = function() {
          $scope.settingsModule = {};
          if ($scope.userRole.attendance.others.edit ||
            $scope.userRole.attendance.others.add) {
            $scope.settingsModule.holiday = true;
            $scope.settingsModule.designation = true;
          }
          if (Object.keys($scope.settingsModule).length === 0) {
            return false;
          } else {
            return true;
          }

        };

        $scope.loadHolidayList = function() {
          $location.path('/holiday/list');
        };

        /**
         * View Management for all modules
         */
        $scope.viewFile = function() {
          var src = '',
            paths = [];
          paths = $location.$$path.substring(1, $location.$$path.length).split('/');
          if (paths[0] === 'profile') {
            src = 'app/modules/user/views/profile.html';
          } else if (paths[0] === 'employees') {
            if (paths[1] === 'list') {
              src = 'app/modules/employees/views/employeelist.html';
            } else if (paths[1] === 'edit' || paths[1] === 'add') {
              src = 'app/modules/employees/views/addemployees.html';
            } else if (paths[1] === 'view') {
              src = 'app/modules/employees/views/singleemployee.html';
            }
          } else if (paths[0] === 'attendance') {
            if (paths[1] === 'list') {
              src = 'app/modules/attendance/views/view.html';
            } else if (paths[1] === 'edit') {
              src = 'app/modules/attendance/views/add-attendance.html';
            } else if (paths[1] === 'add') {
              src = 'app/modules/attendance/views/add-attendance.html';
            }
          } else if (paths[0] === 'leave') {
            if (paths[1] === 'list') {
              src = 'app/modules/leave/views/leaverequestview.html';
            } else if (paths[1] === 'apply') {
              src = 'app/modules/leave/views/request.html';
            } else if (paths[1] === 'account') {
              src = 'app/modules/leave/views/leaveaccount.html';
            }
          } else if (paths[0] === 'settings') {
            if (paths[1] === 'attendance') {
              src = 'app/modules/attendance/views/attendancesettings.html';
            } else if (paths[1] === 'holiday') {
              src = 'app/modules/leave/views/holidaysettings.html';
            } else if (paths[1] === 'leave') {
              src = 'app/modules/leave/views/leavesettings.html';
            } else if (paths[1] === 'designation') {
              src = 'app/modules/employees/views/designationlist.html';
            }
          } else if (paths[0] === 'holiday') {
            if (paths[1] === 'list') {
              src = 'app/modules/leave/views/holidaylist.html'
            }
          }
          $scope.active = paths[0];
          if (paths.length > 1) {
            $scope.activeSubmenu = paths[0] + '/' + paths[1];
            var submenu = $($element).find('[data-name="' + paths[0] + '"]').find('> ul');
            submenu.slideDown(200, function() {});
          }
          return src;
        };
        $scope.$apply();
        /**
         * View Management for all modules ENDS
         */
      } else {
        $location.path('/signin');
        $scope.$apply();
      }
    }
  ];
});
