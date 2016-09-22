
exports.getNewsList=function (json_url,image_size,margin,targt_page,collectionView_News,storage_key='news_list',detail_page=''){
  var scrollPosition = 0;
  localStorage.setItem('current_page_'+storage_key,1);


     collectionView_News.on("refresh", function() {
				  fetch_newslist(collectionView_News,json_url,storage_key);
			}).appendTo(targt_page);
		
  
    
   collectionView_News.on("scroll", function(view, scroll) {
          if (scroll.deltaY > 0) {
            
            var totalItems=parseInt(view.get("items").length);
            var remaining = totalItems - parseInt(view.get("lastVisibleIndex"));
            
            if (remaining ==1) 
            {
              console.log(' items count'+view.get("items").length+' | lastVisibleIndex: '+view.get("lastVisibleIndex"));
              loadNewItems(collectionView_News,json_url,storage_key);
            }

          }
  });


}

function fetch_newslist(view,json_url,key)
{
   var $ = require("./lib/jquery.js");
  var items = [];
  $.ajaxSetup({ cache:false });
  $.ajax({
    url: json_url,
    dataType: 'json',
    //timeout: 5000,
    success:  function (data) {
          localStorage.setItem(key,JSON.stringify(data));
          load_news(view,data,key);

          /*load_topNews(data,key,topStoryImage,topStoryTitle);*/
          },error: function(data, errorThrown)
          {
             console.log('news not fetched'+errorThrown);
          }
  });
}



exports.loadNewItems=function(view,json_url,key)
{
   var $ = require("./lib/jquery.js");
  var items = [];
  itemsView = view.get("items");
  //page=parseInt(itemsView[itemsView.length-1].page);
  current_page=localStorage.getItem('current_page_'+key);
  current_page++;
  console.log('current_page: '+current_page);
  localStorage.setItem('current_page_'+key,current_page);
   json_url=json_url+'&page='+current_page;
   console.log('news '+json_url);
  $.ajaxSetup({ cache:false });
  $.ajax({
    url: json_url,
    dataType: 'json',
    //timeout: 5000,
    success:  function (data) {
          localStorage.setItem(key,JSON.stringify(data));
          view.insert(data.items);
          //load_news(view,data.items,key);
          /*load_topNews(data,key,topStoryImage,topStoryTitle);*/
          },error: function(data, errorThrown)
          {
             console.log('news not fetched'+errorThrown);
          }
  });

}

exports.fetch_newslist= function(view,json_url,key)
{
   var $ = require("./lib/jquery.js");
  var items = [];
  $.ajaxSetup({ cache:false });
  $.ajax({
    url: json_url,
    dataType: 'json',
    //timeout: 5000,
    success:  function (data) {
          localStorage.setItem(key,JSON.stringify(data));
          load_news(view,data,key);

          /*load_topNews(data,key,topStoryImage,topStoryTitle);*/
          },error: function(data, errorThrown)
          {
             console.log('news not fetched'+errorThrown);
          }
  });
}

exports.fetch_other_newslist= function(view,json_url,key)
{
   var $ = require("./lib/jquery.js");
  var items = [];
  $.ajaxSetup({ cache:false });
  $.ajax({
    url: json_url,
    dataType: 'json',
    //timeout: 5000,
    success:  function (data) {
          localStorage.setItem(key,JSON.stringify(data));
          view.insert(data.items);

          /*load_topNews(data,key,topStoryImage,topStoryTitle);*/
          },error: function(data, errorThrown)
          {
             console.log('news not fetched'+errorThrown);
          }
  });
}



function load_news(view,newsData,key)
{
  newsitems=JSON.parse(localStorage.getItem(key));
  if(newsitems)
  {
    view.set({
      items: newsitems,
      refreshIndicator: true,
      refreshMessage: ""
    });
  }
  
  newsitems=newsData.items;
  setTimeout(function() {
    view.set({
      items: newsitems,
      refreshIndicator: false,
      refreshMessage: "loading..."
    });
  }, 3000);
}


function load_topNews(newsData,key,topStoryImage,topStoryTitle)
{
  newsitems=JSON.parse(localStorage.getItem(key));
  newsitems=newsData.items;
  topStoryImage.set("image", {src: newsitems[0].image});
  topStoryTitle.set("title", "<b>"+newsitems[0].title+"</b>");
  //console.log(newsitems[0].title);
}