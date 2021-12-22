<?php
    require_once( '../code/Init.php' );
    require_once( '../code/model/Company.php' );
    require_once( '../code/model/Section.php' );
    require_once( '../Layout.php' );
    
    $init = new Init();

    $connection = $init->getConnection();
    $parameters = $init->getParameters();

    $Company = new Company( $connection );

    $page = "servicios";
    $Section = new Section($connection);
    $contents = $Section->findByPage($page);

    $Layout = new Layout( $Company->getData() );
?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Futurplace | Servicios</title>

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
        $Layout->getPreloader();
        $Layout->getHeader($page);
    ?>

    <main>

        <!-- #servicios -->
        <section id="servicios" class="section-header">
            <div class="container-fluid">
                <div class="row justify-content-center">
                    <div class="col-11 col-xl-10">
                        <div class="row">
                            <div class="col-12 col-md-6 offset-md-6">
                                <div class="content">

                                    <?php
                                        foreach($contents['servicios'] as $content) {
                                            echo $content['content'];
                                        }
                                    ?>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <!-- /#servicios -->

        <!-- #nuestrsos-servicios -->
        <section id="nuestrsos-servicios">
            <div class="container-fluid">
                <div class="row justify-content-center">
                    <div class="col-11 col-xl-10">
                        <div class="content">
                            <div class="row align-items-stretch">
                                
                                <?php
                                    foreach($contents['nuestros_servicios'] as $content) {
                                        foreach($content['contents'] as $servicio) {
                                            ?>
                                            <div class="col-12 col-md-6">
                                                <div class="servicio">
                                                    <?php
                                                        foreach($servicio['contents'] as $servicioContent) {
                                                            echo $servicioContent['content'];
                                                        }
                                                    ?>
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
        </section>
        <!-- /#nuestrsos-servicios -->

        <?php
          $Layout->getContact( $contents['contacto'] );  
        ?>
        
    </main>

    <?php
        $Layout->getFooter( $contents['aviso_de_privacidad'] );
    ?>

    <script>
        var section = 'servicios';
    </script>

    <script type="text/javascript" src=".././assets/js/futurplace.js?5a1a58c1602bbd22034e"></script>
</body>

</html>