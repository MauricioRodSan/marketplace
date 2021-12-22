<?php
    require_once('../code/Init.php');
    require_once( '../code/model/Company.php' );
    require_once('../code/model/Section.php');
    require_once('../Layout.php');
    
    $init = new Init();

    $connection = $init->getConnection();
    $parameters = $init->getParameters();

    $Company = new Company( $connection );

    $page = "nosotros";
    $Section = new Section($connection);
    $contents = $Section->findByPage($page);

    $Layout = new Layout( $Company->getData() );
?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Futurplace | Nosotros</title>

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

        <!-- #nosotros -->
        <section id="nosotros" class="section-header">
            <div class="container-fluid">
                <div class="row justify-content-center">
                    <div class="col-11 col-xl-10">
                        <div class="row">
                            <div class="col-12 col-md-6 offset-md-6">
                                <div class="content">

                                    <?php
                                        foreach($contents['nosotros'] as $content) {
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
        <!-- /#nosotros -->

        <!-- #futureplace -->
        <section id="futureplace">
            <div class="container-fluid">
                <div class="row justify-content-center">
                    <div class="col-12 col-md-11 col-xl-10">
                        <div class="content">
                            <div class="row align-items-start">
                                <div class="col-12 col-md-6 text">
                                    <?php
                                        foreach($contents['futurplace']['left'] as $content) {
                                            echo $content['content'];
                                        }
                                    ?>
                                    
                                </div>
                                <div class="col-12 col-md-6 image">
                                    <img src="/assets/img/nosotros/nosotros-historia.jpg" class="img-fluid" alt="">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <!-- /#futureplace -->

        <!-- #tus-aliados -->
        <section id="tus-aliados">
            <div class="container-fluid">
                <div class="row justify-content-center">
                    <div class="col-11 col-xl-10">
                        <div class="content">

                            <?php
                                foreach($contents['tus_aliados'] as $content) {
                                    if($content['markup'] == "1") {
                                        echo $content['content'];
                                    } else {
                                        ?>
                                        <div class="row justify-content-center">
                                            <div class="col-12 col-lg-10">
                                                <div class="row">
                                                    <?php
                                                        foreach($content['contents'] as $ofrecimiento) {
                                                            ?>
                                                            <div class="col-12 col-md-4">
                                                                <div class="ofrecemos">
                                                                    <?php
                                                                        foreach($ofrecimiento['contents'] as $ofrecimientoContent) {
                                                                            echo $ofrecimientoContent['content'];
                                                                        }
                                                                    ?>
                                                                </div>
                                                            </div>
                                                            <?php
                                                        }
                                                    ?>
                                                </div>
                                            </div>
                                        </div>
                                        <?php
                                    }
                                }
                            ?>

                            <div class="divider"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <!-- /#tus-aliados -->

        <!-- #como-trabajamos -->
        <section id="como-trabajamos">
            <div class="container-fluid">
                <div class="row justify-content-center">
                    <div class="col-11 col-xl-10">
                        <div class="content">

                            <?php
                                foreach($contents['como_trabajamos'] as $content) {
                                    if($content['markup'] == "1") {
                                        echo $content['content'];
                                    } else {
                                        ?>
                                            <div class="row">
                                                <?php
                                                    foreach($content['contents'] as $paso) {
                                                        ?>
                                                        <div class="col-12 col-md-3">
                                                            <div class="paso">
                                                                <?php
                                                                    foreach($paso['contents'] as $pasoContent) {
                                                                        echo $pasoContent['content'];
                                                                    }
                                                                ?>
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
        </section>
        <!-- /#como-trabajamos -->

        <!-- #inicio-servicios -->
        <section id="nosotros-servicios">
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

    <script>
        var section = 'nosotros';
    </script>

    <script type="text/javascript" src=".././assets/js/futurplace.js?5a1a58c1602bbd22034e"></script>
</body>

</html>