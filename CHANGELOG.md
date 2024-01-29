# @fletch-tech/widget

## 1.0.0

### Major Changes

- 4cc9b7c: Release of version 1.0

  This is the first major release for the package.
  There are no breaking changes from the last released version,
  however, since we are going public, we are releasing v1.0

## 0.2.2

### Patch Changes

- 68d1a6c: fixed the css shorthand not working issue
- 1fc6593: Add default iframe styles

## 0.2.0

### Minor Changes

- 6ab0aac: convert implementation to class-based approach

  why:

  - lets the user initialize the widget instead of auto-initializing
    upon documentReady state
  - this also lets them wait for the prefill params and then initialize
    the app with that prefilled data (passed using queryParams in the options)

  other changes:

  - setup and use typescript for the implementation
