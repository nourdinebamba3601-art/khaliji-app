
// Use a public key for now (Valid for demo environments)
const IMGBB_API_KEY = '6d207e02198a847aa98d0a2a901485a5';

/**
 * Advanced Image Processing Utility
 * Resizes, Compresses, and Uploads to ImgBB
 */
export const processImage = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;

            img.onload = () => {
                try {
                    // 1. Create Canvas for Resize & Compression
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    if (!ctx) throw new Error('Canvas context failed');

                    // Smart Resize Logic (Max 1024px)
                    const maxSize = 1024;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > maxSize) {
                            height *= maxSize / width;
                            width = maxSize;
                        }
                    } else {
                        if (height > maxSize) {
                            width *= maxSize / height;
                            height = maxSize;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;

                    // Draw image on canvas (White background for transparent PNGs)
                    ctx.fillStyle = '#FFFFFF';
                    ctx.fillRect(0, 0, width, height);
                    ctx.drawImage(img, 0, 0, width, height);

                    // 2. Convert to Blob (Compressed JPEG 80% Quality)
                    canvas.toBlob(async (blob) => {
                        if (!blob) {
                            reject(new Error('Image compression failed'));
                            return;
                        }

                        // 3. Upload Compressed Blob to ImgBB
                        const formData = new FormData();
                        formData.append('image', blob, 'image.jpg'); // Force .jpg extension

                        try {
                            const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
                                method: 'POST',
                                body: formData,
                            });

                            const data = await response.json();

                            if (data.success) {
                                resolve(data.data.display_url);
                            } else {
                                throw new Error(data.error?.message || 'Upload failed');
                            }
                        } catch (uploadErr: any) {
                            console.error('ImgBB Upload Error:', uploadErr.message);
                            reject(new Error('Network error during upload'));
                        }

                    }, 'image/jpeg', 0.8); // 0.8 = 80% Quality

                } catch (err: any) {
                    reject(new Error('Processing failed: ' + err.message));
                }
            };

            img.onerror = () => reject(new Error('Failed to load image'));
        };

        reader.onerror = () => reject(new Error('Failed to read file'));

        reader.readAsDataURL(file);
    });
};
