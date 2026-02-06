'use client';

import Link from 'next/link';
import { Plus, Search, Filter, MoreVertical, Edit, Trash, AlertCircle } from 'lucide-react';
import { useProducts } from '@/context/ProductContext';
import { toast, Toaster } from 'sonner';

export default function ProductsListPage() {
    const { products, deleteProduct } = useProducts();

    const handleDelete = (id: number, name: string) => {
        if (confirm(`هل أنت متأكد من حذف المنتج: ${name}؟`)) {
            deleteProduct(id);
            toast.success('تم حذف المنتج بنجاح');
        }
    };

    return (
        <div>
            <Toaster position="top-center" richColors />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white">المنتجات</h1>
                    <p className="text-gray-400 text-sm">إدارة مخزون المتجر ({products.length} منتج)</p>
                </div>
                <Link href="/admin/products/new" className="bg-gold-500 hover:bg-gold-600 text-dark-900 font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition">
                    <Plus className="w-5 h-5" />
                    إضافة منتج جديد
                </Link>
            </div>

            {/* Filters Bar */}
            <div className="bg-dark-800 p-4 rounded-xl border border-dark-700 mb-6 flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input type="text" placeholder="بحث باسم المنتج أو الرمز..." className="w-full bg-dark-900 border border-dark-700 rounded-lg pr-10 pl-4 py-2 text-white focus:border-gold-400 outline-none" />
                </div>
                <div className="flex gap-2">
                    <select className="bg-dark-900 border border-dark-700 rounded-lg px-4 py-2 text-white outline-none">
                        <option value="">كل التصنيفات</option>
                        <option value="perfumes">عطور</option>
                        <option value="watches">ساعات</option>
                        <option value="glasses">نظارات</option>
                    </select>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-dark-800 rounded-xl border border-dark-700 overflow-hidden">
                {products.length === 0 ? (
                    <div className="p-8 text-center text-gray-400 flex flex-col items-center">
                        <AlertCircle className="w-10 h-10 mb-2 opacity-50" />
                        <p>لا توجد منتجات حالياً.</p>
                        <Link href="/admin/products/new" className="text-gold-400 hover:underline mt-2">أضف منتجك الأول</Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-right min-w-[800px]">
                            <thead className="bg-dark-700 text-gray-300 text-xs uppercase">
                                <tr>
                                    <th className="px-6 py-4">المنتج</th>
                                    <th className="px-6 py-4">التصنيف</th>
                                    <th className="px-6 py-4">السعر</th>
                                    <th className="px-6 py-4">المخزون</th>
                                    <th className="px-6 py-4">الحالة</th>
                                    <th className="px-6 py-4">إجراءات</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-dark-700 text-sm">
                                {products.map((product) => (
                                    <tr key={product.id} className="hover:bg-dark-700/50 transition group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-dark-600 overflow-hidden border border-dark-500">
                                                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white max-w-[200px] truncate">{product.name}</p>
                                                    <span className="text-xs text-gray-500">#{product.id}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-300">
                                            {product.category === 'perfumes' && 'عطور'}
                                            {product.category === 'watches' && 'ساعات'}
                                            {product.category === 'glasses' && 'نظارات'}
                                        </td>
                                        <td className="px-6 py-4 text-white font-mono">{product.price.toLocaleString()} UM</td>
                                        <td className="px-6 py-4 text-white">{product.quantity}</td>
                                        <td className="px-6 py-4">
                                            {product.quantity > 0 ? (
                                                <span className="bg-green-500/10 text-green-500 border border-green-500/20 px-2 py-1 rounded-full text-xs">متوفر</span>
                                            ) : (
                                                <span className="bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-1 rounded-full text-xs">نفذت الكمية</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 opacity-100 transition">
                                                <Link
                                                    href={`/admin/products/edit/${product.id}`}
                                                    className="p-2 hover:bg-dark-600 rounded-lg text-gray-400 hover:text-gold-400 transition"
                                                    title="تعديل"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(product.id, product.name)}
                                                    className="p-2 hover:bg-red-500/20 rounded-lg text-gray-400 hover:text-red-400 transition"
                                                    title="حذف"
                                                >
                                                    <Trash className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {products.length > 5 && (
                <div className="p-4 flex justify-center mt-4">
                    <span className="text-sm text-gray-500">عرض أحدث المنتجات</span>
                </div>
            )}
        </div>
    );
}
