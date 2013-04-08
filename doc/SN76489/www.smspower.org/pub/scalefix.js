function makeScalefixInContext(context, sourceImg, spriteCanvas, spriteImg)
{
   return function() {
            var error = "";
            // Get the source pixel data.
            context.drawImage(sourceImg, 0, 0);
            var spritePixels = context.getImageData(0, 0, sourceImg.width, sourceImg.height);
            context.clearRect(0, 0, sourceImg.width, sourceImg.height);

            // Paint the destination image pixel by pixel:
            var xScale = spriteCanvas.width / spritePixels.width;
            var yScale = spriteCanvas.height / spritePixels.height;

            if (xScale == 1 && yScale == 1) return;

            for (var p = 0, y = 0; y < sourceImg.height; ++y) {
               for (var x = 0; x < sourceImg.width; ++x, p += 4) {
                  if (spritePixels.data[p + 3] >= 0.5) {
                     context.fillStyle = 'rgb(' + spritePixels.data[p + 0] + ',' + spritePixels.data[p + 1] + ',' + spritePixels.data[p + 2] + ')';
                     context.fillRect(x * xScale, y * yScale, xScale, yScale);
                  }
               }
            }

            if (xScale != yScale) error += "Warning: X and Y scales are different<br>";
            if (Math.round(xScale) != xScale) error += "Warning: X scale is non-integer<br>";
            if (Math.round(yScale) != yScale) error += "Warning: Y scale is non-integer<br>";

            // Replace the old image with the new canvas.
            spriteImg.parentNode.replaceChild(spriteCanvas, spriteImg);

            if (error.length > 0)
            {
               var msg = document.createElement('div');
               msg.style.color = "white";
               msg.style.background = "red";
               msg.style.fontSize = "70%";
               msg.style.border = "1px solid #800000";
               msg.style.width = spriteCanvas.width;
               msg.style.padding = "0.1em";
               msg.style.margin = "0.1em";
               msg.innerHTML = error;
               spriteCanvas.parentNode.insertBefore(msg, spriteCanvas.nextSibling);
            }
         };
}


if (window.addEventListener && document.getElementsByClassName) {
   window.addEventListener('DOMContentLoaded', function() {
     // get imgs
     var els = document.getElementsByClassName('scalefix');
     for (var i = 0; i < els.length; ++i)
     {
      // Grab the old image.
//      var spriteImg = document.getElementById('randomSprite');
      var spriteImg = els[i];
      if (!spriteImg) return;

      // Create a canvas to replace it.
      var spriteCanvas = document.createElement('canvas');
      if (!spriteCanvas) return;

      spriteCanvas.width = spriteImg.width;
      spriteCanvas.height = spriteImg.height;

      // Get 2D drawing context.
      var context = spriteCanvas.getContext("2d");
      if (context) {
         var sourceImg = new Image();
         sourceImg.onload = makeScalefixInContext(context, sourceImg, spriteCanvas, spriteImg);
         sourceImg.src = spriteImg.src;
      }
     }
   }, false);
}

