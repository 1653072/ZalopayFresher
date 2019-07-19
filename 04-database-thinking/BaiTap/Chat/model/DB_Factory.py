import DB_MySQL
import DB_Redis

class DB_Factory():
    type = None
    def chooseTypeOfDB(self, type):
        if (type == "MySQL"):
            return DB_MySQL.MYSQL()
        else:
            if (type == "Redis"):
                return DB_Redis.REDIS()

