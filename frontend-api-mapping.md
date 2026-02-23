# Frontend Screen → API Mapping

Maps every frontend screen in `vibe-sport-booking-platform` to the required Backend APIs and Socket.IO events based on `vibe-sport/docs`.

---

## 1. Login (`app/login/page.tsx`)

### REST APIs
- **POST** `/auth/login` — `{ phoneOrEmail, otpOrPassword }` → `{ token, user }`

### Socket
- Connect App gateway with `?token=<jwt>` after successful login.

---

## 2. Register (`app/register/page.tsx`)

### REST APIs
- **POST** `/auth/register` — `{ fullName, email, phone, password }` → `{ token, user }`

---

## 3. Venue Search (`app/venues/page.tsx`)

### REST APIs
- **GET** `/venues?q=...&sportType=...&lat=...&lng=...&radiusKm=...&page=...&size=...`

---

## 4. Venue Details (`app/venues/[id]/page.tsx`)

### REST APIs
- **GET** `/venues/{venueId}` → `VenueDetailResponseDto`
- **GET** `/venues/{venueId}/reviews?page=...&size=...` → `VenueReviewsResponseDto`
- **GET** `/venues/{venueId}/favorite/status` → `{ isFavorite }`
- **POST** `/venues/{venueId}/favorite/toggle` → `{ isFavorite }`

---

## 5. Booking (`app/booking/page.tsx`)

### REST APIs
- **GET** `/courts/{courtId}/availability?date=YYYY-MM-DD`
- **POST** `/bookings/hold` — `{ courtId, startTime, endTime }`
- **POST** `/bookings/{bookingId}/confirm` — `{ note? }`

### Socket (App Gateway `/`)
- **Room:** `venue_{venueId}`
- **Join:** `join_venue` → **Listen:** `slot.locked`, `slot.released`, `slot.updated`

---

## 6. My Bookings (`app/bookings/page.tsx`)

### REST APIs
- **GET** `/me/bookings?status=...&from=...&to=...&page=...&size=...`
- **POST** `/bookings/{bookingId}/cancel` — `{ reason }`
- **POST** `/bookings/{bookingId}/review` — `{ rating, comment }`

---

## 7. Owner Dashboard (`app/dashboard/page.tsx`)

### REST APIs
- **GET** `/owner/analytics/{venueId}?from=...&to=...`
- **GET** `/owner/bookings?courtId=...&status=...&from=...&to=...&page=...&size=...`
- **POST** `/owner/bookings/{bookingId}/cancel` — `{ reason }`

---

## 8. Profile (`app/profile/page.tsx`)

### REST APIs
- **PATCH** `/users/profile` — `{ fullName?, avatarUrl? }`
- **POST** `/users/change-password` — `{ currentPassword, newPassword }`
- **POST** `/users/forgot-password/request` — `{ emailOrPhone }`
- **POST** `/users/forgot-password/verify` — `{ emailOrPhone, otp, newPassword }`
- **POST** `/users/logout`

---

## 9. Chat (future screen)

### REST APIs
- **GET** `/conversations?page=...&size=...`
- **GET** `/conversations/{conversationId}`
- **GET** `/conversations/{conversationId}/messages?page=...&size=...`
- **POST** `/conversations/{conversationId}/messages` — `{ content }`
- **POST** `/conversations/booking/{bookingId}` — Start booking chat
- **POST** `/conversations/venue/{venueId}/inquiry` — Start venue inquiry

### Socket (Chat Gateway `/chat`)
- **Join:** `join_conversation` `{ conversationId, userId }`
- **Leave:** `leave_conversation` `{ conversationId }`
- **Send:** `send_message` `{ conversationId, userId, content }`
- **Typing:** `typing` `{ conversationId, userId, isTyping }`
- **Listen:** `new_message`, `user_typing`

---

## 10. Favorites (future screen)

### REST APIs
- **POST** `/venues/{venueId}/favorite` — Add
- **DELETE** `/venues/{venueId}/favorite` — Remove
- **POST** `/venues/{venueId}/favorite/toggle`
- **GET** `/venues/{venueId}/favorite/status`
- **GET** `/favorites?page=...&size=...`

---

## 11. Upload (used in Profile, Reviews, Chat)

### REST APIs
- **POST** `/upload/image` — `multipart/form-data`
- **POST** `/upload/images` — Multiple files
- **POST** `/upload/video`
- **POST** `/upload/file`
- **DELETE** `/upload?publicId=...`
