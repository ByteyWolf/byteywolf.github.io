function fixPNGImages() {
    var imgs = document.getElementsByTagName('img');
    for (var i = 0; i < imgs.length; i++) {
        var img = imgs[i];
        var imgSrc = img.src.toLowerCase();
        if (imgSrc.substring(imgSrc.length - 4) === ".png") {
            var span = document.createElement('span');
            span.style.display = "inline-block";
            span.style.width = img.width + "px";
            span.style.height = img.height + "px";
            span.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + img.src + "', sizingMethod='scale')";

            img.parentNode.replaceChild(span, img);
        }
    }
}
window.attachEvent('onload', fixPNGImages);
fixPNGImages();
