<?php

namespace App\Http\Controllers;

use App\Http\Requests\AboutRequest;
use App\Models\About;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class AboutController extends Controller
{
    /**
     * Get all About records and return as JSON list.
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        return response()->json([
            'list' => About::all(),
        ]);
    }

    /**
     * Store a newly created About record using validated data.
     * @param AboutRequest $request
     * @return JsonResponse
     */
    public function store(AboutRequest $request): JsonResponse
    {
        $data = About::create($request->validated());

        if (!$data) {
            return response()->json([
                'error' => ['message' => 'ការបញ្ចូលទិន្នន័យ About បានបរាជ័យ'],
            ], 500);
        }

        return response()->json([
            'data' => $data,
            'message' => 'ការបញ្ចូលទិន្នន័យ About ត្រូវបានជោគជ័យ',
        ]);
    }

    /**
     * Find and return a specific About record by ID.
     * @param string $id
     * @return JsonResponse
     */
    public function show(string $id): JsonResponse
    {
        return response()->json([
            'data' => About::find($id),
        ]);
    }

    /**
     * Update an existing About record with validated data.
     * @param AboutRequest $request
     * @param string $id
     * @return JsonResponse
     */
    public function update(AboutRequest $request, string $id): JsonResponse
    {
        $data = About::findOrFail($id);
        $data->update($request->validated());

        return response()->json([
            'data' => $data,
            'message' => 'ការកែប្រែទិន្នន័យ About ត្រូវបានជោគជ័យ',
        ]);
    }

    /**
     * Delete an About record from the database.
     * @param string $id
     * @return JsonResponse
     */
    public function destroy(string $id): JsonResponse
    {
        $data = About::findOrFail($id);
        $data->delete();

        return response()->json([
            'message' => 'ការលុបទិន្នន័យ About ត្រូវបានជោគជ័យ',
        ]);
    }
}