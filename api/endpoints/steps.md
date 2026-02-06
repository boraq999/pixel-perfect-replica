# 📋 التحليل الشامل للملف - 01_MARKETER_REQUESTS.md

## 🎯 الغرض الرئيسي
توثيق واجهات برمجية (API Endpoints) لإدارة طلبات البضاعة بين المسوقين وأمناء المخازن.

## 👥 الأدوار (Roles)

**1. المسوق (Marketer/Salesman):**
- إنشاء طلبات جديدة
- عرض طلباته الخاصة
- إلغاء طلباته

**2. أمين المخزن (Warehouse Keeper):**
- عرض جميع الطلبات
- الموافقة/الرفض على الطلبات
- توثيق استلام البضاعة
- إلغاء الطلبات

## 🔌 نقاط النهاية (API Endpoints)

### للمسوق (4 عمليات):
1. `POST /api/marketer/requests` - إنشاء طلب
2. `GET /api/marketer/requests` - قائمة الطلبات (مع فلترة وترقيم صفحات)
3. `GET /api/marketer/requests/{id}` - تفاصيل طلب
4. `PUT /api/marketer/requests/{id}/cancel` - إلغاء طلب

### لأمين المخزن (6 عمليات):
1. `GET /api/warehouse/requests` - قائمة جميع الطلبات
2. `GET /api/warehouse/requests/{id}` - تفاصيل طلب
3. `PUT /api/warehouse/requests/{id}/approve` - الموافقة
4. `PUT /api/warehouse/requests/{id}/reject` - الرفض
5. `POST /api/warehouse/requests/{id}/document` - التوثيق (رفع صورة)
6. `PUT /api/warehouse/requests/{id}/cancel` - الإلغاء

## 📊 دورة حياة الطلب (Status Flow)

```
pending (قيد الانتظار)
   ↓
approved (موافق عليه) ← يمكن الرفض/الإلغاء
   ↓
documented (موثق) ← الحالة النهائية

الحالات البديلة:
- rejected (مرفوض)
- cancelled (ملغي)
```

## 💾 نظام المخزون الثلاثي

**أنواع المخزون:**
1. `main_stock` - المخزون الرئيسي
2. `marketer_reserved_stock` - المخزون المحجوز للمسوق
3. `marketer_actual_stock` - المخزون الفعلي للمسوق

**حركة المخزون:**
- **Pending**: لا تأثير
- **Approved**: main_stock → marketer_reserved_stock
- **Documented**: marketer_reserved_stock → marketer_actual_stock
- **Rejected/Cancelled**: marketer_reserved_stock → main_stock (إرجاع)

## 🔒 الأمان والصلاحيات

- جميع الطلبات تتطلب `Authorization: Bearer {token}`
- المسوق يرى طلباته فقط
- أمين المخزن يرى جميع الطلبات
- أكواد الأخطاء: 401 (غير مصرح)، 403 (ممنوع)، 404 (غير موجود)

## 📋 الفلاتر المتاحة

**للمسوق:**
- `status`, `from_date`, `to_date`, `page`

**لأمين المخزن:**
- `status`, `marketer_id`, `from_date`, `to_date`, `page`

## 🎨 المميزات التقنية

1. **Pagination**: ترقيم صفحات (20 عنصر/صفحة)
2. **Validation**: قواعد تحقق صارمة
3. **File Upload**: رفع صور التوثيق (max 10MB)
4. **Invoice Numbering**: نظام ترقيم فواتير `MR-YYYYMMDD-XXXX`
5. **Audit Trail**: تسجيل المعتمدين والموثقين والتواريخ
6. **Stock Logging**: تسجيل حركات المخزون في `warehouse_stock_logs`

## ⚠️ قواعد العمل (Business Rules)

1. لا يمكن إلغاء/رفض طلب موثق
2. الموافقة تتطلب توفر مخزون كافٍ
3. التوثيق يتطلب رفع صورة مختومة
4. الإلغاء/الرفض يعيد الكميات للمخزون الرئيسي

## 🔄 تأثير العمليات على المخزون

### إنشاء الطلب (pending):
- ❌ لا يتأثر المخزون

### الموافقة (approved):
- ✅ main_stock: -quantity
- ✅ marketer_reserved_stock: +quantity

### التوثيق (documented):
- ✅ marketer_reserved_stock: -quantity
- ✅ marketer_actual_stock: +quantity

### الرفض (rejected):
- ✅ إذا كان approved: إرجاع من reserved إلى main

### الإلغاء (cancelled):
- ✅ إذا كان approved: إرجاع من reserved إلى main
