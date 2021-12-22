<?php

class Property {
    private $connection;

    public function __construct($db)
    {
        $this->connection = $db;
        $this->connection->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING );
    }

    public function findAll( $orderBy = false, $onlyActive = false )
    {
        $response = false;
        $query = $this->connection->prepare(
            "SELECT 
                property.id
                FROM
                    property property 
                    " . ( !$onlyActive ? "" : " WHERE property.active = 1 " ) . "
                    ORDER BY 
                        property.created_at DESC"
        );
        $query->execute();
    
        if($query->rowCount() > 0) {
            $response = [];
            while($property = $query->fetch(PDO::FETCH_ASSOC)) {
                array_push($response, $this->getResume($property['id']));
            }
        }

        return $response;
    }

    public function findAllBySlug( $slugParameters, $orderBy, $relatedTo = false )
    {
        $response = false;
        
        list( $transaction, $type, $estado, $municipio ) = $slugParameters;

        $validEstadoMunicipio = true;
        $rangeMunicipio = null;
        if( $estado ) {
            $queryEstadoMunicipios = $this->connection->prepare(
                "SELECT 
                    MIN(municipio.id) first,
                    MAX(municipio.id) last 
                    FROM 
                        estado estado 
                        INNER JOIN municipio municipio 
                            ON estado.id = municipio.estado_id 
                        WHERE 
                            estado.slug = :estado 
                            " . ( $municipio ? " AND municipio.slug = :municipio " : "" ) 
            );
            $queryEstadoMunicipios->bindParam( ":estado", htmlspecialchars( strip_tags( $estado ) ) );
            if( $municipio ) {
                $queryEstadoMunicipios->bindParam( ":municipio", htmlspecialchars( strip_tags( $municipio ) ) );
            }
            $queryEstadoMunicipios->execute();

            if( $queryEstadoMunicipios->rowCount() > 0 ) {
                $rangeMunicipio = $queryEstadoMunicipios->fetch( PDO::FETCH_ASSOC );
            } else {
                $validEstadoMunicipio = false;
            }
        }

        /*
        ( $estado || $municipio ? " INNER JOIN property_address address ON address.property_id = property.id " : "" ) . "

        ( $estado || $municipio ? " WHERE address.codigo_postal_id BETWEEN :firstPostalCode AND :lastPostalCode " : "" )
        */

        if( $validEstadoMunicipio ) {
            $query = $this->connection->prepare(
                "SELECT 
                    property.id
                    FROM 
                        property property 
                        INNER JOIN transaction transaction 
                            ON transaction.id = property.transaction_id 
                        " . ( $type ? 
                            " INNER JOIN property_type type ON type.id = property.property_type_id " : 
                            "" 
                        ) . " 
                        " . ( $rangeMunicipio ? 
                            " INNER JOIN property_address address ON address.property_id = property.id 
                            INNER JOIN codigo_postal codigoPostal ON codigoPostal.id = address.codigo_postal_id " : 
                            "" 
                        ) . " 
                        WHERE 
                            transaction.slug = :transaction 
                            AND property.active = 1 
                            " . ( $type ? 
                                " AND type.slug = :type " : 
                                "" 
                            ) . " 
                            " . ( $rangeMunicipio ? 
                                " AND codigoPostal.municipio_id BETWEEN :first AND :last " : 
                                "" 
                            ) . " 
                            " . ( $relatedTo ? 
                                " AND property.id != :relatedProperty " : 
                                ""
                            ) . "
                        ORDER BY 
                            " . ( !$orderBy ? 
                                " property.created_at DESC " : 
                                ( $orderBy['type'] != "precio" ? 
                                    " property.created_at ASC " : 
                                    " property.price " . ( $orderBy['order'] != "descendente" ? 
                                        "ASC " : "DESC " 
                                    ) 
                                ) 
                            ) . ( $relatedTo ? " LIMIT 4" : "" )
            );
            $query->bindParam( ":transaction", htmlspecialchars( strip_tags( $transaction ) ) );
            if( $type ) {
                $query->bindParam( ":type", htmlspecialchars( strip_tags( $type ) ) );
            }
            if( $rangeMunicipio ) {
                $query->bindParam( ":first", $rangeMunicipio['first'] );
                $query->bindParam( ":last", $rangeMunicipio['last'] );
            }
            if( $relatedTo ) {
                $query->bindParam( ":relatedProperty", $relatedTo );
            }
            $query->execute();
        
            if( $query->rowCount() > 0 ) {
                $response = [];
                while( $property = $query->fetch( PDO::FETCH_ASSOC ) ) {
                    array_push( $response, $this->getResume( $property['id'] ) );
                }
            }
        }

        return $response;
    }

    public function findByTransaction($transaction, $orderBy = false)
    {
        $response = false;
        $query = $this->connection->prepare(
            "SELECT 
                property.id 
                FROM 
                    property property 
                    INNER JOIN transaction transaction 
                        ON transaction.id = property.transaction_id 
                    WHERE 
                        transaction.slug = :transaction 
                    ORDER BY 
                        property.created_at DESC"
        );
        $query->bindParam(":transaction", htmlspecialchars(strip_tags($transaction)));
        $query->execute();
    
        if($query->rowCount() > 0) {
            $response = [];
            while($property = $query->fetch(PDO::FETCH_ASSOC)) {
                array_push($response, $this->getResume($property['id']));
            }
        }

        return $response;
    }

    public function findByFeatured()
    {
        $response = false;
        $query = $this->connection->prepare(
            "SELECT 
                property.id 
                FROM
                    property property 
                    INNER JOIN property_featured featured 
                        ON featured.property_id = property.id 
                    ORDER BY 
                        property.created_at DESC"
        );
        $query->execute();
    
        if($query->rowCount() > 0) {
            $response = [];
            while($featured = $query->fetch(PDO::FETCH_ASSOC)) {
                array_push($response, $this->getResume($featured['id']));
            }
        }

        return $response;
    }

    public function findIdBySlug($slug)
    {
        $response = false;
        
        list($transaction, $type, $estado, $municipio, $asentamiento, $propertySlug) = explode( "/", htmlspecialchars( strip_tags( $slug ) ) );

        $query = $this->connection->prepare(
            "SELECT 
                property.id 
                FROM 
                    property property 
                    INNER JOIN transaction transaction 
                        ON transaction.id = property.transaction_id 
                    INNER JOIN property_type type 
                        ON type.id = property.property_type_id 
                    INNER JOIN property_address address 
                        ON address.property_id = property.id 
                    INNER JOIN codigo_postal code 
                        ON code.id = address.codigo_postal_id 
                    WHERE 
                        transaction.slug = :transaction 
                        AND type.slug = :type 
                        AND code.slug = :asentamiento 
                        AND property.slug = :propertySlug"
        );
        $query->bindParam( ":transaction", $transaction );
        $query->bindParam( ":type", $type );
        $query->bindParam( ":asentamiento", $asentamiento );
        $query->bindParam( ":propertySlug", $propertySlug );
        $query->execute();
    
        if($query->rowCount() > 0) {
            $response = $query->fetchColumn();
        }

        return $response;
    }

    public function getProperty( $property = false, $editable = true )
    {
        $response = false;

        $numRows = null;
        if( $property ) {
            $query = $this->connection->prepare(
                "SELECT 
                    property.id, 
                    property.code, 
                    property.price, 
                    property.slug,
                    property.uuid,
                    property.description,
                    transaction.transaction, 
                    type.type 
                    " . ( $editable ?  
                        ", property.transaction_id, property.property_type_id " : 
                        ""
                    ) . " 
                    FROM 
                        property property 
                        INNER JOIN transaction transaction 
                            ON transaction.id = property.transaction_id 
                        INNER JOIN property_type type 
                            ON type.id = property.property_type_id 
                        WHERE 
                            property.id = :property"
            );
            $query->bindParam( ":property", $property );
    
            $query->execute();

            $numRows = $query->rowCount();
    
            if( $numRows > 0 ) {
                $response = $query->fetch( PDO::FETCH_ASSOC );
                $response['address'] = $this->getAddress( $response['id'], $editable );
                $response['images'] = $this->getImages( $response['id'], ["gallery"] );
            }
        }
        
        if( $editable ) {
            $response['transactions'] = $this->getTransactions();
            $response['types'] = $this->getTypes();
            $response['data'] = $this->getDataCategory( $property ? $response['id'] : false, $editable );
        } else {
            if( $numRows > 0 ) {
                if( !is_array( $response ) ) {
                    $response = [];
                }
                $response['data'] = $this->getDataCategory( $property ? $response['id'] : false, $editable );
            }
        }

        return $response;
    }

    public function getPropertyCountByTransaction()
    {
        $response = false;
        $query = $this->connection->prepare(
            "SELECT 
                transaction.transaction, 
                transaction.slug, 
                property.numberProperty countProperty 
                FROM transaction 
                    LEFT JOIN (
                        SELECT 
                            property.transaction_id, 
                            count(1) numberProperty 
                            FROM property 
                                WHERE 
                                    property.active = 1 
                                GROUP BY 
                                property.transaction_id
                    ) property 
                        ON property.transaction_id = transaction.id"
        );
        $query->execute();
        if( $query->rowCount() > 0 ) {
            $response = $query->fetchAll( PDO::FETCH_ASSOC );
        }

        return $response;
    }

    private function getResume($property)
    {
        $response = false;
        $query = $this->connection->prepare(
            "SELECT 
                type.type, 
                property.code, 
                property.price, 
                property.slug, 
                property.uuid, 
                transaction.transaction,
                IF(featured.id IS NOT NULL, true, false) featured
                FROM 
                    property property
                    INNER JOIN transaction transaction 
                        ON transaction.id = property.transaction_id 
                    INNER JOIN property_type type 
                        ON type.id = property.property_type_id 
                    LEFT JOIN property_featured featured 
                        ON featured.property_id = property.id 
                    WHERE 
                        property.id = :property"
        );
        $query->bindParam(":property", $property);
        $query->execute();

        if($query->rowCount() > 0) {
            $currentProperty = $query->fetch(PDO::FETCH_ASSOC);
            $cover = $this->getImages($property, ['cover']);
            $response = array_merge($currentProperty, $this->getSlug($property), ($cover ? $cover : ['cover' => null]));
        }

        return $response;
    }

    private function getSlug($property)
    {
        $response = false;
        $query = $this->connection->prepare(
            "SELECT 
                type.slug type_slug, 
                transaction.slug transaction_slug, 
                property.slug property_slug,
                address.codigo_postal_id 
                FROM 
                    property property 
                    INNER JOIN transaction transaction 
                        ON transaction.id = property.transaction_id 
                    INNER JOIN property_type type 
                        ON type.id = property.property_type_id 
                    INNER JOIN property_address address 
                        ON address.property_id = property.id 
                    WHERE 
                        property.id = :property"
        );
        $query->bindParam(":property", $property);
        $query->execute();

        if($query->rowCount() > 0) {

            $property = $query->fetch(PDO::FETCH_ASSOC);

            require_once('PostalCode.php');
            $PostalCode = new PostalCode($this->connection);
            $codigoPostal = $PostalCode->findById($property['codigo_postal_id']);

            $response = [
                'slug' => implode("/", [$property['transaction_slug'], $property['type_slug'], $codigoPostal['estado_slug'], $codigoPostal['municipio_slug'], $codigoPostal['postal_codes'][0]['slug'], $property['property_slug']]),
                'postal_code' => $codigoPostal
            ];
        }

        return $response;
    }

    private function getImages($property, $types = false)
    {
        $response = false;
        $query = $this->connection->prepare(
            "SELECT 
                type.type, 
                image.image, 
                image.description 
                FROM 
                    property_image image 
                    INNER JOIN property_image_type type 
                        ON type.id = image.property_image_type_id 
                    WHERE 
                        image.active = 1 
                        AND image.property_id = :property 
                        " . ($types ? " AND type.type IN (:types)" : "") 
        );
        $query->bindParam(":property", $property);
        if($types && is_array($types)) {
            $query->bindParam(":types", implode(",", $types));
        }
        $query->execute();

        if($query->rowCount() > 0) {
            $response = [];
            while($image = $query->fetch(PDO::FETCH_ASSOC)) {
                if(!array_key_exists($image['type'], $response)) {
                    $response[$image['type']] = [];
                }
                array_push($response[$image['type']], $image);
            }
        }

        return $response;
    }

    private function getAddress( $property, $editable )
    {
        $response = false;

        $query = $this->connection->prepare(
            "SELECT 
                address.street,
                address.number,
                address.indoor_number,
                address.latitude,
                address.longitude,
                address.zoom,
                address.map_image,
                address.codigo_postal_id
                FROM 
                    property_address address 
                    WHERE 
                        address.property_id = :property"
        );
        $query->bindParam( ":property", $property );
        $query->execute();
    
        if( $query->rowCount() > 0 ) {
            require_once( 'PostalCode.php' );
            $PostalCode = new PostalCode( $this->connection );
            $response = $query->fetch( PDO::FETCH_ASSOC );
            if( $editable ) {
                $response['postal_code'] = $PostalCode->findById( $response['codigo_postal_id'] );
            } else {
                $codigoPostal = $PostalCode->findById( $response['codigo_postal_id'] );
                $response['asentamiento'] = $codigoPostal['postal_codes'][0]['asentamiento'];
                $response['estado'] = $codigoPostal['estado'];
                $response['municipio'] = $codigoPostal['municipio'];
            }
        }
            

        return $response;
    }

    private function getDataCategory( $property, $editable )
    {
        $response = false;

        $query = $this->connection->prepare(
            "SELECT 
                category.id,
                category.category 
                FROM 
                    property_data_category category
                    ORDER BY 
                        category.category ASC"
        );
        $query->execute();

        if( $query->rowCount() > 0 ) {
            $response = [];
            while( $category = $query->fetch( PDO::FETCH_ASSOC ) ) {
                $response[$category['category']] = $this->getDataCatalogByCategory( $category['id'], $property, $editable );
            }
        }

        return $response;
    }

    private function getDataCatalogByCategory( $category, $property, $editable )
    {
        $response = false;

        $query = $this->connection->prepare(
            "SELECT 
                catalog.id, 
                catalog.catalog,
                catalogType.type,
                " . ( $editable ? 
                    "catalog.always_visible visible,
                    catalog.required,
                    catalogType.is_value,
                    catalogType.is_id,
                    IF(data.id IS NULL, NULL, data.data) value" : 
                    "data.data value" 
                ) . "
                
                FROM 
                    property_data_catalog catalog 
                    INNER JOIN property_data_catalog_type catalogType 
                        ON catalogType.id = catalog.property_data_catalog_type_id 
                    " . ( $editable ? "LEFT" : "INNER" ) . " JOIN property_data data 
                        ON data.property_data_catalog_id = catalog.id 
                        " . ( $property ? 
                            " AND data.property_id = :property " : 
                            " AND data.id IS NULL " 
                        ) . "
                    WHERE 
                        catalog.property_data_category_id = :category 
                    GROUP BY 
                        catalog.id"
        );
        $query->bindParam( ":category", $category );
        if( $property ) {
            $query->bindParam( ":property", $property );
        }
        $query->execute();
        if( $query->rowCount() > 0 ) {
            $response = [];
            while( $catalog = $query->fetch( PDO::FETCH_ASSOC ) ) {
                if( $editable ) {
                    $catalog['options'] = $this->getDataCatalogOptions( $catalog['id'] );
                } else {
                    $options = $this->getDataCatalogOptions( $catalog['id'] );
                    if( $options ) {
                        $indexSelected = array_search( $catalog['value'], array_column( $options, 'id' ) );
                        $catalog['value'] = $options[$indexSelected]['option'];
                    } else {
                        $catalog['value'] = ( $catalog['type'] != "Binario" ? $catalog['value'] : ( $catalog['value'] ? "Si" : "No" ) );
                    }
                    unset( $catalog['type'] );
                }
                $catalog['unit'] = $this->getDataCatalogUnit( $catalog['id'] );
                $catalog['icon'] = $this->getDataCatalogIcon( $catalog['id'] );
                array_push($response, $catalog);
            }
        }

        return $response;
    }

    private function getDataCatalogOptions( $catalog )
    {
        $response = false;
        $query = $this->connection->prepare(
            "SELECT 
                catalogOption.id, 
                catalogOption.choice 'option' 
                FROM 
                    property_data_catalog_option catalogOption 
                    WHERE 
                    catalogOption.property_data_catalog_id = :catalog"
        );
        $query->bindParam( ":catalog", $catalog );
        $query->execute();

        if( $query->rowCount() > 0 ) {
            $response = $query->fetchAll( PDO::FETCH_ASSOC );
        }

        return $response;
    }

    private function getDataCatalogUnit($catalog)
    {
        $response = false;
        $query = $this->connection->prepare(
            "SELECT 
                unit.unit 
                FROM 
                    property_data_unit unit 
                    INNER JOIN property_data_catalog_unit catalogUnit 
                        ON catalogUnit.property_data_unit_id = unit.id
                    WHERE 
                        catalogUnit.property_data_catalog_id = :catalog"
        );
        $query->bindParam(":catalog", $catalog);
        $query->execute();

        if($query->rowCount() > 0) {
            $response = $query->fetchColumn();
        }

        return $response;
    }

    private function getDataCatalogIcon($catalog)
    {
        $response = false;
        $query = $this->connection->prepare(
            "SELECT 
                icon.icon 
                FROM 
                    property_data_icon icon 
                    INNER JOIN property_data_catalog_icon catalogIcon 
                        ON catalogIcon.property_data_icon_id = icon.id 
                    WHERE 
                        catalogIcon.property_data_catalog_id = :catalog"
        );
        $query->bindParam(":catalog", $catalog);
        $query->execute();

        if($query->rowCount() > 0) {
            $response = $query->fetchColumn();
        }
        return $response;
    }

    private function getTransactions()
    {
        $response = false;
        $query = $this->connection->prepare(
            "SELECT 
                transaction.id,
                transaction.transaction,
                transaction.slug
                FROM 
                    transaction transaction
                    WHERE 
                        transaction.active = 1 
                    ORDER BY 
                        transaction.order ASC"
        );
        $query->execute();
        if($query->rowCount() > 0) {
            $response = $query->fetchAll(PDO::FETCH_ASSOC);
        }

        return $response;
    }

    private function getTypes()
    {
        $response = false;
        $query = $this->connection->prepare(
            "SELECT 
                type.id,
                type.type,
                type.slug
                FROM 
                    property_type type
                    WHERE 
                        type.active = 1 
                    ORDER BY 
                        type.order ASC"
        );
        $query->execute();
        if($query->rowCount() > 0) {
            $response = $query->fetchAll(PDO::FETCH_ASSOC);
        }

        return $response;
    }
}