<?php

namespace Modules\DataRepository\Services;

use App\Constants\DataTypes;
use Modules\DataRepository\Entities\DataRepositoryKey;
use Modules\DataRepository\Entities\DataRepositoryValue;

class DataRepositoryService
{
    public function get(int $dataRepositoryId)
    {
        $dataKeys = DataRepositoryKey::where('data_repository_id', $dataRepositoryId)->get();
        $data = [];

        // Loop through each key and fetch associated values
        foreach ($dataKeys as $key) {
            $values = DataRepositoryValue::where('data_repository_key_id', $key->id)->get()->pluck('data_repository_value');
            $formattedValues = $this->returnFormattedValues($key->data_type_id, $values->toArray());
            $data[] = [
                'data_keys' => $key->data_repository_key,
                'data_type_id' => $key->data_type_id,
                'data_values' => $formattedValues,
            ];
        }

        return $data;
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

        $requestData = $request->json()->all();

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
