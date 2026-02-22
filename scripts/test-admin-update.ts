import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

async function testAdminUpdate() {
    const id = '54640796-0343-49e4-9925-ad40172a21a2'
    const newVal = 50; // Set to 50 for real this time

    console.log(`Attempting to update dist_home to ${newVal} for ID: ${id} using SERVICE_ROLE`)

    const { data, error, status } = await supabaseAdmin
        .from('predictions')
        .update({ dist_home: newVal })
        .eq('id', id)
        .select()

    console.log('Status:', status)
    if (error) {
        console.error('Error:', error.message)
    } else {
        console.log('Updated Rows:', data?.length)
        if (data && data.length > 0) {
            console.log('Value now in DB:', data[0].dist_home)
        }
    }
}

testAdminUpdate()
