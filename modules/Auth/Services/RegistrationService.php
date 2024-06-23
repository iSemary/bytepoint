<?php

namespace Modules\Auth\Services;

use Modules\Auth\Entities\EmailToken;
use Illuminate\Support\Facades\DB;
use Exception;
use Modules\Auth\Jobs\RegistrationMailJob;
use Modules\Auth\Repository\UserRepository;
use Modules\Customer\Repository\CustomerRepository;
use Modules\Tenant\Helper\TenantHelper;
use Modules\Tenant\Repository\TenantRepository;
use Spatie\Multitenancy\Models\Tenant;

class RegistrationService {
    protected $customerRepository;
    protected $tenantRepository;
    protected $userRepository;

    public function __construct(CustomerRepository $customerRepository, TenantRepository $tenantRepository, UserRepository $userRepository) {
        $this->customerRepository = $customerRepository;
        $this->tenantRepository = $tenantRepository;
        $this->userRepository = $userRepository;
    }


    public function register(array $userRequest) {
        try {
            DB::beginTransaction();

            // reformat the customer username to ensure that the customer username is clear
            $customerUsername = TenantHelper::format($userRequest['customer_username']);
            // initiate new tenant with it's database and migrations
            $tenant = $this->tenantRepository->init($customerUsername);
            // collect customer data
            $customerData = [
                'name' => $userRequest['customer_title'],
                'username' => $customerUsername,
                'category_id' => $userRequest['category_id'],
                'tenant_id' => $tenant->id
            ];

            // create new customer
            $customer = $this->customerRepository->create($customerData);
            $userRequest['customer_id'] = $customer->id;

            // Set the current tenant
            $tenant = TenantHelper::makeCurrent($customerUsername);

            // Create user in tenant database
            $user = $tenant->execute(function () use ($userRequest) {
                return $this->userRepository->create($userRequest);
            });

            // Create email token
            $token = $tenant->execute(function () use ($user) {
                return EmailToken::createToken($user->id);
            });
            // Fire Email Confirmation Queue
            $this->sendRegistrationMail($user, $token, $tenant->id);

            DB::commit();

            return [
                'user' => $user,
                'redirect' => TenantHelper::generateURL($customerUsername)
            ];
        } catch (Exception $e) {
            DB::rollback();
            throw $e;
        }
    }


    private function sendRegistrationMail($user, $token, $tenantId) {
        RegistrationMailJob::dispatchAfterResponse($user, $token, $tenantId);
    }
}
