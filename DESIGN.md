# Part 3: System Design

## 1. Scaling for 100k+ Users

### Database Optimization

**Read Replicas**
- Implement MySQL master-slave replication
- Direct read queries to replicas (95% of traffic)
- Write queries to master only
- Use Laravel's database configuration:
```php
'mysql' => [
    'read' => [
        'host' => ['replica1.example.com', 'replica2.example.com'],
    ],
    'write' => [
        'host' => ['master.example.com'],
    ],
    'driver' => 'mysql',
    // ... other config
],
```

**Database Indexing**
- Add composite indexes for frequent queries:
```sql
CREATE INDEX idx_user_status ON tasks(user_id, status);
CREATE INDEX idx_due_date_status ON tasks(due_date, status);
CREATE INDEX idx_created_at ON tasks(created_at DESC);
```

**Query Optimization**
- Use eager loading to prevent N+1 queries
- Implement query result caching
- Use `select()` to fetch only needed columns
- Implement pagination everywhere

### Caching Strategy

**Redis Implementation**
```php
// Cache user's tasks for 5 minutes
Cache::remember("user.{$userId}.tasks", 300, function () use ($userId) {
    return Task::where('user_id', $userId)->with('user')->get();
});

// Cache statistics
Cache::remember('tasks.statistics', 3600, function () {
    return [
        'total' => Task::count(),
        'pending' => Task::where('status', 'pending')->count(),
        'completed' => Task::where('status', 'completed')->count(),
    ];
});
```

**Cache Invalidation Strategy**
- Invalidate cache on task create/update/delete
- Use cache tags for granular invalidation
- Implement cache warming for frequently accessed data

### Load Balancing

**Application Layer**
- Deploy multiple Laravel app servers behind load balancer (Nginx/HAProxy)
- Use sticky sessions for Sanctum authentication
- Horizontal scaling with container orchestration (Kubernetes)

**Configuration**
```nginx
upstream backend {
    least_conn;
    server app1.example.com:8000;
    server app2.example.com:8000;
    server app3.example.com:8000;
}

server {
    listen 80;
    location / {
        proxy_pass http://backend;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### CDN & Asset Optimization

**Frontend Optimization**
- Serve React build through CDN (CloudFlare/AWS CloudFront)
- Enable Gzip/Brotli compression
- Implement code splitting and lazy loading
- Use React.lazy() for route-based code splitting

### API Rate Limiting

**Laravel Throttle Middleware**
```php
// routes/api.php
Route::middleware(['auth:sanctum', 'throttle:60,1'])->group(function () {
    Route::apiResource('tasks', TaskController::class);
});

// Custom rate limiting
RateLimiter::for('api', function (Request $request) {
    return Limit::perMinute(100)->by($request->user()?->id ?: $request->ip());
});
```

### Session Management

**Redis Session Driver**
```env
SESSION_DRIVER=redis
CACHE_DRIVER=redis
QUEUE_CONNECTION=redis
```

### Monitoring & Auto-Scaling

**Infrastructure**
- Use AWS Auto Scaling Groups or Kubernetes HPA
- Monitor CPU, memory, response times
- Scale based on metrics (>70% CPU triggers scaling)
- Implement health checks

**Tools**
- Application Performance Monitoring (New Relic, Datadog)
- Error tracking (Sentry)
- Log aggregation (ELK Stack, CloudWatch)

---

## 2. Background Jobs Implementation

### Queue System Architecture

**Laravel Queue Configuration**
```php
// config/queue.php
'connections' => [
    'redis' => [
        'driver' => 'redis',
        'connection' => 'default',
        'queue' => env('REDIS_QUEUE', 'default'),
        'retry_after' => 90,
        'block_for' => null,
    ],
],
```

### Task Reminder System

**Create Reminder Job**
```bash
php artisan make:job SendTaskReminderJob
```

**Job Implementation**
```php
<?php

namespace App\Jobs;

use App\Models\Task;
use App\Notifications\TaskReminderNotification;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendTaskReminderJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3;
    public $timeout = 60;

    public function __construct(
        public Task $task
    ) {}

    public function handle(): void
    {
        // Check if task is still pending/in_progress
        if (in_array($this->task->status, ['pending', 'in_progress'])) {
            // Send notification
            $this->task->user->notify(new TaskReminderNotification($this->task));
        }
    }

    public function failed(\Throwable $exception): void
    {
        \Log::error('Task reminder failed', [
            'task_id' => $this->task->id,
            'error' => $exception->getMessage()
        ]);
    }
}
```

**Scheduled Task Reminders**
```php
// app/Console/Kernel.php
protected function schedule(Schedule $schedule): void
{
    // Send reminders for tasks due tomorrow
    $schedule->call(function () {
        $tomorrow = now()->addDay()->toDateString();
        
        Task::whereDate('due_date', $tomorrow)
            ->whereIn('status', ['pending', 'in_progress'])
            ->chunk(100, function ($tasks) {
                foreach ($tasks as $task) {
                    SendTaskReminderJob::dispatch($task)
                        ->onQueue('reminders');
                }
            });
    })->daily()->at('09:00');

    // Send reminders for overdue tasks
    $schedule->call(function () {
        Task::where('due_date', '<', now()->toDateString())
            ->whereIn('status', ['pending', 'in_progress'])
            ->chunk(100, function ($tasks) {
                foreach ($tasks as $task) {
                    SendTaskReminderJob::dispatch($task)
                        ->onQueue('urgent');
                }
            });
    })->hourly();
}
```

### Additional Background Jobs

**Task Statistics Aggregation**
```php
// app/Jobs/AggregateTaskStatisticsJob.php
class AggregateTaskStatisticsJob implements ShouldQueue
{
    public function handle(): void
    {
        $stats = [
            'total_tasks' => Task::count(),
            'completed_today' => Task::where('status', 'completed')
                ->whereDate('updated_at', today())
                ->count(),
            'overdue' => Task::where('due_date', '<', today())
                ->whereIn('status', ['pending', 'in_progress'])
                ->count(),
        ];

        Cache::put('task.statistics', $stats, now()->addHours(6));
    }
}
```

**Email Digest Job**
```php
// app/Jobs/SendWeeklyDigestJob.php
class SendWeeklyDigestJob implements ShouldQueue
{
    public function handle(): void
    {
        User::chunk(100, function ($users) {
            foreach ($users as $user) {
                $summary = [
                    'completed' => $user->tasks()
                        ->where('status', 'completed')
                        ->whereBetween('updated_at', [now()->subWeek(), now()])
                        ->count(),
                    'pending' => $user->tasks()
                        ->where('status', 'pending')
                        ->count(),
                ];

                $user->notify(new WeeklyDigestNotification($summary));
            }
        });
    }
}
```

### Queue Workers Setup

**Supervisor Configuration**
```ini
[program:task-tracker-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/task-tracker/artisan queue:work redis --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=4
redirect_stderr=true
stdout_logfile=/var/www/task-tracker/storage/logs/worker.log
stopwaitsecs=3600
```

**Start Workers**
```bash
# Development
php artisan queue:work --queue=default,reminders,urgent

# Production (via Supervisor)
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start task-tracker-worker:*
```

### Horizon (Alternative to Supervisor)
```bash
composer require laravel/horizon
php artisan horizon:install
```

**Configure**
```php
// config/horizon.php
'environments' => [
    'production' => [
        'supervisor-1' => [
            'connection' => 'redis',
            'queue' => ['default', 'reminders', 'urgent'],
            'balance' => 'auto',
            'minProcesses' => 1,
            'maxProcesses' => 10,
            'tries' => 3,
            'timeout' => 300,
        ],
    ],
],
```

---

## 3. Database Query Optimization & Caching

### Query Optimization Strategies

**1. N+1 Query Prevention**

**Bad:**
```php
$tasks = Task::all();
foreach ($tasks as $task) {
    echo $task->user->name; // N+1 query
}
```

**Good:**
```php
$tasks = Task::with('user')->get(); // Single query with join
```

**2. Select Only Needed Columns**
```php
// Instead of
$tasks = Task::all();

// Use
$tasks = Task::select('id', 'title', 'status', 'due_date')->get();
```

**3. Use Chunking for Large Datasets**
```php
Task::chunk(1000, function ($tasks) {
    foreach ($tasks as $task) {
        // Process task
    }
});
```

**4. Query Scopes for Reusability**
```php
// In Task model
public function scopeActive($query)
{
    return $query->whereIn('status', ['pending', 'in_progress']);
}

public function scopeDueThisWeek($query)
{
    return $query->whereBetween('due_date', [now(), now()->addWeek()]);
}

// Usage
Task::active()->dueThisWeek()->get();
```

**5. Database Indexes**
```php
// In migration
Schema::table('tasks', function (Blueprint $table) {
    $table->index('user_id');
    $table->index('status');
    $table->index('due_date');
    $table->index(['user_id', 'status']); // Composite index
});
```

### Advanced Caching Strategies

**1. Model Caching**
```php
// Cache individual task
Cache::remember("task.{$id}", 3600, function () use ($id) {
    return Task::with('user')->find($id);
});

// Cache collection
Cache::remember("user.{$userId}.tasks.pending", 600, function () use ($userId) {
    return Task::where('user_id', $userId)
        ->where('status', 'pending')
        ->with('user')
        ->get();
});
```

**2. Cache Tags (Redis/Memcached)**
```php
Cache::tags(['tasks', "user:{$userId}"])->put("tasks.{$userId}", $tasks, 600);

// Flush all tasks for a user
Cache::tags("user:{$userId}")->flush();
```

**3. Query Result Caching**
```php
$tasks = Cache::remember('tasks.statistics', 3600, function () {
    return DB::table('tasks')
        ->select('status', DB::raw('count(*) as count'))
        ->groupBy('status')
        ->get();
});
```

**4. Cache Invalidation Service**
```php
<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;

class TaskCacheService
{
    public function invalidateTaskCache(int $taskId, int $userId): void
    {
        // Clear specific task cache
        Cache::forget("task.{$taskId}");
        
        // Clear user's task lists
        Cache::forget("user.{$userId}.tasks");
        Cache::forget("user.{$userId}.tasks.pending");
        Cache::forget("user.{$userId}.tasks.completed");
        
        // Clear statistics
        Cache::forget('tasks.statistics');
        
        // Using cache tags
        Cache::tags(['tasks', "user:{$userId}"])->flush();
    }

    public function warmCache(int $userId): void
    {
        // Pre-load frequently accessed data
        Cache::remember("user.{$userId}.tasks", 600, function () use ($userId) {
            return Task::where('user_id', $userId)->with('user')->get();
        });
    }
}
```

**5. Implement in Controller/Service**
```php
public function updateTask(Task $task, array $data): Task
{
    $task->update($data);
    
    // Invalidate related caches
    app(TaskCacheService::class)->invalidateTaskCache($task->id, $task->user_id);
    
    return $task->fresh();
}
```

### Database Connection Pooling

**PgBouncer for PostgreSQL** or **ProxySQL for MySQL**
- Reduces connection overhead
- Maintains persistent connections
- Handles connection pooling efficiently

### Read/Write Splitting
```php
// Automatic read/write splitting
Task::on('mysql::read')->where('status', 'pending')->get(); // Read replica
Task::on('mysql::write')->create($data); // Master
```

### Database Partitioning

**Time-based Partitioning**
```sql
-- Partition tasks table by year
CREATE TABLE tasks_2025 PARTITION OF tasks
    FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');
    
CREATE TABLE tasks_2026 PARTITION OF tasks
    FOR VALUES FROM ('2026-01-01') TO ('2027-01-01');
```

### Full-Text Search with Scout
```bash
composer require laravel/scout
composer require algolia/algoliasearch-client-php
```
```php
// In Task model
use Laravel\Scout\Searchable;

class Task extends Model
{
    use Searchable;

    public function toSearchableArray()
    {
        return [
            'title' => $this->title,
            'description' => $this->description,
        ];
    }
}

// Search
Task::search('bug fix')->get();
```

### Monitoring Query Performance
```php
// Enable query logging in development
DB::listen(function ($query) {
    if ($query->time > 100) { // Log queries > 100ms
        \Log::warning('Slow query detected', [
            'sql' => $query->sql,
            'bindings' => $query->bindings,
            'time' => $query->time
        ]);
    }
});
```

**Use Laravel Debugbar**
```bash
composer require barryvdh/laravel-debugbar --dev
```
