# 🌐 API الاستعلامات العامة - Common APIs

---

## 🔐 1. المصادقة (Authentication)

### تسجيل الدخول

**Request:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**✅ Success Response (200):**
```json
{
  "message": "تم تسجيل الدخول بنجاح",
  "token": "1|abc123xyz...",
  "user": {
    "id": 1,
    "username": "admin",
    "full_name": "المدير العام",
    "role": "admin",
    "commission_rate": 0
  }
}
```

**❌ Error - 401 بيانات خاطئة:**
```json
{
  "message": "بيانات الدخول غير صحيحة"
}
```

**❌ Error - 403 حساب معطل:**
```json
{
  "message": "حسابك معطل. يرجى التواصل مع الإدارة"
}
```

**❌ Error - 422 بيانات ناقصة:**
```json
{
  "message": "البيانات المدخلة غير صحيحة",
  "errors": {
    "username": ["حقل اسم المستخدم مطلوب"],
    "password": ["حقل كلمة المرور مطلوب"]
  }
}
```

---

### تسجيل الخروج

**Request:**
```http
POST /api/auth/logout
Authorization: Bearer {token}
```

**✅ Success Response (200):**
```json
{
  "message": "تم تسجيل الخروج بنجاح"
}
```

**❌ Error - 401:**
```json
{
  "message": "غير مصرح. يرجى تسجيل الدخول أولاً",
  "error": "Unauthenticated"
}
```

---

### الحصول على بيانات المستخدم الحالي

**Request:**
```http
GET /api/auth/user
Authorization: Bearer {token}
```

**✅ Success Response (200):**
```json
{
  "id": 1,
  "username": "admin",
  "full_name": "المدير العام",
  "role_id": 1,
  "role_name": "مدير النظام",
  "commission_rate": 0,
  "is_active": true
}
```

**❌ Error - 401:**
```json
{
  "message": "غير مصرح. يرجى تسجيل الدخول أولاً"
}
```

---

## 📦 2. المنتجات (Products)

### عرض جميع المنتجات

**Request:**
```http
GET /api/products
Authorization: Bearer {token}
```

**Query Parameters:**
- `page`: رقم الصفحة (اختياري، افتراضي: 1)

**✅ Success Response (200):**
```json
{
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 1,
        "name": "منتج 1",
        "current_price": 100.00,
        "description": "وصف المنتج",
        "barcode": "123456",
        "is_active": true,
        "main_stock_quantity": 500
      },
      {
        "id": 2,
        "name": "منتج 2",
        "current_price": 150.00,
        "description": null,
        "barcode": null,
        "is_active": true,
        "main_stock_quantity": 300
      }
    ],
    "first_page_url": "http://domain.com/api/products?page=1",
    "from": 1,
    "last_page": 5,
    "last_page_url": "http://domain.com/api/products?page=5",
    "next_page_url": "http://domain.com/api/products?page=2",
    "path": "http://domain.com/api/products",
    "per_page": 20,
    "prev_page_url": null,
    "to": 20,
    "total": 95
  }
}
```

**✅ Success - لا توجد منتجات (200):**
```json
{
  "data": []
}
```

**❌ Error - 401:**
```json
{
  "message": "غير مصرح. يرجى تسجيل الدخول أولاً"
}
```

---

### إضافة منتج جديد (Admin فقط)

**Request:**
```http
POST /api/products
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "منتج جديد",
  "price": 120.50,
  "description": "وصف المنتج",
  "barcode": "789012"
}
```

**✅ Success Response (201):**
```json
{
  "message": "تم إضافة المنتج بنجاح"
}
```

**❌ Error - 422 بيانات غير صحيحة:**
```json
{
  "message": "البيانات المدخلة غير صحيحة",
  "errors": {
    "name": ["حقل الاسم مطلوب"],
    "price": ["السعر يجب أن يكون رقم أكبر من 0"]
  }
}
```

**❌ Error - 403 ليس لديك صلاحية:**
```json
{
  "message": "ليس لديك صلاحية للوصول"
}
```

---

### تحديث منتج (Admin فقط)

**Request:**
```http
PUT /api/products/1
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "منتج محدث",
  "price": 130.00,
  "description": "وصف جديد",
  "barcode": "789012"
}
```

**✅ Success Response (200):**
```json
{
  "message": "تم تحديث المنتج بنجاح"
}
```

**❌ Error - 404 المنتج غير موجود:**
```json
{
  "message": "المنتج غير موجود"
}
```

---

## 🏪 3. المتاجر (Stores)

### عرض جميع المتاجر

**Request:**
```http
GET /api/stores
Authorization: Bearer {token}
```

**Query Parameters:**
- `page`: رقم الصفحة (اختياري، افتراضي: 1)

**✅ Success Response (200):**
```json
{
  "current_page": 1,
  "data": [
    {
      "id": 1,
      "name": "متجر الشرق",
      "owner_name": "أحمد محمد",
      "phone": "0501234567",
      "location": "الرياض",
      "address": "شارع الملك فهد",
      "is_active": true,
      "created_at": "2024-01-01T10:00:00.000000Z"
    },
    {
      "id": 2,
      "name": "متجر الغرب",
      "owner_name": "خالد علي",
      "phone": "0509876543",
      "location": "جدة",
      "address": null,
      "is_active": true,
      "created_at": "2024-01-02T11:00:00.000000Z"
    }
  ],
  "first_page_url": "http://domain.com/api/stores?page=1",
  "from": 1,
  "last_page": 5,
  "last_page_url": "http://domain.com/api/stores?page=5",
  "next_page_url": "http://domain.com/api/stores?page=2",
  "path": "http://domain.com/api/stores",
  "per_page": 20,
  "prev_page_url": null,
  "to": 20,
  "total": 95
}
```

**✅ Success - لا توجد متاجر (200):**
```json
[]
```

**❌ Error - 401:**
```json
{
  "message": "غير مصرح. يرجى تسجيل الدخول أولاً"
}
```

---

### إضافة متجر جديد

**Request:**
```http
POST /api/stores
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "متجر الشمال",
  "owner_name": "سعد أحمد",
  "phone": "0551234567",
  "location": "الدمام",
  "address": "شارع الخليج"
}
```

**✅ Success Response (201):**
```json
{
  "id": 3,
  "name": "متجر الشمال",
  "owner_name": "سعد أحمد",
  "phone": "0551234567",
  "location": "الدمام",
  "address": "شارع الخليج",
  "is_active": true,
  "created_at": "2024-02-03T12:00:00.000000Z"
}
```

**❌ Error - 422:**
```json
{
  "message": "البيانات المدخلة غير صحيحة",
  "errors": {
    "name": ["حقل اسم المتجر مطلوب"],
    "owner_name": ["حقل اسم المالك مطلوب"]
  }
}
```

---

### عرض دين متجر محدد

**Request:**
```http
GET /api/stores/1/debt
Authorization: Bearer {token}
```

**✅ Success Response (200):**
```json
{
  "debt": 15000.50
}
```

**❌ Error - 404 المتجر غير موجود:**
```json
{
  "message": "المتجر غير موجود"
}
```

---

## 💰 4. ديون المتاجر (Store Debts)

### عرض جميع المتاجر مع الديون

**Request:**
```http
GET /api/stores/debts
Authorization: Bearer {token}
```

**✅ Success Response (200):**
```json
{
  "message": "قائمة المتاجر",
  "data": [
    {
      "id": 1,
      "name": "متجر الشرق",
      "owner_name": "أحمد محمد",
      "phone": "0501234567",
      "location": "الرياض",
      "is_active": true,
      "total_sales": 50000.00,
      "total_payments": -30000.00,
      "total_returns": -5000.00,
      "remaining_debt": 15000.00
    },
    {
      "id": 2,
      "name": "متجر الغرب",
      "owner_name": "خالد علي",
      "phone": "0509876543",
      "location": "جدة",
      "is_active": true,
      "total_sales": 30000.00,
      "total_payments": -25000.00,
      "total_returns": 0.00,
      "remaining_debt": 5000.00
    }
  ]
}
```

**الحساب:**
```
remaining_debt = total_sales + total_payments + total_returns
```
- `total_sales` موجب (+)
- `total_payments` سالب (-)
- `total_returns` سالب (-)

**✅ Success - لا توجد متاجر (200):**
```json
{
  "message": "قائمة المتاجر",
  "data": []
}
```

---

### عرض تفاصيل متجر مع سجل الديون

**Request:**
```http
GET /api/stores/debts/1
Authorization: Bearer {token}
```

**✅ Success Response (200):**
```json
{
  "message": "تفاصيل المتجر",
  "data": {
    "store": {
      "id": 1,
      "name": "متجر الشرق",
      "owner_name": "أحمد محمد",
      "phone": "0501234567",
      "location": "الرياض",
      "address": "شارع الملك فهد",
      "is_active": true
    },
    "summary": {
      "total_sales": 50000.00,
      "total_payments": -30000.00,
      "total_returns": -5000.00,
      "remaining_debt": 15000.00
    },
    "ledger": [
      {
        "id": 1,
        "entry_type": "sale",
        "amount": 10000.00,
        "sale_invoice_number": "SI-20240203-0001",
        "payment_receipt_number": null,
        "return_number": null,
        "marketer_name": "محمد السالم",
        "created_at": "2024-02-01T10:00:00.000000Z"
      },
      {
        "id": 2,
        "entry_type": "payment",
        "amount": -5000.00,
        "sale_invoice_number": null,
        "payment_receipt_number": "PAY-20240203-0001",
        "return_number": null,
        "marketer_name": "محمد السالم",
        "created_at": "2024-02-02T11:00:00.000000Z"
      },
      {
        "id": 3,
        "entry_type": "return",
        "amount": -1000.00,
        "sale_invoice_number": null,
        "payment_receipt_number": null,
        "return_number": "SR-20240203-0001",
        "marketer_name": "محمد السالم",
        "created_at": "2024-02-03T12:00:00.000000Z"
      }
    ]
  }
}
```

**أنواع الحركات:**
- `sale` - بيع (موجب +)
- `payment` - تسديد (سالب -)
- `return` - إرجاع (سالب -)

**❌ Error - 404:**
```json
{
  "message": "المتجر غير موجود"
}
```

---

## 📊 5. المخزون (Stock)

### عرض المخزن الرئيسي

**Request:**
```http
GET /api/warehouse/main-stock
Authorization: Bearer {token}
```

**✅ Success Response (200):**
```json
{
  "data": [
    {
      "product_id": 1,
      "quantity": 500
    },
    {
      "product_id": 2,
      "quantity": 300
    },
    {
      "product_id": 3,
      "quantity": 0
    }
  ]
}
```

**✅ Success - مخزن فارغ (200):**
```json
{
  "data": []
}
```

**❌ Error - 401:**
```json
{
  "message": "غير مصرح. يرجى تسجيل الدخول أولاً"
}
```

---

### عرض مخزون المسوق الفعلي

**Request:**
```http
GET /api/marketer/stock/actual
Authorization: Bearer {token}
Role: salesman
```

**✅ Success Response (200):**
```json
{
  "data": [
    {
      "marketer_id": 3,
      "product_id": 1,
      "quantity": 50
    },
    {
      "marketer_id": 3,
      "product_id": 2,
      "quantity": 30
    }
  ]
}
```

**✅ Success - لا يوجد مخزون (200):**
```json
{
  "data": []
}
```

**❌ Error - 403 ليس مسوق:**
```json
{
  "message": "ليس لديك صلاحية للوصول"
}
```

---

### عرض مخزون المسوق المحجوز

**Request:**
```http
GET /api/marketer/stock/reserved
Authorization: Bearer {token}
Role: salesman
```

**✅ Success Response (200):**
```json
{
  "data": [
    {
      "marketer_id": 3,
      "product_id": 1,
      "quantity": 20
    }
  ]
}
```

**الفرق بين actual و reserved:**
- **actual** - البضاعة الموجودة فعلياً عند المسوق (يمكن بيعها)
- **reserved** - البضاعة المحجوزة (تم الموافقة عليها لكن لم تُستلم بعد)

---

## 👥 6. المستخدمين (Users) - Admin فقط

### عرض جميع المستخدمين

**Request:**
```http
GET /api/users
Authorization: Bearer {token}
Role: admin
```

**Query Parameters:**
- `page`: رقم الصفحة (اختياري، افتراضي: 1)

**✅ Success Response (200):**
```json
{
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 1,
        "username": "admin",
        "full_name": "المدير العام",
        "is_active": true,
        "role_name": "مدير النظام",
        "commission_rate": 0
      },
      {
        "id": 2,
        "username": "keeper1",
        "full_name": "أحمد المخزني",
        "is_active": true,
        "role_name": "أمين مخزن",
        "commission_rate": 0
      },
      {
        "id": 3,
        "username": "salesman1",
        "full_name": "محمد السالم",
        "is_active": true,
        "role_name": "مسوق",
        "commission_rate": 5.00
      }
    ],
    "first_page_url": "http://domain.com/api/users?page=1",
    "from": 1,
    "last_page": 5,
    "last_page_url": "http://domain.com/api/users?page=5",
    "next_page_url": "http://domain.com/api/users?page=2",
    "path": "http://domain.com/api/users",
    "per_page": 20,
    "prev_page_url": null,
    "to": 20,
    "total": 95
  }
}
```

**❌ Error - 403 ليس admin:**
```json
{
  "message": "ليس لديك صلاحية للوصول"
}
```

---

### عرض الأدوار المتاحة

**Request:**
```http
GET /api/roles
Authorization: Bearer {token}
Role: admin
```

**✅ Success Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "display_name": "مدير النظام"
    },
    {
      "id": 2,
      "display_name": "أمين مخزن"
    },
    {
      "id": 3,
      "display_name": "مسوق"
    }
  ]
}
```

---

### إضافة مستخدم جديد

**Request:**
```http
POST /api/users
Authorization: Bearer {token}
Role: admin
Content-Type: application/json

{
  "username": "salesman2",
  "full_name": "خالد التاجر",
  "password": "password123",
  "role_id": 3,
  "commission_rate": 7.5
}
```

**✅ Success Response (201):**
```json
{
  "message": "تم إضافة المستخدم بنجاح"
}
```

**❌ Error - 422 اسم مستخدم موجود:**
```json
{
  "message": "البيانات المدخلة غير صحيحة",
  "errors": {
    "username": ["اسم المستخدم مستخدم بالفعل"]
  }
}
```

---

### تحديث مستخدم

**Request:**
```http
PUT /api/users/3
Authorization: Bearer {token}
Role: admin
Content-Type: application/json

{
  "username": "salesman1",
  "full_name": "محمد السالم المحدث",
  "password": "newpassword123",
  "role_id": 3,
  "commission_rate": 6.0
}
```

**✅ Success Response (200):**
```json
{
  "message": "تم تحديث المستخدم بنجاح"
}
```

**ملاحظة:** حقل `password` اختياري، إذا لم يُرسل لن يتم تغيير كلمة المرور

---

### تفعيل/تعطيل مستخدم

**Request:**
```http
PUT /api/users/3/toggle-active
Authorization: Bearer {token}
Role: admin
```

**✅ Success Response (200):**
```json
{
  "message": "تم تحديث حالة المستخدم"
}
```

**❌ Error - 404:**
```json
{
  "message": "المستخدم غير موجود"
}
```

---

## 🎁 7. العروض الترويجية النشطة

### عرض العروض النشطة (للجميع)

**Request:**
```http
GET /api/marketer/promotions/active
Authorization: Bearer {token}
```

**✅ Success Response (200):**
```json
{
  "message": "العروض الترويجية النشطة",
  "data": [
    {
      "id": 1,
      "product_id": 1,
      "product_name": "منتج 1",
      "min_quantity": 10,
      "free_quantity": 2,
      "start_date": "2024-01-01",
      "end_date": "2024-12-31"
    },
    {
      "id": 2,
      "product_id": 5,
      "product_name": "منتج 5",
      "min_quantity": 5,
      "free_quantity": 1,
      "start_date": "2024-02-01",
      "end_date": "2024-02-29"
    }
  ]
}
```

**المعنى:**
- اشتري 10 من منتج 1 واحصل على 2 مجاناً
- اشتري 5 من منتج 5 واحصل على 1 مجاناً

**✅ Success - لا توجد عروض (200):**
```json
{
  "message": "العروض الترويجية النشطة",
  "data": []
}
```

---

## 💳 8. خصومات الفواتير النشطة

### عرض الخصومات النشطة (للجميع)

**Request:**
```http
GET /api/discounts/active
Authorization: Bearer {token}
```

**✅ Success Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "min_amount": 1000.00,
      "discount_type": "percentage",
      "discount_percentage": 5.00,
      "discount_amount": null,
      "start_date": "2024-01-01",
      "end_date": "2024-12-31"
    },
    {
      "id": 2,
      "min_amount": 5000.00,
      "discount_type": "fixed",
      "discount_percentage": null,
      "discount_amount": 200.00,
      "start_date": "2024-02-01",
      "end_date": "2024-02-29"
    }
  ]
}
```

**المعنى:**
- فاتورة >= 1000 ريال → خصم 5%
- فاتورة >= 5000 ريال → خصم 200 ريال ثابت

**أنواع الخصم:**
- `percentage` - نسبة مئوية
- `fixed` - مبلغ ثابت

**✅ Success - لا توجد خصومات (200):**
```json
{
  "data": []
}
```

---

## 📌 ملاحظات عامة

### Headers المطلوبة
```
Authorization: Bearer {token}
Accept: application/json
Content-Type: application/json
```

### Status Codes
- **200** - نجاح
- **201** - تم الإنشاء
- **400** - خطأ منطقي
- **401** - غير مصرح
- **403** - ممنوع
- **404** - غير موجود
- **422** - بيانات غير صحيحة
- **500** - خطأ في الخادم

### الأدوار (Roles)
- **admin** - مدير النظام (صلاحيات كاملة)
- **warehouse_keeper** - أمين مخزن
- **salesman** - مسوق

### حسابات التجربة
```
Admin:     admin / admin123
Keeper:    keeper1 / keeper123
Salesman:  salesman1 / sales123
```

---

**✅ جميع الاستعلامات العامة موثقة بالكامل**
