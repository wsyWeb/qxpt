var formats = [
    { name: '.DOC', value: '.DOC' },
    { name: '.DOCX', value: '.DOCX' },
    { name: '.TXT', value: '.TXT' },
    { name: '.PNG', value: '.PNG' },
    { name: '.JPG', value: '.JPG' },
    { name: '.MP4', value: '.MP4' },
    { name: '.MP3', value: '.MP3' },
]

var workInfoList = [
    {
        label: '计划单列市',
        value: 0,
        uid: guid(),
    },
    {
        label: '气象类高校',
        value: 1,
        uid: guid(),
    },
    {
        label: '气象局单位',
        value: 2,
        uid: guid(),
    },
    {
        label: '团体组织（中学、社会性组织）',
        value: 3,
        uid: guid(),
    },
]
var resFormData = {},
    enclosureParams = [],
    expertMebers = null,
    id = sessionStorage.getItem('notifyId'),
    allLeaders = [],
    allExperts = [],
    workInfos = {}, // 作品信息
    activeInfos = [], //活动信息
    showWorkInfoBigSetting = false

var awardTypeTpl = award_type.innerHTML,
    awardTypeView = document.getElementById('awardType')

var awardSettingTpl = award_setting.innerHTML,
    awardSettingView = document.getElementById('awardSetting')

// 删除附件
$('.attachment_list').on('click', '.del-btn', function (e) {
    var oldFileName = $(e.target).attr('name')
    $(e.target).parent().remove()
    enclosureParams = enclosureParams.filter(function (i) {
        return i.name !== oldFileName
    })
})
// 编辑奖项类别需要更改作品信息的值
$('body').on('blur', 'input[lay-filter="work_type_input"]', function (e) {
    var id = $(e.target).parent().parent().attr('id')
    for (var i = 0; i < workInfoList.length; i++) {
        for (var j = 0; j < workInfos[i].length; j++) {
            if (workInfos[i][j].worksTypeId === id) {
                workInfos[i][j].type = this.value
                break
            }
        }
    }
    for (var i = 0; i < activeInfos.length; i++) {
        if (activeInfos[i].worksTypeId === id) {
            activeInfos[i].type = this.value
        }
    }
    renderTable()
})

$.get(baseUrl + '/expert/queryExperyList?examineStatus=2&page=1&limit=10000&expertLevel=1', function (res) {
    if (res.code === 200) {
        allExperts = res.data.data
        expertMebers.update({ data: res.data.data })
    }
})
layui.use(['upload', 'laydate', 'form', 'laytpl', 'element', 'table'], function () {
    var upload = layui.upload,
        laytpl = layui.laytpl,
        laydate = layui.laydate,
        form = layui.form,
        table = layui.table,
        element = layui.element

    var tableCols = [
        { field: 'type', title: '作品类型' },
        { field: 'format', title: '作品格式' },
        { field: 'big', title: '大小限制' },
        { field: 'count', title: '数量限制' },
        {
            field: 'template',
            title: '推荐表模板',
            templet: function (d) {
                switch (d.template) {
                    case 'newspapers':
                        return '报刊类推荐表模板'
                        break
                    case 'shortVideo':
                        return '短视频创作大赛报名表'
                        break
                    case 'book':
                        return '科普作品推荐表'
                        break
                    case 'media':
                        return '媒体融合类推荐表模板'
                        break
                    case 'maker':
                        return '科普创客推荐表'
                        break
                    default:
                        return ''
                }
            },
        },
        { field: '', title: '操作', toolbar: '#work_format_btn' },
    ]
    workFormat = xmSelect.render({
        el: '#workFormat',
        theme: {
            color: '#2a6be3',
        },
        language: 'zn',
        name: 'format',
        data: formats,
    })
    expertMebers = xmSelect.render({
        el: '#expert_members',
        language: 'zn',
        filterable: true,
        theme: {
            color: '#2a6be3',
        },
        // layVerify: 'required',
        // layVerType: 'msg',
        prop: {
            name: 'name',
            value: 'id',
        },
        on: function (obj) {
            $('#expert_leader').empty()
            allLeaders = obj.arr
            resFormData.finalExperts = obj.arr.map(function (i) {
                return {
                    expertId: i.userName,
                    expertName: i.name,
                }
            })
            for (var i = 0; i < obj.arr.length; i++) {
                $('#expert_leader').append('<option value="' + obj.arr[i].id + '">' + obj.arr[i].name + '</option>')
            }
            $('#expert_leader').val('')
            form.render('select')
            // $('#expert_leader').next().find('.layui-unselect').val('')
        },
    })
    renderTable = function () {
        for (var o = 0; o < workInfoList.length; o++) {
            table.render({
                elem: '#worksInfoTable' + o,
                cols: [tableCols],
                data: workInfos[o] || [],
            })
        }

        var activityCols = tableCols.filter(function (item) {
            return item.field !== 'big' && item.field !== 'format' && item.field !== 'count'
        })
        showWorkInfoBigSetting = Number(form.val('notyfy_form').isCollection) !== 1 && Number(form.val('notyfy_form').isEnter) === 1
        if (showWorkInfoBigSetting) {
            table.render({
                elem: '#worksInfoTable',
                cols: [activityCols],
                data: activeInfos,
            })
        }
    }
    var getAwardType = function (v) {
        $.get(baseUrl + '/worksType/findListById?id=' + v, function (res) {
            if (res.code === 200 && res.data) {
                resFormData.worksTypes = res.data
                setAwardValue(laytpl, element)
                activeInfos = res.data.map(function (item) {
                    return {
                        worksTypeId: item.id,
                        type: item.name,
                        template: item.template,
                    }
                })
                for (var o = 0; o < workInfoList.length; o++) {
                    workInfos[o] = res.data.map(function (item) {
                        return {
                            worksTypeId: item.id,
                            // id: item.id,
                            type: item.name,
                            format: '',
                            big: '',
                            count: '',
                            template: item.template,
                        }
                    })
                }
                renderTable()
            }
        })
    }
    if (!!id) {
        $('#curTitle').html('编辑公告')
        $.get(baseUrl + '/notice/detail?noticeId=' + id, function (res) {
            if (res.code === 200) {
                resFormData = res.data || {}
                enclosureParams = res.data.enclosures
                // 作品信息
                if (resFormData.worksInfos) {
                    workInfos = resFormData.worksInfos
                } else {
                    for (var i = 0; i < workInfoList.length; i++) {
                        workInfos[i] = res.data.worksTypes.map(function (item) {
                            return {
                                worksTypeId: item.id,
                                type: item.name,
                                format: '',
                                big: '',
                                count: '',
                                template: item.template,
                            }
                        })
                    }
                }
                if (resFormData.activeInfos) {
                    activeInfos = resFormData.activeInfos
                } else {
                    for (var i = 0; i < res.data.worksTypes.length; i++) {
                        activeInfos.push({
                            worksTypeId: res.data.worksTypes[i].id,
                            type: res.data.worksTypes[i].name,
                            template: '',
                        })
                    }
                }
                setFormDefaultValue(form)
                setAwardValue(laytpl, element)
                updateExpertMemberSelectStatus()
                // renderTable()
            }
        })
    } else {
        getAwardType(2)
    }
    //执行实例
    table.on('tool(works_info_table)', function (obj) {
        $('#work_info_form').show()
        var selectFormats = obj.data.format ? obj.data.format.split(',') : [],
            selectFormatArr = []
        for (var i = 0; i < selectFormats.length; i++) {
            var item = formats.find(function (j) {
                return j.value === selectFormats[i]
            })
            selectFormatArr.push(item)
        }
        workFormat.setValue(selectFormatArr)
        form.val('work_info_form', obj.data)
        layer.open({
            type: 1,
            title: '编辑信息',
            content: $('#work_info_form'),
            scrollbar: false,
            closeBtn: 0,
            area: ['500px', 'auto'],
            btn: ['确定', '取消'],
            yes: function (index) {
                var v = form.val('work_info_form')
                obj.update(v)
                $('#work_info_form').hide()
                layer.close(index)
            },
            btn2: function () {
                $('#work_info_form').hide()
            },
        })
    })
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
            $('.activityInfoWrap').hide()
            $('.prize_setting').show()
        } else {
            var isEnter = form.val('notyfy_form').isEnter
            $('input[name="isEnter"]').prop('disabled', false)
            $('.prize_setting').hide()
            if (Number(isEnter) !== 1) {
                $('a[lay-filter="next"]').hide()
                $('a[lay-filter="release"]').show()
            } else {
                $('.activityInfoWrap').show()
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
        if (Number(obj.value) === 1 && Number(form.val('notyfy_form').isCollection) !== 1) {
            $('.activityInfoWrap').show()
        }
    })
    form.on('radio(vote)', function (obj) {
        if (Number(obj.value) === 1) {
            $('.vote-wrap').show()
        } else {
            $('.vote-wrap').hide()
        }
    })
    form.on('radio(feedBack)', function (obj) {
        if (Number(obj.value) === 1) {
            $('.score-wrap').show()
        } else {
            $('.score-wrap').hide()
        }
        if (Number(obj.value) === 3) {
            $('.onlineVoting').show()
        } else {
            $('.onlineVoting').hide()
        }
    })
    form.on('select(expertLeader)', function (obj) {
        console.log(obj)
    })
    form.on('submit(next)', function (obj) {
        // if (!resFormData.filePath) {
        //     return layer.msg('请先导入公告正文')
        // }
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
        if (!resFormData.filePath) {
            return layer.msg('请先导入公告正文')
        }
        if (Number(obj.field.isEnter) === 1 && !obj.field.shortName) {
            return layer.msg('请输入活动简称')
        }
        if (Number(obj.field.isCollection) === 1 && (!resFormData.finalExperts || resFormData.finalExperts.length === 0)) {
            return layer.msg('请指派终审专家组员')
        }
        submitFun(obj, 'release')
    })
    var date = new Date()
    laydate.render({
        elem: '#submit_date',
        showBottom: false,
        min: date.toLocaleDateString(),
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
function updateExpertMemberSelectStatus() {
    var finalExperts = resFormData.finalExperts || []
    for (var i = 0; i < allExperts.length; i++) {
        for (var j = 0; j < finalExperts.length; j++) {
            if (allExperts[i].userName === finalExperts[j].expertId) {
                allExperts[i].selected = true
            }
        }
    }
    expertMebers.update({ data: allExperts })
}
function setFormDefaultValue(form) {
    form.val('notyfy_form', {
        id: resFormData.id,
        title: resFormData.title,
        summary: resFormData.summary,
        type: resFormData.type,
        tag: resFormData.tag,
        shortName: resFormData.shortName,
        isCollection: resFormData.isCollection,
        isEnter: resFormData.isEnter,
        submitDate: resFormData.submitDate,
        feedBack: resFormData.feedBack,
        score: resFormData.score,
        distMethod: resFormData.distMethod,
        vote: resFormData.vote,
        voteLinks: resFormData.voteLinks,
        expertWeight: resFormData.expertWeight,
        voteWeight: resFormData.voteWeight,
    })
    $('.word_wrap').html(resFormData.fileName)
    for (var i = 0; i < resFormData.enclosures.length; i++) {
        $('.attachment_list').append(
            '<li> <a class="color-theme " target="_blank" href=' +
                imageUrl +
                resFormData.enclosures[i].url +
                '>' +
                resFormData.enclosures[i].name +
                "</a><i class='del-btn layui-icon layui-icon-close cursor-pointer' name=" +
                resFormData.enclosures[i].name +
                '></i></li>'
        )
    }
    if (resFormData.leaderId) {
        $('#expert_leader').append('<option value="' + resFormData.leaderId + '">' + resFormData.leaderName + '</option>')
        form.render('select')
    }
    if (Number(resFormData.isEnter) === 1) {
        $('a[lay-filter="next"]').show()
        $('a[lay-filter="release"]').hide()
        if (Number(resFormData.isCollection) !== 1) {
            $('.activityInfoWrap').show()
        }
    }
    if (Number(resFormData.isCollection) === 1) {
        $('.prize_setting').show()
        $('input[name="isEnter"]').prop('disabled', true)
        form.render('radio')
    }
    if (Number(resFormData.vote) === 1) {
        $('.vote-wrap').show()
    }
    if (Number(resFormData.feedBack) === 1) {
        $('.score-wrap').show()
    } else {
        $('.score-wrap').hide()
    }
    if (Number(resFormData.feedBack) === 3) {
        $('.onlineVoting').show()
    }
}
function setAwardValue(laytpl, element) {
    laytpl(awardTypeTpl).render(resFormData.worksTypes || [], function (html) {
        awardTypeView.innerHTML = html
    })
    var awardSetting = awardLevel
    if (resFormData.awardSetting) {
        awardSetting = JSON.parse(resFormData.awardSetting)
    }
    laytpl(awardSettingTpl).render(awardSetting, function (html) {
        awardSettingView.innerHTML = html
    })
    element.render()
}
function submitFun(obj, type) {
    var formData = Object.assign(resFormData, obj.field)
    var awards = formatAwardSetting()
    formData.state = type === 'draft' ? 0 : 1
    formData.type = Number(formData.type)
    formData.isEnter = Number(formData.isEnter)
    formData.isCollection = Number(formData.isCollection)
    formData.vote = Number(formData.vote)
    formData.enclosureParams = enclosureParams //附件
    formData.leaderName = $('#expert_leader option:selected').text() // 获取组长名字
    formData.awardSetting = JSON.stringify(awards) //奖项设定
    formData.worksTypes = formatWorksTypes() //奖项类别
    if (type === 'release' && formData.isEnter === 1 && formData.worksTypes.length === 0) {
        return layer.msg('至少填写一条奖项类别')
    }
    if (type === 'release' && formData.isCollection === 1 && awards.length === 0) {
        return layer.msg('至少填写一条奖项设定')
    }
    if (formData.isEnter === 1 && formData.isCollection !== 1) {
        formData.activeInfos = activeInfos
    } else if (formData.isCollection === 1) {
        formData.worksInfos = workInfos
    }
    debugger
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
                sessionStorage.removeItem('notifyId')
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
        var level = $(els[i]).find('.label').val(),
            value = $(els[i]).find('.content').val()
        if (level && value) {
            params.push({
                level: level,
                value: value,
            })
        }
    }
    return params
}
function formatWorksTypes() {
    var parentEls = $('#awardType .layui-colla-item'),
        params = []
    for (var i = 0; i < parentEls.length; i++) {
        var childEls = $(parentEls[i]).find('.item'),
            id = $(parentEls[i]).attr('id'),
            types = []

        for (var j = 0; j < childEls.length; j++) {
            types.push({
                name: $(childEls[j]).find('input').val(),
                template: $(childEls[j]).attr('template'),
            })
        }
        params.push({
            id,
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
    var uid = guid()
    $('#awardType').append(
        '<div class="layui-colla-item" id="' +
            uid +
            '">' +
            '<h2 class="layui-colla-title">' +
            '<input lay-filter="work_type_input" type="text" class="layui-input" value="类别' +
            uid +
            '"/>' +
            '<i class="layui-icon-reduce-circle layui-icon font-18 cursor-pointer del-award-btn" title="删除" onclick="removeAwardTypeNode(this)"></i>' +
            '</h2>' +
            ' <div class="layui-colla-content layui-show">' +
            '<i class="layui-icon-add-circle layui-icon font-18 cursor-pointer" title="新增" onclick="addAwardItemNode(this)"></i>' +
            '</div>' +
            '</div>'
    )
    for (var i = 0; i < workInfoList.length; i++) {
        workInfos[i].push({
            worksTypeId: uid,
            // id: guid(),
            type: '类别' + uid,
            format: '',
            big: '',
            count: '',
            template: '',
        })
    }
    activeInfos.push({
        worksTypeId: uid,
        type: '类别' + uid,
        template: '',
    })
    renderTable()
}
function addAwardLevelNode(target) {
    $('#awardSetting').append(
        '<div class="item relative overflow-hidden m-b-xs text-center">' +
            '<input type="text" class="layui-input label"  placeholder="输入奖项等级" />' +
            '<input type="number" class="layui-input content"  placeholder="输入奖项个数" />' +
            '<div class="del-level-btn">' +
            '<i class="del layui-icon-reduce-circle layui-icon font-18 cursor-pointer" title="删除" onclick="removeAwardLevelNode(this)"></i>' +
            '</div>' +
            '<div class="add-level-btn">' +
            ' <i class="add layui-icon-add-circle layui-icon font-18 cursor-pointer" title="新增" onclick="addAwardLevelNode(this)"></i>' +
            '</div>' +
            '</div>'
    )
}
function removeAwardTypeNode(target) {
    var id = $(target).parent().parent().attr('id')
    for (var i = 0; i < workInfoList.length; i++) {
        workInfos[i] = workInfos[i].filter(function (item) {
            return item.worksTypeId !== id
        })
    }
    activeInfos = activeInfos.filter(function (item) {
        return item.worksTypeId !== id
    })
    renderTable()
    $(target).parent().parent().remove()
}
function removeAwardItemNode(target) {
    $(target).parent().remove()
}
function removeAwardLevelNode(target) {
    var els = $('#awardSetting .item')
    if (els.length === 1) return
    $(target).parent().parent().remove()
}
