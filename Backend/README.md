# Cotrans Global Corporation Backend (v2)
Minimal backend for Cotrans Global Corporation Recruitment Agency.

Features:
- Admin auth (register/login) - JWT
- Create/Edit/Delete/View Jobs (admin protected)
- Public: list jobs, get job
- Apply to job: applicants submit form + optional CV upload
- Applications are emailed to the configured admin email (CV attached if provided)

Environment (.env):
- PORT=5050
- MONGO_URI=your_mongo_uri
- JWT_SECRET=your_jwt_secret
- ADMIN_EMAIL=admin@aloula.co.ke
- SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, FROM_EMAIL

Run:
1. npm install
2. copy .env.example to .env and fill values
3. npm run dev
