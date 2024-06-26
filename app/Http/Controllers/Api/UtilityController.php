<?php

namespace App\Http\Controllers\Api;

use App\Models\Category;
use App\Models\Country;
use App\Models\DataType;

class UtilityController extends ApiController {
    public function getCategories() {
        $categories = Category::orderBy("id", "DESC")->get();
        return $this->return(200, 'Categories fetched successfully', ['data' => $categories]);
    }

    public function getCountries() {
        $countries = Country::orderBy("id", "DESC")->get();
        return $this->return(200, 'Countries fetched successfully', ['data' => $countries]);
    }

    public function getDataTypes() {
        $dataTypes = DataType::orderBy("id", "DESC")->get();
        return $this->return(200, 'Data Types fetched successfully', ['data' => $dataTypes]);
    }
}
