$(function(){
	chrome.contextMenus.removeAll();
    chrome.contextMenus.create({"title": "下载这张封面","contexts":["image"],"onclick":getCoverBycontextMenu});
  	var category = getQueryString('category');
  	var start_page = getQueryString('start_page');
  	var end_page = getQueryString('end_page');
  	var auto_download = getQueryString('auto_download');
    dealCovers(auto_download,category,start_page,end_page);
});

//下载封面
function downloadCover(uri){
	var name = uri.replace(/http:\/\/[\w\W]*.music.126.net\//,"").replace("/","");
        chrome.downloads.download({
            url: uri,
            conflictAction: 'overwrite',
            filename: name,
            saveAs: false
                });
            }

//右击封面时操作：下载
function getCoverBycontextMenu(info, tab){
  var src = info.srcUrl.replace("?param=140y140","");
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

//获取封面并添加到页面
function dealCovers(auto_download,category,start_page,end_page){
  if(auto_download=="true"){
    for(var i = start_page ;i<end_page;i++){
      $.get("http://music.163.com/discover/playlist/?order=hot&cat="+category+"&limit=35&offset="+(i-1)*35, function(result){
        var imgs = $(result).find("img.j-flag");
        imgs.each(function(){
              downloadCover($(this).attr("src").replace("?param=140y140",""));
               $('div').append("<img src='"+$(this).attr("src")+"'>");
                });
    });
    }
    	var total = (end_page-start_page+1)*35;
    	chrome.notifications.create("hot_covers", {
		type: 'basic',
		iconUrl: 'img/icon.png',
		title: '网易云封面',
		message: total+'张封面开始下载'
	});
	setTimeout(function(){
			chrome.notifications.clear("hot_covers", function(){})
	},2000);
  }else{
    for(var i = start_page ;i<end_page;i++){
      $.get("http://music.163.com/discover/playlist/?order=hot&cat="+category+"&limit=35&offset="+(i-1)*35, function(result){
        var imgs = $(result).find("img.j-flag")
        imgs.each(function(){
               $('div').append("<img src='"+$(this).attr("src")+"'>");
                });
    });
    }
  }
}

//获取popup参数
function getQueryString(name){
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  decodeURI(r[2]); return null;
}
