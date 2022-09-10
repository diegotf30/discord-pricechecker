if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

module.exports = {
	"prefix": process.env.discordPrefix || ".",
	"token": process.env.token || "",
	"dbURL": process.env.dbURL || ""
}