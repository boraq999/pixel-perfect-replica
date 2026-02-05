# 💰 بيع بضاعة للمتجر - Sales Invoices API

---

## 🔵 المسوق (Salesman)

### 1. إنشاء فاتورة بيع جديدة
```http
POST /api/marketer/sales
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "store_id": 1,
  "items": [
    {
      "product_id": 1,
      "quantity": 20
    },
    {
      "product_id": 2,
      "quantity": 15
    }
  ],
  "notes": "ملاحظات اختيارية"
}
```

**Validation Rules:**
- `store_id`: required, exists:stores,id
- `items`: required, array, min:1
- `items.*.product_id`: required, exists:products,id
- `items.*.quantity`: required, integer, min:1
- `notes`: nullable, string

**Success Response (201):**
```json
{
  "message": "تم إنشاء فاتورة البيع بنجاح",
  "data": {
    "id": 25,
    "invoice_number": "SI-20240203-0025"
  }
}
```

**Error Responses:**
- 400: الكمية المطلوبة غير متوفرة في مخزونك
- 400: المتجر غير نشط
- 404: المنتج غير موجود
- 422: بيانات غير صحيحة

**Business Rules:**
- يتم التحقق من توفر الكميات في marketer_actual_stock
- يتم تطبيق العروض الترويجية تلقائياً (اشتري X واحصل على Y مجاناً)
- يتم تطبيق خصومات الفواتير تلقائياً حسب قيمة الفاتورة
- يتم خصم الكميات (المباعة + المجانية) من مخزون المسوق
- يتم نقل الكميات إلى store_pending_stock

**حساب الفاتورة:**
```
subtotal = sum(quantity × unit_price)
product_discount = sum(free_quantity × unit_price)
invoice_discount_amount = حسب قواعد الخصم
total_amount = subtotal - invoice_discount_amount
```

---

### 2. عرض جميع فواتير البيع
```http
GET /api/marketer/sales
Authorization: Bearer {token}
```

**Query Parameters (Filters):**
- `status`: pending, approved, rejected, cancelled

**Examples:**
```http
GET /api/marketer/sales?status=pending
GET /api/marketer/sales?status=approved
```

**Success Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "invoice_number": "SI-20240203-0001",
      "marketer_id": 3,
      "store_id": 1,
      "store_name": "متجر الأمل",
      "total_amount": 4750,
      "subtotal": 5000,
      "product_discount": 200,
      "invoice_discount_amount": 50,
      "status": "pending",
      "created_at": "2024-02-03 10:30:00"
    }
  ]
}
```

---

### 3. عرض تفاصيل فاتورة
```http
GET /api/marketer/sales/{id}
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "message": "تفاصيل الفاتورة",
  "data": {
    "invoice": {
      "id": 10,
      "invoice_number": "SI-20240203-0010",
      "marketer_id": 3,
      "store_id": 1,
      "store_name": "متجر الأمل",
      "total_amount": 4750,
      "subtotal": 5000,
      "product_discount": 200,
      "invoice_discount_type": "percentage",
      "invoice_discount_value": 5,
      "invoice_discount_amount": 50,
      "status": "approved",
      "keeper_name": "أحمد المخزني",
      "stamped_invoice_image": "http://domain.com/storage/stamped_invoices/SI-20240203-0010/image.jpg",
      "confirmed_at": "2024-02-03 11:00:00",
      "notes": "ملاحظات"
    },
    "items": [
      {
        "id": 20,
        "invoice_id": 10,
        "product_id": 1,
        "product_name": "منتج 1",
        "quantity": 20,
        "free_quantity": 2,
        "unit_price": 100,
        "total_price": 2000,
        "promotion_id": 5
      }
    ]
  }
}
```

**Error Responses:**
- 404: الفاتورة غير موجودة
- 403: ليس لديك صلاحية الوصول لهذه الفاتورة

---

### 4. عرض معلومات رفض الفاتورة
```http
GET /api/marketer/sales/{id}/rejection
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "message": "معلومات الرفض",
  "data": {
    "sales_invoice_id": 10,
    "rejected_by": 2,
    "rejected_by_name": "أحمد المخزني",
    "rejection_reason": "أسعار غير صحيحة",
    "rejected_at": "2024-02-03 14:30:00",
    "created_at": "2024-02-03 14:30:00"
  }
}
```

**Error Responses:**
- 404: لا توجد معلومات رفض
- 404: الفاتورة غير موجودة
- 403: ليس لديك صلاحية الوصول

---

### 5. إلغاء فاتورة
```http
PUT /api/marketer/sales/{id}/cancel
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "message": "تم إلغاء الفاتورة بنجاح"
}
```

**Error Responses:**
- 404: الفاتورة غير موجودة
- 403: ليس لديك صلاحية إلغاء هذه الفاتورة
- 400: يمكن إلغاء الفواتير في حالة pending فقط

**Business Rules:**
- يمكن الإلغاء فقط في حالة: pending
- يتم إرجاع الكميات من store_pending_stock إلى marketer_actual_stock

---

## 🟢 أمين المخزن (Warehouse Keeper)

### 1. عرض جميع فواتير البيع
```http
GET /api/warehouse/sales
Authorization: Bearer {token}
```

**Query Parameters (Filters):**
- `status`: pending, approved, rejected, cancelled
- `marketer_id`: رقم المسوق
- `store_id`: رقم المتجر
- `from_date`: YYYY-MM-DD
- `to_date`: YYYY-MM-DD

**Examples:**
```http
GET /api/warehouse/sales?status=pending
GET /api/warehouse/sales?marketer_id=3
GET /api/warehouse/sales?store_id=5
GET /api/warehouse/sales?marketer_id=3&store_id=5&status=pending
GET /api/warehouse/sales?from_date=2024-01-01&to_date=2024-01-31
```

**Success Response (200):**
```json
{
  "message": "قائمة فواتير البيع",
  "data": [
    {
      "id": 1,
      "invoice_number": "SI-20240203-0001",
      "marketer_id": 3,
      "marketer_name": "محمد السالم",
      "store_id": 1,
      "store_name": "متجر الأمل",
      "total_amount": 4750,
      "status": "pending",
      "created_at": "2024-02-03 10:30:00"
    }
  ]
}
```

---

### 2. عرض تفاصيل فاتورة
```http
GET /api/warehouse/sales/{id}
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "message": "تفاصيل الفاتورة",
  "data": {
    "invoice": {
      "id": 10,
      "invoice_number": "SI-20240203-0010",
      "marketer_id": 3,
      "marketer_name": "محمد السالم",
      "store_id": 1,
      "store_name": "متجر الأمل",
      "keeper_name": "أحمد المخزني",
      "total_amount": 4750,
      "status": "approved",
      "stamped_invoice_image": "http://domain.com/storage/stamped_invoices/SI-20240203-0010/image.jpg"
    },
    "items": [
      {
        "id": 20,
        "invoice_id": 10,
        "product_id": 1,
        "product_name": "منتج 1",
        "quantity": 20,
        "free_quantity": 2,
        "unit_price": 100,
        "total_price": 2000
      }
    ]
  }
}
```

---

### 3. الموافقة والتوثيق
```http
POST /api/warehouse/sales/{id}/approve
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Request Body:**
```
stamped_invoice_image: [file]
```

**Validation Rules:**
- `stamped_invoice_image`: required, image, max:10240 (10MB)

**Success Response (200):**
```json
{
  "message": "تم توثيق الفاتورة بنجاح"
}
```

**Error Responses:**
- 404: الفاتورة غير موجودة أو تم معالجتها مسبقاً
- 422: صورة مطلوبة

**Business Rules:**
- يمكن التوثيق فقط في حالة: pending
- يتم نقل الكميات من store_pending_stock إلى store_actual_stock
- يتم تسجيل الدين في store_debt_ledger
- يتم حفظ الصورة في: storage/stamped_invoices/{invoice_number}/

---

### 4. رفض فاتورة
```http
PUT /api/warehouse/sales/{id}/reject
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "notes": "أسعار غير صحيحة"
}
```

**Validation Rules:**
- `notes`: required, string, max:1000

**Success Response (200):**
```json
{
  "message": "تم رفض الفاتورة بنجاح"
}
```

**Error Responses:**
- 404: الفاتورة غير موجودة أو تم معالجتها مسبقاً
- 422: ملاحظات مطلوبة

**Business Rules:**
- يمكن الرفض فقط في حالة: pending
- يتم إرجاع الكميات من store_pending_stock إلى marketer_actual_stock
- يتم تسجيل سبب الرفض في sales_invoice_rejections

---

### 5. عرض معلومات رفض الفاتورة
```http
GET /api/warehouse/sales/{id}/rejection
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "message": "معلومات الرفض",
  "data": {
    "sales_invoice_id": 10,
    "rejected_by": 2,
    "rejected_by_name": "أحمد المخزني",
    "rejection_reason": "أسعار غير صحيحة",
    "rejected_at": "2024-02-03 14:30:00"
  }
}
```

---

## 🟡 الإدارة (Admin)

### 1. عرض جميع فواتير البيع
```http
GET /api/admin/sales
Authorization: Bearer {token}
```

**Query Parameters (Filters):**
- `status`: pending, approved, rejected, cancelled
- `marketer_id`: رقم المسوق
- `store_id`: رقم المتجر
- `from_date`: YYYY-MM-DD
- `to_date`: YYYY-MM-DD

**Success Response (200):**
```json
{
  "message": "قائمة فواتير البيع",
  "data": [
    {
      "id": 1,
      "invoice_number": "SI-20240203-0001",
      "marketer_name": "محمد السالم",
      "store_name": "متجر الأمل",
      "total_amount": 4750,
      "status": "pending"
    }
  ]
}
```

---

### 2. عرض تفاصيل فاتورة
```http
GET /api/admin/sales/{id}
Authorization: Bearer {token}
```

---

### 3. عرض معلومات رفض الفاتورة
```http
GET /api/admin/sales/{id}/rejection
Authorization: Bearer {token}
```

---

## 📊 حالات الفاتورة (Status Flow)

```
pending → approved
   ↓         
cancelled  rejected
```

**الحالات:**
- `pending`: قيد الانتظار (بعد إنشاء الفاتورة)
- `approved`: موثقة (بعد توثيق أمين المخزن)
- `rejected`: مرفوضة (رفض من أمين المخزن)
- `cancelled`: ملغاة (إلغاء من المسوق)

---

## 🔄 تأثير العمليات على المخزون والديون

### إنشاء الفاتورة (pending):
- ✅ marketer_actual_stock: -(quantity + free_quantity)
- ✅ store_pending_stock: +(quantity + free_quantity)

### التوثيق (approved):
- ✅ store_pending_stock: -(quantity + free_quantity)
- ✅ store_actual_stock: +(quantity + free_quantity)
- ✅ store_debt_ledger: +total_amount (دين)

### الرفض (rejected):
- ✅ store_pending_stock: -(quantity + free_quantity)
- ✅ marketer_actual_stock: +(quantity + free_quantity)

### الإلغاء (cancelled):
- ✅ store_pending_stock: -(quantity + free_quantity)
- ✅ marketer_actual_stock: +(quantity + free_quantity)

---

## 📝 ملاحظات مهمة

1. **رقم الفاتورة:** `SI-YYYYMMDD-XXXX`
2. **العروض الترويجية:** تطبق تلقائياً عند إنشاء الفاتورة
3. **خصومات الفواتير:** تطبق تلقائياً حسب قيمة الفاتورة
4. **الكميات المجانية:** تخصم من مخزون المسوق
5. **الديون:** تسجل فقط عند التوثيق (approved)
6. **الصور:** storage/public/stamped_invoices/

---

**✅ جميع Endpoints موثقة بالتفصيل**
