const mongoose = require("mongoose");
require("dotenv").config();

const { MONGODB_URL } = process.env;

console.log('MongoDB URL:', "mongodb+srv://downhill:downhill@cluster0.zg68u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");  // Add this line for debugging

exports.connect = () => {
	mongoose
		.connect("mongodb+srv://downhill:downhill@cluster0.zg68u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
			useNewUrlparser: true,
			useUnifiedTopology: true,
		})
		.then(() => console.log(`DB Connection Success`))  // Corrected this line
		.catch((err) => {
			console.log(`DB Connection Failed`);
			console.log(err);
			process.exit(1);
		});
};
