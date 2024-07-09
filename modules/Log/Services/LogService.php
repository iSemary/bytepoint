<?php

namespace Modules\Log\Services;

use Modules\Log\Entities\Log;

class LogService
{
    protected $log;

    public function __construct(Log $log)
    {
        $this->log = $log;
    }

    public function log(string $service, string $title, string $type, array $content, bool $internal = false): void
    {
        $this->log->create(['service' => $service, 'title' => $title, 'type' => $type, 'body' => $content, 'internal' => $internal]);
    }
}
