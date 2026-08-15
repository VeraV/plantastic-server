# 🥕 Plantastic — Server

Backend API for **Plantastic**, a full-stack vegetarian meal-planning app.
Built with Node.js, Express, and MongoDB, it handles authentication, recipes, meal plans, shopping lists, and recipe image uploads.

> 🌐 **Live API:** https://plantastic-server.onrender.com
> 🎨 **Client app:** https://plantastic-gold.vercel.app
> 💻 **Client repo:** https://github.com/VeraV/plantastic-client
> 💻 **Server repo:** https://github.com/VeraV/plantastic-server

---

## ☁️ Deployment & Hosting

| Service           | Provider                                       | URL                                                                 |
| ----------------- | ---------------------------------------------- | ------------------------------------------------------------------- |
| **API server**    | [Render](https://render.com)                   | https://plantastic-server.onrender.com                              |
| **Client app**    | [Vercel](https://vercel.com)                   | https://plantastic-gold.vercel.app                                  |
| **Database**      | [MongoDB Atlas](https://www.mongodb.com/atlas) | Cloud-hosted MongoDB cluster (connection via `MONGODB_URI`)         |
| **Image storage** | [Cloudinary](https://cloudinary.com)           | Cloud name: `dojvyjghs` — uploads land in the `plantastic` folder   |

> ℹ️ The API base URL is `https://plantastic-server.onrender.com`.
> Auth routes are mounted under `/auth`, all other routes under `/api`.

---

## 🧰 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express 5
- **Database:** MongoDB + Mongoose 8
- **Auth:** JSON Web Tokens (`jsonwebtoken`) + `bcryptjs`
- **File uploads:** Multer + `multer-storage-cloudinary`
- **Misc:** CORS, cookie-parser, morgan, dotenv

---

## 🚀 Getting Started (Local Development)

### 1. Clone the repo

```bash
git clone https://github.com/VeraV/plantastic-server.git
cd plantastic-server
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create a `.env` file in the project root

```env
PORT=5005
ORIGIN=http://localhost:5173
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/plantastic
TOKEN_SECRET=your_long_random_secret
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
```

If `MONGODB_URI` is not provided, the app falls back to `mongodb://127.0.0.1:27017/plantastic`.

### 4. Run the server

```bash
npm run dev     # nodemon (auto-restart)
npm start       # plain node
```

The API will be available at `http://localhost:5005`.

---

## 🗄️ Data Models

### User
```js
{
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
}
```

### Recipe
```js
{
  name:         { type: String, unique: true, trim: true },
  image:        { type: String, default: "<cloudinary default image>" },
  duration:     { type: Number, min: 0 },
  ingredients:  [String],
  instructions: String,
}
```

### Plan
```js
{
  name:             { type: String, required: true },
  userId:           { type: ObjectId, ref: "User", required: true },
  recipes:          [{ type: ObjectId, ref: "Recipe" }],
  totalIngredients: [String],
}
```

### ShoppingList
```js
{
  userId:  { type: ObjectId, ref: "User", required: true },
  items:   { type: [String], default: [] },
  isTotal: { type: Boolean, default: false },
  planId:  { type: ObjectId, ref: "Plan" },
}
```

---

## 🔌 API Endpoints

Routes marked 🔒 require a valid JWT in the `Authorization: Bearer <token>` header.

### Auth — `/auth`
| Method | Path      | Body                        | Description                                    |
| ------ | --------- | --------------------------- | ---------------------------------------------- |
| POST   | `/signup` | `{ email, password, name }` | Create a new user + total shopping list        |
| POST   | `/login`  | `{ email, password }`       | Return a signed JWT (`authToken`)              |
| GET    | `/verify` | —                           | 🔒 Verify token and return the decoded payload |

### Recipes — `/api/recipes`
| Method | Path   | Description                                          |
| ------ | ------ | ---------------------------------------------------- |
| GET    | `/`    | Get all recipes                                      |
| GET    | `/:id` | Get one recipe                                       |
| POST   | `/`    | 🔒 Create a recipe (multipart, image via `imageUrl`) |
| PUT    | `/:id` | 🔒 Update a recipe (multipart)                       |
| DELETE | `/:id` | 🔒 Delete a recipe                                   |

### Meal Plans — `/api/plans`
| Method | Path            | Description                                            |
| ------ | --------------- | ------------------------------------------------------ |
| GET    | `/user/:userId` | 🔒 List a user's plans (`name`, `recipesNumber`)       |
| GET    | `/:id`          | 🔒 Get a full plan with populated recipes              |
| POST   | `/`             | 🔒 Create a plan (auto-creates a linked shopping list) |
| PUT    | `/:id`          | 🔒 Update a plan                                       |
| DELETE | `/:id`          | 🔒 Delete a plan                                       |

### Shopping List — `/api/shopping-list`
| Method | Path            | Description                                             |
| ------ | --------------- | ------------------------------------------------------- |
| GET    | `/user/:userId` | 🔒 Get the user's total shopping list (`isTotal: true`) |
| GET    | `/plan/:planId` | 🔒 Get the shopping list for a specific plan            |
| PATCH  | `/:id`          | 🔒 Update items on a shopping list                      |

### Health
| Method | Path    | Description                  |
| ------ | ------- | ---------------------------- |
| GET    | `/api/` | Returns `"All good in here"` |

---

## 🔐 Environment Variables

| Variable           | Required | Description                                   |
| ------------------ | -------- | --------------------------------------------- |
| `PORT`             | no       | Server port (defaults to `5005`)              |
| `ORIGIN`           | yes      | Allowed CORS origin (the deployed client URL) |
| `MONGODB_URI`      | yes      | MongoDB Atlas connection string               |
| `TOKEN_SECRET`     | yes      | Secret used to sign JWTs                      |
| `CLOUD_NAME`       | yes      | Cloudinary cloud name                         |
| `CLOUD_API_KEY`    | yes      | Cloudinary API key                            |
| `CLOUD_API_SECRET` | yes      | Cloudinary API secret                         |

On Render, these are set in **Environment → Environment Variables**.

---

## 👩‍💻 Author

### Vera Fileyeva
[GitHub](https://github.com/VeraV) | [LinkedIn](https://www.linkedin.com/in/vera-veramei-5757b257/)
