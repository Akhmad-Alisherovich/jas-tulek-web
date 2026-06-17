const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { access_token } = JSON.parse(event.body);
    
    if (!access_token) {
      return { statusCode: 400, body: JSON.stringify({ error: 'No access token provided' }) };
    }

    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return { statusCode: 500, body: JSON.stringify({ error: 'Supabase credentials missing' }) };
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify the user's token
    const { data: { user }, error: authError } = await supabase.auth.getUser(access_token);
    
    if (authError || !user) {
      return { statusCode: 401, body: JSON.stringify({ error: 'Invalid token' }) };
    }

    // Fetch the profile bypassing RLS
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      // If profile doesn't exist, create it
      if (profileError.code === 'PGRST116') {
        const newProfile = {
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || user.email.split('@')[0],
          role: 'student',
          has_ai_access: false,
          created_at: new Date().toISOString()
        };
        const { data: insertedData } = await supabase.from('profiles').insert([newProfile]).select().single();
        return { statusCode: 200, body: JSON.stringify({ data: insertedData }) };
      }
      return { statusCode: 400, body: JSON.stringify({ error: profileError }) };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: profile })
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
