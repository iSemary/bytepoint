<?php

namespace Modules\Key\Services;

use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;
use Modules\Key\Entities\Key;

class KeyService
{
    public function store($request)
    {
        try {
            DB::beginTransaction();

            $request['expire_at'] = $request['expire_at'] ? strtotime($request['expire_at']) : null;
            $request['key_value'] = Crypt::encryptString($request['key_value']);

            Key::create($request);

            DB::commit();
            return ['success' => true];
        } catch (\Exception $e) {
            DB::rollBack();
            return ['success' => false, 'message' => $e->getMessage() . " L" . $e->getLine()];
        }
    }
}
