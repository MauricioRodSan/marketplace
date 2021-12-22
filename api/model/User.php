<?php

class User {
    private $connection;

    public function __construct($db)
    {
        $this->connection = $db;
        $this->connection->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING );
    }

    public function changes( $user, $changes )
    {
        $response = [];
        if( isset( $changes['person'] ) ) {
            $response['person'] = [];
            $queryPerson = $this->connection->prepare(
                "UPDATE 
                    person 
                        SET " . implode( ", ", array_map( function( $key ) { return $key . " = :" . $key; }, array_keys( $changes['person'] ), $changes['person'] ) ) . " 
                        WHERE 
                            user_id = :user"
            );
            $queryPerson->bindValue( ":user", $user );
            foreach ( $changes['person'] as $key => $value ) {
                $queryPerson->bindValue( ":" . $key, $value );
            }
            if( $queryPerson->execute() ) {
                $response['person'] = $this->getUser( $user );
            } else {
                $response['person']['error'] = [
                    'message' => "Error al guardar los cambios"
                ];
            }
        }

        if( isset( $changes['user'] ) ) {
            $response['user'] = [];
            if( isset( $changes['user']['password'] ) ) {
                $queryCurrentPassword = $this->connection->prepare(
                    "SELECT 
                        password 
                        FROM 
                            user 
                            WHERE 
                                id = :user"
                );
                $queryCurrentPassword->bindValue( ":user", $user );
                $queryCurrentPassword->execute();
    
                if( $queryCurrentPassword->rowCount() > 0 ) {
                    $currentPassword = $queryCurrentPassword->fetchColumn();
                    if( password_verify( $changes['user']['password'], $currentPassword ) ) {
                        $changes['user']['password'] = password_hash( $changes['user']['password_new'] , PASSWORD_BCRYPT );
                    } else {
                        unset( $changes['user']['password'] );
                        $response['user']['error'] = [
                            'message' => "La contraseña actual no coincide con la proporcionada"
                        ];
                    }
                    unset( $changes['user']['password_new'] );
                }
            }

            if( isset( $changes['user']['password_new'] ) ) {
                $changes['user']['password'] = password_hash( $changes['user']['password_new'] , PASSWORD_BCRYPT );
                unset( $changes['user']['password_new'] );
            }

            if( count( $changes['user'] ) > 0 ) {
                $queryUser = $this->connection->prepare(
                    "UPDATE 
                        user  
                            SET " . implode( ", ", array_map( function( $key ) { return $key . " = :" . $key; }, array_keys( $changes['user'] ), $changes['user'] ) ) . " 
                            WHERE 
                                id = :user"
                );
                $queryUser->bindValue( ":user", $user );
                foreach ( $changes['user'] as $key => $value ) {
                    $queryUser->bindValue( ":" . $key, $value );
                }
                if( !$queryUser->execute() ) {
                    $response['user']['error'] = [
                        'message' => "No fue posible cambiar la contraseña"
                    ];
                }
            }
        }
        return $response;
    }

    public function logIn( $data )
    {
        $response = false;

        $query = $this->connection->prepare(
            "SELECT 
                user.id, 
                user.password 
                FROM 
                    user 
                    WHERE 
                        user.email = :email"
        );
        $query->bindParam( ":email", htmlspecialchars( strip_tags( $data['email'] ) ) );
        $query->execute();

        if( $query->rowCount() > 0 ) {
            $user = $query->fetch( PDO::FETCH_ASSOC );
            if( password_verify( $data['password'], $user['password'] ) ) {
                $response = $this->getUser( $user['id'], false );
            } else {

            }
        }

        return $response;
    }

    private function getUser( $user, $onlyEditable = true ) 
    {
        $response = false;
        $query = $this->connection->prepare(
            "SELECT 
                person.name,
                person.last_name
                " . ( !$onlyEditable ? 
                    ", user.id, 
                    person.role,
                    person.image" : 
                    "" 
                ) . " 
                FROM 
                    user user 
                    INNER JOIN person person 
                        ON person.user_id = user.id 
                    WHERE 
                        user.id = :user"
        );
        $query->bindParam( ":user", $user );
        $query->execute();

        if( $query->rowCount() > 0 ) {
            $response = $query->fetch( PDO::FETCH_ASSOC );
        }

        return $response;
    }


    
}