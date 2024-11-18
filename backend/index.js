
import DbConnection from "./db/dbConnection.js";
import dotenv from "dotenv"
import { app } from "./app.js";

 dotenv.config()



DbConnection().then(()=>{
    app.listen(3000, ()=>{
        console.log(`Server is running at port: 3000`)
    })

}).catch((err)=>{
    console.log("Error connecting to the datbase", err)

})









