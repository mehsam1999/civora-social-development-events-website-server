  # CIVORA – Community Development Events Platform Server

  **Small Acts. Stronger Communities.**

  A community-driven platform connecting people with meaningful initiatives and local volunteering opportunities.

## ✨ Key Backend Features

### 🔐 1. JWT-Based API Authentication
The backend implements secure API authentication using JSON Web Tokens (JWT) and Better Auth's JWKS endpoint. Protected routes verify incoming tokens before allowing users to perform authenticated operations, helping prevent unauthorized access to private resources.

### 📅 2. Dynamic Upcoming Events Filtering
The API retrieves upcoming community events based on their scheduled dates and sorts them chronologically. The recent upcoming events endpoint also limits the results to six events, allowing the homepage to display relevant event opportunities dynamically.

### 📝 3. Event Creation and Management
Authenticated users can create community events and manage existing event information through dedicated REST API endpoints. The backend supports event creation, updating, deletion, and retrieving events associated with specific organizers.

### 🤝 4. Event Participation and Duplicate Prevention
Users can join community events through a dedicated participation endpoint. Before storing a new participation record, the backend checks whether the user has already joined the same event, preventing duplicate registrations.

### 👤 5. User-Specific Event Retrieval
The backend provides dedicated endpoints for retrieving events created by individual organizers and events joined by users. Joined event records are sorted by event date, making it easier to track participation and upcoming activities.

---

## 🚀 Technologies Used

### ⚙️ Backend Technologies

- Node.js
- Express.js
- MongoDB
- Better Auth
- JSON Web Token (JWT)
- JOSE
- CORS
