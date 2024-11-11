export const compressBase64Image = async (base64: any, maxSizeInKB = 100, initialMaxWidth = 800, initialMaxHeight = 800) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = base64;
    
    img.onload = () => {
      let width = img.width;
      let height = img.height;
      let quality = 1.0; // Start with the highest quality
      let compressedBase64;

      // Resize the image while keeping the aspect ratio
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const resizeAndCompress = (width: number, height: number) => {
        canvas.width = width;
        canvas.height = height;

        // Clear canvas to avoid black background
        if(ctx){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        // Draw the resized image on the canvas
        if(ctx){
        ctx.drawImage(img, 0, 0, width, height);
        }
        // Keep reducing the quality and canvas size until it's below the desired size
        do {
          compressedBase64 = canvas.toDataURL('image/png', quality);
          const sizeInKB = (compressedBase64.length * (3 / 4)) / 720;

          if (sizeInKB <= maxSizeInKB) {
            resolve(compressedBase64);
            return;
          }

          // Reduce quality
          quality -= 0.1;
          
          // If quality is too low, reduce canvas size further
          if (quality < 0.2) {
            width *= 0.8;
            height *= 0.8;
            canvas.width = width;
            canvas.height = height;
            if (ctx) {
              ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
            if (ctx) {
              ctx.drawImage(img, 0, 0, width, height);
            }
            quality = 0.8; // Reset quality after resizing
          }

        } while (quality > 0.1 && (width > 100 || height > 100));

        reject(new Error('Unable to compress image below the desired size'));
      };

      // Call the function initially with max width and height
      resizeAndCompress(initialMaxWidth, initialMaxHeight);
    };

    img.onerror = (err) => reject(err);
  });
};
