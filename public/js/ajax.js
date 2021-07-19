//Ajax传输
function Ajax(option) {

	//默认值
	let method = "post";
	let url = "http://11.1.1.179:8082/rsp-group-innovation";
	let data;
	let asyn = true;
	let datatype = 'text';
	let success = function() {};


	//参数替换
	if (option) {
		if (option.method != undefined) method = option.method;
		if (option.url != undefined) url = option.url;
		if (option.asyn != undefined) asyn = option.asyn;
		if (option.data != undefined) data = option.data;
		if (option.success != undefined) success = option.success;
		if (option.datatype != undefined) datatype = option.datatype;
		// if (option.showlist != undefined) showlist = option.showlist;
		// if (option.click != undefined) click = option.click;
	}

	
	var xml = new XMLHttpRequest();
	

	function dataToUrlArg(data) {
		var tmp = "?";
		for (let key in data) {
			tmp += `${key}=${data[key]}&`;
		}
		return tmp;
	}

	//如果GET
	if (method == "get") {
		url = url + dataToUrlArg(data);
	}
	console.log(url, 'inajax')
	xml.open(method, url, asyn);
	xml.setRequestHeader("Content-type","application/json");
	//如果POST
	method == "post" ? xml.send(JSON.stringify(data)) : "";
	

	
	// console.log(data);
	xml.onreadystatechange = function(e) {
		
		if (xml.readyState == 4 && xml.status == 200) {
			
			let data = this.responseText;
			if (datatype == "JSON") {
				try {
					data = JSON.parse(data);
				} catch (error) {
					data = {
						"status": "error",
						"msg": "服务器转码错误",
						"code": -1,
						"data": []
					}
				}
			}
			// console.log(data);
			success(data);
		};
	};

};