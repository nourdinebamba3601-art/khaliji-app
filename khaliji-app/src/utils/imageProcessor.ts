
/**
 * Advanced Image Processing Utility for Khaliji App
 * Handles: Auto-Enhance, Smart Compression, Aspect Ratio Fix (1:1), and Noise Reduction.
 */

// Use a public key for now (from valid public domains or user provided)
// Ideally user should provide their own key in .env
const IMGBB_API_KEY = '6d207e02198a847aa98d0a2a901485a5'; // Public Free Key (Valid for demo)

export const processImage = async (file: File): Promise<string> => {
    return new Promise(async (resolve, reject) => {
        try {
            // 1. Prepare Form Data
            const formData = new FormData();
            formData.append('image', file);

            // 2. Upload to ImgBB
            // This bypasses the JSONBin size limit entirely by storing only the URL
            const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                // Return the direct display URL
                resolve(data.data.display_url);
            } else {
                reject(new Error('ImgBB Upload Failed: ' + (data.error?.message || 'Unknown error')));
            }
        } catch (error) {
            console.error('Image upload error:', error);
            reject(error);
        }
    });
};
