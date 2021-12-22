import $ from 'jquery'

import { debounce } from 'underscore'

import 'jquery.easing'

import Glide from '@glidejs/glide'

import 'magnific-popup'

import { Loader } from "@googlemaps/js-api-loader"

import '@/scss/futurplace.scss'

const 
    API_URL = 'https://api.futurplace.incitrus.com',
    // API_URL = 'http://api.futurplace.local',
    $window = $(window),
    $root = $('body, html'),
    $body = $('body'),
    $preloader = $('#preloader'),
    $main = $('main'),
    $header = $('header'),
    $mainMenu = $('.nav-menu'),
    $menuButton = $('.menu-button'),
    placeholderName = 'data-placeholder'

let 
    section = null,
    propertySlider = null;

$window.on('load', function() {
    setTimeout(function() {
        $preloader.fadeOut(750, 'easeInCubic')
    }, 1000);
}).on('resize', debounce(resizeInit, 500)).on('scroll', scrollingInit)

$(function() {
    init()
})

function init() {
    locationInit()

    menuInit()

    resizeInit()

    scrollingInit()

    sectionFullHeightInit()

    lightboxLinksInit()

    searchInit()

    contactInit()

    propertySliderInit()

    if(section) {
        switch (section) {
            case 'inmueble':
                propertyInit()
                break;
            case 'inmuebles':
                propertyOrderInit()
                break;
        }
    }
}

function resizeInit() {
    $mainMenu.css('top', $header.outerHeight())
    $main.css({ paddingTop: $header.outerHeight() })

    propertySliderInit()

    if(section) {
        switch (section) {
            case 'inmueble':
                propertyFormChange()
                break;
        }
    }
}


function menuInit() {
    $('.scroll-link').on('click', function(evn) {

        const 
            $section = $(getSectionID($(this).attr('href').replace('/', '')))

        if($section.length > 0) {
            evn.preventDefault()
            scrollToSection($section)

            if(isMobile()) {
                menuMobileOpenClose(false)
            }
        }
    })

    $menuButton.on('click', function() {
        menuMobileOpenClose(!$mainMenu.hasClass('visible'))
    })
}

function menuActiveSection() {
    const 
        $sections = $('.nav-menu .scroll-link')

    $sections.removeClass('active')

    $sections.each(function() {
        const 
            $section = $(getSectionID($(this).attr('href').replace('/', '')))

        if($section.length > 0) {
            if(sectionInView($section)) {
                $sections.removeClass('active')
                $(this).addClass('active')
            } 
        }
    })
}

function menuMobileOpenClose(open) {
    if(open) {
        bodyLock(true)
        $mainMenu.addClass('visible')
        $menuButton.find('.open').removeClass('visible')
        $menuButton.find('.close').addClass('visible')
    } else {
        bodyLock(false)
        $mainMenu.removeClass('visible')
        $menuButton.find('.close').removeClass('visible')
        $menuButton.find('.open').addClass('visible')
    }
}

function scrollingInit() {
    menuActiveSection()
}

function sectionInView($section) {
    const 
        threshold = $header.outerHeight(),
        windowTop = $window.scrollTop(),
        sectionHeight = $section.outerHeight(),
        sectionTop = $section.offset().top,
        sectionBottom = sectionTop + sectionHeight

    return windowTop + threshold + 10 >= sectionTop && windowTop - threshold + 10 <= sectionBottom
}

function sectionFullHeightInit() {
    $('.height-100').each(function() {
        const 
            bodyHeight = $window.height() - $header.outerHeight(),
            sectionHeight = $(this).find('.content').outerHeight()

        if(bodyHeight > sectionHeight) {
            $(this).css('height', bodyHeight)
        } else{
            $(this).css('height', 'auto')
        }
    })
}

function getSectionID(section) {
    if(section == '' || section == 'inicio') {
        section = 'banners-buscador'
    } else if(section == 'nosotros') {
        section = 'quienes-somos'
    }
    return `#${section}`
}

function locationInit() {
    const 
        path = window.location.pathname,
        params = path.split('/').filter(param => param != '')

    // console.log(params)

    if(params.length > 0) {
        section = params[0]
        scrollToSection($(getSectionID(params[0])))
    }
}

function scrollToSection($section) {
    if($section.length > 0) {
        $root.animate({
            scrollTop: $section.offset().top - $header.outerHeight()
        }, 1000, 'easeInOutExpo')
    }
}

function searchInit() {

    const formSearchSelector = '#busqueda-form'

    if($(formSearchSelector).length > 0) {
        const 
            $operacion = $(`${ formSearchSelector } input[name="operacion"]`),
            $tipo = $(`${ formSearchSelector } select[name="tipo"]`),
            $estado = $(`${ formSearchSelector } select[name="estado"]`),
            $municipio = $(`${ formSearchSelector } select[name="municipio"]`),
            $submit = $(`${ formSearchSelector } button[type="submit"]`),
            fillTypes = (() => {
                $submit.attr('disabled', false)
                $tipo.empty().append('<option value="0" hidden>Selecciona el tipo</option>').val('0').attr('disabled', false)
                for (const key in types) {
                    $tipo.append(`<option value="${ types[key].slug }">${ types[key].type }</option>`)
                }
            }),
            fillEstados = ((evn) => {
                const indexType = types.findIndex(type => type.slug == evn.target.value)
                $estado.empty().append('<option value="0" hidden>Selecciona el estado</option>').val('0').attr('disabled', false)
                for (const key in types[indexType].estados) {
                    $estado.append(`<option value="${ types[indexType].estados[key].slug }">${ types[indexType].estados[key].estado }</option>`)
                }
            }),
            fillMunicipios = ((evn) => {
                const 
                    indexType = types.findIndex(type => type.slug == $tipo.val()),
                    indexEstado = types[indexType].estados.findIndex(estado => estado.slug == evn.target.value)
                $municipio.empty().append('<option value="0" hidden>Selecciona el municipio</option>').val('0').attr('disabled', false)
                for (const key in types[indexType].estados[indexEstado].municipios) {
                    $municipio.append(`<option value="${ types[indexType].estados[indexEstado].municipios[key].slug }">${ types[indexType].estados[indexEstado].municipios[key].municipio }</option>`)
                }
            }),
            resetAll = ((noTypes = false) => {
                $tipo.empty().append('<option value="0">Tipo</option>').attr('disabled', true)
                $estado.empty().append('<option value="0">Estado</option>').attr('disabled', true)
                $municipio.empty().append('<option value="0">Municipio</option>').attr('disabled', true)

                if(noTypes) {
                    $tipo.empty().append('<option value="0">Sin inmuebles</option>').val('0')
                    $submit.attr('disabled', true)
                }
            })
        
        let 
            types = null

        $operacion.on('change', function(evn) {
            resetAll()
            $.ajax({
                url: `${API_URL}/search/transaction`,
                method: 'GET',
                data: { transaction: evn.target.value },
                success: function(response) {
                    if(response) {
                        types = response
                        fillTypes()
                    } else {
                        resetAll(true)
                        types = null
                    }
                },
                error: function() {
                    console.log("No se ha podido obtener la información");
                }
            })
        });

        $tipo.on('change', fillEstados);

        $estado.on('change', fillMunicipios);

        $(formSearchSelector).on('submit', function(evn) {
            evn.preventDefault()
            window.location.href = `/inmuebles/${ $operacion.filter(':checked').val() }${ $tipo.val() != '0' ? 
                `/${ $tipo.val() }${ $estado.val() != '0' ? 
                    `/${ $estado.val() }${ $municipio.val() != '0' ? 
                        `/${ $municipio.val() }` : 
                        `` }` : 
                    `` }` : 
                `` }`
        });
    }
}

function propertyInit() {
    propertyGalleryInit()

    propertyMapInit()
}

function propertyGalleryInit() {
    const 
        gallerySliderSelector = '.gallery-slider',
        gallerySingleSelector = '.gallery-single-image';

    if($(gallerySliderSelector).length > 0) {
        new Glide(gallerySliderSelector, {
            type: 'carousel', 
            perView: 2,
            dragThreshold: false,
            gap: 15,
            breakpoints: {
                991: {
                    perView: 1
                }
            }
        }).mount()

        $('.glide__slide:not(".glide__slide--clone") .gallery-item').magnificPopup({
            type: 'image',
            closeOnContentClick: false,
            closeBtnInside: false,
            gallery: {
                enabled: true
            }            
        });

    } else if($(gallerySingleSelector).length > 0) {
        $('.gallery-item').magnificPopup({
            type: 'image',
            closeOnContentClick: false,
            closeBtnInside: false,
            gallery: {
                enabled: true
            }            
        });
    }
}

function propertyFormChange()
{
    const 
        propertyFormSelector = '.inmueble-form',
        galleryFormSelector = '.gallery-form',
        bodyFormSelector = '.body-form'
    if($window.outerWidth() > 767) {
        if($(galleryFormSelector).find(propertyFormSelector).length == 0) {
            $(propertyFormSelector).appendTo(galleryFormSelector)
        }
    } else {
        if($(bodyFormSelector).find(propertyFormSelector).length == 0) {
            $(propertyFormSelector).appendTo(bodyFormSelector)
        }
    }
}

function propertyMapInit() {

    const 
        loader = new Loader({ apiKey: "AIzaSyCRrSICYKpc3x-Ukf4OOFZvymaQSXodhEQ" }),
        mapSelector = 'map',
        $map = $(`#${ mapSelector }`)

    loader.load().then(() => {
        const 
            location = new google.maps.LatLng(parseFloat($map.attr('data-latitude')), parseFloat($map.attr('data-longitude'))),
            map = new google.maps.Map(document.getElementById(mapSelector), {
                center: location,
                zoom: parseInt($map.attr('data-zoom')),
                mapTypeControl: false,
                scaleControl: false,
                streetViewControl: false,
                rotateControl: false,
                fullscreenControl: false
            }),
            marker = new google.maps.Marker({
                map,
                position: location,
                icon: require("@/assets/img/ui/marker.png"),
            })
    });
}

function propertySliderInit() {
    const propertySliderSelector = '.property-slider'

    if($(propertySliderSelector).length > 0) {
        if($window.outerWidth() < 576) {
            if(!propertySlider) {
                propertySlider = new Glide(propertySliderSelector, {
                    type: 'carousel', 
                    perView: 1.25,
                    focusAt: 'center',
                    gap: 15
                })
                propertySlider.mount()
            }
        } else {
            if(propertySlider) {
                propertySlider.destroy()
                propertySlider = null
            }
        }
    }
}

function propertyOrderInit()
{
    const $order = $('#order-form select[name="order"]')
    $order.on('change', function() {
        const 
            order = $(this).val(),
            path = window.location.pathname,
            params = path.split('/').filter(param => param != ''),
            numParams = params.length

        let paramsWithoutOrder = null

        if(numParams > 3) {
            if(params[numParams - 3] == 'orden') {
                paramsWithoutOrder = params.slice(0, numParams - 3)
            }
        }

        window.location.href = `/${ !paramsWithoutOrder ? params.join('/') : paramsWithoutOrder.join('/') }${ order != '0' ? `/orden/${ order }` : `` }`
    })
}

function contactInit() {

    $('.form-contact').on('submit', function(evn) {
        evn.preventDefault()

        const  
            $form = $(this),
            valid = formVerifyRequired($form.find('.required'))

        if(valid) {

            const 
                $submit = $form.find('button'),
                lightbox = '#lightbox-form',
                $lightbox = getLightboxForm()

            $submit.attr('disabled', true)

            $lightbox.$success.addClass('d-none')
            $lightbox.$error.addClass('d-none')
            $lightbox.$email.addClass('animate')
            $lightbox.$text.text('Enviando datos del formulario')

            openLightbox(lightbox, true)

            $.ajax({
                url: `${API_URL}/form-send`,
                method: 'POST',
                data: $(this).serializeArray(),
                success: function(response) {
                    setTimeout(function () {
                        $lightbox.$email.removeClass('animate')
                        $lightbox.find('.mfp-close').removeClass('d-none')

                        $submit.attr('disabled', false)

                        if(!response.error) {
                            $lightbox.$success.removeClass('d-none')
                            $lightbox.$text.text('Gracias por tus comentarios, nos pondremos en contacto lo más pronto posible')

                            formReset($form)
                            // window.dataLayer.push({'event': 'contactoSubmit'})
                        } else {
                            $lightbox.$error.removeClass('d-none')
                            $lightbox.$text.text('Error al enviar tu petición')
                            console.log(response.error.contactMessage);
                        }
                    }, 1000);
                },
                error: function() {
                    $lightbox.$error.removeClass('d-none')
                    $lightbox.$text.text('Error al enviar tu petición')
                    console.log("No se ha podido obtener la información del servidor");
                }
            })
        }
    })
}

function getLightboxForm() {
    let 
        $lightbox = $('#lightbox-form')
    
    $lightbox.$text = $lightbox.find('.help-text')
    $lightbox.$email = $lightbox.find('.icon-email')
    $lightbox.$success = $lightbox.find('.icon-success')
    $lightbox.$error = $lightbox.find('.icon-error')

    return $lightbox
}

function formVerifyRequired($fields) {
    let 
        valid = true

    $fields.each(function() {
        const 
            tag = $(this).prop('localName'),
            placeholder = $(this).attr(placeholderName),
            value = $.trim($(this).val())

        if(tag == 'input') {
            const 
                type = $(this).attr('type')
            if(type == 'text') {
                if(value.length < 4) {
                    $(this).attr('placeholder', `${placeholder} requerido`).focus()
                    valid = false
                }
            } else if(type == 'email') {
                if(!validateEmail(value)) {
                    $(this).val('').attr('placeholder', `${placeholder} no valido`).focus()
                    valid = false
                }
            }
        } else if(tag == 'textarea') {
            if(value.length < 5) {
                $(this).val('').attr('placeholder', `${placeholder} requerido`).focus()
                valid = false
            }
        }

        if(!valid) {
            return false
        }
    })

    return valid
}

function formReset($form) {
    const 
        $fields = $form.find('input[type=text], input[type=email], textarea')

    $fields.each(function() {
        $(this).val('').attr('placeholder', $(this).attr(placeholderName))
    })
}

function lightboxLinksInit() {
    const 
        $links = $('.lightbox-link')

    $links.each(function() {
        $(this).magnificPopup({
            items: {
                type: 'inline',
                src: `#${$(this).attr('href')}`
            },
            mainClass: 'mfp-zoom-in',
            midClick: true,
            removalDelay: 500,
            closeMarkup: '<button type="button" class="mfp-close"></button>',
            callbacks: {
                open: lightboxOpen,
                close: lightboxClose
            }
        })
    })

    $('.lightbox-close').on('click', function() {
        $(`#${ $(this).attr('data-lightbox') }`).magnificPopup('close')
    })
}

function openLightbox(id, modal) {
    $.magnificPopup.open({
        items: {
            type: 'inline',
            src: id
        },
        mainClass: 'mfp-zoom-in',
        removalDelay: 500,
        closeOnBgClick: !modal,
        enableEscapeKey: !modal,
        closeMarkup: '<button type="button" class="mfp-close' + (modal ? ' d-none' : '') + '"></button>',
        callbacks: {
            open: lightboxOpen,
            close: lightboxClose
        }
    })
}

function lightboxOpen() {
    bodyLock(true)
    $header.css('width', $root.width())
}

function lightboxClose() {
    bodyLock(false)
    $header.css('width', '100%')
}

function bodyLock(lock) {
    if(lock) {
        $body.addClass('no-scroll')
    } else {
        $body.removeClass('no-scroll')
    }
}

function isMobile() {
    return $window.outerWidth() < 768
}

function validateEmail(email) {
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(String(email).toLowerCase())
}