<?php
    require_once( '../code/Init.php' );
    require_once( '../code/model/Company.php' );
    require_once( '../code/model/Section.php' );
    require_once( '../code/model/Property.php' );
    require_once( '../Layout.php' );

    $init = new Init();

    $connection = $init->getConnection();
    $parameters = $init->getParameters();
    $numParameters = count( $parameters );

    $Company = new Company( $connection );

    $Layout = new Layout( $Company->getData() );

    $page = 'inmuebles';
    $Section = new Section( $connection );
    $contents = $Section->findByPage( $page );

    $Property = new Property( $connection );

    $orderBy = ( $numParameters > 3 ? 
        ( $parameters[$numParameters - 3] == "orden" ? 
            [ 'type' => $parameters[$numParameters - 2], 'order' => $parameters[$numParameters - 1]  ] : 
            false 
        ) : 
        false 
    );

    $parametersToSearch = ( !$orderBy ? 
        ( $numParameters > 1 ? 
            array_slice( $parameters, 1, $numParameters - 1 ) : 
            false 
        ) : 
        array_slice( $parameters, 1, $numParameters - 4 ) 
    );

    $inSearch = null;
    if( $parametersToSearch ) {
        $inSearch = $Property->findAllBySlug( $parametersToSearch, $orderBy );
    } else {
        $inSearch = $Property->findAll( $orderBy, true );
    }

    if( !$inSearch ) {
        $numParametersToSearch = $parametersToSearch ? count( $parametersToSearch ) : false;
        $newLocation = "http" . ( isset( $_SERVER['HTTPS'] ) ? "s" : "" ) . "://" . $_SERVER['SERVER_NAME'] . "/inmuebles/". ( $numParametersToSearch ? 
            ( $numParametersToSearch > 1 ? 
                implode( "/", array_slice( $parametersToSearch, 0, $numParametersToSearch - 1 ) ) : 
                "" 
            ) : 
            "" 
        );
        header( "Location: " . $newLocation );
        die();
    }

    $searchData = null;
    if( $parametersToSearch ) {
        $searchData = [];
        foreach( $parametersToSearch as $key => $value ) {
            if( $key == 0 ) {
                array_push( $searchData, $inSearch[0]['transaction'] );
            } else if( $key == 1 ) {
                array_push( $searchData, $inSearch[0]['type'] );
            } else if( $key == 2 ) {
                array_push( $searchData, $inSearch[0]['postal_code']['estado'] );
            } else if( $key == 3 ) {
                array_push( $searchData, $inSearch[0]['postal_code']['municipio'] );
            }
        }
    }
?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Futurplace | Inmuebles<?= $searchData ? " - " . implode( " ", $searchData ) : ""; ?></title>

    <meta name="description" content="">
    <meta name="keywords" content="">
    <meta name="author" content="InCitrus - ¡Expertos en branding! - CDMX">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">

    <?php
        $Layout->getFavicon();
    ?>

    <link href="/assets/css/futurplace.css?5a1a58c1602bbd22034e" rel="stylesheet">
</head>

<body>
    
    <?php
        $Layout->getSvgGradient();
        $Layout->getPreloader();
        $Layout->getHeader( $page );
    ?>

    <!-- #busqueda -->
    <main id="busqueda">

        <!-- #encabezado -->
        <section id="encabezado">
            <div class="container-fluid">
                <div class="row justify-content-center">
                    <div class="col-11 col-xl-10">
                        <div class="content">
                            <h3 class="title">Resultados de tu búsqueda</h3>
                        </div>
                    </div>
                </div>
            </div>
            <div class="filtros-orden breadcrumbs">
                <div class="container-fluid">
                    <div class="row justify-content-center">
                        <div class="col-11 col-xl-10">
                            <div class="content">
                                <div class="filters">
                                    <?php
                                        if( $searchData ) {
                                            foreach( $searchData as $key => $data ) {
                                                if( $key != 0) {
                                                    ?>
                                                    <p>/</p>
                                                    <?php
                                                }
                                                ?>
                                                <p><?= $data; ?></p>
                                                <?php
                                            }
                                        } else {
                                            ?>
                                            <p>Todos</p>
                                            <?php
                                        }
                                    ?>
                                </div>
                                <div class="order-by">
                                    <form id="order-form">
                                        <select name="order" class="form-control">
                                            <option value="0"<?= ( !$orderBy ? " selected" : "" ); ?>>Fecha: más reciente</option>
                                            <option value="fecha/ascendente"<?= ( $orderBy && $orderBy['type'] == "fecha" ? " selected" : "" ); ?>>Fecha: más antiguo</option>
                                            <option value="precio/ascendente"<?= ( $orderBy && $orderBy['type'] == "precio" && $orderBy['order'] == "ascendente" ? " selected" : "" ); ?>>Precio: más bajo</option>
                                            <option value="precio/descendente"<?= ( $orderBy && $orderBy['type'] == "precio" && $orderBy['order'] == "descendente" ? " selected" : "" ); ?>>Precio: más alto</option>
                                        </select>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <!-- /#encabezado -->

        <!-- #inmuebles -->
        <section id="inmuebles">
            <div class="inmuebles">
                <div class="container-fluid">
                    <div class="row justify-content-center">
                        <div class="col-11 col-xl-10">
                            <div class="content">
                                <div class="row">

                                    <?php
                                        if( $inSearch ) {
                                            foreach($inSearch as $property) {
                                                ?>
                                                <div class="col-12 col-sm-6 col-lg-4 col-xl-3">
                                                    <div class="inmueble">
                                                        <a href="/inmueble/<?= $property['slug']; ?>">
                                                            <div class="image">
                                                                <img src="/assets/img/inmuebles/<?= !$property['cover'] ? "portada-predeterminada.jpg" : $property['uuid'] . "/" . $property['cover'][0]['image'] ;?>" class="img-fluid" alt="">
                                                            </div>
                                                            <div class="informacion">
                                                                <h5 class="precio">$<?= number_format($property['price'], 2, ".", ","); ?></h5>
                                                                <p><?= $property['postal_code']['estado'] . " / " . $property['postal_code']['municipio'] . " / " .$property['type'] .  " / " . $property['transaction'] . " / " . $property['code'] ?></p>
                                                            </div>
                                                        </a>
                                                    </div>
                                                </div>
                                                <?php
                                            }
                                        }
                                    ?>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <!-- /#inmuebles -->

        <section id="busqueda-cuadro">
            <?php
                $Layout->getSearch( $Property->getPropertyCountByTransaction(), [ 'with-shadow', 'extra' ], true, true );
            ?>
        </section>

        <?php
          $Layout->getContact( $contents['contacto'] );  
        ?>

    </main>
    <!-- #busqueda -->

    <?php
        $Layout->getFooter( $contents['aviso_de_privacidad'] );
    ?>

    <script type="text/javascript" src="/assets/js/futurplace.js?5a1a58c1602bbd22034e"></script>
</body>

</html>