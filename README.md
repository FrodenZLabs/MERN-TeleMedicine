# 🏥 MediClinic – Telemedicine Web Application
## Introduction
MediClinic is a modern Telemedicine Web Application designed to bridge the gap between patients and healthcare providers through a seamless digital experience. The platform enables patients to consult doctors remotely, schedule appointments, manage prescriptions, and access medical records — all in one place.

## 📸 Preview

## ✨ Features
### 👨‍⚕️ For Doctors
- Secure login & profile management
- Manage patient appointments
- Accept or cancel consultation requests
- Conduct video consultations
- View patient medical history

### 🧑‍🤝‍🧑 For Patients
- Register, login, and manage profiles
- Search for doctors by specialty or name
- Book appointments and video consultations
- Receive email/notification reminders
- View consultation history

### 🧑‍💼 For Admins
- Manage users (patients, doctors, admins)
- Approve new doctors
- Monitor system activities
- Generate analytics reports

## 🧰 Tech Stack
<table>
  <tr>
    <th>Layer</th>
    <th>Technology</th>
  </tr>
  <tr>
    <td><strong>Frontend</strong></td>
    <td>React.js, Tailwind CSS, Flowbite, Axios</td>
  </tr>
  <tr>
    <td><strong>Backend</strong></td>
    <td>Node.js, Express.js</td>
  </tr>
  <tr>
    <td><strong>Database</strong></td>
    <td>MongoDB (Mongoose ODM)</td>
  </tr>
  <tr>
    <td><strong>Authentication</strong></td>
    <td>JWT (JSON Web Tokens), bcrypt.js</td>
  </tr>
  <tr>
    <td><strong>Cloud Storage</strong></td>
    <td>Cloudinary (for user/doctor profile images)</td>
  </tr>
  <tr>
    <td><strong>Video Consultation</strong></td>
    <td>Google Meet</td>
  </tr>
  <tr>
    <td><strong>Notifications</strong></td>
    <td>Real-time with Socket.IO</td>
  </tr>
  <tr>
    <td><strong>Deployment</strong></td>
    <td>Render</td>
  </tr>
</table>


## ⚙️ Installation Guide
### 1️⃣ Clone the repository
``` bash
git clone https://github.com/FrodenZLabs/MERN-TeleMedicine.git
cd mediclinic-telemedicine
```

### 2️⃣ Setup the Backend
``` bash
npm install
```

### 3️⃣ Setup the Frontend
``` bash
cd ../frontend
npm install
```

### 4️⃣ 🔐 Set Up Environment Variables
Create a .env file in the root directory and add the following variables:
```sh
JWT_SECRET="jwt_secret"
PORT=8000
MONGO_URL = "mongo_url"
STRIPE_PRIVATE_KEY="private_key"
CLOUDINARY_CLOUD_NAME="cloud_name"
CLOUDINARY_API_KEY="api_key"
CLOUDINARY_API_SECRET="api_secret"
```

Create a .env file in the frontend directory and add the following variables for stripe payment:
```sh
VITE_STRIPE_PUBLIC_KEY="public_key"
```
### 5️⃣ 🚀 Running the Application
Run the Backend in the root directory
``` bash
npm run dev
```

Run the Frontend
``` bash
cd frontend
npm run dev
```

## Usage
- **Client-Side**: Access the application via your browser at http://localhost:your_port.
- **Server-Side**: The backend API runs on http://localhost:your_port/api.

#### Directory Structure
```sh
Telemedicine-App/
├── client/          # React front-end
├── server/          # Node.js back-end
├── .env             # Environment variables
├── package.json     # Project dependencies and scripts
└── README.md        # Project documentation
```

## Contributing
1. Fork the repository.
2. Create a new branch (**git checkout -b feature-branch**).
3. Make your changes and commit them (**git commit -m 'Add new feature'**).
4. Push to the branch (**git push origin feature-branch**).
5. Create a new Pull Request.

## 📄 License
This project is licensed under the MIT License.
Feel free to use and modify it for personal or educational purposes.

## 👨‍💻 Developed By
Stephen Kibe
Full-Stack Developer | MERN | DevOps | Cloud Integrations
For any questions or inquiries, please contact:

- Email: **stevensonkibs55@gmail.com**
- GitHub: **[Dispenser254](https://github.com/Dispenser254)**
