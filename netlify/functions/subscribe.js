const https = require('https');

exports.handler = async (event, context) => {
  // Handle CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST'
      }
    };
  }

  if (event.httpMethod !== 'POST') {
  return { 
    statusCode: 405, 
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    },
    body: 'Method Not Allowed' 
  };
}

  const { email, source } = JSON.parse(event.body);
  
  const data = JSON.stringify({
    email_address: email,
    status: 'subscribed',
    tags: [source],
    merge_fields: {
      SOURCE: source
    }
  });

  const options = {
    hostname: 'us7.api.mailchimp.com',
    port: 443,
    path: '/3.0/lists/9a75f93f21/members',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + Buffer.from('anystring:12f7b3d1fee5770c601ba23949480020-us7').toString('base64'),
      'User-Agent': 'ChatSherlock/1.0'
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let responseBody = '';
      
      res.on('data', (chunk) => {
        responseBody += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 400) {
          // 400 might mean already subscribed, which is ok
          resolve({
            statusCode: 200,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ success: true, message: 'Subscribed successfully' })
          });
        } else {
          resolve({
            statusCode: 500,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ error: 'Subscription failed' })
          });
        }
      });
    });

    req.on('error', (error) => {
      resolve({
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: error.message })
      });
    });

    req.write(data);
    req.end();
  });
};
