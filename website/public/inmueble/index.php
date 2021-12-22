<?php
    require_once( '../code/Init.php' );
    require_once( '../code/model/Company.php' );
    require_once( '../code/model/Section.php' );
    require_once( '../code/model/Property.php' );
    require_once( '../Layout.php' );

    $init = new Init();

    $connection = $init->getConnection();
    $parameters = $init->getParameters();

    $Company = new Company( $connection );

    $Layout = new Layout( $Company->getData() );

    $Property = new Property( $connection );
    $propertyId = $Property->findIdBySlug( implode( "/", array_splice( $parameters, 1, count($parameters) ) ) );
    $currentProperty = $Property->getProperty( $propertyId, false );

    $page = 'inmueble';
    $Section = new Section( $connection );
    $contents = $Section->findByPage( $page );

    $parameters = $init->getParameters();

    if( !$currentProperty ) {
        $numParameters = $parameters ? count( $parameters ) : false;
        $newLocation = "http" . ( isset( $_SERVER['HTTPS'] ) ? "s" : "" ) . "://" . $_SERVER['SERVER_NAME'] . "/inmuebles/" . ( $numParameters ? 
            ( $numParameters > 3 ? 
                implode( "/", array_slice( $parameters, 1, $numParameters - 3 ) ) : 
                ""
            ) : 
            ""
        );
        header( "Location: " . $newLocation );
        die();
    }

    $relatedProperties = $Property->findAllBySlug( array_slice( $parameters, 1, 3 ), false, $currentProperty['id'] );
?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Futurplace | Inmueble - <?= $currentProperty['transaction'] . ' ' . $currentProperty['type'] . ' en ' . $currentProperty['address']['municipio'] . ", " . $currentProperty['address']['estado']; ?></title>

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

    <main id="inmueble">

        <section id="encabezado">
            <div class="gallery-form">
                <div class="gallery">

                    <?php
                        if( $currentProperty['images'] ) {
                            if( count( $currentProperty['images']['gallery'] ) > 1 ) {
                                ?>
                                <div class="gallery-slider">
                                    <div class="glide__track" data-glide-el="track">
                                        <ul class="glide__slides">
                                            <?php
                                                foreach ( $currentProperty['images']['gallery'] as $image) {
                                                    ?>
                                                    <li class="glide__slide">
                                                        <a href="/assets/img/inmuebles/<?= $currentProperty['uuid'] . '/' . $image['image']; ?>" class="gallery-item image-wrapper"<?= $image['description'] ? ' title="' . $image['description'] . '"' : ''; ?>>
                                                            <img src="/assets/img/inmuebles/<?= $currentProperty['uuid'] . '/' . $image['image']; ?>" alt="">
                                                        </a>
                                                    </li>
                                                    <?php
                                                }
                                            ?>
                                        </ul>
                                    </div>
                                    <div class="glide__arrows" data-glide-el="controls">
                                        <button class="glide__arrow glide__arrow--left" data-glide-dir="<">
                                            <img src="/assets/img/ui/icon-left.svg" alt="">
                                        </button>
                                        <button class="glide__arrow glide__arrow--right" data-glide-dir=">">
                                            <img src="/assets/img/ui/icon-right.svg" alt="">
                                        </button>
                                    </div>
                                    <div class="glide__bullets" data-glide-el="controls[nav]">
                                        <?php
                                            for ( $i=0; $i < count( $currentProperty['images']['gallery'] ) ; $i++ ) { 
                                                ?>
                                                <button class="glide__bullet" data-glide-dir="=<?= $i; ?>"><span></span></button>
                                                <?php
                                            }
                                        ?>
                                    </div>
                                </div>
                                <?php
                            } else {
                                ?>
                                <div class="gallery-single-image">
                                    <a href="/assets/img/inmuebles/<?= $currentProperty['uuid'] . '/' . $currentProperty['images']['gallery'][0]['image']; ?>" class="gallery-item image-wrapper">
                                        <img src="/assets/img/inmuebles/<?= $currentProperty['uuid'] . '/' . $currentProperty['images']['gallery'][0]['image']; ?>" alt="">
                                    </a>
                                </div>
                                <?php
                            }
                        } else {
                            ?>
                            <div class="gallery-default">
                                <i class="icon-inmueble"></i>
                            </div>
                            <?php
                        }
                    ?>
                </div>

                <div class="inmueble-form">
                    <div class="content">
                        <h5>Me interesa este inmueble</h5>
                        <div class="medio">
                            <?php
                                $companyPhone = $Company->getData()['phone'];
                            ?>
                            <a href="<?= str_replace( [ " ", "-" ], "", $companyPhone ); ?>">
                                <img src="/assets/img/ui/icon-phone.svg" class="img-fluid" alt="">
                                <p><strong><?= $companyPhone; ?></strong></p>
                            </a>
                        </div>
                        <form id="inmueble-form" class="form-contact">
                            <div class="form-group">
                                <input type="text" name="nombre" class="form-control required" placeholder="Nombre" data-placeholder="Nombre">
                            </div>
                            <div class="form-group">
                                <input type="text" name="telefono" class="form-control required" placeholder="Teléfono" data-placeholder="Teléfono">
                            </div>
                            <div class="form-group">
                                <input type="email" name="correo" class="form-control required" placeholder="Correo electrónico" data-placeholder="Correo electrónico">
                            </div>
                            <div class="form-group">
                                <textarea name="mensaje" class="form-control required" rows="6" placeholder="¡Hola!, Me interesa este inmueble, por favor contactarme." data-placeholder="Mensaje"></textarea>
                            </div>
                            <input type="hidden" name="uuid" value="<?= $currentProperty['uuid']; ?>">
                            <button type="submit" class="button gradient w-100">Enviar</button>
                        </form>
                    </div>
                </div>

            </div>
            <div class="breadcrumbs">
                <div class="container-fluid">
                    <div class="row justify-content-center">
                        <div class="col-11 col-xl-10">
                            <div class="content">
                                <div class="filters">
                                    <p><?= $currentProperty['transaction']; ?></p>
                                    <p>/</p>
                                    <p><?= $currentProperty['type']; ?></p>
                                    <p>/</p>
                                    <p>$<?= number_format($currentProperty['price'], 2, ".", ","); ?></p>
                                    <p>/</p>
                                    <p><?= $currentProperty['address']['municipio'] . ", " . $currentProperty['address']['estado']; ?></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section id="informacion">
            <div class="container-fluid">
                <div class="row justify-content-center">
                    <div class="col-11 col-xl-10">
                        <div class="content">

                            <?php
                                if( $currentProperty['data']['Superficie'] ) {
                                    ?>
                                    <div class="columnas">
                                        <ul>
                                            <?php
                                                foreach( $currentProperty['data']['Superficie'] as $superficie ) {
                                                    ?>
                                                    <li>
                                                        <?= $superficie['icon'] ? '<i class="icon-' . $superficie['icon'] . '"></i>' : ''; ?>
                                                        <span><?= $superficie['catalog'] . ": " . $superficie['value']; ?></span>
                                                        <?= $superficie['unit'] ? '<span>' . $superficie['unit'] . '</span>' : ''; ?>
                                                    </li>
                                                    <?php
                                                }
                                            ?>                                    
                                        </ul>
                                    </div>
                                    <?php
                                }
                            ?>

                            <div class="body-form"></div>

                            <div class="descripcion">
                                <h4 class="title">Descripción</h4>
                                <?= $currentProperty['description']; ?>
                            </div>

                            <div class="filas">
                                <div class="row">
                                    <?php
                                        if( $currentProperty['data']['Generales'] ) {
                                            ?>
                                            <div class="col-12 col-md-4">
                                                <div class="generales">
                                                    <h4 class="title">Generales</h4>
                                                    <ul class="with-bullets">
                                                        <?php
                                                            foreach( $currentProperty['data']['Generales'] as $general ) {
                                                                ?>
                                                                <li>
                                                                    <?= $general['icon'] ? '<i class="icon-' . $general['icon'] . '"></i>' : ''; ?>
                                                                    <span><?= $general['catalog'] . ": " . $general['value']; ?></span>
                                                                    <?= $general['unit'] ? '<span>' . $general['unit'] . '</span>' : ''; ?>
                                                                </li>
                                                                <?php
                                                            }
                                                        ?>
                                                    </ul>
                                                </div>
                                            </div>
                                            <?php
                                        }
                                    ?>

                                    <?php
                                        if( $currentProperty['data']['Servicios'] ) {
                                            ?>
                                            <div class="col-12 col-md-4">
                                                <div class="servicios">
                                                    <h4 class="title">Servicios</h4>
                                                    <ul class="with-bullets">
                                                        <?php
                                                            foreach( $currentProperty['data']['Servicios'] as $servicio ) {
                                                                ?>
                                                                <li>
                                                                    <?= $servicio['icon'] ? '<i class="icon-' . $servicio['icon'] . '"></i>' : ''; ?>
                                                                    <span><?= $servicio['catalog'] . ": " . $servicio['value']; ?></span>
                                                                    <?= $servicio['unit'] ? '<span>' . $servicio['unit'] . '</span>' : ''; ?>
                                                                </li>
                                                                <?php
                                                            }
                                                        ?>
                                                    </ul>
                                                </div>
                                            </div>
                                            <?php
                                        }
                                    ?>
                                    
                                    <?php
                                        if( $currentProperty['data']['Amenidades'] ) {
                                            ?>
                                            <div class="col-12 col-md-4">
                                                <div class="servicios">
                                                    <h4 class="title">Amenidades</h4>
                                                    <ul class="with-bullets">
                                                        <?php
                                                            foreach( $currentProperty['data']['Amenidades'] as $amenidad ) {
                                                                ?>
                                                                <li>
                                                                    <?= $amenidad['icon'] ? '<i class="icon-' . $amenidad['icon'] . '"></i>' : ''; ?>
                                                                    <span><?= $amenidad['catalog'] . ": " . $amenidad['value']; ?></span>
                                                                    <?= $amenidad['unit'] ? '<span>' . $amenidad['unit'] . '</span>' : ''; ?>
                                                                </li>
                                                                <?php
                                                            }
                                                        ?>
                                                    </ul>
                                                </div>
                                            </div>
                                            <?php
                                        }
                                    ?>
                                </div>
                            </div>

                            <div class="ubicacion">
                                <h4 class="title text-center">Ubicación del inmueble</h4>
                                <p class="text-center"><strong><?= $currentProperty['address']['street'] . " " . $currentProperty['address']['number'] . ( $currentProperty['address']['indoor_number'] ? " " . $currentProperty['address']['indoor_number'] : "" ) . ", " . $currentProperty['address']['asentamiento'] . ", " . $currentProperty['address']['municipio'] . ", " . $currentProperty['address']['estado']  ;?></strong></p>
                                <div class="map-wrapper">
                                    <div id="map" data-latitude="<?= $currentProperty['address']['latitude']; ?>" data-longitude="<?= $currentProperty['address']['longitude']; ?>" data-zoom="<?= $currentProperty['address']['zoom']; ?>"></div>
                                </div>
                            </div>
                            <div class="ficha-compartir">
                                <div class="row">
                                    <div class="col-12 col-sm-6">
                                        <div class="descargar-ficha">
                                            <h5 class="title">Ficha del inmueble</h5>
                                            <a href="/pdf/<?= implode( "/", array_splice( $parameters, 1, count($parameters) ) ); ?>" target="_blank" class="button gradient">Descargar</a>
                                        </div>
                                    </div>
                                    <div class="col-12 col-sm-6">
                                        <div class="compartir-inmueble">
                                            <h5 class="title">Comparte este inmueble</h5>
                                            <ul>
                                                <?php
                                                    $currentURL = urlencode( $_SERVER['REQUEST_SCHEME'] . '://' . $_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI'] );
                                                ?>
                                                <li>
                                                    <a href="https://www.facebook.com/sharer.php?u=<?= $currentURL; ?>" target="_blank" title="Compartir en Facebook">
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z"/></svg>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="https://twitter.com/intent/tweet?text=<?= $currentURL; ?>" target="_blank" title="Compartir en Twitter">
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"/></svg>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="https://api.whatsapp.com/send?text=<?= $currentURL; ?>" target="_blank" title="Compartir en Whatsapp">
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="https://www.facebook.com/dialog/send?app_id=291494419107518&link=<?= $currentURL; ?>&redirect_uri=<?= $currentURL; ?>" target="_blank" title="Compartir en Facebook messenger">
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256.55 8C116.52 8 8 110.34 8 248.57c0 72.3 29.71 134.78 78.07 177.94 8.35 7.51 6.63 11.86 8.05 58.23A19.92 19.92 0 0 0 122 502.31c52.91-23.3 53.59-25.14 62.56-22.7C337.85 521.8 504 423.7 504 248.57 504 110.34 396.59 8 256.55 8zm149.24 185.13l-73 115.57a37.37 37.37 0 0 1-53.91 9.93l-58.08-43.47a15 15 0 0 0-18 0l-78.37 59.44c-10.46 7.93-24.16-4.6-17.11-15.67l73-115.57a37.36 37.36 0 0 1 53.91-9.93l58.06 43.46a15 15 0 0 0 18 0l78.41-59.38c10.44-7.98 24.14 4.54 17.09 15.62z"/></svg>
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <?php
            if( $relatedProperties ) {
                ?>
                <!-- #sugeridos -->
                <section id="sugeridos">
                    <div class="inmuebles">
                        <div class="container-fluid">
                            <div class="row justify-content-center">
                                <div class="col-11 col-xl-10">
                                    <div class="content">
                                        <h4 class="title">Otros inmuebles que pueden interesarte</h4>
                                        <?php
                                            $Layout->getPropertySlider( $relatedProperties );
                                        ?>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <!-- /#sugeridos -->
                <?php
            }
        ?>

        <section>
            <?php
                $Layout->getSearch( false, [], false, true );
            ?>
        </section>

        <?php
          $Layout->getContact( $contents['contacto'] );  
        ?>

    </main>

    <?php
        $Layout->getFooter( $contents['aviso_de_privacidad'] );
    ?>

    <script type="text/javascript" src="/assets/js/futurplace.js?5a1a58c1602bbd22034e"></script>
</body>

</html>