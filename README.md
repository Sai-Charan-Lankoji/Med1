# Designer UI

## Overview
Designer UI is a modular project with five main folders, each designed for specific functionality. The project uses **Next.js** for the frontend and **Node.js with Express** for the backend. Follow the steps below to set up and run the project efficiently.

## Folder Structure and Usage

### 1. **admin2** (Admin Dashboard)
- **Setup:**
  ```bash
  cd admin2
  npm i
  ```
- **Run:**
  ```bash
  npm run dev
  ```
- **Access:** Open your browser and navigate to `/vendors` to view the Admin Dashboard.

### 2. **vendor** (Vendor Dashboard)
- **Setup:**
  ```bash
  cd vendor
  npm i
  ```
- **Run:**
  ```bash
  npm run dev
  ```
- **Access:**
  - Open the Vendor landing page in your browser.
  - Sign up for an account or log in.
  - After login, access features like Orders, Customers, Stores, and Settings.

### 3. **store1** (Store Interface)
- **Setup:**
  ```bash
  cd store1
  npm i
  ```
- **Run:**
  ```bash
  npm run dev
  ```
- **Access:** Open the Store landing page in your browser. Sign up or log in to customize your store interface.

### 4. **server** (API Backend)
- **Setup:**
  ```bash
  cd server
  npm i
  ```
- **Run:**
  ```bash
  npm start
  ```
- **Details:** The backend server will handle all API requests.

### 5. **auto** (Store Instance Generator)
- **Setup:**
  ```bash
  cd auto
  npm i
  ```
- **Run:**
  ```bash
  npm start
  ```
- **Details:** This server is used for generating store instances.

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Sai-Charan-Lankoji/Med1
   ```
2. **Navigate to the desired folder** and follow its setup and run instructions as described above.
3. **Ensure Node.js and npm are installed** on your system before starting.

## Notes
- Each folder operates independently; navigate and set up each folder based on your requirements.
- For troubleshooting, check the logs in the respective folder.

## License
This project is licensed under [Insert License Name].

