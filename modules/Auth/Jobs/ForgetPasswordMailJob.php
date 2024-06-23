<?php

namespace Modules\Auth\Jobs;

use Modules\Auth\Mail\ForgetPasswordMail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;
use Spatie\Multitenancy\Models\Tenant;

class ForgetPasswordMailJob implements ShouldQueue {
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
    private $user;
    private $token;
    protected $tenantId;
    /**
     * Create a new job instance.
     */
    public function __construct($user, $token, $tenantId) {
        $this->user = $user;
        $this->token = $token;
        $this->tenantId = $tenantId;
        $tenant = Tenant::find($this->tenantId);
        $tenant->makeCurrent();
    }

    /**
     * Execute the job.
     */
    public function handle(): void {
        $data = [
            'name' => $this->user->name,
            'email' => $this->user->email,
            'token' => $this->token,
        ];
        Mail::to($this->user['email'])->send(new ForgetPasswordMail($data));
    }
}
