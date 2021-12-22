<?php

require_once('Database.php');

class Init {

    private $connection;

    public function getConnection()
    {
        $database = new Database();
        $this->connection = $database->getConnection();
        return $this->connection;
    }

    public function getParameters()
    {
        if(!isset($_SERVER['REDIRECT_URL'])) {
            return false;
        }

        $url = mb_substr($_SERVER['REDIRECT_URL'], 1);
        $ultimo = mb_substr($url, -1);

        if($ultimo == '/') {
            $url = mb_substr($url, 0, -1);
        }

        return explode('/', $url);
    }
}