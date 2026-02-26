export async function up(supabase: any) {
    // Create the table for tracking Google Indexing logs
    const { error } = await supabase.rpc('exec_sql', {
        sql_query: `
            CREATE TABLE IF NOT EXISTS public.google_indexing_logs (
                id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
                url text NOT NULL UNIQUE,
                status text NOT NULL,
                error_message text,
                created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
                updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
            );
        `
    });

    if (error) {
        console.error("Migration failed:", error);
    } else {
        console.log("Migration successful");
    }
}
