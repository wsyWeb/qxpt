var notifyId = sessionStorage.getItem('notifyId'),
    notifyDetail = {},
    resFormData = {}

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
    on: function (selectObj) {},
})
layui.use(['form'], function () {
    var form = layui.form
    $.get(baseUrl + '/notice/detail?noticeId=' + notifyId, function (res) {
        if (res.code === 200) {
            notifyDetail = res.data
            setActivityDefaultValue(form)
        }
    })
    $.get(baseUrl + '/entryField/queryEntryFieldList', function (res) {
        if (res.code === 200) {
            workThemeSelect.update({ data: res.data })
            // setFormDefaultValue()
        }
    })
})
function setActivityDefaultValue(form) {
    for (var i = 0; i < notifyDetail.worksTypes.length; i++) {
        var obj = notifyDetail.worksTypes[i]
        $('#work_type').append('<option value="' + obj.id + '">' + obj.name + '</option>')
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
    })
    if (Number(notifyDetail.type) === 3) {
        $('.worksInfo_wrap').show()
    }
}
