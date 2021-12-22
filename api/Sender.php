<?php

require_once( __DIR__ . "/./Mailer.php" );
require_once( __DIR__ . "/./Template.php" );

class Sender {
    
    private $Template;

    public function __construct() {
        $this->Template = new Template();
    }

    public function contact( $data, $mails ) {

        $response = [
            'error' => [],
        ];

        $mailer = new Mailer([
            'subject' => "Información del formulario de contacto",
            'body' => $this->Template->getCorreoDatos( $data )
        ]);

        if( !$mailer->send( $mails ) ) {
            $response['error']['contactMessage'] = $mailer->error;
        } else {
            $response['error'] = false;
        }

        return $response;
    }
}