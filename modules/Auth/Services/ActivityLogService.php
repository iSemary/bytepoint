<?php

namespace Modules\Auth\Services;

use Spatie\Activitylog\Models\Activity;

class ActivityLogService
{
    public function get()
    {
        $activities = Activity::orderBy('id', 'desc')->paginate(25);
        return $this->formatActivityLog($activities);
    }

    private function formatActivityLog($activities)
    {
        return [
            "current_page" => $activities->currentPage(),
            "data" => $this->formatActivityItems($activities->items()),
            "first_page_url" => $activities->url(1),
            "from" => $activities->firstItem(),
            "last_page" => $activities->lastPage(),
            "last_page_url" => $activities->url($activities->lastPage()),
            "next_page_url" => $activities->nextPageUrl(),
            "path" => $activities->path(),
            "per_page" => $activities->perPage(),
            "prev_page_url" => $activities->previousPageUrl(),
            "to" => $activities->lastItem(),
            "total" => $activities->total()
        ];
    }


    private function formatActivityItems($items)
    {
        return array_map(function ($item) {
            $causerName = null;

            if ($item->causer_type === 'App\Models\User' && $item->causer_id) {
                $causer = \App\Models\User::find($item->causer_id);
                $causerName = $causer ? $causer->name : null;
            }

            return [
                'id' => $item->id,
                'log_name' => $item->log_name,
                'description' => $item->description,
                'subject_id' => $item->subject_id,
                'subject_type' => class_basename($item->subject_type),
                'causer_id' => $item->causer_id,
                'causer_name' => $causerName,
                'causer_type' => $item->causer_type,
                'properties' => $item->properties->toArray(),
                'created_at' => $item->created_at->toDateTimeString(),
            ];
        }, $items);
    }
}
