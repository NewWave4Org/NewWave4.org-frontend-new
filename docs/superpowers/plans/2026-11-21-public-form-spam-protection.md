# Public Form Spam Protection Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stop bot submissions of the three public mail forms (Contact us, Become a partner, Newsletter subscribe) from reaching the admin inbox or sending confirmation mail.

**Architecture:** The backend becomes the gate, because `/api/v1/mail/*` is public and bots post to it directly without loading the page. One `SpamGuard` service runs four checks on each public mail request, in this order: per-IP rate limit (429), hidden honeypot field (silent drop), Cloudflare Turnstile token (400) and a random-gibberish text heuristic (silent drop). The frontend renders the Turnstile widget and the honeypot field and sends both values. Turnstile ships disabled behind a flag, so the backend can deploy before the frontend.

**Tech Stack:** Backend: Spring Boot 3.4.3, Java 21, `RestClient`, JUnit 5, Mockito, `MockRestServiceServer`, `WebLayerTestBase` (`@WebMvcTest`). Frontend: Next.js 16, React 19, Formik and Yup, `@marsidev/react-turnstile`, Vitest and React Testing Library.

**Spec:** No separate spec. The design was agreed in conversation on 2026-11-21 and is captured in this plan's Architecture and Global Constraints sections.

**Repos:**
- Backend: `../NewWave4.org-backend-new` (tasks B1–B5). It is currently on `feature/auth-hardening`. Start a new branch, `feature/public-form-antispam`, from its integration branch.
- Frontend: this repo (tasks F1–F4). Branch `feature/public-form-antispam` from `development`, because PRs into `main` are only accepted from `development`.

Backend tasks come first, because the frontend sends fields the backend must already accept.

## Global Constraints

- The protected endpoints are exactly `POST /api/v1/mail/contact`, `POST /api/v1/mail/become-partner` and `POST /api/v1/mail/public/subscribe`. Confirm, unsubscribe and newsletter-send are not in scope.
- New request fields on all three DTOs: `turnstileToken` (string, optional) and `website` (string, optional; this is the honeypot).
- Responses:
  - **Silent drop** (honeypot filled, or gibberish): the same `200` and body the endpoint returns today. No email is sent.
  - **Turnstile failure:** `400` with the message `Captcha verification failed`.
  - **Rate limited:** `429` through the existing `TooManyRequestsException` handler.
- Rate limit: **5 requests per 10 minutes per client IP**, counted across all three endpoints together, held in memory per pod.
- Turnstile verify URL: `https://challenges.cloudflare.com/turnstile/v0/siteverify`. Send a form-encoded POST with `secret`, `response` and `remoteip`. Use a **3 s** timeout.
- If Cloudflare is unreachable (timeout, network error or 5xx), **fail open**: log at WARN and allow the request. If `success=false` or the token is blank, **fail closed** (400).
- Backend config (`application.yml`):
  `antispam.turnstile.enabled: ${TURNSTILE_ENABLED:false}`, `antispam.turnstile.secret: ${TURNSTILE_SECRET:}`, `antispam.client-ip-header: ${ANTISPAM_CLIENT_IP_HEADER:}`.
  Startup must **fail** when `enabled=true` and the secret is blank.
- Frontend runtime key: `NEXT_PUBLIC_TURNSTILE_SITE_KEY`. It is **optional**. When it is absent, no widget renders and no token is sent.
- Cloudflare's official test keys, for dev and tests:
  - Site key `1x00000000000000000000AA` always passes.
  - Secret `1x0000000000000000000000000000000AA` always passes.
  - Secret `2x0000000000000000000000000000000AA` always fails.
- Never put the Turnstile **secret** in the frontend or in `PUBLIC_ENV_KEYS`. Only the site key is public.

## Review Focus

1. **The old frontend sends the subscribe body as a bare JSON string** (`"a@b.com"`). Jackson currently maps it through `SubscribeRequestDto`'s single-argument constructor. Adding fields changes Lombok's `@AllArgsConstructor` and would break subscribe for the live frontend between the two deploys. The DTO must keep an explicit `SubscribeRequestDto(String email)` constructor annotated `@JsonCreator(mode = DELEGATING)`. Test: B5 `subscribeStillAcceptsBareEmailString`.
2. **Turnstile tokens are single-use.** After any submit (success or error) the widget must reset, or the user's second attempt fails with 400. Test: F2 `resetsWidgetWhenValueClearedAfterToken` and F4 `clearsTokenAfterFailedSubmit`.
3. **`ContactForm` recreates its `withFormik` wrapper on every render.** Keeping the token in `useState` on the outer component would remount the form, wipe what the user typed and re-trigger the widget. The token and honeypot must be **Formik values** set with `setFieldValue` from inside the inner form. Test: F4 `keepsTypedValuesWhenTokenArrives`.
4. **Real people must not be dropped by the gibberish rule.** Cyrillic names, short names, names like `McDonald`, normal sentences and single-word messages must all pass. Only long letter-only strings with several interior capitals are dropped. Test: B1 `realInputIsNotRandom` table.
5. **The client IP behind the ingress.** If `getRemoteAddr()` returns the ingress or Cloudflare IP, every visitor shares one rate-limit bucket and real users get 429. Tests: B2 `resolvesFromConfiguredHeader` and `fallsBackToRemoteAddr`. Rollout step R2 checks the real value on staging before production.

---

## Backend (`../NewWave4.org-backend-new`)

Package for all new classes: `org.newwave4api.email.antispam`. Tests go in the mirrored test package.

### Task B1: Gibberish detector

**Files:**
- Create: `src/main/java/org/newwave4api/email/antispam/GibberishDetector.java`
- Test: `src/test/java/org/newwave4api/email/antispam/GibberishDetectorTest.java`

**Interfaces:**
- Produces: `static boolean GibberishDetector.looksRandom(String s)` and `static boolean GibberishDetector.allRandom(List<String> texts)`.

- [ ] **Step 1: Write the failing tests.** Use `@ParameterizedTest` with `@ValueSource`.
  - `spamSamplesAreRandom`: `looksRandom` returns true for `solKhVWOrCYNOiNlcE`, `qWNzyFeJUblGtIUvRKwccaa`, `dUOZBsJsTTetNDAAEUvMEf` and `VThERaZXJCdGhBuKDC`.
  - `realInputIsNotRandom`: `looksRandom` returns false for `Volodymyr`, `McDonald`, `MacDonaldson`, `Олександр Петренко`, `iPhone`, `Hello, I would like to volunteer`, `Thanks!`, `NEWWAVE`, `""` and `null`.
  - `allRandomNeedsEveryNonBlankEntryRandom`:
    - `allRandom(List.of("solKhVWOrCYNOiNlcE", "qWNzyFeJUblGtIUvRKwccaa"))` returns true.
    - `allRandom(List.of("solKhVWOrCYNOiNlcE", "Hello there"))` returns false.
    - `allRandom(List.of())` returns false.
    - `allRandom(Arrays.asList("solKhVWOrCYNOiNlcE", null, ""))` returns true, because blanks are ignored.
- [ ] **Step 2: Run** `./mvnw test -Dtest=GibberishDetectorTest`. Expected: compilation FAIL.
- [ ] **Step 3: Implement.** `looksRandom` returns true only when the trimmed string has length 12–40, matches `^[A-Za-z]+$` (no spaces, digits or Cyrillic) and has **at least 3 uppercase letters after the first character**. `allRandom` removes null and blank entries, returns false if none remain, and otherwise requires `looksRandom` for every remaining entry.
- [ ] **Step 4: Run** the same command. Expected: PASS.
- [ ] **Step 5: Commit** `feat(antispam): add gibberish text detector`

### Task B2: Client IP resolver and rate limiter

**Files:**
- Create: `src/main/java/org/newwave4api/email/antispam/ClientIpResolver.java`
- Create: `src/main/java/org/newwave4api/email/antispam/ClientIpRateLimiter.java`
- Modify: `src/main/resources/application.yml` (add `server.forward-headers-strategy: native` and `antispam.client-ip-header`)
- Test: `src/test/java/org/newwave4api/email/antispam/ClientIpResolverTest.java`, `ClientIpRateLimiterTest.java`

**Interfaces:**
- Produces:
  - `@Component ClientIpResolver(@Value("${antispam.client-ip-header:}") String header)` with `String resolve(HttpServletRequest request)`.
  - `@Component ClientIpRateLimiter` with `boolean tryAcquire(String ip)`. Its package-private constructor is `ClientIpRateLimiter(Clock clock, int maxRequests, Duration window)`. The public `@Autowired` constructor uses `Clock.systemUTC(), 5, Duration.ofMinutes(10)`, the same split as `PartnerRequestThrottle`.

- [ ] **Step 1: Write the failing tests.** Use `MockHttpServletRequest` for the resolver, and a mutable test clock (or `Clock.offset` re-created per call) for the limiter.
  - `resolvesFromConfiguredHeader`: with header `CF-Connecting-IP`, a request carrying `CF-Connecting-IP: 203.0.113.7` and remoteAddr `10.0.0.5` resolves to `203.0.113.7`.
  - `fallsBackToRemoteAddr`: with a blank header setting, or the configured header absent from the request, the result is the remoteAddr.
  - `allowsFiveThenBlocks`: five `tryAcquire("1.2.3.4")` calls return true and the sixth returns false.
  - `ipsAreIndependent`: after `1.2.3.4` is blocked, `tryAcquire("5.6.7.8")` returns true.
  - `windowResets`: after the block, advancing the clock 10 minutes and 1 second makes `tryAcquire("1.2.3.4")` return true again.
- [ ] **Step 2: Run** `./mvnw test -Dtest='ClientIp*Test'`. Expected: compilation FAIL.
- [ ] **Step 3: Implement.** Use a fixed window per IP in a `ConcurrentHashMap<String, Window>`, updated with `compute` so it is thread-safe. Once the map holds more than 10,000 entries, remove expired windows before inserting, so memory stays bounded under a flood of distinct IPs. Add a class Javadoc saying the limit is per pod (N pods allow N×5) and is a backstop behind Turnstile, which is why it isn't stored in the database like `PartnerRequestThrottle`. In `application.yml`, set `server.forward-headers-strategy: native`. Tomcat's RemoteIpValve trusts private-range proxies by default, so `getRemoteAddr()` returns the client behind the ingress. Also add `antispam.client-ip-header: ${ANTISPAM_CLIENT_IP_HEADER:}`.
- [ ] **Step 4: Run** the same command. Expected: PASS.
- [ ] **Step 5: Commit** `feat(antispam): add per-IP rate limiter and client IP resolver`

### Task B3: Turnstile verifier

**Files:**
- Create: `src/main/java/org/newwave4api/email/antispam/TurnstileProperties.java`
- Create: `src/main/java/org/newwave4api/email/antispam/TurnstileVerifier.java`
- Modify: `src/main/resources/application.yml` (add the `antispam.turnstile.*` keys from Global Constraints)
- Test: `src/test/java/org/newwave4api/email/antispam/TurnstileVerifierTest.java`, `TurnstilePropertiesTest.java`

**Interfaces:**
- Produces:
  - `@ConfigurationProperties("antispam.turnstile") record TurnstileProperties(boolean enabled, String secret)`. Register it with `@EnableConfigurationProperties(TurnstileProperties.class)` on the verifier, or on a small config class in the same package. Validate in the record's compact constructor: throw `IllegalStateException("antispam.turnstile.enabled=true but TURNSTILE_SECRET is empty")` when `enabled` is true and `secret` is blank.
  - `@Component TurnstileVerifier(TurnstileProperties props, RestClient.Builder builder)` with `boolean verify(String token, String remoteIp)`. Build the client from the injected builder with a `SimpleClientHttpRequestFactory` using 3 s connect and read timeouts. Tests bind the same builder to `MockRestServiceServer`.

- [ ] **Step 1: Write the failing tests.** Bind `MockRestServiceServer` to the builder before constructing the verifier.
  - `disabledAllowsWithoutCalling`: `enabled=false` returns true, and the server expects no request.
  - `blankTokenRejectedWithoutCalling`: `enabled=true` with token `""` or `null` returns false, and no request is made.
  - `successTrue`: the server expects a POST to the siteverify URL whose form body contains `secret=s3cret`, `response=tok` and `remoteip=1.2.3.4`, and responds with `{"success":true}`. The result is true.
  - `successFalse`: the response `{"success":false,"error-codes":["invalid-input-response"]}` makes the result false.
  - `cloudflareDownFailsOpen`: the server responds `withServerError()`, and the result is true.
  - `TurnstilePropertiesTest.enabledWithoutSecretFailsFast`: `new TurnstileProperties(true, " ")` throws `IllegalStateException`.
- [ ] **Step 2: Run** `./mvnw test -Dtest='Turnstile*Test'`. Expected: compilation FAIL.
- [ ] **Step 3: Implement.** POST a `MultiValueMap` as `APPLICATION_FORM_URLENCODED` and read the response into a private record `SiteverifyResponse(boolean success, @JsonProperty("error-codes") List<String> errorCodes)`. Catch `RestClientException`, log at WARN without the token, and return true (fail open). On `success=false`, log the error codes at INFO.
- [ ] **Step 4: Run** the same command. Expected: PASS.
- [ ] **Step 5: Commit** `feat(antispam): verify Cloudflare Turnstile tokens`

### Task B4: SpamGuard orchestration

**Files:**
- Create: `src/main/java/org/newwave4api/email/antispam/SpamCheck.java`
- Create: `src/main/java/org/newwave4api/email/antispam/SpamGuard.java`
- Create: `src/main/java/org/newwave4api/common/exception/CaptchaFailedException.java`
- Modify: `src/main/java/org/newwave4api/common/exception/GlobalExceptionHandler.java` (add a 400 handler that follows the shape of the existing `TooManyRequestsException` handler at line 148)
- Test: `src/test/java/org/newwave4api/email/antispam/SpamGuardTest.java`

**Interfaces:**
- Consumes: `ClientIpRateLimiter.tryAcquire`, `TurnstileVerifier.verify` and `GibberishDetector.allRandom` from B1–B3.
- Produces:
  - `record SpamCheck(String clientIp, String honeypot, String turnstileToken, List<String> freeText)`.
  - `@Component SpamGuard` with `boolean shouldDrop(SpamCheck check)`. It returns true for a silent drop, throws `TooManyRequestsException("Too many requests, please try again later")` when rate limited, and throws `CaptchaFailedException("Captcha verification failed")` when Turnstile fails. It returns false when the request is clean.

- [ ] **Step 1: Write the failing tests.** Use a mocked limiter and verifier.
  - `rateLimitedThrows429First`: when the limiter returns false, `TooManyRequestsException` is thrown and the verifier is never called.
  - `honeypotFilledDropsWithoutCaptchaCall`: honeypot `"http://x"` returns true and the verifier is never called.
  - `captchaFailureThrows`: when the verifier returns false, `CaptchaFailedException` is thrown.
  - `gibberishDrops`: when the verifier returns true and freeText is `["solKhVWOrCYNOiNlcE", "qWNzyFeJUblGtIUvRKwccaa"]`, the result is true.
  - `cleanRequestPasses`: when the verifier returns true and freeText is `["Anna", "I'd like to help"]`, the result is false.
- [ ] **Step 2: Run** `./mvnw test -Dtest=SpamGuardTest`. Expected: compilation FAIL.
- [ ] **Step 3: Implement** the checks in the order the tests pin. Log each drop at INFO with the reason and the IP, but never the message body.
- [ ] **Step 4: Run** the same command. Expected: PASS.
- [ ] **Step 5: Commit** `feat(antispam): add SpamGuard combining rate limit, honeypot, captcha and gibberish checks`

### Task B5: Wire the guard into the three endpoints, plus Helm config

**Files:**
- Modify: `src/main/java/org/newwave4api/email/dto/ContactRequestDto.java`, `BecomePartnerRequestDto.java`, `SubscribeRequestDto.java`
- Modify: `src/main/java/org/newwave4api/email/controller/EmailController.java` (`sendContactEmail`, `becomePartnerRequest`, `subscribeRequest`)
- Modify: `src/test/java/org/newwave4api/common/web/WebLayerTestBase.java` (add a `@MockitoBean SpamGuard spamGuard`)
- Modify: every existing call site of these DTOs' all-args constructors (find them with `grep -rn "new ContactRequestDto(\|new BecomePartnerRequestDto(\|new SubscribeRequestDto(" src`)
- Modify: `newwave4-api-chart/values.yaml`, `templates/secret.yaml` and `templates/deployment.yaml` (add `TURNSTILE_ENABLED`, `TURNSTILE_SECRET` as a secret, and `ANTISPAM_CLIENT_IP_HEADER`, following the existing `secretKeyRef` entries around `deployment.yaml:75`)
- Test: `src/test/java/org/newwave4api/email/controller/EmailControllerAntiSpamTest.java` (extends `WebLayerTestBase`)

**Interfaces:**
- Consumes: `SpamGuard.shouldDrop(SpamCheck)` and `ClientIpResolver.resolve(HttpServletRequest)`.
- Produces: the JSON fields `turnstileToken` and `website` on all three request bodies. The frontend (F3) sends exactly these names.

- [ ] **Step 1: Write the failing tests.** These are MockMvc tests with `spamGuard` and `emailService` mocked.
  - `droppedContactReturns200WithoutSending`: `shouldDrop` returns true, so a POST to `/api/v1/mail/contact` with a valid body returns 200 with body `Email send successfully`, and `emailService` is never called.
  - `captchaFailureReturns400`: `shouldDrop` throws `CaptchaFailedException`, so a POST to `/api/v1/mail/become-partner` returns 400.
  - `rateLimitedReturns429`: `shouldDrop` throws `TooManyRequestsException`, so a POST to `/api/v1/mail/public/subscribe` returns 429.
  - `passesFieldsToGuard`: posting contact `{name:"Anna", email:"a@example.com", description:"hi", turnstileToken:"tok", website:""}` produces a captured `SpamCheck` with `turnstileToken=="tok"`, `honeypot==""` and `freeText==["Anna","hi"]`. For become-partner, freeText is `[description]`. For subscribe, it is `[]`.
  - `subscribeStillAcceptsBareEmailString`: posting the raw body `"a@example.com"` with `Content-Type: application/json` to `/api/v1/mail/public/subscribe` returns 200, and `emailService.subscribeRequest` receives email `a@example.com`.
- [ ] **Step 2: Run** `./mvnw test -Dtest=EmailControllerAntiSpamTest`. Expected: FAIL.
- [ ] **Step 3: Implement.**
  - Add `private String turnstileToken; private String website;` to the three DTOs.
  - On `SubscribeRequestDto`, add an explicit `@JsonCreator(mode = JsonCreator.Mode.DELEGATING) public SubscribeRequestDto(String email)` (Review Focus 1).
  - In each of the three controller methods, add an `HttpServletRequest` parameter, build a `SpamCheck`, and when `shouldDrop` is true return the method's existing 200 response without calling `emailService`.
  - Add the three variables to the Helm chart, with `TURNSTILE_ENABLED: "false"` as the default value.
- [ ] **Step 4: Run** `./mvnw test`. Expected: the full suite passes, including `PublicEndpointsTest` and `RequestValidationTest`.
- [ ] **Step 5: Commit** `feat(antispam): guard contact, partner and subscribe endpoints`

---

## Frontend (this repo)

### Task F1: Runtime site key

**Files:**
- Modify: `utils/runtime-env.ts` (`PUBLIC_ENV_KEYS`)
- Modify: `helm/frontend-chart/templates/secret.yaml:17` (the key list) and `helm/frontend-chart/values.yaml:175-177`
- Modify: `.env.example`, and the `CLAUDE.md` Environment block (document it as optional)
- Test: `utils/runtime-env.test.ts`, `utils/env.test.ts`

**Interfaces:**
- Produces: `getPublicEnv('NEXT_PUBLIC_TURNSTILE_SITE_KEY'): string | undefined`.

- [ ] **Step 1: Write the failing tests.**
  - In `runtime-env.test.ts`: `readServerPublicEnv({ NEXT_PUBLIC_TURNSTILE_SITE_KEY: '1x00000000000000000000AA' })` includes that key.
  - In `env.test.ts`: validation with the site key absent produces no error. The key is **not** added to `REQUIRED` in `utils/env.ts`.
- [ ] **Step 2: Run** `npx vitest run utils/runtime-env.test.ts utils/env.test.ts`. Expected: the first assertion FAILS.
- [ ] **Step 3: Implement.** Append the key to `PUBLIC_ENV_KEYS` and to the Helm list and values, set to `''`. Add `NEXT_PUBLIC_TURNSTILE_SITE_KEY=` to `.env.example` with a comment giving the test key.
- [ ] **Step 4: Run** the same command plus `npm run typecheck`. Expected: PASS, with 0 type errors.
- [ ] **Step 5: Commit** `feat(config): add optional runtime Turnstile site key`

### Task F2: TurnstileField and HoneypotField components

**Files:**
- Modify: `package.json` (`npm i @marsidev/react-turnstile`)
- Create: `components/shared/antispam/TurnstileField.tsx`
- Create: `components/shared/antispam/HoneypotField.tsx`
- Test: `components/shared/antispam/TurnstileField.test.tsx`, `HoneypotField.test.tsx`

**Interfaces:**
- Consumes: `getPublicEnv('NEXT_PUBLIC_TURNSTILE_SITE_KEY')` from F1.
- Produces:
  - `export const isTurnstileEnabled = (): boolean`.
  - `TurnstileField({ value, onChange }: { value: string; onChange: (token: string) => void })`. It renders nothing when the key is absent. It calls `onChange(token)` on success and `onChange('')` on expire or error. When `value` goes from non-empty to `''`, it calls the widget ref's `reset()`.
  - `HoneypotField({ value, onChange }: { value: string; onChange: React.ChangeEventHandler<HTMLInputElement> })`. It renders an `<input id="website" name="website">`.

- [ ] **Step 1: Write the failing tests.** Mock `@marsidev/react-turnstile` with a fake `Turnstile` that exposes `onSuccess` and `onExpire` through test buttons and records `reset` calls on a `forwardRef`.
  - `rendersNothingWithoutSiteKey`: an empty env gives an empty container.
  - `forwardsToken`: clicking the fake success button with `tok` calls `onChange` with `'tok'`.
  - `expiryClearsToken`: expiring calls `onChange` with `''`.
  - `resetsWidgetWhenValueClearedAfterToken`: rerendering with `value="tok"` and then `value=""` calls `reset` once.
  - `HoneypotField.isHiddenFromUsers`: the input has `tabIndex === -1` and `autoComplete === 'off'`, and its wrapper has `aria-hidden="true"`.
- [ ] **Step 2: Run** `npx vitest run components/shared/antispam`. Expected: FAIL.
- [ ] **Step 3: Implement.**
  - `TurnstileField` passes `options={{ appearance: 'interaction-only', size: 'flexible' }}`, so most visitors see nothing.
  - `HoneypotField` wraps the input in `<div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">` with a label reading `Leave this field empty`. Don't use `display:none`, because some bots skip fields hidden that way.
- [ ] **Step 4: Run** the same command. Expected: PASS.
- [ ] **Step 5: Commit** `feat(forms): add Turnstile and honeypot fields`

### Task F3: Forms API layer carries the anti-spam fields

**Files:**
- Modify: `utils/forms/type/interfaces.ts`, `type/forms-api.interface.ts`, `type/forms-services.interface.ts`, `forms-api.ts`, `forms-services.ts`
- Modify: `utils/http/enums/api-endpoint.ts` (add `CONTACT = 'mail/contact'`)
- Modify: `store/froms/action.ts` (`createSubscribe` argument)
- Test: `utils/forms/forms-api.test.ts`

**Interfaces:**
- Produces:
  - `interface AntiSpamFields { turnstileToken?: string; website?: string }`.
  - `interface ContactRequestDTO extends AntiSpamFields { name: string; email: string; phone?: string; description: string }`.
  - `BecomeParthnerRequestDTO extends AntiSpamFields`, with its existing fields kept.
  - `interface SubscribeRequestDTO extends AntiSpamFields { email: string }`.
  - `FormsAPI.sendContact(data: ContactRequestDTO)` and the matching `FormsServices.sendContact`.
  - `createSubscribe(data: SubscribeRequestDTO)` replaces `createSubscribe(email: string)` on the API, the service and the thunk.

- [ ] **Step 1: Write the failing tests** in `forms-api.test.ts`.
  - `sendContact posts through the public path`: `requestPublicMock` is called with `{ method: POST, url: 'mail/contact', body: { name, email, phone, description, turnstileToken: 'tok', website: '' } }`.
  - Replace the existing `createSubscribe posts the bare email` test with `createSubscribe posts an object body`, which expects `body: { email: 'reader@example.com', turnstileToken: 'tok', website: '' }`.
  - `becomeParthner forwards anti-spam fields`: the body includes `turnstileToken` and `website`.
- [ ] **Step 2: Run** `npx vitest run utils/forms`. Expected: FAIL.
- [ ] **Step 3: Implement** the signatures above. `sendContact` uses `requestPublic`, like its siblings.
- [ ] **Step 4: Run** `npx vitest run utils/forms && npm run typecheck`. Expected: PASS, with 0 errors. The thunk's callers in `SubscribeForm.tsx` will fail typecheck until F4. To keep each commit green, do the minimal one-line call-site update here: `createSubscribe({ email: values.email })`.
- [ ] **Step 5: Commit** `feat(forms): send anti-spam fields from the forms API`

### Task F4: Wire the fields into the three forms

**Files:**
- Modify: `components/contacts/ContactForm.tsx` (switch from `axiosOpenInstance.post('/mail/contact')` to `formsService.sendContact`)
- Modify: `components/home/PartnerForm.tsx`, `components/layout/SubscribeForm.tsx`
- Test: `components/contacts/ContactForm.test.tsx`, `components/layout/SubscribeForm.test.tsx`

**Interfaces:**
- Consumes: `TurnstileField`, `HoneypotField` and `isTurnstileEnabled` from F2. `formsService.sendContact`, the `becomeParthner` thunk and the `createSubscribe(SubscribeRequestDTO)` thunk from F3.

- [ ] **Step 1: Write the failing tests.** Mock `TurnstileField` with a component that has a `Get token` button calling `onChange('tok')`. Stub `next-intl`'s `useTranslations` the way existing component tests do (see `components/shared/Button.test.tsx`). For SubscribeForm, mock the store dispatch.
  - `ContactForm sends token and empty honeypot`: fill in name, email and message, click `Get token`, then submit. `sendContact` is called with `turnstileToken: 'tok'` and `website: ''`.
  - `keepsTypedValuesWhenTokenArrives`: type a name, click `Get token`, and the name input still holds the typed value (Review Focus 3).
  - `submitDisabledUntilToken`: with the site key set and no token, the Send button is disabled.
  - `clearsTokenAfterFailedSubmit`: when `sendContact` rejects, the mocked `TurnstileField` receives `value=""` after the submit (Review Focus 2).
  - `SubscribeForm sends object body`: dispatch receives `createSubscribe` with `{ email, turnstileToken: 'tok', website: '' }`.
- [ ] **Step 2: Run** `npx vitest run components/contacts components/layout`. Expected: FAIL.
- [ ] **Step 3: Implement.** In each form:
  - Add `turnstileToken: ''` and `website: ''` to `mapPropsToValues`.
  - Render `<HoneypotField>` and `<TurnstileField value={values.turnstileToken} onChange={t => setFieldValue('turnstileToken', t)} />` inside the inner form, above the submit button.
  - Disable submit when `isSubmitting || (isTurnstileEnabled() && !values.turnstileToken)`.
  - In `handleSubmit`'s `finally`, call `setFieldValue('turnstileToken', '')`.
  - Show a 400 `Captcha verification failed` like any other submit error. Add an i18n key `forms_errors.captcha_failed` to `i18n/messages/en.json` ("Verification failed, please try again") and to `ua.json` ("Перевірка не пройдена, спробуйте ще раз").
- [ ] **Step 4: Run** `npm run test && npm run typecheck`. Expected: the full suite passes, with 0 type errors.
- [ ] **Step 5: Manual check.** Run `npm run dev` with `NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA` against a local backend started with `TURNSTILE_ENABLED=true` and `TURNSTILE_SECRET=1x0000000000000000000000000000000AA`.
  - Submitting the contact form arrives in the inbox.
  - Restart the backend with the `2x…` secret, and the form shows the captcha error.
- [ ] **Step 6: Commit** `feat(forms): protect contact, partner and subscribe forms with Turnstile and honeypot`

---

## Rollout (manual, after both PRs merge)

- [ ] **R1. Create the Turnstile widget.** In the Cloudflare dashboard under Turnstile, add a widget in Managed mode. List the production domain(s), the staging domain and `localhost` as hostnames. Store the secret in the backend's secret store (`TURNSTILE_SECRET`) and the site key in the frontend's values (`NEXT_PUBLIC_TURNSTILE_SITE_KEY`).
- [ ] **R2. Deploy the backend to staging with `TURNSTILE_ENABLED=false`.** The honeypot, gibberish and rate-limit checks go live immediately, and the gibberish rule alone blocks the current spam campaign. A clean submission logs nothing at INFO, so trigger a honeypot drop from your own machine and read the IP from the INFO line `Spam guard: dropped reason=honeypot ip=...`:
  ```bash
  curl -X POST <public api host>/api/v1/mail/contact \
    -H 'Content-Type: application/json' \
    -d '{"name":"x","email":"you@example.com","description":"x","website":"x"}'
  ```
  The response is the normal `200` and no email is sent. Alternatively, raise `org.newwave4api.email.antispam.SpamGuard` to DEBUG: every check then logs `Anti-spam check from ip=...`.
  - The resolved IP must be your real public IP.
  - If it shows a Cloudflare or ingress address, set `ANTISPAM_CLIENT_IP_HEADER=CF-Connecting-IP` (behind Cloudflare) and re-check before production.
  - If the IP turns out to be shared (every visitor resolves to the same address) and the header cannot fix it yet, relax or switch off the rate limiter with `ANTISPAM_RATE_LIMIT_MAX_REQUESTS` (default `5`; `0` disables it) and `ANTISPAM_RATE_LIMIT_WINDOW` (default `10m`) so real users are not answered with 429.
- [ ] **R3. Deploy the frontend with the site key** to staging. The widget renders, and the forms still submit while the backend ignores the token.
- [ ] **R4. Set `TURNSTILE_ENABLED=true` on staging.** Test all three forms. Then use `curl` to POST to `/api/v1/mail/contact` without a token and confirm the response is 400.
- [ ] **R5. Repeat R2–R4 for production.** This goes through the manual `deploy-to-kubernetes.yml` dispatch with the released version.
- [ ] **R6. (Optional, no code) Add Cloudflare dashboard protection** if the API hostname is proxied through Cloudflare: turn on Bot Fight Mode and add a WAF rate-limit rule on `POST /api/v1/mail/*`.

## Deliberately out of scope

- **Time-to-submit check.** It's forgeable by bots that call the API directly, and Turnstile already covers headless browsers.
- **A database-backed IP limit across pods.** Turnstile is the main gate, and the in-memory limit is only a backstop.
- **Changing the existing per-email 5-minute throttles** on partner and subscribe. They stay as they are.
