var resFormData = {},
    enclosureParams = [],
    expertMebers = null
$('.attachment_list').on('click', '.del-btn', function (e) {
    var oldFileName = $(e.target).attr('name')
    $(e.target).parent().remove()
    enclosureParams = enclosureParams.filter(function (i) {
        return i.name !== oldFileName
    })
})
$.get(baseUrl + '/expert/queryExperyList?examineStatus=2&page=1&limit=10000&expertLevel=1', function (res) {
    expertMebers.update({ data: res.data.data })
})
layui.use(['upload', 'laydate', 'form', 'laytpl', 'element', 'table'], function () {
    var upload = layui.upload,
        laytpl = layui.laytpl,
        laydate = layui.laydate,
        laydate = layui.laydate,
        form = layui.form,
        table = layui.table,
        element = layui.element,
        awardSettingTpl = award_setting.innerHTML,
        awardSettingView = document.getElementById('awardSetting')
    laytpl(awardSettingTpl).render(awardLevel, function (html) {
        awardSettingView.innerHTML = html
    })

    expertMebers = xmSelect.render({
        el: '#expert_members',
        language: 'zn',
        filterable: true,
        // layVerify: 'required',
        // layVerType: 'msg',
        prop: {
            name: 'name',
            value: 'id',
        },
        on: function (obj) {
            $('#expert_leader').empty()
            for (var i = 0; i < obj.arr.length; i++) {
                $('#expert_leader').append('<option value="' + obj.arr[i].id + '">' + obj.arr[i].name + '</option>')
            }
            form.render('select')
        },
    })
    var renderTable = function () {
        table.render({
            elem: '#worksInfoTable',
            cols: [
                [
                    { field: 'type', title: '作品类型' },
                    { field: 'qe1', title: '格式限制' },
                    { field: 'cxc2', title: '作品格式' },
                    { field: 'sd3', title: '大小限制' },
                    { field: 'na4me', title: '作品格式' },
                    { field: 'namde', title: '数量限制' },
                    { field: 'namdwe', title: '推荐表模板' },
                ],
            ],
            data: [{ type: 'asd' }],
        })
    }
    var getAwardType = function (v) {
        $.get(baseUrl + '/worksType/findListById?id=' + v, function (res) {
            if (res.code === 200 && res.data) {
                var awardTypeTpl = award_type.innerHTML
                var awardTypeView = document.getElementById('awardType')
                laytpl(awardTypeTpl).render(res.data, function (html) {
                    awardTypeView.innerHTML = html
                })
            }
        })
    }
    getAwardType(1)
    renderTable()
    //执行实例
    form.on('select(type)', function (obj) {
        getAwardType(Number(obj.value))
    })
    form.on('radio(workCollection)', function (obj) {
        if (Number(obj.value) === 1) {
            $('input[name="isEnter"]').prop('checked', false)
            $('#isEnter_true').prop('checked', true)
            $('input[name="isEnter"]').prop('disabled', true)
            $('a[lay-filter="next"]').show()
            $('a[lay-filter="release"]').hide()
            $('.prize_setting').show()
        } else {
            var isEnter = form.val('notyfy_form').isEnter
            $('input[name="isEnter"]').prop('disabled', false)
            $('.prize_setting').hide()
            if (Number(isEnter) !== 1) {
                $('a[lay-filter="next"]').hide()
                $('a[lay-filter="release"]').show()
            }
        }
        form.render('radio')
    })
    form.on('radio(activityRegistration)', function (obj) {
        if (Number(obj.value) === 1) {
            $('a[lay-filter="next"]').show()
            $('a[lay-filter="release"]').hide()
        } else {
            $('a[lay-filter="next"]').hide()
            $('a[lay-filter="release"]').show()
        }
    })
    form.on('submit(next)', function (obj) {
        $('.collection-setting').show()
        $('.basic-setting').hide()
        $('a[lay-filter="next"]').hide()
        $('a[lay-filter="prev"]').show()
        $('a[lay-filter="release"]').show()
        renderTable()
    })
    form.on('submit(prev)', function (obj) {
        $('.collection-setting').hide()
        $('.basic-setting').show()
        $('a[lay-filter="next"]').show()
        $('a[lay-filter="prev"]').hide()
        $('a[lay-filter="release"]').hide()
    })
    form.on('submit(draft)', function (obj) {
        submitFun(obj, 'draft')
    })
    form.on('submit(release)', function (obj) {
        submitFun(obj, 'release')
    })
    laydate.render({
        elem: '#submit_date',
        showBottom: false,
    })
    upload.render({
        elem: '#upload_word', //绑定元素
        url: baseUrl + '/upload/fileUpload', //上传接口
        accept: 'file',
        exts: 'doc|docx|pdf',
        done: function (res) {
            if (res.code != 200) {
                layer.msg('上传失败')
            } else {
                resFormData.fileName = res.data.oldFileName
                resFormData.filePath = res.data.newFileName
                $('.word_wrap').empty()
                $('.word_wrap').append(
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
        elem: '#upload_attachment', //绑定元素
        url: baseUrl + '/upload/fileUpload', //上传接口
        accept: 'file',
        // exts: 'doc|docx|pdf',
        done: function (res) {
            if (res.code != 200) {
                layer.msg('上传失败')
            } else {
                var eixtFile = enclosureParams.find(function (i) {
                    return i.name === res.data.oldFileName
                })
                if (!eixtFile) {
                    $('.attachment_list').append(
                        '<li> <a class="color-theme " target="_blank" href=' +
                            imageUrl +
                            res.data.newFileName +
                            '>' +
                            res.data.oldFileName +
                            "</a><i class='del-btn layui-icon layui-icon-close cursor-pointer' name=" +
                            res.data.oldFileName +
                            '></i></li>'
                    )
                    enclosureParams.push({
                        name: res.data.oldFileName,
                        url: res.data.newFileName,
                    })
                }
            }
            //上传完毕回调
        },
        error: function () {
            layer.msg('上传失败')
        },
    })
})
function submitFun(obj, type) {
    var formData = Object.assign(obj.field, {})
    formData.state = type === 'draft' ? 0 : 1
    formData.type = Number(formData.type)
    formData.isEnter = Number(formData.isEnter)
    formData.isCollection = Number(formData.isCollection)
    formData.enclosureParams = enclosureParams //附件
    formData.awardSetting = JSON.stringify(formatAwardSetting()) //奖项设定
    formData.worksTypes = formatWorksTypes() //奖项类别
    console.log(JSON.stringify(formData))
    $.ajax({
        type: 'post',
        url: baseUrl + '/notice/saveNotice',
        data: JSON.stringify(formData),
        contentType: 'application/json;charset=UTF-8',
        success: function (res) {
            resFormData = res.data
            if (res.code == 200) {
                layer.msg('提交成功')
                window.location.href = 'notifyManage.html'
            } else {
                layer.msg(res.message)
            }
        },
    })
}

function formatAwardSetting() {
    var els = $('#awardSetting .item'),
        params = []
    for (var i = 0; i < els.length; i++) {
        params.push({
            level: $(els[i]).find('.label').val(),
            value: $(els[i]).find('.content').val(),
        })
    }
    return params
}
function formatWorksTypes() {
    var parentEls = $('#awardType .layui-colla-item'),
        params = []
    for (var i = 0; i < parentEls.length; i++) {
        var childEls = $(parentEls[i]).find('.item'),
            types = []
        for (var j = 0; j < childEls.length; j++) {
            types.push({
                name: $(childEls[j]).find('input').val(),
                worksTypes: [],
            })
        }
        params.push({
            name: $(parentEls[i]).find('.layui-colla-title input').val(),
            worksTypes: types,
        })
    }
    return params
}
function addAwardItemNode(target) {
    $(target).before(
        ' <div class="layui-inline item position-relative">' +
            '<input type="text" class="layui-input" value="" />' +
            '<a class="layui-btn layui-btn-primary del-work-btn" onclick="removeAwardItemNode(this)">' +
            '<i class="layui-icon-delete layui-icon "></i>' +
            '</a></div>'
    )
}
function addAwardTypeNode(target) {
    $('#awardType').append(
        '<div class="layui-colla-item">' +
            '<h2 class="layui-colla-title">' +
            '<input type="text" class="layui-input" />' +
            '<i class="layui-icon-reduce-circle layui-icon font-18 cursor-pointer del-award-btn" title="删除" onclick="removeAwardTypeNode(this)"></i>' +
            '</h2>' +
            ' <div class="layui-colla-content layui-show">' +
            '<i class="layui-icon-add-circle layui-icon font-18 cursor-pointer" title="新增" onclick="addAwardItemNode(this)"></i>' +
            '</div>' +
            '</div>'
    )
}
function addAwardLevelNode(target) {
    $(target).before(
        '<div>' +
            '<div class="layui-inline">' +
            '<input type="text" class="layui-input"  />' +
            '</div>' +
            ' <div class="layui-inline">' +
            '<input type="number" class="layui-input" />' +
            '</div> 个' +
            ' <i class="layui-icon-reduce-circle layui-icon font-18 cursor-pointer del-level-btn p-l-md" title="删除" onclick="removeAwardLevelNode(this)"></i>' +
            '</div>'
    )
}
function removeAwardTypeNode(target) {
    $(target).parent().parent().remove()
}
function removeAwardItemNode(target) {
    $(target).parent().remove()
}
function removeAwardLevelNode(target) {
    $(target).parent().remove()
}
