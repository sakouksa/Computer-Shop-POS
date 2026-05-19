<?php

namespace App\Http\Controllers;

use App\Models\PaymentMethod;
use App\Http\Requests\StorePaymentMethodRequest;

// Import Request របស់អ្នក
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class PaymentMethodeController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:paymentmethod.view', only: ['index']),
            new Middleware('permission:paymentmethod.viewone', only: ['show']),
            new Middleware('permission:paymentmethod.create', only: ['store']),
            new Middleware('permission:paymentmethod.update', only: ['update']),
            new Middleware('permission:paymentmethod.delete', only: ['destroy']),
        ];
    }

    public function index(Request $req)
    {
        $query = PaymentMethod::query();

        if ($req->has('txt_search')) {
            $search = $req->input('txt_search');
            $query->where(function ($q) use ($search) {
                $q->where("name", "LIKE", "%$search%")
                    ->orWhere("code", "LIKE", "%$search%");
            });
        }

        if ($req->has('status')) {
            $query->where("is_active", $req->input('status') == 'active' ? 1 : 0);
        }

        $list = $query->orderBy("id", "desc")->get();

        return response()->json([
            'list' => $list,
            'total' => $list->count(),
        ]);
    }

    /**
     * ប្រើ StorePaymentMethodRequest ជំនួស Validator
     */
    public function store(StorePaymentMethodRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('logo')) {
            $data['logo'] = $request->file('logo')->store('payment_methods', 'public');
        }

        $paymentMethod = PaymentMethod::create($data);

        return response()->json([
            "data" => $paymentMethod,
            'message' => 'Payment method created successfully',
        ], 200);
    }

    public function show(string $id)
    {
        $paymentMethod = PaymentMethod::find($id);
        if (!$paymentMethod) return response()->json(['message' => 'Not found'], 404);

        return response()->json(["data" => $paymentMethod]);
    }

    /**
     * ប្រើ StorePaymentMethodRequest ជំនួស Validator
     */
    public function update(StorePaymentMethodRequest $request, string $id)
    {
        $paymentMethod = PaymentMethod::find($id);
        if (!$paymentMethod) return response()->json(['message' => 'Not found'], 404);

        $data = $request->validated();
        $logoPath = $paymentMethod->logo;

        if ($request->hasFile('logo')) {
            if ($paymentMethod->logo) {
                Storage::disk('public')->delete($paymentMethod->logo);
            }
            $logoPath = $request->file('logo')->store('payment_methods', 'public');
        } else if ($request->image_remove == "true") {
            if ($paymentMethod->logo) {
                Storage::disk('public')->delete($paymentMethod->logo);
            }
            $logoPath = null;
        }

        $data['logo'] = $logoPath;
        $paymentMethod->update($data);

        return response()->json([
            "data" => $paymentMethod,
            'message' => 'Payment method updated successfully',
        ], 200);
    }

    public function destroy(string $id)
    {
        $paymentMethod = PaymentMethod::find($id);
        if (!$paymentMethod) return response()->json(['message' => 'Not found'], 404);

        if ($paymentMethod->logo) {
            Storage::disk('public')->delete($paymentMethod->logo);
        }

        $paymentMethod->delete();
        return response()->json(['message' => 'Payment method deleted successfully'], 200);
    }
}
