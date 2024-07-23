<?php

namespace App\Constants;

class ApiServices
{
    const API = 1;
    const Mockup = 2;
    const Template = 3;
    const CloudService = 4;

    public static function getTitle($value)
    {
        $constants = array_flip((new \ReflectionClass(__CLASS__))->getConstants());
        return $constants[$value] ?? null;
    }
}
