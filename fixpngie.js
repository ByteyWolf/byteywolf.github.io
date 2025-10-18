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

            // Preserve positioning and z-index
            if (img.style.position) {
                span.style.position = img.style.position;
            }
            if (img.style.zIndex) {
                span.style.zIndex = img.style.zIndex;
            }

            // Preserve other common positioning properties
            if (img.style.top) span.style.top = img.style.top;
            if (img.style.left) span.style.left = img.style.left;
            if (img.style.right) span.style.right = img.style.right;
            if (img.style.bottom) span.style.bottom = img.style.bottom;

            // Preserve margins and padding
            if (img.style.margin) span.style.margin = img.style.margin;
            if (img.style.padding) span.style.padding = img.style.padding;

            // Preserve the class name if it exists
            if (img.className) {
                span.className = img.className;
            }

            img.parentNode.replaceChild(span, img);
        }
    }
}
window.attachEvent('onload', fixPNGImages);
fixPNGImages();
