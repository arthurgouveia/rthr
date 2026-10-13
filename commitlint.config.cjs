module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // config-conventional ships 100; the convention here is 72.
    'header-max-length': [2, 'always', 72],
    // Single line only: no body, no extended description. This is also what keeps
    // `Co-Authored-By:` and other attribution trailers out: git parses a trailing
    // `Key: value` block as the footer, so both are rejected here.
    'body-empty': [2, 'always'],
    'footer-empty': [2, 'always'],
  },
};
