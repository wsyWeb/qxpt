var notifyId = sessionStorage.getItem('notifyId'),
    notifyDetail = {},
    resFormData = {},
    formTemplate = 'newspapers',
    selectWrokInfo = {}, //选中的作品类型
    selectWorkformat = '', //选中的作品格式
    workFields = [] //选中的作品主题

var workThemeSelect = xmSelect.render({
    el: '#workTheme',
    language: 'zn',
    layVerify: 'required',
    layVerType: 'msg',
    prop: {
        name: 'title',
        value: 'id',
    },
    data: [],
    on: function (selectObj) {
        workFields = selectObj.arr.map(function (item) {
            return {
                name: item.title,
                type: item.parentId ? 2 : 1,
            }
        })
    },
})
layui.use(['form', 'upload', 'laydate'], function () {
    var form = layui.form,
        laydate = layui.laydate,
        upload = layui.upload

    $.get(baseUrl + '/notice/detail?noticeId=' + notifyId, function (res) {
        if (res.code === 200) {
            notifyDetail = res.data
            selectWrokInfo = res.data.worksInfos ? res.data.worksInfos[0] : {}
            setActivityDefaultValue(form)
            renderWorkFormats(form) //初始化上传作品的格式
            renderWorkUpload(upload)
            renderFormParams(laydate) //初始化动态表单字段
        }
    })
    $.get(baseUrl + '/entryField/queryEntryFieldList', function (res) {
        if (res.code === 200) {
            workThemeSelect.update({ data: res.data })
        }
    })
    form.on('select(worksTypes)', function (obj) {
        selectWrokInfo = notifyDetail.worksInfos.find(function (item) {
            return item.id == obj.value
        })
        renderFormParams(form)
        renderWorkFormats(form)
    })
    form.on('select(work_format)', function (obj) {
        selectWorkformat = obj.value
        if (obj.value === '网页链接') {
            $('#linkWrap').show()
            $('#uploadWork').hide()
        } else {
            $('#linkWrap').hide()
            $('#uploadWork').show()
        }
        renderWorkUpload(upload)

        $('.uploadTip').html('请上传' + obj.value + '格式的文件，大小不超过' + selectWrokInfo.big + 'kb')
    })
    form.on('submit(submit_form)', function (obj) {
        var formData = Object.assign(resFormData, obj.field)
        formData.activeUserId = sessionStorage.getItem('token')
        formData.workFields = workFields
        formData.worksExtends = formatWorksExtends()
        debugger
        $.ajax({
            type: 'post',
            url: baseUrl + '/works/saveOrEditWorks',
            data: JSON.stringify(formData),
            contentType: 'application/json;charset=UTF-8',
            success: function (res) {
                resFormData = res.data
                if (res.code == 200) {
                    layer.confirm(
                        '是否提交下一作品？',
                        {
                            title: '提示',
                            btn: ['是', '否'],
                        },
                        function () {
                            window.location.href = 'workForm.html'
                        },
                        function () {
                            window.location.href = 'workList.html'
                        }
                    )
                } else {
                    layer.msg(res.message)
                }
            },
        })
    })
})
function setActivityDefaultValue(form) {
    for (var i = 0; i < notifyDetail.worksInfos.length; i++) {
        var obj = notifyDetail.worksInfos[i]
        $('#work_type').append('<option value="' + obj.id + '">' + obj.type + '</option>')
    }
    form.render('select')
    var workinfo = null
    switch (Number(notifyDetail.worksInfo)) {
        case 0:
            workinfo = '计划单列市'
            break
        case 1:
            workinfo = '气象类高校'
            break
        case 2:
            workinfo = '气象局单位'
            break
        default:
            workinfo = '团体组织（中学、社会性组织）'
    }
    form.val('work_form', {
        activityName: notifyDetail.shortName,
        worksInfo: workinfo,
        noticeId: notifyDetail.id,
        // worksTypes: '',
    })
    if (Number(notifyDetail.type) === 3) {
        $('.worksInfo_wrap').show()
    }
}
function renderWorkFormats(form) {
    var formats = selectWrokInfo.format ? selectWrokInfo.format.split(',') : [],
        options = formats.join('|')
    var index = formats.findIndex(function (item) {
        return item === '网页链接'
    })
    if (index > -1) {
        options = [formats.slice(0, index).join('|'), '网页链接']
    }
    selectWorkformat = options[0]
    $('#workFormat').empty()
    for (var i = 0; i < options.length; i++) {
        $('#workFormat').append('<option value="' + options[i] + '">' + options[i] + '</option>')
    }
    form.render('select')
    $('.uploadTip').html('请上传' + options[0] + '格式的文件，大小不超过' + selectWrokInfo.big + 'kb')
}
function renderWorkUpload(upload, exts) {
    var exts = selectWorkformat.replaceAll('.', '').toLocaleLowerCase()
    console.log(exts)
    upload.render({
        elem: '#workAttachment', //绑定元素
        url: baseUrl + '/upload/fileUpload', //上传接口
        accept: 'file',
        exts: exts,
        size: selectWrokInfo.big,
        done: function (res) {
            if (res.code != 200) {
                layer.msg('上传失败')
            } else {
                resFormData.fileName = res.data.oldFileName
                resFormData.url = res.data.newFileName
                $('.workList').html(
                    '<a class="color-theme " target="_blank" href=' + imageUrl + res.data.newFileName + '>' + res.data.oldFileName + '</a>'
                )
            }
            //上传完毕回调
        },
        error: function () {
            layer.msg('上传失败')
        },
    })
}
function renderFormParams(laydate) {
    $('#customDefineParmWrap').empty()
    formTemplate = selectWrokInfo.template || 'newspapers'
    var formParams = defaultForm[formTemplate],
        temp = ''
    for (var i = 0; i < formParams.length; i++) {
        var el = ''
        if (formParams[i].sort === 1) {
            el =
                '<input class="layui-input item" id="' +
                (formParams[i].type || i) +
                '" value="' +
                formParams[i].value +
                '" placeholder="' +
                formParams[i].placeholder +
                '"/>'
        } else if (formParams[i].sort === 2) {
            el =
                '<textarea class="layui-textarea item" value="' +
                formParams[i].value +
                '" placeholder="' +
                formParams[i].placeholder +
                '"></textarea>'
        } else if (formParams[i].sort === 0) {
            el = '<a class="layui-btn layui-btn-primary" id="companyAttachment">上传打扫件</a>'
        }
        temp +=
            '<div class="layui-form-item" sort="' +
            formParams[i].sort +
            '">' +
            '<label class="layui-form-label">' +
            formParams[i].label +
            '</label>' +
            '<div class="layui-input-block">' +
            el +
            '</div></div>'
    }
    $('#customDefineParmWrap').append(temp)
    laydate.render({
        elem: '#date',
        showBottom: false,
    })
}
function formatWorksExtends() {
    var els = $('#customDefineParmWrap').find('.layui-form-item'),
        params = []
    for (var i = 0; i < els.length; i++) {
        params.push({
            name: $(els[i]).find('.layui-form-label').html(),
            value: $(els[i]).find('.item').val(),
            sort: $(els[i]).attr('sort'),
        })
    }
    return params
}
