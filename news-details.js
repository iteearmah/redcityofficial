exports.news_readPage=function(newsItem,shareAction)
{
	var MARGIN_SMALL = 14;
	var MARGIN = 16;
	var INITIAL_TITLE_COMPOSITE_OPACITY=0.85;
		var newsDetailpage = new tabris.Page({
	  topLevel: false,
	  title: 'News'
	}).once("resize", function() { // TODO: used "resize" event as workaround for tabris-js#597
	  //tabris.ui.set("toolbarVisible", false);

	});

	newsDetailpage.on("appear", function() { actionShareVisbility(true); })
  	newsDetailpage.on("disappear", function() { actionShareVisbility(false); });

	var scrollView = new tabris.ScrollView({
	  left: 0, right: 0, top: 0, bottom: 50
	}).appendTo(newsDetailpage);
	
	var imageView = new tabris.ImageView({
	  left: 0, top: 0, right: 0,
	  image: newsItem.image_large,
	  scaleMode: "fill"
	}).appendTo(scrollView);
	
	var titleComposite = new tabris.Composite({
  left: 0, right: 0,top:[imageView,2],
  id: "titleComposite",
	}).appendTo(scrollView);

	var newsTitle=new tabris.TextView({
	  left: MARGIN, top: MARGIN, right: MARGIN,
	  markupEnabled: true,
	  background: "#fff",
	  text: "<b>"+newsItem.title+"</b>",
	  font: "24px",
	  textColor: "#1e1e1e"
	}).appendTo(titleComposite);

	var newsArticle=new tabris.TextView({
	  left: MARGIN, top: [newsTitle,2], right: MARGIN,
	  markupEnabled: true,
	  text: newsItem.pubDate,
	  font: "13px",
	  textColor: "#D71A21"
	}).appendTo(titleComposite);

	var contentComposite = new tabris.Composite({
	  left: 0, right: 0, top: "#titleComposite",
	  background: "white"
	}).appendTo(scrollView);

	var newsArticle=new tabris.TextView({
  left: MARGIN, right: MARGIN, top: MARGIN,
  markupEnabled: true,
  font: "16px",
}).appendTo(contentComposite);

var activityIndicator = new tabris.ActivityIndicator({
  centerX: 0,
  centerY: 0
}).appendTo(newsDetailpage);

	fetch_newsDetails(newsItem,newsArticle,activityIndicator,contentComposite);
	shareAction.on("select", function() {
    window.plugins.socialsharing.share(newsItem.title,'RedCityOfficial - '+newsItem.title,null,newsItem.link);
  });
	

scrollView.on("resize", function(widget, bounds) {
  var imageHeight = bounds.height / 2;
  imageView.set("height", imageHeight);
  var titleCompHeight = titleComposite.get("height");
  // We need the offset of the title composite in each scroll event.
  // As it can only change on resize, we assign it here.
  titleCompY = Math.min(imageHeight - titleCompHeight, bounds.height / 2);
  titleComposite.set("top", titleCompY);
});

scrollView.on("scroll", function(widget, offset) {
  imageView.set("transform", {translationY: Math.max(0, offset.y * 0.4)});
  //titleComposite.set("transform", {translationY: Math.max(0, offset.y - titleCompY)});
  var opacity = calculateTitleCompositeOpacity(offset.y, titleCompY);
  titleComposite.set("background", '#fff');
});
function calculateTitleCompositeOpacity(scrollViewOffsetY, titleCompY) {
  var titleCompDistanceToTop = titleCompY - scrollViewOffsetY;
  var opacity = 1 - (titleCompDistanceToTop * (1 - INITIAL_TITLE_COMPOSITE_OPACITY)) / titleCompY;
  return opacity <= 1 ? opacity : 1;
}

	return newsDetailpage;
}



function rgba(r, g, b, a) {
  return "rgba(" + r + "," + g + "," + b + "," +  a + ")";
}

function displayVideo(newsItem,page) 
{
  var webview = new tabris.WebView({
  layoutData: {left: 0, top: 0, right: 0, bottom: 0, height:500},
  url: "http://redcityofficial.com/api/video-view.php?postid="+newsItem.id+"&"+new Date().getTime(),
  }).appendTo(page);
}

function testUrlForMedia(pastedData)
{
	var success = false;
	var media   = {};
	if (pastedData.match('http://(www.)?youtube|youtu\.be')) {
	    if (pastedData.match('embed')) { youtube_id = pastedData.split(/embed\//)[1].split('"')[0]; }
	    else { youtube_id = pastedData.split(/v\/|v=|youtu\.be\//)[1].split(/[?&]/)[0]; }
	    media.type  = "youtube";
	    media.id    = youtube_id;
	    success = true;
	}
	else if (pastedData.match('http://(player.)?vimeo\.com')) {
	    vimeo_id = pastedData.split(/video\/|http:\/\/vimeo\.com\//)[1].split(/[?&]/)[0];
	    media.type  = "vimeo";
	    media.id    = vimeo_id;
	    success = true;
	}
	else if (pastedData.match('http://player\.soundcloud\.com')) {
	    soundcloud_url = unescape(pastedData.split(/value="/)[1].split(/["]/)[0]);
	    soundcloud_id = soundcloud_url.split(/tracks\//)[1].split(/[&"]/)[0];
	    media.type  = "soundcloud";
	    media.id    = soundcloud_id;
	    success = true;
	}
	if (success) { return media; }
	else { console.log('No valid media id detected');}
	return false;
}


function fetch_newsDetails(newsItem,newsArticle,activityIndicator,contentComposite)
{
	activityIndicator.set("visible", true);
	var article='';
	var $ = require("./lib/jquery.js");
  $.ajaxSetup({ cache:false });
  $.ajax({
    url: 'http://redcityofficial.com/api/fetch.article.php?postid='+newsItem.id,
    dataType: 'json',
    //timeout: 5000,
    success:  function (data) {
         
         if(newsItem.category=='videos')
         {
         	media=testUrlForMedia(data.article);
         	//displayVideo(newsItem.id,contentComposite);
         	var videoId=media.id;
         	videoId=videoId.replace(/(\?.*)|(#.*)/g, "");
         	console.log(videoId);
         	new tabris.Button({
			  layoutData: {left: 0, top: 10, right:0},
			  text: 'Play Video'
			}).on('select', function() {
			  YoutubeVideoPlayer.openVideo(videoId);
			}).appendTo(contentComposite);
         	
         	if(videoId)
         	{
         		YoutubeVideoPlayer.openVideo(videoId);
         	}
         	else
         	{
         		newsArticle.set("text",'Video couldn\'t be played. <p><a href="'+newsItem.link+'">Watch in browser</a></p>');
         	}
         	
         }
         else
         {
         	newsArticle.set("text",data.article);
         }
         activityIndicator.set("visible", false);
    },error: function(data, errorThrown)
    {
       console.log('news '+newsItem.id+'not fetched'+errorThrown);
    }
  });
}



function actionShareVisbility(isVisible) {
  tabris.ui.children("#shareaction").set("visible",isVisible);
}