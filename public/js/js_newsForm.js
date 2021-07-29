var newFileName,
    resFormData = {},resFormData = {};


$('.file-lists').on('click', '.del-btn', function (e) {
    var oldFileName = $(e.target).attr('name')
    $(e.target).parent().remove()
    resumeAddress = resumeAddress.filter(function (i) {
        return i.oldFileName != oldFileName
    })
})

$('.defaultExpertParams').on('click', '.del-btn', function (e) {
    $(e.target).parent().parent().remove()
})
if(sessionStorage.getItem('newsId')!=null && sessionStorage.getItem('newsId')!=''){
    $.get(baseUrl + '/news/getNewsById?id=' + sessionStorage.getItem('newsId')+"&operation=manage", function (res) {
        if (res.code == 200) {
            resFormData = res.data || {}
            setFormDefaultValue()

        }
    })
}

function setFormDefaultValue() {
    if (resFormData.manPic) {
        $('#upload_img_btn').hide()
        $('#headPortrait-img').show()
        document.getElementById('headPortrait-img').setAttribute('src', imageUrl + resFormData.manPic)
    }

console.log(resFormData,'edit');
    newFileName = resFormData.manPic;
    form.val('notyfy_form', {
        id: resFormData.id,
        title: resFormData.title,
        headPortrait: resFormData.headPortrait,
        viceTitle: resFormData.viceTitle,
        manPic: resFormData.manPic,
        type: resFormData.type,
        istop : resFormData.istop,
    });
    var ue = UE.getEditor('container');
    ue.addListener("ready", function () {
        var context = htmlDecode(resFormData.viceContext);
        console.log(context,'context');
        ue.setContent(resFormData.viceContext);
    });
}

layui.use(['upload', 'laydate', 'form'], function () {
    var upload = layui.upload,
        laydate = layui.laydate
    form = layui.form

    //执行实例
    upload.render({
        elem: '#upload_img_btn', //绑定元素
        url: baseUrl + '/upload/fileUpload', //上传接口
        accept: 'images',
        acceptMime: 'image/*',
        done: function (res) {
            if (res.code != 200) {
                layer.msg('上传失败')
            } else {
                headPortrait = res.data.newFileName
                $('#upload_img_btn').hide()
                $('#headPortrait-img').show();
                newFileName = res.data.newFileName;
                document.getElementById('headPortrait-img').setAttribute('src', imageUrl + res.data.newFileName)
            }
            //上传完毕回调
        },
        error: function () {
            layer.msg('上传失败')
        },
    });
    form.on('submit(release)', function (data) {
        submitFun(data,  '/news/save');
        return false
    })


})
//编码
function htmlEncode(value){
    return $('<div/>').text(value).html();
}
//解码
function htmlDecode(value){
    return $('<div/>').html(value).text();
}
function submitFun(data, url) {
    var formData = {};
    formData.title = $("input[name='title']").val();
    formData.id = sessionStorage.getItem('newsId');
    formData.viceTitle = $("input[name='viceTitle']").val();
    formData.manPic = newFileName;
    formData.istop = $(".layui-form-radioed").prev("input[name='istop']").val();
    formData.type = $("select[name='type']").val();
    var context = UE.getEditor('container').getContent();
    console.log(htmlEncode(context));
    formData.viceContext = context;
    console.log(JSON.stringify(formData))
    $.ajax({
        type: 'post',
        url: baseUrl + url,
        data: JSON.stringify(formData),
        contentType: 'application/json;charset=UTF-8',
        success: function (res) {
            resFormData = res.data
            if (res.code == 200) {
                window.location.href = 'newsManage.html';
            } else {
                layer.msg(res.message);
            }
        },
    })
}
