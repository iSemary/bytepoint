<?php

namespace Modules\DataRepository\Services;

use App\Constants\DataTypes;
use Modules\DataRepository\Entities\DataRepositoryKey;
use Modules\DataRepository\Entities\DataRepositoryValue;

class DataRepositoryService
{
    public function get(int $dataRepositoryId)
    {
        $dataKeys = DataRepositoryKey::where('data_repository_id', $dataRepositoryId)->orderBy("id")->get();
        $data = [];

        // Loop through each key and fetch associated value·
        foreach ($dataKeys as $key) {
            $values = DataRepositoryValue::where('data_repository_key_id', $key->id)->orderByDesc("id")->get()->pluck('data_repository_value');
            $formattedValues = $this->returnFormattedValues($key->data_type_id, $values->toArray());
            $data[] = [
                'data_keys' => $key->data_repository_key,
                'data_type_id' => $key->data_type_id,
                'data_values' => $formattedValues,
            ];
        }

        return $data;
    }

    public function all(int $dataRepositoryId)
    {
        $dataKeys = DataRepositoryKey::where('data_repository_id', $dataRepositoryId)->orderBy("id")->get();
        $firstKey = $dataKeys->first();
        $values = DataRepositoryValue::where('data_repository_key_id', $firstKey->id)->orderByDesc("id")->get();
        return ['data' => $this->keyValuesFormatter($dataKeys, $values)];
    }

    public function paginate(int $dataRepositoryId, int $perPage = 15)
    {
        $perPage = request()->per_page ?? $perPage;

        $dataKeys = DataRepositoryKey::where('data_repository_id', $dataRepositoryId)->orderBy("id")->get();
        $firstKey = $dataKeys->first();
        $values = DataRepositoryValue::where('data_repository_key_id', $firstKey->id)->orderByDesc("id")->paginate($perPage);

        return [
            'data' => $this->keyValuesFormatter($dataKeys, $values),
            'pagination' => [
                'total' => $values->total(),
                'per_page' => $values->perPage(),
                'current_page' => $values->currentPage(),
                'last_page' => $values->lastPage(),
                'from' => $values->firstItem(),
                'to' => $values->lastItem(),
            ]
        ];
    }

    public function count(int $dataRepositoryId)
    {
        $firstKey = DataRepositoryKey::where('data_repository_id', $dataRepositoryId)->first();
        return DataRepositoryValue::where('data_repository_key_id', $firstKey->id)->count();
    }

    private function keyValuesFormatter($dataKeys, $values)
    {
        $data = [];
        foreach ($values as $index => $value) {
            $rowData = [];
            foreach ($dataKeys as $key) {
                $rowValue = DataRepositoryValue::where('data_repository_key_id', $key->id)->skip($index)->first();
                $formattedValue = $rowValue ? $this->returnFormattedValues($key->data_type_id, [$rowValue->data_repository_value])[0] : null;
                $rowData[$key->data_repository_key] = $formattedValue;
            }
            $data[] = $rowData;
        }
        return $data;
    }

    public function hasKeys(int $dataRepositoryId): bool
    {
        return DataRepositoryKey::where('data_repository_id', $dataRepositoryId)->exists();
    }

    public function hasValues(int $dataRepositoryId): bool
    {
        $keyIds = DataRepositoryKey::where('data_repository_id', $dataRepositoryId)->pluck('id');

        return DataRepositoryValue::whereIn('data_repository_key_id', $keyIds)->exists();
    }

    public function returnKeys(int $dataRepositoryId)
    {
        return DataRepositoryKey::where('data_repository_id', $dataRepositoryId)->get();
    }

    public function sync(int $dataRepositoryId, $request)
    {
        $data = $this->prepareRequest($request);

        $dataKeys = $data['data_keys'];
        $dataTypes = $data['data_types'];
        $dataValues = $data['data_values'];

        $this->delete($dataRepositoryId);

        foreach ($dataKeys as $index => $key) {
            $values = $dataValues[$index];
            $type = $dataTypes[$index];
            $this->syncKey($dataRepositoryId, $key, $type, $values);
        }
    }

    private function returnFormattedValues(int $dataTypeId, array $values)
    {
        $formattedValues = [];
        switch ($dataTypeId) {
            case DataTypes::STRING:
                foreach ($values as $value) {
                    $formattedValues[] = (string) $value;
                }
                break;

            case DataTypes::INTEGER:
                foreach ($values as $value) {
                    $formattedValues[] = (int) $value;
                }
                break;

            case DataTypes::FLOAT:
                foreach ($values as $value) {
                    $formattedValues[] = (float) $value;
                }
                break;

            case DataTypes::BOOLEAN:
                foreach ($values as $value) {
                    $formattedValues[] = (bool) $value;
                }
                break;

            case DataTypes::DATE:
                foreach ($values as $value) {
                    $formattedValues[] = date('Y-m-d\TH:i:sP', strtotime($value));
                }
                break;

            case DataTypes::ISO_DATE:
                foreach ($values as $value) {
                    $formattedValues[] = date('Y-m-d', strtotime($value));
                }
                break;

            default:
                $formattedValues = $values;
                break;
        }
        return $formattedValues;
    }

    private function prepareRequest($request)
    {
        $dataKeys = [];
        $dataTypes = [];
        $dataValues = [];

        $requestData = is_array($request) ?  $request : $request->json()->all();

        foreach ($requestData['data'] as $item) {
            $key = $item['key'];
            $type = $item['type'];
            $values = $item['values'];

            $dataKeys[] = $key;
            $dataTypes[] = $type;
            $dataValues[] = $values;
        }

        return [
            'data_keys' => $dataKeys,
            'data_types' => $dataTypes,
            'data_values' => $dataValues,
        ];
    }

    private function syncKey(int $dataRepositoryId, string $key, $type, $values)
    {
        // Check if the key already exists
        $existingKey = DataRepositoryKey::withTrashed()
            ->where('data_repository_id', $dataRepositoryId)
            ->where('data_repository_key', $key)
            ->first();

        if ($existingKey) {
            // If found, restore it
            if ($existingKey->trashed()) {
                $existingKey->restore();
            }
            // Update the key details
            $existingKey->update(['data_repository_key' => $key]);
        } else {
            // If not found, create a new row
            $keyModel = DataRepositoryKey::create([
                'data_repository_id' => $dataRepositoryId,
                'data_repository_key' => $key,
                'data_type_id' => $type
            ]);
        }

        // Sync the values for the key
        $this->syncValue($existingKey->id ?? $keyModel->id, $values);
    }

    private function countOccurrences(array $array): array
    {
        $counts = [];
        foreach ($array as $value) {
            $key = serialize($value);
            if (!isset($counts[$key])) {
                $counts[$key] = [
                    'count' => 0,
                    'value' => $value
                ];
            }
            $counts[$key]['count']++;
        }
        return array_values($counts);
    }

    private function syncValue(int $dataRepositoryKeyId, $values)
    {
        // Count occurrences of each value in the $values array
        $valueCounts = $this->countOccurrences($values);

        foreach ($valueCounts as $valueData) {
            $value = $valueData['value'];
            $count = $valueData['count'];

            // Create duplicate records for each occurrence greater than one
            for ($i = 0; $i < $count; $i++) {
                DataRepositoryValue::create([
                    'data_repository_key_id' => $dataRepositoryKeyId,
                    'data_repository_value' => $value
                ]);
            }
        }
    }

    private function delete(int $dataRepositoryId)
    {
        $deletedKeys = DataRepositoryKey::where('data_repository_id', $dataRepositoryId)->delete();

        $deletedValuesCount = 0;

        $deletedKeyIds = DataRepositoryKey::withTrashed()
            ->where('data_repository_id', $dataRepositoryId)
            ->pluck('id');

        foreach ($deletedKeyIds as $keyId) {
            $deletedValuesCount += DataRepositoryValue::where('data_repository_key_id', $keyId)->delete();
        }

        return [
            'deleted_keys' => $deletedKeys,
            'deleted_values' => $deletedValuesCount,
        ];
    }
}
