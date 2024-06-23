<?php

namespace Modules\Customer\Repository;

use App\Models\Customer;

class CustomerRepository {

    public function create(array $data) {
        return Customer::create($data);
    }
}
