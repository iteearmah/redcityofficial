
exports.Menu=function (target,imagepath,drawer,drawablePages,page_margin){
   var menuItems = [
  ['Squad', 'User_Group-96.png','squad'],
  ['About','Info-96.png','about'],
  ['Feedback','Feedback-96.png','feedback']
].map(function(element) {
  return {name: element[0], image: imagepath + element[1], identify: element[2]};
});


   var drawableImageView = tabris.create("ImageView", {
    image: "images/header.jpg",
    scaleMode: "fill",
    layoutData: {left: 0, right: 0, top: 0, height: 200}
  }).appendTo(target);

 new tabris.CollectionView({
  layoutData: {left: 0, top: [drawableImageView,10], right: 0, bottom: 0},
  items: menuItems,
  itemHeight: 50,
  initializeCell: function(cell) {
    var imageView = tabris.create("ImageView", {
      layoutData: {width: 25,left:5,bottom:10,top:5,left:15},
      scaleMode:"fit",
    }).appendTo(cell);
    var textView = tabris.create("TextView", {
      layoutData: {top: 0, left: [imageView, 30], right: 5,top:13},
      markupEnabled: true,
      /*font: "16px Arial, sans-serif",*/
      textColor: "#000",
    }).appendTo(cell);

    cell.on('change:item', function(widget, item) {
      textView.set('text', item.name);
      imageView.set('image',item.image);
    });

  }
}).on('select', function(target, value) {
  if(value.identify=='about')
  {
    drawablePages.about.createAboutPage(page_margin).open();
    drawer.close();
  }
  else
  {

  }
}).appendTo(target);

}