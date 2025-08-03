Complete **SETUP** for testers to **run both the Java Spring Boot backend** and the **Next.js frontend** of your application.

---

# 🌀 NewWave App – Setup Guide for Testers

This guide will help you run the full application stack locally for testing purposes.

---

## 🧰 Prerequisites

### ✅ Backend

* Java 21 or above
* Maven 3.6+
* PostgreSQL
* Docker (optional for PostgreSQL setup)

### ✅ Frontend

* Node.js v18 or above
* npm or yarn

---

## 🖥️ Backend (Java Spring Boot)

### 1. **Clone the repository**

```bash
git clone <your-backend-repo-url>
cd <your-backend-directory>
```

### 2. **Set up PostgreSQL**

If you have PostgreSQL installed locally:

* Create a database named: `new_wave_dev`
* Set the username and password as configured in `application-dev.yml`

```sql
CREATE DATABASE new_wave_dev;
CREATE USER postgres WITH PASSWORD '';
GRANT ALL PRIVILEGES ON DATABASE new_wave_dev TO postgres;
```

> 💡 Or use Docker (optional):

```bash
docker run --name postgres-newwave -e POSTGRES_DB=new_wave_dev -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD= -p 5432:5432 -d postgres
```

### 3. **Set environment/profile**

Spring Boot is already set to use the `dev` profile via `application.yml`:

```yaml
spring:
  profiles:
    active: dev
```

### 4. **Run the backend**

```bash
./mvnw spring-boot:run
```

Or with Maven installed:

```bash
mvn spring-boot:run
```

* The backend runs at: `http://localhost:8080`
* Sample admin login:

  * **Email**: `admin@gmail.com`
  * **Password**: `12345678`

---

## 🌐 Frontend (Next.js)

### 1. **Clone the repository**

```bash
git clone <your-frontend-repo-url>
cd <your-frontend-directory>
```

### 2. **Install dependencies**

```bash
npm install
# or
yarn install
```

### 3. **Configure environment variables**

Create a `.env.local` file in the root of the frontend directory:

```
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_test_client_id
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEYS=your_stripe_publishable_key
NEXT_PUBLIC_STRIPE_SECRET_KEYS=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_WEBHOOK_URL=http://localhost:8080/api/stripe/webhook
NEXT_PUBLIC_NEWWAVE_API_URL=http://localhost:8080
```

> ⚠️ Make sure values match the ones from the backend config (`application-dev.yml`).

### 4. **Run the frontend**

```bash
npm run dev
# or
yarn dev
```

* The frontend runs at: `http://localhost:3000`

---

## ✅ Final Check

* Backend: [http://localhost:8080/](http://localhost:8080/)
* Frontend: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## 💡 Notes for Testers

* The backend auto-creates and updates tables (`hibernate.ddl-auto=update`).
* SQL scripts (if any) will auto-run on startup (`spring.sql.init.mode=always`).
* JWT tokens are managed internally using the `jwt.secret` key.

