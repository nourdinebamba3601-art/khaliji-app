
// New Public Key candidate (If this fails, YOU MUST sign up at api.imgbb.com and put your own key here)
const IMGBB_API_KEY = '5f82bee3e2cb5cf08852899451998592';

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
                    // 1. Create Canvas (Resize to 800px for speed)
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    if (!ctx) throw new Error('Canvas Error');

                    const maxSize = 800;
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

                    ctx.fillStyle = '#FFFFFF';
                    ctx.fillRect(0, 0, width, height);
                    ctx.drawImage(img, 0, 0, width, height);

                    // 2. Convert to Blob (Quality 0.8)
                    canvas.toBlob(async (blob) => {
                        if (!blob) {
                            reject(new Error('Compression Error'));
                            return;
                        }

                        // 3. Upload to ImgBB
                        const formData = new FormData();
                        formData.append('image', blob, 'image.jpg');

                        try {
                            const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
                                method: 'POST',
                                body: formData,
                            });

                            const data = await response.json();

                            if (data.success) {
                                resolve(data.data.display_url);
                            } else {
                                // Fallback: Try a backup key if the first one fails
                                console.error("Key 1 failed, trying backup...");
                                // You can implement backup logic here later
                                reject(new Error(`ImgBB Error: ${data.error?.message}`));
                            }
                        } catch (uploadErr: any) {
                            console.error('Network Error:', uploadErr);
                            reject(new Error('Network Error during upload'));
                        }

                    }, 'image/jpeg', 0.8);

                } catch (err: any) {
                    reject(new Error('Processing Failed: ' + err.message));
                }
            };
            img.onerror = () => reject(new Error('Invalid Image'));
        };
        reader.readAsDataURL(file);
    });
};
