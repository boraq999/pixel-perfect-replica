# 🔍 دليل الفلترة الشامل - Complete Filtering Guide

## ✅ جميع APIs تدعم الفلترة الآن

---

## 🔵 المسوق (Marketer/Salesman)

### 1️⃣ طلبات البضاعة
```http
GET /api/marketer/requests
Authorization: Bearer {token}
```

**الفلاتر المتاحة:**
```http
# حسب الحالة
?status=pending
?status=approved
?status=documented
?status=rejected
?status=cancelled

# حسب التاريخ
?from_date=2024-01-01
?to_date=2024-12-31
?from_date=2024-01-01&to_date=2024-01-31

# دمج الفلاتر
?status=pending&from_date=2024-01-01
```

---

### 2️⃣ إرجاعات البضاعة
```http
GET /api/marketer/returns
Authorization: Bearer {token}
```

**الفلاتر المتاحة:**
```http
# حسب الحالة
?status=pending
?status=approved
?status=documented
?status=rejected
?status=cancelled

# حسب التاريخ
?from_date=2024-01-01
?to_date=2024-12-31

# دمج الفلاتر
?status=approved&from_date=2024-01-01&to_date=2024-01-31
```

---

### 3️⃣ فواتير البيع
```http
GET /api/marketer/sales
Authorization: Bearer {token}
```

**الفلاتر المتاحة:**
```http
# حسب الحالة
?status=pending
?status=approved
?status=rejected
?status=cancelled

# دمج الفلاتر
?status=pending
```

---

### 4️⃣ إيصالات القبض
```http
GET /api/marketer/payments
Authorization: Bearer {token}
```

**الفلاتر المتاحة:**
```http
# حسب الحالة
?status=pending
?status=approved
?status=rejected
?status=cancelled

# حسب المتجر
?store_id=5

# حسب طريقة الدفع
?payment_method=cash
?payment_method=transfer
?payment_method=certified_check

# حسب التاريخ
?from_date=2024-01-01
?to_date=2024-12-31

# دمج الفلاتر
?status=pending&store_id=5&payment_method=cash
?store_id=5&from_date=2024-01-01&to_date=2024-01-31
```

---

### 5️⃣ إرجاعات المتاجر
```http
GET /api/marketer/store-returns
Authorization: Bearer {token}
```

**الفلاتر المتاحة:**
```http
# حسب الحالة
?status=pending
?status=approved
?status=rejected
?status=cancelled

# حسب المتجر
?store_id=5

# حسب التاريخ
?from_date=2024-01-01
?to_date=2024-12-31

# دمج الفلاتر
?status=pending&store_id=5
?store_id=5&from_date=2024-01-01&to_date=2024-01-31
```

---

### 6️⃣ طلبات السحب
```http
GET /api/marketer/withdrawals
Authorization: Bearer {token}
```

**الفلاتر المتاحة:**
```http
# حسب الحالة
?status=pending
?status=approved
?status=rejected
?status=cancelled

# حسب التاريخ
?from_date=2024-01-01
?to_date=2024-12-31

# دمج الفلاتر
?status=pending&from_date=2024-01-01
```

---

### 5️⃣ المنتجات
```http
GET /api/products
Authorization: Bearer {token}
```

**الفلاتر المتاحة:**
```http
# حسب الحالة النشطة
?is_active=1  # نشط
?is_active=0  # غير نشط
```

---

### 6️⃣ المتاجر
```http
GET /api/stores
Authorization: Bearer {token}
```

**الفلاتر المتاحة:**
```http
# حسب الحالة النشطة
?is_active=1  # نشط
?is_active=0  # غير نشط
```

---

### 7️⃣ ديون المتاجر
```http
GET /api/stores/debts
Authorization: Bearer {token}
```

**الفلاتر المتاحة:**
```http
# حسب الحالة النشطة
?is_active=1  # نشط
?is_active=0  # غير نشط
```

---

### 8️⃣ مخزون المسوق الفعلي
```http
GET /api/marketer/stock/actual
Authorization: Bearer {token}
```

**الفلاتر المتاحة:**
```http
# حسب المنتج
?product_id=5
```

---

### 9️⃣ مخزون المسوق المحجوز
```http
GET /api/marketer/stock/reserved
Authorization: Bearer {token}
```

**الفلاتر المتاحة:**
```http
# حسب المنتج
?product_id=5
```

---

## 🟢 أمين المخزن (Warehouse Keeper)

### 0️⃣ المخزن الرئيسي
```http
GET /api/warehouse/main-stock
Authorization: Bearer {token}
```

**الفلاتر المتاحة:**
```http
# حسب المنتج
?product_id=5
```

---

## 🟢 أمين المخزن (Warehouse Keeper)

### 1️⃣ طلبات المسوقين
```http
GET /api/warehouse/requests
Authorization: Bearer {token}
```

**الفلاتر المتاحة:**
```http
# حسب الحالة
?status=pending
?status=approved
?status=documented
?status=rejected
?status=cancelled

# حسب المسوق
?marketer_id=3

# حسب التاريخ
?from_date=2024-01-01
?to_date=2024-12-31

# دمج الفلاتر
?status=pending&marketer_id=3
?marketer_id=3&from_date=2024-01-01&to_date=2024-01-31
```

---

### 2️⃣ إرجاعات المسوقين
```http
GET /api/warehouse/returns
Authorization: Bearer {token}
```

**الفلاتر المتاحة:**
```http
# حسب الحالة
?status=pending
?status=approved
?status=documented
?status=rejected
?status=cancelled

# حسب المسوق
?marketer_id=3

# حسب التاريخ
?from_date=2024-01-01
?to_date=2024-12-31

# دمج الفلاتر
?status=pending&marketer_id=3
?marketer_id=3&from_date=2024-01-01&to_date=2024-01-31
```

---

### 3️⃣ فواتير البيع
```http
GET /api/warehouse/sales
Authorization: Bearer {token}
```

**الفلاتر المتاحة:**
```http
# حسب الحالة
?status=pending
?status=approved
?status=rejected
?status=cancelled

# حسب المسوق
?marketer_id=3

# حسب المتجر
?store_id=5

# حسب التاريخ
?from_date=2024-01-01
?to_date=2024-12-31

# دمج الفلاتر
?status=pending&marketer_id=3
?store_id=5&from_date=2024-01-01
?marketer_id=3&store_id=5&status=approved
```

---

### 4️⃣ إيصالات القبض
```http
GET /api/warehouse/payments
Authorization: Bearer {token}
```

**الفلاتر المتاحة:**
```http
# حسب الحالة
?status=pending
?status=approved
?status=rejected
?status=cancelled

# حسب المسوق
?marketer_id=3

# حسب المتجر
?store_id=5

# حسب طريقة الدفع
?payment_method=cash
?payment_method=transfer
?payment_method=certified_check

# حسب التاريخ
?from_date=2024-01-01
?to_date=2024-12-31

# دمج الفلاتر
?status=pending&marketer_id=3
?store_id=5&payment_method=cash
?marketer_id=3&store_id=5&from_date=2024-01-01
```

---

### 5️⃣ إرجاعات المتاجر
```http
GET /api/warehouse/store-returns
Authorization: Bearer {token}
```

**الفلاتر المتاحة:**
```http
# حسب الحالة
?status=pending
?status=approved
?status=rejected
?status=cancelled

# حسب المسوق
?marketer_id=3

# حسب المتجر
?store_id=5

# حسب التاريخ
?from_date=2024-01-01
?to_date=2024-12-31

# دمج الفلاتر
?status=pending&marketer_id=3
?store_id=5&status=approved
?marketer_id=3&from_date=2024-01-01&to_date=2024-01-31
```

---

## 🟡 الإدارة (Admin)

### 1️⃣ فواتير البيع
```http
GET /api/admin/sales
Authorization: Bearer {token}
```

**الفلاتر المتاحة:**
```http
# حسب الحالة
?status=pending
?status=approved
?status=rejected
?status=cancelled

# حسب المسوق
?marketer_id=3

# حسب المتجر
?store_id=5

# حسب التاريخ
?from_date=2024-01-01
?to_date=2024-12-31

# دمج الفلاتر
?status=pending&marketer_id=3
?store_id=5&from_date=2024-01-01
?marketer_id=3&store_id=5&status=approved
```

---

### 2️⃣ طلبات السحب
```http
GET /api/admin/withdrawals
Authorization: Bearer {token}
```

**الفلاتر المتاحة:**
```http
# حسب الحالة
?status=pending
?status=approved
?status=rejected
?status=cancelled

# حسب المسوق
?marketer_id=3

# حسب التاريخ
?from_date=2024-01-01
?to_date=2024-12-31

# دمج الفلاتر
?status=pending&marketer_id=3
?marketer_id=3&from_date=2024-01-01&to_date=2024-01-31
```

---

### 3️⃣ العروض الترويجية
```http
GET /api/admin/promotions
Authorization: Bearer {token}
```

**الفلاتر المتاحة:**
```http
# حسب الحالة النشطة
?is_active=1  # نشط
?is_active=0  # غير نشط

# حسب المنتج
?product_id=5

# حسب التاريخ
?from_date=2024-01-01
?to_date=2024-12-31

# دمج الفلاتر
?is_active=1&product_id=5
?product_id=5&from_date=2024-01-01&to_date=2024-12-31
```

---

### 4️⃣ خصومات الفواتير
```http
GET /api/admin/discounts
Authorization: Bearer {token}
```

**الفلاتر المتاحة:**
```http
# حسب الحالة النشطة
?is_active=1  # نشط
?is_active=0  # غير نشط

# حسب نوع الخصم
?discount_type=percentage
?discount_type=fixed

# حسب التاريخ
?from_date=2024-01-01
?to_date=2024-12-31

# دمج الفلاتر
?is_active=1&discount_type=percentage
?discount_type=fixed&from_date=2024-01-01&to_date=2024-12-31
```

---

### 5️⃣ المستخدمين
```http
GET /api/users
Authorization: Bearer {token}
```

**الفلاتر المتاحة:**
```http
# حسب الدور
?role_id=1  # Admin
?role_id=2  # Warehouse Keeper
?role_id=3  # Salesman

# حسب الحالة النشطة
?is_active=1  # نشط
?is_active=0  # غير نشط

# دمج الفلاتر
?role_id=3&is_active=1  # المسوقين النشطين فقط
```

---

### 6️⃣ المسوقين
```http
GET /api/admin/marketers
Authorization: Bearer {token}
```

**الفلاتر المتاحة:**
```http
# حسب الحالة النشطة
?is_active=1  # نشط
?is_active=0  # غير نشط
```

---

## 📊 ملخص الفلاتر المتاحة

### حسب النوع:

| Filter | الوصف | القيم المتاحة | APIs المدعومة |
|--------|-------|---------------|----------------|
| `status` | الحالة | pending, approved, documented, rejected, cancelled | جميع APIs العمليات |
| `marketer_id` | المسوق | رقم المسوق | Warehouse & Admin APIs |
| `store_id` | المتجر | رقم المتجر | Sales, Payments, Returns |
| `payment_method` | طريقة الدفع | cash, transfer, certified_check | Payments APIs |
| `from_date` | من تاريخ | YYYY-MM-DD | جميع APIs |
| `to_date` | إلى تاريخ | YYYY-MM-DD | جميع APIs |
| `is_active` | الحالة النشطة | 0, 1 | Promotions, Discounts, Users, Products, Stores, Store Debts, Marketers |
| `product_id` | المنتج | رقم المنتج | Promotions, Stock APIs, Main Stock |
| `discount_type` | نوع الخصم | percentage, fixed | Discounts, Active Discounts |
| `role_id` | الدور | 1, 2, 3 | Users |

---

## 🎯 أمثلة عملية شاملة

### مثال 1: طلبات مسوق معين في حالة pending
```http
GET /api/warehouse/requests?marketer_id=3&status=pending
```

---

### مثال 2: فواتير متجر معين خلال شهر
```http
GET /api/warehouse/sales?store_id=5&from_date=2024-01-01&to_date=2024-01-31
```

---

### مثال 3: إيصالات قبض نقدية لمسوق معين
```http
GET /api/warehouse/payments?marketer_id=3&payment_method=cash
```

---

### مثال 4: العروض النشطة لمنتج معين
```http
GET /api/admin/promotions?is_active=1&product_id=5
```

---

### مثال 5: خصومات نسبة مئوية النشطة
```http
GET /api/admin/discounts?is_active=1&discount_type=percentage
```

---

### مثال 6: المسوقين النشطين فقط
```http
GET /api/users?role_id=3&is_active=1
```

---

### مثال 7: طلبات سحب مسوق معين المعلقة
```http
GET /api/admin/withdrawals?marketer_id=3&status=pending
```

---

### مثال 8: إرجاعات متجر معين الموثقة
```http
GET /api/warehouse/store-returns?store_id=5&status=approved
```

---

## 📝 ملاحظات مهمة

### 1. دمج الفلاتر
يمكن دمج أكثر من فلتر في نفس الطلب:
```http
GET /api/warehouse/sales?marketer_id=3&store_id=5&status=pending&from_date=2024-01-01
```

### 2. حساسية الحالة
القيم حساسة لحالة الأحرف:
- ✅ `status=pending`
- ❌ `status=Pending`
- ❌ `status=PENDING`

### 3. صيغة التاريخ
استخدم صيغة: `YYYY-MM-DD`
- ✅ `from_date=2024-01-01`
- ❌ `from_date=01-01-2024`
- ❌ `from_date=2024/01/01`

### 4. القيم المنطقية (Boolean)
للحالة النشطة:
- ✅ `is_active=1` (نشط)
- ✅ `is_active=0` (غير نشط)
- ❌ `is_active=true`
- ❌ `is_active=false`

### 5. القيم غير الصحيحة
إذا كانت القيمة غير صحيحة، يتم تجاهل الفلتر:
```http
GET /api/warehouse/requests?status=invalid
# سيعرض جميع الطلبات (يتجاهل الفلتر)
```

### 6. الفلاتر الاختيارية
جميع الفلاتر اختيارية:
```http
GET /api/warehouse/requests
# بدون فلاتر = عرض الكل
```

---

## 📊 Response Format

**مع الفلترة:**
```json
{
  "message": "قائمة طلبات المسوقين",
  "data": [
    {
      "id": 5,
      "status": "pending",
      "marketer_id": 3,
      "marketer_name": "محمد السالم"
    }
  ]
}
```

**بدون نتائج:**
```json
{
  "message": "قائمة طلبات المسوقين",
  "data": []
}
```

---

## ✅ APIs المحدثة - الإحصائيات

### المسوق (8 APIs):
1. ✅ `/api/marketer/requests` - طلبات البضاعة
2. ✅ `/api/marketer/returns` - إرجاعات البضاعة
3. ✅ `/api/marketer/sales` - فواتير البيع
4. ✅ `/api/marketer/payments` - إيصالات القبض
5. ✅ `/api/marketer/store-returns` - إرجاعات المتاجر
6. ✅ `/api/marketer/withdrawals` - طلبات السحب
7. ✅ `/api/marketer/stock/actual` - مخزون المسوق الفعلي
8. ✅ `/api/marketer/stock/reserved` - مخزون المسوق المحجوز

### أمين المخزن (6 APIs):
1. ✅ `/api/warehouse/requests` - طلبات المسوقين
2. ✅ `/api/warehouse/returns` - إرجاعات المسوقين
3. ✅ `/api/warehouse/sales` - فواتير البيع
4. ✅ `/api/warehouse/payments` - إيصالات القبض
5. ✅ `/api/warehouse/store-returns` - إرجاعات المتاجر
6. ✅ `/api/warehouse/main-stock` - المخزن الرئيسي

### الإدارة (6 APIs):
1. ✅ `/api/admin/sales` - فواتير البيع
2. ✅ `/api/admin/withdrawals` - طلبات السحب
3. ✅ `/api/admin/promotions` - العروض الترويجية
4. ✅ `/api/admin/discounts` - خصومات الفواتير
5. ✅ `/api/admin/marketers` - المسوقين
6. ✅ `/api/users` - المستخدمين

### عام (4 APIs):
1. ✅ `/api/products` - المنتجات
2. ✅ `/api/stores` - المتاجر
3. ✅ `/api/stores/debts` - ديون المتاجر
4. ✅ `/api/discounts/active` - الخصومات النشطة

---

## 📈 إجمالي APIs المحدثة: 24 API

### الفلاتر المضافة:
- ✅ `status` - الحالة (11 APIs)
- ✅ `marketer_id` - المسوق (8 APIs)
- ✅ `store_id` - المتجر (6 APIs)
- ✅ `from_date` - من تاريخ (14 APIs)
- ✅ `to_date` - إلى تاريخ (14 APIs)
- ✅ `payment_method` - طريقة الدفع (2 APIs)
- ✅ `is_active` - الحالة النشطة (8 APIs)
- ✅ `product_id` - المنتج (4 APIs)
- ✅ `discount_type` - نوع الخصم (2 APIs)
- ✅ `role_id` - الدور (1 API)

---

**✅ النظام الآن يدعم الفلترة الشاملة لجميع APIs!**
