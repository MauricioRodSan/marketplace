<?php

class Content {
    private $connection;

    public function __construct( $db )
    {
        $this->connection = $db;
        $this->connection->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING );
    }

    public function setContent( $contents )
    {
        $response = [];
        foreach ( $contents as $content ) {
            $query = $this->connection->prepare(
                "UPDATE 
                    content 
                    SET 
                        content = :content 
                    WHERE 
                        id = :id"
            );
            $query->bindParam( ":content", $content['content'] );
            $query->bindParam( ":id", $content['id'] );
    
            if( !$query->execute() ) {
                $response['error'] = [
                    'message' => "Error al actualizar el contenido"
                ];
            }
        }
        return $response;
    }

    public function findBySection( $section, $withEditable = false, $sectionPosition = false )
    {
        $response = false;

        $query = $this->connection->prepare(
            "SELECT 
                content.id,
                content.content, 
                content.order,
                content.markup 
                FROM 
                    content 
                    WHERE 
                        content.content_id IS NULL  
                        AND content.section_id = :section 
                        " . ($sectionPosition ? 
                            "AND content.section_position_id = :position" : 
                            ""
                        ) . " 
                    ORDER BY 
                        content.order ASC"
        );
        $query->bindParam( ":section", $section );
        if( $sectionPosition ) {
            $query->bindParam(":position", $sectionPosition);
        }
        $query->execute();

        // echo '<p>' . $section . ' ' . $query->rowCount() . '</p>';

        if( $query->rowCount() > 0 ) {
            $response = [];

            while( $content = $query->fetch( PDO::FETCH_ASSOC ) ) {
                array_push( $response, $this->getContent( $content, $withEditable ) );
            }
        }

        return $response;
    }

    public function getContent($content, $withEditable = false, $verifyWithContent = true)
    {
        $response = $content;

        // echo '<p>' , var_dump($response) , '</p>';

        if($withEditable) {
            $response['editable'] = $this->getEditable($content['id']);
        }

        if($verifyWithContent) {
            $withContent = $this->withContent($response['id'], $withEditable);
            if($withContent) {
                $response['contents'] = $withContent;
            }
        }

        /*$query = $this->connection->prepare(
            "SELECT 
                content.id,
                content.content, 
                content.order,
                content.markup
                FROM 
                    content 
                    WHERE 
                        id = :content"
        );
        $query->bindParam(":content", $content);
        $query->execute();

        if($query->rowCount() > 0) {
            
            $response = $query->fetch(PDO::FETCH_ASSOC);

            if($withEditable) {
                $response['editable'] = $this->getEditable($content);
            }

            if($verifyWithContent) {
                $withContent = $this->withContent($response['id'], $withEditable);
                $response['contents'] = $withContent;
            }
        }*/

        return $response;
    }

    private function withContent($content, $withEditable)
    {
        $response = false;

        $query = $this->connection->prepare(
            "SELECT 
                content.id,
                content.content, 
                content.order,
                content.markup   
                FROM 
                    content 
                    WHERE 
                        content_id = :content 
                    ORDER BY 
                        content.order ASC"
        );
        $query->bindParam(":content", $content);
        $query->execute();

        if($query->rowCount() > 0) {
            $response = [];
            while($content = $query->fetch(PDO::FETCH_ASSOC)) {

                $currentContent = $this->getContent($content, $withEditable, false);

                $withContent = $this->withContent($content['id'], $withEditable);
                if($withContent) {
                    $currentContent['contents'] = $withContent;
                }

                array_push($response, $currentContent);
            }
        }

        return $response;
    }

    private function getEditable($content)
    {
        $response = false;

        $query = $this->connection->prepare(
            "SELECT 
                editableType.type,
                editable.options 
                FROM 
                    editable editable 
                    INNER JOIN content content 
                        ON content.id = editable.content_id 
                    INNER JOIN editable_type editableType 
                        ON editableType.id = editable.editable_type_id 
                    WHERE 
                        content.id = :content"
        );
        $query->bindParam(":content", $content);
        $query->execute();

        if($query->rowCount() > 0) {
            $response = $query->fetch(PDO::FETCH_ASSOC);
        }

        return $response;
    }
    
}