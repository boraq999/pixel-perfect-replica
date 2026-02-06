# 🔙 إرجاع بضاعة من المتجر - Store Returns API

---

## 🔵 المسوق (Salesman)

### 1. إنشاء طلب إرجاع من متجر
```http
POST /api/marketer/store-returns
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "sales_invoice_id": 25,
  "store_id": 1,
  "items": [
    {
      "sales_invoice_item_id": 50,
      "product_id": 1,
      "quantity": 5
    },
    {
      "sales_invoice_item_id": 51,
      "product_id": 2,
      "quantity": 3
    }
  ]
}
```

**Validation Rules:**
- `sales_invoice_id`: required, exists:sales_invoices,id
- `items`: required, array, min:1
- `items.*.sales_invoice_item_id`: required, exists:sales_invoice_items,id
- `items.*.product_id`: required, exists:products,id
- `items.*.quantity`: required, integer, min:1

**Success Response (201):**
```json
{
  "message": "تم إنشاء طلب الإرجاع بنجاح",
  "data": {
    "id": 15,
    "return_number": "RET-20240203-0015",
    "sales_invoice_id": 25,
    "store_id": 1,
    "marketer_id": 3,
    "total_amount": 800,
    "status": "pending"
  }
}
```

**Error Responses:**
- 400: الكمية المرجعة أكبر من الكمية المباعة في الفاتورة
- 400: لا يمكن إرجاع بضاعة من فاتورة غير موثقة
- 404: الفاتورة المحددة غير موجودة
- 403: هذه الفاتورة لا تخصك

**Business Rules:**
- يمكن الإرجاع فقط من فواتير موثقة (approved)
- لا يمكن إرجاع كمية أكبر من المباعة
- يتم خصم الكميات من store_actual_stock
- يتم نقل الكميات إلى store_return_pending_stock
- يتم حساب total_amount = sum(quantity × unit_price)

---

### 2. عرض جميع إرجاعات المتاجر
```http
GET /api/marketer/store-returns
Authorization: Bearer {token}
```

**Query Parameters (Filters):**
- `status`: pending, approved, rejected, cancelled
- `store_id`: رقم المتجر
- `from_date`: YYYY-MM-DD
- `to_date`: YYYY-MM-DD
- `page`: رقم الصفحة (اختياري، افتراضي: 1)

**Examples:**
```http
GET /api/marketer/store-returns?status=pending
GET /api/marketer/store-returns?status=pending&page=2
GET /api/marketer/store-returns?store_id=5&page=1
GET /api/marketer/store-returns?status=pending&store_id=5
```

**Success Response (200):**
```json
{
  "message": "قائمة طلبات الإرجاع",
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 1,
        "return_number": "RET-20240203-0001",
        "sales_invoice_id": 25,
        "sales_invoice_number": "SI-20240203-0025",
        "store_id": 1,
        "store_name": "متجر الأمل",
        "marketer_id": 3,
        "total_amount": 800,
        "status": "pending",
        "created_at": "2024-02-03 10:30:00"
      }
    ],
    "first_page_url": "http://domain.com/api/marketer/store-returns?page=1",
    "from": 1,
    "last_page": 5,
    "last_page_url": "http://domain.com/api/marketer/store-returns?page=5",
    "next_page_url": "http://domain.com/api/marketer/store-returns?page=2",
    "path": "http://domain.com/api/marketer/store-returns",
    "per_page": 20,
    "prev_page_url": null,
    "to": 20,
    "total": 95
  }
}
```

---

### 3. عرض تفاصيل إرجاع
```http
GET /api/marketer/store-returns/{id}
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "message": "تفاصيل طلب الإرجاع",
  "data": {
    "id": 15,
    "return_number": "RET-20240203-0015",
    "sales_invoice_id": 25,
    "sales_invoice_number": "SI-20240203-0025",
    "store_id": 1,
    "store_name": "متجر الأمل",
    "marketer_id": 3,
    "keeper_id": 2,
    "keeper_name": "أحمد المخزني",
    "total_amount": 800,
    "status": "approved",
    "stamped_image": "http://domain.com/storage/stamped_return/image.jpg",
    "confirmed_at": "2024-02-03 11:00:00",
    "items": [
      {
        "id": 30,
        "return_id": 15,
        "sales_invoice_item_id": 50,
        "product_id": 1,
        "product_name": "منتج 1",
        "quantity": 5,
        "unit_price": 100
      }
    ]
  }
}
```

---

### 4. إلغاء إرجاع
```http
PUT /api/marketer/store-returns/{id}/cancel
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
  "message": "تم إلغاء طلب الإرجاع بنجاح"
}
```

**Business Rules:**
- يمكن الإلغاء فقط في حالة: pending
- يتم إرجاع الكميات من store_return_pending_stock إلى store_actual_stock

---

## 🟢 أمين المخزن (Warehouse Keeper)

### 1. عرض جميع إرجاعات المتاجر
```http
GET /api/warehouse/store-returns
Authorization: Bearer {token}
```

**Query Parameters (Filters):**
- `status`: pending, approved, rejected, cancelled
- `marketer_id`: رقم المسوق
- `store_id`: رقم المتجر
- `from_date`: YYYY-MM-DD
- `to_date`: YYYY-MM-DD
- `page`: رقم الصفحة (اختياري، افتراضي: 1)

**Examples:**
```http
GET /api/warehouse/store-returns?status=pending
GET /api/warehouse/store-returns?status=pending&page=2
GET /api/warehouse/store-returns?marketer_id=3&page=1
GET /api/warehouse/store-returns?store_id=5
GET /api/warehouse/store-returns?marketer_id=3&store_id=5
```

**Success Response (200):**
```json
{
  "message": "قائمة طلبات الإرجاع",
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 1,
        "return_number": "RET-20240203-0001",
        "store_name": "متجر الأمل",
        "marketer_name": "محمد السالم",
        "sales_invoice_number": "SI-20240203-0025",
        "total_amount": 800,
        "status": "pending"
      }
    ],
    "first_page_url": "http://domain.com/api/warehouse/store-returns?page=1",
    "from": 1,
    "last_page": 5,
    "last_page_url": "http://domain.com/api/warehouse/store-returns?page=5",
    "next_page_url": "http://domain.com/api/warehouse/store-returns?page=2",
    "path": "http://domain.com/api/warehouse/store-returns",
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
POST /api/warehouse/store-returns/{id}/approve
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Request Body:**
```
stamped_image: [file]
```

**Validation Rules:**
- `stamped_image`: required, image, mimes:jpeg,png,jpg, max:2048

**Success Response (200):**
```json
{
  "message": "تم توثيق طلب الإرجاع بنجاح",
  "data": {
    "id": 15,
    "status": "approved"
  }
}
```

**Business Rules:**
- يمكن التوثيق فقط في حالة: pending
- يتم نقل الكميات من store_return_pending_stock إلى marketer_actual_stock
- يتم تقليل الدين في store_debt_ledger (مبلغ سالب)
- **ملاحظة:** العمولات لا تتأثر بالإرجاع

---

### 3. رفض إرجاع
```http
PUT /api/warehouse/store-returns/{id}/reject
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "notes": "البضاعة تالفة"
}
```

**Success Response (200):**
```json
{
  "message": "تم رفض طلب الإرجاع",
  "data": {
    "id": 15,
    "status": "rejected"
  }
}
```

**Business Rules:**
- يمكن الرفض فقط في حالة: pending
- يتم إرجاع الكميات من store_return_pending_stock إلى store_actual_stock

---

## 📊 حالات طلب الإرجاع (Status Flow)

```
pending → approved
   ↓         
cancelled  rejected
```

---

## 🔄 تأثير العمليات على المخزون والديون

### إنشاء الطلب (pending):
- ✅ store_actual_stock: -quantity
- ✅ store_return_pending_stock: +quantity

### التوثيق (approved):
- ✅ store_return_pending_stock: -quantity
- ✅ marketer_actual_stock: +quantity
- ✅ store_debt_ledger: -total_amount (تقليل الدين)
- ❌ العمولات لا تتأثر

### الرفض (rejected):
- ✅ store_return_pending_stock: -quantity
- ✅ store_actual_stock: +quantity

### الإلغاء (cancelled):
- ✅ store_return_pending_stock: -quantity
- ✅ store_actual_stock: +quantity

---

## 📝 ملاحظات مهمة

1. **رقم الإرجاع:** `RET-YYYYMMDD-XXXX`
2. **الإرجاع من فواتير موثقة فقط**
3. **العمولات لا تتأثر:** العمولة تبقى للمسوق حتى لو تم الإرجاع
4. **تقليل الدين:** يتم تقليل دين المتجر عند التوثيق
5. **الصور:** storage/public/stamped_return/

---

**✅ جميع Endpoints موثقة بالتفصيل**
