<?php

use App\Modules\Fee\Domain\Models\FeeStructure;
use App\Modules\Fee\Domain\Models\LateFeeRule;
use App\Modules\Fee\Domain\Models\StudentFee;
use App\Modules\Fee\Infrastructure\Services\FineCalculationService;
use App\Modules\Student\Domain\Models\Student;
use Illuminate\Support\Carbon;

it('calculates per-day fine with grace days and max limit', function () {
    $rule = new LateFeeRule([
        'name' => 'Per Day Rule',
        'fine_type' => 'per_day',
        'amount' => 10,
        'grace_days' => 2,
        'max_limit' => 100,
    ]);

    $structure = new FeeStructure([
        'amount' => 2000,
        'late_fee_per_day' => 5,
        'max_late_fee' => 500,
        'fee_fine_rule_id' => 1,
    ]);
    $structure->setRelation('lateFeeRule', $rule);
    $structure->setRelation('legacyLateFeeRule', null);

    $student = new Student(['created_by' => 1]);

    $studentFee = new StudentFee([
        'total_amount' => 2000,
        'final_amount' => 2000,
        'due_date' => Carbon::parse('2026-07-10'),
    ]);
    $studentFee->setRelation('student', $student);
    $studentFee->setRelation('structure', $structure);

    $service = new FineCalculationService();
    $result = $service->calculate($studentFee, Carbon::parse('2026-07-15'), 2000);

    // (15 - 10) - 2 grace = 3 days, 3 * 10 = 30
    expect($result['fine_amount'])->toEqual(30.0)
        ->and($result['days_late'])->toEqual(5)
        ->and($result['grace_days'])->toEqual(2)
        ->and($result['effective_late_days'])->toEqual(3.0);
});

it('calculates fixed fine once grace period is crossed', function () {
    $rule = new LateFeeRule([
        'name' => 'Fixed Rule',
        'fine_type' => 'fixed',
        'amount' => 50,
        'grace_days' => 1,
        'max_limit' => 500,
    ]);

    $structure = new FeeStructure([
        'amount' => 1000,
        'late_fee_per_day' => 5,
        'max_late_fee' => 500,
        'fee_fine_rule_id' => 2,
    ]);
    $structure->setRelation('lateFeeRule', $rule);
    $structure->setRelation('legacyLateFeeRule', null);

    $student = new Student(['created_by' => 1]);

    $studentFee = new StudentFee([
        'total_amount' => 1000,
        'final_amount' => 1000,
        'due_date' => Carbon::parse('2026-08-10'),
    ]);
    $studentFee->setRelation('student', $student);
    $studentFee->setRelation('structure', $structure);

    $service = new FineCalculationService();
    $result = $service->calculate($studentFee, Carbon::parse('2026-08-13'), 1000);

    // 3 late days - 1 grace day => fixed fine applies once
    expect($result['fine_amount'])->toEqual(50.0)
        ->and($result['effective_late_days'])->toEqual(2.0);
});
