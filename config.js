if (process.env.NODE_ENV !== 'production') {
	console.log("NOT prod, using dotenv");
	require('dotenv').config();
}

module.exports = {
	"ENV": process.env.NODE_ENV || "test",
	"prefix": process.env.discordPrefix || ".",
	"token": process.env.token || "",
	"dbURL": process.env.dbURL || ""
}