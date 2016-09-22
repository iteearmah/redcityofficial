
exports.getVideosList=function (json_url,image_size,margin,targt_page,collectionView_Videos,storage_key='news_list',detail_page=''){
  var scrollPosition = 0;
  localStorage.setItem('current_page_'+storage_key,1);

   var collectionView_Videos = tabris.create("CollectionView", {
        layoutData: {left:0, right: 0, bottom: 50,top :[targt_page,2]},
        refreshEnabled: true,
        itemHeight: 120,
        id:storage_key,
        initializeCell: function(cell) {
          var imageView = tabris.create("ImageView", {
            layoutData: {width: image_size,left:5,bottom:10,top:5},
            scaleMode:"fill",
          }).appendTo(cell);
          var titleView = tabris.create("TextView", {
            layoutData: {top: 0, left: [imageView, margin], right: 5,top:5},
            markupEnabled: true,
            font: "15px Arial, sans-serif",
            textColor: "#D71A21",
          }).appendTo(cell);
          var periodView = tabris.create("TextView", {
            layoutData: {top: [titleView, 35],left: [imageView, margin], right: 5},
            markupEnabled: true,
            textColor: "#D71A21"
          }).appendTo(cell);
         
           cell.on("change:item", function(widget, newsItems) {

            imageView.set("image", {src: newsItems.image});
            titleView.set("text", '<b>'+newsItems.title+'</b>');
            periodView.set("text", '<small>'+newsItems.pubDate+'</small>');
          });
          
          }
        });
   
     collectionView_Videos.on("refresh", function() {
          fetch_newslist(collectionView_Videos,json_url,storage_key);
      }).appendTo(targt_page);
    
    fetch_newslist(collectionView_Videos,json_url,storage_key);
    
   collectionView_Videos.on("scroll", function(view, scroll) {
          if (scroll.deltaY > 0) {
            
            var totalItems=parseInt(view.get("items").length);
            var remaining = totalItems - parseInt(view.get("lastVisibleIndex"));
            
            if (remaining ==1) 
            {
              console.log(' items count'+view.get("items").length+' | lastVisibleIndex: '+view.get("lastVisibleIndex"));
              loadNewItems(collectionView_Videos,json_url,storage_key);
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

function loadNewItems(view,json_url,key)
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
   console.log('Video '+json_url);
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

function load_news(view,newsData,key)
{
  newsitems=JSON.parse(localStorage.getItem(key));
    view.set({
      items: newsitems,
      refreshIndicator: true,
      refreshMessage: ""
    });
  
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