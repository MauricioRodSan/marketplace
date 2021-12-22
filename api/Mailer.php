<?php

require_once( __DIR__ . "/./vendor/autoload.php" );

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;

class Mailer {

    private $mail;
    private $fromDefault = [
        'email' => 'noreply@futurplace.mx',
        'password' => '3lPwx!=!zxRq',
        'name' => 'Futurplace'
    ];

    public $error;

    function __construct($message, $from = false) 
    {
        $this->mail = new PHPMailer();

        $this->mail->isSMTP();
        $this->mail->SMTPDebug = SMTP::DEBUG_OFF;
        $this->mail->SMTPAuth = true;
        $this->mail->SMTPSecure = 'ssl';
        $this->mail->Host = 'mail.futurplace.mx';
        $this->mail->Port = 465;

        $this->mail->Username = (!$from ? $this->fromDefault['email'] : $from['email']);
        $this->mail->Password = (!$from ? $this->fromDefault['password'] : $from['password']);

        $this->mail->setFrom((!$from ? $this->fromDefault['email'] : $from['email']), utf8_decode(!$from ? $this->fromDefault['name'] : $from['name']));

        $this->mail->Subject = utf8_decode($message['subject']);
        $this->mail->msgHTML(utf8_decode($message['body']));
    }

    public function send($to) 
    {
        if(is_array($to)) {
            foreach($to as $email) {
                $this->mail->addAddress($email);
            }
        } else {
            $this->mail->addAddress($to);
        }

        if(!$this->mail->send()) {
            $this->error = $this->mail->ErrorInfo;
            return false;   
        }
        return true;
    }
    
}