# Security, Authentication & Vulnerability Test Cases

> **Status**: `[VERIFIED]` • Production Baseline v3.0.0  
> **Security Focus**: Authentication, XSS Defense, Sandboxing & Protocol Enforcement  

---

## 1. Security Test Cases Matrix

| Test ID | Vulnerability / Threat Area | Test Procedure & Payload | Expected Defense Behavior | Status |
| :--- | :--- | :--- | :--- | :---: |
| **`SEC-01`** | Direct Launch Bypass | Navigate directly to `http://localhost:8089/main.html` without tokens. | Launch router immediately replaces URL to `index.html`. | 🟢 **PASS** |
| **`SEC-02`** | VIP URL Param Access | Navigate to `/main.html?vip=unlocked` or `?pin=2912`. | Access is granted; celebration welcome screen loads. | 🟢 **PASS** |
| **`SEC-03`** | Session Token Access | Set `sessionStorage.setItem('eternal_love_vip_unlocked', 'true')`. | Access is granted; user explores celebration. | 🟢 **PASS** |
| **`SEC-04`** | XSS in Guest Name | Submit name `<script>alert('XSS')</script>`. | Sanitized by `escapeHtml()`; rendered safely as text. | 🟢 **PASS** |
| **`SEC-05`** | XSS in Wish Message | Submit message `<img src=x onerror="alert(1)">`. | Sanitized by `escapeHtml()`; no script execution. | 🟢 **PASS** |
| **`SEC-06`** | Protocol Hijacking | Submit media link `javascript:alert(document.cookie)`. | Filtered out by `normalizeImageUrl()` / video normalizers. | 🟢 **PASS** |
| **`SEC-07`** | Invalid PIN Rejection | Enter `0000`, `1111`, `9999` on VIP virtual keypad. | PIN rejected, CSS shake animation triggers, error audio plays. | 🟢 **PASS** |
| **`SEC-08`** | Hardcoded Secret Audit | Scan all client JS/HTML files for private keys or DB passwords. | 0 private keys, passwords, or JWT secrets found. | 🟢 **PASS** |
| **`SEC-09`** | LocalStorage Sandboxing | Verify `localStorage` state isolation. | Origin-isolated to domain (`same-origin policy`). | 🟢 **PASS** |
| **`SEC-10`** | Drive Upload Isolation | Upload video file via `Code.gs`. | File placed strictly in designated folder with public view only. | 🟢 **PASS** |
