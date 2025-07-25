# 💼 JobHunt Pro – Job Portal Web Application

JobHunt Pro is a modern and responsive job portal built using the MEAN stack (MongoDB, Express.js, Angular, and Node.js). The platform allows **employers** to post and manage job listings and **candidates** to apply for jobs, track application status, and manage their profiles.

---

## 🛠️ Tech Stack

- **Frontend**: Angular 20
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JSON Web Tokens (JWT)
- **Styling**: Bootstrap

---

## ✨ Features

### 🔹 Employer Module
- Employer registration & login (JWT secured)
- Post and manage job listings
- View applicants per job
- View individual applicant resumes

### 🔹 Candidate Module
- Candidate registration & login (JWT secured)
- Browse all job listings
- Apply to jobs (status updates: `In Progress`, `Accepted`, `Rejected`)
- View application history
- Upload resume during registration

### 🔹 General
- Mobile-first responsive UI
- Role-based login (user/employer)
- Sticky navbar and dashboard views
- Notification modal for candidates
- Background image & professional UI styling

---

## 🚀 Getting Started

### Prerequisites

- Node.js & npm
- MongoDB (local or Atlas)
- Angular CLI


### ⚙️ Installation

1. **Clone the Repository**
```bash
git clone https://github.com/ankushkaudi12/job-hunt.git
cd jobhunt-pro
```

2. **Frontend Setup**
```
cd client
npm install
ng serve
```
- Make sure you have Angular 20 installed
  
3. **Backend Setup**
```
cd server
npm install
node server.js
```

**Add .env in /server as per below format**
```
JWT_SECRET_LOGIN=64 character string (preferred)
JWT_SECRET_REFRESH=128 character string (preferred)
LOCAL_MONGO_URI=mongodb://localhost:27017/job_hunt
```

4. **Access the site**
- Access the frontend at http://localhost:4200/ and backend at http://localhost:3000/

---

## 🚀 Want to Try Our Hosted Website?  

Check out the live version of our application here:  

[🔗 Job Board Portal](https://ankushkaudi12.github.io/job-hunt/)

- Explore job listings, post new opportunities, and experience the full functionality without needing to set anything up locally!






