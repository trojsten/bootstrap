---
layout: docs
title: RTL
description: Learn how to use Bootstrap on pages using right-to-left language.
group: getting-started
toc: true
---

## How to use

There's no major difference with our [introduction]({{< docsref "/getting-started/introduction" >}}) guide. Ensure to set `dir="rtl"` and an appropriate `lang` attribute on `html`, as well as using our RTL compiled CSS.

### Starter template

{{< highlight html >}}
<!doctype html>
<html lang="ar" dir="rtl">
  <head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="{{< param "cdn.css_rtl" >}}" integrity="{{< param "cdn.css_rtl_hash" >}}" crossorigin="anonymous">

    <title>مرحبا بالعالم!</title>
  </head>
  <body>
    <h1>مرحبا بالعالم!</h1>

    <!-- Optional JavaScript -->
    <!-- Popper.js first, then Bootstrap JS -->
    <script src="{{< param "cdn.popper" >}}" integrity="{{< param "cdn.popper_hash" >}}" crossorigin="anonymous"></script>
    <script src="{{< param "cdn.js" >}}" integrity="{{< param "cdn.js_hash" >}}" crossorigin="anonymous"></script>
  </body>
</html>
{{< /highlight >}}

## Customize from sources

When it comes to [customization]({{< docsref "/customize/sass" >}}), the preferred way is to take advantage of variables, maps and mixins. It remains accurate for RTL version — even if it's post-processed from the compiled files — thanks to [how RTLCSS works](https://rtlcss.com/learn/getting-started/why-rtlcss/).

### Different value for RTL

Using [RTLCSS value directives](https://rtlcss.com/learn/usage-guide/value-directives/), you can make a variable output a different value for RTL.

For example to decrease the weight for `$font-weight-bold` throughout the codebase, you may use the `/*rtl: {value}*/` syntax:

{{< highlight scss >}}
$font-weight-bold: 700 #{/*rtl:600*/} !default;
{{< /highlight >}}

Output:

{{< highlight css >}}
/* bootstrap.css */
dt {
  font-weight: 700 /*rtl:600*/;
}

/* bootstrap.rtl.css */
dt {
  font-weight: 600;
}
{{< /highlight >}}

### Alternative font stack

In the case you're using a custom font, be aware that not all fonts support non-latin alphabet.

For example, if you use [Neue Helvetica®](https://www.linotype.com/1245395/neue-helvetica-family.html) as your main font (like numerous brands out there), you'd notice it has [a family dedicated to Arabic](https://www.linotype.com/670004/neue-helvetica-arabic-family.html). In order to switch from pan-european to arabic family, you can use the `/*rtl:insert: {value}*/` in your font-stack — assuming your `@font-face` rules define `Helvetica Neue Webfont` and `Helvetica Neue Arabic Webfont` as `font-family`:

{{< highlight scss >}}
$font-family-sans-serif:
  Helvetica Neue #{"/*rtl:insert:Arabic*/"} Webfont,
  // Safari for macOS and iOS (San Francisco)
  -apple-system,
  // Chrome < 56 for macOS (San Francisco)
  BlinkMacSystemFont,
  // Windows
  "Segoe UI",
  // Android
  Roboto,
  // Basic web fallback
  Arial,
  // Linux
  "Noto Sans",
  // Sans serif fallback
  sans-serif,
  // Emoji fonts
  "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" !default;
{{< /highlight >}}

## The breadcrumb case

At the time of writing, the [breadcrumb]({{< docsref "/components/breadcrumb" >}}/#changing-the-separator) separator is the only edge case Bootstrap cannot handle automagically:

- our current separator is a `/` — a single character which doesn't require to be flipped in RTL,
- the separator is customizable using the `$breadcrumb-divider` variable to use another character, or an embedded SVG icon,
- if you use a bidirectional character (like a chevron `>`), browsers will likely flip it by themselves.

Since our default does not require flipping, Bootstrap does not handle flipping the breadcrumb separator — you might have to.

## Additional resources

- [RTLCSS](https://rtlcss.com/)
- [RTL Styling 101](https://rtlstyling.com/posts/rtl-styling)
