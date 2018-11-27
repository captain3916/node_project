$(function () {

    var logout = $("#logout");

    logout.on('click', function () {
        var isLogout = window.confirm('您确定要退出吗？');
        if (isLogout) {
            $.get('/logout', function (res) {
                if (res == '0') {
                    // location.href = 'http://localhost:3000/login';
                    window.location.reload();
                }
            });
        }
    });

});