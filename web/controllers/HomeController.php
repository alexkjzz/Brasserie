<?php

class HomeController
{
    public function index()
    {
        echo "Méthode index() appelée";
        require_once 'views/home.php';
    }
}
