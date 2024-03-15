const app = require("./src/app");
require("dotenv").config()

const port = 8200

const server = app.listen(port || process.env.PORT , () =>{
	console.log(`server runing on port ${port}`)
})

process.on('SIGINT' , () => {
	server.close(() => console.log("Exit Server Express"))
})