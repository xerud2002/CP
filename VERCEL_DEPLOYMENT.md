# Deployment pe Vercel - Ghid Complet

## Pasul 1: Instalează Vercel CLI

```powershell
npm install -g vercel
```

## Pasul 2: Login în Vercel

```powershell
vercel login
```
- Alegi "Continue with GitHub" (recomandat)
- Sau folosești email

## Pasul 3: Deploy proiect (Prima dată)

```powershell
cd C:\Users\Cip\Desktop\CP
vercel
```

**Întrebări care apar:**
1. "Set up and deploy?" → **Yes**
2. "Which scope?" → **Alege contul tău**
3. "Link to existing project?" → **No**
4. "What's your project's name?" → **curierul-perfect** (sau lasă default)
5. "In which directory is your code located?" → **./** (lasă default)
6. "Want to modify settings?" → **No**

**IMPORTANT:** Notează URL-ul temporar: `curierul-perfect-xyz.vercel.app`

## Pasul 4: Adaugă variabile de mediu (.env.local)

Pe Vercel Dashboard:
1. Mergi la **Settings** → **Environment Variables**
2. Adaugă toate variabilele din `.env.local`:

```
NEXT_PUBLIC_FIREBASE_API_KEY=xxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxx
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxx
NEXT_PUBLIC_FIREBASE_APP_ID=xxx
```

3. Aplică la **Production, Preview, Development**

## Pasul 5: Configurează domeniul .COM

**Pe Vercel Dashboard:**
1. Mergi la **Settings** → **Domains**
2. Click **Add Domain**
3. Introdu: `curierulperfect.com`
4. Click **Add**
5. Vercel îți arată DNS records necesare

**Pe registrar-ul tău (unde ai cumpărat .com):**

Adaugă aceste DNS records:

```
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600

Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

**Sau mai simplu - Nameservers (Recomandat):**
```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

## Pasul 6: Configurează domeniul .RO

**Pe Vercel Dashboard:**
1. Tot în **Settings** → **Domains**
2. Click **Add Domain** din nou
3. Introdu: `curierulperfect.ro`
4. Click **Add**

**Pe registrar-ul tău (unde ai cumpărat .ro - probabil RoTLD/HostGate):**

Adaugă același DNS records:

```
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600

Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

## Pasul 7: Setează domeniul principal

Pe Vercel:
1. **Settings** → **Domains**
2. La `curierulperfect.com` → Click **Edit** → **Set as Primary**
3. Toate celelalte domenii vor redirecta automat aici:
   - `www.curierulperfect.com` → `curierulperfect.com`
   - `curierulperfect.ro` → `curierulperfect.com`
   - `www.curierulperfect.ro` → `curierulperfect.com`

## Pasul 8: Deploy viitor (După modificări)

```powershell
# Commit și push pe GitHub
git add .
git commit -m "Update"
git push

# Deploy automat după push DACĂ ai conectat GitHub
# SAU manual:
vercel --prod
```

## Pasul 9: Conectare automată cu GitHub (Recomandat)

1. Mergi pe Vercel Dashboard
2. **Settings** → **Git**
3. Click **Connect Git Repository**
4. Alegi **GitHub** → Autorizezi
5. Selectezi repo `xerud2002/CP`

**După aceasta:**
- Orice `git push` pe `main` = Deploy automat pe producție
- Pull requests = Preview deployments

## Verificare DNS (După 24h max)

```powershell
# Verifică .com
nslookup curierulperfect.com

# Verifică .ro  
nslookup curierulperfect.ro
```

Ambele ar trebui să arate IP-ul Vercel: `76.76.21.21`

## SSL Certificate (Automat)

Vercel configurează HTTPS automat după ce DNS-ul e verificat (5-60 minute).

Verifică: `https://curierulperfect.com` → Ar trebui să fie secure 🔒

## Troubleshooting

**"Domain not found":**
- Așteaptă 2-24h pentru propagare DNS
- Verifică că ai salvat DNS records corect la registrar

**"Invalid configuration":**
- Verifică că ai adăugat corect variabilele .env pe Vercel

**Deploy-ul eșuează:**
- Verifică că `npm run build` funcționează local
- Check logs: `vercel logs`

## Limita Vercel FREE:

- ✅ Bandwidth: 100GB/lună (suficient pentru 20 users/zi)
- ✅ Deployments: Nelimitate
- ✅ Domenii custom: Nelimitate
- ✅ SSL: Gratuit
- ⚠️ Serverless functions: 10 secunde timeout (OK pentru app-ul tău)

**Când trebuie să upgradeezi la Pro ($20/lună):**
- Când depășești 100GB bandwidth/lună (~50-100 users/zi activi)
- Când ai nevoie de Analytics

## Comenzi utile:

```powershell
# Vezi toate deploy-urile
vercel ls

# Vezi logs în timp real
vercel logs -f

# Rollback la deploy anterior
vercel rollback

# Șterge deploy vechi
vercel remove [deployment-url]
```

## Setup complet rezumat:

```powershell
# 1. Instalează Vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Deploy
cd C:\Users\Cip\Desktop\CP
vercel

# 4. Deploy pe producție (după test)
vercel --prod

# 5. Configurează DNS (vezi mai sus)
# 6. Gata! ✅
```

**Timpul total:** 30-45 minute (inclusiv așteptarea DNS)

---

Need help cu vreun pas specific? 🚀
