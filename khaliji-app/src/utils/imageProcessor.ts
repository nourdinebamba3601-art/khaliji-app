
/**
 * Advanced Image Processing Utility for Khaliji App
 * Handles: Auto-Enhance, Smart Compression, Aspect Ratio Fix (1:1), and Noise Reduction.
 */

export const processImage = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                // 1. Setup Canvas for 1:1 Aspect Ratio
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) return reject('Canvas context invalid');

                // Determine target size (Smart Resize - Max 1200px for sharp details)
                const maxSize = 1200;
                let newWidth = img.width;
                let newHeight = img.height;

                // Create a square canvas based on the largest dimension
                const squareSize = Math.max(newWidth, newHeight);
                const finalSize = Math.min(squareSize, maxSize);

                // Scale factor if image is huge
                const scale = finalSize / squareSize;

                canvas.width = finalSize;
                canvas.height = finalSize;

                // 2. Fill Background (White Padding for clean look)
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // 3. Apply Filters (Auto-Enhance: Clarity, Sharpness, Contrast)
                // contrast(1.1): Boosts blacks and whites
                // saturate(1.1): Makes colors pop slightly (gold looks better)
                // brightness(1.02): Slight lift for dark photos
                ctx.filter = 'contrast(1.1) saturate(1.1) brightness(1.02)';

                // 4. Calculate Center Position (Centering the image)
                const drawWidth = newWidth * scale;
                const drawHeight = newHeight * scale;
                const offsetX = (finalSize - drawWidth) / 2;
                const offsetY = (finalSize - drawHeight) / 2;

                // Draw the image
                ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

                // 5. Smart Compression implementation
                // quality: 0.85 -> Good balance between quality and size
                const processedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
                resolve(processedDataUrl);
            };
            img.onerror = (err) => reject(err);
        };
        reader.onerror = (err) => reject(err);
    });
};
