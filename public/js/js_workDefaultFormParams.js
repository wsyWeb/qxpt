var defaultFormTitle = {
    newspapers: '',
}

var defaultForm = {
    // 报刊类
    newspapers: [
        { name: '参评奖项', sort: 1, value: '', placeholder: '', title: 'award' },
        { name: '责任编辑', sort: 1, value: '', placeholder: '', title: 'author' },
        { name: '刊播版面/频道/栏目', sort: 1, value: '', placeholder: '', title: 'column' },
        { name: '作品字数/时长', sort: 1, value: '', placeholder: '', title: 'duration' },
        { name: '刊播单位', sort: 1, value: '', placeholder: '', title: 'publishUnit' },
        { name: '首发日期', sort: 1, type: 'date', value: '', placeholder: '', title: 'publishDate' },
        { name: '作品评价', sort: 2, value: '', placeholder: '', title: 'comment' },
        { name: '采编过程', sort: 2, value: '', placeholder: '', title: 'proccess' },
        { name: '社会效果', sort: 2, value: '', placeholder: '', title: 'effect' },
        { name: '推荐单位盖章', sort: 0, value: '', placeholder: '' },
    ],
    // 媒体融合类
    media: [
        { name: '参评项目', sort: 1, value: '', placeholder: '参评国际传播奖项请注明' },
        { name: '主创人员', sort: 1, value: '', placeholder: '' },
        { name: '编辑', sort: 1, value: '', placeholder: '' },
        { name: '主管单位', sort: 1, value: '', placeholder: '' },
        { name: '发布日期', sort: 1, value: '', placeholder: '' },
        { name: '发布账号（APP）', sort: 1, value: '', placeholder: '' },
        { name: '作品时长', sort: 1, value: '', placeholder: '' },
        { name: '采编过程（作品简介）', sort: 2, value: '', placeholder: '请在此栏类填报作品采编过程（600字以内）' },
        {
            name: '社会效果',
            sort: 2,
            value: '',
            placeholder: '请在此栏类填报作品播出后的社会影响、转载。引用、点击率等情况一级应用新技术情况（500字以内）',
        },
        { name: '推荐理由', sort: 0, value: '', placeholder: '' },
        { name: '联系人', sort: 1, value: '', placeholder: '' },
        { name: '邮箱', sort: 1, value: '', placeholder: '' },
        { name: '手机', sort: 1, value: '', placeholder: '' },
        { name: '地址', sort: 1, value: '', placeholder: '' },
        { name: '邮编', sort: 1, value: '', placeholder: '' },

        // { name: '所获奖项名称', sort: 1, value: '', placeholder: '' },
        // { name: '推荐人姓名', sort: 1, value: '', placeholder: '' },
        // { name: '单位及职称', sort: 1, value: '', placeholder: '' },
        // { name: '手机号', sort: 1, value: '', placeholder: '' },
    ],
    // 媒体融合栏目类
    mediaBrand: [
        { name: '专栏名称', sort: 1, value: '', placeholder: '' },
        { name: '创办日期', sort: 1, value: '', placeholder: '' },
        { name: '参评项目', sort: 1, value: '', placeholder: '参评国际传播奖项请注明' },
        { name: '主管单位', sort: 1, value: '', placeholder: '' },
        { name: '发布单位', sort: 1, value: '', placeholder: '' },
        { name: '2020年度发布总次数', sort: 1, value: '', placeholder: '' },
        { name: '发布平台', sort: 1, value: '', placeholder: '' },
        { name: '主创人员', sort: 1, value: '', placeholder: '' },
        { name: '编辑', sort: 2, value: '', placeholder: '' },
        { name: '专栏简介', sort: 2, value: '', placeholder: '包括专栏定位、作品评介、形式体裁，风格特点、受众反应、社会效果等（500字以内）' },
        { name: '推荐理由', sort: 0, value: '', placeholder: '' },
        { name: '联系人', sort: 1, value: '', placeholder: '' },
        { name: '邮箱', sort: 1, value: '', placeholder: '' },
        { name: '手机', sort: 1, value: '', placeholder: '' },
        { name: '地址', sort: 1, value: '', placeholder: '' },
        { name: '邮编', sort: 1, value: '', placeholder: '' },
    ],
    // 媒体栏目代表作表 （新媒体类若选择品牌栏目则还需填写该表）
    clounmWork: [
        { name: '栏目名称', sort: 1, value: '', placeholder: '' },
        { name: '代表作名称', sort: 1, value: '', placeholder: '' },
        { name: '发布日期', sort: 1, value: '', placeholder: '' },
        { name: '作品时长', sort: 1, value: '', placeholder: '音视频类作品填报' },
        { name: '作品评介', sort: 2, value: '', placeholder: '' },
        { name: '采编过程', sort: 2, value: '', placeholder: '' },
        { name: '社会效果', sort: 2, value: '', placeholder: '' },
    ],

    // 短视频
    shortVideo: [
        { name: '联系人', sort: 1, value: '', placeholder: '' },
        { name: '编导', sort: 1, value: '', placeholder: '' },
        { name: ' 摄像', sort: 1, value: '', placeholder: '' },
        { name: '剪辑', sort: 1, value: '', placeholder: '' },
        { name: '其它演职人员', sort: 1, value: '', placeholder: '' },
        { name: '作品时长', sort: 1, value: '', placeholder: '' },
        { name: '联系方式（电话及微信）', sort: 1, value: '', placeholder: '' },
        { name: '内容简介', sort: 2, value: '', placeholder: '' },
        { name: '创意说明', sort: 2, value: '', placeholder: '' },
        { name: '选送单位', sort: 0, value: '', placeholder: '' },
    ],

    // 气象科普推荐表
    book: [
        { name: '名称', sort: 1, value: '', placeholder: '' },
        { name: '类别', sort: 1, value: '', placeholder: '' },
        { name: '推广成功', sort: 1, value: '', placeholder: '' },
        { name: '主要作者（单位）', sort: 1, value: '', placeholder: '' },
        { name: '联系地址', sort: 1, value: '', placeholder: '' },
        { name: '联系电话', sort: 1, value: '', placeholder: '' },
        { name: '电子邮箱', sort: 1, value: '', placeholder: '' },
        { name: '出版时间', sort: 1, value: '', placeholder: '' },
        { name: '主要创作内容及新点', sort: 2, value: '', placeholder: '限200字以内' },
        { name: '获省部级奖励情况', sort: 2, value: '', placeholder: '附获奖复印件' },
        { name: '推荐单位（省、区、市气象局或院校等相关单位意见）', sort: 0, value: '', placeholder: '' },
        { name: '评议专家意见', sort: 2, value: '', placeholder: '' },
        { name: '评议结果', sort: 2, value: '', placeholder: '' },
    ],

    // 科普创客推荐表
    maker: [
        { name: '姓名', sort: 1, value: '', placeholder: '' },
        { name: '性别', sort: 1, value: '', placeholder: '', type: 'sex' },
        { name: '出生年月', sort: 1, value: '', placeholder: '' },
        { name: '所在单位或院校', sort: 1, value: '', placeholder: '' },
        { name: '参加工作时间', sort: 1, value: '', placeholder: '' },
        { name: '联系地址', sort: 1, value: '', placeholder: '' },
        { name: '联系电话', sort: 1, value: '', placeholder: '' },
        { name: '电子邮箱', sort: 1, value: '', placeholder: '' },
        { name: '主要事迹（限200字以内，可另附个人事迹详细材料）', sort: 2, value: '', placeholder: '' },
        { name: '获省部级奖励情况（附获奖复印件）', sort: 2, value: '', placeholder: '' },
        { name: '推荐单位（省、区、市气象局或院校等相关单位意见）', sort: 2, value: '', placeholder: '' },
        { name: '评议专家意见', sort: 2, value: '', placeholder: '' },
        { name: '评议结果', sort: 2, value: '', placeholder: '' },
    ],
}
