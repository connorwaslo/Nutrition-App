# Here's the flow of data

### Mobile App
1. User takes photo of food
2. Google Cloud does magic image recognition for us
3. App stores image and food data into Firebase (database) to be used by web app

### Web App
1. User logs in with firebase (we can set this up at the end)
2. Loads data for user: recent images and food data
3. Builds pages that show user's food consumption and trends