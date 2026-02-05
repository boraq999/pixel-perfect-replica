# 📄 دليل Pagination - نظام الصفحات

## ✅ جميع APIs تدعم Pagination الآن

**الإعدادات:**
- 20 عنصر لكل صفحة
- الترتيب: الأحدث أولاً (حسب created_at DESC)

---

## 📊 كيفية استخدام Pagination

### الطلب الأساسي:
```http
GET /api/marketer/requests
Authorization: Bearer {token}
```

### مع رقم الصفحة:
```http
GET /api/marketer/requests?page=2
Authorization: Bearer {token}
```

### مع الفلاتر:
```http
GET /api/marketer/requests?status=pending&page=2
Authorization: Bearer {token}
```

---

## 📋 Response Format

```json
{
  "message": "قائمة طلبات المسوق",
  "data": {
    "current_page": 2,
    "data": [
      {
        "id": 25,
        "invoice_number": "MR-20240203-0025",
        "status": "pending",
        "created_at": "2024-02-03 10:30:00"
      }
    ],
    "first_page_url": "http://domain.com/api/marketer/requests?page=1",
    "from": 21,
    "last_page": 5,
    "last_page_url": "http://domain.com/api/marketer/requests?page=5",
    "links": [
      {
        "url": "http://domain.com/api/marketer/requests?page=1",
        "label": "&laquo; Previous",
        "active": false
      },
      {
        "url": "http://domain.com/api/marketer/requests?page=1",
        "label": "1",
        "active": false
      },
      {
        "url": "http://domain.com/api/marketer/requests?page=2",
        "label": "2",
        "active": true
      },
      {
        "url": "http://domain.com/api/marketer/requests?page=3",
        "label": "Next &raquo;",
        "active": false
      }
    ],
    "next_page_url": "http://domain.com/api/marketer/requests?page=3",
    "path": "http://domain.com/api/marketer/requests",
    "per_page": 20,
    "prev_page_url": "http://domain.com/api/marketer/requests?page=1",
    "to": 40,
    "total": 95
  }
}
```

---

## 🔑 الحقول المهمة

| الحقل | الوصف |
|------|-------|
| `current_page` | رقم الصفحة الحالية |
| `data` | البيانات (20 عنصر كحد أقصى) |
| `per_page` | عدد العناصر لكل صفحة (20) |
| `total` | إجمالي عدد العناصر |
| `last_page` | رقم آخر صفحة |
| `from` | رقم أول عنصر في الصفحة |
| `to` | رقم آخر عنصر في الصفحة |
| `next_page_url` | رابط الصفحة التالية (null إذا كانت آخر صفحة) |
| `prev_page_url` | رابط الصفحة السابقة (null إذا كانت أول صفحة) |

---

## 📝 APIs التي تدعم Pagination

### 🔵 المسوق (Marketer):
1. ✅ `GET /api/marketer/requests` - طلبات البضاعة
2. ✅ `GET /api/marketer/returns` - إرجاعات البضاعة
3. ✅ `GET /api/marketer/sales` - فواتير البيع
4. ✅ `GET /api/marketer/payments` - إيصالات القبض
5. ✅ `GET /api/marketer/store-returns` - إرجاعات المتاجر
6. ✅ `GET /api/marketer/withdrawals` - طلبات السحب
7. ✅ `GET /api/marketer/stock/actual` - مخزون المسوق الفعلي
8. ✅ `GET /api/marketer/stock/reserved` - مخزون المسوق المحجوز

### 🟢 أمين المخزن (Warehouse):
1. ✅ `GET /api/warehouse/requests` - طلبات المسوقين
2. ✅ `GET /api/warehouse/returns` - إرجاعات المسوقين
3. ✅ `GET /api/warehouse/sales` - فواتير البيع
4. ✅ `GET /api/warehouse/payments` - إيصالات القبض
5. ✅ `GET /api/warehouse/store-returns` - إرجاعات المتاجر
6. ✅ `GET /api/warehouse/main-stock` - المخزن الرئيسي

### 🟡 الإدارة (Admin):
1. ✅ `GET /api/admin/sales` - فواتير البيع
2. ✅ `GET /api/admin/withdrawals` - طلبات السحب
3. ✅ `GET /api/admin/promotions` - العروض الترويجية
4. ✅ `GET /api/admin/discounts` - خصومات الفواتير
5. ✅ `GET /api/admin/marketers` - المسوقين
6. ✅ `GET /api/users` - المستخدمين

### 🌐 عام (Common):
1. ✅ `GET /api/products` - المنتجات
2. ✅ `GET /api/stores` - المتاجر
3. ✅ `GET /api/stores/debts` - ديون المتاجر
4. ✅ `GET /api/discounts/active` - الخصومات النشطة
5. ✅ `GET /api/marketer/promotions/active` - العروض النشطة
6. ✅ `GET /api/marketer/discounts/active` - الخصومات النشطة للمسوق

---

## 🎯 أمثلة عملية

### مثال 1: الصفحة الأولى (افتراضي)
```http
GET /api/marketer/requests
```
يعرض أول 20 طلب (الأحدث)

### مثال 2: الصفحة الثانية
```http
GET /api/marketer/requests?page=2
```
يعرض الطلبات من 21 إلى 40

### مثال 3: مع فلتر
```http
GET /api/warehouse/requests?status=pending&page=1
```
يعرض أول 20 طلب في حالة pending

### مثال 4: مع عدة فلاتر
```http
GET /api/warehouse/sales?marketer_id=3&store_id=5&status=approved&page=2
```

---

## 💡 ملاحظات مهمة

1. **الصفحة الافتراضية:** إذا لم تحدد `page`، سيتم عرض الصفحة الأولى
2. **الترتيب:** دائماً الأحدث أولاً (created_at DESC)
3. **الفلاتر:** تعمل مع Pagination بشكل طبيعي
4. **الصفحة غير موجودة:** إذا طلبت صفحة أكبر من `last_page`، سيتم إرجاع صفحة فارغة
5. **عدد العناصر:** ثابت 20 لكل صفحة (غير قابل للتغيير من Frontend)

---

## 🔄 التعامل مع Pagination في Frontend

### مثال JavaScript:
```javascript
async function fetchRequests(page = 1) {
  const response = await fetch(`/api/marketer/requests?page=${page}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    }
  });
  
  const result = await response.json();
  
  console.log('Current Page:', result.data.current_page);
  console.log('Total Items:', result.data.total);
  console.log('Last Page:', result.data.last_page);
  console.log('Items:', result.data.data);
  
  return result.data;
}

// استخدام
fetchRequests(1); // الصفحة الأولى
fetchRequests(2); // الصفحة الثانية
```

### مثال React:
```jsx
const [requests, setRequests] = useState([]);
const [currentPage, setCurrentPage] = useState(1);
const [lastPage, setLastPage] = useState(1);

useEffect(() => {
  fetch(`/api/marketer/requests?page=${currentPage}`)
    .then(res => res.json())
    .then(data => {
      setRequests(data.data.data);
      setLastPage(data.data.last_page);
    });
}, [currentPage]);
```

---

## ✅ الخلاصة

- **20 عنصر لكل صفحة**
- **الأحدث أولاً**
- **يعمل مع جميع الفلاتر**
- **Response موحد لجميع APIs**

---

**✅ جميع APIs تدعم Pagination الآن!**
