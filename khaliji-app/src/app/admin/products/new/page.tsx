'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Image as ImageIcon, Plus, X, Loader2, Star, GripVertical, Info } from 'lucide-react';
import { useProducts } from '@/context/ProductContext';
import { toast, Toaster } from 'sonner';

export default function AddProductPage() {
    const router = useRouter();
    const { addProduct } = useProducts();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [name, setName] = useState('');
    const [nameEn, setNameEn] = useState('');
    const [brand, setBrand] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [originalPrice, setOriginalPrice] = useState('');
    const [quantity, setQuantity] = useState('1');
    const [category, setCategory] = useState('perfumes');
    const [images, setImages] = useState<string[]>([]);
    const [source, setSource] = useState<'local' | 'dubai'>('local');
    const [shippingDuration, setShippingDuration] = useState('');
    const [isBestSeller, setIsBestSeller] = useState(false);
    const [salesCount, setSalesCount] = useState('50');

    // Glasses specific state
    const [gender, setGender] = useState<'men' | 'women' | 'unisex'>('unisex');
    const [lensType, setLensType] = useState<'sun' | 'medical'>('sun');
    const [frameMaterial, setFrameMaterial] = useState<'metal' | 'plastic'>('metal');
    const [frameShape, setFrameShape] = useState<'round' | 'square' | 'aviator' | 'cat-eye' | 'other'>('round');
    const [hasFullSet, setHasFullSet] = useState(true);

    // Watch specific state
    const [watchMovement, setWatchMovement] = useState<'automatic' | 'quartz'>('quartz');
    const [strapMaterial, setStrapMaterial] = useState<'metal' | 'leather' | 'rubber' | 'other'>('metal');
    const [caseMaterial, setCaseMaterial] = useState('Stainless Steel');

    // Perfume specific state
    const [perfumeLongevity, setPerfumeLongevity] = useState<'long' | 'medium' | 'high'>('high');
    const [perfumeVolume, setPerfumeVolume] = useState<'50ml' | '100ml' | 'others'>('100ml');
    const [perfumeScent, setPerfumeScent] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [isUploadingVideo, setIsUploadingVideo] = useState(false);

    // Processing State
    const [isProcessingImages, setIsProcessingImages] = useState(false);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files);

            // Limit check
            if (images.length + files.length > 5) {
                toast.error('يمكنك رفع 5 صور كحد أقصى');
                return;
            }

            setIsProcessingImages(true);
            const newImages: string[] = [];
            let processedCount = 0;

            try {
                // Dynamically import only when needed to save initial bundle size
                // But keep it robust for mobile
                const { processImage } = await import('@/utils/imageProcessor');

                for (const file of files) {
                    // Size Check (Pre-process)
                    if (file.size > 10 * 1024 * 1024) { // 10MB limit before processing
                        toast.error(`${file.name}: الصورة كبيرة جداً`);
                        continue;
                    }

                    try {
                        const processedUrl = await processImage(file);
                        newImages.push(processedUrl);
                        processedCount++;
                    } catch (err: any) {
                        console.error('Processing failed for image:', err);
                        toast.error(`فشل ${file.name}: ${err.message}`);
                    }
                }

                if (processedCount > 0) {
                    setImages(prev => [...prev, ...newImages]);
                    toast.success(`تم معالجة وضغط ${processedCount} صورة بنظام الذكاء الاصطناعي ✨`);
                }
            } catch (error) {
                console.error(error);
                toast.error('حدث خطأ في نظام المعالجة');
            } finally {
                setIsProcessingImages(false);
                // Reset input
                e.target.value = '';
            }
        }
    };

    const moveImage = (fromIndex: number, toIndex: number) => {
        const newImages = [...images];
        const [movedImage] = newImages.splice(fromIndex, 1);
        newImages.splice(toIndex, 0, movedImage);
        setImages(newImages);
    };

    const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > 10 * 1024 * 1024) { // 10MB limit for video
                toast.error('حجم الفيديو كبير جداً. يرجى اختيار فيديو أقل من 10 ميجابايت.');
                return;
            }
            setIsUploadingVideo(true);
            const reader = new FileReader();
            reader.onloadend = () => {
                setVideoUrl(reader.result as string);
                setIsUploadingVideo(false);
                toast.success('تم رفع الفيديو بنجاح');
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        // Validation
        if (!name) { toast.error('يرجى إدخال اسم المنتج'); return; }
        if (!price) { toast.error('يرجى إدخال السعر'); return; }
        if (images.length === 0) { toast.error('يرجى إضافة صورة واحدة على الأقل'); return; }
        if (source === 'dubai' && !shippingDuration) { toast.error('يرجى تحديد مدة الشحن لطلبات دبي'); return; }

        setIsSubmitting(true);

        try {
            const newProduct = {
                name,
                nameEn,
                brand,
                description,
                price: parseFloat(price),
                originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
                quantity: parseInt(quantity) || 0,
                category,
                source,
                shippingDuration,
                images,
                isBestSeller,
                salesCount: parseInt(salesCount) || 0,
                specs: {},
                // Glasses fields
                frameMaterial: category === 'glasses' ? frameMaterial : undefined,
                frameShape: category === 'glasses' ? frameShape : undefined,
                hasFullSet: (category === 'glasses' || category === 'watches') ? hasFullSet : undefined,
                // Watch fields
                watchMovement: category === 'watches' ? watchMovement : undefined,
                strapMaterial: category === 'watches' ? strapMaterial : undefined,
                caseMaterial: category === 'watches' ? caseMaterial : undefined,
                // Perfume fields
                perfumeLongevity: category === 'perfumes' ? perfumeLongevity : undefined,
                perfumeVolume: category === 'perfumes' ? perfumeVolume : undefined,
                perfumeScent: category === 'perfumes' ? perfumeScent : undefined,
                videoUrl: category === 'perfumes' ? videoUrl : undefined,
                gender: (category === 'glasses' || category === 'watches' || category === 'perfumes') ? gender : undefined,
            };

            // Using promise toast for better UX
            await toast.promise(addProduct(newProduct), {
                loading: 'جاري رفع المنتج إلى السيرفر...',
                success: 'تم نشر المنتج بنجاح! سيتم تحويلك...',
                error: (err) => `فشل النشر: ${err.message}`
            });

            // Redirect only after successful save
            setTimeout(() => {
                router.push('/admin/products');
            }, 1000);

        } catch (error) {
            console.error(error);
            // Error is handled by toast.promise
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <Toaster position="top-center" richColors />

            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-white">إضافة منتج جديد</h1>
                <div className="flex gap-4">
                    <button onClick={() => router.back()} className="px-4 py-2 text-gray-400 hover:text-white border border-dark-700 rounded-lg transition">إلغاء</button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="px-6 py-2 bg-gold-500 hover:bg-gold-600 text-dark-900 font-bold rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                        {isSubmitting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        {isSubmitting ? 'جاري الحفظ...' : 'نشر المنتج'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Main Info Form */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Basic Details */}
                    <div className="bg-dark-800 p-6 rounded-xl border border-dark-700">
                        <h3 className="text-lg font-bold text-white mb-4 border-b border-dark-700 pb-2">معلومات أساسية</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">اسم المنتج (عربي) <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-2 text-white focus:border-gold-400 outline-none"
                                    placeholder="مثال: عطر عود ملكي"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">اسم المنتج (إنجليزي - اختياري)</label>
                                <input
                                    type="text"
                                    value={nameEn}
                                    onChange={(e) => setNameEn(e.target.value)}
                                    className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-2 text-white focus:border-gold-400 outline-none text-left"
                                    placeholder="e.g. Royal Oud Perfume"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">الماركة / البراند</label>
                                <input
                                    type="text"
                                    value={brand}
                                    onChange={(e) => setBrand(e.target.value)}
                                    className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-2 text-white focus:border-gold-400 outline-none"
                                    placeholder="مثال: Rolex, Chanel..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">وصف المنتج</label>
                                <textarea
                                    rows={4}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-2 text-white focus:border-gold-400 outline-none"
                                    placeholder="اكتب وصفاً جذاباً للمنتج..."
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Pricing & Inventory */}
                    <div className="bg-dark-800 p-6 rounded-xl border border-dark-700">
                        <h3 className="text-lg font-bold text-white mb-4 border-b border-dark-700 pb-2">التسعير والمخزون</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">السعر الأصلي (للشطب)</label>
                                <input
                                    type="number"
                                    value={originalPrice}
                                    onChange={(e) => setOriginalPrice(e.target.value)}
                                    className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-2 text-white focus:border-gold-400 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gold-400 mb-1">سعر البيع (أوقية) <span className="text-red-500">*</span></label>
                                <input
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className="w-full bg-dark-900 border border-gold-400/50 rounded-lg px-4 py-2 text-white focus:border-gold-400 outline-none font-bold"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">الكمية المتوفرة</label>
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-2 text-white focus:border-gold-400 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">رمز المنتج (SKU)</label>
                                <input type="text" className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-2 text-gray-500 outline-none" value="AUTO-GEN-001" readOnly />
                            </div>
                        </div>
                    </div>

                    {/* Glasses Details (Conditional) */}
                    {category === 'glasses' && (
                        <div className="bg-dark-800 p-6 rounded-xl border border-gold-400/30 animate-in fade-in slide-in-from-top-4">
                            <h3 className="text-lg font-bold text-white mb-4 border-b border-dark-700 pb-2 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-gold-400"></span>
                                تفاصيل النظارة
                            </h3>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">النوع</label>
                                    <select value={gender} onChange={(e) => setGender(e.target.value as any)} className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-2 text-white outline-none focus:border-gold-400">
                                        <option value="unisex">مناسب للجنسين</option>
                                        <option value="men">رجالي</option>
                                        <option value="women">نسائي</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">نوع العدسة</label>
                                    <select value={lensType} onChange={(e) => setLensType(e.target.value as any)} className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-2 text-white outline-none focus:border-gold-400">
                                        <option value="sun">شمسية</option>
                                        <option value="medical">طبية</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">مادة الإطار</label>
                                    <select value={frameMaterial} onChange={(e) => setFrameMaterial(e.target.value as any)} className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-2 text-white outline-none focus:border-gold-400">
                                        <option value="metal">معدن</option>
                                        <option value="plastic">بلاستيك / أسيتات</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">شكل الإطار</label>
                                    <select value={frameShape} onChange={(e) => setFrameShape(e.target.value as any)} className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-2 text-white outline-none focus:border-gold-400">
                                        <option value="round">دائري</option>
                                        <option value="square">مربع</option>
                                        <option value="aviator">طيار (Aviator)</option>
                                        <option value="cat-eye">عيون القطة</option>
                                        <option value="other">أخرى</option>
                                    </select>
                                </div>
                                <div className="col-span-2">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={hasFullSet}
                                            onChange={(e) => setHasFullSet(e.target.checked)}
                                            className="w-5 h-5 rounded border-dark-600 bg-dark-900 accent-gold-400"
                                        />
                                        <div>
                                            <span className="text-gray-300 text-sm group-hover:text-gold-400 transition">تتوفر مع العلبة الأصلية والضمان ✅</span>
                                            <p className="text-[10px] text-gray-500">سيظهر ملصق "Full Set" للزبائن</p>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Watch Details (Conditional) */}
                    {category === 'watches' && (
                        // ... (existing watch details)
                        <div className="bg-dark-800 p-6 rounded-xl border border-gold-400/30 animate-in fade-in slide-in-from-top-4">
                            <h3 className="text-lg font-bold text-white mb-4 border-b border-dark-700 pb-2 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-gold-400"></span>
                                تفاصيل الساعة
                            </h3>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">الفئة</label>
                                    <select value={gender} onChange={(e) => setGender(e.target.value as any)} className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-2 text-white outline-none focus:border-gold-400">
                                        <option value="unisex">مناسب للجنسين</option>
                                        <option value="men">رجالي</option>
                                        <option value="women">نسائي</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">نوع الماكينة</label>
                                    <select value={watchMovement} onChange={(e) => setWatchMovement(e.target.value as any)} className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-2 text-white outline-none focus:border-gold-400">
                                        <option value="quartz">كوارتز (بطارية)</option>
                                        <option value="automatic">أوتوماتيك</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">نوع السوار</label>
                                    <select value={strapMaterial} onChange={(e) => setStrapMaterial(e.target.value as any)} className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-2 text-white outline-none focus:border-gold-400">
                                        <option value="metal">معدن (Steel)</option>
                                        <option value="leather">جلد طبيعي</option>
                                        <option value="rubber">ربر (مطاط)</option>
                                        <option value="other">أخرى</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">مادة الهيكل (Case)</label>
                                    <input
                                        type="text"
                                        value={caseMaterial}
                                        onChange={(e) => setCaseMaterial(e.target.value)}
                                        className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-2 text-white focus:border-gold-400 outline-none"
                                        placeholder="مثال: Stainless Steel 316L"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={hasFullSet}
                                            onChange={(e) => setHasFullSet(e.target.checked)}
                                            className="w-5 h-5 rounded border-dark-600 bg-dark-900 accent-gold-400"
                                        />
                                        <div>
                                            <span className="text-gray-300 text-sm group-hover:text-gold-400 transition">تتوفر مع العلبة الأصلية والضمان (Full Set) ✅</span>
                                            <p className="text-[10px] text-gray-500">سيظهر ملصق الفخامة للزبائن</p>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Perfume Details (Conditional) */}
                    {category === 'perfumes' && (
                        <div className="bg-dark-800 p-6 rounded-xl border border-gold-400/30 animate-in fade-in slide-in-from-top-4">
                            <h3 className="text-lg font-bold text-white mb-4 border-b border-dark-700 pb-2 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-gold-400"></span>
                                تفاصيل العطر
                            </h3>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">الفئة</label>
                                    <select value={gender} onChange={(e) => setGender(e.target.value as any)} className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-2 text-white outline-none focus:border-gold-400">
                                        <option value="unisex">مناسب للجنسين</option>
                                        <option value="men">رجالي</option>
                                        <option value="women">نسائي</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">الحجم</label>
                                    <select value={perfumeVolume} onChange={(e) => setPerfumeVolume(e.target.value as any)} className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-2 text-white outline-none focus:border-gold-400">
                                        <option value="100ml">100 مل</option>
                                        <option value="50ml">50 مل</option>
                                        <option value="others">أحجام أخرى</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">درجة الثبات</label>
                                    <select value={perfumeLongevity} onChange={(e) => setPerfumeLongevity(e.target.value as any)} className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-2 text-white outline-none focus:border-gold-400">
                                        <option value="high">طويل الأمد (High)</option>
                                        <option value="medium">متوسط (Medium)</option>
                                        <option value="long">ثبات خفيف</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">وصف الرائحة (Notes)</label>
                                    <input
                                        type="text"
                                        value={perfumeScent}
                                        onChange={(e) => setPerfumeScent(e.target.value)}
                                        className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-2 text-white focus:border-gold-400 outline-none"
                                        placeholder="مثال: عود، أخشاب، فواكه..."
                                    />
                                </div>
                            </div>

                            {/* Video Unboxing Upload Section */}
                            <div className="mt-8 pt-8 border-t border-dark-700">
                                <h4 className="text-sm font-bold text-gold-400 mb-4 flex items-center gap-2">
                                    <Plus className="w-4 h-4" /> فيديو فتح الصندوق (Unboxing Video)
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                                    <div className="space-y-4">
                                        <p className="text-xs text-gray-500 leading-relaxed">
                                            ارفع فيديو قصير (Reels Style) يوضح فخامة العطور وتغليفها. يشجع هذا الفيديو الزبائن على الشراء بنسبة 80% أكثر.
                                        </p>
                                        <label className="flex items-center gap-3 bg-dark-900 border border-dashed border-dark-600 p-4 rounded-2xl cursor-pointer hover:border-gold-400 transition group">
                                            <div className="w-10 h-10 bg-gold-400/10 rounded-xl flex items-center justify-center text-gold-400 group-hover:scale-110 transition">
                                                {isUploadingVideo ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-5 h-5" />}
                                            </div>
                                            <div className="text-right">
                                                <span className="block text-sm font-bold text-white">اختر فيديو MP4</span>
                                                <span className="block text-[10px] text-gray-500">الحد الأقصى 10MB</span>
                                            </div>
                                            <input type="file" className="hidden" accept="video/mp4,video/quicktime" onChange={handleVideoUpload} />
                                        </label>
                                    </div>

                                    {videoUrl && (
                                        <div className="relative aspect-[9/16] max-h-[250px] mx-auto rounded-2xl border-2 border-gold-400/50 overflow-hidden group">
                                            <video src={videoUrl} className="w-full h-full object-cover" muted loop autoPlay />
                                            <button
                                                onClick={() => setVideoUrl('')}
                                                className="absolute top-2 left-2 bg-red-500 p-1.5 rounded-full text-white shadow-lg opacity-0 group-hover:opacity-100 transition"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">

                    {/* Best Seller Status */}
                    <div className="bg-dark-800 p-6 rounded-xl border border-dark-700">
                        <h3 className="text-sm font-bold text-gray-400 mb-4 uppercase">الترويج والإحصائيات</h3>
                        <div className="space-y-4">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={isBestSeller}
                                    onChange={(e) => setIsBestSeller(e.target.checked)}
                                    className="w-5 h-5 rounded border-dark-600 bg-dark-900 accent-gold-400"
                                />
                                <span className="text-gray-300 text-sm group-hover:text-gold-400 transition">تمييز كـ "الأكثر طلباً" 🔥</span>
                            </label>

                            {isBestSeller && (
                                <div className="pt-2 animate-fade-in-down">
                                    <label className="block text-xs text-gold-400 mb-1">عدد المبيعات الوهمي (للعرض)</label>
                                    <input
                                        type="number"
                                        className="w-full bg-dark-900 border border-dark-600 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-gold-400"
                                        placeholder="مثال: 120"
                                        value={salesCount}
                                        onChange={(e) => setSalesCount(e.target.value)}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Stock Location Source */}
                    <div className="bg-dark-800 p-6 rounded-xl border border-dark-700">
                        <h3 className="text-sm font-bold text-gray-400 mb-4 uppercase">مصدر المنتج</h3>
                        <div className="space-y-4">
                            <label className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition ${source === 'local' ? 'border-green-500 bg-green-500/10' : 'border-dark-600 bg-dark-900/50 hover:border-green-500/50'}`}>
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center">
                                        <input type="radio" name="source" value="local" checked={source === 'local'} onChange={() => setSource('local')} className="accent-green-500 w-full h-full opacity-0" />
                                        <div className={`w-2 h-2 bg-green-500 rounded-full ${source === 'local' ? '' : 'hidden'}`}></div>
                                    </div>
                                    <div>
                                        <span className="block font-bold text-white text-sm">متاح في متجرنا (موريتانيا)</span>
                                        <span className="text-xs text-gray-500">تسليم فوري من المخزن</span>
                                    </div>
                                </div>
                                <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></span>
                            </label>

                            <label className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition ${source === 'dubai' ? 'border-gold-400 bg-gold-400/10' : 'border-dark-600 bg-dark-900/50 hover:border-gold-400/50'}`}>
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center">
                                        <input type="radio" name="source" value="dubai" checked={source === 'dubai'} onChange={() => setSource('dubai')} className="accent-gold-400 w-full h-full opacity-0" />
                                        <div className={`w-2 h-2 bg-gold-400 rounded-full ${source === 'dubai' ? '' : 'hidden'}`}></div>
                                    </div>
                                    <div>
                                        <span className="block font-bold text-white text-sm">خيار الشحن من دبي</span>
                                        <span className="text-xs text-gray-500">شحن عند الطلب (يتطلب وقت)</span>
                                    </div>
                                </div>
                                <span className="w-2 h-2 rounded-full bg-gold-400 shadow-[0_0_10px_rgba(212,175,55,0.5)]"></span>
                            </label>

                            {source === 'dubai' && (
                                <div className="pt-2 animate-fade-in-down">
                                    <label className="block text-xs text-gold-400 mb-1">مدة الشحن المتوقعة <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        className="w-full bg-dark-900 border border-dark-600 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-gold-400"
                                        placeholder="مثال: 5-7 أيام عمل"
                                        value={shippingDuration}
                                        onChange={(e) => setShippingDuration(e.target.value)}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Category Selector */}
                    <div className="bg-dark-800 p-6 rounded-xl border border-dark-700">
                        <h3 className="text-sm font-bold text-gray-400 mb-4 uppercase">تصنيف المنتج</h3>
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 p-2 rounded hover:bg-dark-700 cursor-pointer">
                                <input type="radio" name="cat" value="perfumes" checked={category === 'perfumes'} onChange={() => setCategory('perfumes')} className="accent-gold-400" />
                                <span>عطور</span>
                            </label>
                            <label className="flex items-center gap-2 p-2 rounded hover:bg-dark-700 cursor-pointer">
                                <input type="radio" name="cat" value="watches" checked={category === 'watches'} onChange={() => setCategory('watches')} className="accent-gold-400" />
                                <span>ساعات</span>
                            </label>
                            <label className="flex items-center gap-2 p-2 rounded hover:bg-dark-700 cursor-pointer">
                                <input type="radio" name="cat" value="glasses" checked={category === 'glasses'} onChange={() => setCategory('glasses')} className="accent-gold-400" />
                                <span>نظارات</span>
                            </label>
                        </div>
                    </div>

                    {/* Enhanced Image Gallery */}
                    <div className="bg-dark-800 p-6 rounded-xl border border-dark-700">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold text-gray-400 uppercase">معرض صور المنتج</h3>
                            <span className="text-xs text-gray-500">{images.length}/5 صور</span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-4">
                            {images.map((img, idx) => (
                                <div
                                    key={idx}
                                    draggable
                                    onDragStart={(e) => e.dataTransfer.setData('imageIndex', idx.toString())}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        const fromIndex = parseInt(e.dataTransfer.getData('imageIndex'));
                                        moveImage(fromIndex, idx);
                                    }}
                                    className="relative aspect-square rounded-xl overflow-hidden border-2 border-dark-600 group cursor-move hover:border-gold-400 transition-all"
                                >
                                    <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />

                                    {/* Cover Badge */}
                                    {idx === 0 && (
                                        <div className="absolute top-2 left-2 bg-gold-gradient text-dark-900 text-[9px] font-black px-2 py-1 rounded-full shadow-lg flex items-center gap-1">
                                            <Star className="w-3 h-3 fill-current" />
                                            غلاف
                                        </div>
                                    )}

                                    {/* Image Number */}
                                    <div className="absolute bottom-2 left-2 bg-dark-900/80 backdrop-blur text-white text-xs font-bold px-2 py-1 rounded-lg">
                                        {idx + 1}
                                    </div>

                                    {/* Remove Button */}
                                    <button
                                        onClick={() => removeImage(idx)}
                                        className="absolute top-2 right-2 bg-red-500/90 hover:bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>

                                    {/* Drag Indicator */}
                                    <div className="absolute inset-0 bg-dark-900/0 group-hover:bg-dark-900/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <div className="bg-dark-800/90 backdrop-blur px-3 py-1.5 rounded-lg text-xs font-bold text-gold-400 flex items-center gap-1">
                                            <GripVertical className="w-4 h-4" />
                                            اسحب لإعادة الترتيب
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Add Images Button */}
                            {images.length < 5 && (
                                <label className="aspect-square rounded-xl border-2 border-dashed border-dark-600 hover:border-gold-400 hover:bg-gold-400/5 flex flex-col items-center justify-center cursor-pointer transition-all text-gray-500 hover:text-gold-400 group">
                                    <div className="w-12 h-12 bg-dark-700 rounded-full flex items-center justify-center mb-2 group-hover:bg-gold-400 group-hover:text-dark-900 transition-all">
                                        {isProcessingImages ? <Loader2 className="w-6 h-6 animate-spin text-gold-400 group-hover:text-dark-900" /> : <Plus className="w-6 h-6" />}
                                    </div>
                                    <span className="text-xs font-bold">{isProcessingImages ? 'جارِ المعالجة...' : 'إضافة صور'}</span>
                                    {!isProcessingImages && <span className="text-[10px] text-gray-600 mt-1">({5 - images.length} متبقية)</span>}
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageUpload}
                                    />
                                </label>
                            )}
                        </div>

                        <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-3 space-y-2">
                            <p className="text-xs text-blue-400 font-bold flex items-center gap-2">
                                <Info className="w-4 h-4" />
                                نصائح لصور احترافية:
                            </p>
                            <ul className="text-[10px] text-gray-400 space-y-1 pr-6">
                                <li>• الصورة الأولى ستكون الغلاف الرئيسي</li>
                                <li>• اسحب الصور لإعادة ترتيبها</li>
                                <li>• يمكنك رفع 3-5 صور في المرة الواحدة</li>
                                <li>• حجم كل صورة: أقصى حد 2MB</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
