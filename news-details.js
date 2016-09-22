exports.news_readPage=function(newsItem)
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

	fetch_newsDetails(newsItem.id,newsArticle,activityIndicator);

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

function fetch_newsDetails(id,newsArticle,activityIndicator)
{
	activityIndicator.set("visible", true);
	var article='';
	var $ = require("./lib/jquery.js");
  $.ajaxSetup({ cache:false });
  $.ajax({
    url: 'http://redcityofficial.com/api/fetch.article.php?postid='+id,
    dataType: 'json',
    //timeout: 5000,
    success:  function (data) {
         newsArticle.set("text",data.article);
         activityIndicator.set("visible", false);
    },error: function(data, errorThrown)
    {
       console.log('news '+id+'not fetched'+errorThrown);
    }
  });
}

