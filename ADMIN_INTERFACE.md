# 🔐 Admin Interface Documentation

> ⚠️ **SECURITY WARNING**: This documentation contains sensitive information about the admin interface. Admin credentials should be kept secure and not shared publicly.

## Overview

The Delula admin interface provides secure administrative access to manage various aspects of the platform. It features session-based authentication and a clean, modern interface.

## 🔑 Access

**URL**: `/admin/login`  
**Username**: `admin`  
**Password**: See `ADMIN_CREDENTIALS.md` for development credentials

## 🎯 Features

### Authentication
- **Session-based login**: Secure admin sessions with automatic timeout
- **Password protection**: bcrypt-hashed password authentication
- **Logout functionality**: Available on all admin pages
- **Authentication middleware**: All admin endpoints require authentication

### Admin Dashboard (`/admin`)
- **Editor Actions List**: Overview of available administrative tools
- **Navigation**: Easy access to different admin sections
- **User Status**: Shows logged-in admin username
- **Logout Button**: Prominent logout functionality in header

### Recipe Tag Icon Manager (`/admin/recipe-tag-icons`)
- **CRUD Operations**: Add, edit, delete recipe tag icons
- **Searchable Icon Picker**: Browse 1000+ Lucide icons with search
- **Visual Interface**: See actual icons in the interface
- **Color Override**: Optional color customization
- **Form Validation**: Required field validation
- **Commit-style Saving**: Save button at bottom, not instant async

## 🎨 Recipe Tag Icon Management

### Fields
- **Tag Variable (ID)**: The tag identifier (e.g., "Age", "Cat Breed", "Food Type")
- **Display Name**: Human-readable name for the tag
- **Icon**: Lucide icon name with visual picker
- **Color**: Optional CSS color override (hex, rgb, named colors)

### How to Use
1. **Add New Mapping**: Click "Add Icon Mapping" button
2. **Select Icon**: Use the searchable icon picker to browse Lucide icons
3. **Set Color**: Optionally specify a color override
4. **Save**: Click "Save" to commit changes
5. **Edit**: Click the edit icon on any existing mapping
6. **Delete**: Click the trash icon to remove mappings

### Icon Picker Features
- **Search**: Real-time search through icon names
- **Visual Grid**: Icons displayed in a searchable grid
- **Performance**: Limited results for optimal performance
- **Clear Selection**: X button to clear selected icon

## 🔧 Technical Details

### API Endpoints
- `POST /api/admin/login` - Admin authentication
- `POST /api/admin/logout` - Admin logout
- `GET /api/admin/status` - Check authentication status
- `GET /api/admin/recipe-tag-icons` - Fetch all icon mappings
- `POST /api/admin/recipe-tag-icons` - Create new mapping
- `PUT /api/admin/recipe-tag-icons/:id` - Update existing mapping
- `DELETE /api/admin/recipe-tag-icons/:id` - Delete mapping

### Security Features
- **Session Management**: Secure admin sessions
- **Password Hashing**: bcrypt with salt rounds
- **Protected Routes**: All admin endpoints require authentication
- **CSRF Protection**: Session-based authentication prevents CSRF
- **Input Validation**: Server-side validation for all inputs

### Database Integration
- **Table**: `recipe_option_tag_icon`
- **ORM**: Drizzle ORM for database operations
- **Upsert Support**: Handles conflicts with upsert operations
- **Data Integrity**: Proper constraints and validation

## 🚀 Usage Instructions

### First Time Setup
1. Navigate to `/admin/login`
2. Enter username: `admin`
3. Enter password: See `ADMIN_CREDENTIALS.md` for development credentials
4. Click "Sign In"

### Managing Recipe Tag Icons
1. From admin dashboard, click "Recipe Tag Icon Manager"
2. **To Add**: Click "Add Icon Mapping"
   - Enter Tag Variable (e.g., "Age")
   - Enter Display Name (e.g., "Age")
   - Click icon picker to select a Lucide icon
   - Optionally enter a color override
   - Click "Save"
3. **To Edit**: Click the edit icon on any row
4. **To Delete**: Click the trash icon and confirm

### Logout
- Click the "Logout" button in the header of any admin page
- You'll be redirected to the login page
- Session will be cleared

## 🔒 Security Notes

- **Password**: The admin password is hard-coded and hashed with bcrypt
- **Sessions**: Admin sessions are separate from user sessions
- **Access Control**: Only authenticated admin sessions can access admin endpoints
- **Logout**: Always logout when finished to clear the session
- **Credentials**: Admin credentials should be kept secure and not shared in documentation

## 🛠️ Development

### Adding New Admin Features
1. Add new routes to `server/admin-router.ts`
2. Create new admin pages in `client/src/pages/admin-*`
3. Add routes to `client/src/App.tsx`
4. Update the admin dashboard with new editor actions

### Testing
Run the admin interface test:
```bash
npx tsx scripts/test-admin-interface.ts
```

## 📝 Future Enhancements

Planned admin features:
- **User Management**: Manage user accounts and permissions
- **Content Moderation**: Review and moderate user-generated content
- **Analytics Dashboard**: View platform usage statistics
- **System Configuration**: Manage platform settings
- **Recipe Management**: Create and edit recipes
- **Queue Management**: Monitor and manage generation queue

---

**Note**: This admin interface is designed for internal use only. Ensure proper security measures are in place when deploying to production. 