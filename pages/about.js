exports.createAboutPage=function(page_margin)
{
	var pageContent='<p>Redcityofficial.com is rapidly growing with traffic from the UK, US & India.</p>';
  pageContent+='<p>We share content to Manchester United fans on a daily basis through our social media and partners. </p>';
	var pageTitle='About RedCityOfficial';
	var page = new tabris.Page({title: pageTitle});
  var scrollView = new tabris.ScrollView({
    layoutData: {left: 0, right: 0, top: 0, bottom: 0},
    direction: "vertical"
  }).appendTo(page);

  var imageView = new tabris.ImageView({
    left: 0, top: 0, right: 0,
    image: "images/logo.png",
    scaleMode: "auto"
  }).appendTo(scrollView);

  new tabris.TextView({
    layoutData: {left: page_margin, right: page_margin,top:[imageView,5], bottom: page_margin},
    text: pageContent,
    markupEnabled: true
  }).appendTo(scrollView);
  return page;
}

