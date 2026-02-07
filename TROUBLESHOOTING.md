# 🔧 Responsive Design - Troubleshooting Guide

## Quick Troubleshooting Index

- [Build Issues](#build-issues)
- [Display Issues](#display-issues)
- [Interaction Issues](#interaction-issues)
- [Accessibility Issues](#accessibility-issues)
- [Performance Issues](#performance-issues)
- [Common Questions](#common-questions)

---

## 🚨 Build Issues

### Issue: "Module not found: styles-responsive"

**Symptoms:** Build fails with module not found error

**Solution:**

1. Ensure `src/styles-responsive.scss` exists
2. Verify the @use path is correct in `src/styles.scss`:
   ```scss
   @use "styles-responsive" as *;
   ```
3. Check file is in correct location: `src/styles-responsive.scss`
4. Rebuild: `npm run build`

---

### Issue: "Sass deprecation warning"

**Symptoms:** Build succeeds but shows deprecation warnings

**Solution:**

- Already fixed! Using `@use` instead of `@import`
- If still appears, ensure `src/styles.scss` uses:
  ```scss
  @use 'styles-responsive' as *;  ✅ Correct
  @import 'styles-responsive';     ❌ Deprecated
  ```

---

### Issue: "CSS syntax error in signin component"

**Symptoms:** Build fails with CSS syntax error

**Solution:**

- This has been fixed! The problematic selector was removed
- If it reappears, check `src/app/Auth/signin/signin.component.css`
- Remove any lines with `\.lg\:grid-cols-\[`
- Use Tailwind classes directly in HTML instead

---

## 📱 Display Issues

### Issue: Horizontal scrollbar on mobile

**Symptoms:** Page scrolls horizontally on mobile devices

**Causes & Solutions:**

1. **Element wider than viewport**

   ```css
   ❌ width: 100vw;  /* Includes scrollbars */
   ✅ width: 100%;   /* Respects viewport */
   ```

2. **Fixed width elements**

   ```css
   ❌ .card {
     width: 500px;
   } /* Fixed width on mobile */
   ✅ .card {
     width: 100%; /* Mobile */
     max-width: 500px; /* Desktop limit */
   }
   ```

3. **Overflow hidden removed accidentally**
   - Check `src/styles.scss` has:
     ```scss
     body {
       overflow-x: hidden;
     }
     ```

4. **Padding exceeding viewport**
   ```css
   ❌ padding: 0 200px;  /* Too large on mobile */
   ✅ padding: 0 1rem;   /* or use responsive classes */
     @media (min-width: 768px) {
       padding: 0 2rem;
     }
   ```

---

### Issue: Text is too small on mobile

**Symptoms:** Text requires zoom to read on mobile devices

**Solutions:**

1. **Use responsive text sizing**

   ```html
   ✅
   <p class="text-sm sm:text-base md:text-lg">❌</p>
   <p class="text-xs"></p>
   ```

2. **Check base font size**
   - Minimum 16px for body text on mobile
   - Form inputs should be 16px to prevent iOS zoom

3. **Adjust line-height**
   ```css
   line-height: 1.5; /* Good spacing for readability */
   ```

---

### Issue: Elements overlapping on mobile

**Symptoms:** Multiple elements stack and overlap instead of properly reflow

**Solutions:**

1. **Check z-index conflicts**
   - Navbar: `z-50`
   - Toast: `z-50`
   - Modals: higher values
   - Consider adjusting if overlap occurs

2. **Ensure proper grid/flex structure**

   ```html
   ✅
   <div class="grid grid-cols-1 sm:grid-cols-2">
     ✅
     <div class="flex flex-col sm:flex-row">
       ❌
       <div class="grid grid-cols-3"><!-- Always 3 columns --></div>
     </div>
   </div>
   ```

3. **Check position: fixed elements**
   - Navbar is `sticky top-0`
   - Toast is `fixed bottom-4 right-4`
   - These shouldn't overlap content

---

### Issue: Form inputs too small on mobile

**Symptoms:** Checkboxes, radio buttons, or inputs too small to tap

**Solutions:**

1. **Checkbox sizing**

   ```css
   ✅ width: 1.25rem;   height: 1.25rem;  /* Desktop */

   @media (max-width: 639px) {
     ✅ width: 1.125rem;  height: 1.125rem; /* Mobile */
     /* Or keep 1.25rem - both acceptable */
   }
   ❌ width: 12px;  height: 12px;  /* Too small */
   ```

2. **Button sizing**

   ```html
   ✅
   <button class="px-4 py-3 sm:px-6 sm:py-4">
     ✅ Button must be at least 44px × 44px ❌ <button class="px-1 py-1"><!-- Too small --></button>
   </button>
   ```

3. **Input padding**
   ```css
   ✅ padding: 12px;  /* At least 12px padding */
   ✅ min-height: 44px;  /* Touch target */
   ❌ padding: 2px;  /* Too small -->
   ```

---

## 🎯 Interaction Issues

### Issue: Hamburger menu doesn't open/close

**Symptoms:** Clicking hamburger menu does nothing

**Solutions:**

1. **Check if menu button is visible**
   - Should only show on screens < 768px (md breakpoint)
   - Use DevTools to check:
     ```css
     display: block; /* Should show on mobile */
     display: none; /* Should hide on desktop */
     ```

   ```

   ```

2. **Verify component logic**
   - Check `navbar.component.ts`:
     ```typescript
     toggleMobileMenu() {
       this.isMobileMenuOpen = !this.isMobileMenuOpen;
     }
     ```

3. **Check event binding**
   - HTML should have: `(click)="toggleMobileMenu()"`
   - Verify no typos in method name

4. **Browser console**
   - Open DevTools console (F12)
   - Check for JavaScript errors
   - Should see no errors when clicking menu

---

### Issue: Buttons don't respond to touch

**Symptoms:** Buttons are unresponsive or require multiple taps

**Solutions:**

1. **Check touch target size**
   - Minimum 44×44px recommended
   - Use DevTools to inspect element size
   - Apply `touch-target` class if needed:
     ```html
     <button class="touch-target">Tap me</button>
     ```

2. **Remove/disable mouse delay**
   - Ensure no `pointer-events: none` on parent
   - Check CSS for `user-select: none` conflicts

3. **Test on actual device**
   - Chrome DevTools touch simulation ≠ real touch
   - Use real device for final testing

4. **Verify not overlapped by transparent layer**
   - Check z-index of parent elements
   - Ensure no invisible overlays blocking clicks

---

### Issue: Hover effects don't appear on mobile

**Symptoms:** Buttons don't show hover state on touch devices

**This is expected behavior!**
Mobile devices don't have "hover" - use active states instead.

**Correct approach:**

```css
✅ @media (hover: hover) {
  button:hover {
    background-color: blue;
  }
}

button:active {
  transform: scale(0.98); /* Shows on touch */
}
```

---

## ♿ Accessibility Issues

### Issue: Focus outline not visible

**Symptoms:** Can't see where keyboard focus is

**Solutions:**

1. **Ensure focus-visible style exists**

   ```css
   ✅ button:focus-visible {
     outline: 2px solid #f43f5e;
     outline-offset: 2px;
   }
   ```

2. **Check CSS for outline: none**

   ```css
   ❌ button:focus {
     outline: none;
   } /* Removes focus */
   ✅ button:focus-visible {
     /* ... */
   } /* Shows focus */
   ```

3. **Test with Tab key**
   - Press Tab repeatedly
   - Focus ring should be visible on all interactive elements

---

### Issue: Form labels not associated with inputs

**Symptoms:** Screen readers don't announce labels

**Solutions:**

1. **Use proper label association**

   ```html
   ✅ <label for="email">Email</label>
   <input id="email" type="email" />

   ❌ <label>Email <input type="email" /></label>
   ```

2. **Ensure unique IDs**
   - Each input needs unique `id`
   - Label's `for` attribute must match input's `id`

3. **Use aria-label fallback**
   ```html
   <input aria-label="Email address" type="email" />
   ```

---

### Issue: Text contrast too low

**Symptoms:** Text is hard to read for people with visual impairments

**Solutions:**

1. **Check contrast ratio**
   - Use [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
   - Should be at least 4.5:1 for body text
   - 3:1 for large text (18pt+)

2. **Common fixes**

   ```css
   ✅ color: #1e293b;      /* Dark gray on white */
   ❌ color: #999999;      /* Medium gray - low contrast */
   ```

3. **Test with color blindness**
   - Use [ColorOracle](https://colororacle.org/)
   - Test as Deuteranopia, Protanopia, Tritanopia

---

## ⚡ Performance Issues

### Issue: Page loads slowly on mobile

**Symptoms:** Takes > 5 seconds to load on slow networks

**Solutions:**

1. **Optimize images**
   - Use responsive images with srcset
   - Use modern formats (WebP)
   - Compress size

2. **Check bundle size**

   ```bash
   npm run build -- --stats-json
   # Check the bundle size output
   ```

3. **Enable lazy loading**

   ```html
   <img src="..." loading="lazy" />
   ```

4. **Defer non-critical CSS**
   - Move non-critical styles to separate file
   - Load after critical CSS

---

### Issue: Animations are janky/stuttering

**Symptoms:** Animations don't run smoothly, especially on mobile

**Solutions:**

1. **Use GPU acceleration**

   ```css
   ✅ transform: translateY(-4px);
   ✅ opacity: 0.5;
   ❌ top: -4px;  /* Forces reflow */
   ❌ left: 0;    /* Forces reflow */
   ```

2. **Reduce animation complexity**

   ```css
   ✅ transition: opacity 0.3s ease;
   ✅ transition: transform 0.3s ease;
   ❌ transition: width 0.3s ease;  /* Heavy */
   ❌ transition: all 0.3s ease;    /* Animates everything */
   ```

3. **Use will-change sparingly**

   ```css
   ✅ .animated {
     will-change: transform;
   }
   ❌ body {
     will-change: all;
   } /* Bad practice */
   ```

4. **Respect reduced-motion preference**
   ```css
   @media (prefers-reduced-motion: reduce) {
     * {
       animation-duration: 0.01ms !important;
     }
   }
   ```

---

## ❓ Common Questions

### Q: Why is my button 44×44px but still feels small?

**A:** Consider visual padding:

```css
button {
  min-width: 44px;
  min-height: 44px;
  padding: 0.75rem; /* Add visual padding inside */
}
```

---

### Q: How do I test on real mobile devices?

**A:** Several options:

1. **Physical device** (best!)
   - Connect via USB
   - Use ADB for Android
   - Use Xcode for iOS

2. **Browser remote debugging**
   - Chrome: `chrome://inspect`
   - Firefox: Enable remote debugging
   - Safari: Safari → Develop menu

3. **Online testing**
   - [BrowserStack](https://www.browserstack.com/)
   - [Lambdatest](https://www.lambdatest.com/)

---

### Q: Should I test on tablets?

**A:** YES! Key viewport sizes to test:

- iPad (768px) - Common 2-column layout
- iPad Pro (1024px) - Larger tablet
- Galaxy Tab (800px+) - Android tablet

---

### Q: How do I handle notched phones?

**A:** Use safe area insets:

```css
padding-top: max(1rem, env(safe-area-inset-top));
padding-bottom: max(1rem, env(safe-area-inset-bottom));
padding-left: max(1rem, env(safe-area-inset-left));
padding-right: max(1rem, env(safe-area-inset-right));
```

This is already implemented! No additional changes needed.

---

### Q: What about print version?

**A:** Print styles included in responsive utilities:

```css
@media print {
  .no-print {
    display: none;
  }
  .avoid-break {
    page-break-inside: avoid;
  }
}
```

---

### Q: How do I debug on iOS?

**A:**

1. Connect Mac to iOS device
2. Open Safari
3. Go to: Safari → Develop → [Your Device]
4. Select your app's WebView
5. Gets Safari DevTools! Use as normal

---

### Q: Can I add dark mode?

**A:** Structure is ready! Add in `styles-responsive.scss`:

```scss
@media (prefers-color-scheme: dark) {
  body {
    background-color: #1e293b;
    color: #f1f5f9;
  }
}
```

---

### Q: How do I test keyboard navigation?

**A:** Simple! Just use Tab key:

1. Open app in browser
2. Press Tab repeatedly
3. Focus ring should move through interactive elements
4. Should follow logical tab order
5. No focus traps (can always Tab away)

---

### Q: Is this PWA-ready?

**A:** Partially! You can add:

- Service worker for offline support
- Web manifest for installability
- Push notifications
- Background sync

Currently it's a responsive web app. PWA features can be added later.

---

## 📞 Still Stuck?

1. **Check the documentation**
   - RESPONSIVE_QUICKSTART.md
   - RESPONSIVE_DESIGN_GUIDE.md
   - RESPONSIVE_TESTING_GUIDE.md

2. **Use browser DevTools**
   - Inspect element
   - Check computed styles
   - Use device toolbar for responsive testing

3. **Check browser console**
   - F12 → Console tab
   - Look for JavaScript errors
   - Fix errors first

4. **Test on minimal example**
   - Create simple test HTML
   - Add only necessary CSS
   - Verify behavior in isolation

5. **Search online**
   - Google specific error message
   - Check MDN documentation
   - Look at Tailwind CSS docs

---

## 🎓 Resources

- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [MDN Web Docs](https://developer.mozilla.org)
- [WebAIM Accessibility](https://webaim.org)
- [CSS Tricks](https://css-tricks.com)
- [Dev.to](https://dev.to) - Community guides

---

**Last Updated:** February 2026  
**Status:** Common issues documented and resolved
