import app from "./app.js";
import connectDB from "./database/database.js";
import 'dotenv/config'


connectDB().then(()=>{
    console.log("MongoDB Connected");
    app.listen(process.env.PORT, ()=>{
        console.log(`Server is running on port ${process.env.PORT}`);
    })
}).catch(()=>{
    console.log("Some Error Occured while Connecting to MongoDB");
})


