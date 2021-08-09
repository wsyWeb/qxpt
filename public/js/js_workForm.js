var notifyId = sessionStorage.getItem('notifyId'),
    notifyDetail = {},
    resFormData = {},
    formTemplate = 'newspapers',
    selectWrokInfo = {}, //选中的作品类型
    selectWorkformat = '', //选中的作品格式
    workFields = [], //选中的作品主题
    workTypes = [],
    resumeAddress = [] //单位意见,
selectSmallTemplate = '' // 作品类型选中的二级
var workId = sessionStorage.getItem('workFormId')

if (!workId) {
    $('.editTitle').hide()
} else {
    $('.addTitle').hide()
}
var workThemeSelect = xmSelect.render({
    el: '#workTheme',
    language: 'zn',
    layVerify: 'required',
    layVerType: 'msg',
    theme: {
        color: '#2a6be3',
    },
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
    renderFormParams()
    $.get(baseUrl + '/notice/detail?noticeId=' + notifyId, function (res) {
        if (res.code === 200) {
            notifyDetail = res.data
            setNotifyDefaultValue(form)
            renderWorkFormats(form) //初始化上传作品的格式

            $.get(baseUrl + '/entryField/queryEntryFieldList', function (entryFieldRes) {
                if (entryFieldRes.code === 200) {
                    workThemeSelect.update({ data: entryFieldRes.data })
                    if (!!workId) {
                        $.get(baseUrl + '/works/detail?id=' + workId, function (res) {
                            if (res.code === 200) {
                                resFormData = res.data
                                setWorkDefaultValue(form)
                                updateWorkThemeSelectStatus(entryFieldRes.data)
                                renderFormParams(laydate, 'edit')
                                renderWorkUpload(upload)
                            }
                        })
                    } else {
                        renderFormParams(laydate) //初始化动态表单字段
                        renderWorkUpload(upload)
                    }
                }
            })
        }
    })
    form.on('select(worksTypes)', function (obj) {
        selectSmallTemplate = ''
        if (workTypes.length > 0) {
            selectWrokInfo = workTypes.find(function (item) {
                return item.worksTypeId === obj.value
            })
        }
        setSmallOption(form, obj.value)
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
    form.on('select(smallType)', function (obj) {
        var select = smallInfos.find(function (item) {
            return item.id === obj.value
        })
        selectSmallTemplate = select && select.template
        renderFormParams(form)
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
        // if (!resFormData.url) {
        //     return layer.msg('请上传作品')
        // }
        submitFun(obj, 'save')
    })
})
function setNotifyDefaultValue(form) {
    for (var i = 0; i < notifyDetail.worksTypes.length; i++) {
        var obj = notifyDetail.worksTypes[i]
        $('#work_type').append('<option value="' + obj.id + '">' + obj.name + '</option>')
    }
    form.render('select')
    if (!workId) {
        $('#work_type').val('')
        $('select[name="worksInfo"]').val('')
    }
    form.val('work_form', {
        activityName: notifyDetail.shortName,
        noticeId: notifyDetail.id,
    })
}
function setWorkDefaultValue(form) {
    if (resFormData.smallTypeId) {
        setSmallOption(form, resFormData.worksTypeId)
    }
    form.val('work_form', {
        worksTypeId: resFormData.worksTypeId,
        worksInfo: resFormData.worksInfo,
        name: resFormData.name,
        author: resFormData.author,
        format: resFormData.format,
        smallTypeId: resFormData.smallTypeId,
    })
    if (resFormData.url) {
        $('.workList').html('<a class="color-theme " target="_blank" href=' + imageUrl + resFormData.url + '>' + resFormData.filename + '</a>')
    }
}
function setSmallOption(form, id) {
    smallInfos =
        notifyDetail.worksTypes.find(function (item) {
            return item.id === id
        }).worksTypes || []
    if (smallInfos.length > 0) {
        $('#small_type').empty()
        for (var i = 0; i < smallInfos.length; i++) {
            $('#small_type').append(
                '<option template="' + smallInfos[i].template + '" value="' + smallInfos[i].id + '">' + smallInfos[i].name + '</option>'
            )
        }
    }
    if (!!workId) {
        form.render('select')
    }
}
function updateWorkThemeSelectStatus(entryFieldRes) {
    var arr = resFormData.workFields || []
    for (var j = 0; j < arr.length; j++) {
        var item = arr[j]
        for (var o = 0; o < entryFieldRes.length; o++) {
            if (entryFieldRes[o].id === item.fieldId) {
                entryFieldRes[o].selected = true
            }
            entryFieldRes[o].children.forEach(function (i) {
                if (i.id === item.fieldId) i.selected = true
            })
        }
    }
    workThemeSelect.update({ data: entryFieldRes })
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
    upload.render({
        elem: '#companyAttachment', //绑定元素
        url: baseUrl + '/upload/fileUpload', //上传接口
        accept: 'file',
        done: function (res) {
            if (res.code === 200) {
                $('.attachementList').html(
                    '<a class="color-theme " target="_blank" href=' + imageUrl + res.data.newFileName + '>' + res.data.oldFileName + '</a>'
                )
                resumeAddress.push(res.data)
            }
        },
    })
}
//获取动态表单字段 type 表示是否是编辑作品

function renderFormParams(laydate, type) {
    $('#formBasic').empty()
    $('#formOther').empty()
    $('#formList').hide()
    //获取模板类型 如果是新媒体品牌栏目 需要增加栏目表
    formTemplate = (selectSmallTemplate === 'mediaBrand' ? selectSmallTemplate : '') || selectWrokInfo.template || 'newspapers'

    var formParams = [],
        temp = '',
        clounmTemp = ''
    if (!!type) {
        formParams = resFormData.worksExtends || []
    } else {
        formParams = defaultForm[formTemplate]
    }
    for (var i = 0; i < formParams.length; i++) {
        var el = '',
            v = formParams[i].value || ' '
        if (formParams[i].sort === 1) {
            el =
                '<input class="layui-input item" id="' +
                (formParams[i].type || i) +
                '" value="' +
                v +
                '" placeholder="' +
                formParams[i].placeholder +
                '"/>'
        } else if (formParams[i].sort === 2) {
            el = '<textarea class="layui-textarea item" placeholder="' + formParams[i].placeholder + '">' + v + '</textarea>'
        }
        temp +=
            '<div class="layui-form-item" sort="' +
            formParams[i].sort +
            '">' +
            '<label class="layui-form-label">' +
            formParams[i].name +
            '</label>' +
            '<div class="layui-input-block">' +
            el +
            '</div></div>'
    }
    $('#formBasic').append(temp)
    if (selectSmallTemplate === 'mediaBrand') {
        $('#formOther').append('<div class="tip-title">栏目代表作</div>')
        for (var j = 0; j < defaultForm.clounmWork.length; j++) {
            var el = '',
                v = defaultForm.clounmWork[j].value || ' '
            if (defaultForm.clounmWork[j].sort === 1) {
                el =
                    '<input class="layui-input item" id="' +
                    (defaultForm.clounmWork[j].type || j) +
                    '" value="' +
                    v +
                    '" placeholder="' +
                    defaultForm.clounmWork[j].placeholder +
                    '"/>'
            } else if (defaultForm.clounmWork[j].sort === 2) {
                el = '<textarea class="layui-textarea item" placeholder="' + defaultForm.clounmWork[j].placeholder + '">' + v + '</textarea>'
            }
            clounmTemp +=
                '<div class="layui-form-item" sort="' +
                defaultForm.clounmWork[j].sort +
                '">' +
                '<label class="layui-form-label">' +
                defaultForm.clounmWork[j].name +
                '</label>' +
                '<div class="layui-input-block">' +
                el +
                '</div></div>'
        }
        $('#formOther').append(clounmTemp)
    }
    if (selectSmallTemplate === 'serialReport') {
        $('#formList').show()
    }
    // laydate.render({
    //     elem: '#date',
    //     showBottom: false,
    // })
}
function formatWorksExtends() {
    var els = $('#formBasic').find('.layui-form-item'),
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

    $.ajax({
        type: 'post',
        url: baseUrl + '/works/saveOrEditWorks',
        data: JSON.stringify(formData),
        contentType: 'application/json;charset=UTF-8',
        success: function (res) {
            resFormData = res.data
            if (res.code == 200) {
                if (!!workId) {
                    window.location.href = 'workListForSubmit.html'
                    layer, msg('修改成功')
                }
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
                } else if (type === 'download') {
                    window.location.href = baseUrl + '/works/downloadWork?workId=' + res.data.id
                }
            } else {
                layer.msg(res.message)
            }
        },
    })
}
function back() {
    if (!!workId) {
        window.location.href = 'workListForSubmit.html'
    } else {
        window.location.href = 'notifyList.html'
    }
}
function removeColunmNode(target) {
    $(target).parent().parent().remove()
}
function addColunmNode(target) {
    $('#formList tbody').append(
        '<tr>' +
            '<td><input type="text" class="layui-input" /></td>' +
            '<td><input type="text" class="layui-input" /></td>' +
            '<td><input type="text" class="layui-input" /></td>' +
            '<td><input type="text" class="layui-input" /></td>' +
            '<td><input type="text" class="layui-input" /></td>' +
            '<td><input type="text" class="layui-input" /></td>' +
            '<td>' +
            '<i class="layui-icon-reduce-circle layui-icon font-18 cursor-pointer del-award-btn" title="删除" onclick="removeColunmNode(this)" ></i>' +
            '<i class="layui-icon-add-circle layui-icon font-18 cursor-pointer" title="新增" onclick="addColunmNode(this)"></i>' +
            '</td>' +
            '</tr>'
    )
}
