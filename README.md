# Shop App With Node.js

Node.js, Express ve MongoDB ile yazılmış basit bir e-ticaret API projesidir. Bu README, projeyi sadece çalıştırmak için değil, kodu okuyarak backend mantığını öğrenmek için de hazırlanmıştır.

## Projenin Amacı

Bu uygulama ürün, kategori, kullanıcı kayıt/giriş ve ürün yorumları için REST API sağlar. Projede şu temel backend konuları örneklenir:

- Express ile route ve middleware kullanımı
- MongoDB bağlantısı ve Mongoose modelleri
- Joi ile request body validasyonu
- bcrypt ile şifre hashleme
- JWT ile kimlik doğrulama
- Admin yetkisi kontrolü
- Winston ile loglama
- Production ortamında helmet ve compression kullanımı

## Kullanılan Teknolojiler

- Node.js
- Express
- MongoDB
- Mongoose
- Joi
- bcrypt
- jsonwebtoken
- winston ve winston-mongodb
- dotenv
- helmet
- compression
- cors
- nodemon

## Klasör Yapısı

```text
.
├── config/                 # config paketine ait ortam dosyaları
├── middleware/             # auth, admin ve hata middleware'leri
├── models/                 # Mongoose modelleri ve Joi validasyonları
├── routes/                 # API endpoint'leri
├── startup/                # uygulama başlangıç ayarları
├── config.js               # .env değişkenlerini okuyan merkezi config
├── index.js                # uygulamanın giriş noktası
├── package.json            # script'ler ve bağımlılıklar
└── README.md
```

## Uygulama Nasıl Başlıyor?

Uygulamanın giriş noktası `index.js` dosyasıdır.

```js
const express = require("express");
const app = express();

require("./startup/logger");
require("./startup/routes")(app);
require("./startup/db");
```

Başlangıç sırası şöyledir:

1. Express uygulaması oluşturulur.
2. Logger sistemi yüklenir.
3. Route'lar ve middleware'ler `startup/routes.js` içinde uygulamaya bağlanır.
4. MongoDB bağlantısı `startup/db.js` içinde kurulur.
5. `NODE_ENV=production` ise güvenlik ve performans middleware'leri eklenir.
6. Uygulama `PORT` değerindeki port üzerinden dinlemeye başlar.

## Ortam Değişkenleri

Proje `.env` dosyasından veya deployment ortamındaki environment variable değerlerinden beslenir.

Gerekli değişkenler:

```env
NODE_ENV=development
PORT=3000
DB_DEV_URL=mongodb://127.0.0.1:27017/shop-app-dev
DB_PROD_URL=mongodb+srv://...
SALT_ROUNDS=10
SECRET_KEY=super-secret-jwt-key
```

`config.js` dosyası şu kararı verir:

- `NODE_ENV=development` ise `DB_DEV_URL` kullanılır.
- Diğer ortamlarda `DB_PROD_URL` kullanılır.
- `PORT`, `SALT_ROUNDS` veya `SECRET_KEY` eksikse uygulama hata fırlatır.

## Kurulum

Bağımlılıkları yükleyin:

```bash
npm install
```

Geliştirme modunda çalıştırın:

```bash
npm run dev
```

Production modunda çalıştırın:

```bash
npm run prod
```

Doğrudan Node ile başlatmak için:

```bash
npm start
```

## API Route'ları

### Ana Sayfa

```http
GET /
```

Veritabanındaki ilk ürünü döndürür.

### Kullanıcılar

Base path:

```http
/api/users
```

#### Kullanıcı Kaydı

```http
POST /api/users/register
Content-Type: application/json

{
  "name": "Ali Veli",
  "email": "ali@example.com",
  "password": "12345"
}
```

Bu endpoint:

1. Gelen body'yi Joi ile doğrular.
2. Aynı email ile kullanıcı var mı kontrol eder.
3. Şifreyi bcrypt ile hashler.
4. Kullanıcıyı MongoDB'ye kaydeder.
5. JWT token üretip `Authorization` response header'ına ekler.

#### Kullanıcı Girişi

```http
POST /api/users/auth
Content-Type: application/json

{
  "email": "ali@example.com",
  "password": "12345"
}
```

Başarılı girişte response body içinde JWT token döner.

### Ürünler

Base path:

```http
/api/products
```

#### Aktif Ürünleri Listeleme

```http
GET /api/products
```

Sadece `isActive: true` olan ürünleri getirir. Kategori bilgisi `populate` ile eklenir.

#### Tek Ürün Getirme

```http
GET /api/products/:id
```

MongoDB ObjectId ile ürünü getirir ve kategori adını populate eder.

#### Ürün Ekleme

```http
POST /api/products
Authorization: <jwt-token>
Content-Type: application/json

{
  "name": "Laptop",
  "price": 25000,
  "description": "16 GB RAM, 512 GB SSD",
  "imageUrl": "https://example.com/laptop.jpg",
  "isActive": true,
  "category": "6653f0f0f0f0f0f0f0f0f0f0",
  "comments": []
}
```

Bu endpoint hem login olmuş kullanıcı hem de admin yetkisi ister:

```js
router.post("/", [auth, isAdmin], async (req, res) => {
  // ...
});
```

`auth` middleware'i JWT token'ı doğrular. `isAdmin` middleware'i token içindeki `isAdmin` alanına bakar.

#### Ürün Güncelleme

```http
PUT /api/products/:id
```

Ürünü bulur, Joi validasyonundan geçirir ve alanları günceller.

#### Ürün Silme

```http
DELETE /api/products/:id
```

Id 24 karakterlik MongoDB ObjectId formatındaysa ürünü silmeye çalışır.

#### Ürüne Yorum Ekleme

```http
PUT /api/products/comment/:id
Content-Type: application/json

{
  "text": "Çok iyi ürün",
  "username": "Ali"
}
```

Ürünü bulur, `Comment` modeliyle yeni yorum oluşturur ve ürünün `comments` dizisine ekler.

#### Üründen Yorum Silme

```http
DELETE /api/products/comment/:id
Content-Type: application/json

{
  "commentId": "6653f0f0f0f0f0f0f0f0f0f0"
}
```

Ürün içindeki gömülü yorumlardan ilgili `commentId` değerini siler.

### Kategoriler

Base path:

```http
/api/categories
```

#### Kategorileri Listeleme

```http
GET /api/categories
```

Kategorileri getirir ve bağlı ürünlerin `name` ve `price` alanlarını populate eder.

#### Tek Kategori Getirme

```http
GET /api/categories/:id
```

Id ile kategori arar.

#### Kategori Ekleme

```http
POST /api/categories
Content-Type: application/json

{
  "name": "Elektronik",
  "isActive": true,
  "products": []
}
```

#### Kategori Güncelleme

```http
PUT /api/categories/:id
```

Kategori bilgilerini günceller.

#### Kategori Silme

```http
DELETE /api/categories/:id
```

Id geçerliyse kategoriyi siler.

## Modeller

### User

`models/user.js` içinde tanımlıdır.

Alanlar:

- `name`
- `email`
- `password`
- `isAdmin`

Önemli metot:

```js
userSchema.methods.createAuthToken = function () {
  return jwt.sign(
    { _id: this._id, name: this.name, isAdmin: this.isAdmin },
    secretKey
  );
};
```

Bu metot kullanıcının `_id`, `name` ve `isAdmin` bilgilerini JWT içine koyar.

### Product

`models/product.js` içinde tanımlıdır.

Alanlar:

- `name`
- `price`
- `description`
- `imageUrl`
- `date`
- `isActive`
- `category`
- `comments`

`category` alanı `Category` modeline referans verir. `comments` alanı ise ürün dökümanının içinde gömülü yorum dizisi olarak tutulur.

### Category

`models/category.js` içinde tanımlıdır.

Alanlar:

- `name`
- `date`
- `isActive`
- `products`

`products` alanı `Product` modeline referans veren ObjectId dizisidir.

### Comment

`models/comment.js` içinde tanımlıdır.

Alanlar:

- `text`
- `username`
- `date`

Bu model hem bağımsız Mongoose modelidir hem de `commentSchema` olarak ürün içinde kullanılır.

## Middleware Mantığı

### auth

`middleware/auth.js` dosyası request header içindeki `Authorization` değerini okur.

Token yoksa:

```http
401 access denied
```

Token hatalıysa:

```http
400 Faulty token
```

Token geçerliyse decode edilen kullanıcı bilgisi `req.user` içine yazılır.

### isAdmin

`middleware/isAdmin.js` dosyası `req.user.isAdmin` değerini kontrol eder.

Admin değilse:

```http
403 You do not have access authorization.
```

### error

`middleware/error.js` merkezi hata yakalama middleware'idir. Hataları Winston logger'a yazar ve kullanıcıya genel bir `500 Internal server error` mesajı döner.

## Logging

`startup/logger.js` dosyası Winston logger oluşturur.

Log hedefleri:

- Console
- Development ortamında dosya logları
- MongoDB içinde `server_logs` collection'ı

Ayrıca şu Node.js process hataları yakalanır:

- `uncaughtException`
- `unhandledRejection`

## Production Ayarları

`startup/production.js` production ortamında şu middleware'leri ekler:

- `helmet`: HTTP header güvenliğini artırır.
- `compression`: Response boyutunu sıkıştırır.

`index.js` içinde sadece `NODE_ENV=production` olduğunda aktifleşir.

## Öğrenme Akışı

Bu projeyi anlamak için önerilen okuma sırası:

1. `index.js`: Uygulama nereden başlıyor?
2. `startup/routes.js`: Route'lar Express'e nasıl bağlanıyor?
3. `routes/users.js`: Register, login, bcrypt ve JWT nasıl çalışıyor?
4. `middleware/auth.js`: Token doğrulama nasıl yapılıyor?
5. `routes/products.js`: CRUD ve admin koruması nasıl uygulanıyor?
6. `models/product.js`: Mongoose şeması ve Joi validasyonu nasıl ayrılıyor?
7. `startup/db.js`: MongoDB bağlantısı nerede kuruluyor?
8. `startup/logger.js`: Hata loglama nasıl merkezi hale getiriliyor?

## Dikkat Edilecek Kod Notları

- `routes/products.js` içinde ürün ekleme endpoint'i admin korumalıdır, fakat güncelleme ve silme endpoint'leri şu an auth/admin koruması kullanmıyor.
- `routes/categories.js` içinde kategori ekleme, güncelleme ve silme endpoint'leri şu an herkese açıktır.
- `startup/routes.js` içinde `cors` middleware'i route'lardan sonra eklenmiş. CORS'un tüm endpoint'lerde etkili olması için genellikle route'lardan önce eklenmesi tercih edilir.
- `routes/categories.js` içindeki kategori güncellemede `category.isActive = req.body.name;` satırı muhtemelen `req.body.isActive` olmalıdır.
- `routes/products.js` içinde yorum silme akışında ürün bulunamadığında `product.comments` okunmadan önce null kontrolü yapılması daha güvenli olur.
- `models/comment.js` içinde `default: Date.now()` uygulama başlarken tek sefer çalışır. Her yeni yorumda güncel tarih isteniyorsa `default: Date.now` kullanmak daha doğrudur.

Bu notlar README'nin eğitim amacıyla eklenmiştir; mevcut kod davranışını değiştirmez.

## Örnek Test Akışı

1. `.env` dosyasını oluşturun.
2. MongoDB bağlantınızın çalıştığını doğrulayın.
3. `npm run dev` ile API'yi başlatın.
4. `POST /api/users/register` ile kullanıcı oluşturun.
5. MongoDB üzerinden kullanıcının `isAdmin` alanını `true` yapın.
6. Login veya register sonucunda aldığınız token'ı `Authorization` header'ına koyun.
7. `POST /api/products` ile ürün ekleyin.
8. `GET /api/products` ile aktif ürünleri listeleyin.
9. `POST /api/categories` ile kategori ekleyin.
10. Ürün ve kategori referanslarını ObjectId ile ilişkilendirin.

## Kısa Özet

Bu proje küçük ama gerçek bir backend uygulamasının temel parçalarını gösterir: route, model, middleware, validation, authentication, authorization, database connection ve logging. Kodun en önemli öğretici tarafı, Express uygulamasının parçalara ayrılmış olmasıdır. `index.js` sadece uygulamayı başlatır; asıl sorumluluklar `startup`, `routes`, `models` ve `middleware` klasörlerine dağıtılmıştır.
