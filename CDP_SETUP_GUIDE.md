# 🚀 CDP (Coinbase Developer Platform) Setup Guide

## ✅ **What's Already Implemented:**

1. **Frontend Integration**: Updated `account.tsx` to use CDP session tokens
2. **Backend Endpoint**: Created `/api/cdp/session-token` endpoint
3. **Router Registration**: Added CDP router to your Express server
4. **Dependencies**: Installed `jsonwebtoken` and `@types/jsonwebtoken`

## 🔧 **What You Need to Configure:**

### **Step 1: Backend Environment Variables**

Create or update `MagicVidCreator/server/.env`:

```env
# --- CDP Configuration ---
CDP_ENV=sandbox                     # sandbox | production
CDP_KEY_ID=ak_sandbox_xxxxx         # from CDP Portal > Project > Secret API Keys
CDP_KEY_ALG=EdDSA                   # EdDSA (Ed25519) or ES256K
CDP_JWT_AUD=https://api.developer.coinbase.com
CDP_JWT_TTL_SECONDS=120             # short-lived JWT for server->CDP calls

# Choose ONE of the following for the private key:
# Option A: path to a PEM file (recommended)
CDP_PRIVATE_KEY_PATH=/secure/cdp_private_key.pem

# Option B: inline PEM (escape newlines as \n if kept in .env)
# CDP_PRIVATE_KEY_PEM="-----BEGIN PRIVATE KEY-----\nMII...\n-----END PRIVATE KEY-----\n"
```

### **Step 2: Get Your CDP Credentials**

1. **Go to**: [Coinbase Developer Portal](https://portal.developer.coinbase.com/)
2. **Create/Select**: Your project
3. **Navigate to**: Project > Secret API Keys
4. **Create**: New API key with appropriate permissions
5. **Download**: The private key file (PEM format)

### **Step 3: Place Your Private Key**

**Option A (Recommended) - File Path:**
```bash
# Create a secure directory
mkdir -p MagicVidCreator/server/secure
# Copy your private key
cp your_cdp_private_key.pem MagicVidCreator/server/secure/cdp_private_key.pem
# Set proper permissions
chmod 600 MagicVidCreator/server/secure/cdp_private_key.pem
```

**Option B - Inline in .env:**
```env
CDP_PRIVATE_KEY_PEM="-----BEGIN PRIVATE KEY-----\nMII...\n-----END PRIVATE KEY-----\n"
```

### **Step 4: Test the Integration**

1. **Start your server**: `npm run dev`
2. **Visit**: `/alpha/account` page
3. **Click**: "Buy Credits" button
4. **Check**: Browser console and server logs for any errors

## 🔍 **How It Works:**

### **Frontend Flow:**
1. User clicks "Buy Credits" button
2. Frontend calls `/api/cdp/session-token` with wallet info
3. Backend generates JWT and calls CDP API
4. CDP returns session token
5. Frontend opens `https://pay.coinbase.com/buy/select-asset?sessionToken=<token>`

### **Backend Flow:**
1. Receives request with wallet addresses and assets
2. Reads private key from file or environment
3. Creates JWT with CDP requirements
4. Calls CDP Session Token API
5. Returns session token to frontend

## 🚨 **Troubleshooting:**

### **Common Errors:**

1. **"CDP configuration incomplete"**
   - Check all environment variables are set
   - Verify private key path is correct

2. **"Unable to read CDP private key"**
   - Check file permissions
   - Verify file path is absolute or relative to server directory

3. **"CDP API error: 401"**
   - Verify your API key is correct
   - Check JWT algorithm matches your key type

4. **"CDP API error: 403"**
   - Check API key permissions
   - Verify project is in correct environment (sandbox/production)

### **Debug Steps:**

1. **Check server logs** for detailed error messages
2. **Verify environment variables** are loaded correctly
3. **Test JWT generation** independently
4. **Check CDP Portal** for API key status and permissions

## 📱 **Frontend Features:**

- ✅ **Guest Payments**: No wallet required
- ✅ **Wallet Integration**: Uses user's wallet if available
- ✅ **Credit Packages**: 100, 500, 1000 credits
- ✅ **Responsive Design**: Works on mobile and desktop
- ✅ **Error Handling**: User-friendly error messages

## 🔒 **Security Features:**

- ✅ **JWT Authentication**: Secure server-to-CDP communication
- ✅ **Short-lived Tokens**: 120-second expiration
- ✅ **Private Key Protection**: Secure file storage
- ✅ **Environment Variables**: No hardcoded secrets

## 🎯 **Next Steps:**

1. **Configure your CDP credentials** using the steps above
2. **Test the integration** with a small purchase
3. **Monitor server logs** for any issues
4. **Scale to production** when ready

## 📞 **Support:**

- **CDP Documentation**: [docs.cdp.coinbase.com](https://docs.cdp.coinbase.com/)
- **Coinbase Developer Portal**: [portal.developer.coinbase.com](https://portal.developer.coinbase.com/)
- **API Status**: Check CDP Portal for service status

---

**🎉 You're all set!** Once you configure the environment variables and place your private key, the CDP integration will work seamlessly with guest payments and wallet integration.
