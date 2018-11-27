$(function () {
    var user = $("#user");
    var pwd = $("#pwd");
    var login = $("#login");
    var uNameReg = /^(\w|[\u4e00-\u9fa5]){3,20}$/; //用户名正则
    var pwdReg = /^[a-zA-Z0-9]{6,20}$/; //密码正则
    login.on("click", function () {
        //判断用户名是否OK
        var isUserOK = uNameReg.test(user.val());
        //判断密码是否OK
        var isPwdOK = pwdReg.test(pwd.val());

        if (!isUserOK) {
            alert("用户名不正确,谢谢！")
        } else if (!isPwdOK) {
            alert("密码不正确,谢谢！")
        } else { //发送给后台验证用户名和密码
            $.post('/api/login', {
                uName: user.val(),
                uPwd: pwd.val()
            }, function (res) {
                var resObj = JSON.parse(res);
                if (resObj.code === 0) {
                    alert('登录成功');
                    location.href = '/'; //跳转到主页
                } else {
                    alert(resObj.message);
                }
            });
        }
    });
});