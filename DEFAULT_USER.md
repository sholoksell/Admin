# Default Admin User

## Credentials

A default admin user has been created in your MongoDB database:

- **Email:** bishal@admin.com
- **Username:** bishal
- **Password:** bishal@123456
- **Role:** Super Admin

## How to Login

1. Start both servers:
   ```bash
   .\start.ps1
   ```
   or
   ```bash
   start.bat
   ```

2. Open your browser and go to: http://localhost:5173

3. Login with the credentials above

## If You Need to Recreate the Default User

If you ever need to recreate the default admin user, run:

```bash
cd server
npm run seed
```

This will check if the user exists and create it if it doesn't.

## Change Password

Once logged in, you can:
1. Go to Settings
2. Change your password
3. Update your profile information

## Security Note

⚠️ **Important:** For production use, please change the default password immediately after first login!

## Creating Additional Admin Users

You can create additional admin users in two ways:

### Method 1: Through API
```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "New Admin",
  "email": "newadmin@example.com",
  "password": "secure_password",
  "role": "admin"
}
```

### Method 2: Through the admin panel (if implemented)
- Login as super admin
- Go to user management
- Add new admin users

## Available Roles

- **super_admin** - Full access to everything
- **admin** - Standard admin access
- **manager** - Limited admin access

---

**Ready to login with bishal@admin.com / bishal@123456** 🚀
