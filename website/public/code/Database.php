<?php

class Database {

    private $host = 'localhost';
    private $db_name = 'incitrus_futurplace';
    private $username = 'incitrus_futFron';
    private $password = 'o1H6A3m=N*Ek';
    private $connection;

    public function getConnection()
    {
        $this->connection = null;

        try{
            $this->connection = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
            $this->connection->exec("set names utf8");
        }catch (PDOException $exception){
            echo "Connection error: ". $exception->getMessage();
        }
        return $this->connection;
    }
}
