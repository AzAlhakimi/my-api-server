# Currency API

Simple RESTful API using Node.js and Express to manage currency rates. This API allows you to create, read, update, and delete currency records from a local JSON file.

## 📦 Installation

```bash
git clone https://github.com/AzAlhakimi/my-api-server.git
cd my-api-server
npm install
node server.js

🚀 Deployment

You can deploy this API easily to Render:

Make sure your start script is defined in package.json

Push your code to GitHub

Create a new Web Service on Render connected to your repo


📡 API Endpoints

🧪 Sample Currency JSON Format

{
	"id": "2",
	"codeId": "USD",
	"curr_name": "دولار أمريكي",
	"sale_san": 537,
	"sale_adn": 2385,
	"purch_san": 535,
	"purch_adn": 2375
}


---

 Currency API

Simple RESTful API using Node.js and Express to manage currency rates.

## Endpoints

- GET `/rates`
- GET `/rates/:id`
- POST `/rates`
- PUT `/rates/:id`
- DELETE `/rates/:id`

## Run Locally

```bash
npm install
node server.js

---

👨‍💻 Author

Created by [Azmi Alhakimi].


---

---