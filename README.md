# Wanderlust - Your Travel Listing Companion

Welcome to **Wanderlust**, a full-stack web app designed for travel lovers! Discover new destinations, share your own adventures, and connect with fellow explorers. With secure authentication, a clean and responsive interface, and easy-to-use features, Wanderlust makes planning and sharing trips a breeze.

## ✨ Features

1. 🏞️ Add, edit, or delete travel listings  
2. ✍️ Leave ratings and reviews for places you've visited  
3. 🔐 Secure user authentication (Passport.js)  
4. ⚠️ Robust access control and authorization  
5. 💬 Instant feedback with flash messages  
6. ✅ Reliable server-side validation (JOI)  
7. 💻 Responsive design powered by Bootstrap 5  
8. 🔁 Seamless redirects after login—pick up right where you left off  

## 🛠️ Tech Stack

| Layer          | Technology                            | 
|----------------|---------------------------------------|
| **Backend**    | Node.js, Express.js                   |
| **Database**   | MongoDB, Mongoose                     |
| **Frontend**   | EJS (Templating), Bootstrap           |
| **Auth**       | Passport.js (LocalStrategy)           |
| **Validation** | JOI, express-session, connect-flash   |

---

## 📁 Project Structure

```
wanderlust/
├── models/
│   ├── user.js
│   ├── review.js
│   └── listings.js
├── routes/
│   ├── user.js
│   ├── review.js
│   └── listing.js
├── views/
│   ├── listings/
│   ├── users/
│   └── layouts/
├── middleware.js
├── public/
├── utils/
├── app.js
└── schema.js
```



## 🔐 Authentication & Authorization

- 🔑 Log in to create, edit, or delete listings and reviews  
- 🧍‍♀️ Only listing owners can edit or remove their own listings  
- 🗣️ Only review authors can delete their reviews  
- 🔁 After logging in, you'll be redirected to the page you wanted to visit



## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/shivanitiwari0803/wanderlust.git
cd wanderlust
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up MongoDB

Make sure MongoDB is running locally. The default connection string is:

```
mongodb://127.0.0.1:27017/wanderlust
```

### 4. Start the App

```bash
nodemon app.js
```

Visit: [http://localhost:8080](http://localhost:8080)

---

## 🧪 Try It Out

Sample credentials for testing:

- **Username:** testuser  
- **Password:** 12345  

Use these to log in and explore all features.


## 👩‍💻 Author

**Shivani Tiwari**  
BCA Student | Full Stack Developer  
(#https://www.linkedin.com/in/shivani-tiwari-8571a729a/) 
(#https://github.com/shivanitiwari0803)



## 📃 License

This project is licensed under the MIT License.

