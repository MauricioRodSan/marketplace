<?php

class PostalCode {
    private $connection;

    public function __construct($db)
    {
        $this->connection = $db;
        // $this->connection->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING );
    }

    public function findByCode($code)
    {
        $response = false;
        $query = $this->connection->prepare(
            "SELECT 
                code.id,
                code.codigo_postal,
                code.asentamiento,
                code.slug,
                code.municipio_id 
                FROM 
                    codigo_postal code 
                    WHERE 
                        codigo_postal = :code"
        );
        $query->bindParam(":code", htmlspecialchars(strip_tags($code)));
        $query->execute();

        if($query->rowCount() > 0) {
            $response = $this->getData( $query->fetchAll(PDO::FETCH_ASSOC) );
        }

        return $response;
    }

    public function findById($id)
    {
        $response = false;
        $query = $this->connection->prepare(
            "SELECT 
                code.id,
                code.codigo_postal,
                code.asentamiento,
                code.slug,
                code.municipio_id 
                FROM 
                    codigo_postal code 
                    WHERE 
                        code.id = :id"
        );
        $query->bindParam(":id", htmlspecialchars(strip_tags($id)));
        $query->execute();

        if($query->rowCount() > 0) {
            $response = $this->getData( $query->fetchAll(PDO::FETCH_ASSOC) );
        }
        return $response;
    }

    private function getData($postalCodes)
    {
        $response = $this->getEstadoMunicipio($postalCodes[0]['municipio_id']);
        $response['postal_codes'] = $postalCodes;
        return $response;
    }

    private function getEstadoMunicipio($municipio)
    {
        $response = false;
        $query = $this->connection->prepare(
            "SELECT 
                estado.estado,
                estado.slug estado_slug,
                municipio.municipio,
                municipio.slug municipio_slug 
                FROM 
                    estado estado 
                    INNER JOIN municipio municipio 
                        ON municipio.estado_id = estado.id 
                    WHERE 
                        municipio.id = :municipio"
        );
        $query->bindParam(":municipio", $municipio);
        $query->execute();

        if($query->rowCount() > 0) {
            $response = $query->fetch(PDO::FETCH_ASSOC);
        }

        return $response;
    }
}