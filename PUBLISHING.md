# Publishing Guide for Markdown Editor Styler

## Prerequisites Completed ✅

- [x] Package.json configured
- [x] README.md created
- [x] CHANGELOG.md created
- [x] Icon added
- [x] Extension packaged (.vsix file)
- [x] Publisher account created

## Next Steps to Publish

### Option 1: Manual Upload (Easiest for First Time)

1. Go to https://marketplace.visualstudio.com/manage
2. Sign in with your Microsoft account
3. Click "New publisher" if you haven't created "suskitech" yet
   - Publisher ID: `suskitech`
   - Publisher name: Your choice (e.g., "SuskiTech" or "Suski Technology")
4. Once publisher is created, click on it
5. Click "New extension" → "Visual Studio Code"
6. Drag and drop the file: `markdown-editor-styler-X.X.X.vsix`
7. Your extension is now published!

### Option 2: Command Line Publishing

1. **Create a Personal Access Token (PAT)**:
   - Go to https://dev.azure.com/
   - Click on User Settings (top right) → Personal Access Tokens
   - Click "New Token"
   - Name: "vsce-publishing" (or whatever you prefer)
   - Organization: All accessible organizations
   - Expiration: Choose your preference (90 days, 1 year, etc.)
   - Scopes: Click "Show all scopes" → Check "Marketplace" → Check "Manage"
   - Click "Create"
   - **IMPORTANT**: Copy the token NOW (you won't see it again!)

2. **Login with vsce**:

   ```bash
   npx vsce login suskitech
   ```

   - Enter your PAT when prompted

3. **Publish**:
   ```bash
   npm run publish
   ```

## Publishing Updates

When you make changes and want to publish a new version:

```bash
# For bug fixes (1.0.0 → 1.0.1)
npm run publish:patch

# For new features (1.0.0 → 1.1.0)
npm run publish:minor

# For breaking changes (1.0.0 → 2.0.0)
npm run publish:major
```

These commands will automatically:

1. Increment the version in package.json
2. Create a git tag
3. Package the extension
4. Publish to the marketplace

## After Publishing

1. Your extension will be available at:
   `https://marketplace.visualstudio.com/items?itemName=suskitech.markdown-editor-styler`

2. Users can install it by searching "Markdown Editor Styler" in VS Code

3. Consider adding:
   - Screenshots to your marketplace listing (edit in marketplace manager)
   - A GIF demo showing the extension in action
   - Links to your repository

## Tips

- Always test your extension before publishing (press F5 in VS Code)
- Update CHANGELOG.md with each release
- Keep your README.md up to date
- Respond to user reviews and issues on GitHub
