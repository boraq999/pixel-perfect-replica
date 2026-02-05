# 🎁 العروض الترويجية وخصومات الفواتير - Promotions & Discounts API

---

## 🟡 الإدارة (Admin) - العروض الترويجية

### 1. عرض جميع العروض
```http
GET /api/admin/promotions
Authorization: Bearer {token}
```

**Query Parameters (Filters):**
- `is_active`: 0, 1
- `product_id`: رقم المنتج
- `from_date`: YYYY-MM-DD
- `to_date`: YYYY-MM-DD

**Examples:**
```http
GET /api/admin/promotions?is_active=1
GET /api/admin/promotions?product_id=5
GET /api/admin/promotions?is_active=1&product_id=5
```

**Success Response (200):**
```json
{
  "message": "قائمة العروض الترويجية",
  "data": [
    {
      "id": 1,
      "product_id": 1,
      "product_name": "منتج 1",
      "min_quantity": 10,
      "free_quantity": 2,
      "start_date": "2024-01-01",
      "end_date": "2024-12-31",
      "is_active": true,
      "created_by": 1,
      "creator_name": "المدير العام",
      "created_at": "2024-01-01 10:00:00"
    }
  ]
}
```

---

### 2. إنشاء عرض جديد
```http
POST /api/admin/promotions
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "product_id": 1,
  "min_quantity": 10,
  "free_quantity": 2,
  "start_date": "2024-01-01",
  "end_date": "2024-12-31"
}
```

**Validation Rules:**
- `product_id`: required, exists:products,id
- `min_quantity`: required, integer, min:1
- `free_quantity`: required, integer, min:1
- `start_date`: required, date
- `end_date`: required, date, after_or_equal:start_date

**Success Response (201):**
```json
{
  "message": "تم إنشاء العرض الترويجي بنجاح",
  "data": {
    "id": 8,
    "product_id": 1,
    "min_quantity": 10,
    "free_quantity": 2,
    "is_active": true
  }
}
```

**Business Rules:**
- العرض يكون نشط تلقائياً عند الإنشاء
- يتم تطبيق العرض تلقائياً عند إنشاء فواتير البيع

---

### 3. عرض تفاصيل عرض
```http
GET /api/admin/promotions/{id}
Authorization: Bearer {token}
```

---

### 4. تفعيل/تعطيل عرض
```http
PUT /api/admin/promotions/{id}/toggle
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "message": "تم تفعيل العرض الترويجي",
  "data": {
    "id": 8,
    "is_active": true
  }
}
```

---

### 5. حذف عرض (soft delete)
```http
DELETE /api/admin/promotions/{id}
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "message": "تم تعطيل العرض الترويجي نهائياً"
}
```

**Business Rules:**
- الحذف يعني تعطيل العرض (is_active = false)

---

## 🔵 المسوق (Salesman) - العروض النشطة

### عرض العروض النشطة فقط
```http
GET /api/marketer/promotions/active
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "message": "العروض النشطة",
  "data": [
    {
      "id": 1,
      "product_id": 1,
      "product_name": "منتج 1",
      "min_quantity": 10,
      "free_quantity": 2,
      "start_date": "2024-01-01",
      "end_date": "2024-12-31"
    }
  ]
}
```

**Business Rules:**
- يعرض فقط العروض النشطة (is_active = true)
- يعرض فقط العروض ضمن الفترة الزمنية الحالية

---

## 🟡 الإدارة (Admin) - خصومات الفواتير

### 1. عرض جميع الخصومات
```http
GET /api/admin/discounts
Authorization: Bearer {token}
```

**Query Parameters (Filters):**
- `is_active`: 0, 1
- `discount_type`: percentage, fixed
- `from_date`: YYYY-MM-DD
- `to_date`: YYYY-MM-DD

**Examples:**
```http
GET /api/admin/discounts?is_active=1
GET /api/admin/discounts?discount_type=percentage
GET /api/admin/discounts?is_active=1&discount_type=percentage
```

**Success Response (200):**
```json
{
  "message": "قائمة قواعد الخصم",
  "data": [
    {
      "id": 1,
      "min_amount": 1000,
      "discount_type": "percentage",
      "discount_percentage": 5,
      "discount_amount": null,
      "start_date": "2024-01-01",
      "end_date": "2024-12-31",
      "is_active": true,
      "created_by": 1,
      "creator_name": "المدير العام"
    }
  ]
}
```

---

### 2. إنشاء خصم جديد
```http
POST /api/admin/discounts
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body (نسبة مئوية):**
```json
{
  "min_amount": 1000,
  "discount_type": "percentage",
  "discount_percentage": 5,
  "start_date": "2024-01-01",
  "end_date": "2024-12-31"
}
```

**Request Body (مبلغ ثابت):**
```json
{
  "min_amount": 5000,
  "discount_type": "fixed",
  "discount_amount": 200,
  "start_date": "2024-01-01",
  "end_date": "2024-12-31"
}
```

**Validation Rules:**
- `min_amount`: required, numeric, min:0
- `discount_type`: required, in:percentage,fixed
- `discount_percentage`: required_if:discount_type,percentage, nullable, numeric, min:0, max:100
- `discount_amount`: required_if:discount_type,fixed, nullable, numeric, min:0
- `start_date`: required, date
- `end_date`: required, date, after_or_equal:start_date

**Success Response (201):**
```json
{
  "message": "تم إنشاء قاعدة الخصم بنجاح",
  "data": {
    "id": 5,
    "min_amount": 1000,
    "discount_type": "percentage",
    "discount_percentage": 5,
    "is_active": true
  }
}
```

---

### 3. تفعيل/تعطيل خصم
```http
PUT /api/admin/discounts/{id}/toggle
Authorization: Bearer {token}
```

---

### 4. حذف خصم (soft delete)
```http
DELETE /api/admin/discounts/{id}
Authorization: Bearer {token}
```

---

## 🔵 المسوق (Salesman) - الخصومات النشطة

### عرض الخصومات النشطة فقط
```http
GET /api/marketer/discounts/active
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "message": "الخصومات النشطة",
  "data": [
    {
      "id": 1,
      "min_amount": 1000,
      "discount_type": "percentage",
      "discount_percentage": 5,
      "start_date": "2024-01-01",
      "end_date": "2024-12-31"
    }
  ]
}
```

---

## 🌐 الجميع (Authenticated) - الخصومات النشطة

### عرض الخصومات النشطة
```http
GET /api/discounts/active
Authorization: Bearer {token}
```

---

## 📊 كيفية تطبيق العروض والخصومات

### العروض الترويجية:
```
إذا كان quantity >= min_quantity:
  times = floor(quantity / min_quantity)
  free_quantity = times × free_quantity
  product_discount = free_quantity × unit_price
```

**مثال:**
- العرض: اشتري 10 واحصل على 2 مجاناً
- الطلب: 25 قطعة
- الحساب: floor(25 / 10) = 2
- المجاني: 2 × 2 = 4 قطع
- الإجمالي: 25 + 4 = 29 قطعة

---

### خصومات الفواتير:
```
يتم اختيار أكبر قاعدة خصم حيث subtotal >= min_amount

إذا كان discount_type = percentage:
  invoice_discount_amount = subtotal × (discount_percentage / 100)

إذا كان discount_type = fixed:
  invoice_discount_amount = discount_amount
```

**مثال:**
- القواعد: 1000 ← 5%, 5000 ← 10%
- الفاتورة: 6000
- الخصم المطبق: 10% (لأن 6000 >= 5000)
- قيمة الخصم: 6000 × 0.10 = 600

---

## 📝 ملاحظات مهمة

1. **التطبيق التلقائي:** العروض والخصومات تطبق تلقائياً عند إنشاء فواتير البيع
2. **الأولوية:** يتم اختيار أكبر قاعدة خصم متاحة
3. **الفترة الزمنية:** يتم التحقق من التواريخ عند التطبيق
4. **الحالة النشطة:** فقط العروض/الخصومات النشطة يتم تطبيقها
5. **عدم التعديل:** لا يمكن تعديل العروض/الخصومات بعد الإنشاء (فقط تفعيل/تعطيل)

---

**✅ جميع Endpoints موثقة بالتفصيل**
