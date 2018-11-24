$(function () {
    var user = $("#user");
    var pwd = $("#pwd");
    var cfpwd = $("#cfpwd");
    var register = $("#register");
    var uNameReg = /^(\w|[\u4e00-\u9fa5]){3,20}$/; //用户名正则
    var pwdReg = /^[a-zA-Z0-9]{6,20}$/; //密码正则
    register.on("click", function () {
        //判断用户名是否OK
        var isUserOK = uNameReg.test(user.val());
        //判断密码是否OK
        var isPwdOK = pwdReg.test(pwd.val());
        //确认密码是否OK？
        var isCfpwdOk = isPwdOK && pwd.val() === cfpwd.val();

        if (!isUserOK) {
            alert("用户名不正确,长度3~20位，由中文字符、字母、数字和下划线组成,谢谢！")
        } else if (!isPwdOK) {
            alert("密码不正确,6-20个字符，只能包含大小写字母、数字和非空格字符,谢谢！")
        } else if (!isCfpwdOk) {
            alert("两次密码输入不一致,请检查,谢谢！")
        } else { //发送给后台做用户名唯一性查询
            $.post('/api/register', {
                uName: user.val(),
                uPwd: pwd.val()
            }, function (res) {
                if (res === '0') {
                    alert('注册成功');
                    location.href = '/login'; //跳转到登录页面
                } else if (res === '1') {
                    alert('用户名已经存在，请更换，谢谢！');
                }
            });
        }
    });
});