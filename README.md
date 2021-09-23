# Cambodia Geography API
API Built with Express JS and MongoDB

![Image](https://res.cloudinary.com/khaysing/image/upload/v1632366544/photo%20gallery/chffuwtyag3gdoxcii5q.jpg)
![Image](https://res.cloudinary.com/khaysing/image/upload/v1632366862/photo%20gallery/adfcxlibc9jctmofumq6.jpg)

# Setup
* Clone the repository
```bash
git clone https://github.com/niptict-g6/cambodia_geography_api.git
```
* Create .env file with command cp .env.example .env and replace with your own env variable
```
NODE_ENV= development
PORT= 5000
MONGO_URI= mongodb+srv://user:password@cluster0.1skee.mongodb.net/database?retryWrites=true&w=majority
HOST= http://localhost:5000
JWT_SECRET= SECRET_KEY
JWT_REFRESH_SECRET= REFRESH_SECRET_KEY
JWT_EMAIL_SECRET= EMAIL_SECRET_KEY
GMAIL_USER= example@gmail.com
GMAIL_PASS= 123456
CLOUD_NAME= example 
CLOUD_API_KEY= 123456789256317
CLOUD_API_SECRET= abc-defghijk
```
For Cloud API key you can get it on [Cloudinary](https://cloudinary.com/)
* Install dependencies
```bash
cd <project_name>
npm install
```
* Create a folder call `uploads` for image uploads 
* Build and run the project
 ```bash
npm run server
```
Navigate to `http://localhost:5000`

## License
[MIT](https://choosealicense.com/licenses/mit/)
