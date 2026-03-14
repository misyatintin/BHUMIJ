# Bhumij CMS - Deployment Guide

This document outlines how to deploy the Bhumij CMS application to cPanel and how to run it locally. The application has been fully optimized to work on both environments seamlessly.

## 🚀 Running Locally

1. **Prerequisites**: Ensure you have Node.js and MySQL installed.
2. **Database Setup**: Create a database in MySQL and run your setup scripts.
3. **Configuration**: Edit the `.env` file in the project root with your local database credentials:
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_local_password
   DB_NAME=bhumij
   SESSION_SECRET=your_secret_key
   ```
4. **Install Dependencies**: `npm install`
5. **Start the Server**: 
   ```bash
   npm start
   # or
   node server.js
   ```
6. Visit `http://localhost:3000` in your browser.

---

## ☁️ Deploying to cPanel

### Step 1: Prepare Database on cPanel
1. Log into your cPanel dashboard.
2. Go to **MySQL® Databases**.
3. Create a new database (e.g., `yourusername_bhumij`).
4. Create a new user and password, then add the user to the database with **All Privileges**.
5. Import your database schema (or run the setup script) via **phpMyAdmin**.

### Step 2: Upload Files
1. Go to **File Manager**.
2. Create a folder outside of `public_html` (e.g., `/home/yourusername/bhumij-cms`). 
   *Note: Do not put Node.js app files directly in `public_html` for security reasons.*
3. Upload all project files to this folder. You can zip the files locally, upload the `.zip`, and extract it via File Manager.
   *(Do NOT upload the `node_modules` folder. It will be installed automatically).*

### Step 3: Configure Environment Variables
1. Ensure the `.env` file is uploaded (it may be hidden in File Manager, click Settings > Show Hidden Files).
2. Edit the `.env` file with your **cPanel database credentials**:
   ```env
   DB_HOST=localhost
   DB_USER=yourusername_dbuser
   DB_PASSWORD=your_secure_password
   DB_NAME=yourusername_bhumij
   SESSION_SECRET=a_strong_random_secret_string
   ```

### Step 4: Setup Node.js App in cPanel
1. In cPanel, navigate to the **Software** section and click on **Setup Node.js App**.
2. Click **Create Application**.
3. Configure the application:
   - **Node.js version**: Choose the recommended/latest version (e.g., 18.x or 20.x).
   - **Application mode**: Production
   - **Application root**: `bhumij-cms` (the folder you created in Step 2).
   - **Application URL**: Select the domain/subdomain where you want the CMS to appear.
   - **Application startup file**: `app.js`
4. Click **CREATE**.

### Step 5: Install Dependencies & Launch
1. Once created, the interface will reload. Scroll down to the **npm install** button and click it to install all required packages.
2. Wait for the success message.
3. Your app is now live! You can click the "Restart" button anytime you make code changes.

### Folder Permissions (Crucial)
Ensure that the `uploads` folder has write permissions so the CMS can save uploaded images!
