import { supabase } from './client';

async function testConnection() {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .limit(1);

        if (error) {
            console.log('Supabase connected successfully ✅');
            console.log('Database response:', error.message);
            return;
        }

        console.log('Supabase connected successfully ✅');
        console.log(data);
    } catch (err) {
        console.error('Supabase connection failed ❌');
        console.error(err);
    }
}

testConnection();