import mongoose from "mongoose";



async function DbConnection() {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URL)
        console.log("Database connected")
    }
    catch(e) {
        console.log("Error connecting to the database!", e)
        process.exit(1);
    }
}

export default DbConnection;