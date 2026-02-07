
// Alternate Public Key (Try this one)
const IMGBB_API_KEY = 'cecf61601201990497556f8f10640df1';

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
                    if (!ctx) throw new Error('System Error: Canvas context failed');

                    // Smart Resize Logic (Max 800px is enough for mobile/web and faster)
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

                    // 2. Convert to Blob (Compressed High Quality JPEG)
                    canvas.toBlob(async (blob) => {
                        if (!blob) {
                            reject(new Error('Compression Error: Could not create image blob'));
                            return;
                        }

                        // 3. Upload Compressed Blob to ImgBB
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
                                // Detailed Error for Debugging
                                console.error('ImgBB Error:', data);
                                reject(new Error(`ImgBB Error: ${data.error?.message} (Code: ${data.status_code})`));
                            }
                        } catch (uploadErr: any) {
                            console.error('Network Error:', uploadErr);
                            reject(new Error('Network Error: Check internet connection'));
                        }

                    }, 'image/jpeg', 0.85);

                } catch (err: any) {
                    reject(new Error('Processing Failed: ' + err.message));
                }
            };

            img.onerror = () => reject(new Error('File Error: Invalid image data'));
        };

        reader.onerror = () => reject(new Error('Browser Error: Failed to read file'));

        reader.readAsDataURL(file);
    });
};
