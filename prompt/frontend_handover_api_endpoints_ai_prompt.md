# 📘 Frontend Handover Document

## API Endpoints Mapping + Unified AI Prompt

---

## القسم الأول: API Endpoints المطلوبة لكل صفحة

> ملاحظة: جميع الـ endpoints افتراضية بصيغة REST، ويجب استهلاكها عبر axiosInstance مع Authorization Token.

---

## 🔐 Auth

### Login Page

**Endpoints:**

- POST /auth/login
- GET /auth/me

**الهدف:**

- تسجيل الدخول
- جلب بيانات المستخدم + الدور

---

## 🧑‍💼 Admin Interfaces

### Dashboard

**Endpoints:**

- GET /admin/dashboard/stats

**يعتمد على جداول:**

- sales\_invoices
- store\_payments
- marketer\_commissions
- users

---

### Users Management

**Endpoints:**

- GET /users
- POST /users
- PUT /users/{id}
- PATCH /users/{id}/status

**جداول:** users, roles

---

### Products Management

**Endpoints:**

- GET /products
- POST /products
- PUT /products/{id}
- PATCH /products/{id}/status

**Promotions:**

- GET /product-promotions
- POST /product-promotions

**جداول:** products, product\_promotions

---

### Stores Management

**Endpoints:**

- GET /stores
- POST /stores
- PUT /stores/{id}
- GET /stores/{id}/stock

**جداول:** stores, store\_actual\_stock

---

### Sales Invoices Review

**Endpoints:**

- GET /sales-invoices
- GET /sales-invoices/{id}
- PATCH /sales-invoices/{id}/approve
- PATCH /sales-invoices/{id}/cancel

**جداول:** sales\_invoices, sales\_invoice\_items

---

### Store Payments

**Endpoints:**

- GET /store-payments
- PATCH /store-payments/{id}/approve
- PATCH /store-payments/{id}/reject

**جداول:** store\_payments, store\_debt\_ledger

---

### Marketer Withdrawals

**Endpoints:**

- GET /marketer-withdrawal-requests
- PATCH /marketer-withdrawal-requests/{id}/approve
- PATCH /marketer-withdrawal-requests/{id}/reject

**جداول:** marketer\_withdrawal\_requests, marketer\_withdrawals

---

## 🏬 Keeper Interfaces

### Warehouse Stock

**Endpoints:**

- GET /warehouse/stock
- GET /warehouse/stock/logs

**جداول:** main\_stock, warehouse\_stock\_logs

---

### Factory Invoices

**Endpoints:**

- GET /factory-invoices
- POST /factory-invoices
- GET /factory-invoices/{id}

**جداول:** factory\_invoices, factory\_invoice\_items

---

### Marketer Requests

**Endpoints:**

- GET /marketer-requests
- GET /marketer-requests/{id}
- PATCH /marketer-requests/{id}/approve
- PATCH /marketer-requests/{id}/reject

**جداول:** marketer\_requests, marketer\_request\_items, marketer\_request\_status

---

### Delivery Confirmation

**Endpoints:**

- POST /delivery-confirmations

**جداول:** delivery\_confirmation

---

### Sales Returns (Keeper)

**Endpoints:**

- GET /sales-returns
- PATCH /sales-returns/{id}/approve
- POST /sales-returns/{id}/confirm

**جداول:** sales\_returns, sales\_return\_items, sales\_return\_confirmation

---

## 🧑‍💼 Marketer Interfaces

### My Stock

**Endpoints:**

- GET /marketer/stock

**جداول:** marketer\_actual\_stock, marketer\_reserved\_stock

---

### Create Sales Invoice

**Endpoints:**

- POST /sales-invoices
- GET /products
- GET /product-promotions/active

**جداول:** sales\_invoices, sales\_invoice\_items, product\_promotions

---

### Sales Returns

**Endpoints:**

- POST /sales-returns
- GET /sales-returns/my

**جداول:** sales\_returns, sales\_return\_items

---

### Marketer Requests

**Endpoints:**

- POST /marketer-requests
- GET /marketer-requests/my

**جداول:** marketer\_requests, marketer\_request\_items

---

### Commissions

**Endpoints:**

- GET /marketer/commissions

**جداول:** marketer\_commissions

---

### Withdrawals

**Endpoints:**

- POST /marketer-withdrawal-requests
- GET /marketer-withdrawal-requests/my

**جداول:** marketer\_withdrawal\_requests

---

---

## القسم الثاني: بنية مشروع Frontend (Project Structure)

تهدف هذه البنية إلى ضمان فصل المسؤوليات، سهولة الصيانة، وقابلية التوسع مع الحفاظ على بساطة التقنيات المستخدمة.

```
src/
│
├── api/
│   ├── axiosInstance.js        # إعداد Axios (BaseURL, Interceptors)
│   ├── auth.api.js             # Auth Endpoints
│   ├── users.api.js            # Users & Roles
│   ├── products.api.js         # Products & Promotions
│   ├── sales.api.js            # Sales & Returns
│   ├── stock.api.js            # Warehouse / Store / Marketer Stock
│   └── payments.api.js         # Payments & Withdrawals
│
├── components/
│   ├── common/                 # مكونات عامة قابلة لإعادة الاستخدام
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Table.jsx
│   │   ├── Modal.jsx
│   │   └── Loader.jsx
│   │
│   └── layout/                 # مكونات الهيكل العام
│       ├── Header.jsx
│       ├── Sidebar.jsx
│       └── ProtectedRoute.jsx
│
├── context/
│   ├── AuthContext.jsx         # حالة المستخدم والصلاحيات
│   └── AppContext.jsx          # حالات عامة مشتركة
│
├── hooks/
│   ├── useAuth.js
│   ├── useFetch.js
│   └── useDebounce.js
│
├── pages/                      # صفحات النظام (مقسمة حسب الدور)
│   ├── auth/
│   │   └── Login.jsx
│   │
│   ├── admin/
│   │   ├── Dashboard.jsx
│   │   ├── Users.jsx
│   │   ├── Products.jsx
│   │   └── Stores.jsx
│   │
│   ├── keeper/
│   │   ├── WarehouseStock.jsx
│   │   ├── FactoryInvoices.jsx
│   │   └── Requests.jsx
│   │
│   └── marketer/
│       ├── Dashboard.jsx
│       ├── Sales.jsx
│       ├── Stock.jsx
│       └── Withdrawals.jsx
│
├── routes/
│   └── AppRoutes.jsx           # تعريف Routes حسب الدور
│
├── styles/
│   ├── variables.css           # ألوان وثوابت
│   ├── global.css
│   └── layout.css
│
├── utils/
│   ├── constants.js
│   ├── permissions.js          # صلاحيات الأدوار
│   └── formatters.js
│
├── App.jsx
└── main.jsx
```

### قواعد البنية:
- يمنع استدعاء API مباشرة داخل الصفحات بدون المرور عبر مجلد api
- يمنع وضع منطق الأعمال داخل components المشتركة
- كل Page مسؤولة عن orchestration فقط
- أي منطق متكرر يتم نقله إلى hooks أو utils

---

## القسم الثالث: Unified AI Prompt (Prompt جاهز)

---

### 🎯 AI PROMPT

أنت مطور Frontend محترف.

مطلوب منك بناء واجهة Frontend كاملة باستخدام **React (JavaScript فقط)** لنظام إدارة مخزون ومبيعات وتسويق.

### المتطلبات التقنية:

- React Functional Components
- React Hooks
- JavaScript ES6+
- React Router DOM
- Axios
- CSS عادي أو CSS Modules

### ممنوع استخدام:

- TypeScript
- Tailwind CSS
- Redux

---

### بنية المشروع (إلزامية):

- فصل API Layer عن UI
- axiosInstance موحد
- Context API للمصادقة
- Role Based Routing
- Components قابلة لإعادة الاستخدام

---

### الصلاحيات:

- Admin: إدارة النظام بالكامل
- Keeper: إدارة المخزون والاعتماد
- Marketer: البيع والطلبات والعمولات

إخفاء الصفحات والعناصر حسب الدور.

---

### التعامل مع API:

- try/catch
- loading / error / empty states
- عدم تكرار الطلبات

---

### جودة الكود:

- Clean Code
- Separation of Concerns
- قابل للتوسع
- تعليقات عند الحاجة

---

### المطلوب النهائي:

- مشروع React منظم
- جاهز للربط مع API
- UI بسيط واحترافي
- بنية صحيحة 100%

ابدأ ببناء المشروع وفق هذه المواصفات دون افتراض أي شيء خارج ما ذُكر.

