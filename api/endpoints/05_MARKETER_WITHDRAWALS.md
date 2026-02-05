# 💸 سحب أرباح المسوق - Marketer Withdrawals API

---

## 🔵 المسوق (Salesman)

### 1. عرض الرصيد المتاح
```http
GET /api/marketer/withdrawals/balance
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "message": "رصيد العمولات",
  "data": {
    "total_commissions": 15000,
    "total_withdrawals": 8000,
    "available_balance": 7000
  }
}
```

**الحساب:**
```
available_balance = total_commissions - total_withdrawals
```

---

### 2. إنشاء طلب سحب جديد
```http
POST /api/marketer/withdrawals
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "requested_amount": 5000
}
```

**Validation Rules:**
- `requested_amount`: required, numeric, min:0.01

**Success Response (201):**
```json
{
  "message": "تم إنشاء طلب السحب بنجاح",
  "data": {
    "id": 7,
    "marketer_id": 3,
    "requested_amount": 5000,
    "status": "pending",
    "created_at": "2024-02-03 10:30:00"
  }
}
```

**Error Responses:**
- 400: المبلغ المطلوب أكبر من الرصيد المتاح

**Business Rules:**
- يتم التحقق من الرصيد المتاح قبل الإنشاء
- لا يمكن سحب مبلغ أكبر من الرصيد المتاح

---

### 3. عرض جميع طلبات السحب
```http
GET /api/marketer/withdrawals
Authorization: Bearer {token}
```

**Query Parameters (Filters):**
- `status`: pending, approved, rejected, cancelled
- `from_date`: YYYY-MM-DD
- `to_date`: YYYY-MM-DD

**Examples:**
```http
GET /api/marketer/withdrawals?status=pending
GET /api/marketer/withdrawals?from_date=2024-01-01&to_date=2024-01-31
```

**Success Response (200):**
```json
{
  "message": "قائمة طلبات السحب",
  "data": [
    {
      "id": 1,
      "marketer_id": 3,
      "requested_amount": 5000,
      "status": "pending",
      "approved_by": null,
      "approved_at": null,
      "rejected_by": null,
      "rejected_at": null,
      "signed_receipt_image": null,
      "notes": null,
      "created_at": "2024-02-03 10:30:00"
    }
  ]
}
```

---

### 4. عرض تفاصيل طلب سحب
```http
GET /api/marketer/withdrawals/{id}
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "message": "تفاصيل طلب السحب",
  "data": {
    "id": 7,
    "marketer_id": 3,
    "requested_amount": 5000,
    "status": "approved",
    "approved_by": 1,
    "approved_by_name": "المدير العام",
    "approved_at": "2024-02-03 11:00:00",
    "signed_receipt_image": "http://domain.com/storage/receipts/image.jpg",
    "notes": null,
    "created_at": "2024-02-03 10:30:00"
  }
}
```

---

### 5. إلغاء طلب سحب
```http
PUT /api/marketer/withdrawals/{id}/cancel
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
  "message": "تم إلغاء طلب السحب بنجاح"
}
```

**Business Rules:**
- يمكن الإلغاء فقط في حالة: pending

---

## 🟡 الإدارة (Admin)

### 1. عرض جميع طلبات السحب
```http
GET /api/admin/withdrawals
Authorization: Bearer {token}
```

**Query Parameters (Filters):**
- `status`: pending, approved, rejected, cancelled
- `marketer_id`: رقم المسوق

**Examples:**
```http
GET /api/admin/withdrawals?status=pending
GET /api/admin/withdrawals?marketer_id=3
GET /api/admin/withdrawals?status=pending&marketer_id=3
```

**Success Response (200):**
```json
{
  "message": "قائمة طلبات السحب",
  "data": [
    {
      "id": 1,
      "marketer_id": 3,
      "marketer_name": "محمد السالم",
      "requested_amount": 5000,
      "status": "pending",
      "approved_by_name": null,
      "rejected_by_name": null,
      "created_at": "2024-02-03 10:30:00"
    }
  ]
}
```

---

### 2. عرض تفاصيل طلب سحب
```http
GET /api/admin/withdrawals/{id}
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "message": "تفاصيل طلب السحب",
  "data": {
    "withdrawal": {
      "id": 7,
      "marketer_id": 3,
      "marketer_name": "محمد السالم",
      "requested_amount": 5000,
      "status": "pending",
      "signed_receipt_image": null
    },
    "available_balance": 7000
  }
}
```

---

### 3. الموافقة والصرف
```http
POST /api/admin/withdrawals/{id}/approve
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Request Body:**
```
signed_receipt_image: [file]
```

**Validation Rules:**
- `signed_receipt_image`: required, image, mimes:jpeg,png,jpg, max:2048

**Success Response (200):**
```json
{
  "message": "تمت الموافقة على طلب السحب بنجاح",
  "data": {
    "id": 7,
    "requested_amount": 5000,
    "status": "approved"
  }
}
```

**Error Responses:**
- 404: طلب السحب غير موجود أو تمت معالجته بالفعل
- 400: المبلغ المطلوب أكبر من الرصيد المتاح

**Business Rules:**
- يمكن الموافقة فقط في حالة: pending
- يتم التحقق من الرصيد المتاح قبل الموافقة
- يتم حفظ الصورة في: storage/receipts/

---

### 4. رفض طلب سحب
```http
POST /api/admin/withdrawals/{id}/reject
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "notes": "يرجى الانتظار حتى نهاية الشهر"
}
```

**Validation Rules:**
- `notes`: required, string

**Success Response (200):**
```json
{
  "message": "تم رفض طلب السحب",
  "data": {
    "id": 7,
    "status": "rejected"
  }
}
```

---

## 📊 حالات طلب السحب (Status Flow)

```
pending → approved
   ↓         
cancelled  rejected
```

**الحالات:**
- `pending`: قيد الانتظار
- `approved`: موافق عليه ومصروف
- `rejected`: مرفوض
- `cancelled`: ملغي

---

## 💰 حساب الرصيد المتاح

```sql
total_commissions = SUM(marketer_commissions.commission_amount)
total_withdrawals = SUM(marketer_withdrawal_requests.requested_amount WHERE status = 'approved')
available_balance = total_commissions - total_withdrawals
```

---

## 📝 ملاحظات مهمة

1. **العمولات:** تأتي من تسديدات المتاجر فقط
2. **الرصيد المتاح:** يحسب ديناميكياً
3. **السحوبات المعتمدة:** فقط الطلبات approved تخصم من الرصيد
4. **الصور:** storage/public/receipts/
5. **الصلاحيات:** المسوق يرى طلباته فقط، Admin يرى الكل

---

**✅ جميع Endpoints موثقة بالتفصيل**
