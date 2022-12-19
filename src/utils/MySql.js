const mysql = require('mysql');
const Utils = require(`${__dirname}/Utils`);

class MySql {
    static getPlatformsInsertQuery(platforms) {
        let query = "INSERT IGNORE INTO igdb_platforms (id, name) VALUES ";
        platforms.forEach(platform => {
            query += `(${platform.id}, "${escape(platform.name)}"),`;
        });

        return Utils.removeLastCharacter(query);
    }

	static getThemesInsertQuery (themes) {
		let query = "INSERT IGNORE INTO igdb_themes (id, name) VALUES ";
        themes.forEach(theme => {
			// excape url encodes the data. maybe we dont need it anymore

			query += `(${theme.id}, "${theme.name}"),`;
        });

        return Utils.removeLastCharacter(query);
	}

	static getGenresInsertQuery(genres) {
        let query = "INSERT IGNORE INTO igdb_genres (id, name) VALUES ";
        genres.forEach(genre => {
            query += `(${genre.id}, "${escape(genre.name)}"),`;
        });

        return Utils.removeLastCharacter(query);
    }

    static getGamesInsertQuery(games) {
        let query = "INSERT IGNORE INTO igdb_games (id, name, summary) VALUES ";
        games.forEach(game => {
            query += `(${game.id}, "${escape(game.name)}", "${typeof game.summary === 'string' ? escape(game.summary.replace('\n', ' ')) : ''}"),`;
        });

        return Utils.removeLastCharacter(query);
    }

    static getGamesPlatformsInsertQuery(games) {
        // let query = "INSERT IGNORE INTO igdb_game_platforms (gameId, platformId) VALUES ";
        // games.forEach(game => {
        //     if (!Array.isArray(game.platforms) || !game.platforms.length) {
        //         return;
        //     }
        //     game.platforms.forEach(platform => {
        //         query += `(${game.id}, ${platform}),`;
        //     });
        // });

        // return Utils.removeLastCharacter(query);

		return null;
    }

    static runQuery(config, query) {
        return new Promise((resolve, reject) => {
            let con = mysql.createConnection({
                host: config['db_host'],
                user: config['db_username'],
                password: config['db_password'],
                database: 'gameroo'
            });
            
            con.connect(function(err) {
                if (err) {
                    return reject(err);
                }
        
                con.query(query, function (err, result) {
                    if (err) {
                        return reject(err);
                    }

                    con.end();
                    resolve();
                });
            });
        });
    }
}

module.exports = MySql;