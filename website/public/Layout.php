<?php

class Layout
{
    private $company;

    public function __construct( $company )
    {
        $this->company = $company;
    }

    public function getPreloader()
    {
        ?>
        <!-- #preloader -->
        <section id="preloader">
            <div class="content">
                <div class="loader-circle"></div>
                <div class="loader-line-mask">
                    <div class="loader-line"></div>
                </div>
                <img src="/assets/img/logo/futurplace-imagotipo.svg" alt="">
            </div>
        </section>
        <!-- /#preloader -->
        <?php
    }

    public function getFavicon()
    {
        ?>
        <!-- favicon -->
        <link rel="icon" type="image/png" sizes="32x32" href="/assets/img/favicon/favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="16x16" href="/assets/img/favicon/favicon-16x16.png">
        <link rel="shortcut icon" href="/assets/img/favicon/favicon.ico">
        <!-- /favicon -->
        <?php
    }

    public function getSvgGradient()
    {
        ?>
        <svg xmlns="http://www.w3.org/2000/svg" style="position: absolute;"><linearGradient id="gradient-icon" x1="20.26" x2="20.26" y2="31.74" gradientUnits="userSpaceOnUse"><stop offset="0.01" stop-color="#5bd2ee"/><stop offset="0.78" stop-color="#45ab95"/></linearGradient></svg>
        <?php
    }
    
    public function getHeader( $page )
    {
        ?>
        <!-- header -->
        <header class="fixed-top">
            <div class="main-nav-bar">
                <div class="container-fluid">
                    <div class="row justify-content-center">
                        <div class="col-11 col-xl-10">
                            <div class="nav-bar">
                                <div class="brand">
                                    <a href="/">
                                        <img src="/assets/img/logo/futureplace-logo.svg" class="img-fluid" alt="Futureplace logo">
                                    </a>
                                </div>

                                <nav class="nav">

                                    <button class="menu-button d-block d-md-none">
                                        <img src="/assets/img/ui/icon-menu.svg" class="open visible" alt="">
                                        <img src="/assets/img/ui/icon-menu-close.svg" class="close" alt="">
                                    </button>

                                    <div class="nav-menu">
                                        <ul>
                                            <li>
                                                <a<?= $page == '/' ? ' class="active"' : ' href="/"'; ?>>Home</a>
                                            </li>
                                            <li>
                                                <a<?= $page == 'nosotros' ? ' class="active"' : ' href="/nosotros"'; ?>>Nosotros</a>
                                            </li>
                                            <li>
                                                <a<?= $page == 'servicios' ? ' class="active"' : ' href="/servicios"'; ?>>Servicios</a>
                                            </li>
                                            <li>
                                                <a href="/contacto" class="scroll-link">Contacto</a>
                                            </li>
                                            <li class="phone">
                                                <a href="tel:<?= str_replace( [ " ", "-" ], "", $this->company['phone'] ); ?>">
                                                    <img src="/assets/img/ui/icon-phone.svg" class="img-fluid" alt=""><?= $this->company['phone']; ?>
                                                </a>
                                            </li>
                                            <li class="social">
                                                <a href="<?= $this->company['facebook_url']; ?>" target="_blank">
                                                    <img src="/assets/img/ui/icon-facebook.svg" class="img-fluid" alt="">
                                                </a>
                                                <a href="<?= $this->company['instagram_url']; ?>" target="_blank">
                                                    <img src="/assets/img/ui/icon-instagram.svg" class="img-fluid" alt="">
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
        <!-- /header -->
        <?php
    }

    public function getSearch( $propertyTypeCount, $cssClass = [], $withTypeButtons = true, $withTitle = false )
    {
        ?>
        <!-- .busqueda -->
        <div class="busqueda<?= ( count($cssClass) > 0 ? " " . implode( ' ', $cssClass ) : "" ); ?>">
            <div class="container-fluid">
                <div class="row justify-content-center">
                    <div class="col-11 col-xl-10">
                        <div class="wrapper">
                            <?php
                                if( $withTitle ) {
                                    ?>
                                    <h4 class="title">Realiza otra búsqueda</h4>
                                    <?php
                                }
                            ?>
                            <form id="busqueda-form">
                                <div class="row align-items-center">
                                    <div class="col-12 col-lg-3">
                                        <div class="property-transaction">
                                            <div class="custom-radio">
                                                <label>
                                                    <input type="radio" name="operacion" value="renta">
                                                    <span class="checkmark"></span>
                                                    Renta
                                                </label>
                                            </div>
                                            <div class="custom-radio">
                                                <label>
                                                    <input type="radio" name="operacion" value="compra">
                                                    <span class="checkmark"></span>
                                                    Compra
                                                </label>
                                            </div>
                                            <div class="custom-radio">
                                                <label>
                                                    <input type="radio" name="operacion" value="remate">
                                                    <span class="checkmark"></span>
                                                    Remate
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-12 col-lg-7">
                                        <div class="row">
                                            <div class="form-group col-12 col-md-4">
                                                <select name="tipo" class="form-control" disabled>
                                                    <option value="0" hidden>Tipo</option>
                                                </select>
                                            </div>
                                            <div class="form-group col-12 col-md-4">
                                                <select name="estado" class="form-control" disabled>
                                                    <option>Estado</option>
                                                </select>
                                            </div>
                                            <div class="form-group col-12 col-md-4">
                                                <select name="municipio" class="form-control" disabled>
                                                    <option>Municipio</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-12 col-lg-2">
                                        <button type="submit" class="button small w-100" disabled>
                                            <img src="/assets/img/ui/icon-search.svg" alt="">Buscar
                                        </button>
                                    </div>
                                </div>
                            </form>
                            <div class="divider"></div>
                            <?php
                                if( $withTypeButtons ) {
                                    ?>
                                    <div class="row justify-content-center buttons-type">
                                        <div class="col-12 col-md-11">
                                            <div class="row">
                                                <?php
                                                    foreach( $propertyTypeCount as $type ) {
                                                        ?>
                                                        <div class="col-12 col-md-4">
                                                            <a <?= $type['countProperty'] ? 'href="/inmuebles/' . $type['slug'] . '" ' : ''; ?>class="button w-100<?= $type['countProperty'] ? '' : ' disabled'; ?>">
                                                                <?
                                                                    switch ( $type['slug'] ) {
                                                                        case 'renta':
                                                                            ?>
                                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40.52 31.74"><path d="M40.12,27.66c-3,6.16-5.64,3.78-11.49,2.83-1.11.24-1.2-2.82-1.53-3.36l-.44-.25c-3.89,1.08-3.47,1.43-4.43-2.54l-.41-.23c-3.61,1-3.48,1.47-4.33-2.39a16.75,16.75,0,0,0,3.87-4C21.57,17.5,37.5,29,34.65,24.47l-12.5-8.3a12.79,12.79,0,0,0,.78-2.36.85.85,0,0,1,.69.12L39.44,24.29A2.44,2.44,0,0,1,40.12,27.66ZM12.89,21.89c-14,3-18.32-19.06-4.26-21.62C22.61-2.69,27,19.33,12.89,21.89ZM10.17,7.45C9.27,2.48,1.5,4,2.54,9S11.22,12.38,10.17,7.45Z"/></svg>
                                                                            <?php
                                                                            break;
                                                                        case 'compra':
                                                                            ?>
                                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35.63 35.74"><path d="M11.14,21.33l3.06,2.26c4.24,3.15,4.58,2.36,9.58,2.66,1.11.07,1.83,1.85,0,2.56a12,12,0,0,1-9,0c-.48,0-2.21-1.58-2.8-1s-.13,1,.54,1.34l2.07,1.15c2.47.74,7.55,1.18,10.19-.63l7.76-5.31c1.42-1,1.78-1.25,2.94-.11.61.62-.79,2.2-1.21,2.48L22.89,34.37c-2.1,1.41-6,1.66-7,1.09l-7-3.57a2.69,2.69,0,0,0-3,.32L4.13,33.32c-.42.27-4.56-8.79-4.09-9l7.44-3a4.37,4.37,0,0,1,3.66,0Zm24-9.64L21.11.22A1,1,0,0,0,20.39,0a1,1,0,0,0-.72.22l-14,11.47a.82.82,0,0,0-.08,1.23l1.69,1.74a1,1,0,0,0,1.34.07L20.39,5.09l11.8,9.64a1,1,0,0,0,1.34-.07l1.69-1.74a.83.83,0,0,0-.08-1.23ZM14.73.38H10.62V6l4.11-3.36V.38ZM9.6,15.78v3.64a5.7,5.7,0,0,1,.58.06A6.59,6.59,0,0,1,13,20.61c1.46,1,2.5,1.74,3.29,2.32.38.29.7.52,1,.71V17.46h6.42v7.28l.27,0c1.59.09,2.23.81,2.26,2l5.08-3.48V15.78L22.09,8.14a2.31,2.31,0,0,0-1.67-.5,2.31,2.31,0,0,0-1.67.5L9.6,15.78Z"/></svg>
                                                                            <?php
                                                                            break;
                                                                        case 'remate':
                                                                            ?>
                                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36.9 36.09"><path d="M4.79,17.62V34.79a1.3,1.3,0,0,0,1.27,1.3H30.85a1.3,1.3,0,0,0,1.26-1.3V17.62h3v0a2,2,0,0,0,1.3-.73A2.08,2.08,0,0,0,36.17,14L19.76.47A2,2,0,0,0,18.46,0h0a1.92,1.92,0,0,0-1.31.47L11.48,5.13V1.6a.59.59,0,0,0-.59-.6H7.05a.6.6,0,0,0-.59.6V9.27L.73,14a2.08,2.08,0,0,0-.28,2.88,2,2,0,0,0,1.3.73v0h3Zm18.77-2H25.4c.32,0,.41.28.18.59l-11.67,16a1.44,1.44,0,0,1-1,.58H11.09c-.32,0-.41-.26-.18-.58l11.67-16a1.42,1.42,0,0,1,1-.59Zm-14,3.79A3.84,3.84,0,0,1,9.9,17.9a4.33,4.33,0,0,1,.85-1.28A4.13,4.13,0,0,1,12,15.76a4,4,0,0,1,3.12,0,4,4,0,0,1,2.14,2.14,3.83,3.83,0,0,1,.31,1.55A3.93,3.93,0,0,1,17.28,21a4,4,0,0,1-.86,1.26,4.18,4.18,0,0,1-1.28.86,4,4,0,0,1-3.12,0A4,4,0,0,1,9.9,21a3.93,3.93,0,0,1-.32-1.57Zm2.4,0a2.12,2.12,0,0,0,.43,1.5,1.59,1.59,0,0,0,1.18.44,1.83,1.83,0,0,0,.61-.11,1.4,1.4,0,0,0,.51-.33,1.83,1.83,0,0,0,.35-.6,3,3,0,0,0,.12-.9,2.93,2.93,0,0,0-.12-.9,1.83,1.83,0,0,0-.35-.6,1.4,1.4,0,0,0-.51-.33,1.83,1.83,0,0,0-.61-.11,1.59,1.59,0,0,0-1.18.44,2.12,2.12,0,0,0-.43,1.5Zm7.17,9.69a3.71,3.71,0,0,1,.32-1.55,4.1,4.1,0,0,1,.85-1.27,4.16,4.16,0,0,1,1.27-.87,4.08,4.08,0,0,1,3.12,0,4.16,4.16,0,0,1,1.27.87,4,4,0,0,1,.86,1.27,4,4,0,0,1,0,3.12A3.86,3.86,0,0,1,26,32a4.31,4.31,0,0,1-1.27.86,4.08,4.08,0,0,1-3.12,0A4.31,4.31,0,0,1,20.32,32a4,4,0,0,1-.85-1.27,3.74,3.74,0,0,1-.32-1.57Zm2.4,0a2.08,2.08,0,0,0,.43,1.5,1.52,1.52,0,0,0,1.17.44,1.77,1.77,0,0,0,.61-.1,1.39,1.39,0,0,0,.51-.34,1.47,1.47,0,0,0,.35-.6,2.6,2.6,0,0,0,.13-.9,2.67,2.67,0,0,0-.13-.9,1.5,1.5,0,0,0-.35-.59,1.27,1.27,0,0,0-.51-.34,1.77,1.77,0,0,0-.61-.1,1.52,1.52,0,0,0-1.17.44,2.07,2.07,0,0,0-.43,1.49Z"/></svg>
                                                                            <?php
                                                                            break;
                                                                    }
                                                                ?>
                                                                Inmuebles en <?= $type['slug'] != 'compra' ? $type['slug'] : 'venta'; ?>
                                                            </a>
                                                        </div>
                                                        <?php
                                                    }
                                                ?>
                                            </div>
                                        </div>
                                    </div>
                                    <?php
                                }
                            ?>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- .busqueda -->
        <?php
    }

    public function getPropertySlider( $propertys )
    {
        ?>
        <div class="property-slider">
            <div class="glide__track" data-glide-el="track">
                <ul class="glide__slides">
                    <?php
                        foreach( $propertys as $property ) {
                            ?>
                            <li class="glide__slide">
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
                            </li>
                            <?php
                        }
                    ?>
                </ul>
            </div>
            <div class="glide__bullets" data-glide-el="controls[nav]">
                <?php
                    for ( $i=0; $i < count( $propertys ) ; $i++ ) { 
                        ?>
                        <button class="glide__bullet" data-glide-dir="=<?= $i; ?>"><span></span></button>
                        <?php
                    }
                ?>
            </div>
        </div>
        <?php
    }

    public function getContact( $contents ) 
    {
        ?>
        <!-- #contacto -->
        <div id="contacto">
            <div class="container-fluid">
                <div class="row justify-content-center">
                    <div class="col-11 col-xl-10">
                        <div class="content">
                            <div class="row">
                                <div class="col-12 col-md-6">
                                    <div class="informacion">

                                        <?php
                                            foreach($contents as $content) {
                                                echo $content['content'];
                                            }
                                        ?>

                                        <div class="medio align-items-start">
                                            <img src="/assets/img/ui/icon-marker.svg" class="img-fluid" alt="">
                                            <p><strong><?= $this->company['address']; ?></strong></p>
                                        </div>
                                        <a href="tel:<?= str_replace( [ " ", "-" ], "", $this->company['phone'] ); ?>" class="medio align-items-center">
                                            <img src="/assets/img/ui/icon-phone.svg" class="img-fluid" alt="">
                                            <p><strong><?= $this->company['phone']; ?></strong></p>
                                        </a>
                                    </div>
                                </div>
                                <div class="col-12 col-md-6">
                                    <form id="contacto-form" class="form-contact">
                                        <div class="row">
                                            <div class="form-group col-12 col-sm-6">
                                                <input type="text" name="nombre" class="form-control required" placeholder="Nombre" data-placeholder="Nombre">
                                            </div>

                                            <div class="form-group col-12 col-sm-6">
                                                <input type="text" name="apellido" class="form-control required" placeholder="Apellido" data-placeholder="Apellido">
                                            </div>
                                        </div>

                                        <div class="row">
                                            <div class="form-group col-12 col-sm-6">
                                                <input type="email" name="correo" class="form-control required" placeholder="Correo electrónico" data-placeholder="Correo electrónico">
                                            </div>
                                            <div class="form-group col-12 col-sm-6">
                                                <input type="text" name="telefono" class="form-control required" placeholder="Teléfono" data-placeholder="Teléfono">
                                            </div>
                                        </div>

                                        <div class="form-group">
                                            <textarea name="mensaje" class="form-control required" rows="6" placeholder="Mensaje" data-placeholder="Mensaje"></textarea>
                                        </div>

                                        <div class="row">
                                            <div class="col-12 col-md-6 col-xl-5">
                                                <button type="submit" class="button gradient w-100">Enviar</button>
                                            </div>
                                        </div>

                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- #lightbox-form -->
            <div id="lightbox-form" class="lightbox mfp-with-anim mfp-hide">
                <div class="container-fluid">
                    <div class="row no-gutters lightbox-wrapper">
                        <div class="col-12">
                            <div class="title">
                                <h6 class="help-text"></h6>
                            </div>
                            <div class="content center">
                                <div class="icons-wrapper">
                                    <div class="icon-email">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M464 64H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V112c0-26.51-21.49-48-48-48zm0 48v40.805c-22.422 18.259-58.168 46.651-134.587 106.49-16.841 13.247-50.201 45.072-73.413 44.701-23.208.375-56.579-31.459-73.413-44.701C106.18 199.465 70.425 171.067 48 152.805V112h416zM48 400V214.398c22.914 18.251 55.409 43.862 104.938 82.646 21.857 17.205 60.134 55.186 103.062 54.955 42.717.231 80.509-37.199 103.053-54.947 49.528-38.783 82.032-64.401 104.947-82.653V400H48z"/></svg>
                                    </div>
                                    <div class="icon-success d-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 8C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm0 48c110.532 0 200 89.451 200 200 0 110.532-89.451 200-200 200-110.532 0-200-89.451-200-200 0-110.532 89.451-200 200-200m140.204 130.267l-22.536-22.718c-4.667-4.705-12.265-4.736-16.97-.068L215.346 303.697l-59.792-60.277c-4.667-4.705-12.265-4.736-16.97-.069l-22.719 22.536c-4.705 4.667-4.736 12.265-.068 16.971l90.781 91.516c4.667 4.705 12.265 4.736 16.97.068l172.589-171.204c4.704-4.668 4.734-12.266.067-16.971z"/></svg>
                                    </div>
                                    <div class="icon-error d-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200zm101.8-262.2L295.6 256l62.2 62.2c4.7 4.7 4.7 12.3 0 17l-22.6 22.6c-4.7 4.7-12.3 4.7-17 0L256 295.6l-62.2 62.2c-4.7 4.7-12.3 4.7-17 0l-22.6-22.6c-4.7-4.7-4.7-12.3 0-17l62.2-62.2-62.2-62.2c-4.7-4.7-4.7-12.3 0-17l22.6-22.6c4.7-4.7 12.3-4.7 17 0l62.2 62.2 62.2-62.2c4.7-4.7 12.3-4.7 17 0l22.6 22.6c4.7 4.7 4.7 12.3 0 17z"/></svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- /#lightbox-form -->
        </div>
        <!-- /#contacto -->
        <?php
    }

    public function getFooter( $contents )
    {
        ?>
        <!-- footer -->
        <footer>
            <div class="container-fluid">
                <div class="row justify-content-center">
                    <div class="col-11 col-xl-10">
                        <div class="content">
                            <div class="divider"></div>
                            <div class="address">
                                <p><?= $this->company['address']; ?></p>
                            </div>
                            <div class="rights-privacy">
                                <p>© <?= $this->company['name']; ?></p>
                                <div class="divide"></div>
                                <a href="aviso-de-privacidad" class="lightbox-link">Aviso de privacidad</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- #aviso-de-privacidad -->
            <div id="aviso-de-privacidad" class="lightbox mfp-with-anim mfp-hide">
                <div class="container-fluid">
                    <div class="row no-gutters lightbox-wrapper">
                        <div class="col-12">
                            <div class="title">
                                <h4 class="text">Aviso de privacidad</h4>
                            </div>
                            <div class="content">
                                <?php
                                    foreach($contents as $content) {
                                        echo $content['content'];
                                    }
                                ?>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- /#aviso-de-privacidad -->
        </footer>
        <!-- /footer -->
        <?php
    }
}
