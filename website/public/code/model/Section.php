<?php

class Section {
    private $connection;

    public function __construct($db)
    {
        $this->connection = $db;
    }

    public function findByPage($page, $withEditable = false)
    {
        $response = false;

        // $this->connection->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING );

        $query = $this->connection->prepare(
            "SELECT 
                section.id, 
                section.slug, 
                pageSection.order 
                FROM 
                    page_section pageSection 
                    INNER JOIN page page 
                        ON page.id = pageSection.page_id 
                    INNER JOIN section section 
                        ON section.id = pageSection.section_id 
                    WHERE 
                        page.slug = :slug 
                    ORDER BY 
                        pageSection.order ASC"
                    
        );
        $query->bindParam(":slug", htmlspecialchars(strip_tags($page)));
        $query->execute();

        if($query->rowCount() > 0) {
            $response = [];

            require_once('Content.php');
            $Content = new Content($this->connection);

            while($section = $query->fetch(PDO::FETCH_ASSOC)) {
                $positions = $this->getPositions($section['id']);
                $slug = (strpos($section['slug'], "-") === false ? $section['slug'] : str_replace("-", "_", $section['slug']));
                if(!$positions) {
                    $response[$slug] = $Content->findBySection($section['id'], $withEditable);
                } else {
                    $response[$slug] = [];
                    foreach ($positions as $position) {
                        $response[$slug][$position['position']] = $Content->findBySection($section['id'], $withEditable, $position['id']);
                    }
                }
            }
        }

        return $response;
    }

    private function getPositions($section)
    {
        $response = false;

        $query = $this->connection->prepare(
            "SELECT 
                section_position.id, 
                section_position.position 
                FROM 
                    section_position 
                    WHERE 
                        section_position.section_id = :section"
        );
        $query->bindParam(":section", $section);
        $query->execute();

        if($query->rowCount() > 0) {
            $response = $query->fetchAll(PDO::FETCH_ASSOC);
        }

        return $response;
    }
}