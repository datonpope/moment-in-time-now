import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://hjemyrrniopogkbbewnm.supabase.co',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, handle, password, content, momentId } = await req.json();
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Verify user token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      throw new Error('Invalid token');
    }

    if (action === 'verify') {
      // Verify Bluesky credentials
      const loginResponse = await fetch('https://bsky.social/xrpc/com.atproto.server.createSession', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: handle,
          password: password
        })
      });

      if (!loginResponse.ok) {
        const error = await loginResponse.json();
        throw new Error(error.message || 'Invalid Bluesky credentials');
      }

      const session = await loginResponse.json();
      
      return new Response(JSON.stringify({ 
        success: true, 
        did: session.did,
        handle: session.handle 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'post') {
      // First, authenticate with Bluesky
      const loginResponse = await fetch('https://bsky.social/xrpc/com.atproto.server.createSession', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: handle,
          password: password
        })
      });

      if (!loginResponse.ok) {
        throw new Error('Failed to authenticate with Bluesky');
      }

      const session = await loginResponse.json();
      
      // Create the post
      const postResponse = await fetch('https://bsky.social/xrpc/com.atproto.repo.createRecord', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.accessJwt}`
        },
        body: JSON.stringify({
          repo: session.did,
          collection: 'app.bsky.feed.post',
          record: {
            text: content,
            createdAt: new Date().toISOString(),
            $type: 'app.bsky.feed.post'
          }
        })
      });

      if (!postResponse.ok) {
        const error = await postResponse.json();
        throw new Error(error.message || 'Failed to post to Bluesky');
      }

      const postResult = await postResponse.json();
      const blueskyUri = postResult.uri;

      // Update the moment with Bluesky URI
      if (momentId) {
        const { error: updateError } = await supabase
          .from('moments')
          .update({ bluesky_uri: blueskyUri })
          .eq('id', momentId)
          .eq('user_id', user.id);

        if (updateError) {
          console.error('Failed to update moment with Bluesky URI:', updateError);
        }
      }

      return new Response(JSON.stringify({ 
        success: true, 
        uri: blueskyUri 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    throw new Error('Invalid action');

  } catch (error) {
    console.error('Bluesky function error:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'An error occurred' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});