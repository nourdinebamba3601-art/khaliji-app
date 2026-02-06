import { Gem, Watch, Eye } from 'lucide-react';

export default function Categories() {
    const categories = [
        {
            title: "العطور الفاخرة",
            description: "تشكيلة مميزة من العطور الشرقية والفرنسية",
            icon: <Gem className="w-12 h-12 text-gold-400 mb-4 group-hover:scale-110 transition-transform duration-300" />,
            href: "/perfumes"
        },
        {
            title: "الساعات الأنيقة",
            description: "ساعات رسمية ورياضية لأصحاب الذوق الرفيع",
            icon: <Watch className="w-12 h-12 text-gold-400 mb-4 group-hover:scale-110 transition-transform duration-300" />,
            href: "/watches"
        },
        {
            title: "النظارات",
            description: "نظارات شمسية وطبية بأحدث الموديلات",
            icon: <Eye className="w-12 h-12 text-gold-400 mb-4 group-hover:scale-110 transition-transform duration-300" />,
            href: "/glasses"
        }
    ];

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
            <div className="text-center mb-16">
                <h3 className="text-3xl font-bold text-white mb-4">تصنيفات المتجر</h3>
                <div className="h-1 w-20 bg-gold-400 mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {categories.map((cat, idx) => (
                    <div key={idx} className="group relative rounded-2xl overflow-hidden h-72 cursor-pointer border border-dark-700 hover:border-gold-400/50 hover:shadow-[0_0_30px_rgba(212,175,55,0.1)] transition-all duration-500 bg-dark-800">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-dark-900/80 group-hover:to-dark-900 transition-colors"></div>
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                            {cat.icon}
                            <h4 className="text-2xl font-bold text-white mb-2">{cat.title}</h4>
                            <p className="text-sm text-gray-400">{cat.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
