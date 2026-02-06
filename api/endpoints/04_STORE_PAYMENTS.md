# 💵 إيصال القبض (تسديد دين المتجر) - Store Payments API

---

## 🔵 المسوق (Salesman)

### 1. إنشاء إيصال قبض جديد
```http
POST /api/marketer/payments
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "store_id": 1,
  "amount": 5000,
  "payment_method": "cash",
  "notes": "ملاحظات اختيارية"
}
```

**Validation Rules:**
- `store_id`: required, exists:stores,id
- `amount`: required, numeric, min:0.01
- `payment_method`: required, in:cash,transfer,certified_check
- `notes`: nullable, string

**Success Response (201):**
```json
{
  "message": "تم إنشاء إيصال القبض بنجاح",
  "data": {
    "id": 12,
    "payment_number": "PAY-20240203-0012"
  }
}
```

**Error Responses:**
- 400: المبلغ المسدد أكبر من الدين الحالي
- 400: لا يوجد دين على هذا المتجر
- 400: المتجر غير نشط أو غير موجود

**Business Rules:**
- يتم التحقق من وجود دين على المتجر
- لا يمكن تسديد مبلغ أكبر من الدين الحالي

---

### 2. عرض جميع إيصالات القبض
```http
GET /api/marketer/payments
Authorization: Bearer {token}
```

**Query Parameters (Filters):**
- `status`: pending, approved, rejected, cancelled
- `store_id`: رقم المتجر
- `payment_method`: cash, transfer, certified_check
- `from_date`: YYYY-MM-DD
- `to_date`: YYYY-MM-DD
- `page`: رقم الصفحة (اختياري، افتراضي: 1)

**Examples:**
```http
GET /api/marketer/payments?status=pending
GET /api/marketer/payments?status=pending&page=2
GET /api/marketer/payments?store_id=5&page=1
GET /api/marketer/payments?payment_method=cash
GET /api/marketer/payments?status=pending&store_id=5&payment_method=cash
```

**Success Response (200):**
```json
{
  "message": "قائمة إيصالات القبض",
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 1,
        "payment_number": "PAY-20240203-0001",
        "store_id": 1,
        "store_name": "متجر الأمل",
        "marketer_id": 3,
        "amount": 5000,
        "payment_method": "cash",
        "status": "pending",
        "created_at": "2024-02-03 10:30:00"
      }
    ],
    "first_page_url": "http://domain.com/api/marketer/payments?page=1",
    "from": 1,
    "last_page": 5,
    "last_page_url": "http://domain.com/api/marketer/payments?page=5",
    "next_page_url": "http://domain.com/api/marketer/payments?page=2",
    "path": "http://domain.com/api/marketer/payments",
    "per_page": 20,
    "prev_page_url": null,
    "to": 20,
    "total": 95
  }
}
```

---

### 3. عرض تفاصيل إيصال قبض
```http
GET /api/marketer/payments/{id}
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "message": "تفاصيل إيصال القبض",
  "data": {
    "payment": {
      "id": 12,
      "payment_number": "PAY-20240203-0012",
      "store_id": 1,
      "store_name": "متجر الأمل",
      "marketer_id": 3,
      "keeper_id": 2,
      "keeper_name": "أحمد المخزني",
      "amount": 5000,
      "payment_method": "cash",
      "status": "approved",
      "receipt_image": "http://domain.com/storage/receipts/PAY-20240203-0012/image.jpg",
      "confirmed_at": "2024-02-03 11:00:00",
      "notes": "ملاحظات"
    },
    "commission": {
      "id": 5,
      "marketer_id": 3,
      "payment_id": 12,
      "payment_amount": 5000,
      "commission_rate": 5,
      "commission_amount": 250,
      "created_at": "2024-02-03 11:00:00"
    }
  }
}
```

---

### 4. إلغاء إيصال قبض
```http
PUT /api/marketer/payments/{id}/cancel
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "notes": "سبب الإلغاء"
}
```

**Success Response (200):**
```json
{
  "message": "تم إلغاء إيصال القبض بنجاح"
}
```

**Business Rules:**
- يمكن الإلغاء فقط في حالة: pending

---

## 🟢 أمين المخزن (Warehouse Keeper)

### 1. عرض جميع إيصالات القبض
```http
GET /api/warehouse/payments
Authorization: Bearer {token}
```

**Query Parameters (Filters):**
- `status`: pending, approved, rejected, cancelled
- `marketer_id`: رقم المسوق
- `store_id`: رقم المتجر
- `payment_method`: cash, transfer, certified_check
- `from_date`: YYYY-MM-DD
- `to_date`: YYYY-MM-DD
- `page`: رقم الصفحة (اختياري، افتراضي: 1)

**Success Response (200):**
```json
{
  "message": "قائمة إيصالات القبض",
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 1,
        "payment_number": "PAY-20240203-0001",
        "store_name": "متجر الأمل",
        "marketer_name": "محمد السالم",
        "keeper_name": "أحمد المخزني",
        "amount": 5000,
        "payment_method": "cash",
        "status": "pending"
      }
    ],
    "first_page_url": "http://domain.com/api/warehouse/payments?page=1",
    "from": 1,
    "last_page": 5,
    "last_page_url": "http://domain.com/api/warehouse/payments?page=5",
    "next_page_url": "http://domain.com/api/warehouse/payments?page=2",
    "path": "http://domain.com/api/warehouse/payments",
    "per_page": 20,
    "prev_page_url": null,
    "to": 20,
    "total": 95
  }
}
```

---

### 2. الموافقة والتوثيق
```http
POST /api/warehouse/payments/{id}/approve
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Request Body:**
```
receipt_image: [file]
```

**Validation Rules:**
- `receipt_image`: required, image, max:10240 (10MB)

**Success Response (200):**
```json
{
  "message": "تم توثيق إيصال القبض بنجاح"
}
```

**Business Rules:**
- يمكن التوثيق فقط في حالة: pending
- يتم تسجيل تقليل الدين في store_debt_ledger (مبلغ سالب)
- يتم حساب وتسجيل عمولة المسوق في marketer_commissions
- العمولة = amount × (commission_rate / 100)

---

### 3. رفض إيصال قبض
```http
PUT /api/warehouse/payments/{id}/reject
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "notes": "سبب الرفض"
}
```

**Success Response (200):**
```json
{
  "message": "تم رفض إيصال القبض بنجاح"
}
```

---

## 📊 حالات الإيصال (Status Flow)

```
pending → approved
   ↓         
cancelled  rejected
```

---

## 🔄 تأثير العمليات على الديون والعمولات

### إنشاء الإيصال (pending):
- ❌ لا يتأثر الدين أو العمولات

### التوثيق (approved):
- ✅ store_debt_ledger: -amount (تقليل الدين)
- ✅ marketer_commissions: +commission_amount

### الرفض (rejected):
- ❌ لا يتأثر الدين أو العمولات

### الإلغاء (cancelled):
- ❌ لا يتأثر الدين أو العمولات

---

## 📝 ملاحظات مهمة

1. **رقم الإيصال:** `PAY-YYYYMMDD-XXXX`
2. **طرق الدفع:** cash (نقدي), transfer (تحويل), certified_check (شيك مصدق)
3. **العمولات:** تسجل فقط عند التوثيق
4. **الصور:** storage/public/receipts/

---

**✅ جميع Endpoints موثقة بالتفصيل**
