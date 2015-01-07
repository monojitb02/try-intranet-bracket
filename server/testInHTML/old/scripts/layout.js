'use script';
(function() {
    // */$('#main table thead').append('<tr><td class="url color-brown">' + 'Url' + '</td><td></td><td class="display"><span class="status color-brown">Status</span></td></tr>');

    var pathsArray = Object.keys(paths);
    pathsArray.forEach(function(key) {
        if (paths[key].active) {
            $('#table_body').append('<tr><td>' + paths[key].method + ' ' +
                paths[key].url + '</td><td class="item">' +
                JSON.stringify(paths[key].data) + '</td><td id="' + key +
                '_response" class="item"></td><td class="display"><span class="pending status-style" id="' +
                key + '">pending</span>' + '<img src="resources/img/3.gif" id="' +
                key + 'Img" class="loading"/></td></tr>');
        }
    });
    pathsArray.forEach(function(path) {
        var pathObject = paths[path];
        sendAjaxRequest({
            url: pathObject.url,
            active: false,
            method: pathObject.method,
            data: pathObject.data
        }, {
            success: function(data) {
                if (data.success) {
                    $('#' + path).removeClass('pending').addClass('loading complete').text('Complete');
                } else {
                    $('#' + path).removeClass('pending').addClass('loading fail').text('Fail');
                }
                if (data.data) {
                    data.data = 'some data....';
                }
                $('#' + path + '_response').text(JSON.stringify(data));
                $('#' + path + 'Img').hide();
            },
            error: function() {
                $('#' + path).removeClass('pending').addClass('loading err').text('Error Connection');
                $('#' + path + 'Img').hide();
            }
        });
    });

    var useradd = {
        data: {},
        url: '/app_details',
        method: 'GET',
        active: true
    };
    $('#' + path).removeClass('pending').addClass('loading complete').text('Complete');
    sendAjaxRequest({
        url: pathObject.url,
        active: false,
        method: pathObject.method,
        data: pathObject.data
    }, {
        success: function(data) {
            var useredit;
            if (data.success) {
                useredit = {
                    data: {},
                    url: '/app_details',
                    method: 'GET',
                    active: true
                }
                sendAjaxRequest(useredit, {
                    success: function(data) {
                        if (data.success) {
                            $('#' + path).removeClass('pending').addClass('loading complete').text('Complete');
                        } else {
                            $('#' + path).removeClass('pending').addClass('loading fail').text('Fail');
                        }
                        if (data.data) {
                            data.data = 'some data....';
                        }
                        $('#' + path + '_response').text(JSON.stringify(data));
                        $('#' + path + 'Img').hide();
                    },
                    error: function() {
                        $('#' + path).removeClass('pending').addClass('loading err').text('Error Connection');
                        $('#' + path + 'Img').hide();
                    }
                })
            } else {
                $('#' + path).removeClass('pending').addClass('loading fail').text('Fail');
            }
            if (data.data) {
                data.data = 'some data....';
            }
            $('#' + path + '_response').text(JSON.stringify(data));
            $('#' + path + 'Img').hide();
        },
        error: function() {
            $('#' + path).removeClass('pending').addClass('loading err').text('Error Connection');
            $('#' + path + 'Img').hide();
        }
    });


})();
