# 🔄 إرجاع بضاعة من المسوق - Marketer Returns API

---

## 🔵 المسوق (Salesman)

### 1. إنشاء طلب إرجاع جديد
```http
POST /api/marketer/returns
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "items": [
    {
      "product_id": 1,
      "quantity": 10
    },
    {
      "product_id": 2,
      "quantity": 5
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
  "message": "تم إنشاء طلب الإرجاع بنجاح",
  "data": {
    "id": 8,
    "invoice_number": "MRR-20240203-0008"
  }
}
```

**Error Responses:**
- 400: الكمية المطلوبة غير متوفرة في مخزونك الفعلي
- 422: بيانات غير صحيحة
- 500: خطأ في الخادم

**Business Rules:**
- يتم التحقق من توفر الكميات في marketer_actual_stock
- لا يمكن إرجاع كمية أكبر من المتوفرة في المخزون الفعلي

---

### 2. عرض جميع طلبات الإرجاع
```http
GET /api/marketer/returns
Authorization: Bearer {token}
```

**Query Parameters (Filters):**
- `status`: pending, approved, documented, rejected, cancelled
- `from_date`: YYYY-MM-DD
- `to_date`: YYYY-MM-DD

**Examples:**
```http
GET /api/marketer/returns?status=pending
GET /api/marketer/returns?from_date=2024-01-01&to_date=2024-01-31
GET /api/marketer/returns?status=approved&from_date=2024-01-01
```

**Success Response (200):**
```json
{
  "message": "قائمة طلبات الإرجاع",
  "data": [
    {
      "id": 1,
      "invoice_number": "MRR-20240203-0001",
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
  ]
}
```

---

### 3. عرض تفاصيل طلب إرجاع محدد
```http
GET /api/marketer/returns/{id}
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "message": "تفاصيل طلب الإرجاع",
  "data": {
    "return": {
      "id": 5,
      "invoice_number": "MRR-20240203-0005",
      "marketer_id": 3,
      "status": "approved",
      "created_at": "2024-02-03 10:30:00",
      "approved_by": 2,
      "approved_at": "2024-02-03 11:00:00",
      "approver_name": "أحمد محمد",
      "documenter_name": null,
      "stamped_image": "http://domain.com/storage/stamped_return/MRR-20240203-0005/image.jpg"
    },
    "items": [
      {
        "id": 10,
        "return_request_id": 5,
        "product_id": 1,
        "product_name": "منتج 1",
        "quantity": 10,
        "current_price": 100
      }
    ]
  }
}
```

**Error Responses:**
- 404: طلب الإرجاع غير موجود

---

### 4. إلغاء طلب إرجاع
```http
PUT /api/marketer/returns/{id}/cancel
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
  "message": "تم إلغاء طلب الإرجاع بنجاح"
}
```

**Error Responses:**
- 404: طلب الإرجاع غير موجود أو لا يمكن إلغاؤه
- 500: خطأ في الخادم

**Business Rules:**
- يمكن الإلغاء فقط في حالة: pending, approved

---

## 🟢 أمين المخزن (Warehouse Keeper)

### 1. عرض جميع طلبات الإرجاع
```http
GET /api/warehouse/returns
Authorization: Bearer {token}
```

**Query Parameters (Filters):**
- `status`: pending, approved, documented, rejected, cancelled
- `marketer_id`: رقم المسوق
- `from_date`: YYYY-MM-DD
- `to_date`: YYYY-MM-DD

**Examples:**
```http
GET /api/warehouse/returns?status=pending
GET /api/warehouse/returns?marketer_id=3
GET /api/warehouse/returns?status=pending&marketer_id=3
GET /api/warehouse/returns?from_date=2024-01-01&to_date=2024-01-31
```

**Success Response (200):**
```json
{
  "message": "قائمة طلبات الإرجاع",
  "data": [
    {
      "id": 1,
      "invoice_number": "MRR-20240203-0001",
      "marketer_id": 3,
      "marketer_name": "محمد السالم",
      "status": "pending",
      "created_at": "2024-02-03 10:30:00"
    }
  ]
}
```

---

### 2. عرض تفاصيل طلب إرجاع محدد
```http
GET /api/warehouse/returns/{id}
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "message": "تفاصيل طلب الإرجاع",
  "data": {
    "return": {
      "id": 5,
      "invoice_number": "MRR-20240203-0005",
      "marketer_id": 3,
      "marketer_name": "محمد السالم",
      "status": "approved",
      "approver_name": "أحمد المخزني",
      "documenter_name": null,
      "rejecter_name": null,
      "stamped_image": "http://domain.com/storage/stamped_return/MRR-20240203-0005/image.jpg"
    },
    "items": [
      {
        "id": 10,
        "return_request_id": 5,
        "product_id": 1,
        "product_name": "منتج 1",
        "quantity": 10
      }
    ]
  }
}
```

---

### 3. الموافقة على طلب إرجاع
```http
PUT /api/warehouse/returns/{id}/approve
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "message": "تمت الموافقة على طلب الإرجاع بنجاح"
}
```

**Error Responses:**
- 404: طلب الإرجاع غير موجود أو تم معالجته مسبقاً
- 400: الكمية غير متوفرة في مخزون المسوق

**Business Rules:**
- يمكن الموافقة فقط في حالة: pending
- يتم التحقق من توفر الكميات في marketer_actual_stock

---

### 4. رفض طلب إرجاع
```http
PUT /api/warehouse/returns/{id}/reject
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "notes": "البضاعة تالفة"
}
```

**Validation Rules:**
- `notes`: required, string

**Success Response (200):**
```json
{
  "message": "تم رفض طلب الإرجاع"
}
```

**Error Responses:**
- 404: طلب الإرجاع غير موجود أو لا يمكن رفضه
- 422: ملاحظات مطلوبة

**Business Rules:**
- يمكن الرفض في حالة: pending, approved

---

### 5. توثيق استلام البضاعة المرجعة
```http
POST /api/warehouse/returns/{id}/document
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
  "message": "تم توثيق استلام البضاعة المرجعة بنجاح"
}
```

**Error Responses:**
- 404: طلب الإرجاع غير موجود أو غير موافق عليه
- 422: صورة مطلوبة / نوع الملف غير صحيح / حجم الملف كبير

**Business Rules:**
- يمكن التوثيق فقط في حالة: approved
- يتم خصم الكميات من marketer_actual_stock
- يتم إضافة الكميات إلى main_stock مباشرة
- يتم حفظ الصورة في: storage/stamped_return/{invoice_number}/
- يتم تسجيل العملية في warehouse_stock_logs

---

## 📊 حالات طلب الإرجاع (Status Flow)

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
- `cancelled`: ملغي (إلغاء من المسوق)

---

## 🔄 تأثير العمليات على المخزون

### إنشاء الطلب (pending):
- ❌ لا يتأثر المخزون

### الموافقة (approved):
- ❌ لا يتأثر المخزون (فقط تأكيد)

### التوثيق (documented):
- ✅ marketer_actual_stock: -quantity
- ✅ main_stock: +quantity

### الرفض (rejected):
- ❌ لا يتأثر المخزون

### الإلغاء (cancelled):
- ❌ لا يتأثر المخزون

---

## 📝 ملاحظات مهمة

1. **رقم الفاتورة:** يتم توليده تلقائياً بصيغة: `MRR-YYYYMMDD-XXXX`
2. **الصلاحيات:** المسوق يرى طلباته فقط، أمين المخزن يرى جميع الطلبات
3. **الفلترة:** جميع الفلاتر اختيارية
4. **الصور:** يتم حفظها في storage/public/stamped_return/
5. **Transactions:** جميع العمليات تستخدم Database Transactions
6. **الإرجاع المباشر:** البضاعة ترجع مباشرة إلى المخزن الرئيسي (لا يوجد مخزون محجوز)

---

**✅ جميع Endpoints موثقة بالتفصيل**
