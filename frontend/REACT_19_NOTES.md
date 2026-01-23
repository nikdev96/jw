# React 19 + Testing Library Compatibility

## Current Status
The project uses React 19 with Testing Library. Due to React 19 being very new, there are some peer dependency conflicts.

## Temporary Solution
Using `--legacy-peer-deps` flag for npm installs:

```bash
npm install --legacy-peer-deps
```

## Why This Works
- React 19 is not yet officially supported by all Testing Library packages
- Legacy peer deps allows installation with mismatched peer dependencies
- This is a temporary, safe solution

## Long-term Solution
When Testing Library releases React 19 compatible versions:
1. Remove `--legacy-peer-deps` from package.json scripts
2. Update to latest Testing Library versions
3. Run `npm install` without legacy flag

## Monitoring
Check Testing Library releases for React 19 support:
- https://github.com/testing-library/react-testing-library/releases
- https://github.com/testing-library/jest-dom/releases

## Current Versions
- React: 19.2.0 (latest)
- @testing-library/react: 15.0.7 (requires React 18)
- Jest: 29.7.0 (compatible)

This setup is safe and functional for development and production.