# 📦 طلبات البضاعة من المسوق - Marketer Requests API

---

## 🔵 المسوق (Salesman)

### 1. إنشاء طلب جديد
```http
POST /api/marketer/requests
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "items": [
    {
      "product_id": 1,
      "quantity": 50
    },
    {
      "product_id": 2,
      "quantity": 30
    }
  ]
}
```

**Validation Rules:**
- `items`: required, array, min:1
- `items.*.product_id`: required, exists:products,id
- `items.*.quantity`: required, integer, min:1

**Success Response (201):**
```json
{
  "message": "تم إنشاء الطلب بنجاح",
  "data": {
    "id": 15,
    "invoice_number": "MR-20240203-0015"
  }
}
```

**Error Responses:**
- 401: غير مصرح
- 403: ليس لديك صلاحية
- 422: بيانات غير صحيحة
- 500: خطأ في الخادم

---

### 2. عرض جميع الطلبات
```http
GET /api/marketer/requests
Authorization: Bearer {token}
```

**Query Parameters (Filters):**
- `status`: pending, approved, documented, rejected, cancelled
- `from_date`: YYYY-MM-DD
- `to_date`: YYYY-MM-DD
- `page`: رقم الصفحة (اختياري، افتراضي: 1)

**Examples:**
```http
GET /api/marketer/requests?status=pending
GET /api/marketer/requests?status=pending&page=2
GET /api/marketer/requests?from_date=2024-01-01&to_date=2024-01-31&page=1
GET /api/marketer/requests?status=approved&from_date=2024-01-01
```

**Success Response (200):**
```json
{
  "message": "قائمة طلبات المسوق",
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 1,
        "invoice_number": "MR-20240203-0001",
        "marketer_id": 3,
        "status": "pending",
        "created_at": "2024-02-03 10:30:00",
        "updated_at": "2024-02-03 10:30:00",
        "approved_by": null,
        "approved_at": null,
        "documented_by": null,
        "documented_at": null,
        "rejected_by": null,
        "rejected_at": null,
        "stamped_image": null,
        "notes": null
      }
    ],
    "first_page_url": "http://domain.com/api/marketer/requests?page=1",
    "from": 1,
    "last_page": 5,
    "last_page_url": "http://domain.com/api/marketer/requests?page=5",
    "next_page_url": "http://domain.com/api/marketer/requests?page=2",
    "path": "http://domain.com/api/marketer/requests",
    "per_page": 20,
    "prev_page_url": null,
    "to": 20,
    "total": 95
  }
}
```

---

### 3. عرض تفاصيل طلب محدد
```http
GET /api/marketer/requests/{id}
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "message": "تفاصيل الطلب",
  "data": {
    "request": {
      "id": 5,
      "invoice_number": "MR-20240203-0005",
      "marketer_id": 3,
      "status": "approved",
      "created_at": "2024-02-03 10:30:00",
      "approved_by": 2,
      "approved_at": "2024-02-03 11:00:00",
      "approver_name": "أحمد محمد",
      "documenter_name": null,
      "stamped_image": "http://domain.com/storage/stamed_request/MR-20240203-0005/image.jpg"
    },
    "items": [
      {
        "id": 10,
        "request_id": 5,
        "product_id": 1,
        "product_name": "منتج 1",
        "quantity": 50,
        "current_price": 100
      }
    ]
  }
}
```

**Error Responses:**
- 404: الطلب غير موجود
- 403: ليس لديك صلاحية الوصول لهذا الطلب

---

### 4. إلغاء طلب
```http
PUT /api/marketer/requests/{id}/cancel
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "notes": "تغيير في الخطة"
}
```

**Validation Rules:**
- `notes`: nullable, string

**Success Response (200):**
```json
{
  "message": "تم إلغاء الطلب بنجاح"
}
```

**Error Responses:**
- 404: الطلب غير موجود
- 403: ليس لديك صلاحية إلغاء هذا الطلب
- 400: لا يمكن إلغاء طلب موثق أو مرفوض

**Business Rules:**
- يمكن الإلغاء فقط في حالة: pending, approved
- إذا كان الطلب approved، يتم إرجاع الكميات من المخزون المحجوز إلى المخزون الرئيسي

---

## 🟢 أمين المخزن (Warehouse Keeper)

### 1. عرض جميع طلبات المسوقين
```http
GET /api/warehouse/requests
Authorization: Bearer {token}
```

**Query Parameters (Filters):**
- `status`: pending, approved, documented, rejected, cancelled
- `marketer_id`: رقم المسوق
- `from_date`: YYYY-MM-DD
- `to_date`: YYYY-MM-DD
- `page`: رقم الصفحة (اختياري، افتراضي: 1)

**Examples:**
```http
GET /api/warehouse/requests?status=pending
GET /api/warehouse/requests?status=pending&page=2
GET /api/warehouse/requests?marketer_id=3&page=1
GET /api/warehouse/requests?status=pending&marketer_id=3
GET /api/warehouse/requests?from_date=2024-01-01&to_date=2024-01-31
```

**Success Response (200):**
```json
{
  "message": "قائمة طلبات المسوقين",
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 1,
        "invoice_number": "MR-20240203-0001",
        "marketer_id": 3,
        "marketer_name": "محمد السالم",
        "status": "pending",
        "created_at": "2024-02-03 10:30:00"
      }
    ],
    "first_page_url": "http://domain.com/api/warehouse/requests?page=1",
    "from": 1,
    "last_page": 5,
    "last_page_url": "http://domain.com/api/warehouse/requests?page=5",
    "next_page_url": "http://domain.com/api/warehouse/requests?page=2",
    "path": "http://domain.com/api/warehouse/requests",
    "per_page": 20,
    "prev_page_url": null,
    "to": 20,
    "total": 95
  }
}
```

---

### 2. عرض تفاصيل طلب محدد
```http
GET /api/warehouse/requests/{id}
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "message": "تفاصيل الطلب",
  "data": {
    "request": {
      "id": 5,
      "invoice_number": "MR-20240203-0005",
      "marketer_id": 3,
      "marketer_name": "محمد السالم",
      "status": "approved",
      "approver_name": "أحمد المخزني",
      "documenter_name": null,
      "rejecter_name": null,
      "stamped_image": "http://domain.com/storage/stamed_request/MR-20240203-0005/image.jpg"
    },
    "items": [
      {
        "id": 10,
        "request_id": 5,
        "product_id": 1,
        "product_name": "منتج 1",
        "quantity": 50
      }
    ]
  }
}
```

---

### 3. الموافقة على طلب
```http
PUT /api/warehouse/requests/{id}/approve
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "message": "تمت الموافقة على الطلب بنجاح"
}
```

**Error Responses:**
- 404: الطلب غير موجود أو تم معالجته مسبقاً
- 400: المخزون غير كافٍ

**Business Rules:**
- يمكن الموافقة فقط في حالة: pending
- يتم خصم الكميات من المخزون الرئيسي
- يتم إضافة الكميات إلى المخزون المحجوز للمسوق
- يتم تسجيل العملية في warehouse_stock_logs

---

### 4. رفض طلب
```http
PUT /api/warehouse/requests/{id}/reject
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "notes": "المخزون غير متوفر حالياً"
}
```

**Validation Rules:**
- `notes`: required, string

**Success Response (200):**
```json
{
  "message": "تم رفض الطلب"
}
```

**Error Responses:**
- 404: الطلب غير موجود أو لا يمكن رفضه
- 422: ملاحظات مطلوبة

**Business Rules:**
- يمكن الرفض في حالة: pending, approved
- إذا كان الطلب approved، يتم إرجاع الكميات من المخزون المحجوز إلى المخزون الرئيسي

---

### 5. توثيق استلام البضاعة
```http
POST /api/warehouse/requests/{id}/document
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Request Body:**
```
stamped_image: [file]
```

**Validation Rules:**
- `stamped_image`: required, image, max:10240 (10MB)

**Success Response (200):**
```json
{
  "message": "تم توثيق استلام البضاعة بنجاح"
}
```

**Error Responses:**
- 404: الطلب غير موجود أو غير موافق عليه
- 422: صورة مطلوبة / نوع الملف غير صحيح / حجم الملف كبير

**Business Rules:**
- يمكن التوثيق فقط في حالة: approved
- يتم نقل الكميات من المخزون المحجوز إلى المخزون الفعلي للمسوق
- يتم حفظ الصورة في: storage/stamed_request/{invoice_number}/
- يتم تسجيل العملية في warehouse_stock_logs

---

### 6. إلغاء طلب (من المخزن)
```http
PUT /api/warehouse/requests/{id}/cancel
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "notes": "سبب الإلغاء"
}
```

**Validation Rules:**
- `notes`: required, string

**Success Response (200):**
```json
{
  "message": "تم إلغاء الطلب بنجاح"
}
```

**Business Rules:**
- يمكن الإلغاء في حالة: pending, approved
- إذا كان الطلب approved، يتم إرجاع الكميات من المخزون المحجوز إلى المخزون الرئيسي

---

## 📊 حالات الطلب (Status Flow)

```
pending → approved → documented
   ↓         ↓
cancelled  rejected
```

**الحالات:**
- `pending`: قيد الانتظار (بعد إنشاء الطلب)
- `approved`: موافق عليه (بعد موافقة أمين المخزن)
- `documented`: موثق (بعد توثيق الاستلام)
- `rejected`: مرفوض (رفض من أمين المخزن)
- `cancelled`: ملغي (إلغاء من المسوق أو أمين المخزن)

---

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

---

## 📝 ملاحظات مهمة

1. **رقم الفاتورة:** يتم توليده تلقائياً بصيغة: `MR-YYYYMMDD-XXXX`
2. **الصلاحيات:** المسوق يرى طلباته فقط، أمين المخزن يرى جميع الطلبات
3. **الفلترة:** جميع الفلاتر اختيارية
4. **الصور:** يتم حفظها في storage/public/stamed_request/
5. **Transactions:** جميع العمليات تستخدم Database Transactions

---

**✅ جميع Endpoints موثقة بالتفصيل**
