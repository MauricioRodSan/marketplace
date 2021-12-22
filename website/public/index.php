<?php
    require_once( './code/Init.php' );
    require_once( './code/model/Company.php' );
    require_once( './code/model/Section.php' );
    require_once( './code/model/Property.php' );
    require_once( './Layout.php' );
    
    $init = new Init();

    $connection = $init->getConnection();
    $parameters = $init->getParameters();

    $Company = new Company( $connection );

    $page = '/';
    $Section = new Section( $connection );
    $contents = $Section->findByPage( $page );

    $Property = new Property( $connection );

    $Layout = new Layout( $Company->getData() );
?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Futurplace | Home</title>

    <meta name="description" content="">
    <meta name="keywords" content="">
    <meta name="author" content="InCitrus - ¡Expertos en branding! - CDMX">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">

    <?php
        $Layout->getFavicon();
    ?>

    <link href="./assets/css/futurplace.css?5a1a58c1602bbd22034e" rel="stylesheet">
</head>

<body>

    <?php
        $Layout->getSvgGradient();
        $Layout->getPreloader();
        $Layout->getHeader($page);
    ?>

    <main>

        <!-- #inicio -->
        <section id="inicio">
            <!-- .banners -->
            <div class="banners height-100">
                <div class="container-fluid">
                    <div class="row justify-content-center">
                        <div class="col-11 col-xl-10">
                            <div class="content">
                                <?php
                                    foreach($contents['banners'] as $content) {
                                        echo $content['content'];
                                    }
                                ?>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- .banners -->

            <?php
                $Layout->getSearch( $Property->getPropertyCountByTransaction(), [ 'on-section' , 'with-shadow' ] )
            ?>

        </section>
        <!-- /#inicio -->

        <!-- #destacados -->
        <section id="destacados">
            <div class="inmuebles">
                <div class="container-fluid">
                    <div class="row justify-content-center">
                        <div class="col-11 col-xl-10">
                            <div class="content">

                                <?php
                                    foreach($contents['destacados'] as $content) {
                                        echo $content['content'];
                                    }

                                    require_once('./code/model/Property.php');
                                    $Property = new Property($connection);
                                    $Layout->getPropertySlider( $Property->findByFeatured() );
                                ?>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <!-- /#destacados -->

        <!-- #comprometidos -->
        <section id="comprometidos">
            <div class="container-fluid">
                <div class="row justify-content-center">
                    <div class="col-12 col-md-11 col-xl-10">
                        <div class="content">
                            <div class="row align-items-center">
                                <div class="col-12 col-md-7 order-2 order-md-1 text">

                                    <?php
                                        foreach($contents['comprometidos']['left'] as $content) {
                                            if($content['markup'] == "1") {
                                                echo $content['content'];
                                            } else {
                                                ?>
                                                    <div class="row">
                                                        <?php
                                                            foreach($content['contents'] as $compromiso) {
                                                                echo 
                                                                    '<div class="col-12 col-sm-6 col-xl-4">
                                                                        <div class="compromiso">
                                                                            <img src="/assets/img/home/icon-compromiso.svg" class="img-fluid" alt="">
                                                                            ' . $compromiso['content'] . '
                                                                        </div>
                                                                    </div>';
                                                            }
                                                        ?>
                                                    </div>
                                                <?php
                                            }
                                        }
                                    ?>

                                </div>
                                <div class="col-12 col-md-5 order-1 order-md-2 image">
                                    <img src="/assets/img/home/comprometidos-img.jpg" class="img-fluid" alt="">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <!-- /#comprometidos -->

        <!-- #inicio-servicios -->
        <section id="inicio-servicios">
            <div class="servicios-resumidos">
                <div class="container-fluid">
                    <div class="row justify-content-center">
                        <div class="col-11 col-xl-10">
                            <div class="content">

                                <?php
                                    foreach($contents['servicios_resumen'] as $content) {
                                        if($content['markup'] == "1") {
                                            if($content['order'] != "3") {
                                                echo $content['content'];
                                            } else {
                                                echo 
                                                    '<div class="row justify-content-center">
                                                        <div class="col-10 col-sm-8 col-md-6 col-lg-5 col-xl-4">
                                                            ' . $content['content'] . '
                                                        </div>
                                                    </div>';
                                            }
                                        } else {
                                            ?>
                                            <div class="row align-items-stretch">
                                                <?php
                                                    foreach($content['contents'] as $servicio) {
                                                       ?>
                                                       <div class="col-12 col-sm-6 col-lg-4">
                                                            <div class="servicio">
                                                                <?= $servicio['contents'][0]['content']; ?>
                                                                <div class="informacion">
                                                                    <?php
                                                                        for ($i = 1; $i < count($servicio['contents']); $i++) { 
                                                                            echo $servicio['contents'][$i]['content'];
                                                                        }
                                                                    ?>
                                                                </div>
                                                            </div>
                                                        </div>
                                                       <?php
                                                    }
                                                ?>
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
        <!-- /#inicio-servicios -->

        <?php
          $Layout->getContact( $contents['contacto'] );  
        ?>

    </main>

    <?php
        $Layout->getFooter( $contents['aviso_de_privacidad'] );
    ?>

    <script type="text/javascript" src="./assets/js/futurplace.js?5a1a58c1602bbd22034e"></script>
</body>

</html>