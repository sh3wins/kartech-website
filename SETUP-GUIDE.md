# Kartech website — setup guide

## What's in this folder

| File | What it is |
|---|---|
| `index.html` | The home page: what we make, shop, cart, quote form, visit, order tracking, footer |
| `story.html` | Our story: history, the workshop, the people, materials and craft |
| `css/styles.css` | All the website styling |
| `js/settings.js` | **The file you edit**: WhatsApp number, email, products, prices, photos, Supabase keys |
| `js/main.js` | All the website behaviour (animations, cart, checkout, tracking, forms) |
| `admin.html` + `css/admin.css` + `js/admin.js` | Kartech's private admin page for orders and custom requests |
| `supabase/setup.sql` | Creates the database. You run it once. |
| `photos/` | Put your photos here |

The site works **before** Supabase is set up. Orders and requests go through WhatsApp.
Once you finish the steps below, everything saves to the database too.

---

## Part 1 — Set up the database (Supabase)

### Step 1: Create the project
1. Go to **supabase.com** and sign up (free).
2. Click **New project**.
3. Name it `kartech`, create a strong database password, and save it somewhere safe.
4. Pick the region closest to Kenya.
5. Click **Create new project** and wait a minute or two.

### Step 2: Create the tables
1. In the left menu, open **SQL Editor**.
2. Click **New query**.
3. Open `supabase/setup.sql`, copy **everything**, and paste it in.
4. Click **Run**. You should see "Success". (Notices saying "does not exist, skipping" are normal.)

### Step 3: Copy your keys
1. Open **Project Settings → API Keys** (on some dashboards it's **Settings → API**).
2. Copy the **Project URL** (looks like `https://abcdefgh.supabase.co`).
3. Copy the **anon / public** key (on newer dashboards it's called the **publishable** key).
   - ⚠️ Never use the **service_role** or **secret** key on the website.

### Step 4: Paste the keys into the website
Open `js/settings.js` and fill in:
```js
supabaseUrl: 'https://abcdefgh.supabase.co',
supabaseKey: 'paste-the-anon-key-here'
```
Then open `js/admin.js` and paste the **same two values** at the top.

### Step 5: Create Kartech's admin login
1. In Supabase, open **Authentication → Users**.
2. Click **Add user → Create new user**.
3. Enter the email and password Kartech will use. Tick **Auto confirm user**.
4. Click **Create user**.

### Step 6: Make that login an admin
1. Go back to **SQL Editor → New query**.
2. Paste this, **change the email** to the one from Step 5, and click **Run**:
```sql
insert into public.admins (user_id)
select id from auth.users where email = 'your-email@example.com'
on conflict do nothing;
```
Repeat Steps 5–6 for anyone else who needs admin access.

### Step 7 (recommended): Turn off public sign-ups
Open **Authentication → Sign In / Providers** (or **Authentication → Settings**) and turn off
**Allow new users to sign up**. Even with this left on, strangers can't see orders,
because only people in the admins list can. Turning it off is extra safety.

---

## Part 2 — Fill in Kartech's details

Open `js/settings.js`:

1. **WhatsApp:** `whatsapp: '254712345678'` (country code, no + or spaces)
2. **Phone shown in footer:** `phoneDisplay: '+254 712 345 678'`
3. **Email:** `email: 'orders@...'`
4. **Products:** for each product change `name`, `price` and `images`. Shop tabs are: Furniture, Waiting seats, Catering equipment, Outdoor (set with `tags`). Anything in [brackets] is a placeholder to confirm with Kartech.
   - Price is a number with no commas: `price: 18500`. Use `price: null` for "Price on request".
   - Photos: put the file in `photos/`, then write `images: ['photos/executive-chair-1.jpg']`.
   - To add a product, copy a whole `{ ... },` block, paste it below, and change the `id`.

In `index.html` and `story.html`, fill in the `[bracketed]` text in the footer: addresses, opening hours and social links.
To add a workshop photo anywhere else, find its grey placeholder (`class="ph"`) and put
`<img src="photos/your-photo.jpg" alt="short description">` inside it.

---

## Part 3 — Put it online

The easiest free option is **Netlify Drop**:
1. Go to **app.netlify.com/drop**.
2. Drag the whole `kartech-website` folder onto the page.
3. You get a live link straight away. You can connect Kartech's own domain later.

Other options: Vercel, GitHub Pages, or upload the folder to Kartech's existing hosting (cPanel).

- The website is `yourdomain/`
- The admin page is `yourdomain/admin.html` (it's hidden from Google)

---

## Part 4 — Test it (5 minutes)

1. On the live site, add a product to the cart and place an order with your own phone number.
2. Open `admin.html`, sign in, and check the order is there.
3. Change its stage to **In the workshop**, type a message, and click **Save**.
4. On the website, go to **Track your order** and enter the order number and your phone.
   You should see the new stage and your message.
5. Send a custom request with a photo, and check the photo shows in the admin page.

---

## Day-to-day for Kartech

- **New orders and requests:** open `admin.html`. A green number on each tab shows how many are new. The page refreshes itself every minute.
- **Move an order forward:** click it, change the **Stage**, add a message if you like, then **Save**. The customer sees it straight away on the tracking page.
- **Contact the customer:** use **WhatsApp an update** (the message is pre-written) or **Call**.
- **Custom requests:** view photos and sketches, reply on WhatsApp or email, and keep private notes.

## Good to know

- **No payments are taken on the site.** Kartech confirms price, delivery and payment with the customer. M-Pesa can be added later (the Next.js upgrade).
- **Prices come from the website.** Kartech always confirms the final price before payment.
- **Free Supabase projects can pause** if nobody uses them for a while. Opening the dashboard wakes them up. The paid plan never pauses.
- **Instant alerts** (an email or SMS to Kartech the moment an order arrives) can be added later.
