var db = require("/opt/api/discord/db.json");

function verifyArbitrator(user) {
    
}

var discord = new (require("discord.js")).Client();
discord.login("TOKEN");
discord.on("message", (msg) => {
        if ((msg.author.toString() === discord.user.toString()) || (msg.content.substr(0, 4) !== "arb!")) {
                return;
        }

    var message = msg.content.replace("arb!", "");
    switch(message.substr(0, 4)) {
        case "help":
            msg.reply(
                "\r\nCommands:\r\n" +
                "-- arb!help : Prints this help.\r\n" +
                "-- arb!list ADDRESS : Labels you an arbitrator and sets your address.\r\n" +
                "-- arb!yay @USERNAME TOKEN-DEALID REASON: Rates someone positively (!yay @kayabaNerve SWT-0 They resolved things quickly.)\r\n" +
                "-- arb!nay : Rates someone negatively. Same syntax as !yay.\r\n" +
                "-- arb!view @username : Gets their score and last 5 reviews.\r\n" + 
                "This bot is run by the FlexDeal Organization. Download my database at https://api.flexdeal.tech/discord/db"
            );
            break;
        case "yay ":
            if (!verifyArbitrator(message.split(" ")[1], message.split(" ")[2])) {
                return;
            }
            if (db[message.author.toString()].score < 0) {
                return;
            }
            db[message.split(" ")[1]].score = Math.ciel((db[message.split(" ")[1]].score * db[message.split(" ")[1]].ratings.length) + Math.ciel(Math.cbrt(db[message.author.toString()].score)));
            break;
        case "nay ":
            if (!verifyArbitrator(message.split(" ")[1])) {
                return;
            }
            if (db[message.author.toString()].score < 0) {
                return;
            }
            db[message.split(" ")[1]].score = Math.ciel((db[message.split(" ")[1]].score * db[message.split(" ")[1]].ratings.length) - Math.ciel(Math.cbrt(db[message.author.toString()].score)));
            break;
        case "view":
            if (!(db[message.split(" ")[1]])) {
                msg.reply("This person has no reviews.");
            } else {
                msg.reply(
                        "\r\nName: " + message.split(" ")[1] + "\r\n" +
                        "Score: " + db[message.split(" ")[1]].score + "\r\n" +
                        "Reviews: " + db[message.split(" ")[1]].ratings.length + "\r\n" +
                        "Last 5 Ratings:\r\n" + ((() => {
                            if (db[message.split(" ")[1]].ratings.length < 5) {
                                var toReturn = db[message.split(" ")[1]].ratings;
                                for (var i = 0; i < db[message.split(" ")[1]].ratings.length; i++) {
                                    toReturn[i] = "---\"\t" + toReturn[i] + "\t\"---";
                                }
                                return toReturn.join("\r\n");
                            }
                            return (
                                "---\"\t" + db[message.split(" ")[1]].ratings[db[message.split(" ")[1]].ratings.length-1] + "\t\"---\r\n" +
                                "---\"\t" + db[message.split(" ")[1]].ratings[db[message.split(" ")[1]].ratings.length-2] + "\t\"---\r\n" +
                                "---\"\t" + db[message.split(" ")[1]].ratings[db[message.split(" ")[1]].ratings.length-3] + "\t\"---\r\n" +
                                "---\"\t" + db[message.split(" ")[1]].ratings[db[message.split(" ")[1]].ratings.length-4] + "\t\"---\r\n" +
                                "---\"\t" + db[message.split(" ")[1]].ratings[db[message.split(" ")[1]].ratings.length-5] + "\t\"---"
                            );
                        })())
                 );
            }
            break;
    } 

});

module.exports = {};

