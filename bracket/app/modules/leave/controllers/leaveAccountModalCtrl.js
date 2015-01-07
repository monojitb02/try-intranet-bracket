'use strict';

module.exports = function($scope, $http, $location) {
    $scope.allRequests = [];
    $scope.account = {};

    var init = function() {
            /**
             * start of datePicker function
             */

            $scope.today = function() {
                $scope.account.date = new Date();
            };

            $scope.today();

            $scope.clear = function() {
                $scope.account.date = null;
                // $scope.employee.DOB = null;
            };
            // Disable weekend selection
            $scope.DOBDisabled = function(date, mode) {
                return (mode === 'day' && (date.getDay() === -1 || date.getDay() === 7));
            };
            $scope.DOBOpen = function($event) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.DOBOpened = !$scope.DOBOpened;
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
        },
        clearSuccess = function() {
            $scope.success = '';
            $scope.errors = [];
            $scope.$apply();
        };
    $scope.showErrors = true;
    $('#manageAccount').validate({
        rules: {
            date: {
                required: true,
                date: true
            },

            leaveType: 'required'
        },
        messages: {
            date: {
                required: lang.validationMessages.DOBRequired,
                date: lang.validationMessages.DOBDateRequired
            },
            leaveType: lang.validationMessages.genderRequired
        },
        highlight: function(element) {
            $(element).closest('.form-control').removeClass('has-success').addClass('has-error');
        },
        errorPlacement: function(error, element) {
            if (element.attr('name') == 'leaveType') {
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

    $scope.closeModal = function() {
        util.instances.modal.dismiss();
    };

    $scope.update = function() {
        if ($('#manageAccount').valid()) {
            $http.put(util.api.editLeaveAccount, {
                senderId: util.loggedInUser._id,
                user: util.editingLeaveAccount.emp._id,
                date: $scope.account.date,
                leaveType: $scope.account.leaveType
            }).success(function(response) {
                if (response.success) {
                    util.editingLeaveAccount = response.data;
                    util.instances.modal.close();
                } else {
                    if (_.values(response.errfor).length) {
                        $scope.errors = _.values(response.errfor)
                    } else {
                        $scope.errors = [lang.networkError]
                    }
                    $scope.$apply();
                }
            }).error(function() {});
        }
    }

    init();
};
