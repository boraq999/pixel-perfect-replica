import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    ArrowRight,
    Package,
    Plus,
    Trash2,
    AlertCircle,
    CheckCircle,
    AlertTriangle,
    Loader2,
    Box,
    ShoppingCart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/store/authStore';
import { useMarketerStore } from '@/store/marketerStore';
import { useCurrency } from '@/store/currencyStore'; // Assuming you have this
import { Product } from '@/types/marketer';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

export const NewStockRequestPage = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { user } = useAuthStore();
    const { products, isLoading: isLoadingProducts, fetchProducts, createRequest } = useMarketerStore();
    const { formatAmount } = useCurrency();

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedItems, setSelectedItems] = useState<{ product: Product; quantity: number }[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.barcode.includes(searchQuery)
    );

    const handleAddItem = (product: Product) => {
        const existingItem = selectedItems.find(item => item.product.id === product.id);
        if (existingItem) {
            setSelectedItems(selectedItems.map(item =>
                item.product.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            setSelectedItems([...selectedItems, { product, quantity: 1 }]);
        }
        toast({
            title: "تم إضافة المنتج",
            description: `تم إضافة ${product.name} إلى السلة`,
            duration: 2000,
        });
    };

    const handleUpdateQuantity = (productId: string, quantity: number) => {
        if (quantity < 1) {
            handleRemoveItem(productId);
            return;
        }
        setSelectedItems(selectedItems.map(item =>
            item.product.id === productId
                ? { ...item, quantity }
                : item
        ));
    };

    const handleRemoveItem = (productId: string) => {
        setSelectedItems(selectedItems.filter(item => item.product.id !== productId));
    };

    const handleSubmit = async () => {
        if (!user?.id) return;
        if (selectedItems.length === 0) {
            toast({
                title: "السلة فارغة",
                description: "الرجاء إضافة منتجات للسلة قبل إرسال الطلب",
                variant: "destructive",
            });
            return;
        }

        setIsSubmitting(true);
        try {
            await createRequest(
                user.id,
                selectedItems.map(item => ({
                    product_id: item.product.id,
                    quantity: item.quantity
                }))
            );

            toast({
                title: "تم إرسال الطلب بنجاح",
                description: "سيتم مراجعة طلبك من قبل أمين المخزن",
            });
            navigate('/dashboard/warehouse');
        } catch (error) {
            toast({
                title: "خطأ في إرسال الطلب",
                description: "حدث خطأ أثناء إرسال الطلب، يرجى المحاولة مرة أخرى",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const totalItems = selectedItems.reduce((acc, item) => acc + item.quantity, 0);
    const totalCost = selectedItems.reduce((acc, item) => acc + (item.product.current_price * item.quantity), 0);

    return (
        <div className="space-y-6 pb-20 md:pb-8">
            {/* Header */}
            <div className="flex items-center gap-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 p-4 -mx-4 md:mx-0 md:p-0 md:static border-b md:border-0">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full hover:bg-muted">
                    <ArrowRight className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-xl font-bold md:text-2xl">طلب بضاعة جديد</h1>
                    <p className="text-sm text-muted-foreground">قم باختيار المنتجات التي تريد إضافتها لمخزونك</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Product Selection */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-none shadow-md overflow-hidden">
                        <div className="p-4 bg-muted/30 border-b sticky top-0 z-10">
                            <div className="relative">
                                <Input
                                    placeholder="بحث عن منتج (الاسم أو الباركود)..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 bg-background"
                                />
                                <Box className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            </div>
                        </div>

                        <ScrollArea className="h-[calc(100vh-300px)] lg:h-[600px]">
                            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {isLoadingProducts ? (
                                    <div className="col-span-full flex flex-col items-center justify-center py-12 text-muted-foreground">
                                        <Loader2 className="h-8 w-8 animate-spin mb-4" />
                                        <p>جاري تحميل المنتجات...</p>
                                    </div>
                                ) : filteredProducts.length === 0 ? (
                                    <div className="col-span-full flex flex-col items-center justify-center py-12 text-muted-foreground">
                                        <AlertCircle className="h-12 w-12 mb-4 opacity-20" />
                                        <p>لا توجد منتجات تطابق بحثك</p>
                                    </div>
                                ) : (
                                    filteredProducts.map((product) => (
                                        <motion.div
                                            key={product.id}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="group relative overflow-hidden rounded-xl border bg-card p-4 hover:shadow-lg transition-all hover:border-primary/50"
                                        >
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                                    <Package className="h-6 w-6" />
                                                </div>
                                                <Badge variant="secondary" className="font-mono text-xs">
                                                    {product.barcode}
                                                </Badge>
                                            </div>

                                            <h3 className="font-bold text-foreground mb-1 line-clamp-1">{product.name}</h3>
                                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2 min-h-[2.5rem]">
                                                {product.description || 'لا يوجد وصف'}
                                            </p>

                                            <div className="flex items-center justify-between mt-auto pt-3 border-t">
                                                <span className="font-bold text-lg text-primary font-ar">
                                                    {formatAmount(product.current_price)}
                                                </span>
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleAddItem(product)}
                                                    className="rounded-full w-8 h-8 p-0"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        </ScrollArea>
                    </Card>
                </div>

                {/* Cart / Summary */}
                <div className="lg:col-span-1">
                    <Card className="sticky top-20 border-none shadow-xl bg-primary/5 border-primary/20">
                        <div className="p-4 border-b bg-background/50 backdrop-blur">
                            <div className="flex items-center gap-2 font-bold text-lg text-primary">
                                <ShoppingCart className="h-5 w-5" />
                                <span>سلة الطلبات</span>
                                <Badge className="mr-auto bg-primary text-primary-foreground">{totalItems}</Badge>
                            </div>
                        </div>

                        <ScrollArea className="h-[300px] lg:h-[400px]">
                            <div className="p-4 space-y-4">
                                {selectedItems.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full py-8 text-center text-muted-foreground">
                                        <ShoppingCart className="h-12 w-12 mb-4 opacity-20" />
                                        <p>سلتك فارغة</p>
                                        <p className="text-xs mt-1">أضف منتجات من القائمة لإرسال طلب</p>
                                    </div>
                                ) : (
                                    <AnimatePresence initial={false}>
                                        {selectedItems.map((item) => (
                                            <motion.div
                                                key={item.product.id}
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="bg-background rounded-lg p-3 shadow-sm border flex items-center gap-3"
                                            >
                                                <div className="h-10 w-10 rounded bg-muted flex items-center justify-center flex-shrink-0">
                                                    <Package className="h-5 w-5 text-muted-foreground" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-medium text-sm truncate">{item.product.name}</h4>
                                                    <div className="text-xs text-muted-foreground font-ar">
                                                        {formatAmount(item.product.current_price)} × {item.quantity}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex flex-col gap-1 items-center bg-muted rounded-md px-1">
                                                        <button
                                                            onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                                                            className="hover:text-primary transition-colors text-xs p-1"
                                                        >
                                                            +
                                                        </button>
                                                        <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                                        <button
                                                            onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                                                            className="hover:text-destructive transition-colors text-xs p-1"
                                                        >
                                                            -
                                                        </button>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                                        onClick={() => handleRemoveItem(item.product.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                )}
                            </div>
                        </ScrollArea>

                        <div className="p-4 bg-background/50 backdrop-blur border-t space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">عدد المنتجات</span>
                                    <span className="font-bold">{selectedItems.length}</span>
                                </div>
                                <div className="flex justify-between text-base font-bold">
                                    <span>الإجمالي المتوقع</span>
                                    <span className="text-primary font-ar">{formatAmount(totalCost)}</span>
                                </div>
                            </div>

                            <Button
                                className="w-full h-12 text-lg shadow-lg shadow-primary/20"
                                onClick={handleSubmit}
                                disabled={selectedItems.length === 0 || isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        جاري الإرسال...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="mr-2 h-5 w-5" />
                                        تأكيد وإرسال الطلب
                                    </>
                                )}
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};
