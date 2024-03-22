const app = require("./src/app");
require("dotenv").config()

const port = 8200

const server = app.listen(port || 8100 , () =>{
	console.log(`server runing on port ${port}`)
})


process.on('SIGINT' , () => {
	server.close(() => console.log("Exit Server Express"))
})