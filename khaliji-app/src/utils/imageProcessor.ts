
// 🚨 URGENT: If this key fails, go to https://api.imgbb.com/ to get your own FREE key.
// User's Personal Key - PERMANENT FIX
const IMGBB_API_KEY = '90354bf99225661cfd4804452655f834';

/**
 * Advanced Image Processing Utility - ImgBB Edition
 * Resizes 1024px -> Compresses JPEG 80% -> Uploads to Cloud
 */
export const processImage = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;

            img.onload = () => {
                try {
                    // 1. Create Canvas (Resize to 1024px for good quality/speed balance)
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    if (!ctx) throw new Error('Canvas Context Error');

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

                    ctx.fillStyle = '#FFFFFF';
                    ctx.fillRect(0, 0, width, height);
                    ctx.drawImage(img, 0, 0, width, height);

                    // 2. Convert to Blob (JPEG 80%)
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
                                console.error("ImgBB API Error:", data);
                                reject(new Error(`ImgBB Error: ${data.error?.message}`));
                            }
                        } catch (uploadErr: any) {
                            console.error('Network Error:', uploadErr);
                            reject(new Error('Network Error: Check internet'));
                        }

                    }, 'image/jpeg', 0.8);

                } catch (err: any) {
                    reject(new Error('Processing Failed: ' + err.message));
                }
            };
            img.onerror = () => reject(new Error('Invalid Image File'));
        };
        reader.readAsDataURL(file);
    });
};
