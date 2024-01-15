# PayStation (Backend)

Welcome to the PayStation Backend GitHub Repository, an AI mobile application that enables KMUTT Bookstore customers to take pictures of 20 different types of stationery items. The system will automatically generate the payment bills, allowing customers to pay for those items conveniently!

![Classes](https://github.com/jedipw/paystation_backend/assets/82791342/52a3a305-1ee0-42b8-8a35-e332d5b87153)

## Features

### Image Object Detection
- Detect 1 to 17 stationery items in an image simultaneously.
- Classify those items into one of the 20 classes.
- Operate effectively under various noisy conditions, including blur, long distance, short distance, bright, dark, and overlap.

### Real-time Video Object Detection
- Detect stationery items in real time, displaying the class name, confidence score, and bounding box.

### Summary of detected items
- Summarize the list of detected products and calculate the total price for users to complete a self-checkout.

### Upload Slip
- Allow users to upload a slip to confirm the payment.

## First Time Setup

1) Create a new file with the name ".env" in the root folder and place the following inside the file:
   ```env
   PORT=3000
   MONGODB_URL=The URL of MongoDB (Contact us for the URL)
   ```

2) Create a new folder with the name "uploads" in the root folder.
3) Run `npm i` in terminal.
4) Run `npm start` in terminal
