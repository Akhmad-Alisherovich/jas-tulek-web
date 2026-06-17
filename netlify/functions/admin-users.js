const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { access_token, action, target_id, target_role, target_ai } = JSON.parse(event.body);
    
    if (!access_token) {
      return { statusCode: 400, body: JSON.stringify({ error: 'No access token provided' }) };
    }

    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify token
    const { data: { user }, error: authError } = await supabase.auth.getUser(access_token);
    if (authError || !user) {
      return { statusCode: 401, body: JSON.stringify({ error: 'Invalid token' }) };
    }

    // Check if the user is actually an admin
    const { data: callerProfile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (!callerProfile || callerProfile.role !== 'admin') {
      return { statusCode: 403, body: JSON.stringify({ error: 'Forbidden. Admin only.' }) };
    }

    if (action === 'get_all') {
      const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      return { statusCode: 200, body: JSON.stringify({ data, error }) };
    } 
    else if (action === 'toggle_ai') {
      const { error } = await supabase.from('profiles').update({ has_ai_access: target_ai }).eq('id', target_id);
      return { statusCode: 200, body: JSON.stringify({ error }) };
    }
    else if (action === 'toggle_role') {
      const { error } = await supabase.from('profiles').update({ role: target_role }).eq('id', target_id);
      return { statusCode: 200, body: JSON.stringify({ error }) };
    }

    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid action' }) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
