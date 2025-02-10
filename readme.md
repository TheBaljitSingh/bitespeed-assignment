# Contact Identification API

This project is a **Contact Identification API** built using **Prisma** and **Supabase** as the database provider. It allows users to store contacts and automatically link related contacts based on shared email addresses or phone numbers.

## Features
- Store user contacts in **Supabase** with Prisma ORM.
- Automatically identify and link contacts with the same email or phone number.
- Maintain a **primary contact** with linked **secondary contacts**.
- Ensure uniqueness of emails and phone numbers while linking contacts correctly.
- Handle cases where only email or phone number is provided.

## Tech Stack
- **Node.js** - Backend runtime
- **Express.js** - API framework
- **Prisma** - ORM for database interaction
- **Supabase** - Database as a service (PostgreSQL)
- **TypeScript** - Strongly typed JavaScript (optional)

## Setup Instructions
### 1. Clone the Repository
```sh
git clone https://github.com/thebaljitsingh/contact-identification-api.git
cd contact-identification-api
```

### 2. Install Dependencies
```sh
npm install
```

### 3. Setup Supabase Database
1. Sign up at [Supabase](https://supabase.com/).
2. Create a new project.
3. Navigate to **Database Settings** → **Connection String** and copy your database URL.

### 4. Configure Environment Variables
Create a `.env` file and add the following:
```sh
DATABASE_URL="your-supabase-database-url"
PORT=3000
```

### 5. Setup Prisma
#### Initialize Prisma
```sh
npx prisma init
```

#### Generate Prisma Client
```sh
npx prisma generate
```

#### Apply Migrations
```sh
npx prisma migrate dev --name init
```

### 6. Run the Server
```sh
npm run dev
```

The API will be running at `http://localhost:3000`.

## API Endpoints
### Identify Contact
#### **POST /identify-contact**
**Request Body:**
```json
{
  "email": "mcfly@hillvalley.edu",
  "phoneNumber": "123456"
}
```

**Response:**
```json
{
  "contact": {
    "primaryContatctId": 1,
    "emails": ["lorraine@hillvalley.edu", "mcfly@hillvalley.edu"],
    "phoneNumbers": ["123456"],
    "secondaryContactIds": [23]
  }
}
```

## Prisma Schema
```prisma
model Contact {
  id             Int      @id @default(autoincrement())
  phoneNumber    String?  @unique
  email          String?  @unique
  linkedId       Int?     
  linkPrecedence String
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  deletedAt      DateTime?

  // Relationship
  primaryContact Contact? @relation("ContactSelf", fields: [linkedId], references: [id])
  secondaryContacts Contact[] @relation("ContactSelf")
}
```

## Deployment
- Deploy your **Node.js app** on **Vercel, Render, or AWS**.
- Use **Supabase** as the database provider.
- Make sure to configure `DATABASE_URL` properly in production.

## License
This project is **MIT Licensed**.

