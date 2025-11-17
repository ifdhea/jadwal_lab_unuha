<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class MigrateFotoProfilToPublic extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'storage:migrate-photos';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Migrate foto profil from storage/app/public to public/uploads';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Migrating foto profil from storage to public/uploads...');
        
        $users = \App\Models\User::whereNotNull('foto_profil')->get();
        
        if ($users->isEmpty()) {
            $this->info('No users with foto_profil found.');
            return 0;
        }
        
        $migrated = 0;
        $failed = 0;
        
        foreach ($users as $user) {
            try {
                $oldPath = $user->foto_profil;
                
                // Check if file exists in old location
                if (\Storage::disk('public')->exists($oldPath)) {
                    $fileContents = \Storage::disk('public')->get($oldPath);
                    
                    // Save to new location
                    \Storage::disk('public_uploads')->put($oldPath, $fileContents);
                    
                    // Verify the file was created
                    if (\Storage::disk('public_uploads')->exists($oldPath)) {
                        $this->line("✓ Migrated: {$user->name} ({$oldPath})");
                        $migrated++;
                        
                        // Optional: Delete from old location after successful migration
                        // \Storage::disk('public')->delete($oldPath);
                    } else {
                        $this->error("✗ Failed to migrate: {$user->name} ({$oldPath})");
                        $failed++;
                    }
                } else {
                    $this->warn("⚠ File not found in storage: {$user->name} ({$oldPath})");
                }
            } catch (\Exception $e) {
                $this->error("✗ Error migrating {$user->name}: " . $e->getMessage());
                $failed++;
            }
        }
        
        $this->newLine();
        $this->info("Migration completed!");
        $this->info("Migrated: {$migrated}");
        if ($failed > 0) {
            $this->warn("Failed: {$failed}");
        }
        
        return 0;
    }
}
