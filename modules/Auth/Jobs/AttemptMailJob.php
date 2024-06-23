<?php

namespace Modules\Auth\Jobs;

use Modules\Auth\Mail\AttemptMail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;
use Spatie\Multitenancy\Models\Tenant;

class AttemptMailJob implements ShouldQueue {
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
    private $user;
    private $details;
    protected $tenantId;
    /**
     * Create a new job instance.
     */
    public function __construct($user, $details, $tenantId) {
        $this->user = $user;
        $this->details = $details;
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
            'ip' => $this->details->ip,
            'agent' => $this->details->agent,
            'created_at' => $this->details->created_at,
        ];
        Mail::to($this->user['email'])->send(new AttemptMail($data));
    }
}
