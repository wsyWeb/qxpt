var notifyId = sessionStorage.getItem('notifyId'),
    notifyDetail = {},
    resFormData = {},
    formTemplate = 'newspapers',
    selectWrokInfo = {}, //选中的作品类型
    selectWorkformat = '', //选中的作品格式
    workFields = [], //选中的作品主题
    workTypes = []

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
                fieldId: item.id,
                fieldName: item.title,
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
            setWorkDefaultValue(form)
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
        if (workTypes.length > 0) {
            selectWrokInfo = workTypes.find(function (item) {
                return item.worksTypeId === obj.value
            })
        }
        renderFormParams(form)
        renderWorkFormats(form)
    })
    form.on('select(worksInfo)', function (obj) {
        workTypes = notifyDetail.worksInfos[Number(obj.value)]
        if (form.val('work_form').worksTypeId) {
            selectWrokInfo = workTypes.find(function (item) {
                return item.worksTypeId === form.val('work_form').worksTypeId
            })
        }
        renderFormParams(form)
        renderWorkFormats(form)
    })
    form.on('select(work_format)', function (obj) {
        selectWorkformat = obj.value

        var exts = selectWorkformat.replaceAll('.', '').toLocaleLowerCase()

        // renderWorkUpload(upload)

        $('.uploadTip').html('请上传' + obj.value + '格式的文件，大小不超过' + selectWrokInfo.big + 'kb')
    })
    form.on('submit(download)', function (obj) {
        submitFun(obj, 'download')
    })
    form.on('submit(submit_form)', function (obj) {
        submitFun(obj, 'save')
    })
})
function setWorkDefaultValue(form) {
    for (var i = 0; i < notifyDetail.worksTypes.length; i++) {
        var obj = notifyDetail.worksTypes[i]
        $('#work_type').append('<option value="' + obj.id + '">' + obj.name + '</option>')
    }
    form.render('select')
    $('#work_type').val('')
    $('select[name="worksInfo"]').val('')
    form.val('work_form', {
        activityName: notifyDetail.shortName,
        noticeId: notifyDetail.id,
    })
}
function renderWorkFormats(form) {
    var formats = selectWrokInfo.format ? selectWrokInfo.format.split(',') : []

    selectWorkformat = formats[0] || ''
    $('#workFormat').empty()
    for (var i = 0; i < formats.length; i++) {
        $('#workFormat').append('<option value="' + formats[i] + '">' + formats[i] + '</option>')
    }
    form.render('select')
    if (formats[0]) {
        $('.uploadTip').html('请上传' + formats[0] + '格式的文件，大小不超过' + selectWrokInfo.big + 'kb')
    }
}
function renderWorkUpload(upload) {
    var exts = selectWorkformat.replaceAll('.', '').toLocaleLowerCase()
    upload.render({
        elem: '#workAttachment', //绑定元素
        url: baseUrl + '/upload/fileUpload', //上传接口
        accept: 'file',
        exts: exts,
        size: selectWrokInfo.big,
        before: function (obj) {
            var files = obj.pushFile()
            console.log(files)
            return false
        },
        done: function (res) {
            if (res.code !== 200) {
                layer.msg('上传失败')
            } else {
                resFormData.filename = res.data.oldFileName
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
    // laydate.render({
    //     elem: '#date',
    //     showBottom: false,
    // })
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

function submitFun(obj, type) {
    var formData = Object.assign(resFormData, obj.field)
    formData.activeUserId = sessionStorage.getItem('token')
    formData.workFields = workFields
    formData.worksType = $('select[name="worksTypeId"] option:selected').text()
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
                if (type === 'save') {
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
                            window.location.href = 'workListForSubmit.html'
                        }
                    )
                } else {
                    window.location.href = baseUrl + '/works/downloadWork?workId=' + res.data.id
                }
            } else {
                layer.msg(res.message)
            }
        },
    })
}