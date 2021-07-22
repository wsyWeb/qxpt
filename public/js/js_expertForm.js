var headPortrait,
    resumeAddress = [],
    periodical = null,
    referrerCode = null,
    resFormData = {},
    fieldOneArr = [],
    fieldTwoArr = [],
    entryFields = [],
    defaultExpertParams = []

var fieldOneSelect = xmSelect.render({
    el: '#entryField',
    language: 'zn',
    layVerify: 'required',
    layVerType: 'msg',
    prop: {
        name: 'title',
        value: 'id',
    },
    data: [],
    on: function (selectObj) {
        fieldTwoArr = []
        fieldOneArr = []
        selectObj.arr.forEach(function (i) {
            var exitNode = fieldOneArr.find(function (o) {
                return o.id === i.parentId
            })
            if (!exitNode) {
                var parantNode = entryFields.find(function (j) {
                    return j.id === i.parentId
                })
                fieldOneArr.push({
                    id: parantNode.id,
                    title: parantNode.title,
                })
            }
            fieldTwoArr.push({
                id: i.id,
                title: i.title,
                parentId: i.parentId,
            })
        })
    },
})
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

$.get(baseUrl + '/expert/queryExpertByUserId?user_name=' + sessionStorage.getItem('token'), function (res) {
    if (res.code == 200) {
        resFormData = res.data || {}
        fieldOneArr = resFormData.fieldOneArr || []
        fieldTwoArr = resFormData.fieldTwoArr || []
        // defaultExpertParams = resFormData.dataArr || defaultExpertParams
        setFormDefaultValue()
        if (res.data) {
            defaultExpertParams = resFormData.dataArr
            setDefaultParams()
            resetForm()
        } else {
            getDefineParams()
        }

        $.get(baseUrl + '/entryField/queryEntryFieldList', function (resEntryFields) {
            if (resEntryFields.code === 200) {
                var mapRes = resEntryFields.data.filter(function (i) {
                    return i.children && i.children.length > 0
                })
                entryFields = mapRes
                if (fieldTwoArr.length > 0) {
                    for (var j = 0; j < fieldTwoArr.length; j++) {
                        var item = fieldTwoArr[j]
                        for (var o = 0; o < mapRes.length; o++) {
                            mapRes[o].children.forEach(function (i) {
                                if (i.id === item.id) i.selected = true
                            })
                        }
                    }
                }

                fieldOneSelect.update({ data: mapRes })
            }
        })
    }
})
function getDefineParams() {
    $.get(baseUrl + '/template/queryTemplateList', function (res) {
        if (res.code === 200) {
            defaultExpertParams = res.data.dataArr
            setDefaultParams()
        }
    })
}
function setFormDefaultValue() {
    if (resFormData.headPortrait) {
        $('#upload_img_btn').hide()
        $('#headPortrait-img').show()
        document.getElementById('headPortrait-img').setAttribute('src', imageUrl + resFormData.headPortrait)
    }
    if (resFormData.resumeAddressArr) {
        for (var i = 0; i < resFormData.resumeAddressArr.length; i++) {
            var item = resFormData.resumeAddressArr[i]
            $('.file-lists').append(
                '<li> <a class="color-theme " target="_blank" href=' +
                    imageUrl +
                    item.newFileName +
                    '>' +
                    item.oldFileName +
                    "</a><i class='del-btn layui-icon layui-icon-close cursor-pointer' name=" +
                    item.oldFileName +
                    '></i></li>'
            )
            resumeAddress.push(item)
        }
    }

    form.val('register_expert_form', {
        id: resFormData.id,
        userName: resFormData.userName,
        name: resFormData.name,
        headPortrait: resFormData.headPortrait,
        birthDay: resFormData.birthDay,
        gender: resFormData.gender,
        politis: resFormData.politis,
        workUnit: resFormData.workUnit,
        workingTime: resFormData.workingTime,
        positionLevel: resFormData.positionLevel,
        professional: resFormData.professional,
        graduateSchool: resFormData.graduateSchool,
        highestEducation: resFormData.highestEducation,
        positionTitle: resFormData.positionTitle,
        eamil: resFormData.eamil,
        mobilePhone: resFormData.mobilePhone,
        positionJob: resFormData.positionJob,
        postalAddress: resFormData.postalAddress,
        abroadGroup: resFormData.abroadGroup,
        threeYearsActivity: resFormData.threeYearsActivity,
        threeYearsReward: resFormData.threeYearsReward,
        majorMajors: resFormData.majorMajors,
        publishPaper: resFormData.publishPaper,
        acquirePatent: resFormData.acquirePatent,
        sceneOperation: resFormData.sceneOperation,
        entryField: resFormData.entryField,
        scorereadonly: resFormData.score,
        evaluatereadonly: resFormData.evaluate,
    })
}
function setDefaultParams() {
    for (var i = 0; i < defaultExpertParams.length; i++) {
        $('.defaultExpertParams').append(
            '<div class="layui-form-item " disable="' +
                defaultExpertParams[i].disable +
                '">' +
                '<label class="title">' +
                defaultExpertParams[i].title +
                '</label>' +
                '<div class="layui-input-block m-t-xs"><textarea class="layui-textarea content" maxlength="500" placeholder="限填500字符">' +
                defaultExpertParams[i].value +
                '</textarea></div>' +
                '</div>'
        )
    }
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
                $('#headPortrait-img').show()
                document.getElementById('headPortrait-img').setAttribute('src', imageUrl + res.data.newFileName)
            }
            //上传完毕回调
        },
        error: function () {
            layer.msg('上传失败')
        },
    })
    upload.render({
        elem: '#upload_attachment_btn', //绑定元素
        url: baseUrl + '/upload/fileUpload', //上传接口
        accept: 'file',
        exts: 'xls|pdf|doc|docx|jpg|png|gif|bmp|jpeg',
        done: function (res) {
            if (res.code == 200) {
                var eixtFile = resumeAddress.find(function (i) {
                    return i.oldFileName === res.data.oldFileName
                })
                if (!eixtFile) {
                    $('.file-lists').append(
                        '<li> <a class="color-theme " target="_blank" href=' +
                            imageUrl +
                            res.data.newFileName +
                            '>' +
                            res.data.oldFileName +
                            "</a><i class='del-btn layui-icon layui-icon-close cursor-pointer' name=" +
                            res.data.oldFileName +
                            '></i></li>'
                    )
                    resumeAddress.push(res.data)
                }
            }
            //上传完毕回调
        },
        error: function () {
            layer.msg('上传失败')
        },
    })
    var date = new Date()
    laydate.render({
        elem: '#birth_day',
        showBottom: false,
        max: date.toLocaleDateString(),
    })
    laydate.render({
        elem: '#working_time',
        showBottom: false,
        max: date.toLocaleDateString(),
    })
    form.on('submit(submit_expert)', function (data) {
        if (resumeAddress.length == 0) {
            return layer.msg('请先下载模板，由单位签字盖章后，回传打扫件再提交')
        }
        submitFun(data, 'submit', '/expert/saveExpert')
        return false
    })
    form.on('submit(sav_expert)', function (data) {
        layer.confirm(
            '你确定保存个人信息吗？保存后不可修改',
            {
                title: '提示',
                closeBtn: 0,
                btn: ['确定', '取消'], //按钮
            },
            function () {
                submitFun(data, 'save', '/expert/saveExpertDraft')
            }
        )
        return false
    })
    form.on('submit(download)', function (data) {
        if (!resFormData.id) {
            return layer.msg('请保存之后再下载')
        } else {
            window.location.href = baseUrl + '/expert/download/' + sessionStorage.getItem('token')
        }
    })
})
function submitFun(data, type, url) {
    var formData = Object.assign(data.field, resFormData)
    formData.userName = sessionStorage.getItem('token')
    formData.headPortrait = headPortrait || resFormData.headPortrait
    formData.resumeAddressArr = resumeAddress || resFormData.resumeAddress
    formData.periodical = resFormData.periodical || sessionStorage.getItem('periodical')
    formData.referrerCode = resFormData.code || sessionStorage.getItem('verificationCode')
    formData.fieldOneArr = fieldOneArr
    formData.fieldTwoArr = fieldTwoArr
    formData.dataArr = defineExpertParam()
    console.log(JSON.stringify(formData))
    $.ajax({
        type: 'post',
        url: baseUrl + url,
        data: JSON.stringify(formData),
        contentType: 'application/json;charset=UTF-8',
        success: function (res) {
            resFormData = res.data
            if (res.code == 200) {
                if (type == 'submit') {
                    window.location.href = 'expertApproveResult.html'
                } else if (type == 'download') {
                    downloadFun()
                } else {
                    layer.msg('保存成功')
                    resetForm()
                }
            } else {
                layer.msg(res.message)
            }
        },
    })
}
function resetForm() {
    $('.register_expert_form input:not(.layui-upload-file)').attr('disabled', true).addClass('layui-disabled')
    $('.register_expert_form textarea').attr('disabled', true).addClass('layui-disabled')
    $('.register_expert_form select').attr('disabled', true).addClass('layui-disabled')
    $('.define-node-add').hide()
    fieldOneSelect.update({ disabled: true })
    form.render('select')
    if (Number(resFormData.examineStatus) === 0 || Number(resFormData.examineStatus) == 1) {
        $('.save-btn').remove()
        $('.submit-btn').remove()
        $('.file-lists .del-btn').remove()
        $('#upload_attachment_btn').hide()
    }
}

function defineExpertParam() {
    var params = []
    var els = $('.defaultExpertParams').find('.layui-form-item') || []
    for (var o = 0; o < els.length; o++) {
        params.push({
            title: $(els[o]).find('.title').text(),
            value: $(els[o]).find('.content').val(),
            disable: $(els[o]).attr('disable'),
        })
    }
    return params
}
