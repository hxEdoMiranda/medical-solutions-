// Random image para login


var classes = ['img1', 'img2', 'img3', 'img4', 'img5', 'img6'];
$('#imgLogin').removeClass();
$('#imgLogin').addClass(function () { return classes[Math.floor(Math.random() * classes.length)]; });