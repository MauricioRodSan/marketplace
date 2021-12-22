<?php

class Property {
    private $connection;

    public function __construct($db)
    {
        $this->connection = $db;
        $this->connection->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING );
    }

    public function changes($property, $changes, $edit = false)
    {
        $response = [];

        if( isset( $changes['address']['street'] ) || isset( $changes['address']['number'] ) || isset( $changes['address']['indoor_number'] ) ) {
            require_once( __DIR__ . "/../Utils.php" );
            $Utils = new Utils();

            if( !$edit ) {
                $changes['general']['slug'] = $Utils->generateSlug( 
                    $changes['address']['street'] . " " . $changes['address']['number'] . ( 
                        $changes['address']['indoor_number'] != "null" ? 
                            " " . $changes['address']['indoor_number'] : "" 
                        ) 
                );
            } else {
                $address = $this->getAddresForSlug( $property );
                $changes['general']['slug'] = $Utils->generateSlug( 
                    ( isset( $changes['address']['street'] ) ? 
                        $changes['address']['street'] : 
                        $address['street'] 
                    ) . " " . 
                    ( isset( $changes['address']['number'] ) ? 
                        $changes['address']['number'] : 
                        $address['number'] 
                    ) . 
                    ( isset( $changes['address']['indoor_number'] ) ?
                        ( $changes['address']['indoor_number'] != "" ? 
                            " " . $changes['address']['indoor_number'] : 
                            "" 
                        ) : 
                        ( $address['indoor_number'] ? 
                            " " . $address['indoor_number'] : 
                            "" 
                        ) 
                    ) 
                );
            }
        }

        if( isset( $changes['general'] ) ) {
            $response['general'] = $this->setGeneral( $property, $changes['general'] );
            if( isset( $response['general']['property'] ) ) {
                $property = $response['general']['property'];
            }
        }

        if( isset( $changes['information'] ) ) {
            $response['information'] = $this->setInformation( $property, $changes['information'] );
        }
        
        if( isset( $changes['address'] ) ) {
            $response['address'] = $this->setAddress( $property, $changes['address'], $edit );
        }

        if( isset( $changes['gallery'] ) ) {
            $response['gallery'] = $this->setGallery( $property, $changes['gallery'] );
        }

        if( isset( $changes['propertys'] ) ) {
            $response['propertys'] = $this->setResume( $changes['propertys'] );
        }

        return $response;
    }

    private function setGeneral( $property, $general )
    {
        $response = [];
        if( !$property ) {
            require_once( __DIR__ . "/../Utils.php" );
            $Utils = new Utils();
            $general['uuid'] = $Utils->generateUUID();

            mkdir( $Utils->getPropertyDirectory() . $general['uuid'] );

            $queryText = "
                INSERT INTO 
                    property (
                        " . implode( ",", array_keys( $general ) ) . "
                    ) VALUES (
                        :" . implode( ", :", array_keys( $general ) ) . "
                    )";
        } else {
            $queryText = "
                UPDATE 
                    property 
                        SET " . implode( ", ", array_map( function( $key ) { return $key . " = :" . $key; }, array_keys( $general ), $general ) ) . " 
                        WHERE 
                            id = :property";
        }

        $query = $this->connection->prepare( $queryText );
        foreach ( $general as $key => $value ) {
            $query->bindValue( ":" . $key, $value );
        }
        if( $property ) {
            $query->bindParam( ":property", $property );
        }

        if( !$query->execute() ) {
            $response['error'] = [
                'message' => "Error al guardar la información general"
            ];
        }
        
        if( !$property ) {
            $response['property'] = $this->connection->lastInsertId();
        }

        return $response;
    }

    private function setInformation($property, $information)
    {
        $response = [
            'error' => []
        ];
        foreach ( $information as $current ) {
            if( !isset( $current['delete'] ) ) {
                $newOptionId = false;
                $errorInNewOption = false;
                if( isset( $current['is_new_option'] ) && $current['is_new_option'] ) {    
                    $queryNewOption = $this->connection->prepare(
                        "INSERT INTO property_data_catalog_option (choice, property_data_catalog_id) VALUES (:choice, :dataCatalogId)"
                    );
                    $queryNewOption->bindParam( ":choice", htmlspecialchars( strip_tags( $current['value'] ) ) );
                    $queryNewOption->bindParam( ":dataCatalogId", $current['id'] );
                    if( $queryNewOption->execute() ) {
                        $newOptionId = $this->connection->lastInsertId();
                    } else {
                        $response['error']['new_option'] = [
                            'message' => "Error al agregar la nueva opción"
                        ];
                        $errorInNewOption = true;
                    }
                }

                if( !$errorInNewOption ) {
                    $query = $this->connection->prepare(
                        $current['property_data_id'] ? 
                            "UPDATE property_data SET data = :data WHERE id = :id" : 
                            "INSERT INTO property_data (data, property_id, property_data_catalog_id) VALUES (:data, :propertyId, :dataCatalogId)"
                    );
                    $query->bindParam( ":data", !$newOptionId ? htmlspecialchars( strip_tags( $current['value'] ) ) : $newOptionId );
                    if( $current['property_data_id'] ) {
                        $query->bindParam( ":id", $current['property_data_id'] );
                    } else {
                        $query->bindParam( ":propertyId", $property );
                        $query->bindParam( ":dataCatalogId", $current['id'] );
                    }
    
                    if( !$query->execute() ) {
                        $response['error']['add_data'] = [
                            'message' => "Error al guardar la información"
                        ];
                    }
                }
            } else {
                $queryDelete = $this->connection->prepare(
                    "DELETE FROM property_data WHERE id = :id"
                );
                $queryDelete->bindParam( ":id", $current['property_data_id'] );
                
                if( !$queryDelete->execute() ) {
                    $response['error']['delete_data'] = [
                        'message' => "Error al borrar la información"
                    ];
                }
            }
        }

        if( count( $response['error'] ) == 0 ) {
            $response = false;
        }

        return $response;
    }

    private function setAddress($property, $address, $edit)
    {
        $response = [];
        if( isset( $address['map_image'] ) ) {
            require_once( __DIR__ . "/../Utils.php" );
            $Utils = new Utils();

            $imageName = 'map-image.jpg' ;

            $Utils->moveFile( 
                $Utils->getTempDirectory() . $address['map_image'], 
                $Utils->getPropertyDirectory() . $this->getUUID($property) . "/" . $imageName
            );

            $address['map_image'] = $imageName;
        }

        $queryText = null;
        if( !$edit ) {
            $address['property_id'] = $property;
            $queryText = "
                INSERT INTO 
                    property_address (
                            " . implode( ",", array_keys( $address ) ) . "
                        ) VALUES (
                            :" . implode( ", :", array_keys( $address ) ) . "
                        )";
        } else {
            $queryText = "
                UPDATE 
                    property_address 
                        SET " . implode( ", ", array_map( function( $key ) { return $key . " = :" . $key; }, array_keys( $address ), $address ) ) . " 
                        WHERE 
                            property_id = :property";
        }

        $query = $this->connection->prepare( $queryText );
        foreach ( $address as $key => $value ) {
            $query->bindValue( $key, $value );
        }
        if($edit) {
            $query->bindParam( ":property", $property );
        }
        if( !$query->execute() ) {
            $response['error'] = [
                'message' => "Error al guardar la información de la dirección"
            ];
        }

        return $response;
    }

    private function setGallery($property, $gallery)
    {
        $response = [
            'error' => []
        ];

        require_once( __DIR__ . "/../Utils.php" );
        $Utils = new Utils();

        foreach ( $gallery as $image ) {
            if( isset( $image['id'] ) ) {
                if( !isset( $image['delete'] ) ) {

                    if( isset( $image['is_cover'] ) ) {
                        $currentCover = $this->getImages( $property, ["cover"] );
                        $imageName = $this->getImageName( $image['id'] );

                        $queryCover = $this->connection->prepare(
                            $currentCover ? 
                                "UPDATE property_image SET image = :image WHERE id = :id" : 
                                "INSERT INTO property_image (`image`, `description`, `order`, `active`, `property_id`, `property_image_type_id`) VALUES (:image, null, 1, 1, :property, 1)"
                        );
                        $queryCover->bindParam( ":image", $imageName );
                        if( $currentCover ) {
                            $queryCover->bindParam( ":id", $currentCover['cover'][0]['id'] );
                        } else {
                            $queryCover->bindParam( ":property", $property );
                        }

                        if( !$queryCover->execute() ) {
                            $response['error']['cover'] = [
                                'message' => "Error al establecer la imagen como portada"
                            ];
                        }

                        unset( $image['is_cover'] );
                    }

                    if( count( $image ) > 1 ) {
                        $parameters = array_filter( $image, function( $key ) { return $key != 'id'; }, ARRAY_FILTER_USE_KEY );
                        $queryText = "
                            UPDATE 
                                property_image 
                                    SET " . implode( ", ", array_map( function( $key ) { return $key . " = :" . $key; }, array_keys( $parameters ), $parameters ) ) . "
                                    WHERE 
                                        id = :id";

                        $queryEdit = $this->connection->prepare( $queryText );
                        foreach($parameters as $key => $value) {
                            $queryEdit->bindParam( ":". $key, $value );
                        }
                        $queryEdit->bindParam( ":id", $image['id'] );
                        if( !$queryEdit->execute() ) {
                            $response['error']['edit_image'] = [
                                'message' => "Error al editar la imagen"
                            ];
                        }
                    }
                } else {
                    $imageName = $this->getImageName( $image['id'] );

                    if( $imageName ) {
                        if( $Utils->deleteFile( $Utils->getPropertyDirectory() . $this->getUUID($property) . "/" . $imageName ) ) {
                            $queryDelete = $this->connection->prepare(
                                "DELETE FROM property_image WHERE id = :id"
                            );
                            $queryDelete->bindParam( ":id", $image['id'] );
                            if( !$queryDelete->execute() ) {
                                $response['error']['delete_image'] = [
                                    'message' => "Error al borrar la imagen"
                                ];
                            }

                            $currentCover = $this->getImages( $property, ["cover"] );
                            if( $currentCover ) {
                                if( $currentCover['cover'][0]['image'] == $imageName ) {
                                    $queryDeleteCover = $this->connection->prepare(
                                        "DELETE FROM property_image WHERE id = :id"
                                    );
                                    $queryDeleteCover->bindParam( ":id", $image['id'] );
                                    if( !$queryDeleteCover->execute() ) {
                                        $response['error']['delete_cover'] = [
                                            'message' => "Error al borrar la imagen de portada"
                                        ];
                                    }
                                }
                            }
                        }
                    }
                }
            } else {
                $imageTempDirectory = array_slice( explode( "/", $image['image'] ), -2, 1 )[0];
                $Utils->moveFile( 
                    $Utils->getTempDirectory() . $imageTempDirectory. "/" . $image['name'], 
                    $Utils->getPropertyDirectory() . $this->getUUID($property) . "/" . $image['name']
                );

                $parameters = [
                    'image' => $image['name'],
                    'description' => $image['description'] != "null" ? $image['description'] : null,
                    'order' => $image['order'],
                    'active' => $image['active'],
                    'property_id' => $property,
                    'property_image_type_id' => 2
                ];
                $queryText = "
                    INSERT INTO property_image (
                        `" . implode( "`, `", array_keys( $parameters ) ) . "`
                        ) VALUES (
                            :" . implode( ", :", array_keys( $parameters ) ) . "
                        )
                ";

                $queryAdd = $this->connection->prepare( $queryText );
                foreach( $parameters as $key => $value ) {
                    $queryAdd->bindValue( $key, $value );
                }

                if( !$queryAdd->execute() ) {
                    $response['error']['add_image'] = [
                        'message' => "Error al agregar la imagen"
                    ];
                }
            }
        }

        if( count( $response['error'] ) == 0 ) {
            $response = false;
        }

        return $response;
    }

    private function setResume( $propertys )
    {
        $response = [
            'error' => []
        ];

        foreach ( $propertys as $property ) {
            if( isset( $property['featured'] ) ) {
                $property['featured'] = filter_var( $property['featured'], FILTER_VALIDATE_BOOLEAN );
                $queryText = $property['featured'] ? 
                    "INSERT INTO property_featured (property_id) VALUES (:property)" : 
                    "DELETE FROM property_featured WHERE property_id = :property" 
                ;
                $queryFeatured = $this->connection->prepare( $queryText );
                $queryFeatured->bindParam( ":property", $property['id'] );
                if( !$queryFeatured->execute() ) {
                    $response['error']['featured'] = [
                        'message' => "Error al destacar o no destacar el inmueble"
                    ];
                }
            }
    
            if( isset( $property['active'] ) ) {
                $queryActive = $this->connection->prepare(
                    "UPDATE property SET active = :active WHERE id = :property"
                );
                $queryActive->bindParam( ":active", $property['active'] );
                $queryActive->bindParam( ":property", $property['id'] );
                if( !$queryActive->execute() ) {
                    $response['error']['active'] = [
                        'message' => "Error al activar o desactivar el inmueble"
                    ];
                }
            }
        }

        if( count( $response['error'] ) == 0 ) {
            $response = false;
        }

        return $response;
    }

    public function findAll()
    {
        $response = false;
        $query = $this->connection->prepare(
            "SELECT 
                property.id
                FROM
                    property property 
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

    public function findIdByUUID( $uuid )
    {
        $response = false;

        $query = $this->connection->prepare(
            "SELECT 
                property.id 
                FROM 
                    property property 
                    WHERE 
                        property.uuid = :uuid"
        );
        $query->bindParam( ":uuid", htmlspecialchars( strip_tags( $uuid ) ) );
        $query->execute();
    
        if( $query->rowCount() > 0 ) {
            $response = $query->fetchColumn();
        }

        return $response;
    }

    public function getSearchByTransaction($transaction)
    {
        $response = false;
        $query = $this->connection->prepare(
            "SELECT 
                type.id type_id,
                type.type,
                type.slug,
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
                        property.active = 1 
                        AND transaction.slug = :transaction 
                    GROUP BY 
                        address.codigo_postal_id"
        );
        $query->bindParam( ":transaction", htmlspecialchars( strip_tags( $transaction ) ) );
        $query->execute();
    
        if( $query->rowCount() > 0 ) {
            $response = [];
            require_once( 'PostalCode.php' );
            $PostalCode = new PostalCode( $this->connection );

            while( $property = $query->fetch( PDO::FETCH_ASSOC ) ) {
                $codigoPostal = $PostalCode->findById( $property['codigo_postal_id'] );

                $indexType = array_search( $property['type_id'], array_column( $response, 'type_id' ) );
                // echo 'type: ' . $property['type_id'] . ' index: ' ,  var_dump($indexType);

                if( $indexType === false ) {
                    array_push( $response, [
                        'type_id' => $property['type_id'],
                        'type' => $property['type'],
                        'slug' => $property['slug'],
                        'estados' => [
                            [
                                'estado' => $codigoPostal['estado'],
                                'slug' => $codigoPostal['estado_slug'],
                                'municipios' => [
                                    [
                                        'municipio' => $codigoPostal['municipio'],
                                        'slug' => $codigoPostal['municipio_slug']
                                    ]
                                ]
                            ]
                        ]
                    ] );
                } else {
                    $indexEstado = array_search( $codigoPostal['estado_slug'], array_column( $response[$indexType]['estados'], 'slug' ) );
                    // echo 'estado: ' . $codigoPostal['estado_slug'] . ' index: ' ,  var_dump($indexEstado);

                    if( $indexEstado === false ) {
                        array_push( $response[$indexType]['estados'], [
                            'estado' => $codigoPostal['estado'],
                            'slug' => $codigoPostal['estado_slug'],
                            'municipios' => [
                                [
                                    'municipio' => $codigoPostal['municipio'],
                                    'slug' => $codigoPostal['municipio_slug']
                                ]
                            ]
                        ] );
                    } else {
                        $indexMunicipio = array_search( $codigoPostal['estado_slug'], array_column( $response[$indexType]['estados'][$indexEstado]['municipios'], 'municipio_slug' ) );
                        // echo 'municipio: ' . $codigoPostal['estado_slug'] . ' index: ' ,  var_dump($indexEstado);

                        if( $indexMunicipio === false ) {
                            array_push( $response[$indexType]['estados'][$indexEstado]['municipios'], [
                                'municipio' => $codigoPostal['municipio'],
                                'slug' => $codigoPostal['municipio_slug']
                            ] );
                        }
                    }
                }
            }

            usort( $response, function( $a, $b ) {
                return strcmp( $a['slug'], $b['slug'] );
            } );

            for ( $i = 0; $i < count( $response ); $i++ ) { 
                usort( $response[$i]['estados'], function( $a, $b ) {
                    return strcmp( $a['slug'], $b['slug'] );
                } );

                for( $j = 0; $j < count( $response[$i]['estados'] ); $j++ ) {
                    usort( $response[$i]['estados'][$j]['municipios'], function( $a, $b ) {
                        return strcmp( $a['slug'], $b['slug'] );
                    } );
                }
            }
        }

        return $response;
    }

    public function getSearchByType($type)
    {
        $response = false;
        $query = $this->connection->prepare(
            "SELECT 
                address.codigo_postal_id 
                FROM 
                    property property 
                    INNER JOIN property_type type 
                        ON type.id = property.property_type_id 
                    INNER JOIN property_address address 
                        ON address.property_id = property.id 
                    WHERE 
                        type.id = :type"
        );
        $query->bindParam(":type", htmlspecialchars(strip_tags($type)));
        $query->execute();
    
        if($query->rowCount() > 0) {
            $response = [];
            require_once('PostalCode.php');
            $PostalCode = new PostalCode($this->connection);
            while($property = $query->fetch(PDO::FETCH_ASSOC)) {
                $codigoPostal = $PostalCode->findById($property['codigo_postal_id']);

                $indexEstado = array_search( $codigoPostal['estado'], array_column( $response, 'estado' ) );
                if( $indexEstado === false) {
                    array_push( $response, [
                        'estado' => $codigoPostal['estado'],
                        'slug' => $codigoPostal['estado_slug'],
                        'municipios' => [
                            [
                                'municipio' => $codigoPostal['municipio'],
                                'slug' => $codigoPostal['municipio_slug']
                            ]
                        ]
                    ] );
                } else {
                    $indexMunicipio = array_search( $codigoPostal['municipio'], array_column( $response[$indexEstado]['municipios'], 'municipio' ));
                    if( $indexMunicipio === false ) {
                        array_push( $response[$indexEstado]['municipios'], [
                            'municipio' => $codigoPostal['municipio'],
                            'slug' => $codigoPostal['municipio_slug']
                        ] );
                    }
                }
            }
        }

        return $response;
    }

    public function getProperty( $property = false, $editable = false )
    {
        $response = [];

        if($property) {
            $query = $this->connection->prepare(
                "SELECT 
                    property.id, 
                    property.code, 
                    property.price, 
                    property.slug,
                    property.uuid,
                    property.description,
                    property.transaction_id,
                    property.property_type_id 
                    " . (!$editable ?  
                        ", transaction.transaction, type.type" : 
                        ""
                    ) . " 
                    FROM 
                        property property 
                        " . (!$editable ? 
                            " INNER JOIN transaction transaction ON transaction.id = property.transaction_id INNER JOIN property_type type ON type.id = property.property_type_id " : 
                            ""
                        ) . "
                        WHERE 
                            property.id = :property"
            );
            $query->bindParam( ":property", $property );
    
            $query->execute();
    
            if($query->rowCount() > 0) {
                $response = $query->fetch( PDO::FETCH_ASSOC );
                $response['price'] = number_format( $response['price'], 2, ".", "," );
                $response['address'] = $this->getAddress( $response['id'] );
                $response['images'] = $this->getImages( $response['id'], ["gallery"], $editable );
            }
        }
        
        if( $editable ) {
            $response['transactions'] = $this->getTransactions();
            $response['types'] = $this->getTypes();
        }

        $response['data'] = $this->getDataCategory( $property ? $response['id'] : false );

        return $response;
    }

    public function getResume($property)
    {
        $response = false;
        $query = $this->connection->prepare(
            "SELECT 
                type.type, 
                property.id, 
                property.code, 
                property.price, 
                property.slug, 
                property.uuid, 
                property.active, 
                transaction.transaction,
                IF(featured.id IS NOT NULL, true, null) featured
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

    private function getUUID($property)
    {
        $response = false;
        $query = $this->connection->prepare(
            "SELECT 
                property.uuid 
                FROM 
                    property property 
                    WHERE 
                        property.id = :property"
        );
        $query->bindParam(":property", $property);
        $query->execute();

        if($query->rowCount() > 0) {
            $response = $query->fetchColumn();
        }

        return $response;
    }

    private function getImages( $property, $types = false, $editable = false )
    {
        $response = false;
        $query = $this->connection->prepare(
            "SELECT 
                image.id, 
                type.type, 
                image.image, 
                image.description,
                image.order, 
                image.active
                " . ( $editable ? 
                    ", IF(imageCover.id IS NULL, 0 , 1) is_cover" : 
                    ""
                ) . "
                FROM 
                    property_image image 
                    INNER JOIN property_image_type type 
                        ON type.id = image.property_image_type_id 
                    " . ( $editable ? 
                            " LEFT JOIN property_image imageCover ON imageCover.image = image.image AND imageCover.property_image_type_id = 1 " : 
                            "" 
                        ) . "
                    WHERE 
                        image.property_id = :property 
                        " . ($types ? " AND type.type IN (:types)" : "") . " 
                    ORDER BY 
                        image.order ASC"
        );
        $query->bindParam( ":property", $property );
        if( $types && is_array( $types ) ) {
            $query->bindParam( ":types", implode( ",", $types ) );
        }
        $query->execute();

        if( $query->rowCount() > 0 ) {
            $response = [];
            while( $image = $query->fetch( PDO::FETCH_ASSOC ) ) {
                if( !array_key_exists( $image['type'], $response ) ) {
                    $response[$image['type']] = [];
                }
                array_push( $response[$image['type']], $image );
            }
        }

        return $response;
    }

    private function getImageName( $image )
    {
        $response = false;
        $query = $this->connection->prepare(
            "SELECT 
                image 
                FROM 
                    property_image 
                    WHERE 
                        id = :id"
        );
        $query->bindParam( ":id", $image );
        $query->execute();
        if( $query->rowCount() > 0 ) {
            $response = $query->fetchColumn();
        }
        return $response;
    }

    private function getAddress($property)
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
        $query->bindParam(":property", $property);
        $query->execute();
    
        if($query->rowCount() > 0) {
            require_once('PostalCode.php');
            $PostalCode = new PostalCode($this->connection);
            $response = $query->fetch(PDO::FETCH_ASSOC);
            $response['postal_code'] = $PostalCode->findById($response['codigo_postal_id']);
        }

        return $response;
    }

    private function getAddresForSlug( $property )
    {
        $response = false;

        $query = $this->connection->prepare(
            "SELECT 
                address.street,
                address.number,
                address.indoor_number 
                FROM 
                    property_address address 
                    WHERE 
                        address.property_id = :property"
        );
        $query->bindParam( ":property", $property );
        $query->execute();

        if( $query->rowCount() > 0 ) {
            $response = $query->fetch( PDO::FETCH_ASSOC );
        }

        return $response;
    }

    private function getDataCategory($property)
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

        if($query->rowCount() > 0) {
            $response = [];
            while($category = $query->fetch(PDO::FETCH_ASSOC)) {
                $response[$category['category']] = $this->getDataCatalogByCategory($category['id'], $property);
            }
        }

        return $response;
    }

    private function getDataCatalogByCategory($category, $property)
    {
        $response = false;

        $query = $this->connection->prepare(
            "SELECT 
                catalog.id, 
                catalog.catalog,
                catalog.always_visible visible,
                catalog.required,
                catalogType.type,
                catalogType.is_value,
                catalogType.is_id,
                IF(data.id IS NULL, NULL, data.id) property_data_id,
                IF(data.id IS NULL, NULL, data.data) value
                FROM 
                    property_data_catalog catalog 
                    INNER JOIN property_data_catalog_type catalogType 
                        ON catalogType.id = catalog.property_data_catalog_type_id 
                    LEFT JOIN property_data data 
                        ON data.property_data_catalog_id = catalog.id 
                        " . ($property ? " AND data.property_id = :property " : " AND data.id IS NULL ") . "
                    WHERE 
                        catalog.property_data_category_id = :category 
                    GROUP BY 
                        catalog.id"
        );
        $query->bindParam(":category", $category);
        if($property) {
            $query->bindParam(":property", $property);
        }
        $query->execute();
        if($query->rowCount() > 0) {
            $response = [];
            while($catalog = $query->fetch(PDO::FETCH_ASSOC)) {
                $catalog['options'] = $this->getDataCatalogOptions($catalog['id']);
                $catalog['unit'] = $this->getDataCatalogUnit($catalog['id']);
                $catalog['icon'] = $this->getDataCatalogIcon($catalog['id']);
                array_push($response, $catalog);
            }
            // $response = $query->fetchAll(PDO::FETCH_ASSOC);
        }

        return $response;
    }

    private function getDataCatalogOptions($catalog)
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
        $query->bindParam(":catalog", $catalog);
        $query->execute();

        if($query->rowCount() > 0) {
            $response = $query->fetchAll(PDO::FETCH_ASSOC);
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