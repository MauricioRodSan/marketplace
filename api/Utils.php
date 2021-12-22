<?php

class Utils {
    
    private $tempDirectory = __DIR__ . "/../public/assets/img/temp/";
    private $propertyDirectory = __DIR__ . "/../public/assets/img/inmuebles/";

    public function cleanTemp( $todayDate )
    {
        foreach( glob( $this->tempDirectory . "*", GLOB_ONLYDIR ) as $directory ) {
            if( substr( $directory, -10 ) != $todayDate->format( "d-m-Y" ) ) {
                foreach( glob( $directory . "/*" ) as $file ) {
                    if( !is_dir( $file ) ) {
                        unlink( $file );
                    }
                }
                rmdir( $directory );
            }
        }
    }

    public function generateUUID()
    {
        return sprintf(
            "%04x%04x-%04x-%04x",
            mt_rand( 0, 0xffff ),
            mt_rand( 0, 0xffff ),
            mt_rand( 0, 0x0fff ) | 0x4000,
            mt_rand( 0, 0x3fff ) | 0x8000
        );
    }

    public function generateRandom()
    {
        return sprintf( 
            "%04x-%04x", 
            mt_rand( 0, 0x0fff ) | 0x4000, 
            mt_rand( 0, 0x3fff ) | 0x8000 
        );
    }

    public function generateSlug( $text )
    {
        return str_replace( ' ', '-', strtolower( $this->removeCharacters( str_replace( '"', '', $text ) ) ) );
    }

    private function removeCharacters( $text )
    {
        return strtr( utf8_decode( $text ), utf8_decode( 'àáâãäçèéêëìíîïñòóôõöùúûüýÿÀÁÂÃÄÇÈÉÊËÌÍÎÏÑÒÓÔÕÖÙÚÛÜÝ' ), 'aaaaaceeeeiiiinooooouuuuyyAAAAACEEEEIIIINOOOOOUUUUY' );
    }

    public function saveUploadedFile( $todayDate )
    {
        $response = [];

        $destination = $this->getTempDirectory() . $todayDate->format( "d-m-Y" );
        $this->createDirectory( $destination );

        if( empty( $_FILES['file']['error'] ) ) {
            $fileName = $this->generateRandom() . "." . ( new SplFileInfo( $_FILES['file']['name'] ) )->getExtension();
            if( move_uploaded_file( $_FILES['file']['tmp_name'],  $destination . "/" . $fileName ) ) {
                $response['image'] = $todayDate->format( "d-m-Y" ) . "/" . $fileName;
                $response['name'] = $fileName;
            } else {

            }
        } else {

        }
        return $response;
    }

    public function moveFile( $source, $destination ) 
    {
        if( !rename( $source, $destination ) ) {
            return false;
        }
        return true;
    }

    public function deleteFile( $file )
    {
        if( !unlink( $file ) ) {
            return false;
        }
        return true;
    }

    public function createDirectory( $directory )
    {
        if( !file_exists( $directory ) ) {
            mkdir( $directory );
        }
    }

    public function getTempDirectory()
    {
        return $this->tempDirectory;
    }

    public function getPropertyDirectory()
    {
        return $this->propertyDirectory;
    }
}