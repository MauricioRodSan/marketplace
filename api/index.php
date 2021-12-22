<?php
header( "Access-Control-Allow-Origin: *" );
header( 'Access-Control-Allow-Methods: GET, POST, PUT' );
header( "Content-Type: application/json; charset=UTF-8" );
header( "Access-Control-Allow-Headers: Content-Type" );

require_once( "Init.php" );

$init = new Init();
$connection = $init->getConnection();

$parameters = $init->getParameters();
$requestMethod = $_SERVER['REQUEST_METHOD'];

if( $parameters ) {
    switch( $parameters[0] ) {
        case 'login':
            if( $requestMethod == 'POST' ) {
                require_once( 'model/User.php' );
                $User = new User( $connection );
                echo json_encode( $User->logIn( $_POST ) );
            }
            break;
        case 'content':
            switch ( $requestMethod ) {
                case 'GET':
                    require_once( 'model/Section.php' );
                    $Section = new Section( $connection );
                    echo json_encode( $Section->findByPage( $_GET['page'], true ) );
                    break;
                case 'POST':
                    require_once( 'model/Content.php' );
                    $Content = new Content( $connection );

                    echo json_encode( $Content->setContent( $_POST['changes'] ) );
                    break;
              }
            break;
        case 'property':
            require_once( 'model/Property.php' );
            $Property = new Property( $connection );
            switch ( $requestMethod ) {
                case 'GET':
                    if( count($parameters) == 1 ) {
                        $propertyId = isset( $_GET['property'] ) ? $Property->findIdBySlug( $_GET['property'] ) : false;
                        echo json_encode( $Property->getProperty( $propertyId, true ) );
                    } else if( count( $parameters ) > 1 ) {
                        switch( $parameters[1] ) {
                            case 'featured':
                                echo json_encode( $Property->findByFeatured() );
                                break;
                            case 'transaction':
                                echo json_encode( $Property->findByTransaction( $_GET['transaction'] ) );
                                break;
                            case 'all':
                                echo json_encode( $Property->findAll() );
                                break;
                        }
                    }
                    break;
                case 'POST':
                    if( count( $parameters ) == 1)  {
                        echo json_encode( $Property->changes( false, $_POST['changes'] ) );
                    } else {
                        switch( $parameters[1] ) {
                            case 'edit':
                                echo json_encode( $Property->changes( $_POST['changes']['id'], $_POST['changes'], true ) );
                                break;
                            case 'resume':
                                echo json_encode( $Property->changes( false, $_POST['changes'] ) );
                                break;
                        }
                    }
                    break;
            }
            break;
        case 'company':
            require_once( 'model/Company.php' );
            $Company = new Company( $connection );
            switch ($requestMethod) {
                case 'GET':
                    echo json_encode( $Company->get( true, true ));
                    break;
                case 'POST':
                    $Company->changes( $_POST['changes'] );
                    break;
            }
            break;
        case 'user':
            if( $requestMethod == 'POST' ) {
                require_once( 'model/User.php' );
                $User = new User( $connection );
                if( count( $parameters ) == 1 ) {
                    echo json_encode( $User->changes( $_POST['changes']['id'], $_POST['changes']['changes'] ) );
                } else if( count( $parameters ) > 1 ) {
                    switch($parameters[1]) {
                        case 'change-password':
    
                            break;
                        case 'reset-password':
    
                            break;
                        case 'try-reset-password':
    
                            break;
                    }
                }
            }
            break;
        case 'catalog':
            require_once( 'model/Catalog.php' );
            $Catalog = new Catalog( $connection );

            switch ( $requestMethod ) {
                case 'GET':
                    echo json_encode( $Catalog->getAll() );
                    break;
                case 'POST':
                    echo json_encode( $Catalog->changes( $_POST['changes'] ) );
                    break;
            }
            break;
        case 'postal-code':
            switch ( $requestMethod ) {
                case 'GET':
                    require_once( 'model/PostalCode.php' );
                    $PostalCode = new PostalCode( $connection );
                    
                    $data = false;
                    if( isset( $_GET['postal_code'] ) ) {
                        $data = $PostalCode->findByCode( $_GET['postal_code'] );
                    } else if( isset( $_GET['postal_code_id'] ) ) {
                        $data = $PostalCode->findById( $_GET['postal_code_id'] );
                    }

                    echo json_encode( $data );
                    break;
            }
            break;
        case 'upload':
            require_once( __DIR__ . "/./Utils.php" );
            $Utils = new Utils();

            $todayDate = new DateTime( "now", new DateTimeZone( "America/Mexico_City" ) );

            $Utils->cleanTemp( $todayDate );

            echo json_encode( $Utils->saveUploadedFile( $todayDate ) );

            break;
        case 'search':
            if( count( $parameters ) > 1 ) {
                require_once( 'model/Property.php' );
                $Property = new Property( $connection );
                switch( $parameters[1] ) {
                    case 'transaction':
                        echo json_encode( $Property->getSearchByTransaction( $_GET['transaction'] ) );
                        break;
                    case 'type':
                        echo json_encode( $Property->getSearchByType( $_GET['type'] ) );
                        break;
                }
            }
            break;
        case 'form-send':
            require_once( __DIR__ . "/./Sender.php" );
            require_once( 'model/Company.php' );

            $Sender = new Sender();
            $Company = new Company( $connection );
            
            $data = $_POST;
            
            if( isset( $data['uuid'] ) ) {
                require_once( 'model/Property.php' );
                $Property = new Property( $connection );
                $data['property'] = $Property->getResume( $Property->findIdByUUID( $data['uuid'] ) );
            }

            echo json_encode( $Sender->contact( $data, explode( ";", $Company->get( false, true )['form_contacts'] ) ) );

            break;
    }
} else {
    echo 'Futurplace API 1.0.0';
}