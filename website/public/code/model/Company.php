<?php

class Company {
    private $connection;

    public function __construct($db)
    {
        $this->connection = $db;
        $this->connection->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING );
    }

    public function setData()
    {

    }

    public function getData( $general = true, $formContacts = false )
    {
        $response = false;
        if( $general || $formContacts ) {
            $query = $this->connection->prepare(
                "SELECT
                    " . ( $general ? 
                        "company,
                        name,
                        address,
                        phone,
                        facebook_url,
                        instagram_url " : 
                        "" 
                    ) . " 
                    " . ( $formContacts ? 
                        ( $general ? 
                            "," : 
                            "" 
                        ) . " form_contacts " : 
                        ""
                    ) . "
                    FROM 
                        company 
                        LIMIT 1"
            );
            $query->execute();
    
            if( $query->rowCount() > 0 ) {
                $response = $query->fetch( PDO::FETCH_ASSOC );
            }
        }

        return $response;
    }
}