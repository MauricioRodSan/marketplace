<?php

class Catalog {
    private $connection;

    public function __construct($db)
    {
        $this->connection = $db;
        $this->connection->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING );
    }

    public function getAll()
    {
        return [
            'type' => $this->getPropertyTypes(),
            'data' => $this->getPropertyDataCatalogs()
        ];
    }

    public function changes( $changes )
    {
        $response = [];

        if( isset( $changes['type'] ) ) {
            $response['type'] = $this->setPropertyTypes( $changes['type'] );
        }

        if( isset( $changes['data'] ) ) {
            $response['data'] = $this->setPropertyDataCatalogs( $changes['data'] );
        }

        return $response;
    }

    private function setPropertyTypes( $types )
    {
        $response = [
            'error' => []
        ];

        foreach ( $types as $type ) {
            if( !isset( $type['delete'] ) ) {
                $queryType = $this->connection->prepare(
                    ( isset( $type['id'] ) ? 
                        "UPDATE property_type SET type = :type, slug = :slug WHERE id = :id" : 
                        "INSERT INTO property_type(`type`, `slug`, `order`, `active`) VALUES (:type, :slug, :order, 1)"
                    )
                );
                $queryType->bindParam( ":type", $type['type'] );
                $queryType->bindParam( ":slug", $type['slug'] );
                if( isset( $type['id'] ) ) {
                    $queryType->bindParam( ":id", $type['id'] );
                } else {
                    $queryType->bindParam( ":order", $type['order'] );
                }
        
                if( !$queryType->execute() ) {
                    $response['error']['message'] = "Error al guardar el catálogo de tipo de inmueble";
                } else {
                    $response = false;
                }
            } else {

            }
        }

        return $response;
    }

    private function setPropertyDataCatalogs( $dataCatalogs )
    {
        $response = [
            'error' => []
        ];

        foreach ( $dataCatalogs as $dataCatalog ) {
            if( !isset( $dataCatalog['delete'] ) ) {
                $queryDataCatalog = $this->connection->prepare(
                    ( isset( $dataCatalog['id'] ) ? 
                        "UPDATE property_data_catalog SET " . implode( ", ", array_map( function( $key ) { return ( $key != "dataCatalogTypeId" ? $key : "property_data_catalog_type_id" ) . " = :" . $key; }, array_keys( array_filter( $dataCatalog, function( $key ) { return $key != "id"; }, ARRAY_FILTER_USE_KEY ) ) ) ) . " WHERE id = :id" : 
                        "INSERT INTO property_data_catalog(catalog, property_data_category_id, property_data_catalog_type_id) VALUES (:catalog, :dataCategoryId, :dataCatalogTypeId)")
                );
        
                if( isset( $dataCatalog['id'] ) ) {
                    foreach ( $dataCatalog as $key => $value ) {
                        $queryDataCatalog->bindValue( ":" . $key, $value );
                    }
                } else {
                    $queryDataCatalog->bindParam( ":catalog", $dataCatalog['catalog'] );
                    $queryDataCatalog->bindParam( ":dataCategoryId", $dataCatalog['dataCategoryId'] );
                    $queryDataCatalog->bindParam( ":dataCatalogTypeId", $dataCatalog['dataCatalogTypeId'] );
                }
        
                if( !$queryDataCatalog->execute() ) {
                    $response['error']['message'] = "Error al guardar el catálogo de información del inmueble";
                } else {
                    $response = false;
                }
            } else {

            }
        }

        return $response;
    }

    private function getPropertyTypes()
    {
        $response = false;

        $queryTypes = $this->connection->prepare(
            "SELECT 
                type.id, 
                type.type, 
                type.slug, 
                type.active 
                FROM 
                    property_type type
                    ORDER BY 
                        type.order ASC"
        );
        $queryTypes->execute();
        if( $queryTypes->rowCount() > 0 ) {
            $response = [];
            while( $type = $queryTypes->fetch( PDO::FETCH_ASSOC ) ) {
                array_push( $response, array_merge( $type, [ 'canChange' => $this->canChangePropertyType( $type['id'] ) == 0 ] ) );
            }
        }

        return $response;
    }

    private function getPropertyDataCatalogs()
    {
        $response = [];

        $queryCategorys = $this->connection->prepare( 
            "SELECT 
                category.id, 
                category.category 
                FROM 
                    property_data_category category
                    ORDER BY 
                        category.category ASC"
        );
        $queryCategorys->execute();
        if( $queryCategorys->rowCount() > 0 ) {
            while( $category = $queryCategorys->fetch( PDO::FETCH_ASSOC ) ) {
                $response[$category['category']] = [
                    'id' => $category['id'],
                    'data' => $this->getPropertyDataCatalogByCategory( $category['id'] )
                ];
            }
        }

        $queryCatalogTypes = $this->connection->prepare(
            "SELECT 
                id, 
                type 
                FROM 
                    property_data_catalog_type"
        );
        $queryCatalogTypes->execute();
        if( $queryCatalogTypes->rowCount() > 0 ) {
            $response['type'] = $queryCatalogTypes->fetchAll( PDO::FETCH_ASSOC );
        }

        return $response;
    }

    private function getPropertyDataCatalogByCategory( $category )
    {
        $response = false;

        $query = $this->connection->prepare(
            "SELECT 
                catalog.id,
                catalog.catalog,
                catalog.property_data_catalog_type_id dataCatalogTypeId 
                FROM 
                    property_data_catalog catalog 
                    WHERE 
                        catalog.property_data_category_id = :category"
        );
        $query->bindParam( ":category", $category );
        $query->execute();
        if( $query->rowCount() > 0 ) {
            $response = [];
            while( $dataCatalog = $query->fetch( PDO::FETCH_ASSOC ) ) {
                array_push( $response, array_merge( $dataCatalog, [ 'canChange' => $this->canChangeDataCatalogType( $dataCatalog['id'] ) == 0 ] ) );
            }
        }

        return $response;
    }

    private function canChangePropertyType( $type )
    {
        $query = $this->connection->prepare(
            "SELECT 
                COUNT(property.id) 
                FROM 
                    property 
                    WHERE 
                        property.property_type_id = :type"
        );
        $query->bindParam( ":type", $type );
        $query->execute();
        return $query->fetchColumn();
    }

    private function canChangeDataCatalogType( $dataCatalog )
    {
        $query = $this->connection->prepare(
            "SELECT 
                COUNT(data.id) 
                FROM 
                    property_data data
                    WHERE 
                        data.property_data_catalog_id = :dataCatalog"
        );
        $query->bindParam( ":dataCatalog", $dataCatalog );
        $query->execute();
        return $query->fetchColumn();
    }
}