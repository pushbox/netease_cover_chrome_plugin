
$(function(){
	chrome.contextMenus.removeAll();
    chrome.contextMenus.create({"title": "下载这张封面","contexts":["image"],"onclick":getCoverBycontextMenu});
    var storage=window.localStorage;
	var covers=storage.getItem("covers");
    var array = covers.split(",");
    console.log(array.length);
    for (var i = 0; i < array.length; i++) {
    	 $('div').append("<img src='"+array[i]+"'>");
    }
});

function getCoverBycontextMenu(info, tab){
  var src = info.srcUrl.replace("?param=180y180","");
  downloadCover(src);
	chrome.notifications.create(src, {
		type: 'basic',
		iconUrl: 'img/icon.png',
		title: '网易云封面',
		message: '1张封面开始下载'
	});
	setTimeout(function(){
			chrome.notifications.clear(src, function(){})
	},2000);
}

function downloadCover(uri){
	var name = uri.replace(/http:\/\/[\w\W]*.music.126.net\//,"").replace("/","");
        chrome.downloads.download({
            url: uri,
            conflictAction: 'overwrite',
            filename: name,
            saveAs: false
                });
            }