<?php

class Template {

    public function getCorreoDatos($data) 
    {
        return 
            $this->getStyle() . '<div style="height:100%;margin:0;padding:0;width:100%;background-color:#f0f0f0">
                <center>
                    <table align="center" border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" style="border-collapse:collapse;height:100%;margin:0;padding:0;width:100%;background-color:#f0f0f0">
                        <tbody>
                            <tr>
                                <td align="center" valign="top" style="height:100%;margin:0;padding:10px;width:100%;border-top:10px solid #f0f0f0">
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;border:1px solid #c3c3c3;max-width:600px!important">
                                        <tbody>
                                            <tr>
                                                <td valign="top" style="background:#ffffff none no-repeat center/cover;background-color:#ffffff;background-image:none;background-repeat:no-repeat;background-position:center;background-size:cover;border-top:0;border-bottom:0;padding-top:9px;padding-bottom:0">
                                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%;border-collapse:collapse">
                                                        <tbody>
                                                            <tr>
                                                                <td valign="top" style="padding-top:9px">
                                                                    <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%;min-width:100%;border-collapse:collapse" width="100%">
                                                                        <tbody>
                                                                            <tr>
                                                                                <td valign="top" style="padding-top:0;padding-right:18px;padding-bottom:9px;padding-left:18px;word-break:break-word;color:#1891f6;font-family:\'Source Sans Pro\',\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:16px;line-height:150%;text-align:left">
                                                                                    <h1 style="text-align:center;display:block;margin:0;padding:0;color:#1891f6;font-family:\'Source Sans Pro\',\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:30px;font-style:normal;font-weight:bold;line-height:125%;letter-spacing:normal">Información del formulario de contacto</h1>
                                                                                    <div><br></div>
                                                                                    <div>Nombre: ' . $data['nombre'] . '<br></div>
                                                                                    <div>Teléfono: ' . $data['telefono'] . '</div>
                                                                                    <div>Correo electrónico: ' . $data['correo'] . '</div>
                                                                                    <div>Mensaje: ' . $data['mensaje'] . '</div>
                                                                                    ' . ( isset( $data['property'] ) ? 
                                                                                        '<div>Inmueble de interes: <a href="' . $_SERVER['REQUEST_SCHEME'] . '://' . $_SERVER['SERVER_NAME'] . '/inmueble/' . $data['property']['slug'] . '">' . $data['property']['transaction'] . ' ' . $data['property']['type'] . ' en ' . $data['property']['postal_code']['municipio'] . ", " . $data['property']['postal_code']['estado'] . '</a></div>' : 
                                                                                        '' 
                                                                                    ) . '
                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </center>
            </div>';
    }

    public function getStyle()
    {
        return 
            '<style type="text/css" nonce="FwsHS4uoob38nuGvTUXE+Q">
                body,
                td {
                    font-size: 13px
                }
                a:link,
                a:active {
                    color: #1155CC;
                    text-decoration: none
                }
                a:hover {
                    text-decoration: underline;
                    cursor: pointer
                }
                a:visited {
                    color: ##6611CC
                }
                img {
                    border: 0px
                }
                pre {
                    white-space: pre;
                    white-space: -moz-pre-wrap;
                    white-space: -o-pre-wrap;
                    white-space: pre-wrap;
                    word-wrap: break-word;
                    max-width: 800px;
                    overflow: auto;
                }
                .logo {
                    left: -7px;
                    position: relative;
                }
            </style>';
    }
}

