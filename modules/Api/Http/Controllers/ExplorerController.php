<?php

namespace Modules\Api\Http\Controllers;

use App\Http\Controllers\Api\ApiController;
use Illuminate\Http\Request;
use Spatie\Multitenancy\Models\Tenant;
use Illuminate\Support\Facades\Storage;

class ExplorerController extends ApiController
{
    public function index(Request $request)
    {
        $tenant = Tenant::current();
        $subPath = $request->path ?? "";
        $basePath = 'tenants/' . $tenant->name . '/' . $subPath;

        $folderChain = $this->buildFolderChain($tenant, $subPath);

        $files = $this->getFilesAndFolders($basePath);

        return $this->return(200, "Explorer fetched successfully", ['files' => $files, 'folder_chain' => $folderChain]);
    }

    private function buildFolderChain($tenant, $subPath)
    {
        $folderChain = [
            [
                'id' => $tenant->id,
                'name' => $tenant->name,
                'isDir' => true
            ]
        ];

        if (!empty($subPath)) {
            $parts = explode('/', $subPath);
            $currentPath = '';
            foreach ($parts as $index => $part) {
                $currentPath .= ($index > 0 ? '/' : '') . $part;
                $folderChain[] = [
                    'id' => $tenant->id . '_' . $currentPath,
                    'name' => $part,
                    'isDir' => true
                ];
            }
        }

        return $folderChain;
    }

    private function getFilesAndFolders($path)
    {
        $contents = Storage::disk('public')->files($path);
        $directories = Storage::disk('public')->directories($path);

        $files = [];

        foreach ($directories as $key => $directory) {
            $dirName = basename($directory);
            $files[] = [
                'id' => $key + 1,
                'name' => $dirName,
                'isDir' => true,
                'path' => $directory,
            ];
        }

        foreach ($contents as $key => $file) {
            $fileName = basename($file);
            $files[] = [
                'id' => $key + 1,
                'name' => $fileName,
                'isDir' => false,
                'path' => $this->getFullUrl($file),
                'thumbnailUrl' => $this->getFullUrl($file),
                'size' => Storage::disk('public')->size($file),
                'extension' => pathinfo($file, PATHINFO_EXTENSION),
            ];
        }

        return $files;
    }

    private function getFullUrl($path)
    {
        return url(Storage::disk('public')->url($path));
    }
}
