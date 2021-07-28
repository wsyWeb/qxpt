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
