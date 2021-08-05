var baseUrl = 'http://11.1.1.186:8082/rsp-group-innovation'
var imageUrl = 'http://11.1.1.186:20001/'

var awardLevel = [
    {
        level: '一等奖',
        value: '1',
    },
    {
        level: '二等奖',
        value: '1',
    },
    {
        level: '三等奖',
        value: '1',
    },
    {
        level: '优秀奖',
        value: '1',
    },
]

// 获取UUID
function guid() {
    return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0,
            v = c == 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
    })
}

// 转换时间
function formatTime(v) {
    var date = new Date(v),
        year = date.getFullYear(),
        month = date.getMonth(),
        day = date.getDate(),
        hour = date.getHours(),
        minute = date.getMinutes(),
        seconds = date.getSeconds()
    return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + seconds
}

//获取缓存
var reviewState = sessionStorage.getItem('reviewState'),
    workId = sessionStorage.getItem('workId'),
    noticeId = sessionStorage.getItem('notifyId'),
    token = sessionStorage.getItem('token')
