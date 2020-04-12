const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

async function ggsGetAuthorization() {
    try {
        // Load client secrets from a local file.
        const content =  fs.readFileSync('credentials.json')
        const credentials = JSON.parse(content);
        const {client_secret, client_id, redirect_uris} = credentials.installed;
        const oAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, redirect_uris[0]);
        const token = fs.readFileSync(TOKEN_PATH)
        oAuth2Client.setCredentials(JSON.parse(token));
        return oAuth2Client
    } catch (error) {
        return await getNewToken(oAuth2Client)
    }
}

async function getNewToken(oAuth2Client) {
    return new Promise((resolve, reject) => {
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
        });
        console.log('ggsGetAuthorization this app by visiting this url:', authUrl);
        const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        });
        rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error while trying to retrieve access token', err);
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
            if (err) return reject(err);
            console.log('Token stored to', TOKEN_PATH);
            });
            resolve(oAuth2Client)
        });
        });
    })
}

async function ggsListAllSchema(auth) {
    return new Promise((resolve, reject) => {
        const sheets = google.sheets({version: 'v4', auth});
        sheets.spreadsheets.values.get({
            spreadsheetId: '1KJAgd0uPmjE74crRXIdAm4L6Gj_7Pt02SYEr8a2m5dk',
            range: 'Db Document!A2:H',
        }, (err, res) => {
            if (err) reject(err);
            resolve(res)
        });
    })
}

const clearGGSheet = async (auth) => {
    return new Promise((resolve, reject) => {
        const sheets = google.sheets({version: 'v4', auth});
        sheets.spreadsheets.values.clear({
            spreadsheetId: '1KJAgd0uPmjE74crRXIdAm4L6Gj_7Pt02SYEr8a2m5dk',
            range: 'Db Document!A2:H',
        }, (err, res) => {
            if (err) reject(err);
            resolve(res)
        });
    })
}

async function ggsUpdateSchema (auth, range, values) {
    await clearGGSheet(auth)
    const sheets = google.sheets({version: 'v4', auth});
    const request = {
      // The ID of the spreadsheet to update.
      spreadsheetId: '1KJAgd0uPmjE74crRXIdAm4L6Gj_7Pt02SYEr8a2m5dk',  // TODO: Update placeholder value.
  
      // The A1 notation of the values to update.
      range: range,  // TODO: Update placeholder value.
  
      // How the input data should be interpreted.
      valueInputOption: 'USER_ENTERED',  // TODO: Update placeholder value.
  
      resource: {
        values: values
      },
  
      auth: auth,
    };
    sheets.spreadsheets.values.update(request, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
      })
  }

  module.exports = {
      ggsListAllSchema,
      ggsUpdateSchema,
      clearGGSheet,
      ggsGetAuthorization
  }