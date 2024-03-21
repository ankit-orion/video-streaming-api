# Video Streaming API

This project is a Video Streaming API developed from the ground up, enabling users to register accounts, upload videos, and personalize their profiles with avatar cover photos.

## Features

- **User Registration and Profile Customization:** Users can register accounts and personalize their profiles with avatar cover photos.
  
- **Comprehensive Data Storage:** MongoDB is leveraged as the primary database to store user data, including usernames, hashed passwords for security, video metadata, and Cloudinary image URLs for efficient media storage.
  
- **Job Listings:** Implemented features such as job listings to streamline the placement process.
  
- **Custom Scraper API Integration:** Integrated a custom scraper API to automate data extraction from the Placement Portal, ensuring up-to-date job listings and information.

- **Secure Authentication and Authorization:** Implemented secure user authentication and authorization mechanisms to protect user data and control access to portal features.

## Technologies Used

- Node.js
- MongoDB
- Cloudinary
- JWT

## Usage

1. Clone the repository to your local machine.
2. Install dependencies using `npm install`.
3. Configure MongoDB connection settings in the `config.js` file.
4. Set up Cloudinary credentials in the appropriate configuration file.
5. Run the application using `npm start`.

## Contributing

Contributions are welcome! Feel free to fork the repository, make your changes, and submit a pull request.

