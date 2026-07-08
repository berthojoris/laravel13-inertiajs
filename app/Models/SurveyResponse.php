<?php

namespace App\Models;

use App\Enums\Department;
use App\Enums\SurveyChannel;
use Database\Factories\SurveyResponseFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $user_id
 * @property string $respondent_name
 * @property string $email
 * @property Department $department
 * @property int $satisfaction_score
 * @property SurveyChannel $channel
 * @property string|null $feedback
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['user_id', 'respondent_name', 'email', 'department', 'satisfaction_score', 'channel', 'feedback'])]
class SurveyResponse extends Model
{
    /** @use HasFactory<SurveyResponseFactory> */
    use HasFactory;

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'department' => Department::class,
            'satisfaction_score' => 'integer',
            'channel' => SurveyChannel::class,
        ];
    }
}
